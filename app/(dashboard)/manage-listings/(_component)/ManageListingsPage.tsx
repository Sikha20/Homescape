import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import PropertyDeletionForm from './PropertyDeletionForm'
import CancelBookingButton from './CancelBookingButton'
import VacancyAnnouncementForm from './VacancyAnnouncementForm'
import TenantVacancyNotice from './TenantVacancyNotice'

export default async function ManageListingsPage() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    // Properties I own
    const myProperties = await db.property.findMany({
        where: { userId },
        include: {
            images: true,
            landlord: true,
            VacancyAnnouncement: true,
            Rental: {
                include: {
                    user: true
                }
            },
            Payment: {
                include: {
                    User: true
                }
            }
        }
    })

    // Properties I rent
    const myRentals = await db.rental.findMany({
        where: { userId },
        include: {
            property: {
                include: {
                    images: true,
                    landlord: {
                        include: {
                            emails: true
                        }
                    },
                    VacancyAnnouncement: true
                }
            }
        }
    }).then(rentals => rentals.filter(rental => rental.property !== null))

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Manage Your Properties
            </h1>
            <div className="max-w-6xl mx-auto space-y-16">
                {/* Properties I own section */}
                <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Properties I Own</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {myProperties.map((property) => (
                            <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] shadow-sm">
                                <div className="relative">
                                    <Image
                                        width={500}
                                        height={300}
                                        src={property.images[0]?.image || '/placeholder.jpg'}
                                        alt={`Property at ${property.location}`}
                                        className="w-full h-60 object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-base">
                                        NPR {property.price.toLocaleString()}/month
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.location}</h3>
                                    <p className="text-gray-700 text-base mb-2 line-clamp-2">{property.description}</p>
                                    <div className="flex justify-between text-sm text-gray-500 border-t pt-2 mt-2">
                                        <span>Rentals: {property.Rental?.length || 0}</span>
                                        <span>Payments: {property.Payment?.length || 0}</span>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className={`text-sm ${property.isListed ? 'text-green-600' : 'text-red-600'}`}>
                                            {property.isListed ? 'Active' : 'Not Listed'}
                                        </span>
                                        <div className="flex gap-2">
                                            {property.isListed ? (
                                                <Link href={`property/${property.id}`}>
                                                    <button className="px-6 py-2 text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                        View
                                                    </button>
                                                </Link>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Link href={`/edit-property/${property.id}`}>
                                                        <button className="px-6 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                            Edit
                                                        </button>
                                                    </Link>
                                                    <span className="px-6 py-2 text-base bg-gray-200 text-gray-500 rounded-lg">
                                                        Not Listed
                                                    </span>
                                                </div>
                                            )}
                                            {!property.isBooked && (
                                                <PropertyDeletionForm id={property.id} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Vacancy Announcement section (landlords) */}
                <VacancyAnnouncementForm
                    currentUserId={userId}
                    properties={myProperties.map(p => ({
                        id: p.id,
                        location: p.location,
                        category: p.category,
                        price: p.price,
                        noOfRooms: p.noOfRooms,
                        noOfBathrooms: p.noOfBathrooms,
                        image: p.images[0]?.image ?? null,
                        VacancyAnnouncement: p.VacancyAnnouncement
                            ? {
                                vacantFrom: p.VacancyAnnouncement.vacantFrom,
                                notes: p.VacancyAnnouncement.notes,
                                postedBy: p.VacancyAnnouncement.postedBy,
                                postedByUserId: p.VacancyAnnouncement.postedByUserId,
                              }
                            : null,
                    }))}
                />

                {/* Properties I rent section */}
                <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Properties I Rent</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {myRentals.map((rental) => (
                            <div key={rental.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] shadow-sm">
                                <div className="relative">
                                    <Image
                                        width={500}
                                        height={300}
                                        src={rental.property?.images?.[0]?.image || '/placeholder.jpg'}
                                        alt={rental.property?.location || 'Property location'}
                                        className="w-full h-60 object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-base">
                                        NPR {rental.property?.price?.toLocaleString()}/month
                                    </div>
                                </div>
                                <div className="p-6">
                                    {/* Tenant vacancy notice — always visible, self-post enabled */}
                                    <TenantVacancyNotice
                                        propertyId={rental.propertyId}
                                        propertyTitle={`${rental.property.category.replace("_", " ")} in ${rental.property.location}`}
                                        propertyImage={rental.property.images?.[0]?.image ?? null}
                                        propertyPrice={rental.property.price}
                                        vacantFrom={rental.property.VacancyAnnouncement?.vacantFrom ?? null}
                                        notes={rental.property.VacancyAnnouncement?.notes ?? null}
                                        postedBy={rental.property.VacancyAnnouncement?.postedBy ?? null}
                                        postedByUserId={rental.property.VacancyAnnouncement?.postedByUserId ?? null}
                                        currentUserId={userId}
                                    />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{rental.property?.location}</h3>
                                    <p className="text-gray-700 text-base mb-2 line-clamp-2">{rental.property?.description}</p>
                                    <div className="flex flex-col gap-2 text-sm text-gray-500 border-t pt-4 mt-2">
                                        <div className="flex items-center justify-between">
                                            <span>Landlord:</span>
                                            <span className="font-medium">{rental.property?.landlord?.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Email:</span>
                                            <span className="font-medium">{rental.property?.landlord?.emails?.[0]?.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Status:</span>
                                            <span className="text-green-600 font-medium">Active</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-6">
                                        <CancelBookingButton propertyId={rental.propertyId} userId={userId} />
                                        <Image
                                            className="rounded-full border-2 border-gray-200 ml-4"
                                            width={80}
                                            height={80}
                                            src={rental.property.landlord.profileUrl || "/logo.png"}
                                            alt={`${rental.property.landlord.name}'s profile`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}