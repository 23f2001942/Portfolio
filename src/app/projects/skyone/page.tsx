"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2, Circle, ShieldAlert, Wrench, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { Diamond, BullsEye, SpecRow } from "@/components/list-markers";

const sections = [
  { id: "overview",   label: "Overview" },
  { id: "components", label: "Components & BOM" },
  { id: "system",     label: "System Overview" },
  { id: "assembly",   label: "Assembly" },
  { id: "config",     label: "Configuration & Calibration" },
  { id: "flights",    label: "Test Flights" },
  { id: "results",    label: "Results & Status" },
  { id: "learned",    label: "What I Learned" },
];

const sectionIds = sections.map(s => s.id);

const timelineRows = [
  ["June 2025",          "Parts bought, assembly started"],
  ["5 July 2025",        "First flight (house terrace)"],
  ["July – Sept 2025",   "Four flight sessions, no stable flight"],
  ["Late 2025 – 2026",   "Stepped back to learn UAVs properly (NPTEL course, YouTube)"],
  ["September 2026",     "Work restarted: bench debugging, then Flights 5–7"],
  ["October 2026",       "Grounded to fix reliability issues"],
];

const bomRows = [
  ["Frame",             "F450 Quadcopter Frame",                          "450 mm class, power distribution board built into the bottom plate", "Airframe; distributes battery power to the ESCs"],
  ["Motors",            "A2212 BLDC (×4)",                                "1400KV",                              "Drive the propellers"],
  ["ESCs",              "Simonk 30A (×4)",                                "30 A",                                "Control motor speed from flight controller signals"],
  ["Propellers",        "1045 (2 CW, 2 CCW)",                             "10 × 4.5 in",                         "Produce thrust"],
  ["Flight controller", "APM 2.8",                                        "Built-in compass",                    "Stabilisation and flight control"],
  ["Power module",      "5.3V 3A APM Power Module",                       "XT60, 5.3 V / 3 A output",            "Powers the APM; senses battery voltage and current"],
  ["Telemetry",         "3DR Radio Telemetry Kit",                        "433 MHz, 500 mW",                     "Wireless link to the ground control software on my laptop"],
  ["Transmitter",       "RadioMaster Pocket",                             "CC2500",                              "Manual control"],
  ["Receiver",          "RadioMaster R88 V2",                             "8 channels",                          "Receives transmitter commands for the APM"],
  ["Battery",           "Pro-Range LiPo",                                 "11.1 V, 2200 mAh, 3S, 40C",           "Main power source"],
  ["FC mount",          "Anti-vibration shock absorber plate",            "—",                                   "Isolates the APM from frame vibration"],
  ["Electronics plate", "Acrylic sheet, cut by me",                       "Cut to the dimensions needed",        "Holds the APM mount, R88 and telemetry radio"],
  ["Connectors",        "SafeConnect T-connector pigtails (14 AWG), XT60 male", "—",                             "ESC and battery power connections"],
  ["Cable",             "USB to Micro USB, 1 m",                          "—",                                   "Connects the APM to a computer for setup"],
  ["Charger",           "IMAX B6",                                        "80 W, 6 A, 1–6 cells",                "LiPo charging"],
  ["Mounting",          "Velcro battery and ESC straps",                  "—",                                   "Hold the battery and ESCs in place"],
];

const motorRows = [
  ["1", "Front Right", "CCW", "Red"],
  ["2", "Back Left",   "CCW", "Red"],
  ["3", "Front Left",  "CW",  "White"],
  ["4", "Back Right",  "CW",  "White"],
];

const flightRows = [
  ["1", "Jul 5, 2025",  "House terrace",                       "First flight of the first build",       "Uncontrolled yaw spin",                                   "Resolved"],
  ["2", "Jul 13, 2025", "BITS Hyderabad, New Football Ground", "Basic stable flight",                   "9 takeoffs; 10th crashed in a strong gust",               "Issue found"],
  ["3", "Aug 8, 2025",  "BITS Hyderabad, New Football Ground", "Try AltHold and Land",                  "Overcorrected; crashed after a dragonfly hit a prop",     "Issue found"],
  ["4", "Sep 7, 2025",  "BITS Hyderabad, New Football Ground", "Flight by my brother",                  "Lost control at height, crashed",                         "Issue found"],
  ["—", "Sep 2026",     "Bench (props off)",                   "Motor output checks",                   "Output 1 cutting out; tilted FC; output cap",             "Resolved"],
  ["5", "Sep 27, 2026", "BITS Hyderabad, New Football Ground", "First flight after the restart",        "12 takeoffs, then a crash after switching to AltHold",    "Resolved"],
  ["6", "Sep 29, 2026", "BITS Hyderabad, New Football Ground", "Stabilize-only flight after repairs",   "Heavy wobble, motors \"choking\"",                        "Not confirmed"],
  ["7", "Sep 30, 2026", "BITS Hyderabad, New Football Ground", "Stabilize flight",                      "Signal loss, flew off, flipped",                          "Unresolved"],
];

