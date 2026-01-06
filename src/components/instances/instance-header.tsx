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
import { InstanceDetails, toggleInstanceActivation } from "@/services/instance.service";
import { EditInstanceDialog } from "./edit-instance-dialog";

interface InstanceHeaderProps {
    instanceDetails: InstanceDetails;
    activeTab: 'graphs' | 'history';
}

export function InstanceHeader({ instanceDetails, activeTab }: InstanceHeaderProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
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

    const handleToggleActivation = async () => {
        try {
            setIsActivating(true);
            const newStatus = instanceDetails.status === "active" ? "inactive" : "active";
            // Optimistically update the UI
            setOptimisticStatus(newStatus);
            await toggleInstanceActivation(instanceDetails.id, newStatus);
            router.refresh();
        } catch (error) {
            console.error("Failed to toggle activation:", error);
            // Revert optimistic update on error
            setOptimisticStatus(null);
            // You can add toast notification here if you have a toast system
        } finally {
            setIsActivating(false);
            // Clear optimistic status after refresh completes
            setTimeout(() => setOptimisticStatus(null), 1000);
        }
    };

    // Use optimistic status if available, otherwise use actual status
    const displayStatus = optimisticStatus || instanceDetails.status;

    
    return (
        <div className="flex flex-col gap-4">
            <EditInstanceDialog 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                instanceDetails={instanceDetails}
                onSuccess={handleUpdateSuccess}
            />
            {/* Top Row: Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                 <div>
                    <div className="flex items-center gap-2 text-xl text-gray-900 font-semibold">
                        <Link href="/dashboard/instances" className="text-gray-400 hover:text-gray-600">Instances</Link>
                        <span className="text-gray-300">/</span>
                        <span>{instanceDetails.instanceName}</span>
                    </div>
                 </div>
                 
                 {/* Action Toolbar */}
                 <div className="flex items-center gap-2 flex-wrap">
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
                     <button 
                         onClick={handleToggleActivation}
                         disabled={isActivating}
                         className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         <Ban className="w-4 h-4" />
                         {isActivating ? "Processing..." : (displayStatus === "active" ? "Deactivate" : "Activate")}
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
            <div className="flex flex-col md:flex-row items-start md:items-center gap-x-6 gap-y-2 text-xs text-gray-500 flex-wrap">
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
