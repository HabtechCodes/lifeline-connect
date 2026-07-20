import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { AlertTriangle, MapPin, Search, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { BLOOD_GROUPS, distanceKm, isEligible, type BloodGroup } from "@/lib/donors";
import { DonorCard } from "@/components/DonorCard";
import { EmergencyButton } from "@/components/EmergencyButton";
import { BloodBadge } from "@/components/BloodBadge";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>) => ({
    emergency: s.emergency ? 1 : undefined,
  }),
  component: Home,
});

function Home() {
  const { donors, geo, requestGeo } = useApp();
  const search = Route.useSearch();
  const [bg, setBg] = useState<BloodGroup | "">("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState<"nearest" | "recent" | "reliable">("recent");
  const [emergency, setEmergency] = useState(false);

  useEffect(() => {
    if (search.emergency) {
      setEmergency(true);
      document.getElementById("search-panel")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [search.emergency]);

  const cities = useMemo(
    () => Array.from(new Set(donors.map((d) => d.city))).sort(),
    [donors],
  );

  const results = useMemo(() => {
    let list = donors.slice();
    if (bg) list = list.filter((d) => d.bloodGroup === bg);
    if (city) list = list.filter((d) => d.city === city);
    if (emergency) list = list.filter(isEligible);

    const withDist = list.map((d) => {
      const dist =
        geo && d.lat != null && d.lng != null
          ? distanceKm(geo, { lat: d.lat, lng: d.lng })
          : undefined;
      return { d, dist };
    });

    if (sortBy === "nearest" && geo) {
      withDist.sort((a, b) => (a.dist ?? 9e9) - (b.dist ?? 9e9));
    } else if (sortBy === "recent") {
      withDist.sort(
        (a, b) =>
          new Date(b.d.lastDonation ?? b.d.createdAt).getTime() -
          new Date(a.d.lastDonation ?? a.d.createdAt).getTime(),
      );
    } else {
      withDist.sort((a, b) => b.d.donationsCount - a.d.donationsCount);
    }
    return emergency ? withDist.slice(0, 10) : withDist;
  }, [donors, bg, city, sortBy, geo, emergency]);

  const stock = useMemo(() => {
    const map = new Map<BloodGroup, number>();
    BLOOD_GROUPS.forEach((g) => map.set(g, 0));
    donors.filter(isEligible).forEach((d) => map.set(d.bloodGroup, (map.get(d.bloodGroup) ?? 0) + 1));
    return map;
  }, [donors]);

  const leaderboard = useMemo(
    () => donors.slice().sort((a, b) => b.donationsCount - a.donationsCount).slice(0, 5),
    [donors],
  );

  const triggerEmergency = async () => {
    if (!bg) {
      toast.error("Select a blood group first");
      return;
    }
    setEmergency(true);
    await requestGeo();
    setSortBy("nearest");
    toast.success(`Emergency alert sent to eligible ${bg} donors nearby (simulated).`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-6 md:p-8 shadow-lg">
        <p className="text-xs uppercase tracking-widest opacity-80">Every drop saves a life</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">Find a blood donor, fast.</h1>
        <p className="mt-2 opacity-90 max-w-xl">
          Search verified donors near you, or trigger an emergency alert to the nearest eligible matches.
        </p>
        <div className="mt-5 max-w-md">
          <EmergencyButton />
        </div>
      </section>

      {/* Stock alerts */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
          <AlertTriangle className="w-4 h-4" /> Blood stock status
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {BLOOD_GROUPS.map((g) => {
            const count = stock.get(g) ?? 0;
            const low = count < 2;
            return (
              <div
                key={g}
                className={`card-surface p-2 text-center ${low ? "ring-2 ring-primary" : ""}`}
                title={low ? "Shortage" : "OK"}
              >
                <BloodBadge group={g} size="sm" />
                <p className="text-xs mt-1">
                  {count} <span className="text-muted-foreground">donors</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Search */}
      <section id="search-panel" className="card-surface p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> Search donors
          </h2>
          {emergency && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
              EMERGENCY MODE · top 10 nearest
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={bg}
            onChange={(e) => setBg(e.target.value as BloodGroup | "")}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All blood groups</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="recent">Recently active</option>
            <option value="nearest">Nearest (GPS)</option>
            <option value="reliable">Most reliable</option>
          </select>
          <button
            onClick={triggerEmergency}
            className="rounded-md bg-primary text-primary-foreground text-sm font-semibold px-3 py-2 hover:opacity-90"
          >
            Trigger emergency
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button
            onClick={async () => {
              const g = await requestGeo();
              if (g) toast.success("Location shared");
              else toast.error("Location unavailable");
            }}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <MapPin className="w-3.5 h-3.5" />
            {geo ? `Using GPS (${geo.lat.toFixed(2)}, ${geo.lng.toFixed(2)})` : "Share my location"}
          </button>
          {emergency && (
            <button className="ml-auto text-primary" onClick={() => setEmergency(false)}>
              Clear emergency
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      <section>
        <p className="text-sm text-muted-foreground mb-3">
          {results.length} {results.length === 1 ? "donor" : "donors"} found
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(({ d, dist }) => (
            <DonorCard key={d.id} donor={d} distance={dist} />
          ))}
          {results.length === 0 && (
            <p className="text-sm text-muted-foreground">No donors match your filters.</p>
          )}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="card-surface p-4 md:p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-primary" /> Top donors
        </h2>
        <ol className="space-y-2">
          {leaderboard.map((d, i) => (
            <li key={d.id} className="flex items-center gap-3 text-sm">
              <span className="w-6 text-center font-bold text-muted-foreground">{i + 1}</span>
              <BloodBadge group={d.bloodGroup} size="sm" />
              <span className="flex-1 truncate">{d.name}</span>
              <span className="text-muted-foreground">{d.donationsCount} donations</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
