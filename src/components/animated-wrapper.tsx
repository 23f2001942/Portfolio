"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function AnimatedWrapper({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
