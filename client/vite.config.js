import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Local dev backend
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    __API_BASE_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://devnovate-blogs-api.onrender.com' // Render backend
        : 'http://localhost:5000'
    )
  }
})
