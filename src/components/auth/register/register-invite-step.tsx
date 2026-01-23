import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPost } from "@/services/api.service";

const inviteSchema = z.object({
    invites: z.array(
        z.object({
            email: z.string().email("Invalid email").or(z.literal("")),
            roleType: z.string().min(1, "Role is required"),
        })
    ).max(5, "Maximum 5 invites allowed"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export const RegisterInviteTeamStep = ({ orgId }: { orgId: string | null }) => {
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            invites: [
                { email: "", roleType: "Admin" },
            ],
        },
    });

    const { fields, append } = useFieldArray({
        control,
        name: "invites",
    });

    const onSubmit = async (data: InviteFormData) => {
        try {
            const validInvites = data.invites.filter((i) => i.email);
            await apiPost("/api/organization/invites", {
                organizationId: orgId,
                invites: validInvites,
            })
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to invite:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                    Invite your Team
                </h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 mb-2">
                        <div className="col-span-8 text-sm font-medium text-gray-700">
                            Email
                        </div>
                        <div className="col-span-4 text-sm font-medium text-gray-700">
                            Role
                        </div>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-4">
                                <div className="col-span-8">
                                    <StatefulInput
                                        placeholder="example@example.com"
                                        {...register(`invites.${index}.email`)}
                                        error={
                                            errors.invites?.[index]?.email?.message
                                        }
                                    />
                                </div>
                                <div className="col-span-4">
                                    <StatefulInput
                                        readOnly
                                        placeholder="Admin"
                                        value="Admin" // Simplified as per design which usually defaults or is fixed for initial setup, or we can make it editable.
                                        className="bg-gray-50 text-purple-600 font-medium"
                                        {...register(`invites.${index}.roleType`)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <button
                            type="button"
                            disabled={fields.length >= 5}
                            onClick={() => append({ email: "", roleType: "Admin" })}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Add another email {fields.length >= 5 && "(Limit reached)"}
                        </button>
                    </div>

                    <div className="pt-6">
                        <StatefulButton
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Setup Your First SafeSquid Instance
                        </StatefulButton>
                    </div>
                </form>
            </div>
        </div>
    );
};
