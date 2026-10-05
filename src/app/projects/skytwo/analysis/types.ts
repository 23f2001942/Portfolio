// Shared shape for every SkyTwo flight's detailed log analysis.
// Text fields accept light markup: **bold** and `code`.

export type Tag = "healthy" | "watch" | "note" | "fix" | "issue" | "check";

export type Color =
  | "s1" | "s2" | "s3" | "s4" | "s5" | "s6"
  | "stab" | "alth" | "loit" | "rtl" | "land" | "tune"
  | "warn" | "muted" | "ink";

export interface Series {
  src: string;          // dataset name in the flight's JSON `series`
  y: string;            // field within that dataset
  label: string;
  color: Color;
  right?: boolean;      // plot on the right-hand axis
  dash?: boolean;
  width?: number;
  step?: boolean;
  fill?: boolean;
}

export interface Axis { label?: string; min?: number; max?: number }

export interface RefLine { y?: number; x?: number; right?: boolean; color?: Color; label?: string }

export type Bands = "modes" | "armed" | "hops" | "none";

export interface TimeChart {
  kind: "time";
  series: Series[];
  x?: Axis;
  y: Axis;
  y2?: Axis;
  bands?: Bands;
  shade?: [number, number][];   // extra highlighted windows
  cycleLabels?: boolean;        // number each arm cycle (data.cycles) above the trace
  refs?: RefLine[];
  height?: number;
}

// Charts that need bespoke drawing; each reads its data from the flight's JSON.
export type SpecialChart =
  | { kind: "track" }                 // GPS path, coloured by mode
  | { kind: "spectrum" }              // gyro FFT before/after the notch
  | { kind: "radar" }                 // Flight 1: hop drift relative to the nose
  | { kind: "quad" }                  // Flight 1: average PWM per motor on a quad diagram
  | { kind: "pairs" }                 // Flight 1: paired motor sums
  | { kind: "earth" }                 // Flight 1: hop tracks over the ground
  | { kind: "hopSpeed" }              // Flight 1: ground speed per hop
  | { kind: "landings" }              // Flight 3: small multiples of the four drops
  | { kind: "throttleCurve" }         // Flight 3: Stabilize throttle curve
  | { kind: "motorBars" }             // Flight 3: average motor output in Loiter
  | { kind: "loiterScatter" }         // Flight 3: Loiter position scatter
  | { kind: "params" };               // Flight 1: parameter snapshot grid

export type ChartSpec = TimeChart | SpecialChart;

export type Block =
  | { type: "section"; title: string; paras?: string[] }
  | { type: "subheading"; text: string }
  | { type: "prose"; paras: string[] }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][]; note?: string; swatches?: Color[] }
  | { type: "findings"; items: Finding[] }
  | { type: "checks"; items: { title: string; body: string }[] }
  | { type: "callout"; label: string; paras: string[] }
  | { type: "chart"; title?: string; caption?: string; chart: ChartSpec }
  | { type: "modeLegend"; modes: Color[]; note?: string };

export interface Finding {
  tag: Tag;
  label?: string;       // overrides the badge text, e.g. "High, safety"
  title: string;
  body: string[];
  next?: string;
}

export interface FlightAnalysis {
  flight: number;
  meta: string[];       // date, time, firmware, log length...
  headline: string;
  summary: string[];
  stats: { value: string; label: string }[];
  hero?: { chart: ChartSpec; caption?: string };
  blocks: Block[];
  source?: string;
}
