import React, { useState, useEffect } from 'react';
import { Pencil, X, Check, RefreshCw, AlertTriangle } from 'lucide-react';

export default function NavEditModal({
  page,
  onClose,
  onSave,
  getPublicHref,
}) {
  const [formData, setFormData] = useState({
    name: page?.name || '',
    slug: page?.slug || '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        name: page.name || '',
        slug: page.slug || '',
      });
      setErrors({});
    }
  }, [page]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Tên menu không được để trống';
    }
    const cleanSlug = formData.slug.trim().replace(/^\/+|\/+$/g, '');
    if (!cleanSlug) {
      errs.slug = 'Đường dẫn slug không được để trống';
    } else if (/\s/.test(cleanSlug)) {
      errs.slug = 'Đường dẫn slug không được chứa khoảng trắng';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !page) return;

    setIsSaving(true);
    const cleanSlug = formData.slug.trim().replace(/^\/+|\/+$/g, '');

    try {
      await onSave(page.id, {
        name: formData.name.trim(),
        slug: cleanSlug,
      });
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu chỉnh sửa menu:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!page) return null;

  const publicUrl = getPublicHref ? getPublicHref(formData.slug) : `/${formData.slug}`;
  const isHomePage = page.id === 9 || page.slug === 'home';

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
                Chỉnh sửa Menu &amp; Slug
              </h3>
              <p className="text-xs text-gray-500">ID #{page.id} · Model Page</p>
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
              Tên Menu hiển thị *
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

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
              Đường dẫn trang (Slug) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">
                /
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  }))
                }
                placeholder="events, about, contact..."
                className={`w-full pl-7 pr-3.5 py-2 text-sm font-mono rounded-lg border bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent) transition ${
                  errors.slug ? 'border-red-500' : 'border-(--admin-border)'
                }`}
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-xs text-red-500">{errors.slug}</p>
            )}
            <p className="mt-1.5 text-xs text-gray-500">
              URL xem trước:{' '}
              <code className="text-emerald-700 font-semibold font-mono">
                {publicUrl}
              </code>
            </p>
          </div>

          {/* Cảnh báo trang chủ */}
          {isHomePage && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle size={14} className="text-amber-600" />
                Lưu ý đối với Trang Chủ
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                Trang chủ (ID #9) nên giữ slug là <code className="font-bold">home</code> để website liên kết chính xác tới trang đầu.
              </p>
            </div>
          )}

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
