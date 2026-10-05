import type { FlightAnalysis } from "@/components/flight-analysis/types";
import { chartsSection, FULL_HEADERS, TABLE_NOTE_FULL } from "../presets";

const flight8: FlightAnalysis = {
  flight: 8,
  meta: ["3 Oct 2026, 06:55 IST", "Pixhawk 2.4.8 · ArduCopter 4.6.3", "Logged about 19 min 20 s"],
  headline: "Hover data captured, autotune failed to start, and the battery was run flat",
  summary: ["Three take-offs on one battery, about 17.8 minutes in the air. Take-offs 1 and 2 were clean and gave the high-rate vibration data needed for the notch filter: a strong 80 Hz motor peak with harmonics at 160 and 240 Hz, much stronger on roll than pitch. Roll AutoTune started at 695.7 s and gave up six seconds later with “Failed to level”, because unfiltered vibration made the roll gyro look too unsteady. Take-off 3 then hovered in AutoTune mode for nine minutes until the battery could no longer hold SkyTwo up: at 1241 s all throttle went to 100%, a motor hit its limit, and SkyTwo sank about 4 m to a hard touchdown at roughly 3–4 m/s. The voltage failsafe never triggered."],
  stats: [
    { value: "3 · 17:46", label: "Take-offs · air time" },
    { value: "8.2 m", label: "Max altitude (T2)" },
    { value: "57.9 m", label: "Max distance (T2)" },
    { value: "4352 mAh", label: "Energy used (70%)" },
    { value: "12.69 → 9.06 V", label: "Battery start → lowest" },
    { value: "14–17 / 0.78", label: "GPS sats / worst HDOP" },
    { value: "0.38–0.41", label: "Hover throttle (normal)" },
    { value: "0", label: "Accelerometer clips" },
  ],
  blocks: [
    { type: "section", title: "Take-off by take-off" },
    { type: "table", headers: FULL_HEADERS, note: TABLE_NOTE_FULL, rows: [
      ["1", "109–299 s", "3:10", "6.4 m", "0.5 m", "0.3 m/s", "717", "13.6 / 16.8 A", "11.15 / 12.13 V", "76 mΩ", "0.376", "1576 1567 1613 1594", "+32 / -14", "2.4/4.7/12.6 (p95 19.0)", "0", "0.5° / 1.8° @158s", "0.2° / 1.9° @188s", "0.39 m/s", "14–14 / 0.72", "0.11/0.03/0.13/0.08", "±2.1%"],
      ["2", "349–633 s", "4:44", "8.2 m", "57.9 m", "9.4 m/s", "1122", "14.2 / 19.3 A", "10.39 / 11.52 V", "67 mΩ", "0.406", "1585 1622 1615 1652", "+30 / +37", "2.6/5.3/12.5 (p95 18.8)", "0", "1.3° / 7.5° @608s", "2.7° / 13.4° @608s", "0.53 m/s", "14–16 / 0.78", "0.25/0.16/0.35/0.31", "±6.7%"],
      ["3", "655–1247 s", "9:52", "7.8 m", "38.5 m", "5.5 m/s", "2502", "15.2 / 17.5 A", "9.06 / 10.05 V", "77 mΩ", "0.534", "1658 1643 1683 1666", "+24 / -16", "2.1/4.7/11.9 (p95 17.5)", "0", "0.7° / 12.5° @1242s", "0.9° / 14.1° @1241s", "6.55 m/s", "15–17 / 0.69", "1.64/0.06/0.70/0.42", "±4.0%"],
    ] },
    { type: "section", title: "Findings" },
    { type: "findings", items: [
      { tag: "fix", title: "Battery run past safe limits (take-off 3)", body: ["4352 of 6200 mAh used. Raw voltage fell to 9.06 V under load (3.02 V per cell); the sag-compensated estimate reached 10.05 V. Hover throttle climbed from 0.41 to 0.56 as the pack weakened. Check the pack for swelling and balance before reuse."] },
      { tag: "fix", title: "Thrust loss and hard touchdown, 1241–1244 s", body: ["“Potential Thrust Loss (1)” at 1242.3 s. Throttle output was pinned at 100% from 1242 s, M1 sat at 1949 µs (the limit), yet altitude dropped from 3.9 m at up to about 4 m/s. Touchdown was at roughly 3–4 m/s, which is a hard landing; the “GPS Glitch or Compass error” at 1245.2 s is the impact jolting the sensors, and it cleared at 1256 s."] },
      { tag: "fix", title: "Why the low-battery failsafe stayed silent", body: ["BATT_FS_VOLTSRC = 1 uses the sag-compensated voltage. That estimate only dropped below 10.5 V at 1240.9 s, and the failsafe needs 10 s below the line (BATT_LOW_TIMER), so it never fired. There was no capacity (mAh) failsafe at the time. Fix agreed: add BATT_LOW_MAH / BATT_CRT_MAH (remaining-capacity values, low higher than critical) and plan to land by about 4000 mAh used."] },
      { tag: "watch", title: "AutoTune: “Failed to level, please tune manually” (701.7 s)", body: ["Before each twitch, AutoTune needs roll and pitch rates below about 5°/s. Roll angle stayed within 1°, but the roll rate exceeded 5°/s 63% of the time (peaks 32°/s), while pitch exceeded it only 12% of the time. Sticks were centred and the wind estimate was near zero. Most likely cause: the 80 Hz motor vibration reaching the gyro with no notch filter. Roll gains were left unchanged (P 0.135, D 0.0036)."] },
      { tag: "watch", title: "80 Hz vibration much stronger on roll", body: ["The batch gyro data shows the motor peak at about 80 Hz (harmonics 160 and 240 Hz). Before filtering, the roll axis carries several times more of it than pitch, and VibeY runs higher than VibeX. Common causes: an unbalanced or chipped prop, or a Pixhawk mount that is softer side to side. Fix agreed: harmonic notch at 80 Hz, throttle-tracked, 3 harmonics."] },
      { tag: "fix", title: "Hover throttle saved from a nearly empty battery", body: ["At the final disarm, MOT_HOVER_LEARN saved MOT_THST_HOVER = 0.534 (normal is about 0.41), because the weak battery needed more throttle. Left alone, the next flight would start out using too much throttle. Fix agreed: reset to 0.41."] },
      { tag: "watch", title: "Telemetry worked one way only", body: ["The flight controller kept sending packets on the telemetry port (TX count rising steadily) but received almost nothing from the laptop: the received count stayed at 202 for all of take-off 1 and grew only slowly afterwards. This matches QGC disconnecting and reconnecting. The RC link was unaffected. Check antennas, the ground module position, and that both radios use matching settings."] },
      { tag: "note", title: "Brief motor saturation during fast flight (608 s)", body: ["During take-off 2, at about 9.4 m/s near the edge of the fence (57.9 m out of 60 m), one motor touched 1949 µs for a moment and pitch error peaked at 13.4°. This is normal for an aggressive manoeuvre, but it shows how little headroom is left when flying fast."] },
      { tag: "note", title: "CW motors work slightly harder", body: ["CW motors (M3, M4) average 24–32 µs more than CCW motors in every take-off. SkyTwo needs a little extra yaw correction all the time, usually from a slightly tilted motor or a twisted arm. Small, but worth a look during a mechanical check."] },
      { tag: "healthy", title: "Healthy: vibration levels, GPS and EKF", body: ["Vibration medians X 2.1–2.6, Y 4.7–5.3, Z 11.9–12.6 m/s² with no clipping; 14–17 satellites and HDOP below 0.8; EKF innovation ratios well under 1.0 (velocity peaked at 1.64 only during the take-off 3 thrust-loss descent). Compass field stable within a few per cent."] },
      { tag: "healthy", title: "Healthy: take-offs 1 and 2, and the new settings", body: ["Smooth touchdowns at 0.39 and 0.53 m/s. Roll tracking error RMS under 1.4°. Geofence (30 m, 60 m), AutoTune switch on SA, and high-rate vibration logging were all active as planned. The RTL test was skipped on purpose; it had already been tested on 2 October."] },
    ] },
    { type: "section", title: "Parameter changes since 2 October" },
    { type: "table", headers: ["Setting", "Change"], rows: [
      ["Geofence", "FENCE_ENABLE 1, TYPE 3 (altitude + circle), ALT_MAX 30 m, RADIUS 60 m, ACTION 1 (RTL)"],
      ["AutoTune", "RC6_OPTION 17 (SA switch, was Land), AUTOTUNE_AXES 1 (roll), AGGR 0.075"],
      ["Vibration logging", "INS_LOG_BAT_MASK 1, INS_LOG_BAT_OPT 0 (pre-filter)"],
      ["Hover throttle", "MOT_THST_HOVER saved as 0.534 at the end of this log (from 0.41)"],
    ] },
    ...chartsSection({
      alt: "Altitude (barometer) against the target altitude. Negative values just after a landing are barometer error from prop wash and ground effect, not real height.",
      bat: "Raw battery voltage, sag-compensated voltage (an estimate of resting voltage) and current. The red dotted line is BATT_LOW_VOLT (10.5 V).",
      mot: "Motor outputs averaged over 1 s. The red dotted line at 2000 µs is the top of the range: a motor sitting near it has no spare power.",
      att: "Desired versus actual roll and pitch angle.",
      vibe: "Accelerometer vibration on the X, Y and Z axes. Below 30 m/s² is acceptable; below 15 m/s² is good.",
      gps: "GPS satellites and HDOP (lower HDOP is better; under 1.0 is very good).",
      track: "Airborne path in metres from home (north up), coloured by flight mode. Green triangle = takeoff, red triangle = touchdown, yellow H = home. Red dotted circle = 60 m geofence.",
      spec: "Roll and pitch gyro spectrum from the take-off 1 hover (pre-filter). The dotted lines mark 80, 160 and 240 Hz: the motor frequency and its harmonics. This is the data used to set the notch filter.",
    }),
  ],
};

export default flight8;
