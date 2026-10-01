import React from 'react';
import { Menu, Pencil, Trash2, ExternalLink, RefreshCw, Check } from 'lucide-react';

export default function NavTable({
  pages = [],
  loading = false,
  searchQuery = '',
  onEdit,
  onDelete,
  getPublicHref,
}) {
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center border border-(--admin-border) bg-(--admin-surface) rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-(--admin-heading)" />
          <p className="text-sm font-semibold text-gray-500">Đang tải danh sách menu từ database...</p>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="py-16 text-center border border-(--admin-border) bg-(--admin-surface) rounded-xl shadow-[var(--admin-panel-shadow)]">
        <Menu className="mx-auto size-12 text-gray-300" strokeWidth={1.5} />
        <h3 className="mt-3 text-base font-semibold text-(--admin-title)">
          {searchQuery ? 'Không tìm thấy mục menu phù hợp' : 'Chưa có mục menu nào'}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {searchQuery
            ? 'Hãy thử thay đổi từ khóa tìm kiếm.'
            : 'Nhấn nút "Thêm Menu Mới" để bắt đầu tạo trang.'}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-(--admin-border) bg-(--admin-surface) rounded-xl shadow-[var(--admin-panel-shadow)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-(--admin-border) bg-(--admin-background)/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16">ID</th>
              <th className="py-3.5 px-4">Tên Menu (Name)</th>
              <th className="py-3.5 px-4">Slug (Đường dẫn)</th>
              <th className="py-3.5 px-4">URL Công khai</th>
              <th className="py-3.5 px-4">Cấu hình Props</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--admin-border)">
            {pages.map((page) => {
              const publicHref = getPublicHref ? getPublicHref(page.slug) : `/${page.slug}`;
              const isHomePage = page.slug === 'home' || page.id === 9;
              const hasProps = page.props && Object.keys(page.props).length > 0;

              return (
                <tr
                  key={page.id}
                  className="hover:bg-(--admin-background)/40 transition-colors group"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500 font-semibold">
                    #{page.id}
                  </td>

                  {/* Tên Menu */}
                  <td className="py-3.5 px-4 font-semibold text-(--admin-title)">
                    <div className="flex items-center gap-2">
                      <span>{page.name}</span>
                      {isHomePage && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Trang chính
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-3.5 px-4">
                    <code className="text-xs font-mono font-semibold px-2 py-1 rounded bg-(--admin-background) border border-(--admin-border) text-(--admin-heading)">
                      {page.slug}
                    </code>
                  </td>

                  {/* Public URL */}
                  <td className="py-3.5 px-4">
                    <a
                      href={publicHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-(--admin-heading) hover:underline font-mono"
                    >
                      {publicHref}
                      <ExternalLink size={12} />
                    </a>
                  </td>

                  {/* Props */}
                  <td className="py-3.5 px-4">
                    {hasProps ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <Check size={11} /> {Object.keys(page.props).length} khối props
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Trang trống</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {/* Nút Sửa */}
                      <button
                        type="button"
                        onClick={() => onEdit(page)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border border-(--admin-border) bg-(--admin-surface) text-(--admin-heading) hover:bg-(--admin-background) hover:border-(--admin-accent) transition cursor-pointer"
                        title="Sửa tên menu và slug"
                      >
                        <Pencil size={13} />
                        Sửa
                      </button>

                      {/* Nút Xóa */}
                      <button
                        type="button"
                        onClick={() => onDelete(page)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition cursor-pointer"
                        title="Xóa menu này"
                      >
                        <Trash2 size={13} />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
