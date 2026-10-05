import { Search, Calendar } from 'lucide-react'
import { eventPageStatusFilters } from '../../config/Events/eventsConfig.js'

export const EventFilter = ({ section, categories, activeCategory, onSelectCategory, searchTerm, onSearchChange, selectedYear, onSelectYear }) => {
  const statusFilters = eventPageStatusFilters(section)
  const options = [
    ...statusFilters.map((filter, index) => ({ id: `status-filter:${index}`, name: filter.label })),
    ...categories,
  ]
  return <div className="relative z-10 mx-auto -mt-7 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm lg:flex-row lg:items-start">
      <div aria-label="Lọc chuyên mục sự kiện" className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
        {options.map((item) => <button key={item.id} aria-pressed={activeCategory === String(item.id)} onClick={() => onSelectCategory(String(item.id))} className={`min-h-10 shrink-0 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--color-brand-gold) ${activeCategory === String(item.id) ? 'bg-(--color-brand-red) text-white' : 'bg-(--color-brand-cream) text-black hover:text-(--color-brand-red)'}`}>{item.name}</button>)}
      </div>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row lg:shrink-0">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-(--color-brand-cream) px-3 py-2.5 focus-within:outline-2 focus-within:outline-(--color-brand-gold)"><Search size={17} className="shrink-0" aria-hidden="true" /><span className="sr-only">Tìm kiếm sự kiện</span><input value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder={section?.search_placeholder || 'Tìm tên sự kiện…'} className="min-w-0 w-full bg-transparent text-sm outline-none lg:w-44" /></label>
        {section?.show_year_filter !== false && <label className="relative shrink-0 rounded-lg bg-(--color-brand-cream) focus-within:outline-2 focus-within:outline-(--color-brand-gold)">
          <span className="sr-only">Lọc theo năm tổ chức</span>
          <input type="number" inputMode="numeric" min="1000" max="9999" value={selectedYear} onChange={(event) => onSelectYear(event.target.value.slice(0, 4))} placeholder="Tất cả các năm" className="min-h-10 w-48 rounded-lg bg-transparent py-2.5 pl-3 pr-9 text-sm text-black outline-none placeholder:text-black/60" />
          <Calendar size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/60" />
        </label>}
      </div>
    </div>
  </div>
}
export default EventFilter
