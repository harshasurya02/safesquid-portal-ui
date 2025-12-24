
import React from "react";
import { InstanceCharts } from "@/components/instances/instance-charts";
import { getInstanceDetailsServer } from "@/services/instance.service";
import { InstanceHeader } from "@/components/instances/instance-header";

export default async function InstanceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const instanceDetails = await getInstanceDetailsServer((await params).id);
    // console.log(instanceDetails);
    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <InstanceHeader instanceDetails={instanceDetails} activeTab="graphs" />

                <div className="pt-6 border-t border-gray-100">
                    <InstanceCharts graphs={instanceDetails.graphs} />
                </div>
            </div>
        </div>
    );
}
