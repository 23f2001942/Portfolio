import AnimatedWrapper from "@/components/animated-wrapper";
import HeroSection from "@/components/hero-section";
import QualificationsSection from "@/components/qualifications-section";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl space-y-20">
      <AnimatedWrapper>
        <HeroSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <QualificationsSection />
      </AnimatedWrapper>
    </div>
  );
}
