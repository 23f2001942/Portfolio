
"use client";

import { BookMarked, ExternalLink, GraduationCap, Server } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { License } from "@/types/portfolio";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type CertificateType = 'mooc' | 'nptel';

interface CertCategory {
  type: CertificateType;
  title: string;
  icon: React.ReactNode;
}

const categories: CertCategory[] = [
  { type: 'nptel', title: 'NPTEL Certifications (SWAYAM)', icon: <GraduationCap className="h-6 w-6 text-primary/80" /> },
  { type: 'mooc', title: 'MOOCs', icon: <Server className="h-6 w-6 text-primary/80" /> },
];

export default function LicensesSection() {
  const [selectedType, setSelectedType] = useState<CertificateType | null>(null);
  const [filteredCerts, setFilteredCerts] = useState<License[]>([]);
  const [dialogTitle, setDialogTitle] = useState("");

  useEffect(() => {
    if (selectedType) {
      const category = categories.find(c => c.type === selectedType);
      if (category) {
        setDialogTitle(category.title);
        const certs = portfolioData.licenses.filter(l => l.type === selectedType);
        setFilteredCerts(certs);
      }
    }
  }, [selectedType]);

  const handleCardClick = (type: CertificateType) => {
    setSelectedType(type);
  };

  return (
    <>
      <Section
        id="licenses"
        title="Certifications"
        icon={<BookMarked className="h-8 w-8 text-primary" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card
              key={category.type}
              className="p-4 flex items-center gap-4 cursor-pointer transition-all hover:border-primary/60 hover:shadow-lg"
              onClick={() => handleCardClick(category.type)}
            >
              {category.icon}
              <div className="flex-grow">
                <p className="font-semibold text-primary text-base">{category.title}</p>
                <p className="text-sm text-muted-foreground">
                  {portfolioData.licenses.filter(l => l.type === category.type).length} courses
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Dialog open={!!selectedType} onOpenChange={(isOpen) => !isOpen && setSelectedType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <ul className="space-y-4">
              {filteredCerts.map((cert, index) => (
                <li key={index}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold">{cert.name}</p>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{cert.date}</p>
                    </div>
                    {cert.credentialUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={cert.credentialUrl} target="_blank">
                          <ExternalLink />
                          Show Credential
                        </Link>
                      </Button>
                    )}
                    {cert.credentialId && (
                       <p className="text-sm text-muted-foreground">Credential ID: {cert.credentialId}</p>
                    )}
                  </div>
                  {index < filteredCerts.length - 1 && <Separator className="mt-4" />}
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
