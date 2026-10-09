import axios from 'axios';
import { setupAuthInterceptor } from './authInterceptor.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const activityClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

setupAuthInterceptor(activityClient);

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
