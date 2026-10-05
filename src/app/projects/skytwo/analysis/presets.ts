import type { Block, TimeChart } from "./types";

// Standard time-series charts shared by every report built from a 4.6.3 log (Flights 4-12).
// Mode bands sit behind each chart, so the same colours mean the same mode everywhere.

export const altitude = (max?: number): TimeChart => ({
  kind: "time", bands: "modes", y: { label: "Altitude (m)", max },
  series: [
    { src: "alt", y: "dalt", label: "Target altitude", color: "muted", dash: true },
    { src: "alt", y: "alt", label: "Altitude", color: "s1", width: 1.8 },
  ],
});

export const battery = (): TimeChart => ({
  kind: "time", bands: "modes", y: { label: "Volts", min: 9, max: 13 }, y2: { label: "Amps", min: 0, max: 40 },
  refs: [{ y: 10.5, label: "BATT_LOW_VOLT 10.5 V" }],
  series: [
    { src: "bat", y: "v", label: "Raw voltage", color: "s2" },
    { src: "bat", y: "vr", label: "Sag-compensated", color: "loit", width: 1.8 },
    { src: "bat", y: "i", label: "Current (A)", color: "s4", right: true, width: 1.1 },
  ],
});

export const motors = (): TimeChart => ({
  kind: "time", bands: "modes", y: { label: "PWM (µs)", min: 1000, max: 2050 },
  refs: [{ y: 2000, label: "2000 µs" }],
  series: [
    { src: "mot", y: "m1", label: "M1 front right (CCW)", color: "s1" },
    { src: "mot", y: "m2", label: "M2 back left (CCW)", color: "s3" },
    { src: "mot", y: "m3", label: "M3 front left (CW)", color: "s2" },
    { src: "mot", y: "m4", label: "M4 back right (CW)", color: "s6" },
  ],
});

export const attitude = (): TimeChart => ({
  kind: "time", bands: "modes", y: { label: "Angle (°)" },
  series: [
    { src: "att", y: "dr", label: "Desired roll", color: "muted", dash: true, width: 1 },
    { src: "att", y: "r", label: "Roll", color: "s1" },
    { src: "att", y: "dp", label: "Desired pitch", color: "muted", dash: true, width: 1 },
    { src: "att", y: "p", label: "Pitch", color: "s2" },
  ],
});

export const vibration = (): TimeChart => ({
  kind: "time", bands: "modes", y: { label: "m/s²", min: 0 },
  refs: [{ y: 30, label: "30 m/s²" }],
  series: [
    { src: "vibe", y: "x", label: "X", color: "s1", width: 1.1 },
    { src: "vibe", y: "y", label: "Y", color: "s3", width: 1.1 },
    { src: "vibe", y: "z", label: "Z", color: "s4", width: 1.3 },
  ],
});

export const gps = (): TimeChart => ({
  kind: "time", bands: "modes", y: { label: "Satellites", min: 0, max: 25 }, y2: { label: "HDOP", min: 0, max: 2 },
  series: [
    { src: "gps", y: "ns", label: "Satellites", color: "s1", step: true, width: 1.8 },
    { src: "gps", y: "hd", label: "HDOP", color: "s2", right: true },
  ],
});

// The column notes that sit under every 4.6.3 "take-off by take-off" table.
export const TABLE_NOTE_FULL =
  "Touchdown descent is the fastest CTUN climb-rate reading in the last 3 s before landing was detected. EKF innovation ratios under 1.0 are healthy. Compass field shows the in-flight spread of the field strength. Motor layout (quad X): M1 front-right CCW, M2 back-left CCW, M3 front-left CW, M4 back-right CW.";

export const FULL_HEADERS = ["Take-off", "Airborne", "Time", "Max alt", "Max dist", "Max speed", "mAh", "Current mean / max", "Min volt raw / comp.", "Pack res.", "Hover thr.", "Motors M1–M4 (µs)", "CW−CCW / back−front", "Vibe X/Y/Z median", "Clips", "Roll err RMS / peak", "Pitch err RMS / peak", "Touchdown descent", "Sats / HDOP", "EKF innov. vel/pos/hgt/mag", "Compass field"];

export const SHORT_HEADERS = ["Take-off", "Time", "Alt m", "Dist m", "Spd m/s", "mAh", "Amps avg/max", "V min raw/comp", "Motors M1·M2·M3·M4 µs", "CW−CCW", "Vibe Z med"];

export const MODES_46 = ["stab", "alth", "loit", "rtl", "land", "tune"] as const;

// Charts section used by Flights 8-12, in the original order.
export function chartsSection(c: { alt: string; bat: string; mot: string; att: string; vibe: string; gps: string; track: string; spec: string; altMax?: number }): Block[] {
  return [
    { type: "section", title: "Charts" },
    { type: "modeLegend", modes: [...MODES_46], note: "Shaded bands show the flight mode." },
    { type: "chart", title: "Altitude", caption: c.alt, chart: altitude(c.altMax) },
    { type: "chart", title: "Battery", caption: c.bat, chart: battery() },
    { type: "chart", title: "Motor outputs", caption: c.mot, chart: motors() },
    { type: "chart", title: "Attitude", caption: c.att, chart: attitude() },
    { type: "chart", title: "Vibration", caption: c.vibe, chart: vibration() },
    { type: "chart", title: "GPS", caption: c.gps, chart: gps() },
    { type: "chart", title: "GPS path", caption: c.track, chart: { kind: "track" } },
    { type: "chart", title: "Gyro spectrum", caption: c.spec, chart: { kind: "spectrum" } },
  ];
}

// GPS track + timelines used by Flights 4-7, in the original order.
export function timelinesSection(trackCaption: string): Block[] {
  return [
    { type: "section", title: "GPS track" },
    { type: "chart", caption: trackCaption, chart: { kind: "track" } },
    { type: "section", title: "Timelines" },
    { type: "modeLegend", modes: ["stab", "alth", "loit", "rtl", "land"], note: "Shaded bands show the flight mode." },
    { type: "chart", title: "Altitude", caption: "Altitude vs. desired altitude. The ~15 m plateaus are RTL climbs to RTL_ALT.", chart: altitude() },
    { type: "chart", title: "Battery", caption: "Battery voltage and current. Failsafes now use the green sag-compensated line, not the orange raw one.", chart: battery() },
    { type: "chart", title: "Motor outputs", caption: "Motor outputs, averaged over 1 s. M3/M4 are the CW pair.", chart: motors() },
    { type: "chart", title: "Attitude", caption: "Attitude tracking: dashed grey = what the controller asked for, colour = what the frame did.", chart: attitude() },
    { type: "chart", title: "Vibration", caption: "Vibration. Spikes above the line are touchdowns, not in-flight problems.", chart: vibration() },
    { type: "chart", title: "GPS", caption: "GPS satellites and HDOP.", chart: gps() },
  ];
}

export const SOURCE_46 = "Times are seconds since board boot, as in the log. Motor order follows ArduCopter QUAD/X: M1 front-right CCW, M2 back-left CCW, M3 front-left CW, M4 back-right CW.";
