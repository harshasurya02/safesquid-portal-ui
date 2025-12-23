"use client";

import React from "react";
import { Instance } from "@/services/instance.service";
import { parseISO, format, isValid } from 'date-fns';
import Link from "next/link";
interface InstancesTableProps {
    instances: Instance[];
}

export function InstancesTable({ instances }: InstancesTableProps) {
    const formatDate = (dateString: string) => {
  const date = parseISO(dateString);

  if (!isValid(date)) return dateString;

  return format(date, 'yyyy-MM-dd HH:mm:ss');
};


    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service Name & ID</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Version</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Updated</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uptime</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ip Address</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {instances.map((instance) => (
                        <tr key={instance.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${instance.status.toLowerCase() === "active" ? "bg-green-500" : "bg-red-500"}`}></div>
                                    <span className="text-sm text-gray-700 font-medium capitalize">{instance.status}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">{instance.instanceName}</span>
                                    <span className="text-xs text-gray-500">{instance.id}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {instance.version}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="whitespace-pre-line">{formatDate(instance.lastUpdated)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="whitespace-pre-line">{instance.lastUptime}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {instance.ipAddress}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {instance.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/dashboard/instances/${instance.id}`} className="text-blue-600 hover:text-blue-900 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors inline-block">
                                    Manage
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
