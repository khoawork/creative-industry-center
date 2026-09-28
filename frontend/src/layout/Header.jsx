import Brand from '../components/shared/Brand.jsx'
import Icon from '../components/shared/Icon.jsx'
import './Layout.css'

export default function Header({ navigation, menuOpen, setMenuOpen, activeSection, openDialog }) {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand />
        <button
          className="menu-toggle icon-button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
        <nav
          id="main-navigation"
          aria-label="Điều hướng chính"
          className={`main-navigation${menuOpen ? ' is-open' : ''}`}
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeSection === item.href ? 'location' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button className="nav-contact" onClick={() => openDialog('contact')}>
            Liên hệ <span><Icon name="arrow" size={15} /></span>
          </button>
        </nav>
      </div>
    </header>
  )
}
