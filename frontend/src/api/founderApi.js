import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const FOUNDER_PAGE_URL = `${API_BASE_URL}/founder-page`;

const withResponseData = (response) => response.data;

export const FounderAPI = {
  getFounderPage: async () => {
    const response = await axios.get(`${FOUNDER_PAGE_URL}/`);
    return withResponseData(response);
  },

  createHero: async (data) => {
    const response = await axios.post(`${FOUNDER_PAGE_URL}/hero`, data);
    return withResponseData(response);
  },

  updateHero: async (data) => {
    const response = await axios.patch(`${FOUNDER_PAGE_URL}/hero`, data);
    return withResponseData(response);
  },

  createFounderSection: async (data) => {
    const response = await axios.post(`${FOUNDER_PAGE_URL}/sections`, data);
    return withResponseData(response);
  },

  updateFounderSection: async (sectionId, data) => {
    const response = await axios.patch(
      `${FOUNDER_PAGE_URL}/sections/${encodeURIComponent(sectionId)}`,
      data,
    );
    return withResponseData(response);
  },

  deleteFounderSection: async (sectionId) => {
    const response = await axios.delete(
      `${FOUNDER_PAGE_URL}/sections/${encodeURIComponent(sectionId)}`,
    );
    return withResponseData(response);
  },

  getFounderCta: async () => {
    const response = await axios.get(`${FOUNDER_PAGE_URL}/cta`);
    return withResponseData(response);
  },

  createFounderCta: async (data) => {
    const response = await axios.post(`${FOUNDER_PAGE_URL}/cta`, data);
    return withResponseData(response);
  },

  updateFounderCta: async (data) => {
    const response = await axios.patch(`${FOUNDER_PAGE_URL}/cta`, data);
    return withResponseData(response);
  },

  getFounderCertificates: async () => {
    const response = await axios.get(`${FOUNDER_PAGE_URL}/cta/certificates`);
    return withResponseData(response);
  },

  createFounderCertificate: async (data) => {
    const response = await axios.post(
      `${FOUNDER_PAGE_URL}/cta/certificates`,
      data,
    );
    return withResponseData(response);
  },

  updateFounderCertificate: async (certificateId, data) => {
    const response = await axios.patch(
      `${FOUNDER_PAGE_URL}/cta/certificates/${encodeURIComponent(certificateId)}`,
      data,
    );
    return withResponseData(response);
  },

  deleteFounderCertificate: async (certificateId) => {
    const response = await axios.delete(
      `${FOUNDER_PAGE_URL}/cta/certificates/${encodeURIComponent(certificateId)}`,
    );
    return withResponseData(response);
  },
};

export const FounderApi = FounderAPI;
