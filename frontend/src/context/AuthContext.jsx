import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthAPI } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo kiểm tra phiên đăng nhập từ cookie / token
  const checkAuth = useCallback(async () => {
    try {
      const response = await AuthAPI.getMe();
      if (response?.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const response = await AuthAPI.login(username, password);
    const userData = response?.data?.user;
    if (userData) {
      setUser(userData);
    }
    return response;
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      setUser(null);
    }
  };

  // Xác định các quyền hạn theo 2 Role: admin (Toàn quyền) và manager (Toàn quyền trừ tạo tài khoản)
  const role = user?.role || '';
  const isAuthenticated = Boolean(user);
  const isAdmin = role === 'admin' || role === 'administrator';
  const isManager = role === 'manager';

  // Chỉ DUY NHẤT Admin mới có quyền tạo tài khoản và phân quyền
  const canCreateUser = isAdmin;
  // Cả Admin và Manager đều có toàn quyền quản trị nội dung & hệ thống
  const canConfigureSystem = isAdmin || isManager;

  const value = {
    user,
    role,
    loading,
    isAuthenticated,
    isAdmin,
    isAdministrator: isAdmin,
    isManager,
    canCreateUser,
    canConfigureSystem,
    login,
    logout,
    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

