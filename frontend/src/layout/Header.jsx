import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site, siteLinks } from '../config/shared/site.js';
import Brand from '../components/shared/Brand.jsx';
import Icon from '../components/shared/Icon.jsx';

export default function Header({ menuOpen: externalMenuOpen, setMenuOpen: externalSetMenuOpen }) {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(80);
  const location = useLocation();

  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const toggleMenu = externalSetMenuOpen || setInternalMenuOpen;

  const handleToggleMenu = (val) => {
    const nextState = typeof val === 'boolean' ? val : !isMenuOpen;
    toggleMenu(nextState);
  };

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

  // Update header height when scroll state changes or window resizes
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [isScrolled]);

  // Lock body scroll when mobile navigation is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    handleToggleMenu(false);
  }, [location.pathname]);

  // Close menu on Escape key press or desktop breakpoint resize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        handleToggleMenu(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1280 && isMenuOpen) {
        handleToggleMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

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
      return currentPath === '/';
    }
    if (item === siteLinks.about) {
      return currentPath === '/about';
    }
    if (item === siteLinks.events) {
      return currentPath === '/events';
    }
    if (item === siteLinks.records) {
      return currentPath === '/records';
    }
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
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 bg-white border-b border-[#e5e5e5] shadow-xs transition-all duration-300 ${
        isScrolled ? 'py-1.5 shadow-md' : 'py-0'
      }`}
    >
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 gap-3 xl:gap-6 ${
            isScrolled ? 'h-[50px] md:h-[60px]' : 'h-[80px] md:h-[90px]'
          }`}
        >
          <div className="shrink-0 flex items-center">
            <Brand />
          </div>

          {/* Desktop Navigation (>= xl) */}
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

          {/* Mobile / Tablet Toggle (< xl) */}
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
              onClick={() => handleToggleMenu()}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isMenuOpen
                  ? 'bg-rose-50 text-[#680007]'
                  : 'text-gray-700 hover:text-[#680007] hover:bg-gray-100'
              }`}
              aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              <Icon name={isMenuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Fullscreen Overlay Nav */}
      {isMenuOpen && (
        <div
          style={{
            top: `${headerHeight}px`,
            height: `calc(100dvh - ${headerHeight}px)`,
          }}
          className="xl:hidden fixed inset-x-0 bottom-0 bg-[#faf9f7] z-50 flex flex-col justify-between overflow-y-auto border-t border-[#e5e5e5] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Main Links Container */}
          <div className="px-4 py-4 sm:px-6 space-y-1.5 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-[#680007]">
                Danh mục điều hướng
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {navItems.length} chuyên mục
              </span>
            </div>

            {navItems.map((item) => {
              const active = isLinkActive(item);
              const isExternal = item.href?.startsWith('http') || item.href?.startsWith('#');

              const content = (
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                    active
                      ? 'bg-[#680007] text-white font-bold shadow-xs'
                      : 'text-gray-700 hover:text-[#680007] hover:bg-gray-100 font-medium'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span
                    className={`text-xs transition-transform ${
                      active ? 'text-rose-200' : 'text-gray-400'
                    }`}
                  >
                    →
                  </span>
                </div>
              );

              if (isExternal) {
                return (
                  <a
                    key={item.href || item.label}
                    href={item.href}
                    onClick={() => handleToggleMenu(false)}
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href || item.label}
                  to={item.href}
                  onClick={() => handleToggleMenu(false)}
                  className="block"
                >
                  {content}
                </Link>
              );
            })}
          </div>

          {/* Bottom Drawer Actions & Info */}
          <div className="p-4 sm:p-6 bg-white border-t border-[#e5e5e5] space-y-3 shrink-0 shadow-lg">
            <button
              type="button"
              onClick={() => handleToggleMenu(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#680007] hover:bg-[#850009] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              title="Tài khoản đại biểu"
            >
              <Icon name="person" size={18} />
              <span>Cổng thông tin Đại biểu / Kỷ lục gia</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-1 pt-1">
              <span>
                Hotline:{' '}
                <a
                  href={site.contact.phoneHref}
                  className="font-bold text-gray-800 hover:text-[#680007]"
                >
                  {site.contact.phone}
                </a>
              </span>
              <span className="text-[11px] text-gray-400">
                {site.shortName} • {site.institute}
              </span>
            </div>
          </div>

        </div>
      )}
    </header>
  );
}