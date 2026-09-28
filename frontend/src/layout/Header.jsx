import Brand from '../components/shared/Brand.jsx'
import Icon from '../components/shared/Icon.jsx'
import './Layout.css'

export default function Header({ navigation, menuOpen, setMenuOpen, activeSection, selectSection }) {
  return (
    <header className="site-header">
      <div className="header-inner flex-nowrap">
        <Brand onNavigate={selectSection} />
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
              className={item.icon ? 'nav-contact' : undefined}
              aria-current={activeSection === item.href ? 'location' : undefined}
              onClick={(event) => selectSection(event, item.href)}
            >
              <span className="nav-label">{item.label}</span>
              {item.icon && <span className="nav-contact-icon"><Icon name={item.icon} size={18} /></span>}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
