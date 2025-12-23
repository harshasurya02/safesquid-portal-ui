"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LineChart, 
  History, 
  Ban, 
  Pencil, 
  Trash2, 
  Key 
} from "lucide-react";
import { InstanceDetails } from "@/services/instance.service";
import { EditInstanceDialog } from "./edit-instance-dialog";

interface InstanceHeaderProps {
    instanceDetails: InstanceDetails;
    activeTab: 'graphs' | 'history';
}

export function InstanceHeader({ instanceDetails, activeTab }: InstanceHeaderProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const router = useRouter();

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const handleUpdateSuccess = () => {
        router.refresh();
    };

    return (
        <div className="flex flex-col gap-4">
            <EditInstanceDialog 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                instanceDetails={instanceDetails}
                onSuccess={handleUpdateSuccess}
            />
            {/* Top Row: Title & Actions */}
            <div className="flex items-start justify-between">
                 <div>
                    <div className="flex items-center gap-2 text-xl text-gray-900 font-semibold">
                        <Link href="/dashboard/instances" className="text-gray-400 hover:text-gray-600">Instances</Link>
                        <span className="text-gray-300">/</span>
                        <span>{instanceDetails.instanceName}</span>
                    </div>
                 </div>
                 
                 {/* Action Toolbar */}
                 <div className="flex items-center gap-2">
                     <Link 
                        href={`/dashboard/instances/${instanceDetails.id}`} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${
                            activeTab === 'graphs' 
                                ? 'bg-gray-100 text-gray-700' 
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                     >
                         <LineChart className="w-4 h-4" />
                         Graphs
                     </Link>
                     <Link 
                        href={`/dashboard/instances/${instanceDetails.id}/history`} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${
                            activeTab === 'history' 
                                ? 'bg-gray-100 text-gray-700' 
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                     >
                         <History className="w-4 h-4" />
                         History
                     </Link>
                     <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium">
                         <Ban className="w-4 h-4" />
                         {instanceDetails.status === "active" ? "Deactivate" : "Activate"}
                     </button>
                     <button 
                         onClick={() => setIsEditOpen(true)}
                         className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium"
                     >
                         <Pencil className="w-4 h-4" />
                         Edit
                     </button>
                     <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium">
                         <Trash2 className="w-4 h-4" />
                         Delete
                     </button>
                     <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium">
                         <Key className="w-4 h-4" />
                         Key
                     </button>
                 </div>
            </div>

            {/* Bottom Row: Metadata */}
            <div className="flex items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-400">Service Id:</span>
                    <span>{instanceDetails.id}</span>
                </span>
                <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-400">Version:</span>
                    <span>{instanceDetails.version}</span>
                </span>
                <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-400">Activation Date:</span>
                    <span>{formatDate(instanceDetails.createdAt)}</span>
                </span>
                <span>IP: {instanceDetails.ipAddress}</span>
                <span>{instanceDetails.location}</span>
            </div>
        </div>
    );
}
