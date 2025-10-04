
import { Briefcase, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InstagramIcon } from "./icons";
import { Button } from "./ui/button";

const iconMap = {
  linkedin: Linkedin,
  instagram: InstagramIcon,
};

export default function ExperienceSection() {
  return (
    <Section
      id="experience"
      title="Work Experience"
      icon={<Briefcase className="h-8 w-8 text-primary" />}
    >
      <div className="space-y-6">
        {portfolioData.experience.map((job, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-start gap-4">
                {job.logoUrl && (
                  <Image
                    src={job.logoUrl}
                    alt={`${job.company} logo`}
                    width={64}
                    height={64}
                    className="rounded-md object-contain"
                  />
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg font-semibold">{job.role}</CardTitle>
                      <p className="text-sm font-medium text-primary">{job.company}</p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">{job.period}</p>
                  </div>
                   {job.socials && job.socials.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      {job.socials.map((social) => {
                        const Icon = iconMap[social.name as keyof typeof iconMap];
                        return (
                          <Button
                            key={social.name}
                            variant="outline"
                            size="icon"
                            asChild
                            className="bg-card/50 h-8 w-8"
                          >
                            <Link href={social.url} target="_blank" rel="noopener noreferrer">
                              <Icon className="h-4 w-4" />
                              <span className="sr-only">{social.name}</span>
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-muted-foreground">
                {job.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
