import FAQItem from "./faqCard";

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I list my property?",
      answer:
        "Simply create an account, click on 'List Your Space,' and follow the step-by-step guide to create your listing. You can upload high-quality photos, add a detailed description, set pricing, and define rental terms. Our intuitive dashboard makes it easy to manage availability, bookings, and inquiries."
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes, all payments are processed through our secure payment system with bank-grade encryption and real-time fraud detection. We ensure that both landlords and tenants are protected throughout every transaction, giving you peace of mind while using Homescape."
    },
    {
      question: "How are tenants verified?",
      answer:
        "We verify all users through a multi-step process that includes government-issued ID verification, background checks, and rental history reviews. This ensures a safe and trustworthy community for both landlords and tenants."
    },
    {
      question: "What if there's an issue with my rental?",
      answer:
        "Our dedicated customer support team is available 24/7 via chat and email to help resolve any problems. In case of a dispute, we offer a formal resolution process that includes reviewing documentation from both parties and proposing a fair solution."
    },
    {
      question: "Can I update my listing after it’s published?",
      answer:
        "Absolutely! You can edit your property details, update images, adjust pricing, or block dates anytime from your landlord dashboard. All changes are reflected instantly to potential renters."
    },
    {
      question: "What happens if a booking is canceled?",
      answer:
        "Homescape has clear cancellation policies for both hosts and guests. Depending on the timing and reason for cancellation, partial or full refunds may apply. You can choose a policy that suits your preferences when creating your listing."
    }
  ];


  return (
    <section className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
      <p className="text-center text-gray-600 mb-8">
        Find answers to common questions about our pet care platform.
      </p>

      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </section>
  );
}
