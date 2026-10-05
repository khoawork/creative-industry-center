import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { AwardAPI } from '../../../api/awardApi.js';
import ImageUploadField from './ImageUploadField.jsx';

export default function AwardTableManager() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal thêm / sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    title: '',
    description: '',
    decision_number: '',
    year: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // Modal xóa
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAwards = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await AwardAPI.getAwards({ per_page: 100 });
      const items = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.items)
        ? response.data.items
        : Array.isArray(response)
        ? response
        : [];
      setAwards(items);
      if (isManual) showToast('Đã làm mới danh sách Giải thưởng!');
    } catch (error) {
      console.error('Lỗi khi tải giải thưởng:', error);
      showToast('Không thể kết nối API Giải thưởng.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSelectedImageFile(null);
    setFormData({
      code: '',
      name: '',
      title: '',
      description: '',
      decision_number: '',
      year: '',
      image: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setSelectedImageFile(null);
    setFormData({
      code: item.code || '',
      name: item.name || '',
      title: item.title || '',
      description: item.description || '',
      decision_number: item.decision_number || '',
      year: item.year || '',
      image: item.image || '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.code.trim()) errs.code = 'Mã giải thưởng là bắt buộc';
    if (!formData.name.trim()) errs.name = 'Tên giải thưởng là bắt buộc';
    if (!formData.title.trim()) errs.title = 'Hạng mục/Danh hiệu là bắt buộc';
    if (!formData.description.trim()) errs.description = 'Mô tả là bắt buộc';
    if (!formData.decision_number.trim()) errs.decision_number = 'Số quyết định là bắt buộc';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    const payload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      decision_number: formData.decision_number.trim(),
      year: formData.year ? Number(formData.year) : null,
      image: formData.image.trim() || null,
      props: { icon: 'award' },
    };

    try {
      if (editingItem) {
        await AwardAPI.updateAward(editingItem.id, payload, selectedImageFile);
        showToast(`Cập nhật giải thưởng "${payload.name}" thành công!`);
      } else {
        await AwardAPI.createAward(payload, selectedImageFile);
        showToast(`Thêm giải thưởng "${payload.name}" thành công!`);
      }
      setIsModalOpen(false);
      await fetchAwards();
    } catch (error) {
      console.error('Lỗi khi lưu giải thưởng:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu giải thưởng.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      await AwardAPI.deleteAward(deletingItem.id);
      showToast(`Đã xóa giải thưởng "${deletingItem.name}"!`);
      setDeletingItem(null);
      await fetchAwards();
    } catch (error) {
      console.error('Lỗi khi xóa giải thưởng:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi xóa giải thưởng.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAwards = useMemo(() => {
    return awards.filter((aw) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (aw.name && aw.name.toLowerCase().includes(q)) ||
        (aw.code && aw.code.toLowerCase().includes(q)) ||
        (aw.title && aw.title.toLowerCase().includes(q)) ||
        (aw.decision_number && aw.decision_number.toLowerCase().includes(q))
      );
    });
  }, [awards, searchQuery]);

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

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-(--admin-border) bg-(--admin-surface) p-3 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm giải thưởng theo tên, danh hiệu, số quyết định..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchAwards(true)}
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
            Thêm Giải Thưởng
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-(--admin-border) bg-(--admin-surface) rounded-xl shadow-[var(--admin-panel-shadow)] overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-(--admin-heading)" />
          </div>
        ) : filteredAwards.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Award className="mx-auto size-12 text-gray-300" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-semibold">Chưa có giải thưởng nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-(--admin-border) bg-(--admin-background)/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="w-36 px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Tên giải thưởng</th>
                  <th className="py-3 px-4">Hạng mục / Danh hiệu</th>
                  <th className="w-44 px-4 py-3">Số quyết định</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--admin-border)">
                {filteredAwards.map((item) => (
                  <tr key={item.id} className="hover:bg-(--admin-background)/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-500">{item.code}</td>
                    <td className="px-4 py-3 font-semibold text-(--admin-title)">
                      <div className="truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 font-normal line-clamp-1">{item.description}</div>
                    </td>
                    <td className="max-w-[260px] px-4 py-3">
                      <span className="inline-block max-w-full truncate rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                        {item.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <FileText size={12} className="text-gray-400" />
                        {item.decision_number}
                      </span>
                    </td>
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

      {/* Modal Thêm / Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-(--admin-border) px-6 py-4">
              <h3 className="text-base font-bold text-(--admin-title)">
                {editingItem ? 'Chỉnh sửa Giải Thưởng' : 'Thêm Mới Giải Thưởng'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Mã giải thưởng *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  placeholder="Ví dụ: HG-ANG-01"
                />
                {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
              </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-(--admin-heading)">Tên giải thưởng *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  placeholder="Ví dụ: Kỷ lục gia Sáng tạo Quốc gia"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-(--admin-heading)">Hạng mục / Danh hiệu *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                    placeholder="Ví dụ: Tôn vinh Sáng nghiệp"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-(--admin-heading)">Số quyết định *</label>
                  <input
                    type="text"
                    value={formData.decision_number}
                    onChange={(e) => setFormData({ ...formData, decision_number: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                    placeholder="Ví dụ: QĐ-24/VK-2026"
                  />
                  {errors.decision_number && <p className="text-xs text-red-500 mt-1">{errors.decision_number}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-(--admin-heading)">Năm xét tặng</label>
                <input
                  type="number"
                  min="1"
                  max="9999"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="min-h-10 w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
                  placeholder="Ví dụ: 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Mô tả giải thưởng *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  placeholder="Chi tiết về tiêu chí, ý nghĩa của giải thưởng..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <ImageUploadField
                label="Hình ảnh Giải thưởng"
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
                  {editingItem ? 'Lưu thay đổi' : 'Tạo Giải Thưởng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <span className="p-2.5 rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </span>
              <div>
                <h3 className="text-base font-bold text-(--admin-title)">Xóa Giải Thưởng</h3>
                <p className="text-xs text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-(--admin-ink)">
              Bạn có chắc muốn xóa giải thưởng <strong>"{deletingItem.name}"</strong>?
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
