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
    <div className={`home-section-heading flex flex-col${light ? ' home-section-heading--light' : ''}${left ? ' home-section-heading--left' : ''}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <i aria-hidden="true" />
    </div>
  )
}

export function AboutSection() {
  return (
    <section className="home-section home-section--white" id={sectionIds.about}>
      <div className="home-container">
        <SectionHeading eyebrow={about.eyebrow} title={about.title} />
        <div className="home-about-grid grid lg:grid-cols-[5fr_7fr]">
          <div className="home-about-photo">
            <img src={about.image} alt={about.imageAlt} loading="lazy" />
            <div className="home-about-photo-shade" aria-hidden="true" />
            <div className="home-about-caption">
              <h3>{about.captionTitle}</h3>
              <p>{about.caption}</p>
            </div>
          </div>
          <div className="home-about-content flex flex-col items-start">
            <article className="home-mission-card">
              <div className="home-mission-title"><span><Icon name="landmark" size={24} /></span><h3>{about.missionTitle}</h3></div>
              <p>{about.mission}</p>
            </article>
            <div className="home-values-grid grid min-[680px]:grid-cols-2">
              {about.values.map((value) => (
                <article className="home-value-card" key={value.title}>
                  <div><Icon name={value.icon} size={27} /><h3>{value.title}</h3></div>
                  <p>{value.description}</p>
                </article>
              ))}
            </div>
            {about.actionButton.text && about.actionButton.href && <Button
              href={about.actionButton.href}
              variant="primary"
              size="md"
              icon="arrow"
              iconPosition="end"
              className="mt-2 uppercase tracking-wider text-xs md:text-sm font-bold shadow-sm hover:shadow-md"
            >
              {about.actionButton.text}
            </Button>}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EventsSection() {
  return (
    <section className="home-section home-section--cream" id={sectionIds.events}>
      <div className="home-container">
        <div className="home-events-heading flex items-center justify-between gap-4 mb-10">
          <SectionHeading eyebrow={eventsSection.tag} title={eventsSection.title_main} left />
          {eventsSection.action_button?.text && eventsSection.action_button?.link && <Button
            href={eventsSection.action_button.link}
            variant="text-gold"
            icon="arrow"
            iconPosition="end"
            className="text-xs md:text-sm font-bold uppercase tracking-wider hover:translate-x-0.5 transition-transform"
          >
            {eventsSection.action_button.text}
          </Button>}
        </div>
        <div className="home-events-grid grid min-[900px]:grid-cols-3">
          {events.map((event) => (
            <article className="home-event-card group" key={event.id}>
              {event.image && <button
                type="button"
                className="home-event-photo relative block w-full overflow-hidden text-left cursor-pointer"
                aria-label={`Đọc báo cáo: ${event.title}`}
              >
                <img
                  src={event.image}
                  alt={event.imageAlt}
                  loading="lazy"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <span>{event.date}</span>
              </button>}
              <div className="home-event-copy">
                <div>
                  <span className="home-event-category">{event.category}</span>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                {event.action && event.href && <Button
                  href={event.href}
                  variant="text"
                  icon="arrow"
                  iconPosition="end"
                  className="w-full pt-4 border-t border-[#eee9e2] text-xs font-bold uppercase tracking-wider justify-between hover:text-[#b45309]"
                >
                  {event.action}
                </Button>}
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
    <section className="home-section home-section--wine" id={sectionIds.awards}>
      <div className="home-container">
        <SectionHeading eyebrow="HỆ THỐNG DANH VỊ DANH DỰ" title="Giải thưởng & Tôn vinh Danh hiệu" light />
        <div className="home-awards-grid grid min-[900px]:grid-cols-3" id={sectionIds.records}>
          {awards.map((award) => (
            <article className={`home-award-card${award.featured ? ' home-award-card--featured' : ''} flex flex-col justify-between`} key={award.id}>
              {award.featured && <span className="home-award-featured">{award.featuredLabel}</span>}
              <span className="home-award-icon"><Icon name={award.icon} size={38} /></span>
              <h3>{award.title}</h3>
              <p>{award.description}</p>
              {award.action && award.href && <Button
                href={award.href}
                variant={award.featured ? 'gold' : 'gold-outline'}
                size="pill-sm"
                icon="arrow"
                iconPosition="end"
                className="mt-4 uppercase tracking-wider text-xs font-bold"
              >
                {award.action}
              </Button>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProjectsSection() {
  return (
    <section className="home-section home-section--white" id={sectionIds.projects}>
      <div className="home-container">
        <SectionHeading eyebrow={projectsSection.tag} title={projectsSection.title_main} />
        <div className="home-projects-grid grid min-[900px]:grid-cols-2">
          {projects.map((project) => (
            <article className="home-project-card group" id={project.sectionId} key={project.id}>
              <div>
                <span className={`home-project-category${project.featured ? ' home-project-category--featured' : ''}`}>
                  <Icon name={project.icon} size={18} />{project.category}
                </span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              {project.image && <button
                type="button"
                className="home-project-photo relative block w-full overflow-hidden text-left cursor-pointer"
                aria-label={project.action}
              >
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  loading="lazy"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <span>{project.caption}</span>
              </button>}
              {project.action && project.href && <Button
                href={project.href}
                variant="text"
                icon="arrow"
                iconPosition="end"
                className="self-start text-xs md:text-sm font-bold uppercase tracking-wider text-[#680007] hover:text-[#b45309] gap-2 pt-2"
              >
                {project.action}
              </Button>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RecordsForumSection() {
  return (
    <section className="home-section home-section--cream" id="de-cu-va-dien-dan">
      <div className="home-container">
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-white border border-[#eee9e2] rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-xs font-bold uppercase tracking-widest">
              Liên Minh Chiến Lược
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#680007] uppercase tracking-tight">
              Đề cử kỷ lục & Diễn đàn kinh tế kỷ lục
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Viện Kỷ lục Việt Nam mở cổng tiếp nhận hồ sơ đề cử công trình, sáng kiến và phát minh của các tổ chức, doanh nhân, nghệ nhân trên toàn quốc. Đồng thời định kỳ tổ chức Diễn đàn Kinh tế Kỷ lục kết nối chuyển giao công nghệ và hợp tác đầu tư.
            </p>
          </div>
          <div className="lg:col-span-5 bg-[#faf9f7] border border-[#eee9e2] rounded-xl p-6">
            <h3 className="text-sm font-bold text-[#680007] uppercase tracking-wider mb-5">
              Quy trình nộp hồ sơ
            </h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Điền thông tin cơ bản', desc: 'Hoàn thiện hồ sơ trực tuyến theo mẫu quy chuẩn của Viện Kỷ lục.' },
                { step: 2, title: 'Hội đồng Viện xem xét thẩm định', desc: 'Hội đồng chuyên gia thẩm định hồ sơ thực tế và dữ liệu chứng minh.' },
                { step: 3, title: 'Công bố và trao bằng kỷ lục', desc: 'Xác lập kỷ lục và tôn vinh tại Đại hội Thường niên Kỷ lục gia.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-[#680007] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1c1b] leading-tight">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-normal">{item.desc}</p>
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
    <section className="home-section home-section--white" id={sectionIds.training}>
      <div className="home-container">
        <SectionHeading eyebrow={trainingSection.tag} title={trainingSection.title_main} />
        <div className="home-programs-grid grid min-[900px]:grid-cols-3">
          {programs.map((program) => (
            <article className="home-program-card" key={program.id}>
              <div>
                <Icon name={program.icon} size={32} />
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </div>
              <div className="home-program-footer">
                <strong>{program.detail}</strong>
                {program.action && program.href && <Button
                  href={program.href}
                  variant="text-gold"
                  icon="arrow"
                  iconPosition="end"
                  className="text-xs font-bold uppercase tracking-wider hover:translate-x-0.5 transition-transform"
                >
                  {program.action}
                </Button>}
              </div>
            </article>
          ))}
        </div>
        <div className="home-advisory flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 p-8 border border-[#e5e5e5] rounded-2xl bg-[#faf9f7] shadow-sm">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <div className="p-3 bg-amber-50 rounded-xl text-[#d49520] shrink-0">
              <Icon name="headset" size={40} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-[#680007]">{advisory.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{advisory.description}</p>
            </div>
          </div>
          {advisory.actionButton.text && advisory.actionButton.href && <Button
            href={advisory.actionButton.href}
            variant="primary"
            size="md"
            icon={null}
            className="w-full sm:w-auto shrink-0 uppercase tracking-wider text-xs md:text-sm font-bold shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {advisory.actionButton.text}
          </Button>}
        </div>
      </div>
    </section>
  )
}
