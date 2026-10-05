import type { FlightAnalysis } from "@/components/flight-analysis/types";
import { chartsSection, FULL_HEADERS, TABLE_NOTE_FULL } from "../presets";

const flight10: FlightAnalysis = {
  flight: 10,
  meta: ["4 Oct 2026, 17:06 IST", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "Logged about 15 min 30 s"],
  headline: "Pitch AutoTune failed twice in gusty air, and the battery failsafe brought SkyTwo home",
  summary: ["Three take-offs on one battery, about 13.2 minutes in the air. Pitch AutoTune was attempted twice from Loiter. The first attempt failed to level after 20 s; the second worked through pitch rate D and into rate P for about six minutes, then failed to level at 713.9 s. Before both failures, the target heading swung about 90° at roughly 60°/s with the yaw stick centred, which AutoTune cannot tolerate. Gusty air is the most likely contributor. No pitch gains were saved. In take-off 3, the capacity failsafe triggered RTL at exactly 4201 mAh used, as planned. The current reading is now about 20 A in hover, which confirms yesterday's recalibration."],
  stats: [
    { value: "3 · 13:10", label: "Take-offs · air time" },
    { value: "27.6 m", label: "Max altitude (T3)" },
    { value: "58.1 m", label: "Max distance (T3)" },
    { value: "4465 mAh", label: "Energy used (72%)" },
    { value: "12.68 → 10.02 V", label: "Start → lowest under load" },
    { value: "18–24 / 0.58", label: "GPS sats / worst HDOP" },
    { value: "0.409", label: "Hover throttle (saved)" },
    { value: "0", label: "Accelerometer clips" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: FULL_HEADERS, note: TABLE_NOTE_FULL, rows: [
      ["1", "172–298 s", "2:06", "7.3 m", "15.5 m", "2.7 m/s", "655", "18.7 / 26.4 A", "11.15 / 12.27 V", "51 mΩ", "0.350", "1592 1546 1607 1580", "+24 / -36", "2.4/4.6/9.0 (p95 12.5)", "0", "0.6° / 2.0° @239s", "1.8° / 14.1° @228s", "0.69 m/s", "18–20 / 0.58", "0.15/0.05/0.13/0.54", "±5.9%"],
      ["2", "341–738 s", "6:37", "6.7 m", "12.7 m", "2.0 m/s", "2235", "20.3 / 26.5 A", "10.39 / 11.48 V", "49 mΩ", "0.409", "1627 1598 1632 1641", "+24 / -10", "2.4/4.5/9.4 (p95 13.0)", "0", "0.6° / 3.0° @734s", "2.4° / 14.7° @376s", "0.70 m/s", "20–22 / 0.54", "0.29/0.06/0.15/0.67", "±7.1%"],
      ["3", "786–1053 s", "4:27", "27.6 m", "58.1 m", "9.0 m/s", "1556", "21.0 / 28.3 A", "10.02 / 11.21 V", "47 mΩ", "0.409", "1620 1651 1630 1692", "+25 / +47", "2.6/4.7/10.1 (p95 15.2)", "0", "1.2° / 5.6° @943s", "3.0° / 15.8° @941s", "0.60 m/s", "21–24 / 0.53", "0.17/0.06/0.31/0.64", "±6.1%"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "watch", title: "Pitch AutoTune attempt 1: failed to level after 20 s (216.3 → 236.8 s)", body: ["Twitches started (pitch rate D), but at 235–236 s the target heading swung from about 207° to 117° at up to 106°/s with the yaw stick centred at 1495 µs, and SkyTwo drifted at up to 1.3 m/s. AutoTune could not pass its level check and gave up. You landed while still in AutoTune; the “pilot overrides active” messages are just the landing stick inputs."] },
      { tag: "watch", title: "Pitch AutoTune attempt 2: failed to level after about 6 min (361.6 → 713.9 s)", body: ["Progress was slow: pitch rate D went up, back down and up again between 403 and 545 s, then rate P from 601 s. At 710–713 s the target heading again swung about 155° (267° → 113°) at 60–105°/s, with the yaw stick centred, and AutoTune failed just before completing. About 2235 mAh were used in this take-off."] },
      { tag: "note", title: "No pitch gains saved", body: ["After a failed AutoTune, the original gains stay. Pitch is still at defaults (rate P 0.137, rate D 0.0036, angle P 4.5). Roll gains from 3 October are intact (rate D 0.0059, angle P 10)."] },
      { tag: "healthy", title: "Battery failsafe worked exactly as designed (1005.0 s)", body: ["“Battery 1 is low 10.36V used 4201 mAh” → Battery Failsafe → RTL (mode reason: battery failsafe). This is the capacity failsafe (BATT_LOW_MAH 2000 remaining) on a 6200 mAh pack. RTL brought SkyTwo home and landed it at 1052.8 s with a soft 0.6 m/s touchdown. This was the automatic return you saw; it was not the geofence."] },
      { tag: "healthy", title: "Current-sensor recalibration confirmed", body: ["With BATT_AMP_PERVLT 24.5, hover current reads 19–21 A (mean 18.7–21.0 A per take-off), matching what the 3 October charger comparison predicted. Total logged: 4465 mAh. Compare with what the charger puts back to double-check."] },
      { tag: "note", title: "Telemetry still marginal", body: ["You had to follow SkyTwo with the laptop to keep the link. Pointing the drone antenna down helped. Next improvements: hold the ground antenna vertical and up high, away from your body and the laptop. During AutoTune the link is not needed: the twitching stopping, plus checking the parameters after landing, tells you the result."] },
      { tag: "watch", title: "Hover throttle saved as 0.350 after take-off 1", body: ["Landing in AutoTune after the failure saved MOT_THST_HOVER 0.350. Take-offs 2 and 3 learned it back to 0.409, which is the final saved value, so nothing needs fixing."] },
      { tag: "note", title: "Take-off 3 climbed close to the fence ceiling", body: ["Max altitude 27.6 m against the 30 m fence, and 58.1 m from home against the 60 m radius. No breach was recorded."] },
      { tag: "note", title: "Yaw imbalance unchanged", body: ["CW motors (M3, M4) still average 24–25 µs more than CCW in every take-off. This is a small constant yaw demand, possibly from a slightly tilted motor or twisted arm. It may make the heading easier to disturb, so check motor alignment."] },
      { tag: "healthy", title: "Healthy: vibration, notch filter, GPS, EKF", body: ["Vibration medians X 2.4–2.6, Y 4.5–4.7, Z 9.0–10.1 m/s², no clipping; the notch still removes the 80 Hz roll-gyro peak. 18–24 satellites, HDOP at most 0.58. EKF innovation ratios at most 0.67. All three touchdowns soft (0.6–0.7 m/s)."] },
    ] },
    { type: "section", title: "What changed since 3 October" },
    { type: "table", headers: ["Area", "Flight 9 (3 Oct evening)", "Flight 10 (4 Oct)"], rows: [
      ["Current sensor", "BATT_AMP_PERVLT 17, hover read 13–15 A (under-reading about 31%)", "BATT_AMP_PERVLT 24.5, hover reads 19–21 A"],
      ["AutoTune target", "Roll (AUTOTUNE_AXES 1): success, entered manually", "Pitch (AUTOTUNE_AXES 2): failed to level twice"],
      ["Battery failsafe", "Not triggered (counter under-read)", "Triggered RTL at 4201 mAh used, as planned"],
      ["Energy used", "3601 mAh logged (about 5268 real, by charger)", "4465 mAh logged (calibrated)"],
      ["Vibration median Z", "8.9–9.8 m/s²", "9.0–10.1 m/s²"],
    ] },
    { type: "callout", label: "Next session", paras: ["Calm early morning, full battery. Pitch AutoTune as the first take-off, started from AltHold, with the laptop on the ground. When the twitching stops for 15–20 s, land with SA on, disarm, switch SA off, then check ATC_RAT_PIT_D and ATC_ANG_PIT_P in QGC. Yaw (AUTOTUNE_AXES 4) only if at least 3000 mAh remains."] },
    ...chartsSection({
      alt: "Altitude (barometer) against the target altitude. Take-off 3 climbed to 27.6 m, close to the 30 m fence ceiling.",
      bat: "Raw battery voltage, sag-compensated voltage and current, now with the recalibrated current sensor (BATT_AMP_PERVLT 24.5). The red dotted line is BATT_LOW_VOLT (10.5 V).",
      mot: "Motor outputs averaged over 1 s. The red dotted line at 2000 µs is the top of the range.",
      att: "Desired versus actual roll and pitch. The sharp pitch spikes in take-offs 1 and 2 are AutoTune twitches.",
      vibe: "Accelerometer vibration on X, Y and Z. Below 30 m/s² is acceptable; below 15 m/s² is good.",
      gps: "GPS satellites and HDOP.",
      track: "Airborne path in metres from home (north up), coloured by mode. Teal = AutoTune, green = Loiter, red = RTL. Green triangle = takeoff, red triangle = touchdown, yellow H = home, red dotted circle = 60 m fence.",
      spec: "Roll gyro spectrum from take-off 3, before and after the notch filter, with pre-filter pitch for comparison. Dotted lines mark 80, 160 and 240 Hz. The notch is still doing its job.",
    }),
  ],
};

export default flight10;
