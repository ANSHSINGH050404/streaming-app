"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { BACKEND_URL } from "@/lib/api";
import Navbar from "@/components/ui/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Camera, StopCircle } from "lucide-react";

export default function AdminScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setError(null);
      setScanResult(null);

      // Give a tiny bit of time for the div to be unhidden
      setTimeout(async () => {
        try {
          const html5QrCode = new Html5Qrcode("reader");
          html5QrCodeRef.current = html5QrCode;

          const config = { fps: 10, qrbox: { width: 250, height: 250 } };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              stopScanner();
              handleVerify(decodedText);
            },
            (errorMessage) => {
              // ignore
            }
          );
        } catch (err: any) {
          console.error("Failed to start scanner:", err);
          setError("Could not start camera. Please ensure permissions are granted.");
          setIsScanning(false);
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const handleVerify = async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.patch(
        `${BACKEND_URL}/events/bookings/${bookingId}/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScanResult(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Verification failed");
      if (err.response?.data?.booking) {
          setScanResult(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto pt-32 pb-20 px-6">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display uppercase tracking-widest">Entry Verification</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">Scan ticket QR code to verify entry</p>
          </div>

          <Card className="border-border shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera size={20} className="text-primary" />
                Scanner Terminal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!isScanning && !scanResult && !error && !loading && (
                <div className="py-20 flex flex-col items-center justify-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Camera size={40} className="text-primary" />
                  </div>
                  <Button onClick={startScanner} className="px-8 h-12 uppercase tracking-widest font-bold">
                    Start Camera
                  </Button>
                </div>
              )}

              <div className={`${!isScanning ? "hidden" : ""} relative`}>
                <div id="reader" className="w-full"></div>
                {isScanning && (
                   <div className="absolute top-4 right-4 z-10">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={stopScanner}
                        className="gap-2 uppercase tracking-widest text-[10px] font-bold"
                      >
                        <StopCircle size={14} /> Stop
                      </Button>
                   </div>
                )}
              </div>

              {loading && (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 size={40} className="text-primary animate-spin" />
                  <p className="text-xs uppercase tracking-[0.2em] font-bold">Verifying Ticket...</p>
                </div>
              )}

              {scanResult && (
                <div className={`p-8 text-center space-y-6 ${scanResult.message === "Check-in successful" ? "bg-green-500/5" : "bg-red-500/5"}`}>
                  <div className="flex justify-center">
                    {scanResult.message === "Check-in successful" ? (
                      <CheckCircle2 size={80} className="text-green-500" />
                    ) : (
                      <XCircle size={80} className="text-red-500" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className={`text-2xl font-bold uppercase tracking-wider ${scanResult.message === "Check-in successful" ? "text-green-600" : "text-red-600"}`}>
                      {scanResult.message}
                    </h2>
                    {scanResult.checkedInAt && (
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">
                        Already checked in at {new Date(scanResult.checkedInAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  {scanResult.booking && (
                    <div className="bg-background border border-border p-6 rounded-sm text-left space-y-4 max-w-sm mx-auto shadow-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Attendee</p>
                        <p className="font-semibold text-lg">{scanResult.booking.user.username || "Guest"}</p>
                        <p className="text-sm text-muted-foreground">{scanResult.booking.user.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Event</p>
                        <p className="font-semibold">{scanResult.booking.event.name}</p>
                        <p className="text-xs text-muted-foreground">{scanResult.booking.event.venue}</p>
                      </div>
                      <div className="pt-2 border-t border-border flex justify-between items-center">
                         <div>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Booking ID</p>
                            <p className="text-[9px] font-mono text-muted-foreground truncate w-40">{scanResult.booking.id}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Status</p>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Verified</span>
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button onClick={() => { setScanResult(null); startScanner(); }} variant="outline" className="px-8 uppercase tracking-widest font-bold">
                      Scan Next
                    </Button>
                  </div>
                </div>
              )}

              {error && !scanResult && (
                <div className="p-12 text-center bg-red-500/5 space-y-6">
                  <div className="flex justify-center">
                    <XCircle size={80} className="text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold uppercase tracking-wider text-red-600">Verification Error</h2>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                  <div className="pt-4">
                    <Button onClick={() => { setError(null); startScanner(); }} variant="outline" className="px-8 uppercase tracking-widest font-bold">
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
