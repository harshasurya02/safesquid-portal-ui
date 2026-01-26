"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

interface Key {
    id: string;
    name: string;
    key: string;
}

interface Org {
    id: string;
    name: string;
    description: string;
}

interface UserDetails {
    email: string;
    username: string;
    orgs?: Org[];
    keys: Key[];
}

interface UserContextType {
    userDetails: UserDetails | null;
    selectedKeyId: string | null;
    setSelectedKeyId: (id: string) => void;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/details`, {
                method: 'GET',
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setUserDetails(data);

                // Set default selected key if not already set
                if (data.keys && data.keys.length > 0 && !selectedKeyId) {
                    setSelectedKeyId(data.keys[0].id);
                }
            } else {
                console.warn("Failed to fetch user details");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (!selectedKeyId) return;

        const url = new URL(window.location.href);
        const currentK = url.searchParams.get('k');

        if (currentK !== selectedKeyId) {
            url.searchParams.set('k', selectedKeyId);
            router.push(url.pathname + url.search);
        }
    }, [selectedKeyId, router]);

    return (
        <UserContext.Provider
            value={{
                userDetails,
                selectedKeyId,
                setSelectedKeyId,
                isLoading,
                refreshUser: fetchUserDetails
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
