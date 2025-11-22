"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { EmailStep } from "./email-step";
import { OtpStep } from "./otp-step";
import { PasswordStep } from "./password-step";
import { SuccessStep } from "./success-step";

type Step = "email" | "otp" | "password" | "success";

export function ForgotPasswordForm() {
    const qp = useSearchParams();
    const prefillEmail = qp.get("email") || "";

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState(prefillEmail);
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | undefined>(undefined);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);

    useEffect(() => {
        if (prefillEmail) setEmail(prefillEmail);
    }, [prefillEmail]);

    async function initiate(emailValue: string) {
        setIsLoading(true);
        setServerError(undefined);
        setEmail(emailValue);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/initiate`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailValue }),
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
            setServerError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function verifyOtp(otpValue: string) {
        setIsLoading(true);
        setServerError(undefined);
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
                setServerError(data?.message || "Invalid OTP");
            }
        } catch {
            setServerError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function complete(password: string, confirmPassword: string) {
        setIsLoading(true);
        setServerError(undefined);

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
                        confirmPassword,
                    }),
                }
            );
            const data = await res.json();
            if (data?.success) {
                setStep("success");
            } else {
                setServerError("Failed to update password");
            }
        } catch {
            setServerError("Network error. Please try again.");
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
        setServerError(undefined);
        // if (step === "otp")
        setStep("email");
        // else if (step === "password") setStep("otp");
    }

    if (step === "success") {
        return <SuccessStep />;
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="w-full ">
                <div className="w-full space-y-6 md:bg-white md:rounded-xl md:shadow-[0_4px_30px_0_rgba(255,106,41,0.10)] md:p-15 md:space-y-[2.625rem]">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Password Reset
                        </h1>
                    </div>

                    {step === "email" && (
                        <EmailStep
                            defaultEmail={email}
                            onNext={initiate}
                            isLoading={isLoading}
                            serverError={serverError}
                        />
                    )}

                    {step === "otp" && (
                        <OtpStep
                            email={email}
                            onBack={back}
                            onNext={verifyOtp}
                            onResend={resendOtp}
                            resendCooldown={resendCooldown}
                            isLoading={isLoading}
                            serverError={serverError}
                        />
                    )}

                    {step === "password" && (
                        <PasswordStep
                            email={email}
                            onBack={back}
                            onNext={complete}
                            isLoading={isLoading}
                            serverError={serverError}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
