"use client";

import React from "react";
import { InstanceHistoryItem } from "@/services/instance.service";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryTableProps {
    data: InstanceHistoryItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export function HistoryTable({ data, pagination }: HistoryTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Group data by date
    const groupedData = React.useMemo(() => {
        return data.reduce((acc, item) => {
            const date = new Date(item.timestamp).toLocaleDateString('en-GB', {
                 day: 'numeric',
                 month: 'long',
                 year: 'numeric'
            });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {} as Record<string, InstanceHistoryItem[]>);
    }, [data]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider w-40">Time</th>
                        <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Activity</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Object.entries(groupedData).map(([date, items], groupIndex) => (
                        <React.Fragment key={groupIndex}>
                            <tr className="bg-gray-50/50">
                                <td colSpan={2} className="py-2 px-4 text-xs font-semibold text-gray-900 border-b border-gray-100">
                                    {date}
                                </td>
                            </tr>
                            {items.map((activity, index) => (
                                <tr key={activity.id || index} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                                        {formatTime(activity.timestamp)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {activity.description}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={2} className="py-8 text-center text-gray-500 text-sm">
                                No history available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
                     <button 
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         <span className="sr-only">Previous</span>
                         <ChevronLeft className="w-5 h-5" />
                     </button>
                     <span className="text-xs text-gray-600 font-medium">{pagination.page} / {pagination.totalPages}</span>
                     <button 
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         <span className="sr-only">Next</span>
                         <ChevronRight className="w-5 h-5" />
                     </button>
                </div>
            )}
        </div>
    );
}
