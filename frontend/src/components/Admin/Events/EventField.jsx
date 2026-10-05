import { useId } from 'react'
import { adminInput } from '../../../config/Admin/adminEvents.js'

export default function EventField({ label, value, onChange, error, multiline, children, required = false, labelClassName = '', compact = false, ...rest }) {
  const id = useId()
  const inputClassName = compact ? 'w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2.5 text-sm text-(--admin-title) placeholder:text-(--admin-heading)/60 focus-visible:outline-2 focus-visible:outline-(--admin-accent)' : adminInput
  const props = { ...rest, id, value, required, onChange: (event) => onChange(event.target.value), className: inputClassName, 'aria-invalid': Boolean(error), 'aria-describedby': error ? `${id}-error` : undefined }
  return <div className="min-w-0 space-y-2">
    <label htmlFor={id} className={`block ${compact ? 'text-xs font-bold uppercase tracking-wider' : 'text-sm font-medium'} ${labelClassName}`}>{label}</label>
    {children ? <select {...props}>{children}</select> : multiline ? <textarea {...props} rows={4} /> : <input type="text" {...props} />}
    {error && <p id={`${id}-error`} className="text-sm text-(--admin-heading)">{error}</p>}
  </div>
}
