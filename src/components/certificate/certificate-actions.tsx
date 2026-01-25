"use client";

import { RefreshCw, Info, Download, Upload } from "lucide-react";
import { ApiCertificate } from "@/types/certificate-types";
import { useRouter } from "next/navigation";

interface CertificateActionsProps {
    certificate?: ApiCertificate;
}

export function CertificateActions({ certificate }: CertificateActionsProps) {
    const router = useRouter();
    const handleRefresh = () => {
        window.location.reload();
    };

    const handleUpload = () => {
        router.push(`/dashboard/certificate/build`);

        // console.log("Info clicked", certificate);
    };

    const handleDownload = () => {
        if (certificate?.certificateUrl) {
            window.open(certificate.certificateUrl, '_blank');
        } else {
            console.log("No download URL available");
            alert("Download URL not available");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleRefresh}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
            <button
                onClick={handleUpload}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Upload"
            >
                <Upload className="w-5 h-5" />
            </button>
            <button
                onClick={handleDownload}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Download"
            >
                <Download className="w-5 h-5" />
            </button>
        </div>
    );
}
