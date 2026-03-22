import Link from "next/link";
import Image from "next/image";

// Property type definition
interface Property {
  id: string;
  title?: string;
  location?: string;
  beds?: number;
  baths?: number;
  price?: number | string;
  image?: string;
  category?: string;
}

// Props type
interface RoomCardProps {
  property: Property;
}

export default function RoomCard({ property }: RoomCardProps) {
  const {
    id,
    title,
    location,
    beds,
    baths,
    price,
    image = "/placeholder.svg",
    category,
  } = property;

  // Format price
  const formattedPrice =
    typeof price === "number" || typeof price === "string"
      ? `${price}/month`
      : "N/A";

  // Format bath text (handle shared baths)
  const isSharedBath = title?.toLowerCase().includes("shared") || false;
  const bathText = isSharedBath
    ? "Shared bath"
    : `${baths} bath${baths !== 1 ? "s" : ""}`;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <Link href={`/property/${id}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title || category || "Property"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-xl font-bold">{category || title || "Property"}</h3>
        <p className="text-gray-700">
          {location}, {beds} bed, {bathText}
        </p>
        <p className="mt-2 text-lg font-bold">NPR {formattedPrice}</p>
      </div>
    </div>
  );
}
