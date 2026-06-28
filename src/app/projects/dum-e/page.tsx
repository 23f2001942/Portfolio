"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  CheckCircle2,
  Clock,
  Circle,
} from "lucide-react";
import Image from "next/image";

const sections = [
  { id: "overview",    label: "Overview",              indent: false },
  { id: "how-it-works", label: "How It Works",         indent: false },
  { id: "components",  label: "Components & BOM",      indent: false },
  { id: "build",       label: "Build Process",         indent: false },
  { id: "stage-1",     label: "Stage 1",                indent: true  },
  { id: "stage-2",     label: "Stage 2",                indent: true  },
  { id: "stage-3",     label: "Stage 3",                indent: true  },
  { id: "stage-4",     label: "Stage 4",                indent: true  },
  { id: "challenges",  label: "Challenges",            indent: false },
  { id: "firmware",    label: "Firmware & Software",   indent: false },
  { id: "results",     label: "Results & Status",      indent: false },
  { id: "learned",     label: "What I Learned",        indent: false },
];

const specRows = [
  ["Degrees of Freedom", "6"],
  ["Main Controller", "XIAO ESP32 S3"],
  ["Glove Controller", "XIAO ESP32 C3"],
  ["PWM Driver", "PCA9685 (I2C, 0x40)"],
  ["PWM Frequency", "60 Hz"],
  ["Power Supply", "External 5V, 3A"],
  ["Control Modes", "WiFi Web UI, ESP-NOW Glove"],
  ["Communication", "WiFi (HTTP), ESP-NOW, I2C"],
  ["IMU", "MPU6050 (Pitch + Roll)"],
  ["Flex Sensors", "2× resistive"],
  ["Firmware", "C++ (Arduino framework)"],
  ["Motion Architecture", "Non-blocking (millis()-based)"],
];

const jointRows = [
  ["S1 — Waist",       "MG995",  "CH0", "0° – 180°",   "90°"],
  ["S2 — Shoulder",    "MG995",  "CH1", "45° – 135°",  "90°"],
  ["S3 — Elbow",       "MG995",  "CH2", "30° – 150°",  "90°"],
  ["S4 — Wrist Roll",  "MG90S",  "CH3", "0° – 180°",   "90°"],
  ["S5 — Wrist Pitch", "SG90",   "CH4", "45° – 135°",  "110°"],
  ["S6 — Grip",        "SG90",   "CH5", "20° – 100°",  "60°"],
];

const stepRows = [
  ["S1 (Waist)",      "40 ms", "1.0°", "MG995; heavier base rotation"],
  ["S2 (Shoulder)",   "30 ms", "0.5°", "MG995; fine control for lift"],
  ["S3 (Elbow)",      "30 ms", "0.5°", "MG995; fine control"],
  ["S4 (Wrist Roll)", "25 ms", "1.0°", "MG90S; lighter, faster"],
  ["S5 (Wrist Pitch)","25 ms", "1.0°", "SG90; home offset at 110°"],
  ["S6 (Grip)",       "25 ms", "1.0°", "SG90; grip open/close"],
];

const mainBom = [
  ["XIAO ESP32 S3",     "Main arm controller",       "Dual-core 240 MHz, WiFi + ESP-NOW, I2C"],
  ["PCA9685 PWM Driver","Servo signal generator",    "16-channel, I2C, 0x40, 60 Hz"],
  ["External 5V 3A PSU","Servo power supply",        "Dedicated; all 6 servos stable at 3A"],
  ["MG995 × 3",         "Heavy-duty servos (S1–S3)", "9–11 kg·cm torque, metal gear"],
  ["MG90S × 1",         "Mid-weight servo (S4)",     "Metal gear, lighter than MG995"],
  ["SG90 × 2",          "Light servos (S5, S6)",     "Plastic gear; wrist pitch & grip"],
];

const gloveBom = [
  ["XIAO ESP32 C3",    "Glove microcontroller",    "ESP-NOW transmitter node"],
  ["MPU6050",          "6-axis IMU",               "Pitch + Roll only (Yaw excluded)"],
  ["Flex Sensor × 2",  "Finger bend detection",    "Resistive; voltage divider wired"],
  ["10 kΩ resistor × 2","Voltage divider pull-down","Substitute 47 kΩ if ADC delta < 100"],
];

const capabilityRows = [
  ["6-DOF simultaneous servo motion",        "done"],
  ["Non-blocking firmware (millis() engine)", "done"],
  ["WiFi web dashboard with slider control",  "done"],
  ["Live status readback (500 ms polling)",   "done"],
  ["Per-servo physically tuned parameters",   "done"],
  ["Safe startup snap sequence",              "done"],
  ["ESP-NOW communication link",              "progress"],
  ["Glove gesture → servo mapping",           "progress"],
  ["Complementary filter Pitch/Roll",         "progress"],
  ["Mode toggle via Flex 2",                  "progress"],
  ["Full glove + web UI dual control",        "planned"],
];

