"use client";
import React from 'react'
import Image from 'next/image'
import { TProperty } from '@/lib/types';
import Link from 'next/link';

function PropertyCard({ property }: { property: TProperty }) {
    if (!property) {
        return null;
    }
    return (

        <div key={property.id ?? 'default-key'} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-4" >
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src={property.landlord?.profileUrl || '/default-profile.jpg'}
                        alt="Owner"
                        fill
                        className="object-cover"
                    />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                    {property.location ? `${property.location}, Nepal` : 'Location not specified'}
                </h2>
            </div>

            <div className="mt-4 relative w-full h-96 rounded-lg overflow-hidden">
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
                <div className="mb-4">
                    <span className={`px-2 py-1 rounded text-sm ${property.isBooked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                        }`}>
                        {property.isBooked ? "Not Available" : "Available"}
                    </span>
                </div>
            </div>

            <div className="flex justify-end">
                <Link
                    href={`property/${property.id}`}
                    className="bg-[#FA3E58] text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default PropertyCard
