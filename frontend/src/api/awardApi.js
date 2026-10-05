import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const AWARD_PAGE_URL = `${API_BASE_URL}/award-page`;

export const AwardAPI = {
  getAwardPage: async () => {
    const response = await axios.get(AWARD_PAGE_URL);
    return response.data;
  },

  getAwardHeader: async () => {
    const response = await axios.get(`${AWARD_PAGE_URL}/header`);
    return response.data;
  },

  updateAwardHeader: async (data) => {
    const response = await axios.patch(`${AWARD_PAGE_URL}/header`, data);
    return response.data;
  },

  updateAwardSelection: async (awardIds) => {
    const response = await axios.patch(`${AWARD_PAGE_URL}/list-card`, {
      award_ids: awardIds,
    });
    return response.data;
  },

  getHonorBoard: async () => {
    const response = await axios.get(`${AWARD_PAGE_URL}/latest-honor-board`);
    return response.data;
  },

  createHonorBoard: async (data) => {
    const response = await axios.post(
      `${AWARD_PAGE_URL}/latest-honor-board`,
      data,
    );
    return response.data;
  },

  updateHonorBoard: async (id, data) => {
    const response = await axios.patch(
      `${AWARD_PAGE_URL}/latest-honor-board/${encodeURIComponent(id)}`,
      data,
    );
    return response.data;
  },

  deleteHonorBoard: async (id) => {
    const response = await axios.delete(
      `${AWARD_PAGE_URL}/latest-honor-board/${encodeURIComponent(id)}`,
    );
    return response.data;
  },

  getAwards: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/awards`, { params });
    return response.data;
  },

  getAward: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/awards/${id}`);
    return response.data;
  },

  createAward: async (data, imageFile = null) => {
    let payload = data;
    if (imageFile) {
      payload = new FormData();
      payload.append("data", JSON.stringify(data));
      payload.append("image", imageFile);
    }
    const response = await axios.post(`${API_BASE_URL}/awards`, payload);
    return response.data;
  },

  updateAward: async (id, data, imageFile = null) => {
    let payload = data;
    if (imageFile) {
      payload = new FormData();
      payload.append("data", JSON.stringify(data));
      payload.append("image", imageFile);
    }
    const response = await axios.put(`${API_BASE_URL}/awards/${id}`, payload);
    return response.data;
  },

  patchAward: async (id, data) => {
    const response = await axios.patch(`${API_BASE_URL}/awards/${id}`, data);
    return response.data;
  },

  deleteAward: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/awards/${id}`);
    return response.data;
  },
};
