"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2, Circle, ShieldAlert, AlertTriangle, Camera } from "lucide-react";
import Image from "next/image";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

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
  ["Jul – Aug 2025",   "Parts bought"],
  ["Early Sep 2025",   "Assembly finished"],
  ["5 Sep 2025",       "First test flight (ArduCopter 3.6.8)"],
  ["Late 2025 – 2026", "Stepped away from both drones to learn more about UAVs"],
  ["September 2026",   "Came back: firmware upgraded to 4.6.3, full reconfiguration"],
  ["October 2026",     "Flight testing, vibration analysis and tuning toward autonomous flight"],
];

const bomRows = [
  ["Frame",                  "F450 Quadcopter Frame",                     "450 mm class, power distribution board built into the bottom plate", "Airframe; distributes battery power to the ESCs"],
  ["Flight controller",      "Pixhawk 2.4.8",                             "32-bit, 4 GB SD card for logs",  "Stabilisation, flight control, autonomous modes"],
  ["GPS + compass",          "u-blox M8N GPS with compass",               "—",                              "Position and heading"],
  ["GPS mount",              "Folding GPS mast bracket",                  "—",                              "Raises the GPS away from power wiring"],
  ["Buzzer + safety switch", "Pixhawk passive buzzer and switch",         "—",                              "Status tones and safety switch"],
  ["Motors",                 "ReadyToSky 2212 BLDC (×4, 2 CW, 2 CCW)",    "920KV",                          "Drive the propellers"],
  ["ESCs",                   "ReadytoSky Simonk 30A (×4)",                "30 A, banana connectors",        "Control motor speed"],
  ["Propellers",             "1045 (2 CW, 2 CCW)",                        "10 × 4.5 in",                    "Produce thrust"],
  ["Power switch",           "High-current XT60 power switch",            "—",                              "Main on/off, between the battery and the power module"],
  ["Power module",           "5.3V 3A Power Module",                      "XT60, 5.3 V / 3 A output",       "Powers the Pixhawk; senses battery voltage and current"],
  ["Telemetry",              "3DR Radio Telemetry Kit",                   "433 MHz, 500 mW",                "Wireless link to the ground station"],
  ["Transmitter",            "RadioMaster Pocket",                        "CC2500",                         "Manual control"],
  ["Receiver",               "RadioMaster R88 V2",                        "8 channels",                     "Receives transmitter commands"],
  ["Battery",                "Pro-Range LiPo",                            "11.1 V, 6200 mAh, 3S, 40C",      "Main power source"],
  ["Charger",                "IMAX B6",                                   "80 W, 6 A, 1–6 cells",           "LiPo charging"],
  ["FC mount",               "Anti-vibration shock absorber plate",       "—",                              "Isolates the Pixhawk from frame vibration"],
  ["Electronics plate",      "Acrylic sheet, cut by me",                  "—",                              "Electronics deck"],
  ["Leg extensions",         "Acrylic pieces under each motor, cut by me", "—",                             "Raise the frame so the bottom-mounted battery clears the ground; steadier landings"],
  ["Connectors",             "XT60",                                      "—",                              "All power connections"],
  ["Cable",                  "USB to Micro USB, 1 m",                     "—",                              "Connects the Pixhawk to a computer for setup"],
  ["Mounting",               "Velcro straps, paper tape, bubble wrap",    "—",                              "Hold the battery and ESCs; secure wires; protect the battery on the underside"],
];

const motorRows = [
  ["1", "Front Right", "CCW", "Black"],
  ["2", "Back Left",   "CCW", "Black"],
  ["3", "Front Left",  "CW",  "Red"],
  ["4", "Back Right",  "CW",  "Red"],
];

