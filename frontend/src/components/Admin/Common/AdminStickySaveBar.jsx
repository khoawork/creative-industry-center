import React from 'react';
import { Save, Check } from 'lucide-react';
import AdminButton from './AdminButton.jsx';

/**
 * Thanh hành động lưu cố định ở footer (Sticky Bottom Bar).
 * Hiển thị nổi bật với viền, bóng đổ và nền mờ (backdrop-blur) khi cuộn trang xuống dưới.
 * Đồng bộ trạng thái và phong cách thiết kế với nút lưu ở Header.
 */
export default function AdminStickySaveBar({
  isSaving = false,
  saveSuccess = false,
  successMessage = 'Đã lưu thay đổi thành công!',
  hintMessage = 'Nhấn lưu để đồng bộ dữ liệu ra ngoài website.',
  buttonText = 'Lưu thay đổi',
  savingText = 'Đang lưu…',
  onSave,
  type = 'submit',
  form,
  disabled = false,
  extraActions = null,
  className = '',
}) {
  return (
    <div
      className={`sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-(--admin-border) bg-(--admin-surface)/95 p-4 shadow-lg backdrop-blur-md transition-all ${className}`}
    >
      <div className="min-w-0 pr-4">
        {saveSuccess ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <Check size={16} className="shrink-0" />
            <span className="truncate">{successMessage}</span>
          </span>
        ) : (
          <span className="text-xs text-(--admin-ink)/60 line-clamp-1">
            {hintMessage}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {extraActions}
        <AdminButton
          type={type}
          form={form}
          variant="primary"
          size="md"
          icon={saveSuccess ? Check : Save}
          loading={isSaving}
          disabled={disabled || isSaving}
          onClick={onSave}
        >
          {isSaving ? savingText : buttonText}
        </AdminButton>
      </div>
    </div>
  );
}

