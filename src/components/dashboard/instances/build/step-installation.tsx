"use client";

import { Play } from "lucide-react";

export function StepInstallation() {
    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-gray-900">
                    Install your Secure Web Gateway using SafeSquid Appliance Builder
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Manageable by regular IT technicians
                </p>
                <div className="mt-4 border-b border-gray-100" />
            </div>

            {/* Video Player Placeholder */}
            <div className="aspect-video w-full rounded-lg bg-gray-200 flex items-center justify-center shadow-inner">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110 active:scale-95">
                    <Play size={24} className="ml-1 text-gray-900" fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
