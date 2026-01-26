"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubscriptionFlow } from '@/contexts/SubscriptionFlowContext';
import { Button } from '@/components/ui/button';
import { StatefulInput } from '@/components/stateful-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

const formSchema = z.object({
    noOfUsers: z.string().min(1, 'Required'),
    noOfInstances: z.string().min(1, 'Required'),
    tenure: z.string().min(1, 'Required'),
    discountCode: z.string().optional(),
    billingName: z.string().min(1, 'Billing name is required'),
    billingAddress: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

import { useUser } from '@/contexts/UserContext';



export function GenerateProposalStep() {
    const { completeStep, isLoading, proposalData } = useSubscriptionFlow();
    const { selectedKeyId } = useUser();


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: proposalData || {
            noOfUsers: '10,000',
            noOfInstances: '3',
            tenure: '3 years',
            discountCode: '',
            billingName: 'SafeSquid',
            billingAddress: 'SafeSquid address',
        }
    });

    const onSubmit = async (data: FormValues) => {
        // Map UI values to API requirements
        const tenureMonths = data.tenure === '1 year' ? 12 : data.tenure === '2 years' ? 24 : 36;

        await completeStep('generate-proposal', {
            ...data,
            noOfUsers: parseInt(data.noOfUsers.replace(/,/g, '')),
            noOfInstances: parseInt(data.noOfInstances),
            tenure: tenureMonths,
            keyId: selectedKeyId
        });
    };

    return (
        <div className="flex gap-8 h-full">
            {/* Left Column - Form */}
            <div className="flex-1 max-w-2xl space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Commercial Subscriptions</h2>
                    <p className="text-sm text-gray-500 mt-1">For security aware organizations</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {/* Users & Instances */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <label className="text-sm font-semibold text-gray-700">Users protected</label>
                                <Info className="h-3.5 w-3.5 text-gray-400" />
                            </div>
                            <StatefulInput
                                {...form.register('noOfUsers')}
                                error={form.formState.errors.noOfUsers?.message}
                                className="bg-gray-50/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Instances required</label>
                            <StatefulInput
                                {...form.register('noOfInstances')}
                                error={form.formState.errors.noOfInstances?.message}
                                className="bg-gray-50/50"
                            />
                        </div>

                        {/* Tenure & Discount */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tenure for the license</label>
                            <Controller
                                control={form.control}
                                name="tenure"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="h-[48px] bg-gray-50/50 border-input rounded-[5px] px-[20px]">
                                            <SelectValue placeholder="Select tenure" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1 year">1 year</SelectItem>
                                            <SelectItem value="2 years">2 years</SelectItem>
                                            <SelectItem value="3 years">3 years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {form.formState.errors.tenure && <p className="text-xs text-destructive mt-1">{form.formState.errors.tenure.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Discount code</label>
                            <StatefulInput
                                {...form.register('discountCode')}
                                error={form.formState.errors.discountCode?.message}
                                placeholder="Enter discount code"
                                className="bg-gray-50/50"
                            />
                        </div>

                        {/* Billing Name & Address - Span 2 columns */}
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Billing name</label>
                            <StatefulInput
                                {...form.register('billingName')}
                                error={form.formState.errors.billingName?.message}
                                className="bg-gray-50/50"
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <textarea
                                className="w-full min-h-[100px] rounded-[5px] border border-input bg-gray-50/50 px-[20px] py-[12px] text-sm transition-all focus-visible:outline-none focus-visible:border-primary placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="SafeSquid address"
                                {...form.register('billingAddress')}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" type="button" className="px-8 h-11">Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="px-10 h-11 bg-blue-600 hover:bg-blue-700">
                            {isLoading ? 'Generating...' : 'Next'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Right Column - Preview */}
            <div className="w-[400px] flex-shrink-0 space-y-4">
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm">Download Proposal</Button>
                    <Button variant="outline" size="sm">Email Proposal</Button>
                </div>

                <div className="bg-gray-100 rounded-lg aspect-[3/4] flex items-center justify-center border-2 border-dashed border-gray-200">
                    <span className="text-gray-500 font-medium text-lg">Random Proposal</span>
                </div>
            </div>
        </div>
    );
}

