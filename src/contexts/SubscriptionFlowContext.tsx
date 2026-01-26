"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    SubscriptionFlowState,
    StepConfig,
    StepStatus,
    SubscriptionFlowContextType,
    SubscriptionStatus,
    ProposalResponse,
    PoResponse,
    InvoiceResponse,
    PaymentResponse
} from '@/types/subscription-flow.types';
import { apiGet, apiPost } from '@/services/api.service';


const INITIAL_STEPS: StepConfig[] = [
    { stepId: 'generate-proposal', title: 'Generate proposal', status: 'in_progress', isAccessible: true },
    { stepId: 'issue-purchase-order', title: 'Issue Purchase Order', status: 'pending', isAccessible: false },
    { stepId: 'generate-invoice', title: 'Generate Invoice', status: 'pending', isAccessible: false },
    { stepId: 'process-payment', title: 'Process Payment', status: 'pending', isAccessible: false },
];

const SubscriptionFlowContext = createContext<SubscriptionFlowContextType | undefined>(undefined);

export function useSubscriptionFlow() {
    const context = useContext(SubscriptionFlowContext);
    if (!context) {
        throw new Error('useSubscriptionFlow must be used within a SubscriptionFlowProvider');
    }
    return context;
}

export function SubscriptionFlowProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<SubscriptionFlowState>({
        currentStepId: 'generate-proposal',
        steps: INITIAL_STEPS,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Load initial state from DB
    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                setIsInitialLoading(true);
                // GET /api/subscription/current-flow
                const currentFlow = await apiGet<SubscriptionFlowState | null>('/api/subscription/current-flow');

                if (currentFlow) {
                    setState(currentFlow);
                }
            } catch (error) {
                console.error("Failed to fetch initial state:", error);
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchInitialState();
    }, []);

    const updateStepStatus = (steps: StepConfig[], stepId: string, status: StepStatus): StepConfig[] => {
        return steps.map(step => step.stepId === stepId ? { ...step, status } : step);
    };

    const makeStepAccessible = (steps: StepConfig[], stepId: string): StepConfig[] => {
        return steps.map(step => step.stepId === stepId ? { ...step, isAccessible: true } : step);
    };

    const completeStep = async (stepId: string, data?: any) => {
        setIsLoading(true);
        try {
            switch (stepId) {
                case 'generate-proposal': {
                    // 1. Create Proposal: POST /api/subscription/proposal
                    const proposalResp = await apiPost<ProposalResponse>('/api/subscription/proposal', data);

                    // 2. Submit Proposal: POST /api/subscription/submit
                    const submitResp = await apiPost<{ status: SubscriptionStatus }>('/api/subscription/submit', {
                        subscriptionId: proposalResp.subscription.id
                    });

                    setState(prev => ({
                        ...prev,
                        subscriptionId: proposalResp.subscription.id,
                        subscriptionStatus: submitResp.status,
                        proposalId: proposalResp.proposal.id,
                        proposalData: proposalResp.proposal,
                        currentStepId: 'issue-purchase-order',
                        steps: updateStepStatus(makeStepAccessible(updateStepStatus(prev.steps, 'generate-proposal', 'completed'), 'issue-purchase-order'), 'issue-purchase-order', 'in_progress')
                    }));
                    break;
                }


                case 'issue-purchase-order': {
                    // POST /api/subscription/purchase-order
                    const poResp = await apiPost<PoResponse>('/api/subscription/purchase-order', {
                        ...data,
                        subscriptionId: state.subscriptionId
                    });

                    setState(prev => ({
                        ...prev,
                        subscriptionStatus: poResp.subscription.status,
                        purchaseOrderId: poResp.purchaseOrder.id,
                        purchaseOrderData: poResp.purchaseOrder,
                        purchaseOrderStatus: poResp.purchaseOrder.verificationStatus,
                        currentStepId: 'generate-invoice',
                        steps: updateStepStatus(makeStepAccessible(updateStepStatus(prev.steps, 'issue-purchase-order', 'completed'), 'generate-invoice'), 'generate-invoice', 'in_progress')
                    }));
                    break;
                }


                case 'generate-invoice': {
                    // POST /api/subscription/invoice
                    const invResp = await apiPost<InvoiceResponse>('/api/subscription/invoice', {
                        subscriptionId: state.subscriptionId
                    });

                    setState(prev => ({
                        ...prev,
                        subscriptionStatus: invResp.subscription.status,
                        invoiceId: invResp.invoice.id,
                        invoiceData: invResp.invoice,
                        currentStepId: 'process-payment',
                        steps: updateStepStatus(makeStepAccessible(updateStepStatus(prev.steps, 'generate-invoice', 'completed'), 'process-payment'), 'process-payment', 'in_progress')
                    }));
                    break;
                }


                case 'process-payment': {
                    // POST /api/subscription/payment
                    const payResp = await apiPost<PaymentResponse>('/api/subscription/payment', {
                        ...data,
                        subscriptionId: state.subscriptionId
                    });

                    setState(prev => ({
                        ...prev,
                        subscriptionStatus: payResp.subscription.status,
                        paymentId: payResp.transaction.id,
                        paymentData: payResp.transaction,
                        paymentStatus: 'processing', // Initial status based on payload
                        currentStepId: 'payment-status',
                        steps: updateStepStatus(prev.steps, 'process-payment', 'completed')
                    }));
                    break;
                }

            }
        } catch (error) {
            console.error(`Error completing step ${stepId}:`, error);
            throw error; // Re-throw to handle in UI if needed
        } finally {
            setIsLoading(false);
        }
    };

    const goToStep = (stepId: string) => {
        const step = state.steps.find(s => s.stepId === stepId);
        if (step && step.isAccessible) {
            setState(prev => ({ ...prev, currentStepId: stepId }));
        }
    };

    const refreshPaymentStatus = async () => {
        if (!state.subscriptionId) return;
        setIsLoading(true);
        try {
            // GET /api/subscription/payment-status (or current status)
            const statusResp = await apiGet<{ status: SubscriptionStatus }>(`/api/subscription/status`, {
                subscriptionId: state.subscriptionId
            });

            setState(prev => ({
                ...prev,
                subscriptionStatus: statusResp.status,
                paymentStatus: statusResp.status === 'payment_success' ? 'success' :
                    statusResp.status === 'payment_failed' ? 'failed' : 'processing'
            }));
        } catch (error) {
            console.error("Error refreshing payment status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const extendSubscription = async (months: number) => {
        if (!state.subscriptionId) return;
        setIsLoading(true);
        try {
            // POST /api/subscription/extend
            await apiPost('/api/subscription/extend', {
                subscriptionId: state.subscriptionId,
                extensionMonths: months
            });
            // Refresh status after extension
            await refreshPaymentStatus();
        } catch (error) {
            console.error("Error extending subscription:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <SubscriptionFlowContext.Provider value={{
            ...state,
            completeStep,
            goToStep,
            isLoading,
            refreshPaymentStatus,
            extendSubscription
        }}>
            {children}
        </SubscriptionFlowContext.Provider>
    );
}
