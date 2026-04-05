"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

interface PropertyMapWrapperProps {
  latitude?: number | null;
  longitude?: number | null;
  locationName: string;
  propertyTitle?: string;
  price?: number | null;
}

export default function PropertyMapWrapper(props: PropertyMapWrapperProps) {
  return <PropertyMap {...props} />;
}
