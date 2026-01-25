import { CertificateBuilderState } from "@/types/builder-types";
import { Lock } from "lucide-react";
import { options } from "../builder-container";

interface StepProps {
    data: CertificateBuilderState['formData'];
    update: (data: Partial<CertificateBuilderState['formData']>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function KeyConfigStep({ data, update, onNext, onBack }: StepProps) {
    const validatePassphrase = (pass: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pass);
    };

    const isPassphraseValid = !data.encrypted || (data.passphrase ? validatePassphrase(data.passphrase) : false);
    const isNextDisabled = !data.key || (data.encrypted && (!data.passphrase || !data.cipher || !isPassphraseValid));

    const handleAlgorithmChange = (format: string) => {
        const selected = options.algorithm.find(opt => opt.value === format);
        if (selected) {
            update({
                privateKeyFormat: selected.value,
                algorithm: selected.algo
            });
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Creating the Root SSL Certificate</h2>
                <p className="text-sm text-gray-500">Update your certificate details here</p>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
                {/* Key Identifier */}
                {/* <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Identifier (Unique ID)</label>
                    <input
                        placeholder="e.g. primary-gateway-cert"
                        value={data.key}
                        onChange={(e) => update({ key: e.target.value })}
                        className={`w-full p-2.5 ${data.key ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-gray-50/50'} border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                        required
                        readOnly={!!data.key}
                    />
                </div> */}

                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Private Key</label>
                        <select
                            value={data.privateKeyFormat}
                            onChange={(e) => handleAlgorithmChange(e.target.value)}
                            className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                            {options.algorithm.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:block">&nbsp;</label>
                        <select
                            value={data.keySize}
                            onChange={(e) => update({ keySize: Number(e.target.value) })}
                            className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                            {options.keySize.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                    <button
                        onClick={() => update({ encrypted: !data.encrypted })}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${data.encrypted ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${data.encrypted ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-sm font-medium text-gray-700">Enable Encryption</span>
                </div>

                {data.encrypted && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Passphrase</label>
                                    <Lock className="w-3 h-3 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Passphrase"
                                    value={data.passphrase || ""}
                                    onChange={(e) => update({ passphrase: e.target.value })}
                                    className={`w-full p-2.5 bg-gray-50/50 border ${data.passphrase && !isPassphraseValid ? 'border-red-400' : 'border-gray-200'} rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                                    required
                                />
                                {data.passphrase && !isPassphraseValid && (
                                    <p className="text-[10px] text-red-500 font-medium leading-tight">
                                        Must be 8+ chars, include upper, lower, number, special
                                    </p>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cipher</label>
                                <select
                                    value={data.cipher}
                                    onChange={(e) => update({ cipher: e.target.value })}
                                    className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    required
                                >
                                    {options.cipher.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-10">
                <button
                    onClick={onBack}
                    className="px-8 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all font-outfit"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className={`px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
