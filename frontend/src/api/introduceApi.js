import axios from 'axios';
import { API_BASE_URL } from '../config/config.js';

export const IntroduceAPI = {
  getIntroducePage: async (pageIndex = 2, options = {}) => {
    const response = await axios.get(`${API_BASE_URL}/introduce/${pageIndex}`, options);
    return response.data;
  },

  updateHeroSection: async (pageId, data, options = {}) => {
    const response = await axios.put(`${API_BASE_URL}/introduce/hero/${pageId}`, data, options);
    return response.data;
  },

  updateOverviewSection: async (pageId, data, options = {}) => {
    const response = await axios.put(`${API_BASE_URL}/introduce/overview/${pageId}`, data, options);
    return response.data;
  },

  updateVisionSection: async (pageId, data, options = {}) => {
    const response = await axios.put(`${API_BASE_URL}/introduce/vision/${pageId}`, data, options);
    return response.data;
  },

  updateMissionSection: async (pageId, data, options = {}) => {
    const response = await axios.put(`${API_BASE_URL}/introduce/mission/${pageId}`, data, options);
    return response.data;
  },

  updateCoreValuesSection: async (pageId, data, options = {}) => {
    const response = await axios.put(`${API_BASE_URL}/introduce/core-values/${pageId}`, data, options);
    return response.data;
  },

  updateActionsSection: async (pageId, data, options = {}) => {
    const response = await axios.put(`${API_BASE_URL}/introduce/actions/${pageId}`, data, options);
    return response.data;
  },
};
