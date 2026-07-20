import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  generateDemoDonors,
  loadDonors,
  saveDonors,
  type Donor,
} from "@/lib/donors";

type Lang = "en" | "fr" | "es";

interface AppContextValue {
  donors: Donor[];
  addDonor: (d: Donor) => void;
  updateDonor: (id: string, patch: Partial<Donor>) => void;
  removeDonor: (id: string) => void;
  reportDonor: (id: string) => void;
  toggleVerified: (id: string) => void;
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
  currentUser: Donor | null;
  dark: boolean;
  toggleDark: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  geo: { lat: number; lng: number } | null;
  requestGeo: () => Promise<{ lat: number; lng: number } | null>;
  exportJson: () => string;
  importJson: (json: string) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    let d = loadDonors();
    if (d.length === 0) {
      d = generateDemoDonors();
      saveDonors(d);
    }
    setDonors(d);
    const cu = localStorage.getItem("lifedrop.currentUser");
    if (cu) setCurrentUserId(cu);
    const th = localStorage.getItem("lifedrop.dark");
    if (th === "1") setDark(true);
    const lg = localStorage.getItem("lifedrop.lang") as Lang | null;
    if (lg) setLang(lg);
  }, []);

  useEffect(() => {
    if (donors.length) saveDonors(donors);
  }, [donors]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("lifedrop.dark", dark ? "1" : "0");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("lifedrop.lang", lang);
  }, [lang]);

  useEffect(() => {
    if (currentUserId) localStorage.setItem("lifedrop.currentUser", currentUserId);
    else localStorage.removeItem("lifedrop.currentUser");
  }, [currentUserId]);

  const addDonor = useCallback((d: Donor) => setDonors((prev) => [d, ...prev]), []);
  const updateDonor = useCallback(
    (id: string, patch: Partial<Donor>) =>
      setDonors((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d))),
    [],
  );
  const removeDonor = useCallback(
    (id: string) => setDonors((prev) => prev.filter((d) => d.id !== id)),
    [],
  );
  const reportDonor = useCallback(
    (id: string) =>
      setDonors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, reports: d.reports + 1 } : d)),
      ),
    [],
  );
  const toggleVerified = useCallback(
    (id: string) =>
      setDonors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, verified: !d.verified } : d)),
      ),
    [],
  );

  const requestGeo = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return null;
    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const g = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setGeo(g);
          resolve(g);
        },
        () => resolve(null),
        { timeout: 8000 },
      );
    });
  }, []);

  const exportJson = useCallback(() => JSON.stringify(donors, null, 2), [donors]);
  const importJson = useCallback((json: string) => {
    const arr = JSON.parse(json) as Donor[];
    if (Array.isArray(arr)) setDonors(arr);
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = generateDemoDonors();
    setDonors(fresh);
    saveDonors(fresh);
  }, []);

  const currentUser = useMemo(
    () => donors.find((d) => d.id === currentUserId) ?? null,
    [donors, currentUserId],
  );

  const value: AppContextValue = {
    donors,
    addDonor,
    updateDonor,
    removeDonor,
    reportDonor,
    toggleVerified,
    currentUserId,
    setCurrentUserId,
    currentUser,
    dark,
    toggleDark: () => setDark((v) => !v),
    lang,
    setLang,
    geo,
    requestGeo,
    exportJson,
    importJson,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
