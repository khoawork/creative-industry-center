import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const RecordAPI = {
  getHeader: async () => {
    const response = await axios.get(`${API_BASE_URL}/records/header`);
    return response.data;
  },

  updateHeader: async (data) => {
    const response = await axios.patch(`${API_BASE_URL}/records/header`, data);
    return response.data;
  },

  getGovernance: async () => {
    const response = await axios.get(`${API_BASE_URL}/records/governance`);
    return response.data;
  },

  updateGovernance: async (data) => {
    const response = await axios.patch(
      `${API_BASE_URL}/records/governance`,
      data,
    );
    return response.data;
  },

  getCtaList: async () => {
    const response = await axios.get(`${API_BASE_URL}/records/governance/cta`);
    return response.data;
  },

  updateCtaList: async (data) => {
    const response = await axios.put(
      `${API_BASE_URL}/records/governance/cta`,
      data,
    );
    return response.data;
  },

  getRoles: async (ctaId) => {
    const response = await axios.get(
      `${API_BASE_URL}/records/governance/cta/${ctaId}/roles`,
    );
    return response.data;
  },

  createRole: async (ctaId, data) => {
    const response = await axios.post(
      `${API_BASE_URL}/records/governance/cta/${ctaId}/roles`,
      data,
    );
    return response.data;
  },

  getRole: async (ctaId, roleId) => {
    const response = await axios.get(
      `${API_BASE_URL}/records/governance/cta/${ctaId}/roles/${roleId}`,
    );
    return response.data;
  },

  updateRole: async (ctaId, roleId, data) => {
    const response = await axios.patch(
      `${API_BASE_URL}/records/governance/cta/${ctaId}/roles/${roleId}`,
      data,
    );
    return response.data;
  },

  deleteRole: async (ctaId, roleId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/records/governance/cta/${ctaId}/roles/${roleId}`,
    );
    return response.data;
  },

  getRecords: async () => {
    const response = await axios.get(`${API_BASE_URL}/records/items`);
    return response.data;
  },

  createRecord: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/records/items`, data);
    return response.data;
  },

  getRecord: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/records/items/${id}`);
    return response.data;
  },

  updateRecord: async (id, data) => {
    const response = await axios.patch(
      `${API_BASE_URL}/records/items/${id}`,
      data,
    );
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/records/items/${id}`);
    return response.data;
  },

  getHonorRolls: async () => {
    const response = await axios.get(`${API_BASE_URL}/records/honor-rolls`);
    return response.data;
  },

  createHonorRoll: async (data) => {
    const response = await axios.post(
      `${API_BASE_URL}/records/honor-rolls`,
      data,
    );
    return response.data;
  },

  getHonorRoll: async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/records/honor-rolls/${id}`,
    );
    return response.data;
  },

  updateHonorRoll: async (id, data) => {
    const response = await axios.patch(
      `${API_BASE_URL}/records/honor-rolls/${id}`,
      data,
    );
    return response.data;
  },

  deleteHonorRoll: async (id) => {
    const response = await axios.delete(
      `${API_BASE_URL}/records/honor-rolls/${id}`,
    );
    return response.data;
  },

  getProcess: async () => {
    const response = await axios.get(`${API_BASE_URL}/records/process`);
    return response.data;
  },

  updateProcess: async (data) => {
    const response = await axios.patch(`${API_BASE_URL}/records/process`, data);
    return response.data;
  },

  getPageBySlug: async (slug = "records") => {
    const response = await axios.get(`${API_BASE_URL}/pages/slug/${slug}`);
    return response.data;
  },

  updatePageProps: async (pageId, props) => {
    const response = await axios.put(`${API_BASE_URL}/pages/${pageId}`, { props });
    return response.data;
  },
};
