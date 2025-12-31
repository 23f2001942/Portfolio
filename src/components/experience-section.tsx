
"use client";

import { Briefcase, Linkedin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Experience } from "@/types/portfolio";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InstagramIcon } from "./icons";
import { Button } from "./ui/button";

const iconMap = {
  linkedin: Linkedin,
  instagram: InstagramIcon,
};

export default function ExperienceSection() {
  const [selectedJob, setSelectedJob] = useState<Experience | null>(null);

  return (
    <Section
      id="experience"
      title="Work Experience"
      icon={<Briefcase className="h-8 w-8 text-primary" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioData.experience.map((job, index) => (
          <Card
            key={index}
            className="p-0 overflow-hidden cursor-pointer transition-all hover:border-primary/60 hover:shadow-lg group"
            onClick={() => setSelectedJob(job)}
          >
            <div className="flex items-center gap-4 p-4 relative">
              {job.logoUrl && (
                <Image
                  src={job.logoUrl}
                  alt={`${job.company} logo`}
                  width={48}
                  height={48}
                  className="rounded-md object-contain flex-shrink-0"
                />
              )}
              <div className="flex-grow">
                  <p className="font-semibold text-primary text-base">{job.role}</p>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{job.period}</p>
              </div>
               <ArrowRight className="h-5 w-5 text-muted-foreground absolute top-4 right-4 transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedJob} onOpenChange={(isOpen) => !isOpen && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  {selectedJob.logoUrl && (
                    <Image
                      src={selectedJob.logoUrl}
                      alt={`${selectedJob.company} logo`}
                      width={64}
                      height={64}
                      className="rounded-md object-contain"
                    />
                  )}
                  <div className="flex-grow">
                      <DialogTitle className="text-xl font-bold">{selectedJob.role}</DialogTitle>
                      <p className="font-medium text-primary">{selectedJob.company}</p>
                      <p className="text-sm text-muted-foreground">{selectedJob.period}</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="py-4 space-y-4 text-muted-foreground">
                <p>
                  {selectedJob.description}
                </p>
              </div>
              {selectedJob.socials && selectedJob.socials.length > 0 && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  {selectedJob.socials.map((social) => {
                    const Icon = iconMap[social.name as keyof typeof iconMap];
                    if (!Icon) return null;
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
