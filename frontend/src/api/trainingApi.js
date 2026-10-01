import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const TrainingAPI = {
	getTrainings: async (params = {}) => {
		const response = await axios.get(`${API_BASE_URL}/trainings`, { params });
		return response.data;
	},

	getTraining: async (id) => {
		const response = await axios.get(`${API_BASE_URL}/trainings/${id}`);
		return response.data;
	},

	createTraining: async (data) => {
		const response = await axios.post(`${API_BASE_URL}/trainings`, data);
		return response.data;
	},

	updateTraining: async (id, data) => {
		const response = await axios.put(`${API_BASE_URL}/trainings/${id}`, data);
		return response.data;
	},

	patchTraining: async (id, data) => {
		const response = await axios.patch(`${API_BASE_URL}/trainings/${id}`, data);
		return response.data;
	},

	deleteTraining: async (id) => {
		const response = await axios.delete(`${API_BASE_URL}/trainings/${id}`);
		return response.data;
	},
};
