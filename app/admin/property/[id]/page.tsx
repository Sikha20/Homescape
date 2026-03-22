
import Image from 'next/image'
import { TPageProps } from '@/lib/types'
import { getPropertyDetails } from '@/lib/getFunctions/getData'
import ImageSlider from '../../_components/ImageSlider'
import AdminActions from '../../_components/AdminActions'

async function PropertyDetailsPage({ params }: TPageProps) {
    const propertyDetails = await getPropertyDetails((await params).id)

    return (

        <div className="container mx-auto px-4 py-8 mt-10">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Property Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Property in {propertyDetails?.location}</h1>
                            <p className="text-gray-600 mt-2">Listed by {propertyDetails?.landlord.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${propertyDetails?.isListed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {propertyDetails?.isListed ? 'Listed' : 'Unlisted'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm ${propertyDetails?.isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {propertyDetails?.isBooked ? 'Booked' : 'Available'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Property Images Slider */}
                {propertyDetails && <ImageSlider propertyDetails={propertyDetails} />}

                {/* Property Details */}
                < div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <span className="font-medium">Price:</span>
                                <span className="ml-2">NPR {propertyDetails?.price}/month</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-medium">Category:</span>
                                <span className="ml-2">{propertyDetails?.category}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-medium">Rooms:</span>
                                <span className="ml-2">{propertyDetails?.noOfRooms}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-medium">Bathrooms:</span>
                                <span className="ml-2">{propertyDetails?.noOfBathrooms}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Landlord Information</h2>
                        <div className="flex items-center space-x-4">
                            <Image
                                src={propertyDetails?.landlord.profileUrl || "logo.png"}
                                alt={propertyDetails?.landlord.name || "LandLord's Profile"}
                                width={60}
                                height={60}
                                className="rounded-full"
                            />
                            <div>
                                <p className="font-medium">{propertyDetails?.landlord.name}</p>
                                <p className="text-sm text-gray-500">
                                    Member since {propertyDetails?.landlord.createdAt ? new Date(propertyDetails.landlord.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Description */}
                <div className="p-6 border-t">
                    <h2 className="text-2xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {propertyDetails?.description}
                    </p>
                </div>

                {/* Admin Actions */}
                <AdminActions id={propertyDetails?.id || ""} isApproved={propertyDetails?.isListed || false} email={propertyDetails?.landlord.emails[0].email || "helloworld"} />

            </div>
        </div >
    )
}

export default PropertyDetailsPage
