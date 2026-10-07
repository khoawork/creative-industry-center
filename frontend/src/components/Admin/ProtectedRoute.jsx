import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminLoading from './AdminLoading.jsx';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AdminLoading />;
  }

  if (!isAuthenticated) {
    // Lưu lại URL đang cố truy cập để sau khi đăng nhập xong tự động quay lại
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

