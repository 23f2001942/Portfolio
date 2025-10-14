import AnimatedWrapper from "@/components/animated-wrapper";
import HeroCarousel from "@/components/hero-carousel";

export default function Home() {
  return (
    <div className="w-full">
      <AnimatedWrapper>
        <HeroCarousel />
      </AnimatedWrapper>
    </div>
  );
}
