import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2 } from 'lucide-react';
import { AdminCard, AdminButton, AdminStickySaveBar } from '../Common/index.js';

export default function ForumPillarsEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    tag: initialData?.tag ?? '',
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    pillars: Array.isArray(initialData?.pillars) ? [...initialData.pillars] : [],
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tag: initialData.tag ?? '',
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        pillars: Array.isArray(initialData.pillars) ? [...initialData.pillars] : [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePillarChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.pillars];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pillars: updated };
    });
  };

  const handleAddPillar = () => {
    setFormData((prev) => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        {
          id: Date.now(),
          pillar_no: '',
          title: '',
          tag: '',
          icon: 'verified',
          description: '',
        },
      ],
    }));
  };

  const handleRemovePillar = (index) => {
    setFormData((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    await onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminCard
        title="Tiêu Đề & Giới Thiệu Bốn Trụ Cột"
        subtitle="Cấu hình thông tin giới thiệu cho khối 4 trụ cột chiến lược của Diễn đàn."
        actions={
          <AdminButton
            type="submit"
            variant="primary"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
          >
            {saveSuccess ? 'Đã lưu Trụ Cột!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </AdminButton>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Nhãn phân loại (Tag)
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Tôn chỉ & Mục đích Hành động"
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Tiêu đề chính
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Bốn Trụ Cột Chiến Lược 2026"
                required
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Đoạn văn mô tả tóm tắt
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Thiết lập nền tảng chuyển hóa..."
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="Danh Sách Trụ Cột Hành Động"
        subtitle="Quản lý từng trụ cột chiến lược bao gồm số thứ tự, tiêu đề, nhãn thẻ và mô tả chi tiết."
        actions={
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={handleAddPillar}
          >
            Thêm Trụ Cột
          </AdminButton>
        }
      >
        <div className="space-y-4">
          {formData.pillars.map((pillar, index) => (
            <div
              key={pillar.id || index}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 uppercase">
                    {pillar.pillar_no || `Trụ cột 0${index + 1}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePillar(index)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Xóa trụ cột"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Mã / Ký hiệu trụ cột
                  </label>
                  <input
                    type="text"
                    value={pillar.pillar_no || ''}
                    onChange={(e) => handlePillarChange(index, 'pillar_no', e.target.value)}
                    placeholder="TRỤ CỘT 01"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nhãn phụ (Tag)
                  </label>
                  <input
                    type="text"
                    value={pillar.tag || ''}
                    onChange={(e) => handlePillarChange(index, 'tag', e.target.value)}
                    placeholder="Nền tảng Tinh hoa"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Mã icon (verified, trending_up, hub, public)
                  </label>
                  <input
                    type="text"
                    value={pillar.icon || 'verified'}
                    onChange={(e) => handlePillarChange(index, 'icon', e.target.value)}
                    placeholder="verified"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tiêu đề trụ cột
                </label>
                <input
                  type="text"
                  value={pillar.title || ''}
                  onChange={(e) => handlePillarChange(index, 'title', e.target.value)}
                  placeholder="XÁC LẬP & TÔN VINH ĐỈNH CAO"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Mô tả nội dung trụ cột
                </label>
                <textarea
                  rows={2}
                  value={pillar.description || ''}
                  onChange={(e) => handlePillarChange(index, 'description', e.target.value)}
                  placeholder="Chuẩn hóa tiêu chí đánh giá kỷ lục..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                />
              </div>
            </div>
          ))}

          {formData.pillars.length === 0 && (
            <p className="text-center py-6 text-xs text-slate-500 italic">
              Chưa có trụ cột nào. Nhấn &ldquo;Thêm Trụ Cột&rdquo; để bắt đầu.
            </p>
          )}
        </div>
      </AdminCard>
      <AdminStickySaveBar
        type="submit"
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        successMessage="Đã lưu Trụ cột thành công!"
        hintMessage="Nhấn lưu để đồng bộ 4 trụ cột chiến lược của Diễn đàn ra website."
        buttonText="Lưu Trụ Cột"
        savingText="Đang lưu..."
      />
    </form>
  );
}
