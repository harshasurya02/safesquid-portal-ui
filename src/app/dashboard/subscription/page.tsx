"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { apiGet, apiPost } from "@/services/api.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays,
    Users,
    Server,
    ArrowRightCircle,
    Clock,
    ShieldCheck,
    Plus,
    CreditCard,
    Loader2,
    AlertCircle
} from "lucide-react";

interface Subscription {
    id: string;
    status: string;
    plan: string;
    startDate: string;
    endDate: string;
    usage: {
        usersProtected: number;
        instances: number;
    };
    billing: {
        cycle: string;
        lastPaymentDate: string;
        nextInvoiceAmount: number;
        currency: string;
    };
    metrics: {
        daysRemaining: number;
        totalDays: number;
    };
}

export default function SubscriptionPage() {
    const { selectedKeyId } = useUser();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConserving, setIsConserving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscription = async () => {
        if (!selectedKeyId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const data = await apiGet<Subscription>("/api/subscription", { keyId: selectedKeyId });
            setSubscription(data);
        } catch (err) {
            console.error("Failed to fetch subscription:", err);
            setError("Could not load subscription details. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, [selectedKeyId]);

    const handleConserve = async () => {
        if (!subscription) return;

        try {
            setIsConserving(true);
            await apiPost("/api/subscription/conserve", { subscriptionId: subscription.id });
            // Refresh the page data
            await fetchSubscription();
        } catch (err) {
            console.error("Failed to conserve subscription:", err);
            alert("Conserve limit has been reached");
        } finally {
            setIsConserving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-muted-foreground animate-pulse">Loading subscription details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="p-4 bg-red-50 rounded-full">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Connection Issue</h3>
                <p className="text-muted-foreground text-center max-w-md">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                    <ShieldCheck className="h-16 w-16" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">No Active Subscription</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Protect your infrastructure with our enterprise-grade security solutions.
                    </p>
                </div>
                <Link href="/dashboard/subscription/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-8">
                        Get Started
                    </Button>
                </Link>
            </div>
        );
    }

    const progressPercentage = (subscription.metrics.daysRemaining / subscription.metrics.totalDays) * 100;
    const nextInvoiceFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: subscription.billing.currency,
    }).format(subscription.billing.nextInvoiceAmount);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Subscription</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your license, monitor usage, and extend your protection.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/subscription/new">
                        <Button variant="outline" className="h-10">
                            Create New
                        </Button>
                    </Link>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 h-10 px-6"
                        onClick={handleConserve}
                        disabled={isConserving}
                    >
                        {isConserving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        Extend Subscription
                    </Button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plan Status Card */}
                <Card className="col-span-1 md:col-span-2 border-none shadow-sm bg-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 capitalize py-1 px-3">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {subscription.status}
                        </Badge>
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
                        <div className="text-2xl font-bold mt-1">{subscription.plan}</div>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 space-y-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">License Duration</span>
                                <span className="font-medium">{subscription.metrics.daysRemaining} days remaining</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <CalendarDays className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Start Date</p>
                                        <p className="text-sm font-bold">{new Date(subscription.startDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-blue-900 border border-blue-100">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold text-opacity-70">Expiry Date</p>
                                        <p className="text-sm font-bold">{new Date(subscription.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Details */}
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium opacity-80">Additional Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-80">Billing Cycle</span>
                                <span className="text-sm font-semibold">{subscription.billing.cycle}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-80">Last Payment</span>
                                <span className="text-sm font-semibold">{new Date(subscription.billing.lastPaymentDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage and More Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Users Card */}
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Users Protected</p>
                                <p className="text-2xl font-bold">{subscription.usage.usersProtected.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Optimized usage
                        </div>
                    </CardContent>
                </Card>

                {/* Instances Card */}
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Active Instances</p>
                                <p className="text-2xl font-bold">{subscription.usage.instances}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-2xl">
                                <Server className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-muted-foreground">
                            Scaled across {subscription.usage.instances} regions
                        </div>
                    </CardContent>
                </Card>

                {/* Billing Preview */}
                <Card className="border-none shadow-sm bg-white group cursor-pointer hover:ring-1 hover:ring-blue-500 transition-all">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Next Invoice</p>
                                <p className="text-2xl font-bold">{nextInvoiceFormatted}</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                <CreditCard className="w-6 h-6 text-amber-600 group-hover:text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-blue-600">
                            Download draft <ArrowRightCircle className="w-3 h-3 ml-1" />
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}