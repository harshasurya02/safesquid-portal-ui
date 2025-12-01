"use client";

import Image from "next/image";
import { ArrowLeft, Home, CircleHelp, X, Menu, User, Building2, History, MessageSquare, HelpCircle, LogOut } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          {/* <div className="fixed top-0 left-0 right-0 w-full h-full sm:max-h-[80vh] bg-white shadow-lg z-50 md:hidden overflow-y-auto animate-in slide-in-from-top duration-300"> */}
          <div className="fixed top-0 left-0 right-0 w-full h-full sm:max-h-[80vh] bg-white shadow-lg z-50 md:hidden overflow-y-auto">
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold text-gray-900">Menu</span>
                <button
                  className="p-1 text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Section */}
              <div className="p-4 border-b space-y-3">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <span>Key_database_1</span>
                  <button className="p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>C-Code:12JH132</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Key_database_MPKV_1</span>
                  <button className="p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 border border-gray-200 rounded">
                  <span>+</span>
                  <span>Write your keys here</span>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      <User className="w-5 h-5" />
                      <span>User Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      <Building2 className="w-5 h-5" />
                      <span>Organization profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      <History className="w-5 h-5" />
                      <span>History</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      <MessageSquare className="w-5 h-5" />
                      <span>Feedback</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      <HelpCircle className="w-5 h-5" />
                      <span>Get help</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
              </nav>
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
