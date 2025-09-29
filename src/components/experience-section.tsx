import { Briefcase } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
            <CardHeader className="bg-muted/20 p-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <CardTitle className="text-lg font-semibold">{job.role}</CardTitle>
                  <p className="text-sm font-medium text-primary">{job.company}</p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap">{job.period}</p>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {job.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
