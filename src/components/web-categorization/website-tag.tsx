"use client";
import { Trash2, X, Plus } from "lucide-react";
import { useState } from "react";

interface WebsiteTagProps {
    domain: string;
    onDelete?: () => void;
}

export const WebsiteTag = ({ domain, onDelete }: WebsiteTagProps) => {
    return (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-blue-50 bg-white shadow-sm hover:border-primary/30 transition-all min-w-0 h-10 group/tag">
            <div className="flex items-center gap-2 min-w-0">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {/* Icon placeholder */}
                </div>
                <span className="text-xs font-medium text-gray-600 truncate">{domain}</span>
            </div>

            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="opacity-0 group-hover/tag:opacity-100 p-1 text-gray-400 hover:text-destructive hover:bg-red-50 rounded-md transition-all flex-shrink-0"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
};

interface WebsiteInputProps {
    onAdd: (domain: string) => void;
}

export const WebsiteInput = ({ onAdd }: WebsiteInputProps) => {
    const [error, setError] = useState<string | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const value = e.currentTarget.value.trim();

            if (!value) return;

            const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

            if (URL_REGEX.test(value)) {
                onAdd(value);
                e.currentTarget.value = "";
                setError(null);
            } else {
                setError("Please enter a valid URL (e.g. example.com)");
            }
        } else {
            // Clear error when typing
            if (error) setError(null);
        }
    };


    return (
        <div className="flex flex-col gap-1 w-full">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-white transition-all group h-10 ${error ? 'border-destructive ring-1 ring-destructive/20' : 'border-gray-100 hover:border-primary/30'}`}>
                <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${error ? 'text-destructive' : 'text-gray-400'}`}>
                    <Plus className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    placeholder="Website"
                    className="w-full text-xs font-medium text-gray-600 outline-none placeholder-gray-400 bg-transparent"
                    onKeyDown={handleKeyDown}
                />
            </div>
            {error && (
                <span className="text-[10px] text-destructive font-medium px-1">
                    {error}
                </span>
            )}
        </div>
    );
};
