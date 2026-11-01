import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,          // expose on all network interfaces (LAN access for judges)
    port: 5173,
    strictPort: false,
    cors: true,
    headers: {
      // Allow all permissions in browser
      'Permissions-Policy': 'camera=*, microphone=*, geolocation=*, notifications=*, payment=*, fullscreen=*, clipboard-read=*, clipboard-write=*',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    }
  },
  preview: {
    host: true,
    port: 4173,
    cors: true,
    headers: {
      'Permissions-Policy': 'camera=*, microphone=*, geolocation=*, notifications=*, payment=*, fullscreen=*, clipboard-read=*, clipboard-write=*',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Access-Control-Allow-Origin': '*',
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
  }
})
