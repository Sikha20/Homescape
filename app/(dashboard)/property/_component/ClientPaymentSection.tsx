"use client";

import { initializePayment } from '@/actions/Payment';
// import { db } from '@/lib/db';
import { TProperty } from '@/lib/types';
// import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function ClientPaymentSection({ property }: { property: TProperty }) {
    const router = useRouter();
    // const { userId } = useAuth();


    const paymentInitialization = async () => {
        try {
            const response = await initializePayment({ property, totalAmount });
            console.error(`BUG_FIX: ${response}`);
            if (!response.success) {
                toast.error(response.message || "Error initializing payment");
                return;
            }

            if (response.response?.payment_url) {
                toast.loading("Redirecting to payments")
                router.push(response.response.payment_url);

            } else {
                toast.error("Payment URL not received");
            }
        } catch (error) {
            toast.error("Failed to process payment");
            console.error(error);
        }
    };

    const [selectedMonths, setSelectedMonths] = useState(1);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonths(parseInt(e.target.value));
    };

    const totalAmount = property?.price ? property.price * selectedMonths : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Monthly Rent:</p>
                <p className="font-semibold text-lg">Rs. {property?.price?.toLocaleString()}</p>
            </div>

            <div className="flex items-center space-x-4">
                <label htmlFor="months" className="text-gray-700">Rent Duration:</label>
                <select
                    id="months"
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={selectedMonths}
                    onChange={handleMonthChange}
                >
                    {[1, 3, 6, 12].map((month) => (
                        <option key={month} value={month}>
                            {month} {month === 1 ? 'Month' : 'Months'}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-emerald-50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-700">Total Amount</p>
                        <p className="text-sm text-gray-500">For {selectedMonths} {selectedMonths === 1 ? 'month' : 'months'}</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">
                        Rs. {totalAmount.toLocaleString()}
                    </p>
                </div>

                <button
                    onClick={paymentInitialization}
                    disabled={!property?.price}
                    className={`mt-4 w-full py-3 rounded-lg font-semibold transition duration-200 
                        ${property?.price
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
                >
                    {property?.price ? 'Proceed to Payment' : 'Price Not Available'}
                </button>
            </div>
        </div>
    );
}

export default ClientPaymentSection;
