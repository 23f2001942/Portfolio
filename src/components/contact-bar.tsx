import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
};

const socialNameMap = {
  linkedin: "LinkedIn",
  github: "GitHub",
}

export default function ContactBar() {
  const socialLinks = portfolioData.socials.filter(s => s.name === 'linkedin' || s.name === 'github');
  const emailLink = portfolioData.socials.find(s => s.name === 'email');

  return (
    <div className="grid grid-cols-2 gap-2">
      {socialLinks.map((social) => {
        const Icon = iconMap[social.name as keyof typeof iconMap];
        const socialName = socialNameMap[social.name as keyof typeof socialNameMap]
        if (!Icon || !socialName) return null;

        return (
          <Button
            key={social.name}
            variant="secondary"
            className="w-full h-12 px-4"
            asChild
          >
            <Link
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="flex justify-between items-center"
            >
              <span>{socialName}</span>
              <Icon className="h-6 w-6" />
            </Link>
          </Button>
        );
      })}
      {emailLink && (
        <Button asChild size="lg" className="w-full h-12 col-span-2">
           <Link href={emailLink.url}>
            <Mail className="h-6 w-6 mr-2" />
            Contact Me
          </Link>
        </Button>
      )}
    </div>
  );
}
