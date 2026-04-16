"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between"
      style={{ background: "var(--background)", opacity: 0.9, backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-primary" />
        <span className="font-display text-xl tracking-wide text-foreground">
          Eventia
        </span>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase text-muted-foreground">
        {["Explore", "Categories", "Venues", "Contact"].map(item => (
          <a key={item} href="#" className="hover:text-foreground transition-colors duration-200">{item}</a>
        ))}
      </div>

      {/* CTA */}
      <div className="hidden md:flex items-center gap-4">
        <a href="#" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground">
          Account
        </a>
        <a href="#book"
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
          {["Explore", "Categories", "Venues", "Contact", "Account"].map(item => (
            <a key={item} href="#" className="py-1 text-muted-foreground hover:text-foreground">{item}</a>
          ))}
          <a href="#book" className="mt-2 px-5 py-3 text-center bg-primary text-primary-foreground">Book Event</a>
        </div>
      )}
    </nav>
  );
}