import { getPropertyDetails } from "@/lib/getFunctions/getData";
import { TPageProps } from "@/lib/types";
import React from "react";
import Image from "next/image";
import { BuyPropertyDialog } from "../_component/BuyProperties";
import { BookVisitDialog } from "../_component/BookVisitDialog";
import { PrintPropertyButton } from "../_component/PrintPropertyButton";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCompass, FaCalendarAlt, FaRoad, FaCheckCircle, FaHeart, FaHome } from 'react-icons/fa';

async function Page({ params }: TPageProps) {
  const property = await getPropertyDetails((await params).id);
  
  // Safe extraction of properties
  const defaultImages = property?.images?.length ? property.images.map(img => img.image) : ["/placeholder-image.jpg"];
  
  // Mock amenities matching the requested layout
  const amenitiesMock = [
    "Drainage", "24hr Water Supply", "Parking", "Modular Kitchen", 
    "Water Well", "Water Tank", "Wifi", "Internet"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div id="property-details-container" className="max-w-6xl mx-auto space-y-10">
        
        {/* Title Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          {property?.category || "Modern Villa"} in {property?.location || "Unknown"}
        </h1>

        {/* Top Image Grid (1 Large + 3 Thumbnails) */}
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px]">
          <div className="w-full lg:w-3/4 h-[300px] lg:h-full relative rounded-2xl overflow-hidden shadow-md">
             <Image src={defaultImages[0]} fill className="object-cover hover:scale-105 transition-transform duration-700" alt="Main Property" priority />
          </div>
          <div className="w-full lg:w-1/4 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-hidden hidden-scrollbar pb-2 lg:pb-0">
            {[1, 2, 3].map((index) => (
               <div key={index} className="relative min-w-[140px] lg:w-full h-[120px] lg:h-[calc(33.33%-10px)] rounded-2xl overflow-hidden shadow-sm shrink-0">
                 <Image src={defaultImages[index] || defaultImages[0]} fill className="object-cover hover:scale-110 transition-transform duration-500" alt={`Thumbnail ${index}`} />
               </div>
            ))}
          </div>
        </div>

        {/* 3D View Placeholder */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">3D View</h2>
          <div className="relative w-full h-[300px] md:h-[450px] bg-gray-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group overflow-hidden">
            <Image src={defaultImages[0]} fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300 blur-[2px]" alt="3D placeholder" />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center cursor-pointer transition-all">
               <div className="w-20 h-20 bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:scale-110 hover:bg-black/90 transition-all shadow-2xl">
                 <span className="text-4xl ml-2 text-white">▶</span>
               </div>
            </div>
          </div>
        </div>

        {/* Main Content White Card */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12 space-y-10">
           
           {/* Property Overview Top Bar */}
             <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 gap-6">
             <h2 className="text-3xl font-bold text-gray-900">Property Overview</h2>
             <div className="flex flex-wrap items-center gap-4">
                <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                   Rs. {property?.price?.toLocaleString() || "N/A"} <span className="text-base font-medium text-gray-500">onwards</span>
                </span>
                <PrintPropertyButton />
                <button className="text-gray-300 hover:text-[#789274] transition-colors print:hidden"><FaHeart size={28} /></button>
             </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-2">
             <div className="flex items-start gap-4">
               <FaHome className="text-[#789274] mt-1" size={20} />
               <div><p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Property ID</p><p className="font-semibold text-gray-800 mt-1">PRO-{property?.id?.substring(0, 5).toUpperCase()}</p></div>
             </div>
             <div className="flex items-start gap-4">
               <FaCompass className="text-[#789274] mt-1" size={20} />
               <div><p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Face</p><p className="font-semibold text-gray-800 mt-1">East-Facing</p></div>
             </div>
             <div className="flex items-start gap-4">
               <FaRoad className="text-[#789274] mt-1" size={20} />
               <div><p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Road Access</p><p className="font-semibold text-gray-800 mt-1">15 ft. Pitched Road</p></div>
             </div>
             <div className="flex items-start gap-4">
               <FaRulerCombined className="text-[#789274] mt-1" size={20} />
               <div><p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Total Area</p><p className="font-semibold text-gray-800 mt-1">3,500 sq. ft.</p></div>
             </div>
             <div className="flex items-start gap-4">
               <FaBed className="text-[#789274] mt-1" size={20} />
               <div><p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Bedrooms</p><p className="font-semibold text-gray-800 mt-1">{property?.noOfRooms} Bedrooms</p></div>
             </div>
             <div className="flex items-start gap-4">
               <FaBath className="text-[#789274] mt-1" size={20} />
               <div><p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Bathrooms</p><p className="font-semibold text-gray-800 mt-1">{property?.noOfBathrooms} Bathrooms</p></div>
             </div>
             <div className="flex items-start gap-4">
               <FaCalendarAlt className="text-[#789274] mt-1" size={20} />
               <div><p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Built Year</p><p className="font-semibold text-gray-800 mt-1">2023</p></div>
             </div>
             <div className="flex items-start gap-4">
               <FaCheckCircle className="text-[#789274] mt-1" size={20} />
               <div><p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Status</p><p className="font-semibold text-gray-800 mt-1">{property?.isListed ? "Available" : "Not Available"}</p></div>
             </div>
           </div>

           {/* Description Section */}
           <div className="border-t border-gray-100 pt-10 space-y-6">
             <h3 className="text-2xl font-bold text-gray-900">Description</h3>
             <p className="font-semibold text-gray-900">{property?.category || "Modern Villa"} on Sale at {property?.location || "Baneshwor, Kathmandu"}:</p>
             <p className="text-gray-600 leading-[1.8] font-medium max-w-4xl">{property?.description}</p>
             <div className="text-sm font-medium space-y-3 mt-4 text-gray-800 bg-gray-50/50 p-6 rounded-xl w-fit border border-gray-100">
               <p><span className="text-gray-500 w-36 inline-block">Location:</span> {property?.location}</p>
               <p><span className="text-gray-500 w-36 inline-block">Category:</span> {property?.category}</p>
               <p><span className="text-gray-500 w-36 inline-block">Road Access:</span> 15 feet</p>
               <p><span className="text-gray-500 w-36 inline-block">Price:</span> NRs. {property?.price?.toLocaleString() || "N/A"}</p>
             </div>
           </div>

           {/* Amenities Section */}
           <div className="border-t border-gray-100 pt-10 space-y-6">
             <h3 className="text-2xl font-bold text-gray-900">Amenities</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
               {amenitiesMock.map((amenity, i) => (
                 <span key={i} className="text-[15px] font-medium text-gray-700 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-[#789274] shadow-sm ml-1" /> {amenity}
                 </span>
               ))}
             </div>
           </div>

           {/* Location Map Embedded */}
           <div className="border-t border-gray-100 pt-10 space-y-6">
             <h3 className="text-2xl font-bold text-gray-900">Location</h3>
             <div className="w-full h-[450px] rounded-2xl overflow-hidden bg-gray-100 shadow-inner border border-gray-200">
               <iframe
                 title="Property Location Map"
                 src={`https://maps.google.com/maps?q=${encodeURIComponent(property?.location || "Baneshwor Kathmandu")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                 width="100%"
                 height="100%"
                 frameBorder="0"
                 style={{ border: 0 }}
                 allowFullScreen
               ></iframe>
             </div>
           </div>
           
           {/* Actions & Contact */}
           <div className="border-t border-gray-100 pt-10 space-y-6 print:hidden">
             <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
             
             <div className="bg-white p-6 sm:p-8 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto overflow-hidden">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                    <Image
                      src={property?.landlord.profileUrl || "/default-avatar.png"}
                      alt="Landlord Profile"
                      fill
                      className="rounded-full shadow-md border-2 border-[#789274] object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight mb-1 truncate">{property?.landlord.name}</p>
                    <p className="text-[#789274] font-semibold text-[10px] sm:text-xs uppercase tracking-wider bg-[#789274]/10 px-2 sm:px-3 py-1 rounded-full inline-block">Property Owner</p>
                  </div>
                </div>
                
                <div className="flex w-full lg:w-auto flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
                  <div className="w-full sm:w-auto min-w-[150px]"><BuyPropertyDialog property={property} /></div>
                  <div className="w-full sm:w-auto min-w-[150px]"><BookVisitDialog propertyId={property!.id} /></div>
                </div>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}

export default Page;