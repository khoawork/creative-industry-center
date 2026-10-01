import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export const HomeAPI = {
  getHomePage: async (pageIndex) => {
    const response = await axios.get(`${API_BASE_URL}/home/${pageIndex}`);
    return response.data;
  },

  // Bổ sung thêm hàm update để tương thích với phần lưu dữ liệu ở AdminHome ở trên
  updateHomePage: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/home/${id}`, data);
    return response.data;
  },
};