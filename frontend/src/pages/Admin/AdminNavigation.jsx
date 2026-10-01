import React, { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, Search, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { PageAPI } from '../../api/pageApi.js';
import { site } from '../../config/shared/site.js';
import {
  NavTable,
  NavEditModal,
  NavAddModal,
  NavDeleteModal,
} from '../../components/Admin/MenuNav';

export default function AdminNavigation() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveApi, setIsLiveApi] = useState(false);

  // State các Modal thao tác
  const [editingPage, setEditingPage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingPage, setDeletingPage] = useState(null);

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

  // Helper tự động tạo slug từ tên trang
  const slugify = (text) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Helper tạo đường dẫn public từ slug
  const getPublicHref = (slug) => {
    if (!slug || slug === 'home') return '/';
    return `/${slug.replace(/^\/+/, '')}`;
  };

  // Lưu chỉnh sửa Tên menu và Slug
  const handleSaveEdit = async (pageId, payload) => {
    try {
      const response = await PageAPI.updatePage(pageId, payload);
      const updatedData = response?.data || payload;

      setPages((prev) =>
        prev.map((item) => (item.id === pageId ? { ...item, ...updatedData } : item))
      );

      showToast(`Cập nhật menu "${payload.name}" thành công!`);
    } catch (error) {
      console.error('Lỗi khi cập nhật menu:', error);
      const message =
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật menu.';
      showToast(message, 'error');
      throw error;
    }
  };

  // Thêm mục Menu / Page mới
  const handleSaveAdd = async (payload) => {
    try {
      const response = await PageAPI.createPage(payload);
      const newPage = response?.data || response;

      if (newPage?.id) {
        setPages((prev) => [...prev, newPage]);
      } else {
        await fetchPages();
      }

      showToast(`Đã thêm menu "${payload.name}" thành công!`);
    } catch (error) {
      console.error('Lỗi khi tạo menu mới:', error);
      const message =
        error.response?.data?.message || 'Có lỗi xảy ra khi tạo menu mới.';
      showToast(message, 'error');
      throw error;
    }
  };

  // Xóa mục Menu / Page
  const handleConfirmDelete = async (pageId) => {
    try {
      await PageAPI.deletePage(pageId);
      setPages((prev) => prev.filter((item) => item.id !== pageId));
      showToast(`Đã xóa mục menu thành công!`);
    } catch (error) {
      console.error('Lỗi khi xóa menu:', error);
      const message =
        error.response?.data?.message || 'Có lỗi xảy ra khi xóa menu.';
      showToast(message, 'error');
      throw error;
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
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-4 py-3 shadow-lg transition-all animate-bounce">
          {toast.type === 'error' ? (
            <AlertTriangle className="size-5 text-red-500 shrink-0" />
          ) : (
            <Check className="size-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-(--admin-title)">{toast.message}</span>
        </div>
      )}

      {/* Header trang quản trị */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--admin-border) pb-7">
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-(--admin-heading) uppercase">
            Hệ thống &amp; Cấu hình
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-(--admin-title) sm:text-3xl">
            Menu &amp; Điều hướng (Navigation)
          </h1>
          <p className="mt-3 text-sm leading-6">
            Quản lý các mục menu trên thanh điều hướng chính theo model <code className="px-1.5 py-0.5 rounded bg-(--admin-accent)/15 text-(--admin-heading) font-mono text-xs">Page</code>. Cho phép chỉnh sửa tên menu, đường dẫn (slug) và xóa các trang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLiveApi ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              API Trực tiếp
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--admin-accent) px-3 py-1.5 text-[11px] text-(--admin-heading)">
              <Sparkles size={13} aria-hidden="true" />
              Đang kết nối API
            </span>
          )}

          <button
            type="button"
            onClick={() => fetchPages(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-full border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-[11px] font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition cursor-pointer disabled:opacity-50"
            title="Tải lại danh sách từ server"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Làm mới
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-(--admin-accent) px-4 py-1.5 text-[11px] font-bold text-(--admin-black) hover:opacity-90 transition cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            Thêm Menu Mới
          </button>
        </div>
      </div>

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

      {/* Bảng danh sách Menu Nav */}
      <div className="mt-4">
        <NavTable
          pages={filteredPages}
          loading={loading}
          searchQuery={searchQuery}
          onEdit={(page) => setEditingPage(page)}
          onDelete={(page) => setDeletingPage(page)}
          getPublicHref={getPublicHref}
        />
      </div>

      {/* Modal Sửa Menu và Slug */}
      <NavEditModal
        page={editingPage}
        onClose={() => setEditingPage(null)}
        onSave={handleSaveEdit}
        getPublicHref={getPublicHref}
      />

      {/* Modal Thêm Menu Mới */}
      <NavAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
        slugify={slugify}
        getPublicHref={getPublicHref}
      />

      {/* Modal Xác nhận Xóa */}
      <NavDeleteModal
        page={deletingPage}
        onClose={() => setDeletingPage(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Footer ghi chú */}
      <p className="mt-12 border-t border-(--admin-border) pt-5 text-[11px] leading-5 text-gray-500">
        Khu vực quản trị điều hướng menu · Viện Kỷ lục Việt Nam (VIETKINGS) · {site.name}
      </p>
    </>
  );
}
