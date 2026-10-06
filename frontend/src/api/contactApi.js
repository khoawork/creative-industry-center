import axios from 'axios'
import { API_BASE_URL } from '../config/config.js'

export const ContactAPI = {
  getPage: async (options = {}) => {
    const response = await axios.get(`${API_BASE_URL}/contact`, options)
    return response.data
  },
  updatePage: async (data, options = {}) => {
    const response = await axios.put(`${API_BASE_URL}/contact`, data, options)
    return response.data
  },
}

export function requireContactData(response) {
  const data = response?.data
  if (response?.success !== true || !data || typeof data !== 'object' || Array.isArray(data)
    || data.slug !== 'contact' || !data.props || typeof data.props !== 'object' || Array.isArray(data.props)) {
    throw new Error('Nội dung trang Liên hệ không hợp lệ. Vui lòng thử lại.')
  }
  return data
}

export function contactError(error) {
  return error.response?.data?.message || error.message || 'Không thể kết nối máy chủ.'
}

export function contactValidationErrors(error) {
  const errors = {}
  function collect(value, path) {
    if (typeof value === 'string') errors[path] = `${path}: ${value}`
    else if (Array.isArray(value) && value.every((item) => typeof item === 'string')) errors[path] = `${path}: ${value.join(' ')}`
    else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, item]) => collect(item, path ? `${path}.${key}` : key))
    }
  }
  if (error.response?.status === 422) collect(error.response.data?.error?.details, '')
  return errors
}
