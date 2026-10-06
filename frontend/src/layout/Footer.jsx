import Brand from '../components/shared/Brand.jsx'
import { site, sectionIds, footerGroups } from '../config/shared/site.js'
import { useSiteSettings } from '../context/SiteSettingsContext.jsx'
import './Layout.css'

export default function Footer({ onNavigate }) {
  const { settings } = useSiteSettings()

  const footerData = settings?.footer || {}
  const description = footerData.description || site.description
  const groups = Array.isArray(footerData.groups) && footerData.groups.length > 0 ? footerData.groups : footerGroups
  const contact = footerData.contact || site.contact
  const contactEmails = Array.isArray(contact.emails) ? contact.emails : (site.contact.emails || [])
  const phoneHref = contact.phone_href || site.contact.phoneHref || `tel:${(contact.phone || '').replace(/\D/g, '')}`
  const copyright = footerData.copyright || `© ${new Date().getFullYear()} Bản quyền thuộc ${settings?.company_name || site.name} - ${footerData.institute || site.institute}. Bảo lưu mọi quyền.`

  return (
    <footer className="site-footer" id={sectionIds.contact}>
      <div className="footer-container">
        <div className="footer-columns grid min-[681px]:grid-cols-2 min-[961px]:grid-cols-4">
          <div className="footer-identity">
            <Brand compact onNavigate={onNavigate} />
            <p>{description}</p>
          </div>
          {groups.map((group) => (
            <div className="footer-group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {(group.links || []).map((link) => (
                  <li key={link.label || link.href}>
                    <a
                      href={link.href}
                      onClick={onNavigate ? (event) => onNavigate(event, link.href) : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-contact">
            <h2>{contact.title || 'Thông Tin Liên Hệ'}</h2>
            <p><strong>Trụ sở chính:</strong> {contact.address || site.contact.address}</p>
            <p><strong>Đường dây nóng:</strong> <a href={phoneHref}>{contact.phone || site.contact.phone}</a></p>
            <p>
              <strong>Thư điện tử:</strong>{' '}
              {contactEmails.map((email, index) => (
                <span key={email}>
                  {index > 0 && ' / '}
                  <a href={`mailto:${email}`}>{email}</a>
                </span>
              ))}
            </p>
          </div>
        </div>
        <p className="footer-copyright">{copyright}</p>
      </div>
    </footer>
  )
}
