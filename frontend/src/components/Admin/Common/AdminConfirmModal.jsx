import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, Info, X } from 'lucide-react';
import AdminButton from './AdminButton.jsx';

/**
 * Component Modal Xác nhận chuẩn hóa thay thế window.confirm/alert
 * 
 * @param {boolean} isOpen - Trạng thái hiển thị modal
 * @param {boolean} show - Alias của isOpen
 * @param {function} onClose - Callback khi nhấn Hủy hoặc đóng modal
 * @param {function} onConfirm - Callback khi nhấn nút Xác nhận
 * @param {string} title - Tiêu đề modal
 * @param {string|React.ReactNode} message - Nội dung chi tiết thông báo
 * @param {string|React.ReactNode} description - Alias của message
 * @param {string} confirmText - Chữ hiển thị trên nút Xác nhận (mặc định "Xác nhận" hoặc "Xóa")
 * @param {string} cancelText - Chữ hiển thị trên nút Hủy (mặc định "Hủy")
 * @param {'danger'|'warning'|'info'} type - Loại thông báo (mặc định 'danger')
 * @param {boolean} loading - Trạng thái đang xử lý xác nhận
 */
export default function AdminConfirmModal({
  isOpen,
  show,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText,
  cancelText = 'Hủy',
  type = 'danger',
  loading = false,
}) {
  const visible = isOpen ?? show ?? false;
  const content = message || description;

  // Xử lý phím ESC để đóng modal
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loading && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, loading, onClose]);

  if (!visible) return null;

  // Cấu hình giao diện theo type
  const typeConfig = {
    danger: {
      defaultTitle: 'Xác nhận xóa',
      defaultConfirmText: 'Xóa vĩnh viễn',
      variant: 'danger',
      icon: Trash2,
      iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
    },
    warning: {
      defaultTitle: 'Xác nhận hành động',
      defaultConfirmText: 'Đồng ý',
      variant: 'primary',
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    },
    info: {
      defaultTitle: 'Thông báo',
      defaultConfirmText: 'Xác nhận',
      variant: 'primary',
      icon: Info,
      iconBg: 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400',
    },
  };

  const currentConfig = typeConfig[type] || typeConfig.danger;
  const IconComponent = currentConfig.icon;
  const displayTitle = title || currentConfig.defaultTitle;
  const displayConfirmText = confirmText || currentConfig.defaultConfirmText;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading && onClose) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
        {/* Nút đóng góc phải */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Đóng hộp thoại"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-(--admin-body)/50 hover:text-(--admin-title) hover:bg-(--admin-background) transition cursor-pointer disabled:opacity-40"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          {/* Icon nổi bật */}
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border ${currentConfig.iconBg}`}
          >
            <IconComponent size={24} />
          </div>

          {/* Nội dung tiêu đề & mô tả */}
          <div className="min-w-0 flex-1 pt-0.5">
            <h3
              id="confirm-modal-title"
              className="text-base font-bold text-(--admin-title) leading-snug"
            >
              {displayTitle}
            </h3>
            {content && (
              <div className="mt-2 text-sm text-(--admin-body)/80 leading-relaxed whitespace-pre-line">
                {content}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-(--admin-border)/60">
          <AdminButton
            type="button"
            variant="outline"
            size="md"
            disabled={loading}
            onClick={onClose}
          >
            {cancelText}
          </AdminButton>

          <AdminButton
            type="button"
            variant={currentConfig.variant}
            size="md"
            loading={loading}
            icon={type === 'danger' ? Trash2 : undefined}
            onClick={() => {
              if (onConfirm) onConfirm();
            }}
          >
            {displayConfirmText}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

