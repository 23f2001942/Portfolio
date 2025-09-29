import { GraduationCap, ExternalLink } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

const urlRegex = /(https?:\/\/[^\s]+)/g;

export default function EducationSection() {
  return (
    <Section
      id="education"
      title="Education"
      icon={<GraduationCap className="h-8 w-8 text-primary" />}
    >
      <div className="space-y-6">
        {portfolioData.education.map((edu, index) => {
          const descriptionParts = edu.description.split(urlRegex);
          const url = edu.description.match(urlRegex)?.[0];

          return (
            <Card key={index}>
              <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg font-semibold">{edu.degree}</CardTitle>
                      <p className="text-sm font-medium text-primary">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">{edu.period}</p>
                  </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {descriptionParts.map((part, i) =>
                    urlRegex.test(part) ? null : (
                      <span key={i}>{part.replace('Online Degree:', '').trim()}</span>
                    )
                  )}
                </CardDescription>
                {url && (
                   <Button variant="secondary" size="sm" asChild className="mt-2">
                     <Link href={url} target="_blank">
                       <ExternalLink />
                       Student Profile
                     </Link>
                   </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </Section>
  );
}
