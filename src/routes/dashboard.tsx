import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { BadgeCheck, Download, Upload, RefreshCw, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BLOOD_GROUPS, isEligible, type BloodGroup } from "@/lib/donors";
import { BloodBadge } from "@/components/BloodBadge";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — LifeDrop" },
      { name: "description", content: "Manage your donor profile, donation history, and eligibility." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const {
    currentUser,
    currentUserId,
    setCurrentUserId,
    updateDonor,
    donors,
    toggleVerified,
    exportJson,
    importJson,
    resetDemo,
  } = useApp();

  if (!currentUser) return <SignInPicker />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <ProfileCard />
      <DonationHistory />
      <QRShare />
      <AdminTools onToggle={() => toggleVerified(currentUserId!)} />
      <DataTools exportJson={exportJson} importJson={importJson} resetDemo={resetDemo} />
      <button
        onClick={() => setCurrentUserId(null)}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </div>
  );

  function SignInPicker() {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="card-surface p-6">
          <h1 className="text-xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pick your profile (demo) or <Link to="/register" className="text-primary underline">register</Link>.
          </p>
          <div className="mt-4 max-h-72 overflow-auto divide-y divide-border">
            {donors.map((d) => (
              <button
                key={d.id}
                onClick={() => setCurrentUserId(d.id)}
                className="w-full text-left py-2 flex items-center gap-3 hover:bg-accent px-2 rounded"
              >
                <BloodBadge group={d.bloodGroup} size="sm" />
                <span className="flex-1 truncate">{d.name}</span>
                <span className="text-xs text-muted-foreground">{d.city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

function ProfileCard() {
  const { currentUser, updateDonor } = useApp();
  const [edit, setEdit] = useState(false);
  if (!currentUser) return null;
  const eligible = isEligible(currentUser);
  const nextDate = currentUser.lastDonation
    ? new Date(new Date(currentUser.lastDonation).getTime() + 90 * 86400000)
    : null;

  return (
    <section className="card-surface p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <BloodBadge group={currentUser.bloodGroup} size="lg" />
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-1">
                {currentUser.name}
                {currentUser.verified && <BadgeCheck className="w-5 h-5 text-primary" />}
              </h1>
              <p className="text-sm text-muted-foreground">{currentUser.city} · {currentUser.email}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
              eligible
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            }`}
          >
            {eligible ? "Eligible to donate" : "In recovery"}
          </span>
          {nextDate && !eligible && (
            <p className="text-xs text-muted-foreground mt-1">
              Eligible on {nextDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Stat label="Donations" value={currentUser.donationsCount} />
        <Stat label="Age" value={currentUser.age} />
        <Stat label="Phone" value={currentUser.hidePhone ? "Hidden" : currentUser.phone} />
        <Stat label="Reports" value={currentUser.reports} />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setEdit((v) => !v)}
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
        >
          {edit ? "Close" : "Edit profile"}
        </button>
        <button
          onClick={() => {
            updateDonor(currentUser.id, {
              lastDonation: new Date().toISOString(),
              donationsCount: currentUser.donationsCount + 1,
            });
            toast.success("Donation recorded. Thank you!");
          }}
          className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90"
        >
          Log a donation today
        </button>
      </div>

      {edit && (
        <EditForm
          onSave={(patch) => {
            updateDonor(currentUser.id, patch);
            setEdit(false);
            toast.success("Profile updated");
          }}
          initial={currentUser}
        />
      )}
    </section>
  );
}

function EditForm({
  initial,
  onSave,
}: {
  initial: { name: string; phone: string; city: string; bloodGroup: BloodGroup; hidePhone: boolean };
  onSave: (patch: Partial<typeof initial>) => void;
}) {
  const [form, setForm] = useState(initial);
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <input
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />
      <select
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={form.bloodGroup}
        onChange={(e) => setForm({ ...form, bloodGroup: e.target.value as BloodGroup })}
      >
        {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.hidePhone}
          onChange={(e) => setForm({ ...form, hidePhone: e.target.checked })}
        />
        Hide phone number publicly
      </label>
      <div className="md:col-span-2">
        <button
          onClick={() => onSave(form)}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-semibold truncate">{value}</p>
    </div>
  );
}

function DonationHistory() {
  const { currentUser } = useApp();
  if (!currentUser) return null;
  const entries = currentUser.lastDonation
    ? [{ date: currentUser.lastDonation, label: "Most recent donation" }]
    : [];
  return (
    <section className="card-surface p-6">
      <h2 className="text-lg font-semibold mb-3">Donation history</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No donations logged yet.</p>
      ) : (
        <ul className="text-sm space-y-1">
          {entries.map((e) => (
            <li key={e.date} className="flex justify-between border-b border-border py-1">
              <span>{e.label}</span>
              <span className="text-muted-foreground">{new Date(e.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function QRShare() {
  const { currentUser } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!currentUser || !canvasRef.current) return;
    const payload = JSON.stringify({
      name: currentUser.name,
      bloodGroup: currentUser.bloodGroup,
      city: currentUser.city,
      phone: currentUser.hidePhone ? undefined : currentUser.phone,
    });
    QRCode.toCanvas(canvasRef.current, payload, { width: 180, margin: 1 }).catch(() => {});
  }, [currentUser]);
  if (!currentUser) return null;
  return (
    <section className="card-surface p-6 flex flex-col sm:flex-row items-center gap-6">
      <canvas ref={canvasRef} className="rounded-md bg-white p-2" />
      <div>
        <h2 className="text-lg font-semibold">Share your profile</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Anyone can scan this QR code to instantly get your blood group and contact info in an emergency.
        </p>
      </div>
    </section>
  );
}

function AdminTools({ onToggle }: { onToggle: () => void }) {
  return (
    <section className="card-surface p-6">
      <h2 className="text-lg font-semibold mb-2">Moderation</h2>
      <p className="text-sm text-muted-foreground mb-3">
        Toggle the verification badge on your profile (demo — in production this is admin-only).
      </p>
      <button
        onClick={onToggle}
        className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent inline-flex items-center gap-1"
      >
        <BadgeCheck className="w-4 h-4" /> Toggle verified badge
      </button>
    </section>
  );
}

function DataTools({
  exportJson,
  importJson,
  resetDemo,
}: {
  exportJson: () => string;
  importJson: (json: string) => void;
  resetDemo: () => void;
}) {
  const doExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lifedrop-donors.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  };
  const doImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((t) => {
      try {
        importJson(t);
        toast.success("Donors imported");
      } catch {
        toast.error("Invalid file");
      }
    });
  };
  return (
    <section className="card-surface p-6">
      <h2 className="text-lg font-semibold mb-2">Data backup</h2>
      <div className="flex flex-wrap gap-2">
        <button onClick={doExport} className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent inline-flex items-center gap-1">
          <Download className="w-4 h-4" /> Export JSON
        </button>
        <label className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent inline-flex items-center gap-1 cursor-pointer">
          <Upload className="w-4 h-4" /> Import JSON
          <input type="file" accept="application/json" onChange={doImport} className="hidden" />
        </label>
        <button
          onClick={() => {
            if (confirm("Reset local data to demo donors?")) resetDemo();
          }}
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent inline-flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" /> Reset demo data
        </button>
      </div>
    </section>
  );
}
