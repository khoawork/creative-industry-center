import { Fragment } from 'react';
import AboutHero from './about-hero';
import AboutOverview from './about-overview';
import AboutVision from './about-vision';
import AboutMission from './about-mission';
import AboutPillars from './about-pillars';

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function text(value) {
  return typeof value === 'string' && value.trim() ? value : ''
}

function list(value) {
  return Array.isArray(value) ? value : []
}

function image(value) {
  if (!isObject(value)) return null
  const result = {
    url: text(value.url), alt: text(value.alt),
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
function getIntroduceSections(props) {
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
          && (item.link === null || text(item.link)))
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
    .filter((item) => isObject(item) && text(item.text) && text(item.link))
    .map((item) => ({ text: item.text, link: item.link, icon: text(item.icon) }))
  if (buttons.length) sections.actions_section = { buttons }
  return sections
}


export default function AboutLayout({ props }) {
  const sections = getIntroduceSections(props);
  if (!Object.keys(sections).length) return <p role="status" className="px-6 py-20 text-center">Nội dung giới thiệu đang được cập nhật.</p>;
  const contentSections = [
    { key: 'overview_section', Component: AboutOverview },
    { key: 'vision_section', Component: AboutVision },
    { key: 'mission_section', Component: AboutMission },
  ].filter(({ key }) => sections[key]);

  return (
    <div className="flex w-full min-w-0 flex-col bg-[#f4f3f1] [font-family:Inter,sans-serif] text-black [overflow-wrap:anywhere]">
      {sections.hero_section && <AboutHero section={sections.hero_section} />}

      {contentSections.length > 0 && (
        <div className="mx-auto w-full max-w-7xl space-y-8 px-4  sm:space-y-12 sm:px-6 sm:py-16 lg:space-y-16 lg:px-12 l">
          {contentSections.map(({ key, Component }, index) => (
            <Fragment key={key}>
              {index > 0 && (
                <div aria-hidden="true" className="flex items-center justify-center gap-4 py-4">
                  <div className="h-px flex-1 bg-[#d49520]/30" />
                  <span className="text-lg font-bold text-[#d49520]">★</span>
                  <div className="h-px flex-1 bg-[#d49520]/30" />
                </div>
              )}
              <Component section={sections[key]} />
            </Fragment>
          ))}
        </div>
      )}

      {(sections.core_values_section || sections.actions_section) && (
        <AboutPillars
          coreValues={sections.core_values_section}
          actions={sections.actions_section}
        />
      )}
    </div>
  );
}
