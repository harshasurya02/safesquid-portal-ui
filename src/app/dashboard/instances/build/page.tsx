"use client";

import React, { useState } from "react";
import { Stepper, STEPS, Step } from "@/components/dashboard/instances/build/stepper";
import { StepDeploymentOptions } from "@/components/dashboard/instances/build/step-deployment-options";
import { StepProvisionHardware } from "@/components/dashboard/instances/build/step-provision-hardware";
import { StepInstallation } from "@/components/dashboard/instances/build/step-installation";
import { StepActivationKey } from "@/components/dashboard/instances/build/step-activation-key";
import { apiPost } from "@/services/api.service";
import { useUser } from "@/contexts/UserContext";
import { CircleCheckBig } from "lucide-react";
 
export type { Step } from "@/components/dashboard/instances/build/stepper";
export type DeploymentOption = "on-premise" | "private-cloud" | "manual";

export interface HardwareState {
    deploymentLocations: number;
    maxConcurrentConnections: string;
    proxyCount: number;
    isProxyActive: boolean;
    isLBActive: boolean;
    isLogActive: boolean;
    location: string;
}

export interface ProxyState {
    commonName: string;
    port: string;
}

export default function InstanceBuildPage() {
    // Default to provision-hardware as per previous state, but logically should be deployment-options if fresh
    const [currentStep, setCurrentStep] = useState<Step>("deployment-options");
    const [selectedOption, setSelectedOption] = useState<DeploymentOption>("on-premise");
    
    // Hardware State
    const [hardwareState, setHardwareState] = useState<HardwareState>({
        deploymentLocations: 2,
        maxConcurrentConnections: "12,000",
        proxyCount: 1,
        isProxyActive: false,
        isLBActive: false,
        isLogActive: false,
        location: "Location 1"
    });

    // Proxy State
    const [proxyState, setProxyState] = useState<ProxyState>({
        commonName: "",
        port: ""
    });

    const { selectedKeyId } = useUser();

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const handleActivate = async () => {
        try {
            const payload = {
                keyId: selectedKeyId || "",
                proxyServer: hardwareState.proxyCount,
                hasProxyServer: hardwareState.isProxyActive,
                hasLoadBalancer: hardwareState.isLBActive,
                hasLogAggregator: hardwareState.isLogActive,
                deploymentOption: selectedOption,
                numberOfDeployments: hardwareState.deploymentLocations,
                proxyCommonName: proxyState.commonName,
                port: Number(proxyState.port)
            };
            
            await apiPost(`/api/instance/`, payload);
            setShowSuccessDialog(true);
        } catch (error) {
            console.error("Failed to submit instance build data:", error);
            // Optionally handle error state here
        }
    };

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

    if (showSuccessDialog) {
        return (
            <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50/30">
                <div className="flex flex-col items-center justify-center rounded-xl bg-white p-16 shadow-sm">

                    <div className="w-full flex justify-center mb-4">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-full"
                            style={{ backgroundColor: "#ECFDF3" }}
                        >
                            <div
                                className="flex items-center justify-center w-6 h-6 rounded-full"
                                style={{ backgroundColor: "#D1FADF" }}
                            >
                                <CircleCheckBig
                                    size={80}
                                    strokeWidth={1.75}
                                    className="text-green-600"
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className="mt-6 text-xl font-semibold text-gray-900">
                        Congratulations on your first SafeSquid Instance
                    </h2>
                    <button className="mt-8 rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700">
                        Get your SSL certificate
                    </button>
                </div>
            </div>
        );
    }

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
                    <StepProvisionHardware 
                        state={hardwareState}
                        setState={setHardwareState}
                    />
                )}

                {/* --- Step 3: Installation --- */}
                {currentStep === "installation" && (
                    <StepInstallation />
                )}

                {/* --- Step 4: Activation Key --- */}
                {currentStep === "activation-key" && (
                    <StepActivationKey 
                        onActivate={handleActivate}
                        onBack={handleBack}
                        deploymentOption={selectedOption}
                        proxyState={proxyState}
                        setProxyState={setProxyState}
                    />
                )}

                {/* Footer Navigation - Hidden for Activation Key step as it has its own controls */}
                 {currentStep !== "activation-key" && (
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
                )}
            </main>
        </div>
    );
}
