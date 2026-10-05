import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Sparkles, Check } from 'lucide-react';

export default function TrainingHeaderEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    badge: initialData?.badge || 'Chuẩn mực VIETKINGS Quốc tế',
    title: initialData?.title || 'HỢP TÁC & ĐÀO TẠO',
    description:
      initialData?.description ||
      'Chương trình phát triển năng lực sáng tạo, kỹ năng xác lập kỷ lục và đồng hành chuyển giao tri thức doanh nghiệp.',
    statistics: Array.isArray(initialData?.statistics) ? [...initialData.statistics] : [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        badge: initialData.badge || 'Chuẩn mực VIETKINGS Quốc tế',
        title: initialData.title || 'HỢP TÁC & ĐÀO TẠO',
        description:
          initialData.description ||
          'Chương trình phát triển năng lực sáng tạo, kỹ năng xác lập kỷ lục và đồng hành chuyển giao tri thức doanh nghiệp.',
        statistics: Array.isArray(initialData.statistics) ? [...initialData.statistics] : [],
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.badge.trim()) errs.badge = 'Badge danh mục là bắt buộc';
    if (!formData.title.trim()) errs.title = 'Tiêu đề chính là bắt buộc';
    if (!formData.description.trim()) errs.description = 'Mô tả là bắt buộc';
    if (formData.statistics.length === 0) {
      errs.statistics = 'Cần ít nhất 1 số liệu thống kê';
    } else {
      formData.statistics.forEach((stat, idx) => {
        if (!stat.label?.trim() || !stat.value?.trim()) {
          errs[`stat_${idx}`] = 'Nhãn và Giá trị thống kê là bắt buộc';
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaveSuccess(false);
    await onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleAddStat = () => {
    setFormData((prev) => ({
      ...prev,
      statistics: [...prev.statistics, { label: 'Chỉ số mới', value: '10+', sublabel: '' }],
    }));
  };

  const handleRemoveStat = (index) => {
    setFormData((prev) => ({
      ...prev,
      statistics: prev.statistics.filter((_, idx) => idx !== index),
    }));
  };

  const handleStatChange = (index, field, value) => {
    setFormData((prev) => {
      const nextStats = [...prev.statistics];
      nextStats[index] = { ...nextStats[index], [field]: value };
      return { ...prev, statistics: nextStats };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông tin chính */}
      <div className="p-6 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] space-y-5">
        <div className="flex items-center gap-2 border-b border-(--admin-border) pb-3">
          <Sparkles className="text-(--admin-accent)" size={18} />
          <h3 className="text-base font-bold text-(--admin-title)">
            Thông tin Header &amp; Giới thiệu Đào tạo
          </h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
            Huy hiệu phân loại (Badge) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            placeholder="Ví dụ: Chuẩn mực VIETKINGS Quốc tế"
            className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
          />
          {errors.badge && <p className="text-xs text-red-500 mt-1">{errors.badge}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
            Tiêu đề chính <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ví dụ: HỢP TÁC & ĐÀO TẠO"
            className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
            Mô tả tổng quan <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả tóm tắt định hướng chương trình hợp tác & đào tạo..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Danh sách thống kê số liệu */}
      <div className="p-6 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] space-y-4">
        <div className="flex items-center justify-between border-b border-(--admin-border) pb-3">
          <div>
            <h3 className="text-base font-bold text-(--admin-title)">
              Số liệu Thống kê ({formData.statistics.length})
            </h3>
            <p className="text-xs text-(--admin-heading) mt-0.5">
              Hiển thị các chỉ số nổi bật trên banner đầu trang (ví dụ: 120+ Chuyên gia, 100% Chứng nhận)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddStat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-(--admin-accent) text-white hover:opacity-90 transition cursor-pointer"
          >
            <Plus size={14} /> Thêm chỉ số
          </button>
        </div>

        {errors.statistics && <p className="text-xs text-red-500">{errors.statistics}</p>}

        <div className="space-y-3">
          {formData.statistics.map((stat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-(--admin-border) bg-(--admin-background) flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <div className="w-full sm:w-1/3">
                <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                  Giá trị nổi bật
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="Ví dụ: 120+"
                  className="w-full px-3 py-1.5 rounded-md border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) font-bold"
                />
              </div>

              <div className="w-full sm:w-1/2">
                <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                  Nhãn mô tả
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="Ví dụ: KỶ LỤC GIA & CHUYÊN GIA"
                  className="w-full px-3 py-1.5 rounded-md border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                />
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                  Ghi chú phụ (tùy chọn)
                </label>
                <input
                  type="text"
                  value={stat.sublabel || ''}
                  onChange={(e) => handleStatChange(idx, 'sublabel', e.target.value)}
                  placeholder="Ví dụ: Chuẩn mực"
                  className="w-full px-3 py-1.5 rounded-md border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                />
              </div>

              <div className="sm:self-end pb-0.5">
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded transition cursor-pointer"
                  title="Xóa chỉ số này"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nút lưu */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saveSuccess && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <Check size={16} /> Đã lưu thành công!
          </span>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--admin-accent) text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-sm cursor-pointer"
        >
          <Save size={16} />
          {isSaving ? 'Đang lưu...' : 'Lưu thông tin Header'}
        </button>
      </div>
    </form>
  );
}
