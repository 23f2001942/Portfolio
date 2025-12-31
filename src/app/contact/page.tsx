import Link from "next/link";
import { Github, Mail, MapPin } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const githubSocial = portfolioData.socials.find(s => s.name === "github");
  const emailSocial = portfolioData.socials.find(s => s.name === "email");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Get In Touch</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <Card className="p-4 flex items-center">
            <MapPin className="h-6 w-6 mr-4 text-muted-foreground"/>
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-muted-foreground">{portfolioData.location}</p>
            </div>
          </Card>
          {emailSocial && (
             <Button className="h-16 justify-between px-6 text-lg" asChild>
                <Link href={emailSocial.url}>
                    <span>Contact me</span>
                    <Mail className="h-6 w-6" />
                </Link>
            </Button>
          )}
        </div>
        
        {/* Let's work together */}
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Let's work together</h2>
          <p className="text-muted-foreground mb-4">
            Whether you have a project in mind or just want to chat about technology, feel free to reach out. I'm always interested in hearing about new opportunities.
          </p>
          {emailSocial && (
            <Button asChild>
              <Link href={emailSocial.url}>
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Link>
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
