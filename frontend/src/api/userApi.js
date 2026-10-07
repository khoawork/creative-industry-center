import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const userClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

userClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const UserAPI = {
  getUsers: async () => {
    const response = await userClient.get('/users/');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await userClient.post('/users/', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await userClient.put(`/users/${id}`, userData);
    return response.data;
  },

  toggleAdminAccess: async (id) => {
    const response = await userClient.patch(`/users/${id}/toggle-admin-access`);
    return response.data;
  },
};