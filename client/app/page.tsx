"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { BACKEND_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // basic validation
    if (phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);

      const endpoint = role === "admin" ? "/admin/signup" : "/users/signup";
      const res = await axios.post(`${BACKEND_URL}${endpoint}`, {
        phone_number: phoneNumber,
      });

      const data = res.data;

      console.log("OTP:", data.otp);

      // navigate to otp page with phone number and role
      router.push(`/otp?phone=${phoneNumber}&role=${role}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome to Eventia</CardTitle>
          <CardDescription>
            Choose your role and enter your phone number
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-6"
          >
            <div className="flex p-1 bg-muted rounded-md">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-all ${
                  role === "user" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-all ${
                  role === "admin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin
              </button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Get Started"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}