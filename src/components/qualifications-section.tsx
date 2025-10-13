import { Lightbulb } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QualificationsSection() {
  const topSkills = portfolioData.qualifications.filter(q => q.type === 'top');
  const otherSkills = portfolioData.qualifications.filter(q => q.type === 'other');

  return (
    <Section
      id="qualifications"
      title="Skills"
      icon={<Lightbulb className="h-8 w-8 text-primary" />}
    >
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((qual, index) => (
                <Badge key={index} variant="secondary" className="text-base">
                  {qual.skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">Other Skills</h3>
            <div className="flex flex-wrap gap-2">
              {otherSkills.map((qual, index) => (
                <Badge key={index} variant="secondary" className="text-base">
                  {qual.skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
