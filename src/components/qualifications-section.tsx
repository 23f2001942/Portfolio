import React from "react";
import { portfolioData } from "@/lib/portfolio-data";
import SkillIcon from "@/components/skill-icon";

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
      <div className="space-y-8">
        <h2 className="text-3xl font-bold font-headline text-primary">Top Skills</h2>
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
      </div>

      {/* OTHER SKILLS (Grid) */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold font-headline text-primary">Other Skills</h2>
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
