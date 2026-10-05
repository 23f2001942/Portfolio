import { cn } from "@/lib/utils";

// Small rotated-square bullet for plain lists. Sits on the first text line.
export function Diamond({ muted = false, className }: { muted?: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("mt-[0.45em] w-1.5 h-1.5 rotate-45 rounded-[1px] flex-shrink-0",
      muted ? "bg-muted-foreground/60" : "bg-[hsl(var(--highlight))]", className)} />
  );
}

// Bull's-eye marker used for the "What I Learned" lists.
export function BullsEye({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("mt-[0.2em] w-4 h-4 rounded-full border-2 border-[hsl(var(--highlight))] flex items-center justify-center flex-shrink-0", className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--highlight))]" />
    </span>
  );
}

// Spec-sheet row: label column on the left, content on the right. Consecutive rows get a divider.
export function SpecRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="spec-row grid grid-cols-1 sm:grid-cols-[10rem_minmax(0,1fr)] gap-x-5 gap-y-1 py-3 [&+.spec-row]:border-t [&+.spec-row]:border-border">
      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[hsl(var(--highlight-sub))] leading-snug sm:pt-[0.2em]">{title}</span>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
