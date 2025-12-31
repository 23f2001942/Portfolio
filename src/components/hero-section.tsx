import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <Link href="/about" className="group block h-full">
      <Card className="h-full transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-xl">
        <CardContent className="p-4 flex items-center gap-4 relative">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-primary">{portfolioData.name}</h2>
            <p className="text-md font-semibold text-muted-foreground">{portfolioData.title}</p>
          </div>
           <ArrowRight className="h-5 w-5 text-muted-foreground absolute top-4 right-4 transition-transform duration-300 group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
