// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      filename: "sw.js",
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        navigateFallback: "/index.html",
        navigateFallbackAllowlist: [/^\/(?!~oauth).*$/],
        runtimeCaching: [
          {
            urlPattern: /^\/$/,
            handler: "NetworkFirst",
            options: { cacheName: "home", expiration: { maxEntries: 1 } },
          },
          {
            urlPattern: /^\/about$/,
            handler: "NetworkFirst",
            options: { cacheName: "about", expiration: { maxEntries: 1 } },
          },
          {
            urlPattern: /^\/.*$/,
            handler: "NetworkFirst",
            options: { cacheName: "pages", expiration: { maxEntries: 10 } },
          },
          {
            urlPattern: /^\/assets\/.*$/,
            handler: "CacheFirst",
            options: { cacheName: "assets", expiration: { maxEntries: 50 } },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  tanstackStart: {
    server: { entry: "server" },
  },
});
