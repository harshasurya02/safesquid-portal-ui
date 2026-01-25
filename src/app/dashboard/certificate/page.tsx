"use client";

import { useEffect, useState } from "react";
import { CertificateActions } from "@/components/certificate/certificate-actions";
import { ApiCertificate, CertificateApiResponse } from "@/types/certificate-types";
import { useUser } from "@/contexts/UserContext";
import { apiGet } from "@/services/api.service";
import { Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function CertificatePage() {
    const router = useRouter();
    const { selectedKeyId } = useUser();
    const [certificate, setCertificate] = useState<ApiCertificate | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!selectedKeyId) return;

            setIsLoading(true);
            setError(null);
            try {
                const response = await apiGet<CertificateApiResponse>(`/api/certificate`, { key: selectedKeyId });
                if (response && response.data && response.data.length > 0) {
                    console.log("Certificate found:", response.data);
                    setCertificate(response.data[0]);
                } else {
                    router.push("/dashboard/certificate/build")
                }
            } catch (err: any) {
                console.error("Error fetching certificate:", err);
                setError(err.message || "Failed to load certificate");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificate();
    }, [selectedKeyId]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return format(date, "EEE, dd MMM yyyy - HH:mm:ss 'GMT'");
        } catch (e) {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-gray-500 font-medium">Loading certificate details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8 max-w-3xl">
                <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Certificate</h2>
                    <p className="text-red-600 font-medium mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!certificate) return null;

    return (
        <div className="container mx-auto px-6 py-8 max-w-3xl">
            <h1 className="text-2xl font-semibold text-gray-800 mb-8">Certificates</h1>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-700">Previewing the Root SSL certificate</h2>
                    <CertificateActions certificate={certificate} />
                </div>

                {/* Content */}
                <div className="px-8 py-6 space-y-10">

                    {/* Subject Name Section */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-800 mb-4">Subject name</h3>
                        <div className="space-y-3">
                            <DetailRow label="Country" value={certificate.countryCode} />
                            <DetailRow label="Location" value={certificate.localityName} />
                            <DetailRow label="State/Province" value={certificate.state} />
                            <DetailRow label="Organization" value={certificate.organizationName} />
                            <DetailRow label="Organization unit" value={certificate.organizationUnit} />
                            <DetailRow label="Common name" value={certificate.commonName} />
                            <DetailRow label="Serial number" value={certificate.serialNumber} />
                        </div>
                    </section>

                    {/* Issuer Name Section (Using subject fields as it's a root/self-signed view) */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-800 mb-4">Issuer name</h3>
                        <div className="space-y-3">
                            <DetailRow label="Country" value={certificate.countryCode} />
                            <DetailRow label="Location" value={certificate.localityName} />
                            <DetailRow label="State/Province" value={certificate.state} />
                            <DetailRow label="Organization" value={certificate.organizationName} />
                            <DetailRow label="Organization unit" value={certificate.organizationUnit} />
                            <DetailRow label="Common name" value={certificate.commonName} />
                        </div>
                    </section>

                    {/* Validity Section */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-800 mb-4">Validity</h3>
                        <div className="space-y-3">
                            <DetailRow label="Not before" value={formatDate(certificate.validFrom)} />
                            <DetailRow label="Not after" value={formatDate(certificate.validTo)} />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string | undefined | null }) {
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 text-sm text-gray-500 font-medium">
                {label}
            </div>
            <div className="col-span-8 text-sm text-gray-900 font-normal">
                {value || "N/A"}
            </div>
        </div>
    );
}