import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminRoot } from '../../config/Admin/adminNavigation.js';

export default function AdminNotFound() {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center p-6 text-center rounded-lg border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
      <FileQuestion size={40} strokeWidth={1.5} className="text-(--admin-heading)" aria-hidden="true" />
      <p className="mt-6 text-xs font-semibold tracking-widest text-(--admin-heading)">404</p>
      <h1 className="mt-3 text-2xl font-semibold">Không tìm thấy trang quản trị</h1>
      <p className="mt-3 max-w-md text-sm leading-6">Đường dẫn này không tồn tại. Chọn một chuyên mục trên menu hoặc trở về bảng điều khiển.</p>
      <Link to={adminRoot} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-(--admin-heading) hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)"><ArrowLeft size={16} aria-hidden="true" />Về bảng điều khiển</Link>
    </section>
  );
}