const flightRows = [
  ["1", "5 Sep 2025",  "2025-09-05",        "First flight (ArduCopter 3.6.8)", "7 short hops; drifted back-left on every one",           "Addressed by 2026 rework"],
  ["—", "29 Sep 2026", "Bench (props off)", "Check motor response",            "Uneven motor outputs at one throttle point",             "Resolved (not a fault)"],
  ["2", "1 Oct 2026",  "27", "First flight on 4.6.3",          "Tilted and yawed on lift-off; cut within seconds",               "Resolved"],
  ["3", "1 Oct 2026",  "28", "Stabilize, AltHold, Loiter",     "Loiter held position within 40 cm; several hard landings",       "Resolved"],
  ["4", "2 Oct 2026",  "31", "Loiter flight",                  "7.1 min in Loiter, soft landing with the Land switch",          "Passed"],
  ["5", "2 Oct 2026",  "32", "Mode tour and RTL tests",        "9.4 min flight; RTL landed itself",                              "Passed (one firm Stabilize touchdown)"],
  ["6", "2 Oct 2026",  "33", "Short flight",                   "Flew fine, but took off before GPS lock",                        "Passed, habit to fix"],
  ["7", "2 Oct 2026",  "34", "Loiter and harder manoeuvring",  "Two good flights; disarmed in the air after an RTL",             "Habit fixed"],
  ["8", "3 Oct 2026",  "35", "Hover vibration data + roll AutoTune", "AutoTune failed; battery run too low",                     "Resolved"],
  ["9", "3 Oct 2026",  "37", "Notch filter + roll AutoTune",   "AutoTune succeeded; vibration much lower",                      "Passed"],
];

const workingRows = [
  "All five modes I use work in flight: Stabilize, AltHold, Loiter, RTL and Land. Loiter held position to 13–17 cm RMS (log 28)",
  "I can take off and land in Loiter, and land hands-off with the Land switch or RTL, at about 0.5 m/s",
  "RTL has been tested several times: it climbs to 15 m, returns home and lands itself",
  "The radio failsafe (RTL) has been tested on the ground by switching off the transmitter",
  "The battery failsafes (capacity-based RTL and Land) and the geofence are set up",
  "The battery voltage reading matches my multimeter, and arming is blocked on a tired pack",
  "The GPS and external compass are healthy (up to 22 satellites, HDOP around 0.5–0.7)",
  "The harmonic notch filter removed the 80 Hz motor vibration from the roll axis",
  "Roll AutoTune is complete",
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
  return (
    <div className="flex gap-3 mb-3">
      <span className="text-[hsl(var(--highlight))] mt-0.5 flex-shrink-0 text-sm font-bold">→</span>
      <div>
        <span className="text-sm font-semibold text-primary">{title} — </span>
        <span className="text-sm text-muted-foreground leading-relaxed">{children}</span>
      </div>
    </div>
  );
}

function NextBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="my-8 p-4 rounded-lg bg-[hsl(var(--highlight)/0.06)] border border-[hsl(var(--highlight)/0.3)] text-sm text-muted-foreground flex gap-3">
      <div><span className="font-semibold text-[hsl(var(--highlight))]">{label} </span>{children}</div>
    </div>
  );
}

