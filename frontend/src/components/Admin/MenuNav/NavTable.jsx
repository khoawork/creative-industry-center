import React, { useRef, useState } from 'react';
import { Menu, Pencil, ExternalLink, RefreshCw, Check, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

export default function NavTable({
  pages = [],
  loading = false,
  searchQuery = '',
  onEdit,
  onToggleVisibility,
  onMove,
  isReordering = false,
  movedId = null,
  getPublicHref,
}) {
  const rowRefs = useRef({});
  const [swappingPair, setSwappingPair] = useState({});
  const [isSwapping, setIsSwapping] = useState(false);

  // Kích hoạt hiệu ứng trượt hoán đổi giữa 2 dòng
  const handleTriggerMove = (index, direction) => {
    if (isReordering || isSwapping) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const currentItem = pages[index];
    const targetItem = pages[targetIndex];
    if (!currentItem || !targetItem) return;

    const currentNode = rowRefs.current[currentItem.id];
    const targetNode = rowRefs.current[targetItem.id];

    if (currentNode && targetNode) {
      const rectCurrent = currentNode.getBoundingClientRect();
      const rectTarget = targetNode.getBoundingClientRect();
      const deltaCurrent = rectTarget.top - rectCurrent.top;
      const deltaTarget = rectCurrent.top - rectTarget.top;

      setIsSwapping(true);
      setSwappingPair({
        [currentItem.id]: deltaCurrent,
        [targetItem.id]: deltaTarget,
      });

      // Sau khi trượt xong (300ms), thực hiện hoán đổi vị trí thực sự trong state và database
      setTimeout(() => {
        setSwappingPair({});
        setIsSwapping(false);
        if (onMove) {
          onMove(index, direction);
        }
      }, 300);
    } else {
      // Fallback nếu không đo được DOM
      if (onMove) onMove(index, direction);
    }
  };
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
          {searchQuery ? 'Hãy thử thay đổi từ khóa tìm kiếm.' : 'Hệ thống chưa có trang nào.'}
        </p>
      </div>
    );
  }

  const isSearchActive = Boolean(searchQuery && searchQuery.trim());

  return (
    <div className="border border-(--admin-border) bg-(--admin-surface) rounded-xl shadow-[var(--admin-panel-shadow)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-(--admin-border) bg-(--admin-background)/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-20 text-center">Thứ tự</th>
              <th className="py-3.5 px-4">Tên Menu (Name)</th>
              <th className="py-3.5 px-4">Slug (Cố định)</th>
              <th className="py-3.5 px-4">URL Công khai</th>
              <th className="py-3.5 px-4 text-center">Trạng Thái Menu</th>
              <th className="py-3.5 px-4 text-right w-48">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--admin-border)">
            {pages.map((page, index) => {
              const publicHref = getPublicHref ? getPublicHref(page.slug) : `/${page.slug}`;
              const isHomePage = page.slug === 'home' || page.id === 1;
              const isVisible = page.is_visible !== false;
              const isFirst = index === 0;
              const isLast = index === pages.length - 1;
              const isJustMoved = movedId === page.id;

              // Tính toán offset trượt chuyển động
              const swapOffset = swappingPair[page.id];
              const isCurrentlySwapping = typeof swapOffset === 'number';

              const swapStyle = isCurrentlySwapping
                ? {
                    transform: `translate3d(0, ${swapOffset}px, 0)`,
                    transition: 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)',
                    zIndex: 30,
                    position: 'relative',
                    boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12)',
                  }
                : undefined;

              return (
                <tr
                  key={page.id}
                  ref={(el) => {
                    if (el) rowRefs.current[page.id] = el;
                  }}
                  style={swapStyle}
                  className={`transition-colors duration-300 group ${
                    isCurrentlySwapping
                      ? 'bg-(--admin-surface) ring-2 ring-(--admin-accent)'
                      : isJustMoved
                      ? 'bg-amber-50/90 ring-2 ring-(--admin-accent)/70 shadow-sm'
                      : isVisible
                      ? 'hover:bg-(--admin-background)/40'
                      : 'bg-gray-50/70 opacity-75'
                  }`}
                >
                  {/* Cột Thứ tự (Badge tròn số to rõ) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span
                        className={`font-mono text-xs font-bold transition-all duration-300 size-8 rounded-full flex items-center justify-center border select-none ${
                          isCurrentlySwapping || isJustMoved
                            ? 'bg-(--admin-accent) text-white border-(--admin-accent) scale-110 shadow-md ring-2 ring-(--admin-accent)/30'
                            : 'bg-(--admin-background) text-gray-700 border-(--admin-border)'
                        }`}
                        title={`Thứ tự hiển thị #${index + 1}`}
                      >
                        #{index + 1}
                      </span>
                    </div>
                  </td>

                  {/* Tên Menu */}
                  <td className="py-3.5 px-4 font-semibold text-(--admin-title)">
                    <div className="flex items-center gap-2">
                      <span className={isVisible ? '' : 'text-gray-400 line-through'}>
                        {page.name}
                      </span>
                      {isHomePage && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Trang chủ
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Slug (Cố định) */}
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

                  {/* Cột Ẩn / Hiện Menu (Toggle nhanh) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleVisibility && onToggleVisibility(page)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition cursor-pointer select-none ${
                          isVisible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                        title={isVisible ? 'Bấm để ẩn trang khỏi Menu' : 'Bấm để hiển thị trang lên Menu'}
                      >
                        {isVisible ? (
                          <>
                            <Eye size={13} className="text-emerald-600" />
                            <span>Hiển thị</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={13} className="text-gray-400" />
                            <span>Đã ẩn</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Actions (Nút di chuyển vị trí + Nút Sửa) */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {/* Nhóm nút di chuyển vị trí (Mũi tên to rõ) */}
                      <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-(--admin-background) border border-(--admin-border)">
                        <button
                          type="button"
                          disabled={isFirst || isSearchActive || isReordering || isSwapping}
                          onClick={() => handleTriggerMove(index, 'up')}
                          className="size-8 rounded-md flex items-center justify-center text-gray-700 hover:text-(--admin-heading) hover:bg-(--admin-surface) border border-transparent hover:border-(--admin-border) hover:shadow-xs transition-all active:scale-90 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:cursor-not-allowed cursor-pointer"
                          title={
                            isSearchActive
                              ? 'Vui lòng xóa từ khóa tìm kiếm để đổi vị trí'
                              : isFirst
                              ? 'Đang ở vị trí đầu tiên'
                              : `Di chuyển trang "${page.name}" lên trên`
                          }
                        >
                          <ArrowUp size={15} strokeWidth={2.3} />
                        </button>

                        <button
                          type="button"
                          disabled={isLast || isSearchActive || isReordering || isSwapping}
                          onClick={() => handleTriggerMove(index, 'down')}
                          className="size-8 rounded-md flex items-center justify-center text-gray-700 hover:text-(--admin-heading) hover:bg-(--admin-surface) border border-transparent hover:border-(--admin-border) hover:shadow-xs transition-all active:scale-90 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:cursor-not-allowed cursor-pointer"
                          title={
                            isSearchActive
                              ? 'Vui lòng xóa từ khóa tìm kiếm để đổi vị trí'
                              : isLast
                              ? 'Đang ở vị trí cuối cùng'
                              : `Di chuyển trang "${page.name}" xuống dưới`
                          }
                        >
                          <ArrowDown size={15} strokeWidth={2.3} />
                        </button>
                      </div>

                      {/* Nút Sửa */}
                      <button
                        type="button"
                        onClick={() => onEdit(page)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-(--admin-heading) hover:bg-(--admin-background) hover:border-(--admin-accent) shadow-xs transition cursor-pointer"
                        title="Đổi tên hiển thị và bật/tắt ẩn hiện"
                      >
                        <Pencil size={13} />
                        <span>Sửa</span>
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
