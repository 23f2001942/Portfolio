import AnimatedWrapper from "@/components/animated-wrapper";
import ProjectsSection from "@/components/projects-section";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12">
      <AnimatedWrapper>
        <ProjectsSection />
      </AnimatedWrapper>
    </div>
  );
}
