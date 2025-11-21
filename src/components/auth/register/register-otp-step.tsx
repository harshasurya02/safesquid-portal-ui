import { Edit } from "@/components/icons/edit";
import { OtpInput } from "@/components/otp-input";
import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EnterpriseMessage from "./enterprise-message";
import { RegisterOtpFormData, registerOtpSchema } from "./register-schema";

interface RegisterOtpStepProps {
    email: string;
    onSuccess: (otp: string) => void;
    onEditEmail: () => void;
}

export const RegisterOtpStep = ({
    email,
    onSuccess,
    onEditEmail,
}: RegisterOtpStepProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    const {
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterOtpFormData>({
        resolver: zodResolver(registerOtpSchema),
        defaultValues: {
            otp: "",
        },
    });

    const otpValue = watch("otp");

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        setResendCooldown(30);
        const timer = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/signup/initiate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (data.success) {
                console.log("[v0] OTP resent successfully");
                setServerError(null);
            } else {
                setServerError("Failed to resend OTP");
            }
        } catch (err) {
            console.error("[v0] Resend OTP Error:", err);
            setServerError("Failed to resend OTP");
        }
    };

    const onSubmit = async (data: RegisterOtpFormData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/signup/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, otp: data.otp }),
                }
            );

            const result = await response.json();

            if (result.success) {
                console.log("[v0] Email verified successfully:", result);
                onSuccess(data.otp);
            } else {
                setServerError("Invalid OTP");
                setValue("otp", "");
            }
        } catch (err) {
            console.error("[v0] OTP Verification Error:", err);
            setServerError("Network error. Please try again.");
            setValue("otp", "");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7 md:space-y-8"
            noValidate
        >
            <EnterpriseMessage />

            <div>
                <label className="text-sm text-foreground mb-1 block">Email</label>
                <div className="relative">
                    <StatefulInput
                        type="email"
                        value={email}
                        disabled
                        className="bg-gray-50"
                    />
                    <button
                        type="button"
                        onClick={onEditEmail}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors h-[24px] w-[24px]"
                    >
                        <Edit />
                    </button>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">OTP</label>
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0}
                        className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {resendCooldown > 0
                            ? `Resend OTP (${resendCooldown}s)`
                            : "Resend OTP"}
                    </button>
                </div>
                <OtpInput
                    onComplete={(val) => {
                        setValue("otp", val);
                        handleSubmit(onSubmit)();
                    }}
                    value={otpValue}
                    error={errors.otp?.message || serverError || undefined}
                />
            </div>

            <StatefulButton
                type="submit"
                variant={isLoading ? "inactive" : "active"}
                disabled={isLoading}
            >
                {isLoading ? "Please wait..." : "Verify now"}
            </StatefulButton>
        </form>
    );
};
