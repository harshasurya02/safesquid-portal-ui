"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, Users, LogOut, Plus, Loader2, AlertCircle } from "lucide-react";
import { TeamSection } from "@/components/dashboard/team/team-section";
import { AddMemberDialog } from "@/components/dashboard/team/add-member-dialog";
import { TeamGroup, OrganizationSummary, Role, OrganizationData } from "@/lib/team-data";
import { apiGet, apiPost } from "@/services/api.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

function TeamContent() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const { selectedKeyId } = useUser()
    const [searchQuery, setSearchQuery] = useState("");
    const [teams, setTeams] = useState<OrganizationData>({ team: [], strength: 0, orgId: "" });
    const [roles, setRoles] = useState<Role[]>([]);
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [membersData, rolesData] = await Promise.all([
                apiGet<OrganizationData>(`/api/organization/members?keyId=${selectedKeyId}`),
                apiGet<Role[]>("/api/roles")
            ]);
            setTeams(membersData);
            setRoles(rolesData);
        } catch (err: any) {
            console.error("Error fetching team data:", err);
            setError(err.message || "Failed to load team data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedKeyId]);

    const handleLeaveOrganization = async () => {
        if (!confirm("Are you sure you want to leave this organization?")) return;
        try {
            await apiPost(`/api/organization/leave?orgId=${teams.orgId}`, {});
            router.push("/dashboard");
        } catch (err: any) {
            alert(err.message || "Failed to leave organization");
        }
    };

    // Filter teams and members based on search query
    const filteredTeams = teams.team.map(team => ({
        ...team,
        members: team.members.filter(member =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(team => team.members.length > 0);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-gray-500 font-medium">Loading team members...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8 max-w-3xl">
                <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Team</h2>
                    <p className="text-red-600 font-medium mb-6">{error}</p>
                    <button
                        onClick={fetchData}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8 md:px-12 lg:px-24">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-medium text-gray-900">Team</h1>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find members"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-500 whitespace-nowrap">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">Strength: {teams.strength}</span>
                        </div>
                        <button
                            onClick={handleLeaveOrganization}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Leave organization</span>
                        </button>
                        <button
                            onClick={() => setIsAddMemberDialogOpen(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-[#515def] text-white rounded-lg hover:bg-[#434dbd] transition-colors whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="text-sm font-medium">Member</span>
                        </button>
                    </div>
                </div>

                {/* Team Sections */}
                <div className="flex flex-col">
                    {filteredTeams.map((team) => (
                        <TeamSection key={team.id} team={team} roles={roles} onRefresh={fetchData} orgId={teams.orgId} />
                    ))}
                    {filteredTeams.length === 0 && !searchQuery && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Users className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg">No team members found</p>
                        </div>
                    )}
                    {filteredTeams.length === 0 && searchQuery && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Users className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg">No members found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            <AddMemberDialog
                open={isAddMemberDialogOpen}
                onOpenChange={setIsAddMemberDialogOpen}
                roles={roles}
                orgId={teams.orgId}
                onSuccess={fetchData}
            />
        </div>
    );
}

export default function TeamPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-gray-500 font-medium">Loading team members...</p>
            </div>
        }>
            <TeamContent />
        </Suspense>
    );
}
