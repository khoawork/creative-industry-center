import { useEffect, useId, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Eye, Plus, Save, Trash2, X } from 'lucide-react'
import AdminContactInbox from '../../components/Admin/AdminContactInbox.jsx'
import { FormBuilder } from '../../components/Admin/Base/index.js'
import ContactAvailabilityMessage from '../../components/Contact/ContactAvailabilityMessage.jsx'
import ContactForm from '../../components/Contact/ContactForm.jsx'
import { CONTACT_PAGE_ID, ContactAPI, contactError, contactValidationErrors, requireContactData } from '../../api/contactApi.js'
import { adminContactTabs, contactFixedFieldIds } from '../../config/Admin/adminContact.js'
import { adminButton, adminPrimaryButton } from '../../config/Admin/adminEvents.js'
import { adminMessages } from '../../data/Admin/adminDashboardData.js'
import { AdminPageHeader, AdminTabs, AdminToast } from '../../components/Admin/Common/index.js'

function clone(value) {
  return structuredClone(value)
}

function phoneHrefFromNumber(value) {
  const raw = String(value || '').replace(/^tel:/i, '').trim()
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return `tel:${raw.includes('+') ? '+' : ''}${digits}`
}

function externalHrefFromValue(value) {
  const href = String(value || '').trim()
  if (!href) return null
  return /^https?:\/\//i.test(href) ? href : `https://${href.replace(/^\/\//, '')}`
}

function isValidPhone(value) {
  const text = String(value || '').trim()
  const compact = text.replace(/[ ().-]/g, '')
  let balanced = 0
  for (const char of text) {
    if (char === '(') balanced++
    else if (char === ')') balanced--
    if (balanced < 0 || balanced > 1) return false
  }
  return balanced === 0 && /^[+0-9 ().-]+$/u.test(text) && /^\+?[0-9]{7,15}$/u.test(compact)
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(String(value || '').trim())
}

function parseWorkingTime(value) {
  const text = String(value || '')
  const range = text.trim().match(/^(\d{1,2}:\d{2})?\s*[–—-]\s*(\d{1,2}:\d{2})?$/u)
  const normalize = (time) => time ? time.padStart(5, '0') : ''
  if (range) return { start: normalize(range[1]), end: normalize(range[2]) }
  const single = text.trim().match(/^(\d{1,2}:\d{2})$/u)
  return { start: normalize(single?.[1]), end: '' }
}

function formatWorkingTime(start, end) {
  return start || end ? `${start} – ${end}` : ''
}

function ContactField({ label, value, onChange, type = 'text', multiline = false, required = false, placeholder = '', error = '', hideLabel = false, onClick, inputRef }) {
  const errorId = useId()
  const validationProps = { 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined }
  const inputClass = `${hideLabel ? '' : 'mt-2 '}w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2.5 text-sm text-(--admin-ink) placeholder:text-(--admin-ink)/50 focus:outline-2 focus:outline-(--admin-accent)`
  const input = multiline
    ? <textarea ref={inputRef} {...validationProps} aria-label={hideLabel ? label : undefined} rows={3} value={value || ''} onChange={(event) => onChange(event.target.value)} onClick={onClick} placeholder={placeholder} className={inputClass} />
    : <input ref={inputRef} {...validationProps} aria-label={hideLabel ? label : undefined} type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} onClick={onClick} placeholder={placeholder} className={inputClass} />
  return <div className="block space-y-2 text-sm font-semibold text-(--admin-heading)">
    {hideLabel ? input : <label className="block"><span>{label}{required && <span className="text-(--admin-accent)"> *</span>}</span>{input}</label>}
    {error && <p id={errorId} className="text-xs font-medium text-(--admin-heading)" role="alert">{error}</p>}
  </div>
}

