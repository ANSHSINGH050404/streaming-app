"use client";
import { useState } from "react";
import { Users, MapPin, Calendar, Check } from "lucide-react";

export interface Event {
  id: string;
  name: string;
  type: "Concert" | "Workshop" | "Gala" | "Conference";
  tag?: string;
  venue: string;
  date: string;
  capacity: number;
  price: number;
  available: boolean;
  amenities: readonly string[];
}

const EVENT_PATTERNS: Record<string, string> = {
  Concert: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%23c8843a' fill-opacity='0.07'/%3E%3C/svg%3E")`,
  Workshop: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='1.5' fill='%238a9e8a' fill-opacity='0.15'/%3E%3C/svg%3E")`,
  Gala: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23b8a898' stroke-opacity='0.15' stroke-width='0.5'/%3E%3C/svg%3E")`,
  Conference: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0L50 25L25 50L0 25z' fill='none' stroke='%23c8843a' stroke-opacity='0.08' stroke-width='1'/%3E%3C/svg%3E")`,
};

export default function EventCard({ event, index }: { event: Event; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer transition-transform duration-500"
      style={{ transform: hovered ? "translateY(-6px)" : "translateY(0)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tag */}
      {event.tag && (
        <div className="absolute -top-3 left-6 z-10 px-3 py-1 text-[9px] tracking-[0.2em] uppercase bg-primary text-primary-foreground">
          {event.tag}
        </div>
      )}

      {/* Card */}
      <div className="overflow-hidden border border-border bg-card">
        {/* Visual area */}
        <div className="relative h-52 flex items-center justify-center overflow-hidden bg-muted"
          style={{
            backgroundImage: EVENT_PATTERNS[event.type] || EVENT_PATTERNS.Gala,
          }}>
          {/* Event number */}
          <span className="font-display select-none text-foreground opacity-5"
            style={{ fontSize: "120px", lineHeight: 1 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Type badge */}
          <div className="absolute top-4 right-4 px-2 py-1 text-[9px] tracking-widest uppercase border border-border text-muted-foreground bg-background">
            {event.type}
          </div>
          {/* Overlay on hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-foreground/75 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xs tracking-[0.2em] uppercase text-background font-medium">
              View Event
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-card">
          <h3 className="font-display text-2xl mb-1 text-foreground">
            {event.name}
          </h3>

          {/* Meta */}
          <div className="flex flex-col gap-2 mb-4 text-[10px] tracking-widest uppercase text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={10} className="text-primary" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={10} className="text-primary" />
              {event.venue}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={10} className="text-primary" />
              {event.capacity} seats remaining
            </span>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-6">
            {event.amenities.slice(0, 3).map(a => (
              <span key={a} className="flex items-center gap-1 text-[9px] tracking-wider text-muted-foreground">
                <Check size={8} className="text-primary" />
                {a}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-end justify-between pt-2 border-t border-border">
            <div>
              <div className="text-[9px] tracking-[0.2em] uppercase mb-1 text-muted-foreground">
                Tickets from
              </div>
              <div className="font-display text-3xl text-foreground">
                ₹{event.price}
              </div>
            </div>
            <button
              disabled={!event.available}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 ${
                event.available 
                  ? "bg-primary text-primary-foreground hover:opacity-90" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}>
              {event.available ? "Book Now" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}