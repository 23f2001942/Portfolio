"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2, Clock, Circle, Github } from "lucide-react";
import Image from "next/image";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const REPO_URL = "https://github.com/23f2001942/SpillSense";

const sections = [
  { id: "overview",     label: "Overview",                 indent: false },
  { id: "components",   label: "Components & BOM",         indent: false },
  { id: "architecture", label: "System Architecture",      indent: false },
  { id: "version-1",    label: "Version 1",                indent: false },
  { id: "stage-1",      label: "Stage 1 — Core Prototype", indent: true },
  { id: "stage-2",      label: "Stage 2 — Display & LEDs", indent: true },
  { id: "stage-3",      label: "Stage 3 — Bluetooth App",  indent: true },
  { id: "stage-4",      label: "Stage 4 — V1 PCB",         indent: true },
  { id: "version-2",    label: "Version 2",                indent: false },
  { id: "stage-5",      label: "Stage 5 — Schematic",      indent: true },
  { id: "stage-6",      label: "Stage 6 — PCB & Firmware", indent: true },
  { id: "results",      label: "Results & Status",         indent: false },
  { id: "learned",      label: "What I Learned",           indent: false },
];

const sectionIds = sections.map(s => s.id);

const timelineRows = [
  ["Oct 2020",            "Idea during the COVID-19 lockdown (10th grade), after milk boiled over at home one too many times"],
  ["Nov 2020",            "V1 prototype: Arduino Nano, MAX6675, buzzer, LCD/OLED, and LEDs"],
  ["Dec 2020 – Jan 2021", "V1 PCB designed in EasyEDA and fabricated"],
  ["Feb 2021",            "Milk_Temperature Android app built in MIT App Inventor, later dropped"],
  ["2021 – 2025",         "Paused through senior high school and early university"],
  ["Mar – Apr 2026",      "Revisited in Year 2, Semester 2; V2 planned around the XIAO ESP32-C3"],
  ["Now",                 "V2 schematic done in KiCad 10, PCB layout in progress"],
];

const specRows = [
  ["Sensor",             "K-type thermocouple + MAX6675 (SPI, cold-junction compensated)"],
  ["V1 Controller",      "Arduino Nano V3.0"],
  ["V2 Controller",      "Seeed XIAO ESP32-C3 (built-in WiFi)"],
  ["Alerts",             "Step beeps at 50–90 °C, continuous alarm at ≥ 98 °C"],
  ["Visual Indicator",   "V1: 4-LED temperature bar · V2: single RGB status LED"],
  ["Display",            "V1: 16x2 I2C LCD or SH1106 OLED · V2: SSD1306 OLED"],
  ["Power",              "5 V over USB"],
  ["PCB",                "V1: 2-layer EasyEDA (fabricated) · V2: 2-layer KiCad (in layout)"],
];

const v1Bom = [
  ["Arduino Nano V3.0",       "Microcontroller",          "Reads the sensor; drives buzzer, display, and LEDs"],
  ["MAX6675 breakout",        "Thermocouple amplifier",   "Cold-junction compensation, digital output over SPI"],
  ["K-type thermocouple",     "Temperature sensor",       "Junction sits in the milk"],
  ["Buzzer (SG1)",            "Audible alerts",           "Driven on/off from a GPIO pin"],
  ["16x2 LCD, I2C @ 0x27",    "Display (LCD version)",    "Temperature in °C and °F"],
  ["SH1106 128x64 OLED, I2C", "Display (OLED version)",   "\"Milk Temperature\" in °C and °F"],
  ["LEDs × 4 (LED1–LED4)",    "Temperature bar",          "Blue / Green / Yellow / Red at 60 / 70 / 80 / 90 °C"],
  ["220 Ω resistors × 4",     "LED current limiting",     "R1–R4 on the PCB"],
  ["Custom 2-layer PCB",      "Carrier board",            "Designed in EasyEDA, fabricated"],
  ["HC-05 Bluetooth",         "Phone link (dropped)",     "PCB footprint labelled HC_06"],
];

