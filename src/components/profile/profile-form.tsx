"use client";

import { StatefulButton } from "@/components/stateful-button";
import { StatefulInput } from "@/components/stateful-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Schema matching the API requirements
const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  designation: z.string().min(1, { message: "Designation is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  countryCode: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    designation: string;
    phone: string; // E.g., "+919876543210"
  } | null;
}

export const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Helper to split phone number
  const splitPhone = (fullPhone: string) => {
    const codes = ["+91", "+1", "+44"];
    for (const code of codes) {
      if (fullPhone.startsWith(code)) {
        return {
          countryCode: code,
          phone: fullPhone.slice(code.length),
        };
      }
    }
    return { countryCode: "+91", phone: fullPhone }; // Default fallback
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      designation: "",
      phone: "",
      countryCode: "+91",
    },
  });

  // Populate form with initial data
  useEffect(() => {
    if (initialData) {
      const { countryCode, phone } = splitPhone(initialData.phone || "");
      reset({
        name: initialData.name || "",
        email: initialData.email || "",
        designation: initialData.designation || "",
        countryCode,
        phone,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          designation: data.designation,
          phone: `${data.countryCode}${data.phone}`,
        }),
        credentials: "include",
      });

      if (response.ok) {
        router.refresh(); // Refresh server data
        // Optionally show success message
      } else {
        const result = await response.json();
        setServerError(result.message || "Failed to update profile");
      }
    } catch (error) {
       console.error("Profile update error:", error);
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

      {/* Full Name */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Full name</label>
        <StatefulInput
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
        <StatefulInput
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

       {/* Designation */}
       <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Designation</label>
        <StatefulInput
          type="text"
          error={errors.designation?.message}
          {...register("designation")}
        />
      </div>


      {/* Phone Number */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Phone number</label>
        <div className="flex w-full space-x-2">
            {/* Country Code */}
            <div className="flex-shrink-0 relative">
                <select
                    className="h-10 appearance-none bg-white border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                    {...register("countryCode")}
                >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex-1 w-full">
                <StatefulInput
                    type="text"
                    error={errors.phone?.message}
                    {...register("phone")}
                />
            </div>
        </div>
      </div>
      
       <div className="flex justify-end pt-4">
         <StatefulButton
            type="submit"
            variant={isLoading ? "inactive" : "active"}
            disabled={isLoading}
            className="w-auto px-6"
         >
            {isLoading ? "Saving..." : "Save Changes"}
         </StatefulButton>
       </div>
    </form>
  );
}
