import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://34.238.122.213:1337',
        changeOrigin: true,
        // Requests to /api/proyecto-56s will be proxied to http://34.238.122.213:1337/api/proyecto-56s
      }
    }
  }
})
