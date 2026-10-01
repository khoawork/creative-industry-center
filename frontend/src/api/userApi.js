import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const UserAPI = {
  getUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/user`);
    return response.data;
  },
};