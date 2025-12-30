import AboutSection from "@/components/about-section";
import AwardsSection from "@/components/awards-section";
import ContactSection from "@/components/contact-section";
import EducationSection from "@/components/education-section";
import ExperienceSection from "@/components/experience-section";
import LeadershipSection from "@/components/leadership-section";
import LicensesSection from "@/components/licenses-section";
import ProjectsSection from "@/components/projects-section";
import QualificationsSection from "@/components/qualifications-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Panel (Fixed) */}
      <div className="w-full md:w-2/5 md:fixed md:inset-y-0 md:left-0 md:flex md:flex-col p-8 bg-card/30">
        <div className="flex-grow flex items-center justify-center">
            <h1 className="text-4xl font-bold text-center text-primary">Project Carousel Coming Soon</h1>
        </div>
      </div>

      {/* Spacer for the fixed left panel on desktop */}
      <div className="hidden md:block md:w-2/5" />

      {/* Right Panel (Scrollable) */}
      <div className="w-full md:w-3/5 md:ml-auto">
        <div className="p-8 space-y-20">
          <AboutSection />
          <QualificationsSection />
          <ExperienceSection />
          <LeadershipSection />
          <EducationSection />
          <AwardsSection />
          <LicensesSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </div>
    </div>
  );
}
