import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Sparkles, History, ArrowRight, Layers, Clock } from 'lucide-react';
import AdminStatCard from '../../components/Admin/AdminStatCard.jsx';
import AdminModuleCard from '../../components/Admin/AdminModuleCard.jsx';
import AdminRecentMessages from '../../components/Admin/AdminRecentMessages.jsx';
import { adminContentModules, adminItemsById, adminRoot } from '../../config/Admin/adminNavigation.js';
import { site } from '../../config/shared/site.js';
import { adminDemoUser } from '../../data/Admin/adminDashboardData.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { DashboardAPI } from '../../api/dashboardApi.js';
import { AdminPageHeader, AdminBadge, AdminCard } from '../../components/Admin/Common/index.js';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const res = await DashboardAPI.getStats();
        if (res?.success && res?.data) {
          setStats(res.data.stats || []);
          setRecentActivities(res.data.recentActivities || []);
          setRecentMessages(res.data.recentMessages || []);
          setUnreadCount(res.data.counts?.unreadMessages ?? 0);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu bảng điều khiển:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const displayName = user?.full_name || user?.username || adminDemoUser.name;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        badge="Không gian quản trị"
        title={`Chào mừng, ${displayName}`}
        subtitle={`Theo dõi nội dung, đề cử và các yêu cầu gửi đến ${site.name}.`}
        actions={
          <AdminBadge variant={user?.role === 'admin' ? 'primary' : 'accent'} icon={Sparkles}>
            Vai trò: {user?.role === 'admin' ? 'Quản trị viên (Admin)' : 'Quản lý (Manager)'}
          </AdminBadge>
        }
      />

      <section aria-label="Thống kê tổng quan hệ thống" className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-44 animate-pulse rounded-lg border border-(--admin-border) bg-(--admin-surface) p-5" />
          ))
        ) : (
          stats
            .filter((stat) => adminItemsById[stat.moduleId])
            .map((stat) => (
              <AdminStatCard
                key={stat.moduleId}
                item={adminItemsById[stat.moduleId]}
                label={stat.label}
                value={stat.value}
                detail={stat.detail}
              />
            ))
        )}
      </section>

      <div className="mt-8 grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* Cột trái: Quản lý nội dung các chuyên mục */}
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

        {/* Cột phải: Tin nhắn và Nhật ký hoạt động gần đây */}
        <div className="space-y-6 min-w-0">
          {/* Widget Nhật ký hoạt động mới nhất */}
          <AdminCard
            title="Nhật ký chỉnh sửa gần đây"
            actions={
              <Link
                to={`${adminRoot}/activities`}
                className="text-[11px] font-semibold text-(--admin-heading) hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight size={12} />
              </Link>
            }
            bodyClassName="p-4"
          >
            <div className="divide-y divide-(--admin-border)">
              {loading ? (
                <div className="py-4 text-center text-xs text-gray-500">Đang tải nhật ký...</div>
              ) : recentActivities.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-400">Chưa có bản ghi hoạt động nào.</div>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                    <div className="flex items-center justify-between text-gray-500 text-[11px] font-mono">
                      <span className="font-semibold text-(--admin-title)">{act.user_name}</span>
                      <span>{act.created_at ? new Date(act.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <div className="mt-1 text-(--admin-ink) font-medium text-[12px] line-clamp-2">
                      {act.summary}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="px-1.5 py-0.2 rounded bg-(--admin-background) border border-(--admin-border)">{act.module}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          <AdminRecentMessages messages={recentMessages} unreadCount={unreadCount} />
        </div>
      </div>
      <p className="mt-8 border-t border-(--admin-border) pt-5 text-[11px] leading-5 text-(--admin-ink)/60">Không gian quản trị nội dung · {site.name}</p>
    </div>
  );
}
