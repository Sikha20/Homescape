import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  content: string;
}

export default function TestimonialCard({
  name,
  role,
  avatar,
  content,
}: TestimonialCardProps) {
  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm h-full flex flex-col ">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={avatar || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* User Info */}
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>

          {/* Star Rating */}
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Content - Separate from user info */}
      <p className="mt-4 text-gray-700">&quot;{content}&quot;</p>
    </div>
  );
}