function ContactMessageField({ label, value, onChange, placeholder, contact, error }) {
  const textareaRef = useRef(null)

  function insertToken(token) {
    const textarea = textareaRef.current
    if (!textarea) return
    const current = textarea.value
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const cursor = start + token.length
    onChange(current.slice(0, start) + token + current.slice(end))
    window.requestAnimationFrame(() => {
      if (textareaRef.current !== textarea) return
      textarea.focus({ preventScroll: true })
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  return <div className="space-y-2">
    <ContactField inputRef={textareaRef} label={label} required multiline value={value} onChange={onChange} placeholder={placeholder} error={error} />
    <div className="flex flex-wrap items-center gap-2 text-xs text-(--admin-ink)/70">
      <span>Chèn nhanh:</span>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => insertToken('{hotline: hotline}')} className="rounded-md border border-(--admin-border) px-2.5 py-1.5 font-semibold text-(--admin-heading) hover:bg-(--admin-background)">Số hotline</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => insertToken('{email: email Ban Thư ký}')} className="rounded-md border border-(--admin-border) px-2.5 py-1.5 font-semibold text-(--admin-heading) hover:bg-(--admin-background)">Email</button>
      <span>Dùng {'{hotline: Nhãn hiển thị}'} / {'{email: Nhãn hiển thị}'} để tự đặt chữ hiển thị; giá trị thật chỉ nằm trong liên kết.</span>
    </div>
    <div className="rounded-md bg-(--admin-background) px-3 py-2 text-xs leading-5 text-(--admin-ink)/70 [--contact-red:#710008] [--contact-gold:#d49520]">
      Xem trước: <ContactAvailabilityMessage message={value} contact={contact} />
    </div>
  </div>
}

export default function AdminContact() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabRefs = useRef([])
  const errorSummaryRef = useRef(null)
  const activeTab = adminContactTabs.find((tab) => tab.id === searchParams.get('tab')) ?? adminContactTabs[0]
  const [content, setContent] = useState(null)
  const [draftProps, setDraftProps] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [formErrors, setFormErrors] = useState({})

  const dirty = Boolean(content && draftProps && JSON.stringify(content.props) !== JSON.stringify(draftProps))
  const errorMessages = Object.values(formErrors).filter(Boolean)

  function showErrors(errors) {
    setFormErrors(errors)
    if (Object.keys(errors).length) {
      window.requestAnimationFrame(() => {
        errorSummaryRef.current?.focus()
        errorSummaryRef.current?.scrollIntoView({ block: 'nearest' })
      })
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    ContactAPI.getPage(CONTACT_PAGE_ID, { signal: controller.signal }).then((response) => {
      if (controller.signal.aborted) return
      const page = requireContactData(response)
      setContent(page)
      setDraftProps(clone(page.props))
    }).catch((error) => {
      if (!controller.signal.aborted) setLoadError(contactError(error))
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [attempt])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function selectTab(tab) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (tab.id === 'inbox') next.delete('tab')
      else next.set('tab', tab.id)
      return next
    })
  }

  function updateForm(next) {
    setDraftProps((current) => ({ ...current, form: { ...current.form, ...next } }))
    setToast(null)
  }

  function updateFixedFormField(fieldId, key, value) {
    setDraftProps((current) => ({
      ...current,
      form: {
        ...current.form,
        form_fields: current.form.form_fields.map((field) => field.id === fieldId ? { ...field, [key]: value } : field),
      },
    }))
    setToast(null)
  }

  function updateCategory(index, key, value) {
    setDraftProps((current) => ({
      ...current,
      contactCategories: (current.contactCategories || []).map((category, categoryIndex) => categoryIndex === index ? { ...category, [key]: value } : category),
    }))
    setToast(null)
  }

  function addCategory() {
    setDraftProps((current) => ({
      ...current,
      contactCategories: [...(current.contactCategories || []), { value: '', label: '' }],
    }))
    setToast(null)
  }

  function removeCategory(index) {
    setDraftProps((current) => ({
      ...current,
      contactCategories: (current.contactCategories || []).filter((_, categoryIndex) => categoryIndex !== index),
    }))
    setToast(null)
  }

  function updateExtraForm(next) {
    setDraftProps((current) => {
      const fixedFields = contactFixedFieldIds
        .map((fieldId) => current.form.form_fields.find((field) => field.id === fieldId))
        .filter(Boolean)
      return {
        ...current,
        form: { ...current.form, ...next, form_fields: [...fixedFields, ...(next.form_fields || [])] },
      }
    })
    setToast(null)
  }

  function updateContact(key, value) {
    setDraftProps((current) => ({ ...current, contact: { ...current.contact, [key]: value } }))
    setToast(null)
  }

  function updatePhoneField(index, key, value) {
    setDraftProps((current) => {
      const currentPhones = Array.isArray(current.contact.phones) && current.contact.phones.length
        ? current.contact.phones
        : [{ number: current.contact.phone || '', href: current.contact.phoneHref || '' }]
      const phones = currentPhones.map((phone, phoneIndex) => {
        if (phoneIndex !== index) return phone
        const nextPhone = { ...phone, [key]: value }
        if (key === 'number') nextPhone.href = phoneHrefFromNumber(value)
        return nextPhone
      })
      return {
        ...current,
        contact: { ...current.contact, phones, phone: phones[0]?.number || '', phoneHref: phones[0]?.href || '' },
      }
    })
    if (key === 'number') {
      setFormErrors((current) => {
        const next = { ...current }
        if (!String(value || '').trim() || isValidPhone(value)) delete next[`phone_${index}`]
        else next[`phone_${index}`] = 'Số điện thoại không đúng định dạng.'
        return next
      })
    }
    setToast(null)
  }

  function addPhone() {
    setDraftProps((current) => {
      const phones = Array.isArray(current.contact.phones) && current.contact.phones.length
        ? current.contact.phones
        : [{ number: current.contact.phone || '', href: current.contact.phoneHref || '' }]
      return {
        ...current,
        contact: { ...current.contact, phones: [...phones, { number: '', href: '' }] },
      }
    })
    setToast(null)
  }

  function removePhone(index) {
    setDraftProps((current) => {
      const phones = (current.contact.phones || []).filter((_, phoneIndex) => phoneIndex !== index)
      const firstPhone = phones[0] || { number: '', href: '' }
      return { ...current, contact: { ...current.contact, phones, phone: firstPhone.number, phoneHref: firstPhone.href } }
    })
    setToast(null)
  }

  function updateEmail(index, value) {
    setDraftProps((current) => ({
      ...current,
      contact: { ...current.contact, emails: (current.contact.emails || []).map((email, emailIndex) => emailIndex === index ? value : email) },
    }))
    setFormErrors((current) => {
      const next = { ...current }
      if (!String(value || '').trim() || isValidEmail(value)) delete next[`email_${index}`]
      else next[`email_${index}`] = 'Email không đúng định dạng.'
      return next
    })
    setToast(null)
  }

  function addEmail() {
    setDraftProps((current) => ({ ...current, contact: { ...current.contact, emails: [...(current.contact.emails || []), ''] } }))
    setToast(null)
  }

  function removeEmail(index) {
    setDraftProps((current) => ({
      ...current,
      contact: { ...current.contact, emails: (current.contact.emails || []).filter((_, emailIndex) => emailIndex !== index) },
    }))
    setToast(null)
  }

  function updateSection(section, key, value) {
    setDraftProps((current) => ({ ...current, [section]: { ...current[section], [key]: value } }))
    setToast(null)
  }

  function updateMapAddress(value) {
    const directionsUrl = value.trim()
      ? `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: value })}`
      : ''
    setDraftProps((current) => ({
      ...current,
      mapLocation: { ...current.mapLocation, address: value, mapAddress: value, directionsUrl },
    }))
    setToast(null)
  }

  function updateListItem(section, index, key, value) {
    setDraftProps((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }))
    setToast(null)
  }

  function updateWorkingTime(index, part, value) {
    setDraftProps((current) => ({
      ...current,
      workingHours: current.workingHours.map((row, rowIndex) => {
        if (rowIndex !== index) return row
        const currentTime = parseWorkingTime(row.time)
        return { ...row, time: formatWorkingTime(part === 'start' ? value : currentTime.start, part === 'end' ? value : currentTime.end) }
      }),
    }))
    setToast(null)
  }

  function addOffice() {
    setDraftProps((current) => ({
      ...current,
      offices: [...(current.offices || []), { id: `office_${Date.now()}`, label: '', city: '', address: '' }],
    }))
    setToast(null)
  }

  function removeOffice(index) {
    setDraftProps((current) => ({
      ...current,
      offices: current.offices.filter((_, officeIndex) => officeIndex !== index),
    }))
    setToast(null)
  }

  function addWorkingHour() {
    setDraftProps((current) => ({
      ...current,
      workingHours: [...(current.workingHours || []), { days: '', time: '' }],
    }))
    setToast(null)
  }

  function removeWorkingHour(index) {
    setDraftProps((current) => ({
      ...current,
      workingHours: current.workingHours.filter((_, rowIndex) => rowIndex !== index),
    }))
    setToast(null)
  }

  function addSocialChannel() {
    setDraftProps((current) => ({
      ...current,
      socialChannels: [...(current.socialChannels || []), { id: `channel_${Date.now()}`, label: '', href: null }],
    }))
    setToast(null)
  }

  function removeSocialChannel(index) {
    setDraftProps((current) => ({
      ...current,
      socialChannels: current.socialChannels.filter((_, channelIndex) => channelIndex !== index),
    }))
    setToast(null)
  }

  function validate() {
    const errors = {}
    const form = draftProps?.form || {}
    const contact = draftProps?.contact || {}
    if (!String(form.form_title || '').trim()) errors.form_title = 'Tiêu đề form không được để trống.'
    if (!String(form.form_description || '').trim()) errors.form_description = 'Mô tả form không được để trống.'
    if (!String(form.button_text || '').trim()) errors.button_text = 'Nhãn nút gửi không được để trống.'
    if (!String(form.availability_text || '').trim()) errors.availability_text = 'Thông báo trạng thái form không được để trống.'
    if (!String(form.privacy_text || '').trim()) errors.privacy_text = 'Thông báo thông tin liên hệ không được để trống.'
    ;(form.form_fields || []).forEach((field, index) => {
      if (!String(field.label || '').trim()) errors[`field_label_${field.id}`] = `Nhãn ô nhập ${index + 1} không được để trống.`
    })
    ;(draftProps?.contactCategories || []).forEach((category, index) => {
      if (!String(category.value || '').trim()) errors[`category_value_${index}`] = `Mã lĩnh vực ${index + 1} không được để trống.`
      if (!String(category.label || '').trim()) errors[`category_label_${index}`] = `Tên lĩnh vực ${index + 1} không được để trống.`
    })
    if (!String(contact.organization || '').trim()) errors.organization = 'Tên đơn vị không được để trống.'
    if (!String(contact.address || '').trim()) errors.address = 'Địa chỉ không được để trống.'
    const phones = Array.isArray(contact.phones) && contact.phones.length
      ? contact.phones
      : [{ number: contact.phone || '', href: contact.phoneHref || '' }]
    phones.forEach((phone, index) => {
      if (!String(phone.number || '').trim()) errors[`phone_${index}`] = 'Số điện thoại không được để trống.'
      else if (!isValidPhone(phone.number)) errors[`phone_${index}`] = 'Số điện thoại không đúng định dạng.'
    })
    if (!Array.isArray(contact.emails) || !contact.emails.length) errors.emails = 'Cần nhập ít nhất một email.'
    else contact.emails.forEach((email, index) => {
      if (!String(email || '').trim()) errors[`email_${index}`] = 'Email không được để trống.'
      else if (!isValidEmail(email)) errors[`email_${index}`] = 'Email không đúng định dạng.'
    })
    const intro = draftProps?.intro || {}
    if (!String(intro.badge || '').trim()) errors.badge = 'Nhãn đầu trang không được để trống.'
    if (!String(intro.title || '').trim()) errors.title = 'Tiêu đề đầu trang không được để trống.'
    if (!String(intro.description || '').trim()) errors.introDescription = 'Mô tả đầu trang không được để trống.'
    ;(draftProps?.offices || []).forEach((office, index) => {
      if (!String(office.label || '').trim() || !String(office.city || '').trim() || !String(office.address || '').trim()) errors[`office_${index}`] = `Thông tin văn phòng ${index + 1} không được để trống.`
    })
    ;(draftProps?.workingHours || []).forEach((row, index) => {
      const time = parseWorkingTime(row.time)
      if (!String(row.days || '').trim() || !time.start || !time.end) errors[`hours_${index}`] = `Thời gian làm việc ${index + 1} cần đủ giờ bắt đầu và kết thúc.`
    })
    ;(draftProps?.socialChannels || []).forEach((channel, index) => {
      if (!String(channel.label || '').trim()) errors[`channel_${index}`] = `Tên kênh thông tin ${index + 1} không được để trống.`
    })
    const mapLocation = draftProps?.mapLocation || {}
    if (!String(mapLocation.label || '').trim()) errors.mapLabel = 'Nhãn bản đồ không được để trống.'
    if (!String(mapLocation.address || mapLocation.mapAddress || '').trim()) errors.mapAddress = 'Địa chỉ bản đồ không được để trống.'
    if (!String(mapLocation.embedUrl || '').trim()) errors.embedUrl = 'Đường dẫn nhúng bản đồ không được để trống.'
    showErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function save(event) {
    event.preventDefault()
    if (saving || !draftProps || !validate()) return
    setSaving(true)
    setToast(null)
    try {
      const props = clone(draftProps)
      const currentContact = props.contact || {}
      const phones = Array.isArray(currentContact.phones) && currentContact.phones.length
        ? currentContact.phones
        : [{ number: currentContact.phone || '', href: currentContact.phoneHref || '' }]
      const normalizedPhones = phones.map((phone) => ({
        ...phone,
        href: phoneHrefFromNumber(phone.number),
      }))
      props.contact = {
        ...currentContact,
        phones: normalizedPhones,
        phone: normalizedPhones[0]?.number || '',
        phoneHref: normalizedPhones[0]?.href || '',
      }
      props.socialChannels = (props.socialChannels || []).map((channel) => ({
        ...channel,
        href: externalHrefFromValue(channel.href),
      }))
      const response = await ContactAPI.updatePage(CONTACT_PAGE_ID, { props })
      const page = requireContactData(response)
      setContent(page)
      setDraftProps(clone(page.props))

      // Đồng bộ cấu hình form sang trang Quản lý Biểu mẫu
      try {
        const { saveFormConfig } = await import('../../services/googleSheetService.js');
        const contactForm = props.form || {};
        const contactFields = Array.isArray(contactForm.form_fields) ? contactForm.form_fields : [];
        await saveFormConfig('contact_feedback', {
          title: contactForm.form_title || 'Liên Hệ & Đề Xuất Tư Vấn Trực Tuyến',
          subtitle: contactForm.form_description || 'Cổng tiếp nhận thông tin phản hồi...',
          button_text: contactForm.button_text || 'GỬI LỜI NHẮN NGAY',
          fields: contactFields.map((f) => ({
            key: f.id || f.key,
            label: f.label,
            type: f.type,
            placeholder: f.placeholder,
            required: Boolean(f.required),
            colSpan: f.width === 'half' ? 1 : 2,
            options: f.options,
          })),
        });
      } catch (syncErr) {
        console.warn('Đồng bộ contact_feedback vào googleSheetService hoàn tất với cảnh báo:', syncErr);
      }

      setToast({ message: 'Đã lưu nội dung trang Liên hệ.' })
    } catch (error) {
      const errors = contactValidationErrors(error)
      if (Object.keys(errors).length) showErrors(errors)
      setToast({ error: true, message: contactError(error) })
    } finally {
      setSaving(false)
    }
  }

  function reload() {
    setLoading(true)
    setLoadError('')
    setAttempt((value) => value + 1)
  }

  function renderSavedForm() {
    if (loading) return <p role="status">Đang tải nội dung trang Liên hệ…</p>
    if (loadError) return <div className="space-y-3 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6"><p role="alert">{loadError}</p><button type="button" onClick={reload} className="inline-flex min-h-10 cursor-pointer items-center rounded-lg border border-(--admin-border) px-3 py-2 text-sm font-semibold hover:bg-(--admin-background)">Thử lại</button></div>
    const form = draftProps?.form || {}
    const availabilityText = form.availability_text || ''
    const privacyText = form.privacy_text || ''
    const fixedFields = contactFixedFieldIds.map((fieldId) => form.form_fields?.find((field) => field.id === fieldId)).filter(Boolean)
    const extraFields = (form.form_fields || []).filter((field) => !contactFixedFieldIds.includes(field.id))
    const extraFieldErrors = Object.fromEntries(extraFields.map((field, index) => [`field_label_${index}`, formErrors[`field_label_${field.id}`]]))
    const categories = Array.isArray(draftProps?.contactCategories) ? draftProps.contactCategories : []
    const fieldNames = { fullName: 'Họ và tên', email: 'Địa chỉ Email', phone: 'Số điện thoại liên hệ', category: 'Lĩnh vực quan tâm', message: 'Nội dung lời nhắn / Đề xuất chi tiết' }
    const fieldTypes = { text: 'Văn bản', email: 'Email', tel: 'Số điện thoại', select: 'Danh sách chọn', textarea: 'Văn bản dài' }
    return <form onSubmit={save} className="space-y-5">
      <div className="space-y-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-[var(--admin-panel-shadow)]">
        <div>
          <h2 className="text-lg font-semibold text-(--admin-title)">Cấu hình Form liên hệ</h2>
          <p className="mt-2 text-sm leading-6 text-(--admin-ink)/70">Các ô cơ bản của form được cố định như form Sự kiện. Bạn chỉ chỉnh nhãn và gợi ý nhập; ô bổ sung được thêm ở phần bên dưới.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactField label="Tiêu đề khối Form" required value={form.form_title} error={formErrors.form_title} onChange={(value) => updateForm({ form_title: value })} placeholder="Ví dụ: Gửi phản hồi hoặc yêu cầu tư vấn" />
          <ContactField label="Chữ trên nút gửi" required value={form.button_text} error={formErrors.button_text} onChange={(value) => updateForm({ button_text: value })} placeholder="Ví dụ: GỬI LỜI NHẮN NGAY" />
        </div>
        <ContactField label="Mô tả Form" required multiline value={form.form_description} error={formErrors.form_description} onChange={(value) => updateForm({ form_description: value })} placeholder="Ví dụ: Quý vị vui lòng để lại thông tin..." />
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactMessageField label="Thông báo trạng thái Form" value={availabilityText} error={formErrors.availability_text} onChange={(value) => updateForm({ availability_text: value })} contact={draftProps?.contact || { phoneHref: '', phone: '', emails: [''] }} placeholder="Ví dụ: Biểu mẫu hiện chưa tiếp nhận trực tuyến..." />
          <ContactField label="Thông báo thông tin liên hệ" required multiline value={privacyText} error={formErrors.privacy_text} onChange={(value) => updateForm({ privacy_text: value })} placeholder="Ví dụ: Nội dung đang nhập chỉ được giữ trên trang..." />
        </div>
        <div className="space-y-4 border-t border-(--admin-border) pt-5">
          <div><h3 className="text-base font-semibold text-(--admin-title)">Các ô cố định</h3><p className="mt-1 text-xs text-(--admin-ink)/70">Các ô này luôn hiển thị trên form và không thể xóa hoặc đổi loại.</p></div>
          {fixedFields.map((field) => <div key={field.id} className="grid gap-4 rounded-lg border border-(--admin-border) p-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-(--admin-title)">{fieldNames[field.id] || field.label}</span>
              <span className="rounded bg-(--admin-background) px-2 py-1 text-[11px] text-(--admin-heading)">{fieldTypes[field.type] || field.type}</span>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded bg-(--admin-background) px-2 py-1 text-[11px] text-(--admin-heading)">
                <input type="checkbox" checked={Boolean(field.required)} onChange={(event) => updateFixedFormField(field.id, 'required', event.target.checked)} className="size-3.5 accent-(--admin-accent)" />
                Bắt buộc
              </label>
            </div>
            <ContactField label="Nhãn hiển thị" required value={field.label} error={formErrors[`field_label_${field.id}`]} onChange={(value) => updateFixedFormField(field.id, 'label', value)} placeholder={fieldNames[field.id]} />
            <ContactField label="Gợi ý nhập liệu" value={field.placeholder} onChange={(value) => updateFixedFormField(field.id, 'placeholder', value)} placeholder="Ví dụ: Nhập thông tin..." />
          </div>)}
        </div>
      </div>
      <section className="space-y-4 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center justify-between gap-3">
          <div><h2 className="text-lg font-semibold text-(--admin-title)">Danh sách lĩnh vực quan tâm</h2><p className="mt-2 text-sm leading-6 text-(--admin-ink)/70">Các lựa chọn hiển thị trong ô “Lĩnh vực quan tâm” trên trang Contact.</p></div>
          <button type="button" className={adminButton} onClick={addCategory}><Plus size={15} />Thêm lĩnh vực</button>
        </div>
        <div className="grid gap-3 border-b border-(--admin-border) pb-2 text-sm font-semibold text-(--admin-heading) sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
          <span>Mã lĩnh vực <span className="text-(--admin-accent)">*</span></span>
          <span>Tên hiển thị <span className="text-(--admin-accent)">*</span></span>
          <span aria-hidden="true" />
        </div>
        <div className="space-y-3">
          {categories.map((category, index) => <div key={`category-${index}`} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] sm:items-end">
            <ContactField label="Mã lĩnh vực" hideLabel value={category.value} error={formErrors[`category_value_${index}`]} onChange={(value) => updateCategory(index, 'value', value)} placeholder="Ví dụ: dao-tao" />
            <ContactField label="Tên hiển thị" hideLabel value={category.label} error={formErrors[`category_label_${index}`]} onChange={(value) => updateCategory(index, 'label', value)} placeholder="Ví dụ: Khóa đào tạo" />
            <button type="button" className={adminButton} disabled={categories.length === 1} onClick={() => removeCategory(index)}><Trash2 size={15} />Xóa</button>
          </div>)}
        </div>
      </section>
      <FormBuilder
        formId="contact_feedback"
        value={{ form_fields: extraFields }}
        previewValue={{
          form_title: form.form_title,
          form_description: form.form_description,
          button_text: form.button_text,
          form_fields: form.form_fields || [],
        }}
        onChange={updateExtraForm}
        errors={extraFieldErrors}
        showFormMeta={false}
        showPreview={false}
        title="Ô nhập liệu bổ sung"
        description="Chỉ các ô được thêm bằng nút bên dưới mới xuất hiện trong danh sách này."
        previewAccentColor="#710008"
      />
      <section className="rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-[var(--admin-panel-shadow)]">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-(--admin-title)"><Eye size={16} className="text-(--admin-accent)" />Xem trước Form liên hệ thực tế</h3>
        <div className="pointer-events-none mx-auto max-w-2xl overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-background) p-3 text-black [--contact-red:#710008] [--contact-gold:#d49520] [--contact-cream:#f4f3f1] [font-family:'Inter',sans-serif]">
          <ContactForm categories={draftProps?.contactCategories || []} contact={draftProps?.contact || { phoneHref: '', emails: [''] }} form={form} preview />
        </div>
      </section>
      <div className="flex justify-end border-t border-(--admin-border) pt-4">
        <button type="submit" className={adminPrimaryButton} disabled={saving || !dirty}><Save size={16} />{saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
      </div>
    </form>
  }

  function renderContactInfo() {
    if (loading) return <p role="status">Đang tải thông tin liên hệ…</p>
    if (loadError) return <div className="space-y-3 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6"><p role="alert">{loadError}</p><button type="button" onClick={reload} className="inline-flex min-h-10 cursor-pointer items-center rounded-lg border border-(--admin-border) px-3 py-2 text-sm font-semibold hover:bg-(--admin-background)">Thử lại</button></div>
    const contact = draftProps?.contact || {}
    const intro = draftProps?.intro || {}
    const offices = draftProps?.offices || []
    const workingHours = draftProps?.workingHours || []
    const socialChannels = draftProps?.socialChannels || []
    const mapLocation = draftProps?.mapLocation || {}
    const phones = Array.isArray(contact.phones) && contact.phones.length
      ? contact.phones
      : [{ number: contact.phone || '', href: contact.phoneHref || '' }]
    const emails = Array.isArray(contact.emails) && contact.emails.length ? contact.emails : ['']
    const sectionClass = 'space-y-4 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-[var(--admin-panel-shadow)]'
    return <form onSubmit={save} className="space-y-5">
      <section className={sectionClass}>
        <div><h2 className="text-lg font-semibold text-(--admin-title)">Đầu trang Liên hệ</h2><p className="mt-2 text-sm leading-6 text-(--admin-ink)/70">Chỉnh các nội dung hiển thị ở phần đầu trang Contact.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactField label="Nhãn đầu trang" required value={intro.badge} onChange={(value) => updateSection('intro', 'badge', value)} placeholder="Ví dụ: BAN THƯ KÝ & TIẾP NHẬN HỒ SƠ" />
          <ContactField label="Tiêu đề" required value={intro.title} onChange={(value) => updateSection('intro', 'title', value)} placeholder="Ví dụ: LIÊN HỆ" />
        </div>
        <ContactField label="Mô tả đầu trang" required multiline value={intro.description} onChange={(value) => updateSection('intro', 'description', value)} placeholder="Ví dụ: Trung tâm luôn sẵn sàng lắng nghe và đồng hành..." />
      </section>

      <section className={sectionClass}>
        <div><h2 className="text-lg font-semibold text-(--admin-title)">Thông tin tổng quát</h2><p className="mt-2 text-sm leading-6 text-(--admin-ink)/70">Các thông tin hiển thị ở phần liên hệ chính.</p></div>
        <div className="space-y-5">
          <ContactField label="Đơn vị" required value={contact.organization} onChange={(value) => updateContact('organization', value)} placeholder="Ví dụ: Trung tâm Công nghiệp Sáng tạo" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-(--admin-heading)">Số điện thoại <span className="text-(--admin-accent)">*</span></h3>
                <button type="button" className={`${adminButton} w-40`} onClick={addPhone}><Plus size={15} />Thêm số</button>
              </div>
              {phones.map((phone, index) => <div key={`phone-${index}`} className="flex flex-wrap items-end gap-3">
                  <div className="min-w-0 flex-1 sm:max-w-[22rem]"><ContactField label="Số điện thoại" hideLabel value={phone.number} error={formErrors[`phone_${index}`]} onChange={(value) => updatePhoneField(index, 'number', value)} placeholder="Ví dụ: (+84) 28 3847 7777" /></div>
                <p className="mb-3 max-w-36 truncate text-xs font-normal text-(--admin-ink)/60">{phoneHrefFromNumber(phone.number) || 'Nhập số để tạo link gọi'}</p>
                <button type="button" className={adminButton} disabled={phones.length === 1} onClick={() => removePhone(index)}><Trash2 size={15} />Xóa</button>
              </div>)}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-(--admin-heading)">Email <span className="text-(--admin-accent)">*</span></h3>
                <button type="button" className={`${adminButton} w-40`} onClick={addEmail}><Plus size={15} />Thêm email</button>
              </div>
              {emails.map((email, index) => <div key={`email-${index}`} className="flex items-end gap-2">
                <div className="min-w-0 flex-1"><ContactField label="Email" hideLabel value={email} error={formErrors[`email_${index}`]} onChange={(value) => updateEmail(index, value)} placeholder="Ví dụ: email@example.com" /></div>
                <button type="button" className={adminButton} disabled={emails.length === 1} onClick={() => removeEmail(index)}><Trash2 size={15} />Xóa</button>
              </div>)}
            </div>
          </div>
        </div>
        <ContactField label="Địa chỉ" required multiline value={contact.address} onChange={(value) => updateContact('address', value)} placeholder="Ví dụ: Trung tâm Công nghiệp Sáng tạo, Viện Kỷ lục Việt Nam..." />
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-(--admin-title)">Hệ thống văn phòng</h2><button type="button" className={adminButton} onClick={addOffice}><Plus size={16} />Thêm văn phòng</button></div>
        {offices.map((office, index) => <div key={office.id || index} className="space-y-4 rounded-lg border border-(--admin-border) p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ContactField label="Nhãn văn phòng" required value={office.label} onChange={(value) => updateListItem('offices', index, 'label', value)} placeholder="Ví dụ: TRỤ SỞ CHÍNH" />
            <ContactField label="Thành phố" required value={office.city} onChange={(value) => updateListItem('offices', index, 'city', value)} placeholder="Ví dụ: TP. Hà Nội" />
          </div>
          <ContactField label="Địa chỉ văn phòng" required multiline value={office.address} onChange={(value) => updateListItem('offices', index, 'address', value)} placeholder="Ví dụ: Tầng 6, Tòa nhà..." />
          <div className="flex justify-end">
            <button type="button" className={adminButton} disabled={offices.length === 1} onClick={() => removeOffice(index)}><Trash2 size={15} />Xóa</button>
          </div>
        </div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-(--admin-title)">Thời gian tiếp công dân & hồ sơ</h2><button type="button" className={adminButton} onClick={addWorkingHour}><Plus size={16} />Thêm khung giờ</button></div>
        <div className="grid gap-3 border-b border-(--admin-border) pb-2 text-sm font-semibold text-(--admin-heading) sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <span>Ngày làm việc <span className="text-(--admin-accent)">*</span></span>
          <span>Thời gian <span className="text-(--admin-accent)">*</span> <span className="text-xs font-normal">(Từ – Đến)</span></span>
          <span aria-hidden="true" />
        </div>
        <div className="space-y-3">
          {workingHours.map((row, index) => {
            const time = parseWorkingTime(row.time)
            return <div key={index} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
            <ContactField label="Ngày làm việc" hideLabel value={row.days} onChange={(value) => updateListItem('workingHours', index, 'days', value)} placeholder="Ví dụ: Thứ Hai — Thứ Sáu" />
            <div className="grid grid-cols-2 gap-2">
              <ContactField label="Giờ bắt đầu" hideLabel type="time" value={time.start} onChange={(value) => updateWorkingTime(index, 'start', value)} onClick={(event) => event.currentTarget.showPicker?.()} />
              <ContactField label="Giờ kết thúc" hideLabel type="time" value={time.end} onChange={(value) => updateWorkingTime(index, 'end', value)} onClick={(event) => event.currentTarget.showPicker?.()} />
            </div>
            <button type="button" className={adminButton} disabled={workingHours.length === 1} onClick={() => removeWorkingHour(index)}><Trash2 size={15} />Xóa</button>
          </div>
          })}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-(--admin-title)">Kênh thông tin điện tử</h2><button type="button" className={adminButton} onClick={addSocialChannel}><Plus size={16} />Thêm kênh</button></div>
        <div className="grid gap-3 border-b border-(--admin-border) pb-2 text-sm font-semibold text-(--admin-heading) sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <span>Tên kênh <span className="text-(--admin-accent)">*</span></span>
          <span>Đường dẫn kênh</span>
          <span aria-hidden="true" />
        </div>
        <div className="space-y-3">
          {socialChannels.map((channel, index) => <div key={channel.id || index} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
            <ContactField label="Tên kênh" hideLabel required value={channel.label} onChange={(value) => updateListItem('socialChannels', index, 'label', value)} placeholder="Ví dụ: Zalo OA" />
            <ContactField label="Đường dẫn kênh" hideLabel value={channel.href || ''} onChange={(value) => updateListItem('socialChannels', index, 'href', value || null)} placeholder="Ví dụ: https://zalo.me/..." />
            <button type="button" className={adminButton} onClick={() => removeSocialChannel(index)}><Trash2 size={15} />Xóa</button>
          </div>)}
        </div>
      </section>

      <section className={sectionClass}>
        <div><h2 className="text-lg font-semibold text-(--admin-title)">Sơ đồ vị trí viện</h2><p className="mt-2 text-sm leading-6 text-(--admin-ink)/70">Chỉnh nội dung hiển thị bên dưới bản đồ và đường dẫn bản đồ.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactField label="Nhãn vị trí" required value={mapLocation.label} onChange={(value) => updateSection('mapLocation', 'label', value)} placeholder="Ví dụ: Trụ sở VIETKINGS — TTCN Sáng Tạo" />
          <ContactField label="Đường dẫn nhúng bản đồ" required value={mapLocation.embedUrl} onChange={(value) => updateSection('mapLocation', 'embedUrl', value)} placeholder="Ví dụ: https://www.google.com/maps/embed?..." />
        </div>
        <ContactField label="Địa chỉ bản đồ" required multiline value={mapLocation.address || mapLocation.mapAddress} onChange={updateMapAddress} placeholder="Ví dụ: 16/1 Đặng Văn Ngữ, Phường 10..." />
      </section>

      <div className="flex justify-end border-t border-(--admin-border) pt-4">
        <button type="submit" className={adminPrimaryButton} disabled={saving || !dirty}><Save size={16} />{saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
      </div>
    </form>
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        badge="Khu vực quản trị"
        title="Quản lý Liên hệ"
        subtitle="Quản lý cấu hình biểu mẫu liên hệ, thông tin tiếp nhận hồ sơ và hộp thư liên hệ."
      />

      <AdminTabs
        tabs={adminContactTabs}
        activeTab={activeTab.id}
        onChange={(id) => {
          const tab = adminContactTabs.find((t) => t.id === id);
          if (tab) selectTab(tab);
        }}
      />

      {errorMessages.length > 0 && activeTab.id !== 'inbox' && (
        <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="space-y-2 rounded-lg border border-(--admin-heading) bg-(--admin-surface) p-4 text-sm text-(--admin-heading) focus:outline-2 focus:outline-(--admin-accent)">
          <p className="font-semibold">Chưa thể lưu. Kiểm tra các mục sau trong Cấu hình Form và Thông tin liên hệ:</p>
          <ul className="list-disc space-y-1 pl-5">{errorMessages.map((message, index) => <li key={index}>{message}</li>)}</ul>
        </div>
      )}

      {adminContactTabs.map((tab) => (
        <div key={tab.id} id={`contact-panel-${tab.id}`} role="tabpanel" aria-labelledby={`contact-tab-${tab.id}`} hidden={activeTab.id !== tab.id}>
          {tab.id === 'inbox' ? (
            <AdminContactInbox messages={adminMessages} />
          ) : tab.id === 'form' ? (
            renderSavedForm()
          ) : tab.id === 'info' ? (
            renderContactInfo()
          ) : (
            <section className="rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-[var(--admin-panel-shadow)]">
              <h2 className="text-lg font-semibold text-(--admin-title)">{tab.label}</h2>
              <p className="mt-3 text-sm leading-6">{tab.description}</p>
            </section>
          )}
        </div>
      ))}

      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
