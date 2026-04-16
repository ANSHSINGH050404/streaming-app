"use client";
import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";
import { useAuthStore } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { role, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between"
      style={{ background: "var(--background)", opacity: 0.9, backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
      
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-primary" />
        <span className="font-display text-xl tracking-wide text-foreground">
          Eventia
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase text-muted-foreground">
        {["Explore", "Categories", "Venues", "Contact"].map(item => (
          <a key={item} href="#" className="hover:text-foreground transition-colors duration-200">{item}</a>
        ))}
      </div>

      {/* CTA */}
      <div className="hidden md:flex items-center gap-6">
        {role === "admin" && (
            <Link href="/events" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                <Plus size={14} />
                <span className="text-xs tracking-widest uppercase font-bold">Host Event</span>
            </Link>
        )}
        <button onClick={handleLogout} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground">
          Logout
        </button>
        <a href="#events-list"
          className="px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-90 bg-primary text-primary-foreground">
          Book Event
        </a>
      </div>

      {/* Mobile toggle */}
      <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 py-6 px-8 flex flex-col gap-4 text-xs tracking-widest uppercase bg-card border-b border-border">
          {["Explore", "Categories", "Venues", "Contact"].map(item => (
            <a key={item} href="#" className="py-1 text-muted-foreground hover:text-foreground">{item}</a>
          ))}
          {role === "admin" && (
              <Link href="/events" className="py-1 text-primary font-bold">Host Event</Link>
          )}
          <button onClick={handleLogout} className="py-1 text-left text-muted-foreground hover:text-foreground">
            Logout
          </button>
          <a href="#book" className="mt-2 px-5 py-3 text-center bg-primary text-primary-foreground">Book Event</a>
        </div>
      )}
    </nav>
  );
}