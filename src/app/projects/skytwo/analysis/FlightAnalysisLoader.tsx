"use client";

import FlightReport, { type DataRegistry, type ReportRegistry } from "@/components/flight-analysis/FlightReport";

// Each report's text and chart data are their own chunks, loaded only when the dialog opens.
const reports: ReportRegistry = {
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

const data: DataRegistry = {
  1: () => import("./data/flight-1.json"), 2: () => import("./data/flight-2.json"), 3: () => import("./data/flight-3.json"),
  4: () => import("./data/flight-4.json"), 5: () => import("./data/flight-5.json"), 6: () => import("./data/flight-6.json"),
  7: () => import("./data/flight-7.json"), 8: () => import("./data/flight-8.json"), 9: () => import("./data/flight-9.json"),
  10: () => import("./data/flight-10.json"), 11: () => import("./data/flight-11.json"), 12: () => import("./data/flight-12.json"),
};

export default function FlightAnalysisLoader({ flight }: { flight: number }) {
  return <FlightReport flight={flight} reports={reports} data={data} />;
}
