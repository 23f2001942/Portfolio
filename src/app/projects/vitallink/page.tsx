"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2, Clock, Circle, Github, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { Diamond, BullsEye, SpecRow } from "@/components/list-markers";

const REPO_URL = "https://github.com/23f2001942/VitalLink";

const sections = [
  { id: "overview",     label: "Overview" },
  { id: "components",   label: "Components & BOM" },
  { id: "architecture", label: "System Architecture" },
  { id: "stage-1",      label: "Stage 1 — Sensor Bring-up" },
  { id: "stage-2",      label: "Stage 2 — Shared I2C Bus" },
  { id: "stage-3",      label: "Stage 3 — First Wireless Link" },
  { id: "stage-4",      label: "Stage 4 — Reconnect Logic" },
  { id: "stage-5",      label: "Stage 5 — Status & Dashboard" },
  { id: "results",      label: "Results & Status" },
  { id: "learned",      label: "What I Learned" },
];

const sectionIds = sections.map(s => s.id);

const timelineRows = [
  ["April 2025",         "Project started; bench tests of the MLX90614 (BodyTemp.ino) and MAX30102 (SpO2.ino)"],
  ["April – May 2025",   "Both sensors combined on one I2C bus (Combined.ino)"],
  ["April – May 2025",   "Wi-Fi/TCP firmware iterations V1 → V4, plus the Receiver.m MATLAB script"],
  ["May 2025",           "MATLAB App Designer dashboard (App.mlapp) finalised"],
  ["8 May 2025",         "Final submission for BITS F235; project complete"],
];

const specRows = [
  ["Microcontroller",  "Seeed Studio XIAO ESP32-C3 with external 2.4 GHz antenna"],
  ["SpO₂ Sensor",      "MAX30102 (Red + IR PPG), Maxim SpO₂ algorithm"],
  ["Temperature",      "MLX90614 non-contact infrared (object temperature)"],
  ["Sensor Bus",       "Shared I2C at 100 kHz (standard mode)"],
  ["Wireless Link",    "Wi-Fi 2.4 GHz station → raw TCP client → port 5050"],
  ["Message Format",   "Newline-terminated ASCII, e.g. STATUS=Data,SPO2=96,TEMP=32.13"],
  ["Update Rate",      "≈ one reading every 5–6 s (calculated from the code, not measured)"],
  ["Power",            "USB-C to the XIAO; sensors from the 5V pin; no battery"],
  ["Dashboard",        "MATLAB App Designer, R2024b only"],
];

const hardwareBom = [
  ["Seeed Studio XIAO ESP32-C3",   "1",          "Reads both sensors over I2C, runs the SpO₂ algorithm, sends data over Wi-Fi"],
  ["Seeed 2.4 GHz antenna (2.4G A-02)", "1",     "External antenna for the XIAO's Wi-Fi"],
  ["MAX30102 module",              "1",          "Red + IR PPG signal for SpO₂"],
  ["MLX90614 module",              "1",          "Non-contact object temperature"],
  ["Solderless breadboard",        "1",          "Holds the prototype"],
  ["Jumper wires",                 "As needed",  "I2C and power connections"],
  ["USB-C cable",                  "1",          "Powers the XIAO; both sensors run from its 5V pin"],
];

const toolRows = [
  ["Arduino IDE + ESP32 Arduino core", "Firmware, WiFi.h, WiFiClient.h"],
  ["SparkFun MAX3010x library",        "MAX30105.h driver and Maxim's spo2_algorithm.h"],
  ["Adafruit MLX90614 library",        "MLX90614 driver"],
  ["Wire.h",                           "I2C"],
  ["MATLAB R2024b Update 5",           "Dashboard runtime (fails in R2024a, R2025a and R2025b)"],
  ["MATLAB App Designer",              "GUI (App.mlapp)"],
  ["tcpserver, configureCallback, timer", "Receiving data and watching the connection; base MATLAB, no toolboxes"],
];

const pinRows = [
  ["SDA", "MAX30102 SDA + MLX90614 SDA → XIAO", "D4 / GPIO6"],
  ["SCL", "MAX30102 SCL + MLX90614 SCL → XIAO", "D5 / GPIO7"],
  ["VIN", "Both sensors → XIAO",                "5V"],
  ["GND", "Both sensors → XIAO",                "GND"],
  ["INT", "MAX30102",                           "Not connected / not used"],
];

