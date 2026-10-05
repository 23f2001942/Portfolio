"use client";

import {
  Area, Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, LineChart, ReferenceArea, ReferenceLine,
  ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import dynamic from "next/dynamic";
import type { ChartSpec, Color, TimeChart } from "./types";
import { useTokenColor } from "./useTokenColor";

/* ---------- shared look ---------- */

export const col = (c: Color) =>
  c === "muted" ? "hsl(var(--muted-foreground))" : c === "ink" ? "hsl(var(--primary))" : `hsl(var(--fl-${c}))`;

export const MODE_COLOR: Record<string, Color> = {
  Stabilize: "stab", AltHold: "alth", Loiter: "loit", RTL: "rtl", Land: "land", AutoTune: "tune",
};
export const MODE_LABEL: Record<string, string> = {
  stab: "Stabilize", alth: "AltHold", loit: "Loiter", rtl: "RTL", land: "Land", tune: "AutoTune",
};
const HOP: Color[] = ["s1", "s2", "s3", "s4", "s5", "s6", "land"];

const GRID = "hsl(var(--border))";
const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 11, tickLine: false } as const;
const axisLabel = (value?: string, angle = 0, position: "insideLeft" | "insideRight" | "insideBottom" = "insideBottom") =>
  value ? { value, angle, position, offset: position === "insideBottom" ? -2 : 12, style: { fill: "hsl(var(--muted-foreground))", fontSize: 11, textAnchor: "middle" } } : undefined;
const legendStyle = { fontSize: 12, color: "hsl(var(--muted-foreground))", paddingTop: 6 };

