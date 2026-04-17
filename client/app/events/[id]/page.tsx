"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BACKEND_URL, useEventStore } from "@/lib/api";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Check,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";
import { Event, EVENT_PATTERNS } from "@/components/Card";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [seatType, setSeatType] = useState<"Silver" | "Gold" | "Diamond">("Silver");

  useEffect(() => {
    setMounted(true);
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleBook = async () => {
    setBooking(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/");
        return;
      }

      await axios.post(
        `${BACKEND_URL}/events/${id}/book`,
        {
          quantity: parseInt(quantity),
          type: seatType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Booking successful!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-display">Event not found</h1>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors uppercase text-[10px] tracking-widest font-bold"
        >
          <ChevronLeft size={14} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Visual & Description */}
          <div className="lg:col-span-2 space-y-8">
            <div
              className="h-[400px] w-full bg-muted bg-cover bg-center border border-border"
              style={{ backgroundImage: EVENT_PATTERNS[event.type] }}
            />

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold">
                    {event.type}
                  </span>
                  {event.tag && (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      {event.tag}
                    </span>
                  )}
                </div>
                <h1 className="font-display text-5xl text-foreground">
                  {event.name}
                </h1>
              </div>

              <p className="text-muted-foreground leading-relaxed text-lg">
                {event.description || "No description provided for this event."}
              </p>

              <div className="space-y-4 pt-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-primary">
                  What's Included
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {event.amenities.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm text-foreground bg-card border border-border p-4"
                    >
                      <Check size={16} className="text-primary" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="space-y-8">
            <Card className="sticky top-32 border-2 border-primary/10 shadow-xl">
              <CardHeader className="bg-muted/30 pb-8">
                <CardTitle className="text-2xl font-display">
                  Reserve Your Spot
                </CardTitle>
                <CardDescription>
                  Secure your tickets for this event
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2 uppercase tracking-widest font-medium text-[10px]">
                      <Calendar size={14} className="text-primary" /> Date
                    </span>
                    <span className="text-foreground font-semibold">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2 uppercase tracking-widest font-medium text-[10px]">
                      <MapPin size={14} className="text-primary" /> Venue
                    </span>
                    <span className="text-foreground font-semibold">
                      {event.venue}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2 uppercase tracking-widest font-medium text-[10px]">
                      Seat Type
                    </span>
                    <div className="flex bg-muted p-1 rounded-md">
                      {(["Silver", "Gold", "Diamond"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setSeatType(type)}
                          className={`px-3 py-1 text-[9px] uppercase tracking-tighter font-bold rounded-sm transition-all ${
                            seatType === type
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label
                      htmlFor="quantity"
                      className="text-muted-foreground flex items-center gap-2 uppercase tracking-widest font-medium text-[10px]"
                    >
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={event.capacity}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-16 rounded-md border border-input bg-background px-2 py-1 text-right text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2 uppercase tracking-widest font-medium text-[10px]">
                      <Users size={14} className="text-primary" /> Availability
                    </span>
                    <span className="text-foreground font-semibold">
                      {event.capacity} spots left
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      Total Price
                    </span>
                    <div className="font-display text-4xl text-foreground flex items-center gap-1">
                      <IndianRupee size={24} className="text-primary" />
                      {event.price}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-14 text-xs uppercase tracking-[0.2em] font-bold"
                  onClick={handleBook}
                  disabled={booking || !event.available}
                >
                  {booking
                    ? "Processing..."
                    : event.available
                      ? "Confirm Booking"
                      : "Sold Out"}
                </Button>

                <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest">
                  Secure checkout powered by Eventia
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
