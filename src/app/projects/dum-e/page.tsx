"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2, Clock, Circle } from "lucide-react";
import Image from "next/image";

const sections = [
  { id: "overview",    label: "Overview",         indent: false },
  { id: "components",  label: "Components & BOM", indent: false },
  { id: "stage-1",     label: "Stage 1",          indent: false },
  { id: "stage-2",     label: "Stage 2",          indent: false },
  { id: "stage-3",     label: "Stage 3",          indent: false },
  { id: "stage-4",     label: "Stage 4",          indent: false },
  { id: "results",     label: "Results & Status", indent: false },
  { id: "learned",     label: "What I Learned",   indent: false },
];

const specRows = [
  ["Axes of Motion", "6"],
  ["Main Controller", "XIAO ESP32 S3"],
  ["Glove Controller", "XIAO ESP32 C3"],
  ["PWM Driver", "PCA9685 (I2C, 0x40)"],
  ["PWM Frequency", "60 Hz"],
  ["Power Supply", "External 5V, 3A"],
  ["Control Modes", "WiFi Web UI, ESP-NOW Glove"],
  ["Communication", "WiFi (HTTP), ESP-NOW, I2C"],
  ["IMU", "MPU6050 (Pitch + Roll only)"],
  ["Flex Sensors", "2× resistive"],
  ["Firmware Language", "C++ (Arduino framework)"],
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

const mainBom = [
  ["XIAO ESP32 S3",     "Main arm controller",       "Dual-core 240 MHz, WiFi + ESP-NOW, I2C"],
  ["PCA9685 PWM Driver","Servo signal generator",    "16-channel, I2C, 0x40, 60 Hz"],
  ["External 5V 3A PSU","Servo power supply",        "Dedicated; all 6 servos stable at 3A"],
  ["MG995 × 3",         "Heavy-duty servos (S1–S3)", "9–11 kg·cm torque, metal gear"],
  ["MG90S × 1",         "Mid-weight servo (S4)",     "Metal gear, lighter than MG995"],
  ["SG90 × 2",          "Light servos (S5, S6)",     "Plastic gear; wrist pitch and grip"],
];

const gloveBom = [
  ["XIAO ESP32 C3",      "Glove microcontroller",    "ESP-NOW transmitter, compact form factor"],
  ["MPU6050",            "6-axis IMU",               "Pitch + Roll only — Yaw excluded"],
  ["Flex Sensor × 2",    "Finger bend detection",    "Resistive; voltage divider wired"],
  ["10 kΩ resistor × 2", "Voltage divider pull-down","Substitute 47 kΩ if ADC delta < 100"],
  ["LiPo / USB power",   "Glove power source",       "Wrist-mounted or tethered"],
];

const capabilityRows: [string, string][] = [
  ["Full simultaneous servo motion (all 6 axes)",  "done"],
  ["Non-blocking firmware (millis() engine)",   "done"],
  ["WiFi web dashboard with slider control",    "done"],
  ["Live status readback (500 ms polling)",     "done"],
  ["Per-servo physically tuned parameters",     "done"],
  ["Safe startup snap sequence",                "done"],
  ["Flex calibration tooling complete",         "done"],
  ["Sensor-to-servo mapping fully designed",    "done"],
  ["ESP-NOW transmitter firmware (C3)",         "progress"],
  ["ESP-NOW receiver integration on S3",        "planned"],
  ["Complementary filter tuning under load",    "planned"],
  ["Full glove + arm integration test",         "planned"],
];

function StatusIcon({ status }: { status: string }) {
  if (status === "done")     return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (status === "progress") return <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
  return <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />;
}

function SectionHeading({ id, title, badge }: { id: string; title: string; badge?: "done" | "progress" }) {
  return (
    <h2 id={id} className="text-2xl font-bold text-primary mb-6 pb-2 border-b-2 border-[hsl(var(--highlight))] scroll-mt-24 flex items-center gap-3">
      <span className="w-1 h-6 rounded-full bg-[hsl(var(--highlight))] inline-block flex-shrink-0" />
      {title}
      {badge === "done"     && <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Completed</Badge>}
      {badge === "progress" && <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">In Progress</Badge>}
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

function StageHeading({ id, title, status }: { id: string; title: string; status: "done" | "progress" }) {
  return (
    <div id={id} className="flex items-center gap-3 mt-8 mb-3 scroll-mt-24">
      <h3 className="text-base font-semibold text-[hsl(var(--highlight-sub))]">{title}</h3>
      {status === "done"
        ? <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Completed</Badge>
        : <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">In Progress</Badge>}
    </div>
  );
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

function ArrowDown({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-1 gap-0.5">
      <div className="w-px h-4 bg-border" />
      <span className="text-[0.65rem] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">{label}</span>
      <div className="w-px h-4 bg-border" />
      <svg width="10" height="6" viewBox="0 0 10 6" className="text-muted-foreground fill-current"><path d="M5 6L0 0h10z" /></svg>
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
          const topmost = visible.reduce((a, b) => a.boundingClientRect.top < b.boundingClientRect.top ? a : b);
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
            <span>Hardware Projects</span><span>/</span>
            <span className="text-[hsl(var(--highlight))]">Dum-E</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Dum-E</h1>
          <p className="text-muted-foreground text-[0.95rem] max-w-2xl mb-4">
            A self-designed robotic arm built entirely from scratch — through four confirmed stages from basic serial control to a WiFi web dashboard and a wearable ESP-NOW glove controller.
          </p>
          <div className="flex flex-wrap gap-2">
            {["ESP32", "Robotics", "3D Printing", "ESP-NOW", "IMU", "Servo Control", "C++", "PCA9685"].map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border mb-10 bg-secondary">
          <Image src="/images/Dum-E.png" alt="Dum-E Robotic Arm" fill className="object-cover" priority />
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
          <aside className="hidden lg:block w-52 flex-shrink-0">
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

            {/* 1. OVERVIEW */}
            <section>
              <SectionHeading id="overview" title="Overview" />
              <Para>
                Dum-E is a personal, self-designed robotic arm built to explore embedded systems, wireless communication, and real-time control — named after the loyal robotic arm from the Iron Man franchise. Unlike typical hobby arm kits, every firmware decision, wiring choice, calibration constant, and software architecture pattern was arrived at through iterative, hardware-in-the-loop testing.
              </Para>
              <Para>
                The project is structured in four discrete, confirmed stages. Each stage is fully validated before the next begins — a discipline that ensures a stable, well-understood baseline at every phase of development.
              </Para>
              <SubHeading>Key Specifications</SubHeading>
              <Table headers={["Parameter", "Value"]} rows={specRows} />
              <SubHeading>Joint Layout</SubHeading>
              <Table headers={["Joint", "Servo", "Channel", "Range", "Home"]} rows={jointRows} />
              <SubHeading>What Makes Dum-E Different</SubHeading>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  ["No kit dependency", "Every subsystem — mechanical, electrical, and software — was independently designed or selected."],
                  ["Stage-by-stage confirmation", "Each stage is confirmed fully working before the next begins. When something breaks in a new stage, the root cause search is bounded to what changed."],
                  ["Non-blocking firmware", "All six servos move simultaneously using a millis()-based engine, keeping the WiFi server fully responsive during motion."],
                  ["Physically-tuned per-servo motion", "Step delay and step size were determined through actual physical testing, not theory, to eliminate stiction on the MG995 joints."],
                  ["Dual-mode glove control", "Two motion modes toggled by a single flex sensor, controlling four joints with one IMU and two flex sensors."],
                  ["Confirmed calibration", "PWM constants (SERVOMIN=125, SERVOMAX=625) were physically validated once in Stage 1 and have never been recalculated."],
                ].map(([title, desc]) => (
                  <li key={title as string} className="flex gap-2">
                    <span className="text-[hsl(var(--highlight))] mt-0.5">→</span>
                    <span><span className="text-primary font-medium">{title}.</span> {desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 2. COMPONENTS */}
            <section>
              <SectionHeading id="components" title="Components & Bill of Materials" />
              <SubHeading>Main Arm Electronics</SubHeading>
              <Table headers={["Component", "Role", "Specs / Notes"]} rows={mainBom} />
              <SubHeading>Glove Controller Electronics</SubHeading>
              <Table headers={["Component", "Role", "Specs / Notes"]} rows={gloveBom} />
              <SubHeading>Software Libraries</SubHeading>
              <Table headers={["Library", "Used For"]} rows={[
                ["Adafruit PWMServoDriver", "PCA9685 I2C control"],
                ["WebServer (ESP32)",       "WiFi HTTP server on S3"],
                ["esp_now.h",              "ESP-NOW transmitter and receiver"],
                ["Wire.h",                 "I2C communication"],
                ["WiFi.h",                 "WiFi stack on S3"],
                ["MPU6050 library",        "IMU raw data access on C3"],
              ]} />
            </section>

            {/* STAGE 1 */}
            <section>
              <SectionHeading id="stage-1" title="Stage 1 — Serial Monitor Control" badge="done" />
              <Para>
                Stage 1 is the foundation. No wireless control, no simultaneous motion — just a rock-solid baseline that proves the hardware stack works and locks in the calibration constants that carry forward permanently. Control is via Arduino Serial Monitor using commands like <code className="text-xs bg-secondary px-1 py-0.5 rounded">S1-90</code> or <code className="text-xs bg-secondary px-1 py-0.5 rounded">S1-90, S2-45</code>. Motion is smooth but sequential and blocking.
              </Para>
              <Para><span className="font-medium text-primary">Hardware:</span> Arduino Uno R3 + PCA9685 PWM driver (I2C, 0x40) + external 5V 3A PSU + all 6 servos. PCA9685 was chosen from the start over onboard PWM pins — it generates stable 60 Hz independently over I2C, keeping servo timing clean regardless of CPU load, and scales forward without hardware changes.</Para>

              <SubHeading>PWM Calibration — The Permanent Constants</SubHeading>
              <Para>
                SERVOMIN and SERVOMAX are the most important constants in the entire project. Determined physically by commanding each servo to 0° and 180° and observing actual sweep. At these values, no servo buzzed at endpoints and full mechanical range was achieved. <span className="text-primary font-medium">These values have never been recalculated since.</span>
              </Para>
              <CodeBlock label="Stage1_SerialMonitor.ino — calibration constants" code={`#define SERVOMIN 125   // physically validated — never change
#define SERVOMAX 625
#define PWM_FREQ  60   // Hz

int angleToPulse(int angle) {
  return map(angle, 0, 180, SERVOMIN, SERVOMAX);
}`} />

              <SubHeading>Per-Joint Limits & Home Positions</SubHeading>
              <Para>Each servo's limits were set by physically driving joints to their mechanical boundaries and observing where binding or structural collision occurred. S2 (Shoulder) constrained to 45°–135° to prevent upper-arm binding. S5 (Wrist Pitch) has a home of 110° rather than 90° — correcting a mechanical offset in the wrist assembly geometry that was discovered during physical testing.</Para>
              <CodeBlock label="Stage1_SerialMonitor.ino — joint configuration" code={`// Index 0 unused — servos numbered 1–6
const uint8_t SERVO_CH[7]        = {255,  0,   1,   2,   3,   4,   5  };
const uint8_t SERVO_MIN_ANGLE[7] = {  0,  0,  45,  30,   0,  45,  20 };
const uint8_t SERVO_MAX_ANGLE[7] = {  0,180, 135, 150, 180, 135, 100 };
const uint8_t SERVO_HOME[7]      = {  0, 90,  90,  90,  90, 110,  60 };`} />

              <SubHeading>Startup Sequence</SubHeading>
              <Para>On boot, all servos are snapped directly to home via raw PWM writes (bypassing the smooth motion engine) before any commands are accepted. A 500 ms gap between each snap prevents simultaneous inrush current from all six servos on cold-start.</Para>
              <CodeBlock label="Stage1_SerialMonitor.ino — syncAndHome()" code={`void syncAndHome() {
  for (uint8_t i = 1; i <= 6; i++) {
    board1.setPWM(SERVO_CH[i], 0, angleToPulse(SERVO_HOME[i]));
    currentAngle[i] = SERVO_HOME[i];
    delay(500);  // prevents simultaneous inrush current
  }
  homeAllServos();  // smooth confirmation pass
}`} />

              <SubHeading>Smooth Single-Servo Move</SubHeading>
              <Para>Every commanded move is incremental — the servo steps from its current angle to the target 1°/step with a 35 ms delay, producing a gliding motion rather than a snap. Angle clamping happens once before the loop begins.</Para>
              <CodeBlock label="Stage1_SerialMonitor.ino — moveServoSmooth()" code={`void moveServoSmooth(uint8_t servoNum, uint8_t target) {
  uint8_t limited = constrain(target,
                    SERVO_MIN_ANGLE[servoNum],
                    SERVO_MAX_ANGLE[servoNum]);
  float current = currentAngle[servoNum];

  while ((int)current != (int)limited) {
    if (current < limited) current += STEP_SIZE;
    else                   current -= STEP_SIZE;
    current = constrain(current,
              SERVO_MIN_ANGLE[servoNum], SERVO_MAX_ANGLE[servoNum]);
    board1.setPWM(SERVO_CH[servoNum], 0, angleToPulse((int)current));
    delay(STEP_DELAY_MS);  // 35 ms global — per-servo tuning comes in Stage 2
  }
  currentAngle[servoNum] = limited;
}`} />

              <SubHeading>Stage 1 Challenges</SubHeading>
              <Challenge title="PWM Calibration">Without confirmed SERVOMIN/SERVOMAX, servos went to wrong angles or buzzed at endpoints. Each servo was manually swept to find the correct PWM counts for 0° and 180°. Values confirmed, locked, never touched again.</Challenge>
              <Challenge title="Mechanical Binding">S2 and S3 at full range caused structural collisions. Per-joint limits defined by physical observation and encoded in software via constrain(). Out-of-range commands are clamped with a [LIMIT] warning — not rejected.</Challenge>
              <Challenge title="S5 Wrist Pitch Home Offset">Setting S5 to 90° placed the wrist in a mechanically awkward position due to horn installation geometry. Home adjusted to 110° — encoded in SERVO_HOME[5] and reflected in every subsequent stage.</Challenge>

              <div className="mt-8 p-4 rounded-lg bg-[hsl(var(--highlight)/0.06)] border border-[hsl(var(--highlight)/0.3)] text-sm text-muted-foreground flex gap-3">
                <div><span className="font-semibold text-[hsl(var(--highlight))]">What Stage 2 fixes: </span>Single global STEP_DELAY (35 ms) and STEP_SIZE (1°) applied to all servos regardless of torque. Sequential-only motion. Blocking delay() in the motion loop. Arduino Uno has no WiFi. All of these become problems in Stage 2.</div>
              </div>

            </section>

            {/* STAGE 2 */}
            <section>
              <SectionHeading id="stage-2" title="Stage 2 — Motion Engine (V1 → V2)" badge="done" />
              <Para>
                Stage 2 is the largest architectural leap in the project. Everything about how the arm moves changes here. Stage 1 proved the hardware worked; Stage 2 makes it move well. Two firmware versions were developed in sequence — V1 introduces per-servo tuning and conservative simultaneous motion; V2 removes all restrictions and achieves full 6-servo simultaneous movement.
              </Para>
              <SubHeading>Hardware Changes</SubHeading>
              <Para>The Arduino Uno is replaced by the XIAO ESP32 S3 — not because WiFi is used yet, but to contain the controller migration here rather than mid-Stage 3 when it would complicate debugging.</Para>
              <Table headers={["Component", "Stage 1", "Stage 2"]} rows={[
                ["Microcontroller", "Arduino Uno R3", "XIAO ESP32 S3"],
                ["I2C Pins (SDA/SCL)", "A4 / A5 (default Uno)", "D4/GPIO6, D5/GPIO7 — explicitly declared"],
                ["PWM Driver", "PCA9685 @ 0x40", "PCA9685 @ 0x40 (unchanged)"],
                ["PWM Calibration", "SERVOMIN=125, SERVOMAX=625", "Same — never recalculated"],
                ["Servo Hardware", "MG995×3, MG90S×1, SG90×2", "Same 6 servos (unchanged)"],
                ["Serial Baud Rate", "9600", "9600 (upgraded to 115200 in Stage 3)"],
              ]} />

              <SubHeading>The Core Problem — MG995 Stiction</SubHeading>
              <Para>
                When the initial simultaneous motion prototype used Stage 1's uniform 35 ms delay, the MG995 servos (S1, S2, S3) jerked in visible discrete steps rather than gliding. The root cause is counterintuitive:
              </Para>
              <div className="border border-border rounded-lg p-4 bg-card mb-6 space-y-2 text-sm text-muted-foreground">
                <p><span className="text-red-400 font-medium">Too long a delay:</span> The servo fully settles between PWM updates. The next update arrives from "rest" — static friction (stiction) must be overcome again. Result: discrete visible lurches.</p>
                <p><span className="text-red-400 font-medium">Too short a delay:</span> PWM updates arrive faster than the servo's internal feedback loop. Overshoot and correction repeatedly. Result: buzzing.</p>
                <p><span className="text-green-500 font-medium">Correct delay:</span> Updates arrive frequently enough that the motor never fully settles — it's always in motion, just slowly guided. Static friction is never re-engaged. Result: smooth glide.</p>
              </div>
              <Para>This insight — that the PWM update rate directly controls whether the servo is fighting stiction or flowing through it — is the core discovery of Stage 2 and shaped every subsequent stage.</Para>

              <SubHeading>Per-Servo Tuning Constants</SubHeading>
              <CodeBlock label="Stage2 — per-servo tuning arrays" code={`// Index 0 unused — confirmed through physical iteration
const uint8_t STEP_DELAY[7] = {0,  40,  30,  30,  25,  25,  25};
const float   STEP_SIZE[7]  = {0, 1.0, 0.5, 0.5, 1.0, 1.0, 1.0};

// S1 (Waist, MG995):   40 ms / 1.0° — heavier base needs slightly slower updates
// S2 (Shoulder, MG995): 30 ms / 0.5° — fine control for load-bearing lift joint
// S3 (Elbow, MG995):   30 ms / 0.5° — same reasoning as S2
// S4–S6 (lighter):     25 ms / 1.0° — faster and more responsive`} />
              <Para>The finer 0.5°/step on S2 and S3 produces more intermediate PWM positions during load-bearing moves, keeping the motor continuously guided rather than snapping between widely-spaced targets under torque.</Para>

              <SubHeading>V1 — Conservative Simultaneous Motion</SubHeading>
              <Para>V1 introduces simultaneous motion but only for the three lighter servos (S4, S5, S6). MG995 servos still move sequentially with 100 ms settling delays between each, based on concern about the 3A supply handling three MG995s simultaneously. An <code className="text-xs bg-secondary px-1 py-0.5 rounded">IS_MG995[]</code> flag classifies each servo and separates commands into heavy/light groups before dispatch.</Para>
              <CodeBlock label="Stage2_1_MotionEngine1.ino — moveSimultaneous() V1" code={`void moveSimultaneous(Move* moves, uint8_t count) {
  // Reject MG995 servos — fall back to sequential
  for (uint8_t i = 0; i < count; i++) {
    if (IS_MG995[moves[i].servo]) {
      for (uint8_t j = 0; j < count; j++)
        moveServoSmooth(moves[j].servo, moves[j].target);
      return;
    }
  }

  bool anyActive = true;
  while (anyActive) {
    anyActive = false;
    for (uint8_t i = 0; i < count; i++) {
      uint8_t s = moves[i].servo;
      if ((int)current[i] == (int)limited[i]) continue;
      if (current[i] < limited[i]) current[i] += STEP_SIZE[s];
      else                         current[i] -= STEP_SIZE[s];
      board1.setPWM(SERVO_CH[s], 0, angleToPulse((int)current[i]));
      if ((int)current[i] != (int)limited[i]) anyActive = true;
    }
    delay(25);  // fixed — SG90/MG90S safe rate
  }
}`} />

              <SubHeading>V2 — Full Simultaneous Motion</SubHeading>
              <Para>V1's restriction was physically tested: three MG995s commanded simultaneously — no brownout, no reset. The 3A supply proved adequate. V2 removes <code className="text-xs bg-secondary px-1 py-0.5 rounded">IS_MG995[]</code> entirely. All servos move simultaneously. A key improvement: the tick delay is now dynamically calculated as the <span className="text-primary font-medium">maximum STEP_DELAY among active servos</span> — slower servos set the shared tick rate, and as faster servos complete and drop out, the rate naturally decreases.</Para>
              <CodeBlock label="Stage2_2_MotionEngine2.ino — moveSimultaneous() V2" code={`void moveSimultaneous(uint8_t* servos, uint8_t* targets, uint8_t count) {
  // ... initialise current[], limited[], done[] ...

  bool anyActive = true;
  while (anyActive) {
    anyActive = false;

    // Tick at the slowest rate among still-active servos
    uint8_t tickDelay = 0;
    for (uint8_t i = 0; i < count; i++) {
      if (!done[i] && STEP_DELAY[servos[i]] > tickDelay)
        tickDelay = STEP_DELAY[servos[i]];
    }

    for (uint8_t i = 0; i < count; i++) {
      if (done[i]) continue;
      uint8_t s = servos[i];
      if (current[i] < limited[i]) current[i] += STEP_SIZE[s];
      else                         current[i] -= STEP_SIZE[s];
      board1.setPWM(SERVO_CH[s], 0, angleToPulse((int)current[i]));
      if ((int)current[i] == (int)limited[i]) done[i] = true;
      else anyActive = true;
    }
    delay(tickDelay);  // dynamic — decreases as faster servos complete
  }
}`} />
              <Para>V2 also tightened some angle limits after continued physical testing (S2 narrowed to 60°–120° after binding observed; S3 expanded to 20°–160° after structure was adjusted) and moved the S6 Grip home to 30°.</Para>

              <SubHeading>Stage 2 Challenges</SubHeading>
              <Challenge title="MG995 Stiction">Covered above — the core insight of Stage 2. Solved through iterative STEP_DELAY reduction until smooth gliding was confirmed. S1 counterintuitively needed a slightly higher delay (40 ms) because the heavier base rotation benefits from longer steps under load.</Challenge>
              <Challenge title="V1 MG995 Restriction — Was It Necessary?">All three MG995s were commanded simultaneously to the same target from home while monitoring the supply. No brownout or reset. The 3A supply proved adequate. V2 written to remove the restriction. V1's IS_MG995 guard code remains a useful pattern for weaker power supplies.</Challenge>
              <Challenge title="Controller Migration (Uno → S3)">I2C pin mapping, Wire.begin() signature, and library compatibility all changed. XIAO S3 SDA/SCL are GPIO6/GPIO7 rather than A4/A5. Wire.begin() called without arguments to use ESP32 Arduino core defaults. Adafruit PWMServoDriver confirmed compatible. Serial upgraded to 115200 baud.</Challenge>

              <div className="mt-8 p-4 rounded-lg bg-[hsl(var(--highlight)/0.06)] border border-[hsl(var(--highlight)/0.3)] text-sm text-muted-foreground flex gap-3">
                <div><span className="font-semibold text-[hsl(var(--highlight))]">What Stage 3 fixes: </span>Motion is still fundamentally blocking — delay() lives inside the while loop. While a servo moves, the CPU is occupied. This is acceptable for serial-only control but completely unacceptable for a WiFi HTTP server, which must remain responsive at all times.</div>
              </div>

            </section>

            {/* STAGE 3 */}
            <section>
              <SectionHeading id="stage-3" title="Stage 3 — WiFi Web Dashboard" badge="done" />
              <Para>
                Stage 3 is where Dum-E becomes a network device. The XIAO ESP32 S3 connects to WiFi, starts an HTTP server on port 80, and serves a complete control interface to any browser on the same network. No USB cable or Serial Monitor needed — any phone or laptop on the same WiFi can open the IP address and control all six joints.
              </Para>
              <Para>Stage 3 also solves the fundamental blocking problem from Stage 2. The motion engine is fully rewritten to be non-blocking using millis()-based timing. Both the HTTP server and servo stepping run concurrently in the same loop() with neither blocking the other.</Para>
              <SubHeading>Wiring — PCA9685 → XIAO ESP32 S3</SubHeading>
              <Table headers={["PCA9685 Pin", "Connects To", "Notes"]} rows={[
                ["SDA",  "D4 (GPIO 6)", "I2C data"],
                ["SCL",  "D5 (GPIO 7)", "I2C clock"],
                ["VCC",  "3.3V",        "Logic power from S3"],
                ["GND",  "GND",         "Common ground"],
                ["V+",   "5V external PSU", "Servo power — separate from logic supply"],
              ]} />
              <Para>Access the web UI at <code className="text-xs bg-secondary px-1 py-0.5 rounded">http://&lt;IP printed to Serial Monitor on boot&gt;</code> from any device on the same WiFi network.</Para>

              <SubHeading>The Core Architectural Shift — Non-Blocking Motion</SubHeading>
              <Para>The entire blocking while loop from Stage 2 is gone. Replaced by a ServoState struct and a stepServos() function that advances one step per servo per loop() call — no delay() anywhere.</Para>
              <CodeBlock label="Stage3_WebUI.ino — ServoState struct" code={`struct ServoState {
  float    current;   // actual position (float for sub-degree stepping)
  uint8_t  target;    // desired destination
  uint32_t lastStep;  // millis() timestamp of last step
};
ServoState sv[7];  // index 1–6`} />
              <CodeBlock label="Stage3_WebUI.ino — stepServos()" code={`// Called on every single loop() iteration — never blocks
void stepServos() {
  uint32_t now = millis();
  for (uint8_t s = 1; s <= 6; s++) {
    if ((int)sv[s].current == (int)sv[s].target) continue;  // already there
    if (now - sv[s].lastStep < STEP_DELAY[s])    continue;  // not time yet

    if (sv[s].current < sv[s].target) sv[s].current += STEP_SIZE[s];
    else                              sv[s].current -= STEP_SIZE[s];

    sv[s].current = constrain(sv[s].current,
                   SERVO_MIN_ANGLE[s], SERVO_MAX_ANGLE[s]);
    board1.setPWM(SERVO_CH[s], 0, angleToPulse((int)sv[s].current));
    sv[s].lastStep = now;
  }
}

// The entire main loop
void loop() {
  server.handleClient();  // handle incoming HTTP — returns immediately if nothing pending
  stepServos();           // advance any due servos — returns immediately
  // Neither ever blocks. HTTP server is always responsive, even during motion.
}`} />

              <SubHeading>HTTP Server — 5 Routes</SubHeading>
              <Table headers={["Route", "Parameters", "Action"]} rows={[
                ["GET /",             "None",          "Serves full web UI HTML from PROGMEM"],
                ["GET /move?s=N&a=A", "s=servo, a=°",  "Sets sv[s].target — returns immediately"],
                ["GET /home",         "None",          "Sets all 6 targets to home angles"],
                ["GET /stop",         "None",          "Sets each target to current position (freeze)"],
                ["GET /status",       "None",          "Returns JSON of all current angles"],
              ]} />
              <CodeBlock label="Stage3_WebUI.ino — key route handlers" code={`// setTarget() — the ONLY write path for target angles
void setTarget(uint8_t s, uint8_t angle) {
  if (s < 1 || s > 6) return;
  sv[s].target = constrain(angle, SERVO_MIN_ANGLE[s], SERVO_MAX_ANGLE[s]);
}

// /stop — freeze wherever the arm currently is
void handleStop() {
  for (uint8_t i = 1; i <= 6; i++)
    sv[i].target = (uint8_t)sv[i].current;  // target = current → stepServos() stops
  server.send(200, "text/plain", "OK");
}

// /status — returns ground-truth positions as JSON
void handleStatus() {
  String json = "{";
  for (uint8_t i = 1; i <= 6; i++) {
    json += "\\"s" + String(i) + "\\":" + String((int)sv[i].current);
    if (i < 6) json += ",";
  }
  json += "}";
  server.send(200, "application/json", json);
  // e.g.: {"s1":90,"s2":73,"s3":90,"s4":45,"s5":110,"s6":60}
}`} />

              <SubHeading>Web UI Deep Dive</SubHeading>
              <Para>The entire web UI is a self-contained HTML/CSS/JS page stored in PROGMEM using Arduino's raw string literal syntax and served via <code className="text-xs bg-secondary px-1 py-0.5 rounded">server.send_P()</code> — reads directly from flash without copying to SRAM, preserving heap for the HTTP and WiFi stacks.</Para>
              <CodeBlock label="Web UI — slider definitions" code={`// Each servo's physical range — not a generic 0–180° slider
const SERVOS = [
  { id:1, name:'Waist',       min:0,   max:180, home:90  },
  { id:2, name:'Shoulder',    min:45,  max:135, home:90  },
  { id:3, name:'Elbow',       min:30,  max:150, home:90  },
  { id:4, name:'Wrist Roll',  min:0,   max:180, home:90  },
  { id:5, name:'Wrist Pitch', min:45,  max:135, home:110 },
  { id:6, name:'Grip',        min:20,  max:100, home:60  },
];`} />
              <CodeBlock label="Web UI — slider throttle (50 ms per servo)" code={`const lastSend = {};

function sendMove(servo, angle) {
  const now = Date.now();
  if (lastSend[servo] && now - lastSend[servo] < 50) return;  // 20 req/s max
  lastSend[servo] = now;
  fetch('/move?s=' + servo + '&a=' + angle).catch(() => {});
}

// Final send on slider release — guarantees last angle always reaches firmware
sl.addEventListener('change', () => sendMove(s.id, +this.value));`} />
              <CodeBlock label="Web UI — status polling (500 ms sync)" code={`// Keeps UI in sync regardless of which input moved the arm
setInterval(() => {
  fetch('/status')
    .then(r => r.json())
    .then(d => {
      for (let i = 1; i <= 6; i++) {
        const a = d['s' + i];
        if (a === undefined) continue;
        // Don't override a slider the user is actively dragging
        if (document.activeElement !== sliders[i]) {
          sliders[i].value = a;
          labels[i].innerHTML = a + '<span class="unit">°</span>';
        }
      }
    }).catch(() => {});
}, 500);`} />
              <Para>The 500 ms status poll is the key forward-looking design decision: when Stage 4's glove controller moves a servo via ESP-NOW without the browser knowing, the browser will still reflect the correct arm state automatically.</Para>

              <SubHeading>Stage 3 Challenges</SubHeading>
              <Challenge title="HTTP Server Unresponsive During Motion">An early prototype kept the Stage 2 blocking motion engine. Browser requests during servo moves timed out completely. Rule established: nothing in loop() may call delay() or block for any significant time. Non-blocking engine confirmed working in isolation before HTTP server was added.</Challenge>
              <Challenge title="Slider Flooding">Continuous slider drag fired hundreds of /move requests per second. ESP32 HTTP stack froze after a few seconds — running out of socket resources. The 50 ms per-servo throttle in sendMove() reduced this to a comfortable 20 req/s per servo. No server hangs in extended testing after this fix.</Challenge>
              <Challenge title="UI Desync With Multiple Inputs">Early Stage 4 planning revealed the browser would show stale positions when the glove moved servos. The /status polling endpoint was designed and implemented in Stage 3 — before Stage 4 began — ensuring the web UI is a live monitor of ground truth, not just a reflection of its own commands.</Challenge>
              <Challenge title="Embedding HTML in Firmware">Full HTML/CSS/JS as a C++ string literal required careful handling of quotes and memory. Arduino's R"rawliteral(...)rawliteral" raw string eliminates all escaping. PROGMEM stores in flash rather than SRAM. server.send_P() reads from flash directly during HTTP response.</Challenge>

              <div className="mt-8 p-4 rounded-lg bg-[hsl(var(--highlight)/0.06)] border border-[hsl(var(--highlight)/0.3)] text-sm text-muted-foreground flex gap-3">
                <div><span className="font-semibold text-[hsl(var(--highlight))]">What Stage 4 adds: </span>All control is still manual — sliders require deliberate user input. Stage 4 adds a wearable glove that maps physical hand gestures to servo joints over ESP-NOW. The /status poll and non-blocking motion engine built in Stage 3 already anticipate this — both were designed with dual-input in mind.</div>
              </div>

            </section>

            {/* STAGE 4 */}
            <section>
              <SectionHeading id="stage-4" title="Stage 4 — ESP-NOW Glove Controller" badge="progress" />
              <Para>
                Stage 4 introduces a wearable glove controller as the second input modality. The glove uses an MPU6050 IMU for hand orientation (Pitch and Roll) and two resistive flex sensors for finger bend detection. All sensor data is packed into a struct and broadcast over ESP-NOW every loop cycle from the XIAO ESP32 C3 on the glove to the XIAO ESP32 S3 on the arm.
              </Para>
              <Para>On the arm side, an ESP-NOW receive callback fires on every incoming packet, decodes the struct, and routes each field to the appropriate <code className="text-xs bg-secondary px-1 py-0.5 rounded">sv[s].target</code> — feeding directly into the same <code className="text-xs bg-secondary px-1 py-0.5 rounded">stepServos()</code> engine that the web UI already uses. Both control inputs share the same motion engine with no conflict.</Para>

              <SubHeading>Glove Hardware Stack</SubHeading>
              <Table headers={["Component", "Role", "Notes"]} rows={[
                ["XIAO ESP32 C3",      "Glove MCU — ESP-NOW transmitter", "Single-core, WiFi, compact form factor"],
                ["MPU6050",            "6-axis IMU — hand orientation",   "Pitch + Roll only — Yaw excluded (see Challenges)"],
                ["Flex Sensor 1 (A0)", "Grip control — always S6",        "Resistive; 10 kΩ voltage divider"],
                ["Flex Sensor 2 (A1)", "Mode toggle — ARM vs WRIST",      "Threshold-based binary state"],
              ]} />
              <CodeBlock label="Stage4 — ADC configuration on C3" code={`#define FLEX1_PIN  A0   // Flex 1 → S6 Grip (always)
#define FLEX2_PIN  A1   // Flex 2 → mode switch

analogReadResolution(12);        // 12-bit → 0 to 4095
analogSetAttenuation(ADC_11db);  // full 3.3V input range
// 12-bit gives ~0.8 mV/count — sufficient for flex bend detection`} />

              <SubHeading>System Architecture</SubHeading>
              <div className="flex flex-col items-center gap-0 my-6 max-w-lg mx-auto">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <ArchNode title="Glove Controller" subtitle="XIAO ESP32 C3"
                    items={["MPU6050 → Pitch, Roll (comp. filter)", "Flex 1 → S6 Grip control", "Flex 2 → Mode Toggle (ARM/WRIST)", "Pack glove_data struct"]} />
                  <ArchNode title="Browser Dashboard" subtitle="Any Device (WiFi)"
                    items={["Per-servo sliders (correct range)", "HOME / STOP buttons", "500 ms /status poll", "Reflects glove moves automatically"]} />
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <ArrowDown label="ESP-NOW (~2 ms)" />
                  <ArrowDown label="WiFi HTTP" />
                </div>
                <ArchNode accent title="Main Arm Controller" subtitle="XIAO ESP32 S3"
                  items={["ESP-NOW RX → decode struct → setTarget()", "HTTP server → slider /move → setTarget()", "stepServos() → millis() tick → advance current", "I2C → PCA9685 → PWM → Servos"]} />
                <ArrowDown label="I2C @ 0x40, 60 Hz" />
                <ArchNode title="PCA9685 PWM Driver" subtitle="16-channel — 60 Hz"
                  items={["CH0 → S1 Waist (MG995)", "CH1 → S2 Shoulder (MG995)", "CH2 → S3 Elbow (MG995)", "CH3 → S4 Wrist Roll (MG90S)", "CH4 → S5 Wrist Pitch (SG90)", "CH5 → S6 Grip (SG90)"]} />
              </div>
              <Para>Both the ESP-NOW callback and the HTTP handler write to the same <code className="text-xs bg-secondary px-1 py-0.5 rounded">sv[].target</code> array. Whichever wrote last determines where the arm moves. In practice the web UI handles Waist (S1) and monitoring; the glove controls the other joints.</Para>

              <SubHeading>Sensor-to-Servo Mapping</SubHeading>
              <Para>The mapping was designed on paper before a single line of transmitter or receiver firmware was written. Constraints: 1 IMU (Pitch + Roll), 2 flex sensors, 5 joints to control (S2–S6), S1 Waist reserved for web UI. A naive 1:1 mapping covers only 4 joints. Solution: repurpose Flex 2 as a binary mode toggle.</Para>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { mode: "WRIST Mode", condition: "Flex 2 straight", mappings: ["IMU Pitch → S5 Wrist Pitch", "IMU Roll → S4 Wrist Roll", "Flex 1 → S6 Grip (always)"] },
                  { mode: "ARM Mode",   condition: "Flex 2 bent",     mappings: ["IMU Pitch → S2 Shoulder",   "IMU Roll → S3 Elbow",      "Flex 1 → S6 Grip (always)"] },
                ].map(m => (
                  <div key={m.mode} className="border border-border rounded-lg p-4 bg-card">
                    <p className="font-semibold text-primary text-sm mb-1">{m.mode}</p>
                    <p className="text-xs text-muted-foreground mb-2">{m.condition}</p>
                    <ul className="space-y-1">{m.mappings.map(mp => <li key={mp} className="text-xs text-muted-foreground">→ {mp}</li>)}</ul>
                  </div>
                ))}
              </div>
              <Para>S1 (Waist) is intentionally excluded from glove control. Waist rotation is a coarse, full-range sweep. Mapping it to IMU Roll in ARM mode would conflict with the Elbow mapping. Precise waist positioning benefits more from a slider than from tilt — easier to dial in a specific bearing with a slider than to hold the glove at a precise yaw.</Para>
              <CodeBlock label="Stage4_ReceiverIntegration.ino — ESP-NOW receive callback" code={`void onGloveData(const uint8_t *mac, const uint8_t *data, int len) {
  glove_data packet;
  memcpy(&packet, data, sizeof(packet));

  bool armMode = (packet.flex2_value > FLEX2_THRESHOLD);

  if (armMode) {
    setTarget(2, mapAngle(packet.pitch, PITCH_MIN, PITCH_MAX, 45, 135));  // S2 Shoulder
    setTarget(3, mapAngle(packet.roll,  ROLL_MIN,  ROLL_MAX,  30, 150));  // S3 Elbow
  } else {
    setTarget(5, mapAngle(packet.pitch, PITCH_MIN, PITCH_MAX, 45, 135));  // S5 Wrist Pitch
    setTarget(4, mapAngle(packet.roll,  ROLL_MIN,  ROLL_MAX,   0, 180));  // S4 Wrist Roll
  }
  // Grip: always Flex 1, always S6
  setTarget(6, mapAngle(packet.flex1_value, FLEX1_STRAIGHT, FLEX1_BENT, 20, 100));
}`} />

              <SubHeading>Why ESP-NOW</SubHeading>
              <Para>ESP-NOW was selected after direct experience with Bluetooth instability (HC-05/HC-06 connection drops under servo current load in a related college project).</Para>
              <Table headers={["Property", "ESP-NOW", "Bluetooth Serial (HC-05/HC-06)"]} rows={[
                ["Pairing required",     "No — peer MAC address only",         "Yes — pairing sequence required"],
                ["Latency",              "~1–3 ms",                            "10–30 ms typical"],
                ["Router dependency",    "None",                               "None (direct link)"],
                ["Native ESP32 support", "Yes — esp_now.h",                   "No — external UART module"],
                ["Reliability",          "Connectionless — no session to drop","Session-based — can drop under interference"],
              ]} />
              <Para>The S3&apos;s MAC address is read from Serial output once during initial setup and hardcoded into the C3 transmitter sketch. One-time configuration, not a runtime pairing process.</Para>

              <SubHeading>Flex Calibration — Deep Dive</SubHeading>
              <Para>Before any transmitter firmware can map flex sensor readings to servo angles, the ADC range of each sensor must be measured in the actual wired glove. Resistive flex sensors vary significantly between units — even the same nominal sensor from the same batch can have very different absolute resistance values depending on manufacturing tolerances. Hardcoding ADC values without per-unit calibration would produce wildly incorrect angle mappings.</Para>
              <Para>The solution is a dedicated standalone calibration sketch that runs on the C3 before the transmitter firmware is ever flashed. It exposes an interactive Serial menu — the user types a letter, holds a pose, and the sketch records the averaged ADC reading for that position.</Para>
              <CodeBlock label="DumE_Stage4_FlexCalibration.ino — interactive menu" code={`// Runs standalone on XIAO ESP32 C3 at 115200 baud
// ========================================
//   Dum-E — Flex Sensor Calibration
// ========================================
//   R  — Read raw ADC values (live)
//   1  — Calibrate Flex1 STRAIGHT
//   2  — Calibrate Flex1 BENT
//   3  — Calibrate Flex2 STRAIGHT
//   4  — Calibrate Flex2 BENT
//   T  — Test mapped angles live
//   S  — Show calibration values
//   H  — Show this menu
// ========================================`} />
              <Para>The ESP32&apos;s ADC is known to be noisy — single readings fluctuate by tens of counts even on a stable input. A single-sample calibration would lock in a noisy value. The fix is to average 20 samples with small gaps between each, producing a stable representative value.</Para>
              <CodeBlock label="DumE_Stage4_FlexCalibration.ino — ADC averaging" code={`// 20-sample average with 2 ms gaps — reduces ESP32 ADC noise
#define NUM_SAMPLES 20

int readADC(uint8_t pin) {
  long sum = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    sum += analogRead(pin);
    delay(2);
  }
  return (int)(sum / NUM_SAMPLES);
}`} />
              <Para>Each calibration step follows the same pattern: print a prompt, wait 2 seconds for the user to settle into the correct pose (straight or fully bent), then take an averaged ADC reading. The 2-second pause eliminates motion transients from the sample — without it, the reading would capture the sensor mid-bend rather than at its true endpoint.</Para>
              <CodeBlock label="DumE_Stage4_FlexCalibration.ino — calibration step" code={`// Each step: 2s wait for user to hold pose still, then averaged ADC read
case '1': {
  Serial.println(F("[CAL] Hold Flex1 finger STRAIGHT"));
  Serial.println(F("[CAL] Keep still... sampling in 2s"));
  delay(2000);  // user settles into pose; eliminates motion transients
  flex1_straight = readADC(FLEX1_PIN);
  Serial.print(F("[CAL] Flex1 STRAIGHT = "));
  Serial.println(flex1_straight);
  break;
}`} />
              <Para>Flex 2 is special — it&apos;s not used as a continuous control input but as a binary mode toggle. Rather than mapping its full ADC range to an angle, the sketch calculates a single threshold value: the midpoint between the straight and bent readings. A reading above this threshold means ARM Mode; below means WRIST Mode. Using the midpoint gives equal hysteresis distance in both directions, reducing the chance of accidental mode switches near the boundary.</Para>
              <CodeBlock label="DumE_Stage4_FlexCalibration.ino — Flex 2 threshold" code={`// Mode toggle threshold: midpoint between straight and bent ADC values
case '4': {
  delay(2000);
  flex2_bent = readADC(FLEX2_PIN);
  flex2_calibrated = true;

  int threshold = (flex2_straight + flex2_bent) / 2;  // symmetric hysteresis
  Serial.print(F("[CAL] Mode switch threshold = "));
  Serial.println(threshold);
  break;
}`} />
              <Para>After all four readings are captured, command T streams live angle-mapped output to Serial at 5 Hz. This is the critical human verification step before the transmitter sketch is ever flashed — the user physically bends each finger and confirms the correct joint angle changes in the Serial output. They also flex Flex 2 to confirm the MODE label switches between ARM and WRIST. If mode doesn&apos;t switch, the threshold comparison direction may need to be inverted — noted in the code.</Para>
              <CodeBlock label="DumE_Stage4_FlexCalibration.ino — live test (command T)" code={`// Human verification step before flashing transmitter sketch
case 'T': {
  int threshold = (flex2_straight + flex2_bent) / 2;
  while (!Serial.available()) {
    int f1 = readADC(FLEX1_PIN);
    int f2 = readADC(FLEX2_PIN);
    int s6angle = adcToAngle(f1, flex1_straight, flex1_bent, 20, 100);
    bool armMode = (f2 > threshold);
    Serial.print(F("  S6: "));  Serial.print(s6angle);
    Serial.print(F("°   Mode: ")); Serial.print(armMode ? F("ARM  ") : F("WRIST"));
    Serial.print(F("   [F1:")); Serial.print(f1);
    Serial.print(F(" F2:"));    Serial.print(f2);
    Serial.println(F("]"));
    delay(200);
  }
  break;
}`} />
              <Para>Once all four values are confirmed via the live test, command S prints the complete set of constants in a format ready to paste directly into the transmitter sketch header. The main transmitter firmware contains no hardcoded ADC values — it only references these defines. Any Dum-E build with different sensors just runs this calibration sketch once and pastes the output.</Para>
              <CodeBlock label="DumE_Stage4_FlexCalibration.ino — output (command S)" code={`// Ready-to-paste #define constants for the transmitter sketch
case 'S': {
  int threshold = (flex2_straight + flex2_bent) / 2;
  Serial.println(F("  PASTE THESE INTO STAGE 4 CODE:"));
  Serial.print(F("  #define FLEX1_STRAIGHT  ")); Serial.println(flex1_straight);
  Serial.print(F("  #define FLEX1_BENT       ")); Serial.println(flex1_bent);
  Serial.print(F("  #define FLEX2_STRAIGHT  ")); Serial.println(flex2_straight);
  Serial.print(F("  #define FLEX2_BENT       ")); Serial.println(flex2_bent);
  Serial.print(F("  #define FLEX2_THRESHOLD  ")); Serial.println(threshold);
  // Example output:
  //   #define FLEX1_STRAIGHT  1240
  //   #define FLEX1_BENT       3180
  //   #define FLEX2_THRESHOLD  2100
  break;
}`} />
              <Para>The angle mapping function deserves attention: depending on how the flex sensor is physically wired in the glove, the ADC value might increase when the finger is straight and decrease when bent — or vice versa. A naive <code className="text-xs bg-secondary px-1 py-0.5 rounded">map()</code> call would produce inverted angles if adcMin is greater than adcMax. The safe version handles both orientations automatically using <code className="text-xs bg-secondary px-1 py-0.5 rounded">min()</code> and <code className="text-xs bg-secondary px-1 py-0.5 rounded">max()</code> to compute the correct clamp bounds regardless of direction.</Para>
              <CodeBlock label="DumE_Stage4 — adcToAngle() safe mapping" code={`// Handles the case where adcMin > adcMax (sensor wired in reverse orientation)
int adcToAngle(int raw, int adcMin, int adcMax, int angleMin, int angleMax) {
  raw = constrain(raw, min(adcMin, adcMax), max(adcMin, adcMax));
  return map(raw, adcMin, adcMax, angleMin, angleMax);
}`} />

              <SubHeading>Firmware in Development</SubHeading>
              <CodeBlock label="DumE_Stage4_Transmitter.ino — transmitter loop (in development)" code={`// Complementary filter: gyro-dominant with slow accel drift correction
void computeComplementaryFilter(float *pitch, float *roll) {
  float dt = (millis() - lastFilterTime) / 1000.0;
  lastFilterTime = millis();
  float accelPitch = atan2(ay, az) * RAD_TO_DEG;
  float accelRoll  = atan2(ax, az) * RAD_TO_DEG;
  *pitch = 0.96 * (*pitch + gx * dt) + 0.04 * accelPitch;
  *roll  = 0.96 * (*roll  + gy * dt) + 0.04 * accelRoll;
  // α=0.96 → τ≈0.24s: fast enough to prevent drift, slow enough for stability
}

void loop() {
  computeComplementaryFilter(&glovePacket.pitch, &glovePacket.roll);
  glovePacket.flex1_value = readADC(FLEX1_PIN);
  glovePacket.flex2_value = readADC(FLEX2_PIN);
  esp_now_send(s3_mac_address, (uint8_t*)&glovePacket, sizeof(glovePacket));
  // glove_data packet: 2 floats + 2 ints = 16 bytes. ESP-NOW max: 250 bytes.
}`} />

              <SubHeading>Stage 4 Challenges & Design Decisions</SubHeading>
              <Challenge title="Yaw Excluded — Gyroscope Drift Makes It Unusable">Initial design included yaw mapped to S1 Waist. After evaluating MPU6050 data, gyroscope drift caused yaw to accumulate at several degrees per second with no correction (no magnetometer for absolute heading). After 30 seconds, yaw could be off by 20–30°. Resolution: yaw removed entirely before any yaw-based firmware was written. Pitch and Roll are stable because the accelerometer's gravity vector provides an absolute reference for the complementary filter to correct against.</Challenge>
              <Challenge title="Insufficient ADC Range on Flex Sensors">An early wiring test showed Flex 1 with less than 100 ADC counts of difference between straight and fully bent (on a 0–4095 12-bit scale). A delta under 100 almost always means a wiring fault — dry solder joint, wrong resistor value, or reversed connections — not a bad sensor. Resolution: if delta &lt; 100 counts, substitute 47 kΩ pull-down resistor. Higher resistance amplifies voltage swing for sensors with smaller resistance change.</Challenge>
              <Challenge title="Dual-Mode Mapping With Limited Sensors">1 IMU + 2 flex sensors needs to control 5 joints. A naive 1:1 mapping leaves one joint unreachable. Resolution: Flex 2 repurposed as binary mode toggle rather than a continuous third axis. Binary switching is cognitively simple, the midpoint threshold provides symmetric hysteresis, and the calibration sketch's T command makes it easy to confirm the comparison direction before flashing.</Challenge>
              <Challenge title="Complementary Filter Alpha — Pending Physical Tuning">α = 0.96 is a standard starting value (τ ≈ 0.24 s at ~100 Hz loop rate). The actual optimal alpha depends on the C3 loop rate under full sensor load (MPU6050 I2C + ADC reads + ESP-NOW transmission overhead) and the vibration characteristics of the glove under arm motion. Will be confirmed empirically during Stage 4 integration testing.</Challenge>

              <SubHeading>Current Progress</SubHeading>
              <div className="space-y-2.5 mt-4 mb-4">
                {([
                  ["Glove hardware assembled (C3 + MPU6050 + flex sensors)", "done"],
                  ["Flex calibration sketch written, tested, documented",     "done"],
                  ["Sensor-to-servo mapping fully designed",                  "done"],
                  ["Mode toggle logic designed",                              "done"],
                  ["ESP-NOW data struct defined",                             "done"],
                  ["S3 receiver callback architecture designed",              "done"],
                  ["ESP-NOW transmitter firmware (C3)",                       "progress"],
                  ["S3 receiver integration (Stage 3 + ESP-NOW)",            "planned"],
                  ["Complementary filter tuning under physical load",         "planned"],
                  ["Full glove + arm integration test",                       "planned"],
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
              <Para>Stages 1–3 are fully confirmed working. Stage 4 hardware is assembled and calibration tooling is complete; transmitter firmware is in active development.</Para>
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
              <SubHeading>What Full Stage 4 Completion Delivers</SubHeading>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "WRIST Mode: physical wrist tilt controls S4 (Wrist Roll) and S5 (Wrist Pitch) in real time",
                  "ARM Mode: tilting the forearm forward/back controls S2 (Shoulder); side tilt controls S3 (Elbow)",
                  "Grip: curling Flex 1 opens and closes S6 continuously",
                  "Mode switch: bending Flex 2 switches all mappings in under one packet cycle (~2 ms)",
                  "Simultaneous web UI: browser continues to reflect all positions via 500 ms polling even as glove controls them",
                  "Web UI retains S1 (Waist): slider control unaffected by glove input",
                ].map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[hsl(var(--highlight))] mt-0.5 flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. WHAT I LEARNED */}
            <section>
              <SectionHeading id="learned" title="What I Learned" />
              {[
                {
                  category: "Embedded Systems & Firmware",
                  items: [
                    ["Non-blocking is foundational, not optional", "Any project combining servo control with a network stack must use millis()-based timing from day one. Retrofitting it later is painful; building it in from Stage 2 made everything after much cleaner."],
                    ["Physical and software state must be explicitly synchronised", "Assuming the arm is where the firmware thinks it is causes dangerous, unpredictable motion. The startup snap sequence is critical to safety and correctness."],
                    ["Calibration constants deserve permanent status", "SERVOMIN and SERVOMAX were physically validated once in Stage 1 and never touched again. Recalculating calibration is a source of regressions, not improvements."],
                    ["Per-servo tuning matters more than expected", "Identical STEP_DELAY across different servo models produces very different motion quality. The stiction insight — that PWM update rate controls whether static friction re-engages between steps — was the most surprising discovery of the project."],
                  ],
                },
                {
                  category: "Sensor Integration",
                  items: [
                    ["Know your sensor's limitations before mapping it to control", "Yaw drift on the MPU6050 was caught during design analysis before any yaw-based firmware was written. Designing around a known hardware constraint early is far less costly than discovering it during integration."],
                    ["The complementary filter is underrated", "For human-scale motion control, the complementary filter gives 90% of a Kalman filter's stability with 10% of the implementation complexity."],
                    ["ADC delta is a wiring diagnostic", "A flex sensor delta under 100 counts almost certainly indicates a wiring fault, not a bad sensor. The 47 kΩ substitution rule is a concrete, actionable diagnostic."],
                  ],
                },
                {
                  category: "System Architecture & Protocol Selection",
                  items: [
                    ["ESP-NOW is exceptional for local peer-to-peer control", "No pairing, no router dependency, ~1–3 ms latency, native to ESP32. For two ESP32 nodes exchanging data with minimal overhead, ESP-NOW is almost always the right choice over Bluetooth serial."],
                    ["Design sensor-to-servo mappings before writing firmware", "The glove mode toggle design — two modes from one IMU and two flex sensors covering five joints — was worked out on paper before a single line of transmitter firmware was written. That clarity made the firmware straightforward."],
                    ["HTTP server and motion engine coexist cleanly when both are non-blocking", "The web dashboard works flawlessly during arm motion because neither subsystem uses delay(). Any concurrent subsystem can be added as long as it respects the non-blocking contract."],
                  ],
                },
                {
                  category: "Project Management & Process",
                  items: [
                    ["Stage-by-stage confirmation is the right discipline for hardware", "Every stage was confirmed fully working before the next began. When something broke in a new stage, the root cause search was bounded to what changed — not the entire system."],
                    ["Physical testing overrides theoretical calculation", "STEP_DELAY, STEP_SIZE, and servo limits were all determined by observing and listening to the arm, not computing from datasheets. Real hardware has tolerances and mechanical quirks that theory doesn't capture."],
                    ["Dropping a feature cleanly is a good engineering decision", "Yaw was cut. The decision was made quickly, with clear rationale, without a workaround. Knowing when to remove scope is as important as knowing what to build."],
                    ["Document calibration constants as you discover them", "SERVOMIN, SERVOMAX, per-joint limits, STEP_DELAY values — all were written down as they were confirmed. A project with undocumented constants is one hard drive failure away from starting calibration from scratch."],
                  ],
                },
              ].map(({ category, items }) => (
                <div key={category} className="mb-8">
                  <h3 className="text-base font-semibold text-[hsl(var(--highlight-sub))] mt-6 mb-2">{category}</h3>
                  <div className="space-y-3">
                    {items.map(([title, desc]) => (
                      <div key={title} className="flex gap-3">
                        <span className="text-[hsl(var(--highlight))] mt-1 flex-shrink-0">→</span>
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
