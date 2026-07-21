import { CalendarDays, MapPin, Phone } from "lucide-react";
import { BloodBadge } from "./BloodBadge";
import { type Donor } from "@/lib/donors";

export function DonorCard({ donor, compatible }: { donor: Donor; compatible?: boolean }) {
  const added = new Date(donor.createdAt).toLocaleDateString();
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <BloodBadge group={donor.bloodGroup} size="lg" />
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{donor.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {donor.city}
            </p>
          </div>
        </div>
        {compatible && (
          <span className="text-[10px] uppercase font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Match
          </span>
        )}
      </div>

      <a
        href={`tel:${donor.phone.replace(/\s+/g, "")}`}
        className="text-sm font-medium text-primary inline-flex items-center gap-1.5"
      >
        <Phone className="w-3.5 h-3.5" /> {donor.phone}
      </a>

      <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
        <CalendarDays className="w-3 h-3" /> Added {added}
      </p>
    </article>
  );
}
