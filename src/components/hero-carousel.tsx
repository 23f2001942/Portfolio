"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Button } from "./ui/button";
import Autoplay from "embla-carousel-autoplay";
import { Card } from "./ui/card";
import { portfolioData } from "@/lib/portfolio-data";

const carouselItems = [
  {
    image: "welcome",
    title: "Welcome to My Digital Portfolio",
    description:
      "Discover my journey in aerospace, AI, and web development. Explore my projects, skills, and professional experience.",
    buttonText: "Learn More About Me",
    buttonLink: "/about",
  },
  {
    image: "education",
    title: "A Foundation of Excellence",
    description:
      "Explore my academic background, from my dual degree in Mechanical Engineering to my ongoing studies in AI and Data Science.",
    buttonText: "View My Education",
    buttonLink: "/education",
  },
  {
    image: "experience",
    title: "Hands-On Innovation",
    description:
      "See how I apply my skills in real-world scenarios, from building autonomous drones to contributing to a Mars Rover project.",
    buttonText: "Explore My Experience",
    buttonLink: "/experience",
  },
  {
    image: "hardware-projects",
    title: "Hardware Projects",
    description:
      "From autonomous drones to custom RC transmitters, browse my collection of hands-on engineering and electronics projects.",
    buttonText: "See My Hardware Projects",
    buttonLink: "/projects#hardware-projects",
  },
  {
    image: "software-projects",
    title: "Software Projects",
    description:
      "Explore my full-stack web applications, showcasing my skills in Python, Vue.js, and database management.",
    buttonText: "See My Software Projects",
    buttonLink: "/projects#software-projects",
  },
];

export default function HeroCarousel() {
  return (
    <Carousel
      className="w-full"
      plugins={[Autoplay({ delay: 7000, stopOnInteraction: true })]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {carouselItems.map((item, index) => {
          const slideImage = getPlaceholderImage(item.image);
          return (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <div className="relative aspect-[16/7] w-full">
                  {slideImage && (
                    <Image
                      src={slideImage.imageUrl}
                      alt={slideImage.description}
                      fill
                      className="object-cover"
                      data-ai-hint={slideImage.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">
                      {item.title}
                    </h2>
                    {index === 0 && (
                      <p className="text-xl md:text-2xl font-semibold text-foreground/80 mb-4">
                        {portfolioData.title}
                      </p>
                    )}
                    <p className="text-lg md:text-xl max-w-3xl mb-8">
                      {item.description}
                    </p>
                    <Button asChild size="lg">
                      <Link href={item.buttonLink}>{item.buttonText}</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
    </Carousel>
  );
}
