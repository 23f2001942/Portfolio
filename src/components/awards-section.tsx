import { Award, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AwardsSection() {
  if (!portfolioData.awards || portfolioData.awards.length === 0) {
    return null;
  }

  const firstAward = portfolioData.awards[0];

  return (
    <Section
      id="awards"
      title="Honors & Awards"
      icon={<Award className="h-8 w-8 text-primary" />}
    >
      <Card>
        {firstAward.logoUrl && firstAward.awardUrl && (
          <CardHeader className="flex flex-row items-center gap-4">
              <Link href={firstAward.awardUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <Image
                  src={firstAward.logoUrl}
                  alt={`${firstAward.issuer} logo`}
                  width={64}
                  height={64}
                  className="rounded-md object-contain"
                />
              </Link>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-primary">{firstAward.issuer}</h3>
              <p className="text-muted-foreground">
                <Link href={firstAward.awardUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                  AP Scholar Awards <ExternalLink className="h-4 w-4" />
                </Link>
              </p>
            </div>
          </CardHeader>
        )}
        <CardContent className="p-4">
          <ul className="space-y-4">
            {portfolioData.awards.map((award, index) => (
              <li key={index}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold">{award.name}</p>
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
