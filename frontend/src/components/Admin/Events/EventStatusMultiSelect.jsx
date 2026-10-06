import { ChevronDown, X } from 'lucide-react'
import { eventStatuses } from '../../../config/Events/eventsConfig.js'

export default function EventStatusMultiSelect({ label, value, onChange }) {
  const options = [{ value: 'ALL', label: 'Tất cả sự kiện' }, ...eventStatuses]
  const remove = (status) => {
    if (value.length > 1) onChange(value.filter((item) => item !== status))
  }

  return <div className="relative min-w-0 space-y-2">
    <span className="block text-sm font-medium">{label}</span>
    <div className="relative flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) p-1.5 focus-within:outline-2 focus-within:outline-(--admin-accent)">
      <select aria-label={label} value="" onChange={(event) => {
        if (!event.target.value || value.includes(event.target.value)) return
        onChange(event.target.value === 'ALL' ? ['ALL'] : value.includes('ALL') ? [event.target.value] : [...value, event.target.value])
      }} className="absolute inset-0 size-full cursor-pointer bg-(--admin-surface) text-(--admin-ink) opacity-0 [color-scheme:light] disabled:cursor-not-allowed [[data-theme=dark]_&]:[color-scheme:dark]">
        <option value="" disabled>Chọn thêm trạng thái</option>
        {options.map((status) => <option key={status.value} value={status.value} disabled={value.includes(status.value)}>{value.includes(status.value) ? '✓ ' : ''}{status.label}</option>)}
      </select>
      <div className="pointer-events-none relative z-10 flex min-w-0 flex-1 flex-wrap gap-1.5">
        {options.filter((status) => value.includes(status.value)).map((status) => <span key={status.value} className="inline-flex min-h-8 items-center gap-1 rounded-md bg-(--admin-accent) px-2 py-1 text-xs font-semibold text-(--admin-black)">
          {status.label}
          <button type="button" aria-label={`Bỏ chọn ${status.label}`} disabled={value.length === 1} onClick={() => remove(status.value)} className="pointer-events-auto inline-flex size-5 cursor-pointer items-center justify-center rounded text-(--admin-black) hover:bg-(--admin-black) hover:text-(--admin-white) focus-visible:outline-2 focus-visible:outline-(--admin-black) disabled:cursor-not-allowed disabled:opacity-40"><X size={13} aria-hidden="true" /></button>
        </span>)}
      </div>
      <ChevronDown size={17} aria-hidden="true" className="pointer-events-none relative z-10 mr-2 shrink-0" />
    </div>
  </div>
}
