"use client";

import { CertificateBuilderState } from "@/types/builder-types";
import { Info, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface StepProps {
    data: CertificateBuilderState['formData'];
    update: (data: Partial<CertificateBuilderState['formData']>) => void;
    onNext: () => void;
    onBack: () => void;
    submitting?: boolean;
}

export function UploadEnterpriseStep({ data, update, onNext, onBack, submitting }: StepProps) {
    const [showPass, setShowPass] = useState(false);

    const isUploadDisabled = !data.key || !data.certificate || !data.privateKey;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Uploading the Enterprise CA</h2>
                <p className="text-sm text-gray-500">Update your certificate details here</p>
            </div>

            <div className="space-y-8 pt-6 border-t border-gray-100">
                {/* Key Identifier */}
                {/* <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-1">
                        <h3 className="text-sm font-bold text-gray-900">Key Identifier</h3>
                        <p className="text-xs text-gray-400">Unique ID for storage</p>
                    </div>
                    <div className="col-span-8">
                        <input
                            placeholder="e.g. enterprise-ca-2026"
                            value={data.key}
                            onChange={(e) => update({ key: e.target.value })}
                            className={`w-full p-2.5 ${data.key ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-gray-50/50'} border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                            disabled={submitting}
                            required
                            readOnly={!!data.key}
                        />
                    </div>
                </div> */}

                {/* Certificate */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-1">
                        <h3 className="text-sm font-bold text-gray-900">Certificate</h3>
                        <p className="text-xs text-gray-400">PEM format only</p>
                    </div>
                    <div className="col-span-8 relative">
                        <textarea
                            placeholder="Paste the certificate here"
                            value={data.certificate || ""}
                            onChange={(e) => update({ certificate: e.target.value })}
                            className="w-full h-32 p-3 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                            disabled={submitting}
                        />
                        <Info className="absolute top-3 right-3 w-4 h-4 text-gray-400 cursor-help" />
                    </div>
                </div>

                {/* Private Key */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-1">
                        <h3 className="text-sm font-bold text-gray-900">Private key <span className="text-gray-400 font-normal">(Optional)</span></h3>
                        <p className="text-xs text-gray-400">PEM format only</p>
                    </div>
                    <div className="col-span-8 relative">
                        <textarea
                            placeholder="Paste the Key here"
                            value={data.privateKey || ""}
                            onChange={(e) => update({ privateKey: e.target.value })}
                            className="w-full h-32 p-3 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                            disabled={submitting}
                        />
                        <Info className="absolute top-3 right-3 w-4 h-4 text-gray-400 cursor-help" />
                    </div>
                </div>

                {/* Passphrase */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-1">
                        <h3 className="text-sm font-bold text-gray-900">Passphrase <span className="text-gray-400 font-normal">(Optional)</span></h3>
                    </div>
                    <div className="col-span-8 space-y-3">
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Passphrase"
                                value={data.passphrase || ""}
                                onChange={(e) => update({ passphrase: e.target.value })}
                                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                disabled={submitting}
                            />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" disabled={submitting}>
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Re-enter Passphrase"
                                value={data.confirmPassphrase || ""}
                                onChange={(e) => update({ confirmPassphrase: e.target.value })}
                                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                disabled={submitting}
                            />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" disabled={submitting}>
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-10">
                <button
                    onClick={onBack}
                    className="px-8 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                    disabled={submitting}
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={submitting || isUploadDisabled}
                    className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-all disabled:opacity-50 shadow-primary/20"
                >
                    {submitting ? "Uploading..." : "Upload"}
                </button>
            </div>
        </div>
    );
}
