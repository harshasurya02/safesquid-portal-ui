import type React from "react";
import Image from "next/image";
import { HelpCircle } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 space-y-4">
      {/* Navbar — hidden on mobile */}
      <div className="hidden sm:flex items-center justify-between py-6 px-15 border-b-2">
        <Image
          src="/logo.png"
          width={211}
          height={32}
          alt="SafeSquid"
          className="h-8 w-[211px]"
        />
        <HelpCircle className="w-5 h-5 text-gray-400" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center px-4 pb-4 min-h-screen md:min-h-auto">
        <div className="w-full p-2 md:max-w-[552px] md:p-0 my-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
