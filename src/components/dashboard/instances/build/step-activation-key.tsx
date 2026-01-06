"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { Download, ArrowRight } from "lucide-react";
import { StatefulInput } from "@/components/stateful-input";
import { ProxyState } from "../../../../app/dashboard/instances/build/page";
import Link from "next/link";

interface StepActivationKeyProps {
    onActivate: () => void;
    onBack: () => void;
    deploymentOption: string;
    proxyState: ProxyState;
    setProxyState: Dispatch<SetStateAction<ProxyState>>;
}

export function StepActivationKey({ 
    onActivate, 
    onBack, 
    deploymentOption,
    proxyState,
    setProxyState
}: StepActivationKeyProps) {
    const [errors, setErrors] = useState<{ commonName?: string; port?: string }>({});

    const handleActivateWithValidation = () => {
        const newErrors: { commonName?: string; port?: string } = {};
        
        if (!proxyState.commonName.trim()) {
            newErrors.commonName = "Common name is required";
        }

        if (!proxyState.port.trim()) {
            newErrors.port = "Port is required";
        } else if (isNaN(Number(proxyState.port))) {
            newErrors.port = "Port must be a number";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onActivate();
        }
    };

    const updateProxyState = (key: keyof ProxyState, value: string) => {
        setProxyState(prev => ({ ...prev, [key]: value }));
        // Clear error when user types
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: undefined }));
        }
    };

    return (
        <div className="flex flex-col gap-12">
            <div>
                <h1 className="text-base md:text-xl lg:text-2xl font-medium text-black">
                    Activate your SafeSquid instance
                </h1>
                <p className="mt-2 text-sm md:text-base lg:text-xl text-[#737373] font-normal">
                    Product activation key is the unique secret required to activate and validate authenticity of your SafeSquid
                </p>
                <div className="mt-4 border-b border-gray-100" />
            </div>

            <div className="flex flex-col gap-16 px-4">
                {/* Section 1: Download Key (Only for Manual Installation) */}
                {deploymentOption === "manual" && (
                    <div className="grid grid-cols-12 gap-8 items-center">
                        <div className="col-span-6">
                            <h3 className="font-medium text-black text-sm md:text-base lg:text-xl">Download your Activation key</h3>
                            <p className="mt-1 text-xs md:text-base lg:text-lg text-[#737373] font-normal leading-relaxed">
                                Activate multiple instances with the same key to seamlessly synchronize them
                            </p>
                        </div>
                        <div className="col-span-6">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value="Activation.key"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none"
                                />
                                <a 
                                    href="https://ezklsfsdgqlzllsrsqry.supabase.co/storage/v1/object/sign/certificates/4d04b2f5-2905-4ccf-8fda-4a47f200502e/50421fa7e3b387fc18af813f98e100750c41d321/public.pem?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82OTFmNGNjMC0yMjZlLTRmMGItYTZjNS01MTRmMTg4NTRlYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjZXJ0aWZpY2F0ZXMvNGQwNGIyZjUtMjkwNS00Y2NmLThmZGEtNGE0N2YyMDA1MDJlLzUwNDIxZmE3ZTNiMzg3ZmMxOGFmODEzZjk4ZTEwMDc1MGM0MWQzMjEvcHVibGljLnBlbSIsImlhdCI6MTc2NjM0NDcyNywiZXhwIjoxNzY4OTM2NzI3fQ.m2H_c09WQ1d3Q-g5934VcTNPRpaxbxCxZCDrkmcPmjk"
                                    target="_blank"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <Download size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 2: Configure Proxy */}
                <div className="grid grid-cols-12 gap-8 items-start">
                    <div className="col-span-6">
                        <h3 className="font-medium text-black text-sm md:text-base lg:text-xl">Configure HTTP(S) proxy on your system</h3>
                    </div>
                    <div className="col-span-6 flex gap-4">
                        <div className="flex-1">
                            <StatefulInput
                                label="Common name"
                                placeholder="IP Address of proxy server"
                                value={proxyState.commonName}
                                onChange={(e) => updateProxyState("commonName", e.target.value)}
                                error={errors.commonName}
                            />
                        </div>
                        <div className="w-24">
                            <StatefulInput
                                label="Port"
                                placeholder="8080"
                                value={proxyState.port}
                                onChange={(e) => updateProxyState("port", e.target.value)}
                                error={errors.port}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Faded Text */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 md:col-span-8 flex gap-4 items-center">
                        <p className="text-xs md:text-base lg:text-xl text-[#737373] font-normal">
                             Access the <Link href="#" className="text-blue-600 font-medium">Product interface</Link> and upload the activation key
                        </p>
                    </div>
                </div>
                
                <div className="border-t border-gray-100" />
            </div>

            {/* Footer */}
            <div className="mt-auto flex justify-end gap-4">
                <button 
                    onClick={onBack}
                    className="rounded-lg border border-blue-200 px-8 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                    Back
                </button>
                <button 
                    onClick={handleActivateWithValidation}
                    className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                    Activate
                </button>
            </div>
        </div>
    );
}

