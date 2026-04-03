"use client";
import React, { useState } from 'react';
import { cancelBooking } from '@/actions/cancelBooking';
import toast from 'react-hot-toast';

export default function CancelBookingButton({ 
    propertyId, 
    userId 
}: { 
    propertyId: string, 
    userId: string 
}) {
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this booking? This will initiate a refund process.")) {
            return;
        }

        setIsCancelling(true);
        try {
            const res = await cancelBooking(propertyId, userId);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while trying to cancel");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <button 
            onClick={handleCancel}
            disabled={isCancelling}
            className="px-4 py-2 mt-4 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 w-full"
        >
            {isCancelling ? "Processing Refund..." : "Cancel & Request Refund"}
        </button>
    );
}
