import React from "react";
import {
  getInstanceDetailsServer,
  getInstanceHistoryServer,
} from "@/services/instance.service";
import { InstanceHeader } from "@/components/instances/instance-header";
import { HistoryTable } from "@/components/instances/history-table";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function InstanceHistoryPage({
  params,
  searchParams,
}: PageProps) {
  const cookieStore = await cookies();
  const page = Number((await searchParams).page) || 1;
  const limit = Number((await searchParams).limit) || 10;

  // Fetch data in parallel
  const [instanceDetails, historyResponse] = await Promise.all([
    getInstanceDetailsServer((await params).id, cookieStore),
    getInstanceHistoryServer((await params).id, cookieStore, page, limit),
  ]);

  // console.log(historyResponse)

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <InstanceHeader instanceDetails={instanceDetails} activeTab="history" />
        <div className="pt-6 border-t border-gray-100">
          <HistoryTable
            data={historyResponse?.data || []}
            pagination={
              historyResponse?.pagination || {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
