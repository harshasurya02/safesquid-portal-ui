"use client";

import React, { useState } from "react";
import { Stepper, STEPS, Step } from "@/components/dashboard/instances/build/stepper";
import { StepDeploymentOptions } from "@/components/dashboard/instances/build/step-deployment-options";
import { StepProvisionHardware } from "@/components/dashboard/instances/build/step-provision-hardware";
import { StepInstallation } from "@/components/dashboard/instances/build/step-installation";
import { StepActivationKey } from "@/components/dashboard/instances/build/step-activation-key";

export type { Step } from "@/components/dashboard/instances/build/stepper";
export type DeploymentOption = "on-premise" | "private-cloud" | "manual";

export default function InstanceBuildPage() {
    // Default to provision-hardware as per previous state, but logically should be deployment-options if fresh
    const [currentStep, setCurrentStep] = useState<Step>("deployment-options");
    const [selectedOption, setSelectedOption] = useState<DeploymentOption>("on-premise");

    const handleNext = () => {
        const currentIndex = STEPS.findIndex(s => s.id === currentStep);
        if (currentIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentIndex + 1].id);
        }
    };

    const handleBack = () => {
        const currentIndex = STEPS.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(STEPS[currentIndex - 1].id);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50/30">
            {/* Left Sidebar - Stepper */}
            <Stepper currentStep={currentStep} />

            {/* Main Content */}
            <main className="flex-1 bg-white p-12">
                
                {/* --- Step 1: Deployment Options --- */}
                {currentStep === "deployment-options" && (
                    <StepDeploymentOptions 
                        selectedOption={selectedOption} 
                        setSelectedOption={setSelectedOption} 
                    />
                )}

                {/* --- Step 2: Provision Hardware --- */}
                {currentStep === "provision-hardware" && (
                    <StepProvisionHardware />
                )}

                {/* --- Step 3: Installation --- */}
                {currentStep === "installation" && (
                    <StepInstallation />
                )}

                {/* --- Step 4: Activation Key --- */}
                {currentStep === "activation-key" && (
                    <StepActivationKey />
                )}

                {/* Footer Navigation */}
                 <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 pt-8">
                    {currentStep !== "deployment-options" && (
                        <button 
                            onClick={handleBack}
                            className="rounded-lg border border-blue-200 px-8 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                            Back
                        </button>
                    )}
                    <button 
                        onClick={handleNext}
                        className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
}
