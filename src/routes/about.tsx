import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, Phone, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Blood Group Matcher" },
      { name: "description", content: "Emergency numbers and information about BloodMatch." },
      { property: "og:title", content: "About — Blood Group Matcher" },
      { property: "og:description", content: "Emergency numbers and information about BloodMatch." },
    ],
  }),
  component: About,
});

const numbers = [
  { country: "Nigeria", n: "112" },
  { country: "Ghana", n: "112" },
  { country: "Kenya", n: "999" },
  { country: "South Africa", n: "10177" },
  { country: "USA", n: "911" },
  { country: "UK", n: "999" },
  { country: "EU", n: "112" },
];

const faq = [
  {
    q: "How does the matching work?",
    a: "We filter donors based on standard ABO/Rh blood compatibility. O-negative donors are universal donors, and your exact blood group is always the best match.",
  },
  {
    q: "Is the donor data real?",
    a: "No. This app ships with pre-populated sample data for demonstration purposes.",
  },
  {
    q: "Can I use this offline?",
    a: "Yes. Once installed, the app works offline thanks to the service worker.",
  },
];

function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <section className="card-surface p-6">
        <div className="flex items-center gap-2 mb-2">
          <HeartPulse className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">About BloodMatch</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          BloodMatch is a simple Progressive Web App that helps people quickly find compatible blood donors.
          Select your blood group, filter by city or name, and call a donor directly.
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
              <summary className="cursor-pointer font-medium text-sm">{f.q}</summary>
              <p className="text-sm text-muted-foreground mt-1">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
