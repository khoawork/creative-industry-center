import axios from 'axios';
import { setupAuthInterceptor } from './authInterceptor.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const dashboardClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

setupAuthInterceptor(dashboardClient);

export const DashboardAPI = {
  getStats: async () => {
    const response = await dashboardClient.get('/dashboard/stats');
    return response.data;
  },

  getSubmissions: async ({ form_id, limit = 100, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (form_id) params.append('form_id', form_id);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);

    const response = await dashboardClient.get(`/forms/submissions?${params.toString()}`);
    return response.data;
  },

  markSubmissionRead: async (id, isRead = true) => {
    const response = await dashboardClient.put(`/forms/submissions/${id}/read`, { is_read: isRead });
    return response.data;
  },
};

