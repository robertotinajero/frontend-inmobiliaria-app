import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createHash } from 'crypto'

// Polyfill para evitar error de crypto.hash
if (!('hash' in crypto)) {
  crypto.hash = (input) => createHash('sha256').update(input).digest('hex')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3000', changeOrigin: true }, // <- clave
    },
  },
})
