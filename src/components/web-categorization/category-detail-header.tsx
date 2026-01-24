import { Pencil, Trash2 } from "lucide-react";

interface CategoryDetailHeaderProps {
    name: string;
}

export const CategoryDetailHeader = ({ name }: CategoryDetailHeaderProps) => {
    return (
        <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                    <Pencil className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-destructive hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
