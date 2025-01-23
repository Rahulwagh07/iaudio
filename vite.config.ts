import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['3f51-2409-4081-2e9d-cacc-7129-64b5-6ef8-c6f2.ngrok-free.app']
  },
})
