import axios from 'axios';

import { API_BASE_URL } from '../config/config.js';

function eventPayload(data, imageFile, speakerImageFiles = []) {
	const files = Array.isArray(speakerImageFiles) ? speakerImageFiles : [];
	if (!imageFile && !files.some(Boolean)) return data;

	const payload = new FormData();
	payload.append('data', JSON.stringify(data));
	if (imageFile) payload.append('image', imageFile);
	files.forEach((file, index) => {
		if (file) payload.append(`speaker_image_${index}`, file);
	});
	return payload;
}

export const EventAPI = {
	getPage: async (pageIndex = 3, options = {}) => {
		const response = await axios.get(`${API_BASE_URL}/events/${pageIndex}`, options);
		return response.data;
	},

	updateHeroSection: async (pageId, data) => {
		const response = await axios.put(`${API_BASE_URL}/events/page/hero/${pageId}`, data);
		return response.data;
	},
	updateFilterSection: async (pageId, data) => {
		const response = await axios.put(`${API_BASE_URL}/events/page/filter/${pageId}`, data);
		return response.data;
	},
	updateDisplayedEvents: async (pageId, eventIds) => {
		const response = await axios.put(`${API_BASE_URL}/events/page/displayed-events/${pageId}`, { event_ids: eventIds });
		return response.data;
	},
	updateNewsletterSection: async (pageId, data) => {
		const response = await axios.put(`${API_BASE_URL}/events/page/newsletter/${pageId}`, data);
		return response.data;
	},
	getCategories: async (options = {}) => {
		const response = await axios.get(`${API_BASE_URL}/events/categories`, options);
		return response.data;
	},

	createCategory: async (data) => {
		const response = await axios.post(`${API_BASE_URL}/events/categories`, data);
		return response.data;
	},

	updateCategory: async (id, data) => {
		const response = await axios.put(`${API_BASE_URL}/events/categories/${id}`, data);
		return response.data;
	},

	deleteCategory: async (id) => {
		const response = await axios.delete(`${API_BASE_URL}/events/categories/${id}`);
		return response.data;
	},

	getEvents: async (options = {}) => {
		const response = await axios.get(`${API_BASE_URL}/events`, options);
		return response.data;
	},

	getEvent: async (id) => {
		const response = await axios.get(`${API_BASE_URL}/events/events/${id}`);
		return response.data;
	},

	createEvent: async (data, imageFile = null, speakerImageFiles = []) => {
		const payload = eventPayload(data, imageFile, speakerImageFiles);
		const response = await axios.post(`${API_BASE_URL}/events`, payload);
		return response.data;
	},

	updateEvent: async (id, data, imageFile = null, speakerImageFiles = []) => {
		const payload = eventPayload(data, imageFile, speakerImageFiles);
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

export function requireEventData(response, list = false) {
  const data = response?.data
  if (response?.success !== true || (list ? !Array.isArray(data) : !data || typeof data !== 'object' || Array.isArray(data))) {
    throw new Error('Dữ liệu Sự kiện không hợp lệ. Vui lòng thử lại.')
  }
  return data
}
export function eventError(error) {
  return error.response?.data?.message || error.message || 'Không thể kết nối máy chủ.'
}
export function validEventLink(value, optional = false) {
  if (!value) return optional
  if (/\s|\\/.test(value) || value.startsWith('//')) return false
  if (value.startsWith('/')) return true
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}
