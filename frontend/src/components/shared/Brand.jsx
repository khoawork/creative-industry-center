import { Link } from 'react-router-dom'
import { site, siteLinks } from '../../config/shared/site.js'
import logo from '../../assets/shared/logo/creative-industry-center-logo.png'

export default function Brand({ compact = false, onNavigate }) {
  return (
    <Link
      className={compact ? 'brand brand--footer' : 'flex min-w-0 items-center gap-2 text-black sm:gap-3'}
      to={siteLinks.home.href}
      aria-label={`${site.name} — ${siteLinks.home.label}`}
      onClick={onNavigate ? (event) => onNavigate(event, siteLinks.home.href) : undefined}
    >
      <img className={compact ? 'brand-mark' : 'size-9 shrink-0 rounded-full object-contain sm:size-11'} src={logo} width="56" height="56" alt="" />
      <span className="min-w-0">
        <strong className={compact ? 'uppercase' : 'block text-[11px] leading-snug font-bold whitespace-normal uppercase min-[400px]:text-xs sm:text-[15px]'}>{compact ? site.shortName : site.name}</strong>
        <small className={compact ? undefined : 'mt-1 block text-[8px] leading-snug font-medium whitespace-normal text-[#d49520] min-[400px]:text-[9px] sm:text-[11px]'}>{compact ? site.institute : site.tagline}</small>
      </span>
    </Link>
  )
}
