import axios from 'axios';
import { API_BASE_URL } from '../config/config.js';

const PROJECT_PAGE_URL = `${API_BASE_URL}/project-page`;

export const ProjectPageAPI = {
  getProjectPage: async (pageId = 5) => {
    const response = await axios.get(`${PROJECT_PAGE_URL}/${pageId}`);
    return response.data;
  },

  updateProjectPage: async (pageId = 5, data) => {
    const response = await axios.put(`${PROJECT_PAGE_URL}/${pageId}`, data);
    return response.data;
  },

  updateHeaderSection: async (pageId = 5, data) => {
    const response = await axios.put(`${PROJECT_PAGE_URL}/header/${pageId}`, data);
    return response.data;
  },

  updateProposalSection: async (pageId = 5, data) => {
    const response = await axios.put(`${PROJECT_PAGE_URL}/proposal/${pageId}`, data);
    return response.data;
  },

  updateSelectedProjects: async (pageId = 5, projectIds) => {
    const payload = Array.isArray(projectIds) ? { project_ids: projectIds } : projectIds;
    const response = await axios.put(`${PROJECT_PAGE_URL}/selected-projects/${pageId}`, payload);
    return response.data;
  },
};