const v2Bom = [
  ["Seeed XIAO ESP32-C3",       "Microcontroller",        "Built-in WiFi replaces the HC-05"],
  ["MAX6675 HW-550 breakout",   "Thermocouple amplifier", "Screw terminal for the K-type probe"],
  ["SSD1306 OLED, I2C",         "Local display",          "Onboard 662K regulator and I2C pull-ups"],
  ["12 mm passive buzzer",      "Audible alerts",         "Driven directly from a GPIO"],
  ["5 mm RGB LED, common cathode", "Status indicator",    "Single solid colours, replaces the 4-LED bar"],
  ["220 Ω resistors × 3",       "LED current limiting",   "One per R/G/B channel, axial DIN0207"],
  ["Custom 2-layer PCB",        "Carrier board",          "To be made and assembled by LionCircuits"],
  ["3D-printed enclosure",      "Housing",                "Fusion 360, from the KiCad STEP export"],
];

const toolRows = [
  ["Arduino IDE",               "Writing and uploading V1 firmware",          "V1"],
  ["max6675.h",                 "Reading the MAX6675",                        "V1"],
  ["Wire.h + LiquidCrystal_I2C","I2C LCD",                                    "V1"],
  ["U8glib",                    "SH1106 OLED",                                "V1"],
  ["MIT App Inventor",          "Milk_Temperature Android app",               "V1 (dropped)"],
  ["EasyEDA",                   "V1 PCB and Gerbers",                         "V1"],
  ["KiCad 10",                  "V2 schematic and PCB",                       "V2"],
  ["Fusion 360",                "V2 enclosure",                               "V2"],
];

const v1Pins = [
  ["SO (MISO)",        "MAX6675 → Nano",        "D3"],
  ["CS",               "Nano → MAX6675",        "D4"],
  ["SCK",              "Nano → MAX6675",        "D5"],
  ["MAX6675 VCC / GND","Nano GPIO HIGH / LOW",  "D6 / D7"],
  ["Buzzer + / −",     "Nano → Buzzer",         "D8 / D9"],
  ["SDA / SCL",        "Nano → LCD/OLED",       "A4 / A5"],
  ["LED Blue + / −",   "Nano → LED",            "D11 / D10"],
  ["LED Green + / −",  "Nano → LED",            "D13 / D12"],
  ["LED Yellow + / −", "Nano → LED",            "A3 / A2"],
  ["LED Red + / −",    "Nano → LED",            "A1 / A0"],
  ["Bluetooth VCC",    "Nano GPIO HIGH (unused)","D2"],
];

const v2Pins = [
  ["SCK",        "XIAO → MAX6675",            "GPIO8"],
  ["MISO / SO",  "MAX6675 → XIAO",            "GPIO9"],
  ["CS",         "XIAO → MAX6675",            "GPIO10"],
  ["SDA",        "XIAO → OLED",               "GPIO6"],
  ["SCL",        "XIAO → OLED",               "GPIO7"],
  ["Buzzer",     "XIAO → Passive buzzer",     "GPIO4"],
  ["LED Red",    "XIAO → RGB LED (220 Ω)",    "GPIO2"],
  ["LED Green",  "XIAO → RGB LED (220 Ω)",    "GPIO3"],
  ["LED Blue",   "XIAO → RGB LED (220 Ω)",    "GPIO5"],
  ["+5 V",       "XIAO VBUS (pin 14) → MAX6675, OLED", "—"],
];

const capabilityRows: [string, string][] = [
  ["MAX6675 thermocouple reading in °C and °F",       "done"],
  ["Step beeps at 50 / 60 / 70 / 80 / 90 °C",         "done"],
  ["Continuous alarm at ≥ 98 °C",                     "done"],
  ["16x2 LCD and SH1106 OLED display versions",       "done"],
  ["Cumulative 4-LED temperature bar",                "done"],
  ["Running on the fabricated EasyEDA PCB",           "done"],
  ["Bluetooth phone alerts (HC-05 + Android app)",    "abandoned"],
  ["V2 schematic (KiCad 10)",                         "done"],
  ["V2 PCB layout",                                   "progress"],
  ["V2 fabrication and assembly (LionCircuits)",      "planned"],
  ["V2 enclosure (Fusion 360)",                       "planned"],
  ["V2 firmware",                                     "planned"],
  ["WiFi phone alerts",                               "planned"],
];

type BadgeKind = "done" | "progress" | "abandoned";

function StatusIcon({ status }: { status: string }) {
  if (status === "done")     return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (status === "progress") return <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
  if (status === "abandoned") return <Circle className="w-4 h-4 text-red-400/70 flex-shrink-0" />;
  return <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />;
}

