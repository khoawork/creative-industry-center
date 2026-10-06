import { useState } from 'react'
import { ChevronDown, FilePenLine, LayoutGrid, Mail, MessageSquareText, Phone, Send, ShieldCheck } from 'lucide-react'
import Icon from '../shared/Icon.jsx'
import ContactAvailabilityMessage from './ContactAvailabilityMessage.jsx'

const inputClass = 'w-full rounded-[4px] border border-black/25 bg-[var(--contact-cream)] pl-10 pr-3 text-base text-black placeholder:text-black/50 outline-none focus:border-black/40 focus:bg-white focus:ring-2 focus:ring-[var(--contact-gold)] motion-safe:transition-colors'
const inputIconClass = 'pointer-events-none absolute top-3.5 left-3 text-[var(--contact-gold)]'
const fieldIcons = {
  fullName: <Icon name="person" />,
  email: <Mail size={20} aria-hidden="true" />,
  phone: <Phone size={20} aria-hidden="true" />,
  category: <LayoutGrid size={20} aria-hidden="true" />,
  message: <MessageSquareText size={20} aria-hidden="true" />,
}

function Field({ id, label, required = false, icon, error, children, className = '' }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="flex items-start gap-1 text-sm font-semibold">
        {label}{required && <span aria-hidden="true" className="text-[var(--contact-red)]">*</span>}
      </label>
      <div className="relative">{children}<span className={inputIconClass}>{icon}</span></div>
      {error && <p id={`${id}-error`} className="text-sm text-[var(--contact-red)]">{error}</p>}
    </div>
  )
}

function autoCompleteFor(name) {
  return { fullName: 'name', email: 'email', phone: 'tel' }[name]
}

