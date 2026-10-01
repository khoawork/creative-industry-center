import Button from '../shared/Button.jsx'
import Icon from '../shared/Icon.jsx'
import { hero, statistics } from '../../data/homeData.js'
import { sectionIds } from '../../config/shared/site.js'

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
        <h1 className="home-hero-title uppercase">{hero.title}</h1>
        <span className="home-hero-rule" aria-hidden="true" />
        <p className="home-hero-subtitle">{hero.subtitle}</p>
        <p className="home-hero-slogan">{hero.slogan}</p>
        <div className="home-hero-actions flex flex-wrap items-center justify-center gap-4 mt-8 w-full">
          {hero.buttons.map((button, index) => (
            <Button
              key={`${button.href}-${button.text}`}
              href={button.href}
              onClick={(event) => onNavigate(event, button.href)}
              variant={index === 0 ? 'primary' : 'outline'}
              size="lg"
              icon={index === 0 ? 'arrow' : 'medal'}
              iconPosition={index === 0 ? 'end' : 'start'}
              className="w-full sm:w-auto min-w-[240px] uppercase tracking-wider text-xs md:text-sm font-bold shadow-md hover:shadow-lg"
            >
              {button.text}
            </Button>
          ))}
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
