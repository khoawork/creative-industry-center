import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Save, X } from 'lucide-react'
import { IntroduceAPI } from '../../api/introduceApi.js'
import { INTRODUCE_PAGE_ID } from '../../config/About/aboutConfig.js'
import { aboutAdminButton, aboutAdminPrimaryButton, aboutAdminTabs, emptyAboutSection } from '../../config/Admin/adminAbout.js'
import HeroEditor from '../../components/Admin/About/HeroEditor.jsx'
import OverviewEditor from '../../components/Admin/About/OverviewEditor.jsx'
import VisionEditor from '../../components/Admin/About/VisionEditor.jsx'
import MissionEditor from '../../components/Admin/About/MissionEditor.jsx'
import CoreValuesEditor from '../../components/Admin/About/CoreValuesEditor.jsx'
import ActionsEditor from '../../components/Admin/About/ActionsEditor.jsx'

const editors = {
  hero_section: HeroEditor, overview_section: OverviewEditor, vision_section: VisionEditor,
  mission_section: MissionEditor, core_values_section: CoreValuesEditor, actions_section: ActionsEditor,
}
const saveSection = {
  hero_section: IntroduceAPI.updateHeroSection, overview_section: IntroduceAPI.updateOverviewSection,
  vision_section: IntroduceAPI.updateVisionSection, mission_section: IntroduceAPI.updateMissionSection,
  core_values_section: IntroduceAPI.updateCoreValuesSection, actions_section: IntroduceAPI.updateActionsSection,
}
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export default function AdminAbout() {
  const [params, setParams] = useSearchParams()
  const active = aboutAdminTabs.find((tab) => tab.key === params.get('tab')) || aboutAdminTabs[0]
  const [saved, setSaved] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [saving, setSaving] = useState(null)
  const [toast, setToast] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const writeRequest = useRef(null)
  const pageId = useRef(null)
  const formRef = useRef(null)
  const dirtyKeys = saved ? aboutAdminTabs.filter(({ key }) => !equal(drafts[key], Object.hasOwn(saved, key) ? saved[key] : emptyAboutSection(key))).map(({ key }) => key) : []
  const dirty = dirtyKeys.includes(active.key)

  useEffect(() => {
    const controller = new AbortController()
    IntroduceAPI.getIntroducePage(INTRODUCE_PAGE_ID, { signal: controller.signal }).then((response) => {
      if (controller.signal.aborted) return
      const page = response?.data
      if (response?.success !== true || page?.id !== INTRODUCE_PAGE_ID || page?.slug !== 'introduce'
        || !page.props || typeof page.props !== 'object' || Array.isArray(page.props)) {
        throw new Error(response?.message || 'Dữ liệu không hợp lệ.')
      }
      pageId.current = page.id
      setSaved(page.props)
      setDrafts(Object.fromEntries(aboutAdminTabs.map(({ key }) => [key,
        Object.hasOwn(page.props, key) ? structuredClone(page.props[key]) : emptyAboutSection(key),
      ])))
    }).catch((error) => {
      if (!controller.signal.aborted) setLoadError(error.response?.data?.message || error.message || 'Không thể tải nội dung.')
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [attempt])

  useEffect(() => () => writeRequest.current?.abort(), [])
  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const update = (value) => {
    setDrafts((current) => ({ ...current, [active.key]: value }))
    setFieldErrors((current) => ({ ...current, [active.key]: {} }))
  }
  const save = async (event) => {
    event.preventDefault()
    if (writeRequest.current || !dirty || loading || !saved) return
    const key = active.key
    if (!formRef.current.reportValidity()) return
    setFieldErrors((current) => ({ ...current, [key]: {} }))
    const controller = new AbortController()
    writeRequest.current = controller
    setSaving(key)
    setToast(null)
    try {
      const response = await saveSection[key](pageId.current, drafts[key], { signal: controller.signal })
      if (controller.signal.aborted) return
      const section = response?.data
      if (response?.success !== true || !section || typeof section !== 'object' || Array.isArray(section)
        || Object.keys(drafts[key]).some((field) => !Object.hasOwn(section, field))) {
        throw new Error(response?.message || 'Chưa lưu được. Vui lòng thử lại.')
      }
      setSaved((current) => ({ ...current, [key]: section }))
      setDrafts((current) => ({ ...current, [key]: structuredClone(section) }))
      setToast({ message: 'Đã lưu thay đổi.' })
    } catch (error) {
      if (controller.signal.aborted) return
      setFieldErrors((current) => ({ ...current, [key]: error.response?.data?.error?.details || {} }))
      setToast({ error: true, message: error.response?.data?.message || (error.code === 'ERR_NETWORK' ? 'Không thể kết nối máy chủ.' : error.message) })
    } finally {
      if (writeRequest.current === controller) writeRequest.current = null
      if (!controller.signal.aborted) setSaving(null)
    }
  }
  const selectTab = (key) => setParams((current) => { current.set('tab', key); return current }, { replace: true })
  const tabKeyDown = (event, index) => {
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? aboutAdminTabs.length - 1
      : event.key === 'ArrowRight' ? (index + 1) % aboutAdminTabs.length
        : event.key === 'ArrowLeft' ? (index + aboutAdminTabs.length - 1) % aboutAdminTabs.length : null
    if (next === null) return
    event.preventDefault()
    selectTab(aboutAdminTabs[next].key)
    document.getElementById(`tab-${aboutAdminTabs[next].key}`)?.focus()
  }
  const Editor = editors[active.key]
  const errors = fieldErrors[active.key] || {}
  const editable = drafts[active.key] && typeof drafts[active.key] === 'object' && !Array.isArray(drafts[active.key])
  return <section className="space-y-5 font-inter text-(--admin-ink) [--admin-background:var(--color-brand-cream)] [--admin-surface:var(--admin-white)] [--admin-ink:var(--admin-black)] [--admin-heading:var(--color-brand-red)] [--admin-title:var(--color-brand-red)] [--admin-border:rgb(0_0_0/0.15)] [[data-theme=dark]_&]:[--admin-background:rgb(255_255_255/0.06)] [[data-theme=dark]_&]:[--admin-surface:var(--admin-black)] [[data-theme=dark]_&]:[--admin-ink:var(--color-brand-cream)] [[data-theme=dark]_&]:[--admin-heading:var(--color-brand-gold)] [[data-theme=dark]_&]:[--admin-title:var(--admin-white)] [[data-theme=dark]_&]:[--admin-border:rgb(212_149_32/0.25)]">
    <div className="border-b border-(--admin-border) pb-5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--admin-heading)">Khu vực quản trị nội dung</p>
      <h1 className="text-2xl font-semibold tracking-tight text-(--admin-title) sm:text-3xl">Quản lý Giới thiệu</h1>
      <p className="mt-2 text-sm leading-6 text-(--admin-ink)/70">Chỉnh sửa và lưu từng phần.</p>
    </div>
    {loading ? <p role="status">Đang tải…</p> : loadError ? <div role="alert" className="space-y-3"><p>{loadError}</p><button className={aboutAdminButton} onClick={() => { setLoading(true); setLoadError(''); setAttempt((value) => value + 1) }}>Thử lại</button></div> : <>
      <div role="tablist" aria-label="Các phần giới thiệu" className="flex max-w-full gap-1 overflow-x-auto border-b border-(--admin-border) bg-(--admin-surface) px-2 [scrollbar-width:thin]">
        {aboutAdminTabs.map((tab, index) => {
          const TabIcon = tab.icon
          return <button key={tab.key} type="button" role="tab" id={`tab-${tab.key}`} aria-controls={`panel-${tab.key}`} aria-selected={active.key === tab.key} tabIndex={active.key === tab.key ? 0 : -1} onClick={() => selectTab(tab.key)} onKeyDown={(event) => tabKeyDown(event, index)} className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3 text-sm font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--color-brand-gold) ${active.key === tab.key ? 'border-(--color-brand-gold) text-(--admin-title)' : 'border-transparent text-(--admin-ink)/70 hover:bg-(--admin-background) hover:text-(--admin-heading)'}`}>
            <TabIcon size={14} aria-hidden="true" />{tab.label}{dirtyKeys.includes(tab.key) && <span aria-label="chưa lưu">•</span>}
          </button>
        })}
      </div>
      <div role="tabpanel" id={`panel-${active.key}`} aria-labelledby={`tab-${active.key}`} className="rounded-xl border border-(--admin-border) bg-(--admin-surface) p-5 sm:p-6">
        <div className="mb-5 space-y-1">
          <h2 className="text-lg font-semibold text-(--admin-title)">{active.label}</h2>
          <p className="text-sm leading-5 text-(--admin-ink)/70">{active.description}</p>
        </div>
        <form ref={formRef} onSubmit={save} noValidate className="space-y-5">
          {!Object.hasOwn(saved, active.key) && <p className="border-l-2 border-(--color-brand-gold) px-3 py-2 text-sm leading-5">Chưa có nội dung. Nhập và lưu để tạo mới.</p>}
          {typeof errors._schema === 'string' && <p role="alert" className="text-sm text-(--admin-heading)">{errors._schema}</p>}
          <fieldset disabled={Boolean(saving)} className="min-w-0 space-y-5 disabled:opacity-60">
            {editable && Editor ? <Editor value={drafts[active.key]} onChange={update} errors={errors} /> : <p>Dữ liệu không hợp lệ. Vui lòng nhập lại.</p>}
            <div className="flex justify-end border-t border-(--admin-border) pt-4">
              <button type="submit" disabled={!dirty || Boolean(saving)} className={aboutAdminPrimaryButton}><Save size={14} aria-hidden="true" />{saving === active.key ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
            </div>
            {(!editable || Object.keys(errors).length > 0) && <button type="button" className={aboutAdminButton} onClick={() => { if (window.confirm('Xóa bản nháp phần này để nhập lại?')) update(emptyAboutSection(active.key)) }}>Nhập lại phần này</button>}
          </fieldset>
        </form>
      </div>
    </>}
    {toast && <div className="fixed right-4 bottom-4 z-40 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-lg border border-(--admin-heading) bg-(--admin-surface) p-4 text-(--admin-ink) shadow-lg sm:right-6 sm:bottom-6">
      {toast.error
        ? <AlertCircle size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-(--admin-heading)" />
        : <CheckCircle2 size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-(--admin-heading)" />}
      <p role={toast.error ? 'alert' : 'status'} aria-atomic="true" className="min-w-0 flex-1 text-sm leading-6 wrap-anywhere">{toast.message}</p>
      <button type="button" aria-label="Đóng thông báo" onClick={() => setToast(null)} className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-(--admin-ink)/70 hover:bg-(--admin-background) hover:text-(--admin-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-gold)"><X size={18} aria-hidden="true" /></button>
    </div>}
  </section>
}
