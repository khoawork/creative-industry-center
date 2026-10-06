import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { EventAPI } from '../../../api/eventApi.js'
import { adminButton, adminPanel, adminPrimaryButton } from '../../../config/Admin/adminEvents.js'
import { eventError, requireEventData } from '../../../api/eventApi.js'
import Field from './EventField.jsx'

export default function EventCategories({ onChanged }) {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [deleting, setDeleting] = useState(null)
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
      onChanged?.()
    } catch (err) { setError(eventError(err)) }
    finally { busy.current = false; setSaving(false) }
  }
  const saveEdit = async (e) => {
    e.preventDefault()
    if (!editName.trim() || busy.current) return
    busy.current = true; setSaving(true); setError(''); setNotice('')
    try {
      const category = requireEventData(await EventAPI.updateCategory(editing, { name: editName.trim() }))
      if (category.id !== editing) throw new Error('Phản hồi chuyên mục không hợp lệ.')
      setCategories((current) => current.map((item) => item.id === editing ? category : item))
      setEditing(null); setNotice('Đã cập nhật chuyên mục.')
      onChanged?.()
    } catch (err) { setError(eventError(err)) }
    finally { busy.current = false; setSaving(false) }
  }
  const remove = async () => {
    if (busy.current || deleting === null) return
    busy.current = true; setSaving(true); setError(''); setNotice('')
    try {
      const response = await EventAPI.deleteCategory(deleting)
      if (response?.success !== true) throw new Error('Chưa xóa được chuyên mục. Vui lòng thử lại.')
      setCategories((current) => current.filter((item) => item.id !== deleting))
      setDeleting(null); setNotice('Đã xóa chuyên mục.')
      onChanged?.()
    } catch (err) { setError(eventError(err)) }
    finally { busy.current = false; setSaving(false) }
  }
  return <section className={`${adminPanel} space-y-4`}>
    <h3 className="font-semibold text-(--admin-title)">Chuyên mục sự kiện</h3>
    {error && <div role="alert" className="space-y-2"><p>{error}</p><button type="button" className={adminButton} disabled={saving} onClick={() => { setLoading(true); setError(''); setEditing(null); setDeleting(null); setAttempt((value) => value + 1) }}>Tải lại chuyên mục</button></div>}
    {notice && <p role="status">{notice}</p>}
    {loading ? <p role="status">Đang tải chuyên mục…</p> : <>
      <ul className="space-y-3">{categories.map((category) => <li key={category.id} className="min-w-0 text-sm">
        {editing === category.id ? <form onSubmit={saveEdit} className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="col-span-2 min-w-0 sm:col-span-1"><Field label="Tên chuyên mục" required maxLength={255} value={editName} onChange={setEditName} disabled={saving} autoFocus /></div>
          <button className={adminPrimaryButton} disabled={saving || !editName.trim() || editName.trim() === category.name}>Lưu chuyên mục</button>
          <button type="button" className={adminButton} disabled={saving} onClick={() => setEditing(null)}>Hủy sửa</button>
        </form> : <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
          <span className="flex min-h-10 min-w-0 items-center rounded-lg border border-(--admin-border) px-3 py-2 wrap-anywhere">{category.name}</span>
          <button type="button" className={adminButton} disabled={saving} aria-label={`Sửa chuyên mục ${category.name}`} onClick={() => { setEditing(category.id); setEditName(category.name); setDeleting(null); setError(''); setNotice('') }}>Sửa</button>
          <button type="button" className={adminButton} disabled={saving} aria-label={`Xóa chuyên mục ${category.name}`} onClick={() => { setDeleting(category.id); setEditing(null); setError(''); setNotice('') }}><Trash2 size={15} aria-hidden="true" />Xóa</button>
        </div>}
        {deleting === category.id && <div className="mt-3 space-y-3 border-t border-(--admin-border) pt-3">
          <p>Xóa chuyên mục “{category.name}”?</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={adminPrimaryButton} disabled={saving} onClick={remove}>{saving ? 'Đang xóa…' : 'Xác nhận xóa'}</button>
            <button type="button" className={adminButton} disabled={saving} onClick={() => setDeleting(null)}>Hủy xóa</button>
          </div>
        </div>}
      </li>)}</ul>
      {!categories.length && !error && <p className="text-sm">Chưa có chuyên mục.</p>}
      <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1"><Field label="Tên chuyên mục mới" required maxLength={255} value={name} onChange={setName} disabled={saving} /></div>
        <button className={adminPrimaryButton} disabled={saving || !name.trim()}>Thêm chuyên mục</button>
      </form>
    </>}
  </section>
}
