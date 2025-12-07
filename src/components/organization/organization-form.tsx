"use client";

import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Schema for Organization Profile
const organizationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  headquartersAddress: z.string().min(1, { message: "Address is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  employeeStrength: z.string().min(1, { message: "Employee strength is required" }),
  countriesOfOperations: z.string().min(1, { message: "Countries are required" }),
  totalLocations: z.string().min(1, { message: "Total locations is required" }),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  initialData: {
    name: string;
      headquartersAddress: string;
    industry: string;
    employeeStrength: string;
    countriesOfOperations: string;
    totalLocations: string;
    email: string;
  } | null;
}

export const OrganizationForm = ({ initialData }: OrganizationFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      headquartersAddress: "",
      industry: "",
      employeeStrength: "",
      countriesOfOperations: "",
      totalLocations: "",
    },
  });

  // Populate form with initial data
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        headquartersAddress: initialData.headquartersAddress || "",
        industry: initialData.industry || "",
        employeeStrength: initialData.employeeStrength || "",
        countriesOfOperations: initialData.countriesOfOperations || "",
        totalLocations: initialData.totalLocations || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: OrganizationFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organization/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const result = await response.json();
        setServerError(result.message || "Failed to update profile");
      }
    } catch (error) {
       console.error("Organization update error:", error);
       setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
        <StatefulInput
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />
      </div>
      
      {/* Email (Read Only based on screenshot design, user can't usually change org email easily) */}
       <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
        <StatefulInput
          type="email"
          value={initialData?.email || ""}
          disabled
          className="bg-gray-50"
        />
      </div>


      {/* Headquarters Address */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Headquarters Address</label>
        <textarea
          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[80px]"
          // Using standard textarea as StatefulInput might be input-only. Or I can check StatefulInput.
          // Checking StatefulInput... it uses `input` element. So I'll use standard textarea or styling matching it.
          // Using standard textarea with matching class
          {...register("headquartersAddress")}
        />
        {errors.headquartersAddress?.message && <p className="text-xs text-red-500 mt-1">{errors.headquartersAddress.message}</p>}
      </div>

       {/* Industry */}
       <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Industry</label>
        <StatefulInput
          type="text"
          error={errors.industry?.message}
          {...register("industry")}
        />
      </div>

      {/* Employee's Strength */}
       <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Employee&apos;s Strength</label>
        <StatefulInput
          type="text"
          error={errors.employeeStrength?.message}
          {...register("employeeStrength")}
        />
      </div>

      {/* Countries of Operations */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Countries of Operations</label>
        <textarea
          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[60px]"
          {...register("countriesOfOperations")}
        />
         {errors.countriesOfOperations?.message && <p className="text-xs text-red-500 mt-1">{errors.countriesOfOperations.message}</p>}
      </div>

      {/* Total locations */}
       <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Total locations</label>
        <StatefulInput
          type="text"
          error={errors.totalLocations?.message}
          {...register("totalLocations")}
        />
      </div>
      
       {/* Save Button */}
       {/* Using a hidden button or just reliance on auto-save? The design implies "Manage your organization details" and has an edit icon.
           Usually forms need a save button. I will add one.
       */}
       <div className="flex justify-end pt-4">
         <StatefulButton
            type="submit"
            variant={isLoading ? "inactive" : "active"}
            disabled={isLoading}
            className="w-auto px-6" // Adjusting height
         >
            {isLoading ? "Saving..." : "Save Changes"}
         </StatefulButton>
       </div>
    </form>
  );
}
