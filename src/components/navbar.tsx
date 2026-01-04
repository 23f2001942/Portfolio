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
    <nav className="flex items-center justify-between py-2 px-8 w-full bg-black/10 backdrop-blur-sm border-b border-white/10 transition-all duration-300">
      
      {/* Brand Name */}
      <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-white/80 transition-colors">
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
                "text-white/70 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="w-px h-5 bg-white/20 hidden md:block" />
        
        {/* Theme Toggle - Wrapped in white text to inherit color */}
        <div className="text-white">
           <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}