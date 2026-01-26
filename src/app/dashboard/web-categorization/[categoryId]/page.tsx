import { notFound } from "next/navigation";
import { CategoryEditor } from "@/components/web-categorization/category-editor";
import { apiGetServer } from "@/services/api.server.service";
import { cookies } from "next/headers";

export interface Category {
    id: string;
    name: string;
    description: string;
    websites: string[];
}

interface ApiWebsite {
    id: string;
    domain: string;
    createdAt: string;
}

interface ApiResponse {
    success: boolean;
    category: {
        id: string;
        name: string;
        description?: string;
        scope: string;
    };
    websites: ApiWebsite[];
    count: number;
}

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
    const categoryId = (await params).categoryId;
    const cookieStore = await cookies();

    let category: Category | null = null;

    try {
        const response = await apiGetServer<ApiResponse>(
            `/api/web-categories/${categoryId}/websites`,
            {},
            { cache: "no-store" },
            cookieStore
        );

        if (response.success) {
            category = {
                id: response.category.id,
                name: response.category.name,
                description: response.category.description || "",
                websites: response.websites.map(w => w.domain)
            };
        }
    } catch (error) {
        console.error("Error fetching category details:", error);
    }

    if (!category) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Web Categorization</h1>

                    <CategoryEditor category={category} />
                </div>
            </div>
        </div>
    );
}
