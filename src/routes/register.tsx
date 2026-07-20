import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { BLOOD_GROUPS, type BloodGroup, type Donor } from "@/lib/donors";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register as a Donor — LifeDrop" },
      { name: "description", content: "Register as a blood donor and help save lives near you." },
      { property: "og:title", content: "Register as a Donor — LifeDrop" },
      { property: "og:description", content: "Join the LifeDrop donor network." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  bloodGroup: z.enum(BLOOD_GROUPS),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(120),
  city: z.string().trim().min(2).max(60),
  age: z.number().int().min(18).max(65),
  lastDonation: z.string().optional(),
  emergencyContact: z.string().trim().max(30).optional(),
  hidePhone: z.boolean(),
  consent: z.literal(true),
  healthOk: z.literal(true),
});

function RegisterPage() {
  const { addDonor, setCurrentUserId, requestGeo } = useApp();
  const navigate = useNavigate();
  const [shareGeo, setShareGeo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      bloodGroup: String(fd.get("bloodGroup") ?? "") as BloodGroup,
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      age: Number(fd.get("age") ?? 0),
      lastDonation: (fd.get("lastDonation") as string) || undefined,
      emergencyContact: (fd.get("emergencyContact") as string) || undefined,
      hidePhone: fd.get("hidePhone") === "on",
      consent: fd.get("consent") === "on" ? (true as const) : (false as never),
      healthOk: fd.get("healthOk") === "on" ? (true as const) : (false as never),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      setSubmitting(false);
      return;
    }
    let coords: { lat?: number; lng?: number } = {};
    if (shareGeo) {
      const g = await requestGeo();
      if (g) coords = g;
    }
    const donor: Donor = {
      id: crypto.randomUUID(),
      ...parsed.data,
      lat: coords.lat,
      lng: coords.lng,
      verified: false,
      donationsCount: parsed.data.lastDonation ? 1 : 0,
      createdAt: new Date().toISOString(),
      reports: 0,
    };
    addDonor(donor);
    setCurrentUserId(donor.id);
    toast.success("Welcome to LifeDrop! You're now registered.");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">Become a donor</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Your info is stored locally on this device. You can edit or remove it anytime.
      </p>
      <form onSubmit={onSubmit} className="card-surface p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name"><input name="name" required className={inputCls} /></Field>
          <Field label="Blood group">
            <select name="bloodGroup" required className={inputCls} defaultValue="">
              <option value="" disabled>Select</option>
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Phone"><input name="phone" required className={inputCls} /></Field>
          <Field label="Email"><input name="email" type="email" required className={inputCls} /></Field>
          <Field label="City / Location"><input name="city" required className={inputCls} /></Field>
          <Field label="Age (18–65)">
            <input name="age" type="number" min={18} max={65} required className={inputCls} />
          </Field>
          <Field label="Last donation date (optional)">
            <input name="lastDonation" type="date" className={inputCls} />
          </Field>
          <Field label="Emergency contact"><input name="emergencyContact" className={inputCls} /></Field>
        </div>

        <fieldset className="border border-border rounded-md p-3 space-y-2 text-sm">
          <legend className="px-1 text-xs font-semibold text-muted-foreground">Health declaration</legend>
          <Check name="healthOk" required>
            I confirm I do not have HIV, Hepatitis B/C, or other transmissible conditions, and I meet local donor health requirements.
          </Check>
        </fieldset>

        <fieldset className="border border-border rounded-md p-3 space-y-2 text-sm">
          <legend className="px-1 text-xs font-semibold text-muted-foreground">Privacy</legend>
          <Check name="hidePhone">Hide my phone number from public search (visible only to signed-in donors)</Check>
          <Check name="consent" required>
            I consent to sharing my contact info with people requesting blood in emergencies (encrypted locally, simulated).
          </Check>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={shareGeo}
              onChange={(e) => setShareGeo(e.target.checked)}
            />
            <span>Share my GPS location for nearest-donor matching</span>
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-primary text-primary-foreground font-semibold py-3 hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Registering…" : "Register as donor"}
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="block text-xs font-semibold text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}

function Check({
  name,
  required,
  children,
}: {
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input type="checkbox" name={name} required={required} className="mt-0.5" />
      <span>{children}</span>
    </label>
  );
}
