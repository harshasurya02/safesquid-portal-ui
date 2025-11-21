import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Repeat2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import EnterpriseMessage from "./enterprise-message";
import { RegisterEmailFormData, registerEmailSchema } from "./register-schema";

interface RegisterEmailStepProps {
    defaultEmail: string;
    onSuccess: (email: string) => void;
}

export const RegisterEmailStep = ({
    defaultEmail,
    onSuccess,
}: RegisterEmailStepProps) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [serverError, setServerError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterEmailFormData>({
        resolver: zodResolver(registerEmailSchema),
        defaultValues: {
            email: defaultEmail,
            terms: false, // Default to false, user must check
        },
    });

    const onSubmit = async (data: RegisterEmailFormData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/signup/initiate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: data.email }),
                }
            );

            const result = await response.json();

            if (result.success) {
                console.log("[v0] OTP sent successfully:", result);
                // Pass the email back to parent to update state if needed, though it might be redundant if parent holds state
                onSuccess(data.email);
            } else {
                setServerError("Email already exists");
            }
        } catch (err) {
            console.error("[v0] API Error:", err);
            setServerError("Network error. Please try again.");
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
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <StatefulInput
                    type="email"
                    placeholder="mukunds735@safesquid.net"
                    error={errors.email?.message || serverError || undefined}
                    {...register("email")}
                />
            </div>


            <div className="">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className={`w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary ${errors.terms ? "border-destructive" : ""
                            }`}
                        {...register("terms")}
                    />
                    <label htmlFor="terms" className={`text-sm text-gray-600 `}>
                        I agree to the{" "}
                        <Link
                            href="#"
                            className="text-blue-600 hover:text-blue-700 underline"
                        >
                            Terms & Conditions
                        </Link>
                    </label>
                </div>
                <div className="min-h-[20px] -mb-[20px]">
                    {errors.terms && (
                        <p className="text-sm text-destructive">{errors.terms.message}</p>
                    )}
                </div>
            </div>
            <div className="space-y-[18px]">
                <StatefulButton
                    type="submit"
                    variant={isLoading ? "inactive" : "active"}
                    disabled={isLoading}
                >
                    {isLoading ? "Please wait..." : "Verify email"}
                </StatefulButton>

                <div className="text-center text-sm text-muted">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-4 h-4 flex-shrink-0" size={16} />
                            <span>No Credit Card required</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Repeat2 className="w-4 h-4 flex-shrink-0" size={16} />
                            <span>Free Forever</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
