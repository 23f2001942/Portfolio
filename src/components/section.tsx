import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function Section({
  id,
  title,
  children,
  className,
  icon,
}: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-20", className)}>
      <div className="flex items-center gap-3 mb-8">
        {icon}
        <h2 className="text-3xl font-bold font-headline text-primary">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
