import Button from '../shared/Button.jsx'
import Icon from '../shared/Icon.jsx'
import { hero, statistics } from '../../config/Home/homeData.js'
import { sectionIds, siteHeading, siteLinks } from '../../config/shared/site.js'

export default function HomeHero({ onNavigate }) {
  return (
    <section className="home-hero relative isolate flex items-center overflow-hidden text-center" id={sectionIds.home}>
      <svg className="home-hero-watermark" viewBox="0 0 200 200" fill="currentColor" aria-hidden="true">
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="2" />
        <polygon points="100,14 120,72.5 181.8,73.4 132.3,110.5 150.5,169.6 100,134 49.5,169.6 67.7,110.5 18.2,73.4 80,72.5" />
        <circle cx="100" cy="100" r="22" />
      </svg>
      <div className="home-container home-hero-inner flex flex-col items-center">
        <div className="home-hero-badge"><Icon name="star" size={20} /><span>{hero.badge}</span><Icon name="star" size={20} /></div>
        <h1 className="home-hero-title uppercase">{siteHeading.lead} {siteHeading.accent}</h1>
        <span className="home-hero-rule" aria-hidden="true" />
        <p className="home-hero-subtitle">{hero.subtitle}</p>
        <p className="home-hero-slogan">{hero.slogan}</p>
        <div className="home-hero-actions flex flex-wrap items-stretch justify-center">
          <Button href={siteLinks.about.href} onClick={(event) => onNavigate(event, siteLinks.about.href)}>Tìm hiểu Về Chúng Tôi</Button>
          <Button href={siteLinks.records.href} onClick={(event) => onNavigate(event, siteLinks.records.href)} variant="outline" icon="premium" iconPosition="start">Khám Phá Kỷ Lục & Dự Án</Button>
        </div>
        <div className="home-stats grid grid-cols-2 md:grid-cols-4" aria-label="Thành tựu nổi bật">
          {statistics.map((stat) => (
            <div className="home-stat flex flex-col items-center" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
