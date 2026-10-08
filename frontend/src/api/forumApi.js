import axios from 'axios';
import { API_BASE_URL } from '../config/config.js';

const FORUM_PAGE_URL = `${API_BASE_URL}/forum-page`;

export const ForumPageAPI = {
  getForumPage: async (pageId = 8) => {
    const response = await axios.get(`${FORUM_PAGE_URL}/${pageId}`);
    return response.data;
  },

  updateForumPage: async (pageId = 8, data) => {
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}`, data);
    return response.data;
  },

  updateHeader: async (pageId = 8, data) => {
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}/header`, data);
    return response.data;
  },

  updateHero: async (pageId = 8, data) => {
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}/hero`, data);
    return response.data;
  },

  updatePillars: async (pageId = 8, data) => {
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}/pillars`, data);
    return response.data;
  },

  updateSpeakers: async (pageId = 8, data) => {
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}/speakers`, data);
    return response.data;
  },

  updateAgenda: async (pageId = 8, data) => {
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}/agenda`, data);
    return response.data;
  },

  updateAwards: async (pageId = 8, data) => {
    const payload = Array.isArray(data) ? { award_ids: data } : data;
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}/awards`, payload);
    return response.data;
  },

  updatePartners: async (pageId = 8, data) => {
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}/partners`, data);
    return response.data;
  },

  updateRegistration: async (pageId = 8, data) => {
    const response = await axios.put(`${FORUM_PAGE_URL}/${pageId}/registration`, data);
    return response.data;
  },
};

export default ForumPageAPI;
