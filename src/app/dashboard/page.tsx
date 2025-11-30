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
    subtitle: "5 Active",
    link: "/dashboard/instances",
  },
  {
    icon: FileBadge,
    title: "Certificate",
    subtitle: "Renew before 12 Jan 23",
    link: "/dashboard/certificate",
  },
  {
    icon: GlobeLock,
    title: "Web Categorisation",
    subtitle: "21 Custom Categories",
    link: "/dashboard/web-categorisation",
  },
  {
    icon: ShieldAlert,
    title: "ClamAV",
    subtitle: "21 Signatures",
    link: "/dashboard/clamav",
  },
  {
    icon: Users,
    title: "Team",
    subtitle: "38 Members",
    link: "/dashboard/team",
  },
  {
    icon: CreditCard,
    title: "Subscription",
    subtitle: "Renew before 12 Jan 23",
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 max-w-5xl mx-auto">
          {dashboardItems.map((item, index) => (
            <DashboardItem
              key={index}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              link={item.link}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