export default function ContactForm({ categories, contact, form = {}, preview = false }) {
  const [errors, setErrors] = useState({})
  const [attempted, setAttempted] = useState(false)
  const formFields = Array.isArray(form.form_fields) ? form.form_fields : []
  const formTitle = form.form_title || 'Gửi phản hồi hoặc yêu cầu tư vấn'
  const formDescription = form.form_description || 'Quý vị vui lòng để lại thông tin và nội dung cần tư vấn để Ban Thư ký Trung tâm hỗ trợ.'
  const buttonText = form.button_text || 'GỬI LỜI NHẮN NGAY'
  const availabilityText = form.availability_text || ''
  const privacyText = form.privacy_text || ''

  function handleSubmit(event) {
    event.preventDefault()
    const formElement = event.currentTarget
    const values = new FormData(formElement)
    const nextErrors = {}
    formFields.forEach((field, index) => {
      const name = field.id || `field_${index}`
      if (field.required && !String(values.get(name) || '').trim()) {
        nextErrors[name] = `Vui lòng nhập ${String(field.label || 'thông tin này').toLocaleLowerCase('vi')}.`
      }
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setAttempted(false)
      formElement.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
      return
    }
    setAttempted(true)
  }

  function clearFieldError(event) {
    const name = event.target.name
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
    setAttempted(false)
  }

  function renderField(field, index) {
    const name = field.id || `field_${index}`
    const id = `contact-${name}`
    const type = field.type || 'text'
    const error = errors[name]
    const isHalf = field.width === 'half'
    const icon = fieldIcons[name] || <MessageSquareText size={20} aria-hidden="true" />
    const options = name === 'category' && Array.isArray(categories) && categories.length
      ? categories.map((category) => category.label)
      : Array.isArray(field.options) ? field.options : []
    const commonProps = {
      id,
      name,
      required: !preview && Boolean(field.required),
      disabled: preview,
      tabIndex: preview ? -1 : undefined,
      placeholder: field.placeholder || '',
      autoComplete: autoCompleteFor(name),
      className: `${inputClass} disabled:opacity-100 ${type === 'textarea' ? 'min-h-40 resize-y py-3 leading-relaxed' : 'h-12'}`,
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `${id}-error` : undefined,
    }

    return <Field key={`${name}-${index}`} id={id} label={field.label || `Ô nhập ${index + 1}`} required={field.required} icon={icon} error={error} className={isHalf ? 'md:col-span-1' : 'md:col-span-2'}>
      {type === 'select' ? <>
        <select {...commonProps} defaultValue="" className={`${commonProps.className} cursor-pointer appearance-none pr-10`}>
          <option value="" disabled={Boolean(field.required)}>{field.placeholder || 'Vui lòng chọn...'}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown size={20} aria-hidden="true" className="pointer-events-none absolute top-3.5 right-3 text-[var(--contact-gold)]" />
      </> : type === 'textarea' ? <textarea {...commonProps} readOnly={preview} rows={5} /> : <input {...commonProps} readOnly={preview} type={['text', 'tel', 'email', 'number'].includes(type) ? type : 'text'} />}
    </Field>
  }

  const FormElement = preview ? 'div' : 'form'
  const formProps = preview ? {} : { onSubmit: handleSubmit, onChange: clearFieldError, 'aria-describedby': 'contact-form-availability' }

  return (
    <section inert={preview || undefined} aria-labelledby="contact-form-title" className={`relative min-w-0 rounded-lg bg-white shadow-md ${preview ? 'p-5' : 'p-6 lg:col-span-7 lg:p-8'}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex h-1.5 justify-between overflow-hidden rounded-t-lg bg-[var(--contact-red)]">
        <span className="w-32 bg-[var(--contact-gold)]" /><span className="w-12 bg-[var(--contact-gold)]" />
      </div>
      <div className="pb-6">
        <p className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--contact-red)] uppercase">
          <FilePenLine size={20} aria-hidden="true" className="shrink-0 text-[var(--contact-gold)]" />Cổng Tiếp Nhận Trực Tuyến
        </p>
        <h2 id="contact-form-title" className="text-2xl leading-tight font-bold tracking-tight text-[var(--contact-red)] uppercase md:text-[32px] md:leading-10">{formTitle}</h2>
        <p className="mt-2">{formDescription}</p>
      </div>
      <FormElement {...formProps} className="flex flex-col gap-4">
        <p className="text-xs">Các trường có dấu <span className="font-bold text-[var(--contact-red)]">*</span> là bắt buộc.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {formFields.map(renderField)}
        </div>
        <div className="pt-2">
          <button type={preview ? 'button' : 'submit'} className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-[4px] bg-[var(--contact-red)] px-6 py-3 text-base font-bold text-white shadow-md hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--contact-gold)] motion-safe:transition-shadow sm:w-auto sm:px-8 sm:text-lg">
            <span aria-hidden="true" className="h-4 w-1 shrink-0 rounded-full bg-[var(--contact-gold)]" />
            {buttonText}
            <Send size={20} aria-hidden="true" className="shrink-0 text-[var(--contact-gold)] motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
          </button>
        </div>
        <div id="contact-form-availability" className="rounded-[4px] bg-[var(--contact-cream)] p-3 text-sm leading-relaxed">
          <p><ContactAvailabilityMessage message={availabilityText} contact={contact} /></p>
        </div>
        {attempted && <div role="status" aria-live="polite" aria-atomic="true">
          <p className="rounded-[4px] border border-[var(--contact-red)] p-3 text-sm text-[var(--contact-red)]">Lời nhắn chưa được gửi. Thông tin đã nhập vẫn được giữ trên biểu mẫu để quý vị có thể sao chép và gửi qua email.</p>
        </div>}
        <div className="flex items-start gap-2 rounded-[4px] bg-[var(--contact-cream)] p-3 text-sm leading-relaxed">
          <ShieldCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--contact-gold)]" />
          <p><strong className="font-semibold">Thông tin liên hệ:</strong> {privacyText}</p>
        </div>
      </FormElement>
    </section>
  )
}
