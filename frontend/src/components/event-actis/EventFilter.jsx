import { Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import DatePicker from 'react-datepicker'
import { eventPageStatusFilters } from '../../config/Events/eventsConfig.js'

const yearPickerCalendarClass = String.raw`
  w-full overflow-hidden rounded-xl border border-(--color-brand-gold) bg-white text-black shadow-lg [font-family:Inter,sans-serif]
  [&_.react-datepicker\_\_header]:border-b [&_.react-datepicker\_\_header]:border-(--color-brand-gold) [&_.react-datepicker\_\_header]:bg-(--color-brand-cream) [&_.react-datepicker\_\_header]:p-2
  [&_.react-datepicker\_\_year-wrapper]:grid [&_.react-datepicker\_\_year-wrapper]:grid-cols-2 sm:[&_.react-datepicker\_\_year-wrapper]:grid-cols-3 [&_.react-datepicker\_\_year-wrapper]:gap-2 [&_.react-datepicker\_\_year-wrapper]:p-3
  [&_.react-datepicker\_\_aria-live]:sr-only
`

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
        {section?.show_year_filter !== false && <div className="relative w-full shrink-0 rounded-lg bg-(--color-brand-cream) focus-within:outline-2 focus-within:outline-(--color-brand-gold) sm:w-auto">
          <span id="event-year-filter-label" className="sr-only">Lọc theo năm tổ chức</span>
          <DatePicker
            selected={selectedYear ? new Date(Number(selectedYear), 0, 1) : null}
            onChange={(date) => onSelectYear(date ? String(date.getFullYear()) : '')}
            showYearPicker
            dateFormat="yyyy"
            placeholderText="Tất cả các năm"
            ariaLabelledBy="event-year-filter-label"
            className="min-h-10 w-full rounded-lg bg-transparent py-2.5 pl-3 pr-9 text-sm text-black outline-none placeholder:text-black/60 sm:w-48"
            wrapperClassName={String.raw`block w-full sm:w-48 [&_.react-datepicker\_\_aria-live]:sr-only`}
            yearClassName={(date) => `flex min-h-12 w-full cursor-pointer items-center justify-center rounded-md text-center text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-gold) sm:min-h-10 sm:text-sm ${selectedYear === String(date.getFullYear())
              ? 'bg-(--color-brand-red) text-white'
              : 'text-black hover:bg-(--color-brand-gold) focus-visible:bg-(--color-brand-gold)'}`}
            calendarClassName={yearPickerCalendarClass}
            popperClassName="z-10 w-full sm:w-64"
            showPopperArrow={false}
            renderCustomHeader={({ visibleYearsRange, decreaseYear, increaseYear, prevYearButtonDisabled, nextYearButtonDisabled }) => (
              <div className="flex items-center justify-between gap-2 px-1 text-sm font-bold text-(--color-brand-red)">
                <button type="button" onClick={decreaseYear} disabled={prevYearButtonDisabled} className="inline-flex size-7 items-center justify-center rounded-md text-(--color-brand-red) hover:bg-(--color-brand-gold) disabled:opacity-30" aria-label="Các năm trước"><ChevronLeft size={16} /></button>
                <span>{visibleYearsRange?.startYear} – {visibleYearsRange?.endYear}</span>
                <button type="button" onClick={increaseYear} disabled={nextYearButtonDisabled} className="inline-flex size-7 items-center justify-center rounded-md text-(--color-brand-red) hover:bg-(--color-brand-gold) disabled:opacity-30" aria-label="Các năm sau"><ChevronRight size={16} /></button>
              </div>
            )}
            popperPlacement="bottom-end"
          />
          <Calendar size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/60" />
        </div>}
      </div>
    </div>
  </div>
}
export default EventFilter
