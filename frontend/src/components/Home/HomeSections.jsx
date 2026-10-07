import Button from '../shared/Button.jsx'
import Icon from '../shared/Icon.jsx'
import {
  about,
  advisory,
  awards,
  events,
  eventsSection,
  programs,
  projects,
  projectsSection,
  trainingSection,
} from '../../data/homeData.js'
import { sectionIds } from '../../config/shared/site.js'

function SectionHeading({ eyebrow, title, light = false, left = false }) {
  return (
    <div className={`flex flex-col ${left ? 'items-start text-left' : 'items-center text-center'} mb-12 lg:mb-16`}>
      <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-2 ${light ? 'text-secondary-bright' : 'text-secondary'}`}>
        {eyebrow}
      </span>
      <h2 className={`text-3xl md:text-4xl font-extrabold uppercase tracking-tight ${light ? 'text-white' : 'text-primary'}`}>
        {title}
      </h2>
      <div className="w-20 h-1 bg-secondary mt-4 rounded-full" aria-hidden="true" />
    </div>
  )
}

export function AboutSection() {
  return (
    <section className="w-full py-20 lg:py-24 bg-white px-6 lg:px-12 border-t border-[#f0ebe1]" id={sectionIds.about}>
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeading eyebrow={about.eyebrow} title={about.title} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Visual Column */}
          <div className="lg:col-span-5 relative w-full">
            <div className="rounded-2xl overflow-hidden shadow-xl bg-surface-container-high relative aspect-[4/5] border border-[#e5dfd3]">
              {about?.image && (
                <img
                  src={about.image}
                  alt={about.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
              {(about.captionTitle || about.caption) && (
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-white/95 backdrop-blur-sm shadow-md border-l-4 border-secondary">
                  {about.captionTitle && (
                    <h3 className="text-lg font-bold text-primary">{about.captionTitle}</h3>
                  )}
                  {about.caption && (
                    <p className="text-xs text-on-surface-variant font-normal mt-1 leading-relaxed">
                      {about.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-7 flex flex-col space-y-7 w-full">
            {(about.missionTitle || about.mission) && (
              <article className="p-8 rounded-2xl bg-surface-container-low border border-[#ebe5dc] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
                    <Icon name="landmark" size={22} />
                  </span>
                  <h3 className="text-xl font-bold text-primary">{about.missionTitle}</h3>
                </div>
                <p className="text-base text-on-surface leading-relaxed font-normal">
                  {about.mission}
                </p>
              </article>
            )}

            {Array.isArray(about.values) && about.values.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {about.values.map((value) => (
                  <article className="p-6 rounded-xl bg-white border border-[#ebe5dc] shadow-sm flex flex-col justify-between" key={value.title}>
                    <div>
                      <div className="flex items-center gap-3 mb-2.5">
                        <Icon name={value.icon || 'check'} size={24} className="text-secondary shrink-0" />
                        <h4 className="text-base font-bold text-primary">{value.title}</h4>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {about.actionButton?.text && about.actionButton?.href && (
              <div>
                <Button
                  href={about.actionButton.href}
                  variant="primary"
                  size="md"
                  icon="arrow"
                  iconPosition="end"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all shadow-md text-sm font-bold uppercase tracking-wider"
                >
                  {about.actionButton.text}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EventsSection() {
  return (
    <section className="w-full py-20 lg:py-24 bg-surface-container-low px-6 lg:px-12 border-t border-[#f0ebe1]" id={sectionIds.events}>
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Section Header with Alignment */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <SectionHeading eyebrow={eventsSection.tag} title={eventsSection.title_main} left />
          {eventsSection.action_button?.text && eventsSection.action_button?.link && (
            <Button
              href={eventsSection.action_button.link}
              variant="text"
              icon="arrow"
              iconPosition="end"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-secondary font-bold uppercase tracking-wider transition-colors mb-2 md:mb-8"
            >
              {eventsSection.action_button.text}
            </Button>
          )}
        </div>

        {/* 3-Column Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <article className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#e8dfd3] transition-all duration-300 group" key={event.id}>
              {event.image && (
                <button
                  type="button"
                  className="h-56 relative overflow-hidden bg-surface-container-highest block w-full text-left cursor-pointer"
                  aria-label={`Đọc báo cáo: ${event.title}`}
                >
                  <img
                    src={event.image}
                    alt={event.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {event.date && (
                    <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded font-bold text-xs tracking-wider uppercase shadow">
                      {event.date}
                    </span>
                  )}
                </button>
              )}
              <div className="p-7 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  {event.category && (
                    <span className="text-xs text-secondary font-bold uppercase tracking-wider block">
                      {event.category}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors mt-2 leading-snug">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-sm text-on-surface-variant mt-3 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
                {event.action && event.href && (
                  <Button
                    href={event.href}
                    variant="text"
                    icon="arrow"
                    iconPosition="end"
                    className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center justify-between gap-2 pt-4 group-hover:translate-x-1 transition-transform border-t border-[#f0ebe1] w-full"
                  >
                    {event.action}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AwardsSection() {
  return (
    <section className="w-full py-20 lg:py-24 bg-primary-dark text-white px-6 lg:px-12 relative overflow-hidden border-t-2 border-secondary/50" id={sectionIds.awards}>
      {/* Decorative gold glow behind header */}
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-secondary/15 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10 w-full" id={sectionIds.records}>
        <SectionHeading eyebrow="HỆ THỐNG DANH VỊ DANH DỰ" title="Giải thưởng & Tôn vinh Danh hiệu" light />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
          {awards.map((award) => (
            <article
              key={award.id}
              className={`p-8 rounded-2xl flex flex-col items-center text-center space-y-6 justify-between transition-all duration-300 ${
                award.featured
                  ? 'bg-[#5d0208] border-2 border-secondary shadow-2xl relative transform md:-translate-y-4'
                  : 'bg-tertiary border border-secondary/30 shadow-lg'
              }`}
            >
              {award.featured && (
                <div className="absolute -top-4 bg-secondary text-primary-dark font-extrabold px-5 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-md">
                  {award.featuredLabel || 'Biểu Trưng Danh Giá Nhất'}
                </div>
              )}
              <div className="flex flex-col items-center text-center space-y-6 w-full">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${
                    award.featured
                      ? 'bg-secondary text-primary-dark shadow-md mt-2'
                      : 'bg-secondary/15 border border-secondary/40 text-secondary-bright'
                  }`}
                >
                  <Icon name={award.icon || 'trophy'} size={38} />
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {award.title}
                </h3>
                {award.description && (
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {award.description}
                  </p>
                )}
              </div>

              {award.tag ? (
                <div className="pt-2">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-bold ${
                    award.featured
                      ? 'bg-secondary/20 text-secondary-bright border border-secondary/40'
                      : 'bg-white/10 border border-secondary/30 text-secondary-bright'
                  }`}>
                    {award.tag}
                  </span>
                </div>
              ) : award.action && award.href ? (
                <div className="pt-2">
                  <Button
                    href={award.href}
                    variant={award.featured ? 'gold' : 'gold-outline'}
                    size="pill-sm"
                    icon="arrow"
                    iconPosition="end"
                    className="uppercase tracking-wider text-xs font-bold"
                  >
                    {award.action}
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button
            href={`#${sectionIds.awards}`}
            variant="white"
            size="md"
            icon="arrow"
            iconPosition="end"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white hover:bg-surface-container-low text-primary transition-all shadow-md text-sm uppercase tracking-wider font-bold"
          >
            Xem chi tiết danh mục giải thưởng
          </Button>
        </div>
      </div>
    </section>
  )
}

export function ProjectsSection() {
  return (
    <section className="w-full py-20 lg:py-24 bg-white px-6 lg:px-12 border-t border-[#f0ebe1]" id={sectionIds.projects}>
      <div className="max-w-7xl mx-auto flex flex-col">
        <SectionHeading eyebrow={projectsSection.tag} title={projectsSection.title_main} />
        {/* Dual Mosaic Grid (Project vs Patriarch/Founder) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((project) => (
            <article
              className="bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-[#e8dfd3] space-y-6 group"
              id={project.sectionId}
              key={project.id}
            >
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded ${
                  project.featured
                    ? 'bg-primary text-white'
                    : 'bg-secondary/15 text-primary-dark'
                } font-bold text-xs uppercase tracking-wider`}>
                  <Icon name={project.icon || 'architecture'} size={16} className={project.featured ? 'text-secondary' : 'text-secondary'} />
                  {project.category}
                </div>
                <h3 className="text-xl font-bold text-primary leading-snug">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>

              {project.image && (
                <button
                  type="button"
                  className="rounded-xl overflow-hidden aspect-video bg-surface-container-high relative shadow border border-[#dfd7cc] w-full block text-left cursor-pointer"
                  aria-label={project.action || project.title}
                >
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {project.caption && (
                    <div className="absolute bottom-4 left-4 bg-primary/95 text-white px-3.5 py-1.5 rounded font-bold text-xs uppercase tracking-wider shadow">
                      {project.caption}
                    </div>
                  )}
                </button>
              )}

              {project.action && project.href && (
                <Button
                  href={project.href}
                  variant="text"
                  icon="arrow"
                  iconPosition="end"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-secondary font-bold uppercase tracking-wider transition-colors pt-2 self-start"
                >
                  {project.action}
                </Button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RecordsForumSection() {
  return (
    <section className="w-full py-20 bg-surface-container-low px-6 lg:px-12 border-t border-[#f0ebe1]" id="de-cu-va-dien-dan">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-white border border-[#e8dfd3] rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <span className="px-3.5 py-1.5 rounded-full bg-secondary/15 text-primary-dark text-xs font-bold uppercase tracking-widest">
              Liên Minh Chiến Lược
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-tight">
              Đề cử kỷ lục & Diễn đàn kinh tế kỷ lục
            </h2>
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
              Viện Kỷ lục Việt Nam mở cổng tiếp nhận hồ sơ đề cử công trình, sáng kiến và phát minh của các tổ chức, doanh nhân, nghệ nhân trên toàn quốc. Đồng thời định kỳ tổ chức Diễn đàn Kinh tế Kỷ lục kết nối chuyển giao công nghệ và hợp tác đầu tư.
            </p>
          </div>
          <div className="lg:col-span-5 bg-surface-container-low border border-[#e8dfd3] rounded-xl p-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-5">
              Quy trình nộp hồ sơ
            </h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Điền thông tin cơ bản', desc: 'Hoàn thiện hồ sơ trực tuyến theo mẫu quy chuẩn của Viện Kỷ lục.' },
                { step: 2, title: 'Hội đồng Viện xem xét thẩm định', desc: 'Hội đồng chuyên gia thẩm định hồ sơ thực tế và dữ liệu chứng minh.' },
                { step: 3, title: 'Công bố và trao bằng kỷ lục', desc: 'Xác lập kỷ lục và tôn vinh tại Đại hội Thường niên Kỷ lục gia.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface leading-tight">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TrainingSection() {
  return (
    <section className="w-full py-20 lg:py-24 bg-white px-6 lg:px-12 border-t border-[#f0ebe1]" id={sectionIds.training}>
      <div className="max-w-7xl mx-auto flex flex-col">
        <SectionHeading eyebrow={trainingSection.tag} title={trainingSection.title_main} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <article
              className="p-8 rounded-2xl bg-surface-container-low border border-[#e8dfd3] flex flex-col justify-between shadow-sm space-y-6 hover:border-secondary transition-colors"
              key={program.id}
            >
              <div className="space-y-4">
                <Icon name={program.icon || 'cap'} size={32} className="text-secondary" />
                <h3 className="text-lg font-bold text-primary leading-snug">
                  {program.title}
                </h3>
                {program.description && (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {program.description}
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-[#e8dfd3] flex flex-col gap-3">
                {program.detail && (
                  <span className="text-xs text-primary font-bold block">
                    {program.detail}
                  </span>
                )}
                {program.action && program.href && (
                  <Button
                    href={program.href}
                    variant="text"
                    icon="arrow"
                    iconPosition="end"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors self-start"
                  >
                    {program.action}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Advisory Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-surface-container-low border border-[#e0d8cc] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="p-3 bg-secondary/15 rounded-xl text-secondary shrink-0">
              <Icon name="headset" size={40} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-primary">{advisory.title}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">{advisory.description}</p>
            </div>
          </div>
          {advisory.actionButton?.text && advisory.actionButton?.href && (
            <Button
              href={advisory.actionButton.href}
              variant="primary"
              size="md"
              icon={null}
              className="min-h-[50px] px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white transition-all text-xs uppercase tracking-wider font-bold shrink-0 shadow flex items-center justify-center whitespace-nowrap"
            >
              {advisory.actionButton.text}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
