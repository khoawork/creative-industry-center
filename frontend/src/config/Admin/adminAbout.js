import { Building2, Gem, MousePointerClick, PanelTop, Target, Telescope } from 'lucide-react'

export const aboutAdminTabs = [
  { key: 'hero_section', label: 'Đầu trang', icon: PanelTop, description: 'Tiêu đề, trích dẫn và đường dẫn điều hướng của trang Giới thiệu.' },
  { key: 'overview_section', label: 'Tổng quan', icon: Building2, description: 'Nội dung tổng quan, ảnh minh họa và các số liệu thống kê.' },
  { key: 'vision_section', label: 'Tầm nhìn', icon: Telescope, description: 'Tầm nhìn phát triển và các định hướng của trung tâm.' },
  { key: 'mission_section', label: 'Sứ mệnh', icon: Target, description: 'Ảnh minh họa và những sứ mệnh trung tâm theo đuổi.' },
  { key: 'core_values_section', label: 'Giá trị cốt lõi', icon: Gem, description: 'Mô tả chung và danh sách các giá trị cốt lõi.' },
  { key: 'actions_section', label: 'Nút hành động', icon: MousePointerClick, description: 'Nhãn, liên kết và biểu tượng của các nút cuối trang Giới thiệu.' },
]

export function emptyAboutSection(key) {
  const image = { url: '', alt: '', tag: '', caption_title: '' }
  const item = { icon: '', title: '', description: '' }
  switch (key) {
    case 'hero_section': return { title_main: '', quote: '', quote_author: '', breadcrumbs: [{ text: '', link: null }] }
    case 'overview_section': return { tag: '', title_main: '', paragraphs: [''], featured_image: image, statistics: [] }
    case 'vision_section': return { tag: '', title_main: '', paragraphs: [''], featured_image: image, items: [item] }
    case 'mission_section': return { tag: '', title_main: '', featured_image: image, items: [item] }
    case 'core_values_section': return { tag: '', title_main: '', description: '', items: [item] }
    case 'actions_section': return { buttons: [{ text: '', link: '', icon: '' }] }
    default: return {}
  }
}

export const aboutAdminButton = 'inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-xs font-semibold text-(--admin-ink) hover:bg-(--admin-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-50 transition-colors'
export const aboutAdminPrimaryButton = 'inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg bg-(--admin-primary) px-3.5 py-1.5 text-xs font-semibold text-(--admin-white) enabled:hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-50 transition-opacity shadow-xs'
export const aboutAdminIconButton = 'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-(--admin-ink)/70 hover:bg-(--admin-background) hover:text-(--admin-heading) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-30 transition-colors'

