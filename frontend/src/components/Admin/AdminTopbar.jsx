import { ChevronRight, ExternalLink, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminRoot } from '../../config/Admin/adminPaths.js';
import { siteLinks } from '../../config/shared/site.js';
import AdminThemeToggle from './AdminThemeToggle.jsx';

export default function AdminTopbar({ label, mobileOpen, onOpenMobile, theme, onToggleTheme }) {
  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-(--admin-border) bg-(--admin-surface) px-4 transition-colors duration-200 motion-reduce:transition-none sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onOpenMobile} aria-label="Mở menu quản trị" aria-expanded={mobileOpen} aria-controls="admin-mobile-sidebar"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-(--admin-heading) hover:bg-(--admin-background) lg:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)">
          <Menu size={21} aria-hidden="true" />
        </button>
        <nav aria-label="Đường dẫn trang" className="min-w-0">
          <ol className="flex min-w-0 items-center gap-2 text-xs sm:text-sm">
            <li className="hidden shrink-0 items-center gap-2 sm:flex">
              <Link to={adminRoot} className="rounded-sm text-(--admin-heading) hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)">Quản trị</Link>
              <ChevronRight size={14} aria-hidden="true" />
            </li>
            <li aria-current="page" className="truncate font-medium" title={label}>{label}</li>
          </ol>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <AdminThemeToggle theme={theme} onToggle={onToggleTheme} />
        <span aria-hidden="true" className="h-5 w-px bg-(--admin-border)" />
        <a href={siteLinks.home.href} target="_blank" rel="noopener noreferrer" aria-label="Xem website (mở tab mới)"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)">
          <ExternalLink size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Xem website</span>
        </a>
      </div>
    </header>
  );
}
