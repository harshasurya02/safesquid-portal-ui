import Navbar from "@/components/navbar";
import { DashboardItem, DashboardItemProps } from "@/components/dashboard/dashboard-item";
import { dashboardItems } from "@/lib/dashboard-data";

export default function DashboardPage() {
  const userName = "Mukund";

  return (
    // <div className="min-h-screen bg-white">
    //   <Navbar />

    <main className="xl:max-w-5xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-8 py-12">
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-4xl font-normal text-gray-900">
          Hi <span className="font-medium">{userName}</span>
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
