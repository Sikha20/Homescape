import Hero from "./_landingPage-sections/hero";
import LandingNavbar from "./_landingPage-sections/landingNavbar";
import FeaturesSection from "./_landingPage-sections/features";
import HowItWorksSection from "./_landingPage-sections/howItWorks";
import CTASection from "./_landingPage-sections/cta";
import FAQSection from "./_landingPage-sections/faq";
import Footer from "./_landingPage-sections/footer";
import RoomShowcaseSection from "./_landingPage-sections/roomShowCase";
import UpcomingVacanciesSection from "./_landingPage-sections/upcomingVacancies";
import About from "./(dashboard)/about-us/page";
export default function Home() {
  return (
    <div className="flex  flex-col  h-screen w-screen items-center overflow-x-hidden">
      <LandingNavbar />
      <Hero />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <RoomShowcaseSection />
      <UpcomingVacanciesSection />
      <About></About>
      <FAQSection />
      <Footer />
    </div>
  );
}
