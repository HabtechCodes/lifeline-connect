import { registerSW } from "virtual:pwa-register";

function shouldRegister(): boolean {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
  if (!import.meta.env.PROD) return false;
  if (window.self !== window.top) return false;
  const h = location.hostname;
  if (h.startsWith("id-preview--") || h.startsWith("preview--")) return false;
  if (h === "lovableproject.com" || h.endsWith(".lovableproject.com")) return false;
  if (h === "lovableproject-dev.com" || h.endsWith(".lovableproject-dev.com")) return false;
  if (h === "beta.lovable.dev" || h.endsWith(".beta.lovable.dev")) return false;
  if (new URLSearchParams(location.search).get("sw") === "off") return false;
  return true;
}

async function unregisterStale() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs
      .filter((r) => r.scope.includes("/sw.js"))
      .map((r) => r.unregister()),
  );
}

export function registerPWA(): () => void {
  if (!shouldRegister()) {
    unregisterStale();
    return () => {};
  }

  return registerSW({
    immediate: true,
    onRegistered(r) {
      if (r) {
        console.log("[PWA] Service worker registered:", r.scope);
      }
    },
    onRegisterError(error) {
      console.error("[PWA] Service worker registration failed:", error);
    },
  });
}
