import Head from "next/head";
import PropertyCard from "@/components/PropertyCard";
import React from "react";
import FilterSection from "./_components/FilterProperties";
import { db } from "@/lib/db";
import { Location, PropertyType, TSearchParams } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

type WhereConditions = {
  location?: Location;
  category?: PropertyType;
  noOfRooms?: number;
  noOfBathrooms?: number;
  isListed?: boolean;
  isBooked?: boolean;
};

async function Page({ searchParams }: TSearchParams) {
  const { userId } = await auth()
  const location = (await searchParams)?.location as Location;
  const category = (await searchParams)?.category as PropertyType;
  const noOfRooms = Number((await searchParams)?.noOfRooms) || undefined;
  const noOfBathrooms =
    Number((await searchParams)?.noOfBathrooms) || undefined;
  const sort = ((await searchParams)?.sort as string) || "";

  const whereConditions: WhereConditions = { isListed: true, isBooked: false };

  if (location) whereConditions.location = location;
  if (category) whereConditions.category = category;
  if (noOfRooms !== undefined) whereConditions.noOfRooms = noOfRooms;
  if (noOfBathrooms !== undefined)
    whereConditions.noOfBathrooms = noOfBathrooms;

  const properties = await db.property.findMany({
    where: {
      ...whereConditions,
    },
    include: {
      images: true,
      landlord: true,
    },
    ...(sort && {
      orderBy: {
        price: sort as "asc" | "desc",
      },
    }),
  });

  // Generate dynamic SEO title
  const seoTitle = location
    ? `Properties in ${location} | Homescape`
    : "Explore Listings | Homescape";

  const seoDescription =
    "Discover houses, villas, apartments, and offices available for monthly rent. Filter by location, type, rooms, and more.";

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta
          property="og:image"
          content="https://Homescape.vercel.app/preview-image.png"
        />
        <meta property="og:url" content="https://Homescape.vercel.app/dashboard" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="sm:py-3 sm:px-5 px-1 flex flex-col md:flex-row">
        <FilterSection />
        <div className="md:pl-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {properties.map((property) => (
              <PropertyCard
                key={property?.id}
                id={property?.id}
                title={property?.location}
                category={property?.category}
                location={property?.location}
                price={property?.price}
                images={property.images[0]?.image}
                className={""}
              />
            ))}
            {properties.length === 0 && (
              <div className="w-full text-center py-10">
                <p className="text-gray-500">
                  No properties found matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
