import React from "react";
import { portfolioData } from "@/lib/portfolio-data";
import SkillIcon from "@/components/skill-icon";
import AnimatedWrapper from "@/components/animated-wrapper";

export default function QualificationsSection() {
  const topSkillNames = ["Arduino", "Raspberry Pi", "Python", "Pandas", "MATLAB"];
  const normalize = (s: string) => s.toLowerCase().trim();

  // Check 'qualifications' (or 'skills' if your data uses that name)
  const allSkills = portfolioData.qualifications || []; 

  const topSkills = allSkills.filter(q => 
    topSkillNames.some(name => normalize(q.skill).includes(normalize(name)))
  );

  const otherSkills = allSkills.filter(q => 
    !topSkillNames.some(name => normalize(q.skill).includes(normalize(name)))
  );

  return (
    <div className="space-y-12">
      {/* TOP SKILLS (Prominent) */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight">★ Top Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {topSkills.map((qual, index) => (
            <AnimatedWrapper key={index} delay={index * 0.05}>
              <div className="flex flex-col items-center justify-center p-6 border rounded-2xl bg-card hover:border-primary/50 transition-colors gap-4 text-center h-full">
                <div className="flex items-center justify-center h-16 w-16">
                  <SkillIcon name={qual.skill} className="h-12 w-12" />
                </div>
                <span className="font-bold text-lg">{qual.skill}</span>
              </div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>

      {/* OTHER SKILLS (Grid) */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight text-muted-foreground">Other Skills</h3>
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
      </div>
    </div>
  );
}
