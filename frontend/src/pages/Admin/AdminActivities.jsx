import React, { useState, useEffect, useCallback } from 'react';
import { 
  History, Filter, RefreshCw, ChevronLeft, ChevronRight,
  Shield, ShieldCheck, Eye, X, Calendar, Layers, Clock
} from 'lucide-react';
import { ActivityLogAPI } from '../../api/activityLogApi.js';
import { 
  AdminPageHeader, AdminButton, AdminCard, AdminBadge 
} from '../../components/Admin/Common/index.js';

export default function AdminActivities() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, total_pages: 1 });
  const [filters, setFilters] = useState({ module: 'ALL', action: 'ALL' });
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await ActivityLogAPI.getActivities({
        page,
        limit: pagination.limit,
        module: filters.module,
        action: filters.action,
      });
      const data = res?.data || {};
      setLogs(data.items || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 25,
        total: data.total || 0,
        total_pages: data.total_pages || 1,
      });
    } catch (error) {
      console.error('Lỗi khi tải nhật ký hoạt động:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'CREATE':
        return <AdminBadge variant="success">Tạo mới</AdminBadge>;
      case 'UPDATE':
        return <AdminBadge variant="warning">Cập nhật</AdminBadge>;
      case 'REORDER':
        return <AdminBadge variant="neutral">Đổi thứ tự</AdminBadge>;
      case 'TOGGLE_ACCESS':
        return <AdminBadge variant="accent">Phân quyền</AdminBadge>;
      case 'DELETE':
        return <AdminBadge variant="error">Xóa</AdminBadge>;
      default:
        return <AdminBadge variant="neutral">{action}</AdminBadge>;
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin' || role === 'administrator') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
          <ShieldCheck size={12} />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600">
        <Shield size={12} />
        Manager
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header khu vực quản trị */}
      <AdminPageHeader
        badge="Theo dõi & Kiểm soát"
        title="Nhật ký hoạt động (Audit Log)"
        subtitle="Ghi nhận toàn bộ lịch sử thêm mới, chỉnh sửa dữ liệu, sắp xếp menu và cập nhật quyền hạn trong hệ thống."
        actions={
          <AdminButton
            variant="secondary"
            icon={RefreshCw}
            loading={loading}
            onClick={() => fetchLogs(pagination.page)}
            title="Làm mới nhật ký"
          >
            Làm mới
          </AdminButton>
        }
      />

      {/* Bộ lọc Filter */}
      <div className="mt-6 flex flex-wrap items-center gap-3 p-4 border border-(--admin-border) bg-(--admin-surface) rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-(--admin-title)">
          <Filter size={14} className="text-(--admin-accent)" />
          <span>Bộ lọc:</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Khu vực:</label>
          <select
            value={filters.module}
            onChange={(e) => handleFilterChange('module', e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
          >
            <option value="ALL">Tất cả khu vực</option>
            <option value="Menu & Điều hướng">Menu &amp; Điều hướng</option>
            <option value="Tài khoản">Tài khoản &amp; Phân quyền</option>
            <option value="Sự kiện">Sự kiện</option>
            <option value="Bài viết">Bài viết</option>
            <option value="Kỷ lục">Kỷ lục</option>
            <option value="Dự án">Dự án</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Thao tác:</label>
          <select
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
          >
            <option value="ALL">Tất cả thao tác</option>
            <option value="CREATE">Tạo mới</option>
            <option value="UPDATE">Cập nhật dữ liệu</option>
            <option value="REORDER">Đổi thứ tự</option>
            <option value="TOGGLE_ACCESS">Phân quyền</option>
            <option value="DELETE">Xóa</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-gray-500 font-mono">
          Tổng cộng: <strong>{pagination.total}</strong> bản ghi
        </div>
      </div>

      {/* Bảng Nhật ký hoạt động */}
      <AdminCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-(--admin-border) bg-(--admin-background)/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-40">Thời gian</th>
                <th className="py-3.5 px-4 w-44">Người thực hiện</th>
                <th className="py-3.5 px-4 w-32">Thao tác</th>
                <th className="py-3.5 px-4 w-40">Khu vực</th>
                <th className="py-3.5 px-4">Tóm tắt nội dung thay đổi</th>
                <th className="py-3.5 px-4 w-24 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--admin-border)">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-500">
                    <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-(--admin-accent)" />
                    Đang tải nhật ký hoạt động...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-500">
                    Chưa có bản ghi hoạt động nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const hasDetails = log.changes && Object.keys(log.changes).length > 0;
                  return (
                    <tr key={log.id} className="hover:bg-(--admin-background)/40 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-500 whitespace-nowrap">
                        {log.created_at ? new Date(log.created_at).toLocaleString('vi-VN') : '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-xs text-(--admin-title)">
                          {log.user_name}
                        </div>
                        <div className="mt-0.5">
                          {getRoleBadge(log.user_role)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {getActionBadge(log.action)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                          <Layers size={13} className="text-gray-400" />
                          {log.module}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs text-(--admin-title) font-medium">
                          {log.summary}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {hasDetails ? (
                          <AdminButton
                            size="sm"
                            variant="secondary"
                            icon={Eye}
                            onClick={() => setSelectedLog(log)}
                            title="Xem chi tiết các trường thay đổi"
                          >
                            So sánh
                          </AdminButton>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-(--admin-border) bg-(--admin-background)/30 text-xs">
            <span className="text-gray-500">
              Trang <strong>{pagination.page}</strong> / <strong>{pagination.total_pages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <AdminButton
                size="sm"
                variant="outline"
                disabled={pagination.page <= 1}
                onClick={() => fetchLogs(pagination.page - 1)}
                icon={ChevronLeft}
              />
              <AdminButton
                size="sm"
                variant="outline"
                disabled={pagination.page >= pagination.total_pages}
                onClick={() => fetchLogs(pagination.page + 1)}
                icon={ChevronRight}
              />
            </div>
          </div>
        )}
      </AdminCard>

      {/* Modal Chi tiết So sánh Thay đổi (Trước vs Sau) */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-(--admin-surface) border border-(--admin-border) rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-(--admin-border)">
              <div className="flex items-center gap-2">
                <History size={18} className="text-(--admin-heading)" />
                <h3 className="text-base font-bold text-(--admin-title)">Chi tiết thay đổi dữ liệu</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-(--admin-background) border border-(--admin-border) text-xs">
                <div className="font-semibold text-(--admin-title)">{selectedLog.summary}</div>
                <div className="text-gray-500 mt-1 font-mono text-[11px]">
                  Bởi: <strong>{selectedLog.user_name}</strong> · Lúc: {new Date(selectedLog.created_at).toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="mt-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đối chiếu các trường thay đổi:</h4>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {Object.entries(selectedLog.changes || {}).map(([key, value]) => {
                    const isDiff = value && typeof value === 'object' && ('old' in value || 'new' in value);
                    if (isDiff) {
                      return (
                        <div key={key} className="p-3 rounded-lg border border-(--admin-border) bg-(--admin-background)/50 text-xs">
                          <div className="font-mono font-bold text-gray-600 mb-1.5">Trường: {key}</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-700 font-mono text-[11px] break-words">
                              <span className="font-bold block text-[10px] text-red-500 uppercase">Trước khi sửa:</span>
                              {String(value.old ?? 'None')}
                            </div>
                            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-mono text-[11px] break-words">
                              <span className="font-bold block text-[10px] text-emerald-500 uppercase">Sau khi sửa:</span>
                              {String(value.new ?? 'None')}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={key} className="p-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) font-mono text-xs">
                        <strong>{key}:</strong> {JSON.stringify(value)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 flex justify-end border-t border-(--admin-border)">
              <AdminButton
                variant="outline"
                onClick={() => setSelectedLog(null)}
              >
                Đóng
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

