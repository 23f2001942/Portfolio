import AnimatedWrapper from "@/components/animated-wrapper";
import ProjectsSection from "@/components/projects-section";
import { Button } from "@/components/ui/button";
import { FolderGit2, Wrench } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12">
      <AnimatedWrapper>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/projects#hardware-projects">
              <Wrench />
              Hardware Projects
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/projects#software-projects">
              <FolderGit2 />
              Software Projects
            </Link>
          </Button>
        </div>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <ProjectsSection />
      </AnimatedWrapper>
    </div>
  );
}
