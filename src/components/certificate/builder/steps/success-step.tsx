"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessStepProps {
    type: 'SELF_SIGNED' | 'ENTERPRISE';
}

export function SuccessStep({ type }: SuccessStepProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-300">
            <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-xl flex flex-col items-center max-w-sm w-full text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mb-8 px-4">
                    {type === 'SELF_SIGNED'
                        ? "Self-Signed Certificate generated successfully"
                        : "Upload successful"}
                </h2>

                <button
                    onClick={() => router.push('/dashboard/certificate')}
                    className="w-full py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-all shadow-primary/20"
                >
                    Certificate
                </button>
            </div>
        </div>
    );
}
