import axios from 'axios';
import { API_BASE_URL } from '../config/config.js';

const TRAINING_PAGE_URL = `${API_BASE_URL}/training-page`;

export const TrainingPageAPI = {
  getTrainingPage: async (pageId = 9) => {
    const response = await axios.get(`${TRAINING_PAGE_URL}/${pageId}`);
    return response.data;
  },

  updateTrainingPage: async (pageId = 9, data) => {
    const response = await axios.put(`${TRAINING_PAGE_URL}/${pageId}`, data);
    return response.data;
  },

  updateHeaderSection: async (pageId = 9, data) => {
    const response = await axios.put(`${TRAINING_PAGE_URL}/header/${pageId}`, data);
    return response.data;
  },

  updateProposalSection: async (pageId = 9, data) => {
    const response = await axios.put(`${TRAINING_PAGE_URL}/proposal/${pageId}`, data);
    return response.data;
  },

  updateSelectedTrainings: async (pageId = 9, trainingIds) => {
    const payload = Array.isArray(trainingIds) ? { training_ids: trainingIds } : trainingIds;
    const response = await axios.put(`${TRAINING_PAGE_URL}/selected-trainings/${pageId}`, payload);
    return response.data;
  },

  updateModelsSection: async (pageId = 9, models) => {
    const payload = Array.isArray(models) ? { models } : models;
    const response = await axios.put(`${TRAINING_PAGE_URL}/models/${pageId}`, payload);
    return response.data;
  },

  updateCertificationSection: async (pageId = 9, data) => {
    const response = await axios.put(`${TRAINING_PAGE_URL}/certification/${pageId}`, data);
    return response.data;
  },
};


