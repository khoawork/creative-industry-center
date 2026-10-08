import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const activityClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

activityClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ActivityLogAPI = {
  getActivities: async ({ page = 1, limit = 30, module, action } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (module && module !== 'ALL') params.append('module', module);
    if (action && action !== 'ALL') params.append('action', action);

    const response = await activityClient.get(`/activities/?${params.toString()}`);
    return response.data;
  },
};

