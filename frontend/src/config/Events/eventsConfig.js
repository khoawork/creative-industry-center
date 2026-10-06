export function formatEventDate(value) {
  return value ? value.split('-').reverse().join('/') : 'Chưa có ngày tổ chức'
}

export function getEventDateParts(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '')
  if (!match) return null
  return { day: match[3], monthYear: `THÁNG ${match[2]}, ${match[1]}` }
}

export function getSpeakerInitials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return '?'
  const selected = words.length === 1 ? words : [words[0], words[words.length - 1]]
  return selected.map((word) => word.replace(/[^\p{L}\p{N}]/gu, '').charAt(0)).join('').toLocaleUpperCase('vi') || '?'
}

export const eventStatuses = [
  { value: 'PENDING', label: 'Đang lên kế hoạch' },
  { value: 'REGISTRATION_OPEN', label: 'Đang mở đăng ký' },
  { value: 'UPCOMING', label: 'Sắp diễn ra' },
  { value: 'ENDED', label: 'Đã kết thúc' },
]

export function eventPageStatusFilters(section) {
  const configured = Array.isArray(section?.status_filters) ? section.status_filters : [
    { statuses: ['REGISTRATION_OPEN', 'UPCOMING'], label: section?.upcoming_label || 'Đang diễn ra & Sắp tới' },
    { statuses: ['REGISTRATION_OPEN'], label: section?.registration_open_label || 'Đang mở đăng ký' },
  ]
  const filters = configured.map((filter) => ({
    label: filter.label,
    statuses: Array.isArray(filter.statuses) ? filter.statuses : filter.status ? [filter.status] : [],
  }))
  if (filters.some((filter) => filter.statuses.includes('ALL'))) return filters
  if (section?.all_label || !Array.isArray(section?.status_filters)) {
    return [{ statuses: ['ALL'], label: section?.all_label || 'Tất cả sự kiện' }, ...filters]
  }
  return filters
}

export function eventStatusLabel(status) {
  return eventStatuses.find((item) => item.value === status)?.label || status
}
