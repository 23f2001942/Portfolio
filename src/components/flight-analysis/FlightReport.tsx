"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import FlightAnalysisView from "./FlightAnalysisView";
import type { FlightAnalysis } from "./types";

export type ReportRegistry = Record<number, () => Promise<{ default: FlightAnalysis }>>;
export type DataRegistry = Record<number, () => Promise<{ default: unknown }>>;

// Loads one flight's report text (its own chunk) and hands the matching chart-data loader to the view.
export default function FlightReport({ flight, reports, data }: { flight: number; reports: ReportRegistry; data: DataRegistry }) {
  const [analysis, setAnalysis] = useState<FlightAnalysis | null>(null);
  useEffect(() => {
    let live = true;
    reports[flight]?.().then(m => live && setAnalysis(m.default));
    return () => { live = false; };
  }, [flight, reports]);
  if (!analysis) return <div className="h-full flex items-center justify-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  return <FlightAnalysisView analysis={analysis} loadData={data[flight]} />;
}
