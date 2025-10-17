"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Edit2 } from "lucide-react";
import { StatefulInput } from "@/components/stateful-input";
import { StatefulButton } from "@/components/stateful-button";
import { OtpInput } from "@/components/otp-input";

type Step = "email" | "otp" | "password" | "success";

export function ForgotPasswordForm() {
  const router = useRouter();
  const qp = useSearchParams();
  const prefillEmail = qp.get("email") || "";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
  }, [prefillEmail]);

  const passwordValid = useMemo(() => {
    const lengthOk = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const digit = /[0-9]/.test(password);
    return lengthOk && upper && lower && digit;
  }, [password]);

  async function initiate(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/initiate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        setExpiresAt(data.expiresAt || null);
        setStep("otp");
      } else {
        // Security note: API may return success for non-existent emails. We show generic success UX.
        setStep("otp");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOtp(otpValue: string) {
    setIsLoading(true);
    setError("");
    setOtp(otpValue);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpValue }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        setStep("password");
      } else {
        setError(data?.message || "Invalid OTP");
        setOtp("");
      }
    } catch {
      setError("Network error. Please try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  }

  async function complete(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordValid) {
      setError(
        "Password must be at least 8 chars and include upper, lower, and a number."
      );
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            password,
            confirmPassword: confirm,
          }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        setStep("success");
      } else {
        setError(data?.message || "Failed to update password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    const timer = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (data?.success && data.expiresAt) {
        setExpiresAt(data.expiresAt);
      }
    } catch {
      // silently ignore per UX
    }
  }

  function back() {
    setError("");
    if (step === "otp") setStep("email");
    else if (step === "password") setStep("otp");
  }

  if (step === "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 text-center">
          <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-xl">✓</span>
          </div>
          <h2 className="font-semibold text-gray-900">Password Updated</h2>
          <p className="text-sm text-gray-600 mt-1">
            Use your new password to login.
          </p>
          <div className="mt-4">
            <StatefulButton
              variant="active"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </StatefulButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full ">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Password Reset
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step: Email */}
          {step === "email" && (
            <form onSubmit={initiate} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <StatefulInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mukunds735@safesquid.net"
                  required
                />
              </div>

              <StatefulButton
                type="submit"
                variant={isLoading ? "inactive" : "active"}
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Send OTP"}
              </StatefulButton>
            </form>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <StatefulInput
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Edit email"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    OTP
                  </label>
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={resendCooldown > 0}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                  >
                    {resendCooldown > 0
                      ? `Resend OTP (${resendCooldown}s)`
                      : "Resend OTP"}
                  </button>
                </div>
                <OtpInput onComplete={verifyOtp} value={otp} />
                <p className="text-xs text-gray-500">
                  6-digit code. Expires in 10 minutes.
                </p>
              </div>

              <div className="flex space-x-3">
                <StatefulButton
                  type="button"
                  variant="inactive"
                  onClick={back}
                  className="flex-1"
                >
                  Back
                </StatefulButton>
                <StatefulButton
                  type="button"
                  variant="active"
                  onClick={() => verifyOtp(otp)}
                  className="flex-1"
                >
                  {isLoading ? "Please wait..." : "Update password"}
                </StatefulButton>
              </div>
            </form>
          )}

          {/* Step: Password */}
          {step === "password" && (
            <form onSubmit={complete} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <StatefulInput
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setStep("otp")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <StatefulInput
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Re-enter password
                </label>
                <div className="relative">
                  <StatefulInput
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">For a strong password:</p>
                <p>
                  Minimum <span className="font-medium">8 characters</span> with
                  at least <span className="text-blue-600">one uppercase</span>,{" "}
                  <span className="text-blue-600">one lowercase</span>, and{" "}
                  <span className="text-blue-600">one number</span>.
                </p>
              </div>

              <div className="flex space-x-3">
                <StatefulButton
                  type="button"
                  variant="inactive"
                  onClick={back}
                  className="flex-1"
                >
                  Back
                </StatefulButton>
                <StatefulButton
                  type="submit"
                  variant={isLoading ? "inactive" : "active"}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Please wait..." : "Update password"}
                </StatefulButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