function Pending({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 p-4 rounded-lg border border-dashed border-border bg-secondary/40 text-sm text-muted-foreground flex gap-3">
      <Camera className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div>{children}</div>
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
            <span className={cn("mt-0.5 flex-shrink-0", accent ? "text-[hsl(var(--highlight))]" : "text-muted-foreground")}>→</span>
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

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-[hsl(var(--highlight))] mt-0.5 flex-shrink-0">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Gotcha({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 p-3 rounded-lg border text-sm text-muted-foreground flex gap-2.5 bg-red-500/5 border-red-500/25">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <div>{children}</div>
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

export default function SkyTwoPage() {
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
            <span className="text-[hsl(var(--highlight))]">SkyTwo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-1">SkyTwo</h1>
          <p className="text-lg text-[hsl(var(--highlight-sub))] font-medium mb-3">Pixhawk F450 Quadcopter</p>
          <p className="text-muted-foreground text-[0.95rem] max-w-2xl mb-4">
            My upgrade to SkyOne: the same F450 frame with completely different electronics, built around a Pixhawk 2.4.8 with GPS. It flies in Loiter, returns home on its own, and I&apos;m now tuning it as groundwork for autonomous flight.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["F450", "Pixhawk 2.4.8", "ArduCopter 4.6.3", "QGroundControl", "M8N GPS", "3DR Telemetry", "RadioMaster"].map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border mb-10 bg-secondary">
          <Image src="/images/SkyTwo.png" alt="SkyTwo Pixhawk F450 quadcopter" fill className="object-cover" priority />
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
              <SectionHeading id="overview" title="Overview" badge="progress" badgeLabel="In Progress" />
              <Para>
                SkyTwo is a quadcopter built on the same F450 frame as SkyOne, but with completely different electronics. It&apos;s my upgrade to SkyOne. I want to make it as capable as I can, including autonomous flight, and later I plan to add a Raspberry Pi to it.
              </Para>
              <Para>
                Like SkyOne, I built it from off-the-shelf parts instead of buying a ready-to-fly drone, because I wanted to learn by actually putting one together and flying it. I didn&apos;t design SkyTwo or any of its parts. I assembled, wired, configured, calibrated and debugged it.
              </Para>
              <Para>
                SkyOne taught me that its parts were outdated, especially the APM 2.8 flight controller, and that flying without GPS had a lot of drawbacks. So I built SkyTwo around a Pixhawk 2.4.8 with GPS.
              </Para>
              <Para>
                I bought the parts between July and late August 2025, finished assembling it in early September 2025, and did its first test flight on 5 September 2025. After that I stepped away from both drones to learn more about UAVs, and came back in September 2026.
              </Para>
              <Para>
                <span className="font-medium text-primary">Status (October 2026):</span> In progress. It flies, and I&apos;m now tuning it as groundwork for autonomous flight.
              </Para>
              <SubHeading>Timeline</SubHeading>
              <Table headers={["When", "Milestone"]} rows={timelineRows} />
            </section>

            {/* COMPONENTS */}
            <section>
              <SectionHeading id="components" title="Components & Bill of Materials" />
              <Para>Every part was bought off the shelf. After SkyOne, I chose SkyTwo&apos;s parts myself, based on my own research.</Para>
              <Table headers={["Part", "Model", "Key Spec", "Role"]} rows={bomRows} />
              <SubHeading>Why These Parts</SubHeading>
              <BulletList items={[
                "After SkyOne, I researched and picked SkyTwo's parts myself instead of following a tutorial.",
                "The biggest change is the flight controller. I moved from the outdated APM 2.8 to a Pixhawk 2.4.8, and added a GPS, which SkyOne never had.",
                "For SkyOne I used generic motors. For SkyTwo I wanted branded ones.",
                "I wanted more battery capacity than SkyOne's 2200 mAh, balanced against my budget, so I went with 6200 mAh.",
                "The XT60 switch lets me power the drone on and off without plugging and unplugging the battery.",
              ]} />
            </section>

            {/* SYSTEM OVERVIEW */}
            <section>
              <SectionHeading id="system" title="System Overview" />
              <Para>
                The F450 bottom plate also works as the power distribution board. SkyTwo&apos;s ESCs came with bare power leads rather than plugs, so I soldered each ESC&apos;s power leads straight to the plate&apos;s pads. Battery power reaches the plate through an XT60 lead.
              </Para>
              <Para>
                Power runs from the battery through an XT60 on/off switch, then through the power module, and then to the distribution board. The power module powers the Pixhawk and reports battery voltage and current. None of the ESCs&apos; power (BEC) red wires are connected, so the Pixhawk is powered only by the power module.
              </Para>
              <Para>
                Each ESC&apos;s signal wire goes to one of the Pixhawk&apos;s main outputs (1–4), and each ESC connects to its motor through bullet connectors. The R88 receiver connects to the Pixhawk&apos;s RC IN port with a single 3-wire SBUS cable, which carries all channels and the receiver&apos;s power. The telemetry radio plugs into TELEM1. The M8N GPS module has two cables: one goes to the GPS port, and the other, for its compass, goes to the I2C port. The buzzer and safety switch plug into their own ports on the Pixhawk.
              </Para>

              <SubHeading>Wiring</SubHeading>
              <div className="flex flex-col items-center gap-0 my-6 max-w-xl mx-auto">
                <ArchNode accent title="LiPo Battery" subtitle="3S, 11.1 V, 6200 mAh" items={["XT60 out"]} />
                <ArrowDown label="XT60" />
                <ArchNode title="Power Switch" subtitle="High-current XT60 on/off" items={["XT60 → power module"]} />
                <ArrowDown label="XT60" />
                <ArchNode title="Power Module" subtitle="5.3 V / 3 A, voltage + current sense" items={["6-pin cable → Pixhawk POWER", "XT60 → frame PDB"]} />
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="flex flex-col items-center">
                    <ArrowDown label="6-pin cable" />
                    <ArchNode accent title="Pixhawk 2.4.8" subtitle="ArduCopter 4.6.3" items={["MAIN OUT 1–4 → ESC signals", "RC IN ← R88 (SBUS)", "TELEM1 → 3DR radio", "GPS + I2C ← M8N", "BUZZER, SWITCH"]} />
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowDown label="XT60" />
                    <ArchNode title="Frame PDB" subtitle="F450 bottom plate" items={["ESC power leads soldered to pads"]} />
                  </div>
                </div>
                <ArrowDown label="soldered (power) · signal wires (BEC red wires disconnected)" />
                <ArchNode title="4 × Simonk 30A ESC" items={["ESC 1 → Motor 1 · Front Right · CCW", "ESC 2 → Motor 2 · Back Left · CCW", "ESC 3 → Motor 3 · Front Left · CW", "ESC 4 → Motor 4 · Back Right · CW"]} />
                <ArrowDown label="bullet connectors" />
                <ArchNode title="4 × ReadyToSky 2212 920KV" items={["1045 props (2 CW, 2 CCW)"]} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-6">
                <div className="flex flex-col items-center">
                  <ArchNode title="RadioMaster Pocket" items={["Transmitter (CC2500)"]} />
                  <ArrowDown label="2.4 GHz" dashed />
                  <ArchNode title="R88 V2 Receiver" items={["SBUS (single 3-wire cable) → RC IN"]} />
                </div>
                <div className="flex flex-col items-center">
                  <ArchNode title="3DR Radio (air)" items={["On TELEM1"]} />
                  <ArrowDown label="433 MHz" dashed />
                  <ArchNode title="Ground Radio → Laptop" items={["USB, QGroundControl"]} />
                </div>
                <div className="flex flex-col items-center">
                  <ArchNode title="M8N GPS Module" items={["GPS cable → GPS port", "Compass cable → I2C port"]} />
                </div>
              </div>

              <SubHeading>Motor Layout (ArduCopter Quad X)</SubHeading>
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-start">
                <div>
                  <Table headers={["Output", "Position", "Direction", "Arm Colour"]} rows={motorRows} />
                  <Para>The two black arms sit at front-right and back-left, and the red arms at front-left and back-right, so the drone&apos;s orientation is visible from any angle.</Para>
                </div>
                <Figure src="/skytwo/quad_x_layout.svg" alt="ArduCopter Quad X motor layout diagram: motor 1 front right CCW, 2 back left CCW, 3 front left CW, 4 back right CW" width={743} height={743} unoptimized
                  caption="ArduCopter Quad X layout: motor numbers and spin directions, front at top" className="max-w-xs w-full mx-auto" />
              </div>
            </section>

            {/* ASSEMBLY */}
            <section>
              <SectionHeading id="assembly" title="Assembly, Step by Step" badge="progress" badgeLabel="Coming soon" />
              <div className="mb-6 p-4 rounded-lg bg-red-500/5 border border-red-500/30 text-sm text-muted-foreground flex gap-3">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-red-400">Safety: </span>
                  Propellers stay off for all bench work: wiring, calibration, motor-direction checks, and any time the battery is plugged in. They go on only at the very end, right before a flight test.
                </div>
              </div>
              <Pending>Photos of the rebuild are still to be taken. The step-by-step assembly will be added here once they are.</Pending>
            </section>

            {/* CONFIGURATION */}
            <section>
              <SectionHeading id="config" title="Configuration & Calibration" />
              <Para>
                <span className="font-medium text-primary">Setup:</span> Pixhawk 2.4.8, configured with QGroundControl on both my Mac and my Windows desktop. QGC worked natively on the Mac from the first connection.
              </Para>

              <SubHeading>Firmware Upgrade</SubHeading>
              <Para>
                SkyTwo&apos;s 2025 flight ran ArduCopter 3.6.8. In September 2026 I upgraded it to ArduCopter 4.6.3, flashing the Pixhawk1 target through QGC on Windows, since this board has 2 MB of flash. I then reset all parameters to defaults and configured everything from scratch.
              </Para>

              <SubHeading>Sensors & Calibrations</SubHeading>
              <Challenge title="Barometer">After the upgrade the barometer read about 474 hPa instead of about 948. Setting <Code>BARO_OPTIONS = 1</Code> fixed it.</Challenge>
              <Challenge title="Accelerometer and level">I did both in QGC.</Challenge>
              <Challenge title="Compass">I use the external compass inside the GPS module (HMC5883, on I2C) as the primary compass. I disabled the Pixhawk&apos;s internal compass (IST8310), because the 2025 log showed it picking up interference from the motors. I did the compass rotation calibration outdoors before the first flight on 4.6.3.</Challenge>
              <Challenge title="Radio">I calibrated the radio in QGC for the RadioMaster Pocket over SBUS.</Challenge>
              <Challenge title="ESCs and motor check"><Code>MOT_PWM_MIN = 1000</Code> and <Code>MOT_PWM_MAX = 2000</Code>. I calibrated all four ESCs at once, and QGC&apos;s motor test confirmed every motor position and spin direction.</Challenge>

              <SubHeading>Arming, Switches & Flight Modes</SubHeading>
              <Para>The Pixhawk&apos;s safety switch is in use, so I have to press it before the drone can arm.</Para>
              <Table headers={["Switch", "Channel", "Function"]} rows={[
                ["SB", "CH5 (3-position)", "Flight mode: up Stabilize, middle AltHold, down Loiter"],
                ["SA", "CH6",              "Normally Land. Temporarily set to trigger AutoTune (RC6_OPTION = 17) while I tune"],
                ["SC", "CH7",              "RTL when fully down"],
                ["SD", "CH8",              "Arm / disarm"],
              ]} />
              <Para>Simple mode is off.</Para>

              <SubHeading>Failsafes & Safety Limits</SubHeading>
              <Challenge title="Radio">The throttle failsafe is on at 975 PWM and is set to always RTL. I tested it by switching off the transmitter: the failsafe triggered, and it cleared when I turned the transmitter back on.</Challenge>
              <Challenge title="Battery">The failsafe is based on remaining capacity. RTL triggers at 2000 mAh left (<Code>BATT_LOW_MAH</Code>), and Land at 1500 mAh left (<Code>BATT_CRT_MAH</Code>). The voltage source is set to sag-compensated voltage.</Challenge>
              <Challenge title="Geofence">A circle of 60 m radius with a 30 m altitude limit. Breaching it triggers RTL.</Challenge>
              <Challenge title="RTL altitude">15 m.</Challenge>
              <Challenge title="Other">The GCS failsafe is off, and the EKF and dead-reckoning failsafes are at their defaults. Crash check and the vibration failsafe are on.</Challenge>

              <SubHeading>Battery Monitoring</SubHeading>
              <BulletList items={[
                "The monitor is set to analog voltage and current on the standard Pixhawk pins (2/3), with capacity 6200 mAh.",
                <>I calibrated <Code>BATT_VOLT_MULT</Code> to 10.975, so QGC&apos;s voltage matches my multimeter.</>,
                <>Current needed correcting, which I worked out from the charger. After the Oct 3 evening flights the flight controller had counted about 3,609 mAh, but the IMAX B6 put back 5,268 mAh. That means the sensor was under-reading by about 31%, so I changed <Code>BATT_AMP_PERVLT</Code> from 17 to 24.5. I haven&apos;t verified this in a flight yet.</>,
              ]} />

              <SubHeading>Vibration & the Notch Filter</SubHeading>
              <BulletList items={[
                <>I turned on high-rate IMU logging (<Code>INS_LOG_BAT_MASK = 1</Code>) and logged a 2-minute hover (log 35). The data showed a strong motor-noise peak at 80 Hz, with harmonics at 160 and 240 Hz, and it was about 9× stronger on roll than on pitch.</>,
                <>Based on that, I set up ArduPilot&apos;s throttle-based harmonic notch filter (<Code>INS_HNTCH_MODE = 1</Code>): 80 Hz at a reference hover throttle of 0.41, bandwidth 40 Hz, attenuation 40 dB, covering the 1st to 3rd harmonics.</>,
                "The next flight (log 37) was logged with the filter on, before and after filtering. The 80 Hz roll peak dropped by more than 99%, and the 160/240 Hz peaks disappeared. Median vertical vibration fell from about 12 to about 9 m/s².",
              ]} />

              <SubHeading>AutoTune (Roll)</SubHeading>
              <BulletList items={[
                "My first roll AutoTune (log 35, before the notch filter) failed within 6 seconds with \"Failed to level\". Vibration was making the roll rate too noisy.",
                "With the notch filter on, the second attempt (log 37) finished in about 4 minutes. The main changes were roll rate D from 0.0036 to 0.0059, and roll angle P from 4.5 to 16.67.",
                <>The gains didn&apos;t save automatically, because I switched to RTL during AutoTune, so I entered them by hand in QGC. QGC limits <Code>ATC_ANG_RLL_P</Code> to 3–12, so I set it to 10.</>,
                "Pitch and yaw AutoTune are still to do.",
              ]} />

              <SubHeading>Other Parameter Changes</SubHeading>
              <Table headers={["Parameter", "Value", "Why"]} rows={[
                ["MOT_THST_HOVER", "0.41", "0.25 at first, then 0.38. After it learned 0.534 from a nearly flat battery in log 35, I reset it to 0.41."],
                ["PILOT_SPEED_DN", "100",  "Slower pilot-commanded descent."],
              ]} />
            </section>

            {/* TEST FLIGHTS */}
            <section>
              <SectionHeading id="flights" title="Test Flights" />
              <Para>All flights were at the BITS Hyderabad campus New Football Ground.</Para>
              <Table headers={["#", "Date", "Log", "Goal", "Outcome", "Status"]} rows={flightRows} />
              <SubHeading>Timing & Conditions</SubHeading>
              <BulletList items={[
                "1 Oct: light S–SW breeze.",
                "2 Oct: morning (logs start at 07:14, 07:27, 09:31 and 09:42).",
                "3 Oct: log 35 in the morning, log 37 in the evening.",
              ]} />
              <Pending><span className="font-medium text-primary">Media:</span> not available yet. Photos and video will be added later.</Pending>

              <SubHeading>2025: First Flight</SubHeading>
              <FlightCard title="Flight 1 — 5 Sep 2025 (ArduCopter 3.6.8)" badge="done" badgeLabel="Addressed by 2026 rework" rows={[
                ["Testing", "First flight of SkyTwo. Throttle only, with no roll, pitch or yaw inputs."],
                ["What happened", "11 arm cycles and 7 short hops of 2–4 m, all in Stabilize. It drifted back-left on every hop, by 1–14 m."],
                ["Root cause", "The drift itself was never pinned down; it was either wind or a 1–2° level bias. The log also showed several setup problems:"],
              ]}>
                <div className="pl-6">
                  <BulletList items={[
                    "The battery monitor was mis-wired in the parameters (wrong pins, voltage only). Its voltage reading rose under load.",
                    "The CW motors ran about 180 µs higher than the CCW pair, which is a yaw imbalance.",
                    "Hover throttle was set wrong, at 0.35 against an actual ~0.23.",
                    "Every landing was hard.",
                    "Loiter wasn't on the mode switch.",
                    "The internal compass picked up motor interference.",
                  ]} />
                </div>
                <Challenge title="Fix">I stopped working on the drones after this flight. When I came back in September 2026, I upgraded the firmware to 4.6.3 and redid the whole configuration, which fixed every item above (see Configuration &amp; Calibration).</Challenge>
              </FlightCard>

              <NextBox label="Stepping away:">After this flight I stepped away from both drones to learn more about UAVs, and came back in September 2026.</NextBox>

              <SubHeading>2026: Upgrade & Flight Testing</SubHeading>
              <FlightCard title="Bench Session — 29 Sep 2026 (props off)" badge="done" badgeLabel="Resolved (no fault)" rows={[
                ["Issue", "At one throttle setting, the four motors weren't responding equally."],
                ["Root cause", "It wasn't a hardware fault. On a table, the drone can't actually level itself. The flight controller read about 1.5° right roll and 2.8° nose-up, and kept building up correction (I-term windup). Stick tests showed every output was mapped correctly."],
              ]} />
              <FlightCard title="Flight 2 — 1 Oct 2026, log 27" badge="done" badgeLabel="Resolved" rows={[
                ["Testing", "First flight after the 4.6.3 upgrade."],
                ["What happened", "As throttle came up, it tilted nose-up and left, and yawed clockwise from 199° to 270°. The flight controller pushed the back-left motor hard and pinned the front-right motor at minimum. I cut it within seconds, after it had risen only about 0.7 m."],
                ["Root cause", "A reversed prop on a CCW motor (back left)."],
                ["Fix", "Put the correct prop on."],
              ]} />
              <FlightCard title="Flight 3 — 1 Oct 2026, log 28" badge="done" badgeLabel="Resolved" rows={[
                ["Testing", "Stabilize, AltHold and Loiter."],
                ["What happened", "7 arm cycles, about 4 minutes in the air. Loiter held position to 13–17 cm RMS (worst 40 cm), and altitude hold was within 4–6 cm RMS. GPS had 19–22 satellites, vibration was well under limits, and the CW/CCW imbalance from 2025 was down to 1–41 µs. But four of the landings were hard, the last one at over 5 m/s."],
                ["Root cause", <>Every hard landing started when I switched from AltHold, Loiter or RTL to Stabilize to land. I thought landing required Stabilize. <Code>MOT_THST_HOVER</Code> was still 0.25 when SkyTwo actually needed 0.33–0.42, so mid-stick in Stabilize gave only 60–75% of hover thrust, and the drone dropped.</>],
                ["Fix", <>Set <Code>MOT_THST_HOVER</Code> to 0.38 and <Code>PILOT_SPEED_DN</Code> to 100. Changed my habit: I now take off and land in Loiter, or land with the Land switch or RTL, instead of switching to Stabilize.</>],
              ]} />
              <FlightCard title="Flight 4 — 2 Oct 2026, log 31" badge="done" badgeLabel="Passed" rows={[
                ["Testing", "A full flight in Loiter."],
                ["What happened", "Armed and took off in Loiter, and flew for 7.1 minutes (up to 70 m away and 5.5 m high). Landed with the Land switch at 0.6 m/s, with zero accelerometer clipping. Used 1,635 mAh."],
              ]} />
              <FlightCard title="Flight 5 — 2 Oct 2026, log 32" badge="done" badgeLabel="Passed (one firm Stabilize touchdown)" rows={[
                ["Testing", "Flight modes and RTL."],
                ["What happened", "A short Stabilize hop first. The throttle was slightly below hover, so it sank and touched down firmly at about 1.6 m/s. Then a 9.4-minute flight: Stabilize → AltHold → RTL → back to AltHold → RTL. Both RTLs climbed to 15 m and came home. I cancelled the first one with the mode switch, and the second landed itself at about 0.5 m/s."],
                ["Battery", "Raw voltage dipped to 9.79 V under load, but the sag-compensated reading stayed at 10.98 V, so the failsafe correctly didn't trigger. After landing, the arming-voltage check stopped me from flying again on a tired pack."],
              ]} />
              <FlightCard title="Flight 6 — 2 Oct 2026, log 33" badge="progress" badgeLabel="Passed, habit to fix" rows={[
                ["Testing", "A short flight, after recharging the battery."],
                ["What happened", "Flew for 1.6 minutes, up to 21.3 m in Stabilize and AltHold. Landed with the Land switch at 0.5 m/s. I took off 7 seconds after power-up, about 80 seconds before the GPS was in use. During that window there was no Loiter, and a radio failsafe would have meant Land instead of RTL."],
                ["Fix", "Wait for GPS lock and a home position before taking off."],
              ]} />
              <FlightCard title="Flight 7 — 2 Oct 2026, log 34" badge="done" badgeLabel="Habit fixed" rows={[
                ["Testing", "Loiter flights and harder manoeuvring."],
                ["What happened", "Two Loiter flights, each ended by RTL (7.8 minutes total, up to 15.8 m). In the second flight I used full stick: up to 32° pitch, motors near their ceiling. Pitch overshot by up to about 11° on fast reversals, so the default tune was loose at the edges. After the first RTL touched down, I switched to Stabilize with the throttle still at mid. It hopped back up to about 0.5 m, and I disarmed it in the air, so it dropped."],
                ["Root cause", "The same Stabilize-at-mid-throttle habit."],
                ["Fix", "After touchdown, stay in RTL, Land or Loiter with the throttle at minimum and let it disarm itself. The overshoot is one reason I moved on to AutoTune."],
              ]} />
              <FlightCard title="Flight 8 — 3 Oct 2026 (morning), log 35" badge="done" badgeLabel="Resolved" rows={[
                ["Testing", "A 2-minute hover with high-rate IMU logging for vibration analysis, plus a roll AutoTune attempt."],
                ["What happened", "3 flights, about 17.8 minutes in the air. Roll AutoTune failed after 6 seconds with \"Failed to level\". I ran the battery down to 9.06 V under load; it lost thrust at the end and touched down hard, at about 3–4 m/s. Telemetry to the laptop kept disconnecting and reconnecting once the drone was airborne."],
                ["Root cause", "The vibration data showed a strong 80 Hz motor peak, plus harmonics, that made the roll rate too noisy for AutoTune. The hard landing came from running the pack too low. That flat pack also made the hover-throttle learning save a wrong value, 0.534."],
                ["Fix", <>Set up the throttle-based harmonic notch filter at 80 Hz, reset <Code>MOT_THST_HOVER</Code> to 0.41, added capacity failsafes (RTL at 2000 mAh left, Land at 1500 mAh left), and added a geofence (60 m radius, 30 m height).</>],
              ]}>
                <Gotcha><span className="font-semibold text-red-400">Still open: </span>the telemetry dropouts are unresolved.</Gotcha>
              </FlightCard>
              <FlightCard title="Flight 9 — 3 Oct 2026 (evening), log 37" badge="done" badgeLabel="Passed" rows={[
                ["Testing", "The notch filter, and a second roll AutoTune."],
                ["What happened", "2 flights, about 15.3 minutes, up to 14.7 m and 57.8 m from home, with 18–19 satellites. The 80 Hz roll peak dropped by more than 99%, and median vertical vibration fell from about 12 to about 9 m/s². Roll AutoTune completed in about 4 minutes. Both touchdowns were soft, at about 0.5–0.7 m/s."],
                ["Notes", "Because I switched to RTL during AutoTune, the gains didn't save, so I entered them manually afterwards. Log 36 that evening was only a battery pre-arm error. In log 38 I couldn't fly after a power cycle because the battery voltage was too low."],
              ]} />
            </section>

            {/* RESULTS */}
            <section>
              <SectionHeading id="results" title="Results & Status" badge="progress" badgeLabel="In Progress" />
              <SubHeading>What Works Now</SubHeading>
              <div className="space-y-2 mb-6">
                {workingRows.map(label => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-primary">{label}</span>
                  </div>
                ))}
              </div>

              <SubHeading>Still To Do</SubHeading>
              <Challenge title="Tuning">Pitch and yaw AutoTune aren&apos;t done yet.</Challenge>
              <Challenge title="Telemetry">The link to the laptop keeps disconnecting and reconnecting while the drone is in the air.</Challenge>
              <Challenge title="Current sensor">The correction (<Code>BATT_AMP_PERVLT</Code> from 17 to 24.5) is set, but I haven&apos;t verified it in a flight yet.</Challenge>
              <Challenge title="Switch SA">Temporarily set to AutoTune. Its normal job is Land, and I&apos;ll set it back after tuning.</Challenge>
              <Challenge title="Autonomy">I haven&apos;t tried autonomous missions yet, and the Raspberry Pi isn&apos;t integrated.</Challenge>

              <SubHeading>Measured Results (from flight logs)</SubHeading>
              <Table headers={["Measurement", "Value"]} rows={[
                ["Longest single flight",          "9.4 min (log 32, 2 Oct)"],
                ["Longest session on one battery", "≈ 17.8 min over 3 flights (log 35). That session ran the pack too low, so I don't treat it as normal endurance."],
                ["Highest altitude",               "21.3 m (log 33)"],
                ["Furthest distance from home",    "87 m (log 32)"],
                ["Hover current",                  "≈ 19–22 A, after correcting the current sensor against the charger"],
              ]} />
              <div className="flex items-start gap-3 text-sm text-muted-foreground mb-2">
                <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                <span><span className="font-medium text-primary">Estimated (not measured):</span> about 13 minutes of usable flight per 6200 mAh pack, from the corrected hover current of roughly 330 mAh per minute.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                <span><span className="font-medium text-primary">Not measured:</span> payload, range.</span>
              </div>
            </section>

            {/* WHAT I LEARNED */}
            <section>
              <SectionHeading id="learned" title="What I Learned" />
              <ul className="space-y-4">
                {[
                  "Moving from the APM 2.8 to a Pixhawk with GPS changed everything. Loiter held SkyTwo within centimetres, something SkyOne could never do.",
                  "A firmware upgrade isn't just a version change. Going from 3.6.8 to 4.6.3, I reset everything and configured it from scratch, and that cleared up problems the 2025 flight had.",
                  "Hover throttle matters more than I expected. With MOT_THST_HOVER set wrong, switching to Stabilize to land made the drone drop, and that one parameter was behind most of my hard landings.",
                  "I had a wrong habit. I thought I had to land in Stabilize. Once I learned I could take off and land in Loiter, or let Land and RTL do it, my landings became soft.",
                  "Vibration analysis is worth doing before tuning. My first AutoTune failed in seconds. After I found the 80 Hz motor peak in the logs and set up a notch filter, it worked.",
                  "My flight controller's battery readings aren't automatically right. Comparing its mAh count with what the charger put back showed the current sensor was under-reading by about 31%.",
                  "Running a pack too low has real consequences. It cost me thrust and a hard landing, and it even made the flight controller learn a wrong hover value.",
                  "Writing up every flight from its log made each session teach me something specific, instead of just \"it flew\" or \"it crashed.\"",
                ].map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[hsl(var(--highlight))] mt-1 flex-shrink-0 text-sm">→</span>
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
