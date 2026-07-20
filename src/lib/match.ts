import { type BloodGroup } from "./donors";

const COMPATIBLE: Record<BloodGroup, BloodGroup[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

export type MatchType = "universal" | "same" | "compatible" | "none";

export interface MatchResult {
  type: MatchType;
  label: string;
  percent: number;
}

export function matchDonor(recipient: BloodGroup, donor: BloodGroup): MatchResult {
  const compatible = COMPATIBLE[recipient];
  if (!compatible.includes(donor)) {
    return { type: "none", label: "Not compatible", percent: 0 };
  }
  if (donor === "O-") {
    return { type: "universal", label: "Universal donor", percent: 100 };
  }
  if (donor === recipient) {
    return { type: "same", label: "Same group", percent: 100 };
  }
  return { type: "compatible", label: "Compatible", percent: 85 };
}
