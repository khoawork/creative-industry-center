import { LayoutGrid, Sparkles } from 'lucide-react';
import AdminStatCard from '../../components/Admin/AdminStatCard.jsx';
import AdminModuleCard from '../../components/Admin/AdminModuleCard.jsx';
import AdminRecentMessages from '../../components/Admin/AdminRecentMessages.jsx';
import { adminContentModules, adminItemsById } from '../../config/Admin/adminNavigation.js';
import { site } from '../../config/shared/site.js';
import { adminDemoUser, adminMessages, adminStats, adminUnreadCount } from '../../data/Admin/adminDashboardData.js';

export default function AdminDashboard() {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--admin-border) pb-7">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-(--admin-heading) uppercase">
            <span className="h-px w-6 bg-(--admin-accent)" />Không gian quản trị
          </p>
          <h1 className="text-2xl leading-tight font-semibold tracking-tight text-(--admin-title) sm:text-[30px]">
            {adminDemoUser.name ? `Chào mừng, ${adminDemoUser.name}` : 'Bảng điều khiển'}
          </h1>
          <p className="mt-3 text-sm leading-6">Theo dõi nội dung, đề cử và các yêu cầu gửi đến {site.name}.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-(--admin-accent) bg-(--admin-surface) px-3 py-1.5 text-[11px] font-medium text-(--admin-heading)">
          <Sparkles size={13} aria-hidden="true" />Dữ liệu minh họa
        </span>
      </div>

      <section aria-label="Thống kê tổng quan minh họa" className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {adminStats.map((stat) => <AdminStatCard key={stat.moduleId} item={adminItemsById[stat.moduleId]} label={stat.label} value={stat.value} detail={stat.detail} />)}
      </section>

      <div className="mt-8 grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <section aria-labelledby="admin-content-title" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="admin-content-title" className="flex items-center gap-2 text-lg font-semibold">
              <LayoutGrid size={19} strokeWidth={1.7} className="text-(--admin-heading)" aria-hidden="true" />Quản lý nội dung
            </h2>
            <span className="text-[11px] font-medium tracking-wide">{adminContentModules.length} chuyên mục</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {adminContentModules.map((item) => <AdminModuleCard key={item.id} item={item} />)}
          </div>
        </section>
        <div className="min-w-0">
          <AdminRecentMessages messages={adminMessages} unreadCount={adminUnreadCount} />
        </div>
      </div>
      <p className="mt-8 border-t border-(--admin-border) pt-5 text-[11px] leading-5">Không gian quản trị nội dung · {site.name}</p>
    </>
  );
}
