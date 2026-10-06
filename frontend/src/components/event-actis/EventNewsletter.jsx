import { useId, useState } from 'react'
import { Mail, ShieldCheck, Send } from 'lucide-react'

export const EventNewsletter = ({ section }) => {
  const id = useId()
  const [form, setForm] = useState({ full_name: '', organization: '', email: '', consent: false })
  const extraFields = (Array.isArray(section?.form_fields) ? section.form_fields : []).filter((field) => !['full_name', 'organization', 'email', 'consent'].includes(field.id))
  const inputClass = 'w-full rounded border border-black/20 bg-white px-4 py-2.5 text-sm text-black shadow-sm placeholder:text-black/40 focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)'
  if (!section?.title) return null
  return <section aria-labelledby={`${id}-title`} className="relative mx-auto my-14 max-w-5xl overflow-hidden rounded-2xl bg-white p-6 text-black shadow-lg sm:p-10 lg:p-12">
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-(--color-brand-red) via-(--color-brand-gold) to-(--color-brand-red)" />
    <div className="grid items-center gap-8 lg:grid-cols-[5fr_7fr]">
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--color-brand-red)"><Mail size={16} aria-hidden="true" />{section.tag}</p>
        <h2 id={`${id}-title`} className="text-2xl font-bold tracking-tight text-(--color-brand-red) sm:text-3xl">{section.title}</h2>
        <p className="text-sm leading-relaxed text-black/70">{section.description}</p>
        <p className="flex items-start gap-2 text-xs text-black/60"><ShieldCheck size={16} className="shrink-0 text-(--color-brand-red)" aria-hidden="true" />{section.privacy_text}</p>
      </div>
      <div className="min-w-0 rounded-xl bg-(--color-brand-cream)/60 p-5 sm:p-6">
        <div role="form" aria-label="Đăng ký nhận bản tin sự kiện">
          <fieldset className="min-w-0 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1"><label htmlFor={`${id}-name`} className="block text-sm font-semibold">{section.full_name_label} <span aria-hidden="true" className="text-(--color-brand-red)">*</span></label><input id={`${id}-name`} name="full_name" autoComplete="name" required maxLength={255} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder={section.full_name_placeholder} className={inputClass} /></div>
              <div className="space-y-1"><label htmlFor={`${id}-organization`} className="block text-sm font-semibold">{section.organization_label}</label><input id={`${id}-organization`} name="organization" autoComplete="organization" maxLength={255} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder={section.organization_placeholder} className={inputClass} /></div>
            </div>
            <div className="space-y-1"><label htmlFor={`${id}-email`} className="block text-sm font-semibold">{section.email_label} <span aria-hidden="true" className="text-(--color-brand-red)">*</span></label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={section.email_placeholder} className={inputClass} /></div>
            {extraFields.map((field, index) => {
              const fieldKey = field.id || `custom_field_${index}`
              const fieldType = ['text', 'tel', 'email', 'number'].includes(field.type) ? field.type : 'text'
              return <div key={fieldKey} className="space-y-1">
                <label htmlFor={`${id}-${fieldKey}`} className="block text-sm font-semibold">{field.label || `Ô NHẬP #${index + 1}`}{field.required && <span aria-hidden="true" className="text-(--color-brand-red)"> *</span>}</label>
                {field.type === 'textarea' ? <textarea id={`${id}-${fieldKey}`} required={Boolean(field.required)} value={form[fieldKey] || ''} onChange={(e) => setForm({ ...form, [fieldKey]: e.target.value })} placeholder={field.placeholder || ''} className={inputClass} rows={3} /> : field.type === 'select' ? <select id={`${id}-${fieldKey}`} required={Boolean(field.required)} value={form[fieldKey] || ''} onChange={(e) => setForm({ ...form, [fieldKey]: e.target.value })} className={inputClass}><option value="">{field.placeholder || `Chọn ${field.label}`}</option>{(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input id={`${id}-${fieldKey}`} type={fieldType} required={Boolean(field.required)} value={form[fieldKey] || ''} onChange={(e) => setForm({ ...form, [fieldKey]: e.target.value })} placeholder={field.placeholder || ''} className={inputClass} />}
              </div>
            })}
            <label className="flex cursor-pointer items-start gap-2 py-1 text-sm leading-5 text-black/75"><input name="consent" type="checkbox" required checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 size-4 shrink-0 accent-(--color-brand-red) focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)" /><span>{section.consent_text}</span></label>
            <button type="button" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-(--color-brand-red) px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-gold)"><Send size={18} aria-hidden="true" />{section.button_text}</button>
          </fieldset>
        </div>
      </div>
    </div>
  </section>
}
export default EventNewsletter
