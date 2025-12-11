"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function StepProvisionHardware() {
    const [proxyCount, setProxyCount] = useState(1);
    const [isProxyActive, setProxyActive] = useState(false);
    const [isLBActive, setLBActive] = useState(false);
    const [isLogActive, setLogActive] = useState(false);

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
            <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300">
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
                        <p>Click on icons to add to your topology</p>
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

                <div className="flex flex-col gap-8 p-8 min-h-[300px]">
                    {/* Top Row: Available Components Source */}
                    <div className="flex h-20 items-center justify-center gap-8 border-b border-dashed border-gray-100 pb-8">
                        {!isLogActive && (
                            <button 
                                onClick={() => setLogActive(true)}
                                className="group flex flex-col items-center justify-center gap-2 p-2 opacity-50 transition-all hover:scale-105 hover:opacity-100"
                            >
                                <div className="rounded border border-dashed border-gray-400 p-2">
                                    <Image src="/icons/log.png" alt="Log Aggregator" width={24} height={24} className="opacity-60" />
                                </div>
                                <span className="text-center text-xs text-gray-400 group-hover:text-blue-600">Log Aggregator</span>
                            </button>
                        )}

                        {!isProxyActive && (
                            <button 
                                onClick={() => setProxyActive(true)}
                                className="group flex flex-col items-center justify-center gap-2 p-2 transition-all hover:scale-105"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm group-hover:border-blue-200 group-hover:shadow-md">
                                    <Image src="/icons/proxy.png" alt="Proxy" width={32} height={32} />
                                </div>
                                <span className="text-center text-xs font-medium text-gray-600 group-hover:text-blue-600">Proxy</span>
                            </button>
                        )}

                        {!isLBActive && (
                            <button 
                                onClick={() => setLBActive(true)}
                                className="group flex flex-col items-center justify-center gap-2 p-2 transition-all hover:scale-105"
                            >
                                <div className="flex h-12 w-12 items-center justify-center">
                                    <Image src="/icons/load-balancer.png" alt="Load Balancer" width={32} height={32} className="-rotate-90 opacity-70 group-hover:opacity-100" />
                                </div>
                                <span className="text-center text-xs font-medium text-gray-600 group-hover:text-blue-600">Load Balancer</span>
                            </button>
                        )}

                        {isLogActive && isProxyActive && isLBActive && (
                            <span className="text-xs text-gray-300">All components deployed</span>
                        )}
                    </div>

                    {/* Main Topology Flow */}
                    <div className="relative flex flex-1 items-center justify-center gap-4">
                        
                        {/* Log Aggregator (Overlay) */}
                        {isLogActive && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center group cursor-pointer" onClick={() => setLogActive(false)}>
                                <div className="rounded border border-dashed border-gray-400 p-2 bg-white/50 hover:bg-red-50 hover:border-red-200 transition-colors">
                                    <Image src="/icons/log.png" alt="Log Aggregator" width={24} height={24} className="opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="px-1 py-0.5 bg-red-100 text-[10px] text-red-600 rounded">Remove</span>
                                    </div>
                                </div>
                                <div className="h-4 w-px border-l border-dashed border-gray-400"></div>
                            </div>
                        )}

                        {/* Flow Items */}
                        <div className="flex items-center gap-2">
                            
                            {/* Web */}
                            <div className="flex flex-col items-center justify-start gap-2 h-24">
                                <div className="flex h-16 w-16 items-center justify-center">
                                    <img src="/icons/web.svg" alt="Web" className="h-12 w-12" />
                                </div>
                                <span className="text-sm font-medium text-gray-900 leading-tight">Web</span>
                            </div>

                            {/* Arrow */}
                            <div className="w-12 border-t-2 border-gray-300 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-300"></div>
                            </div>

                            {/* Proxy (Conditional) */}
                            {isProxyActive && (
                                <>
                                    <div className="group relative flex flex-col items-center justify-center rounded-xl p-4 transition-all hover:bg-gray-50">
                                        {/* Hover Controls */}
                                        <div className="absolute -top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button onClick={() => setProxyActive(false)} className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 hover:bg-red-200">
                                                Cancel
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            {/* Quantity Controls (Only visible on hover) */}
                                            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 h-6">
                                                <button onClick={handleDecrement} className="flex h-6 w-6 items-center justify-center rounded bg-white border border-gray-200 text-xs text-gray-600 hover:bg-gray-100">-</button>
                                                <button onClick={handleIncrement} className="flex h-6 w-6 items-center justify-center rounded bg-white border border-gray-200 text-xs text-gray-600 hover:bg-gray-100">+</button>
                                            </div>

                                            <div className="flex h-16 w-16 items-center justify-center">
                                                <Image src="/icons/proxy.png" alt="Proxy" width={48} height={48} />
                                            </div>
                                            <span className="text-center text-sm font-medium text-gray-900 leading-tight">
                                                {proxyCount} Proxy<br/>Server{proxyCount !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="w-12 border-t-2 border-gray-300 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-300"></div>
                                    </div>
                                </>
                            )}

                            {/* Load Balancer (Conditional) */}
                            {isLBActive && (
                                <>
                                    <div className="group relative flex flex-col items-center justify-center rounded-xl p-4 transition-all hover:bg-gray-50">
                                         {/* Hover Controls */}
                                         <div className="absolute -top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button onClick={() => setLBActive(false)} className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 hover:bg-red-200">
                                                Cancel
                                            </button>
                                        </div>

                                        <div className="flex h-16 w-16 items-center justify-center mt-6">
                                            <Image src="/icons/load-balancer.png" alt="Load Balancer" width={56} height={56} className="-rotate-90 drop-shadow-sm" />
                                        </div>
                                        <span className="mt-2 text-center text-sm font-medium text-gray-900 leading-tight">Load<br/>Balancer</span>
                                    </div>

                                    {/* Arrow */}
                                    <div className="w-12 border-t-2 border-gray-300 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-300"></div>
                                    </div>
                                </>
                            )}

                            {/* Office */}
                            <div className="flex flex-col items-center justify-start gap-2 h-24">
                                <div className="flex h-16 w-16 items-center justify-center">
                                    <img src="/icons/office.svg" alt="Office" className="h-12 w-12" />
                                </div>
                                <span className="text-sm font-medium text-gray-900 leading-tight">Office</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
