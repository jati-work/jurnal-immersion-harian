import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mainichi Daily Immersion',
        short_name: 'Mainichi',
        description: 'Jurnal immersion kosakata bahasa Jepang harian',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f7f0',
        theme_color: '#4a7c59',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ]
      }
    })
  ],
})
