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

export const EVENT_PATTERNS: Record<Event["type"], string> = {
  Concert:
    'url("https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=1200&auto=format&fit=crop")',
  Workshop:
    'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop")',
  Gala:
    'url("https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop")',
  Conference:
    'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop")',
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
        <div className="relative h-52 flex items-center justify-center overflow-hidden bg-muted bg-cover bg-center"
          style={{
            backgroundImage: EVENT_PATTERNS[event.type],
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