import { useSiteSettings } from '../../context/SiteSettingsContext.jsx'
import defaultLogo from '../../assets/shared/logo/creative-industry-center-logo.png'

export default function ContactHero({ intro = {} }) {
  const { settings } = useSiteSettings()
  const siteLogo = settings?.logo && settings.logo.trim() && !settings.logo.endsWith('creative-industry-center-logo.png')
    ? settings.logo
    : defaultLogo

  const logoSrc = intro?.logo?.trim() || intro?.image?.trim() || siteLogo

  return (
    <section aria-labelledby="contact-title" className="bg-white shadow-sm">
      <div className="mx-auto max-w-[75rem] px-4 pt-12 pb-8 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {logoSrc && (
            <div className="mb-4 flex items-center justify-center">
              <img
                src={logoSrc}
                alt={intro?.title || "Logo"}
                className="h-16 md:h-20 w-auto max-w-[280px] object-contain transition-transform duration-200 hover:scale-105"
              />
            </div>
          )}
          <div className="relative pb-3">
            <h1 id="contact-title" className="text-[28px] leading-10 font-bold tracking-tight text-[var(--contact-red)] uppercase md:text-[50px]">{intro.title || "LIÊN HỆ"}</h1>
            <span aria-hidden="true" className="absolute bottom-0 left-1/2 flex h-1 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--contact-red)]">
              <span className="h-1.5 w-3 rounded-full bg-[var(--contact-gold)]" />
            </span>
          </div>
          {intro.description && (
            <p className="mt-4 text-base leading-7 md:text-lg">{intro.description}</p>
          )}
        </div>
      </div>
    </section>
  )
}

