"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  className?: string;
  value?: string;
  onReset?: () => void;
  error?: string; // new prop for error
}

export function OtpInput({
  length = 6,
  onComplete,
  className,
  value = "",
  onReset,
  error,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value === "") {
      setOtp(new Array(length).fill(""));
      inputRefs.current[0]?.focus();
    }
  }, [value, length]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    const char = val.slice(-1).toUpperCase(); // take last char and convert to uppercase
    if (!/^[0-9A-Z]?$/.test(char)) return; // allow only digits or uppercase letters

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // move to next input if not empty
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // call onComplete if all filled
    const otpValue = newOtp.join("");
    if (otpValue.length === length) {
      onComplete?.(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").toUpperCase();
    const pasteValues = pasteData.slice(0, length).split("");

    if (pasteValues.every((val) => /^[0-9A-Z]$/.test(val))) {
      const newOtp = [...otp];
      pasteValues.forEach((char, i) => {
        if (i < length) newOtp[i] = char;
      });
      setOtp(newOtp);

      const otpValue = newOtp.join("");
      if (otpValue.length === length) {
        onComplete?.(otpValue);
      }

      const nextIndex = Math.min(pasteValues.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="flex justify-between w-full">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "flex-1 max-w-12 rounded-sm md:max-w-15 md:rounded-lg h-12 text-center text-lg font-medium border border-gray-300 focus:outline-none focus:border-primary transition-colors uppercase",
              error && "border-destructive" // red border if error
            )}
            placeholder="0"
          />
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
