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
}

export function OtpInput({
  length = 6,
  onComplete,
  className,
  value = "",
  onReset,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value === "") {
      setOtp(new Array(length).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }, [value, length]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Allow only single digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all fields are filled
    const otpValue = newOtp.join("");
    if (otpValue.length === length) {
      onComplete?.(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const pasteValues = pasteData.slice(0, length).split("");

    if (pasteValues.every((val) => !isNaN(Number(val)))) {
      const newOtp = [...otp];
      pasteValues.forEach((value, index) => {
        if (index < length) {
          newOtp[index] = value;
        }
      });
      setOtp(newOtp);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(pasteValues.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      // Call onComplete if all fields are filled
      const otpValue = newOtp.join("");
      if (otpValue.length === length) {
        onComplete?.(otpValue);
      }
    }
  };

  return (
    <div className={cn("flex justify-between w-full", className)}>
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="flex-1 max-w-[60px] h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="0"
        />
      ))}
    </div>
  );
}
