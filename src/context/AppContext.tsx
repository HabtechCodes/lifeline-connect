import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { loadDonors, saveDonors, type BloodGroup, type Donor } from "@/lib/donors";

interface AppContextValue {
  donors: Donor[];
  addDonor: (input: { name: string; bloodGroup: BloodGroup; phone: string; city: string }) => Donor;
  deleteDonor: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    setDonors(loadDonors());
  }, []);

  const addDonor: AppContextValue["addDonor"] = useCallback((input) => {
    const donor: Donor = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()) + Math.random().toString(36).slice(2),
      name: input.name.trim(),
      bloodGroup: input.bloodGroup,
      phone: input.phone.trim(),
      city: input.city.trim(),
      createdAt: new Date().toISOString(),
    };
    setDonors((prev) => {
      const next = [donor, ...prev];
      saveDonors(next);
      return next;
    });
    return donor;
  }, []);

  const deleteDonor = useCallback((id: string) => {
    setDonors((prev) => {
      const next = prev.filter((d) => d.id !== id);
      saveDonors(next);
      return next;
    });
  }, []);

  return <AppContext.Provider value={{ donors, addDonor, deleteDonor }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
