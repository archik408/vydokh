# Vydokh

Mindful breathing and meditation web app — a calm 5–20 minute session with a pulsing orb, light/dark themes, and element color palettes.

## Features

- **Breathing modes:** deep diaphragmatic, box 4×4, and 4-7-8
- **Session length:** 5, 10, 15, or 20 minutes
- **Themes:** system-aware light/dark plus water / earth / sun / air accents
- **i18n:** Russian and English
- Technique notes with links to Cleveland Clinic, Harvard Health, NCCIH, and related sources

## Stack

Vite · Tailwind CSS v4 · Lucide · Workbox (vite-plugin-pwa) · vanilla JavaScript

## PWA

Production builds register a Workbox service worker with **Offline First** and **CacheFirst** for pages, assets, fonts, and images. After the first visit the app shell works offline.

Installable as a standalone app (manifest + icons).

## Develop

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm preview
```

`pnpm preview` serves the production build so you can verify the service worker.

## Author

[Artur Basak](https://arturbasak.dev)
