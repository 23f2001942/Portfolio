import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode; // Kept for type safety, but will not be rendered
  size?: 'default' | 'sm';
}

export function Section({
  id,
  title,
  children,
  className,
  icon,
  size = 'default',
}: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-20", className)}>
      <div className="flex items-center gap-3 mb-8">
        {/* The icon is no longer rendered */}
        <h2 className={cn(
          "font-bold font-headline text-primary",
          size === 'sm' ? "text-xl" : "text-3xl"
        )}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
