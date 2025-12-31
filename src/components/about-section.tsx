import { portfolioData } from "@/lib/portfolio-data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Github, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
  const headshot = getPlaceholderImage(portfolioData.headshot);
  const githubSocial = portfolioData.socials.find(s => s.name === "github");
  const emailSocial = portfolioData.socials.find(s => s.name === "email");

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div className="flex items-center gap-6">
        {headshot && (
          <Avatar className="h-40 w-40">
            <AvatarImage src={headshot.imageUrl} alt={headshot.description} data-ai-hint={headshot.imageHint} />
            <AvatarFallback>{portfolioData.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-grow">
          <h1 className="text-4xl font-bold text-primary">{portfolioData.name}</h1>
          <p className="text-lg text-primary/90">{portfolioData.title}</p>
          <p className="mt-2 text-muted-foreground">{portfolioData.about_summary}</p>
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-2 gap-4">
        {githubSocial && (
          <Button variant="secondary" className="h-16 justify-between px-6" asChild>
            <Link href={githubSocial.url} target="_blank" rel="noopener noreferrer">
              <span>GitHub</span>
              <Github className="h-6 w-6" />
            </Link>
          </Button>
        )}
        {emailSocial && (
          <Button variant="secondary" className="h-16 justify-between px-6" asChild>
            <Link href={emailSocial.url}>
              <span>Email</span>
              <Mail className="h-6 w-6" />
            </Link>
          </Button>
        )}
        <Card className="p-4 flex items-center col-span-2 sm:col-span-1">
            <MapPin className="h-6 w-6 mr-4 text-muted-foreground"/>
            <div>
                <p className="font-semibold">Location</p>
                <p className="text-muted-foreground">{portfolioData.location}</p>
            </div>
        </Card>
      </div>

      {/* About Me Card */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">About Me</h2>
        <div className="text-muted-foreground space-y-4 leading-relaxed">
            <p>{portfolioData.intro}</p>
        </div>
      </Card>
    </div>
  );
}
