import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Tạo instance axios riêng hoặc dùng axios kèm withCredentials
const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Cho phép truyền và nhận HttpOnly Cookie
});

// Interceptor tự động thêm Bearer token từ localStorage nếu cookie bị giới hạn bởi domain
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthAPI = {
  login: async (username, password) => {
    const response = await authClient.post('/auth/login', { username, password });
    if (response.data?.data?.token) {
      localStorage.setItem('admin_token', response.data.data.token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await authClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('admin_token');
    }
  },

  getMe: async () => {
    const response = await authClient.get('/auth/me');
    return response.data;
  },
};

