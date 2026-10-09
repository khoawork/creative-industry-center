import axios from 'axios';
import { setupAuthInterceptor, performTokenRefresh } from './authInterceptor.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Tạo instance axios riêng cho Auth
const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Gắn interceptor tự động retry và refresh token
setupAuthInterceptor(authClient);

export const AuthAPI = {
  login: async (username, password) => {
    const response = await authClient.post('/auth/login', { username, password });
    const payload = response.data?.data;
    if (payload?.token) {
      localStorage.setItem('admin_token', payload.token);
    }
    if (payload?.refresh_token) {
      localStorage.setItem('admin_refresh_token', payload.refresh_token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await authClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
    }
  },

  refreshToken: async () => {
    return performTokenRefresh();
  },

  getMe: async () => {
    const response = await authClient.get('/auth/me');
    return response.data;
  },
};
