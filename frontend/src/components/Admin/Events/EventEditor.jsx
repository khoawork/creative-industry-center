import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowDown, ArrowUp, Check, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react'
import { EventAPI } from '../../../api/eventApi.js'
import { adminButton, adminPrimaryButton, adminPanel } from '../../../config/Admin/adminEvents.js'
import { eventStatuses } from '../../../config/Events/eventsConfig.js'
import { eventDraft } from '../../../config/Admin/adminEvents.js'
import { eventError, requireEventData, validEventLink } from '../../../api/eventApi.js'
import Field from './EventField.jsx'
import ImageUploadField from '../Catalog/ImageUploadField.jsx'

export default function EventEditor({ event, categories, onSaved, onClose, modal = false }) {
  const [draft, setDraft] = useState(() => eventDraft(event))
  const [file, setFile] = useState(null)
  const [speakerFiles, setSpeakerFiles] = useState(() => (event?.speakers || []).map(() => null))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const busy = useRef(false)
  const heading = useRef(null)
  const dirty = Boolean(file) || speakerFiles.some(Boolean) || JSON.stringify(draft) !== JSON.stringify(eventDraft(event))
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  const updateSpeaker = (index, key, value) => update('speakers', draft.speakers.map((item, i) => i === index ? { ...item, [key]: value } : item))
  const updateSpeakerFile = (index, nextFile) => setSpeakerFiles((current) => {
    const next = [...current]
    next[index] = nextFile
    return next
  })
  useEffect(() => { heading.current?.focus() }, [])
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const close = () => { if (!busy.current && (!dirty || window.confirm('Bỏ các thay đổi chưa lưu của sự kiện này?'))) onClose() }
  const moveSpeaker = (index, direction) => {
    const speakers = [...draft.speakers]
    ;[speakers[index], speakers[index + direction]] = [speakers[index + direction], speakers[index]]
    update('speakers', speakers)
    setSpeakerFiles((current) => {
      const next = [...current]
      ;[next[index], next[index + direction]] = [next[index + direction], next[index]]
      return next
    })
  }
  const removeSpeaker = (index) => {
    update('speakers', draft.speakers.filter((_, i) => i !== index))
    setSpeakerFiles((current) => current.filter((_, i) => i !== index))
  }
  const addSpeaker = () => {
    update('speakers', [...draft.speakers, { name: '', role: '', description: '', image: '' }])
    setSpeakerFiles((current) => [...current, null])
  }
  const save = async (e) => {
    e.preventDefault()
    if (busy.current) return
    if (!draft.name.trim() || !draft.location.trim() || !draft.description.trim() || !draft.category_id) {
      setError('Vui lòng nhập tên, địa điểm, mô tả và chọn chuyên mục.'); return
    }
    if ((!file && !validEventLink(draft.image, true)) || !validEventLink(draft.form_url, true)
      || draft.speakers.some((item, index) => !item.name.trim() || (!speakerFiles[index] && !validEventLink(item.image, true)))) {
      setError('Kiểm tra tên diễn giả và các đường dẫn: dùng URL http/https hoặc đường dẫn bắt đầu bằng /.'); return
    }
    if (Boolean(draft.btn_action.trim()) !== Boolean(draft.form_url.trim())) {
      setError('Nhập cả nhãn và đường dẫn nút hành động, hoặc để trống cả hai.'); return
    }
    busy.current = true
    setSaving(true); setError('')
    try {
      const payload = { ...draft, event_date: draft.event_date || null, category_id: Number(draft.category_id) }
      const response = event?.id ? await EventAPI.updateEvent(event.id, payload, file, speakerFiles) : await EventAPI.createEvent(payload, file, speakerFiles)
      const saved = requireEventData(response)
      if (!saved.id) throw new Error('Phản hồi lưu sự kiện không hợp lệ.')
      onSaved(saved)
    } catch (err) { setError(eventError(err)) }
    finally { busy.current = false; setSaving(false) }
  }
  return <form onSubmit={save} className={modal ? 'flex max-h-[calc(100dvh-2rem)] flex-col' : `${adminPanel} space-y-6`}>
    {modal && <div className="flex shrink-0 items-center justify-between border-b border-(--admin-border) px-6 py-4">
      <h3 ref={heading} tabIndex={-1} className="text-base font-bold text-(--admin-title) outline-none">{event?.id ? 'Chỉnh sửa Sự kiện' : 'Thêm mới Sự kiện'}</h3>
      <button type="button" aria-label="Đóng modal sự kiện" onClick={close} disabled={saving} className="cursor-pointer text-(--admin-ink)/60 hover:text-(--admin-title) focus-visible:outline-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-50"><X size={20} aria-hidden="true" /></button>
    </div>}
    <div className={modal ? 'min-h-0 max-h-[80vh] space-y-4 overflow-y-auto overscroll-contain p-6' : 'space-y-6'}>
    {!modal && <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 ref={heading} tabIndex={-1} className="text-xl font-semibold text-(--admin-title) outline-none">{event?.id ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện'}</h3>
      <button type="button" className={adminButton} onClick={close} disabled={saving}><ArrowLeft size={16} /><span>Danh sách sự kiện</span></button>
    </div>}
    {!modal && <p className="text-sm text-(--admin-ink)/70">Các phần bên dưới theo thứ tự hiển thị trên thẻ sự kiện.</p>}
    {error && <p role="alert" className="text-sm text-(--admin-heading)">{error}</p>}
    <fieldset disabled={saving} className="min-w-0 space-y-7 disabled:opacity-60">
      <section className="space-y-4" aria-labelledby="event-image-heading">
        <h4 id="event-image-heading" className="font-semibold text-(--admin-title)">{modal ? 'Trạng thái và chuyên mục' : '1. Ảnh và trạng thái'}</h4>
        {!modal && <ImageUploadField label="Hình ảnh sự kiện" value={draft.image} selectedFile={file} onFileChange={setFile} onChange={(url) => update('image', url)} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} label="Trạng thái" value={draft.status} onChange={(value) => update('status', value)}>{eventStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</Field>
          <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} label="Chuyên mục" required value={draft.category_id} onChange={(value) => update('category_id', value)}><option value="">Chọn chuyên mục</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Field>
        </div>
      </section>
      <section className="space-y-4 border-t border-(--admin-border) pt-5" aria-labelledby="event-content-heading">
        <h4 id="event-content-heading" className="font-semibold text-(--admin-title)">{modal ? 'Nội dung sự kiện' : '2. Nội dung sự kiện'}</h4>
        <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
          <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} label="Địa điểm" required maxLength={255} value={draft.location} onChange={(value) => update('location', value)} />
          <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} label="Ngày tổ chức" type="date" min="1000-01-01" max="9999-12-31" value={draft.event_date} onChange={(value) => update('event_date', value)} />
        </div>
        <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} label="Tên sự kiện" required maxLength={255} value={draft.name} onChange={(value) => update('name', value)} />
        <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} label="Mô tả sự kiện" required multiline value={draft.description} onChange={(value) => update('description', value)} />
      </section>
      <section className="space-y-4 border-t border-(--admin-border) pt-5" aria-labelledby="event-speakers-heading">
        <h4 id="event-speakers-heading" className="font-semibold text-(--admin-title)">{modal ? 'Diễn giả / Đơn vị tổ chức' : '3. Diễn giả / Đơn vị tổ chức'}</h4>
        {draft.speakers.length === 0 && <p className="text-sm text-(--admin-ink)/70">Chưa có diễn giả.</p>}
        {draft.speakers.map((speaker, index) => <fieldset key={index} className="space-y-4 rounded-lg border border-(--admin-border) p-4">
          <legend className="px-2 text-sm font-semibold">Diễn giả {index + 1}</legend>
          <div className="flex justify-end gap-2">
            <button type="button" className={adminButton} aria-label={`Chuyển diễn giả ${index + 1} lên`} disabled={index === 0} onClick={() => moveSpeaker(index, -1)}><ArrowUp size={14} /></button>
            <button type="button" className={adminButton} aria-label={`Chuyển diễn giả ${index + 1} xuống`} disabled={index === draft.speakers.length - 1} onClick={() => moveSpeaker(index, 1)}><ArrowDown size={14} /></button>
          <button type="button" className={adminButton} aria-label={`Xóa diễn giả ${index + 1}`} onClick={() => removeSpeaker(index)}><Trash2 size={14} /></button>
          </div>
          {['name', 'role', 'description'].map((key) => <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} key={key} label={({ name: 'Tên diễn giả', role: 'Vai trò / Chức danh', description: 'Giới thiệu diễn giả' })[key]} required={key === 'name'} multiline={key === 'description'} value={speaker[key]} onChange={(value) => updateSpeaker(index, key, value)} />)}
          <ImageUploadField label="Hình ảnh diễn giả" value={speaker.image} selectedFile={speakerFiles[index] || null} onFileChange={(nextFile) => updateSpeakerFile(index, nextFile)} onChange={(url) => updateSpeaker(index, 'image', url)} showClear={false} />
        </fieldset>)}
        <button type="button" className={adminButton} onClick={addSpeaker}><Plus size={16} />Thêm diễn giả</button>
      </section>
      <section className="space-y-4 border-t border-(--admin-border) pt-5" aria-labelledby="event-action-heading">
        <h4 id="event-action-heading" className="font-semibold text-(--admin-title)">{modal ? 'Nút hành động' : '4. Nút hành động'}</h4>
        <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} label="Nhãn nút" maxLength={255} value={draft.btn_action} onChange={(value) => update('btn_action', value)} />
        <Field compact={modal} labelClassName={modal ? 'text-(--admin-heading)' : ''} label="Đường dẫn" maxLength={255} value={draft.form_url} onChange={(value) => update('form_url', value)} />
      </section>
      {modal && <ImageUploadField label="Hình ảnh sự kiện" value={draft.image} selectedFile={file} onFileChange={setFile} onChange={(url) => update('image', url)} showClear={false} />}
      <div className="flex justify-end gap-2 border-t border-(--admin-border) pt-4">
        {modal && <button type="button" onClick={close} className="cursor-pointer rounded-lg border border-(--admin-border) px-4 py-2 text-xs font-semibold text-(--admin-ink)/70 hover:text-(--admin-title) focus-visible:outline-2 focus-visible:outline-(--admin-accent)">Hủy</button>}
        <button type="submit" className={modal ? 'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-(--admin-accent) px-4 py-2 text-xs font-bold text-(--admin-black) hover:opacity-90 focus-visible:outline-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-50' : adminPrimaryButton} disabled={!dirty}>{saving ? <RefreshCw size={13} className="motion-safe:animate-spin" aria-hidden="true" /> : modal ? <Check size={14} aria-hidden="true" /> : <Save size={16} />}{saving ? 'Đang lưu…' : modal ? (event?.id ? 'Lưu thay đổi' : 'Tạo sự kiện') : 'Lưu sự kiện'}</button>
      </div>
    </fieldset>
    </div>
  </form>
}
