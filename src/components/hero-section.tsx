import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const headshot = getPlaceholderImage(portfolioData.headshot);

  return (
    <Link href="/about" className="group block h-full">
      <Card className="h-full transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-xl">
        <CardContent className="p-4 flex items-center gap-4 relative">
          {headshot && (
            <Avatar className="h-16 w-16">
              <AvatarImage src={headshot.imageUrl} alt={headshot.description} />
              <AvatarFallback>{portfolioData.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-grow">
            <h2 className="text-lg font-bold text-primary">{portfolioData.name}</h2>
            <p className="text-sm text-muted-foreground">{portfolioData.title}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{portfolioData.summary}</p>
          </div>
           <ArrowRight className="h-5 w-5 text-muted-foreground absolute top-4 right-4 transition-transform duration-300 group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
