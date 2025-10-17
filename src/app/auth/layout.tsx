import type React from "react";
import { HelpCircle } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="font-semibold text-gray-900">SafeSquid</span>
        </div>
        <HelpCircle className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-center justify-center px-4 pb-4">
        <div className="w-[552px]">{children}</div>
      </div>
    </div>
  );
}
