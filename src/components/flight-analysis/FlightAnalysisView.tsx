"use client";

import { Fragment, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Diamond } from "@/components/list-markers";
import { Chart, col, MODE_LABEL, type FlightData } from "./charts";
import type { Block, Color, FlightAnalysis, Tag } from "./types";

/* ---------- inline markup: **bold** and `code` ---------- */

export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? <strong key={i} className="font-semibold text-primary">{p.slice(2, -2)}</strong>
          : p.startsWith("`") ? <code key={i} className="text-[0.8em] bg-secondary px-1 py-0.5 rounded">{p.slice(1, -1)}</code>
            : <Fragment key={i}>{p}</Fragment>)}
    </>
  );
}

/* ---------- status tags ---------- */

const TAG: Record<Tag, { label: string; badge: string; rail: string }> = {
  healthy: { label: "Healthy", badge: "bg-green-500/10 text-green-500 border-green-500/25", rail: "bg-green-500" },
  watch: { label: "Watch", badge: "bg-yellow-500/10 text-yellow-500 border-yellow-500/25", rail: "bg-yellow-500" },
  note: { label: "Note", badge: "bg-sky-500/10 text-sky-500 border-sky-500/25", rail: "bg-sky-500" },
  check: { label: "Check", badge: "bg-sky-500/10 text-sky-500 border-sky-500/25", rail: "bg-sky-500" },
  fix: { label: "Fix habit", badge: "bg-orange-500/10 text-orange-500 border-orange-500/25", rail: "bg-orange-500" },
  issue: { label: "Issue", badge: "bg-red-500/10 text-red-400 border-red-500/25", rail: "bg-red-500" },
};

