"use client";

import { OptionCard } from "./option-card";
import { DeploymentOption } from "../../../../app/dashboard/instances/build/page";
import Link from "next/link";

export function StepDeploymentOptions({
    selectedOption,
    setSelectedOption
}: {
    selectedOption: DeploymentOption;
    setSelectedOption: (option: DeploymentOption) => void;
}) {
    const handleOptionSelect = (option: DeploymentOption) => {
        setSelectedOption(option);
    };
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
                <div className="col-span-5 flex flex-col gap-24">
                    <OptionCard
                        title="On Premise"
                        description="Compatible with standard Intel architecture server-class physical/virtual hardware."
                        isSelected={selectedOption === "on-premise"}
                        onClick={() => handleOptionSelect("on-premise")}
                    />
                        <OptionCard
                        title="Private Cloud"
                        description="Compatible with all PaaS platforms"
                        isSelected={selectedOption === "private-cloud"}
                        onClick={() => handleOptionSelect("private-cloud")}
                    />
                        <OptionCard
                        title="Manual Installation"
                        description="Compatible with all Linux distributions"
                        isSelected={selectedOption === "manual"}
                        onClick={() => handleOptionSelect("manual")}
                    />
                </div>

                <div className="col-span-7 h-full">
                    <div className="h-full rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                        {selectedOption === "on-premise" && (
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-[#636363]">SafeSquid Appliance Builder (SAB)</h3>
                                    <p className="mt-4 font-light text-xs md:text-sm lg:text-base leading-relaxed text-[#4B4E52]">
                                        SAB is a security-enhanced Ubuntu Linux ISO, customized for SafeSquid installation on any physical or virtual hardware within 15 minutes.
                                    </p>
                                    <p className="mt-4 font-light text-xs md:text-sm lg:text-base leading-relaxed text-[#4B4E52]">
                                        Booting from the SAB ISO will:
                                    </p>
                                    <ul className="mt-2 list-inside list-decimal space-y-1 text-xs md:text-sm lg:text-base leading-relaxed text-[#4B4E52]">
                                        <li>Install Ubuntu 20.04</li>
                                        <li>Download your SWG with all dependencies</li>
                                        <li>Deploy and configure your SWG</li>
                                    </ul>
                                </div>
                                <Link href="https://downloads.safesquid.com/appliance/safesquid.iso" target="_blank" rel="noopener noreferrer" className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white text-center hover:bg-primary/90">
                                    Download SAB
                                </Link>
                            </div>
                        )}

                            {selectedOption === "private-cloud" && (
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-[#636363]">SafeSquid cloud deployment template</h3>
                                    <p className="mt-4 font-light text-xs md:text-sm lg:text-base leading-relaxed text-[#4B4E52]">
                                        Cloud Deployment Template will provision fully-configured virtual machine instances in your cloud environment.
                                    </p>
                                    
                                </div>
                                <div className="flex flex-col">
                                    <div className="mt-8">
                                        <p className="mb-4 text-center font-normal text-xs leading-relaxed text-[#4B4E52]">One-click deploy on:</p>
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

                                    <Link href="https://github.com/SafeSquid-Github/safesquid_cloud-init/blob/main/safesquid_cloud-init.yaml" target="_blank" rel="noopener noreferrer" className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-white hover:bg-primary/90">
                                        Download Cloud-init Script
                                    </Link>
                                </div>
                            </div>
                        )}

                        {selectedOption === "manual" && (
                            <div className="h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                    <h3 className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-[#636363]">SafeSquid TAR file</h3>
                                    <p className="mt-4 font-light text-xs md:text-sm lg:text-base leading-relaxed text-[#4B4E52]">
                                        To setup SafeSquid on already existing infrastructure,
                                    </p>
                                    <ol className="mt-4 list-decimal space-y-2 pl-4 text-xs md:text-sm lg:text-base leading-relaxed text-[#4B4E52]">
                                        <li>Install, and Configure required dependencies and other supporting services</li>
                                        <li>Download and extract the SafeSquid Tar file</li>
                                        <li>Execute the setup.sh script to install SafeSquid</li>
                                    </ol>
                                </div>
                                <Link href="http://downloads.safesquid.net/appliance/binary/safesquid_latest.tar.gz" className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-white hover:bg-primary/90">
                                    Download Tarball
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
