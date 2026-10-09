import React, { useState, useEffect } from 'react';
import { 
  UsersRound, UserPlus, Shield, ShieldCheck, ShieldAlert,
  Check, AlertTriangle, RefreshCw, X, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserAPI } from '../../api/userApi.js';
import { 
  AdminPageHeader, AdminToast, AdminButton, AdminCard, 
  AdminBadge, AdminInput, AdminSelect 
} from '../../components/Admin/Common/index.js';

export default function AdminUsers() {
  const { user: currentUser, isAdmin, isManager } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // State Modal Tạo tài khoản
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'manager',
  });
  const [createLoading, setCreateLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserAPI.getUsers();
      const list = response?.data || [];
      setUsers(list);
    } catch (error) {
      console.error('Lỗi khi tải danh sách users:', error);
      showToast('Không thể tải danh sách tài khoản.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Nếu không phải Admin (ví dụ: Manager), chặn hiển thị nội dung
  if (!isAdmin) {
    return (
      <div className="p-8 text-center bg-(--admin-surface) border border-(--admin-border) rounded-2xl max-w-lg mx-auto my-12 shadow-sm">
        <ShieldAlert size={48} className="mx-auto text-amber-500 mb-3" />
        <h2 className="text-lg font-bold text-(--admin-title)">Khu vực giới hạn quyền truy cập</h2>
        <p className="text-sm text-gray-500 mt-2">
          Chức năng Quản lý tài khoản và Phân quyền chỉ dành riêng cho <strong>Admin</strong>. Tài khoản của bạn hiện tại không có quyền truy cập vào mục này.
        </p>
      </div>
    );
  }

  // Xử lý tạo tài khoản mới (Chỉ Admin)
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền tạo tài khoản.', 'error');
      return;
    }

    setCreateLoading(true);
    try {
      await UserAPI.createUser(createForm);
      showToast(`Tạo tài khoản "${createForm.username}" thành công!`);
      setIsCreateModalOpen(false);
      setCreateForm({ username: '', email: '', password: '', full_name: '', role: 'manager' });
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản.';
      showToast(msg, 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  // Bật/tắt quyền truy cập admin của user (Chỉ Admin)
  const handleToggleAdminAccess = async (targetUser) => {
    if (!isAdmin) {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền chỉnh sửa quyền hạn.', 'error');
      return;
    }

    try {
      const res = await UserAPI.toggleAdminAccess(targetUser.id);
      const updated = res?.data;
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, can_admin_access: updated.can_admin_access } : u))
      );
      showToast(res?.message || 'Cập nhật quyền thành công!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra.';
      showToast(msg, 'error');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin' || role === 'administrator') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">
          <ShieldCheck size={13} className="text-amber-600" />
          Admin (Toàn quyền)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 border border-blue-500/30">
        <Shield size={13} className="text-blue-600" />
        Manager (Quản lý)
      </span>
    );
  };

  // Hàm trích xuất an toàn giá trị nhập liệu (tránh lưu SyntheticEvent object)
  const handleInputChange = (field, eOrVal) => {
    const value = eOrVal && typeof eOrVal === 'object' && 'target' in eOrVal ? eOrVal.target.value : eOrVal;
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <AdminToast toast={toast ? { message: toast.message, error: toast.type === 'error' } : null} onClose={() => setToast(null)} />

      <AdminPageHeader
        badge="Hệ thống & Bảo mật"
        title="Tài khoản & Phân quyền"
        subtitle="Hệ thống gồm 2 vai trò quản trị: Admin (toàn quyền hệ thống & tạo tài khoản) và Manager (quản lý toàn bộ nội dung & hệ thống, trừ tạo tài khoản)."
        actions={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <AdminButton
                variant="primary"
                icon={UserPlus}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Thêm tài khoản mới
              </AdminButton>
            )}

            <AdminButton
              variant="secondary"
              icon={RefreshCw}
              loading={loading}
              onClick={fetchUsers}
              title="Làm mới danh sách"
            >
              Làm mới
            </AdminButton>
          </div>
        }
      />

      {/* Thông báo quyền hạn nếu là Manager */}
      {!isAdmin && (
        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 text-xs flex items-center gap-2">
          <Shield size={16} className="text-blue-600 shrink-0" />
          <span>Bạn đang đăng nhập với vai trò <strong>MANAGER</strong>. Bạn có toàn quyền quản trị nội dung website. Chức năng tạo tài khoản mới chỉ dành riêng cho <strong>Admin</strong>.</span>
        </div>
      )}

      {/* Bảng danh sách tài khoản */}
      <AdminCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-(--admin-border) bg-(--admin-background)/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">ID</th>
                <th className="py-3.5 px-4">Người dùng</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4 text-center">Quyền vào Admin</th>
                <th className="py-3.5 px-4 text-right">Lần đăng nhập cuối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--admin-border)">
              {users.map((u) => {
                const isMe = u.id === currentUser?.id;
                const canAccessAdmin = u.can_admin_access !== false;

                return (
                  <tr key={u.id} className="hover:bg-(--admin-background)/40 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-gray-400 font-semibold">
                      #{u.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-(--admin-title) flex items-center gap-1.5">
                          <span>{u.full_name || u.username}</span>
                          {isMe && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-(--admin-accent)/20 text-(--admin-heading) font-semibold">
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">
                          @{u.username} · {u.email}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Cột Bật/Tắt quyền vào Admin */}
                    <td className="py-3.5 px-4 text-center">
                      {isAdmin && !isMe ? (
                        <button
                          type="button"
                          onClick={() => handleToggleAdminAccess(u)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                            canAccessAdmin
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                          title="Bấm để bật/tắt quyền đăng nhập vào Admin"
                        >
                          {canAccessAdmin ? (
                            <>
                              <ShieldCheck size={13} className="text-emerald-600" />
                              <span>Được phép</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert size={13} className="text-red-600" />
                              <span>Đã chặn</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          canAccessAdmin ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                        }`}>
                          {canAccessAdmin ? 'Được phép' : 'Đã chặn'}
                        </span>
                      )}
                    </td>

                    {/* Lần đăng nhập cuối */}
                    <td className="py-3.5 px-4 text-right text-xs text-gray-500 font-mono">
                      {u.last_login_at ? (
                        new Date(u.last_login_at).toLocaleString('vi-VN')
                      ) : (
                        <span className="italic text-gray-400">Chưa đăng nhập</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Modal Tạo tài khoản mới (Chỉ dành cho Admin) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-(--admin-surface) border border-(--admin-border) rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-(--admin-border)">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-(--admin-heading)" />
                <h3 className="text-base font-bold text-(--admin-title)">Tạo tài khoản mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-(--admin-ink)/50 hover:text-(--admin-ink) p-1 rounded-md transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5">
              <AdminInput
                label="Tên đăng nhập (Username)"
                required
                value={createForm.username}
                onChange={(e) => handleInputChange('username', e)}
                placeholder="ví dụ: tran_manager"
              />

              <AdminInput
                label="Email"
                type="email"
                required
                value={createForm.email}
                onChange={(e) => handleInputChange('email', e)}
                placeholder="manager@vietkings.org"
              />

              <AdminInput
                label="Họ và tên"
                value={createForm.full_name}
                onChange={(e) => handleInputChange('full_name', e)}
                placeholder="Nguyễn Văn A"
              />

              <AdminInput
                label="Mật khẩu ban đầu"
                type="password"
                required
                value={createForm.password}
                onChange={(e) => handleInputChange('password', e)}
                placeholder="Tối thiểu 6 ký tự"
              />

              <AdminSelect
                label="Vai trò phân quyền"
                required
                value={createForm.role}
                onChange={(val) => handleInputChange('role', val)}
                options={[
                  { value: 'manager', label: 'Manager (Quản lý - Toàn quyền nội dung & hệ thống, trừ tạo tài khoản)' },
                  { value: 'admin', label: 'Admin (Quản trị viên - Toàn quyền hệ thống & tạo tài khoản)' },
                ]}
              />

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-(--admin-border)">
                <AdminButton
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Hủy
                </AdminButton>
                <AdminButton
                  type="submit"
                  variant="primary"
                  loading={createLoading}
                >
                  Tạo tài khoản
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
