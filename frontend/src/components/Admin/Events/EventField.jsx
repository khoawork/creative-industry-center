import { useId } from 'react'
import { adminInput } from '../../../config/Admin/adminEvents.js'

export default function EventField({ label, value, onChange, error, multiline, children, required = false, ...rest }) {
  const id = useId()
  const props = { ...rest, id, value, required, onChange: (event) => onChange(event.target.value), className: adminInput, 'aria-invalid': Boolean(error), 'aria-describedby': error ? `${id}-error` : undefined }
  return <div className="min-w-0 space-y-2">
    <label htmlFor={id} className="block text-sm font-medium">{label}</label>
    {children ? <select {...props}>{children}</select> : multiline ? <textarea {...props} rows={4} /> : <input type="text" {...props} />}
    {error && <p id={`${id}-error`} className="text-sm text-(--admin-heading)">{error}</p>}
  </div>
}
