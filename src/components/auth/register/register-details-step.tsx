import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterDetailsFormData, registerDetailsSchema } from "./register-schema";

interface RegisterDetailsStepProps {
    email: string;
    onEditEmail: () => void;
    onBack: () => void;
    onSuccess?: () => void;
}

export const RegisterDetailsStep = ({
    email,
    onEditEmail,
    onBack,
    onSuccess,
}: RegisterDetailsStepProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterDetailsFormData>({
        resolver: zodResolver(registerDetailsSchema),
        defaultValues: {
            name: "",
            designation: "",
            phone: "",
            countryCode: "+91",
        },
    });

    const onSubmit = async (data: RegisterDetailsFormData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/signup/complete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        name: data.name,
                        designation: data.designation,
                        phone: `${data.countryCode}${data.phone}`,
                    }),
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (result.success) {
                console.log("[v0] Signup completed successfully:", result);
                // Store user data temporarily or redirect to login
                localStorage.setItem("signupComplete", "true");
                localStorage.setItem("signupEmail", email);

                if (result.session) {
                    // router.push("/dashboard"); // Handled by parent
                    if (onSuccess) onSuccess();
                }
            } else {
                setServerError(
                    result.message || "Registration failed. Please try again."
                );
            }
        } catch (err) {
            console.error("[v0] Signup Complete Error:", err);
            setServerError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-5 lg:space-y-6"
            noValidate
        >
            <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                <StatefulInput
                    type="text"
                    placeholder="Mukund Sharma"
                    error={errors.name?.message || undefined}
                    {...register("name")}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <div className="relative">
                    <StatefulInput
                        type="email"
                        value={email}
                        disabled
                        className="bg-gray-50"
                        rightElement={<button
                            type="button"
                            onClick={onEditEmail}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                        >
                            <Edit2 className="w-6 h-6" />
                        </button>}
                    />

                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Role</label>
                <StatefulInput
                    type="text"
                    placeholder="CIO"
                    error={errors.designation?.message || undefined}
                    {...register("designation")}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                    Phone Number
                </label>
                <div className="flex w-full space-x-2">
                    {/* Country Code */}
                    <div className="flex-shrink-0 relative">
                        <select
                            className="h-12 appearance-none bg-white border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                            {...register("countryCode")}
                        >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="flex-1 h-12 w-full">
                        <StatefulInput
                            type="tel"
                            placeholder="98765 43219"
                            error={errors.phone?.message || serverError || undefined}
                            {...register("phone")}
                        />
                    </div>
                </div>
            </div>

            <div className="flex space-x-3">
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
                    variant={isLoading ? "inactive" : "active"}
                    disabled={isLoading}
                    className="flex-1"
                >
                    {isLoading ? "Please wait..." : "Organization"}
                </StatefulButton>
            </div>

            <div className="text-center text-sm text-gray-500">
                Invitation from SafeSquid Labs
            </div>
        </form>
    );
};
