import { FaMapMarkerAlt, FaBed, FaBath, FaCheckCircle, FaHome } from 'react-icons/fa';
import { Skeleton } from "@/components/ui/skeleton";

export default function SinglePropertySkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 mt-10">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Column - Image Slider Skeleton */}
                        <div className="lg:h-[800px]">
                            <Skeleton className="w-full h-full bg-gray-300" />
                        </div>

                        {/* Right Column - Property Details Skeleton */}
                        <div className="p-10 space-y-8">
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                <FaHome className="text-4xl text-gray-400" />
                                <Skeleton className="h-10 w-48 bg-gray-300" />
                            </div>

                            <div className="border-2 border-gray-200 p-8 rounded-lg">
                                <Skeleton className="h-24 w-full bg-gray-300" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[FaMapMarkerAlt, FaBed, FaBath, FaCheckCircle].map((Icon, index) => (
                                    <div key={index} className="border-2 border-gray-200 p-6 rounded-lg flex items-center gap-4">
                                        <Icon className="text-3xl text-gray-400" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-20 bg-gray-300" />
                                            <Skeleton className="h-6 w-24 bg-gray-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Landlord Info Skeleton */}
                            <div className="border-2 border-gray-200 p-8 rounded-lg flex items-center gap-8">
                                <Skeleton className="h-[100px] w-[100px] rounded-full bg-gray-300" />
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-48 bg-gray-300" />
                                    <Skeleton className="h-6 w-32 bg-gray-300" />
                                </div>
                            </div>

                            {/* Buy Property Button Skeleton */}
                            <div className="pt-6">
                                <Skeleton className="h-12 w-full bg-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
