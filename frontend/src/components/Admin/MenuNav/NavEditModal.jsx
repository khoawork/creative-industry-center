import React, { useState, useEffect } from 'react';
import { Pencil, X, Check, RefreshCw, Lock, Eye, EyeOff } from 'lucide-react';

export default function NavEditModal({
  page,
  onClose,
  onSave,
  getPublicHref,
}) {
  const [formData, setFormData] = useState({
    name: page?.name || '',
    isVisible: page?.is_visible !== false,
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        name: page.name || '',
        isVisible: page.is_visible !== false,
      });
      setErrors({});
    }
  }, [page]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Tên menu không được để trống';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !page) return;

    setIsSaving(true);
    try {
      await onSave(page.id, {
        name: formData.name.trim(),
        is_visible: formData.isVisible,
      });
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu chỉnh sửa menu:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!page) return null;

  const publicUrl = getPublicHref ? getPublicHref(page.slug) : `/${page.slug}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--admin-border) px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-(--admin-accent)/10 text-(--admin-heading)">
              <Pencil size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-(--admin-title)">
                Chỉnh sửa Trang Menu
              </h3>
              <p className="text-xs text-gray-500">ID #{page.id} · Cập nhật tên và trạng thái hiển thị</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên Menu */}
          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
              Tên Trang hiển thị *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ví dụ: Sự kiện, Giới thiệu..."
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent) transition ${
                errors.name ? 'border-red-500' : 'border-(--admin-border)'
              }`}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Slug cố định (Không cho chỉnh sửa) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Lock size={12} className="text-amber-600" />
                Đường dẫn trang (Slug cố định)
              </label>
              <span className="text-[10px] text-gray-400 italic">Không thể sửa</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">
                /
              </span>
              <input
                type="text"
                readOnly
                disabled
                value={page.slug}
                className="w-full pl-7 pr-3.5 py-2 text-sm font-mono rounded-lg border border-(--admin-border) bg-gray-100 text-gray-500 select-all cursor-not-allowed"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              URL công khai:{' '}
              <code className="text-emerald-700 font-semibold font-mono">
                {publicUrl}
              </code>
            </p>
          </div>

          {/* Toggle Ẩn / Hiện trên Menu Header */}
          <div className="p-3.5 rounded-xl border border-(--admin-border) bg-(--admin-background)/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {formData.isVisible ? (
                  <Eye className="size-4 text-emerald-600" />
                ) : (
                  <EyeOff className="size-4 text-gray-400" />
                )}
                <div>
                  <span className="text-xs font-bold text-(--admin-title) block">
                    Hiển thị trên Menu Header
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {formData.isVisible
                      ? 'Trang sẽ xuất hiện trên thanh điều hướng người dùng'
                      : 'Trang sẽ bị ẩn khỏi thanh điều hướng người dùng'}
                  </span>
                </div>
              </div>

              {/* Switch Button */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-(--admin-border)">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-gray-600 hover:bg-(--admin-background) transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-(--admin-accent) text-(--admin-black) hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
