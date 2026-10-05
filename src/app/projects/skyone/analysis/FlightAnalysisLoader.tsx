"use client";

import FlightReport, { type DataRegistry, type ReportRegistry } from "@/components/flight-analysis/FlightReport";

// Only Flights 5–7 have logs; Flights 1–4 were flown before I kept them.
const reports: ReportRegistry = {
  5: () => import("./flights/flight-5"),
  6: () => import("./flights/flight-6"),
  7: () => import("./flights/flight-7"),
};

const data: DataRegistry = {
  5: () => import("./data/flight-5.json"),
  6: () => import("./data/flight-6.json"),
  7: () => import("./data/flight-7.json"),
};

export default function FlightAnalysisLoader({ flight }: { flight: number }) {
  return <FlightReport flight={flight} reports={reports} data={data} />;
}
