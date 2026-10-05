import { useState } from 'react'
import EventCard from './EventCard.jsx'

export const EventList = ({ events, onResetFilter, onDetailEvent }) => {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(events.length / 6))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * 6
  if (!events.length) return <div className="my-10 space-y-4 rounded-2xl border border-black/10 bg-white p-10 text-center"><h2 className="text-lg font-semibold">Không tìm thấy sự kiện phù hợp</h2><button onClick={onResetFilter} className="rounded-lg bg-(--color-brand-red) px-4 py-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)">Xem tất cả sự kiện</button></div>
  return <section aria-label="Danh sách sự kiện" className="my-10 space-y-8">
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.slice(start, start + 6).map((event) => <EventCard key={event.id} event={event} onDetail={onDetailEvent} />)}</div>
    <div className="space-y-3 text-center">
      {pageCount > 1 && <nav aria-label="Phân trang sự kiện" className="flex flex-wrap justify-center gap-2">
        <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="rounded-lg border border-black/15 px-4 py-2 text-sm disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)">Trang trước</button>
        <span className="px-3 py-2 text-sm">{currentPage} / {pageCount}</span>
        <button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className="rounded-lg border border-black/15 px-4 py-2 text-sm disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)">Trang sau</button>
      </nav>}
      <p role="status" className="text-sm text-black/60">Hiển thị {start + 1} – {Math.min(start + 6, events.length)} trong số {events.length} sự kiện</p>
    </div>
  </section>
}
export default EventList
