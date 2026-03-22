export default function About() {
  return (
    <section className="w-full bg-white text-black py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 leading-tight">
          About Homescape
        </h1>
        <p className="text-center text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Homescape is a modern, secure, and easy-to-use rental platform built for both property owners and tenants. From villas and apartments to commercial offices, we make renting effortless and trustworthy.
        </p>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to simplify the property rental journey for everyone. Whether you&apos;re a student looking for a room or a business owner in need of office space, Homescape connects you with reliable options without the hassle of brokers or hidden fees.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              We envision a world where renting is transparent, digital-first, and community-driven. Our goal is to build trust, save time, and empower people to find or rent out spaces with complete peace of mind.
            </p>
          </div>
        </div>




      </div>
    </section>
  );
}
