"use client";

import { cn } from "@/lib/utils";

export function OptionCard({
    title,
    description,
    isSelected,
    onClick
}: {
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <div 
            onClick={onClick}
            className={cn(
                "cursor-pointer rounded-none py-4 pl-4 transition-all hover:bg-gray-50",
                isSelected 
                    ? "bg-blue-50/10" 
                    : "opacity-60 hover:opacity-100"
            )}
        >
            <h3 className={cn("text-xs md:text-base lg:text-md xl:text-lg 2xl:text-xl font-medium", isSelected ? "text-gray-900" : "text-primary")}>
                {title}
            </h3>
            <p className="mt-1 text-xs md:text-sm lg:text-base text-gray-500">
                {description}
            </p>
        </div>
    );
}
