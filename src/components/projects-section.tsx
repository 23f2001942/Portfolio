import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FolderGit2, Github, Wrench } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Section } from "@/components/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

export default function ProjectsSection() {
  const softwareProjects = portfolioData.projects.filter(p => p.type === 'software');
  const hardwareProjects = portfolioData.projects.filter(p => p.type === 'hardware');

  return (
    <div className="space-y-20">
      {hardwareProjects.length > 0 && (
        <Section
          id="hardware-projects"
          title="Hardware Projects"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hardwareProjects.map((project, index) => {
              const projectImage = getPlaceholderImage(project.image);
              return (
                <Card key={index} className="flex flex-col">
                  {projectImage && (
                    <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                      <Image
                        src={projectImage.imageUrl}
                        alt={projectImage.description}
                        width={600}
                        height={400}
                        data-ai-hint={projectImage.imageHint}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{project.name}</CardTitle>
                      {project.status === "in-progress" && (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs shrink-0">
                          In Progress
                        </Badge>
                      )}
                      {project.status === "completed" && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs shrink-0">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {project.detailsUrl && (
                       <Button variant="outline" size="sm" asChild>
                         <Link href={project.detailsUrl}>
                           <ExternalLink />
                           View Details
                         </Link>
                       </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </Section>
      )}

      {softwareProjects.length > 0 && (
        <Section
          id="software-projects"
          title="Software & Data"
          size="sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {softwareProjects.map((project, index) => {
              const projectImage = getPlaceholderImage(project.image);
              return (
                <Card key={index} className="flex flex-col">
                  {projectImage && (
                    <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                      <Image
                        src={projectImage.imageUrl}
                        alt={projectImage.description}
                        width={600}
                        height={400}
                        data-ai-hint={projectImage.imageHint}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {project.repoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.repoUrl} target="_blank">
                          <Github />
                          Source
                        </Link>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.liveUrl} target="_blank">
                          <ExternalLink />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}
