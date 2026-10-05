import type { Axis, Block, Color, TimeChart } from "@/components/flight-analysis/types";

// Standard charts for SkyOne's APM 2.8 / ArduCopter 3.2.1 logs (data from tools/skyone/extract_flight.py).
// The APM only logs while armed, so most charts zoom to one arm cycle with `x`.

type Zoom = { x?: Axis; bands?: TimeChart["bands"] };

export const throttle = ({ x, bands = "faults" }: Zoom = {}): TimeChart => ({
  kind: "time", bands, x, y: { label: "Throttle (%)", min: 0, max: 100 },
  series: [
    { src: "thr", y: "tin", label: "Throttle received (stick)", color: "ink", width: 1.8 },
    { src: "thr", y: "tout", label: "Throttle sent to motors", color: "s2", width: 1.5 },
  ],
});

export const rcInputs = ({ x, bands = "faults" }: Zoom = {}): TimeChart => ({
  kind: "time", bands, x, y: { label: "RC input (µs)", min: 900, max: 2100 },
  series: [
    { src: "rc", y: "c1", label: "CH1 roll", color: "s1", width: 1.2 },
    { src: "rc", y: "c2", label: "CH2 pitch", color: "s3", width: 1.2 },
    { src: "rc", y: "c3", label: "CH3 throttle", color: "ink", width: 1.8 },
    { src: "rc", y: "c4", label: "CH4 yaw", color: "s6", width: 1.2 },
    { src: "rc", y: "c5", label: "CH5 mode", color: "s5", width: 1.2, dash: true },
  ],
});

export const motors = ({ x, bands = "faults" }: Zoom = {}): TimeChart => ({
  kind: "time", bands, x, y: { label: "PWM (µs)", min: 1000, max: 2050 },
  refs: [{ y: 2000, label: "2000 µs" }],
  series: [
    { src: "mot", y: "m1", label: "M1 front right (CCW)", color: "s1", width: 1.2 },
    { src: "mot", y: "m2", label: "M2 back left (CCW)", color: "s3", width: 1.2 },
    { src: "mot", y: "m3", label: "M3 front left (CW)", color: "s2", width: 1.2 },
    { src: "mot", y: "m4", label: "M4 back right (CW)", color: "s4", width: 1.6 },
  ],
});

export const attitude = ({ x, bands = "modes" }: Zoom = {}): TimeChart => ({
  kind: "time", bands, x, y: { label: "Angle (°)" },
  series: [
    { src: "att", y: "dr", label: "Desired roll", color: "muted", dash: true, width: 1 },
    { src: "att", y: "r", label: "Roll", color: "s1" },
    { src: "att", y: "dp", label: "Desired pitch", color: "muted", dash: true, width: 1 },
    { src: "att", y: "p", label: "Pitch", color: "s2" },
  ],
});

export const vibration = ({ x, bands = "faults" }: Zoom = {}): TimeChart => ({
  kind: "time", bands, x, y: { label: "Accel (m/s²)", min: -40, max: 40 },
  series: [
    { src: "imu", y: "ax", label: "Accel X (fore–aft)", color: "s1", width: 1 },
    { src: "imu", y: "ay", label: "Accel Y (side)", color: "s3", width: 1 },
  ],
});

export const battery = ({ x, bands = "modes" }: Zoom = {}): TimeChart => ({
  kind: "time", bands, x, y: { label: "Volts", min: 10, max: 15 }, y2: { label: "Amps", min: 0, max: 40 },
  series: [
    { src: "bat", y: "v", label: "Battery voltage", color: "s2", width: 1.6 },
    { src: "bat", y: "i", label: "Current (A)", color: "s4", right: true, width: 1.2 },
  ],
});

// The fault-band key used above every chart that shades RC faults.
export function faultLegend(kinds: ("throttleLow" | "corrupted" | "frozen" | "placeholderA" | "placeholderB")[], note?: string): Block {
  const label: Record<string, [Color, string]> = {
    throttleLow: ["warn", "Throttle-low frame"],
    corrupted: ["s4", "Corrupted frame (channels identical)"],
    frozen: ["muted", "Input frozen"],
    placeholderA: ["s2", "Placeholder frame A (throttle ≈1000)"],
    placeholderB: ["s5", "Placeholder frame B (throttle 1100, mode 1555)"],
  };
  return { type: "legend", items: [...kinds.map(k => ({ color: label[k][0], label: label[k][1] })), { color: "land", label: "Land mode" }], note };
}

export const SOURCE_32 = "Decoded from the APM's binary dataflash log with pymavlink. The APM only logs while armed, so the time axis jumps between arm cycles. Motor order follows ArduCopter quad X: M1 front-right CCW, M2 back-left CCW, M3 front-left CW, M4 back-right CW. SkyOne has no GPS, so there is no map or position data.";
