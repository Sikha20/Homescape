import { Key, Home } from "lucide-react";
import FeatureCard from "@/components/ui/feaureCard";

export default function FeaturesSection() {
  const landlordFeatures = [
    "Set your own rental prices",
    "Screen potential tenants",
    "Manage bookings with ease",
  ];

  const tenantFeatures = [
    "Browse verified listings",
    "Flexible booking options",
    "Secure payment system",
  ];

  return (
    <section
      id="features"
      className="w-full py-8 sm:py-12 md:py-16 lg:py-20 mt-[10rem] "
    >
      <div className="container mx-auto px-4 sm:px-6 pt-0">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="w-full animate-fade-up animate-delay-100">
            <FeatureCard
              icon={<Key className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
              title="Become a Landlord"
              description="List your property, set your terms, and earn income by renting out your space on your schedule."
              features={landlordFeatures}
              buttonText="List Your Property"
              route="/create-property"
            />
          </div>
          <div className="w-full animate-fade-up animate-delay-200">
            <FeatureCard
              icon={<Home className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
              title="Find a Place to Stay"
              description="Discover comfortable and affordable accommodations that fit your lifestyle and budget."
              features={tenantFeatures}
              buttonText="Find Rentals"
              route="/dashboard"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
