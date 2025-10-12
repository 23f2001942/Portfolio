import AnimatedWrapper from "@/components/animated-wrapper";
import AwardsSection from "@/components/awards-section";
import EducationSection from "@/components/education-section";
import LicensesSection from "@/components/licenses-section";

export default function EducationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-20">
      <AnimatedWrapper>
        <EducationSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <AwardsSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <LicensesSection />
      </AnimatedWrapper>
    </div>
  );
}
