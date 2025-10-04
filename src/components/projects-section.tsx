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
    <>
      {hardwareProjects.length > 0 && (
        <Section
          id="hardware-projects"
          title="Hardware Projects"
          icon={<Wrench className="h-8 w-8 text-primary" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          title="Software Projects"
          icon={<FolderGit2 className="h-8 w-8 text-primary" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
  );
}
