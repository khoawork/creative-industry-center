import React from "react";
import { Trophy } from "lucide-react";
import RecordAdminManager from "../../components/Admin/Record/RecordAdminManager.jsx";

export default function AdminRecordPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 animate-fade-in">
      <header className="rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs sm:p-8">
        <div className="flex items-start gap-3.5">
          <span className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-amber-400 shrink-0">
            <Trophy className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
              Nội dung website
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--admin-text)] sm:text-3xl">
              Quản trị Trang Đề cử Kỷ lục
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--admin-text-muted)]">
              Quản lý biểu ngữ header, quy chế pháp lý &amp; hội đồng, chọn hạng mục kỷ lục hiển thị, bảng vàng vinh danh và quy trình thẩm định công khai.
            </p>
          </div>
        </div>
      </header>

      <RecordAdminManager />
    </div>
  );
}
