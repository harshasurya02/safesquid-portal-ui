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
import { getInstanceDetailsServer } from "@/services/instance.service";

// Dummy data for history based on image
const historyData = [
    {
        date: "12th March 2024",
        activities: [
            { time: "12 : 23 : 13 am", text: "Mukund updated instance name from India_database_1 to India_DB_Prod" },
            { time: "12 : 23 : 13 am", text: "Mukund deactivated instance India_database_1" },
            { time: "12 : 23 : 13 am", text: "Mukund updated instance location from Mumbai to Delhi" },
            { time: "12 : 23 : 13 am", text: "Mukund downloaded the key for instance India_DB_Prod" },
            { time: "12 : 23 : 13 am", text: "Mukund reactivated instance India_DB_Prod" },
            { time: "12 : 23 : 13 am", text: "Mukund updated instance name from India_DB_Prod to India_DB_Final" },
            { time: "12 : 23 : 13 am", text: "Mukund deactivated instance India_DB_Final" },
            { time: "12 : 23 : 13 am", text: "Key_database_2 successfully integrated into India_database_1" },
            { time: "12 : 23 : 13 am", text: "Key_database_2 status changed to 'active' by Mukund" },
            { time: "12 : 23 : 13 am", text: "Key_database_2 status changed to 'inactive' by Mukund" },
            { time: "12 : 23 : 13 am", text: "Key_database_2 status changed to 'active' by Mukund" },
            { time: "12 : 23 : 13 am", text: "Key_database_2 status changed to 'inactive' by Mukund" }
        ]
    }
];

export default async function InstanceHistoryPage({ params }: { params: { id: string } }) {
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
                             <a href={`/dashboard/instances/${params.id}`} className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded text-sm font-medium">
                                 <LineChart className="w-4 h-4" />
                                 Graphs
                             </a>
                             <a href={`/dashboard/instances/${params.id}/history`} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm font-medium">
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
                   {/* History Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider w-40">Time</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {historyData.map((group, groupIndex) => (
                                    <React.Fragment key={groupIndex}>
                                        <tr className="bg-gray-50/50">
                                            <td colSpan={2} className="py-2 px-4 text-xs font-semibold text-gray-900 border-b border-gray-100">
                                                {group.date}
                                            </td>
                                        </tr>
                                        {group.activities.map((activity, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {activity.time}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {activity.text}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Pagination */}
                        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
                             <button className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-50">
                                 <span className="sr-only">Previous</span>
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                             </button>
                             <span className="text-xs text-gray-600 font-medium">1 / 10</span>
                             <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
                                 <span className="sr-only">Next</span>
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}