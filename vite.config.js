import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    target: ['es2020', 'chrome87', 'safari14', 'ios14', 'edge88'],
    cssTarget: 'safari14',
  },
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons.svg',
        'original-icon-removebg-preview.png',
        'robots.txt',
        'llms.txt',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-512x512.png',
        'wake-silent.mp4',
        'wake-silent.webm',
      ],
      manifest: {
        id: '/',
        name: 'Vydokh',
        short_name: 'Vydokh',
        description:
          'Mindful breathing timer: diaphragmatic breathing, box 4×4, 4-7-8, and alternate nostril breathing.',
        theme_color: '#faf8f5',
        background_color: '#faf8f5',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        start_url: '/',
        scope: '/',
        lang: 'ru',
        dir: 'ltr',
        orientation: 'any',
        prefer_related_applications: false,
        categories: ['health', 'lifestyle', 'wellness'],
        launch_handler: {
          client_mode: ['navigate-existing', 'auto'],
        },
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/narrow-1.png',
            sizes: '636x1317',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Практика',
          },
          {
            src: 'screenshots/narrow-2.png',
            sizes: '636x1317',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Инструкция',
          },
          {
            src: 'screenshots/narrow-3.png',
            sizes: '636x1317',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Сессия',
          },
          {
            src: 'screenshots/wide-1.png',
            sizes: '3366x1720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Практика',
          },
          {
            src: 'screenshots/wide-2.png',
            sizes: '3366x1720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Инструкция',
          },
          {
            src: 'screenshots/wide-3.png',
            sizes: '3366x1720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Сессия',
          },
          {
            src: 'screenshots/wide-4.png',
            sizes: '3366x1720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Настройки',
          },
        ],
        shortcuts: [
          {
            name: 'Практика',
            short_name: 'Практика',
            description: 'Открыть таймер дыхания',
            url: '/',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Инструкция',
            short_name: 'Инструкция',
            description: 'Техники дыхания и подготовка',
            url: '/guide',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
      workbox: {
        // Offline-first app shell: precache build assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webmanifest,mp4,webm}'],
        // Install-prompt screenshots are not needed offline
        globIgnores: ['**/screenshots/**'],
        navigateFallback: '/index.html',
        // Keep Digital Asset Links (and similar) out of the SPA shell
        navigateFallbackDenylist: [/^\/api/, /^\/\.well-known\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // CacheFirst for everything fetched at runtime (fonts, images, static)
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              request.mode === 'navigate' && !url.pathname.startsWith('/.well-known/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'vydokh-pages',
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'worker',
            handler: 'CacheFirst',
            options: {
              cacheName: 'vydokh-assets',
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'image' || request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'vydokh-media',
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 8,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
