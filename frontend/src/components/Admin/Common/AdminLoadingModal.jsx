import React from "react";
import { RefreshCw } from "lucide-react";

export default function AdminLoadingModal({
  show = false,
  title = "Đang xử lý dữ liệu...",
  subtitle = "Vui lòng chờ trong giây lát, không tắt trình duyệt",
}) {
  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xs sm:max-w-sm rounded-2xl border border-(--admin-border) bg-(--admin-surface) p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-(--admin-accent)/10 text-(--admin-accent)">
          <RefreshCw className="size-7 animate-spin" />
        </div>
        <h4 className="mt-4 text-sm font-bold text-(--admin-title)">
          {title}
        </h4>
        {subtitle && (
          <p className="mt-1 text-xs text-(--admin-body)/70 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

