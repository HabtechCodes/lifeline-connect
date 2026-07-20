export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  city: string;
  age: number;
  lastDonation?: string; // ISO date
  emergencyContact?: string;
  lat?: number;
  lng?: number;
  verified: boolean;
  hidePhone: boolean;
  donationsCount: number;
  createdAt: string;
  reports: number;
  healthOk: boolean;
  consent: boolean;
}

const KEY = "lifedrop.donors.v1";

export function loadDonors(): Donor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Donor[];
  } catch {
    return [];
  }
}

export function saveDonors(donors: Donor[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(donors));
}

export function isEligible(d: Donor): boolean {
  if (!d.lastDonation) return true;
  const days = (Date.now() - new Date(d.lastDonation).getTime()) / 86400000;
  return days >= 90;
}

export function daysSince(iso?: string): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export const BLOOD_COLORS: Record<BloodGroup, string> = {
  "A+": "oklch(0.58 0.22 27)",
  "A-": "oklch(0.5 0.2 20)",
  "B+": "oklch(0.55 0.18 300)",
  "B-": "oklch(0.45 0.16 300)",
  "AB+": "oklch(0.5 0.2 340)",
  "AB-": "oklch(0.42 0.18 340)",
  "O+": "oklch(0.55 0.2 60)",
  "O-": "oklch(0.35 0.05 260)",
};

// Demo data generator
const CITIES = ["Paris", "Lyon", "Marseille", "Nice", "Toulouse", "Bordeaux", "Lille", "Nantes"];
const CITY_COORDS: Record<string, [number, number]> = {
  Paris: [48.8566, 2.3522],
  Lyon: [45.764, 4.8357],
  Marseille: [43.2965, 5.3698],
  Nice: [43.7102, 7.262],
  Toulouse: [43.6047, 1.4442],
  Bordeaux: [44.8378, -0.5792],
  Lille: [50.6292, 3.0573],
  Nantes: [47.2184, -1.5536],
};
const NAMES = [
  "Amélie Laurent", "Marc Dubois", "Sofia Rossi", "Kenji Tanaka", "Lena Weber",
  "Omar Haddad", "Chloé Martin", "Pedro Alvarez", "Nina Petrov", "Ravi Kumar",
  "Sara Okafor", "Léa Bernard", "Tom Novak", "Ines Costa", "Yannick Diop",
  "Anna Fischer", "Hugo Moreau", "Zara Ali", "Mateo Silva", "Elin Larsson",
  "Julien Roux", "Fatima Zahra",
];

export function generateDemoDonors(): Donor[] {
  const now = Date.now();
  return NAMES.map((name, i) => {
    const city = CITIES[i % CITIES.length];
    const [lat, lng] = CITY_COORDS[city];
    const jitter = () => (Math.random() - 0.5) * 0.2;
    const lastDays = Math.floor(Math.random() * 260);
    return {
      id: crypto.randomUUID(),
      name,
      bloodGroup: BLOOD_GROUPS[i % BLOOD_GROUPS.length],
      phone: `+33 6 ${String(10000000 + Math.floor(Math.random() * 89999999)).slice(0, 8)}`,
      email: name.toLowerCase().replace(/\s+/g, ".") + "@example.com",
      city,
      age: 20 + Math.floor(Math.random() * 40),
      lastDonation: new Date(now - lastDays * 86400000).toISOString(),
      emergencyContact: "+33 6 00 00 00 00",
      lat: lat + jitter(),
      lng: lng + jitter(),
      verified: Math.random() > 0.5,
      hidePhone: false,
      donationsCount: Math.floor(Math.random() * 20),
      createdAt: new Date(now - Math.floor(Math.random() * 400) * 86400000).toISOString(),
      reports: 0,
      healthOk: true,
      consent: true,
    };
  });
}
