"use client";

import React from 'react';
import { useSubscriptionFlow } from '@/contexts/SubscriptionFlowContext';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function SubscriptionStepper() {
    const { steps, currentStepId, goToStep } = useSubscriptionFlow();

    return (
        <div className="w-64 flex-shrink-0 border-r min-h-[calc(100vh-64px)] p-6 flex flex-col justify-between bg-white">
            <div className="space-y-6">
                {/* Logo or Header could go here if needed, but per design it's sidebar steps */}

                <div className="space-y-1">
                    {steps.map((step, index) => {
                        const isActive = step.stepId === currentStepId;
                        const isCompleted = step.status === 'completed';
                        const isAccessible = step.isAccessible;

                        return (
                            <div
                                key={step.stepId}
                                className={cn(
                                    "flex items-center gap-3 p-2 rounded-md transition-colors",
                                    isActive ? "bg-blue-50/50" : "",
                                    isAccessible ? "cursor-pointer hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => isAccessible && goToStep(step.stepId)}
                            >
                                <div className="flex-shrink-0">
                                    {isCompleted ? (
                                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    ) : isActive ? (
                                        <div className="h-6 w-6 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-yellow-400" />
                                        </div>
                                    ) : (
                                        <div className="h-6 w-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                                            {/* Empty circle for pending */}
                                        </div>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-sm font-medium",
                                    isActive ? "text-gray-900" : "text-gray-500",
                                    isCompleted ? "text-gray-900" : ""
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto pt-6">
                <Link href="/dashboard/subscription" className="flex items-center text-sm text-gray-600 hover:text-gray-900 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Subscription
                </Link>
            </div>
        </div>
    );
}
