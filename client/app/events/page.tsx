"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { BACKEND_URL } from "@/lib/api";
import axios from "axios";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Plus, Calendar, MapPin, Tag, Users, IndianRupee } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const eventSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["Concert", "Workshop", "Gala", "Conference"]),
  tag: z.string().min(2, "Tag is required"),
  venue: z.string().min(3, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  amenities: z.array(z.string()).min(1, "Add at least one amenity"),
});

type EventForm = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const [amenityInput, setAmenityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      amenities: [],
      type: "Concert",
    },
  });

  const amenities = watch("amenities") || [];

  const addAmenity = () => {
    if (!amenityInput.trim()) return;
    if (amenities.includes(amenityInput.trim())) {
        setAmenityInput("");
        return;
    }
    setValue("amenities", [...amenities, amenityInput.trim()]);
    setAmenityInput("");
  };

  const removeAmenity = (index: number) => {
    setValue(
      "amenities",
      amenities.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: EventForm) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${BACKEND_URL}/events`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Event created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="font-display text-4xl text-foreground">Host an Event</h1>
                <p className="text-muted-foreground text-sm uppercase tracking-widest">Create a premium experience for your guests</p>
            </div>
            <Link href="/dashboard">
                <Button variant="outline" size="sm" className="text-xs uppercase tracking-widest">
                    Cancel
                </Button>
            </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">General Information</CardTitle>
                  <CardDescription>Basic details about your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Event Title</Label>
                    <Input id="name" {...register("name")} placeholder="e.g. Midnight Jazz Symphony" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      {...register("description")}
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell guests what makes this event special..."
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Event Type</Label>
                      <select
                        id="type"
                        {...register("type")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="Concert">Concert</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Gala">Gala</option>
                        <option value="Conference">Conference</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tag" className="flex items-center gap-2">
                        <Tag size={12} /> Tag
                      </Label>
                      <Input id="tag" {...register("tag")} placeholder="e.g. Exclusive" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Venue & Timing</CardTitle>
                  <CardDescription>Where and when will it happen?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="venue" className="flex items-center gap-2">
                      <MapPin size={14} /> Venue Location
                    </Label>
                    <Input id="venue" {...register("venue")} placeholder="Full address or venue name" />
                    {errors.venue && <p className="text-xs text-destructive">{errors.venue.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar size={14} /> Date & Time
                    </Label>
                    <Input id="date" type="datetime-local" {...register("date")} />
                    {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Ticketing</CardTitle>
                  <CardDescription>Capacity and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="flex items-center gap-2">
                      <Users size={14} /> Total Capacity
                    </Label>
                    <Input 
                      id="capacity" 
                      type="number" 
                      {...register("capacity", { valueAsNumber: true })} 
                    />
                    {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <IndianRupee size={14} /> Ticket Price
                    </Label>
                    <Input 
                      id="price" 
                      type="number" 
                      {...register("price", { valueAsNumber: true })} 
                    />
                    {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Amenities</CardTitle>
                  <CardDescription>What's included?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={amenityInput}
                      onChange={(e) => setAmenityInput(e.target.value)}
                      onKeyDown={(e) => {
                          if (e.key === "Enter") {
                              e.preventDefault();
                              addAmenity();
                          }
                      }}
                      placeholder="e.g. WiFi"
                      className="flex-1"
                    />
                    <Button type="button" size="icon" onClick={addAmenity}>
                      <Plus size={16} />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {amenities.map((a, i) => (
                      <div
                        key={i}
                        className="bg-muted text-foreground text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-sm flex items-center gap-2 border border-border group"
                      >
                        {a}
                        <button
                          type="button"
                          onClick={() => removeAmenity(i)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.amenities && <p className="text-xs text-destructive">{errors.amenities.message}</p>}
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full h-12 text-xs uppercase tracking-[0.2em] font-bold"
                disabled={loading}
              >
                {loading ? "Creating..." : "Launch Event"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
