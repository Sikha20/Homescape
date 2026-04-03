"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { TProperty } from '@/lib/types';
import Link from 'next/link';
import { approveListings } from '@/actions/approveListings';
import { rejectListings } from '@/actions/rejectListings';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from 'react-hot-toast';

function PropertyCard({ property }: { property: TProperty & { landlord?: any } }) {
    const [isLoading, setIsLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    if (!property) {
        return null;
    }

    const landlordEmail = property.landlord?.emails?.[0]?.email || "";

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            await approveListings(property.id, landlordEmail);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            window.location.reload();
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }
        setIsLoading(true);
        try {
            await rejectListings(property.id, landlordEmail, rejectionReason);
            toast.success("Property rejected successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject property");
        } finally {
            setIsLoading(false);
            window.location.reload();
        }
    };

    return (
        <div key={property.id ?? 'default-key'} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-4" >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                            src={property.landlord?.profileUrl || '/default-profile.jpg'}
                            alt="Owner"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold mb-2 truncate">
                            {property.location ? `${property.location}, Nepal` : 'Location not specified'}
                        </h2>
                    </div>
                </div>

                <div className="mt-4 relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={property.images?.[0]?.image || '/placeholder-image.jpg'}
                        alt={property.location || 'Property Image'}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="mt-4">
                    <div className="mb-2">
                        <span className="font-bold">${property.price ?? 'N/A'}</span> /month
                    </div>
                    <div className="mb-2">
                        <span>{property.noOfRooms ?? 0} beds</span> •
                        <span>{property.noOfBathrooms ?? 0} baths</span>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded text-sm ${property.isBooked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                            }`}>
                            {property.isBooked ? "Not Available" : "Available"}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm ${property.isListed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {property.isListed ? "Approved" : "Pending"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 flex-wrap">
                {!property.isListed && (
                    <button
                        onClick={handleApprove}
                        disabled={isLoading}
                        className="bg-[#789274] text-white px-4 py-2 rounded hover:bg-[#5a6d56] transition-colors text-sm disabled:opacity-50"
                    >
                        {isLoading ? "..." : "Approve"}
                    </button>
                )}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            disabled={isLoading}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                        >
                            {isLoading ? "..." : "Reject"}
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please provide a reason for rejecting this listing. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="mt-4">
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter reason for rejection..."
                                rows={3}
                                disabled={isLoading}
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white"
                                onClick={handleReject}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Rejecting...' : 'Reject'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Link
                    href={`property/${property.id}`}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm text-center"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default PropertyCard
