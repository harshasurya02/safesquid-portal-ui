import { Pencil, Trash2, Globe } from "lucide-react";
import Link from "next/link";

export interface Category {
    id: string;
    name: string;
    description: string;
    websites: string[];
}

interface CategoryCardProps {
    category: Category;
    onDelete: (id: string) => void;
}

export const CategoryCard = ({ category, onDelete }: CategoryCardProps) => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <Link
                    href={`/dashboard/web-categorization/${category.id}`}

                >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {category.name}
                    </h3>
                </Link>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/web-categorization/${category.id}`} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="p-1.5 text-gray-400 hover:text-destructive hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">
                {category.description}
            </p>

            <div className="flex flex-wrap gap-2 items-center mt-auto">
                <div className="flex -space-x-2">
                    {/* Mock icons for websites */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-50 border border-white flex items-center justify-center overflow-hidden">
                            <Globe className="w-3 h-3 text-gray-400" />
                        </div>
                    ))}
                </div>
                <span className="text-[10px] text-gray-400 font-medium ml-1">
                    {category.websites.length} websites
                </span>
            </div>


        </div>
    );
};
