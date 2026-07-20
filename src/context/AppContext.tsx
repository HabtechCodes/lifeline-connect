import { createContext, useContext, type ReactNode } from "react";
import { DONORS, type Donor } from "@/lib/donors";

interface AppContextValue {
  donors: Donor[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  return <AppContext.Provider value={{ donors: DONORS }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
