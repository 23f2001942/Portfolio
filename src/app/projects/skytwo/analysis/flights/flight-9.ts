import type { FlightAnalysis } from "../types";
import { chartsSection, FULL_HEADERS, TABLE_NOTE_FULL } from "../presets";

const flight9: FlightAnalysis = {
  flight: 9,
  meta: ["3 Oct 2026, 20:42 IST", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "Logged about 17 min"],
  headline: "Notch filter fixed the vibration and roll AutoTune succeeded, but the new gains were not saved",
  summary: ["Two take-offs, about 15.3 minutes in the air, with the corrections from this morning in place. The harmonic notch filter removed more than 99% of the 80 Hz motor vibration from the roll gyro, and roll AutoTune ran from 132 s to 377 s and reported Success: rate P 0.137, I 0.137, D 0.0059, angle P 16.67, max accel 93285. At 455.7 s, still in AutoTune, the mode was switched to RTL. That stopped AutoTune and restored the old gains, so SkyTwo landed and disarmed without saving. The values were entered by hand afterwards (angle P capped at 10). Battery use stayed inside the new plan: 3601 mAh, landing at about 11.16 V resting."],
  stats: [
    { value: "2 · 15:16", label: "Take-offs · air time" },
    { value: "14.7 m", label: "Max altitude (RTL climb)" },
    { value: "57.8 m", label: "Max distance (T2)" },
    { value: "3601 mAh", label: "Energy used (58%)" },
    { value: "12.60 → 11.16 V", label: "Battery start → resting after" },
    { value: "18–19 / 0.67", label: "GPS sats / worst HDOP" },
    { value: "0.395–0.420", label: "Hover throttle (normal)" },
    { value: "0", label: "Accelerometer clips" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: FULL_HEADERS, note: TABLE_NOTE_FULL, rows: [
      ["1", "102–502 s", "6:39", "14.7 m", "12.6 m", "3.1 m/s", "1531", "13.8 / 18.2 A", "10.48 / 11.61 V", "70 mΩ", "0.395", "1599 1580 1633 1619", "+36 / -16", "2.4/3.6/8.9 (p95 12.5)", "0", "2.2° / 16.3° @322s", "0.6° / 3.7° @477s", "0.54 m/s", "18–19 / 0.64", "0.35/0.07/0.16/0.44", "±6.7%"],
      ["2", "550–1066 s", "8:36", "12.8 m", "57.8 m", "9.4 m/s", "2060", "14.4 / 20.5 A", "9.91 / 11.08 V", "67 mΩ", "0.420", "1621 1633 1657 1655", "+29 / +5", "2.6/4.0/9.8 (p95 16.1)", "0", "1.9° / 10.8° @994s", "2.8° / 13.1° @675s", "0.66 m/s", "18–19 / 0.67", "0.28/0.05/0.31/0.64", "±5.9%"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "healthy", title: "Notch filter worked", body: ["Comparing the roll gyro before and after filtering (take-off 2): the 80 Hz peak dropped by more than 99%, and the 160 Hz and 240 Hz peaks disappeared. Accelerometer vibration also came down: VibeZ median 8.9–9.8 m/s² compared with 11.9–12.6 this morning, VibeY 3.6–4.0 compared with 4.7–5.3."] },
      { tag: "healthy", title: "Roll AutoTune completed (132.0 → 377.4 s)", body: ["Twitching started within 32 s, rate D was raised and then trimmed, then rate P, then angle P. “AutoTune: Roll complete … Success” at 377.4 s. Results: rate P 0.137 (was 0.135), I 0.137, D 0.0059 (was 0.0036), angle P 16.67 (was 4.5), max accel 93285 (was 110000). The roll tracking peak of 16.3° at 322 s is an AutoTune twitch, not a problem."] },
      { tag: "fix", title: "Gains lost by switching to RTL during AutoTune (455.7 s)", body: ["The mode changed to RTL with reason “aux switch” (most likely SC) while AutoTune was still active. That ends AutoTune and puts the original gains back; RTL then landed and auto-disarmed at 502.2 s (method: landed), so nothing was saved. The next boot confirmed the old values. Habit to keep: after Success, land in AutoTune, disarm, and only then switch SA off. Do not touch SB or SC during AutoTune."] },
      { tag: "note", title: "Gains entered manually afterwards", body: ["ATC_RAT_RLL_P 0.137, ATC_RAT_RLL_I 0.137, ATC_RAT_RLL_D 0.0059, ATC_ACCEL_R_MAX 93285. ATC_ANG_RLL_P was set to 10 instead of 16.67 because QGC limits it to 3–12. Raise it towards 12, or force-save 16.67, if roll feels softer than pitch after the pitch tune."] },
      { tag: "healthy", title: "Battery handled within plan", body: ["3601 mAh used across both take-offs. Raw voltage dipped to 9.91 V only under a 20 A load late in take-off 2, but the sag-compensated voltage stayed above 11.08 V and the pack rested at about 11.16 V (3.72 V per cell) after landing. Pack resistance 67–70 mΩ, the same as this morning, so no sign of damage from the morning over-discharge. Hover throttle stayed normal (0.395 → 0.420), so the saved value is sensible."] },
      { tag: "watch", title: "Battery capacity failsafe is set to 2000 / 1500 mAh remaining", body: ["BATT_LOW_MAH is 2000 and BATT_CRT_MAH 1500 (remaining capacity). Low is above critical, so arming works. RTL will trigger with 2000 mAh left (about 4200 used). An earlier attempt that evening had the values reversed, which blocked arming."] },
      { tag: "healthy", title: "Telemetry much better than this morning", body: ["Packets received from the laptop rose steadily through both take-offs (283 → 1777), compared with being stuck at 202 for most of the morning. The uplink now works in both directions."] },
      { tag: "note", title: "Fast flight near the fence edge (take-off 2)", body: ["Max distance 57.8 m against the 60 m fence, max speed 9.4 m/s. Pitch error peaked at 13.1° at 675 s and roll at 10.8° at 994 s, when one motor briefly touched 1949 µs. Normal for brisk stick inputs; the fence was never breached."] },
      { tag: "note", title: "CW motors still slightly busier", body: ["CW motors average 29–36 µs more than CCW, the same pattern as this morning. Not urgent; check motor alignment during the next mechanical inspection."] },
      { tag: "healthy", title: "Healthy: GPS, EKF, compass, landings", body: ["18–19 satellites, HDOP at most 0.67. EKF innovation ratios at most 0.64. Compass field stable. Both touchdowns soft (0.54 and 0.66 m/s). No errors logged in either take-off."] },
    ] },
    { type: "section", title: "What changed since this morning" },
    { type: "table", headers: ["Area", "Flight 8 (morning)", "Flight 9 (evening)"], rows: [
      ["Notch filter", "Off", "INS_HNTCH_ENABLE 1, MODE 1 (throttle), FREQ 80, BW 40, ATT 40, HMNCS 7, REF 0.41"],
      ["Roll gyro at 80 Hz", "Strong, unfiltered", "Reduced by more than 99% after the filter"],
      ["Vibration median Z / Y", "11.9–12.6 / 4.7–5.3 m/s²", "8.9–9.8 / 3.6–4.0 m/s²"],
      ["Roll AutoTune", "Failed to level after 6 s", "Success after about 4 min (not saved: RTL switched during AutoTune)"],
      ["Battery used", "4352 mAh, down to 9.06 V, thrust loss", "3601 mAh, rested at 11.16 V"],
      ["Capacity failsafe", "None", "BATT_LOW_MAH 2000, BATT_CRT_MAH 1500 (remaining)"],
      ["Hover throttle", "Saved as 0.534 (bad value)", "Reset to 0.41, learned 0.395–0.420"],
      ["Vibration logging", "Pre-filter only", "Pre- and post-filter (INS_LOG_BAT_OPT 4)"],
      ["Telemetry uplink", "Mostly stuck", "Working steadily"],
    ] },
    { type: "callout", label: "Next session", paras: ["Fully charged battery. AutoTune pitch (AUTOTUNE_AXES 2), land in AutoTune and disarm to save, then change to 4 and tune yaw if at least 3000 mAh remains. Land by about 4000 mAh used. After that, Phase 1: RTL, Guided and a first Auto mission."] },
    ...chartsSection({
      alt: "Altitude (barometer) against the target altitude. Negative values just after a landing are barometer error from prop wash and ground effect, not real height.",
      bat: "Raw battery voltage, sag-compensated voltage (an estimate of resting voltage) and current. The red dotted line is BATT_LOW_VOLT (10.5 V).",
      mot: "Motor outputs averaged over 1 s. The red dotted line at 2000 µs is the top of the range: a motor sitting near it has no spare power.",
      att: "Desired versus actual roll and pitch angle.",
      vibe: "Accelerometer vibration on the X, Y and Z axes. Below 30 m/s² is acceptable; below 15 m/s² is good.",
      gps: "GPS satellites and HDOP (lower HDOP is better; under 1.0 is very good).",
      track: "Airborne path in metres from home (north up), coloured by flight mode. Green triangle = takeoff, red triangle = touchdown, yellow H = home. Red dotted circle = 60 m geofence.",
      spec: "Roll gyro spectrum from take-off 2, before and after the harmonic notch and gyro filter, with the pre-filter pitch gyro for comparison. Dotted lines mark 80, 160 and 240 Hz.",
    }),
  ],
};

export default flight9;
