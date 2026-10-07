import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';

export default function NavStatsCards({ pages = [] }) {
  const visiblePagesCount = pages.filter((p) => p.is_visible !== false).length;
  const hiddenPagesCount = pages.filter((p) => p.is_visible === false).length;

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
        <p className="mt-1 text-xs text-gray-500">Các mục trang định danh trong hệ thống</p>
      </div>

      {/* Đang hiển thị trên Header */}
      <div className="border border-(--admin-border) bg-(--admin-surface) p-4 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Đang Hiển Thị
          </span>
          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
            <Eye size={18} />
          </span>
        </div>
        <div className="mt-2 text-2xl font-bold text-emerald-600">
          {visiblePagesCount}
        </div>
        <p className="mt-1 text-xs text-gray-500">Mục đang hiển thị trên thanh điều hướng</p>
      </div>

      {/* Đang ẩn khỏi Header */}
      <div className="border border-(--admin-border) bg-(--admin-surface) p-4 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Đang Ẩn
          </span>
          <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <EyeOff size={18} />
          </span>
        </div>
        <div className="mt-2 text-2xl font-bold text-amber-600">
          {hiddenPagesCount}
        </div>
        <p className="mt-1 text-xs text-gray-500">Mục bị ẩn, tạm thời không xuất hiện trên Header</p>
      </div>
    </section>
  );
}
