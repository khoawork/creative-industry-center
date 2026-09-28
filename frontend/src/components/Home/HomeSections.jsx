import Button from '../shared/Button.jsx'
import Icon from '../shared/Icon.jsx'
import { about, advisory, awards, events, programs, projects } from '../../config/Home/homeData.js'
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
            <Button>Xem chi tiết giới thiệu</Button>
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
        <div className="home-events-heading">
          <SectionHeading eyebrow="DÒNG THỜI GIAN HOẠT ĐỘNG" title="Sự kiện Nổi bật & Hoạt động Mới" left />
          <Button variant="text">Xem tất cả sự kiện</Button>
        </div>
        <div className="home-events-grid grid min-[900px]:grid-cols-3">
          {events.map((event) => (
            <article className="home-event-card" key={event.id}>
              <button className="home-event-photo" aria-label={`Đọc báo cáo: ${event.title}`}>
                <img src={event.image} alt={event.imageAlt} loading="lazy" />
                <span>{event.date}</span>
              </button>
              <div className="home-event-copy">
                <div><span className="home-event-category">{event.category}</span><h3>{event.title}</h3><p>{event.description}</p></div>
                <Button variant="text">Đọc báo cáo sự kiện</Button>
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
            <article className={`home-award-card${award.featured ? ' home-award-card--featured' : ''}`} key={award.id}>
              {award.featured && <span className="home-award-featured">{award.featuredLabel}</span>}
              <span className="home-award-icon"><Icon name={award.icon} size={38} /></span>
              <h3>{award.title}</h3>
              <p>{award.description}</p>
              <span className="home-award-tag">{award.tag}</span>
            </article>
          ))}
        </div>
        <Button variant="white">Xem chi tiết danh mục giải thưởng</Button>
      </div>
    </section>
  )
}

export function ProjectsSection() {
  return (
    <section className="home-section home-section--white" id={sectionIds.projects}>
      <div className="home-container">
        <SectionHeading eyebrow="HÀNH TRÌNH THỰC TIỄN" title="Dự án Tiêu biểu & Chuyện Nhà Sáng Nghiệp" />
        <div className="home-projects-grid grid min-[900px]:grid-cols-2">
          {projects.map((project) => (
            <article className="home-project-card" id={project.sectionId} key={project.id}>
              <div>
                <span className={`home-project-category${project.featured ? ' home-project-category--featured' : ''}`}><Icon name={project.icon} size={18} />{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <button className="home-project-photo" aria-label={project.action}>
                <img src={project.image} alt={project.imageAlt} loading="lazy" />
                <span>{project.caption}</span>
              </button>
              <Button variant="text">{project.action}</Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TrainingSection() {
  return (
    <section className="home-section home-section--white" id={sectionIds.training}>
      <div className="home-container">
        <SectionHeading eyebrow="BỒI DƯỠNG & LAN TỎA" title="Chương trình Hợp tác & Đào tạo" />
        <div className="home-programs-grid grid min-[900px]:grid-cols-3">
          {programs.map((program) => (
            <article className="home-program-card" key={program.id}>
              <div><Icon name={program.icon} size={32} /><h3>{program.title}</h3><p>{program.description}</p></div>
              <div className="home-program-footer"><strong>{program.detail}</strong><Button variant="text">{program.action}</Button></div>
            </article>
          ))}
        </div>
        <div className="home-advisory">
          <Icon name="headset" size={42} />
          <div><h3>{advisory.title}</h3><p>{advisory.description}</p></div>
          <Button icon={null}>Kết Nối Ngay</Button>
        </div>
      </div>
    </section>
  )
}
