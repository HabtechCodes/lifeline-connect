# BloodMatch — Blood Group Matcher PWA

A simple Progressive Web App that helps users find compatible blood donors by matching blood groups. Built with TanStack Start (React 19 + Vite), Tailwind CSS v4, and `vite-plugin-pwa` for offline support.

## Features

- **Blood group selection** — choose your blood group from all 8 major types
- **Compatibility matching** — shows universal donors (O-), same-group donors, and other compatible types based on ABO/Rh rules
- **Match indicator** — each donor shows a compatibility label and percentage
- **Quick filters** — filter by donor blood group, city, or search by name
- **Pre-populated donor list** — 24 sample donors ready to use, no registration required
- **PWA** — installable via `manifest.webmanifest` with a red blood-drop icon and offline support via a generated service worker

## Pages

- **Home** — select your blood group, filter donors, and view matches
- **About** — emergency numbers and FAQ

## Design

- Clean, medical-app aesthetic
- Primary color: red (`#E53935`)
- Mobile-first responsive layout with soft card shadows

## Scripts

```bash
bun install
bun dev       # start dev server
bun run build # production build
```

## Project structure

```
src/
  routes/       __root, index (home), about
  components/   Nav, DonorCard, BloodBadge, PWARegister
  context/      AppContext (pre-populated donor list)
  lib/          donors.ts (static data), match.ts (compatibility logic), pwa-register.ts (guarded SW registration)
public/         manifest.webmanifest, icon-192.png, icon-512.png, sw.js (generated at build)
```

## Notes

- The service worker is only registered in production, never in the Lovable preview or dev server.
- Add `?sw=off` to the URL to unregister the service worker if needed.
