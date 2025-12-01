import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StatefulInput } from "@/components/stateful-input";
import { StatefulButton } from "@/components/stateful-button";
import { OtpInput } from "@/components/otp-input";
import { otpSchema, type OtpSchema } from "./schema";
import { useEffect } from "react";
import { Edit2 } from "lucide-react";

interface OtpStepProps {
    email: string;
    onBack: () => void;
    onNext: (otp: string) => Promise<void>;
    onResend: () => void;
    resendCooldown: number;
    isLoading: boolean;
    serverError?: string;
}

export function OtpStep({
    email,
    onBack,
    onNext,
    onResend,
    resendCooldown,
    isLoading,
    serverError,
}: OtpStepProps) {
    const {
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm<OtpSchema>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    });

    const otpValue = watch("otp");

    useEffect(() => {
        if (serverError) {
            setError("otp", { message: serverError });
        }
    }, [serverError, setError]);

    const onSubmit = (data: OtpSchema) => {
        onNext(data.otp);
    };

    const handleOtpComplete = (value: string) => {
        setValue("otp", value);
        clearErrors("otp");
        handleSubmit(onSubmit)();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-7 lg:space-y-8" noValidate>
            <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                    <StatefulInput
                        type="email"
                        value={email}
                        disabled
                        className="bg-gray-50"
                        rightElement={
                            <div
                                onClick={onBack}
                                className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                                aria-label="Edit email"
                            >
                                <Edit2 className="w-6 h-6" />
                            </div>
                        }
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">OTP</label>
                    <button
                        type="button"
                        onClick={onResend}
                        disabled={resendCooldown > 0}
                        className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                    >
                        {resendCooldown > 0
                            ? `Resend OTP (${resendCooldown}s)`
                            : "Resend OTP"}
                    </button>
                </div>
                <OtpInput
                    onComplete={handleOtpComplete}
                    value={otpValue}
                    error={errors.otp?.message}
                />
            </div>

            <div className="flex flex-col md:flex-row md:gap-x-5 gap-y-2">
                <StatefulButton
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                >
                    Back
                </StatefulButton>
                <StatefulButton
                    type="submit"
                    variant="active"
                    onClick={() => handleSubmit(onSubmit)()}
                    className="flex-1"
                >
                    {isLoading ? "Please wait..." : "Update password"}
                </StatefulButton>
            </div>
        </form>
    );
}
