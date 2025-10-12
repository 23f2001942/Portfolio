import AnimatedWrapper from "@/components/animated-wrapper";
import ExperienceSection from "@/components/experience-section";
import LeadershipSection from "@/components/leadership-section";
import QualificationsSection from "@/components/qualifications-section";

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-20">
      <AnimatedWrapper>
        <QualificationsSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <ExperienceSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <LeadershipSection />
      </AnimatedWrapper>
    </div>
  );
}
