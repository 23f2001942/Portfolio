import type { FlightAnalysis } from "@/components/flight-analysis/types";
import { attitude, battery, faultLegend, motors, rcInputs, SOURCE_32, throttle, vibration } from "../presets";

const S1 = { min: 77, max: 89 }, S2 = { min: 191, max: 199 }, S3 = { min: 258, max: 266 };
const legend = faultLegend(["throttleLow", "corrupted", "frozen"], "Dashed lines: radio failsafes.");
const failsafes = [{ x: 84.96, color: "warn" as const, label: "failsafe" }, { x: 262.43, color: "warn" as const, label: "failsafe" }];

const flight6: FlightAnalysis = {
  flight: 6,
  meta: ["29 Sep 2026", "APM 2.8 · ArduCopter 3.2.1", "Three arm cycles on one battery"],
  headline: "SkyOne kept losing its throttle signal the moment it started to shake",
  summary: [
    "Two problems showed up together on every take-off: a strong vibration that starts at about a quarter throttle, and bad RC data reaching the flight controller a fraction of a second later. The bad data made all four motors drop to idle for 0.1–0.7 s at a time. That is the \"choking\" you saw.",
    "**Verdict.** No single motor was at fault. Do not fly again until the vibration source is fixed and the receiver-to-APM wiring is re-made and proven with a wiggle test.",
  ],
  stats: [
    { value: "3", label: "Armed sessions in the log" },
    { value: "±23 m/s²", label: "Peak fore–aft vibration (healthy ≈ ±3)" },
    { value: "2", label: "APM radio failsafes → Land" },
    { value: "±25 µs", label: "Motor-to-motor imbalance (normal)" },
  ],
  hero: {
    caption: "Session 1: the throttle the APM received from the receiver against the throttle it sent to the motors. Each coloured band is a stretch of bad RC data.",
    chart: { ...throttle({ x: S1 }), refs: [failsafes[0]] },
  },
  blocks: [
    legend,
    { type: "prose", paras: ["Up to 81 s everything is smooth. Then the vibration starts, and from 81.96 s the received throttle falls to about 996 µs again and again. Each time all four motors drop together to about 1056 µs, the armed-idle speed, and the drone sags and twitches. From 84.5 s the stick values become garbage, and at 86.9 s a half-second throttle drop while leaning ~19° lets it pitch over and come down hard."] },

    { type: "section", title: "The three sessions", paras: ["You remember two liftoffs; the log has three arm cycles on one battery. Session 1 is clearly the first liftoff with the big wobble. Session 2 is a short second liftoff, and session 3 a brief attempt that the APM itself ended with a radio failsafe. If your memory of the order differs, the findings do not change."] },
    { type: "table", headers: ["Session", "Time in log", "Peak throttle out", "What went wrong", "How it ended"], rows: [
      ["1 — first liftoff", "77.0–88.6 s", "~73%", "Vibration from 81.2 s; 5 throttle drop-outs; 2.4 s of corrupted stick data; radio failsafe at 84.96 s", "Pitched to 80° during a throttle drop, hard touchdown at 87.6 s"],
      ["2 — second liftoff", "191.3–198.7 s", "~90% (one burst)", "Vibration from 193.6 s; 0.8 s throttle drop-out; one corrupted frame", "Tipped on touchdown at 195.8 s"],
      ["3 — short attempt", "258.8–265.2 s", "~31%", "Vibration from 261.8 s; input froze for ~1 s", "APM radio failsafe → Land, then landed"],
    ] },
    { type: "subheading", text: "Session 1 event log" },
    { type: "table", headers: ["Time (s)", "Type", "What the log shows"], rows: [
      ["79.3", "Normal", "Throttle up from idle. Roll and pitch steady within 1°, RC inputs clean."],
      ["81.2", "Vibration", "Accel X jumps from ±5 to ±20 m/s²; roll rate starts alternating sign every 20 ms. Throttle out ~27–30%."],
      ["81.96", "Throttle-low", "CH3 = 996, CH5 jumps 986 → 1495. All motors to 1056 (idle) for ~0.4 s."],
      ["82.8–83.1", "Vibration", "Worst shaking: roll rate ±56–67 °/s alternating every sample."],
      ["83.16", "Throttle-low", "Second drop-out, ~0.5 s."],
      ["84.16", "Throttle-low", "Third drop-out, ~0.3 s."],
      ["84.46", "Corrupted", "CH1–CH4 all read exactly 1349. APM commands −10° roll, −11° pitch and a left yaw."],
      ["84.96", "Failsafe", "No fresh RC frame for 0.5 s (ERR 2/2) → radio failsafe (ERR 5/1) → mode Land."],
      ["85.06–86.77", "Corrupted", "All channels 1108, then 1130, 1491, 1228. Commanded leans up to −33° roll and pitch; heading swings from 207° to 137°."],
      ["85.63", "Mode", "Back to Stabilize."],
      ["86.87", "Throttle-low", "0.6 s drop-out while leaning 19° roll / 17° pitch. Motors at idle, so nothing can level it."],
      ["87.4–87.6", "Touchdown", "Pitch reaches 80°; accelerometer clips at 8 g on contact. Disarmed at 88.3 s."],
    ] },
    { type: "subheading", text: "Session 2 event log" },
    { type: "table", headers: ["Time (s)", "Type", "What the log shows"], rows: [
      ["193.0", "Normal", "Throttle up; attitude steady, vibration low at ~20% throttle."],
      ["193.6", "Vibration", "Shaking starts as throttle out passes ~33%."],
      ["194.1", "Throttle-low", "0.8 s drop-out. Your roll stick (CH1 = 1645) still gets through during it."],
      ["194.9", "Normal", "Throttle back to ~59%, then a burst to ~90%. Roll and pitch drift to +10°."],
      ["195.5", "Corrupted", "CH3 = 1104 and CH4 = 1108 together, then throttle-low again for ~1 s."],
      ["195.8–195.9", "Touchdown", "Hard contact and a quick tip. Disarmed at 198.6 s."],
    ] },
    { type: "subheading", text: "Session 3 event log" },
    { type: "table", headers: ["Time (s)", "Type", "What the log shows"], rows: [
      ["259.9", "Normal", "Gentle throttle-up, inputs clean."],
      ["261.8", "Vibration", "Shaking starts at only ~26% throttle out."],
      ["261.93", "Frozen", "RC values stop changing for ~1 s, including a stuck yaw of 1370 µs."],
      ["262.43", "Failsafe", "ERR 2/2 then 5/1 → Land."],
      ["262.93", "Throttle-low", "Drop-out; back to Stabilize at 263.04 s; landed."],
    ] },

    { type: "section", title: "Session by session", paras: ["The main logged channels for each session on the same time axis, so a glitch can be lined up with what the drone and motors did at that instant."] },
    legend,
    { type: "subheading", text: "Session 1" },
    { type: "chart", title: "RC inputs", caption: "Raw channel values as the APM received them. CH3 and CH5 snap to ~996 and ~1495 together in the red bands, and all lines collapse onto one value in the purple bands.", chart: { ...rcInputs({ x: S1 }), refs: [failsafes[0]] } },
    { type: "chart", title: "Motor outputs", caption: "M1–M4 PWM. In every red band all four collapse together; outside them they thrash ±100–150 µs from the vibration.", chart: motors({ x: S1 }) },
    { type: "chart", title: "Attitude", caption: "Desired (dashed) versus actual roll and pitch.", chart: attitude({ x: S1, bands: "faults" }) },
    { type: "chart", title: "Vibration", caption: "Raw accelerometer X and Y at 50 Hz.", chart: vibration({ x: S1 }) },
    { type: "subheading", text: "Session 2" },
    { type: "chart", title: "Throttle", caption: "Throttle received against throttle sent to the motors.", chart: throttle({ x: S2 }) },
    { type: "chart", title: "RC inputs", caption: "Your roll stick (CH1 ≈ 1645) still comes through during the 194.1 s drop-out.", chart: rcInputs({ x: S2 }) },
    { type: "chart", title: "Vibration", caption: "Shaking starts as throttle out passes about 33%.", chart: vibration({ x: S2 }) },
    { type: "subheading", text: "Session 3" },
    { type: "chart", title: "Throttle", caption: "The frozen input and the failsafe switch to Land at 262.43 s.", chart: { ...throttle({ x: S3 }), refs: [failsafes[1]] } },
    { type: "chart", title: "RC inputs", caption: "Every channel stops changing for about 1 s, including yaw stuck at 1370 µs.", chart: rcInputs({ x: S3 }) },

    { type: "section", title: "Finding 1: severe vibration near liftoff throttle", paras: ["SkyOne vibrates badly in a specific throttle range. Below ~22% throttle out the accelerometers are calm; between roughly 26% and 45% the fore–aft (X) axis shakes at ±20 m/s² and more. Above ~50% it settles somewhat. A peak in one throttle band is the fingerprint of a resonance: something on the frame vibrates hardest at one motor speed."] },
    { type: "chart", title: "Vibration level vs throttle", caption: "Each dot is a 0.4 s window: standard deviation of accel X against mean throttle out. The green strip is roughly where a healthy copter sits.",
      chart: { kind: "scatter", src: "vib", x: { label: "Throttle out (%)", min: 0, max: 100 }, y: { label: "Accel X std. dev. (m/s²)", min: 0 }, band: [0, 1], sets: [
        { key: "s1", label: "Session 1", color: "s1" }, { key: "s2", label: "Session 2", color: "s2" }, { key: "s3", label: "Session 3", color: "s4" },
      ] } },
    { type: "table", headers: ["Window", "Throttle out", "Accel X peak", "Accel Y peak", "Accel Z range", "Roll rate peak"], rows: [
      ["Session 2, low throttle (193.0–193.6 s)", "19–29%", "±3.7 m/s²", "±2.0", "−12.0 to −4.4", "11 °/s"],
      ["Session 3, climbing (259.9–261.8 s)", "14–26%", "±16.3", "±5.5", "−21.6 to +5.4", "27 °/s"],
      ["Session 1, shaking (81.9–84.4 s)", "31–45%", "±23.1", "±10.5", "−24.0 to +5.2", "67 °/s"],
      ["Session 2, shaking (193.6–194.1 s)", "~33%", "±23.2", "±8.0", "−24.4 to +6.9", "63 °/s"],
      ["Session 3, shaking (261.8–263.1 s)", "~26%", "±18.7", "±9.9", "−21.1 to +4.5", "62 °/s"],
    ], note: "ArduPilot's rule of thumb for a healthy copter: accel X and Y within about ±3 m/s², Z between −15 and −5 m/s²." },
    { type: "chart", title: "Zoom: 1 second of shaking in session 1 (82.4–83.4 s)", caption: "Raw 50 Hz gyro roll rate and accel X. Values flip sign on almost every 20 ms sample, so the true frequency is 25 Hz or higher.",
      chart: { kind: "time", bands: "none", x: { min: 82.4, max: 83.4 }, y: { label: "Roll rate (°/s)" }, y2: { label: "Accel X (m/s²)" }, series: [
        { src: "imu", y: "gx", label: "Gyro roll rate", color: "s1", width: 1.3 },
        { src: "imu", y: "ax", label: "Accel X", color: "s2", right: true, width: 1.1 },
      ] } },
    { type: "subheading", text: "What the pattern says about the cause" },
    { type: "list", items: [
      "**Sign flips every sample** mean mechanical vibration (or a very fast oscillation), not the slow side-to-side wobble of bad PID tuning. The PID gains are the 3.2.1 defaults and are not the problem.",
      "**X (fore–aft) is 2–3× worse than Y.** A plate rocking on its dampers along one axis, or one prop or motor out of balance, shows up strongly on one axis.",
      "**It peaks in a throttle band** and eases at higher throttle, which fits a resonance of a soft or loose mount, or a prop/motor imbalance at that RPM.",
      "**The attitude estimate stayed sane.** With clean inputs, roll and pitch held within ~1°. The vibration did not confuse the APM directly; its damage came through the RC wiring (Finding 2).",
    ] },
    { type: "prose", paras: ["Likely sources, most likely first: the APM suspension rebuilt after the 27 September crash (too loose, or a cable bracing it), a chipped or unbalanced prop, a motor bell or shaft knocked out of true, or a screw that has worked loose."] },

    { type: "section", title: "Finding 2: bad RC data reaching the APM", paras: ["This is what made SkyOne tumble. Three kinds of bad frame appear, and none of them appear while sitting at idle on the ground before the shaking starts."] },
    { type: "table", headers: ["Type", "Signature in the log", "Occurrences", "Effect"], swatches: ["warn", "s4", "muted"], rows: [
      ["Throttle-low", "CH3 ≈ 996–997 µs and CH5 ≈ 1495 µs at the same instant, while CH1 and CH4 can still carry your live stick movements", "Repeated in all three sessions", "APM reads throttle as zero → all motors to idle, no stabilisation"],
      ["Corrupted", "CH1–CH4 (sometimes CH5) all read exactly the same number: 1349, 1108, 1130, 1491, 1228; or CH3 and CH4 together at 1104/1108", "~2.4 s in session 1, one frame in session 2", "Nonsense stick commands: up to 33° lean and a fast yaw"],
      ["Frozen", "No new RC frame for 0.5–1 s", "2 (84.96 s and 262.43 s)", "APM radio failsafe (ERR 2/2 + 5/1) → Land"],
    ] },
    { type: "subheading", text: "This is a wiring fault, not a radio link loss" },
    { type: "prose", paras: [
      "The throttle-low frames first looked like the R88 dropping into its failsafe. A closer look rules that out. During several of them your live sticks still come through on other channels: roll at 1645 µs in session 2 (194.2–194.5 s), yaw at 1784 µs and 1577 µs in sessions 1 and 2. If the radio link had dropped, every channel would show failsafe values at once.",
      "Instead, only CH3 and CH5 fall to fixed values near 1000 and 1500 µs. These look like placeholder values: what you'd expect when the APM's input side stops seeing pulses on those particular wires. The corrupted frames, where all channels read one identical number, point the same way. The fault is between the R88 pins and the APM input header: the jumper leads, their connector, or the header pins themselves.",
      "That also explains why your receiver failsafe setting (about 924 µs on the bench) never shows up anywhere in this log. The radio link itself was probably fine the whole time.",
    ] },
    { type: "subheading", text: "Why the APM did not treat the drop-outs as a failsafe" },
    { type: "prose", paras: ["The throttle failsafe fires only when CH3 goes below `FS_THR_VALUE` = 975 µs. The drop-out value, ~996 µs, sits just above that, so to the APM it looks like the pilot pulling the stick to the bottom. In Stabilize on 3.2.1, zero throttle means motors at idle with no attitude control. The drone simply loses lift and levelling for that moment, which is what made it look like the motors were choking."] },

    { type: "section", title: "The \"choking\" motors — which one?", paras: ["None of them on its own. Every time the motors looked like they were choking, all four dropped together to armed-idle speed (~1056 µs) because the APM was reading a throttle-low frame. The drone would sag, tilt with whatever lean it had, and then the motors surged back when the throttle signal returned."] },
    { type: "chart", title: "Average offset of each motor from the mean of the four", caption: "Powered samples outside the fault windows (µs). ±25 µs is normal trim.",
      chart: { kind: "bars", src: "motorOffset", y: { label: "Offset (µs)", min: -30, max: 30 }, refs: [{ y: 25, color: "loit", label: "+25" }, { y: -25, color: "loit", label: "−25" }] } },
    { type: "chart", title: "Motor layout (APM quad X, viewed from above)", caption: "Positions, spin directions and each motor's peak output (µs) across all three sessions.",
      chart: { kind: "quad", src: "motorPeak" } },
    { type: "prose", paras: [
      "No motor sat at the 2000 µs ceiling or cut out alone, so there is no sign of the old Front Right wiring fault or the 27 September Back Left connector coming back. The CW pair (M3, M4) runs slightly higher than the CCW pair, a mild yaw bias worth watching but not a cause of this failure.",
      "One window looks lopsided but is explained: in session 3 at 261.9 s, M3/M4 jump up by 80–160 µs and M1/M2 drop. That was the frozen yaw input (CH4 stuck at 1370 µs) commanding a left yaw, not a motor fault.",
    ] },

    { type: "section", title: "How the two problems connect", paras: ["In all three sessions the shaking starts first, and the first RC fault follows a fraction of a second later. Never the other way round, and never on the ground at idle."] },
    { type: "table", headers: ["Session", "Vibration starts", "First RC fault", "Delay"], rows: [
      ["1", "81.2 s", "81.96 s (throttle-low)", "~0.7 s"],
      ["2", "193.6 s", "194.1 s (throttle-low)", "~0.5 s"],
      ["3", "261.8 s", "261.93 s (frozen)", "~0.1 s"],
    ] },
    { type: "prose", paras: ["The simplest explanation: the vibration shakes the electronics deck, and a marginal connection between the R88 and the APM input header opens and closes with it. Electrical noise from the ESCs at higher current is a second possibility. The board's 5 V rail stayed at 4.73–4.98 V, so a receiver brownout is unlikely. Fixing either the vibration or the connection alone might hide the symptom; fix both."] },

    { type: "section", title: "What was healthy" },
    { type: "checks", items: [
      { title: "Level and calibration", body: "With clean inputs roll and pitch held within ~1°. The 28 September accelerometer calibration looks good; the back-left drift from 27 September did not appear." },
      { title: "Motors and ESCs", body: "All four responded and stayed balanced; no single-motor cutouts." },
      { title: "Power", body: "Battery about 13.7 V at rest, sagging to 11.7 V at ~30 A peak. Board 5 V stayed 4.73–4.98 V with no reboot." },
      { title: "Attitude controller", body: "Desired and actual roll/pitch matched closely whenever inputs were clean. The tumbles came from bad inputs and throttle drops, not from the controller diverging." },
      { title: "APM radio failsafe", body: "When the input froze, it switched to Land within 0.5 s as designed." },
    ] },
    { type: "chart", title: "Battery during session 1", caption: "Voltage and current. The dip near 85.6 s is the ~30 A surge during the recovery attempt.", chart: battery({ x: S1 }) },

    { type: "section", title: "What changed from the first look at this flight" },
    { type: "list", items: [
      "**Throttle-low frames.** These were first taken for the receiver's own failsafe. Live roll and yaw inputs during them show the radio link was up, so they are put down to the R88 → APM wiring instead. The fix list now leads with the input wiring.",
      "**\"Choking\".** What you saw was all four motors visibly losing power together, not one motor struggling.",
      "**Touchdowns.** Session 1 was first called a crash. At this low height they were hard touchdowns with a tip, which matches the airframe coming through undamaged.",
    ] },

    { type: "section", title: "Action plan before the next flight", paras: ["Work through these in order. Everything in A–C is done on the bench with props off."] },
    { type: "subheading", text: "A. RC input wiring" },
    { type: "list", items: [
      "Replace the R88 → APM jumper leads with new ones; don't reuse the old set.",
      "Check each APM input header pin for bending or looseness, especially the CH3 and CH5 pins and their ground.",
      "Secure the connectors at both ends with a dab of hot glue or tape so they cannot shake loose.",
      "Mount the R88 firmly on the deck, and route its two antennas away from ESCs, battery leads and the power module, at 90° to each other.",
      "Wiggle test: arm with props off, run about half throttle, and watch Mission Planner's radio page while tapping the frame and moving the wires. Any flicker, or CH1–CH4 jumping to the same value, means the fault is still there.",
    ] },
    { type: "subheading", text: "B. Vibration" },
    { type: "list", items: [
      "Check the APM suspension: the plate floats freely on all dampers, touches nothing, and no cable is tight enough to brace or tug it.",
      "Make sure the plate is not too loose either; it should not rock visibly when you tap the frame.",
      "Inspect every prop for chips or cracks; balance them or fit new ones.",
      "Spin each motor by hand and feel for rubbing, grit, or a wobbling bell or bent shaft.",
      "Tighten motor-to-arm and arm-to-frame screws, and check the prop nuts.",
    ] },
    { type: "subheading", text: "C. Failsafe safety net" },
    { type: "list", items: [
      "Confirm the R88 custom failsafe puts CH3 at about 900–920 µs (below 975) with CH5 on a Stabilize position.",
      "Props off, drone powered: switch the Pocket off. RC3 must read below 975 and the mode must change to Land.",
      "Optional: raise `FS_THR_VALUE` toward ~980 only if the throttle stick's bottom (`RC3_MIN` ≈ 986) stays at least 5–10 µs above it; don't let normal low stick trigger failsafe.",
    ] },
    { type: "subheading", text: "D. Next test" },
    { type: "list", items: [
      "Props on, drone tethered or weighted down: run up through 25–45% throttle for 20–30 s, then download the log.",
      "Check IMU accel stays within about ±3 m/s² on X/Y and −15 to −5 m/s² on Z, and that RCIN shows no glitches.",
      "Only then fly a short, low hover in Stabilize.",
    ] },

    { type: "section", title: "Relevant parameters from the log" },
    { type: "table", headers: ["Parameter", "Value", "Why it matters here"], rows: [
      ["`FS_THR_ENABLE`", "3", "Throttle failsafe always switches to Land"],
      ["`FS_THR_VALUE`", "975", "CH3 must go below this to count as a failsafe; the drop-outs sat at ~996"],
      ["`RC3_MIN` / `RC3_TRIM` / `RC3_MAX`", "986 / 987 / 2020", "Normal stick bottom reads ~985"],
      ["`RC1_TRIM` / `RC2_TRIM` / `RC4_TRIM`", "1492 / 1504 / 1503", "Stick centres"],
      ["`THR_MIN`", "130", "Minimum motor output while the throttle stick is above zero (~1120 µs)"],
      ["`MOT_SPIN_ARMED`", "70", "Armed idle (1056 µs); this is where the motors fell during every throttle-low frame"],
      ["`THR_MID`", "600", "Set on 28 September"],
      ["`RATE_RLL_P` / `I` / `D`", "0.15 / 0.1 / 0.004", "3.2.1 defaults; not the cause"],
      ["`RATE_PIT_P` / `I` / `D`", "0.15 / 0.1 / 0.004", "3.2.1 defaults"],
      ["`RATE_YAW_P` / `I`", "0.2 / 0.02", "Defaults"],
      ["`STB_RLL_P` / `STB_PIT_P` / `STB_YAW_P`", "4.5 / 4.5 / 4.5", "Defaults"],
      ["`INS_MPU6K_FILTER`", "0", "Board default gyro filter"],
      ["`AHRS_TRIM_X` / `Y`", "−0.0097 / −0.0048 rad", "About −0.55° / −0.28° level trim"],
      ["`FLTMODE1–5` / `FLTMODE6`", "Stabilize / Land", "As set on 28 September"],
      ["`BATT_MONITOR` / `VOLT_PIN` / `CURR_PIN` / `VOLT_MULT`", "4 / 13 / 12 / 11.9", "Log shows pin 13, but with the A0 jumper, 0 is the value matching the wiring"],
      ["`LOG_BITMASK`", "2046", "Includes IMU and motor-output logging, which made this analysis possible"],
    ] },

    { type: "section", title: "Method and glossary", paras: ["RCIN, RCOU, ATT and CTUN at 10 Hz were aligned with IMU at 50 Hz and CURR at 1 Hz, plus MODE, EV and ERR messages. Times are seconds since the APM powered up. Altitude is not used anywhere: SkyOne's barometer is known to be faulty, and its readings here wander as much on the ground as in the air."] },
    { type: "table", headers: ["Term", "Meaning"], rows: [
      ["RCIN CH1–CH5", "Roll, pitch, throttle, yaw and flight-mode channel, in µs, as received by the APM"],
      ["RCOU M1–M4", "PWM sent to the four ESCs (µs)"],
      ["Throttle out", "CTUN ThrOut, the APM's throttle command, 0–1000 shown here as 0–100%"],
      ["ERR 2/2", "Radio: RC frames arriving late (no new data for 0.5 s)"],
      ["ERR 5/1, 5/0", "Radio failsafe triggered / cleared"],
      ["EV 10 / 15 / 17 / 18 / 28", "Armed / auto-armed (throttle raised) / land complete maybe / land complete / not landed (airborne)"],
      ["Aliasing", "Vibration faster than half the 50 Hz sample rate shows up as values flipping sign on every sample"],
    ] },
  ],
  source: SOURCE_32,
};

export default flight6;
