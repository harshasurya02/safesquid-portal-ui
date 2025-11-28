import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Edit2, Eye, EyeOff } from "lucide-react";
import { StatefulInput } from "@/components/stateful-input";
import { StatefulButton } from "@/components/stateful-button";
// import { Edit } from "../icons/edit";
import { passwordSchema, type PasswordSchema } from "./schema";

interface PasswordStepProps {
    email: string;
    onBack: () => void;
    onNext: (password: string, confirm: string) => Promise<void>;
    isLoading: boolean;
    serverError?: string;
}

export function PasswordStep({
    email,
    onBack,
    onNext,
    isLoading,
    serverError,
}: PasswordStepProps) {
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordConditions, setPasswordConditions] = useState({
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
        setError,
    } = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    useEffect(() => {
        if (serverError) {
            setError("root", { message: serverError });
        }
    }, [serverError, setError]);

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

    const onSubmit = (data: PasswordSchema) => {
        onNext(data.password, data.confirmPassword);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                    <StatefulInput
                        type="email"
                        value={email}
                        disabled
                        className="bg-gray-50"
                        rightElement={
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                            >
                                <Edit2 className="w-6 h-6" />
                            </button>
                        }
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                    <StatefulInput
                        {...register("password")}
                        type={showPwd ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="pr-10"
                        error={errors.password?.message}
                        showClearButton={false}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPwd((s) => !s)}
                                className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                            >
                                {showPwd ? (
                                    <EyeOff className="w-6 h-6" />
                                ) : (
                                    <Eye className="w-6 h-6" />
                                )}
                            </button>
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                    Re-enter password
                </label>
                <div className="relative">
                    <StatefulInput
                        {...register("confirmPassword")}
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••••••"
                        error={errors.confirmPassword?.message}
                        className="pr-10"
                        showClearButton={false}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                            >
                                {showConfirm ? (
                                    <EyeOff className="w-6 h-6" />
                                ) : (
                                    <Eye className="w-6 h-6" />
                                )}
                            </button>
                        }
                        required
                    />
                </div>
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">For a strong password:</p>
                <p>
                    We recommend minimum{" "}
                    <span
                        className={
                            passwordConditions.minLength
                                ? "font-medium"
                                : "font-medium text-primary"
                        }
                    >
                        12 characters
                    </span>{" "}
                    with atleast{" "}
                    <span
                        className={passwordConditions.upperCase ? "" : "text-primary"}
                    >
                        one upper case
                    </span>
                    ,{" "}
                    <span
                        className={passwordConditions.lowerCase ? "" : "text-primary"}
                    >
                        lower case
                    </span>
                    ,{" "}
                    <span
                        className={passwordConditions.number ? "" : "text-primary"}
                    >
                        number
                    </span>{" "}
                    and{" "}
                    <span
                        className={passwordConditions.symbol ? "" : "text-primary"}
                    >
                        symbol
                    </span>
                </p>
            </div>

            {errors.root && (
                <div className="text-sm text-red-600">{errors.root.message}</div>
            )}

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
                    variant={isLoading ? "inactive" : "active"}
                    disabled={isLoading}
                    className="flex-1"
                >
                    {isLoading ? "Please wait..." : "Update password"}
                </StatefulButton>
            </div>
        </form>
    );
}
