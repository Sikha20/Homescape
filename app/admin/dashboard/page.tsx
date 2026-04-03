
import PropertyCard from '../_components/PropertyCard';
import { db } from '@/lib/db';
import { TPagePropsPageNumber, TProperty } from '@/lib/types';


async function Page({
    searchParams
}: TPagePropsPageNumber) {

    const currentPage = Number((await searchParams)?.page) || 1;
    const email = (await searchParams)?.email as string;
    const limit = 6;

    try {
        let properties: TProperty[] = [];
        let total = 0;

        if (email) {
            const userEmail = await db.emails.findFirst({
                where: { email: email },
                select: { userId: true }
            });

            if (!userEmail) {
                properties = [];
                total = 0;
            } else {
                properties = await db.property.findMany({
                    where: {
                        userId: userEmail.userId
                    },
                    include: {
                        images: true,
                        landlord: {
                            include: {
                                emails: true
                            }
                        },
                        Rental: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip: (currentPage - 1) * limit,
                    take: limit,
                });

                total = await db.property.count({
                    where: {
                        userId: userEmail.userId
                    }
                });
            }
        } else {
            properties = await db.property.findMany({
                include: {
                    images: true,
                    landlord: {
                        include: {
                            emails: true
                        }
                    },
                    Rental: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (currentPage - 1) * limit,
                take: limit,
            });

            total = await db.property.count();
        }

        const totalPages = Math.ceil(total / limit);


        // Removed strict throwing to prevent page crashes on invalid searchParams
        // console.log(properties)

        return (

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-semibold text-gray-900">Properties Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage and view all properties</p>
                </div>

                <div className="mb-8">
                    <form className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by User Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={email}
                                placeholder="Enter user email"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#789274] text-white px-4 py-2 rounded-md hover:bg-[#5a6d56] text-sm font-medium"
                        >
                            Filter
                        </button>
                    </form>
                </div>

                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.filter(Boolean).map((property: TProperty) => (
                            <div key={property?.id} className="transform transition duration-200 hover:scale-[1.02]">
                                <PropertyCard property={property as any} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No properties found</p>
                    </div>
                )}


                {totalPages > 0 && (
                    <nav className="mt-12 flex justify-center" aria-label="Pagination">
                        <div className="flex items-center gap-2">
                            <a
                                href={`/admin/dashboard?page=${currentPage - 1}${email ? `&email=${email}` : ''}`}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                                ${currentPage <= 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                            >
                                Previous
                            </a>

                            <div className="hidden sm:flex gap-1">
                                {[...Array(totalPages)].map((_, index) => (
                                    <a
                                        key={index + 1}
                                        href={`/admin/dashboard?page=${index + 1}${email ? `&email=${email}` : ''}`}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                        ${currentPage === index + 1
                                                ? 'z-10 bg-[#789274] text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                                        aria-current={currentPage === index + 1 ? "page" : undefined}
                                    >
                                        {index + 1}
                                    </a>
                                ))}
                            </div>

                            <a
                                href={`/admin/dashboard?page=${currentPage + 1}${email ? `&email=${email}` : ''}`}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                ${currentPage >= totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                            >
                                Next
                            </a>
                        </div>
                    </nav>
                )}
            </div>
        )
    } catch (error) {
        console.error('Error fetching properties:', error);
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h1 className="text-2xl font-semibold text-red-800 mb-3">Error</h1>
                    <p className="text-red-600">Something went wrong while loading the properties.</p>
                </div>
            </div>
        )
    }
}

export default Page
