import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/home': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/events': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/projects': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/categories_project': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/pages': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})