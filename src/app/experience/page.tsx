import AnimatedWrapper from "@/components/animated-wrapper";
import ExperienceSection from "@/components/experience-section";
import LeadershipSection from "@/components/leadership-section";

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-20">
      <AnimatedWrapper>
        <ExperienceSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <LeadershipSection />
      </AnimatedWrapper>
    </div>
  );
}