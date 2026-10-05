import type { FlightAnalysis } from "@/components/flight-analysis/types";
import { chartsSection, FULL_HEADERS, TABLE_NOTE_FULL } from "../presets";

const flight11: FlightAnalysis = {
  flight: 11,
  meta: ["5 Oct 2026, 06:51 IST", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "Logged about 20 min 20 s"],
  headline: "Pitch and yaw AutoTune both succeeded, completing SkyTwo's tune",
  summary: ["Two take-offs in calm morning air, about 13 minutes in the air on one battery. Pitch AutoTune ran from 192.5 to 384.2 s, reported Success, and saved its gains on landing at 412.2 s. Yaw AutoTune ran from 858.6 to 1289.1 s and also reported Success, but SkyTwo kept hovering in AutoTune until the capacity failsafe triggered RTL at 1341.9 s (4200 mAh used). Leaving AutoTune that way cancelled the yaw save. A parameter write between take-offs also reset pitch rate P and I to 0.137. All results were then entered by hand and verified in the parameter file, so all three axes now carry AutoTune gains."],
  stats: [
    { value: "2 · 13:00", label: "Take-offs · air time" },
    { value: "7.2 m", label: "Max altitude" },
    { value: "6.7 m", label: "Max distance" },
    { value: "4351 mAh", label: "Energy used (70%)" },
    { value: "12.69 → 10.14 V", label: "Start → lowest under load" },
    { value: "12–17 / 0.79", label: "GPS sats / worst HDOP" },
    { value: "0.426", label: "Hover throttle (saved)" },
    { value: "0", label: "Accelerometer clips" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: FULL_HEADERS, note: TABLE_NOTE_FULL, rows: [
      ["1", "167–412 s", "4:05", "7.2 m", "6.7 m", "1.6 m/s", "1295", "19.1 / 26.7 A", "10.94 / 11.96 V", "50 mΩ", "0.372", "1565 1569 1616 1589", "+35 / -11", "2.4/4.0/7.1 (p95 10.2)", "0", "0.4° / 1.6° @235s", "2.7° / 15.2° @198s", "0.77 m/s", "12–17 / 0.79", "0.21/0.03/0.19/0.15", "±2.3%"],
      ["2", "834–1369 s", "8:55", "5.1 m", "4.9 m", "1.8 m/s", "3025", "20.3 / 24.7 A", "10.14 / 11.26 V", "54 mΩ", "0.426", "1614 1609 1662 1637", "+38 / -15", "2.3/4.0/7.9 (p95 10.6)", "0", "0.4° / 2.7° @1032s", "0.2° / 2.1° @1025s", "0.57 m/s", "16–17 / 0.66", "0.15/0.04/0.19/0.23", "±4.9%"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "healthy", title: "Pitch AutoTune succeeded and saved (192.5 → 384.2 s)", body: ["Started from Loiter in calm air; no “Failed to level” this time. Results: rate P 0.178 (was 0.137), I 0.178, D 0.00795 (was 0.0036), angle P 14.40 (was 4.5), max accel 95895 (was 110000). Landing and disarming with SA on at 412.2 s logged “AutoTune: Saved gains for Pitch”."] },
      { tag: "healthy", title: "Yaw AutoTune succeeded (858.6 → 1289.1 s)", body: ["Took about 7 minutes. Results: rate P 0.734 (was 0.18), I 0.073 (was 0.018), D 0, angle P 4.849 (was 4.5), max accel 13648 (was 27000). These match what experienced tuners typically see on quads of this size."] },
      { tag: "fix", title: "Yaw gains lost to the battery failsafe (1341.9 s)", body: ["SkyTwo hovered for about 50 s in AutoTune after Success. At 4200 mAh used, “Battery 1 is low 10.35V” triggered Battery Failsafe → RTL, which stopped AutoTune and restored the old yaw gains. It landed and auto-disarmed at 1369.6 s with no save. Habit to keep: land as soon as the twitching stops."] },
      { tag: "watch", title: "Pitch rate P/I reset between take-offs (629.4 s)", body: ["After a reboot, ATC_RAT_PIT_P and ATC_RAT_PIT_I were written back to 0.137 while AUTOTUNE_AXES was being changed in QGC (values 4, 6, 2, 0, 4). Pitch D, angle P and accel kept their new values. Re-entered as 0.178 afterwards."] },
      { tag: "healthy", title: "All gains entered and verified in the parameter file", body: ["Roll 0.137 / 0.137 / 0.0059, angle P 14.4, accel 93285. Pitch 0.178 / 0.178 / 0.00795, angle P 14.40, accel 95895. Yaw 0.734 / 0.073 / 0, angle P 4.849, accel 13648. Roll angle P was set to 14.4 to match pitch, following ArduPilot developer practice of using the lower of the two AutoTune results. Values above QGC’s ranges (angle P above 12, yaw rate P above 0.6) were force-saved; those ranges are guidance and the firmware does not clamp them. RC6_OPTION is back to 18 (SA = Land)."] },
      { tag: "healthy", title: "Battery and current calibration", body: ["4351 mAh logged with BATT_AMP_PERVLT 24.5; after the previous session the charger put back about 4400 mAh against 4465 logged, so the calibration holds. Hover current 19–20 A. Pack resistance about 50–54 mΩ, steady."] },
      { tag: "note", title: "Hover throttle 0.372 → 0.426", body: ["Take-off 1 saved 0.372 on landing; take-off 2 learned 0.426 on a lower battery. Both normal; the saved value is 0.4255."] },
      { tag: "note", title: "CW motors still a little busier", body: ["CW motors average 35–38 µs more than CCW, a bit more than in earlier logs (around 25). With the new, stronger yaw gains this is worth watching; check motor alignment."] },
      { tag: "healthy", title: "Healthy: vibration, notch, GPS, EKF, compass", body: ["Vibration medians X 2.3–2.4, Y 4.0, Z 7.1–7.9 m/s², the lowest yet, with no clipping. The notch still removes the 80 Hz roll-gyro peak. 12–17 satellites, HDOP at most 0.79. EKF innovation ratios at most 0.23. Compass field steady within about 2–5%. Soft touchdowns at 0.6–0.8 m/s."] },
    ] },
    { type: "section", title: "Tuning journey: 3 to 5 October" },
    { type: "table", headers: ["Axis", "Flight", "Outcome", "Final gains"], rows: [
      ["Roll", "8 → 9", "Failed to level without the notch; succeeded with it; not saved (switched to RTL), entered by hand", "Rate 0.137 / 0.137 / 0.0059 · angle P 14.4 · accel 93285"],
      ["Pitch", "10 → 11", "Failed to level twice in gusty air; succeeded in calm air and saved", "Rate 0.178 / 0.178 / 0.00795 · angle P 14.40 · accel 95895"],
      ["Yaw", "11", "Succeeded; not saved (battery failsafe RTL), entered by hand", "Rate 0.734 / 0.073 / 0 · angle P 4.849 · accel 13648"],
    ] },
    { type: "callout", label: "Next session", paras: ["Test flight of the full tune: hover in AltHold and Loiter, sharp roll, pitch and yaw inputs, and a 2–3 m/s descent. Watch and listen for slow rocking (if seen, lower both angle Ps to 12) or motor stutter from the SimonK ESCs. If it feels too twitchy on the sticks, raise ATC_INPUT_TC to about 0.2 before changing gains. Then Phase 1 once the telemetry link is reliable."] },
    ...chartsSection({
      alt: "Altitude (barometer) against the target altitude. Both take-offs stayed low (about 5–7 m) for AutoTune.",
      bat: "Raw battery voltage, sag-compensated voltage and current. The red dotted line is BATT_LOW_VOLT (10.5 V).",
      mot: "Motor outputs averaged over 1 s. The red dotted line at 2000 µs is the top of the range.",
      att: "Desired versus actual roll and pitch. The pitch spikes in take-off 1 are AutoTune twitches; take-off 2 (yaw tune) barely moves on roll and pitch.",
      vibe: "Accelerometer vibration on X, Y and Z. Below 30 m/s² is acceptable; below 15 m/s² is good.",
      gps: "GPS satellites and HDOP.",
      track: "Airborne path in metres from home (north up), coloured by mode. Teal = AutoTune, green = Loiter, red = RTL. Both take-offs stayed within about 7 m of home.",
      spec: "Roll gyro spectrum from the pitch AutoTune take-off, before and after the notch filter. Dotted lines mark 80, 160 and 240 Hz.",
    }),
  ],
};

export default flight11;
