import AnimatedWrapper from "@/components/animated-wrapper";
import EducationSection from "@/components/education-section";
import LicensesSection from "@/components/licenses-section";

export default function EducationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-20">
      <AnimatedWrapper>
        <EducationSection />
      </AnimatedWrapper>
      <AnimatedWrapper>
        <LicensesSection />
      </AnimatedWrapper>
    </div>
  );
}
