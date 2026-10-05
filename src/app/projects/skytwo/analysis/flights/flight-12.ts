import type { FlightAnalysis } from "@/components/flight-analysis/types";
import { chartsSection, FULL_HEADERS, TABLE_NOTE_FULL } from "../presets";

const flight12: FlightAnalysis = {
  flight: 12,
  meta: ["5 Oct 2026, 11:03 IST", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "Logged about 13 min 40 s"],
  headline: "First flight on the full AutoTune: tight control, the 40 m fence working both ways",
  summary: ["One take-off of 12.4 minutes on a full battery, with all three axes on AutoTune gains and the geofence reduced to 40 m. Attitude tracking is the best of any log so far: roll and pitch errors about 1° RMS while flying briskly at up to 11 m/s. In Loiter, SkyTwo stopped short of the fence like an invisible wall, which is ArduPilot's fence avoidance (AVOID_ENABLE 3). In AltHold, which has no avoidance, a fast dash crossed the fence at 502 s; the breach triggered RTL, but momentum carried SkyTwo to about 59.6 m before it turned back. You took back control in Loiter at 517 s. You flipped SC for RTL at 767 s; the capacity failsafe also triggered at 4200 mAh during that RTL. Afterwards arming was refused because the battery failsafe stays latched until reboot and the pack rested below BATT_ARM_VOLT (11.4 V). That was the yellow light and warning beep."],
  stats: [
    { value: "1 · 12:25", label: "Take-off · air time" },
    { value: "16.0 m", label: "Max altitude (RTL)" },
    { value: "59.6 m", label: "Max distance (fence overshoot)" },
    { value: "4294 mAh", label: "Energy used (69%)" },
    { value: "12.63 → 10.13 V", label: "Start → lowest under load" },
    { value: "13–18 / 0.74", label: "GPS sats / worst HDOP" },
    { value: "0.409", label: "Hover throttle (saved)" },
    { value: "0", label: "Accelerometer clips" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: FULL_HEADERS, note: TABLE_NOTE_FULL, rows: [
      ["1", "64–809 s", "12:25", "16.0 m", "59.6 m", "11.3 m/s", "4285", "20.7 / 30.5 A", "10.13 / 11.26 V", "45 mΩ", "0.409", "1599 1609 1657 1625", "+37 / -11", "2.5/4.4/9.8 (p95 16.2)", "0", "1.1° / 6.9° @302s", "1.0° / 10.0° @302s", "0.63 m/s", "13–18 / 0.74", "0.55/0.14/0.46/0.59", "±8.9%"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "healthy", title: "The AutoTune gains fly very well", body: ["Roll error RMS 1.09°, pitch 1.01° over 12 minutes of brisk flying, peaks 6.9° and 10.0° during the hardest manoeuvre at 302 s. No sign of the slow rocking that a too-high angle P would cause, and no motor stutter. Roll angle P 14.4 and yaw rate P 0.734 look right for SkyTwo."] },
      { tag: "healthy", title: "The “invisible boundary” is the geofence in Loiter", body: ["With FENCE_RADIUS 40, FENCE_MARGIN 2 and AVOID_ENABLE 3 (fence + proximity), Loiter slows and stops SkyTwo short of the fence instead of breaching it. In two Loiter phases the farthest point was 39.3 m and 36.8 m. This is fence avoidance working as designed."] },
      { tag: "watch", title: "Fence breach in AltHold (487.2 → 517.4 s)", body: ["AltHold does not use fence avoidance. You switched to AltHold at 487 s and flew outward at up to 11.3 m/s. At 502.0 s, about 38.5 m out: “Circle fence breached” → RTL. SkyTwo was moving so fast that it covered about 20 m more while braking, reaching 59.6 m at 505.6 s. It turned back, the breach cleared at 510.9 s, and you switched to Loiter at 517.4 s near home. Lesson: in AltHold, the fence only reacts after you cross it, and at 10 m/s you need about 20 m to stop. Keep the fence well inside your safe area."] },
      { tag: "note", title: "RTL by switch, then battery failsafe (767.2 → 809.6 s)", body: ["You flipped SC at 767.2 s. During that RTL, the capacity failsafe triggered at 791.2 s (“Battery 1 is low 10.43V used 4200 mAh”); its action is also RTL, so nothing changed. Landed and auto-disarmed at 809.6 s."] },
      { tag: "healthy", title: "Why it would not arm again (811–841 s)", body: ["PreArm messages: “Battery 1 below minimum arming voltage” and “Battery failsafe”. The battery failsafe stays latched until reboot, and the pack rested at about 11.36 V, below BATT_ARM_VOLT 11.4. Refusing to arm is the correct behaviour. Powering off was the right call."] },
      { tag: "healthy", title: "Current calibration holds", body: ["After Flight 11, the charger put back 4301 mAh against 4351 logged (1.1% difference). This flight logged 4294 mAh, so expect about 4250–4300 from the charger. Hover current about 20 A."] },
      { tag: "note", title: "Hover throttle 0.409", body: ["Saved on landing, normal for a nearly drained pack."] },
      { tag: "note", title: "CW motors 37 µs busier than CCW", body: ["Same as Flight 11 (35–38). Steady, not getting worse. Check motor alignment when convenient."] },
      { tag: "healthy", title: "Healthy: vibration, GPS, EKF", body: ["Vibration medians X 2.5, Y 4.4, Z 9.8 m/s² (p95 Z 16 during fast flying), no clipping; notch still removing the 80 Hz peak. 13–18 satellites, HDOP at most 0.74. EKF innovation ratios at most 0.59. Soft touchdown at 0.6 m/s. No laptop this flight, so no telemetry check."] },
    ] },
    { type: "section", title: "What changed since Flight 11" },
    { type: "table", headers: ["Area", "Flight 11 (5 Oct morning)", "Flight 12 (5 Oct midday)"], rows: [
      ["Gains", "Pitch and yaw being tuned", "Full AutoTune set on all three axes"],
      ["Roll angle P", "10", "14.4 (matched to pitch)"],
      ["Geofence radius", "60 m", "40 m"],
      ["Flying style", "Hovering for AutoTune (max 7 m from home)", "Brisk test flying, up to 11.3 m/s"],
      ["SA switch", "AutoTune", "Land"],
      ["Roll / pitch error RMS", "0.4–0.4° / 0.2–2.7° (incl. twitches)", "1.1° / 1.0° while flying hard"],
    ] },
    { type: "callout", label: "Next session", paras: ["Phase 0 is done. Next: Phase 1, starting with RTL from Loiter at a distance, then Guided mode from QGC. This needs a reliable telemetry link, so sort out the radio first. Keep the 40 m fence, and remember that in AltHold you can overshoot it by about 20 m at full speed."] },
    ...chartsSection({
      alt: "Altitude against the target. The climbs to about 15 m are the two RTLs (RTL_ALT 15 m).",
      bat: "Raw voltage, sag-compensated voltage and current. The red dotted line is BATT_LOW_VOLT (10.5 V).",
      mot: "Motor outputs averaged over 1 s. The red dotted line at 2000 µs is the top of the range.",
      att: "Desired versus actual roll and pitch with the full AutoTune gains. The actual trace sits on top of the desired one almost everywhere.",
      vibe: "Accelerometer vibration on X, Y and Z. Below 30 m/s² is acceptable; below 15 m/s² is good.",
      gps: "GPS satellites and HDOP.",
      track: "Airborne path in metres from home (north up), coloured by mode. Red dotted circle = the new 40 m fence. The Loiter path flattens against the circle (fence avoidance); the AltHold dash at about 502 s crossed it and RTL turned SkyTwo back from about 59.6 m.",
      spec: "Roll gyro spectrum before and after the notch filter, with pre-filter pitch. Dotted lines mark 80, 160 and 240 Hz.",
    }),
  ],
};

export default flight12;
