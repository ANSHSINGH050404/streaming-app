"use client";
import React, { useState, useMemo } from 'react'
import Hero from '@/components/Hero'
import Navbar from '@/components/ui/navbar'
import EventCard, { Event } from '@/components/Card'

// Dummy Data
const DUMMY_EVENTS: readonly Event[] = [
  {
    id: "1",
    name: "Summer Midnight Gala",
    type: "Gala",
    tag: "Luxury",
    venue: "The Grand Palace, Mumbai",
    date: "2024-07-15",
    capacity: 50,
    price: 4999,
    available: true,
    amenities: ["Dinner Included", "Live Jazz", "Valet Parking"]
  },
  {
    id: "2",
    name: "Tech Pulse Conference 2024",
    type: "Conference",
    tag: "Trending",
    venue: "Innovation Hub, Bangalore",
    date: "2024-08-10",
    capacity: 120,
    price: 1500,
    available: true,
    amenities: ["Networking Lunch", "Swag Kits", "Workshop Access"]
  },
  {
    id: "3",
    name: "Acoustic Sunset Concert",
    type: "Concert",
    tag: "Sold Out Fast",
    venue: "Seaside Arena, Goa",
    date: "2024-06-20",
    capacity: 0,
    price: 2500,
    available: false,
    amenities: ["Beachside View", "Free Drinks", "Priority Entry"]
  },
  {
    id: "4",
    name: "Digital Marketing Workshop",
    type: "Workshop",
    venue: "Creative Space, Delhi",
    date: "2024-09-05",
    capacity: 25,
    price: 800,
    available: true,
    amenities: ["Certificate", "Study Material", "Mentorship"]
  },
  {
    id: "5",
    name: "Classical Symphony Night",
    type: "Concert",
    tag: "Featured",
    venue: "Royal Opera House, Mumbai",
    date: "2024-12-12",
    capacity: 15,
    price: 3500,
    available: true,
    amenities: ["Premium Seating", "Meet & Greet", "Souvenir"]
  },
  {
    id: "6",
    name: "Annual Startup Summit",
    type: "Conference",
    venue: "Convention Center, Hyderabad",
    date: "2024-11-15",
    capacity: 300,
    price: 2000,
    available: true,
    amenities: ["Investor Pitch", "Lunch", "Exhibition Pass"]
  }
] as const;

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState("");

  const filteredEvents = useMemo(() => {
    return DUMMY_EVENTS.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDate = date === "" || event.date === date;
      
      return matchesSearch && matchesDate;
    });
  }, [searchQuery, date]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        date={date}
        setDate={setDate}
      />
      
      <section id="events-list" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-xs tracking-[0.3em] uppercase text-primary font-bold">Discover</h2>
            <h3 className="font-display text-4xl md:text-5xl text-foreground">Upcoming Events</h3>
          </div>
          
          <div className="text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <span className="w-12 h-px bg-border"></span>
            Showing {filteredEvents.length} results
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground uppercase tracking-widest text-xs">No events found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(""); setDate(""); }}
              className="mt-4 text-primary text-xs uppercase tracking-widest font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard