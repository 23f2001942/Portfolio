import AnimatedWrapper from "@/components/animated-wrapper";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-20">
      <AnimatedWrapper>
        <AboutSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <ContactSection />
      </AnimatedWrapper>
    </div>
  );
}
