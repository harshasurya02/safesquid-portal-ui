import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { apiGet, apiPost } from "@/services/api.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createOrgSchema = z.object({
    name: z.string().min(1, "Organization name is required"),
});

type CreateOrgFormData = z.infer<typeof createOrgSchema>;

interface Invite {
    orgId: string;
    orgName: string;
    createdBy: string;
    inviteId: string;
    roleType: string;
    status: string;
    expiresAt: string;
    createdAt: string;
}

interface InvitesResponse {
    success: boolean;
    invites: Invite[];
}

interface RegisterOrganizationStepProps {
    email: string;
    // orgId?: string;
    onNext: (orgId: string) => void;
}

export interface OrganizationCreationResponse {
    success: boolean
    message: string
    organization: Organization
}

export interface Organization {
    id: string
    name: string
    slug: any
    logo: any
    email: any
    headquartersAddress: any
    industry: any
    employeeStrength: any
    countriesOfOperations: any
    totalLocations: any
    createdAt: string
    metadata: any
}


export const RegisterOrganizationStep = ({
    email,
    // orgId,
    onNext,
}: RegisterOrganizationStepProps) => {
    const router = useRouter();
    const [view, setView] = useState<"choice" | "create">("create");
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiGet<InvitesResponse>(`/api/organization/invites`, {
                    email: email
                });

                if (response.success && response.invites.length > 0) {
                    setInvites(response.invites);
                    setView("choice");
                } else {
                    setView("create");
                }
            } catch (err) {
                console.error("Failed to fetch invites:", err);
                setError("Failed to load invites");
                setView("create");
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchInvites();
        }
    }, [email]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateOrgFormData>({
        resolver: zodResolver(createOrgSchema),
    });

    const onCreateSubmit = async (data: CreateOrgFormData) => {
        try {
            // Mock API call
            // console.log("Creating organization:", data);
            const response: OrganizationCreationResponse = await apiPost("/api/organization", data);
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            onNext(response.organization.id);
        } catch (error) {
            console.error("Failed to create org:", error);
        }
    };

    const handleAcceptInvite = async (inviteId: string, orgId: string) => {
        try {
            console.log("Accepting invite:", inviteId, "for org:", orgId);
            // TODO: Implement actual API call to accept invite
            await apiPost("/api/organization/invites/accept", { inviteId, organizationId: orgId });
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to accept invite:", error);
        }
    };

    const handleDeclineInvite = async (inviteId: string) => {
        try {
            console.log("Declining invite:", inviteId);
            // TODO: Implement actual API call to decline invite
            await apiPost("/api/organization/invites/decline", { inviteId });
            // await new Promise((resolve) => setTimeout(resolve, 1000));

            // Remove the declined invite from the list
            setInvites(prev => prev.filter(invite => invite.inviteId !== inviteId));

            // If no more invites, switch to create view
            if (invites.length === 1) {
                setView("create");
            }
        } catch (error) {
            console.error("Failed to decline invite:", error);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Loading...
                    </h2>
                </div>
            </div>
        );
    }

    if (view === "choice" && invites.length > 0) {
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {invites.length === 1
                            ? "You've been invited to an organization"
                            : `You have ${invites.length} organization invites`
                        }
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Invite Cards */}
                    {invites.map((invite) => (
                        <div
                            key={invite.inviteId}
                            className="border border-gray-200 rounded-lg p-6 flex flex-col items-start text-left bg-white hover:border-blue-500 transition-colors"
                        >
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg text-gray-900">
                                    {invite.orgName}
                                </h3>
                                <div className="text-sm text-blue-600 mt-1">
                                    Role: {invite.roleType.replace(/_/g, ' ')}
                                </div>

                                <div className="text-xs text-gray-500 mt-2">
                                    Invited by: {invite.createdBy}
                                </div>

                                <div className="text-xs text-gray-400 mt-1">
                                    Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-auto flex space-x-3 w-full">
                                <StatefulButton
                                    onClick={() => handleAcceptInvite(invite.inviteId, invite.orgId)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Accept invite
                                </StatefulButton>
                                <button
                                    onClick={() => handleDeclineInvite(invite.inviteId)}
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Create Organization Card */}
                    <div
                        onClick={() => setView("create")}
                        className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-blue-500 transition-colors min-h-[200px]"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-3">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">
                            Create Organization
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                    Create your organization
                </h2>
            </div>

            <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-6">
                <div className="bg-white border boundary-gray-200 rounded-lg p-8 shadow-sm">
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Organization Name
                        </label>
                        <StatefulInput
                            placeholder="Acme Corporation"
                            error={errors.name?.message}
                            {...register("name")}
                        />
                    </div>

                    <StatefulButton
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Create Organization
                    </StatefulButton>
                </div>
            </form>
        </div>
    );
};
