import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@mui/icons-material': '@mui/icons-material/esm',
      '@mui/material': '@mui/material/esm'
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}']
      },
      manifest: {
        name: 'Stretch Easy - Smart Stretching Routines',
        short_name: 'Stretch Easy',
        description: 'AI-powered personalized warm-up and stretching routines',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        '@mui/icons-material',
        '@mui/icons-material/Home',
        '@mui/material'
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@mui/icons-material',
      '@mui/material'
    ],
    exclude: [
      '@mui/icons-material/Home'
    ]
  },
  server: {
    port: 3000,
    open: true
  }
})
