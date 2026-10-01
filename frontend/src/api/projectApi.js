import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const ProjectAPI = {
	getProjects: async () => {
		const response = await axios.get(`${API_BASE_URL}/projects`);
        console.log('Fetched projects:', response.data);
		return response.data;
	},

	getProject: async (id) => {
		const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
		return response.data;
	},

	createProject: async (data) => {
		const response = await axios.post(`${API_BASE_URL}/projects`, data);
		return response.data;
	},

	updateProject: async (id, data) => {
		const response = await axios.put(`${API_BASE_URL}/projects/${id}`, data);
		return response.data;
	},

	updateProjectImage: async (id, imageUrl) => {
		const response = await axios.patch(`${API_BASE_URL}/projects/${id}/image`, {
			image_url: imageUrl,
		});
		return response.data;
	},

	deleteProject: async (id) => {
		const response = await axios.delete(`${API_BASE_URL}/projects/${id}`);
		return response.data;
	},

	getCategories: async () => {
		const response = await axios.get(`${API_BASE_URL}/categories_project`);
		return response.data;
	},

	createCategory: async (data) => {
		const response = await axios.post(`${API_BASE_URL}/categories_project`, data);
		return response.data;
	},
};
