import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { adminRoot } from "../../config/Admin/adminNavigation.js";
import { AdminPageHeader } from "../../components/Admin/Common/index.js";

export default function AdminModulePlaceholder({ item }) {
  const Icon = item.icon;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        badge="Khu vực quản trị"
        title={item.label}
        subtitle={item.description}
      />
      <section className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
        <span className="flex size-16 items-center justify-center rounded-xl bg-(--admin-background) text-(--admin-heading)">
          <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="mt-6 rounded-full bg-(--admin-accent) px-3 py-1 text-xs font-medium text-(--admin-black)">
          Đang chuẩn bị
        </span>
        <h2 className="mt-4 text-lg font-semibold">
          Giao diện quản lý đang được chuẩn bị
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6">
          Khu vực {item.label.toLocaleLowerCase("vi-VN")} sẽ được bổ sung trong
          bước tiếp theo. Bạn có thể quay lại bảng điều khiển để khám phá các
          chuyên mục.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link
            to={adminRoot}
            className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-(--admin-heading) hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Bảng điều khiển
          </Link>
          {item.publicPath && (
            <a
              href={item.publicPath}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Xem trang công khai (mở tab mới)"
              className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-(--admin-heading) hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)"
            >
              Xem trang công khai
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
