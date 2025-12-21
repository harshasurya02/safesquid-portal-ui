"use client";

import React, { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import { InstancesTable } from "@/components/instances/instances-table";
import { Instance } from "@/services/instance.service";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

interface InstancePageContentProps {
    initialInstances: Instance[];
    searchParamsKey?: string;
}

export default function InstancePageContent({ initialInstances, searchParamsKey }: InstancePageContentProps) {
    const { selectedKeyId } = useUser();
    const router = useRouter();
    const [instances, setInstances] = useState<Instance[]>(initialInstances);

    useEffect(() => {
        // Sync URL with selected key if they differ
        if (selectedKeyId && selectedKeyId !== searchParamsKey) {
            const params = new URLSearchParams(window.location.search);
            params.set("k", selectedKeyId);
            router.replace(`?${params.toString()}`);
        }
    }, [selectedKeyId, searchParamsKey, router]);

    // Update instances when initialInstances prop changes (which happens when server re-renders)
    useEffect(() => {
        setInstances(initialInstances);
    }, [initialInstances]);

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
                <InstancesTable instances={instances} />
            </div>
        </div>
    );
}
