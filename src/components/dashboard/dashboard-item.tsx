import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface DashboardItemProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    link: string;
}

export const DashboardItem = ({
    icon: Icon,
    title,
    subtitle,
    link
}: DashboardItemProps) => {
    return (
        <Link className="flex items-center gap-4 p-4 bg-white rounded-lg" href={link}>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg text-blue-600">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-base font-medium text-gray-900">{title}</span>
                <span className="text-sm text-gray-500">{subtitle}</span>
            </div>
        </Link>
    );
};
