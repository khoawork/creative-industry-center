import { sectionIds } from '../config/shared/site.js'
import { AwardAPI } from '../api/awardApi.js'
import { EventAPI } from '../api/eventApi.js'
import { HomeAPI } from '../api/homeApi.js'
import { ProjectAPI } from '../api/projectApi.js'
import { TrainingAPI } from '../api/trainingApi.js'

function unwrapPage(response) {
  return response?.data?.data || response?.data || response || {}
}

function unwrapItems(response) {
  const payload = response?.data ?? response
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

async function loadItems(label, request) {
  try {
    return unwrapItems(await request())
  } catch (error) {
    console.warn(`Không thể tải dữ liệu ${label} từ API.`, error)
    return null
  }
}

function findNavSection(sections, keyword) {
  return sections.find((section) => {
    const link = section.action_button?.link?.toLowerCase() || ''
    return link.includes(keyword)
  })
}

function selectNavItems(items, section) {
  const childIds = section?.children_id
  if (!Array.isArray(childIds) || childIds.length === 0) return items
  const selectedIds = new Set(childIds.map(String))
  return items.filter((item) => selectedIds.has(String(item.id)))
}

function formatEventDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date
    .toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
    .toLocaleUpperCase('vi-VN')
}

const pageResponse = await HomeAPI.getHomePage(1).catch((error) => {
  console.warn('Không thể tải dữ liệu Home từ API.', error)
  return null
})
const homePage = unwrapPage(pageResponse)
const homeProps = homePage.props || {}
const navSections = Array.isArray(homeProps.nav_sections) ? homeProps.nav_sections : []

const [eventRecords, projectRecords, awardRecords, trainingRecords] = await Promise.all([
  loadItems('events', () => EventAPI.getEvents()),
  loadItems('projects', () => ProjectAPI.getProjects()),
  loadItems('awards', () => AwardAPI.getAwards({ per_page: 100 })),
  loadItems('trainings', () => TrainingAPI.getTrainings({ per_page: 100 })),
])

const heroData = homeProps.hero_section
export const hero = {
  badge: heroData?.badge || '',
  title: heroData?.title_main || '',
  subtitle: heroData?.subtitle || '',
  slogan: heroData?.quote || '',
  buttons: (heroData?.buttons || []).map((button) => ({
    text: button.text || '',
    href: button.link || '',
  })),
}

export const statistics = Array.isArray(heroData?.statistics)
  ? heroData.statistics
  : []

const aboutData = homeProps.about_section
const coreValues = Array.isArray(aboutData?.core_values) ? aboutData.core_values : []
const mission = coreValues[0]
export const about = {
  eyebrow: aboutData?.tag || '',
  title: aboutData?.title_main || '',
  image: aboutData?.featured_image?.url || '',
  imageAlt: aboutData?.featured_image?.caption_title || '',
  captionTitle: aboutData?.featured_image?.caption_title || '',
  caption: aboutData?.featured_image?.caption_text || '',
  missionTitle: mission?.title || '',
  mission: mission?.description || '',
  values: coreValues.slice(1),
  actionButton: {
    text: aboutData?.action_button?.text || '',
    href: aboutData?.action_button?.link || '',
  },
}

export const homeNavSections = navSections

export const eventsSection = findNavSection(navSections, 'event') || {}
export const projectsSection = findNavSection(navSections, 'project') || {}
export const trainingSection = findNavSection(navSections, 'train') || {}
export const awardsSection = findNavSection(navSections, 'award') || {}

export const events = eventRecords === null
  ? []
  : selectNavItems(eventRecords, findNavSection(navSections, 'event')).map((event) => ({
      id: event.id,
      date: formatEventDate(event.date || event.event_date || event.time),
      category: event.category?.name || event.category || '',
      title: event.name || event.title || '',
      description: event.description || '',
      image: event.image || '',
      imageAlt: event.name || event.title || '',
      action: event.btn_action || '',
      href: event.form_url || '',
    }))

export const awards = awardRecords === null
  ? []
  : selectNavItems(awardRecords, awardsSection).map((award) => ({
      id: award.id,
      icon: award.props?.icon || 'trophy',
      title: award.name || award.title || '',
      description: award.description || '',
      tag: award.decision_number || '',
      featured: Boolean(award.props?.featured),
      featuredLabel: award.props?.featuredLabel || '',
      action: award.props?.action_button?.text || '',
      href: award.props?.action_button?.link || '',
    }))

export const projects = projectRecords === null
  ? []
  : selectNavItems(projectRecords, findNavSection(navSections, 'project')).map((project) => ({
      id: project.id,
      sectionId: project.project_info?.link?.includes('stories') ? sectionIds.stories : undefined,
      icon: project.props?.icon || '',
      featured: Boolean(project.props?.featured),
      category: project.category?.name || project.title || '',
      title: project.name || project.title || '',
      description: project.description || '',
      image: project.image || project.project_info?.image || '',
      imageAlt: project.name || project.title || '',
      caption: project.slogan || '',
      action: project.project_info?.btn_action || '',
      href: project.project_info?.link || '',
    }))

export const programs = trainingRecords === null
  ? []
  : selectNavItems(trainingRecords, findNavSection(navSections, 'train')).map((program) => ({
      id: program.id,
      icon: program.props?.icon || '',
      title: program.name || '',
      description: program.props?.description || '',
      detail: program.props?.info_highlight || program.time || '',
      action: program.props?.btn_action || '',
      href: program.props?.link || '',
    }))

const supportText = homeProps.support_banner?.text
const [supportTitle, ...supportDescription] = supportText?.split(/\r?\n/) || []
export const advisory = {
  title: supportTitle || '',
  description: supportDescription.join(' ').trim(),
  actionButton: {
    text: homeProps.support_banner?.button?.text || '',
    href: homeProps.support_banner?.button?.link || '',
  },
}