const workingRows = [
  "All four motors and ESCs run cleanly through the full throttle range on the bench (past 2000 PWM)",
  "Accelerometer, compass, radio and ESC calibrations are done",
  "Motor layout and prop directions are correct",
  "Flight modes (Stabilize, Land) and the throttle failsafe (Land) are set up; all arming checks enabled",
  "The power module powers the APM, and current monitoring works",
  "Telemetry link to the laptop works; flights are logged with IMU and RC-output data",
  "SkyOne lifts off and flies in Stabilize (best session: Flight 5, 12 takeoffs on one battery)",
];

type BadgeKind = "done" | "progress" | "open";

function StatusBadge({ badge, label }: { badge: BadgeKind; label?: string }) {
  if (badge === "done") return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">{label ?? "Resolved"}</Badge>;
  if (badge === "open") return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">{label ?? "Unresolved"}</Badge>;
  return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">{label ?? "In Progress"}</Badge>;
}

function SectionHeading({ id, title, badge, badgeLabel }: { id: string; title: string; badge?: BadgeKind; badgeLabel?: string }) {
  return (
    <h2 id={id} className="text-2xl font-bold text-primary mb-6 pb-2 border-b-2 border-[hsl(var(--highlight))] scroll-mt-24 flex flex-wrap items-center gap-3">
      <span className="w-1 h-6 rounded-full bg-[hsl(var(--highlight))] inline-block flex-shrink-0" />
      {title}
      {badge && <StatusBadge badge={badge} label={badgeLabel} />}
    </h2>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border mb-6 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[hsl(var(--highlight)/0.08)] border-b border-[hsl(var(--highlight)/0.2)]">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--highlight-sub))]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={cn("border-t border-border transition-colors hover:bg-[hsl(var(--highlight)/0.04)]", i % 2 === 0 ? "bg-card" : "bg-background")}>
              {row.map((cell, j) => (
                <td key={j} className={cn("px-4 py-2.5", j === 0 ? "font-semibold text-primary" : "text-muted-foreground")}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-[hsl(var(--highlight-sub))] mt-8 mb-2">{children}</h3>;
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-3">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="text-xs bg-secondary px-1 py-0.5 rounded">{children}</code>;
}

function Challenge({ title, children }: { title: string; children: React.ReactNode }) {
  return <SpecRow title={title}>{children}</SpecRow>;
}

function NextBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="my-8 p-4 rounded-lg bg-[hsl(var(--highlight)/0.06)] border border-[hsl(var(--highlight)/0.3)] text-sm text-muted-foreground flex gap-3">
      <div><span className="font-semibold text-[hsl(var(--highlight))]">{label} </span>{children}</div>
    </div>
  );
}

function ArchNode({ title, subtitle, items, accent = false }: { title: string; subtitle?: string; items: string[]; accent?: boolean }) {
  return (
    <div className={cn("rounded-lg border p-4 w-full", accent ? "border-[hsl(var(--highlight)/0.5)] bg-[hsl(var(--highlight)/0.06)]" : "border-border bg-card")}>
      <p className={cn("text-xs font-bold uppercase tracking-widest mb-0.5", accent ? "text-[hsl(var(--highlight))]" : "text-[hsl(var(--highlight-sub))]")}>{title}</p>
      {subtitle && <p className="text-[0.7rem] text-muted-foreground mb-2">{subtitle}</p>}
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
            <Diamond muted={!accent} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowDown({ label, dashed = false }: { label: string; dashed?: boolean }) {
  return (
    <div className="flex flex-col items-center py-1 gap-0.5">
      <div className={cn("w-px h-4", dashed ? "border-l border-dashed border-muted-foreground/50" : "bg-border")} />
      <span className="text-[0.65rem] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border text-center">{label}</span>
      <div className={cn("w-px h-4", dashed ? "border-l border-dashed border-muted-foreground/50" : "bg-border")} />
      <svg width="10" height="6" viewBox="0 0 10 6" className="text-muted-foreground fill-current"><path d="M5 6L0 0h10z" /></svg>
    </div>
  );
}

function Figure({ src, alt, caption, width, height, className, unoptimized }: { src: string; alt: string; caption: string; width: number; height: number; className?: string; unoptimized?: boolean }) {
  return (
    <figure className={cn("mb-6", className)}>
      <div className="rounded-xl border border-border overflow-hidden bg-white shadow-sm">
        <Image src={src} alt={alt} width={width} height={height} unoptimized={unoptimized} className="w-full h-auto" />
      </div>
      <figcaption className="text-xs text-muted-foreground mt-2 text-center">{caption}</figcaption>
    </figure>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
      {items.map(item => (
        <li key={item} className="flex gap-2">
          <Diamond />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Note({ kind, children }: { kind: "skill" | "gotcha"; children: React.ReactNode }) {
  const gotcha = kind === "gotcha";
  return (
    <div className={cn("mt-3 p-3 rounded-lg border text-sm text-muted-foreground flex gap-2.5",
      gotcha ? "bg-red-500/5 border-red-500/25" : "bg-[hsl(var(--highlight-sub)/0.06)] border-[hsl(var(--highlight-sub)/0.3)]")}>
      {gotcha
        ? <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        : <Wrench className="w-4 h-4 text-[hsl(var(--highlight-sub))] flex-shrink-0 mt-0.5" />}
      <div>
        <span className={cn("font-semibold", gotcha ? "text-red-400" : "text-[hsl(var(--highlight-sub))]")}>{gotcha ? "Gotcha: " : "Skill: "}</span>
        {children}
      </div>
    </div>
  );
}

function AssemblyStep({ img, title, alt, width, height, caption, children }: { img: string; title: string; alt: string; width: number; height: number; caption: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 items-start mb-8">
      <Figure src={`/skyone/assembly/${img}.jpg`} alt={alt} width={width} height={height} caption={caption} className="mb-0" />
      <div>
        <p className="text-sm font-semibold text-primary mb-2">
          <span className="text-[hsl(var(--highlight))] font-mono mr-2">{img}</span>{title}
        </p>
        <div className="text-[0.9rem] text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function FlightCard({ title, badge, badgeLabel, rows, children }: { title: string; badge: BadgeKind; badgeLabel: string; rows: [string, React.ReactNode][]; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h3 className="text-base font-semibold text-[hsl(var(--highlight-sub))]">{title}</h3>
        <StatusBadge badge={badge} label={badgeLabel} />
      </div>
      {rows.map(([label, body]) => (
        <Challenge key={label} title={label}>{body}</Challenge>
      ))}
      {children}
    </div>
  );
}

export default function SkyOnePage() {
  const { activeId: activeSection, scrollTo: spyScrollTo } = useScrollSpy(sectionIds);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    spyScrollTo(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>Hardware Projects</span><span>/</span>
            <span className="text-[hsl(var(--highlight))]">SkyOne</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-1">SkyOne</h1>
          <p className="text-lg text-[hsl(var(--highlight-sub))] font-medium mb-3">F450 Quadcopter</p>
          <p className="text-muted-foreground text-[0.95rem] max-w-2xl mb-4">
            My first drone: an F450 quadcopter with an APM 2.8 flight controller, built from off-the-shelf parts to learn how a multirotor really works by assembling it, flying it, and working through everything that went wrong.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["F450", "APM 2.8", "ArduCopter 3.2.1", "Mission Planner", "3DR Telemetry", "RadioMaster"].map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border mb-10 bg-secondary">
          <Image src="/images/SkyOne.png" alt="SkyOne F450 quadcopter" fill className="object-cover" priority />
        </div>

        {/* Mobile Picker */}
        <div className="lg:hidden mb-6">
          <button onClick={() => setMobileOpen(p => !p)} className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg text-sm font-medium text-primary">
            <span>{sections.find(s => s.id === activeSection)?.label ?? "Overview"}</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", mobileOpen && "rotate-180")} />
          </button>
          {mobileOpen && (
            <div className="mt-1 border border-border rounded-lg bg-card overflow-hidden">
              {sections.map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)} className={cn("w-full text-left px-4 py-2.5 text-sm border-b border-border last:border-0", activeSection === s.id ? "text-primary font-medium bg-secondary" : "text-muted-foreground")}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-[hsl(var(--highlight))] uppercase tracking-widest mb-3">On this page</p>
              <nav className="space-y-0.5">
                {sections.map(s => (
                  <button key={s.id} onClick={() => scrollTo(s.id)} className={cn("w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                    activeSection === s.id
                      ? "bg-[hsl(var(--highlight)/0.12)] text-[hsl(var(--highlight))] font-medium border-l-2 border-[hsl(var(--highlight))] rounded-l-none"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                  )}>
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-16">

            {/* OVERVIEW */}
            <section>
              <SectionHeading id="overview" title="Overview" badge="progress" badgeLabel="Grounded for fixes" />
              <Para>
                SkyOne is a quadcopter built on an F450 frame. I built it to learn. As an aerospace-focused engineering student, I wanted to understand how a multirotor actually works by putting one together, flying it, and seeing what goes wrong.
              </Para>
              <Para>
                I didn&apos;t want to buy a ready-to-fly drone, because that teaches you very little. I didn&apos;t design SkyOne or any of its parts. Every component was bought off the shelf. What I did was assemble it, wire it, configure it, and work through the problems until it flew. That&apos;s where most of the learning happened.
              </Para>
              <Para>
                I bought the parts and started assembling in June 2025, and flew it for the first time on July 5, 2025. Over four flight sessions between July and September 2025, I never got a single stable flight. I realised something was fundamentally wrong in my understanding of drones, so I stepped back and learned about UAVs properly through an NPTEL course and YouTube. I restarted work on SkyOne in September 2026.
              </Para>
              <Para>
                <span className="font-medium text-primary">Status (October 2026):</span> SkyOne flies, but it has reliability issues. I&apos;ve grounded it to fix them properly rather than keep flying it and risk damaging it.
              </Para>
              <SubHeading>Timeline</SubHeading>
              <Table headers={["When", "Milestone"]} rows={timelineRows} />
            </section>

            {/* COMPONENTS */}
            <section>
              <SectionHeading id="components" title="Components & Bill of Materials" />
              <Para>Every part was bought off the shelf. I chose them all by following one beginner drone build tutorial on YouTube, not from my own analysis.</Para>
              <Table headers={["Part", "Model", "Key Spec", "Role"]} rows={bomRows} />
              <Para>
                <span className="font-medium text-primary">Note on the power module:</span> I bought the power module with the original parts but didn&apos;t use it in the 2025 build. Back then, the APM drew its power from an ESC&apos;s BEC. In September 2026 I learned that the power module can power the APM directly, which takes that load off the ESCs, so I wired it in. Any parts replaced after crashes were replaced with the same models.
              </Para>
            </section>

            {/* SYSTEM OVERVIEW */}
            <section>
              <SectionHeading id="system" title="System Overview" />
              <Para>
                The F450 frame&apos;s bottom plate doubles as the power distribution board. Five pigtails are soldered to its pads: one XT60 male for power in, and four T-connector leads, one per ESC. That way each ESC plugs in and can be removed without desoldering. All battery-side connectors are XT60.
              </Para>
              <Para>
                Battery power runs through the power module before reaching the distribution board. The power module also powers the APM 2.8 through its 6-pin cable and reports battery current and voltage. The voltage signal is jumpered to the APM&apos;s analog pin A0. The ESCs&apos; BEC power wires are all disconnected, so the APM is powered only by the power module.
              </Para>
              <Para>
                Each ESC&apos;s signal wire goes to one of the APM&apos;s motor outputs (1–4), and each ESC connects to its motor through bullet connectors. The R88 receiver connects to the APM inputs with one signal wire per channel (CH1–CH5) and gets its power through a single power lead from the APM. The 3DR telemetry radio plugs into the APM&apos;s Telem port. There is no GPS on SkyOne.
              </Para>

              <SubHeading>Wiring</SubHeading>
              <div className="flex flex-col items-center gap-0 my-6 max-w-xl mx-auto">
                <ArchNode accent title="LiPo Battery" subtitle="3S, 11.1 V, 2200 mAh" items={["XT60 out"]} />
                <ArrowDown label="XT60" />
                <ArchNode title="Power Module" subtitle="5.3 V / 3 A, current + voltage sense" items={["6-pin cable → APM power + current sense", "Voltage signal jumpered to A0", "XT60 → frame PDB"]} />
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="flex flex-col items-center">
                    <ArrowDown label="6-pin cable" />
                    <ArchNode accent title="APM 2.8" subtitle="ArduCopter 3.2.1" items={["Outputs 1–4 → ESC signals", "Inputs ← R88 CH1–CH5", "Telem → 3DR radio", "One power lead → R88"]} />
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowDown label="XT60" />
                    <ArchNode title="Frame PDB" subtitle="F450 bottom plate" items={["4 × T-connector leads", "One per ESC"]} />
                  </div>
                </div>
                <ArrowDown label="T-connectors (power) · signal wires (BEC red wires cut)" />
                <ArchNode title="4 × Simonk 30A ESC" items={["ESC 1 → Motor 1 · Front Right · CCW", "ESC 2 → Motor 2 · Back Left · CCW", "ESC 3 → Motor 3 · Front Left · CW", "ESC 4 → Motor 4 · Back Right · CW"]} />
                <ArrowDown label="bullet connectors" />
                <ArchNode title="4 × A2212 1400KV" items={["1045 props (2 CW, 2 CCW)"]} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-6">
                <div className="flex flex-col items-center">
                  <ArchNode title="RadioMaster Pocket" items={["Transmitter (CC2500)"]} />
                  <ArrowDown label="2.4 GHz" dashed />
                  <ArchNode title="R88 V2 Receiver" items={["CH1–CH5 → APM inputs"]} />
                </div>
                <div className="flex flex-col items-center">
                  <ArchNode title="3DR Radio (air)" items={["On APM Telem port"]} />
                  <ArrowDown label="433 MHz" dashed />
                  <ArchNode title="Ground Radio → Laptop" items={["USB, Mission Planner"]} />
                </div>
              </div>

              <SubHeading>Motor Layout (ArduCopter Quad X)</SubHeading>
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-start">
                <div>
                  <Table headers={["Output", "Position", "Direction", "Arm Colour"]} rows={motorRows} />
                  <Para>The two red arms sit at front-right and back-left, so the drone&apos;s orientation is visible from any angle.</Para>
                </div>
                <Figure src="/skyone/quad_x_layout.svg" alt="ArduCopter Quad X motor layout diagram: motor 1 front right CCW, 2 back left CCW, 3 front left CW, 4 back right CW" width={671} height={743} unoptimized
                  caption="ArduCopter Quad X layout: motor numbers and spin directions, front at top" className="max-w-xs w-full mx-auto" />
              </div>
            </section>

            {/* ASSEMBLY */}
            <section>
              <SectionHeading id="assembly" title="Assembly, Step by Step" />
              <div className="mb-6 p-4 rounded-lg bg-red-500/5 border border-red-500/30 text-sm text-muted-foreground flex gap-3">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-red-400">Safety: </span>
                  Propellers stay off for all bench work: wiring, calibration, motor-direction checks, and any time the battery is plugged in. They go on only at the very end, right before a flight test.
                </div>
              </div>
              <Para>
                <span className="font-medium text-primary">Tools used:</span> screwdriver, drill (as a power screwdriver), L-keys (hex keys), soldering iron, multimeter, double-sided tape, paper tape, scissors, tweezers.
              </Para>

              <SubHeading>Step 1 — Power distribution and battery mount</SubHeading>
              <AssemblyStep img="1-1" title="Bare bottom plate" width={4080} height={3060} alt="Bare F450 bottom plate with copper distribution pads"
                caption="The F450 bottom plate. The copper pads are the built-in power distribution board.">
                I started with the F450 bottom plate, which has the power distribution board printed into it.
              </AssemblyStep>
              <AssemblyStep img="1-2" title="Soldering the power leads" width={3060} height={3849} alt="Bottom plate with four T-connector leads and one XT60 lead soldered on"
                caption="Four T-connector leads for the ESCs and one XT60 lead for power, soldered to the plate.">
                I soldered four T-connector pigtails to the ESC pads and one XT60 male pigtail to the main power pads. This was the only soldering in the whole build.
                <Note kind="skill">Soldering. I used a multimeter to check polarity and continuity.</Note>
              </AssemblyStep>
              <AssemblyStep img="1-3" title="Battery and power module" width={3156} height={3032} alt="Battery strapped to the bottom plate with the power module wired in"
                caption="Battery strapped on, power module wired in between the battery and the distribution board.">
                I strapped the battery to the plate with Velcro and connected the power module between the battery and the plate&apos;s XT60 lead.
              </AssemblyStep>

              <SubHeading>Step 2 — Motors and ESCs on the arms</SubHeading>
              <AssemblyStep img="2-1" title="Parts for one arm" width={3486} height={3007} alt="An A2212 motor, a Simonk 30A ESC and an F450 arm laid out"
                caption="One arm's worth of parts: motor, ESC, arm.">
                One arm takes an A2212 motor, a Simonk 30A ESC, and an F450 arm.
              </AssemblyStep>
              <AssemblyStep img="2-2" title="Motor and ESC mounted" width={3359} height={3012} alt="A red arm and a white arm, each with a motor and ESC mounted"
                caption="Motor and ESC mounted on one red arm and one white arm. The red arms go at front-right and back-left, so the arm colour shows the drone's orientation from any angle.">
                I screwed the motor to the arm tip and strapped the ESC along the arm with Velcro. The ESC connects to the motor through bullet connectors.
                <Note kind="gotcha">Bullet connectors have to be fully seated. A loose one caused a crash later (Flight 5). Swapping any two motor wires reverses the spin direction.</Note>
              </AssemblyStep>

              <SubHeading>Step 3 — Frame assembly</SubHeading>
              <AssemblyStep img="3-1" title="Arms on the bottom plate" width={2398} height={2452} alt="All four arms bolted to the bottom plate"
                caption="All four arms attached. Front is at the top of the photo.">
                I bolted all four arms to the bottom plate and plugged each ESC into its T-connector.
              </AssemblyStep>
              <AssemblyStep img="3-2" title="Top plate on" width={2353} height={2473} alt="Top plate fitted on the frame, with a drill beside it"
                caption="Top plate going on. A drill made the many screws a lot less tedious.">
                I screwed the top plate on to close the frame.
                <Note kind="gotcha">Each motor has to sit in the position matching its output number and spin direction (Quad X: 1 FR CCW, 2 BL CCW, 3 FL CW, 4 BR CW). I got this wrong on my very first flight.</Note>
              </AssemblyStep>

              <SubHeading>Step 4 — Electronics, then propellers</SubHeading>
              <AssemblyStep img="4-1" title="Electronics plate" width={2409} height={2753} alt="Acrylic plate with the APM 2.8, R88 receiver and 3DR telemetry radio"
                caption="The electronics deck on a hand-cut acrylic plate: flight controller, receiver, telemetry radio.">
                I cut an acrylic plate to size and mounted the APM 2.8 on its anti-vibration mount, with the R88 receiver and 3DR telemetry radio beside it.
                <Note kind="gotcha">The APM&apos;s arrow must point to the front, between the two front arms. The plate and the shock mount have to sit level, because a tilted board makes the drone drift.</Note>
              </AssemblyStep>
              <AssemblyStep img="4-2" title="Electronics mounted and wired" width={2521} height={2804} alt="Electronics plate mounted on the frame with wires taped down"
                caption="Electronics on, ESC and receiver leads connected, wires secured with tape.">
                I mounted the plate on top of the frame, connected the ESC signal wires and receiver, and taped the loose wires down.
                <Note kind="gotcha">Loose wires can foul the props or vibrate their connectors loose. Every wire needs securing, including the receiver&apos;s (see Flights 6–7).</Note>
              </AssemblyStep>
              <AssemblyStep img="4-3" title="Propellers" width={2971} height={3039} alt="SkyOne fully assembled with all four propellers"
                caption="SkyOne fully assembled.">
                The props went on last: CW props on motors 3 and 4, CCW props on motors 1 and 2.
                <Note kind="gotcha">A prop on the wrong motor, or upside down, pushes air the wrong way. Adjacent motors must spin in opposite directions.</Note>
              </AssemblyStep>
            </section>

            {/* CONFIGURATION */}
            <section>
              <SectionHeading id="config" title="Configuration & Calibration" />
              <Para>
                <span className="font-medium text-primary">Setup:</span> APM 2.8 running ArduCopter 3.2.1, configured with Mission Planner 1.3.74 on Windows and Mac. The board connects over USB, or wirelessly through the 3DR telemetry radio at 57600 baud.
              </Para>

              <SubHeading>Calibrations</SubHeading>
              <Challenge title="Accelerometer">This was harder than it should have been. With ArduCopter 3.2.1, the accelerometer calibration kept failing in newer ground station versions, because the APM never received the &quot;next position&quot; keypress. It finally worked in Mission Planner 1.3.74, so I keep a separate copy of that version just for calibrations.</Challenge>
              <Challenge title="Compass">I calibrated the APM&apos;s built-in compass in Mission Planner.</Challenge>
              <Challenge title="Radio">Done in Mission Planner for CH1–CH5 (RadioMaster Pocket with an R88 receiver).</Challenge>
              <Challenge title="ESCs">I calibrated all four ESCs at once using ArduCopter&apos;s method: power on with full throttle, let the ESCs register the top and bottom of the range, then bring the throttle down.</Challenge>
              <Challenge title="Motor order and direction">Standard Quad X layout (see System Overview). I checked each output&apos;s PWM in Mission Planner, which is how I caught the Output 1 fault (see the bench session under Test Flights).</Challenge>

              <SubHeading>Flight Modes</SubHeading>
              <Para>
                The 3-position switch SC on CH5 sets the mode. Up and middle are Stabilize, and down is Land. I originally had AltHold too, but dropped it after finding the barometer is faulty: it reads about 473 hPa instead of about 950, and its altitude drifts about 5 m while sitting still on a table. SkyOne now flies in Stabilize only. The transmitter&apos;s switch warning makes sure SC is up at power-on.
              </Para>

              <SubHeading>Failsafes & Arming</SubHeading>
              <Para>
                I set the R88&apos;s own failsafe so that on signal loss it drops throttle to about 924 PWM. On the APM, the throttle failsafe (<Code>FS_THR_ENABLE</Code>) is set to always Land. All pre-arm checks are enabled (<Code>ARMING_CHECK = 1</Code>, confirmed in the Sep 27, 2026 flight log).
              </Para>

              <SubHeading>Power & Battery Monitoring</SubHeading>
              <BulletList items={[
                "I moved the APM's power from an ESC's BEC to the power module and disconnected all ESC BEC red wires.",
                "Current sensing worked straight away. Voltage sensing read 0.",
                "I checked the module with a multimeter: a 12.5 V pack gave about 1.05 V at the module and about 1.15 V at the APM pad. So the hardware was fine.",
                "I jumpered the voltage signal to analog pin A0 and set BATT_VOLT_PIN = 0, BATT_CURR_PIN = 12, BATT_VOLT_MULT = 11.9.",
                "The APM now reports voltage over MAVLink, at about 13.6 V. That's still higher than the 12.5 V on my multimeter, so the multiplier still needs calibrating, to about 10.9.",
                "Mission Planner's display still shows 0 with this firmware. I've parked that issue for now.",
              ]} />

              <SubHeading>Other Parameter Changes</SubHeading>
              <Table headers={["Parameter", "Value", "Why"]} rows={[
                ["MOT_TCRV_ENABLE", "0",    "The thrust-curve setting (with MOT_TCRV_MAXPCT = 93) was capping motor output at about 93%. The ceiling it computed matched the 1947 PWM plateau I was seeing."],
                ["THR_MID",         "600",  "Sets the hover throttle point."],
                ["LOG_BITMASK",     "2046", "Adds IMU and RC-output logging so I could analyse flights properly."],
              ]} />
            </section>

            {/* TEST FLIGHTS */}
            <section>
              <SectionHeading id="flights" title="Test Flights" />
              <Table headers={["#", "Date", "Location", "Goal", "Outcome", "Status"]} rows={flightRows} />
              <Para>
                <span className="font-medium text-primary">Conditions:</span> the 2026 flights were all in the morning, before any wind gusts, in pleasant weather. For the 2025 flights I don&apos;t remember exact conditions, but they were mostly between morning and afternoon.
              </Para>
              <Para>
                <span className="font-medium text-primary">Media:</span> not available yet. Photos and video will be added later.
              </Para>

              <SubHeading>2025: The First Build</SubHeading>
              <FlightCard title="Flight 1 — Jul 5, 2025 (house terrace)" badge="done" badgeLabel="Resolved" rows={[
                ["Testing", "First flight of the first build."],
                ["What happened", "The drone spun uncontrollably in yaw."],
                ["Root cause", "I had completely messed up the motor layout and put the wrong prop on each motor. Adjacent motors were spinning the same way, when they should spin in opposite directions."],
                ["Fix", "Corrected the motor layout and prop placement."],
              ]} />
              <FlightCard title="Flight 2 — Jul 13, 2025" badge="progress" badgeLabel="Issue found" rows={[
                ["Testing", "Basic stable flight."],
                ["What happened", "The flights were a bit more stable, but I had no real control against the wind. I made 9 successful takeoffs. On the 10th, a strong gust caused a crash that broke two props and an arm."],
                ["Root cause", "A strong gust, combined with my limited control of the drone at the time."],
                ["Fix", "Replaced the props and the arm with the same models."],
              ]} />
              <FlightCard title="Flight 3 — Aug 8, 2025" badge="progress" badgeLabel="Issue found" rows={[
                ["Testing", "AltHold and Land modes."],
                ["What happened", "I didn't understand how these modes work, so I kept overcorrecting. Then a dragonfly hit a prop and the drone hit the ground upside down. I lost an arm and the flight controller's shock absorber."],
                ["Root cause", "Not understanding the flight modes, then the dragonfly strike."],
                ["Fix", "Replaced the arm and the shock absorber."],
              ]} />
              <FlightCard title="Flight 4 — Sep 7, 2025" badge="progress" badgeLabel="Issue found" rows={[
                ["Testing", "My brother tried flying it."],
                ["What happened", "He lost control at height and it crashed. Nothing broke."],
                ["Root cause", "Loss of pilot control."],
              ]} />

              <NextBox label="Stepping back:">After these four flights I hadn&apos;t had a single stable flight with SkyOne. I realised something was fundamentally wrong in my understanding of drones, so I stepped back, learned properly through an NPTEL course and YouTube, and came back in September 2026.</NextBox>

              <SubHeading>2026: The Restart</SubHeading>
              <FlightCard title="Bench Session — Sep 2026 (props off)" badge="done" badgeLabel="Resolved" rows={[
                ["Issue", "Output 1 (Front Right) read higher PWM than the other three motors. Above about 1670–1900 PWM, its ESC beeped and the motor cut out."],
                ["Debugging", <>
                  I ran that ESC and motor straight from a spare receiver channel, and it ran cleanly. I swapped the ESCs between arms, and the fault stayed with Output 1. I swapped the Output 1 and Output 4 signal wires, and the fault moved away from the Front Right arm.
                </>],
                ["Root cause", "A bad connection in the Front Right arm's wiring."],
                ["Fix", "Replaced both ESCs and redid that arm's wiring. All four motors now run past 2000 PWM."],
                ["Also found", <>
                  The APM was tilted on its mount, so I corrected it and rebuilt the shock-mount plate level. <Code>MOT_TCRV_ENABLE</Code> was capping motor output at about 93%, so I disabled it.
                </>],
              ]} />
              <FlightCard title="Flight 5 — Sep 27, 2026" badge="done" badgeLabel="Resolved" rows={[
                ["Testing", "First flight after the restart."],
                ["What happened", "It made 12 takeoffs on one battery, better than any earlier session. It drifted back-left in Stabilize, and AltHold kept descending. It crashed from about 8–9 ft (my estimate). The log shows the crash came about 0.5 s after switching to AltHold: the drone pitched 53° nose-up with the motors at 100%."],
                ["Root cause", "The Back Left motor wire had come off its ESC bullet connector, so that motor lost thrust. The barometer was also faulty (reading about 473 hPa instead of about 950), which explains the AltHold descent."],
                ["Fix", "Repaired the bullet connectors, replaced the prop and the APM suspension, and dropped AltHold so SkyOne flies in Stabilize only. Bench checks passed."],
              ]} />
              <FlightCard title="Flight 6 — Sep 29, 2026" badge="progress" badgeLabel="Root cause not confirmed" rows={[
                ["Testing", "Stabilize-only flight after the repairs."],
                ["What happened", "It lifted off twice at low altitude but wobbled a lot, and the motors seemed to be \"choking\". I stopped after the second attempt. Nothing was damaged."],
                ["Root cause", "Not confirmed. I suspected loose connections."],
                ["Fix", "As a precaution, I secured every wire with paper tape, except the receiver wires, which I thought were already tight. An armed bench test indoors afterwards showed no problem."],
              ]} />
              <FlightCard title="Flight 7 — Sep 30, 2026" badge="open" badgeLabel="Unresolved" rows={[
                ["Testing", "Stabilize flight."],
                ["What happened", "The same choking happened again. After arming and throttling up, it lost signal. Then it lifted off again on its own, drifted back-left, touched the ground and flipped upside down. Afterwards the back-left motor was very hot while the others were cool."],
                ["Suspected cause", "Loose power connections to the R88 receiver. It only happens outdoors with the props on, never on the bench, so I think prop downwash is loosening the receiver's power wires. This may also explain Flight 6."],
                ["Fix", "Not yet done. SkyOne is grounded until it's fixed."],
              ]} />
            </section>

            {/* RESULTS */}
            <section>
              <SectionHeading id="results" title="Results & Status" badge="progress" badgeLabel="Grounded" />
              <SubHeading>What Works Now</SubHeading>
              <div className="space-y-2 mb-6">
                {workingRows.map(label => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-primary">{label}</span>
                  </div>
                ))}
              </div>

              <SubHeading>What Doesn&apos;t Work Yet</SubHeading>
              <Challenge title="Receiver power">The suspected loose power connection to the R88 causes signal loss in flight. This is the main open issue.</Challenge>
              <Challenge title="Barometer">It&apos;s faulty, so AltHold isn&apos;t usable and SkyOne is limited to Stabilize.</Challenge>
              <Challenge title="Voltage display">The APM reports voltage, but Mission Planner shows 0, and the voltage multiplier still needs calibrating.</Challenge>
              <Challenge title="Drift">There&apos;s a slight back-left drift in Stabilize.</Challenge>

              <SubHeading>Measured Results (from flight logs)</SubHeading>
              <Table headers={["Measurement", "Value"]} rows={[
                ["Battery used, Flight 5",  "≈ 1,043 mAh of the 2,200 mAh pack over 12 takeoffs (power module current sensor)"],
                ["Hover throttle, Flight 5", "Rose from ≈ 50% to ≈ 65% over the session"],
              ]} />
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                <span><span className="font-medium text-primary">Not measured:</span> flight time, payload, range.</span>
              </div>
            </section>

            {/* WHAT I LEARNED */}
            <section>
              <SectionHeading id="learned" title="What I Learned" />
              <ul className="space-y-4">
                {[
                  "Buying good parts doesn't give you a drone that flies. Integration, configuration and calibration are where the real work is.",
                  "Motor order and prop direction aren't details. Getting them wrong made my very first flight spin out of control.",
                  "A single loose connector can bring a drone down. Two of my crashes came from wiring, not from the flight controller or software.",
                  "When something fails, swapping one component at a time is the fastest way to find the real fault. That's how I traced the Output 1 problem to one arm's wiring.",
                  "Flight logs tell you what actually happened. Before I started reading them, I was mostly guessing.",
                  "I should understand a flight mode before I fly in it. In 2025 I tried AltHold without knowing how it worked, and kept overcorrecting.",
                  "Stepping back to learn the fundamentals properly wasn't giving up. I made more progress in a few weeks of 2026 than in all of 2025.",
                  "A flight controller only works as well as its sensors. A faulty barometer was enough to take altitude hold off the table completely.",
                ].map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <BullsEye />
                    <p className="text-[0.9rem] text-muted-foreground leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
