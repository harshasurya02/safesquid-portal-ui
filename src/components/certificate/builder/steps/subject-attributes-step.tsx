"use client";

import { CertificateBuilderState } from "@/types/builder-types";
import { Plus, X } from "lucide-react";

interface StepProps {
    data: CertificateBuilderState['formData'];
    update: (data: Partial<CertificateBuilderState['formData']>) => void;
    onNext: () => void;
    onBack: () => void;
    submitting?: boolean;
}

export function SubjectAttributesStep({ data, update, onNext, onBack, submitting }: StepProps) {
    const addSan = () => {
        update({ subjectAlternativeNames: [...data.subjectAlternativeNames, { type: "DNS", value: "" }] });
    };

    const removeSan = (index: number) => {
        const newSans = data.subjectAlternativeNames.filter((_, i) => i !== index);
        update({ subjectAlternativeNames: newSans });
    };

    const updateSan = (index: number, val: string) => {
        const newSans = [...data.subjectAlternativeNames];
        newSans[index].value = val;
        update({ subjectAlternativeNames: newSans });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Key configuration</h2>
                <p className="text-sm text-gray-500">Update your certificate details here</p>
            </div>

            <div className="space-y-8 pt-6 border-t border-gray-100">
                {/* Attributes Grid */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Subject Attributes</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Common name</label>
                            <input
                                placeholder="SafeSquid"
                                value={data.commonName}
                                onChange={(e) => update({ commonName: e.target.value })}
                                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Country Code (Alpha-2)</label>
                            <input
                                placeholder="US, IN, GB, etc."
                                value={data.countryCode}
                                onChange={(e) => update({ countryCode: e.target.value.toUpperCase() })}
                                maxLength={2}
                                className={`w-full p-2.5 bg-gray-50/50 border ${data.countryCode.length > 0 && data.countryCode.length < 2 ? 'border-red-400' : 'border-gray-200'} rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">State</label>
                            <input
                                placeholder="North"
                                value={data.state}
                                onChange={(e) => update({ state: e.target.value })}
                                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Locality Name</label>
                            <input
                                placeholder="Mumbai"
                                value={data.localityName}
                                onChange={(e) => update({ localityName: e.target.value })}
                                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization Name</label>
                            <input
                                placeholder="Enter Org name"
                                value={data.organizationName}
                                onChange={(e) => update({ organizationName: e.target.value })}
                                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization Unit</label>
                            <input
                                placeholder="Enter Org unit"
                                value={data.organizationUnit}
                                onChange={(e) => update({ organizationUnit: e.target.value })}
                                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* SAN Section */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Subject Alternative Names</h3>
                    <div className="space-y-3">
                        {data.subjectAlternativeNames.map((san, idx) => (
                            <div key={idx} className="flex gap-4">
                                <select className="w-32 p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                    <option>DNS</option>
                                    <option>IP</option>
                                </select>
                                <input
                                    placeholder="www.safesquid.com, log.safesquid.com, etc."
                                    value={san.value}
                                    onChange={(e) => updateSan(idx, e.target.value)}
                                    className="flex-1 p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                                {idx > 0 && (
                                    <button onClick={() => removeSan(idx)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addSan}
                            className="flex items-center gap-2 text-primary font-medium text-sm mt-2 hover:underline"
                        >
                            <Plus className="w-4 h-4" />
                            Add another SAN
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-10">
                <button
                    onClick={onBack}
                    className="px-8 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={submitting || !data.commonName || data.countryCode.length !== 2}
                    className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Generating..." : "Generate"}
                </button>
            </div>
        </div>
    );
}
