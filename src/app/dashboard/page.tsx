"use client"
// import Navbar from "@/components/navbar";
import { DashboardItem, DashboardItemProps } from "@/components/dashboard/dashboard-item";
import { useUser } from "@/contexts/UserContext";
import { dashboardItems } from "@/lib/dashboard-data";

export default function DashboardPage() {
  const { userDetails: user } = useUser()

  return (
    // <div className="min-h-screen bg-white">
    //   <Navbar />

    <main className="xl:max-w-7xl lg:max-w-6xl md:max-w-4xl sm:max-w-xl max-w-md mx-auto px-8 py-12">
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-gray-900">
          Hi <span className="font-medium">{user?.username}</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-11 gap-y-10 mx-auto place-items-center text-center">
        {dashboardItems.map((item, index) => (
          <DashboardItem
            key={index}
            icon={item.icon}
            title={item.title}
            mobileTitle={item.mobileTitle}
            subtitle={item.subtitle}
            mobileSubtitle={item.mobileSubtitle}
            variant={item.variant}
            link={item.link}
          />
        ))}
      </div>
    </main>
    // </div>
  );
}
