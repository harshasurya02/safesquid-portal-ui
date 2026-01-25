"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { MemberCard } from "./member-card";
import { TeamGroup, Role } from "@/lib/team-data";

interface TeamSectionProps {
    team: TeamGroup;
    roles: Role[];
    orgId: string;
    onRefresh: () => void;
}

export function TeamSection({ team, roles, orgId, onRefresh }: TeamSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="border-b border-gray-100 last:border-b-0 pb-12 pt-8">
            <div className="flex items-center justify-between mb-8 cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
                <h2 className="text-xl font-medium text-gray-800">{team.name}</h2>
                <button className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <ChevronUp className={cn("w-5 h-5 transition-transform duration-200", !isExpanded && "rotate-180")} />
                </button>
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {team.members.map((member) => (
                        <MemberCard key={member.id} member={member} roles={roles} onRefresh={onRefresh} orgId={orgId} />
                    ))}
                </div>
            )}
        </div>
    );
}
