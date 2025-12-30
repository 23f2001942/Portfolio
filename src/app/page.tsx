import AwardsSection from "@/components/awards-section";
import ContactBar from "@/components/contact-bar";
import EducationSection from "@/components/education-section";
import ExperienceSection from "@/components/experience-section";
import HeroSection from "@/components/hero-section";
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
        <div className="p-4 sm:p-6 md:p-8 space-y-12">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm -mx-8 px-8 pt-8 pb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <HeroSection />
                </div>
                <div className="w-full sm:w-auto">
                    <ContactBar />
                </div>
              </div>
            </div>

            <div className="space-y-20">
              <QualificationsSection />
              <ExperienceSection />
              <LeadershipSection />
              <EducationSection />
              <AwardsSection />
              <LicensesSection />
              <ProjectsSection />
            </div>
        </div>
      </div>
    </div>
  );
}
