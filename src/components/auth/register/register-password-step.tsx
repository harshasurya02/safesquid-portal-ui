import { Edit } from "@/components/icons/edit";
import { InfoTooltip } from "@/components/info-tooltip";
import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterPasswordFormData, registerPasswordSchema } from "./register-schema";

interface RegisterPasswordStepProps {
    email: string;
    onSuccess: () => void;
    onEditEmail: () => void;
}

type PasswordCondition = {
    upperCase: boolean;
    lowerCase: boolean;
    symbol: boolean;
    number: boolean;
    minLength: boolean;
};

export const RegisterPasswordStep = ({
    email,
    onSuccess,
    onEditEmail,
}: RegisterPasswordStepProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordConditions, setPasswordConditions] =
        useState<PasswordCondition>({
            upperCase: false,
            lowerCase: false,
            number: false,
            minLength: false,
            symbol: false,
        });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterPasswordFormData>({
        resolver: zodResolver(registerPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    useEffect(() => {
        const checkPasswordConditions = (pass: string) => {
            setPasswordConditions({
                upperCase: /[A-Z]/.test(pass),
                lowerCase: /[a-z]/.test(pass),
                number: /[0-9]/.test(pass),
                minLength: pass.length >= 12,
                symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass),
            });
        };

        checkPasswordConditions(password || "");
    }, [password]);

    const onSubmit = async (data: RegisterPasswordFormData) => {
        setIsLoading(true);
        setServerError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/signup/set-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password: data.password,
                        confirmPassword: data.confirmPassword,
                    }),
                }
            );

            const result = await response.json();

            if (result.success) {
                console.log("[v0] Password set successfully:", result);
                onSuccess();
            } else {
                setServerError("Failed to set password");
            }
        } catch (err) {
            console.error("[v0] Set Password Error:", err);
            setServerError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 md:space-y-6"
            noValidate
        >
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
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer h-[24px] w-[24px]"
                        >
                            <Edit />
                        </button>}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                <StatefulInput
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="pr-10"
                    error={errors.password?.message || serverError || undefined}
                    showClearButton={false}
                    rightElement={
                        <div
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                        >
                            {showRegisterPassword ? (
                                <InfoTooltip content={"Hide Password"}>
                                    <EyeOff className="w-6 h-6" />
                                </InfoTooltip>
                            ) : (
                                <InfoTooltip content={"Show Password"}>
                                    <Eye className="w-6 h-6" />
                                </InfoTooltip>
                            )}
                        </div>
                    }
                    {...register("password")}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                    Re-enter password
                </label>
                <StatefulInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    error={errors.confirmPassword?.message || undefined}
                    showClearButton={false}
                    rightElement={
                        <div
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <InfoTooltip content={"Hide Password"}>
                                    <EyeOff className="w-6 h-6" />
                                </InfoTooltip>
                            ) : (
                                <InfoTooltip content={"Show Password"}>
                                    <Eye className="w-6 h-6" />
                                </InfoTooltip>
                            )}
                        </div>
                    }
                    {...register("confirmPassword")}
                />
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">For a strong password:</p>
                <p>
                    We recommend minimum{" "}
                    <span
                        className={
                            passwordConditions.minLength
                                ? "font-medium "
                                : "font-medium text-primary"
                        }
                    >
                        12 characters
                    </span>{" "}
                    with atleast{" "}
                    <span className={passwordConditions.upperCase ? "" : "text-primary"}>
                        one upper case
                    </span>
                    ,{" "}
                    <span className={passwordConditions.lowerCase ? "" : "text-primary"}>
                        lower case
                    </span>
                    ,{" "}
                    <span className={passwordConditions.number ? "" : "text-primary"}>
                        number
                    </span>{" "}
                    and{" "}
                    <span className={passwordConditions.symbol ? "" : "text-primary"}>
                        symbol
                    </span>
                </p>
            </div>

            <div className="flex flex-col md:flex-row space-x-5 space-y-2">
                <StatefulButton type="submit" variant="active" className="flex-1 h-12">
                    Configure authentication
                </StatefulButton>
            </div>
        </form>
    );
};
