
import { portfolioData } from "@/lib/portfolio-data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  const headshot = getPlaceholderImage(portfolioData.headshot);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">{portfolioData.name}</h1>
        <p className="text-lg md:text-xl text-primary/90 max-w-prose">
          {portfolioData.about_summary}
        </p>
        <p className="text-md md:text-lg font-medium text-muted-foreground">{portfolioData.title}</p>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{portfolioData.location}</span>
        </div>
      </div>
      <div className="space-y-6">
        {headshot && (
          <div className="aspect-square relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={headshot.imageUrl}
              alt={headshot.description}
              fill
              className="object-cover"
              data-ai-hint={headshot.imageHint}
            />
          </div>
        )}
        <p className="text-lg text-muted-foreground max-w-prose leading-relaxed">
          {portfolioData.intro}
        </p>
      </div>
    </div>
  );
}
