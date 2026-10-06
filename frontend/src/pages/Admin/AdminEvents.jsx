import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Save, X } from 'lucide-react'
import { EventAPI } from '../../api/eventApi.js'
import { EVENTS_PAGE_ID } from '../../config/Events/eventsConfig.js'
import { eventsAdminTabs, eventSectionDraft } from '../../config/Admin/adminEvents.js'
import { adminButton, adminContentTheme, adminPanel, adminPrimaryButton } from '../../config/Admin/adminEvents.js'
import { eventError, requireEventData } from '../../api/eventApi.js'
import PageSectionFields from '../../components/Admin/Events/PageSectionFields.jsx'
import EventCategories from '../../components/Admin/Events/EventCategories.jsx'
import EventManager from '../../components/Admin/Events/EventManager.jsx'

export default function AdminEvents() {
  const [params, setParams] = useSearchParams()
  const active = eventsAdminTabs.find((tab) => tab.key === params.get('tab')) || eventsAdminTabs[0]
  const [saved, setSaved] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [saving, setSaving] = useState(false)
  const [listVersion, setListVersion] = useState(0)
  const busy = useRef(false)
  const tabRefs = useRef([])
  const [pageId, setPageId] = useState(EVENTS_PAGE_ID)
  const dirtyKeys = saved ? eventsAdminTabs.filter(({ key }) => key !== 'events' && JSON.stringify(drafts[key]) !== JSON.stringify(eventSectionDraft(key, saved[key]))).map(({ key }) => key) : []
  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast])
  useEffect(() => {
    const controller = new AbortController()
    EventAPI.getPage(EVENTS_PAGE_ID, { signal: controller.signal }).then((response) => {
      if (controller.signal.aborted) return
      const page = requireEventData(response)
      if (page.slug !== 'events' || !page.props || typeof page.props !== 'object' || Array.isArray(page.props)) throw new Error('Nội dung trang Sự kiện không hợp lệ.')
      setPageId(page.id)
      setSaved(page.props)
      setDrafts(Object.fromEntries(eventsAdminTabs.filter(({ key }) => key !== 'events').map(({ key }) => [key, eventSectionDraft(key, page.props[key])])))
    }).catch((err) => { if (!controller.signal.aborted) setLoadError(eventError(err)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])
  useEffect(() => {
    if (!dirtyKeys.length) return
    const warn = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirtyKeys.length])
  const selectTab = (key) => {
    setToast(null)
    setParams((current) => { const next = new URLSearchParams(current); next.set('tab', key); return next }, { replace: true })
  }
  const save = async (e) => {
    e.preventDefault()
    if (busy.current || !dirtyKeys.includes(active.key)) return
    const key = active.key
    busy.current = true; setSaving(true); setToast(null)
    try {
      let response
      if (key === 'hero_section') response = await EventAPI.updateHeroSection(pageId, drafts[key])
      else if (key === 'filter_section') response = await EventAPI.updateFilterSection(pageId, drafts[key])
      else if (key === 'newsletter_section') response = await EventAPI.updateNewsletterSection(pageId, drafts[key])
      else return
      const data = requireEventData(response)
      if (Object.keys(drafts[key]).some((field) => !Object.hasOwn(data, field))) throw new Error('Phản hồi lưu nội dung không đầy đủ.')
      setSaved((current) => ({ ...current, [key]: data }))
      setDrafts((current) => ({ ...current, [key]: eventSectionDraft(key, data) }))
      setToast({ message: 'Đã lưu thay đổi.' })
    } catch (err) {
      const details = err.response?.data?.error?.details
      const messages = (value) => typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(messages) : []
      setToast({ error: true, message: [eventError(err), ...new Set(messages(details))].join(' ') })
    } finally { busy.current = false; setSaving(false) }
  }
  return <section className={`${adminContentTheme} space-y-5`}>
    <header className="border-b border-(--admin-border) pb-5">
      <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--admin-heading)">Khu vực quản trị nội dung</p><h1 className="text-2xl font-semibold text-(--admin-title) sm:text-3xl">Quản lý Sự kiện</h1><p className="mt-2 text-sm text-(--admin-ink)/70">Chỉnh sửa từng phần theo thứ tự hiển thị trên trang Sự kiện.</p></div>
    </header>
    <div role="tablist" aria-label="Quản lý trang Sự kiện" className="my-6 flex max-w-full gap-1 overflow-x-auto border-b border-(--admin-border) bg-(--admin-surface) p-1 [scrollbar-width:none]">
      {eventsAdminTabs.map((tab, index) => {
        const IconComponent = tab.icon
        const isSelected = active.key === tab.key
        return <button key={tab.key} ref={(node) => { tabRefs.current[index] = node }} type="button" id={`events-tab-${tab.key}`} role="tab" aria-selected={isSelected} aria-controls={`events-panel-${tab.key}`} tabIndex={isSelected ? 0 : -1} disabled={saving} onClick={() => selectTab(tab.key)} onKeyDown={(event) => {
          let nextIndex
          if (event.key === 'ArrowRight') nextIndex = (index + 1) % eventsAdminTabs.length
          else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + eventsAdminTabs.length) % eventsAdminTabs.length
          else if (event.key === 'Home') nextIndex = 0
          else if (event.key === 'End') nextIndex = eventsAdminTabs.length - 1
          else return
          event.preventDefault()
          selectTab(eventsAdminTabs[nextIndex].key)
          tabRefs.current[nextIndex]?.focus()
        }} className={`flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border-b-2 px-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--admin-heading) ${isSelected ? 'border-(--admin-accent) text-(--admin-title)' : 'border-transparent text-(--admin-heading) hover:bg-(--admin-background)'}`}><IconComponent size={16} /><span>{tab.label}</span>{dirtyKeys.includes(tab.key) && <span aria-label="chưa lưu"> •</span>}</button>
      })}
    </div>
    {eventsAdminTabs.map((tab) => <div key={tab.key} role="tabpanel" id={`events-panel-${tab.key}`} aria-labelledby={`events-tab-${tab.key}`} hidden={active.key !== tab.key}>
      {tab.key === 'events' ? loading ? <p role="status">Đang tải nội dung trang…</p> : loadError ? <div role="alert" className={`${adminPanel} space-y-3`}><p>{loadError}</p><button className={adminButton} onClick={() => { setLoading(true); setLoadError(''); setAttempt((value) => value + 1) }}>Thử lại</button></div> : <EventManager selectionMode reloadKey={listVersion} pageId={pageId} displayedEventIds={saved?.displayed_events?.event_ids} onDisplayedEventsSaved={(data) => setSaved((current) => ({ ...current, displayed_events: data }))} /> : active.key === tab.key && <div className="space-y-5">
        {loading ? <p role="status">Đang tải nội dung trang…</p> : loadError ? <div role="alert" className={`${adminPanel} space-y-3`}><p>{loadError}</p><button className={adminButton} onClick={() => { setLoading(true); setLoadError(''); setAttempt((value) => value + 1) }}>Thử lại</button></div> : <form onSubmit={save} className={`${adminPanel} space-y-5`}>
          <h2 className="text-lg font-semibold text-(--admin-title)">{tab.label}</h2>
          {!saved?.[tab.key] && <p className="border-l-2 border-(--admin-accent) pl-3 text-sm">Phần này chưa có nội dung. Nhập và lưu để hiển thị trên trang Sự kiện.</p>}
          <fieldset disabled={saving} className="min-w-0 space-y-5 disabled:opacity-60">
            <PageSectionFields section={tab.key} value={drafts[tab.key]} onChange={(value) => { setDrafts((current) => ({ ...current, [tab.key]: value })); setToast(null) }} />
            <div className="flex justify-end border-t border-(--admin-border) pt-4"><button className={adminPrimaryButton} disabled={!dirtyKeys.includes(tab.key)}><Save size={16} />{saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div>
          </fieldset>
        </form>}
        {tab.key === 'filter_section' && <EventCategories onCreated={() => setListVersion((value) => value + 1)} />}
      </div>}
    </div>)}
    {toast && <div className="fixed right-4 bottom-4 z-40 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-lg border border-(--admin-heading) bg-(--admin-surface) p-4 text-(--admin-ink) shadow-lg sm:right-6 sm:bottom-6">
      {toast.error ? <AlertCircle size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-(--admin-heading)" /> : <CheckCircle2 size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-(--admin-heading)" />}
      <p role={toast.error ? 'alert' : 'status'} aria-atomic="true" className="min-w-0 flex-1 text-sm leading-6 wrap-anywhere">{toast.message}</p>
      <button type="button" aria-label="Đóng thông báo" onClick={() => setToast(null)} className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-(--admin-ink)/70 hover:bg-(--admin-background) hover:text-(--admin-ink) focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)"><X size={18} aria-hidden="true" /></button>
    </div>}
  </section>
}
