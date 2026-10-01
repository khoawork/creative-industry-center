import axios from 'axios';
import { API_BASE_URL } from '../config/config.js';
import { INTRODUCE_PAGE_ID } from '../config/About/aboutConfig.js';

export const IntroduceAPI = {
  getIntroducePage: async (pageId = INTRODUCE_PAGE_ID, options = {}) => {
    const response = await axios.get(`${API_BASE_URL}/introduce/${pageId}`, options);
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
