"use client";

import { OptionCard } from "./option-card";
import { DeploymentOption } from "../../../../app/dashboard/instances/build/page";

export function StepDeploymentOptions({
    selectedOption,
    setSelectedOption
}: {
    selectedOption: DeploymentOption;
    setSelectedOption: (option: DeploymentOption) => void;
}) {
    return (
        <>
            <div className="mb-12">
                    <h1 className="text-xl font-semibold text-gray-900">
                    Select your preferred platform to deploy SafeSquid SWG
                </h1>
                    <p className="mt-2 text-sm text-gray-500">
                    SafeSquid is a fully software-based open-architecture solution supporting non-proprietary hardware, platform-agnostic deployment
                </p>
                    <div className="mt-4 border-b border-gray-100" />
            </div>

            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-5 flex flex-col gap-6">
                    <OptionCard
                        title="On Premise"
                        description="Compatible with standard Intel architecture server-class physical/virtual hardware."
                        isSelected={selectedOption === "on-premise"}
                        onClick={() => setSelectedOption("on-premise")}
                    />
                        <OptionCard
                        title="Private Cloud"
                        description="Compatible with all PaaS platforms"
                        isSelected={selectedOption === "private-cloud"}
                        onClick={() => setSelectedOption("private-cloud")}
                    />
                        <OptionCard
                        title="Manual Installation"
                        description="Compatible with all Linux distributions"
                        isSelected={selectedOption === "manual"}
                        onClick={() => setSelectedOption("manual")}
                    />
                </div>

                <div className="col-span-7">
                    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                        {selectedOption === "on-premise" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">SafeSquid Appliance Builder (SAB)</h3>
                                    <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                        SAB is a security-enhanced Ubuntu Linux ISO, customized for SafeSquid installation on any physical or virtual hardware within 15 minutes.
                                    </p>
                                    <p className="mt-4 text-sm text-gray-600">
                                        Booting from the SAB ISO will:
                                    </p>
                                    <ul className="mt-2 list-inside list-decimal space-y-1 text-sm text-gray-600">
                                        <li>Install Ubuntu 20.04</li>
                                        <li>Download your SWG with all dependencies</li>
                                        <li>Deploy and configure your SWG</li>
                                    </ul>
                                </div>
                                <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700">
                                    Download SAB
                                </button>
                            </div>
                        )}

                            {selectedOption === "private-cloud" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">SafeSquid cloud deployment template</h3>
                                    <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                        Cloud Deployment Template will provision fully-configured virtual machine instances in your cloud environment.
                                    </p>
                                    
                                    <div className="mt-8">
                                        <p className="mb-4 text-center text-xs text-gray-500">One-click deploy on:</p>
                                        <div className="flex justify-center gap-4">
                                            <button className="flex h-12 w-20 items-center justify-center rounded border hover:bg-gray-50">
                                                <span className="text-xs font-bold text-blue-600">Azure</span>
                                            </button>
                                                <button className="flex h-12 w-20 items-center justify-center rounded border hover:bg-gray-50">
                                                <span className="text-xs font-bold text-red-500">GCP</span>
                                            </button>
                                                <button className="flex h-12 w-20 items-center justify-center rounded border hover:bg-gray-50">
                                                <span className="text-xs font-bold text-orange-500">AWS</span>
                                            </button>
                                        </div>
                                        <p className="my-4 text-center text-xs text-gray-400">- or -</p>
                                    </div>
                                </div>
                                    <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700">
                                    Download Cloud-init Script
                                </button>
                            </div>
                        )}

                        {selectedOption === "manual" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">SafeSquid TAR file</h3>
                                    <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                        To setup SafeSquid on already existing infrastructure,
                                    </p>
                                    <ol className="mt-4 list-decimal space-y-2 pl-4 text-sm text-gray-600">
                                        <li>Install, and Configure required dependencies and other supporting services</li>
                                        <li>Download and extract the SafeSquid Tar file</li>
                                        <li>Execute the setup.sh script to install SafeSquid</li>
                                    </ol>
                                </div>
                                <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700">
                                    Download Tarball
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
