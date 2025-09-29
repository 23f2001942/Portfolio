import { Award } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AwardsSection() {
  if (!portfolioData.awards || portfolioData.awards.length === 0) {
    return null;
  }
  
  return (
    <Section
      id="awards"
      title="Honors & Awards"
      icon={<Award className="h-8 w-8 text-primary" />}
    >
      <Card>
        <CardContent className="p-4">
          <ul className="space-y-4">
            {portfolioData.awards.map((award, index) => (
              <li key={index}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold">{award.name}</p>
                    <p className="text-sm text-muted-foreground">{award.issuer}</p>
                    <p className="text-sm text-muted-foreground mt-1">{award.description}</p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">{award.date}</p>
                </div>
                {index < portfolioData.awards.length - 1 && <Separator className="mt-4" />}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Section>
  );
}
