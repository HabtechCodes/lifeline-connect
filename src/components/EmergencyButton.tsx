import { Siren } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function EmergencyButton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Link
        to="/"
        search={{ emergency: 1 } as never}
        className="pulse-emergency inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 shadow"
      >
        <Siren className="w-3.5 h-3.5" /> SOS
      </Link>
    );
  }
  return (
    <Link
      to="/"
      search={{ emergency: 1 } as never}
      className="pulse-emergency w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-lg font-bold py-4 shadow-lg hover:opacity-95 transition"
    >
      <Siren className="w-6 h-6" /> Find Donors Now
    </Link>
  );
}
