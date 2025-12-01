"use client";

import Image from "next/image";
import { ArrowLeft, Home, CircleHelp, X, Menu, User, Building2, History, MessageSquare, HelpCircle, LogOut, ChevronRight, ChevronLeft, Plus, Pencil } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showActivationKeys, setShowActivationKeys] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setShowActivationKeys(false); // Reset to main menu on close
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activationKeys = [
    { name: "Key_database_India_Maha_1", code: "C-Code: 1FFHG123" },
    { name: "Key_database_India_Maha_1", code: "C-Code: 1FFHG123" },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 py-3">
        <Image
          src="/logo.png"
          width={140}
          height={24}
          alt="SafeSquid"
          className="h-6 w-auto"
        />
        <button
          className="p-2 text-gray-600"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Drawer - Slides from Top */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer - Full Width, Slides from Top */}
          <div className="fixed top-0 left-0 right-0 w-full h-full sm:max-h-[80vh] bg-white shadow-lg z-50 md:hidden overflow-y-auto">
            <div className="flex flex-col p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Menu</span>
                <button
                  className="p-1 text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Keys Section */}
              <div className="mb-8">
                <h3 className="text-xs text-gray-400 mb-3">Keys</h3>
                <div className="space-y-2">
                  {/* Active Key */}
                  <div className="flex items-start justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">key_database_1</span>
                        <span className="text-xs text-gray-500">C-Code: 12AB23</span>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Inactive Key */}
                  <div className="flex items-start justify-between p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2"></div>
                      <span className="text-sm font-medium text-gray-900">key_database_maha_1</span>
                    </div>
                    <button className="p-1 text-gray-400">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add Button */}
                  <div className="flex justify-center mt-4">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Section */}
              <div className="mb-8">
                <h3 className="text-xs text-gray-400 mb-3">Profile</h3>
                <nav className="flex flex-col space-y-4">
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">User Profile</a>
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">Organization profile</a>
                </nav>
              </div>

              {/* Account Section */}
              <div>
                <h3 className="text-xs text-gray-400 mb-3">Account</h3>
                <nav className="flex flex-col space-y-4">
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">History</a>
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">Feedback</a>
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">Get help</a>
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">Logout</a>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between px-8 py-4">
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

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-3 pl-4 border-l border-gray-200 text-left hover:bg-gray-50 rounded p-2 transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-medium">
                MS
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-900">Key_database_maharashtra_1</span>
                <span className="text-[10px] text-gray-500">C-Code:12JH132</span>
              </div>
            </button>

            {/* Desktop Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                {!showActivationKeys ? (
                  // Main Menu
                  <div className="py-2">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowActivationKeys(true)}
                    >
                      <span>Activation keys</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <span>User Profile</span>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <span>Organization profile</span>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <span>Activity History</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        M
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Mukund Sharma</span>
                        <span className="text-xs text-gray-500">mukund@safesquid.net</span>
                      </div>
                    </div>
                    <button className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <span>Log out</span>
                    </button>
                  </div>
                ) : (
                  // Activation Keys Menu
                  <div>
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setShowActivationKeys(false)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-700">Activation keys</span>
                    </div>
                    <div className="bg-blue-50/50">
                      {activationKeys.map((key, index) => (
                        <div key={index} className="px-4 py-3 border-b border-gray-100 last:border-0 flex items-center justify-between group">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{key.name}</span>
                            <span className="text-xs text-blue-600">{key.code}</span>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="w-full flex items-center justify-center py-3 text-gray-600 hover:bg-gray-50 border-t border-gray-100">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
