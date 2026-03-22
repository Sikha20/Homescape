import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 mt-10">
            <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                {/* Property Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <Skeleton className="h-8 w-[300px] mb-2 bg-gray-300" />
                            <Skeleton className="h-4 w-[200px] bg-gray-300" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                            <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                        </div>
                    </div>
                </div>

                {/* Image Slider Skeleton */}
                <Skeleton className="h-[400px] w-full bg-gray-300" />

                {/* Property Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Skeleton className="h-8 w-[100px] mb-4 bg-gray-300" />
                        <div className="grid grid-cols-2 gap-4">
                            {Array(4).fill(null).map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <Skeleton className="h-4 w-[80px] bg-gray-300" />
                                    <Skeleton className="h-4 w-[100px] ml-2 bg-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Skeleton className="h-8 w-[200px] mb-4 bg-gray-300" />
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-[60px] w-[60px] rounded-full bg-gray-300" />
                            <div>
                                <Skeleton className="h-5 w-[150px] mb-2 bg-gray-300" />
                                <Skeleton className="h-4 w-[200px] bg-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Description */}
                <div className="p-6 border-t">
                    <Skeleton className="h-8 w-[150px] mb-4 bg-gray-300" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-gray-300" />
                        <Skeleton className="h-4 w-5/6 bg-gray-300" />
                        <Skeleton className="h-4 w-4/6 bg-gray-300" />
                    </div>
                </div>

                {/* Admin Actions Skeleton */}
                <div className="p-6 border-t">
                    <div className="flex justify-end gap-4">
                        <Skeleton className="h-10 w-[100px] bg-gray-300" />
                        <Skeleton className="h-10 w-[100px] bg-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}
