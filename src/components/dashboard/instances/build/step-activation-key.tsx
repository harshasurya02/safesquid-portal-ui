"use client";

import { Key } from "lucide-react";

export function StepActivationKey() {
    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-gray-900">
                    Activate your SafeSquid Instance
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Enter your product activation key to finalize the setup.
                </p>
                <div className="mt-4 border-b border-gray-100" />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="activation-key" className="block text-sm font-medium text-gray-700">
                            Activation Key
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Key className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                name="activation-key"
                                id="activation-key"
                                className="block w-full rounded-md border-gray-300 py-3 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            You can find your activation key in your email providing the license purchase.
                        </p>
                    </div>

                    <div className="rounded-md bg-blue-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1 md:flex md:justify-between">
                                <p className="text-sm text-blue-700">Do not have a key?</p>
                                <p className="mt-3 text-sm md:ml-6 md:mt-0">
                                    <a href="#" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                                        Contact Sales
                                        <span aria-hidden="true"> &rarr;</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
