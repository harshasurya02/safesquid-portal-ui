"use client";

import { useState } from "react";
import { WebsiteTag, WebsiteInput } from "./website-tag";

interface WebsiteListProps {
    initialWebsites: string[];
}

export const WebsiteList = ({ initialWebsites }: WebsiteListProps) => {
    const [websites, setWebsites] = useState<string[]>(initialWebsites);

    const handleAddWebsite = (domain: string) => {
        if (!websites.includes(domain)) {
            setWebsites([domain, ...websites]);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <WebsiteInput onAdd={handleAddWebsite} />
            {websites.map((url) => (
                <WebsiteTag key={url} domain={url} />
            ))}
        </div>
    );
};
