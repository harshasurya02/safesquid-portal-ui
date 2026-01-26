"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
// import { initialSignatures } from "@/lib/dashboard-data";
import { useUser } from "@/contexts/UserContext";
import { apiGet } from "@/services/api.service";
import { Signature } from "@/lib/dashboard-data";

interface SingleApiResponse {
    error: boolean;
    data: Signature;
}

export function AddSignatureModal({ onRefresh }: { onRefresh?: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { selectedKeyId } = useUser()
    const createMode = searchParams.get("create") === "true";
    const editId = searchParams.get("edit");
    const isOpen = createMode || !!editId;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [keywordInput, setKeywordInput] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);

    useEffect(() => {
        const fetchSignature = async () => {
            if (editId) {
                try {
                    const response = await apiGet<SingleApiResponse>(`/api/signatures/${editId}`);
                    console.log(response)
                    if (!response.error && response.data) {
                        setName(response.data.name);
                        setDescription(response.data.description);
                        setKeywords(response.data.keywords.map(k => k.value));
                    }
                } catch (err) {
                    console.error("Error fetching signature detail:", err);
                }
            } else {
                setName("");
                setDescription("");
                setKeywords([]);
                setKeywordInput("");
            }
        };

        fetchSignature();
    }, [editId]);

    const handleClose = () => {
        setName("");
        setDescription("");
        setKeywords([]);
        setKeywordInput("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("create");
        params.delete("edit");
        const queryString = params.toString();
        router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    };

    const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && keywordInput.trim()) {
            e.preventDefault();
            if (!keywords.includes(keywordInput.trim())) {
                setKeywords([...keywords, keywordInput.trim()]);
            }
            setKeywordInput("");
        }
    };

    const removeKeyword = (index: number) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { apiPost, apiPatch } = await import("@/services/api.service");

            if (editId) {
                // Update existing signature
                const response = await apiPatch<{ error: boolean; message?: string }>(
                    `/api/signatures/${editId}`,
                    { name, description, keywords, keyId: selectedKeyId }
                );
                if (!response.error) {
                    onRefresh?.();
                    handleClose();
                } else {
                    alert(response.message || "Failed to update signature");
                }
            } else {
                // Create new signature
                const response = await apiPost<{ error: boolean; message?: string }>(
                    "/api/signatures",
                    { name, description, keywords, keyId: selectedKeyId }
                );
                if (!response.error) {
                    onRefresh?.();
                    handleClose();
                } else {
                    alert(response.message || "Failed to create signature");
                }
            }
        } catch (err: any) {
            console.error("Error submitting signature:", err);
            alert(err.message || "An error occurred while saving the signature");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editId ? "Edit Signature" : "Add New Signature"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Signature Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter signature name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-none">
                                    {keyword}
                                    <button
                                        type="button"
                                        onClick={() => removeKeyword(index)}
                                        className="rounded-full hover:bg-gray-300 p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <Input
                            id="keywords"
                            placeholder="Type keyword and press Enter"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={handleAddKeyword}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            {editId ? "Update Signature" : "Create Signature"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
