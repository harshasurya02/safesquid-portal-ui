"use client";

import { useEffect, useState } from "react";
import { CategoryCard } from "@/components/web-categorization/category-card";
import { AddCategoryCard } from "@/components/web-categorization/add-category-card";
import { DashboardFilters } from "@/components/web-categorization/dashboard-filters";
import { useUser } from "@/contexts/UserContext";
import { apiGet, apiDelete } from "@/services/api.service";
import { Category } from "./mock-data";
import { Loader2 } from "lucide-react";

interface ApiCategory {
    id: string;
    name: string;
    description: string;
    scope: string;
    websites: { domain: string; createdAt: string }[];
}

interface ApiResponse {
    success: boolean;
    categories: ApiCategory[];
    count: number;
}

export default function WebCategorizationPage() {
    const { selectedKeyId } = useUser();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await apiDelete<{ success: boolean; message: string }>(`/api/web-categories/${id}`);
            if (response.success) {
                setCategories(prev => prev.filter(c => c.id !== id));
            } else {
                alert(response.message || "Failed to delete category");
            }
        } catch (err: any) {
            console.error("Error deleting category:", err);
            alert(err.message || "An error occurred while deleting the category");
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            if (!selectedKeyId) return;

            setIsLoading(true);
            setError(null);
            try {
                const response = await apiGet<ApiResponse>(`/api/web-categories/by-key/${selectedKeyId}`);
                if (response.success) {
                    const mappedCategories: Category[] = response.categories.map(cat => ({
                        id: cat.id,
                        name: cat.name,
                        description: cat.description || "",
                        websites: cat.websites.map(w => w.domain)
                    }));
                    setCategories(mappedCategories);
                } else {
                    setError("Failed to load categories");
                }
            } catch (err: any) {
                console.error("Error fetching categories:", err);
                setError(err.message || "An error occurred while fetching categories");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [selectedKeyId]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Web Categorization</h1>
                    <DashboardFilters />
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-gray-500 font-medium">Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 text-sm text-red-700 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AddCategoryCard />
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}