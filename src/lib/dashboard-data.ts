import {
  Database,
  FileBadge,
  GlobeLock,
  ShieldAlert,
  Users,
  CreditCard,
  LucideIcon,
} from "lucide-react";

export interface DashboardSubItem {
  title: string;
  link: string;
}

export interface DashboardItemProps {
  icon: LucideIcon;
  title: string;
  mobileTitle: string;
  subtitle: string;
  mobileSubtitle: string;
  link: string;
  variant?: "default" | "warn" | "destructive";
  subItems?: DashboardSubItem[];
}

export const dashboardItems: DashboardItemProps[] = [
  {
    icon: Database,
    title: "Instances",
    mobileTitle: "Instances",
    subtitle: "5 Active",
    mobileSubtitle: "5 Active",
    link: "/dashboard/instances",
    variant: "default",
    subItems: [
      { title: "Instance_database_12", link: "/dashboard/instances/1" },
      { title: "Instance_testing_12", link: "/dashboard/instances/2" },
    ],
  },
  {
    icon: FileBadge,
    title: "Certificate",
    mobileTitle: "Certificate",
    subtitle: "Renew before 12 Jan 23",
    mobileSubtitle: "Renew before 01/12/2023",
    link: "/dashboard/certificate",
    variant: "warn",
    subItems: [
      { title: "Upload", link: "/dashboard/certificate/upload" },
      { title: "Regenerate", link: "/dashboard/certificate/regenerate" },
      { title: "Download", link: "/dashboard/certificate/download" },
    ],
  },
  {
    icon: GlobeLock,
    title: "Web Categorization",
    mobileTitle: "Categories",
    subtitle: "21 Custom Categories",
    mobileSubtitle: "21 Categories",
    link: "/dashboard/web-categorization",
    variant: "default",
    subItems: [
      { title: "Add a category", link: "/dashboard/web-categorization/add" },
    ],
  },
  {
    icon: ShieldAlert,
    title: "ClamAV",
    mobileTitle: "ClamAV",
    subtitle: "21 Signatures",
    mobileSubtitle: "21 Signatures",
    link: "/dashboard/clamav",
    variant: "default",
    subItems: [{ title: "Add a signature", link: "/dashboard/clamav/add" }],
  },
  {
    icon: Users,
    title: "Team",
    mobileTitle: "Team",
    subtitle: "38 Members",
    mobileSubtitle: "38 Members",
    link: "/dashboard/team",
    variant: "default",
    subItems: [{ title: "Add a member", link: "/dashboard/team/add" }],
  },
  {
    icon: CreditCard,
    title: "Subscription",
    mobileTitle: "Subscription",
    subtitle: "Renew before 12 Jan 23",
    mobileSubtitle: "Renew before 01/12/2023",
    link: "/dashboard/subscription",
    variant: "destructive",
    subItems: [
      {
        title: "Extend conservation period",
        link: "/dashboard/subscription/extend",
      },
      {
        title: "View billing history",
        link: "/dashboard/subscription/history",
      },
    ],
  },
];
