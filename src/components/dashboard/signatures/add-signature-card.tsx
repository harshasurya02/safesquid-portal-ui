"use client";

import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AddSignatureCard() {
    const pathname = usePathname();

    return (
        <Link href={`${pathname}?create=true`} className="block h-full">
            <Card className="h-full border-gray-200 shadow-none border-dashed border-2 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors min-h-[300px]">
                <div className="w-20 h-20 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <Plus className="h-10 w-10 text-gray-400" />
                </div>
            </Card>
        </Link>
    );
}
