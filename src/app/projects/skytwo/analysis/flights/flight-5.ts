import type { FlightAnalysis } from "../types";
import { SHORT_HEADERS, SOURCE_46, timelinesSection } from "../presets";

const flight5: FlightAnalysis = {
  flight: 5,
  meta: ["2 Oct 2026, 07:27", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "6463 attitude samples", "647 s logged"],
  headline: "Two take-offs, three RTL tests, longest flight of the day",
  summary: ["The 9½-minute second take-off exercised Stabilize, AltHold and two RTLs, and the last RTL landed the drone by itself softly. The only rough moment was the short Stabilize hop at the start."],
  stats: [
    { value: "2 · 9.9 min", label: "Take-offs · in the air" },
    { value: "14.9 m", label: "Max altitude" },
    { value: "87 m", label: "Max distance from home" },
    { value: "2414 mAh", label: "Energy used" },
    { value: "11.75 → 11.08 V", label: "Battery (rest)" },
    { value: "14–17 / ≤ 0.71", label: "GPS sats / HDOP" },
    { value: "0.43", label: "Hover throttle learned" },
    { value: "34", label: "Clip events" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: SHORT_HEADERS, rows: [
      ["1 · 38–68 s", "30 s", "7.0", "14", "1.1", "101", "12.1 / 16.3", "10.66 / 11.61", "1578 · 1583 · 1608 · 1615", "+31", "10.9"],
      ["2 · 72–637 s", "565 s", "14.9", "87", "10.1", "2308", "14.7 / 20.1", "9.79 / 10.98", "1628 · 1629 · 1664 · 1666", "+37", "11.8"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "watch", title: "Take-off 1: a sinking Stabilize hop", body: ["Took off in Stabilize at 37.6 s. The throttle stick was held at 1445 µs, slightly below hover, so the drone sank from about 4 m and touched down at roughly 1.6 m/s at 52.4 s. That touchdown caused all 34 clip events in this log, the firmest contact of the day. No damage is implied, but it is the Stabilize-landing pattern again."] },
      { tag: "healthy", title: "Take-off 2: mode tour", body: ["Took off at 72.1 s in Stabilize → AltHold (147.9 s) → RTL via SC (240.2 s) → back to AltHold after 47 s (286.9 s) → RTL again (579.3 s). The second RTL climbed to the 15 m RTL_ALT, came home and landed at about 0.5 m/s at 636.8 s."] },
      { tag: "healthy", title: "RTL behaves correctly", body: ["Both RTLs climbed to ~15 m before returning, which is why the altitude peaks at 14.9 m. The first RTL was cancelled cleanly with the mode switch, so you know you can take control back mid-RTL."] },
      { tag: "watch", title: "Low point on the battery", body: ["Raw voltage fell to 9.79 V (3.26 V/cell) at 20 A during the last RTL climb. The sag-compensated value was 10.98 V, so no failsafe triggered — that is your new BATT_FS_VOLTSRC setting working as intended. The pack had used 4,049 mAh across Flights 4 and 5 (65 % of 6200) and rested at 11.08 V."] },
      { tag: "healthy", title: "Arming protection worked", body: ["After landing, \"Battery 1 below minimum arming voltage\" (BATT_ARM_VOLT 11.4 V) stopped another flight on a tired pack. \"Mode change to STABILIZE failed: throttle too high\" at 638 s is just the throttle-check on a mode change."] },
      { tag: "note", title: "Loiter refused before GPS", body: ["\"Mode change to LOITER failed: requires position\" at 33.8 s happened before the EKF started using GPS (49.6 s). This is normal."] },
      { tag: "note", title: "Hover learning", body: ["MOT_THST_HOVER learned 0.40 → 0.43, which ArduPilot saved. CW motors again ran ~36 µs higher than CCW."] },
    ] },
    ...timelinesSection("Flown path (airborne portion only), coloured by flight mode. Home ≈ 17.54078, 78.57625."),
  ],
  source: SOURCE_46,
};

export default flight5;
