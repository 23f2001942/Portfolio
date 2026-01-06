"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { setTheme, theme } = useTheme()

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/#projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between py-2 px-4 md:px-8 w-full bg-background/80 backdrop-blur-sm border-b border-border transition-all duration-300">
      
      {/* Brand Name */}
      <Link href="/" className="text-xl font-bold tracking-tight text-primary hover:text-primary/80 transition-colors">
        Shamanthak
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-4">
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
        <div className="w-px h-5 bg-border" />
        <ThemeToggle />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle>
                 <Link href="/" className="text-xl font-bold tracking-tight text-primary">
                    Shamanthak
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full py-8">
              <div className="flex flex-col gap-6 flex-grow">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-foreground/80 hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Switch Theme</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="rounded-full w-9 h-9 border border-border text-foreground bg-secondary/50 hover:bg-secondary"
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
