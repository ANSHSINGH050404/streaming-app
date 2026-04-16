"use client";
import React, { useState, useMemo, useEffect } from 'react'
import Hero from '@/components/Hero'
import Navbar from '@/components/ui/navbar'
import EventCard from '@/components/Card'
import { useEventStore } from '@/lib/api'

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState("");
  
  const { events, fetchEvents, loading } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDate = date === "" || event.date.includes(date);
      
      return matchesSearch && matchesDate;
    });
  }, [events, searchQuery, date]);

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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
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