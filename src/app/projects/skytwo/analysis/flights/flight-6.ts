import type { FlightAnalysis } from "@/components/flight-analysis/types";
import { SHORT_HEADERS, SOURCE_46, timelinesSection } from "../presets";

const flight6: FlightAnalysis = {
  flight: 6,
  meta: ["2 Oct 2026, 09:31", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "1421 attitude samples", "165 s logged"],
  headline: "Short flight on the second pack — before GPS lock",
  summary: ["The flight itself was fine, but it took off 7 seconds after boot, long before the GPS had a fix. For about 80 seconds there was no home position and no Loiter or RTL to fall back on."],
  stats: [
    { value: "1 · 1.6 min", label: "Take-offs · in the air" },
    { value: "21.3 m", label: "Max altitude" },
    { value: "20 m", label: "Max distance from home" },
    { value: "388 mAh", label: "Energy used" },
    { value: "12.29 → 12.02 V", label: "Battery (rest)" },
    { value: "4–19 / ≤ 4.54", label: "GPS sats / HDOP" },
    { value: "0.43", label: "Hover throttle learned" },
    { value: "0", label: "Clip events" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: SHORT_HEADERS, rows: [
      ["1 · 23–121 s", "98 s", "21.3", "20", "2.8", "383", "14.1 / 19.6", "10.77 / 11.90", "1623 · 1563 · 1602 · 1655", "+35", "11.8"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "watch", title: "Took off without GPS", body: ["The GPS was detected at 22.0 s and you lifted off at 23.1 s in Stabilize. The EKF set its origin and started using GPS only at 102.8 s, about 80 s into the flight. During that window, a radio failsafe would have fallen back to Land instead of RTL, and Loiter was unavailable (\"requires position\" at 21.7 s)."] },
      { tag: "note", title: "Highest climb of the day", body: ["Climbed to 21.3 m in Stabilize/AltHold (AltHold from 64.2 s). Attitude error RMS was higher (≈2.2°) than in the Loiter flights, which is expected when flying manually without position hold."] },
      { tag: "healthy", title: "Land-switch landing", body: ["SA → Land at 105.7 s. Touchdown at about 0.5 m/s at 121.0 s, followed by auto-disarm. Zero clip events."] },
      { tag: "note", title: "Pack state", body: ["Started at 12.29 V at rest (4.10 V/cell), so either a different pack or one that was not fully charged. Used 388 mAh. Raw minimum was 10.77 V at 18 A."] },
      { tag: "healthy", title: "Hot but healthy", body: ["Barometer temperature rose to ~39 °C (sun on the board), with no sign of altitude drift problems. Compass and EKF were clean once GPS came in."] },
    ] },
    ...timelinesSection("Flown path (airborne portion only), coloured by flight mode. Home ≈ 17.54110, 78.57630."),
  ],
  source: SOURCE_46,
};

export default flight6;
