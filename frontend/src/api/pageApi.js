import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const PageAPI = {
  createPage: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/pages/create`, data);
    return response.data;
  },

  getPages: async () => {
    const response = await axios.get(`${API_BASE_URL}/pages/`);
    return response.data;
  },

  getHeaderItems: async () => {
    const response = await axios.get(`${API_BASE_URL}/pages/header`);
    return response.data;
  },

  getPage: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/pages/${id}`);
    return response.data;
  },

  getPageBySlug: async (slug) => {
    const response = await axios.get(`${API_BASE_URL}/pages/slug/${slug}`);
    return response.data;
  },

  updatePage: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/pages/${id}`, data);
    return response.data;
  },

  deletePage: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/pages/${id}`);
    return response.data;
  },
};