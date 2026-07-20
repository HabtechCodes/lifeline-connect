# LifeDrop — Blood Donor Finder PWA

A Progressive Web App that connects blood donors with recipients in real time. Built with TanStack Start (React 19 + Vite), Tailwind CSS v4, and browser Geolocation.

## Features

- **Donor registration** with health declaration, age gate (18–65), and consent
- **Search donors** by blood group, city, and sort by nearest (GPS) / recent / most reliable
- **Emergency mode** — one-click SOS filters top-10 nearest eligible donors and simulates an alert
- **Donor dashboard** with profile edit, donation logging, and eligibility (>90 days) tracking
- **QR code** for instant profile sharing (client-generated)
- **Admin/moderation** — verification badge toggle and "report fake donor" flow
- **Data persistence** — localStorage with JSON export/import backup
- **Blood stock alerts**, top-donor leaderboard, and WhatsApp share
- **Dark/light theme**, mobile-first responsive UI, English/French/Spanish language switch (stub)
- **PWA** — installable via `manifest.webmanifest` with red-themed icons

## Notable design choices

- Uses **TanStack Router** (file-based routing at `src/routes/`) instead of `react-router-dom`, matching the project template.
- Data lives in `localStorage`; a demo generator seeds 22 sample donors on first visit.
- Map integration (Leaflet) is intentionally omitted to keep the SSR bundle browser-safe; donor cards show distance in km when GPS is shared.
- Service-worker offline caching is disabled in Lovable's preview to avoid stale caches; installability (add-to-home-screen) works via the manifest.

## Scripts

```bash
bun install
bun dev       # start dev server
bun run build # production build
```

## Project structure

```
src/
  routes/       __root, index (home+search), register, dashboard, about
  components/   Nav, DonorCard, BloodBadge, EmergencyButton
  context/      AppContext (donors, prefs, geo)
  lib/          donors.ts (types, storage, demo data, distance)
public/         manifest.webmanifest, icon-192.png, icon-512.png
```
