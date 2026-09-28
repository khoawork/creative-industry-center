import { site, siteLinks } from '../../config/shared/site.js'
import logo from '../../assets/shared/logo/creative-industry-center-logo.png'

export default function Brand({ compact = false, onNavigate }) {
  return <a className={`brand${compact ? ' brand--footer' : ''}`} href={siteLinks.home.href} aria-label={`${site.name} — ${siteLinks.home.label}`} onClick={onNavigate ? (event) => onNavigate(event, siteLinks.home.href) : undefined}>
    <img className="brand-mark" src={logo} width="56" height="56" alt="" />
    <span><strong className="uppercase">{compact ? site.shortName : site.name}</strong><small>{compact ? site.institute : site.tagline}</small></span>
  </a>
}
