"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubscriptionFlow } from '@/contexts/SubscriptionFlowContext';
import { Button } from '@/components/ui/button';
import { StatefulInput } from '@/components/stateful-input';
import { Info } from 'lucide-react';

import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';

const paymentFormSchema = z.object({
    referenceNumber: z.string().min(1, 'Required'),
    paymentDate: z.date(),
    accountNumber: z.string().min(1, 'Required'),
    accountHolder: z.string().min(1, 'Required'),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function ProcessPaymentStep() {
    const { completeStep, isLoading, paymentData, subscriptionId, goToStep } = useSubscriptionFlow();

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: paymentData || {
            referenceNumber: '12345678901234',
            accountNumber: '12345678901234',
            accountHolder: 'Mukund Ashok Sharma',
        }
    });

    const onSubmit = async (data: PaymentFormValues) => {
        // API expects YYYY-MM-DD for dates as per sample
        await completeStep('process-payment', {
            ...data,
            subscriptionId,
            paymentDate: format(data.paymentDate, 'yyyy-MM-dd'),
            paymentProof: 'https://s3.amazonaws.com/proofs/mock-txn-proof.jpg' // Simulated upload result
        });
    };

    return (
        <div className="flex gap-8 h-full">
            <div className="flex-1 max-w-2xl space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Transaction details</h2>
                    <p className="text-sm text-gray-500 mt-1">For security aware organizations</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Reference number</label>
                            <StatefulInput
                                {...form.register('referenceNumber')}
                                error={form.formState.errors.referenceNumber?.message}
                                className="bg-gray-50/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Date</label>
                            <Controller
                                control={form.control}
                                name="paymentDate"
                                render={({ field }) => (
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder="Pick transaction date"
                                        error={form.formState.errors.paymentDate?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <label className="text-sm font-semibold text-gray-700">Account number</label>
                                <Info className="h-3.5 w-3.5 text-gray-400" />
                            </div>
                            <StatefulInput
                                {...form.register('accountNumber')}
                                error={form.formState.errors.accountNumber?.message}
                                className="bg-gray-50/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Account holder</label>
                            <StatefulInput
                                {...form.register('accountHolder')}
                                error={form.formState.errors.accountHolder?.message}
                                className="bg-gray-50/50"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white/80 backdrop-blur-sm pb-4">
                        <Button variant="outline" type="button" className="px-8 h-11" onClick={() => goToStep('generate-invoice')}>back</Button>
                        <Button type="submit" disabled={isLoading} className="px-10 h-11 bg-blue-600 hover:bg-blue-700">
                            {isLoading ? 'Sending...' : 'Send transaction info'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Right Column - Proof Upload */}
            <div className="w-[400px] flex-shrink-0 space-y-4">
                <div className="flex gap-2 justify-start">
                    <Button variant="outline" size="sm" className="h-9 px-4">Download Proof</Button>
                </div>

                <div className="bg-gray-100/50 rounded-lg aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all group">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-105 transition-transform mb-4">
                        <span className="text-gray-400 group-hover:text-blue-500 transition-colors">+</span>
                    </div>
                    <span className="text-gray-500 font-semibold text-lg">Upload proof</span>
                    <p className="text-xs text-gray-400 mt-2">Click or drag and drop</p>
                </div>
            </div>
        </div>
    );
}

