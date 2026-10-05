import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import { EventAPI } from '../../../api/eventApi.js'
import { adminButton, adminPrimaryButton, adminPanel } from '../../../config/Admin/adminEvents.js'
import { eventStatuses } from '../../../config/Events/eventsConfig.js'
import { eventDraft } from '../../../config/Admin/adminEvents.js'
import { eventError, requireEventData, validEventLink } from '../../../api/eventApi.js'
import Field from './EventField.jsx'
import EventImage from './EventImage.jsx'

export default function EventEditor({ event, categories, onSaved, onClose }) {
  const [draft, setDraft] = useState(() => eventDraft(event))
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const busy = useRef(false)
  const heading = useRef(null)
  const dirty = Boolean(file) || JSON.stringify(draft) !== JSON.stringify(eventDraft(event))
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  useEffect(() => { heading.current?.focus() }, [])
  const selectFile = (next) => { setFile(next); setPreview(next ? URL.createObjectURL(next) : '') }
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const close = () => { if (!dirty || window.confirm('Bỏ các thay đổi chưa lưu của sự kiện này?')) onClose() }
  const moveSpeaker = (index, direction) => {
    const speakers = [...draft.speakers]
    ;[speakers[index], speakers[index + direction]] = [speakers[index + direction], speakers[index]]
    update('speakers', speakers)
  }
  const save = async (e) => {
    e.preventDefault()
    if (busy.current) return
    if (!draft.name.trim() || !draft.location.trim() || !draft.description.trim() || !draft.category_id) {
      setError('Vui lòng nhập tên, địa điểm, mô tả và chọn chuyên mục.'); return
    }
    if ((!file && !validEventLink(draft.image, true)) || !validEventLink(draft.form_url, true)
      || draft.speakers.some((item) => !item.name.trim() || !validEventLink(item.image, true))) {
      setError('Kiểm tra tên diễn giả và các đường dẫn: dùng URL http/https hoặc đường dẫn bắt đầu bằng /.'); return
    }
    if (Boolean(draft.btn_action.trim()) !== Boolean(draft.form_url.trim())) {
      setError('Nhập cả nhãn và đường dẫn nút hành động, hoặc để trống cả hai.'); return
    }
    busy.current = true
    setSaving(true); setError('')
    try {
      const payload = { ...draft, event_date: draft.event_date || null, category_id: Number(draft.category_id) }
      const response = event?.id ? await EventAPI.updateEvent(event.id, payload, file) : await EventAPI.createEvent(payload, file)
      const saved = requireEventData(response)
      if (!saved.id) throw new Error('Phản hồi lưu sự kiện không hợp lệ.')
      onSaved(saved)
    } catch (err) { setError(eventError(err)) }
    finally { busy.current = false; setSaving(false) }
  }
  return <form onSubmit={save} className={`${adminPanel} space-y-6`}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 ref={heading} tabIndex={-1} className="text-xl font-semibold text-(--admin-title) outline-none">{event?.id ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện'}</h3>
      <button type="button" className={adminButton} onClick={close} disabled={saving}><ArrowLeft size={16} />Danh sách sự kiện</button>
    </div>
    <p className="text-sm text-(--admin-ink)/70">Các phần bên dưới theo thứ tự hiển thị trên thẻ sự kiện.</p>
    {error && <p role="alert" className="text-sm text-(--admin-heading)">{error}</p>}
    <fieldset disabled={saving} className="min-w-0 space-y-7 disabled:opacity-60">
      <section className="space-y-4" aria-labelledby="event-image-heading">
        <h4 id="event-image-heading" className="font-semibold text-(--admin-title)">1. Ảnh và trạng thái</h4>
        <EventImage src={preview || draft.image} alt="Xem trước ảnh sự kiện" className="aspect-video max-w-lg rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="URL ảnh sự kiện" value={draft.image} onChange={(value) => { update('image', value); selectFile(null) }} />
          <label className="block min-w-0 space-y-2 text-sm font-medium">
            <span className="block">Tải ảnh từ máy tính</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="block w-full min-w-0 rounded-lg border border-(--admin-border) p-2.5 text-sm" onChange={(e) => {
              const selected = e.target.files?.[0]; e.target.value = ''
              if (!selected) return
              if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 5 * 1024 * 1024) { setError('Chọn ảnh JPG, PNG hoặc WEBP tối đa 5 MB.'); return }
              selectFile(selected); setError('')
            }} />
          </label>
          <Field label="Trạng thái" value={draft.status} onChange={(value) => update('status', value)}>{eventStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</Field>
          <Field label="Chuyên mục" required value={draft.category_id} onChange={(value) => update('category_id', value)}><option value="">Chọn chuyên mục</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Field>
        </div>
        {file && <p className="text-sm">Ảnh đã chọn: {file.name} <button type="button" className={adminButton} onClick={() => selectFile(null)}>Bỏ ảnh đã chọn</button></p>}
      </section>
      <section className="space-y-4 border-t border-(--admin-border) pt-5" aria-labelledby="event-content-heading">
        <h4 id="event-content-heading" className="font-semibold text-(--admin-title)">2. Nội dung sự kiện</h4>
        <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_18rem]">
          <Field label="Địa điểm" required maxLength={255} value={draft.location} onChange={(value) => update('location', value)} />
          <Field label="Ngày tổ chức" type="date" min="1000-01-01" max="9999-12-31" value={draft.event_date} onChange={(value) => update('event_date', value)} />
        </div>
        <Field label="Tên sự kiện" required maxLength={255} value={draft.name} onChange={(value) => update('name', value)} />
        <Field label="Mô tả sự kiện" required multiline value={draft.description} onChange={(value) => update('description', value)} />
      </section>
      <section className="space-y-4 border-t border-(--admin-border) pt-5" aria-labelledby="event-speakers-heading">
        <h4 id="event-speakers-heading" className="font-semibold text-(--admin-title)">3. Diễn giả / Đơn vị tổ chức</h4>
        {draft.speakers.length === 0 && <p className="text-sm text-(--admin-ink)/70">Chưa có diễn giả.</p>}
        {draft.speakers.map((speaker, index) => <fieldset key={index} className="space-y-4 rounded-lg border border-(--admin-border) p-4">
          <legend className="px-2 text-sm font-semibold">Diễn giả {index + 1}</legend>
          <div className="flex justify-end gap-2">
            <button type="button" className={adminButton} aria-label={`Chuyển diễn giả ${index + 1} lên`} disabled={index === 0} onClick={() => moveSpeaker(index, -1)}><ArrowUp size={14} /></button>
            <button type="button" className={adminButton} aria-label={`Chuyển diễn giả ${index + 1} xuống`} disabled={index === draft.speakers.length - 1} onClick={() => moveSpeaker(index, 1)}><ArrowDown size={14} /></button>
            <button type="button" className={adminButton} aria-label={`Xóa diễn giả ${index + 1}`} onClick={() => update('speakers', draft.speakers.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
          </div>
          {['name', 'role', 'description', 'image'].map((key) => <Field key={key} label={({ name: 'Tên diễn giả', role: 'Vai trò / Chức danh', description: 'Giới thiệu diễn giả', image: 'URL ảnh diễn giả' })[key]} required={key === 'name'} multiline={key === 'description'} value={speaker[key]} onChange={(value) => update('speakers', draft.speakers.map((item, i) => i === index ? { ...item, [key]: value } : item))} />)}
        </fieldset>)}
        <button type="button" className={adminButton} onClick={() => update('speakers', [...draft.speakers, { name: '', role: '', description: '', image: '' }])}><Plus size={16} />Thêm diễn giả</button>
      </section>
      <section className="space-y-4 border-t border-(--admin-border) pt-5" aria-labelledby="event-action-heading">
        <h4 id="event-action-heading" className="font-semibold text-(--admin-title)">4. Nút hành động</h4>
        <Field label="Nhãn nút" maxLength={255} value={draft.btn_action} onChange={(value) => update('btn_action', value)} />
        <Field label="Đường dẫn" maxLength={255} value={draft.form_url} onChange={(value) => update('form_url', value)} />
      </section>
      <div className="flex justify-end border-t border-(--admin-border) pt-5"><button type="submit" className={adminPrimaryButton} disabled={!dirty}><Save size={16} />{saving ? 'Đang lưu…' : 'Lưu sự kiện'}</button></div>
    </fieldset>
  </form>
}
