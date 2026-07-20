import { BLOOD_COLORS, type BloodGroup } from "@/lib/donors";

export function BloodBadge({ group, size = "md" }: { group: BloodGroup; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-xs px-2 py-0.5 min-w-[2.5rem]",
    md: "text-sm px-2.5 py-1 min-w-[3rem]",
    lg: "text-lg px-3 py-1.5 min-w-[3.5rem]",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-bold text-white shadow ${sizes[size]}`}
      style={{ backgroundColor: BLOOD_COLORS[group] }}
    >
      {group}
    </span>
  );
}
