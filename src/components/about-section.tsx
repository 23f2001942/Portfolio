import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "./section";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getPlaceholderImage } from "@/lib/placeholder-images";

export default function AboutSection() {
  const headshot = getPlaceholderImage(portfolioData.headshot);
  return (
    <Section
      id="about"
      title="About Me"
      icon={<User className="h-8 w-8 text-primary" />}
    >
      <div className="flex flex-col md:flex-row items-start gap-8">
        {headshot && (
          <Avatar className="w-32 h-32 flex-shrink-0">
            <AvatarImage src={headshot.imageUrl} alt={headshot.description} />
            <AvatarFallback>{portfolioData.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-bold text-primary">{portfolioData.name}</h3>
          <h4 className="text-lg font-medium text-muted-foreground">{portfolioData.title}</h4>
          <p className="text-lg text-muted-foreground max-w-prose leading-relaxed">
            {portfolioData.intro}
          </p>
        </div>
      </div>
    </Section>
  );
}
