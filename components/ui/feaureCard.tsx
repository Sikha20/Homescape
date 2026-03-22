import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  route?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  features,
  buttonText,
  route = "#",
}: FeatureCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-xl border bg-background p-4.5 sm:p-6 shadow-md transition-all hover:shadow-lg scale-[0.95]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative space-y-3 sm:space-y-4">
        <div className="flex items-center sm:block">
          <div className="mr-3 sm:mr-0 sm:mb-2">{icon}</div>
          <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
        <ul className="space-y-1 sm:space-y-2 ">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start sm:items-center">
              <Star className="mr-1 sm:mr-2 h-3.5 sm:h-4.5 w-3.5 sm:w-4.5 text-primary mt-0.5 sm:mt-0" />
              <span className="text-sm sm:text-base">{feature}</span>
            </li>
          ))}
        </ul>
        <Link href={route} className="w-full">
          <Button className="w-full mt-3 text-sm sm:text-base text-white">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
