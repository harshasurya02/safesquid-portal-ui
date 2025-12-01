import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SubtitleVariant = "default" | "warn" | "destructive";

export interface DashboardItemProps {
    icon: LucideIcon;
    title: string;
    mobileTitle: string;
    subtitle: string;
    mobileSubtitle: string;
    link: string;
    variant?: SubtitleVariant;
}

const getSubtitleColorClass = (variant: SubtitleVariant = "default") => {
    switch (variant) {
        case "warn":
            return "text-warn";
        case "destructive":
            return "text-destructive";
        default:
            return "text-gray-500";
    }
};

export const DashboardItem = ({
    icon: Icon,
    title,
    mobileTitle,
    subtitle,
    mobileSubtitle,
    link,
    variant = "default"
}: DashboardItemProps) => {
    const subtitleColorClass = getSubtitleColorClass(variant);

    return (
        <Link className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 p-4 bg-white rounded-lg w-74 md:w-full" href={link}>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-lg text-primary">
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col items-center md:items-start gap-0.5">
                <span className="text-sm md:text-base font-medium text-gray-900 md:hidden text-center">{mobileTitle}</span>
                <span className="text-sm md:text-base font-medium text-gray-900 hidden md:block">{title}</span>
                <span className={cn("text-xs md:text-sm md:hidden text-center", subtitleColorClass)}>{mobileSubtitle}</span>
                <span className={cn("text-xs md:text-sm hidden md:block", subtitleColorClass)}>{subtitle}</span>
            </div>
        </Link>
    );
};
