import { CategoryEditor } from "@/components/web-categorization/category-editor";

export default function AddCategoryPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Web Categorization</h1>

                    <CategoryEditor isNew={true} />
                </div>
            </div>
        </div>
    );
}
