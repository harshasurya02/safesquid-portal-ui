"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubscriptionFlow } from '@/contexts/SubscriptionFlowContext';
import { Button } from '@/components/ui/button';
import { StatefulInput } from '@/components/stateful-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Edit2 } from 'lucide-react';

import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';

const poFormSchema = z.object({
    poNumber: z.string().min(1, 'Required'),
    poDate: z.date(),
    amount: z.string().min(1, 'Required'),
    currency: z.string().min(1, 'Required'),
    paymentDate: z.date(),
});

type PoFormValues = z.infer<typeof poFormSchema>;

export function IssuePurchaseOrderStep() {
    const { completeStep, isLoading, purchaseOrderId, purchaseOrderStatus, purchaseOrderData, subscriptionId } = useSubscriptionFlow();

    const form = useForm<PoFormValues>({
        resolver: zodResolver(poFormSchema),
        defaultValues: purchaseOrderData || {
            poNumber: '',
            amount: '',
            currency: 'USD',
        }
    });

    const onSubmit = async (data: PoFormValues) => {
        // API expects YYYY-MM-DD for dates as per sample
        await completeStep('issue-purchase-order', {
            ...data,
            subscriptionId,
            poDate: format(data.poDate, 'yyyy-MM-dd'),
            paymentDate: format(data.paymentDate, 'yyyy-MM-dd'),
            poDocument: 'https://s3.amazonaws.com/uploads/mock-po.pdf' // Simulated upload result
        });
    };

    const isExistingPo = !!purchaseOrderId;

    if (isExistingPo) {
        // Read-only view for existing PO
        const data = purchaseOrderData || {};
        return (
            <div className="flex gap-full h-full">
                <div className="flex-1 max-w-2xl space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Issue Purchase Order</h2>
                        <p className="text-sm text-gray-500 mt-1">For security aware organizations</p>
                    </div>

                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div className="flex items-start justify-between bg-yellow-50 p-4 rounded-md border border-yellow-100">
                            <div>
                                <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                    P.O. verification is <span className="text-yellow-600 font-bold">{purchaseOrderStatus || 'pending'}</span>
                                    <button className="text-gray-400 hover:text-gray-600"><Edit2 className="h-4 w-4" /></button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Typically requires 24 - 72 hours</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 opacity-60">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">P.O. number</label>
                                <div className="p-3 border rounded-[5px] bg-gray-50/50 text-sm h-[48px] flex items-center px-[20px]">{data.poNumber || '123456'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">P.O. date</label>
                                <div className="p-3 border rounded-[5px] bg-gray-50/50 text-sm h-[48px] flex justify-between items-center px-[20px]">
                                    {data.poDate || '12th Feb 2025'} <CalendarIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Amount (including Tax)</label>
                                <div className="p-3 border rounded-[5px] bg-gray-50/50 text-sm h-[48px] flex items-center px-[20px]">{data.currency || '$'} {data.amount || '123,456'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Payment date</label>
                                <div className="p-3 border rounded-[5px] bg-gray-50/50 text-sm h-[48px] flex justify-between items-center px-[20px]">
                                    {data.paymentDate || '12th Feb 2025'} <CalendarIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Upload placeholder */}
                <div className="w-[400px] flex-shrink-0 space-y-4">
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" disabled className="h-9 px-4">Download Proposal</Button>
                        <Button variant="outline" size="sm" disabled className="h-9 px-4">Email Proposal</Button>
                    </div>

                    <div className="bg-gray-100 rounded-lg aspect-[3/4] flex items-center justify-center border-2 border-dashed border-gray-200">
                        <span className="text-gray-500 font-medium text-lg">Upload P.O.</span>
                    </div>
                </div>
            </div>
        );
    }

    // Edit Mode
    return (
        <div className="flex gap-8 h-full">
            <div className="flex-1 max-w-2xl space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Issue Purchase Order</h2>
                    <p className="text-sm text-gray-500 mt-1">For security aware organizations</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">P.O. number</label>
                            <StatefulInput
                                {...form.register('poNumber')}
                                error={form.formState.errors.poNumber?.message}
                                placeholder="123456"
                                className="bg-gray-50/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">P.O. date</label>
                            <Controller
                                control={form.control}
                                name="poDate"
                                render={({ field }) => (
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder="Pick P.O. date"
                                        error={form.formState.errors.poDate?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Amount (including Tax)</label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                        {form.watch('currency') === 'USD' ? '$' :
                                            form.watch('currency') === 'INR' ? '₹' :
                                                form.watch('currency') === 'EU' ? '€' :
                                                    form.watch('currency') === 'AUD' ? 'A$' : ''}
                                    </span>
                                    <StatefulInput
                                        className="pl-9 bg-gray-50/50"
                                        {...form.register('amount')}
                                        placeholder="123,456"
                                        error={form.formState.errors.amount?.message}
                                    />
                                </div>
                                <div className="w-24">
                                    <Controller
                                        control={form.control}
                                        name="currency"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="h-[48px] bg-gray-50/50 border-input rounded-[5px] px-[20px]">
                                                    <SelectValue placeholder="USD" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="INR">INR</SelectItem>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                    <SelectItem value="AUD">AUD</SelectItem>
                                                    <SelectItem value="EU">EU</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Payment date</label>
                            <Controller
                                control={form.control}
                                name="paymentDate"
                                render={({ field }) => (
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder="Pick payment date"
                                        error={form.formState.errors.paymentDate?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" type="button" className="px-8 h-11">Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="px-10 h-11 bg-blue-600 hover:bg-blue-700">
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Right Column - Upload placeholder */}
            <div className="w-[400px] flex-shrink-0 space-y-4">
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" className="h-9 px-4">Download Proposal</Button>
                    <Button variant="outline" size="sm" className="h-9 px-4">Email Proposal</Button>
                </div>

                <div className="bg-gray-100/50 rounded-lg aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all group">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-105 transition-transform mb-4">
                        <span className="text-gray-400 group-hover:text-blue-500 transition-colors">+</span>
                    </div>
                    <span className="text-gray-500 font-semibold text-lg">Upload P.O.</span>
                    <p className="text-xs text-gray-400 mt-2">Click or drag and drop</p>
                </div>
            </div>
        </div>
    );
}


