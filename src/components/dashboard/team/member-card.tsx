"use client";

import { useState } from "react";
import { Trash2, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Member, Role } from "@/lib/team-data";
import { apiPatch, apiDelete } from "@/services/api.service";

interface MemberCardProps {
    member: Member;
    roles: Role[];
    orgId: string;
    onRefresh: () => void;
}

export function MemberCard({ member, roles, orgId, onRefresh }: MemberCardProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getRoleColorClass = (role: string) => {
        const roleLower = role.toLowerCase();
        if (roleLower.includes("cio")) return "text-warn";
        if (roleLower.includes("ceo")) return "text-purple-600";
        if (roleLower.includes("technical")) return "text-blue-500";
        if (roleLower.includes("sales")) return "text-blue-500";
        if (roleLower.includes("admin")) return "text-green-600";
        return "text-gray-500";
    };

    const handleRoleChange = async (newRoleId: string) => {
        setIsUpdating(true);
        setIsDropdownOpen(false);
        try {
            await apiPatch(`/api/organization/members/${member.id}/role?orgId=${orgId}`, { roleId: newRoleId });
            onRefresh();
        } catch (err: any) {
            alert(err.message || "Failed to update role");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to remove ${member.name} from the organization?`)) return;
        setIsDeleting(true);
        try {
            await apiDelete(`/api/organization/members/${member.id}?orgId=${orgId}`);
            onRefresh();
        } catch (err: any) {
            alert(err.message || "Failed to remove member");
            setIsDeleting(false);
        }
    };

    const currentRole = roles.find(r => r.id === member.roleId);

    return (
        <div className={cn(
            "bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative group",
            isDeleting && "opacity-50 pointer-events-none"
        )}>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>

            <div className="flex flex-col gap-1 mb-4">
                <h3 className="text-base font-medium text-gray-900">{member.name}</h3>
                <span className={cn("text-xs font-semibold uppercase tracking-wider", getRoleColorClass(member.role))}>
                    {member.role}
                </span>
            </div>

            <div className="space-y-1 mb-6">
                <p className="text-sm text-gray-500 break-all">{member.email}</p>
                <p className="text-sm text-gray-500">{member.phone}</p>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isUpdating}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-md hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                >
                    {isUpdating ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Updating...
                        </span>
                    ) : (
                        currentRole?.label || member.role
                    )}
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isDropdownOpen && "rotate-180")} />
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 max-h-48 overflow-y-auto">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleChange(role.id)}
                                className={cn(
                                    "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                                    role.id === member.roleId && "bg-primary/5 text-primary font-medium"
                                )}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
