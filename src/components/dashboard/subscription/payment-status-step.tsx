"use client";

import React, { useEffect } from 'react';
import { useSubscriptionFlow } from '@/contexts/SubscriptionFlowContext';
import { Button } from '@/components/ui/button';
import { Edit2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PaymentStatusStep() {
    const { paymentStatus, refreshPaymentStatus } = useSubscriptionFlow();
    const router = useRouter();

    // Poll for status update or simulate it
    useEffect(() => {
        if (paymentStatus === 'processing') {
            const timer = setInterval(() => {
                refreshPaymentStatus();
            }, 5000); // Poll every 5 seconds
            return () => clearInterval(timer);
        }
    }, [paymentStatus, refreshPaymentStatus]);

    return (
        <div className="flex gap-8 h-full">
            <div className="flex-1 max-w-2xl space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Process payment</h2>
                    <p className="text-sm text-gray-500 mt-1">For security aware organizations</p>
                </div>

                <div className="space-y-6">
                    <div className="p-4 rounded-md border bg-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                    After the payment is received the subscription will be active
                                    <button className="text-gray-400 hover:text-gray-600"><Edit2 className="h-4 w-4" /></button>
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Typically requires 24 - 72 hours</p>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="mt-8 flex items-center gap-3 p-4 bg-gray-50 rounded border border-gray-100">
                            {paymentStatus === 'processing' && (
                                <>
                                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                                    <span className="text-sm font-medium text-blue-600">Payment verification in progress...</span>
                                </>
                            )}
                            {paymentStatus === 'success' && (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">Payment successfully verified! Subscription active.</span>
                                </>
                            )}
                            {paymentStatus === 'failed' && (
                                <>
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">Payment verification failed. Please contact support or retry.</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-12">
                    <Button variant="outline" onClick={() => router.back()}>back</Button>
                    <Button onClick={() => router.push('/dashboard/subscription')} className="bg-blue-600 hover:bg-blue-700">
                        Subscription
                    </Button>
                </div>
            </div>
        </div>
    );
}
