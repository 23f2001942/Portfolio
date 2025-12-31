
import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export default function HeroSection() {
  return (
    <Link href="/about" className="group block h-full">
      <Card className="h-full transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-xl">
        <CardContent className="p-6 flex flex-col justify-center gap-2 relative h-full">
          <div className="flex-grow space-y-2">
            <h2 className="text-3xl font-bold text-primary">{portfolioData.name}</h2>
            <p className="text-lg font-semibold text-muted-foreground">{portfolioData.title}</p>
            <p className="text-sm text-muted-foreground pt-2">{portfolioData.about_summary}</p>
          </div>
           <ArrowUpRight className="h-5 w-5 text-muted-foreground absolute top-4 right-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
