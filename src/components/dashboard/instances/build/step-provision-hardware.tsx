"use client";

import { useState } from "react";
import { Cloud, Server, Disc, Home, ChevronDown, Building } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function StepProvisionHardware() {
    const [proxyCount, setProxyCount] = useState(1);

    const handleIncrement = () => setProxyCount(prev => prev + 1);
    const handleDecrement = () => setProxyCount(prev => Math.max(1, prev - 1));

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">
                    Estimate your hardware requirements
                </h1>
                    <p className="mt-1 text-sm text-gray-500">
                    SafeSquid is SMP-Aware (for Scale Up) and Cluster Ready (for Scale Out)
                </p>
            </div>

            <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-900">
                    Total number of Deployment locations
                </label>
                <input 
                    type="number" 
                    defaultValue={2}
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
            </div>

                {/* Main Interactive Topology Area */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Diagram Controls */}
                <div className="flex flex-col border-b border-gray-100 px-6 py-4">
                    {/* Line 1: Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-blue-600">Maximum Concurrent Connections:</span>
                            <input 
                                type="text" 
                                defaultValue="12,000"
                                className="w-24 rounded border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-600 focus:outline-none"
                            />
                        </div>

                        {/* Location Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 outline-none">
                                    Location 1
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Location 1</DropdownMenuItem>
                                <DropdownMenuItem>Location 2</DropdownMenuItem>
                                <DropdownMenuItem>Location 3</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Line 2: Helper Text */}
                    <div className="mt-2 text-xs text-gray-400">
                        <p>On average, a user makes 4 concurrent connections</p>
                        <p>Click on icons for configurations</p>
                    </div>

                    {/* Line 3: For each proxy Dropdown */}
                    <div className="mt-4 flex justify-end">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 outline-none">
                                    For each proxy
                                    <ChevronDown size={14} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-white p-4" align="end">
                                <DropdownMenuLabel className="mb-2 border-b border-gray-50 pb-2 text-xs font-medium text-gray-500">
                                    Processors with "AES-NI"
                                </DropdownMenuLabel>
                                <div className="space-y-3">
                                    <DropdownMenuItem className="flex justify-between p-0 focus:bg-transparent cursor-default">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-gray-700">Cpu</span>
                                            <span className="text-[10px] text-gray-400">AES-NI</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-900">16 GB</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex justify-between p-0 focus:bg-transparent cursor-default">
                                        <span className="text-xs font-semibold text-gray-700">RAM</span>
                                        <span className="text-xs font-medium text-gray-900">16 GB</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex justify-between p-0 focus:bg-transparent cursor-default">
                                            <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-gray-700">NIC Card</span>
                                            <span className="text-[10px] text-gray-400">10 Gbps</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-900">1</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex justify-between p-0 focus:bg-transparent cursor-default">
                                        <span className="text-xs font-semibold text-gray-700">Storage</span>
                                        <span className="text-xs font-medium text-gray-900">160 GB</span>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="relative p-6">
                    {/* Topology Diagram Grid (Auto Height) */}
                    <div className="grid grid-cols-4 gap-y-8 gap-x-4 w-full relative">
                        
                        {/* Connecting Arrows Layer (Overlapping Row 2) */}
                        <div className="col-start-1 col-span-4 row-start-2 flex items-center justify-between px-[12%] pointer-events-none z-0">
                            {/* Arrow 1: Web -> Proxy */}
                            <div className="flex-1 border-t border-gray-300 relative h-px mx-4">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-300"></div>
                            </div>
                             {/* Arrow 2: Proxy -> LB */}
                             <div className="flex-1 border-t border-gray-300 relative h-px mx-4">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-300"></div>
                            </div>
                             {/* Arrow 3: LB -> Office */}
                             <div className="flex-1 border-t border-gray-300 relative h-px mx-4">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-300"></div>
                            </div>
                        </div>


                        {/* Row 1, Col 2: Log Aggregator (Centered in cell) */}
                        <div className="col-start-2 row-start-1 flex flex-col items-center justify-center opacity-40">
                             <div className="rounded border border-dashed border-gray-400 p-2">
                                <Disc size={24} className="text-gray-400" />
                            </div>
                            <span className="mt-1 text-center text-xs text-gray-400">Log Aggregator<br/>(Combined)</span>
                        </div>


                        {/* Row 2: Main Nodes (Centered in cells) */}

                        {/* Col 1: Web */}
                         <div className="col-start-1 row-start-2 flex flex-col items-center justify-center gap-2 z-10 bg-white/0">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-900 bg-white">
                                <Cloud size={32} strokeWidth={1.5} className="text-gray-900" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Web</span>
                        </div>

                        {/* Col 2: Proxy */}
                        <div className="col-start-2 row-start-2 flex flex-col items-center justify-center z-10 w-full">
                            <div className="flex flex-col items-center gap-2 rounded-xl bg-gray-100 p-4 w-full max-w-[160px]">
                                <div className="mb-2 flex gap-2">
                                    <button className="flex h-6 w-8 items-center justify-center rounded bg-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-300">Cancel</button>
                                    <button 
                                        onClick={handleDecrement}
                                        className="flex h-6 w-6 items-center justify-center rounded bg-white text-xs text-gray-400 hover:text-gray-600"
                                    >
                                        -1
                                    </button>
                                    <button 
                                        onClick={handleIncrement}
                                        className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-300"
                                    >
                                        +1
                                    </button>
                                </div>

                                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <Server size={32} strokeWidth={1.5} className="text-gray-900" />
                                </div>
                                <span className="text-center text-sm font-medium text-gray-900">
                                    {proxyCount} Proxy<br/>Server{proxyCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Col 3: Load Balancer */}
                        <div className="col-start-3 row-start-2 flex flex-col items-center justify-center gap-2 z-10">
                            <div className="flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <div className="flex gap-1">
                                        <div className="h-3 w-3 rounded border border-gray-900 bg-white"></div>
                                        <div className="h-3 w-3 rounded border border-gray-900 bg-white"></div>
                                    </div>
                                    <div className="my-1 h-2 w-px bg-gray-900"></div>
                                    <div className="flex h-12 w-10 items-center justify-center rounded border-2 border-gray-900 bg-white">
                                        <div className="h-6 w-1 bg-gray-900"></div>
                                        <div className="mx-1 h-6 w-1 bg-gray-900"></div>
                                        <div className="h-6 w-1 bg-gray-900"></div>
                                    </div>
                                </div>
                            </div>
                            <span className="text-center text-sm font-medium text-gray-900">Load<br/>Balancer</span>
                        </div>

                        {/* Col 4: Office */}
                        <div className="col-start-4 row-start-2 flex flex-col items-center justify-center gap-2 z-10">
                             <div className="flex h-16 w-16 items-center justify-center">
                                <Building size={32} strokeWidth={1.5} className="text-gray-900" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Office</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
