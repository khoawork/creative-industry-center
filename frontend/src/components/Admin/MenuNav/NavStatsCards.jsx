import React from 'react';
import { Layers, Globe, Link as LinkIcon } from 'lucide-react';

export default function NavStatsCards({ pages = [] }) {
  const homePage = pages.find((p) => p.slug === 'home' || p.slug === '' || p.id === 9);
  const customPagesCount = pages.filter((p) => p.slug !== 'home' && p.slug !== '' && p.id !== 9).length;

  return (
    <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Tổng số Menu */}
      <div className="border border-(--admin-border) bg-(--admin-surface) p-4 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tổng số Menu
          </span>
          <span className="p-2 rounded-lg bg-(--admin-accent)/10 text-(--admin-heading)">
            <Layers size={18} />
          </span>
        </div>
        <div className="mt-2 text-2xl font-bold text-(--admin-title)">{pages.length}</div>
        <p className="mt-1 text-xs text-gray-500">Các mục trang trong model Page</p>
      </div>

      {/* Trang Chủ */}
      <div className="border border-(--admin-border) bg-(--admin-surface) p-4 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trang Chủ (Home)
          </span>
          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
            <Globe size={18} />
          </span>
        </div>
        <div className="mt-2 text-2xl font-bold text-(--admin-title)">
          {homePage?.name || 'Trang chủ'}
        </div>
        <p className="mt-1 text-xs text-gray-500">Đường dẫn gốc: / (slug: home)</p>
      </div>

      {/* Trang Phụ & Chuyên mục */}
      <div className="border border-(--admin-border) bg-(--admin-surface) p-4 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trang Phụ &amp; Chuyên mục
          </span>
          <span className="p-2 rounded-lg bg-sky-500/10 text-sky-600">
            <LinkIcon size={18} />
          </span>
        </div>
        <div className="mt-2 text-2xl font-bold text-(--admin-title)">
          {customPagesCount}
        </div>
        <p className="mt-1 text-xs text-gray-500">Các trang có slug tùy chỉnh</p>
      </div>
    </section>
  );
}
