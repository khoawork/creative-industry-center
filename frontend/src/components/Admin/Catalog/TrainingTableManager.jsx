import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Clock,
  Award as CertificateIcon,
} from 'lucide-react';
import { TrainingAPI } from '../../../api/trainingApi.js';

export default function TrainingTableManager() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal thêm / sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    time: '3 tháng',
    certificate: 'Chứng nhận VIETKINGS',
    target_audience: 'Doanh nhân, nhà sáng nghiệp',
    description: '',
    highlights: 'Thực chiến 100%, Giảng viên chuyên gia',
    locations: 'TP. Hồ Chí Minh, Hà Nội',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Modal xóa
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTrainings = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await TrainingAPI.getTrainings({ per_page: 100 });
      const items = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.items)
        ? response.data.items
        : Array.isArray(response)
        ? response
        : [];
      setTrainings(items);
      if (isManual) showToast('Đã làm mới danh sách Đào tạo!');
    } catch (error) {
      console.error('Lỗi khi tải đào tạo:', error);
      showToast('Không thể kết nối API Đào tạo.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      time: '3 tháng',
      certificate: 'Chứng nhận VIETKINGS',
      target_audience: 'Doanh nhân, nhà sáng nghiệp',
      description: '',
      highlights: 'Thực chiến 100%, Giảng viên chuyên gia',
      locations: 'TP. Hồ Chí Minh, Hà Nội',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const props = item.props || {};
    setFormData({
      name: item.name || '',
      time: item.time || '',
      certificate: item.certificate || '',
      target_audience: props.target_audience || '',
      description: props.description || '',
      highlights: Array.isArray(props.highlights) ? props.highlights.join(', ') : '',
      locations: Array.isArray(props.locations) ? props.locations.join(', ') : '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Tên khóa học là bắt buộc';
    if (!formData.time.trim()) errs.time = 'Thời lượng là bắt buộc';
    if (!formData.certificate.trim()) errs.certificate = 'Chứng chỉ là bắt buộc';
    if (!formData.description.trim()) errs.description = 'Mô tả khóa học là bắt buộc';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    const highlightsArr = formData.highlights
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const locationsArr = formData.locations
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      time: formData.time.trim(),
      certificate: formData.certificate.trim(),
      props: {
        target_audience: formData.target_audience.trim() || 'Doanh nghiệp và cá nhân',
        description: formData.description.trim(),
        highlights: highlightsArr.length > 0 ? highlightsArr : ['Thực chiến chuyên sâu'],
        locations: locationsArr.length > 0 ? locationsArr : ['Toàn quốc'],
      },
    };

    try {
      if (editingItem) {
        await TrainingAPI.updateTraining(editingItem.id, payload);
        showToast(`Cập nhật khóa học "${payload.name}" thành công!`);
      } else {
        await TrainingAPI.createTraining(payload);
        showToast(`Thêm khóa học "${payload.name}" thành công!`);
      }
      setIsModalOpen(false);
      await fetchTrainings();
    } catch (error) {
      console.error('Lỗi khi lưu khóa học:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu đào tạo.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      await TrainingAPI.deleteTraining(deletingItem.id);
      showToast(`Đã xóa khóa đào tạo "${deletingItem.name}"!`);
      setDeletingItem(null);
      await fetchTrainings();
    } catch (error) {
      console.error('Lỗi khi xóa đào tạo:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi xóa đào tạo.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTrainings = useMemo(() => {
    return trainings.filter((tr) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (tr.name && tr.name.toLowerCase().includes(q)) ||
        (tr.certificate && tr.certificate.toLowerCase().includes(q)) ||
        (tr.props?.target_audience && tr.props.target_audience.toLowerCase().includes(q)) ||
        String(tr.id).includes(q)
      );
    });
  }, [trainings, searchQuery]);

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
            placeholder="Tìm kiếm chương trình đào tạo theo tên, chứng chỉ, đối tượng..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchTrainings(true)}
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
            Thêm Khóa Đào Tạo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-(--admin-border) bg-(--admin-surface) rounded-xl shadow-[var(--admin-panel-shadow)] overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-(--admin-heading)" />
          </div>
        ) : filteredTrainings.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <GraduationCap className="mx-auto size-12 text-gray-300" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-semibold">Chưa có khóa đào tạo nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-(--admin-border) bg-(--admin-background)/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-14">ID</th>
                  <th className="py-3 px-4">Tên Khóa Đào Tạo</th>
                  <th className="py-3 px-4">Thời Lượng</th>
                  <th className="py-3 px-4">Chứng Chỉ</th>
                  <th className="py-3 px-4">Đối Tượng</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--admin-border)">
                {filteredTrainings.map((item) => (
                  <tr key={item.id} className="hover:bg-(--admin-background)/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500 font-semibold">#{item.id}</td>
                    <td className="py-3 px-4 font-semibold text-(--admin-title)">
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500 font-normal line-clamp-1">{item.props?.description}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Clock size={12} className="text-gray-400" />
                        {item.time}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CertificateIcon size={12} />
                        {item.certificate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {item.props?.target_audience || 'Đại chúng'}
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
                {editingItem ? 'Chỉnh sửa Khóa Đào Tạo' : 'Thêm Mới Khóa Đào Tạo'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Tên Khóa Học *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  placeholder="Ví dụ: Đào tạo Quản trị Đổi mới Sáng tạo"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Thời Lượng *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                    placeholder="Ví dụ: 3 tháng (24 buổi)"
                  />
                  {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Chứng Chỉ Cấp *</label>
                  <input
                    type="text"
                    value={formData.certificate}
                    onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                    placeholder="Ví dụ: Chứng chỉ VIETKINGS"
                  />
                  {errors.certificate && <p className="text-xs text-red-500 mt-1">{errors.certificate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Đối tượng tham gia</label>
                <input
                  type="text"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  placeholder="Doanh nhân, nhà sáng nghiệp, giám đốc sáng tạo..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Mô tả khóa đào tạo *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                  placeholder="Mô tả mục tiêu, giá trị nhận được từ chương trình đào tạo..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Điểm nổi bật (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                    placeholder="Thực chiến 100%, Giảng viên hàng đầu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-(--admin-heading) uppercase mb-1">Địa điểm tổ chức</label>
                  <input
                    type="text"
                    value={formData.locations}
                    onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-(--admin-accent)"
                    placeholder="TP. Hồ Chí Minh, Hà Nội"
                  />
                </div>
              </div>

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
                  {editingItem ? 'Lưu thay đổi' : 'Tạo Khóa Học'}
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
                <h3 className="text-base font-bold text-(--admin-title)">Xóa Khóa Đào Tạo</h3>
                <p className="text-xs text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-(--admin-ink)">
              Bạn có chắc muốn xóa khóa học <strong>"{deletingItem.name}"</strong>?
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
