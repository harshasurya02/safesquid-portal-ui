"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Signature } from "@/lib/dashboard-data";
import { SignatureCard } from "@/components/dashboard/signatures/signature-card";
import { AddSignatureCard } from "@/components/dashboard/signatures/add-signature-card";
import { AddSignatureModal } from "@/components/dashboard/signatures/add-signature-modal";
import { apiGet } from "@/services/api.service";
import { useUser } from "@/contexts/UserContext";

interface ApiResponse {
    error: boolean;
    data: Signature[];
}

export default function SignaturesPage() {
    const [signatures, setSignatures] = useState<Signature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { selectedKeyId } = useUser()
    const fetchSignatures = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiGet<ApiResponse>(`/api/signatures?keyId=${selectedKeyId}`);
            if (!response.error) {
                setSignatures(response.data);
            } else {
                // setError("Failed to fetch signatures");
            }
        } catch (err: any) {
            console.error("Error fetching signatures:", err);
            setError(err.message || "An error occurred while fetching signatures");
        } finally {
            setIsLoading(false);
        }
    }, [selectedKeyId]);

    useEffect(() => {
        fetchSignatures();
    }, [fetchSignatures]);

    const filteredSignatures = signatures?.filter((sig) =>
        sig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sig.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-800">Signatures</h1>
                <p className="text-sm text-gray-500">Filter content with PCRE expressions</p>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search signatures"
                    className="pl-10 bg-white border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-500 font-medium">Loading signatures...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={() => fetchSignatures()}
                        className="mt-4 text-sm text-red-700 underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AddSignatureCard />
                    {filteredSignatures && filteredSignatures.length > 0 ? filteredSignatures.map((signature) => (
                        <SignatureCard
                            key={signature.id}
                            signature={signature}
                            onRefresh={fetchSignatures}
                        />
                    )) : <></>}
                </div>
            )}

            <Suspense fallback={null}>
                <AddSignatureModal onRefresh={fetchSignatures} />
            </Suspense>
        </div>
    );
}
