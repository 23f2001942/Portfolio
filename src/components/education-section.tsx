
"use client";

import { GraduationCap, ExternalLink, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Education } from "@/types/portfolio";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import {
  Card,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function EducationSection() {
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const iitmCerts = portfolioData.licenses.filter(l => l.type === 'iitm');

  return (
    <>
      <Section
        id="education"
        title="Education"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioData.education.map((edu, index) => (
            <Card
              key={index}
              className="p-0 overflow-hidden cursor-pointer transition-all hover:border-primary/60 hover:shadow-lg group"
              onClick={() => setSelectedEducation(edu)}
            >
              <div className="flex items-center gap-4 p-4 relative">
                {edu.logoUrl && (
                  <Image
                    src={edu.logoUrl}
                    alt={`${edu.institution} logo`}
                    width={48}
                    height={48}
                    className="rounded-md object-contain flex-shrink-0"
                  />
                )}
                <div className="flex-grow">
                  <p className="font-semibold text-primary text-base">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.period}</p>
                </div>
                 <ArrowUpRight className="h-5 w-5 text-muted-foreground absolute top-4 right-4" />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Dialog open={!!selectedEducation} onOpenChange={(isOpen) => !isOpen && setSelectedEducation(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEducation && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  {selectedEducation.logoUrl && (
                    <Link href={selectedEducation.universityUrl || '#'} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={selectedEducation.logoUrl}
                        alt={`${selectedEducation.institution} logo`}
                        width={64}
                        height={64}
                        className="rounded-md object-contain"
                      />
                    </Link>
                  )}
                  <div className="flex-grow">
                    <DialogTitle className="text-xl font-bold">{selectedEducation.degree}</DialogTitle>
                    <p className="font-medium text-primary">{selectedEducation.institution}</p>
                    <p className="text-sm text-muted-foreground">{selectedEducation.period}</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="py-4 space-y-4 text-muted-foreground">
                <p>
                  {selectedEducation.description}
                </p>
                {selectedEducation.studentProfileUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={selectedEducation.studentProfileUrl} target="_blank">
                      <ExternalLink />
                      Student Profile
                    </Link>
                  </Button>
                )}
                
                {selectedEducation.institution === "Indian Institute of Technology, Madras" && iitmCerts.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="font-semibold text-primary">Associated Certifications</h4>
                    <ul className="space-y-4">
                      {iitmCerts.map((cert, index) => (
                        <li key={index}>
                           <div className="flex justify-between items-start gap-2">
                              <div>
                                <p className="font-semibold text-sm">{cert.name}</p>
                                {cert.credentialUrl && (
                                   <Button variant="link" size="sm" asChild className="p-0 h-auto">
                                     <Link href={cert.credentialUrl} target="_blank" className="text-xs">
                                       <ExternalLink className="mr-1 h-3 w-3" />
                                       Show Credential
                                     </Link>
                                   </Button>
                                )}
                              </div>
                           </div>
                           {index < iitmCerts.length - 1 && <Separator className="mt-4" />}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
