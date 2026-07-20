import { BadgeCheck, Flag, MapPin, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { BloodBadge } from "./BloodBadge";
import { daysSince, isEligible, type Donor } from "@/lib/donors";
import { useApp } from "@/context/AppContext";

export function DonorCard({ donor, distance }: { donor: Donor; distance?: number }) {
  const { reportDonor, currentUserId } = useApp();
  const eligible = isEligible(donor);
  const since = daysSince(donor.lastDonation);
  const canSeePhone = !donor.hidePhone || currentUserId != null;

  const share = () => {
    const text = `Blood donor: ${donor.name} (${donor.bloodGroup}) in ${donor.city}. Contact via LifeDrop.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  };

  const call = () => {
    if (!canSeePhone) {
      toast.info("Sign in as a donor to view phone numbers.");
      return;
    }
    window.location.href = `tel:${donor.phone.replace(/\s+/g, "")}`;
  };

  return (
    <article className="card-surface p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <BloodBadge group={donor.bloodGroup} size="lg" />
          <div className="min-w-0">
            <h3 className="font-semibold truncate flex items-center gap-1">
              {donor.name}
              {donor.verified && (
                <BadgeCheck className="w-4 h-4 text-primary" aria-label="Verified" />
              )}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {donor.city}
              {distance != null && ` · ${distance.toFixed(1)} km`}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-full ${
            eligible
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
          }`}
        >
          {eligible ? "Eligible" : "Recovering"}
        </span>
      </div>

      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
        <span>Donations: <b className="text-foreground">{donor.donationsCount}</b></span>
        <span>Last: {since != null ? `${since}d ago` : "—"}</span>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={call}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium py-2 hover:opacity-90 transition"
        >
          <Phone className="w-4 h-4" />
          {canSeePhone ? "Call" : "Hidden"}
        </button>
        <button
          onClick={share}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background text-sm px-3 hover:bg-accent transition"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            reportDonor(donor.id);
            toast.success("Report submitted for review.");
          }}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background text-sm px-3 hover:bg-accent transition"
          aria-label="Report"
          title="Report as fake"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
