import React, { useState } from 'react';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

export default function NavDeleteModal({
  page,
  onClose,
  onConfirm,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!page) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(page.id);
      onClose();
    } catch (error) {
      console.error('Lỗi khi xóa menu:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isHomePage = page.id === 9 || page.slug === 'home';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <span className="p-2.5 rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={24} />
          </span>
          <div>
            <h3 className="text-base font-bold text-(--admin-title)">Xác nhận xóa menu</h3>
            <p className="text-xs text-gray-500">Hành động này không thể hoàn tác</p>
          </div>
        </div>

        <p className="text-sm text-(--admin-ink) leading-relaxed">
          Bạn có chắc chắn muốn xóa mục menu{' '}
          <strong className="text-(--admin-title)">"{page.name}"</strong> (slug:{' '}
          <code className="text-xs font-mono font-semibold px-1 rounded bg-(--admin-background)">
            {page.slug}
          </code>
          )? Trang này sẽ bị gỡ bỏ khỏi cơ sở dữ liệu.
        </p>

        {isHomePage && (
          <div className="mt-3 p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700">
            <strong>Cảnh báo:</strong> Đây là trang chủ chính (Home)! Xóa trang này có thể ảnh hưởng tới hoạt động của website.
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-gray-600 hover:bg-(--admin-background) transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Xác nhận xóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
