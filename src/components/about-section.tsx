import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "./section";
import { User } from "lucide-react";

export default function AboutSection() {
  return (
    <Section
      id="about"
      title="About Me"
      icon={<User className="h-8 w-8 text-primary" />}
    >
      <div className="flex-1 space-y-4">
        {portfolioData.intro && (
          <p className="text-lg text-muted-foreground max-w-prose">
            {portfolioData.intro}
          </p>
        )}
      </div>
    </Section>
  );
}
