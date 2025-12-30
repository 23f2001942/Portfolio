
"use client";

import { Users, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { LeadershipRole } from "@/types/portfolio";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import {
  Card
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LeadershipSection() {
  const [selectedRole, setSelectedRole] = useState<LeadershipRole | null>(null);

  if (!portfolioData.leadership || portfolioData.leadership.length === 0) {
    return null;
  }

  return (
    <Section
      id="leadership-roles"
      title="Leadership Roles"
      icon={<Users className="h-8 w-8 text-primary" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioData.leadership.map((role, index) => (
          <Card
            key={index}
            className="p-0 overflow-hidden cursor-pointer transition-all hover:border-primary/60 hover:shadow-lg"
            onClick={() => setSelectedRole(role)}
          >
            <div className="flex items-center gap-4 p-4">
              {role.logo && (
                <Image
                  src={role.logo}
                  alt={`${role.organization} logo`}
                  width={48}
                  height={48}
                  className="rounded-md object-contain flex-shrink-0"
                />
              )}
              <div className="flex-grow">
                  <p className="font-semibold text-primary text-base">{role.role}</p>
                  <p className="text-sm text-muted-foreground">{role.organization}</p>
                  <p className="text-xs text-muted-foreground mt-1">{role.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedRole} onOpenChange={(isOpen) => !isOpen && setSelectedRole(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRole && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  {selectedRole.logo && (
                    <Image
                      src={selectedRole.logo}
                      alt={`${selectedRole.organization} logo`}
                      width={64}
                      height={64}
                      className="rounded-md object-contain"
                    />
                  )}
                  <div className="flex-grow">
                      <DialogTitle className="text-xl font-bold">{selectedRole.role}</DialogTitle>
                      <p className="font-medium text-primary">{selectedRole.organization}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{selectedRole.date}</span>
                        <span className="h-4 border-l border-border"></span>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{selectedRole.location}</span>
                        </div>
                      </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="py-4 space-y-4 text-muted-foreground">
                <p>
                  {selectedRole.description}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