function StatusIcon({ status }: { status: string }) {
  if (status === "done")     return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (status === "progress") return <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
  return <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />;
}

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="text-2xl font-bold text-primary mb-6 pb-2 border-b-2 border-[hsl(var(--highlight))] scroll-mt-24 flex items-center gap-2">
      <span className="w-1 h-6 rounded-full bg-[hsl(var(--highlight))] inline-block flex-shrink-0" />
      {title}
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
            <tr key={i} className={cn(
              "border-t border-border transition-colors hover:bg-[hsl(var(--highlight)/0.04)]",
              i % 2 === 0 ? "bg-card" : "bg-background"
            )}>
              {row.map((cell, j) => (
                <td key={j} className={cn(
                  "px-4 py-2.5",
                  j === 0 ? "font-semibold text-primary" : "text-muted-foreground"
                )}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ code, lang = "cpp", label }: { code: string; lang?: string; label?: string }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden mb-6 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <span className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">{label ?? lang}</span>
      </div>
      <pre className="bg-[hsl(220,20%,10%)] dark:bg-[hsl(0,0%,7%)] p-4 overflow-x-auto text-xs leading-relaxed text-[#a8c5e8] dark:text-[#a8c5e8]">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

function StageHeading({ id, num, title, status }: { id?: string; num: string; title: string; status: "done" | "progress" }) {
  return (
    <div id={id} className="flex items-center gap-3 mt-6 mb-2 scroll-mt-24">
      <h3 className="text-base font-semibold text-[hsl(var(--highlight-sub))]">{num}: {title}</h3>
      {status === "done"
        ? <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Completed</Badge>
        : <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">In Progress</Badge>
      }
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-[hsl(var(--highlight-sub))] mt-6 mb-2">{children}</h3>;
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-3">{children}</p>;
}

function ArchNode({
  title, subtitle, items, accent = false,
}: { title: string; subtitle?: string; items: string[]; accent?: boolean }) {
  return (
    <div className={cn(
      "rounded-lg border p-4 w-full",
      accent
        ? "border-[hsl(var(--highlight)/0.5)] bg-[hsl(var(--highlight)/0.06)]"
        : "border-border bg-card"
    )}>
      <p className={cn("text-xs font-bold uppercase tracking-widest mb-0.5", accent ? "text-[hsl(var(--highlight))]" : "text-muted-foreground")}>{title}</p>
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

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-1 gap-0.5">
      <div className="w-px h-4 bg-border" />
      <span className="text-[0.65rem] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">{label}</span>
      <div className="w-px h-4 bg-border" />
      <svg width="10" height="6" viewBox="0 0 10 6" className="text-muted-foreground fill-current">
        <path d="M5 6L0 0h10z" />
      </svg>
    </div>
  );
}

function SystemArchDiagram() {
  return (
    <div className="flex flex-col items-center gap-0 my-6 max-w-lg mx-auto">
      {/* Glove + Browser row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <ArchNode
          title="Glove Controller"
          subtitle="XIAO ESP32 C3"
          items={["MPU6050 → Pitch, Roll", "Flex 1 → Grip %", "Flex 2 → Mode Toggle"]}
        />
        <ArchNode
          title="Browser Dashboard"
          subtitle="Any Device (WiFi)"
          items={["Per-servo sliders", "HOME / STOP buttons", "500 ms status poll"]}
        />
      </div>

      {/* Arrows down to S3 */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <Arrow label="ESP-NOW (~2 ms)" />
        <Arrow label="WiFi HTTP" />
      </div>

      {/* Main controller */}
      <ArchNode
        accent
        title="Main Arm Controller"
        subtitle="XIAO ESP32 S3"
        items={[
          "ESP-NOW RX → parse → set targetAngle[]",
          "HTTP server → parse → set targetAngle[]",
          "Motion engine → millis() tick → advance angles",
        ]}
      />

      <Arrow label="I2C @ 0x40" />

      {/* PCA9685 */}
      <ArchNode
        title="PCA9685 PWM Driver"
        subtitle="60 Hz PWM — 16 channels"
        items={[
          "CH0 → S1 Waist (MG995)",
          "CH1 → S2 Shoulder (MG995)",
          "CH2 → S3 Elbow (MG995)",
          "CH3 → S4 Wrist Roll (MG90S)",
          "CH4 → S5 Wrist Pitch (SG90)",
          "CH5 → S6 Grip (SG90)",
        ]}
      />
    </div>
  );
}

export default function DumEPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionEls = sections.map(s => document.getElementById(s.id)).filter(Boolean);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSection(topmost.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    sectionEls.forEach(el => observerRef.current?.observe(el!));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>Hardware Projects</span>
            <span>/</span>
            <span className="text-[hsl(var(--highlight))]">Dum-E</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Dum-E</h1>
          <p className="text-muted-foreground text-[0.95rem] max-w-2xl mb-4">
            A self-designed 6-DOF robotic arm with WiFi web dashboard control and a wearable ESP-NOW glove controller — built entirely from scratch.
          </p>
          <div className="flex flex-wrap gap-2">
            {["ESP32", "Robotics", "3D Printing", "ESP-NOW", "IMU", "Servo Control", "C++", "PCA9685"].map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border mb-10 bg-secondary">
          <Image
            src="/images/Dum-E.png"
            alt="Dum-E Robotic Arm"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Mobile Section Picker */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileOpen(p => !p)}
            className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg text-sm font-medium text-primary"
          >
            <span>{sections.find(s => s.id === activeSection)?.label ?? "Overview"}</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", mobileOpen && "rotate-180")} />
          </button>
          {mobileOpen && (
            <div className="mt-1 border border-border rounded-lg bg-card overflow-hidden">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "w-full text-left border-b border-border last:border-0",
                    s.indent ? "px-8 py-2 text-xs" : "px-4 py-2.5 text-sm",
                    activeSection === s.id ? "text-primary font-medium bg-secondary" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-10">

          {/* Left Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-[hsl(var(--highlight))] uppercase tracking-widest mb-3">On this page</p>
              <nav className="space-y-0.5">
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={cn(
                      "w-full text-left rounded-md transition-colors",
                      s.indent ? "pl-6 pr-3 py-1.5 text-xs" : "px-3 py-2 text-sm",
                      activeSection === s.id
                        ? "bg-[hsl(var(--highlight)/0.12)] text-[hsl(var(--highlight))] font-medium border-l-2 border-[hsl(var(--highlight))] rounded-l-none"
                        : s.indent
                          ? "text-muted-foreground/70 hover:text-muted-foreground hover:bg-secondary/40"
                          : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-16">

            {/* 1. Overview */}
            <section>
              <SectionHeading id="overview" title="1. Overview" />
              <Para>
                Dum-E is a personal, self-designed 6 degree-of-freedom robotic arm built to explore the intersection of embedded systems, wireless communication, and real-time control. Named after the loyal robotic arm from the Iron Man franchise, every firmware decision, wiring choice, calibration constant, and software architecture pattern was arrived at through iterative, hardware-in-the-loop testing.
              </Para>
              <Para>
                The arm&apos;s defining feature is its dual-mode control system: a browser-accessible WiFi web dashboard hosted directly from the microcontroller for precise slider-driven positioning, and a wearable ESP-NOW glove controller that maps physical hand and wrist gestures to servo joints in real time.
              </Para>

              <SubHeading>Key Specifications</SubHeading>
              <Table headers={["Parameter", "Value"]} rows={specRows} />

              <SubHeading>Joint Layout</SubHeading>
              <Table headers={["Joint", "Servo", "Channel", "Range", "Home"]} rows={jointRows} />

              <SubHeading>What Makes Dum-E Different</SubHeading>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  ["No kit dependency", "Every subsystem — mechanical, electrical, and software — was designed or selected independently."],
                  ["Non-blocking firmware", "All six servos move simultaneously using a millis()-based engine, keeping the WiFi server fully responsive during motion."],
                  ["Physically-tuned per-servo motion", "Step delay and step size were determined through actual physical testing, not theoretical calculation, to eliminate stiction on the MG995 joints."],
                  ["Dual-mode glove control", "Two motion modes (WRIST / ARM) toggled by flex sensor bend, controlling four joints with only two sensors and one IMU."],
                  ["Confirmed calibration", "PWM constants (SERVOMIN=125, SERVOMAX=625) were physically validated once and are never recalculated."],
                ].map(([title, desc]) => (
                  <li key={title} className="flex gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span><span className="text-primary font-medium">{title}.</span> {desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 2. How It Works */}
            <section>
              <SectionHeading id="how-it-works" title="2. How It Works" />
              <Para>
                Dum-E&apos;s system is composed of two nodes — a main arm controller (XIAO ESP32 S3) and a glove controller (XIAO ESP32 C3) — communicating wirelessly over ESP-NOW. A browser-based web dashboard also connects to the S3 over WiFi. All three control paths feed into a single motion engine on the S3.
              </Para>

              <SubHeading>Main Controller — XIAO ESP32 S3</SubHeading>
              <Para>
                On startup, the S3 executes a safe-start sequence: each servo is snapped to its home position one at a time with a 500–600 ms gap, using direct PCA9685 PWM writes. Only after all servos are physically at home does firmware initialize <code className="text-xs bg-secondary px-1 py-0.5 rounded">currentAngle[]</code> — preventing abrupt motion when smooth control begins.
              </Para>
              <Para>After startup, the main loop services three concurrent non-blocking tasks:</Para>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4 ml-4">
                <li>1. HTTP handler — processes incoming WiFi requests from the web UI</li>
                <li>2. ESP-NOW receive callback — processes incoming glove packets</li>
                <li>3. Motion engine — ticks servo positions forward at per-servo rates using millis()</li>
              </ul>

              <SubHeading>Non-Blocking Motion Engine</SubHeading>
              <Para>Each servo has its own state stored in arrays indexed 0–5: <code className="text-xs bg-secondary px-1 py-0.5 rounded">currentAngle</code>, <code className="text-xs bg-secondary px-1 py-0.5 rounded">targetAngle</code>, <code className="text-xs bg-secondary px-1 py-0.5 rounded">STEP_SIZE</code>, <code className="text-xs bg-secondary px-1 py-0.5 rounded">STEP_DELAY</code>, <code className="text-xs bg-secondary px-1 py-0.5 rounded">lastMoveTime</code>. Every loop, if the step timer has elapsed and the servo hasn&apos;t reached its target, it advances by STEP_SIZE and writes to the PCA9685. No delay() anywhere in the motion path.</Para>
              <Table headers={["Servo", "Step Delay", "Step Size", "Notes"]} rows={stepRows} />

              <SubHeading>WiFi Web Dashboard</SubHeading>
              <Para>The S3 hosts a self-contained HTML/CSS/JS page from flash memory with per-servo sliders (correctly ranged per joint), live angle readouts, HOME and STOP buttons, and a 500 ms status poll that keeps the UI in sync with the physical arm regardless of which input is active.</Para>

              <SubHeading>Glove Controller — Mode System</SubHeading>
              <Para>The glove uses an MPU6050 (Pitch + Roll only — Yaw excluded due to gyro drift with no magnetometer) and two flex sensors. Flex 2 acts as a binary mode toggle:</Para>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { mode: "WRIST Mode", condition: "Flex 2 straight", mappings: ["MPU Pitch → S5 Wrist Pitch", "MPU Roll → S4 Wrist Roll", "Flex 1 → S6 Grip"] },
                  { mode: "ARM Mode", condition: "Flex 2 bent", mappings: ["MPU Pitch → S2 Shoulder", "MPU Roll → S3 Elbow", "Flex 1 → S6 Grip"] },
                ].map(m => (
                  <div key={m.mode} className="border border-border rounded-lg p-4 bg-card">
                    <p className="font-semibold text-primary text-sm mb-1">{m.mode}</p>
                    <p className="text-xs text-muted-foreground mb-2">{m.condition}</p>
                    <ul className="space-y-1">
                      {m.mappings.map(mp => <li key={mp} className="text-xs text-muted-foreground">→ {mp}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <Para>S1 (Waist) is intentionally excluded from glove control — its sweeping motion benefits from the precision of a slider.</Para>

              <SubHeading>Complementary Filter</SubHeading>
              <CodeBlock lang="formula" label="Complementary Filter" code={`filteredAngle = 0.96 × (filteredAngle + gyro × dt) + 0.04 × accelAngle`} />
              <Para>The 0.96/0.04 weighting favors the gyroscope for responsive tracking while the accelerometer slowly corrects drift — a practical low-computation alternative to a full Kalman filter.</Para>

              <SubHeading>System Architecture</SubHeading>
              <SystemArchDiagram />
            </section>

            {/* 3. Components & BOM */}
            <section>
              <SectionHeading id="components" title="3. Components & Bill of Materials" />
              <SubHeading>Main Arm Electronics</SubHeading>
              <Table headers={["Component", "Role", "Specs / Notes"]} rows={mainBom} />
              <SubHeading>Glove Controller Electronics</SubHeading>
              <Table headers={["Component", "Role", "Specs / Notes"]} rows={gloveBom} />
              <SubHeading>Software Libraries</SubHeading>
              <Table
                headers={["Library", "Used For"]}
                rows={[
                  ["Adafruit PWMServoDriver", "PCA9685 I2C control"],
                  ["ESP8266WebServer / WebServer", "WiFi HTTP server on S3"],
                  ["esp_now.h", "ESP-NOW transmitter and receiver"],
                  ["Wire.h", "I2C communication"],
                  ["WiFi.h", "WiFi stack on S3"],
                  ["MPU6050 library", "IMU raw data access on C3"],
                ]}
              />
            </section>

            {/* 4. Build Process */}
            <section>
              <SectionHeading id="build" title="4. Build Process" />
              <Para>Dum-E was built in four discrete stages. Each stage was confirmed fully working before the next began — ensuring a clean, debuggable baseline at every phase.</Para>

              <StageHeading id="stage-1" num="Stage 1" title="Serial Monitor Sequential Control" status="done" />
              <Para><span className="text-primary font-medium">Goal:</span> Establish basic servo control. Verify that the PCA9685 can drive all six servos correctly and that calibration constants produce the expected angular ranges.</Para>
              <Para>The original stack used an Arduino Uno connected to a PCA9685 over I2C. Firmware accepted commands over Serial Monitor to move individual servos sequentially using delay(). PWM calibration constants were physically validated at this stage: SERVOMIN = 125 and SERVOMAX = 625 at 60 Hz, by commanding each servo to 0° and 180° and observing actual sweep limits.</Para>
              <Para>Servo limits were physically scoped — S2 constrained to 45°–135° to avoid binding, S3 to 30°–150°, S5 home adjusted to 110° due to mechanical offset, S6 to 20°–100° to protect the grip. These constants have not changed since.</Para>

              <StageHeading id="stage-2" num="Stage 2" title="Full Simultaneous Non-Blocking Servo Control" status="done" />
              <Para><span className="text-primary font-medium">Goal:</span> Upgrade from sequential delay()-blocking control to a true simultaneous non-blocking motion engine. Upgrade the controller from Arduino Uno to XIAO ESP32 S3.</Para>
              <Para>The firmware was rewritten from scratch to eliminate all delay() calls. A millis()-based motion engine was implemented as the core of the main loop with per-servo arrays for current/target angle, step size, step delay, and timestamps.</Para>
              <Para>A safe startup sequence was implemented: each of the 6 servos is snapped to home one at a time with a deliberate 500–600 ms gap — the only intentional delay() in the codebase. After all six physically reach home, currentAngle[] is initialized to match.</Para>
              <Para>Per-servo STEP_SIZE and STEP_DELAY values were physically tuned: MG995 servos required STEP_DELAY no higher than 30–40 ms. Smaller STEP_SIZE (0.5°) applied to S2 and S3 for finer control. All 6 servos confirmed to move simultaneously within the 3A supply without brownout.</Para>

              <StageHeading id="stage-3" num="Stage 3" title="WiFi Web Dashboard" status="done" />
              <Para><span className="text-primary font-medium">Goal:</span> Expose the arm&apos;s motion engine to a browser-based interface hosted directly from the XIAO ESP32 S3. Per-servo sliders, live angle readouts, HOME and STOP.</Para>
              <Para>The S3&apos;s WiFi was activated and an HTTP server was instantiated with five routes: GET / (serves the full web UI from flash), GET /set, GET /home, GET /stop, GET /status.</Para>
              <Para>The UI is a self-contained HTML/CSS/JS page embedded as a C-string literal in firmware. JavaScript throttles /set calls per slider to 50 ms minimum to prevent flooding the HTTP stack during continuous drag. A 500 ms /status poll keeps the UI in sync with the physical arm regardless of which input is active — a forward-looking decision made to support the upcoming glove controller.</Para>

              <StageHeading id="stage-4" num="Stage 4" title="ESP-NOW Glove Controller" status="progress" />
              <Para><span className="text-primary font-medium">Goal:</span> Add a wearable glove that streams hand orientation and finger bend data over ESP-NOW to the S3, enabling gesture-based arm control alongside the web UI.</Para>
              <Para>The glove hardware — XIAO ESP32 C3, MPU6050 on the wrist, two resistive flex sensors on fingers 1 and 2 — is assembled. A dedicated flex calibration sketch was written and tested to output FLEX_STRAIGHT, FLEX_BENT, and FLEX_THRESHOLD constants that get hardcoded into the main transmitter sketch.</Para>
              <Para>ESP-NOW was selected over Bluetooth for its connectionless ~1–3 ms latency with no pairing requirement. Yaw was excluded after evaluating MPU6050 drift — without a magnetometer, yaw accumulates error rapidly. The complementary filter (α = 0.96) provides stable Pitch and Roll with minimal complexity.</Para>
              <div className="space-y-2.5 mt-4 mb-4">
                {([
                  ["Hardware assembled (C3 + MPU6050 + flex sensors)", "done"],
                  ["Flex calibration sketch written and tested", "progress"],
                  ["Sensor-to-servo mapping defined", "progress"],
                  ["Mode toggle logic designed", "progress"],
                  ["ESP-NOW transmitter firmware (C3)", "planned"],
                  ["ESP-NOW receiver integration on S3", "planned"],
                  ["Complementary filter tuning under physical load", "planned"],
                  ["Full glove + arm integration test", "planned"],
                ] as [string, string][]).map(([label, status]) => (
                  <div key={label} className="flex items-center gap-3">
                    {status === "done"
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      : status === "progress"
                        ? <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        : <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    }
                    <span className={cn(
                      "text-sm",
                      status === "done" ? "text-primary font-medium" :
                      status === "progress" ? "text-muted-foreground" :
                      "text-muted-foreground/50"
                    )}>{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Challenges */}
            <section>
              <SectionHeading id="challenges" title="5. Challenges" />

              {[
                {
                  stage: "Stage 1 — Serial Monitor Control",
                  items: [
                    ["PWM Calibration", "Without confirmed SERVOMIN/SERVOMAX values, initial commands sent servos to incorrect angles or caused buzzing at physical endpoints. Physically swept each servo to find PWM counts for 0° and 180°. SERVOMIN = 125, SERVOMAX = 625 at 60 Hz were locked in and never changed."],
                    ["Mechanical Limits", "Commanding some servos to 0° or 180° caused binding or collision with the arm structure. Physical limits were observed and encoded as per-joint software constraints enforced at the motion engine level."],
                    ["SG90 Home Offset (S5)", "S5 Wrist Pitch at nominal 90° was mechanically misaligned with the wrist assembly. Home adjusted to 110° to reflect actual neutral wrist pitch for this arm geometry."],
                  ],
                },
                {
                  stage: "Stage 2 — Non-Blocking Motion Engine",
                  items: [
                    ["Physical vs Software State Mismatch", "On first boot, if joints weren't at home positions, the firmware's initial currentAngle[] didn't match reality — first commands caused abrupt full-range snaps. Startup sequence implemented: all servos snapped to home via direct PWM before motion engine initializes currentAngle[]."],
                    ["MG995 Stiction / Jerky Motion", "MG995 servos jerked in discrete visible steps rather than gliding. Root cause: STEP_DELAY too high — the servo fully settled between updates, causing start-stop oscillation. STEP_DELAY reduced iteratively (S1: 40 ms, S2/S3: 30 ms) until smooth gliding was confirmed. Note: too-low delay also causes buzzing."],
                    ["3A Supply Adequacy", "Concern that simultaneously driving 3× MG995 + 3× lighter servos would cause brownouts. All 6 servos commanded to move simultaneously — no brownout observed. 3A confirmed adequate."],
                    ["Controller Migration (Uno → S3)", "I2C pin mapping, library versions, and UART config changed between the Arduino Uno and XIAO ESP32 S3. Pin assignments explicitly defined in firmware; Adafruit PWMServoDriver confirmed compatible with ESP32."],
                  ],
                },
                {
                  stage: "Stage 3 — WiFi Web Dashboard",
                  items: [
                    ["HTTP Server Blocking During Motion", "Early firmware used delay() in the motion path, making the HTTP server unresponsive during arm movement. Motion engine fully confirmed non-blocking before the HTTP server was added."],
                    ["Slider Flooding the HTTP Stack", "Continuous slider drag fired hundreds of /set requests per second, hanging the ESP32's HTTP stack. 50 ms per-servo software throttle added in JavaScript — requests only dispatched if 50 ms has elapsed since the last for that servo."],
                    ["UI Drift With Multiple Inputs", "The web UI fell out of sync with the arm when the glove was controlling it. /status polling endpoint added, returning currentAngle[] every 500 ms — UI updates all sliders from this ground truth."],
                    ["Embedding Web UI in Firmware", "Storing full HTML/CSS/JS as a C-string required careful quote escaping and raised compilation warnings about string section size. PROGMEM used to store the string in flash rather than SRAM."],
                  ],
                },
                {
                  stage: "Stage 4 — Glove Controller (Ongoing)",
                  items: [
                    ["Yaw Drift", "Initial design included yaw mapping to S1. MPU6050 gyroscope drift caused yaw to accumulate at several degrees per second with no correction (no magnetometer). Yaw removed entirely — S1 is web-UI-only. A pragmatic hardware constraint decision, not a compromise."],
                    ["Insufficient ADC Range on Flex Sensors", "Flex sensors with 10 kΩ pull-down showed under 100 ADC counts between straight and bent in some setups — likely a dry joint or wrong resistor. If delta < 100 counts, substitute 47 kΩ resistor to increase voltage swing."],
                    ["Dual-Mode Mapping With Limited Sensors", "The glove has 1 IMU (Pitch + Roll) and 2 flex sensors but needs to control 4 motion joints plus grip. Flex 2 repurposed as binary mode toggle — giving full coverage of S2, S3, S4, S5, and S6 across two modes."],
                    ["Complementary Filter Alpha Tuning", "α = 0.96 is a starting value (equivalent to ~0.4 s time constant). Actual tuning under physical motion and vibration is still pending — will be conducted empirically during Stage 4 integration testing."],
                  ],
                },
              ].map(({ stage, items }) => (
                <div key={stage} className="mb-10">
                  <h3 className="text-base font-semibold text-[hsl(var(--highlight-sub))] mt-6 mb-2">{stage}</h3>
                  <div className="space-y-4">
                    {items.map(([title, desc]) => (
                      <div key={title} className="flex gap-3">
                        <span className="text-[hsl(var(--highlight))] mt-0.5 flex-shrink-0 text-sm">→</span>
                        <div>
                          <span className="text-sm font-semibold text-primary">{title} — </span>
                          <span className="text-sm text-muted-foreground leading-relaxed">{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* 6. Firmware & Software */}
            <section>
              <SectionHeading id="firmware" title="6. Firmware & Software" />

              <SubHeading>Firmware Targets</SubHeading>
              <Table
                headers={["File", "Description"]}
                rows={[
                  ["DumE_Stage2_MotionEngine.ino",       "Non-blocking motion engine on S3 (baseline)"],
                  ["DumE_Stage3_WebUI.ino",              "Stage 2 + WiFi HTTP server + web dashboard"],
                  ["DumE_Stage4_FlexCalibration.ino",    "Standalone calibration sketch for C3 flex sensors"],
                  ["DumE_Stage4_Transmitter.ino",        "ESP-NOW transmitter on C3 (in development)"],
                  ["DumE_Stage4_ReceiverIntegration.ino","Stage 3 + ESP-NOW receiver on S3 (planned)"],
                ]}
              />

              <SubHeading>Non-Blocking Motion Engine</SubHeading>
              <CodeBlock lang="cpp" label="DumE_Stage2_MotionEngine.ino" code={`// Motion engine tick — called every loop() for all 6 servos
for (int i = 1; i <= 6; i++) {
  if (millis() - lastMoveTime[i] >= STEP_DELAY[i]) {
    if (currentAngle[i] < targetAngle[i]) {
      currentAngle[i] = min(currentAngle[i] + STEP_SIZE[i], targetAngle[i]);
    } else if (currentAngle[i] > targetAngle[i]) {
      currentAngle[i] = max(currentAngle[i] - STEP_SIZE[i], targetAngle[i]);
    }
    setPWM(i - 1, currentAngle[i]); // writes to PCA9685
    lastMoveTime[i] = millis();
  }
}`} />

              <SubHeading>Safe Startup Sequence</SubHeading>
              <CodeBlock lang="cpp" label="DumE_Stage2_MotionEngine.ino" code={`void startupSequence() {
  int homeAngles[] = {0, 90, 90, 90, 90, 110, 60}; // index 1-6
  for (int i = 1; i <= 6; i++) {
    pwm.setPWM(i - 1, 0, angleToPWM(homeAngles[i]));
    delay(550); // only intentional delay() in the entire codebase
  }
  // Sync software state to physical state
  for (int i = 1; i <= 6; i++) {
    currentAngle[i] = homeAngles[i];
    targetAngle[i]  = homeAngles[i];
  }
}`} />
              <Para>The 550 ms gap prevents simultaneous inrush current from all 6 servos, allows each to physically reach home, and gives the PSU time to stabilize.</Para>

              <SubHeading>PWM Conversion</SubHeading>
              <CodeBlock lang="cpp" label="angleToPWM()" code={`int angleToPWM(float angle) {
  return (int)(SERVOMIN + (angle / 180.0) * (SERVOMAX - SERVOMIN));
}

#define SERVOMIN 125   // physically validated — never recalculate
#define SERVOMAX 625
#define PWM_FREQ  60`} />

              <SubHeading>WiFi HTTP Server Routes</SubHeading>
              <CodeBlock lang="cpp" label="DumE_Stage3_WebUI.ino" code={`// /set?servo=N&angle=A
void handleSet() {
  int servo   = server.arg("servo").toInt();
  float angle = server.arg("angle").toFloat();
  angle = constrain(angle, SERVO_MIN_ANGLE[servo], SERVO_MAX_ANGLE[servo]);
  targetAngle[servo] = angle;
  server.send(200, "text/plain", "OK");
}

// /status — returns JSON of all current angles (polled every 500 ms by UI)
void handleStatus() {
  String json = "{";
  for (int i = 1; i <= 6; i++) {
    json += "\\"s" + String(i) + "\\":" + String(currentAngle[i], 1);
    if (i < 6) json += ",";
  }
  json += "}";
  server.send(200, "application/json", json);
}`} />

              <SubHeading>ESP-NOW Data Structure</SubHeading>
              <CodeBlock lang="cpp" label="glove_data struct — shared C3 & S3" code={`typedef struct glove_data {
  float pitch;      // degrees, complementary filter output
  float roll;       // degrees, complementary filter output
  int flex1_value;  // raw ADC → maps to S6 grip
  int flex2_value;  // raw ADC → used for mode toggle
} glove_data;`} />

              <SubHeading>S3 Receiver Callback</SubHeading>
              <CodeBlock lang="cpp" label="DumE_Stage4_ReceiverIntegration.ino" code={`void onGloveData(const uint8_t *mac, const uint8_t *data, int len) {
  glove_data packet;
  memcpy(&packet, data, sizeof(packet));

  bool armMode = (packet.flex2_value > FLEX2_THRESHOLD);

  if (armMode) {
    targetAngle[2] = mapAngle(packet.pitch, PITCH_MIN, PITCH_MAX, 45, 135); // Shoulder
    targetAngle[3] = mapAngle(packet.roll,  ROLL_MIN,  ROLL_MAX,  30, 150); // Elbow
  } else {
    targetAngle[5] = mapAngle(packet.pitch, PITCH_MIN, PITCH_MAX, 45, 135); // Wrist Pitch
    targetAngle[4] = mapAngle(packet.roll,  ROLL_MIN,  ROLL_MAX,   0, 180); // Wrist Roll
  }

  // Grip always controlled by Flex 1
  targetAngle[6] = mapAngle(packet.flex1_value, FLEX1_STRAIGHT, FLEX1_BENT, 20, 100);
}`} />

              <SubHeading>Complementary Filter (C3)</SubHeading>
              <CodeBlock lang="cpp" label="DumE_Stage4_Transmitter.ino" code={`void computeComplementaryFilter(float *pitch, float *roll) {
  float dt = (millis() - lastFilterTime) / 1000.0;
  lastFilterTime = millis();

  float accelPitch = atan2(ay, az) * RAD_TO_DEG;
  float accelRoll  = atan2(ax, az) * RAD_TO_DEG;

  *pitch = 0.96 * (*pitch + gx * dt) + 0.04 * accelPitch;
  *roll  = 0.96 * (*roll  + gy * dt) + 0.04 * accelRoll;
}`} />
            </section>

            {/* 7. Results & Status */}
            <section>
              <SectionHeading id="results" title="7. Results & Current Status" />
              <Para>Stages 1–3 are fully confirmed working. Stage 4 hardware is assembled and calibration tooling is ready; firmware integration is in active development.</Para>

              <div className="space-y-2 mb-6">
                {capabilityRows.map(([label, status]) => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <StatusIcon status={status} />
                    <span className={cn("text-sm", status === "done" ? "text-primary" : "text-muted-foreground")}>{label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {status === "done" ? "Confirmed" : status === "progress" ? "In development" : "Planned"}
                    </span>
                  </div>
                ))}
              </div>

              <SubHeading>Stage 4 Target Capabilities</SubHeading>
              <Para>Once Stage 4 integration is complete, Dum-E will support: physical wrist tilt → wrist joint control (WRIST mode), physical arm tilt → shoulder and elbow control (ARM mode), finger curl → grip open/close, mode switching via a single finger bend, and simultaneous web UI monitoring while the glove is in use.</Para>
            </section>

            {/* 8. What I Learned */}
            <section>
              <SectionHeading id="learned" title="8. What I Learned" />

              {[
                {
                  category: "Embedded Systems & Firmware",
                  items: [
                    ["Non-blocking is foundational, not optional", "Any project combining servo control with a network stack or UI must use millis()-based timing from day one. Retrofitting it later is painful; building it in from Stage 2 made everything after much cleaner."],
                    ["Physical and software state must be explicitly synchronised", "Assuming the arm is where the firmware thinks it is causes dangerous, unpredictable motion. The startup snap sequence is critical to safety and correctness, not just good practice."],
                    ["Calibration constants deserve permanent status", "SERVOMIN and SERVOMAX were physically validated once and never touched again. Recalculating calibration values is a source of regressions, not improvements."],
                    ["Per-servo tuning matters", "Identical STEP_DELAY values across different servo models produce very different motion quality. Hardware physics doesn't respect software uniformity."],
                  ],
                },
                {
                  category: "Sensor Integration",
                  items: [
                    ["Know your sensor's limitations before mapping it to control", "Yaw drift on the MPU6050 was caught during design analysis, before any yaw-based firmware was written. Designing around a known hardware constraint early is far less costly than discovering it during integration."],
                    ["The complementary filter is underrated", "For most human-scale motion control, the complementary filter gives 90% of a Kalman filter's stability with 10% of the implementation complexity."],
                    ["Flex sensor ADC delta is a wiring diagnostic", "A delta under 100 counts almost certainly indicates a wiring fault, not a bad sensor. The 47 kΩ substitution rule is a concrete, actionable diagnostic."],
                  ],
                },
                {
                  category: "System Architecture & Protocol Selection",
                  items: [
                    ["ESP-NOW is exceptional for local peer-to-peer control", "No pairing, no router dependency, ~1–3 ms latency, native to ESP32. For projects where two ESP32 nodes need to exchange data with minimal overhead, ESP-NOW is almost always the right choice over Bluetooth serial."],
                    ["Design sensor-to-servo mappings before writing firmware", "The glove mode toggle design — two modes from one IMU and two flex sensors covering five joints — was worked out on paper before a single line of firmware was written."],
                    ["HTTP server and motion engine coexist cleanly when both are non-blocking", "The web dashboard works flawlessly during arm motion precisely because neither subsystem uses delay(). Any concurrent subsystem can be added as long as it respects the non-blocking contract."],
                  ],
                },
                {
                  category: "Project Management & Process",
                  items: [
                    ["Stage-by-stage confirmation is the right discipline for hardware", "Every stage was confirmed fully working before the next began. When something broke in a new stage, the root cause search was bounded to what changed — not the entire system."],
                    ["Physical testing overrides theoretical calculation", "STEP_DELAY, STEP_SIZE, and servo limits were all determined by observing the arm, not computing from datasheets. Real hardware has tolerances and mechanical quirks that theory doesn't capture."],
                    ["Dropping a feature cleanly is a good engineering decision", "Yaw was cut. Both decisions were made quickly, with clear rationale, without a workaround. Knowing when to remove scope is as important as knowing what to build."],
                  ],
                },
              ].map(({ category, items }) => (
                <div key={category} className="mb-8">
                  <h3 className="text-base font-semibold text-[hsl(var(--highlight))] mt-6 mb-2">{category}</h3>
                  <div className="space-y-3">
                    {items.map(([title, desc]) => (
                      <div key={title} className="flex gap-3">
                        <span className="text-primary mt-1 flex-shrink-0">→</span>
                        <div>
                          <span className="text-sm font-medium text-primary">{title}. </span>
                          <span className="text-sm text-muted-foreground">{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
