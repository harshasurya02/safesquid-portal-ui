
import React from "react";
import Link from "next/link";
import { 
  LineChart, 
  History, 
  Ban, 
  Pencil, 
  Trash2, 
  Key 
} from "lucide-react";
import { InstanceCharts } from "@/components/instances/instance-charts";
import { getInstanceDetailsServer } from "@/services/instance.service";

export default async function InstanceDetailsPage({ params }: { params: { id: string } }) {
    const instanceDetails = await getInstanceDetailsServer(params.id);

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

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col gap-4">
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
                             <a href={`/dashboard/instances/${params.id}`} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                                 <LineChart className="w-4 h-4" />
                                 Graphs
                             </a>
                             <a href={`/dashboard/instances/${params.id}/history`} className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium">
                                 <History className="w-4 h-4" />
                                 History
                             </a>
                             <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium">
                                 <Ban className="w-4 h-4" />
                                 {instanceDetails.status === "active" ? "Deactivate" : "Activate"}
                             </button>
                             <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium">
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

                <div className="pt-6 border-t border-gray-100">
                    <InstanceCharts graphs={instanceDetails.graphs} />
                </div>
            </div>
        </div>
    );
}
