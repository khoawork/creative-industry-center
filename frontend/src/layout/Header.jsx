import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site, siteLinks } from '../config/shared/site.js';
import Brand from '../components/shared/Brand.jsx';
import Icon from '../components/shared/Icon.jsx';

export default function Header({ menuOpen: externalMenuOpen, setMenuOpen: externalSetMenuOpen }) {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const toggleMenu = externalSetMenuOpen || setInternalMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    siteLinks.home,
    siteLinks.about,
    siteLinks.events,
    siteLinks.records,
    siteLinks.projects,
    siteLinks.awards,
    siteLinks.stories,
    siteLinks.forum,
    siteLinks.training,
    siteLinks.contact,
  ];

  const isLinkActive = (item) => {
    if (!item?.href) return false;
    const currentPath = location.pathname;

    if (item === siteLinks.home) {
      return currentPath === '/' ;
    }
    if (item === siteLinks.about) {
      return currentPath === '/about';
    }
    if (item === siteLinks.events) {
      return currentPath === '/events';
    }
    if (item === siteLinks.records) {
      return currentPath === '/records'}
    if (item === siteLinks.projects) {
      return currentPath === '/projects';
    }
    if (item === siteLinks.awards) {
      return currentPath === '/awards';
    }
    if (item === siteLinks.stories) {
      return currentPath === '/stories';
    }
    if (item === siteLinks.forum) {
      return currentPath === '/forum';
    }
    if (item === siteLinks.training) {
      return currentPath === '/training';
    }
    if (item === siteLinks.contact) {
      return currentPath === '/contact';
    }

    return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
  };

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-[#e5e5e5] shadow-xs transition-all duration-300 ${
      isScrolled ? 'py-1.5 shadow-md' : 'py-0'
    }`}>
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 gap-3 xl:gap-6 ${
          isScrolled ? 'h-[50px] md:h-[60px]' : 'h-[80px] md:h-[90px]'
        }`}>
          
          <div className="shrink-0 flex items-center">
            <Brand />
          </div>

          <nav
            aria-label="Điều hướng chính"
            className="hidden xl:flex items-center gap-3.5 2xl:gap-5 3xl:gap-6 flex-wrap justify-end"
          >
            {navItems.map((item) => {
              const active = isLinkActive(item);
              const isExternal = item.href?.startsWith('http') || item.href?.startsWith('#');

              const content = (
                <span className="relative py-2 inline-block">
                  <span
                    className={`transition-colors whitespace-nowrap text-[13px] 2xl:text-[13.5px] ${
                      active
                        ? 'text-[#680007] font-bold'
                        : 'text-[#4b5563] hover:text-[#680007] font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#680007] rounded-full"></span>
                  )}
                </span>
              );

              if (isExternal) {
                return (
                  <a
                    key={item.href || item.label}
                    href={item.href}
                    className="inline-flex items-center"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href || item.label}
                  to={item.href}
                  className="inline-flex items-center"
                >
                  {content}
                </Link>
              );
            })}

            <button
              type="button"
              className="ml-1 w-8 h-8 rounded-full bg-[#680007] hover:bg-[#850009] text-white flex items-center justify-center shrink-0 shadow-xs transition-all cursor-pointer"
              title="Tài khoản đại biểu"
              aria-label="Tài khoản đại biểu"
            >
              <Icon name="person" size={18} />
            </button>
          </nav>

          {/* Medium screen navigation fallback (< xl) */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-[#680007] text-white flex items-center justify-center shrink-0 shadow-xs"
              title="Tài khoản đại biểu"
              aria-label="Tài khoản đại biểu"
            >
              <Icon name="person" size={18} />
            </button>

            <button
              type="button"
              onClick={() => toggleMenu(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-[#680007] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              <Icon name={isMenuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}
      {isMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#e5e5e5] px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const active = isLinkActive(item);
            const isExternal = item.href?.startsWith('http') || item.href?.startsWith('#');

            if (isExternal) {
              return (
                <a
                  key={item.href || item.label}
                  href={item.href}
                  onClick={() => toggleMenu(false)}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm ${
                    active
                      ? 'bg-[#ffdad6]/60 text-[#680007] font-bold border-l-3 border-[#680007]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.href || item.label}
                to={item.href}
                onClick={() => toggleMenu(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm ${
                  active
                    ? 'bg-[#ffdad6]/60 text-[#680007] font-bold border-l-3 border-[#680007]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}