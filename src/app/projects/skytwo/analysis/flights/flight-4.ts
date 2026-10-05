import type { FlightAnalysis } from "../types";
import { SHORT_HEADERS, SOURCE_46, timelinesSection } from "../presets";

const flight4: FlightAnalysis = {
  flight: 4,
  meta: ["2 Oct 2026, 07:14", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "5046 attitude samples", "527 s logged"],
  headline: "One 7-minute flight, all in Loiter",
  summary: ["A textbook flight: armed and took off in Loiter, flew around for 7 minutes, and landed with the Land switch at 0.6 m/s with zero accelerometer clipping."],
  stats: [
    { value: "1 · 7.1 min", label: "Take-offs · in the air" },
    { value: "5.5 m", label: "Max altitude" },
    { value: "70 m", label: "Max distance from home" },
    { value: "1635 mAh", label: "Energy used" },
    { value: "12.70 → 11.73 V", label: "Battery (rest)" },
    { value: "9–16 / ≤ 1.18", label: "GPS sats / HDOP" },
    { value: "0.40", label: "Hover throttle learned" },
    { value: "0", label: "Clip events" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: SHORT_HEADERS, rows: [
      ["1 · 89–513 s", "424 s", "5.5", "70", "8.9", "1627", "13.8 / 17.1", "10.65 / 11.62", "1576 · 1600 · 1604 · 1629", "+29", "11.8"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "healthy", title: "Took off in Loiter", body: ["You armed in Loiter (82.5 s) and lifted off at 89.4 s without ever touching Stabilize. Loiter was held for the whole 424 s. Max 71 m from home, up to 8.9 m/s ground speed, kept low at ≤ 5.5 m."] },
      { tag: "healthy", title: "Soft landing via the Land switch", body: ["SA → Land at 498.8 s. The descent finished at about 0.6 m/s, the landing detector confirmed touchdown at 513.4 s and the drone disarmed itself. No clip events at all in this log — compare with yesterday's hard last landing."] },
      { tag: "healthy", title: "Navigation health", body: ["15–16 satellites, HDOP ≤ 1.2. EKF innovations all small (compass test ratio ≤ 0.38, position ≤ 0.08). External compass field steady at 423 ± 3 mGauss; it is not affected by motor current."] },
      { tag: "healthy", title: "Vibration fine", body: ["In-flight medians X 2.5 / Y 4.7 / Z 11.8 m/s²; 95th percentile Z 17. Comfortably under the 30 m/s² caution line."] },
      { tag: "watch", title: "Voltage sag under load", body: ["Raw voltage dipped to 10.65 V at 16 A while the sag-compensated reading stayed at 11.6 V. The estimated pack resistance is about 0.07 Ω, which is high for a 6200 mAh 40C pack — see the overall notes."] },
      { tag: "note", title: "Motor split", body: ["The CW motors (M3, M4) averaged about 28 µs more than the CCW pair. This is a mild yaw bias, much smaller than the ~90 µs per motor seen on the 2025 flight. Hover throttle learned 0.38 → 0.40."] },
      { tag: "note", title: "Re-arm attempts after landing", body: ["\"LAND mode not armable\" ×4 means SA was still in the Land position when you tried to arm again. That is harmless, but see the switch-warning tip."] },
    ] },
    ...timelinesSection("Flown path (airborne portion only), coloured by flight mode. Home ≈ 17.54082, 78.57632."),
  ],
  source: SOURCE_46,
};

export default flight4;
