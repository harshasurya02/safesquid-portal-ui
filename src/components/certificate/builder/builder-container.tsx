"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BuilderFlow, CertificateBuilderState } from "@/types/builder-types";
import { SelectionStep } from "./steps/selection-step";
import { KeyConfigStep } from "./steps/key-config-step";
import { SubjectAttributesStep as KeyConfigurationStep } from "./steps/subject-attributes-step";
import { UploadEnterpriseStep } from "./steps/upload-enterprise-step";
import { SuccessStep } from "./steps/success-step";
import { apiPost } from "@/services/api.service";
import { useUser } from "@/contexts/UserContext";

export const options = {
    keySize: [
        { value: 2048, label: "2048 bit" },
        { value: 4096, label: "4096 bit" },
    ],
    algorithm: [
        { value: "PKCS#1 RSA", label: "PKCS#1 RSA", algo: "RSA" },
        { value: "PKCS#8 RSA", label: "PKCS#8 RSA", algo: "RSA" },
        { value: "PKCS#1 ECC", label: "PKCS#1 ECC", algo: "ECC" },
        { value: "PKCS#8 ECC", label: "PKCS#8 ECC", algo: "ECC" },
    ],
    cipher: [
        { value: "aes-256-cbc", label: "AES-256-CBC" },
        { value: "aes-192-cbc", label: "AES-192-CBC" },
        { value: "aes-128-cbc", label: "AES-128-CBC" },
    ],
}

export function BuilderContainer() {
    const router = useRouter();
    const { selectedKeyId } = useUser();
    const [submitting, setSubmitting] = useState(false);
    const [state, setState] = useState<CertificateBuilderState>({
        flow: 'NONE',
        step: 0,
        formData: {
            key: selectedKeyId || "",
            algorithm: "RSA",
            privateKeyFormat: "PKCS#1 RSA",
            keySize: 2048,
            encrypted: false,
            cipher: "aes-256-cbc",
            commonName: "",
            countryCode: "IN",
            state: "Maharashtra",
            localityName: "Mumbai",
            organizationName: "",
            organizationUnit: "",
            subjectAlternativeNames: [{ type: "DNS", value: "" }]
        }
    });

    // Update key if selectedKeyId changes and form hasn't been touched much
    useEffect(() => {
        if (selectedKeyId && !state.formData.key) {
            updateFormData({ key: selectedKeyId });
        }
    }, [selectedKeyId]);

    const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
    const prevStep = () => setState(prev => ({ ...prev, step: prev.step - 1 }));

    const setFlow = (flow: BuilderFlow) => setState(prev => ({ ...prev, flow, step: 1 }));

    const updateFormData = (data: Partial<CertificateBuilderState['formData']>) => {
        setState(prev => ({
            ...prev,
            formData: { ...prev.formData, ...data }
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            if (state.flow === 'SELF_SIGNED') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { privateKeyFormat, confirmPassphrase, subjectAlternativeNames, ...payload } = state.formData;

                console.log("=== API Submission: POST /api/certificate/generate ===");
                console.log("Payload:", JSON.stringify(payload, null, 2));

                await apiPost("/api/certificate/generate", payload as any);
            } else if (state.flow === 'ENTERPRISE') {
                const payload = {
                    key: state.formData.key,
                    cert: state.formData.certificate,
                    privateKey: state.formData.privateKey,
                    passphrase: state.formData.passphrase
                };

                console.log("=== API Submission: POST /api/certificate/upload ===");
                console.log("Payload:", JSON.stringify(payload, null, 2));

                await apiPost("/api/certificate/upload", payload as any);
            }

            nextStep();
        } catch (error) {
            console.error("Submission failed:", error);
            // In a real app, you'd show an error toast here
        } finally {
            setSubmitting(false);
        }
    };

    const renderStep = () => {
        if (state.flow === 'NONE') {
            return <SelectionStep onSelect={setFlow} />;
        }

        if (state.flow === 'SELF_SIGNED') {
            switch (state.step) {
                case 1: return <KeyConfigStep data={state.formData} update={updateFormData} onNext={nextStep} onBack={() => setFlow('NONE')} />;
                case 2: return <KeyConfigurationStep data={state.formData} update={updateFormData} onNext={handleSubmit} onBack={prevStep} submitting={submitting} />;
                case 3: return <SuccessStep type="SELF_SIGNED" />;
                default: return null;
            }
        }

        if (state.flow === 'ENTERPRISE') {
            switch (state.step) {
                case 1: return <UploadEnterpriseStep data={state.formData} update={updateFormData} onNext={handleSubmit} onBack={() => setFlow('NONE')} submitting={submitting} />;
                case 2: return <SuccessStep type="ENTERPRISE" />;
                default: return null;
            }
        }

        return null;
    };

    const getSidebarSteps = (): { id: number; label: string; active: boolean; sub?: boolean }[] => {
        if (state.flow === 'SELF_SIGNED') {
            return [
                { id: 1, label: "Root CA source", active: state.step >= 1 },
                { id: 2, label: "key configuration", active: state.step >= 2 },
            ];
        }
        if (state.flow === 'ENTERPRISE') {
            return [
                { id: 1, label: "Upload Certificate", active: state.step >= 1 },
            ];
        }
        return [];
    };

    const sideSteps = getSidebarSteps();

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50/30">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-100 bg-white p-8 flex flex-col justify-between">
                <div>
                    <div className="space-y-8">
                        {sideSteps.map((s, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`h-6 w-6 rounded-md flex items-center justify-center border text-[10px] font-bold shrink-0 ${s.active ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                    {Math.floor(s.id)}
                                </div>
                                <span className={`text-sm font-medium leading-none ${s.active ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => router.push('/dashboard/certificate')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Certificate
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-4xl">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
}

function StepperIcon({ active, completed }: { active: boolean, completed: boolean }) {
    return (
        <div className={`h-6 w-6 rounded-md border flex items-center justify-center ${active ? 'bg-blue-50 border-blue-500 text-blue-500' : 'bg-white border-gray-200 text-gray-400'}`}>
            {completed ? '✓' : ''}
        </div>
    );
}
