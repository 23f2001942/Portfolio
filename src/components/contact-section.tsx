import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Contact } from "lucide-react";
import { KaggleIcon, InstagramIcon } from "@/components/icons";
import { Section } from "./section";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  email: Mail,
  kaggle: KaggleIcon,
  instagram: InstagramIcon,
};

export default function ContactSection() {
  return (
    <Section
      id="contact"
      title="Contact Me"
      icon={<Contact className="h-8 w-8 text-primary" />}
    >
      <div className="flex gap-2 pt-4">
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
    </Section>
  );
}
