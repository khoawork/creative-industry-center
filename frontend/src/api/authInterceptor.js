import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Thực hiện gọi API làm mới token từ server
 */
export async function performTokenRefresh() {
  const refreshToken = localStorage.getItem('admin_refresh_token');
  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    { refresh_token: refreshToken || undefined },
    { withCredentials: true }
  );

  const data = response.data?.data;
  if (data?.token) {
    localStorage.setItem('admin_token', data.token);
  }
  if (data?.refresh_token) {
    localStorage.setItem('admin_refresh_token', data.refresh_token);
  }
  return data;
}

/**
 * Thiết lập Request & Response Interceptors cho bất kỳ axios instance nào
 */
export function setupAuthInterceptor(axiosInstance) {
  // 1. Request Interceptor: Tự động đính kèm Bearer token và withCredentials
  axiosInstance.interceptors.request.use(
    (config) => {
      config.withCredentials = true;
      const token = localStorage.getItem('admin_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 2. Response Interceptor: Tự động refresh token khi nhận 401 TOKEN_EXPIRED
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);

      const status = error.response?.status;
      const resData = error.response?.data;
      const errorCode =
        resData?.error?.code ||
        resData?.error_code ||
        resData?.code ||
        '';

      const url = String(originalRequest.url || '');

      // Tránh lặp vô hạn nếu chính request login hoặc refresh bị lỗi 401
      const isAuthEndpoint = url.includes('/auth/refresh') || url.includes('/auth/login');

      // Nhận diện lỗi hết hạn token (401 TOKEN_EXPIRED)
      const isTokenExpired =
        status === 401 &&
        (errorCode === 'TOKEN_EXPIRED' ||
          (typeof resData?.message === 'string' && resData.message.includes('hết hạn')));

      if (isTokenExpired && !originalRequest._retry && !isAuthEndpoint) {
        // Đã có tiến trình refresh đang chạy -> Đưa request vào hàng đợi
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResult = await performTokenRefresh();
          const newToken = refreshResult?.token;

          if (newToken) {
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } else {
            throw new Error('Không nhận được token mới từ hệ thống.');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Refresh thất bại (Refresh token cũng đã hết hạn) -> Xóa bỏ token và chuyển về trang đăng nhập nếu đang ở Admin
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_refresh_token');

          if (
            typeof window !== 'undefined' &&
            window.location.pathname.startsWith('/admin') &&
            !window.location.pathname.includes('/admin/login')
          ) {
            window.location.href = '/admin/login';
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

