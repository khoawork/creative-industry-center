import { useEffect, useState } from 'react'
import { EventAPI } from '../../api/eventApi.js'
import { EVENTS_PAGE_ID, eventPageStatusFilters } from '../../config/Events/eventsConfig.js'
import { requireEventData, eventError } from '../../api/eventApi.js'
import useDebouncedValue from '../../hooks/shared/useDebouncedValue.js'
import EventHero from '../../components/event-actis/EventHero.jsx'
import EventFilter from '../../components/event-actis/EventFilter.jsx'
import EventList from '../../components/event-actis/EventList.jsx'
import EventNewsletter from '../../components/event-actis/EventNewsletter.jsx'
import EventDetailModal from '../../components/event-actis/EventDetailModal.jsx'

export default function Events() {
  const [content, setContent] = useState({ props: {}, events: [], categories: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [category, setCategory] = useState('status-filter:0')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 500)
  const [year, setYear] = useState('')
  const [detail, setDetail] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([EventAPI.getPage(EVENTS_PAGE_ID, { signal: controller.signal }), EventAPI.getEvents({ signal: controller.signal }), EventAPI.getCategories({ signal: controller.signal })])
      .then(([pageResponse, eventsResponse, categoriesResponse]) => {
        if (controller.signal.aborted) return
        const page = requireEventData(pageResponse)
        if (page.slug !== 'events' || !page.props || typeof page.props !== 'object' || Array.isArray(page.props)) throw new Error('Nội dung trang Sự kiện không hợp lệ.')
        setContent({ props: page.props, events: requireEventData(eventsResponse, true), categories: requireEventData(categoriesResponse, true) })
        setCategory(eventPageStatusFilters(page.props.filter_section).length ? 'status-filter:0' : 'all')
      }).catch((err) => { if (!controller.signal.aborted) setError(eventError(err)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])
  const term = debouncedSearch.trim().toLocaleLowerCase('vi')
  const configuredEventIds = content.props.displayed_events?.event_ids
  const displayedEvents = Array.isArray(configuredEventIds)
    ? content.events.filter((event) => configuredEventIds.some((id) => String(id) === String(event.id)))
    : content.events
  const displayedCategoryIds = new Set(displayedEvents.map((event) => String(event.category?.id)))
  const displayedCategories = content.categories.filter((item) => displayedCategoryIds.has(String(item.id)))
  const statusFilters = eventPageStatusFilters(content.props.filter_section)
  const events = displayedEvents.filter((event) => {
    const statusFilterIndex = category.startsWith('status-filter:') ? Number(category.slice(14)) : -1
    const statusFilter = statusFilters[statusFilterIndex]
    const matchesCategory = category === 'all'
      || Boolean(statusFilter?.statuses.includes('ALL'))
      || Boolean(statusFilter?.statuses.includes(event.status))
      || String(event.category?.id) === category
    const matchesYear = !year || event.event_date?.slice(0, 4) === year
    return matchesCategory && matchesYear && [event.name, event.description, event.location, ...(event.speakers || []).map((speaker) => speaker.name)].some((value) => String(value || '').toLocaleLowerCase('vi').includes(term))
  })
  return <main className="min-h-screen bg-(--color-brand-cream) text-black [font-family:Inter,sans-serif]" aria-busy={loading}>
    {loading ? <p role="status" className="p-16 text-center">Đang tải sự kiện…</p> : error ? <div className="space-y-4 p-16 text-center"><p role="alert">{error}</p><button onClick={() => { setLoading(true); setError(''); setAttempt((value) => value + 1) }} className="rounded-lg bg-(--color-brand-red) px-5 py-3 text-white focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)">Thử lại</button></div> : <>
      <EventHero section={content.props.hero_section} />
      <EventFilter section={content.props.filter_section} categories={displayedCategories} activeCategory={category} onSelectCategory={setCategory} searchTerm={search} onSearchChange={setSearch} selectedYear={year} onSelectYear={setYear} />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <EventList key={`${category}:${debouncedSearch}:${year}`} events={events} onResetFilter={() => { setCategory(statusFilters.length ? 'status-filter:0' : 'all'); setSearch(''); setYear('') }} onDetailEvent={setDetail} />
        <EventNewsletter section={content.props.newsletter_section} />
      </div>
      <EventDetailModal event={detail} isOpen={Boolean(detail)} onClose={() => setDetail(null)} />
    </>}
  </main>
}
