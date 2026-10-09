import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Layers, Check } from 'lucide-react';
import { AdminCard, AdminButton, AdminStickySaveBar } from '../Common/index.js';

const ICON_OPTIONS = [
  { value: 'hub', label: 'Liên kết mạng lưới (Hub)' },
  { value: 'workspace', label: 'Không gian tiêu chuẩn (Workspace)' },
  { value: 'storefront', label: 'Thương mại hóa (Storefront)' },
];

export default function TrainingModelsEditor({ initialData, onSave, isSaving }) {
  const [models, setModels] = useState(
    Array.isArray(initialData) ? [...initialData] : []
  );

  useEffect(() => {
    if (Array.isArray(initialData)) {
      setModels([...initialData]);
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (models.length === 0) {
      errs.models = 'Cần ít nhất 1 mô hình hợp tác';
    } else {
      models.forEach((m, idx) => {
        if (!m.model?.trim()) errs[`model_${idx}`] = 'Tên mô hình là bắt buộc';
        if (!m.title?.trim()) errs[`title_${idx}`] = 'Tiêu đề mô hình là bắt buộc';
        if (!m.description?.trim()) errs[`desc_${idx}`] = 'Mô tả mô hình là bắt buộc';
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaveSuccess(false);
    await onSave(models);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleAddModel = () => {
    const nextIdx = models.length + 1;
    const nextLabel = `Mô hình ${String(nextIdx).padStart(2, '0')}`;
    setModels((prev) => [
      ...prev,
      {
        model: nextLabel,
        icon: 'hub',
        title: '',
        description: '',
        action: 'Tìm hiểu thêm',
      },
    ]);
  };

  const handleRemoveModel = (index) => {
    setModels((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleModelChange = (index, field, value) => {
    setModels((prev) => {
      const nextModels = [...prev];
      nextModels[index] = { ...nextModels[index], [field]: value };
      return nextModels;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminCard
        title={`Các Mô hình Hợp tác Chiến lược (${models.length})`}
        subtitle="Hiển thị các khối mô hình giới thiệu ngay dưới Banner đầu trang"
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={handleAddModel}
            >
              Thêm mô hình
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              size="sm"
              icon={saveSuccess ? Check : Save}
              loading={isSaving}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu danh sách Mô hình'}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4">
          {errors.models && <p className="text-xs text-red-500">{errors.models}</p>}

          <div className="space-y-4">
            {models.map((model, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-background) space-y-3"
              >
                <div className="flex items-center justify-between border-b border-(--admin-border) pb-2">
                  <span className="text-xs font-bold text-(--admin-accent) uppercase tracking-wider">
                    #{idx + 1} - {model.model || `Mô hình ${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveModel(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Xóa mô hình này"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                      Tên phân loại (ví dụ: Mô hình 01) *
                    </label>
                    <input
                      type="text"
                      value={model.model}
                      onChange={(e) => handleModelChange(idx, 'model', e.target.value)}
                      placeholder="Mô hình 01"
                      className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) font-semibold outline-none focus:border-(--admin-accent)"
                    />
                    {errors[`model_${idx}`] && (
                      <p className="text-[11px] text-red-500 mt-1">{errors[`model_${idx}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                      Biểu tượng Icon
                    </label>
                    <select
                      value={model.icon || 'hub'}
                      onChange={(e) => handleModelChange(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) outline-none focus:border-(--admin-accent)"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                      Nút hành động (Action text)
                    </label>
                    <input
                      type="text"
                      value={model.action || ''}
                      onChange={(e) => handleModelChange(idx, 'action', e.target.value)}
                      placeholder="Ví dụ: Quy trình chuẩn hóa"
                      className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) outline-none focus:border-(--admin-accent)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Tiêu đề mô hình *
                  </label>
                  <input
                    type="text"
                    value={model.title}
                    onChange={(e) => handleModelChange(idx, 'title', e.target.value)}
                    placeholder="Ví dụ: Liên kết Nghiên cứu & Chuyển giao"
                    className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) font-bold outline-none focus:border-(--admin-accent)"
                  />
                  {errors[`title_${idx}`] && (
                    <p className="text-[11px] text-red-500 mt-1">{errors[`title_${idx}`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Nội dung mô tả chi tiết *
                  </label>
                  <textarea
                    rows={2}
                    value={model.description}
                    onChange={(e) => handleModelChange(idx, 'description', e.target.value)}
                    placeholder="Mô tả tóm tắt mục tiêu và giá trị của mô hình hợp tác..."
                    className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) outline-none focus:border-(--admin-accent)"
                  />
                  {errors[`desc_${idx}`] && (
                    <p className="text-[11px] text-red-500 mt-1">{errors[`desc_${idx}`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminStickySaveBar
        type="submit"
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        successMessage="Đã lưu thành công!"
        hintMessage="Nhấn lưu để đồng bộ danh sách mô hình hợp tác ra ngoài website."
        buttonText="Lưu danh sách Mô hình"
        savingText="Đang lưu..."
      />
    </form>
  );
}
