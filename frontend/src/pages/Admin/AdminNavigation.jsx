import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Search, Check, AlertTriangle, Sparkles, ShieldAlert } from 'lucide-react';
import { PageAPI } from '../../api/pageApi.js';
import { site } from '../../config/shared/site.js';
import {
  NavTable,
  NavEditModal,
  NavStatsCards,
} from '../../components/Admin/MenuNav';
import {
  AdminPageHeader,
  AdminToast,
  AdminButton,
  AdminBadge,
} from '../../components/Admin/Common/index.js';

export default function AdminNavigation() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveApi, setIsLiveApi] = useState(false);

  // State Modal chỉnh sửa
  const [editingPage, setEditingPage] = useState(null);

  // State Toast thông báo
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Tải danh sách các trang / menu item từ backend Page API
  const fetchPages = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await PageAPI.getPages();
      const data = response?.data || response || [];
      if (Array.isArray(data)) {
        setPages(data);
        setIsLiveApi(true);
        if (isManualRefresh) {
          showToast('Đã làm mới danh sách menu thành công!');
        }
      } else {
        setPages([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách pages:', error);
      showToast('Không thể kết nối API danh sách menu.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Helper tạo đường dẫn public từ slug
  const getPublicHref = (slug) => {
    if (!slug || slug === 'home') return '/';
    return `/${slug.replace(/^\/+/, '')}`;
  };

  // Lưu chỉnh sửa Tên menu và Trạng thái ẩn/hiện
  const handleSaveEdit = async (pageId, payload) => {
    try {
      const response = await PageAPI.updatePage(pageId, payload);
      const updatedData = response?.data || payload;

      setPages((prev) =>
        prev.map((item) => (item.id === pageId ? { ...item, ...updatedData } : item))
      );

      showToast(`Cập nhật trang "${payload.name}" thành công!`);
    } catch (error) {
      console.error('Lỗi khi cập nhật menu:', error);
      const message =
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật menu.';
      showToast(message, 'error');
      throw error;
    }
  };

  // Bật / Tắt Ẩn Hiện nhanh ngay trên bảng
  const handleToggleVisibility = async (page) => {
    const nextVisibility = !(page.is_visible !== false);
    try {
      await PageAPI.updatePage(page.id, {
        name: page.name,
        is_visible: nextVisibility,
      });
      setPages((prev) =>
        prev.map((item) =>
          item.id === page.id ? { ...item, is_visible: nextVisibility } : item
        )
      );
      showToast(
        nextVisibility
          ? `Đã hiển thị trang "${page.name}" lên Menu Header!`
          : `Đã ẩn trang "${page.name}" khỏi Menu Header!`
      );
    } catch (error) {
      console.error('Lỗi khi bật/tắt hiển thị menu:', error);
      showToast('Có lỗi xảy ra khi cập nhật trạng thái hiển thị.', 'error');
    }
  };

  // State Reorder đang xử lý & ID dòng vừa được di chuyển (phục vụ animation)
  const [isReordering, setIsReordering] = useState(false);
  const [movedId, setMovedId] = useState(null);

  // Đổi vị trí các page trên navigation
  const handleMove = async (index, direction) => {
    if (isReordering) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const previousPages = [...pages];
    const newPages = [...pages];
    const [movedItem] = newPages.splice(index, 1);
    newPages.splice(targetIndex, 0, movedItem);

    // Kích hoạt animation highlight cho dòng vừa đổi vị trí
    setMovedId(movedItem.id);
    setTimeout(() => {
      setMovedId((current) => (current === movedItem.id ? null : current));
    }, 1200);

    // Cập nhật lại order_index theo thứ tự mới
    const orders = newPages.map((item, idx) => ({
      id: item.id,
      order_index: idx + 1,
    }));

    // Cập nhật ngay UI cho mượt mà (Optimistic Update)
    setPages(newPages.map((item, idx) => ({ ...item, order_index: idx + 1 })));
    setIsReordering(true);

    try {
      await PageAPI.reorderPages(orders);
      showToast(`Đã chuyển menu "${movedItem.name}" sang vị trí #${targetIndex + 1}!`);
    } catch (error) {
      console.error('Lỗi khi cập nhật vị trí menu:', error);
      // Revert lại nếu có lỗi
      setPages(previousPages);
      setMovedId(null);
      showToast('Có lỗi xảy ra khi đổi vị trí menu.', 'error');
    } finally {
      setIsReordering(false);
    }
  };

  // Lọc theo từ khóa tìm kiếm
  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pages;
    return pages.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.slug && item.slug.toLowerCase().includes(query)) ||
        String(item.id).includes(query)
    );
  }, [pages, searchQuery]);

  return (
    <div className="space-y-6">
      <AdminToast toast={toast ? { message: toast.message, error: toast.type === 'error' } : null} onClose={() => setToast(null)} />

      {/* Header khu vực quản trị */}
      <AdminPageHeader
        badge="Hệ thống & Cấu hình"
        title="Menu & Điều hướng (Navigation)"
        subtitle="Quản lý hiển thị các mục menu trên thanh điều hướng chính theo model Page. Cho phép chỉnh sửa Tên trang và bật/tắt Ẩn/Hiện khỏi thanh Header. Đường dẫn slug và cấu trúc trang được giữ cố định."
        actions={
          <div className="flex items-center gap-2">
            {isLiveApi ? (
              <AdminBadge variant="success">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse mr-1 inline-block" />
                API Trực tiếp
              </AdminBadge>
            ) : (
              <AdminBadge variant="accent" icon={Sparkles}>
                Đang kết nối API
              </AdminBadge>
            )}

            <AdminButton
              variant="secondary"
              icon={RefreshCw}
              loading={refreshing}
              onClick={() => fetchPages(true)}
              title="Tải lại danh sách từ server"
            >
              Làm mới
            </AdminButton>
          </div>
        }
      />

      {/* Thẻ thống kê */}
      <NavStatsCards pages={pages} />

      {/* Thanh tìm kiếm & lọc */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-(--admin-border) bg-(--admin-surface) p-3 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên menu, slug hoặc ID..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent) transition"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Hiển thị <strong>{filteredPages.length}</strong> / {pages.length} mục</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-(--admin-heading) hover:underline cursor-pointer font-medium ml-1"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Bảng danh sách Menu Nav (chỉ cho phép Sửa và Bật/Tắt Ẩn/Hiện, không cho xóa) */}
      <div className="mt-4">
        <NavTable
          pages={filteredPages}
          loading={loading}
          searchQuery={searchQuery}
          onEdit={(page) => setEditingPage(page)}
          onToggleVisibility={handleToggleVisibility}
          onMove={handleMove}
          isReordering={isReordering}
          movedId={movedId}
          getPublicHref={getPublicHref}
        />
      </div>

      {/* Modal Sửa Tên Menu và Trạng thái Ẩn/Hiện (Slug cố định) */}
      <NavEditModal
        page={editingPage}
        onClose={() => setEditingPage(null)}
        onSave={handleSaveEdit}
        getPublicHref={getPublicHref}
      />

      {/* Footer ghi chú */}
      <p className="mt-12 border-t border-(--admin-border) pt-5 text-[11px] leading-5 text-(--admin-ink)/60">
        Khu vực quản trị điều hướng menu · Viện Kỷ lục Việt Nam (VIETKINGS) · {site.name}
      </p>
    </div>
  );
}