function TipBox({ active, payload, label, unit = "s" }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: number; unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-card/95 px-2.5 py-1.5 text-xs shadow-md">
      {label !== undefined && <div className="text-muted-foreground mb-0.5">{typeof label === "number" ? `${+label.toFixed(1)} ${unit}` : label}</div>}
      {payload.filter(p => p.name).map(p => (
        <div key={p.name} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="text-primary font-medium ml-auto pl-2">{typeof p.value === "number" ? +p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// Keep each line to a manageable number of points while preserving peaks (min/max per bucket).
function thin(t: number[], y: (number | null)[], max = 1400): { t: number; v: number | null }[] {
  if (t.length <= max) return t.map((x, i) => ({ t: x, v: y[i] }));
  const out: { t: number; v: number | null }[] = [];
  const size = Math.ceil(t.length / (max / 2));
  for (let i = 0; i < t.length; i += size) {
    let lo = i, hi = i;
    for (let j = i; j < Math.min(i + size, t.length); j++) {
      if (y[j] == null) continue;
      if (y[lo] == null || (y[j] as number) < (y[lo] as number)) lo = j;
      if (y[hi] == null || (y[j] as number) > (y[hi] as number)) hi = j;
    }
    for (const k of lo < hi ? [lo, hi] : [hi, lo]) out.push({ t: t[k], v: y[k] });
  }
  return out;
}

/* ---------- data shapes from public/skytwo/analysis/data/flight-<n>.json ---------- */

type SeriesData = Record<string, { t: number[] } & Record<string, (number | null)[]>>;
export interface FlightData {
  series: SeriesData;
  modes?: [number, number, string][];
  armed?: [number, number][];
  airborne?: [number, number][];
  track?: {
    home: [number, number];                 // lat, lng
    segs: { mode: string; pts: [number, number][] }[];
    takeoff: [number, number][]; touchdown: [number, number][];
    fence?: number;
  };
  spectrum?: { f: number[]; roll_pre: number[]; pitch_pre: number[]; roll_post?: number[] };
  // Flight 1-3 extras
  hopsGeo?: [number, number][][];
  hops?: { start: number; end: number; yaw: number; motors: number[]; trk_r: number[]; trk_f: number[]; trk_n: number[]; trk_e: number[] }[];
  params?: [string, number | null][];
  ev?: { n: string; lab: string; need: number; t: number[]; alt: number[]; tho: number[] }[];
  mot?: { n: string; v: number[] }[];
  loi?: { n: string; pts: { x: number; y: number }[] }[];
  [k: string]: unknown;
}

/* ---------- time-series chart ---------- */

function niceStep(span: number) {
  const raw = span / 6, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  return [1, 2, 5, 10].map(m => m * mag).find(s => s >= raw) ?? 10 * mag;
}

function TimeSeries({ spec, data }: { spec: TimeChart; data: FlightData }) {
  const lines = spec.series.map(s => {
    const d = data.series[s.src];
    return { s, pts: d ? thin(d.t, d[s.y] ?? []) : [] };
  });
  // Default range snaps outward to round numbers so the ticks land on clean values.
  const rawMin = Math.min(...lines.map(l => l.pts[0]?.t ?? Infinity));
  const rawMax = Math.max(...lines.map(l => l.pts[l.pts.length - 1]?.t ?? -Infinity));
  const tickStep = niceStep(rawMax - rawMin);
  const xmin = spec.x?.min ?? Math.floor(rawMin / tickStep) * tickStep;
  const xmax = spec.x?.max ?? Math.ceil(rawMax / tickStep) * tickStep;
  const xticks = spec.x ? undefined : Array.from({ length: Math.round((xmax - xmin) / tickStep) + 1 }, (_, i) => xmin + i * tickStep);
  const hasRight = spec.series.some(s => s.right);
  const bands: { a: number; b: number; c: string; o: number }[] = [];
  if (spec.bands === "modes") (data.modes ?? []).forEach(([a, b, m]) => MODE_COLOR[m] && bands.push({ a, b, c: col(MODE_COLOR[m]), o: 0.13 }));
  if (spec.bands === "armed" || spec.bands === "hops") (data.armed ?? []).forEach(([a, b]) => bands.push({ a, b, c: col("s1"), o: 0.08 }));
  if (spec.bands === "hops") (data.hops ?? []).forEach(h => bands.push({ a: h.start, b: h.end, c: col("s2"), o: 0.18 }));
  (spec.shade ?? []).forEach(([a, b]) => bands.push({ a, b, c: col("s5"), o: 0.14 }));

  return (
    <ResponsiveContainer width="100%" height={spec.height ?? 240}>
      <ComposedChart margin={{ top: 8, right: hasRight ? 4 : 12, bottom: 14, left: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis type="number" dataKey="t" domain={[xmin, xmax]} ticks={xticks} allowDataOverflow {...AXIS} tickFormatter={v => `${+(+v).toFixed(1)}`} label={axisLabel(spec.x?.label ?? "Time since boot (s)")} />
        <YAxis yAxisId="l" domain={[spec.y.min ?? "auto", spec.y.max ?? "auto"]} allowDataOverflow width={48} {...AXIS} label={axisLabel(spec.y.label, -90, "insideLeft")} />
        {hasRight && <YAxis yAxisId="r" orientation="right" domain={[spec.y2?.min ?? "auto", spec.y2?.max ?? "auto"]} allowDataOverflow width={48} {...AXIS} label={axisLabel(spec.y2?.label, 90, "insideRight")} />}
        {bands.map((b, i) => <ReferenceArea key={`b${i}`} yAxisId="l" x1={Math.max(b.a, xmin)} x2={Math.min(b.b, xmax)} fill={b.c} fillOpacity={b.o} stroke="none" ifOverflow="hidden" />)}
        {lines.map(({ s, pts }) => s.fill
          ? <Area key={s.label} yAxisId={s.right ? "r" : "l"} data={pts} dataKey="v" name={s.label} type={s.step ? "stepAfter" : "linear"} stroke={col(s.color)} fill={col(s.color)} fillOpacity={0.18} strokeWidth={s.width ?? 1.4} dot={false} isAnimationActive={false} connectNulls />
          : <Line key={s.label} yAxisId={s.right ? "r" : "l"} data={pts} dataKey="v" name={s.label} type={s.step ? "stepAfter" : "linear"} stroke={col(s.color)} strokeWidth={s.width ?? 1.5} strokeDasharray={s.dash ? "5 4" : undefined} dot={false} isAnimationActive={false} connectNulls />)}
        {spec.cycleLabels && ((data.cycles as [number, number][] | undefined) ?? []).map(([a, b], i) => (
          <ReferenceArea key={`c${i}`} yAxisId="l" x1={a} x2={b} fill="none" stroke="none" ifOverflow="hidden"
            label={{ value: String(i + 1), position: "insideTop", fontSize: 12, fontWeight: 600, fill: "hsl(var(--muted-foreground))" }} />
        ))}
        {(spec.refs ?? []).map((r, i) => r.x !== undefined
          ? <ReferenceLine key={`r${i}`} yAxisId="l" x={r.x} stroke={col(r.color ?? "muted")} strokeDasharray="4 4" label={r.label ? { value: r.label, fontSize: 10, fill: col(r.color ?? "muted"), position: "insideTopRight" } : undefined} />
          : <ReferenceLine key={`r${i}`} yAxisId={r.right ? "r" : "l"} y={r.y} stroke={col(r.color ?? "warn")} strokeDasharray="3 3" label={r.label ? { value: r.label, fontSize: 10, fill: col(r.color ?? "warn"), position: "insideTopRight" } : undefined} />)}
        <Tooltip content={<TipBox />} />
        <Legend wrapperStyle={legendStyle} iconType="plainline" verticalAlign="bottom" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ---------- GPS track on a satellite map ---------- */

const TrackMap = dynamic(() => import("./TrackMap"), {
  ssr: false,
  loading: () => <div className="h-[340px] sm:h-[420px] rounded-lg bg-secondary animate-pulse" />,
});

function Track({ data }: { data: FlightData }) {
  const tr = data.track;
  const color = useTokenColor();
  if (!tr) return null;
  const modes = Array.from(new Set(tr.segs.map(s => s.mode)));
  return (
    <div>
      <TrackMap home={tr.home} fence={tr.fence} takeoff={tr.takeoff} touchdown={tr.touchdown}
        lines={tr.segs.map(s => ({ color: color(MODE_COLOR[s.mode] ?? "s1"), pts: s.pts }))} />
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-muted-foreground mt-2">
        {modes.map(m => <span key={m} className="flex items-center gap-1.5"><span className="w-3 h-[3px] rounded" style={{ background: col(MODE_COLOR[m] ?? "muted") }} />{m}</span>)}
        <span className="flex items-center gap-1.5"><svg width="10" height="10"><polygon points="5,0 0,9 10,9" fill={col("loit")} /></svg>Take-off</span>
        <span className="flex items-center gap-1.5"><svg width="10" height="10"><polygon points="5,10 0,1 10,1" fill={col("rtl")} /></svg>Touchdown</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: col("s5") }} />Home</span>
        {tr.fence && <span className="flex items-center gap-1.5"><span className="w-3 border-t-2 border-dashed" style={{ borderColor: col("warn") }} />{tr.fence} m fence</span>}
      </div>
    </div>
  );
}

/* ---------- gyro spectrum ---------- */

// Spectrum values below this are filtered to nothing; clamping keeps the log axis readable.
const FLOOR = 1e-3;

function Spectrum({ data }: { data: FlightData }) {
  const sp = data.spectrum;
  if (!sp) return null;
  const rows = sp.f.map((f, i) => ({ f, pre: sp.roll_pre[i], pitch: sp.pitch_pre[i], post: sp.roll_post?.[i] }))
    .filter(r => r.f >= 4).map(r => ({ ...r, pre: Math.max(r.pre, FLOOR), pitch: Math.max(r.pitch, FLOOR), post: r.post === undefined ? undefined : Math.max(r.post, FLOOR) }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 14, left: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis type="number" dataKey="f" domain={[0, 400]} ticks={[0, 80, 160, 240, 320, 400]} {...AXIS} label={axisLabel("Frequency (Hz)")} />
        <YAxis scale="log" domain={[FLOOR, "auto"]} allowDataOverflow width={48} {...AXIS} tickFormatter={v => (+v).toPrecision(1)} label={axisLabel("Amplitude (°/s)", -90, "insideLeft")} />
        {[80, 160, 240].map(f => <ReferenceLine key={f} x={f} stroke={col("muted")} strokeDasharray="2 4" />)}
        <Line dataKey="pre" name={sp.roll_post ? "Roll, before filter" : "Roll"} stroke={col("s2")} strokeWidth={1.6} dot={false} isAnimationActive={false} />
        <Line dataKey="pitch" name={sp.roll_post ? "Pitch, before filter" : "Pitch"} stroke={col("s1")} strokeWidth={1.2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
        {sp.roll_post && <Line dataKey="post" name="Roll, after notch + gyro filter" stroke={col("s3")} strokeWidth={1.8} dot={false} isAnimationActive={false} />}
        <Tooltip content={<TipBox unit="Hz" />} />
        <Legend wrapperStyle={legendStyle} iconType="plainline" />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ---------- Flight 1 specials ---------- */

function Radar({ data }: { data: FlightData }) {
  const hops = data.hops ?? [];
  const c = 200, sc = 160 / 16;
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-sm h-auto mx-auto" role="img" aria-label="Top-down drift tracks of all seven hops relative to the drone's nose">
      <g stroke={GRID} fill="none">
        {[4, 8, 12, 16].map(r => <circle key={r} cx={c} cy={c} r={r * sc} />)}
        <line x1={c} y1={20} x2={c} y2={380} /><line x1={20} y1={c} x2={380} y2={c} />
      </g>
      <g fill="hsl(var(--muted-foreground))" fontSize="12">
        {[4, 8, 12, 16].map(r => <text key={r} x={c + 4} y={c - r * sc - 3}>{r} m</text>)}
        <text x={c} y={14} textAnchor="middle">nose</text><text x={c} y={396} textAnchor="middle">tail</text>
        <text x={10} y={c - 6}>left</text><text x={390} y={c - 6} textAnchor="end">right</text>
      </g>
      {hops.map((h, i) => {
        const lr = h.trk_r[h.trk_r.length - 1], lf = h.trk_f[h.trk_f.length - 1];
        return (
          <g key={i}>
            <polyline points={h.trk_r.map((r, k) => `${(c + r * sc).toFixed(1)},${(c - h.trk_f[k] * sc).toFixed(1)}`).join(" ")} fill="none" stroke={col(HOP[i])} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={c + lr * sc} cy={c - lf * sc} r="4.5" fill={col(HOP[i])} />
          </g>
        );
      })}
      <g stroke="hsl(var(--primary))" strokeWidth="2.5"><line x1={c - 14} y1={c - 14} x2={c + 14} y2={c + 14} /><line x1={c + 14} y1={c - 14} x2={c - 14} y2={c + 14} /></g>
      <g fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2">{[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y]) => <circle key={`${x}${y}`} cx={c + x * 14} cy={c + y * 14} r="6" />)}</g>
      <path d={`M${c - 5} ${c - 22} L${c} ${c - 30} L${c + 5} ${c - 22}`} fill="none" stroke={col("s2")} strokeWidth="2.5" />
    </svg>
  );
}

export function hopAverages(data: FlightData) {
  const hops = data.hops ?? [];
  return [0, 1, 2, 3].map(k => Math.round(hops.reduce((a, h) => a + h.motors[k], 0) / Math.max(1, hops.length)));
}

function Quad({ data }: { data: FlightData }) {
  const avg = hopAverages(data);
  const pos: Record<number, [number, number]> = { 1: [270, 70], 2: [90, 230], 3: [90, 70], 4: [270, 230] };
  const dir: Record<number, string> = { 1: "CCW", 2: "CCW", 3: "CW", 4: "CW" };
  const name: Record<number, string> = { 1: "front right", 2: "back left", 3: "front left", 4: "back right" };
  const mc: Color[] = ["s1", "s3", "s2", "s6"];
  const lo = Math.min(...avg), hi = Math.max(...avg);
  return (
    <svg viewBox="0 0 360 300" className="w-full max-w-sm h-auto mx-auto" role="img" aria-label="Quad X diagram with average motor PWM">
      <g stroke={GRID} strokeWidth="10" strokeLinecap="round"><line x1="90" y1="70" x2="270" y2="230" /><line x1="270" y1="70" x2="90" y2="230" /></g>
      <rect x="150" y="120" width="60" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
      <path d="M170 138 L180 126 L190 138" fill="none" stroke={col("s2")} strokeWidth="3" />
      {[1, 2, 3, 4].map(m => {
        const [x, y] = pos[m], v = avg[m - 1], t = (v - lo) / (hi - lo || 1), cc = col(mc[m - 1]);
        return (
          <g key={m}>
            <circle cx={x} cy={y} r={38 + t * 10} fill={cc} fillOpacity={0.14 + t * 0.28} stroke={cc} strokeWidth="2" />
            <text x={x} y={y - 4} textAnchor="middle" fontWeight="700" fontSize="22" fill="hsl(var(--primary))">{v}</text>
            <text x={x} y={y + 15} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">M{m} {dir[m]}</text>
            <text x={x} y={y + (y < 150 ? -56 : 66)} textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">{name[m]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Pairs({ data }: { data: FlightData }) {
  const a = hopAverages(data), p = (x: number, y: number) => a[x - 1] + a[y - 1];
  const rows = [
    { k: "Yaw: CCW 1+2 vs CW 3+4", first: p(1, 2), second: p(3, 4) },
    { k: "Roll: left 2+3 vs right 1+4", first: p(2, 3), second: p(1, 4) },
    { k: "Pitch: back 2+4 vs front 1+3", first: p(2, 4), second: p(1, 3) },
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="k" {...AXIS} interval={0} tick={{ fontSize: 10 }} />
        <YAxis domain={[3100, 3400]} allowDataOverflow width={48} {...AXIS} label={axisLabel("Combined PWM (µs)", -90, "insideLeft")} />
        <Bar dataKey="first" name="First of pair" fill={col("s1")} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        <Bar dataKey="second" name="Second of pair" fill={col("s2")} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        <Tooltip content={<TipBox />} cursor={{ fill: "hsl(var(--secondary))" }} />
        <Legend wrapperStyle={legendStyle} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Earth({ data }: { data: FlightData }) {
  const color = useTokenColor();
  const hops = data.hops ?? [], geo = data.hopsGeo ?? [];
  // Short dashed-style heading line from each hop's lift-off point, 3 m along the nose direction.
  const nose = (start: [number, number], yaw: number): [number, number][] => {
    const a = (yaw * Math.PI) / 180, mlng = 111320 * Math.cos((start[0] * Math.PI) / 180);
    return [start, [start[0] + (3 * Math.cos(a)) / 110574, start[1] + (3 * Math.sin(a)) / mlng]];
  };
  return (
    <div>
      <TrackMap
        lines={[
          ...geo.map((pts, i) => ({ color: color(HOP[i]), pts })),
          ...geo.map((pts, i) => ({ color: "#ffffff", pts: nose(pts[0], hops[i]?.yaw ?? 0) })),
        ]}
        ends={geo.map((pts, i) => ({ pt: pts[pts.length - 1], color: color(HOP[i]) }))} />
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-muted-foreground mt-2">
        {geo.map((_, i) => <span key={i} className="flex items-center gap-1.5"><span className="w-3 h-[3px] rounded" style={{ background: col(HOP[i]) }} />Hop {i + 1}</span>)}
        <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] rounded bg-white border border-border" />Nose direction</span>
      </div>
    </div>
  );
}

function HopSpeed({ data }: { data: FlightData }) {
  const hops = data.hops ?? [];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart margin={{ top: 8, right: 12, bottom: 14, left: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis type="number" dataKey="x" domain={[0, "auto"]} {...AXIS} label={axisLabel("Seconds into hop")} />
        <YAxis width={40} {...AXIS} label={axisLabel("Ground speed (m/s)", -90, "insideLeft")} />
        {hops.map((h, i) => {
          const dt = (h.end - h.start) / (h.trk_n.length - 1);
          const pts = h.trk_n.map((n, k) => k === 0 ? { x: 0, y: 0 } : { x: +(k * dt).toFixed(2), y: +(Math.hypot(n - h.trk_n[k - 1], h.trk_e[k] - h.trk_e[k - 1]) / dt).toFixed(2) });
          return <Line key={i} data={pts} dataKey="y" name={`Hop ${i + 1}`} stroke={col(HOP[i])} strokeWidth={1.8} dot={false} isAnimationActive={false} />;
        })}
        <Tooltip content={<TipBox />} />
        <Legend wrapperStyle={legendStyle} iconType="plainline" />
      </LineChart>
    </ResponsiveContainer>
  );
}

function Params({ data }: { data: FlightData }) {
  const flag = new Set(["BATT_MONITOR", "BATT_VOLT_MULT", "MOT_THST_HOVER", "MOT_HOVER_LEARN", "INS_ACC2_ID", "COMPASS_USE2", "FLTMODE1", "FLTMODE2", "FLTMODE3", "FLTMODE4", "FLTMODE5", "FLTMODE6", "BATT_LOW_VOLT", "BATT_VOLT_PIN", "BATT_CURR_PIN"]);
  const modes: Record<number, string> = { 0: "Stabilize", 2: "AltHold", 5: "Loiter", 6: "RTL", 9: "Land" };
  const rows: [string, string][] = (data.params ?? []).filter(p => p[1] !== null).map(([k, v]) => {
    const n = v as number;
    let s = Math.abs(n) < 1 && n !== 0 ? String(+n.toFixed(4)) : String(+n.toFixed(2));
    if (k.startsWith("FLTMODE") && k !== "FLTMODE_CH") s += ` (${modes[n] ?? "?"})`;
    return [k, s];
  });
  rows.push(["BATT_VOLT_PIN", "13"], ["BATT_CURR_PIN", "12"], ["BATT_FS_LOW_ACT", "2 (RTL)"]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 rounded-xl border border-border overflow-hidden">
      {rows.map(([k, s]) => (
        <div key={k} className={`flex justify-between gap-3 px-3 py-1.5 text-xs border-b border-border ${flag.has(k) ? "bg-[hsl(var(--fl-s5)/0.12)]" : ""}`}>
          <code className="text-primary">{k}</code><span className="text-muted-foreground">{s}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Flight 3 specials ---------- */

function Landings({ data }: { data: FlightData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {(data.ev ?? []).map(e => {
        const rows = e.t.map((t, i) => ({ t, alt: e.alt[i], tho: e.tho[i] }));
        const tmax = Math.ceil(Math.max(...e.t));
        return (
          <div key={e.n} className="rounded-lg border border-border bg-background/50 p-3">
            <p className="text-sm font-semibold text-primary">{e.n.replace("Flight", "Cycle")}</p>
            <p className="text-xs text-muted-foreground mb-1">{e.lab}</p>
            <ResponsiveContainer width="100%" height={150}>
              <ComposedChart data={rows} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" dataKey="t" domain={[-3, tmax]} {...AXIS} tickFormatter={v => `${v > 0 ? "+" : ""}${v}s`} />
                <YAxis yAxisId="l" domain={[0, 9]} ticks={[0, 3, 6, 9]} width={40} {...AXIS} tickFormatter={v => `${v} m`} />
                <YAxis yAxisId="r" orientation="right" domain={[0, 0.6]} ticks={[0, 0.2, 0.4, 0.6]} width={30} {...AXIS} />
                <Area yAxisId="r" dataKey="tho" name="Thrust" stroke={col("s2")} fill={col("s2")} fillOpacity={0.18} strokeWidth={1.2} dot={false} isAnimationActive={false} />
                <Line yAxisId="l" dataKey="alt" name="Altitude" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
                <ReferenceLine yAxisId="l" x={0} stroke={col("muted")} strokeDasharray="4 4" />
                <ReferenceLine yAxisId="r" y={e.need} stroke={col("loit")} strokeDasharray="2 3" />
                <Tooltip content={<TipBox />} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

function ThrottleCurve() {
  const curve = (m: number) => {
    const ex = Math.min(1, Math.max(-0.5, -(m - 0.5) / 0.375));
    const pts: { x: number; y: number }[] = [];
    for (let s = 0; s <= 1.0001; s += 0.02) pts.push({ x: +(s * 100).toFixed(0), y: s * (1 - ex) + ex * s * s * s });
    return pts;
  };
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart margin={{ top: 8, right: 12, bottom: 14, left: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis type="number" dataKey="x" domain={[0, 100]} {...AXIS} label={axisLabel("Throttle stick (%)")} />
        <YAxis domain={[0, 1]} width={40} {...AXIS} label={axisLabel("Thrust", -90, "insideLeft")} />
        <ReferenceArea y1={0.33} y2={0.42} fill={col("loit")} fillOpacity={0.16} stroke="none" />
        <ReferenceLine x={50} stroke={col("muted")} strokeDasharray="4 4" />
        <Line data={curve(0.25)} dataKey="y" name="MOT_THST_HOVER 0.25 (today)" stroke={col("s2")} strokeWidth={2.2} dot={false} isAnimationActive={false} />
        <Line data={curve(0.38)} dataKey="y" name="MOT_THST_HOVER 0.38 (suggested)" stroke={col("loit")} strokeWidth={2.2} dot={false} isAnimationActive={false} />
        <Tooltip content={<TipBox unit="%" />} />
        <Legend wrapperStyle={legendStyle} iconType="plainline" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function MotorBars({ data }: { data: FlightData }) {
  const labels = ["M1 front right", "M2 back left", "M3 front left", "M4 back right"];
  const m = data.mot ?? [];
  const rows = labels.map((k, i) => Object.fromEntries([["k", k], ...m.map(s => [s.n.replace(/^F(\d)/, "Cycle $1"), s.v[i]])]));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="k" {...AXIS} interval={0} tick={{ fontSize: 10 }} />
        <YAxis domain={[1500, 1700]} allowDataOverflow width={48} {...AXIS} label={axisLabel("PWM (µs)", -90, "insideLeft")} />
        {m.map((s, i) => <Bar key={s.n} dataKey={s.n.replace(/^F(\d)/, "Cycle $1")} fill={col(i ? "loit" : "stab")} radius={[4, 4, 0, 0]} isAnimationActive={false} />)}
        <Tooltip content={<TipBox />} cursor={{ fill: "hsl(var(--secondary))" }} />
        <Legend wrapperStyle={legendStyle} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LoiterScatter({ data }: { data: FlightData }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 8, right: 12, bottom: 14, left: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" domain={[-0.6, 0.6]} {...AXIS} label={axisLabel("East (m)")} />
        <YAxis type="number" dataKey="y" domain={[-0.6, 0.6]} width={40} {...AXIS} label={axisLabel("North (m)", -90, "insideLeft")} />
        {(data.loi ?? []).map((l, i) => <Scatter key={l.n} name={l.n.replace("Flight", "Cycle")} data={l.pts} fill={col(i ? "loit" : "alth")} fillOpacity={0.6} shape={(p: { cx?: number; cy?: number; fill?: string }) => <circle cx={p.cx} cy={p.cy} r={2.4} fill={p.fill} fillOpacity={0.6} />} isAnimationActive={false} />)}
        <Legend wrapperStyle={legendStyle} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

/* ---------- dispatcher ---------- */

export function Chart({ spec, data }: { spec: ChartSpec; data: FlightData }) {
  switch (spec.kind) {
    case "time": return <TimeSeries spec={spec} data={data} />;
    case "track": return <Track data={data} />;
    case "spectrum": return <Spectrum data={data} />;
    case "radar": return <Radar data={data} />;
    case "quad": return <Quad data={data} />;
    case "pairs": return <Pairs data={data} />;
    case "earth": return <Earth data={data} />;
    case "hopSpeed": return <HopSpeed data={data} />;
    case "params": return <Params data={data} />;
    case "landings": return <Landings data={data} />;
    case "throttleCurve": return <ThrottleCurve />;
    case "motorBars": return <MotorBars data={data} />;
    case "loiterScatter": return <LoiterScatter data={data} />;
  }
}
