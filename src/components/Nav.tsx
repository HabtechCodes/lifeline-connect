import { Link } from "@tanstack/react-router";
import { Droplet } from "lucide-react";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <Droplet className="w-5 h-5 fill-current" />
          BloodMatch
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="px-3 py-1.5 rounded-md hover:bg-accent"
            activeProps={{ className: "px-3 py-1.5 rounded-md bg-accent font-semibold" }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-3 py-1.5 rounded-md hover:bg-accent"
            activeProps={{ className: "px-3 py-1.5 rounded-md bg-accent font-semibold" }}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
