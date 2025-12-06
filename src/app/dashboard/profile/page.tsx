import { ProfileForm } from "@/components/profile/profile-form";
import { Edit2 } from "lucide-react";
import { cookies } from "next/headers";

async function getProfileData() {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store", // Ensure fresh data on every request
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
  }
  return null;
}

export default async function ProfilePage() {
  const profileData = await getProfileData();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">User profile</h2>
        </div>

      <div className="mx-auto max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-gray-900">Personal info</h1>
               <Edit2 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Update your personal details here.</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Reset Password
          </button>
        </div>

        {/* Client Side Form */}
        <ProfileForm initialData={profileData} />

      </div>
    </div>
  );
}
