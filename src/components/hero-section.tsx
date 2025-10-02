import Link from "next/link";
import Image from "next/image";
import { portfolioData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import { KaggleIcon, InstagramIcon } from "@/components/icons";
import { getPlaceholderImage } from "@/lib/placeholder-images";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  email: Mail,
  kaggle: KaggleIcon,
  instagram: InstagramIcon,
};

export default function HeroSection() {
  const headshotImage = getPlaceholderImage(portfolioData.headshot);

  return (
    <section
      id="home"
      className="flex flex-col-reverse md:flex-row items-center gap-10 scroll-mt-20"
    >
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            {portfolioData.name}
            </h1>
        </div>
        <h2 className="text-2xl font-semibold text-foreground/80">
          {portfolioData.title}
        </h2>
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
                <Link href={social.url} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
      {headshotImage && (
        <div className="flex-shrink-0">
          <Image
            src={headshotImage.imageUrl}
            alt={headshotImage.description}
            width={256}
            height={256}
            data-ai-hint={headshotImage.imageHint}
            className="rounded-full object-cover w-48 h-48 md:w-64 md:h-64 border-4 border-primary/50 shadow-lg"
          />
        </div>
      )}
    </section>
  );
}
