import axios from 'axios';
import { setupAuthInterceptor } from './authInterceptor.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const userClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

setupAuthInterceptor(userClient);

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