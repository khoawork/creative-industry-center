import { useId, useRef, useState } from 'react'
import { Mail, ShieldCheck, Send, CheckCircle2 } from 'lucide-react'
import { EventAPI, eventError } from '../../api/eventApi.js'
import { EVENTS_PAGE_ID } from '../../config/Events/eventsConfig.js'

export const EventNewsletter = ({ section }) => {
  const id = useId()
  const busy = useRef(false)
  const [form, setForm] = useState({ full_name: '', organization: '', email: '', consent: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputClass = 'w-full rounded border border-transparent bg-white px-4 py-2.5 text-sm text-black shadow-sm placeholder:text-black/40 focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)'
  const submit = async (e) => {
    e.preventDefault()
    if (busy.current) return
    if (!form.full_name.trim() || !form.consent) { setError('Vui lòng nhập họ tên và đồng ý nhận thông tin.'); return }
    busy.current = true; setSaving(true); setError('')
    try {
      const response = await EventAPI.subscribeNewsletter(EVENTS_PAGE_ID, { ...form, full_name: form.full_name.trim(), organization: form.organization.trim(), email: form.email.trim() })
      if (response?.success !== true) throw new Error('Chưa gửi được đăng ký. Vui lòng thử lại.')
      setSubmitted(true)
      setForm({ full_name: '', organization: '', email: '', consent: false })
    } catch (err) { setError(eventError(err)) }
    finally { busy.current = false; setSaving(false) }
  }
  if (!section?.title) return null
  return <section aria-labelledby={`${id}-title`} className="relative mx-auto my-14 max-w-5xl overflow-hidden rounded-2xl bg-white p-6 shadow-lg sm:p-10 lg:p-12">
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-(--color-brand-red) via-(--color-brand-gold) to-(--color-brand-red)" />
    <div className="grid items-center gap-8 lg:grid-cols-[5fr_7fr]">
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--color-brand-red)"><Mail size={16} aria-hidden="true" />{section.tag}</p>
        <h2 id={`${id}-title`} className="text-2xl font-bold tracking-tight text-(--color-brand-red) sm:text-3xl">{section.title}</h2>
        <p className="text-sm leading-relaxed text-black/70">{section.description}</p>
        <p className="flex items-start gap-2 text-xs text-black/60"><ShieldCheck size={16} className="shrink-0 text-(--color-brand-red)" aria-hidden="true" />{section.privacy_text}</p>
      </div>
      <div className="min-w-0 rounded-xl bg-(--color-brand-cream)/60 p-5 sm:p-6">
        {submitted ? <div role="status" className="space-y-3 py-8 text-center"><CheckCircle2 className="mx-auto size-10 text-(--color-brand-red)" aria-hidden="true" /><p className="text-sm leading-6">{section.success_message}</p></div> : <form onSubmit={submit} aria-label="Đăng ký nhận bản tin sự kiện" aria-busy={saving}>
          <fieldset disabled={saving} className="min-w-0 space-y-4 disabled:opacity-60">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1"><label htmlFor={`${id}-name`} className="block text-sm font-semibold">{section.full_name_label} <span aria-hidden="true" className="text-(--color-brand-red)">*</span></label><input id={`${id}-name`} name="full_name" autoComplete="name" required maxLength={255} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder={section.full_name_placeholder} className={inputClass} /></div>
              <div className="space-y-1"><label htmlFor={`${id}-organization`} className="block text-sm font-semibold">{section.organization_label}</label><input id={`${id}-organization`} name="organization" autoComplete="organization" maxLength={255} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder={section.organization_placeholder} className={inputClass} /></div>
            </div>
            <div className="space-y-1"><label htmlFor={`${id}-email`} className="block text-sm font-semibold">{section.email_label} <span aria-hidden="true" className="text-(--color-brand-red)">*</span></label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={section.email_placeholder} className={inputClass} /></div>
            <label className="flex cursor-pointer items-start gap-2 py-1 text-sm leading-5 text-black/75"><input name="consent" type="checkbox" required checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 size-4 shrink-0 accent-(--color-brand-red) focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)" /><span>{section.consent_text}</span></label>
            {error && <p role="alert" className="text-sm text-(--color-brand-red)">{error}</p>}
            <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-(--color-brand-red) px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-gold)"><Send size={18} aria-hidden="true" />{saving ? 'Đang gửi đăng ký…' : section.button_text}</button>
          </fieldset>
        </form>}
      </div>
    </div>
  </section>
}
export default EventNewsletter
