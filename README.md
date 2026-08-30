# Vydokh

Mindful breathing and meditation web app — a calm 5–20 minute session with a pulsing orb, light/dark themes, and element color palettes.

## Features

- **Breathing modes:** deep diaphragmatic, box 4×4, and 4-7-8
- **Session length:** 5, 10, 15, or 20 minutes
- **Themes:** system-aware light/dark plus water / earth / sun / air accents
- **i18n:** Russian and English (persisted in `localStorage`)
- **Guide page** (`/guide`): technique descriptions, app overview, and links to official sources (Cleveland Clinic, Harvard Health, NCCIH, PMC, and others)
- **Alternate nostril breathing (ANB):** documented in the guide; uses the same timer rhythm as deep breathing
- **Accessibility:** skip link, screen-reader phase cues, focus management, reduced-motion support
- **SEO:** meta tags, Open Graph, JSON-LD, `robots.txt`, `llms.txt`

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — timer, play/stop, breathing orb, session settings |
| `/guide` | Instructions — techniques, preparation tips, source links |

Client-side routing with animated transitions (View Transitions API; graceful fallback when unsupported).

## Stack

Vite · Tailwind CSS v4 · Lucide · Workbox (`vite-plugin-pwa`) · vanilla JavaScript

## Project structure

```
src/
  app.js          # state, routing, timer, theme/i18n, session logic
  views.js        # HTML templates (home, guide, shell)
  i18n.js         # locales and technique copy
  breathPhases.js # inhale/hold/exhale timings per mode
  storage.js      # safe localStorage wrapper
  compat.css      # fallbacks for older mobile browsers / WebView
  style.css       # themes, animations, layout
public/           # icons, PWA assets, robots.txt, llms.txt
```

## PWA

Production builds register a Workbox service worker with **Offline First** and **CacheFirst** for pages, assets, fonts, and images. After the first visit the app shell works offline.

Installable as a standalone app (manifest + icons).

## Browser support

Targets iOS Safari 14+, Chrome Android 100+, Samsung Internet 15+, Android 8+, and modern in-app WebViews. CSS and JS include fallbacks for older engines (no `color-mix`, no `dvh`, blocked `localStorage`, etc.).

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
