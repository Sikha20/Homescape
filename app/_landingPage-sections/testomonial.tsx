import TestimonialCard from "./testomialCard";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Durgesh T.",
      role: "Landlord",
      avatar: "https://www.lensnepal.com/files/profiles/durgesh-thapa.jpg",
      content:
        "Homescape made it so simple to list my spare bedroom. I was able to find a reliable tenant within a week, and the payment system gives me peace of mind.",
    },
    {
      name: "Phil McGraw",
      role: "Tenant",
      avatar: "https://www.drphil.com/hubfs/plug-1440x676.jpeg",
      content:
        "As someone who relocates frequently for work, Homescape has been a game-changer. I can quickly find verified places with flexible terms that suit my lifestyle.",
    },
  ];

  return (
    <div
      id="testimonials"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted bg-gray-50"
    >
      <div className="container px-4 md:px-6 mx-auto">
        {/* Text Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
              What Our Users Say
            </h2>
            <p className="max-w-[900px] text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
              Hear from landlords and tenants who have found success with
              Homescape.
            </p>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 md:mt-12 ">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="transform transition duration-500 hover:-translate-y-2 hover:shadow-lg"
            >
              <TestimonialCard
                name={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.avatar}
                content={testimonial.content}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
