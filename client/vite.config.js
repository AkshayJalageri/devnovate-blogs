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
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  define: {
    __API_BASE_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? (import.meta.env.VITE_API_URL || 'https://devnovate-blogs-api.onrender.com')
        : 'http://localhost:5000'
    )
  }
})
