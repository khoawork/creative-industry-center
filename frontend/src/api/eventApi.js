import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const EventAPI = {
	getEvents: async () => {
		const response = await axios.get(`${API_BASE_URL}/events`);
		return response.data;
	},

	getEvent: async (id) => {
		const response = await axios.get(`${API_BASE_URL}/events/events/${id}`);
		return response.data;
	},

	createEvent: async (data) => {
		const response = await axios.post(`${API_BASE_URL}/events`, data);
		return response.data;
	},

	updateEvent: async (id, data) => {
		const response = await axios.put(`${API_BASE_URL}/events/${id}`, data);
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
