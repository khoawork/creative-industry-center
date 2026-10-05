import { useEffect, useRef, useState } from 'react'
import { Pencil, Plus, RefreshCw, Save, Trash2 } from 'lucide-react'
import { EventAPI } from '../../../api/eventApi.js'
import { adminButton, adminContentTheme, adminPanel, adminPrimaryButton } from '../../../config/Admin/adminEvents.js'
import { eventStatuses, eventStatusLabel, formatEventDate } from '../../../config/Events/eventsConfig.js'
import { eventError, requireEventData } from '../../../api/eventApi.js'
import useDebouncedValue from '../../../hooks/shared/useDebouncedValue.js'
import EventEditor from './EventEditor.jsx'
import Field from './EventField.jsx'
import EventImage from './EventImage.jsx'

function sameEventIds(left, right) {
  if (left.length !== right.length) return false
  const rightIds = new Set(right.map(String))
  return left.every((id) => rightIds.has(String(id)))
}

export default function EventManager({ reloadKey = 0, pageId, displayedEventIds, onDisplayedEventsSaved, selectionMode = false }) {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedEventIds, setSelectedEventIds] = useState([])
  const [savedEventIds, setSavedEventIds] = useState([])
  const [selectionInitialized, setSelectionInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 500)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [savingSelection, setSavingSelection] = useState(false)
  const write = useRef(false)
  const listHeading = useRef(null)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([EventAPI.getEvents({ signal: controller.signal }), EventAPI.getCategories({ signal: controller.signal })])
      .then(([items, groups]) => {
        if (controller.signal.aborted) return
        const nextEvents = requireEventData(items, true)
        const nextCategories = requireEventData(groups, true)
        const initialIds = selectionMode && Array.isArray(displayedEventIds) ? displayedEventIds : nextEvents.map((event) => event.id)
        setEvents(nextEvents); setCategories(nextCategories)
        setSelectedEventIds(initialIds); setSavedEventIds(initialIds); setSelectionInitialized(true)
      }).catch((err) => { if (!controller.signal.aborted) setError(eventError(err)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt, displayedEventIds, reloadKey, selectionMode])
  const selectionDirty = selectionMode && selectionInitialized && !sameEventIds(selectedEventIds, savedEventIds)
  const selectedIds = new Set(selectedEventIds.map(String))
  const selectedCount = events.filter((event) => selectedIds.has(String(event.id))).length
  const toggleDisplayedEvent = (eventId) => {
    setSelectedEventIds((current) => current.some((id) => String(id) === String(eventId))
      ? current.filter((id) => String(id) !== String(eventId))
      : [...current, eventId])
    setError(''); setNotice('')
  }
  const saveDisplayedEvents = async () => {
    if (write.current || !selectionDirty) return
    write.current = true; setBusy(true); setSavingSelection(true); setError(''); setNotice('')
    try {
      const orderedIds = events.filter((event) => selectedIds.has(String(event.id))).map((event) => event.id)
      const response = await EventAPI.updateDisplayedEvents(pageId, orderedIds)
      const saved = requireEventData(response)
      if (!Array.isArray(saved.event_ids)) throw new Error('Phản hồi lưu danh sách hiển thị không hợp lệ.')
      setSelectedEventIds(saved.event_ids); setSavedEventIds(saved.event_ids)
      onDisplayedEventsSaved?.(saved)
      setNotice('Đã cập nhật các sự kiện hiển thị trên trang Event.')
    } catch (err) { setError(eventError(err)) }
    finally { write.current = false; setBusy(false); setSavingSelection(false) }
  }
  const deleteEvent = async () => {
    if (write.current) return
    write.current = true; setBusy(true); setError(''); setNotice('')
    try {
      const response = await EventAPI.deleteEvent(deleting.id)
      if (response?.success !== true) throw new Error('Chưa xóa được sự kiện.')
      setEvents((current) => current.filter((item) => item.id !== deleting.id))
      setSelectedEventIds((current) => current.filter((id) => String(id) !== String(deleting.id)))
      setDeleting(null); setNotice('Đã xóa sự kiện.')
      listHeading.current?.focus()
    } catch (err) { setError(eventError(err)) }
    finally { write.current = false; setBusy(false) }
  }
  const term = debouncedQuery.trim().toLocaleLowerCase('vi')
  const filtered = events.filter((event) => (!category || String(event.category?.id) === category)
    && (!status || event.status === status)
    && [event.name, event.location, event.description, ...(event.speakers || []).map((item) => item.name)].some((value) => String(value || '').toLocaleLowerCase('vi').includes(term)))
  return <div className={`${adminContentTheme} space-y-4`}>
    {notice && <p role="status" className="rounded-lg border border-(--admin-accent) p-3 text-sm">{notice}</p>}
    {editing ? <EventEditor key={editing.id || 'new'} event={editing} categories={categories} onClose={() => setEditing(null)} onSaved={(saved) => {
      setEvents((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved])
      setEditing(null); setNotice('Đã lưu sự kiện.'); setError('')
    }} /> : <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 ref={listHeading} tabIndex={-1} className="text-lg font-semibold text-(--admin-title) outline-none">Danh sách sự kiện</h3>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className={adminButton} disabled={loading || busy} onClick={() => { setLoading(true); setError(''); setNotice(''); setAttempt((value) => value + 1) }}><RefreshCw size={16} />Tải lại</button>
          {!selectionMode && <button type="button" className={adminPrimaryButton} disabled={loading || Boolean(error) || categories.length === 0} onClick={() => { setEditing({}); setNotice('') }}><Plus size={16} />Thêm sự kiện</button>}
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-(--admin-heading)">{error}</p>}
      {loading ? <p role="status">Đang tải danh sách sự kiện…</p> : <>
        {categories.length === 0 && !error && <p className="text-sm">Chưa có chuyên mục. Thêm chuyên mục trong phần Bộ lọc trước khi tạo sự kiện.</p>}
        <div className={`${adminPanel} grid gap-4 md:grid-cols-3`}>
          <Field label="Tìm sự kiện" value={query} onChange={setQuery} placeholder="Tên, địa điểm hoặc diễn giả…" />
          <Field label="Lọc chuyên mục" value={category} onChange={setCategory}><option value="">Tất cả chuyên mục</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Field>
          <Field label="Lọc trạng thái" value={status} onChange={setStatus}><option value="">Tất cả trạng thái</option>{eventStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Field>
        </div>
        {!error && <p className="text-sm text-(--admin-ink)/70">{filtered.length} / {events.length} sự kiện{selectionMode ? ` · ${selectedCount} sự kiện được chọn hiển thị trên trang Event` : ''}</p>}
        {!selectionMode && deleting && <div role="alert" className={`${adminPanel} space-y-3`}>
          <p>Xóa sự kiện “{deleting.name}”? Thao tác này không thể hoàn tác.</p>
          <div className="flex gap-2"><button className={adminButton} disabled={busy} onClick={() => setDeleting(null)}>Hủy xóa</button><button className={adminPrimaryButton} disabled={busy} onClick={deleteEvent}>{busy ? 'Đang xóa…' : 'Xác nhận xóa'}</button></div>
        </div>}
        {!error && filtered.length === 0 && <p className={`${adminPanel} text-center`}>{events.length ? 'Không có sự kiện phù hợp với bộ lọc.' : 'Chưa có sự kiện trong cơ sở dữ liệu.'}</p>}
        <div className="overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-surface)">
          <div aria-hidden="true" className={`hidden gap-4 border-b border-(--admin-border) bg-(--admin-background) px-4 py-3 text-xs font-semibold uppercase text-(--admin-ink)/70 xl:grid ${selectionMode ? 'grid-cols-[minmax(0,1fr)_10rem_10rem_8rem]' : 'grid-cols-[minmax(0,1fr)_10rem_10rem_9rem]'}`}><span>Sự kiện</span><span>Chuyên mục</span><span>Trạng thái</span><span className={selectionMode ? '' : 'text-right'}>{selectionMode ? 'Hiển thị' : 'Thao tác'}</span></div>
          {filtered.map((item) => <article key={item.id} className={`grid min-w-0 gap-3 border-b border-(--admin-border) p-3 last:border-b-0 sm:p-4 xl:items-center xl:gap-4 ${selectionMode ? 'xl:grid-cols-[minmax(0,1fr)_10rem_10rem_8rem]' : 'xl:grid-cols-[minmax(0,1fr)_10rem_10rem_9rem]'}`}>
            <div className="flex min-w-0 items-center gap-3">
              <EventImage src={item.image} alt={item.name} className="h-14 w-20 shrink-0 rounded-md" />
              <div className="min-w-0 space-y-1">
                <h4 className="line-clamp-2 text-sm font-semibold text-(--admin-title)" title={item.name}>{item.name}</h4>
                <p className="truncate text-xs text-(--admin-ink)/65" title={item.location}>{item.location}</p>
                <p className="text-xs text-(--admin-ink)/65">{formatEventDate(item.event_date)}</p>
              </div>
            </div>
            <p className="text-xs text-(--admin-ink)/80">{item.category?.name}</p>
            <div><span className="inline-block rounded bg-(--admin-accent) px-2 py-1 text-xs text-(--admin-black)">{eventStatusLabel(item.status)}</span></div>
            {selectionMode ? <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold">
              <input type="checkbox" checked={selectedIds.has(String(item.id))} disabled={busy || !selectionInitialized} onChange={() => toggleDisplayedEvent(item.id)} className="size-4 shrink-0 cursor-pointer accent-(--admin-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed" />
              <span>{selectedIds.has(String(item.id)) ? 'Có' : 'Không'}</span>
            </label> : <div className="flex justify-end gap-2">
              <button className={adminButton} disabled={busy} onClick={() => { setEditing(item); setDeleting(null); setNotice('') }} aria-label={`Sửa ${item.name}`}><Pencil size={15} />Sửa</button>
              <button className={adminButton} disabled={busy} onClick={() => { setDeleting(item); setError('') }} aria-label={`Xóa ${item.name}`}><Trash2 size={15} />Xóa</button>
            </div>}
          </article>)}
        </div>
        {selectionMode && <div className="flex justify-end border-t border-(--admin-border) pt-5"><button type="button" className={adminPrimaryButton} disabled={busy || !selectionDirty} onClick={saveDisplayedEvents}><Save size={16} />{savingSelection ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div>}
      </>}
    </>}
  </div>
}
