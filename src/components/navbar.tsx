import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const navItems = [
    { name: "About", href: "/about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-transparent text-white">
      <nav className="container mx-auto flex items-center justify-between p-4 md:p-6">
        {/* Brand Name */}
        <Link href="/" className="text-xl font-bold tracking-tight transition-colors hover:opacity-80">
          Shamanthak
        </Link>

        {/* Navigation Links & Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors px-3 py-2 rounded-md",
                  item.href.startsWith("#")
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="w-px h-6 bg-white/20 hidden md:block" />
          
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
