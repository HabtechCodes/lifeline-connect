import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Droplet, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/donors";
import { DonorCard } from "@/components/DonorCard";
import { matchDonor } from "@/lib/match";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BloodMatch — Blood Group Matcher" },
      { name: "description", content: "Select your blood group and find compatible donors by city or name." },
      { property: "og:title", content: "BloodMatch — Blood Group Matcher" },
      { property: "og:description", content: "Select your blood group and find compatible donors." },
    ],
  }),
  component: Home,
});

function Home() {
  const { donors } = useApp();
  const [recipient, setRecipient] = useState<BloodGroup | "">("");
  const [filterGroup, setFilterGroup] = useState<BloodGroup | "">("");
  const [filterCity, setFilterCity] = useState("");
  const [searchName, setSearchName] = useState("");

  const cities = useMemo(() => Array.from(new Set(donors.map((d) => d.city))).sort(), [donors]);

  const results = useMemo(() => {
    let list = donors.slice();
    if (filterGroup) list = list.filter((d) => d.bloodGroup === filterGroup);
    if (filterCity) list = list.filter((d) => d.city === filterCity);
    if (searchName.trim()) {
      const q = searchName.trim().toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    if (recipient) {
      list = list.filter((d) => matchDonor(recipient, d.bloodGroup).type !== "none");
      list.sort((a, b) => {
        const ma = matchDonor(recipient, a.bloodGroup).percent;
        const mb = matchDonor(recipient, b.bloodGroup).percent;
        if (mb !== ma) return mb - ma;
        return a.name.localeCompare(b.name);
      });
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [donors, recipient, filterGroup, filterCity, searchName]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 md:p-8 shadow-lg">
        <p className="text-xs uppercase tracking-widest opacity-80">Blood Group Matcher</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">Find compatible blood donors.</h1>
        <p className="mt-2 opacity-90 max-w-xl">
          Select your blood group to see donors who can safely donate to you.
        </p>
      </section>

      <section className="card-surface p-4 md:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Your blood group</h2>
        </div>
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value as BloodGroup | "")}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
        >
          <option value="">Select your blood group</option>
          {BLOOD_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        {recipient && (
          <p className="text-xs text-muted-foreground">
            Showing donors whose blood is compatible with <b className="text-foreground">{recipient}</b>.
          </p>
        )}
      </section>

      <section className="card-surface p-4 md:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Quick filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "donor" : "donors"} found
          </p>
          {recipient && (
            <p className="text-xs text-muted-foreground">Sorted by match strength</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((d) => (
            <DonorCard
              key={d.id}
              donor={d}
              match={recipient ? matchDonor(recipient, d.bloodGroup) : undefined}
            />
          ))}
          {results.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full">No donors match your filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
