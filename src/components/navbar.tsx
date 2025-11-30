import Image from "next/image";
import { ArrowLeft, Home, Search, CircleHelp, X } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            width={211}
            height={32}
            alt="SafeSquid"
            className="h-8 w-auto"
          />
        </div>

        {/* Center Actions */}
        <div className="flex items-center gap-4 flex-1 justify-center max-w-3xl mx-auto">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Home className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="What would you like to do today?"
              className="w-full py-2.5 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <CircleHelp className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-medium">
              MS
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900">Key_database_maharashtra_1</span>
              <span className="text-[10px] text-gray-500">C-Code:12JH132</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
