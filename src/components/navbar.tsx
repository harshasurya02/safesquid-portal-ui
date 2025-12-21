"use client";

import Image from "next/image";
import { ArrowLeft, Home, CircleHelp, X, Menu, ChevronRight, ChevronLeft, Plus, Pencil } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlobalSearch } from "@/components/global-search";
import { useUser } from "@/contexts/UserContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showActivationKeys, setShowActivationKeys] = useState(false);
  // Use global user context
  const { userDetails, selectedKeyId, setSelectedKeyId } = useUser();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleKeySelect = (keyId: string) => {
    setSelectedKeyId(keyId);
    setIsMobileMenuOpen(false); // For mobile
    setShowActivationKeys(false); // Reset dropdown view
    setIsProfileOpen(false); // Close dropdown
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Determine active key
  const activeKey = userDetails?.keys?.find(k => k.id === selectedKeyId) || userDetails?.keys?.[0];

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Mobile Navbar */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3">
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
                  {/* Map Keys for Mobile */}
                   {userDetails?.keys?.map((key) => (
                      <div 
                        key={key.id} 
                        className="flex items-start justify-between p-3 first:bg-blue-50 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleKeySelect(key.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 ${key.id === activeKey?.id ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{key.name}</span>
                            <span className="text-xs text-gray-500">Key: {key.key}</span>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                   ))}

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
                  <span className="text-sm font-medium text-gray-900">{userDetails?.username || 'User'}</span>
                   <span className="text-xs text-gray-500">{userDetails?.email}</span>
                  <a href="/dashboard/profile" className="text-sm text-gray-900 hover:text-gray-600 mt-2">User Profile</a>
                  <a href="/dashboard/organization" className="text-sm text-gray-900 hover:text-gray-600">Organization profile</a>
                </nav>
              </div>

              {/* Account Section */}
              <div>
                <h3 className="text-xs text-gray-400 mb-3">Account</h3>
                <nav className="flex flex-col space-y-4">
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">History</a>
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">Feedback</a>
                  <a href="#" className="text-sm text-gray-900 hover:text-gray-600">Get help</a>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-gray-900 hover:text-gray-600 text-left"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Navbar */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4">
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
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" onClick={()=> router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Home className="w-5 h-5" />
          </button>



          {/*  inside component */}
          {/* Search Bar */}
          <GlobalSearch />
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
                 {userDetails?.username?.substring(0, 2).toUpperCase() || 'US'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-900">{activeKey?.name || userDetails?.username || 'Loading...'}</span>
                <span className="text-[10px] text-gray-500">{activeKey ? `Key: ${activeKey.key.substring(0, 8)}...` : 'No Active Key'}</span>
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
                    <a href="/dashboard/profile" className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <span>User Profile</span>
                    </a>
                    <a href="/dashboard/organization" className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <span>Organization profile</span>
                    </a>
                    <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <span>Activity History</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      <span>Log out</span>
                    </button>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {userDetails?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{userDetails?.username || 'User'}</span>
                        <span className="text-xs text-gray-500">{userDetails?.email || 'email@example.com'}</span>
                      </div>
                    </div>
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
                      {userDetails?.keys?.length ? (
                          userDetails.keys.map((key) => (
                            <div 
                              key={key.id} 
                              className={`px-4 py-3 border-b border-gray-100 last:border-0 flex items-center justify-between group cursor-pointer hover:bg-blue-50 transition-colors ${key.id === activeKey?.id ? 'bg-blue-50' : ''}`}
                              onClick={() => handleKeySelect(key.id)}
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{key.name}</span>
                                <span className="text-xs text-blue-600">{key.key}</span>
                              </div>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                      ) : (
                           <div className="px-4 py-3 text-sm text-gray-500">No keys found</div>
                      )}
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
