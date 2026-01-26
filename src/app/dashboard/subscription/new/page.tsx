"use client";

import React from 'react';
import { SubscriptionFlowProvider, useSubscriptionFlow } from '@/contexts/SubscriptionFlowContext';
import { SubscriptionStepper } from '@/components/dashboard/subscription/subscription-stepper';
import { GenerateProposalStep } from '@/components/dashboard/subscription/generate-proposal-step';
import { IssuePurchaseOrderStep } from '@/components/dashboard/subscription/issue-purchase-order-step';
import { GenerateInvoiceStep } from '@/components/dashboard/subscription/generate-invoice-step';
import { ProcessPaymentStep } from '@/components/dashboard/subscription/process-payment-step';
import { PaymentStatusStep } from '@/components/dashboard/subscription/payment-status-step';

function SubscriptionFlowContent() {
    const { currentStepId } = useSubscriptionFlow();

    const renderStep = () => {
        switch (currentStepId) {
            case 'generate-proposal':
                return <GenerateProposalStep />;
            case 'issue-purchase-order':
                return <IssuePurchaseOrderStep />;
            case 'generate-invoice':
                return <GenerateInvoiceStep />;
            case 'process-payment':
                return <ProcessPaymentStep />;
            case 'payment-status':
                return <PaymentStatusStep />;
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50/30">
            <SubscriptionStepper />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mx-auto max-w-5xl h-full">
                    {renderStep()}
                </div>
            </main>
        </div>
    );
}

export default function NewSubscriptionPage() {
    return (
        <SubscriptionFlowProvider>
            <SubscriptionFlowContent />
        </SubscriptionFlowProvider>
    );
}