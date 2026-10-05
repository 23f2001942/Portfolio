"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import FlightAnalysisView from "./FlightAnalysisView";
import type { FlightAnalysis } from "./types";

// Each report's text is its own chunk, loaded only when its dialog opens.
const reports: Record<number, () => Promise<{ default: FlightAnalysis }>> = {
  1: () => import("./flights/flight-1"),
  2: () => import("./flights/flight-2"),
  3: () => import("./flights/flight-3"),
  4: () => import("./flights/flight-4"),
  5: () => import("./flights/flight-5"),
  6: () => import("./flights/flight-6"),
  7: () => import("./flights/flight-7"),
  8: () => import("./flights/flight-8"),
  9: () => import("./flights/flight-9"),
  10: () => import("./flights/flight-10"),
  11: () => import("./flights/flight-11"),
  12: () => import("./flights/flight-12"),
};

export default function FlightAnalysisLoader({ flight }: { flight: number }) {
  const [analysis, setAnalysis] = useState<FlightAnalysis | null>(null);
  useEffect(() => {
    let live = true;
    reports[flight]?.().then(m => live && setAnalysis(m.default));
    return () => { live = false; };
  }, [flight]);
  if (!analysis) return <div className="h-full flex items-center justify-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  return <FlightAnalysisView analysis={analysis} />;
}
