import { useState } from 'react'
import { ChevronDown, FilePenLine, LayoutGrid, Mail, MessageSquareText, Phone, Send, ShieldCheck } from 'lucide-react'
import Icon from '../shared/Icon.jsx'

const inputClass = 'w-full rounded-[4px] bg-[var(--contact-cream)] pl-10 pr-3 text-base text-black placeholder:text-black outline-none focus:bg-white focus:ring-2 focus:ring-[var(--contact-gold)] motion-safe:transition-colors'
const inputIconClass = 'pointer-events-none absolute top-3.5 left-3 text-[var(--contact-gold)]'

// Keep repeated label, icon and validation markup together within this form.
function Field({ id, label, required = false, icon, error, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="flex items-start justify-between gap-2 text-sm font-semibold">
        {label}{required && <span aria-hidden="true" className="text-[var(--contact-red)]">*</span>}
      </label>
      <div className="relative">{children}<span className={inputIconClass}>{icon}</span></div>
      {error && <p id={`${id}-error`} className="text-sm text-[var(--contact-red)]">{error}</p>}
    </div>
  )
}

export default function ContactForm({ categories, contact }) {
  const [errors, setErrors] = useState({})
  const [attempted, setAttempted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const nextErrors = {}
    if (!values.get('fullName').trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên.'
    if (!values.get('message').trim()) nextErrors.message = 'Vui lòng nhập nội dung lời nhắn.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setAttempted(false)
      form.elements.namedItem(Object.keys(nextErrors)[0]).focus()
      return
    }
    // No contact endpoint exists yet. Preserve the values and never claim delivery.
    setAttempted(true)
  }

  function clearFieldError(event) {
    const name = event.target.name
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
    setAttempted(false)
  }

  return (
    <section aria-labelledby="contact-form-title" className="relative min-w-0 rounded-lg bg-white p-6 shadow-md lg:col-span-7 lg:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex h-1.5 justify-between overflow-hidden rounded-t-lg bg-[var(--contact-red)]">
        <span className="w-32 bg-[var(--contact-gold)]" /><span className="w-12 bg-[var(--contact-gold)]" />
      </div>
      <div className="pb-6">
        <p className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--contact-red)] uppercase">
          <FilePenLine size={20} aria-hidden="true" className="shrink-0 text-[var(--contact-gold)]" />Cổng Tiếp Nhận Trực Tuyến
        </p>
        <h2 id="contact-form-title" className="text-2xl leading-tight font-bold tracking-tight text-[var(--contact-red)] uppercase md:text-[32px] md:leading-10">Gửi phản hồi hoặc yêu cầu tư vấn</h2>
        <p className="mt-2">Quý vị vui lòng để lại thông tin và nội dung cần tư vấn để Ban Thư ký Trung tâm hỗ trợ.</p>
      </div>
      <form onSubmit={handleSubmit} onChange={clearFieldError} className="flex flex-col gap-4" aria-describedby="contact-form-availability">
        <p className="text-xs">Các trường có dấu <span className="font-bold text-[var(--contact-red)]">*</span> là bắt buộc.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="contact-fullName" label="Họ và tên" required icon={<Icon name="person" />} error={errors.fullName}>
            <input id="contact-fullName" name="fullName" type="text" autoComplete="name" required placeholder="Ví dụ: Nguyễn Văn An" className={`${inputClass} h-12`} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'contact-fullName-error' : undefined} />
          </Field>
          <Field id="contact-email" label="Địa chỉ Email" required icon={<Mail size={20} aria-hidden="true" />}>
            <input id="contact-email" name="email" type="email" autoComplete="email" required placeholder="name@domain.com" className={`${inputClass} h-12`} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="contact-phone" label="Số điện thoại liên hệ" icon={<Phone size={20} aria-hidden="true" />}>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="Ví dụ: 0912 345 678" className={`${inputClass} h-12`} />
          </Field>
          <Field id="contact-category" label="Lĩnh vực quan tâm" icon={<LayoutGrid size={20} aria-hidden="true" />}>
            <select id="contact-category" name="category" defaultValue={categories[0]?.value} className={`${inputClass} h-12 cursor-pointer appearance-none pr-10`}>
              {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select>
            <ChevronDown size={20} aria-hidden="true" className="pointer-events-none absolute top-3.5 right-3 text-[var(--contact-gold)]" />
          </Field>
        </div>
        <Field id="contact-message" label="Nội dung lời nhắn / Đề xuất chi tiết" required icon={<MessageSquareText size={20} aria-hidden="true" />} error={errors.message}>
          <textarea id="contact-message" name="message" rows={5} required placeholder="Quý vị vui lòng mô tả tóm tắt nội dung đề xuất, nguyện vọng hợp tác, hoặc các thông số đề cử kỷ lục cụ thể để Ban Thư ký chuẩn bị phương án tốt nhất..." className={`${inputClass} min-h-40 resize-y py-3 leading-relaxed`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} />
        </Field>
        <div className="pt-2">
          <button type="submit" className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-[4px] bg-[var(--contact-red)] px-6 py-3 text-base font-bold text-white shadow-md hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--contact-gold)] motion-safe:transition-shadow sm:w-auto sm:px-8 sm:text-lg">
            <span aria-hidden="true" className="h-4 w-1 shrink-0 rounded-full bg-[var(--contact-gold)]" />
            GỬI LỜI NHẮN NGAY
            <Send size={20} aria-hidden="true" className="shrink-0 text-[var(--contact-gold)] motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
          </button>
        </div>
        <div id="contact-form-availability" className="rounded-[4px] bg-[var(--contact-cream)] p-3 text-sm leading-relaxed">
          <p>Biểu mẫu hiện chưa tiếp nhận trực tuyến. Quý vị vui lòng liên hệ qua <a href={contact.phoneHref} className="rounded-sm font-semibold text-[var(--contact-red)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--contact-gold)]">hotline</a> hoặc <a href={`mailto:${contact.emails[0]}`} className="rounded-sm font-semibold text-[var(--contact-red)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--contact-gold)]">email Ban Thư ký</a>.</p>
        </div>
        <div role="status" aria-live="polite" aria-atomic="true">
          {attempted && <p className="rounded-[4px] border border-[var(--contact-red)] p-3 text-sm text-[var(--contact-red)]">Lời nhắn chưa được gửi. Thông tin đã nhập vẫn được giữ trên biểu mẫu để quý vị có thể sao chép và gửi qua email.</p>}
        </div>
        <div className="flex items-start gap-2 rounded-[4px] bg-[var(--contact-cream)] p-3 text-sm leading-relaxed">
          <ShieldCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--contact-gold)]" />
          <p><strong className="font-semibold">Thông tin liên hệ:</strong> Nội dung đang nhập chỉ được giữ trên trang, chưa được gửi hoặc lưu vào hệ thống. Quý vị có thể liên hệ trực tiếp Ban Thư ký để được hướng dẫn tiếp nhận hồ sơ.</p>
        </div>
      </form>
    </section>
  )
}
