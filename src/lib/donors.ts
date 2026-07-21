export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  city: string;
  createdAt: string;
}

const STORAGE_KEY = "bloodmatch.donors.v1";

export function loadDonors(): Donor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Donor[]) : [];
  } catch {
    return [];
  }
}

export function saveDonors(donors: Donor[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(donors));
}

// Per-letter color for the blood-group badge (medical convention: red family for A,
// blue for B, purple for AB, green for O).
export function bloodGroupColor(group: BloodGroup): string {
  const letter = group.replace(/[+-]/g, "");
  switch (letter) {
    case "A":
      return "bg-red-600";
    case "B":
      return "bg-blue-600";
    case "AB":
      return "bg-purple-600";
    case "O":
      return "bg-emerald-600";
    default:
      return "bg-primary";
  }
}

// User's spec: recipient group -> list of donor groups shown as compatible.
const COMPAT: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

export function isCompatible(userGroup: BloodGroup, donorGroup: BloodGroup): boolean {
  return COMPAT[userGroup].includes(donorGroup);
}
