import React from "react";
import { Download, Plus } from "lucide-react";
import { InstancesTable, Instance } from "@/components/instances/instances-table";

const mockInstances: Instance[] = [
    {
        id: "1",
        status: "Active",
        serviceName: "India_database_1",
        serviceId: "V4hfmWBsqdU",
        version: "2022.0718.1917.3",
        lastUpdated: "14th February 2024\n12 : 30 : 11 PM GMT",
        lastUptime: "14th February 2024\n12 : 30 : 11 PM GMT",
        ipAddress: "49.47.2.20",
        location: "India / Mumbai",
    },
    {
        id: "2",
        status: "Active",
        serviceName: "India_database_1",
        serviceId: "V4hfmWBsqdU",
        version: "2022.0718.1917.3",
        lastUpdated: "14th February 2024\n12 : 30 : 11 PM GMT",
        lastUptime: "14th February 2024\n12 : 30 : 11 PM GMT",
        ipAddress: "49.47.2.20",
        location: "India / Mumbai",
    },
    {
        id: "3",
        status: "Active",
        serviceName: "India_database_1",
        serviceId: "V4hfmWBsqdU",
        version: "2022.0718.1917.3",
        lastUpdated: "14th February 2024\n12 : 30 : 11 PM GMT",
        lastUptime: "14th February 2024\n12 : 30 : 11 PM GMT",
        ipAddress: "49.47.2.20",
        location: "India / Mumbai",
    },
    {
        id: "4",
        status: "Inactive",
        serviceName: "India_database_1",
        serviceId: "V4hfmWBsqdU",
        version: "2022.0718.1917.3",
        lastUpdated: "14th February 2024\n12 : 30 : 11 PM GMT",
        lastUptime: "14th February 2024\n12 : 30 : 11 PM GMT",
        ipAddress: "49.47.2.20",
        location: "India / Mumbai",
    },
];

export default function InstancesPage() {
    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header Actions */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-semibold text-gray-900">Instances</h1>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                            <Download className="w-4 h-4" />
                            Download key
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                            <Plus className="w-4 h-4" />
                            Setup new instance
                        </button>
                    </div>
                </div>

                {/* Table */}
                <InstancesTable instances={mockInstances} />
            </div>
        </div>
    );
}