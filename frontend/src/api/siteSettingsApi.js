import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const SiteSettingsAPI = {
  getSiteSettings: async () => {
    const response = await axios.get(`${API_BASE_URL}/site-settings`);
    return response.data;
  },

  updateSiteSettings: async (data) => {
    const response = await axios.put(`${API_BASE_URL}/site-settings`, data);
    return response.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await axios.post(`${API_BASE_URL}/site-settings/upload-logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

