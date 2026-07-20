import { MapPin, Phone } from "lucide-react";
import { BloodBadge } from "./BloodBadge";
import { type Donor } from "@/lib/donors";
import { type MatchResult } from "@/lib/match";

function MatchBadge({ match }: { match: MatchResult }) {
  const color =
    match.type === "universal" || match.type === "same"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  return (
    <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-full ${color}`}>
      {match.label} · {match.percent}%
    </span>
  );
}

export function DonorCard({ donor, match }: { donor: Donor; match?: MatchResult }) {
  return (
    <article className="card-surface p-4 flex flex-col gap-3">
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
        {match && match.type !== "none" && <MatchBadge match={match} />}
      </div>

      <div className="text-sm">
        <span className="text-xs text-muted-foreground block">Phone</span>
        <a
          href={`tel:${donor.phone.replace(/\s+/g, "")}`}
          className="font-medium text-primary inline-flex items-center gap-1"
        >
          <Phone className="w-3.5 h-3.5" /> {donor.phone}
        </a>
      </div>
    </article>
  );
}
