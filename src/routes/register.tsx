import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/donors";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register as Donor — BloodMatch" },
      { name: "description", content: "Add yourself to the BloodMatch donor list." },
    ],
  }),
  component: RegisterPage,
});

const empty = { name: "", bloodGroup: "" as BloodGroup | "", phone: "", city: "" };

function RegisterPage() {
  const { addDonor } = useApp();
  const [form, setForm] = useState(empty);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.bloodGroup || !form.phone.trim() || !form.city.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    addDonor({
      name: form.name,
      bloodGroup: form.bloodGroup as BloodGroup,
      phone: form.phone,
      city: form.city,
    });
    toast.success(`${form.name.trim()} added to the donor list.`);
    setForm(empty);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 shadow-lg">
        <p className="text-xs uppercase tracking-widest opacity-80">Register as Donor</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">Join the donor list.</h1>
        <p className="mt-2 opacity-90 text-sm">
          Your info is stored only on this device (localStorage).
        </p>
      </section>

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-4 shadow-sm"
      >
        <Field label="Full Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Blood Group">
          <select
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value as BloodGroup | "" })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </Field>

        <Field label="Phone Number">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 555 000 1234"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Location / City">
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Lagos"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground font-medium px-4 py-2.5 text-sm hover:opacity-90"
        >
          <UserPlus className="w-4 h-4" /> Add Donor
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
