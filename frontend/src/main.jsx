import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import './main.css';
import App from './App.jsx';
import { setupAuthInterceptor } from './api/authInterceptor.js';

// Cấu hình Axios toàn cục: tự động đính kèm Token, Cookie và tự động Refresh Token khi hết hạn
setupAuthInterceptor(axios);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
