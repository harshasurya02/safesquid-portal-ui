import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiGet, apiPost } from "@/services/api.service";
import { Role } from "@/lib/team-data";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const inviteSchema = z.object({
    invites: z.array(
        z.object({
            email: z.string().email("Invalid email").or(z.literal("")),
            roleId: z.string().min(1, "Role is required"),
        })
    ).max(5, "Maximum 5 invites allowed"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export const RegisterInviteTeamStep = ({ orgId }: { orgId: string | null }) => {
    const router = useRouter();
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            invites: [
                { email: "", roleId: "" },
            ],
        },
    });

    const { fields, append } = useFieldArray({
        control,
        name: "invites",
    });

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await apiGet<Role[]>("/api/roles");
                setRoles(rolesData);
                if (rolesData.length > 0) {
                    setValue("invites.0.roleId", rolesData[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch roles:", error);
            } finally {
                setIsLoadingRoles(false);
            }
        };
        fetchRoles();
    }, [setValue]);

    const onSubmit = async (data: InviteFormData) => {
        try {
            const validInvites = data.invites.filter((i) => i.email);
            await apiPost("/api/organization/invites", {
                organizationId: orgId,
                invites: validInvites,
            })
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to invite:", error);
        }
    };

    if (isLoadingRoles) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Loading roles...</p>
            </div>
        );
    }

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
                        <div className="col-span-7 text-sm font-medium text-gray-700">
                            Email
                        </div>
                        <div className="col-span-5 text-sm font-medium text-gray-700">
                            Role
                        </div>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-4">
                                <div className="col-span-7">
                                    <StatefulInput
                                        placeholder="example@example.com"
                                        {...register(`invites.${index}.email`)}
                                        error={
                                            errors.invites?.[index]?.email?.message
                                        }
                                    />
                                </div>
                                <div className="col-span-5 h-[48px]">
                                    <Controller
                                        control={control}
                                        name={`invites.${index}.roleId`}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                value={value}
                                                onValueChange={onChange}
                                            >
                                                <SelectTrigger className="w-full h-full bg-gray-50 text-black font-medium">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id}>
                                                            {role.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <button
                            type="button"
                            disabled={fields.length >= 5}
                            onClick={() => append({ email: "", roleId: roles[0]?.id || "" })}
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
