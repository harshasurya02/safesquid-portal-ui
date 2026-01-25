"use client";

import { BuilderFlow } from "@/types/builder-types";

interface SelectionStepProps {
    onSelect: (flow: BuilderFlow) => void;
}

export function SelectionStep({ onSelect }: SelectionStepProps) {
    return (
        <div className="py-12">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Do you have an Enterprise Certificate Authority ?
            </h1>
            <p className="text-gray-500 text-base mb-10">
                Setting up a CA is necessary for SSL inspection
            </p>

            <div className="flex gap-4 border-t border-gray-100 pt-10">
                <button
                    onClick={() => onSelect('SELF_SIGNED')}
                    className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                    No, Generate a Self Signed CA
                </button>
                <button
                    onClick={() => onSelect('ENTERPRISE')}
                    className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                    Yes, upload Enterprise CA
                </button>
            </div>
        </div>
    );
}
