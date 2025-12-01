import Navbar from "@/components/navbar";
import { DashboardItem } from "@/components/dashboard/dashboard-item";
import {
  Database,
  FileBadge,
  GlobeLock,
  ShieldAlert,
  Users,
  CreditCard,
} from "lucide-react";

const dashboardItems = [
  {
    icon: Database,
    title: "Instances",
    mobileTitle: "Instances",
    subtitle: "5 Active",
    mobileSubtitle: "5 Active",
    link: "/dashboard/instances",
  },
  {
    icon: FileBadge,
    title: "Certificate",
    mobileTitle: "Certificate",
    subtitle: "Renew before 12 Jan 23",
    mobileSubtitle: "Renew before 01/12/2023",
    link: "/dashboard/certificate",
  },
  {
    icon: GlobeLock,
    title: "Web Categorisation",
    mobileTitle: "Categories",
    subtitle: "21 Custom Categories",
    mobileSubtitle: "21 Categories",
    link: "/dashboard/web-categorisation",
  },
  {
    icon: ShieldAlert,
    title: "ClamAV",
    mobileTitle: "ClamAV",
    subtitle: "21 Signatures",
    mobileSubtitle: "21 Signatures",
    link: "/dashboard/clamav",
  },
  {
    icon: Users,
    title: "Team",
    mobileTitle: "Team",
    subtitle: "38 Members",
    mobileSubtitle: "38 Members",
    link: "/dashboard/team",
  },
  {
    icon: CreditCard,
    title: "Subscription",
    mobileTitle: "Subscription",
    subtitle: "Renew before 12 Jan 23",
    mobileSubtitle: "Renew before 01/12/2023",
    link: "/dashboard/subscription",
  },
];

export default function DashboardPage() {
  const userName = "Mukund";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-4xl font-normal text-gray-900">
            Hi <span className="font-medium">{userName}</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-11 gap-y-10 md:max-w-5xl mx-auto justify-items-center">
          {dashboardItems.map((item, index) => (
            <DashboardItem
              key={index}
              icon={item.icon}
              title={item.title}
              mobileTitle={item.mobileTitle}
              subtitle={item.subtitle}
              mobileSubtitle={item.mobileSubtitle}
              link={item.link}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
