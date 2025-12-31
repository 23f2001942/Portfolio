import React from "react";
import { portfolioData } from "@/lib/portfolio-data";
import SkillIcon from "@/components/skill-icon";
import { Section } from "./section";

export default function QualificationsSection() {
  const allSkills = portfolioData.qualifications || []; 

  // Correctly filter skills based on the 'type' property from portfolio-data.ts
  const topSkills = allSkills.filter(q => q.type === 'top');
  const otherSkills = allSkills.filter(q => q.type === 'other');

  return (
    <div className="space-y-20">
      {/* TOP SKILLS (Prominent) */}
      {topSkills.length > 0 && (
        <Section id="top-skills" title="Top Skills">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topSkills.map((qual, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 flex items-center justify-center shrink-0">
                    <SkillIcon name={qual.skill} className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">{qual.skill}</span>
                </div>
            ))}
            </div>
        </Section>
      )}

      {/* OTHER SKILLS (Grid) */}
      {otherSkills.length > 0 && (
        <Section id="other-skills" title="Other Skills">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherSkills.map((qual, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 flex items-center justify-center shrink-0">
                    <SkillIcon name={qual.skill} className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">{qual.skill}</span>
                </div>
            ))}
            </div>
        </Section>
      )}
    </div>
  );
}
