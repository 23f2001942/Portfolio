import AboutSection from "@/components/about-section";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="max-w-6xl mx-auto w-full">
        <Button variant="outline" size="sm" asChild className="absolute top-8 left-8">
          <Link href="/">
            <ArrowLeft />
            Back to Home
          </Link>
        </Button>
        <AboutSection />
      </div>
    </div>
  );
}
