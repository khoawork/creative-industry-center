import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Sparkles, Check, BarChart3 } from 'lucide-react';
import { AdminCard, AdminInput, AdminButton, AdminBadge } from '../Common/index.js';

export default function ProjectHeaderEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    badge: initialData?.badge || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    statistics: Array.isArray(initialData?.statistics) ? [...initialData.statistics] : [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        badge: initialData.badge || '',
        title: initialData.title || '',
        description: initialData.description || '',
        statistics: Array.isArray(initialData.statistics) ? [...initialData.statistics] : [],
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getVal = (e) => (e && e.target ? e.target.value : e);

  const validate = () => {
    const errs = {};
    if (!formData.badge?.trim()) errs.badge = 'Badge danh mục là bắt buộc';
    if (!formData.title?.trim()) errs.title = 'Tiêu đề chính là bắt buộc';
    if (!formData.description?.trim()) errs.description = 'Mô tả là bắt buộc';
    if (!formData.statistics || formData.statistics.length === 0) {
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
    if (e) e.preventDefault();
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
      {/* 1. Thông tin chính Header */}
      <AdminCard
        title="Thông tin Header & Giới thiệu Dự án"
        subtitle="Quản lý thẻ phân loại, tiêu đề lớn và nội dung giới thiệu tổng quan trang dự án."
        badge={<AdminBadge variant="burgundy">Hero Section</AdminBadge>}
      >
        <div className="space-y-4">
          <AdminInput
            label="Huy hiệu danh mục (Badge)"
            required
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: getVal(e) })}
            placeholder="Ví dụ: DANH MỤC DỰ ÁN TRỌNG ĐIỂM"
            error={errors.badge}
          />

          <AdminInput
            label="Tiêu đề chính"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: getVal(e) })}
            placeholder="Ví dụ: CÁC DỰ ÁN TIÊU BIỂU"
            error={errors.title}
          />

          <AdminInput
            label="Mô tả giới thiệu"
            required
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: getVal(e) })}
            placeholder="Mô tả định hướng và sứ mệnh của các công trình, dự án..."
            error={errors.description}
          />
        </div>
      </AdminCard>

      {/* 2. Số liệu thống kê */}
      <AdminCard
        title="Chỉ số Thống kê Nổi bật (Statistics)"
        subtitle="Hiển thị các con số bảo chứng ấn tượng về số lượng dự án, đối tác và quy mô tác động."
        badge={<AdminBadge variant="amber">Key Numbers</AdminBadge>}
        actions={
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={handleAddStat}
          >
            Thêm chỉ số
          </AdminButton>
        }
      >
        {errors.statistics && <p className="text-xs text-red-500 mb-3">{errors.statistics}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.statistics.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-(--admin-border) bg-(--admin-background) space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-(--admin-heading)">
                  Chỉ số #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition"
                  title="Xóa chỉ số"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-(--admin-heading) uppercase mb-1">
                  Nhãn chỉ số <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="Ví dụ: DỰ ÁN ĐANG TRIỂN KHAI"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-(--admin-heading) uppercase mb-1">
                    Giá trị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="Ví dụ: 24+"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs font-bold text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-(--admin-heading) uppercase mb-1">
                    Ghi chú phụ (nếu có)
                  </label>
                  <input
                    type="text"
                    value={stat.sublabel || ''}
                    onChange={(e) => handleStatChange(idx, 'sublabel', e.target.value)}
                    placeholder="Ví dụ: Tỉnh thành"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                  />
                </div>
              </div>
              {errors[`stat_${idx}`] && (
                <p className="text-[11px] text-red-500 mt-1">{errors[`stat_${idx}`]}</p>
              )}
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Thanh hành động lưu */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-(--admin-border) bg-(--admin-surface)/95 p-4 shadow-lg backdrop-blur-md">
        <div>
          {saveSuccess ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <Check size={16} /> Đã lưu Header thành công!
            </span>
          ) : (
            <span className="text-xs text-(--admin-ink)/60">
              Nhấn lưu để đồng bộ thông tin giới thiệu và chỉ số thống kê ra website.
            </span>
          )}
        </div>

        <AdminButton
          type="submit"
          variant="primary"
          size="md"
          icon={Save}
          loading={isSaving}
        >
          {isSaving ? 'Đang lưu...' : 'Lưu phần Header'}
        </AdminButton>
      </div>
    </form>
  );
}
