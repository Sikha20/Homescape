import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground text-white flex justify-center"
      aria-labelledby="cta-heading"
    >
      <div className="container px-4 md:px-6">
        {/* Text Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2
              id="cta-heading"
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Ready to Find Your Perfect Rental or List Your Property?
            </h2>
            <p className="max-w-[900px] text-sm sm:text-base md:text-lg lg:text-xl">
              Join thousands of happy landlords and tenants who are
              revolutionizing the rental experience with our trusted platform.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Link href="/create-property" passHref legacyBehavior>
              <Button
                asChild
                size="lg"
                className="px-8 bg-transparent border-primary-foreground hover:bg-primary-foreground/10 transition-colors cursor-pointer"
                variant="outline"
                aria-label="List your property on our platform"
              >
                <span>List Your Property</span>
              </Button>
            </Link>
            <Link href="/dashboard" passHref legacyBehavior>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 bg-transparent border-primary-foreground hover:bg-primary-foreground/10 transition-colors cursor-pointer"
                aria-label="Browse available rental properties"
              >
                <span>Browse Rentals</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
