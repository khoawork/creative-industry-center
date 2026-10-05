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
  UserCheck,
  MapPin,
  Award as CertificateIcon,
  CheckCircle,
} from 'lucide-react';
import { TrainingAPI } from '../../../api/trainingApi.js';

const DEFAULT_BENEFITS = [
  'Bảo chứng chuẩn mực Viện Kỷ lục',
  'Đồng hành chuyên môn cùng các Chuyên gia đầu ngành',
  'Cấp chứng nhận tốt nghiệp lưu trữ hồ sơ quốc gia',
];

export default function TrainingTableManager() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal thêm / sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    time: '3 buổi (1 tuần)',
    audience: 'Doanh nghiệp, Nhà sáng tạo',
    certificate: 'Chứng nhận VIETKINGS',
    description: '',
    benefits: [...DEFAULT_BENEFITS],
    format: 'Trực tiếp kết hợp Trực tuyến',
    placeholderName: 'Ví dụ: Nguyễn Văn A',
    placeholderPhone: '0987 xxx xxx',
    placeholderEmail: 'contact@domain.vn',
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
      id: '',
      name: '',
      time: '3 buổi (1 tuần)',
      audience: 'Doanh nghiệp, Nhà sáng tạo',
      certificate: 'Creative Industry Certificate',
      description: '',
      benefits: [...DEFAULT_BENEFITS],
      format: 'Trực tiếp kết hợp Trực tuyến',
      placeholderName: 'Ví dụ: Nguyễn Văn A',
      placeholderPhone: '0987 xxx xxx',
      placeholderEmail: 'contact@domain.vn',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const props = item.props || {};

    let benefitsList = [];
    if (Array.isArray(props.benefits) && props.benefits.length > 0) {
      benefitsList = [...props.benefits];
    } else if (Array.isArray(props.highlights) && props.highlights.length > 0) {
      benefitsList = [...props.highlights];
    } else if (typeof props.benefits === 'string' && props.benefits.trim()) {
      benefitsList = props.benefits.split('\n').map((s) => s.trim()).filter(Boolean);
    } else {
      benefitsList = [...DEFAULT_BENEFITS];
    }

    setFormData({
      id: item.id || '',
      name: item.name || '',
      time: props.duration || item.time || '3 buổi (1 tuần)',
      audience: props.audience || props.target_audience || 'Doanh nghiệp & Nhà sáng tạo',
      certificate: item.certificate || props.certificate || 'Chứng nhận VIETKINGS',
      description: props.description || '',
      benefits: benefitsList,
      format: props.format || (Array.isArray(props.locations) ? props.locations.join(', ') : '') || 'Trực tiếp kết hợp Trực tuyến',
      placeholderName: props.placeholderName || 'Ví dụ: Nguyễn Văn A',
      placeholderPhone: props.placeholderPhone || '0987 xxx xxx',
      placeholderEmail: props.placeholderEmail || 'contact@domain.vn',
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
    if (!formData.audience.trim()) errs.audience = 'Đối tượng tham gia là bắt buộc';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ''],
    }));
  };

  const handleRemoveBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== index),
    }));
  };

  const handleBenefitChange = (index, value) => {
    setFormData((prev) => {
      const next = [...prev.benefits];
      next[index] = value;
      return { ...prev, benefits: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    const cleanedBenefits = formData.benefits
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      time: formData.time.trim(),
      certificate: formData.certificate.trim(),
      props: {
        code: editingItem?.id || formData.id.trim() || undefined,
        duration: formData.time.trim(),
        audience: formData.audience.trim(),
        target_audience: formData.audience.trim(),
        description: formData.description.trim(),
        benefits: cleanedBenefits.length > 0 ? cleanedBenefits : DEFAULT_BENEFITS,
        highlights: cleanedBenefits.length > 0 ? cleanedBenefits : DEFAULT_BENEFITS,
        format: formData.format.trim(),
        locations: [formData.format.trim()],
        certificate: formData.certificate.trim(),
        placeholderName: formData.placeholderName.trim() || 'Ví dụ: Nguyễn Văn A',
        placeholderPhone: formData.placeholderPhone.trim() || '0987 xxx xxx',
        placeholderEmail: formData.placeholderEmail.trim() || 'contact@domain.vn',
      },
    };

    if (!editingItem && formData.id.trim()) {
      payload.id = formData.id.trim();
    }

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
        (tr.props?.audience && tr.props.audience.toLowerCase().includes(q)) ||
        (tr.props?.target_audience && tr.props.target_audience.toLowerCase().includes(q)) ||
        String(tr.id).toLowerCase().includes(q)
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
            placeholder="Tìm kiếm chương trình đào tạo theo tên, mã khóa, chứng chỉ, đối tượng..."
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
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-(--admin-accent) text-white hover:opacity-90 transition cursor-pointer shadow-xs"
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
                  <th className="py-3 px-4 w-20">Mã khóa</th>
                  <th className="py-3 px-4 min-w-[260px]">Tên Khóa Đào Tạo</th>
                  <th className="py-3 px-4 min-w-[150px]">Thời Lượng &amp; Đối Tượng</th>
                  <th className="py-3 px-4 min-w-[200px]">Chứng Chỉ &amp; Hình Thức</th>
                  <th className="py-3 px-4 min-w-[140px]">Quyền Lợi</th>
                  <th className="py-3 px-4 text-right w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--admin-border)">
                {filteredTrainings.map((item) => {
                  const duration = item.props?.duration || item.time || '—';
                  const audience = item.props?.audience || item.props?.target_audience || '—';
                  const format = item.props?.format || (Array.isArray(item.props?.locations) ? item.props.locations.join(', ') : '') || 'Trực tiếp & Trực tuyến';
                  const cert = item.certificate || item.props?.certificate || '—';
                  const benefitsCount = Array.isArray(item.props?.benefits)
                    ? item.props.benefits.length
                    : Array.isArray(item.props?.highlights)
                    ? item.props.highlights.length
                    : 0;

                  return (
                    <tr key={item.id} className="hover:bg-(--admin-background)/40 transition">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-(--admin-accent)">
                        <span className="rounded bg-(--admin-background) px-2 py-1 border border-(--admin-border)">
                          {item.id}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-(--admin-title) line-clamp-1">{item.name}</div>
                        {item.props?.description && (
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.props.description}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-(--admin-ink)">
                        <div className="flex items-center gap-1 font-medium">
                          <Clock size={12} className="text-[#805600] shrink-0" />
                          <span>{duration}</span>
                        </div>
                        <div className="text-gray-500 line-clamp-1 mt-1">
                          {audience}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        <div className="flex items-center gap-1 font-semibold text-[#805600]">
                          <CertificateIcon size={13} className="shrink-0" />
                          <span className="line-clamp-1">{cert}</span>
                        </div>
                        <div className="text-gray-500 mt-0.5 line-clamp-1">
                          {format}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle size={11} />
                          {benefitsCount} cam kết
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-gray-500 hover:text-(--admin-accent) hover:bg-(--admin-background) rounded-md transition cursor-pointer"
                            title="Chỉnh sửa toàn bộ thông tin"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition cursor-pointer"
                            title="Xóa khóa học"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm / Chỉnh Sửa Khóa Đào Tạo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-(--admin-border) px-6 py-4 bg-(--admin-background)/40">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-(--admin-accent)" size={20} />
                <h3 className="text-base font-bold text-(--admin-title)">
                  {editingItem ? `Chỉnh sửa Khóa Đào Tạo (${editingItem.id})` : 'Thêm Mới Khóa Đào Tạo'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Hàng 1: Mã khóa (nếu tạo mới) & Tên khóa học */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Mã khóa
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    disabled={!!editingItem}
                    placeholder="VK-04"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) font-mono font-bold focus:outline-none focus:border-(--admin-accent) disabled:opacity-60"
                  />
                  <span className="text-[10px] text-gray-500 block mt-0.5">Tự sinh nếu để trống</span>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Tiêu đề khóa học *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) font-bold focus:outline-none focus:border-(--admin-accent)"
                    placeholder="Ví dụ: Nghệ thuật Lãnh đạo Đổi mới & Văn hóa Doanh nghiệp Tiên phong"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
              </div>

              {/* Hàng 2: Thời lượng & Đối tượng tham gia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Thời lượng (kèm icon Đồng hồ) *
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                    placeholder="Ví dụ: 2 ngày Workshop thực chiến / 3 buổi (1 tuần)"
                  />
                  {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Đối tượng tham gia (kèm icon Người) *
                  </label>
                  <input
                    type="text"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                    placeholder="Ví dụ: Đội ngũ quản lý cấp trung và cao, Doanh nhân"
                  />
                  {errors.audience && <p className="text-xs text-red-500 mt-1">{errors.audience}</p>}
                </div>
              </div>

              {/* Hàng 3: Mô tả chi tiết */}
              <div>
                <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                  Mô tả khóa đào tạo *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                  placeholder="Khai phóng tinh thần dám tạo đột phá, thiết kế bộ chỉ số văn hóa sáng tạo và dẫn dắt đội ngũ..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* Hàng 4: Danh sách Quyền lợi & Điểm nổi bật (Checkmarks trên thẻ) */}
              <div className="p-4 rounded-xl border border-(--admin-border) bg-(--admin-background)/40 space-y-3">
                <div className="flex items-center justify-between border-b border-(--admin-border) pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#805600]" />
                    <span className="text-xs font-bold text-(--admin-title) uppercase tracking-wider">
                      Danh sách Cam kết &amp; Quyền lợi học viên ({formData.benefits.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-(--admin-accent) hover:underline cursor-pointer"
                  >
                    <Plus size={13} /> Thêm quyền lợi
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-600 shrink-0">✓</span>
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleBenefitChange(idx, e.target.value)}
                        placeholder={`Quyền lợi #${idx + 1} (ví dụ: Bảo chứng chuẩn mực Viện Kỷ lục)`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-(--admin-border) bg-(--admin-surface) text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(idx)}
                        className="p-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
                        title="Xóa quyền lợi này"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hàng 5: Chân thẻ - Hình thức đào tạo & Chứng chỉ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Hình thức đào tạo (Format)
                  </label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                    placeholder="Ví dụ: Trực tiếp kết hợp Trực tuyến / Hà Nội & TP. HCM"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Chứng chỉ tốt nghiệp *
                  </label>
                  <input
                    type="text"
                    value={formData.certificate}
                    onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) font-semibold focus:outline-none focus:border-(--admin-accent)"
                    placeholder="Ví dụ: Executive Leadership Award / IP & Creative Certificate"
                  />
                  {errors.certificate && <p className="text-xs text-red-500 mt-1">{errors.certificate}</p>}
                </div>
              </div>

              {/* Hàng 6: Form Ghi danh (bên phải thẻ) */}
              <div className="p-4 rounded-xl border border-(--admin-border) bg-(--admin-background)/40 space-y-3">
                <span className="text-xs font-bold text-(--admin-title) uppercase tracking-wider block border-b border-(--admin-border) pb-1.5">
                  Cấu hình Placeholder Form Ghi Danh Trực Tiếp
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Placeholder Họ tên</label>
                    <input
                      type="text"
                      value={formData.placeholderName}
                      onChange={(e) => setFormData({ ...formData, placeholderName: e.target.value })}
                      placeholder="Ví dụ: Trần Thị B"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-(--admin-border) bg-(--admin-surface) text-(--admin-title)"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Placeholder Điện thoại</label>
                    <input
                      type="text"
                      value={formData.placeholderPhone}
                      onChange={(e) => setFormData({ ...formData, placeholderPhone: e.target.value })}
                      placeholder="0982 xxx xxx"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-(--admin-border) bg-(--admin-surface) text-(--admin-title)"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Placeholder Email</label>
                    <input
                      type="text"
                      value={formData.placeholderEmail}
                      onChange={(e) => setFormData({ ...formData, placeholderEmail: e.target.value })}
                      placeholder="creator@studio.com"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-(--admin-border) bg-(--admin-surface) text-(--admin-title)"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-(--admin-border)">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-gray-600 hover:bg-(--admin-background) cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-(--admin-accent) text-white hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
                >
                  {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Check size={14} />}
                  {editingItem ? 'Lưu thay đổi toàn bộ' : 'Tạo Khóa Học Mới'}
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
                <p className="text-xs text-gray-500">Mã khóa: {deletingItem.id}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Bạn có chắc chắn muốn xóa khóa học <strong className="text-(--admin-title)">"{deletingItem.name}"</strong>? Dữ liệu đã xóa sẽ không thể phục hồi.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-gray-600 hover:bg-(--admin-background) cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
              >
                {isDeleting ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={14} />}
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
