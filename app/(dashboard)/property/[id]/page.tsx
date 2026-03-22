import { getPropertyDetails } from "@/lib/getFunctions/getData";
import { TPageProps } from "@/lib/types";
import React from "react";
import Image from "next/image";
import { BuyPropertyDialog } from "../_component/BuyProperties";
import { FaMapMarkerAlt, FaBed, FaBath, FaCheckCircle, FaHome } from 'react-icons/fa';
import PropertyImageSlider from "../_component/PropertyImageSlider";

async function Page({ params }: TPageProps) {
  const property = await getPropertyDetails((await params).id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Property Image Slider */}
            <div className="lg:h-[800px]">
              <PropertyImageSlider images={property?.images.map(img => img.image)} price={property?.price} />
            </div>

            {/* Right Column - Property Details */}
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <FaHome className="text-4xl text-[#fa3e58]" />
                <h2 className="text-4xl font-bold text-gray-800">{property?.category}</h2>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl backdrop-blur-sm bg-opacity-50">
                <p className="text-gray-700 text-lg leading-relaxed font-medium">{property?.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-all duration-300 flex items-center gap-4">
                  <FaMapMarkerAlt className="text-3xl text-[#fa3e58]" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Location</p>
                    <p className="font-semibold text-lg">{property?.location}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-all duration-300 flex items-center gap-4">
                  <FaBed className="text-3xl text-[#fa3e58]" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Rooms</p>
                    <p className="font-semibold text-lg">{property?.noOfRooms}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-all duration-300 flex items-center gap-4">
                  <FaBath className="text-3xl text-[#fa3e58]" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Bathrooms</p>
                    <p className="font-semibold text-lg">{property?.noOfBathrooms}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-all duration-300 flex items-center gap-4">
                  <FaCheckCircle className="text-3xl text-[#fa3e58]" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Status</p>
                    <p className="font-semibold text-lg">{property?.isListed ? "Available" : "Not Available"}</p>
                  </div>
                </div>
              </div>

              {/* Landlord Info */}
              <div className="bg-gray-50 p-8 rounded-2xl flex items-center gap-8 hover:shadow-md transition-all duration-300">
                <Image
                  src={property?.landlord.profileUrl || "/default-avatar.png"}
                  alt="Landlord Profile"
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-[#fa3e58]/20 hover:border-[#fa3e58]/40 transition-all duration-300"
                />
                <div>
                  <p className="font-semibold text-2xl text-gray-800 mb-1">{property?.landlord.name}</p>
                  <p className="text-[#fa3e58] font-medium">Property Owner</p>
                </div>
              </div>

              {/* Buy Property Button */}
              <div className="pt-6">
                <BuyPropertyDialog property={property} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;