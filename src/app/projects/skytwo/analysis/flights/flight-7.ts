import type { FlightAnalysis } from "../types";
import { SHORT_HEADERS, SOURCE_46, timelinesSection } from "../presets";

const flight7: FlightAnalysis = {
  flight: 7,
  meta: ["2 Oct 2026, 09:42", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "5600 attitude samples", "591 s logged"],
  headline: "Two take-offs, most aggressive flying, one in-air disarm",
  summary: ["Two good Loiter flights, each ended by RTL. After the first RTL touched down, a switch to Stabilize with the throttle stick still at mid made it hop back up, and it was disarmed about half a metre in the air."],
  stats: [
    { value: "2 · 7.8 min", label: "Take-offs · in the air" },
    { value: "15.8 m", label: "Max altitude" },
    { value: "63 m", label: "Max distance from home" },
    { value: "1923 mAh", label: "Energy used" },
    { value: "12.03 → 11.34 V", label: "Battery (rest)" },
    { value: "19–22 / ≤ 0.57", label: "GPS sats / HDOP" },
    { value: "0.41", label: "Hover throttle learned" },
    { value: "14", label: "Clip events" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: SHORT_HEADERS, rows: [
      ["1 · 94–354 s", "260 s", "15.0", "63", "9.8", "1052", "14.6 / 24.0", "9.97 / 11.46", "1604 · 1613 · 1621 · 1678", "+41", "12.0"],
      ["2 · 385–590 s", "205 s", "15.8", "45", "9.7", "861", "15.1 / 27.6", "9.64 / 11.26", "1590 · 1681 · 1647 · 1688", "+32", "13.1"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "fix", title: "In-air disarm after RTL (≈353 s)", body: ["RTL touched down at ~352.4 s. At 353.1 s you switched to Stabilize while the throttle stick was still near mid. Stabilize passes the stick straight through, so the motors went back to ~48 % and the drone climbed to ~0.5 m (+0.6 m/s). It was disarmed with SD at 353.8 s while airborne and dropped: that drop caused 14 clip events and a 60 m/s² vibration spike. The fix is to stay in RTL/Land/Loiter after touchdown, hold throttle at minimum, and let it disarm itself."] },
      { tag: "healthy", title: "Loiter take-offs", body: ["Take-off 1: armed in Stabilize, switched to Loiter, took off at 93.6 s. Take-off 2: armed in Loiter, took off at 385.2 s. In between there was a disarm-delay auto-disarm at 373.9 s (armed for 10 s without taking off), which is normal."] },
      { tag: "watch", title: "Hardest flying of the day (take-off 2)", body: ["Full stick deflection (RC 982–2005 µs) with up to 32° pitch and 26° roll. Motors reached 1949 µs, close to the 2000 µs ceiling. Pitch overshot the target by up to ~11° on fast reversals (409.8 s, 453.9 s), and the peak combined error was about 22°. The default tune holds, but it is loose at the edges — a good reason to run AutoTune later."] },
      { tag: "healthy", title: "Second RTL landed itself", body: ["RTL at 544.1 s → home → touchdown at ~0.45 m/s at 590.3 s → auto-disarm. Clean."] },
      { tag: "watch", title: "Deepest voltage sag", body: ["Raw voltage reached 9.64 V at 27.6 A (407 s, during the aggressive maneuvering); sag-compensated stayed at 11.26 V. The pack used 2,311 mAh across Flights 6 and 7 and rested at 11.34 V, after which the arming-voltage check blocked re-arming."] },
      { tag: "note", title: "Motors", body: ["Take-off 2 spread the motor outputs more, because of the hard maneuvering. CW motors were again higher than CCW, and M4 (back-right) was the busiest motor throughout. The board heated to ~43 °C (gyro calibration temperature)."] },
    ] },
    ...timelinesSection("Flown path (airborne portion only), coloured by flight mode. Home ≈ 17.54088, 78.57631."),
  ],
  source: SOURCE_46,
};

export default flight7;
