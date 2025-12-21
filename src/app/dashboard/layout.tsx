"use client";
import Navbar from "@/components/navbar";
import { UserProvider } from "@/contexts/UserContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <div className="min-h-screen bg-white">
                <Navbar />
                {children}
            </div>
        </UserProvider>
    );
}