import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import './main.css'
import App from './App.jsx'

// Cấu hình Axios toàn cục: luôn gửi Cookie & Bearer token từ Admin
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>

  </StrictMode>,
)
