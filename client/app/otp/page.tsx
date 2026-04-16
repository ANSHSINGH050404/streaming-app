"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState, Suspense } from "react";
import { BACKEND_URL } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

function OTPContent() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/admin/verify`, {
        phone_number: phoneNumber,
        otp: otp,
      });

      const data = res.data;

      localStorage.setItem("authToken", data.token);
      Cookies.set("authToken", data.token, { expires: 7 }); // Set cookie for 7 days
      router.push(`/dashboard`);
    } catch (err) {
      console.error(err);
      let errorMessage = "Verification failed";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.response?.data?.message || errorMessage;
      }
      alert(errorMessage);
    }
  };
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Verify OTP</h1>
        <p className="text-sm text-muted-foreground">
          Enter the code sent to{" "}
          <span className="font-medium text-foreground">{phoneNumber}</span>
        </p>
      </div>
      <Field className="w-fit">
        <FieldLabel htmlFor="digits-only">Otp</FieldLabel>
        <InputOTP
          id="digits-only"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
      <Button className="w-full" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default function InputOTPPattern() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <OTPContent />
      </Suspense>
    </div>
  );
}
