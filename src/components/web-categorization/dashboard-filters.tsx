"use client";

import { Search, ChevronDown } from "lucide-react";

export const DashboardFilters = () => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-48">
                <button className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <span>Category</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            <div className="relative flex-1 w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Search categories"
                />
            </div>
        </div>
    );
};
