import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { EventAPI } from '../../../api/eventApi.js';
import ImageUploadField from './ImageUploadField.jsx';

export default function EventTableManager() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal thêm / sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    image: '',
    status: 'UPCOMING',
    btn_action: 'Đăng ký ngay',
    form_url: '/contact',
    category_id: '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Modal xóa
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast thông báo
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEvents = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [eventsResult, categoriesResult] = await Promise.allSettled([
        EventAPI.getEvents(),
        EventAPI.getCategories(),
      ]);
      if (eventsResult.status === 'rejected') throw eventsResult.reason;

      const response = eventsResult.value;
      const items = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setEvents(items);
      if (categoriesResult.status === 'fulfilled') {
        const categoryResponse = categoriesResult.value;
        const nextCategories = Array.isArray(categoryResponse?.data)
          ? categoryResponse.data
          : Array.isArray(categoryResponse)
          ? categoryResponse
          : [];
        setCategories(nextCategories);
      }
      if (isManual) showToast('Đã làm mới danh sách Sự kiện!');
    } catch (error) {
      console.error('Lỗi khi tải sự kiện:', error);
      showToast('Không thể kết nối API Sự kiện.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSelectedImageFile(null);
    setFormData({
      name: '',
      description: '',
      location: 'TP. Hồ Chí Minh',
      image: '/images/events/default.jpg',
      status: 'UPCOMING',
      btn_action: 'Đăng ký ngay',
      form_url: '/contact',
      category_id: categories[0] ? String(categories[0].id) : '',
    });
    setIsAddingCategory(false);
    setNewCategoryName('');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingItem(event);
    setSelectedImageFile(null);
    setFormData({
      name: event.name || '',
      description: event.description || '',
      location: event.location || '',
      image: event.image || '',
      status: event.status?.value || event.status || 'UPCOMING',
      btn_action: event.btn_action || 'Đăng ký ngay',
      form_url: event.form_url || '/contact',
      category_id: event.category?.id ? String(event.category.id) : '',
    });
    setIsAddingCategory(false);
    setNewCategoryName('');
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Tên sự kiện là bắt buộc';
    if (!formData.description.trim()) errs.description = 'Mô tả sự kiện là bắt buộc';
    if (!formData.location.trim()) errs.location = 'Địa điểm là bắt buộc';
    if (!formData.category_id) errs.category_id = 'Vui lòng chọn chuyên mục';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setIsCreatingCategory(true);
    try {
      const response = await EventAPI.createCategory({ name, description: '' });
      const category = response?.data || response;
      setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData((current) => ({ ...current, category_id: String(category.id) }));
      setNewCategoryName('');
      setIsAddingCategory(false);
      showToast(`Đã thêm chuyên mục "${category.name}"!`);
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể thêm chuyên mục.';
      showToast(message, 'error');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      image: formData.image.trim() || '/images/events/default.jpg',
      status: formData.status,
      btn_action: formData.btn_action.trim() || 'Đăng ký ngay',
      form_url: formData.form_url.trim() || '/contact',
      category_id: Number(formData.category_id),
      speakers: [],
    };

    try {
      if (editingItem) {
        await EventAPI.updateEvent(editingItem.id, payload, selectedImageFile);
        showToast(`Cập nhật sự kiện "${payload.name}" thành công!`);
      } else {
        await EventAPI.createEvent(payload, selectedImageFile);
        showToast(`Thêm mới sự kiện "${payload.name}" thành công!`);
      }
      setIsModalOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error('Lỗi khi lưu sự kiện:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu sự kiện.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      await EventAPI.deleteEvent(deletingItem.id);
      showToast(`Đã xóa sự kiện "${deletingItem.name}"!`);
      setDeletingItem(null);
      await fetchEvents();
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi xóa sự kiện.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchSearch =
        !searchQuery ||
        (ev.name && ev.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ev.location && ev.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        String(ev.id).includes(searchQuery);

      const statusVal = ev.status?.value || ev.status || '';
      const matchStatus = statusFilter === 'ALL' || statusVal === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [events, searchQuery, statusFilter]);

  const getStatusBadge = (status) => {
    const s = typeof status === 'object' ? status?.value : status;
    switch (s) {
      case 'REGISTRATION_OPEN':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Mở đăng ký</span>;
      case 'UPCOMING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">Sắp diễn ra</span>;
      case 'ENDED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">Đã kết thúc</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Chờ duyệt</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-4 py-3 shadow-lg animate-bounce">
          {toast.type === 'error' ? (
            <AlertTriangle className="size-5 text-red-500 shrink-0" />
          ) : (
            <Check className="size-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-(--admin-title)">{toast.message}</span>
        </div>
      )}

      {/* Thanh công cụ tìm kiếm và Thêm */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-(--admin-border) bg-(--admin-surface) p-3 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sự kiện theo tên, địa điểm, ID..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="UPCOMING">Sắp diễn ra</option>
            <option value="REGISTRATION_OPEN">Mở đăng ký</option>
            <option value="ENDED">Đã kết thúc</option>
            <option value="PENDING">Chờ duyệt</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchEvents(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-(--admin-heading) hover:bg-(--admin-background) transition cursor-pointer"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Làm mới
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-(--admin-accent) text-(--admin-black) hover:opacity-90 transition cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            Thêm Sự Kiện
          </button>
        </div>
      </div>

      {/* Bảng Sự Kiện */}
      <div className="border border-(--admin-border) bg-(--admin-surface) rounded-xl shadow-[var(--admin-panel-shadow)] overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-(--admin-heading)" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <CalendarDays className="mx-auto size-12 text-gray-300" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-semibold">Chưa có sự kiện nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-(--admin-border) bg-(--admin-background)/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-14">ID</th>
                  <th className="py-3 px-4">Tên Sự Kiện</th>
                  <th className="py-3 px-4">Phân loại</th>
                  <th className="py-3 px-4">Địa điểm</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--admin-border)">
                {filteredEvents.map((item) => (
                  <tr key={item.id} className="hover:bg-(--admin-background)/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500 font-semibold">#{item.id}</td>
                    <td className="py-3 px-4 font-semibold text-(--admin-title)">
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500 font-normal line-clamp-1">{item.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-(--admin-background) border border-(--admin-border)">
                        {item.category?.name || 'Chung'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        <span className="truncate max-w-[180px]">{item.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md border border-(--admin-border) bg-(--admin-surface) text-(--admin-heading) hover:bg-(--admin-background) transition cursor-pointer"
                        >
                          <Pencil size={13} className="inline mr-1" />
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition cursor-pointer"
                        >
                          <Trash2 size={13} className="inline mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa Sự Kiện */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-(--admin-border) px-6 py-4">
              <h3 className="text-base font-bold text-(--admin-title)">
                {editingItem ? 'Chỉnh sửa Sự Kiện' : 'Thêm Mới Sự Kiện'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Tên Sự Kiện *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  placeholder="Ví dụ: Diễn đàn Kinh tế Kỷ lục 2026"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Mô tả sự kiện *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  placeholder="Mô tả chi tiết nội dung sự kiện..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Địa điểm *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                    placeholder="TP. Hồ Chí Minh"
                  />
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  >
                    <option value="UPCOMING">Sắp diễn ra</option>
                    <option value="REGISTRATION_OPEN">Mở đăng ký</option>
                    <option value="ENDED">Đã kết thúc</option>
                    <option value="PENDING">Chờ duyệt</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-(--admin-heading) uppercase">Chuyên mục *</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory((value) => !value)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-(--admin-accent) hover:opacity-80"
                  >
                    <Plus size={13} /> Thêm chuyên mục
                  </button>
                </div>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                >
                  <option value="">Chọn chuyên mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
                {isAddingCategory && (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="min-w-0 flex-1 px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink)"
                      placeholder="Tên chuyên mục mới"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={isCreatingCategory || !newCategoryName.trim()}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg bg-(--admin-accent) text-(--admin-black) disabled:opacity-50"
                    >
                      {isCreatingCategory ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                      Lưu
                    </button>
                  </div>
                )}
              </div>

              <ImageUploadField
                label="Hình ảnh Sự kiện"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                selectedFile={selectedImageFile}
                onFileChange={setSelectedImageFile}
                placeholder="VD: https://... hoặc chọn ảnh từ máy tính"
              />

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-(--admin-border)">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-gray-600 hover:bg-(--admin-background)"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-(--admin-accent) text-(--admin-black) hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Check size={14} />}
                  {editingItem ? 'Lưu thay đổi' : 'Tạo Sự Kiện'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xóa Sự Kiện */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <span className="p-2.5 rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </span>
              <div>
                <h3 className="text-base font-bold text-(--admin-title)">Xóa Sự Kiện</h3>
                <p className="text-xs text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-(--admin-ink)">
              Bạn có chắc muốn xóa sự kiện <strong>"{deletingItem.name}"</strong>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-gray-600 hover:bg-(--admin-background)"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
