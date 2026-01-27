"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { getDashboardItems, DashboardItemProps } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

export function GlobalSearch() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);
    const [dashboardItems, setDashboardItems] = React.useState<DashboardItemProps[]>(getDashboardItems());
    const containerRef = React.useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { selectedKeyId } = useUser();

    // Fetch dashboard data when selectedKeyId changes
    React.useEffect(() => {
        const fetchDashboardData = async () => {
            if (!selectedKeyId) {
                setDashboardItems(getDashboardItems());
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard?keyId=${selectedKeyId}`, {
                    credentials: "include"
                });
                const result = await response.json();

                if (!result.error) {
                    setDashboardItems(getDashboardItems(result.data));
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                // Fallback to default dashboard items
                setDashboardItems(getDashboardItems());
            }
        };

        fetchDashboardData();
    }, [selectedKeyId]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleCategory = (title: string) => {
        setExpandedCategories((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const filteredItems = dashboardItems.map((item) => {
        // Construct a new object with modified links
        const modifyLink = (link: string) => selectedKeyId ? `${link}${link.includes('?') ? '&' : '?'}k=${selectedKeyId}` : link;

        const newItem = { ...item, link: modifyLink(item.link) };
        if (newItem.subItems) {
            newItem.subItems = newItem.subItems.map(si => ({ ...si, link: modifyLink(si.link) }));
        }

        // If query is empty, return newItem
        if (!query) return newItem;

        // Check if category matches
        const categoryMatches = newItem.title.toLowerCase().includes(query.toLowerCase());

        // Check if any sub-items match
        const matchingSubItems = newItem.subItems?.filter((subItem) =>
            subItem.title.toLowerCase().includes(query.toLowerCase())
        );

        if (categoryMatches) return newItem;
        if (matchingSubItems && matchingSubItems.length > 0) {
            return { ...newItem, subItems: matchingSubItems };
        }

        return null;
    }).filter(Boolean) as typeof dashboardItems;

    const handleSelect = (link: string) => {
        router.push(link);
        setIsOpen(false);
    };

    return (
        <div className="relative flex-1 lg:max-w-xl" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="What would you like to do today?"
                    className="w-full py-2.5 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {query ? (
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                            setQuery("");
                            // Keep open?
                        }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                ) : (
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 pointer-events-none">

                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-[600px] overflow-y-auto">
                    {/* Header of dropdown? Screenshot shows "What would you like to do today?" as header of modal. 
                 Here we have input.
             */}

                    <div className="py-2">
                        {filteredItems.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found.</div>
                        ) : (
                            filteredItems.map((item) => (
                                <div key={item.title} className="border-b border-gray-50 last:border-0">
                                    <div
                                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                                        onClick={() => toggleCategory(item.title)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-gray-50 rounded text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{item.title}</span>
                                                <span className={cn("text-xs",
                                                    item.variant === "warn" ? "text-orange-500" :
                                                        item.variant === "destructive" ? "text-red-500" : "text-gray-500"
                                                )}>
                                                    {item.subtitle}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", expandedCategories.includes(item.title) ? "rotate-180" : "")} />
                                    </div>

                                    {expandedCategories.includes(item.title) && item.subItems && (
                                        <div className="bg-gray-50/50 px-4 pb-2">
                                            {item.subItems.map((subItem, index) => (
                                                <div
                                                    key={subItem.title}
                                                    className="flex items-center gap-3 py-2 pl-2 pr-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                                    onClick={() => handleSelect(subItem.link)}
                                                >
                                                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600">
                                                        {index + 1}
                                                    </span>
                                                    <span>{subItem.title}</span>
                                                    <ChevronRight className="w-3 h-3 ml-auto text-gray-400 opacity-0 group-hover:opacity-100" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
