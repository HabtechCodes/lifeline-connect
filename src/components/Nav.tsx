import { Link } from "@tanstack/react-router";
import { Droplet, Moon, Sun, Languages } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { EmergencyButton } from "./EmergencyButton";

export function Nav() {
  const { dark, toggleDark, lang, setLang } = useApp();
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <Droplet className="w-5 h-5 fill-current" />
          LifeDrop
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-4 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="px-3 py-1.5 rounded-md hover:bg-accent"
            activeProps={{ className: "px-3 py-1.5 rounded-md bg-accent font-semibold" }}
          >
            Home
          </Link>
          <Link
            to="/register"
            className="px-3 py-1.5 rounded-md hover:bg-accent"
            activeProps={{ className: "px-3 py-1.5 rounded-md bg-accent font-semibold" }}
          >
            Register
          </Link>
          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-md hover:bg-accent"
            activeProps={{ className: "px-3 py-1.5 rounded-md bg-accent font-semibold" }}
          >
            Dashboard
          </Link>
          <Link
            to="/about"
            className="px-3 py-1.5 rounded-md hover:bg-accent"
            activeProps={{ className: "px-3 py-1.5 rounded-md bg-accent font-semibold" }}
          >
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "en" | "fr" | "es")}
              className="bg-transparent border border-border rounded px-1 py-0.5 text-xs"
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
            </select>
          </div>
          <button
            onClick={toggleDark}
            className="p-2 rounded-md hover:bg-accent"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <EmergencyButton compact />
        </div>
      </div>
      <div className="md:hidden border-t border-border">
        <div className="max-w-6xl mx-auto px-2 flex justify-around text-xs">
          {[
            { to: "/", label: "Home" },
            { to: "/register", label: "Register" },
            { to: "/dashboard", label: "Me" },
            { to: "/about", label: "About" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={l.to === "/" ? { exact: true } : undefined}
              className="py-2 px-3"
              activeProps={{ className: "py-2 px-3 text-primary font-semibold" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