function TagBadge({ tag, label }: { tag: Tag; label?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide whitespace-nowrap", TAG[tag].badge)}>{label ?? TAG[tag].label}</span>;
}

/* ---------- building blocks ---------- */

const P = ({ text }: { text: string }) => <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-3"><Rich text={text} /></p>;

function DataTable({ headers, rows, note, swatches }: { headers: string[]; rows: string[][]; note?: string; swatches?: Color[] }) {
  return (
    <div className="mb-5">
      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(var(--highlight)/0.08)] border-b border-[hsl(var(--highlight)/0.2)]">
              {headers.map(h => <th key={h} className="text-left px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-wider text-[hsl(var(--highlight-sub))] whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={cn("border-t border-border", i % 2 === 0 ? "bg-card" : "bg-background")}>
                {row.map((cell, j) => (
                  <td key={j} className={cn("px-3 py-2 align-top", j === 0 ? "font-semibold text-primary whitespace-nowrap" : "text-muted-foreground", row.length > 8 && "whitespace-nowrap")}>
                    {j === 0 && swatches?.[i] && <span className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle" style={{ background: col(swatches[i]) }} />}
                    <Rich text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="text-xs text-muted-foreground mt-2"><Rich text={note} /></p>}
    </div>
  );
}

function ChartCard({ title, caption, children }: { title?: string; caption?: string; children: React.ReactNode }) {
  return (
    <figure className="mb-5 rounded-xl border border-border bg-card p-4 shadow-sm">
      {title && <p className="text-sm font-semibold text-primary mb-2">{title}</p>}
      {children}
      {caption && <figcaption className="text-xs text-muted-foreground mt-2 leading-relaxed"><Rich text={caption} /></figcaption>}
    </figure>
  );
}

function RenderBlock({ block, data }: { block: Block; data: FlightData | null }) {
  switch (block.type) {
    case "section":
      return (
        <div className="pt-6">
          <h3 className="text-lg font-bold text-primary mb-3 pb-1.5 border-b border-[hsl(var(--highlight)/0.35)] flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[hsl(var(--highlight))]" />{block.title}
          </h3>
          {block.paras?.map((p, i) => <P key={i} text={p} />)}
        </div>
      );
    case "subheading":
      return <h4 className="text-[0.95rem] font-semibold text-[hsl(var(--highlight-sub))] mt-5 mb-2">{block.text}</h4>;
    case "prose":
      return <>{block.paras.map((p, i) => <P key={i} text={p} />)}</>;
    case "list":
      return (
        <ul className="space-y-2 text-[0.9rem] text-muted-foreground mb-4">
          {block.items.map((it, i) => <li key={i} className="flex gap-2.5 leading-relaxed"><Diamond /><span><Rich text={it} /></span></li>)}
        </ul>
      );
    case "table":
      return <DataTable headers={block.headers} rows={block.rows} note={block.note} swatches={block.swatches} />;
    case "findings":
      return (
        <div className="space-y-3 mb-5">
          {block.items.map((f, i) => (
            <div key={i} className="relative rounded-xl border border-border bg-card pl-5 pr-4 py-3.5 shadow-sm overflow-hidden">
              <span className={cn("absolute left-0 top-0 bottom-0 w-1", TAG[f.tag].rail)} />
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                <p className="text-sm font-semibold text-primary leading-snug"><Rich text={f.title} /></p>
                <TagBadge tag={f.tag} label={f.label} />
              </div>
              {f.body.map((b, j) => <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-1.5 last:mb-0"><Rich text={b} /></p>)}
              {f.next && <p className="text-sm text-muted-foreground leading-relaxed mt-2 pt-2 border-t border-border"><span className="font-semibold text-[hsl(var(--highlight-sub))]">Next: </span><Rich text={f.next} /></p>}
            </div>
          ))}
        </div>
      );
    case "checks":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          {block.items.map(c => (
            <div key={c.title} className="rounded-lg border border-green-500/25 bg-green-500/5 px-3.5 py-2.5">
              <p className="text-sm font-semibold text-primary mb-0.5">{c.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed"><Rich text={c.body} /></p>
            </div>
          ))}
        </div>
      );
    case "callout":
      return (
        <div className="my-5 p-4 rounded-xl bg-[hsl(var(--highlight)/0.06)] border border-[hsl(var(--highlight)/0.3)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--highlight))] mb-1.5">{block.label}</p>
          {block.paras.map((p, i) => <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-1.5 last:mb-0"><Rich text={p} /></p>)}
        </div>
      );
    case "modeLegend":
      return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-muted-foreground">
          {block.modes.map(m => <span key={m} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: col(m), opacity: 0.55 }} />{MODE_LABEL[m]}</span>)}
          {block.note && <span className="italic">{block.note}</span>}
        </div>
      );
    case "legend":
      return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-muted-foreground">
          {block.items.map(it => <span key={it.label} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: col(it.color), opacity: 0.55 }} />{it.label}</span>)}
          {block.note && <span className="italic">{block.note}</span>}
        </div>
      );
    case "chart":
      return (
        <ChartCard title={block.title} caption={block.caption}>
          {data ? <Chart spec={block.chart} data={data} /> : <div className="h-48 flex items-center justify-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /></div>}
        </ChartCard>
      );
  }
}

/* ---------- full report ---------- */

export default function FlightAnalysisView({ analysis, loadData }: { analysis: FlightAnalysis; loadData?: () => Promise<{ default: unknown }> }) {
  const [data, setData] = useState<FlightData | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    (loadData?.() ?? Promise.reject())
      .then(m => live && setData(m.default as unknown as FlightData))
      .catch(() => live && setFailed(true));
    return () => { live = false; };
  }, [analysis.flight, loadData]);

  return (
    <article className="px-5 sm:px-8 py-6">
      <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground mb-3">
        {analysis.meta.map((m, i) => <span key={i} className="flex items-center gap-2">{i > 0 && <span className="text-border">•</span>}{m}</span>)}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-primary leading-tight mb-3">{analysis.headline}</h2>
      {analysis.summary.map((p, i) => <p key={i} className="text-[0.95rem] text-muted-foreground leading-relaxed mb-3 max-w-3xl"><Rich text={p} /></p>)}

      {analysis.stats.length > 0 && (
        <div className={cn("grid grid-cols-2 gap-2.5 my-5", analysis.stats.length % 3 === 0 && analysis.stats.length % 4 !== 0 ? "sm:grid-cols-3" : "sm:grid-cols-4")}>
          {analysis.stats.map(s => (
            <div key={s.label} className="rounded-lg border border-border bg-card px-3 py-2.5">
              <p className="text-lg font-bold text-[hsl(var(--highlight))] leading-tight">{s.value}</p>
              <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {analysis.hero && <RenderBlock block={{ type: "chart", chart: analysis.hero.chart, caption: analysis.hero.caption }} data={data} />}
      {failed && <p className="text-sm text-red-400 mb-4">The chart data couldn&apos;t be loaded.</p>}

      {analysis.blocks.map((b, i) => <RenderBlock key={i} block={b} data={data} />)}

      {analysis.source && <p className="text-xs text-muted-foreground mt-8 pt-4 border-t border-border leading-relaxed"><Rich text={analysis.source} /></p>}
    </article>
  );
}
