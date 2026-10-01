import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const AwardAPI = {
	getAwards: async (params = {}) => {
		const response = await axios.get(`${API_BASE_URL}/api/awards`, { params });
		return response.data;
	},

	getAward: async (id) => {
		const response = await axios.get(`${API_BASE_URL}/api/awards/${id}`);
		return response.data;
	},

	createAward: async (data, imageFile = null) => {
		let payload = data;
		if (imageFile) {
			payload = new FormData();
			payload.append('data', JSON.stringify(data));
			payload.append('image', imageFile);
		}
		const response = await axios.post(`${API_BASE_URL}/api/awards`, payload);
		return response.data;
	},

	updateAward: async (id, data, imageFile = null) => {
		let payload = data;
		if (imageFile) {
			payload = new FormData();
			payload.append('data', JSON.stringify(data));
			payload.append('image', imageFile);
		}
		const response = await axios.put(`${API_BASE_URL}/api/awards/${id}`, payload);
		return response.data;
	},

	patchAward: async (id, data) => {
		const response = await axios.patch(`${API_BASE_URL}/api/awards/${id}`, data);
		return response.data;
	},

	deleteAward: async (id) => {
		const response = await axios.delete(`${API_BASE_URL}/api/awards/${id}`);
		return response.data;
	},
};
