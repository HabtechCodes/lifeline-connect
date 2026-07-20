import { createFileRoute } from "@tanstack/react-router";
import { Phone, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Emergency Numbers — LifeDrop" },
      { name: "description", content: "Emergency numbers, FAQ, and information about the LifeDrop blood donor network." },
      { property: "og:title", content: "About LifeDrop" },
      { property: "og:description", content: "Emergency numbers, FAQ, and donor guidance." },
    ],
  }),
  component: About,
});

const numbers = [
  { country: "France (SAMU)", n: "15" },
  { country: "EU emergency", n: "112" },
  { country: "USA", n: "911" },
  { country: "UK", n: "999" },
  { country: "India", n: "102" },
];

const faq = [
  { q: "How often can I donate?", a: "Whole blood: every 90 days for men, 120 days for women (guidelines vary by country)." },
  { q: "Where is my data stored?", a: "All donor data is stored locally on your device (localStorage). Export a JSON backup from your dashboard anytime." },
  { q: "Is the emergency alert real?", a: "In this demo, alerts are simulated with a toast. In production this hooks into SMS/email/push providers." },
  { q: "What does the verification badge mean?", a: "A verified badge indicates a moderator has confirmed the donor's identity and health declaration." },
];

function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <section className="card-surface p-6">
        <h1 className="text-2xl font-bold">About LifeDrop</h1>
        <p className="text-sm text-muted-foreground mt-2">
          LifeDrop is a Progressive Web App that connects blood donors with recipients in real time.
          Install it to your home screen for one-tap access in emergencies.
        </p>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Phone className="w-5 h-5 text-primary" /> Emergency numbers
        </h2>
        <ul className="divide-y divide-border">
          {numbers.map((n) => (
            <li key={n.country} className="flex justify-between py-2 text-sm">
              <span>{n.country}</span>
              <a href={`tel:${n.n}`} className="font-mono font-bold text-primary">{n.n}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-primary" /> FAQ
        </h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="border-b border-border pb-2">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="text-sm text-muted-foreground mt-1">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
