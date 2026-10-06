import { useEffect, useRef, useState } from 'react'
import { EventAPI } from '../../../api/eventApi.js'
import { adminButton, adminPanel, adminPrimaryButton } from '../../../config/Admin/adminEvents.js'
import { eventError, requireEventData } from '../../../api/eventApi.js'
import Field from './EventField.jsx'

export default function EventCategories({ onCreated }) {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const busy = useRef(false)
  useEffect(() => {
    const controller = new AbortController()
    EventAPI.getCategories({ signal: controller.signal }).then((response) => {
      if (!controller.signal.aborted) setCategories(requireEventData(response, true))
    }).catch((err) => { if (!controller.signal.aborted) setError(eventError(err)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])
  const add = async (e) => {
    e.preventDefault()
    if (!name.trim() || busy.current) return
    busy.current = true; setSaving(true); setError(''); setNotice('')
    try {
      const category = requireEventData(await EventAPI.createCategory({ name: name.trim() }))
      if (!category.id) throw new Error('Phản hồi chuyên mục không hợp lệ.')
      setCategories((current) => [...current, category]); setName(''); setNotice('Đã thêm chuyên mục.')
      onCreated?.()
    } catch (err) { setError(eventError(err)) }
    finally { busy.current = false; setSaving(false) }
  }
  return <section className={`${adminPanel} space-y-4`}>
    <h3 className="font-semibold text-(--admin-title)">Chuyên mục sự kiện</h3>
    {error && <div role="alert" className="space-y-2"><p>{error}</p><button className={adminButton} onClick={() => { setLoading(true); setError(''); setAttempt((value) => value + 1) }}>Tải lại chuyên mục</button></div>}
    {notice && <p role="status">{notice}</p>}
    {loading ? <p role="status">Đang tải chuyên mục…</p> : <>
      <ul className="flex flex-wrap gap-2">{categories.map((category) => <li key={category.id} className="rounded-lg border border-(--admin-border) px-3 py-2 text-sm">{category.name}</li>)}</ul>
      {!categories.length && !error && <p className="text-sm">Chưa có chuyên mục.</p>}
      <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1"><Field label="Tên chuyên mục mới" required maxLength={255} value={name} onChange={setName} disabled={saving} /></div>
        <button className={adminPrimaryButton} disabled={saving || !name.trim()}>{saving ? 'Đang thêm…' : 'Thêm chuyên mục'}</button>
      </form>
    </>}
  </section>
}
