"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { portfolioData } from "@/lib/portfolio-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types/portfolio";

const featuredProjectNames = [
  "Drones", // Special case
  "Smart Milk Froth Monitor",
  "Vendora",
  "UBITS-GPA",
];

// Hardcoded image mapping
const imageMap: { [key: string]: string } = {
  "SkyOne & SkyTwo": "/images/first.png",
  "Smart Milk Froth Monitor": "/images/second.png",
  "Vendora": "/images/third.png",
  "UBITS-GPA": "/images/fourth.png",
};

export default function ProjectCarousel() {
  // Special handling for drone projects
  const skyOne = portfolioData.projects.find(p => p.name === "SkyOne");
  const skyTwo = portfolioData.projects.find(p => p.name === "SkyTwo");
  
  let featuredProjects: (Project | undefined)[] = [];

  if (skyOne && skyTwo) {
    const combinedDrones: Project = {
      name: "SkyOne & SkyTwo",
      description: "My foundational drone projects, from basic flight controllers to advanced autonomous systems with live video streaming.",
      image: "/images/first.png", 
      tags: [...new Set([...skyOne.tags, ...skyTwo.tags])],
      type: "hardware",
      detailsUrl: "/projects/skyone"
    };
    featuredProjects.push(combinedDrones);
  }

  // Add other featured projects, skipping the individual drone projects
  featuredProjects.push(
    ...featuredProjectNames
      .filter(name => name !== "SkyOne" && name !== "SkyTwo")
      .map(name => portfolioData.projects.find(p => p.name === name))
  );

  const validProjects = featuredProjects.filter((p): p is Project => !!p);

  return (
    <Carousel
      className="w-full h-full"
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
        }),
      ]}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent className="h-full">
        {validProjects.map((project, index) => (
          <CarouselItem key={index} className="relative h-full w-full">
            <Image
              src={imageMap[project.name] || '/images/default.png'} // Use mapped image
              alt={project.description}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {project.name}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/10 text-white border-white/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-white/80 text-sm md:text-base mb-6 line-clamp-2">
                  {project.description}
                </p>
                
                {(project.detailsUrl || project.repoUrl || project.liveUrl) && (
                   <Button variant="outline" asChild className="bg-transparent border-white/50 hover:bg-white/10">
                     <Link href={project.detailsUrl || project.repoUrl || project.liveUrl || '#'}>
                       View Project <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                   </Button>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2">
        <CarouselPrevious className="static translate-y-0 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
        <CarouselNext className="static translate-y-0 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
      </div>
    </Carousel>
  );
}
