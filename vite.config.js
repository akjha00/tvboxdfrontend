import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    rollupOptions: {
      // external: ['axios'], // Uncomment only if you load axios via CDN
    },
  },
  darkMode: 'class',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tvboxdbackend.onrender.com', // Replace with your actual backend
        changeOrigin: true,
      },
    },
  },
})