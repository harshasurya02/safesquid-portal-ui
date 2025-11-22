import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { StatefulInput } from "@/components/stateful-input";
import { StatefulButton } from "@/components/stateful-button";
import { emailSchema, type EmailSchema } from "./schema";

interface EmailStepProps {
    defaultEmail: string;
    onNext: (email: string) => Promise<void>;
    isLoading: boolean;
    serverError?: string;
}

export function EmailStep({
    defaultEmail,
    onNext,
    isLoading,
    serverError,
}: EmailStepProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailSchema>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: defaultEmail,
        },
    });

    const onSubmit = (data: EmailSchema) => {
        onNext(data.email);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 md:space-y-8" noValidate>
            <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Email</label>
                <StatefulInput
                    {...register("email")}
                    type="email"
                    placeholder="mukunds735@safesquid.net"
                    error={errors.email?.message || serverError}
                    required
                />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                <StatefulButton
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/auth/login")}
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
                    {isLoading ? "Please wait..." : "Send OTP"}
                </StatefulButton>
            </div>
        </form>
    );
}
