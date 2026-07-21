import { CalendarDays, MapPin, Phone, Trash2 } from "lucide-react";
import { BloodBadge } from "./BloodBadge";
import { type Donor } from "@/lib/donors";

export function DonorCard({ donor, compatible, onDelete }: { donor: Donor; compatible?: boolean; onDelete?: (id: string) => void }) {
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
        <div className="flex items-center gap-2">
          {compatible && (
            <span className="text-[10px] uppercase font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              Match
            </span>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(donor.id)}
              aria-label={`Delete ${donor.name}`}
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
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
