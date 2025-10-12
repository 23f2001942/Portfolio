import AnimatedWrapper from "@/components/animated-wrapper";
import AwardsSection from "@/components/awards-section";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl space-y-20">
      <AnimatedWrapper>
        <HeroSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <AwardsSection />
      </AnimatedWrapper>
    </div>
  );
}
