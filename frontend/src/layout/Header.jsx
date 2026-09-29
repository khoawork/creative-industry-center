import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site, siteLinks } from '../config/shared/site.js';
import Brand from '../components/shared/Brand.jsx';
import Icon from '../components/shared/Icon.jsx';

export default function Header({ menuOpen: externalMenuOpen, setMenuOpen: externalSetMenuOpen }) {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const location = useLocation();

  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const toggleMenu = externalSetMenuOpen || setInternalMenuOpen;

  // The 10 navigation items in the exact sequence as shown in the mockup:
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

  // Helper to determine if an item is active
  const isLinkActive = (item) => {
    if (!item?.href) return false;
    const currentPath = location.pathname;

    if (item === siteLinks.home) {
      return currentPath === '/' || currentPath === '/trang-chu';
    }
    if (item === siteLinks.about) {
      return currentPath === '/about' || currentPath === '/gioi-thieu';
    }
    if (item === siteLinks.events) {
      return currentPath === '/event-active' || currentPath === '/su-kien';
    }
    if (item === siteLinks.records) {
      return currentPath === '/de-cu-ky-luc' || currentPath === '/records';
    }
    if (item === siteLinks.projects) {
      return currentPath === '/projects' || currentPath === '/du-an-noi-bat';
    }
    if (item === siteLinks.awards) {
      return currentPath === '/awards' || currentPath === '/giai-thuong';
    }
    if (item === siteLinks.stories) {
      return currentPath === '/founder-stories' || currentPath === '/chuyen-nha-sang-nghiep';
    }
    if (item === siteLinks.forum) {
      return currentPath === '/dien-dan-kinh-te-ky-luc';
    }
    if (item === siteLinks.training) {
      return currentPath === '/hop-tac-va-dao-tao';
    }
    if (item === siteLinks.contact) {
      return currentPath === '/lien-he';
    }

    return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5] shadow-xs transition-all">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px] md:h-[84px] gap-3 xl:gap-6">
          
          {/* Brand Logo & Title on Left */}
          <div className="shrink-0 flex items-center">
            <Brand />
          </div>

          {/* Center Navigation Links - all 10 items in a clean single line */}
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