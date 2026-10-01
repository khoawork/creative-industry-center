import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const UploadAPI = {
  uploadImage: async (file, folder = 'catalog') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const response = await axios.post(`${API_BASE_URL}/pages/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data?.url || response.data?.url;
  },
};
