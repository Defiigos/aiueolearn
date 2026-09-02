import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      VitePWA({
          registerType: 'autoUpdate',
          manifest: {
              name: 'aiueoLearn',
              short_name: 'aiueo',
              description: 'App about learning Japanese kana',
              theme_color: '#7c75f3',
              background_color: '#1e2028',
              display: 'standalone',
              icons: [
                  {
                      src: 'icon-192.png',
                      sizes: '192x192',
                      type: 'image/png',
                  },
                  {
                      src: 'icon-512.png',
                      sizes: '512x512',
                      type: 'image/png',
                  },
              ],
              screenshots: [
                  {
                      "src": "mobile_screenshot.png",
                      "sizes": "720x1280",
                      "type": "image/png",
                      "form_factor": "narrow",
                      "label": "Главный экран приложения"
                  },
                  {
                      "src": "desktop_screenshot.png",
                      "sizes": "1920x1080",
                      "type": "image/png",
                      "form_factor": "wide",
                      "label": "Главный экран приложения"
                  }
              ]
          },
      }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});