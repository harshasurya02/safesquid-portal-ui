"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Rocket, Monitor, Disc, Key } from "lucide-react";

// --- Types ---
export type Step = "deployment-options" | "provision-hardware" | "installation" | "activation-key";

export const STEPS: { id: Step; label: string; icon: any }[] = [
    { id: "deployment-options", label: "Deployment Options", icon: Rocket },
    { id: "provision-hardware", label: "Provision hardware", icon: Monitor },
    { id: "installation", label: "Installation", icon: Disc },
    { id: "activation-key", label: "Activation key", icon: Key },
];

const StepperItem = ({ 
    icon: Icon, 
    label, 
    isActive, 
    isCompleted,
    isFirst,
    isLast 
}: { 
    icon: any, 
    label: string, 
    isActive?: boolean, 
    isCompleted?: boolean,
    isFirst?: boolean,
    isLast?: boolean
}) => {
    return (
        <div className="relative flex items-center gap-4">
             {/* Vertical Line */}
            {!isLast && (
                <div className={cn(
                    "absolute left-[19px] top-[40px] h-[30px] w-[1px]",
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                )} />
            )}

            <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                isActive 
                    ? "border-blue-500 bg-blue-50 text-blue-600" 
                    : isCompleted
                        ? "border-blue-100 bg-blue-50 text-blue-600"
                        : "border-gray-200 bg-white text-gray-400"
            )}>
                {isCompleted ? (
                    <div className="flex bg-blue-100 h-full w-full items-center justify-center rounded-lg">
                        <Check size={18} strokeWidth={2.5} className="text-blue-600" />
                    </div>
                ) : (
                    <Icon size={20} strokeWidth={1.5} />
                )}
            </div>
            <span className={cn(
                "font-medium transition-colors",
                 isActive ? "text-gray-900" : "text-gray-400"
            )}>
                {label}
            </span>
        </div>
    );
};

export function Stepper({ currentStep }: { currentStep: Step }) {
    // Helper to determine step status
    const getStepStatus = (stepId: Step) => {
        const stepIndex = STEPS.findIndex(s => s.id === stepId);
        const currentIndex = STEPS.findIndex(s => s.id === currentStep);
        
        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "active";
        return "upcoming";
    };

    return (
        <aside className="w-80 border-r bg-white p-8">
            <div className="flex flex-col gap-8">
                {STEPS.map((step, index) => {
                    const status = getStepStatus(step.id);
                    return (
                        <StepperItem 
                            key={step.id}
                            icon={step.icon} 
                            label={step.label} 
                            isActive={status === "active"}
                            isCompleted={status === "completed"}
                            isFirst={index === 0}
                            isLast={index === STEPS.length - 1} 
                        />
                    );
                })}
            </div>

             <div className="mt-auto pt-20">
                <Link 
                    href="/dashboard/instances" 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-white shadow-sm">
                         <ArrowLeft size={16} />
                    </div>
                    Back to Instances
                </Link>
            </div>
        </aside>
    );
}
