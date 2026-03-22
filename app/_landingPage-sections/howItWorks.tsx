import { Search, MessageSquare, CreditCard } from "lucide-react";
import StepCard from "./stepCard";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "1. Search or List Properties",
      description:
        "Easily browse thousands of rental properties or create a detailed listing for your space with our intuitive tools. Upload high-quality photos and accurate descriptions to attract ideal tenants quickly.",
    },
    {
      icon: (
        <MessageSquare className="h-8 w-8 text-primary" aria-hidden="true" />
      ),
      title: "2. Connect Securely",
      description:
        "Our end-to-end encrypted messaging system enables safe communication between landlords and tenants. Discuss rental terms, schedule viewings, and negotiate agreements with complete privacy.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "3. Complete Rental Transaction",
      description:
        "Sign digital rental agreements and process payments through our secure platform. Enjoy automated reminders, deposit protection, and 24/7 support throughout your rental journey.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full py-16 md:py-32 flex justify-center bg-gray-50"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container px-4 md:px-6">
        {/* Text Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2
              id="how-it-works-heading"
              className="font-bold tracking-tighter text-3xl sm:text-4xl md:text-5xl"
            >
              How Our Rental Platform Simplifies Your Experience
            </h2>
            <p className="max-w-[900px] text-muted-foreground text-sm sm:text-base md:text-lg text-gray-600">
              Whether you&apos;re looking to rent or list a property, our
              streamlined 3-step process makes it effortless and secure for
              everyone involved.
            </p>
          </div>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-16">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col">
              <StepCard
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
