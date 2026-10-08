import Button from '../shared/Button.jsx'
import Icon from '../shared/Icon.jsx'
import { hero, statistics } from '../../data/homeData.js'
import { sectionIds } from '../../config/shared/site.js'

export default function HomeHero({ onNavigate }) {
  return (
    <section
      className="relative w-full min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fbfbfa] via-[#f7f5f0] to-[#ffffff]"
      id={sectionIds.home}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none" aria-hidden="true">
        <svg className="w-[850px] h-[850px] text-primary" viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="100,10 108,70 168,70 120,105 138,165 100,128 62,165 80,105 32,70 92,70" />
          <circle cx="100" cy="100" r="22" fill="currentColor" />
        </svg>
      </div>

      {/* Soft Radial Scrim */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24 text-center flex flex-col items-center">
        {/* Seal Ribbon */}
        {hero.badge && (
          <div className="inline-flex items-center gap-2.5 px-6 py-3 mb-8 rounded-full bg-white border border-[#ebd8b7] shadow-sm">
            <Icon name="star" size={18} className="text-secondary" />
            <span className="text-xs text-primary-dark font-bold tracking-[0.2em] uppercase">{hero.badge}</span>
            <Icon name="star" size={18} className="text-secondary" />
          </div>
        )}

        {/* Main Symmetrical Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary max-w-4xl tracking-tight uppercase mb-6 leading-[1.15]">
          {hero.title}
        </h1>

        <div className="w-36 h-1.5 bg-secondary mb-6 rounded-full mx-auto" aria-hidden="true" />

        {hero.subtitle && (
          <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl font-semibold mb-7 uppercase tracking-wider">
            {hero.subtitle}
          </p>
        )}

        {/* Slogan */}
        {hero.slogan && (
          <div className="bg-primary/5 border border-primary/15 backdrop-blur-sm px-8 py-3.5 rounded-full shadow-sm mb-10">
            <p className="text-base md:text-lg text-primary font-bold tracking-wide">
              {hero.slogan}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-2xl">
          {hero.buttons.map((button, index) => (
            <Button
              key={`${button.href}-${button.text}`}
              href={button.href}
              onClick={(event) => onNavigate(event, button.href)}
              variant={index === 0 ? 'primary' : 'outline'}
              size="lg"
              icon={index === 0 ? 'arrow' : 'premium'}
              iconPosition={index === 0 ? 'end' : 'start'}
              className={
                index === 0
                  ? 'w-full sm:w-auto min-h-[54px] px-8 py-3.5 rounded-lg bg-primary hover:bg-primary-dark text-white shadow-lg flex items-center justify-center gap-3 transition-all duration-300 text-sm font-bold uppercase tracking-wider group'
                  : 'w-full sm:w-auto min-h-[54px] px-8 py-3.5 rounded-lg bg-white border-2 border-secondary/60 hover:border-secondary hover:bg-surface-container-low text-primary shadow-sm flex items-center justify-center gap-3 transition-all duration-300 text-sm font-bold uppercase tracking-wider'
              }
            >
              {button.text}
            </Button>
          ))}
        </div>

        {/* Key Stat Pillars */}
        {statistics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-16 pt-8 bg-white border border-[#e8dfd3] rounded-2xl p-6 shadow-sm" aria-label="Thành tựu nổi bật">
            {statistics.map((stat, index) => (
              <div
                className={`flex flex-col items-center p-3 ${
                  index % 2 !== 0 ? 'border-l border-[#e8dfd3]' : ''
                } ${index > 0 ? 'md:border-l md:border-[#e8dfd3]' : ''}`}
                key={stat.label}
              >
                <span className="text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</span>
                <span className="text-xs md:text-sm text-on-surface-variant font-semibold text-center mt-1 uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
