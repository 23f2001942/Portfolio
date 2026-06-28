"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Register the <model-viewer> custom element
import "@google/model-viewer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          "shadow-softness"?: string;
          "environment-image"?: string;
          exposure?: string;
          style?: React.CSSProperties;
          "loading"?: string;
          "rotation-per-second"?: string;
        },
        HTMLElement
      >;
    }
  }
}

const parts = [
  { id: "base",         label: "Base" },
  { id: "waist",        label: "Waist" },
  { id: "arm_1",        label: "Arm Segment 1" },
  { id: "arm_2",        label: "Arm Segment 2" },
  { id: "arm_3",        label: "Arm Segment 3" },
  { id: "gripperbase",  label: "Gripper Base" },
  { id: "gripperlink",  label: "Gripper Link" },
  { id: "gripper",      label: "Gripper" },
  { id: "motorgear",    label: "Motor Gear" },
  { id: "nonmotorgear", label: "Non-Motor Gear" },
];

export default function DumEModelViewer() {
  const [selected, setSelected] = useState(parts[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full aspect-[4/3] md:aspect-[16/9] rounded-xl border border-border bg-[hsl(216,28%,8%)] flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Loading 3D viewer...</p>
      </div>
    );
  }

  return (
    <div>
      {/* 3D Canvas */}
      <div className="w-full aspect-[4/3] md:aspect-[16/9] rounded-xl overflow-hidden border border-border bg-[hsl(216,28%,8%)] relative">
        <model-viewer
          key={selected.id}
          src={`/models/dum-e/${selected.id}.glb`}
          alt={`Dum-E ${selected.label}`}
          camera-controls
          auto-rotate
          rotation-per-second="30deg"
          shadow-intensity="1"
          shadow-softness="0.8"
          exposure="1.1"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
        />
        <p className="absolute bottom-3 right-4 text-[0.65rem] text-white/30 pointer-events-none select-none">
          drag to rotate · scroll to zoom
        </p>
      </div>

      {/* Part Selector */}
      <div className="flex flex-wrap gap-2 mt-4">
        {parts.map(part => (
          <button
            key={part.id}
            onClick={() => setSelected(part)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm transition-all border",
              selected.id === part.id
                ? "bg-[hsl(var(--highlight)/0.12)] text-[hsl(var(--highlight))] border-[hsl(var(--highlight)/0.4)] font-medium"
                : "text-muted-foreground border-border hover:border-[hsl(var(--highlight)/0.3)] hover:text-primary"
            )}
          >
            {part.label}
          </button>
        ))}
      </div>
    </div>
  );
}
