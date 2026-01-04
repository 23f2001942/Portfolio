
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
  "SkyOne", // This will be treated as the combined drone project
  "Smart Milk Froth Monitor",
  "Vendora",
  "UBITS-GPA",
];

// Hardcoded image mapping
const imageMap: { [key: string]: string } = {
  "SkyOne": "/images/first.png",
  "Smart Milk Froth Monitor": "/images/second.png",
  "Vendora": "/images/third.png",
  "UBITS-GPA": "/images/fourth.png",
};

export default function ProjectCarousel() {
  const skyOne = portfolioData.projects.find(p => p.name === "SkyOne");
  const skyTwo = portfolioData.projects.find(p => p.name === "SkyTwo");

  const validProjects = featuredProjectNames
    .map(name => portfolioData.projects.find(p => p.name === name))
    .filter((p): p is Project => !!p);

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
        {validProjects.map((project, index) => {
          const isDroneProject = project.name === "SkyOne";
          const displayName = isDroneProject ? "SkyOne & SkyTwo" : project.name;
          const displayDescription = isDroneProject 
            ? "My foundational drone projects, from basic flight controllers to advanced autonomous systems with live video streaming."
            : project.description;
          
          let displayTags: string[] = [];
          if (isDroneProject && skyOne && skyTwo) {
            displayTags = [...new Set([...skyOne.tags, ...skyTwo.tags])];
          } else {
            displayTags = project.tags;
          }

          return (
            <CarouselItem key={index} className="relative h-full w-full">
              <Image
                src={imageMap[project.name] || '/images/default.png'}
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
                    {displayName}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {displayTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/10 text-white border-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-white/80 text-sm md:text-base mb-6 line-clamp-2">
                    {displayDescription}
                  </p>
                  
                  <div className="flex gap-2">
                    {isDroneProject && skyOne?.detailsUrl && skyTwo?.detailsUrl ? (
                      <>
                        <Button variant="outline" asChild className="bg-transparent border-white/50 hover:bg-white/10">
                          <Link href={skyOne.detailsUrl}>
                            SkyOne <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="bg-transparent border-white/50 hover:bg-white/10">
                          <Link href={skyTwo.detailsUrl}>
                            SkyTwo <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </>
                    ) : (
                      (project.liveUrl || project.detailsUrl || project.repoUrl) && (
                         <Button variant="outline" asChild className="bg-transparent border-white/50 hover:bg-white/10">
                           <Link href={project.liveUrl || project.detailsUrl || project.repoUrl || '#'}>
                             View Project <ArrowRight className="ml-2 h-4 w-4" />
                           </Link>
                         </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2">
        <CarouselPrevious className="static translate-y-0 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
        <CarouselNext className="static translate-y-0 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
      </div>
    </Carousel>
  );
}
