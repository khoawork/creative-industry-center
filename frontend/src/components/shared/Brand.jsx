import { Link } from 'react-router-dom'
import { site, siteLinks } from '../../config/shared/site.js'
import defaultLogo from '../../assets/shared/logo/creative-industry-center-logo.png'
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx'

export default function Brand({ compact = false, onNavigate }) {
  const { settings } = useSiteSettings()

  const companyName = settings?.company_name || site.name
  const companyTagline = settings?.company_tagline || site.tagline
  const shortName = settings?.footer?.short_name || site.shortName
  const institute = settings?.footer?.institute || site.institute

  const logoSrc = settings?.logo && settings.logo.trim() && !settings.logo.endsWith('creative-industry-center-logo.png')
    ? settings.logo
    : defaultLogo

  return (
    <Link
      className={compact ? 'brand brand--footer' : 'flex min-w-0 items-center gap-2 text-black sm:gap-3'}
      to={siteLinks.home.href}
      aria-label={`${companyName} — ${siteLinks.home.label}`}
      onClick={onNavigate ? (event) => onNavigate(event, siteLinks.home.href) : undefined}
    >
      <img
        className={compact ? 'brand-mark' : 'size-9 shrink-0 rounded-full object-contain sm:size-11'}
        src={logoSrc}
        width="56"
        height="56"
        alt={companyName}
      />
      <span className="min-w-0">
        <strong className={compact ? 'uppercase' : 'block text-[11px] leading-snug font-bold whitespace-normal uppercase min-[400px]:text-xs sm:text-[15px]'}>
          {compact ? shortName : companyName}
        </strong>
        <small className={compact ? undefined : 'mt-1 block text-[8px] leading-snug font-medium whitespace-normal text-[#d49520] min-[400px]:text-[9px] sm:text-[11px]'}>
          {compact ? institute : companyTagline}
        </small>
      </span>
    </Link>
  )
}
