"use client";
import React from "react";
import { MapPin, Building } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

interface PropertyCardProps {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  images: string;
  onClick?: () => void;
  className: string;
}

const PropertyCard = ({
  id,
  title,
  category,
  location,
  price,
  images,
  className,
}: PropertyCardProps) => {
  return (
    <div
      className={`w-full cursor-pointer transition-transform duration-300 ${className}`}
      onClick={() => {
        redirect(`/property/${id}`);
      }}
    >
      <div className="relative">
        <Image
          className="w-full h-52 object-cover rounded-xl transition-all duration-300 hover:shadow-lg"
          src={images || "/placeholder-image.jpg"}
          width={300}
          height={200}
          alt={`${title || category} Image`}
        />
        <div className="absolute top-2 right-2 bg-background text-secondary px-3 py-1 rounded-md font-light text-sm opacity-90 flex items-center gap-1">
          <Building size={16} />
          {category}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        {title && <h3 className="font-semibold text-lg">{title}</h3>}
        <span className="text-secondary flex items-center gap-1">
          <MapPin size={16} />
          {location}
        </span>
        <span className="text-small-text flex items-center gap-1">
          Price: NPR {price}
        </span>
        <button className="px-4 py-2 bg-primary text-background rounded-md hover:bg-red-700 transition duration-200 flex items-center justify-center gap-2">
          Get Info
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
