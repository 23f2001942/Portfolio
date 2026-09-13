
"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Research } from "@/types/portfolio";
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
import { Badge } from "@/components/ui/badge";

export default function ResearchSection() {
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null);

  if (portfolioData.research.length === 0) {
    return null;
  }

  return (
    <>
      <Section
        id="research"
        title="Research Experience"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioData.research.map((item, index) => (
            <Card
              key={index}
              className="p-0 overflow-hidden cursor-pointer transition-all hover:border-primary/60 hover:shadow-lg group"
              onClick={() => setSelectedResearch(item)}
            >
              <div className="p-4 relative">
                <div className="pr-6">
                  <p className="font-semibold text-primary text-base">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.supervisor}, {item.institution}</p>
                  {item.period && <p className="text-xs text-muted-foreground mt-1">{item.period}</p>}
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground absolute top-4 right-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Dialog open={!!selectedResearch} onOpenChange={(isOpen) => !isOpen && setSelectedResearch(null)}>
        <DialogContent className="max-w-2xl">
          {selectedResearch && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selectedResearch.title}</DialogTitle>
                <p className="font-medium text-primary">{selectedResearch.supervisor}, {selectedResearch.institution}</p>
                {selectedResearch.period && <p className="text-sm text-muted-foreground">{selectedResearch.period}</p>}
              </DialogHeader>
              <div className="py-4 space-y-4 text-muted-foreground max-h-[60vh] overflow-y-auto no-scrollbar">
                <p>
                  {selectedResearch.description}
                </p>
                <div className="space-y-2 pt-4 border-t border-border">
                  <h4 className="font-semibold text-primary">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResearch.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
