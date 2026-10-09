import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Save, X } from 'lucide-react'
import { IntroduceAPI } from '../../api/introduceApi.js'
import { aboutAdminTabs, emptyAboutSection } from '../../config/Admin/adminAbout.js'
import { AdminPageHeader, AdminTabs, AdminToast, AdminCard, AdminButton, AdminStickySaveBar } from '../../components/Admin/Common'
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
    IntroduceAPI.getIntroducePage(undefined, { signal: controller.signal }).then((response) => {
      if (controller.signal.aborted) return
      const page = response?.data
      if (response?.success !== true || !page || !page.props || typeof page.props !== 'object' || Array.isArray(page.props)) {
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
  return (
    <section className="space-y-5 font-inter text-(--admin-ink)">
      <AdminToast toast={toast ? { message: toast.message, type: toast.error ? 'error' : 'success' } : null} onClose={() => setToast(null)} />

      <AdminPageHeader
        badge="Khu vực quản trị nội dung"
        title="Quản lý Giới thiệu"
        description="Chỉnh sửa và lưu từng phần: Hero, Tổng quan, Tầm nhìn, Sứ mệnh, Giá trị cốt lõi, Định hướng hành động."
      />

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm font-semibold text-gray-500">Đang tải dữ liệu giới thiệu...</p>
        </div>
      ) : loadError ? (
        <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 space-y-3">
          <p className="text-sm">{loadError}</p>
          <button
            className={aboutAdminButton}
            onClick={() => { setLoading(true); setLoadError(''); setAttempt((value) => value + 1); }}
          >
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <AdminTabs
            tabs={aboutAdminTabs.map((tab) => ({
              id: tab.key,
              label: tab.label,
              icon: tab.icon,
              badge: dirtyKeys.includes(tab.key) ? '•' : null,
            }))}
            activeTab={active.key}
            onChange={(key) => selectTab(key)}
          />

          <AdminCard
            title={active.label}
            subtitle={active.description}
            actions={
              <AdminButton
                type="submit"
                form={`form-${active.key}`}
                variant="primary"
                size="sm"
                icon={Save}
                loading={saving === active.key}
                disabled={!dirty || Boolean(saving)}
              >
                {saving === active.key ? 'Đang lưu…' : 'Lưu thay đổi'}
              </AdminButton>
            }
          >
            <form id={`form-${active.key}`} ref={formRef} onSubmit={save} noValidate className="space-y-5">
              {!Object.hasOwn(saved, active.key) && (
                <p className="border-l-2 border-(--admin-accent) px-3 py-2 text-sm leading-5 bg-(--admin-background)/50 rounded-r-lg">
                  Chưa có nội dung. Nhập và lưu để tạo mới.
                </p>
              )}
              {typeof errors._schema === 'string' && (
                <p role="alert" className="text-sm text-red-600 font-semibold">{errors._schema}</p>
              )}
              <fieldset disabled={Boolean(saving)} className="min-w-0 space-y-5 disabled:opacity-60">
                {editable && Editor ? (
                  <Editor value={drafts[active.key]} onChange={update} errors={errors} />
                ) : (
                  <p>Dữ liệu không hợp lệ. Vui lòng nhập lại.</p>
                )}
                {(!editable || Object.keys(errors).length > 0) && (
                  <div className="flex items-center justify-start border-t border-(--admin-border) pt-4">
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => { if (window.confirm('Xóa bản nháp phần này để nhập lại?')) update(emptyAboutSection(active.key)) }}
                    >
                      Nhập lại phần này
                    </AdminButton>
                  </div>
                )}
              </fieldset>
            </form>
          </AdminCard>
          <AdminStickySaveBar
            form={`form-${active.key}`}
            type="submit"
            isSaving={saving === active.key}
            disabled={!dirty || Boolean(saving)}
            buttonText="Lưu thay đổi"
            savingText="Đang lưu…"
            hintMessage="Nhấn lưu để đồng bộ thông tin giới thiệu ra ngoài website."
          />
        </>
      )}
    </section>
  );
}
