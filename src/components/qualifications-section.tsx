import { Lightbulb, Star } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import SkillIcon from "./skill-icon";
import AnimatedWrapper from "./animated-wrapper";

export default function QualificationsSection() {
  const topSkillNames = ["Arduino", "Raspberry Pi", "Python", "Pandas", "MATLAB"];

  const normalize = (s: string) => s.toLowerCase().trim();

  const topSkills = portfolioData.qualifications.filter(q => 
    topSkillNames.some(name => normalize(q.skill).includes(normalize(name)))
  );

  const otherSkills = portfolioData.qualifications.filter(q => 
    !topSkillNames.some(name => normalize(q.skill).includes(normalize(name)))
  );

  return (
    <Section
      id="qualifications"
      title="Skills"
      icon={<Lightbulb className="h-8 w-8 text-primary" />}
    >
      <div className="space-y-12">
        {/* --- TOP SKILLS --- */}
        {topSkills.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" /> Top Skills
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {topSkills.map((qual, index) => (
                <AnimatedWrapper key={index} delay={index * 0.05}>
                  <div className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-primary/20 bg-primary/5 rounded-2xl hover:border-primary/50 transition-colors gap-3 text-center h-full">
                    <SkillIcon name={qual.skill} className="h-10 w-10 md:h-12 md:w-12" />
                    <span className="font-bold text-sm sm:text-base md:text-lg">{qual.skill}</span>
                  </div>
                </AnimatedWrapper>
              ))}
            </div>
          </div>
        )}

        {/* --- OTHER SKILLS --- */}
        {otherSkills.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold tracking-tight text-muted-foreground">
              Technical Arsenal
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {otherSkills.map((qual, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 flex items-center justify-center bg-muted/30 rounded-lg shrink-0">
                    <SkillIcon name={qual.skill} className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-sm">{qual.skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
