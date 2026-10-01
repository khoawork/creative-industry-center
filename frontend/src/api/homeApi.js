import axios from 'axios';
import { API_BASE_URL } from '../config/config.js';

export const HomeAPI = {
  getHomePage: async (pageIndex = 9) => {
    const response = await axios.get(`${API_BASE_URL}/home/${pageIndex}`);
    return response.data;
  },

  updateHomePage: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/home/${id}`, data);
    return response.data;
  },

  updateHeroSection: async (pageIndex, data) => {
    const response = await axios.put(`${API_BASE_URL}/home/hero/${pageIndex}`, data);
    return response.data;
  },

  updateAboutSection: async (pageIndex, data) => {
    const response = await axios.put(`${API_BASE_URL}/home/about/${pageIndex}`, data);
    return response.data;
  },

  updateSupportBanner: async (pageIndex, data) => {
    let page = pageIndex;
    let payload = data;
    // Hỗ trợ cả hai thứ tự tham số: chuẩn (pageIndex, data) hoặc cũ (data, pageIndex)
    if (typeof pageIndex === 'object' && pageIndex !== null) {
      payload = pageIndex;
      page = data;
    }
    const url = page
      ? `${API_BASE_URL}/home/support-banner/${page}`
      : `${API_BASE_URL}/home/support-banner`;
    const response = await axios.put(url, payload);
    return response.data;
  },

  createNav: async (pageIndex, data) => {
    const response = await axios.post(`${API_BASE_URL}/home/${pageIndex}/nav`, data);
    return response.data;
  },

  updateNav: async (pageId, navId, data) => {
    const response = await axios.put(
      `${API_BASE_URL}/home/${pageId}/nav/${navId}`,
      data
    );
    return response.data;
  },

  deleteNav: async (pageId, navId) => {
    const response = await axios.delete(`${API_BASE_URL}/home/${pageId}/nav/${navId}`);
    return response.data;
  },

  getNav: async (pageIndex, navId) => {
    const response = await axios.get(`${API_BASE_URL}/home/${pageIndex}/nav/${navId}`);
    return response.data;
  },

  getAllNavs: async (pageIndex) => {
    const response = await axios.get(`${API_BASE_URL}/home/${pageIndex}/nav/all`);
    return response.data;
  },

  addNavChildren: async (pageIndex, navId, data) => {
    const response = await axios.post(
      `${API_BASE_URL}/home/${pageIndex}/nav/${navId}/children`,
      data
    );
    return response.data;
  },

  deleteNavChildren: async (pageIndex, navId, data) => {
    const response = await axios.delete(
      `${API_BASE_URL}/home/${pageIndex}/nav/${navId}/children`,
      { data }
    );
    return response.data;
  },
};
