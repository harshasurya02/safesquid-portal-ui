"use client";

import React from 'react';
import { useSubscriptionFlow } from '@/contexts/SubscriptionFlowContext';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function GenerateInvoiceStep() {
    const { completeStep, isLoading, invoiceId, invoiceData, subscriptionId } = useSubscriptionFlow();

    const handleGenerate = async () => {
        await completeStep('generate-invoice', {
            subscriptionId,
            generatedAt: new Date().toISOString()
        });
    };

    return (
        <div className="flex gap-8 h-full">
            <div className="flex-1 max-w-2xl space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Generate Invoice</h2>
                    <p className="text-sm text-gray-500 mt-1">Review and generate your invoice based on the approved P.O.</p>
                </div>

                {invoiceId ? (
                    <div className="p-6 border rounded-lg bg-green-50 border-green-100 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-medium text-green-900">Invoice Generated Successfully</h3>
                            <p className="text-sm text-green-700">Invoice Number: {invoiceData?.invoiceNumber || invoiceId}</p>
                        </div>
                        <Button variant="outline" className="ml-auto bg-white" onClick={() => window.open(invoiceData?.invoiceUrl, '_blank')}>
                            Download PDF
                        </Button>
                    </div>
                ) : (
                    <div className="p-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 text-center">
                        <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <FileText className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Ready to Generate</h3>
                            <p className="text-sm text-gray-500 max-w-sm mt-1">
                                Your Purchase Order has been approved. You can now generate the tax invoice for payment processing.
                            </p>
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading} className="mt-4 bg-blue-600 hover:bg-blue-700">
                            {isLoading ? 'Generating Invoice...' : 'Generate Invoice'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Right Column - Preview Placeholder */}
            <div className="w-[400px] flex-shrink-0 space-y-4">
                <div className="bg-gray-100 rounded-lg aspect-[3/4] flex items-center justify-center border-2 border-dashed border-gray-200">
                    <span className="text-gray-500 font-medium text-lg">Invoice Preview</span>
                </div>
            </div>
        </div>
    );
}

