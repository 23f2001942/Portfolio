import React from "react";
import { portfolioData } from "@/lib/portfolio-data";
import SkillIcon from "@/components/skill-icon";
import { Section } from "./section";

const skillGroups: { category: 'top' | 'cad' | 'hardware' | 'programming' | 'web'; title: string }[] = [
  { category: 'top', title: 'Top Skills' },
  { category: 'cad', title: 'CAD & Simulation' },
  { category: 'hardware', title: 'Prototyping & Hardware' },
  { category: 'programming', title: 'Programming & Data' },
  { category: 'web', title: 'Web Development' },
];

export default function QualificationsSection() {
  const allSkills = portfolioData.qualifications || [];

  return (
    <Section id="skills" title="Skills">
      <div className="space-y-10">
        {skillGroups.map(group => {
          const skills = allSkills.filter(q => q.category === group.category);
          if (skills.length === 0) return null;

          return (
            <div key={group.category}>
              <h3 className="text-lg font-semibold text-[hsl(var(--highlight-sub))] mb-4">
                {group.title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((qual, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 flex items-center justify-center shrink-0">
                      <SkillIcon name={qual.skill} className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-sm">{qual.skill}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
