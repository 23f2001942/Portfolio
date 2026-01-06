import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const navItems = [
    { name: "About", href: "/about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between py-2 px-8 w-full bg-background/80 backdrop-blur-sm border-b border-border transition-all duration-300">
      
      {/* Brand Name */}
      <Link href="/" className="text-xl font-bold tracking-tight text-primary hover:text-primary/80 transition-colors">
        Shamanthak
      </Link>

      {/* Navigation Links & Toggle */}
      <div className="flex items-center gap-6">
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="w-px h-5 bg-border hidden md:block" />
        
        {/* Theme Toggle */}
        <div>
           <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
