import React from 'react';
import { Check, AlertTriangle, Info, X } from 'lucide-react';

export default function AdminToast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex max-w-md items-center gap-2.5 rounded-xl border border-(--admin-border) bg-(--admin-surface) px-4 py-3 text-xs shadow-xl transition-all animate-in slide-in-from-bottom-2 duration-200"
    >
      {isError ? (
        <AlertTriangle className="size-4.5 text-red-500 shrink-0" />
      ) : isInfo ? (
        <Info className="size-4.5 text-blue-500 shrink-0" />
      ) : (
        <Check className="size-4.5 text-emerald-500 shrink-0" />
      )}

      <span className="font-semibold text-(--admin-title) flex-1 leading-5">
        {toast.message}
      </span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md cursor-pointer ml-1"
          aria-label="Đóng thông báo"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

