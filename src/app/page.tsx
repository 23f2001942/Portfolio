import AnimatedWrapper from "@/components/animated-wrapper";
import HeroCarousel from "@/components/hero-carousel";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-20">
      <AnimatedWrapper>
        <HeroCarousel />
      </AnimatedWrapper>
    </div>
  );
}
