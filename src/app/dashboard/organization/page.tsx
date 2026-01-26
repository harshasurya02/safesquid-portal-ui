import { OrganizationForm } from "@/components/organization/organization-form";
import { Edit2 } from "lucide-react";
import { cookies } from "next/headers";

async function getOrganizationData({ keyId }: { keyId: string }) {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organization/${keyId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
      credentials: "include",
    });
    // console.log(response);
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      return data;
    }
  } catch (error) {
    console.error("Failed to fetch organization data:", error);
  }
  return null;
}

export default async function OrganizationPage({ searchParams }: { searchParams: Promise<{ k: string }> }) {
  const { k: keyId } = await searchParams;
  const orgData = await getOrganizationData({ keyId });
  // console.log(orgData);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Organization profile</h2>
        </div> */}

      <div className="mx-auto max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-gray-900">Organization Profile</h1>
              <Edit2 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Manage your organization details</p>
          </div>
        </div>

        {/* Client Side Form */}
        <OrganizationForm initialData={orgData} />

      </div>
    </div>
  );
}
