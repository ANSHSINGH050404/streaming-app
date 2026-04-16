"use client";
import { Search } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  date: string;
  setDate: (date: string) => void;
}

export default function Hero({ searchQuery, setSearchQuery, date, setDate }: HeroProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const section = document.getElementById("events-list");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden pt-20 bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 60%),
                            radial-gradient(circle at 80% 20%, var(--accent) 0%, transparent 50%)`,
        }}
      />

      {/* Large decorative text */}
      <div className="absolute top-24 right-8 md:right-16 font-display select-none pointer-events-none text-foreground opacity-5"
        style={{ fontSize: "clamp(100px,15vw,200px)", lineHeight: 1 }}>
        EVENTS
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p className="animate-fade-up stagger-1 text-xs tracking-[0.25em] uppercase mb-6 text-primary font-medium">
          Premium Event Experiences
        </p>

        <h1 className="animate-fade-up stagger-2 font-display leading-none mb-8 text-foreground"
          style={{ fontSize: "clamp(48px,8vw,110px)", letterSpacing: "-0.02em" }}>
          Moments That<br />
          <em className="text-primary not-italic">Matter</em>
        </h1>

        <p className="animate-fade-up stagger-3 text-xs tracking-widest uppercase max-w-sm mx-auto mb-16 text-muted-foreground"
          style={{ lineHeight: 2 }}>
          From intimate gatherings to grand celebrations.<br />Discover and book extraordinary events.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className="animate-fade-up stagger-4 mx-auto max-w-4xl border border-border bg-card shadow-2xl p-1 rounded-sm">
          <div className="flex flex-col md:flex-row bg-background rounded-sm overflow-hidden">
            
            {/* Event Name/Type */}
            <div className="flex-[2] px-6 py-5 border-b md:border-b-0 md:border-r border-border">
              <label className="block text-[9px] tracking-[0.2em] uppercase mb-2 text-muted-foreground font-semibold">Search Events</label>
              <div className="flex items-center gap-3">
                <Search size={16} className="text-muted-foreground/40" />
                <input 
                  type="text"
                  placeholder="Concerts, Workshops, Galas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/30 font-medium"
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex-1 px-6 py-5 border-b md:border-b-0 md:border-r border-border">
              <label className="block text-[9px] tracking-[0.2em] uppercase mb-2 text-muted-foreground font-semibold">When</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm bg-transparent outline-none text-foreground font-medium cursor-pointer"
              />
            </div>

            {/* Search button */}
            <button type="submit"
              className="px-10 py-5 flex items-center justify-center gap-2 text-xs tracking-widest uppercase transition-all hover:bg-primary/90 bg-primary text-primary-foreground font-bold min-w-[160px]">
              Find Events
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="animate-fade-up stagger-5 flex flex-wrap justify-center gap-12 mt-16">
          {[
            { num: "500+", label: "Live Events" },
            { num: "12k+", label: "Attendees" },
            { num: "50+", label: "Venues" },
          ].map(stat => (
            <div key={stat.label} className="text-center group cursor-default">
              <div className="font-display text-4xl text-foreground group-hover:text-primary transition-colors duration-300">{stat.num}</div>
              <div className="text-[9px] tracking-[0.2em] uppercase mt-2 text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground">Scroll</div>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}