const packetRows = [
  ["V1 – V3",     "SPO2=<int or \"Invalid\">,TEMP=<float, 2 dp>"],
  ["V4 (final)",  "STATUS=NoFinger"],
  ["V4 (final)",  "STATUS=Stabilizing"],
  ["V4 (final)",  "STATUS=Data,SPO2=<int, or -1 if invalid>,TEMP=<float, 2 dp>"],
];

const capabilityRows: [string, string][] = [
  ["Both sensors reading on a shared 100 kHz I2C bus",          "done"],
  ["Finger placement and removal detection",                     "done"],
  ["SpO₂ and object temperature sent over Wi-Fi/TCP",            "done"],
  ["Live display in the MATLAB App Designer dashboard",          "done"],
  ["Automatic Wi-Fi and TCP reconnect on the ESP32",             "done"],
  ["\"Connection Lost\" after 12.5 s with no data",              "done"],
];

type BadgeKind = "done" | "progress";

function StatusIcon({ status }: { status: string }) {
  if (status === "done")     return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (status === "progress") return <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
  return <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />;
}

function StatusBadge({ badge, label }: { badge: BadgeKind; label?: string }) {
  if (badge === "done") return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">{label ?? "Completed"}</Badge>;
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
  return <SpecRow title={title}>{children}</SpecRow>;
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
          <Diamond />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function VitalLinkPage() {
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
            <span className="text-[hsl(var(--highlight))]">VitalLink</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-1">VitalLink</h1>
          <p className="text-lg text-[hsl(var(--highlight-sub))] font-medium mb-3">Wireless SpO₂ & Temperature Monitor</p>
          <p className="text-muted-foreground text-[0.95rem] max-w-2xl mb-4">
            A XIAO ESP32-C3 reads blood oxygen from a MAX30102 and skin temperature from an MLX90614, then streams both over Wi-Fi to a live MATLAB dashboard. Built as my Digital Fundamentals (BITS F235) course project.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["XIAO ESP32-C3", "MAX30102", "MLX90614", "I2C", "Wi-Fi/TCP", "MATLAB App Designer"].map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--highlight))] hover:underline">
              <Github className="w-3.5 h-3.5" /> View on GitHub
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border mb-6 bg-secondary">
          <Image src="/images/VitalLink.png" alt="VitalLink breadboard prototype with the XIAO ESP32-C3, MAX30102, MLX90614 and a 2.4 GHz antenna" fill className="object-cover" priority />
        </div>

        {/* Disclaimer */}
        <div className="mb-10 p-4 rounded-lg bg-red-500/5 border border-red-500/30 text-sm text-muted-foreground flex gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-red-400">Disclaimer: </span>
            VitalLink is a student learning prototype. It is not a medical device, it has not been validated against reference instruments, and its readings should not be used to diagnose, monitor, or make any decision about anyone&apos;s health.
          </div>
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
              <SectionHeading id="overview" title="Overview" badge="done" badgeLabel="Completed (course prototype)" />
              <Para>
                VitalLink is a small breadboard prototype built around a Seeed Studio XIAO ESP32-C3. It reads blood oxygen saturation (SpO₂) from a MAX30102 optical sensor and non-contact temperature from an MLX90614 infrared sensor, then sends both readings over Wi-Fi, as plain-text lines over a TCP connection, to a MATLAB App Designer dashboard that shows them live. It started life as the course project &quot;Wireless SpO₂ and Temperature Monitoring with ESP32-C3&quot;; VitalLink is the name I use for it now.
              </Para>
              <Para>
                I built it in April–May 2025 for Digital Fundamentals (BITS F235), in the Department of Mechanical Engineering at BITS Pilani, Hyderabad Campus. The goal I set in my report was a compact, Wi-Fi-enabled prototype for remote health monitoring using lightweight hardware and MATLAB-based software. It&apos;s a learning prototype for exploring remote vital-sign monitoring, not something meant for real patients.
              </Para>
              <Para>
                <span className="font-medium text-primary">Status:</span> Completed as a course prototype. The full pipeline of sensors → XIAO → Wi-Fi/TCP → MATLAB GUI works end to end on a breadboard.
              </Para>
              <SubHeading>Timeline</SubHeading>
              <Table headers={["When", "Milestone"]} rows={timelineRows} />
              <SubHeading>Key Specifications</SubHeading>
              <Table headers={["Parameter", "Value"]} rows={specRows} />
            </section>

            {/* COMPONENTS */}
            <section>
              <SectionHeading id="components" title="Components & Bill of Materials" />
              <SubHeading>Hardware</SubHeading>
              <Table headers={["Component", "Qty", "Purpose"]} rows={hardwareBom} />
              <Para>No battery was used. The whole build runs off the XIAO&apos;s USB-C connection.</Para>
              <SubHeading>Software & Tools</SubHeading>
              <Table headers={["Tool", "Used For"]} rows={toolRows} />
              <Para>
                <span className="font-medium text-primary">Note:</span> the dashboard only runs in MATLAB R2024b. I tried it in R2024a, R2025a and R2025b, and it failed in all three, so anyone reproducing it needs R2024b.
              </Para>
            </section>

            {/* ARCHITECTURE */}
            <section>
              <SectionHeading id="architecture" title="System Architecture" />
              <Para>
                Both sensors share one I2C bus to the XIAO, forced to 100 kHz. The XIAO checks for a finger by averaging 10 IR samples (an average of at least 10000 means a finger is present). If one is there, it collects 100 Red + 100 IR samples, runs Maxim&apos;s <Code>maxim_heart_rate_and_oxygen_saturation()</Code>, and reads the MLX90614 object temperature. It joins Wi-Fi as a station and opens a TCP client connection to the laptop running MATLAB on port 5050. MATLAB runs a <Code>tcpserver</Code> whose line-terminator callback parses each message and updates the GUI, while a 1 s timer watches for the data stopping.
              </Para>
              <div className="flex flex-col items-center gap-0 my-6 max-w-lg mx-auto">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <ArchNode title="MAX30102" subtitle="Pulse oximeter" items={["Red + IR PPG", "I2C 0x57"]} />
                  <ArchNode title="MLX90614" subtitle="IR thermometer" items={["Object temperature", "I2C 0x5A"]} />
                </div>
                <ArrowDown label="I2C @ 100 kHz (D4 / D5)" />
                <ArchNode accent title="XIAO ESP32-C3" subtitle="Firmware V4"
                  items={["Finger detect (10-sample IR average)", "100-sample Maxim SpO₂ algorithm", "Builds STATUS=… text lines"]} />
                <ArrowDown label="Wi-Fi 2.4 GHz · TCP client → :5050 · text lines" />
                <ArchNode title="MATLAB tcpserver" subtitle="App.mlapp (R2024b)"
                  items={["configureCallback on each \\n terminator", "Parses STATUS / SPO2 / TEMP"]} />
                <ArrowDown label="updateReadings()" />
                <div className="grid grid-cols-2 gap-3 w-full">
                  <ArchNode title="GUI" items={["SpO₂ + Temp fields", "Status label, 2 lamps"]} />
                  <ArchNode title="1 s Timer" items={["No data for > 12.5 s", "→ \"Connection Lost\""]} />
                </div>
              </div>
              <Para>The transport is plain Wi-Fi with raw TCP. It doesn&apos;t use UDP, HTTP, MQTT, BLE, or ThingSpeak.</Para>

              <SubHeading>Wiring</SubHeading>
              <Para>
                These are the XIAO ESP32-C3&apos;s default I2C pins, since the code calls <Code>Wire.begin()</Code> with no pin arguments. The comment in <Code>SpO2.ino</Code> also says <Code>Default I2C for XIAO ESP32C3 (D4/D5)</Code>.
              </Para>
              <Figure src="/vitallink/XIAO_Pinout.png" alt="Seeed Studio XIAO ESP32-C3 pinout diagram" width={1280} height={720}
                caption="XIAO ESP32-C3 pinout. SDA is D4 / GPIO6, SCL is D5 / GPIO7 (source: Seeed Studio)" />
              <Table headers={["Signal", "Connection", "XIAO Pin"]} rows={pinRows} />
              <SubHeading>I2C Addresses</SubHeading>
              <Para>Library defaults; the code never sets them explicitly.</Para>
              <Table headers={["Sensor", "Address"]} rows={[["MAX30102", "0x57"], ["MLX90614", "0x5A"]]} />
              <SubHeading>Packet Format</SubHeading>
              <Para>Each message is ASCII text, one message per line, ending with <Code>\n</Code>.</Para>
              <Table headers={["Firmware", "Message"]} rows={packetRows} />
            </section>

            {/* STAGE 1 */}
            <section>
              <SectionHeading id="stage-1" title="Stage 1 — Sensor Bring-up on the Bench" badge="done" />
              <Para>
                The goal was to get each sensor talking to the XIAO on its own before combining anything. I tested the MLX90614 by itself, printing ambient and object temperature once a second over Serial. Then I tested the MAX30102 by itself at 400 kHz fast-mode I2C: detect a finger, wait 1 s, take 100 samples, and compute SpO₂. If the reading was invalid, the sketch asked me to lift and re-place my finger.
              </Para>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Figure src="/vitallink/MAX30102.png" alt="MAX30102 module pinout" width={339} height={369} className="max-w-[260px] w-full mx-auto"
                  caption="MAX30102 module pinout (source: Last Minute Engineers)" />
                <Figure src="/vitallink/MLX90614.png" alt="MLX90614 module pinout" width={465} height={377} className="max-w-[300px] w-full mx-auto"
                  caption="MLX90614 module pinout (source: Last Minute Engineers)" />
              </div>
              <SubHeading>Ambient vs Object Temperature</SubHeading>
              <Para>The MLX90614 reports two temperatures: its own die (ambient) and whatever it&apos;s pointed at (object). Seeing both side by side helped me understand that &quot;object&quot; is the one I actually want.</Para>
              <CodeBlock label="BodyTemp.ino — Serial test" code={`
float ambientTemp = mlx.readAmbientTempC();
float objectTemp = mlx.readObjectTempC();

Serial.print("Ambient Temp: ");
Serial.print(ambientTemp);
Serial.print(" °C\\t");

Serial.print("Object Temp: ");
Serial.print(objectTemp);
Serial.println(" °C");

delay(1000); // Update every second`} />
              <SubHeading>Sliding-Window SpO₂</SubHeading>
              <Para>After the first valid reading, <Code>SpO2.ino</Code> keeps the newest 90 samples, adds 10 new ones, and recalculates. Reusing 90 % of the buffer gives a new SpO₂ value every 10 samples instead of every 100. It also prints raw IR/RED values so I could watch the signal.</Para>
              <CodeBlock label="SpO2.ino — continuous monitoring" code={`
// Shift 90 old samples
for (int i = 10; i < 100; i++) {
  redBuffer[i - 10] = redBuffer[i];
  irBuffer[i - 10] = irBuffer[i];
}

// Read 10 new samples
for (int i = 90; i < 100; i++) {
  while (!particleSensor.available()) particleSensor.check();
  redBuffer[i] = particleSensor.getRed();
  irBuffer[i] = particleSensor.getIR();
  // ...
}

// Recalculate SpO₂
maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer,
    &spo2, &validSPO2, &heartRate, &validHeartRate);`} />
              <SubHeading>Stage 1 Challenges</SubHeading>
              <Challenge title="Invalid SpO₂ readings">The algorithm sometimes flagged a reading as invalid, most likely from poor finger placement. The sketch detects the invalid flag and tells me to reposition my finger.</Challenge>
              <Challenge title="Halting on a missing sensor">The only error handling was stopping at <Code>while(1)</Code> if a sensor wasn&apos;t found. Fine for bench testing, but it carried forward into every later version.</Challenge>
              <NextBox label="What Stage 2 fixes:">With both sensors confirmed working individually, any failure in the next stage had to come from putting them together, not from a bad sensor.</NextBox>
            </section>

            {/* STAGE 2 */}
            <section>
              <SectionHeading id="stage-2" title="Stage 2 — Both Sensors on One I2C Bus" badge="done" />
              <Para>
                Next I ran the MAX30102 and MLX90614 together from one sketch, <Code>Combined.ino</Code>. Both sensors went onto the same I2C lines, the bus dropped to 100 kHz standard mode, and the MAX30102 was configured for Red+IR at 100 Hz with 4× averaging. I added IR-based finger detection, a 750 ms &quot;stabilizing&quot; wait, and an automatic restart when the finger is removed.
              </Para>
              <SubHeading>Sharing the Bus</SubHeading>
              <Para>Forcing both the bus and the MAX30102 driver to 100 kHz is what finally let the two sensors coexist.</Para>
              <CodeBlock label="Combined.ino — setup()" code={`
Wire.begin();
Wire.setClock(100000);  // Shared I2C speed

if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
  Serial.println("MAX30102 not found.");
  while (1);
}
particleSensor.setup(60, 4, 2, 100, 411, 4096);`} />
              <Para>
                The <Code>setup()</Code> arguments are LED brightness 60, 4-sample averaging, Red+IR mode, 100 Hz sample rate, 411 µs pulse width and a 4096 ADC range.
              </Para>
              <SubHeading>Finger Detection</SubHeading>
              <Para>With no finger on the sensor, very little IR light reflects back, so the 10-sample average stays under the 10000 threshold.</Para>
              <CodeBlock label="Combined.ino — wait for finger" code={`
long avgIR = irSum / 10;

if (avgIR >= 10000) {
  Serial.println("Finger detected. Stabilizing...");
  delay(750);
  break;  // Exit loop and begin measurement
} else {
  Serial.println("No finger detected. Please place finger.");
  delay(500);
}`} />
              <SubHeading>One Reading</SubHeading>
              <Para>The Maxim algorithm returns SpO₂ with a validity flag, and I only trust the number when that flag is set.</Para>
              <CodeBlock label="Combined.ino — measurement" code={`
maxim_heart_rate_and_oxygen_saturation(irBuffer, 100, redBuffer,
    &spo2, &validSPO2, &heartRate, &validHeartRate);

float temp = mlx.readObjectTempC();

Serial.print("SpO₂: ");
Serial.print(validSPO2 ? String(spo2) : "Invalid");
Serial.print(" % | Temp: ");
Serial.print(temp);
Serial.println(" °C");`} />
              <SubHeading>Stage 2 Challenges</SubHeading>
              <Challenge title="I2C conflict">Readings were unstable with both sensors on the bus. I also tried adding an OLED display, which caused bus conflicts too. Dropping the bus to 100 kHz and removing the OLED completely fixed it, which is why no OLED code survives in the repo.</Challenge>
              <Challenge title="400 kHz → 100 kHz">The standalone <Code>SpO2.ino</Code> ran the MAX30102 at <Code>I2C_SPEED_FAST</Code>. Sharing the bus with the MLX90614 meant switching to <Code>I2C_SPEED_STANDARD</Code>.</Challenge>
              <Challenge title="Sliding window dropped">This sketch and every later version went back to collecting a full 100 fresh samples per reading, which made updates slower. I don&apos;t remember why I made that change.</Challenge>
              <Challenge title="Heart rate left unused">The algorithm calculates heart rate, but I never printed or sent it. Unused, not broken.</Challenge>
              <Challenge title="No filtering or calibration">No motion-artifact handling, ambient-light rejection or calibration beyond what&apos;s built into the Maxim algorithm and the sensor&apos;s own averaging. Still unaddressed.</Challenge>
              <NextBox label="What Stage 3 fixes:">One sketch now produced a SpO₂ + temperature pair. The only thing left was getting that pair off the board and onto the laptop.</NextBox>
            </section>

            {/* STAGE 3 */}
            <section>
              <SectionHeading id="stage-3" title="Stage 3 — First Wireless Link to MATLAB" badge="done" />
              <Para>
                <Code>MATLABWiFi_V1.ino</Code> added Wi-Fi station mode and a <Code>WiFiClient</Code> TCP connection to my laptop on port 5050, and packed each reading into a text line. On the laptop, a simple script, <Code>Receiver.m</Code>, started a <Code>tcpserver</Code>, read lines, split them on <Code>,</Code> and <Code>=</Code>, and printed the values to the command window.
              </Para>
              <SubHeading>Sending a Line</SubHeading>
              <Para>A newline-terminated text line is easy to read on both ends and easy to debug in the Serial Monitor.</Para>
              <CodeBlock label="MATLABWiFi_V1.ino — building the message" code={`
String data = "SPO2=";
data += (validSPO2 ? String(spo2) : "Invalid");
data += ",TEMP=";
data += String(temp, 2);
data += "\\n";

Serial.print("Sent: "); Serial.print(data);

if (client.connected()) {
  client.print(data);
} else {
  Serial.println("Disconnected. Reconnecting...");
  client.stop();
  client.connect(host, port);
}`} />
              <SubHeading>Receiving It</SubHeading>
              <Para>The script checks the token count, so a broken line gets reported as &quot;Malformed data&quot; instead of crashing it.</Para>
              <CodeBlock label="Receiver.m — MATLAB" code={`
tcpServer = tcpserver("0.0.0.0", 5050, 'Timeout', 60);
disp("Waiting for ESP32 connection...");

while true
    if tcpServer.NumBytesAvailable > 0
        data = readline(tcpServer);
        tokens = split(data, {',', '='});

        if numel(tokens) == 4
            spo2 = str2double(tokens{2});
            temp = str2double(tokens{4});
            fprintf("SPO2: %.1f %% | Temp: %.2f °C\\n", spo2, temp);
        else
            fprintf("Malformed data: %s\\n", data);
        end
    end
    pause(0.1);
end`} />
              <SubHeading>Stage 3 Challenges</SubHeading>
              <Challenge title="Startup blocking">If MATLAB wasn&apos;t already listening, the board just stopped, because V1 calls <Code>while(1)</Code> when the first <Code>client.connect()</Code> fails. Fixed in V2.</Challenge>
              <Challenge title="&quot;Invalid&quot; becomes NaN">The firmware sends the literal text &quot;Invalid&quot; for a bad SpO₂ reading, and <Code>str2double</Code> turns it into NaN. Fixed in V4 and the App.</Challenge>
              <Challenge title="Polling">The receiver checks for new bytes in an endless loop every 0.1 s. It&apos;s a busy-wait, not event-driven. Replaced by an event callback in the App.</Challenge>
              <NextBox label="What Stage 4 fixes:">Data was reaching MATLAB, but only while everything stayed connected. The next step was making the link survive dropouts.</NextBox>
            </section>

            {/* STAGE 4 */}
            <section>
              <SectionHeading id="stage-4" title="Stage 4 — Recovering From Dropouts (V2, V3)" badge="done" />
              <Para>
                <Code>MATLABWiFi_V2.ino</Code> added two helpers: <Code>ensureWiFiConnected()</Code>, which retries Wi-Fi for up to 10 s, and <Code>ensureTCPConnected()</Code>, which reopens the TCP socket. Both are called at the top of <Code>loop()</Code> and inside the finger-wait and measurement loops, and the startup halt is gone, so the board keeps running even if MATLAB isn&apos;t up yet. <Code>MATLABWiFi_V3.ino</Code> keeps the same logic, targets a different Wi-Fi network and server IP, and adds &quot;Connection lost during finger detection/measurement&quot; log messages.
              </Para>
              <CodeBlock label="MATLABWiFi_V2.ino — reconnect helpers" code={`
void ensureWiFiConnected() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi disconnected. Reconnecting...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 10000) {
      delay(250);
      Serial.print(".");
    }
  }
}

void ensureTCPConnected() {
  if (!client.connected()) {
    Serial.println("TCP disconnected. Reconnecting...");
    client.stop();
    client.connect(host, port);
  }
}`} />
              <Para>The 10 s cap means a dead network can&apos;t freeze the board forever; it just tries again on the next pass.</Para>
              <SubHeading>Stage 4 Challenges</SubHeading>
              <Challenge title="Handling disconnections">The board didn&apos;t notice when Wi-Fi or the MATLAB server went down, because there were no periodic health checks. Fixed on the ESP32 side here, and on the MATLAB side in Stage 5.</Challenge>
              <Challenge title="Hardcoded network settings">The SSID, password and server IP are hardcoded, so switching networks means editing and reflashing, which is exactly what V3 is. Still unsolved: there&apos;s no config portal and no mDNS.</Challenge>
              <NextBox label="What Stage 5 fixes:">The link was now resilient, but MATLAB could only see numbers, not why there were no numbers (no finger vs. still stabilizing vs. disconnected). That needed a richer message format and a real GUI.</NextBox>
            </section>

            {/* STAGE 5 */}
            <section>
              <SectionHeading id="stage-5" title="Stage 5 — Status Protocol & App Designer Dashboard" badge="done" />
              <Para>
                The final firmware, <Code>MATLABWiFi_V4.ino</Code>, rewrote <Code>loop()</Code> as one flat cycle that sends <Code>STATUS=NoFinger</Code>, then <Code>STATUS=Stabilizing</Code>, then <Code>STATUS=Data,SPO2=..,TEMP=..</Code>, with an invalid SpO₂ now sent as <Code>-1</Code> instead of text. On the laptop I built <Code>App.mlapp</Code> in App Designer: a Start button that launches the TCP server and disables itself, numeric fields for SpO₂ and temperature, a status label, and two lamps for the MAX30102 and MLX90614.
              </Para>
              <SubHeading>Firmware V4 — Every Line Has a Status</SubHeading>
              <Para>Every line now starts with a <Code>STATUS</Code> key, so the GUI always knows which state the device is in. Sending <Code>-1</Code> keeps the field numeric.</Para>
              <CodeBlock label="MATLABWiFi_V4.ino — loop()" code={`
String msg;
if (avgIR < 10000) {
  // no finger
  msg = "STATUS=NoFinger\\n";
  client.print(msg); Serial.print(msg);
  delay(500);
  return;
}

// 2) finger detected → stabilizing
msg = "STATUS=Stabilizing\\n";
client.print(msg); Serial.print(msg);
delay(750);

// 3) collect 100 samples, 4) compute SpO₂, 5) read temp
// ...

// 6) send data
msg = "STATUS=Data,"
      "SPO2=" + String(validSPO2 ? spo2 : -1) + ","
      "TEMP=" + String(temp, 2) + "\\n";
client.print(msg); Serial.print(msg);`} />
              <SubHeading>Dashboard — Parsing Each Line</SubHeading>
              <Para>Instead of polling, <Code>configureCallback(..., &quot;terminator&quot;, ...)</Code> calls <Code>updateReadings</Code> for every incoming line. A single switch on the status token drives the whole GUI state, and <Code>NoFinger</Code> clears the fields to 0 instead of leaving stale numbers.</Para>
              <CodeBlock label="App.mlapp — updateReadings (MATLAB)" code={`
app.LastMsgTime = datetime('now');

data   = readline(src);                    % get one line
tokens = split(strtrim(data), {',','='});  % split at commas & equals

% assume both sensors are OK if any data arrives
app.MAX30102Lamp.Color = [0 1 0];
app.MLX90614Lamp.Color = [0 1 0];

switch tokens{2}
    case "NoFinger"
        app.StatusLabel.Text = "No Finger Detected";
        app.SPO2Field.Value  = 0;
        app.TempField.Value  = 0;

    case "Stabilizing"
        app.StatusLabel.Text = "Finger Detected. Stabilizing...";

    case "Data"
        app.StatusLabel.Text = "Reading OK";
        app.SPO2Field.Value  = str2double(tokens{4});
        app.TempField.Value  = str2double(tokens{6});
    % ...
end`} />
              <SubHeading>Dashboard — Start Button & Connection Watchdog</SubHeading>
              <Para>The callback reacts to data as it arrives, and a separate 1 s timer notices when data stops arriving. The close-request callback stops and deletes the timer so it doesn&apos;t outlive the app.</Para>
              <CodeBlock label="App.mlapp — StartButtonPushed + checkConnection (MATLAB)" code={`
app.tcpServer = tcpserver("0.0.0.0", 5050, "Timeout", 10);
configureCallback(app.tcpServer, "terminator", @(src,~) updateReadings(app, src));
app.StatusLabel.Text = "Server running – waiting for ESP32...";

app.LastMsgTime = datetime('now');
app.ConnTimer = timer( ...
    'ExecutionMode','fixedSpacing', ...
    'Period',1, ...
    'TimerFcn', @(~,~) checkConnection(app) ...
);
start(app.ConnTimer);

% --- checkConnection ---
dt = seconds(datetime('now') - app.LastMsgTime);
if dt > 12.5
    app.StatusLabel.Text   = "Connection Lost";
    app.MAX30102Lamp.Color = [1 0 0];
    app.MLX90614Lamp.Color = [1 0 0];
end`} />
              <SubHeading>The Dashboard in Action</SubHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Figure src="/vitallink/Waiting_to_Start.png" alt="Dashboard before starting: Start button enabled, both lamps red" width={1263} height={995}
                  caption="1. Waiting to start: Start enabled, both lamps red" />
                <Figure src="/vitallink/Server_Running.png" alt="Dashboard with the TCP server running and waiting for the ESP32" width={1262} height={993}
                  caption="2. Server running, waiting for the ESP32 to connect" />
                <Figure src="/vitallink/Finger_Detection.png" alt="Dashboard with green lamps showing SpO2 96 and temperature 32.13" width={1262} height={996}
                  caption="3. Finger on the sensor: green lamps, status back to &quot;Stabilizing...&quot; while SpO₂ 96 % and 32.13 °C from the last reading stay on screen" />
                <Figure src="/vitallink/Connection_Lost.png" alt="Dashboard showing Connection Lost with both lamps red" width={1254} height={997}
                  caption="4. No data for more than 12.5 s: &quot;Connection Lost&quot; and both lamps red" />
              </div>
              <SubHeading>Stage 5 Challenges</SubHeading>
              <Challenge title="NaN parse error">Missing or invalid values reaching the numeric fields as NaN caused a parse error. <Code>NoFinger</Code> now sets both fields to 0 and V4 sends <Code>-1</Code> for invalid SpO₂, so the dashboard can briefly show <Code>-1</Code> as the SpO₂ value.</Challenge>
              <Challenge title="GUI state">Getting the GUI to show sensor and connection status properly took a mix of <Code>tcpserver</Code>, callbacks and a timer working together. Solved with the callback + timer structure above.</Challenge>
              <Challenge title="Lamps don&apos;t reflect real sensor health">Both lamps turn green on any incoming line. If a sensor is missing, the firmware halts at <Code>while(1)</Code>, so the GUI just shows &quot;Connection Lost&quot; and never says which sensor failed. Still unsolved.</Challenge>
              <Challenge title="Status text flicker">V4 re-sends <Code>STATUS=Stabilizing</Code> and waits 750 ms before every reading, not just the first, so the label keeps alternating between &quot;Stabilizing...&quot; and &quot;Reading OK&quot; while a finger is held, and each cycle is slower. Still unsolved.</Challenge>
              <Challenge title="No plotting">The dashboard shows only the latest numbers; there&apos;s no time-series plot.</Challenge>
              <NextBox label="Project complete:">This is the final stage. The full pipeline worked end to end and was submitted for BITS F235 on 8 May 2025.</NextBox>
            </section>

            {/* RESULTS */}
            <section>
              <SectionHeading id="results" title="Results & Status" />
              <Para>Everything below is confirmed by the code and by the screenshots and validation notes in my report.</Para>
              <div className="space-y-2 mb-6">
                {capabilityRows.map(([label, status]) => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <StatusIcon status={status} />
                    <span className={cn("text-sm", status === "done" ? "text-primary" : "text-muted-foreground")}>{label}</span>
                    <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
              <SubHeading>Measurements</SubHeading>
              <Para>
                The one reading captured in my screenshots is <span className="font-medium text-primary">SpO₂ 96 %, temperature 32.13 °C</span> with a finger on the sensor. 32.13 °C is a skin-surface reading from the MLX90614, not core body temperature, and I didn&apos;t apply any correction. I never compared the readings against a reference pulse oximeter or clinical thermometer, so accuracy is unvalidated, and the hardware is no longer assembled to collect those figures.
              </Para>
              <SubHeading>Performance</SubHeading>
              <Table headers={["Metric", "Value"]} rows={[
                ["Update rate",          "≈ one reading every 5–6 s. Calculated from the V4 code (about 25 samples/s after 4× averaging, 110 samples per cycle, plus 1 s of delays); never measured."],
                ["Power",                "USB-powered; no battery, so battery life doesn't apply."],
                ["Range, latency",       "Never measured. Only ran on a local Wi-Fi network."],
              ]} />
              <SubHeading>Known Limitations</SubHeading>
              <BulletList items={[
                "Network settings live in the sketch, so changing networks means editing and reflashing. SSID, password and server IP are blank in the public code.",
                "The firmware halts forever (while(1)) if either sensor is missing at boot.",
                "The GUI lamps turn green on any message; they don't really check sensor health.",
                "The Stabilizing delay repeats every cycle in V4.",
                "Invalid SpO₂ shows up as -1 in the GUI.",
                "Heart rate is calculated but never sent or shown.",
                "No motion-artifact handling, ambient-light rejection, temperature calibration, data logging or plotting.",
                "It's still a breadboard build with jumper wires and no enclosure.",
                "The dashboard only runs in MATLAB R2024b.",
              ]} />
            </section>

            {/* WHAT I LEARNED */}
            <section>
              <SectionHeading id="learned" title="What I Learned" />
              <ul className="space-y-4">
                {[
                  "Two I2C sensors that work fine on their own can still fight each other on a shared bus. Dropping to 100 kHz and taking the OLED off the bus is what fixed it for me.",
                  "Building each piece in its own folder (BodyTemp, SpO2, Combined, then V1 to V4) meant that when something broke, I knew it came from the last thing I added.",
                  "A plain text line format like KEY=value is really easy to debug, because I could read exactly what was being sent in the Serial Monitor.",
                  "Anything wireless will eventually drop, so reconnect logic has to be in the design from the start, not added after it breaks.",
                  "Sending a status along with the data (NoFinger, Stabilizing, Data) made the GUI far more useful than numbers on their own.",
                  "In MATLAB, an event callback on the TCP server works much better than a loop that keeps checking for bytes.",
                  "A timer watching for \"no data for too long\" is a simple way to detect a lost connection from the receiving side.",
                  "A NaN hitting a numeric field can break a GUI, so I have to decide what an invalid reading should look like before it's sent.",
                  "An infrared sensor pointed at a finger measures skin temperature, which is noticeably lower than body temperature.",
                  "Getting a number on the screen isn't the same as getting a correct number. I never checked mine against a real oximeter, and that's the next thing I'd do.",
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
