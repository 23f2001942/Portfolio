import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, User } from "lucide-react";
import { KaggleIcon, InstagramIcon } from "@/components/icons";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  email: Mail,
  kaggle: KaggleIcon,
  instagram: InstagramIcon,
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className="flex flex-col-reverse md:flex-row items-center gap-10 scroll-mt-20"
    >
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline text-primary">
            About Me
          </h1>
        </div>
        {portfolioData.intro && (
          <p className="text-lg text-muted-foreground max-w-prose">
            {portfolioData.intro}
          </p>
        )}
        <div id="contact" className="flex gap-2 pt-4 scroll-mt-20">
          {portfolioData.socials.map((social) => {
            const Icon = iconMap[social.name as keyof typeof iconMap] || Mail;
            return (
              <Button
                key={social.name}
                variant="outline"
                size="icon"
                asChild
                className="bg-card hover:bg-accent hover:text-accent-foreground"
              >
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
