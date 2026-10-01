import { useEffect, useId, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronsLeft, X } from 'lucide-react';
import logo from '../../assets/shared/logo/creative-industry-center-logo.png';
import { site } from '../../config/shared/site.js';
import { adminGroups, adminRoot } from '../../config/Admin/adminNavigation.js';

function SidebarContent({ collapsed = false, user, unreadCount, onNavigate, onClose, onToggleCollapse, desktopToggleRef }) {
  const labelId = useId();
  const { pathname } = useLocation();

  return (
    <div className="flex h-full min-h-0 flex-col bg-(--admin-sidebar) text-(--admin-sidebar-text) transition-colors duration-200 motion-reduce:transition-none">
      <div className={`flex shrink-0 items-center gap-2 border-b border-(--admin-sidebar-border) ${collapsed ? 'flex-col px-3 py-4' : 'px-4 py-5'}`}>
        <Link to={adminRoot} onClick={onNavigate} aria-label={`${site.name} — Bảng điều khiển`}
          className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent)">
          <img src={logo} alt="" width="44" height="44" className="size-11 shrink-0 rounded-full bg-(--admin-white) object-contain p-1" />
          {!collapsed && (
            <span className="min-w-0">
              <span className="block text-[13px] leading-5 font-semibold text-(--admin-white)">{site.name}</span>
              <span className="mt-1 block text-[10px] font-medium tracking-[0.14em] uppercase">Khu vực quản trị</span>
            </span>
          )}
        </Link>
        {onToggleCollapse && (
          <button ref={desktopToggleRef} type="button" onClick={onToggleCollapse}
            aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'} aria-expanded={!collapsed} aria-controls="admin-desktop-sidebar"
            className="group flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--admin-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent)">
            <span className="flex size-8 items-center justify-center rounded-full border border-(--admin-accent) transition-colors duration-150 group-hover:bg-(--admin-accent) group-hover:text-(--admin-black) motion-reduce:transition-none">
              <ChevronsLeft size={18} strokeWidth={1.8} aria-hidden="true"
                className={`transition-transform duration-200 motion-reduce:transition-none ${collapsed ? 'rotate-180' : 'rotate-0'}`} />
            </span>
          </button>
        )}
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Đóng menu quản trị"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-(--admin-white) hover:text-(--admin-black) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent)">
            <X size={20} aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label="Điều hướng quản trị" className={`min-h-0 flex-1 overflow-y-auto overscroll-contain py-5
        [scrollbar-width:thin] [scrollbar-color:var(--admin-accent)_var(--admin-sidebar)]
        [@supports(selector(::-webkit-scrollbar))]:[scrollbar-width:auto] [@supports(selector(::-webkit-scrollbar))]:[scrollbar-color:auto]
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-(--admin-sidebar)
        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--admin-accent)
        [&::-webkit-scrollbar-thumb:hover]:bg-(--admin-white) [&::-webkit-scrollbar-thumb:active]:bg-(--admin-white)
        [&::-webkit-scrollbar-button]:hidden ${collapsed ? 'px-3' : 'px-4'}`}>
        {adminGroups.map((group, groupIndex) => (
          <section key={group.id} aria-labelledby={`${labelId}-${group.id}`} className={groupIndex > 0 ? 'mt-6' : ''}>
            <h2 id={`${labelId}-${group.id}`} className={collapsed ? 'sr-only' : 'mb-2 px-3 text-[10px] leading-5 font-semibold tracking-[0.18em] uppercase'}>
              {group.label}
            </h2>
            {collapsed && groupIndex > 0 && <div className="mx-3 mb-3 h-px bg-(--admin-accent)" />}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const ItemIcon = item.icon;
                const count = item.id === 'contact' ? unreadCount : 0;
                return (
                  <li key={item.id}>
                    <NavLink to={item.path} end={item.path === adminRoot && pathname !== `${adminRoot}/`} onClick={onNavigate}
                      aria-label={count > 0 ? `${item.label}, ${count} chưa đọc` : item.label}
                      className={({ isActive }) => `group relative flex min-h-11 items-center gap-3 rounded-none border border-transparent text-[13px] leading-5 transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent) ${collapsed ? 'justify-center px-0' : 'px-3 py-2.5'} ${isActive ? "bg-(--admin-selected) font-semibold text-(--admin-selected-text) before:pointer-events-none before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-none before:bg-(--admin-white) before:content-['']" : 'font-normal hover:bg-(--admin-nav-hover) hover:text-(--admin-nav-hover-text)'}`}>
                      <ItemIcon size={19} strokeWidth={1.7} className="shrink-0" aria-hidden="true" />
                      {collapsed ? (
                        <span aria-hidden="true" className="pointer-events-none fixed left-20 z-50 ml-2 hidden max-w-64 rounded-md border border-(--admin-sidebar-border) bg-(--admin-sidebar) px-3 py-2 text-sm font-medium text-(--admin-sidebar-text) group-hover:block group-focus:block">
                          {item.label}{count > 0 ? ` · ${count} chưa đọc` : ''}
                        </span>
                      ) : <span className="min-w-0 flex-1">{item.label}</span>}
                      {count > 0 && !collapsed && <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--admin-accent) text-[10px] font-bold text-(--admin-black) group-aria-[current=page]:bg-(--admin-badge) group-aria-[current=page]:text-(--admin-badge-text)">{count}</span>}
                      {count > 0 && collapsed && <span aria-hidden="true" className="absolute top-1 right-1 size-1.5 rounded-full bg-(--admin-accent) group-aria-[current=page]:bg-(--admin-badge)" />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      <div className={`shrink-0 border-t border-(--admin-sidebar-border) ${collapsed ? 'p-4' : 'px-5 py-4'}`}>
        <div className="flex items-center gap-3" title={`${user.name} · ${user.role} · Tài khoản minh họa`}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--admin-accent) text-xs font-bold text-(--admin-black)">{user.initials}</span>
          <div className={collapsed ? 'sr-only' : 'min-w-0 flex-1'}>
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="mt-0.5 text-[11px]">{user.role} · Minh họa</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ collapsed, mobileOpen, onClose, user, unreadCount, onToggleCollapse, desktopToggleRef }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (mobileOpen && !dialog.open) dialog.showModal();
    if (!mobileOpen && dialog.open) dialog.close();
  }, [mobileOpen]);

  return (
    <>
      <aside id="admin-desktop-sidebar" aria-label="Menu quản trị" className={`hidden h-full shrink-0 lg:block ${collapsed ? 'w-20' : 'w-[280px]'}`}>
        <SidebarContent collapsed={collapsed} user={user} unreadCount={unreadCount} onToggleCollapse={onToggleCollapse} desktopToggleRef={desktopToggleRef} />
      </aside>
      <dialog ref={dialogRef} id="admin-mobile-sidebar" aria-label="Menu quản trị"
        onClose={() => {
          onClose();
          if (window.matchMedia('(min-width: 1024px)').matches) desktopToggleRef.current?.focus();
        }}
        onCancel={(event) => { event.preventDefault(); onClose(); }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const controls = event.currentTarget.querySelectorAll('a[href], button:not([disabled])');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget && event.clientX >= event.currentTarget.getBoundingClientRect().right) onClose();
        }}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(280px,calc(100vw-48px))] max-w-none overflow-hidden border-0 bg-(--admin-sidebar) p-0 [font-family:Inter,sans-serif] text-(--admin-sidebar-text) backdrop:bg-(--admin-black)/50">
        <SidebarContent user={user} unreadCount={unreadCount} onNavigate={onClose} onClose={onClose} />
      </dialog>
    </>
  );
}
