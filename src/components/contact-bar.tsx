import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
};

export default function ContactBar() {
  const socialLinks = portfolioData.socials.filter(s => s.name === 'linkedin' || s.name === 'github');
  const emailLink = portfolioData.socials.find(s => s.name === 'email');

  return (
    <div className="flex flex-row sm:flex-col items-center justify-start gap-2">
      {socialLinks.map((social) => {
        const Icon = iconMap[social.name as keyof typeof iconMap];
        if (!Icon) return null;
        return (
          <Button
            key={social.name}
            variant="outline"
            size="icon"
            asChild
            className="bg-card hover:bg-accent hover:text-accent-foreground h-12 w-12"
          >
            <Link
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <Icon className="h-6 w-6" />
            </Link>
          </Button>
        );
      })}
      {emailLink && (
        <Button asChild size="lg" className="w-full sm:w-auto h-12">
           <Link href={emailLink.url}>
            <Mail className="h-6 w-6" />
            <span className="hidden sm:inline">Contact Me</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
