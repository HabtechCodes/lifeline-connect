import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Droplet, Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BLOOD_GROUPS, isCompatible, type BloodGroup } from "@/lib/donors";
import { DonorCard } from "@/components/DonorCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Find Donors — BloodMatch" },
      { name: "description", content: "Search registered blood donors and match by your blood group." },
    ],
  }),
  component: FindDonors,
});

function FindDonors() {
  const { donors } = useApp();
  const [myGroup, setMyGroup] = useState<BloodGroup | "">("");
  const [filterGroup, setFilterGroup] = useState<BloodGroup | "">("");
  const [filterCity, setFilterCity] = useState("");

  const results = useMemo(() => {
    let list = donors.slice();
    if (myGroup) list = list.filter((d) => isCompatible(myGroup, d.bloodGroup));
    if (filterGroup) list = list.filter((d) => d.bloodGroup === filterGroup);
    if (filterCity.trim()) {
      const q = filterCity.trim().toLowerCase();
      list = list.filter((d) => d.city.toLowerCase().includes(q));
    }
    return list;
  }, [donors, myGroup, filterGroup, filterCity]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 md:p-8 shadow-lg">
        <p className="text-xs uppercase tracking-widest opacity-80">Find Donors</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">Search compatible blood donors.</h1>
        <p className="mt-2 opacity-90 max-w-xl">
          Browse registered donors, filter by group and city, or select your blood group to see matches.
        </p>
        <Link
          to="/register"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/15 hover:bg-white/25 px-3 py-2 text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" /> Register as a donor
        </Link>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Your blood group</h2>
        </div>
        <select
          value={myGroup}
          onChange={(e) => setMyGroup(e.target.value as BloodGroup | "")}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
        >
          <option value="">Select your blood group</option>
          {BLOOD_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        {myGroup && (
          <p className="text-xs text-muted-foreground">
            Showing donors compatible with <b className="text-foreground">{myGroup}</b>.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value as BloodGroup | "")}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All blood groups</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by city"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section>
        <p className="text-sm text-muted-foreground mb-3">
          {results.length} {results.length === 1 ? "donor" : "donors"} found
        </p>
        {donors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No donors yet. Be the first to{" "}
              <Link to="/register" className="text-primary font-medium underline">register</Link>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((d) => (
              <DonorCard key={d.id} donor={d} compatible={Boolean(myGroup)} />
            ))}
            {results.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full">No donors match your filters.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