function StatusBadge({ badge, label }: { badge: BadgeKind; label?: string }) {
  if (badge === "done")     return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">{label ?? "Completed"}</Badge>;
  if (badge === "progress") return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">{label ?? "In Progress"}</Badge>;
  return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">{label ?? "Abandoned"}</Badge>;
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

function VersionHeading({ id, title, subtitle, badge }: { id: string; title: string; subtitle: string; badge: BadgeKind }) {
  return (
    <div id={id} className="scroll-mt-24 rounded-xl border border-[hsl(var(--highlight)/0.3)] bg-[hsl(var(--highlight)/0.06)] px-5 py-4">
      <div className="flex flex-wrap items-center gap-3 mb-1">
        <h2 className="text-3xl font-bold text-[hsl(var(--highlight))]">{title}</h2>
        <StatusBadge badge={badge} />
      </div>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
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

function CodeBlock({ code, label = "cpp" }: { code: string; label?: string }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden mb-6 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <span className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
      </div>
      <pre className="bg-[hsl(216,35%,16%)] dark:bg-[hsl(0,0%,7%)] p-4 overflow-x-auto text-xs leading-relaxed text-[#a8c5e8]">
        <code>{code.trim()}</code>
      </pre>
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
    <div className="flex gap-3 mb-4">
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
    <div className="mt-8 p-4 rounded-lg bg-[hsl(var(--highlight)/0.06)] border border-[hsl(var(--highlight)/0.3)] text-sm text-muted-foreground flex gap-3">
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

function Figure({ src, alt, caption, width, height, className }: { src: string; alt: string; caption: string; width: number; height: number; className?: string }) {
  return (
    <figure className={cn("mb-6", className)}>
      <div className="rounded-xl border border-border overflow-hidden bg-white shadow-sm">
        <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
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
          <span className="text-[hsl(var(--highlight))] mt-0.5 flex-shrink-0">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SpillSensePage() {
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
            <span className="text-[hsl(var(--highlight))]">SpillSense</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-1">SpillSense</h1>
          <p className="text-lg text-[hsl(var(--highlight-sub))] font-medium mb-3">Smart Milk Froth Monitor</p>
          <p className="text-muted-foreground text-[0.95rem] max-w-2xl mb-4">
            A thermocouple-based device that watches milk heating on the stove and warns me before it boils over. It started as a 10th-grade lockdown project and is now being rebuilt around the XIAO ESP32-C3.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["Arduino", "ESP32-C3", "MAX6675", "Thermocouple", "PCB Design", "KiCad", "EasyEDA"].map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--highlight))] hover:underline">
              <Github className="w-3.5 h-3.5" /> View on GitHub
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border mb-10 bg-secondary">
          <Image src="/carousel/third.png" alt="SpillSense milk froth monitor next to a pot of milk on the stove" fill className="object-cover" priority />
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
                <button key={s.id} onClick={() => scrollTo(s.id)} className={cn("w-full text-left border-b border-border last:border-0", s.indent ? "px-8 py-2 text-xs" : "px-4 py-2.5 text-sm", activeSection === s.id ? "text-primary font-medium bg-secondary" : "text-muted-foreground")}>
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
                  <button key={s.id} onClick={() => scrollTo(s.id)} className={cn("w-full text-left rounded-md transition-colors", s.indent ? "pl-6 pr-3 py-1.5 text-xs" : "px-3 py-2 text-sm",
                    activeSection === s.id
                      ? "bg-[hsl(var(--highlight)/0.12)] text-[hsl(var(--highlight))] font-medium border-l-2 border-[hsl(var(--highlight))] rounded-l-none"
                      : s.indent ? "text-muted-foreground/70 hover:text-muted-foreground hover:bg-secondary/40" : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
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
              <SectionHeading id="overview" title="Overview" badge="progress" />
              <Para>
                SpillSense watches the temperature of milk heating on a stove and warns me before it boils over. A K-type thermocouple sits in the milk, a MAX6675 converts its signal into a digital temperature reading, and the microcontroller beeps at set temperature steps, lights up LEDs as the milk gets hotter, and sounds a continuous alarm once it&apos;s close to boiling. It&apos;s built for a very ordinary problem: milk left on the stove froths up, overflows, and wastes both milk and gas.
              </Para>
              <Para>
                I came up with the idea in October 2020, during the COVID-19 lockdown, when milk boiling over had become a regular problem at home. I was in 10th grade at FIITJEE World School, Hyderabad, and had picked up Arduino on my own, not through any formal course. Between October 2020 and February 2021 I built all of Version 1: the circuit, the firmware, a custom PCB in EasyEDA, and an Android app. I then set the project aside until March 2026, when my club work at BITS Pilani, Hyderabad Campus introduced me to the ESP32 and XIAO boards, and I started a more robust Version 2.
              </Para>
              <Para>
                <span className="font-medium text-primary">Status:</span> V1 was completed, fabricated on a PCB, and tested on real milk. V2 is under development. Its schematic is finished and the PCB layout is in progress, but nothing for V2 has been manufactured or tested yet.
              </Para>
              <SubHeading>Timeline</SubHeading>
              <Table headers={["When", "Milestone"]} rows={timelineRows} />
              <SubHeading>Key Specifications</SubHeading>
              <Table headers={["Parameter", "Value"]} rows={specRows} />
            </section>

            {/* COMPONENTS */}
            <section>
              <SectionHeading id="components" title="Components & Bill of Materials" />
              <SubHeading>Version 1 — Arduino Build (Final)</SubHeading>
              <Table headers={["Component", "Role", "Specs / Notes"]} rows={v1Bom} />
              <SubHeading>Version 2 — XIAO ESP32-C3 (Designed, Not Yet Built)</SubHeading>
              <Table headers={["Component", "Role", "Specs / Notes"]} rows={v2Bom} />
              <SubHeading>Software & Tools</SubHeading>
              <Table headers={["Tool", "Used For", "Version"]} rows={toolRows} />
            </section>

            {/* ARCHITECTURE */}
            <section>
              <SectionHeading id="architecture" title="System Architecture" />
              <Para>
                The signal chain is the same in both versions. The thermocouple junction sits in the milk and connects to the MAX6675&apos;s screw terminals. The MAX6675 talks to the microcontroller over a read-only, three-wire SPI interface (SCK, CS, SO). The microcontroller compares the temperature against fixed thresholds and drives the buzzer, the LEDs, and an I2C display. What changes between versions is the controller, the indicator, and how the device will reach my phone.
              </Para>
              <div className="flex flex-col items-center gap-0 my-6 max-w-lg mx-auto">
                <ArchNode title="Sensor" subtitle="K-type thermocouple in the milk"
                  items={["Junction measures milk temperature", "Connects to the MAX6675 screw terminals (+ / −)"]} />
                <ArrowDown label="thermocouple voltage" />
                <ArchNode title="MAX6675" subtitle="Thermocouple-to-digital converter"
                  items={["Cold-junction compensation", "~0.2 s per conversion"]} />
                <ArrowDown label="SPI: SCK / CS / SO" />
                <ArchNode accent title="Microcontroller" subtitle="V1: Arduino Nano · V2: XIAO ESP32-C3"
                  items={["Reads temperature in °C", "Checks fixed thresholds", "Drives buzzer, LEDs, and display"]} />
                <ArrowDown label="GPIO + I2C" />
                <div className="grid grid-cols-3 gap-3 w-full">
                  <ArchNode title="Display" items={["V1: 16x2 LCD / SH1106", "V2: SSD1306"]} />
                  <ArchNode title="Buzzer" items={["Step beeps", "≥ 98 °C alarm"]} />
                  <ArchNode title="LEDs" items={["V1: 4-LED bar", "V2: RGB LED"]} />
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  <div className="flex flex-col items-center">
                    <ArrowDown dashed label="V1: HC-05 Bluetooth" />
                    <ArchNode title="Android App" subtitle="Dropped" items={["Unreliable connection"]} />
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowDown dashed label="V2: WiFi" />
                    <ArchNode title="Phone Alerts" subtitle="Planned" items={["Not designed yet"]} />
                  </div>
                </div>
              </div>
              <SubHeading>V1 Pinout — Arduino Nano</SubHeading>
              <Para>Taken from <Code>Version1_OLED.ino</Code>. The fabricated PCB follows this pinout.</Para>
              <Table headers={["Signal", "Direction", "Pin"]} rows={v1Pins} />
              <Para>
                The first sketch, <Code>Version1_Prototype.ino</Code>, used a different pinout (SCK D3, CS D4, SO D5, with a shared LED ground on D8). The older schematic image shows yet another wiring from before the code settled. I treat the final code as the source of truth.
              </Para>
              <SubHeading>V2 Pinout — XIAO ESP32-C3</SubHeading>
              <Para>From the finalised Stage 5 schematic. VBUS (5 V from USB) powers the MAX6675 breakout and the OLED.</Para>
              <Table headers={["Signal", "Direction", "Pin"]} rows={v2Pins} />
            </section>

            {/* ================= VERSION 1 ================= */}
            <VersionHeading id="version-1" title="Version 1" subtitle="Arduino Nano · Oct 2020 – Feb 2021 · built, fabricated, and tested on real milk" badge="done" />

            {/* STAGE 1 */}
            <section>
              <SectionHeading id="stage-1" title="Stage 1 — Core Prototype" badge="done" />
              <Para>
                The first goal was simple: get a reliable temperature reading from the milk and sound an alert before it boils over. I wired an Arduino Nano to a MAX6675 and a K-type thermocouple on a breadboard and wrote threshold logic around it. I also wrote a project report covering the problem, the components, and future ideas: a display, Bluetooth, SMS/call alerts, and building the sensor into a stove or kettle.
              </Para>
              <Figure src="/spillsense/V1_Schematic.png" alt="Early V1 wiring diagram: Arduino Nano, MAX6675, HC-05, 16x2 LCD, and buzzer" width={2362} height={1792}
                caption="Early V1 wiring: Arduino Nano, MAX6675, HC-05, 16x2 I2C LCD, and buzzer. Pin assignments changed later; the final code is the source of truth." />
              <SubHeading>Reading the Thermocouple</SubHeading>
              <Para>The MAX6675 library wraps the SPI transaction, so reading the milk temperature is one call per pass of <Code>loop()</Code>.</Para>
              <CodeBlock label="Version1_LCD.ino — sensor setup and read" code={`MAX6675 thermocouple(sckPin, csPin, soPin);

void loop() {
  double temp = thermocouple.readCelsius();
  // ...threshold checks and display update
}`} />
              <SubHeading>Stepped Alerts</SubHeading>
              <Para>Each 10 °C step from 50 to 90 °C gives a short 100 ms beep, so I can hear the milk warming up from another part of the kitchen. At 98 °C and above the buzzer stays on as the &quot;come now&quot; alarm.</Para>
              <CodeBlock label="Version1_LCD.ino — threshold beeps" code={`if (temp >= 90 && temp <= 91) {   // same pattern at 50, 60, 70, 80
  digitalWrite(buzzVCC, HIGH);
  delay(100);
  digitalWrite(buzzVCC, LOW);
}

if (temp >= 98) {                  // continuous alarm
  digitalWrite(buzzVCC, HIGH);
  delay(100);
}`} />
              <SubHeading>Powering Modules From GPIO Pins</SubHeading>
              <Para>To let the MAX6675 plug straight into a row of Nano pins without extra wires to the power rails, I powered it from two GPIO pins, one driven HIGH and one LOW. The buzzer and LEDs use the same trick.</Para>
              <CodeBlock label="Version1_LCD.ino — GPIO power rails" code={`int ThermoVCC = 6;
int ThermoGND = 7;

digitalWrite(ThermoVCC, HIGH);   // module VCC
digitalWrite(ThermoGND, LOW);    // module GND`} />
              <SubHeading>Stage 1 Challenges</SubHeading>
              <Challenge title="Beeps could be missed">Each step alert only fires inside a 1 °C window (for example 50–51 °C). If the temperature jumps past a window between two readings, that beep never happens. Not fixed in V1.</Challenge>
              <Challenge title="The alarm can't be silenced">In the LCD version, once the buzzer turns on at 98 °C nothing turns it off until the temperature drops below 50 °C. Not fixed in V1.</Challenge>
              <Challenge title="GPIO-powered modules">A wiring shortcut that only works because these modules draw very little current. V2 powers them properly from VBUS.</Challenge>
              <NextBox label="What Stage 2 fixes:">The alerts worked, but I could only hear the temperature, not see it. The next step was adding a display.</NextBox>
            </section>

            {/* STAGE 2 */}
            <section>
              <SectionHeading id="stage-2" title="Stage 2 — Display & LED Bar" badge="done" />
              <Para>
                Stage 2 made the temperature visible. I built two display versions, and both worked on the hardware: a 16x2 I2C LCD (address 0x27) showing °C and °F, and an SH1106 128x64 OLED driven by U8glib. The OLED version also added four LEDs that light up cumulatively as a temperature bar, so I can tell how close the milk is to boiling at a glance.
              </Para>
              <SubHeading>Cumulative LED Bar</SubHeading>
              <Para>Each LED stays on above its threshold: blue at 60 °C, green at 70, yellow at 80, red at 90. The number of lit LEDs shows how hot the milk is.</Para>
              <CodeBlock label="Version1_OLED.ino — LED bar (condensed)" code={`if (temp >= 60) digitalWrite(blueVCC, HIGH);   else digitalWrite(blueVCC, LOW);
if (temp >= 70) digitalWrite(greenVCC, HIGH);  else digitalWrite(greenVCC, LOW);
if (temp >= 80) digitalWrite(yellowVCC, HIGH); else digitalWrite(yellowVCC, LOW);
if (temp >= 90) digitalWrite(redVCC, HIGH);    else digitalWrite(redVCC, LOW);`} />
              <SubHeading>OLED Page Loop</SubHeading>
              <Para>U8glib redraws the screen in horizontal strips instead of holding a full frame buffer, which saves RAM on the Nano. <Code>draw()</Code> prints &quot;Milk Temperature&quot; with the reading in °C and °F.</Para>
              <CodeBlock label="Version1_OLED.ino — U8glib picture loop" code={`u8g.firstPage();
do {
  draw();   // "Milk Temperature", °C and °F using char(176) for the degree sign
} while (u8g.nextPage());`} />
              <SubHeading>Stage 2 Challenges</SubHeading>
              <Challenge title="Reading the sensor too often">Each loop calls readCelsius() and readFahrenheit() several times in quick succession, but the MAX6675 needs about 0.2 s per conversion, so some of those reads just return the previous value. Nothing visibly broke, but it&apos;s something I&apos;m designing properly for V2.</Challenge>
              <Challenge title="Code and schematic drifted apart">Pin changes went into the code but never made it back into the schematic image. I resolved this by treating the final code as the source of truth.</Challenge>
              <NextBox label="What Stage 3 fixes:">A display only helps if I&apos;m standing next to the stove. To get warned from another room, I tried adding a wireless link to my phone.</NextBox>
            </section>

            {/* STAGE 3 */}
            <section>
              <SectionHeading id="stage-3" title="Stage 3 — Bluetooth & Android App" badge="abandoned" badgeLabel="Attempted, then abandoned" />
              <Para>
                The goal was to send the milk temperature to my phone and sound an alarm there, so I&apos;d be warned even when I&apos;d left the kitchen. I added an HC-05 Bluetooth module and built an Android app, <Code>Milk_Temperature</Code>, in MIT App Inventor (created 22 Feb 2021). The app had a Bluetooth device picker, a live &quot;Milk Temperature = __ °C&quot; readout, and a beep sound. The connection turned out to be unreliable, so I removed Bluetooth from the final V1 firmware and relied on the buzzer and LEDs.
              </Para>
              <Figure src="/spillsense/V1_App.png" alt="Milk_Temperature Android app screen built in MIT App Inventor" width={308} height={546} className="max-w-[240px] mx-auto"
                caption="The Milk_Temperature app (MIT App Inventor)" />
              <SubHeading>App Logic</SubHeading>
              <Para>The phone lists paired devices, connects to the chosen HC-05, and on every Clock tick reads whatever bytes have arrived and shows them as the temperature. Above 97 °C it plays the alarm.</Para>
              <CodeBlock label="Milk_Temperature — App Inventor blocks as pseudocode" code={`when ListPicker1.BeforePicking:
  ListPicker1.Elements = BluetoothClient1.AddressesAndNames
when ListPicker1.AfterPicking:
  ListPicker1.Selection = BluetoothClient1.Connect(ListPicker1.Selection)

when Clock1.Timer:
  if BluetoothClient1.IsConnected:
    name = BluetoothClient1.ReceiveText(BluetoothClient1.BytesAvailableToReceive)
    Label4.Text = name
    if name > 97:
      Sound1.Play
      Sound1.Stop`} />
              <SubHeading>Stage 3 Challenges</SubHeading>
              <Challenge title="Unreliable Bluetooth connection">Connections dropped and weren&apos;t dependable enough to trust for an alarm. Not solved. I dropped Bluetooth and moved to local alerts.</Challenge>
              <Challenge title="Timing mismatch">The app read the Bluetooth buffer every second, but the Arduino only sent a reading about every 2 seconds because of its own delays and display redraws. The app often got an empty or half-received buffer, so both the displayed value and the &quot;&gt; 97&quot; check were unreliable. Looking back, I&apos;d send each reading as a complete line with println() and have the app only read whole lines.</Challenge>
              <Challenge title="Alarm cut off instantly">The blocks call Sound1.Play and then Sound1.Stop immediately after, so the beep was cut short or barely audible. Not solved.</Challenge>
              <NextBox label="What this taught V2:">Phone alerts are the most useful feature, but the HC-05 was the weakest part of the design. That&apos;s the main reason V2 moves to a microcontroller with WiFi built in.</NextBox>
            </section>

            {/* STAGE 4 */}
            <section>
              <SectionHeading id="stage-4" title="Stage 4 — V1 PCB (EasyEDA)" badge="done" badgeLabel="Completed (fabricated)" />
              <Para>
                To get the circuit off the breadboard, I designed a 2-layer PCB in EasyEDA with footprints for the Arduino Nano, the MAX6675 header, the OLED header, an HC_06 header, the buzzer (SG1), four LEDs (LED1–LED4), and four 220 Ω resistors (R1–R4). It was routed to the <Code>Version1_OLED.ino</Code> pinout and fabricated. It was my first PCB, and a very basic one, designed with what I knew at the time.
              </Para>
              <Figure src="/spillsense/V1_PCB.jpg" alt="Fabricated V1 PCB, top and bottom layers" width={1695} height={671}
                caption="The fabricated V1 board, top (left) and bottom (right): Nano, MAX6675, OLED and HC_06 headers, buzzer SG1, LED1–LED4, R1–R4" />
              <SubHeading>Stage 4 Challenges</SubHeading>
              <Challenge title="The board was bigger than it needed to be">The layout was spread out and could have been made much more compact. V2 is being laid out with size in mind from the start.</Challenge>
              <Challenge title="Four LEDs where one would do">Four separate LEDs, each with its own resistor and pair of GPIO pins, took up board space and pins. A single multi-colour LED can show the same states, and that&apos;s what V2 uses.</Challenge>
              <NextBox label="What Version 2 fixes:">Everything I&apos;ve learned since: a better microcontroller, KiCad instead of EasyEDA, a real manufacturer&apos;s design rules, a compact layout, and one RGB LED instead of four.</NextBox>
            </section>

            {/* ================= VERSION 2 ================= */}
            <VersionHeading id="version-2" title="Version 2" subtitle="XIAO ESP32-C3 · Mar 2026 – present · under development, nothing built or tested yet" badge="progress" />

            {/* STAGE 5 */}
            <section>
              <SectionHeading id="stage-5" title="Stage 5 — Hardware Redesign & Schematic" badge="done" badgeLabel="Completed (schematic)" />
              <Para>
                I came back to the project after working with ESP32 and XIAO boards in my club work at BITS Pilani, Hyderabad Campus. The goal for this stage was to rebuild the device around the XIAO ESP32-C3 with cleaner power, a proper PCB, and an enclosure, without adding new features yet. I chose the ESP32-C3 so built-in WiFi can eventually replace Bluetooth.
              </Para>
              <BulletList items={[
                "Picked the V2 parts: MAX6675 HW-550 breakout, SSD1306 OLED, 12 mm passive buzzer, and a common-cathode RGB LED with three 220 Ω resistors.",
                "Finalised the GPIO map (see System Architecture).",
                "Drew the schematic in KiCad 10 with direct wires and PWR_FLAGs on +5V and GND.",
                "Every module is powered from VBUS instead of GPIO pins.",
                "Kept the scope strict. App and alert logic are deliberately left for later.",
              ]} />
              <SubHeading>Stage 5 Challenges</SubHeading>
              <Challenge title="Placing the bare MAX6675 would cost too much">Putting the SOIC-8 chip directly on the board would raise PCB assembly cost, so I switched to the HW-550 breakout board. Fixed.</Challenge>
              <Challenge title="Pull-ups and regulation">An SSD1306 module with an onboard 662K regulator and I2C pull-ups needs no extra parts and is safe to run from 5 V. Fixed.</Challenge>
              <NextBox label="What Stage 6 fixes:">With a finished schematic and pin map, the board can now be laid out for manufacturing.</NextBox>
            </section>

            {/* STAGE 6 */}
            <section>
              <SectionHeading id="stage-6" title="Stage 6 — PCB Layout, Enclosure & Firmware" badge="progress" />
              <Para>
                The next step is laying out the 2-layer board for LionCircuits, designing an enclosure around it, and then writing and testing the V2 firmware. This stage is under active development. There&apos;s no V2 firmware or hardware to show yet.
              </Para>
              <SubHeading>Design Rules — LionCircuits Standard</SubHeading>
              <Para>I set the board rules to match the manufacturer before starting the layout, so I won&apos;t have to redo it later.</Para>
              <Table headers={["Rule", "Value"]} rows={[
                ["Minimum clearance",   "0.1524 mm"],
                ["Minimum track width", "0.1524 mm"],
                ["Minimum drill",       "0.3 mm"],
                ["Via (diameter / drill)", "0.8 / 0.4 mm"],
                ["Signal tracks",       "0.25 mm"],
                ["Power tracks",        "0.5 mm"],
              ]} />
              <SubHeading>Current Progress</SubHeading>
              <div className="space-y-2.5 mt-4 mb-4">
                {([
                  ["Stage 5 schematic finalised in KiCad 10",           "done"],
                  ["Board design rules set to LionCircuits Standard",   "done"],
                  ["2-layer PCB layout",                                "progress"],
                  ["STEP export → Fusion 360 enclosure",                "planned"],
                  ["Fabrication and assembly by LionCircuits",          "planned"],
                  ["V2 firmware",                                       "planned"],
                  ["WiFi phone alerts and app",                         "planned"],
                ] as [string, string][]).map(([label, status]) => (
                  <div key={label} className="flex items-center gap-3">
                    <StatusIcon status={status} />
                    <span className={cn("text-sm", status === "done" ? "text-primary font-medium" : status === "progress" ? "text-muted-foreground" : "text-muted-foreground/50")}>{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RESULTS */}
            <section>
              <SectionHeading id="results" title="Results & Status" />
              <Para>V1 was tested on real milk at the time and worked on the fabricated PCB. V2 is under development, and none of it has been built or tested yet.</Para>
              <div className="space-y-2 mb-6">
                {capabilityRows.map(([label, status]) => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <StatusIcon status={status} />
                    <span className={cn("text-sm", status === "done" ? "text-primary" : "text-muted-foreground")}>{label}</span>
                    <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                      {status === "done" ? "Confirmed" : status === "progress" ? "In development" : status === "abandoned" ? "Dropped" : "Planned"}
                    </span>
                  </div>
                ))}
              </div>
              <SubHeading>Designed Thresholds</SubHeading>
              <Table headers={["Event", "Temperature"]} rows={[
                ["Short beep",        "50, 60, 70, 80, 90 °C (1 °C windows)"],
                ["Continuous alarm",  "≥ 98 °C"],
                ["LED bar",           "Blue 60 · Green 70 · Yellow 80 · Red 90 °C"],
                ["App alarm (dropped)", "> 97 °C"],
              ]} />
              <SubHeading>Known V1 Limitations</SubHeading>
              <BulletList items={[
                "The 1 °C beep windows can be skipped entirely if the temperature rises quickly.",
                "The alarm can't be silenced.",
                "The sensor is polled faster than the MAX6675's conversion time.",
                "No phone alerts, because Bluetooth was dropped.",
                "It doesn't detect froth directly. It assumes a temperature near 98 °C means the milk is about to boil over.",
              ]} />
              <Para>
                I haven&apos;t yet measured sensor accuracy against a reference thermometer, the actual froth temperature, or how much warning the 98 °C alarm gives. Those measurements are planned for V2.
              </Para>
            </section>

            {/* WHAT I LEARNED */}
            <section>
              <SectionHeading id="learned" title="What I Learned" />
              <ul className="space-y-4">
                {[
                  "A thermocouple can't be read directly. It needs an amplifier with cold-junction compensation, which is exactly what the MAX6675 is for.",
                  "A 1 °C window is a fragile threshold. If the reading jumps past it between two samples, the event just never happens.",
                  "When two devices talk to each other, their timing has to match. My app checked every second while the Arduino sent roughly every two seconds, and that alone made the readings unreliable.",
                  "How the data is framed matters as much as the connection. One complete line per reading would have fixed half my app problems.",
                  "It's fine to drop a feature that doesn't work. Removing Bluetooth left me with a simpler device I could actually trust.",
                  "Code and schematic need to stay in sync. Mine drifted apart, and I had to work out later which one was correct.",
                  "On a student budget, a breakout board can make more sense than placing the bare chip, because assembly costs add up.",
                  "Picking modules with onboard regulators and pull-ups keeps the schematic small.",
                  "Setting the manufacturer's design rules before starting the layout saves redoing the board later.",
                  "My first PCB was far bigger than it needed to be, and four LEDs did a job one RGB LED can do. Compactness is something I now plan for from the start.",
                  "Coming back to a 10th-grade project years later showed me how much my approach has changed, from a basic EasyEDA board to a planned, staged KiCad design.",
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
