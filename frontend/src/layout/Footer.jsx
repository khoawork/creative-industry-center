import Brand from '../components/shared/Brand.jsx'
import { site, sectionIds, footerGroups } from '../config/shared/site.js'
import './Layout.css'

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer" id={sectionIds.contact}>
      <div className="footer-container">
        <div className="footer-columns grid min-[681px]:grid-cols-2 min-[961px]:grid-cols-4">
          <div className="footer-identity">
            <Brand compact onNavigate={onNavigate} />
            <p>{site.description}</p>
          </div>
          {footerGroups.map((group) => (
            <div className="footer-group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}><a href={link.href} onClick={onNavigate ? (event) => onNavigate(event, link.href) : undefined}>{link.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-contact">
            <h2>Thông Tin Liên Hệ</h2>
            <p><strong>Trụ sở chính:</strong> {site.contact.address}</p>
            <p><strong>Đường dây nóng:</strong> <a href={site.contact.phoneHref}>{site.contact.phone}</a></p>
            <p><strong>Thư điện tử:</strong> {site.contact.emails.map((email, index) => <span key={email}>{index > 0 && ' / '}<a href={`mailto:${email}`}>{email}</a></span>)}</p>
          </div>
        </div>
        <p className="footer-copyright">© {new Date().getFullYear()} Bản quyền thuộc {site.name} - {site.institute}. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  )
}
