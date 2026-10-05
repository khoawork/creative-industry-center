import React, { useState } from 'react';
import { Plus, Trash2, Save, Sparkles, Check } from 'lucide-react';

export default function ProjectHeaderEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    badge: initialData?.badge || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    statistics: Array.isArray(initialData?.statistics) ? [...initialData.statistics] : [],
  });

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
          <h3 className="text-base font-bold text-(--admin-title)">Thông tin Header &amp; Giới thiệu Dự án</h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
            Huy hiệu danh mục (Badge) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            placeholder="Ví dụ: DANH MỤC DỰ ÁN TRỌNG ĐIỂM"
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
            placeholder="Ví dụ: CÁC DỰ ÁN NỔI BẬT"
            className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
            Mô tả giới thiệu <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả định hướng và sứ mệnh của các công trình, dự án..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Số liệu thống kê */}
      <div className="p-6 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] space-y-4">
        <div className="flex items-center justify-between border-b border-(--admin-border) pb-3">
          <h3 className="text-base font-bold text-(--admin-title)">Chỉ số thống kê nổi bật (Statistics)</h3>
          <button
            type="button"
            onClick={handleAddStat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-(--admin-accent) text-white hover:opacity-90 transition"
          >
            <Plus size={14} /> Thêm chỉ số
          </button>
        </div>

        {errors.statistics && <p className="text-xs text-red-500">{errors.statistics}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.statistics.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-(--admin-border) bg-(--admin-background) space-y-3 relative group"
            >
              <button
                type="button"
                onClick={() => handleRemoveStat(idx)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded"
                title="Xóa chỉ số"
              >
                <Trash2 size={15} />
              </button>

              <div>
                <label className="block text-[11px] font-bold text-(--admin-heading) uppercase mb-1">
                  Nhãn chỉ số <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="Ví dụ: DỰ ÁN ĐANG TRIỂN KHAI"
                  className="w-full px-3 py-1.5 rounded border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-(--admin-heading) uppercase mb-1">
                    Giá trị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="24+"
                    className="w-full px-3 py-1.5 rounded border border-(--admin-border) bg-(--admin-surface) text-xs font-bold text-(--admin-title)"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-(--admin-heading) uppercase mb-1">
                    Ghi chú phụ (nếu có)
                  </label>
                  <input
                    type="text"
                    value={stat.sublabel || ''}
                    onChange={(e) => handleStatChange(idx, 'sublabel', e.target.value)}
                    placeholder="Tỉnh thành"
                    className="w-full px-3 py-1.5 rounded border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                  />
                </div>
              </div>
              {errors[`stat_${idx}`] && <p className="text-[11px] text-red-500">{errors[`stat_${idx}`]}</p>}
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--admin-accent) text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-sm"
        >
          <Save size={16} />
          {isSaving ? 'Đang lưu...' : 'Lưu phần Header'}
        </button>
      </div>
    </form>
  );
}
