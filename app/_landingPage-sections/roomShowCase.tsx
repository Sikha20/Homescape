import { Button } from "@/components/ui/button";
import Link from "next/link";
import RoomCard from "./roomCard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function RoomShowcaseSection() {
  //   Get latest properties
  const properties = await prisma.property.findMany({
    where: { isListed: true },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
    },
  });

  // Format data for RoomCard
  const mappedProperties = properties.map((p) => ({
    id: p.id,
    title: p.description || "Premium Property",
    location: p.location || "Unknown",
    beds: p.noOfRooms ?? 1,
    baths: p.noOfBathrooms ?? 1,
    price: p.price ?? 0,
    image: p.images?.[0]?.image ?? "/placeholder.svg",
    category: p.category || "Property",
  }));

  return (
    <section className="w-full py-16 md:py-24 bg-white flex justify-center">
      <div className="container max-w-7xl px-4 md:px-6">
        {/* Heading */}
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Discover Amazing Spaces
          </h2>
          <p className="text-gray-600 md:text-xl max-w-[900px] mx-auto">
            From cozy apartments to luxury homes, find the perfect space.
          </p>
        </div>

        {/* Property cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mappedProperties.map((property) => (
            <RoomCard key={property.id} property={property} />
          ))}
        </div>

        {/* Button to view all */}
        <div className="flex justify-center mt-12">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-[#789274] hover:bg-[#5a6d56] text-white px-8 py-6 text-lg rounded-md outline-none border-none transition-colors"
            >
              View All Listings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
