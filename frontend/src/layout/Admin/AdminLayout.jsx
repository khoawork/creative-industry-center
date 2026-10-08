import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar.jsx';
import AdminTopbar from '../../components/Admin/AdminTopbar.jsx';
import { findAdminItem } from '../../config/Admin/adminNavigation.js';
import { site } from '../../config/shared/site.js';
import useAdminTheme from '../../hooks/Admin/useAdminTheme.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout({ user: initialUser, unreadCount }) {
  const { user: authUser, logout } = useAuth();
  const user = authUser || initialUser;
  const { theme, toggleTheme } = useAdminTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const contentRef = useRef(null);
  const desktopToggleRef = useRef(null);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const currentItem = findAdminItem(location.pathname);
  const label = currentItem?.label ?? 'Không tìm thấy trang';

  useEffect(() => {
    const originalTitle = document.title;
    const originalLanguage = document.documentElement.lang;
    document.documentElement.lang = 'vi';
    return () => {
      document.title = originalTitle;
      document.documentElement.lang = originalLanguage;
    };
  }, []);

  useEffect(() => {
    document.title = `${label} · Quản trị · ${site.name}`;
    contentRef.current?.scrollTo({ top: 0 });
  }, [label, location.pathname]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const handleDesktop = (event) => {
      if (event.matches) {
        closeMobile();
      }
    };
    media.addEventListener('change', handleDesktop);
    return () => media.removeEventListener('change', handleDesktop);
  }, [closeMobile]);

  return (
    <div data-theme={theme} className={`[--admin-primary:#710008] [--admin-white:#ffffff] [--admin-black:#000000] flex h-dvh min-h-0 overflow-hidden bg-(--admin-background) [font-family:Inter,sans-serif] text-(--admin-ink) transition-colors duration-200 motion-reduce:transition-none ${theme === 'dark'
      ? '[--admin-accent:#f3dfa2] [--admin-background:#181815] [--admin-surface:#0b0b09] [--admin-ink:#e9e5da] [--admin-heading:var(--admin-accent)] [--admin-border:#39321f] [--admin-panel-shadow:none] [--admin-sidebar:var(--admin-black)] [--admin-sidebar-text:#b8aa85] [--admin-sidebar-border:var(--admin-border)] [--admin-nav-hover:rgb(255_255_255/0.06)] [--admin-nav-hover-text:var(--admin-white)] [--admin-selected:#302b1c] [--admin-selected-text:var(--admin-accent)] [--admin-hover:var(--admin-selected)] [--admin-hover-text:var(--admin-accent)] [--admin-badge:var(--admin-accent)] [--admin-badge-text:var(--admin-black)] [--admin-title:var(--admin-white)] [color-scheme:dark]'
      : '[--admin-accent:#d49520] [--admin-background:#f5f5f5] [--admin-surface:var(--admin-white)] [--admin-ink:var(--admin-black)] [--admin-heading:var(--admin-primary)] [--admin-border:rgb(0_0_0/0.12)] [--admin-panel-shadow:0_2px_8px_rgb(0_0_0/0.04)] [--admin-sidebar:var(--admin-primary)] [--admin-sidebar-text:var(--admin-white)] [--admin-sidebar-border:var(--admin-accent)] [--admin-nav-hover:rgb(212_149_32/0.12)] [--admin-nav-hover-text:var(--admin-white)] [--admin-selected:var(--admin-accent)] [--admin-selected-text:var(--admin-black)] [--admin-hover:var(--admin-primary)] [--admin-hover-text:var(--admin-white)] [--admin-badge:var(--admin-primary)] [--admin-badge-text:var(--admin-white)] [--admin-title:var(--admin-primary)] [color-scheme:light]'}`}>
      <a href="#admin-main" onClick={() => contentRef.current?.focus()}
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-md bg-(--admin-hover) px-4 py-3 text-sm font-semibold text-(--admin-hover-text) focus:translate-y-0 focus:outline-2 focus:outline-(--admin-accent)">
        Chuyển đến nội dung chính
      </a>
      <AdminSidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={closeMobile} user={user} unreadCount={unreadCount}
        onToggleCollapse={() => setCollapsed((value) => !value)} desktopToggleRef={desktopToggleRef} onLogout={logout} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminTopbar label={label} mobileOpen={mobileOpen} onOpenMobile={() => setMobileOpen(true)} theme={theme} onToggleTheme={toggleTheme} />
        <main id="admin-main" ref={contentRef} tabIndex={-1}
          className={`min-h-0 flex-1 overscroll-contain [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--admin-heading)_var(--admin-background)] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--admin-heading) ${mobileOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className="mx-auto w-full max-w-[1800px] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
