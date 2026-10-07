import { CalendarDays, Layout, ListFilter, Send } from 'lucide-react'

export const eventsAdminTabs = [
  { key: 'hero_section', label: 'Đầu trang & thống kê', icon: Layout },
  { key: 'filter_section', label: 'Bộ lọc & chuyên mục', icon: ListFilter },
  { key: 'events', label: 'Danh sách sự kiện', icon: CalendarDays },
  { key: 'newsletter_section', label: 'CTA Form', icon: Send },
]
export function emptyEventsSection(key) {
  if (key === 'hero_section') return { breadcrumbs: [], badge: '', title: '', description: '', statistics: [] }
  if (key === 'filter_section') return {
    status_filters: [
      { statuses: ['ALL'], label: 'Tất cả sự kiện' },
      { statuses: ['REGISTRATION_OPEN', 'UPCOMING'], label: 'Đang diễn ra & Sắp tới' },
      { statuses: ['REGISTRATION_OPEN'], label: 'Đang mở đăng ký' },
    ],
    search_placeholder: '',
    show_year_filter: true,
  }
  return { tag: '', title: '', description: '', privacy_text: '', button_text: '', full_name_label: '', full_name_placeholder: '', organization_label: '', organization_placeholder: '', email_label: '', email_placeholder: '', consent_text: '', success_message: '' }
}

export function eventSectionDraft(key, section = {}) {
  const draft = { ...emptyEventsSection(key), ...structuredClone(section) }
  if (key === 'filter_section' && section.all_label && !draft.status_filters.some((filter) => filter.statuses?.includes('ALL'))) {
    draft.status_filters = [{ statuses: ['ALL'], label: section.all_label }, ...draft.status_filters]
  }
  if (key === 'filter_section') delete draft.all_label
  return draft
}

export const adminContentTheme = '[font-family:Inter,sans-serif] text-(--admin-ink)'
export const adminButton = 'inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-xs font-semibold text-(--admin-ink) enabled:hover:bg-(--admin-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-50 transition-colors'
export const adminPrimaryButton = 'inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg bg-(--admin-primary) px-3.5 py-1.5 text-xs font-semibold text-(--admin-white) enabled:hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-50 transition-opacity shadow-xs'
export const adminInput = 'w-full min-w-0 rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-xs sm:text-sm text-(--admin-ink) placeholder:text-(--admin-ink)/45 transition-colors focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/20 focus:outline-none'
export const adminPanel = 'min-w-0 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-5 sm:p-6 shadow-[var(--admin-panel-shadow)]'

export function eventDraft(event = {}) {
  return {
    image: event.image || '', status: event.status || 'UPCOMING',
    location: event.location || '', name: event.name || '', description: event.description || '',
    event_date: event.event_date || '',
    category_id: event.category?.id ? String(event.category.id) : '',
    speakers: (event.speakers || []).map((speaker) => ({
      name: speaker.name || '', role: speaker.role || speaker.title || '',
      description: speaker.description || '', image: speaker.image || '',
    })),
    btn_action: event.btn_action || '', form_url: event.form_url || '',
  }
}
