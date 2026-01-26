"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Signature } from "@/lib/dashboard-data";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SignatureCardProps {
    signature: Signature;
    onRefresh?: () => void;
}

export function SignatureCard({ signature, onRefresh }: SignatureCardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isExpanded, setIsExpanded] = useState(false);
    const displayKeywords = isExpanded ? signature.keywords : signature.keywords.slice(0, 2);
    const showMoreVisible = signature.keywords.length > 2;

    const handleEdit = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("edit", signature.id);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete signature "${signature.name}"?`)) return;

        try {
            const { apiDelete } = await import("@/services/api.service");
            const response = await apiDelete<{ error: boolean; message?: string }>(`/api/signatures/${signature.id}`);
            if (!response.error) {
                onRefresh?.();
            } else {
                alert(response.message || "Failed to delete signature");
            }
        } catch (err: any) {
            console.error("Error deleting signature:", err);
            alert(err.message || "An error occurred while deleting the signature");
        }
    };

    const handleDeleteKeyword = async (keywordId: string) => {
        if (!window.confirm("Are you sure you want to delete this keyword?")) return;

        try {
            const { apiDelete } = await import("@/services/api.service");
            const response = await apiDelete<{ error: boolean; message?: string }>(`/api/keywords/${keywordId}`);
            if (!response.error) {
                onRefresh?.();
            } else {
                alert(response.message || "Failed to delete keyword");
            }
        } catch (err: any) {
            console.error("Error deleting keyword:", err);
            alert(err.message || "An error occurred while deleting the keyword");
        }
    };

    return (
        <Card className="h-full border-gray-200 shadow-none">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-gray-700">
                    {signature.name}
                </CardTitle>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-gray-50 text-gray-500 hover:text-blue-600"
                        onClick={handleEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-gray-50 text-gray-500 hover:text-red-600"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                    {signature.description}
                </p>

                <div
                    className="flex items-center justify-center p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={handleEdit}
                >
                    <Plus className="h-5 w-5 text-gray-400" />
                </div>

                <div className="space-y-2">
                    {displayKeywords.map((keyword) => (
                        <div
                            key={keyword.id}
                            className="flex items-center justify-between p-2 px-3 border border-gray-100 rounded-md text-sm text-gray-600 font-mono"
                        >
                            <span>{keyword.value}</span>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
                                    <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400"
                                    onClick={() => handleDeleteKeyword(keyword.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {showMoreVisible && (
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {isExpanded ? "Hide" : "Show more"}
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
