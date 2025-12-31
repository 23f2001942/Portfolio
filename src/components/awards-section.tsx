
"use client";

import { Award, ExternalLink, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";

export default function AwardsSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!portfolioData.awards || portfolioData.awards.length === 0) {
    return null;
  }

  const firstAward = portfolioData.awards[0];

  return (
    <>
      <Section
        id="awards"
        title="Awards"
      >
        <Card
          className="p-0 overflow-hidden cursor-pointer transition-all hover:border-primary/60 hover:shadow-lg group"
          onClick={() => setIsDialogOpen(true)}
        >
            <div className="flex items-center gap-4 p-4 relative">
            {firstAward.logoUrl && (
              <Image
                src={firstAward.logoUrl}
                alt={`${firstAward.issuer} logo`}
                width={48}
                height={48}
                className="rounded-md object-contain flex-shrink-0"
              />
            )}
            <div className="flex-grow">
              <p className="font-semibold text-primary text-base">
                AP Scholar Awards
              </p>
              <p className="text-sm text-muted-foreground">{firstAward.issuer}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {portfolioData.awards.map(a => a.date).join(', ')}
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground absolute top-4 right-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
        </Card>
      </Section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-start gap-4">
                {firstAward.logoUrl && (
                  <Link href={firstAward.awardUrl || '#'} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={firstAward.logoUrl}
                      alt={`${firstAward.issuer} logo`}
                      width={64}
                      height={64}
                      className="rounded-md object-contain"
                    />
                  </Link>
                )}
                <div className="flex-grow">
                    <DialogTitle className="text-xl font-bold">{firstAward.issuer}</DialogTitle>
                    <p className="font-medium text-primary">
                        <Link
                            href={firstAward.awardUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                        >
                            AP Scholar Awards <ExternalLink className="h-4 w-4" />
                        </Link>
                    </p>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4">
                <ul className="space-y-4">
                    {portfolioData.awards.map((award, index) => (
                    <li key={index}>
                        <div className="flex justify-between items-start gap-2">
                        <div>
                            <p className="font-semibold">{award.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                            {award.description}
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">
                            {award.date}
                        </p>
                        </div>
                        {index < portfolioData.awards.length - 1 && (
                        <Separator className="mt-4" />
                        )}
                    </li>
                    ))}
                </ul>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
