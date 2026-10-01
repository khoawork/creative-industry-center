import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const EventAPI = {
	getCategories: async () => {
		const response = await axios.get(`${API_BASE_URL}/events/categories`);
		return response.data;
	},

	createCategory: async (data) => {
		const response = await axios.post(`${API_BASE_URL}/events/categories`, data);
		return response.data;
	},

	getEvents: async () => {
		const response = await axios.get(`${API_BASE_URL}/events`);
		return response.data;
	},

	getEvent: async (id) => {
		const response = await axios.get(`${API_BASE_URL}/events/events/${id}`);
		return response.data;
	},

	createEvent: async (data, imageFile = null) => {
		let payload = data;
		if (imageFile) {
			payload = new FormData();
			payload.append('data', JSON.stringify(data));
			payload.append('image', imageFile);
		}
		const response = await axios.post(`${API_BASE_URL}/events`, payload);
		return response.data;
	},

	updateEvent: async (id, data, imageFile = null) => {
		let payload = data;
		if (imageFile) {
			payload = new FormData();
			payload.append('data', JSON.stringify(data));
			payload.append('image', imageFile);
		}
		const response = await axios.put(`${API_BASE_URL}/events/${id}`, payload);
		return response.data;
	},

	updateEventStatus: async (id, status) => {
		const response = await axios.patch(`${API_BASE_URL}/events/${id}/status`, { status });
		return response.data;
	},

	deleteEvent: async (id) => {
		const response = await axios.delete(`${API_BASE_URL}/events/${id}`);
		return response.data;
	},
};
