import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site, siteLinks } from '../config/shared/site.js';
import Brand from '../components/shared/Brand.jsx';
import Icon from '../components/shared/Icon.jsx';
import { PageAPI } from '../api/pageApi.js';

export default function Header({ menuOpen: externalMenuOpen, setMenuOpen: externalSetMenuOpen }) {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
      if (window.innerWidth >= 1536 && isMenuOpen) {
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

  const defaultNavItems = [
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

  const [navItems, setNavItems] = useState(defaultNavItems);

  useEffect(() => {
    let isMounted = true;
    PageAPI.getHeaderItems()
      .then((res) => {
        const items = res?.data || res;
        if (isMounted && Array.isArray(items) && items.length > 0) {
          const mapped = items.map((p) => {
            const isHome = p.slug === 'home' || p.slug === '';
            return {
              id: p.id,
              label: p.name,
              href: isHome ? '/' : `/${p.slug.replace(/^\/+/, '')}`,
            };
          });
          setNavItems(mapped);
        }
      })
      .catch((err) => {
        console.debug('Using default navigation items', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isLinkActive = (item) => {
    if (!item?.href) return false;
    const currentPath = location.pathname;

    if (item.href === '/') {
      return currentPath === '/' || currentPath === '';
    }

    return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-black/10 [font-family:Inter,sans-serif] shadow-xs motion-safe:transition-all motion-safe:duration-300 ${
        isScrolled ? 'py-1.5 shadow-md' : 'py-0'
      }`}
    >
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between motion-safe:transition-all motion-safe:duration-300 gap-3 xl:gap-6 ${
            isScrolled ? 'min-h-[50px] md:min-h-[60px]' : 'min-h-[80px] md:min-h-[90px]'
          }`}
        >
          <div className="flex min-w-0 items-center 2xl:shrink-0">
            <Brand />
          </div>

          {/* Show the full navigation only when all links fit on one row. */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden 2xl:flex items-center gap-3.5 min-[1760px]:gap-5 justify-end"
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

          {/* Compact navigation for smaller screens. */}
          <div className="flex shrink-0 2xl:hidden items-center gap-1">
            <button
              type="button"
              className="w-11 h-11 rounded-full bg-[#710008] text-white flex items-center justify-center shrink-0 shadow-xs"
              title="Tài khoản đại biểu"
              aria-label="Tài khoản đại biểu"
            >
              <Icon name="person" size={18} />
            </button>

            <button
              type="button"
              onClick={() => handleToggleMenu()}
              className={`p-2.5 rounded-lg motion-safe:transition-colors cursor-pointer ${
                isMenuOpen
                  ? 'bg-[#f4f3f1] text-[#710008]'
                  : 'text-black hover:text-[#710008] hover:bg-[#f4f3f1]'
              }`}
              aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Icon name={isMenuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Fullscreen Overlay Nav */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="2xl:hidden absolute inset-x-0 top-full h-[calc(100dvh-100%)] bg-[#f4f3f1] z-50 flex flex-col justify-between overflow-y-auto overscroll-contain border-t border-black/10 shadow-2xl"
        >
          {/* Main Links Container */}
          <div className="min-h-0 px-4 py-4 sm:px-6 space-y-1.5 flex-1 overflow-y-auto overscroll-contain">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-[#680007]">
                Danh mục điều hướng
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
