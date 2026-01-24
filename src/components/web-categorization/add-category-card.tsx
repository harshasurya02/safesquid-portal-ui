import { Plus } from "lucide-react";
import Link from "next/link";

export const AddCategoryCard = () => {
    return (
        <Link
            href="/dashboard/web-categorization/add"
            className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[160px] hover:border-primary hover:bg-blue-50/30 transition-all group"
        >
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary transition-colors">
                <Plus className="w-8 h-8 font-light" />
            </div>
            <span className="mt-4 text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">
                Add New Category
            </span>
        </Link>
    );
};
