import type React from "react";
import Image from "next/image";
import { HelpCircle } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navbar — fixed position */}
      <div className="absolute top-0 left-0 right-0 w-full z-50 bg-gray-50 min-h-20 flex items-center justify-between py-3 px-7 md:py-6 md:px-15 border-b-2">
        <Image
          src="/logo.png"
          width={211}
          height={32}
          alt="SafeSquid"
          className="h-8 w-[13.18988rem]"
        />
        <HelpCircle className="w-5 h-5 text-gray-400" />
      </div>

      {/* Main content */}

      {/* <div className="flex flex-col items-center justify-center px-4 pb-4 min-h-screen md:min-h-auto">
        <div className="w-full p-2 md:max-w-[34.5rem] md:p-0 my-auto">
          {children}
        </div>
      </div> */}

      <div className="flex flex-col items-center justify-center px-4 pb-4 min-h-screen md:min-h-auto md:pt-20">
        <div className="w-full max-w-[clamp(20rem,90vw,34.5rem)] p-[clamp(0.5rem,2vw,0rem)] my-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
