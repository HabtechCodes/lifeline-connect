import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    import("@/lib/pwa-register").then((m) => {
      cleanup = m.registerPWA();
    });
    return () => cleanup?.();
  }, []);
  return null;
}
