import AwardsSection from "@/components/awards-section";
import EducationSection from "@/components/education-section";
import ExperienceSection from "@/components/experience-section";
import HeroSection from "@/components/hero-section";
import LeadershipSection from "@/components/leadership-section";
import LicensesSection from "@/components/licenses-section";
import ProjectsSection from "@/components/projects-section";
import QualificationsSection from "@/components/qualifications-section";
import ProjectCarousel from "@/components/project-carousel";
import Navbar from "@/components/navbar";
import ContactBar from "@/components/contact-bar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Panel (Fixed on Desktop) */}
      <div className="w-full md:w-2/5 md:fixed md:inset-y-0 md:left-0 md:flex md:flex-col bg-black relative overflow-hidden h-[50vh] md:h-auto">
        <Navbar />
        <ProjectCarousel />
      </div>

      {/* Spacer for desktop layout */}
      <div className="hidden md:block md:w-2/5" />

      {/* Right Panel (Scrollable Content) */}
      <div className="w-full md:w-3/5 md:ml-auto bg-background">
        <div className="p-4 sm:p-6 md:p-8 space-y-16">
          <div id="home" className="scroll-mt-24">
            <HeroSection />
          </div>

          <div id="skills" className="space-y-6 scroll-mt-24">
            <QualificationsSection />
          </div>

          <div id="experience" className="space-y-6 scroll-mt-24">
            <ExperienceSection />
            <LeadershipSection />
          </div>

          <div id="education" className="space-y-6 scroll-mt-24">
            <EducationSection />
          </div>

          <div id="projects" className="space-y-6 scroll-mt-24">
            <ProjectsSection />
            <LicensesSection />
            <AwardsSection />
          </div>

          <div id="contact" className="pt-12 pb-8 border-t scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
            <ContactBar />
          </div>
        </div>
      </div>
    </div>
  );
}
