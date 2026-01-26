"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Pencil, Trash2, Loader2 } from "lucide-react";
import { WebsiteInput, WebsiteTag } from "./website-tag";
import { useUser } from "@/contexts/UserContext";
import { apiPost, apiPut } from "@/services/api.service";

export interface Category {
    id: string;
    name: string;
    description: string;
    websites: string[];
}

interface CategoryEditorProps {
    category?: Category;
    isNew?: boolean;
}

export const CategoryEditor = ({ category, isNew = false }: CategoryEditorProps) => {
    const router = useRouter();
    const [name, setName] = useState(category?.name || "New Category");
    const [isEditingName, setIsEditingName] = useState(isNew);
    const [description, setDescription] = useState(category?.description || "");
    const [websites, setWebsites] = useState<string[]>(category?.websites || []);
    const [isSaving, setIsSaving] = useState(false);

    const { selectedKeyId } = useUser();

    const hasChanges =
        isNew ||
        name !== category?.name ||
        description !== category?.description ||
        JSON.stringify(websites) !== JSON.stringify(category?.websites);

    const handleSave = async () => {
        if (!selectedKeyId) {
            alert("No activation key selected. Please select a key first.");
            return;
        }

        setIsSaving(true);
        try {
            if (isNew) {
                const response = await apiPost<{ success: boolean; message: string }>("/api/web-categories", {
                    keyId: selectedKeyId,
                    name,
                    description,
                    scope: "USER",
                    websites,
                });

                if (response.success) {
                    alert(response.message || "Category created successfully!");
                    router.push("/dashboard/web-categorization");
                } else {
                    alert(response.message || "Failed to create category");
                }
            } else {
                const body: Record<string, any> = {};
                if (name !== category?.name) body.name = name;
                if (description !== category?.description) body.description = description;
                if (JSON.stringify(websites) !== JSON.stringify(category?.websites)) body.websites = websites;

                const response = await apiPut<{ success: boolean; message: string }>(
                    `/api/web-categories/${category?.id}`,
                    body
                );

                if (response.success) {
                    setIsEditingName(false);
                    alert(response.message || "Category updated successfully!");
                    // We might need to refresh the page or update parent state if we're not redirecting
                    // For now, let's keep it simple as it stays on the same page for edits
                } else {
                    alert(response.message || "Failed to update category");
                }
            }
        } catch (error: any) {
            console.error("Error saving category:", error);
            alert(error.message || "An error occurred while saving the category");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (isNew) {
            router.push("/dashboard/web-categorization");
        } else {
            setName(category?.name || "");
            setDescription(category?.description || "");
            setWebsites(category?.websites || []);
            setIsEditingName(false);
        }
    };

    const handleAddWebsite = (domain: string) => {
        if (!websites.includes(domain)) {
            setWebsites([domain, ...websites]);
        }
    };

    const handleDeleteWebsite = (domain: string) => {
        setWebsites(websites.filter(w => w !== domain));
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Category Name Section */}
            <div className="flex items-center gap-4 mb-2">
                {isEditingName ? (
                    <input
                        type="text"
                        className="text-xl font-bold text-gray-900 border-b-2 border-primary outline-none bg-transparent py-1 px-2 focus:ring-0 w-full max-w-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        onBlur={() => !name && setName(category?.name || "New Category")}
                    />
                ) : (
                    <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                )}
                {!isEditingName && (
                    <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                )}
            </div>
            {/* Description Section */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4 shadow-sm focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <textarea
                    className="w-full h-32 text-gray-500 leading-relaxed text-sm bg-transparent border-none outline-none resize-none placeholder-gray-400"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter category description..."
                />
            </div>

            {/* Websites Section */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-bold text-gray-900 transition-colors">Websites</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <WebsiteInput onAdd={handleAddWebsite} />
                    {websites.map((url) => (
                        <WebsiteTag
                            key={url}
                            domain={url}
                            onDelete={() => handleDeleteWebsite(url)}
                        />
                    ))}
                </div>
            </div>

            {/* Action Buttons - Only show if hasChanges is true */}
            {hasChanges && (
                <div className="flex items-center justify-end gap-4 mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

