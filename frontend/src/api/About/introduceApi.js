import { API_BASE_URL } from '../../config/config.js'
import { INTRODUCE_PAGE_ID } from '../../config/About/aboutConfig.js'

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function text(value) {
  return typeof value === 'string' && value.trim() ? value : ''
}

function list(value) {
  return Array.isArray(value) ? value : []
}

export function getSafeIntroduceUrl(value) {
  // oxlint-disable-next-line no-control-regex -- Reject control characters that browsers may normalize in URLs.
  if (!text(value) || /[\s\\\u0000-\u001f\u007f]/.test(value)) return null
  if (value.startsWith('/') && !value.startsWith('//')) return value
  if (!/^https?:\/\//i.test(value)) return null
  try {
    const url = new URL(value)
    return url.hostname ? value : null
  } catch {
    return null
  }
}

function image(value) {
  if (!isObject(value)) return null
  const result = {
    url: getSafeIntroduceUrl(value.url), alt: text(value.alt),
    tag: text(value.tag), caption_title: text(value.caption_title),
  }
  return result.url || result.alt || result.tag || result.caption_title ? result : null
}

function items(value) {
  return list(value)
    .filter((item) => isObject(item) && text(item.title) && text(item.description))
    .map((item) => ({ title: item.title, description: item.description, icon: text(item.icon) }))
}

// Keep valid content in backend order without letting malformed fields reach JSX.
export function getIntroduceSections(props) {
  const sections = {}
  if (!isObject(props)) return sections

  for (const key of [
    'hero_section', 'overview_section', 'vision_section',
    'mission_section', 'core_values_section',
  ]) {
    const source = props[key]
    if (!isObject(source) || !text(source.title_main)) continue
    const section = { title_main: source.title_main, tag: text(source.tag) }
    if (key === 'hero_section') {
      section.quote = text(source.quote)
      section.quote_author = text(source.quote_author)
      section.breadcrumbs = list(source.breadcrumbs)
        .filter((item) => isObject(item) && text(item.text)
          && (item.link === null || getSafeIntroduceUrl(item.link)))
        .map((item) => ({ text: item.text, link: item.link }))
    } else if (key === 'core_values_section') {
      section.description = text(source.description)
      section.items = items(source.items)
    } else {
      section.featured_image = image(source.featured_image)
      if (key !== 'mission_section') section.paragraphs = list(source.paragraphs).filter(text)
      if (key === 'overview_section') {
        section.statistics = list(source.statistics)
          .filter((item) => isObject(item) && text(item.value) && text(item.label))
          .map((item) => ({ value: item.value, label: item.label, icon: text(item.icon) }))
      } else {
        section.items = items(source.items)
      }
    }
    sections[key] = section
  }

  const buttons = list(props.actions_section?.buttons)
    .filter((item) => isObject(item) && text(item.text) && getSafeIntroduceUrl(item.link))
    .map((item) => ({ text: item.text, link: item.link, icon: text(item.icon) }))
  if (buttons.length) sections.actions_section = { buttons }
  return sections
}

export async function getIntroducePage({ pageId = INTRODUCE_PAGE_ID, signal } = {}) {
  if (!Number.isSafeInteger(pageId) || pageId <= 0) {
    throw new Error('Cấu hình VITE_INTRODUCE_PAGE_ID phải là số nguyên dương hợp lệ.')
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}/introduce/${pageId}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError' || signal?.aborted) throw error
    throw new Error('Không thể kết nối để tải nội dung giới thiệu. Vui lòng thử lại.')
  }

  if (!response.ok) {
    const message = response.status === 404
      ? 'Chưa tìm thấy nội dung giới thiệu.'
      : 'Không thể tải nội dung giới thiệu. Vui lòng thử lại.'
    throw Object.assign(new Error(message), { status: response.status })
  }

  let payload
  try {
    payload = await response.json()
  } catch (error) {
    if (error.name === 'AbortError' || signal?.aborted) throw error
    throw new Error('Phản hồi nội dung giới thiệu không phải JSON hợp lệ.')
  }

  if (!isObject(payload) || payload.success !== true) {
    throw new Error('Phản hồi nội dung giới thiệu không hợp lệ.')
  }

  const page = payload.data
  if (
    !isObject(page)
    || page.id !== pageId
    || typeof page.name !== 'string'
    || page.slug !== 'introduce'
    || !isObject(page.props)
  ) {
    throw new Error('Dữ liệu trang giới thiệu không hợp lệ.')
  }

  // Empty or partial props are valid; the page handles empty/missing sections.
  return page
}
