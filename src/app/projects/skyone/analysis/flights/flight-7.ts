import type { FlightAnalysis } from "@/components/flight-analysis/types";
import { attitude, battery, faultLegend, motors, rcInputs, SOURCE_32, throttle, vibration } from "../presets";

const S1 = { min: 22, max: 27 }, S2 = { min: 52, max: 69 };
const legend = faultLegend(["placeholderA", "placeholderB", "frozen"]);

const flight7: FlightAnalysis = {
  flight: 7,
  meta: ["30 Sep 2026", "APM 2.8 · ArduCopter 3.2.1", "Two arm cycles"],
  headline: "The receiver kept vanishing, and the failsafe flew SkyOne away on a broken barometer",
  summary: [
    "Your instinct was right: the whole RC input disappeared again and again, only once the props were turning. When it vanished for good, the APM switched to Land mode. Land steers by the barometer, which is broken, so it pushed the throttle to 100% and SkyOne flew off on its own for about 7 seconds. During that time none of your stick movements reached the drone.",
    "**Verdict.** Three separate faults stacked up: the receiver connection dropping out, a failsafe mode that can't work with SkyOne's faulty barometer, and one motor corner that could not hold its share (the hot motor). Fix all three before the next flight; any one of them alone can cause a crash.",
  ],
  stats: [
    { value: "6.8 s", label: "RC input completely frozen during the flight" },
    { value: "100%", label: "Throttle commanded by Land while you held ~48%" },
    { value: "3.4 s", label: "Motor 4 pinned at maximum (others ≤ 0.5 s)" },
    { value: "±33 m/s²", label: "Vibration at 22% throttle (bench, props off: ±1.6)" },
    { value: "3", label: "Radio failsafes in one short flight" },
    { value: "73 mAh", label: "Battery used" },
  ],
  hero: {
    caption: "Session 2 (the flight that ended upside down): the throttle the APM received against what it actually sent to the motors. Shaded bands are RC faults; the faint purple bands are Land mode.",
    chart: throttle({ x: S2 }),
  },
  blocks: [
    legend,
    { type: "prose", paras: ["From 58.9 s the received throttle goes perfectly flat at 48% for 6.8 seconds: the APM stopped receiving anything new. Half a second later it switched to Land, and the orange throttle-to-motors line climbs to 100% while the received line stays frozen. That gap between the two lines is SkyOne flying itself."] },

    { type: "section", title: "Timeline", paras: ["The log holds two armed sessions. Session 1 is your first throttle-up that \"suddenly lost signal\"; session 2 is the flight that went back-left and flipped."] },
    { type: "subheading", text: "Session 1 — the short one (22.6–26.6 s)" },
    { type: "table", headers: ["Time (s)", "Type", "What the log shows"], rows: [
      ["22.6", "Armed", "Yaw stick right to arm. Level within 0.5°, calm IMU (±2.6 m/s²)."],
      ["24.5", "Throttle", "Throttle raised to ~17%. Vibration jumps immediately to ±21 m/s² on X, with SkyOne still on the ground."],
      ["25.8", "Placeholder A", "All channels suddenly exactly 1500 / 1000: roll, pitch, yaw centred, throttle ~1000, mode switch 1500. Motors drop to idle."],
      ["25.9", "Back", "Signal returns with throttle 1137–1151."],
      ["26.1", "Frozen", "RC freezes with yaw stuck at 1034 (hard left). The APM obeys: target heading jumps 12° left and motors 3 and 4 jump to 1740–1900 µs."],
      ["26.6", "Failsafe", "Log stops. The late-frame error that follows means the radio failsafe fired while on the ground, which disarms immediately. This is the \"suddenly lost signal\"."],
    ] },
    { type: "subheading", text: "Session 2 — the flight (52.3–68.7 s)" },
    { type: "table", headers: ["Time (s)", "Type", "What the log shows"], rows: [
      ["52.3", "Armed", "Re-armed. Calm and level."],
      ["53.7", "Vibration", "Throttle ~15%, still on the ground. Accel X shakes ±21 m/s²."],
      ["55.1", "Placeholder B", "RC reads 1500 / 1500 / 1100 / 1500 / 1555. The mode value 1555 is not a position your SC switch can produce."],
      ["55.3", "Placeholder A", "1500 / 1500 / 1000 / 1500 / 1500 for 0.2 s; motors to idle."],
      ["55.5–56.3", "Back", "Live signal: throttle 1091–1116. Worst ground vibration: ±33 m/s²."],
      ["56.4–58.1", "Placeholder B", "1.8 s of the identical B pattern. Whatever you did with the sticks never arrived."],
      ["58.2–58.8", "Placeholder A", "0.7 s of throttle ≈998; motors at idle."],
      ["58.9", "Back", "Signal returns for one moment carrying your real throttle: 1426 µs (~48%). You had pushed it up during the drop-out, so SkyOne leaps off the ground."],
      ["59.0", "Frozen", "RC freezes at 1499 / 1500 / 1423 / 1500 / 990 and stays exactly there for 6.8 s."],
      ["59.49", "Failsafe", "No new frame for 0.5 s → radio failsafe → Land mode."],
      ["59.2–60.1", "Attitude", "Rolls right to 23° and pitches nose-up to 18°. Motor 4 hits 2020 µs (maximum) and stays there."],
      ["59.8–61.8", "Runaway", "Barometer altitude jumps between −40 m and +56 m while SkyOne is ~1 m up. Land mode drives throttle out to 80–100%. Climb rate turns positive (+1 to +2 m/s): it is climbing, not landing."],
      ["60.8–65.7", "Spin", "Heading rotates mostly to the right, about 420° in total with one brief reversal, at up to ~250°/s. Motor 4 still pinned at maximum."],
      ["65.8", "Placeholder B", "Pattern B returns. The APM counts it as a valid signal, clears the failsafe, and reads CH5 = 1555 as a Stabilize switch position."],
      ["65.92", "Mode", "Back to Stabilize with the fake throttle of 1100 (~20%). Throttle out drops from ~75% to 22%: SkyOne falls."],
      ["66.2–66.8", "Flip", "Contact with the ground: roll goes 14° → 37° → 74° → 111° → 175° in 0.5 s (peak rotation ~1100 °/s, 8 g impact)."],
      ["66.7", "Failsafe", "Frozen again → Land, now upside down."],
      ["66.9–68.7", "Inverted", "Lying at 177° roll. Three motors still being driven at 1170–1660 µs, drawing about 26 A, until the log ends; the land detector never disarmed."],
    ] },

    { type: "section", title: "Session by session", paras: ["The main logged channels for each session on the same time axis."] },
    legend,
    { type: "subheading", text: "Session 1" },
    { type: "chart", title: "RC inputs", caption: "Placeholder A at 25.8 s, then yaw frozen at 1034 µs from 26.1 s until the log stops.", chart: rcInputs({ x: S1 }) },
    { type: "chart", title: "Motor outputs", caption: "Motors 3 and 4 jump when the frozen yaw input commands a hard left turn.", chart: motors({ x: S1 }) },
    { type: "chart", title: "Vibration", caption: "Accel X jumps to about ±21 m/s² as soon as the throttle comes up, still on the ground.", chart: vibration({ x: S1 }) },
    { type: "subheading", text: "Session 2" },
    { type: "chart", title: "Attitude", caption: "Desired (dashed) versus actual roll and pitch. From 59 s the desired angles are frozen while the drone rolls right and pitches up, then flips at about 66.5 s.", chart: attitude({ x: S2, bands: "faults" }) },
    { type: "chart", title: "Heading", caption: "Yaw angle. From about 60.8 s it rotates mostly to the right, about 420° in total.",
      chart: { kind: "time", bands: "faults", x: S2, y: { label: "Heading (°)", min: 0, max: 360 }, series: [
        { src: "att", y: "dy", label: "Desired heading", color: "muted", dash: true, width: 1 },
        { src: "att", y: "y", label: "Heading", color: "s1", width: 1.5 },
      ] } },
    { type: "chart", title: "Vibration", caption: "Raw accelerometer X and Y at 50 Hz.", chart: vibration({ x: S2 }) },

    { type: "section", title: "Finding 1: the whole receiver input keeps disappearing", paras: ["This flight is clearer than Flight 6. Here the RC input does not just glitch on one or two channels: all five channels are replaced at once by fixed patterns, or stop updating altogether. That is what you would see if the receiver lost power, rebooted, or lost its connection to the APM."] },
    { type: "chart", title: "RC inputs in session 2", caption: "Raw channel values as the APM received them. Inside the bands the lines are flat, exact and repeated; outside them they carry your real sticks.", chart: rcInputs({ x: S2 }) },
    { type: "table", headers: ["Pattern", "CH1 / CH2 / CH3 / CH4 / CH5", "Time in session 2", "What the APM did with it"], swatches: ["s2", "s5", "muted"], rows: [
      ["Placeholder A", "1500 / 1500 / ~1000 / 1500 / 1500", "~2.1 s (3 times)", "Read as throttle at the bottom (1000 is above `FS_THR_VALUE` 975, so not a failsafe) → motors to idle"],
      ["Placeholder B", "1500 / 1500 / 1100 / 1500 / 1555", "~3.8 s (3 times)", "Read as a valid signal: 20% throttle, sticks centred, mode switch in a Stabilize band. This is what cancelled Land and dropped SkyOne at 65.9 s"],
      ["Frozen", "last values held", "6.8 s in one stretch", "After 0.5 s: radio failsafe (ERR 2/2, 5/1) → Land"],
    ] },
    { type: "subheading", text: "Why this points at the receiver, not the radio link" },
    { type: "list", items: [
      "**The receiver's own failsafe never appears.** You set the R88 to output about 924 µs throttle on link loss. That value is not anywhere in the log, so the R88 never reported a lost link. It either stopped outputting entirely, or its output never reached the APM.",
      "**The patterns are fixed and exact.** A live transmitter always jitters by a microsecond or two. Pattern B is identical to the microsecond every time, and its mode value 1555 matches no SC position (yours are 989, ~1500 and 2010). These look like default values generated on the APM side when it sees no receiver pulses at all.",
      "**It only happens with props turning.** On the bench the day before (props off) there were zero faults in 30 s. Here the first fault arrives 1.2–1.4 s after the props start shaking the frame, in both sessions.",
      "**Current is not the trigger.** The first drop-outs happened at 2–4 A, long before the high-current part of the flight, so electrical noise from the ESCs is unlikely.",
    ] },
    { type: "prose", paras: ["So your theory holds, with one refinement: it's more likely the vibration than the airflow that is shaking the receiver's power or ground connection loose. Either way, the fix is the same — a receiver harness that cannot move."] },
    { type: "callout", label: "You weren't flying it", paras: ["From 59.0 s to 65.8 s the APM received exactly the same frame, 68 times in a row. Everything you did on the sticks while chasing it towards the back-left never reached SkyOne. The only reason it lifted off so suddenly at 58.9 s is that the signal came back for one tenth of a second carrying the throttle you had pushed up during the previous drop-out."] },

    { type: "section", title: "Finding 2: the failsafe Land ran away on the broken barometer", paras: ["Land mode needs to know its height to descend slowly. SkyOne's barometer is known to be faulty (it reads about 472 hPa, half the real air pressure), and in this flight it reported altitudes between −50 m and +56 m while SkyOne was never more than a couple of metres up. It also raised 11 barometer-glitch errors."] },
    { type: "chart", title: "Session 2: what the barometer said vs what Land did", caption: "Barometer altitude, fused altitude estimate (left axis, m) and throttle out (right axis, %). Faint purple bands: Land mode.",
      chart: { kind: "time", bands: "faults", x: S2, y: { label: "Altitude (m)", min: -60, max: 60 }, y2: { label: "Throttle out (%)", min: 0, max: 100 }, series: [
        { src: "baro", y: "alt", label: "Barometer altitude", color: "s2", width: 1.1 },
        { src: "thr", y: "alt", label: "Fused altitude estimate", color: "s1", width: 1.8 },
        { src: "thr", y: "tout", label: "Throttle out (%)", color: "warn", right: true, width: 1.3 },
      ] } },
    { type: "prose", paras: [
      "At 61.3 s the fused altitude estimate suddenly drops by 24 m. To the Land controller that looks like a fall, so it answers with full throttle to slow the \"descent\". Over the Land period, throttle out averages about 71% and is above 70% for two-thirds of the time, reaching 100% several times. The measured climb rate turns positive (+1 to +2 m/s). Land mode was actively flying SkyOne away.",
      "This also explains the 27 September crash, which came half a second after switching to AltHold, another altitude-controlled mode, with the motors at 100%. On SkyOne, every mode except Stabilize trusts the barometer, and that includes the failsafe.",
    ] },
    { type: "callout", label: "What this means for safety", paras: ["With this barometer, `FS_THR_ENABLE` = 3 (always Land) is not a safe net. But turning the failsafe off is not safe either: then a frozen signal just keeps the last throttle. The only real fix is a working barometer, which on an APM 2.8 means a replacement board or a modern flight controller. Until then, the receiver connection has to be made reliable enough that the failsafe never triggers."] },

    { type: "section", title: "Finding 3: motor 4 was pinned at maximum — likely your hot motor", paras: ["During the flight, output 4 (the APM's back-right, CW motor) sat at its 2020 µs maximum for 3.4 seconds, far longer than any other motor. Even flat out it could not correct the drone: SkyOne kept rolling right, pitching nose-up and spinning to the right."] },
    { type: "chart", title: "Time at maximum output, 59.0–65.8 s", caption: "Seconds each motor spent at 2000 µs or more.", chart: { kind: "bars", src: "motorMax", y: { label: "Seconds", min: 0 } } },
    { type: "chart", title: "Mean output in the same window", caption: "Motor 4 averaged about 260–370 µs above the others.", chart: { kind: "bars", src: "motorMean", y: { label: "PWM (µs)", min: 1000, max: 2050 } } },
    { type: "chart", title: "Motor outputs in session 2", caption: "PWM to each ESC. Watch M4 flatten against the top from about 59.9 s.", chart: motors({ x: S2 }) },
    { type: "chart", title: "Motor layout the APM expects", caption: "APM quad X viewed from above, nose up, with each motor's mean output (µs) from 59.0 to 65.8 s. M4 is outlined in red.", chart: { kind: "quad", src: "motorQuad" } },
    { type: "prose", paras: ["The combination of errors points at one corner. Rolling right plus nose-up means the back-right corner is dropping. Spinning to the right means too little torque from the CW motors, and M4 is a CW motor. The controller correctly responded by pushing M4 to maximum, and it still wasn't enough. That corner simply could not produce its share of thrust."] },
    { type: "subheading", text: "Why it could be the motor you felt" },
    { type: "prose", paras: [
      "A motor driven at full power for several seconds while straining will be much hotter than the rest, and you found exactly one very hot motor. If that motor is physically at the back-left, then either your left/right reference differs from the APM's (it counts from behind, looking forward), or output 4's signal lead now goes to the back-left arm.",
      "The second case would be serious. If back-left and back-right are swapped, the back pair corrects roll and yaw backwards. The front pair's corrections then cancel out, leaving almost no roll or yaw control, which fits this flight's roll-over and spin.",
    ] },
    { type: "callout", label: "One more source of heat", paras: ["After the flip, the battery current stayed around 26 A for as long as the log continued, while SkyOne lay upside down with three motors still driven. With the props pressed into the ground, a stalled or dragging motor heats up very fast. So the hot motor may have been cooked after the crash as well as during the flight, and the heat alone doesn't prove it was the cause. The M4 saturation in the air is the stronger evidence; the bench checks below settle it."] },
    { type: "subheading", text: "Possible causes, all checked on the bench with props off" },
    { type: "list", items: [
      "**Motor order.** The output 4 lead is on the wrong arm. Leads may have been re-plugged when the APM suspension was rebuilt, and earlier fault-finding swapped output leads between arms.",
      "**Spin direction.** The motor on that arm spins the wrong way. This happens if two of its three bullet connectors were swapped when the back-left connectors were redone after 27 September.",
      "**Prop.** The prop on that motor is the wrong hand (CW vs CCW) or mounted upside down. It still spins but produces little thrust, so the motor strains and overheats.",
      "**Motor or ESC damage.** A bad winding, bearing or ESC on that arm, or a failing connector that heats up under load.",
    ] },

    { type: "section", title: "Finding 4: the props are the vibration source", paras: ["With the bench test from the day before, there is now the same airframe at the same throttle with and without props. The difference is enormous."] },
    { type: "chart", title: "Vibration vs throttle with props on", caption: "Each dot is a 0.4 s window: standard deviation of accel X against mean throttle out. The green strip is the healthy range; the props-off bench test sat at 0.2–0.5 m/s² (its log isn't included here).",
      chart: { kind: "scatter", src: "vib", x: { label: "Throttle out (%)", min: 0, max: 100 }, y: { label: "Accel X std. dev. (m/s²)", min: 0 }, band: [0, 1], sets: [
        { key: "s1", label: "Session 1", color: "s1" }, { key: "s2", label: "Session 2", color: "s2" },
      ] } },
    { type: "table", headers: ["Condition", "Throttle out", "Accel X peak", "Accel X std. dev."], rows: [
      ["Bench test, props off (29 Sep)", "20–30%", "±1.6 m/s²", "0.2–0.5"],
      ["Session 1, props on, on the ground", "~17%", "±21.6", "1.3–2.9"],
      ["Session 2, props on, on the ground", "15–24%", "±32.8", "8–18"],
      ["Session 2, in the air", "58–100%", "±33.6", "4.6–7"],
    ] },
    { type: "prose", paras: ["The motors are smooth on their own, so the shaking comes from the props (balance, damage, hand, or how they sit on the adapters) or the frame's response to them. It is worst at low RPM, sitting on the ground, which is exactly when the receiver started dropping out. A wrong or badly seated prop on motor 4 would explain both Finding 3 and this one."] },

    { type: "section", title: "How it all chained together" },
    { type: "list", items: [
      "Props spin up and the airframe shakes hard, even on the ground.",
      "The receiver connection drops out; the APM sees placeholder frames and then nothing.",
      "You raise the throttle during a drop-out; the signal flickers back with 48% and SkyOne jumps.",
      "The signal freezes; after 0.5 s the radio failsafe switches to Land.",
      "Land trusts the broken barometer, thinks it is falling, and drives the throttle to 100%.",
      "Motor 4's corner can't keep up: SkyOne rolls right, noses up and spins while flying off on its own.",
      "Placeholder B arrives, cancels Land and reads as 20% throttle; SkyOne drops, hits the ground and flips.",
    ] },

    { type: "section", title: "What was healthy" },
    { type: "checks", items: [
      { title: "Power", body: "Battery 13.9 V at rest, lowest 11.6 V at the 36 A peak; board 5 V held 4.83–5.0 V. No brownout or reboot of the APM." },
      { title: "Attitude sensing", body: "Level within 0.5° after arming; the gyros and attitude estimate stayed sensible until the flip." },
      { title: "Parameters", body: "Nothing changed since Flight 6 except the automatic ground pressure/temperature, gyro offsets, and the learned hover throttle." },
    ] },
    { type: "chart", title: "Battery during session 2", caption: "Voltage and current. 73 mAh used.", chart: battery({ x: S2 }) },

    { type: "section", title: "Changes from the Flight 6 analysis" },
    { type: "list", items: [
      "**Receiver vs individual wires.** Flight 6 pointed at the CH3 and CH5 leads, because some live stick values got through during the drop-outs. This flight shows all channels replaced together by fixed values, and the R88's own failsafe never appearing. So the most likely culprit is the receiver's power, ground or whole harness, not single signal leads. Both flights agree that the fault needs vibration to show up.",
      "**Failsafe.** The Flight 6 analysis recommended trusting the Land failsafe once the receiver's failsafe value was below 975. This flight shows Land itself is unsafe on SkyOne while the barometer is faulty.",
      "**Motors.** Flight 6 showed all four motors balanced within ±25 µs. This flight exposed a corner that falls short under high power, which the low-throttle hops of Flight 6 never demanded.",
    ] },

    { type: "section", title: "Action plan", paras: ["A–C are bench work with props off, except where noted."] },
    { type: "subheading", text: "A. Receiver connection" },
    { type: "list", items: [
      "Replace the whole R88 → APM harness with new leads, including the 5 V and ground wires; don't reuse the old jumpers.",
      "Glue or tie every connector at both ends, and strain-relieve the harness to the deck so no lead can flex at the pins.",
      "Mount the R88 firmly, out of the prop wash, with its antennas away from power wiring.",
      "Watch the R88's LED: it changes when it reboots or loses link. Note what it does during the tied-down test below.",
      "Wiggle test: props off, armed, ~40% throttle. Tap the frame and flex the harness while watching the radio page. Any freeze or jump to 1500/1100/1555 means it is not fixed.",
    ] },
    { type: "subheading", text: "B. Motor 4 and the hot motor" },
    { type: "list", items: [
      "Trace the output 4 signal lead from the APM to its ESC and note which arm it drives. It must be back-right, viewed from behind with the nose away from you.",
      "Check all four: output 1 front-right, 2 back-left, 3 front-left, 4 back-right.",
      "Check spin direction, props off: front-right and back-left spin counter-clockwise; front-left and back-right spin clockwise, seen from above. Swap two bullet connectors on any motor that is wrong.",
      "Check each prop matches its motor's direction (CW prop on CW motor, CCW on CCW) and is mounted printed side up.",
      "Inspect the hot motor: spin it by hand for roughness, check its three bullet connectors for looseness or discolouration, and smell for burnt windings. Swap it with a spare if in doubt.",
      "Tilt test: props off, armed in Stabilize, low throttle. Tilt the frame down on each side in turn; the motors on the low side must speed up.",
    ] },
    { type: "subheading", text: "C. Vibration" },
    { type: "list", items: [
      "Balance all four props, or fit a new balanced set; replace any with nicks or cracks.",
      "Check the prop adapters run true and the nuts are tight; check nothing touches a spinning prop.",
      "Re-check the APM suspension: floating freely, nothing bracing it, not loose.",
    ] },
    { type: "subheading", text: "D. Failsafe and barometer" },
    { type: "list", items: [
      "Decide on the barometer: a replacement APM, or moving SkyOne to a modern flight controller, which you were already considering. Land, AltHold and the failsafe all depend on it.",
      "Until then, fly only tied down or very low, and only once A and B are proven.",
    ] },
    { type: "subheading", text: "E. Next test" },
    { type: "list", items: [
      "Props on, tied down on the floor, hands clear: run 15–50% throttle for 30 s, then download the log.",
      "Pass criteria: no RC faults at all, accel X/Y within about ±3 m/s², and no motor sitting more than ~150 µs above the others.",
    ] },

    { type: "section", title: "Relevant parameters" },
    { type: "table", headers: ["Parameter", "Value", "Why it matters here"], rows: [
      ["`FS_THR_ENABLE`", "3", "Always Land on radio failsafe; Land depends on the faulty barometer"],
      ["`FS_THR_VALUE`", "975", "Placeholder A (≈1000) and B (1100) are both above it, so neither counts as a failsafe"],
      ["`LAND_SPEED`", "50 cm/s", "Target descent rate the Land controller tries to hold using the barometer"],
      ["`FLTMODE1–5` / `FLTMODE6`", "Stabilize / Land", "Why CH5 = 1555 (placeholder B) selected Stabilize and cancelled Land"],
      ["`RC5_MIN` / `RC5_MAX`", "986 / 2011", "Your SC switch range; 1555 is not one of its positions"],
      ["`RC3_MIN` / `RC3_MAX`", "986 / 2020", "Throttle range"],
      ["`THR_MIN` / `MOT_SPIN_ARMED`", "130 / 70", "1120 µs minimum in flight, 1056 µs armed idle"],
      ["`THR_MID`", "600", "Hover throttle setting"],
      ["`TRIM_THROTTLE`", "524 (was 594)", "Learned hover throttle, updated automatically"],
      ["`GND_ABS_PRESS` / `GND_TEMP`", "47,232 Pa / 40.3 °C", "Ground pressure should be ~95,000 Pa here: the barometer fault again"],
      ["`BATT_VOLT_PIN`", "13", "Still 13 in the log; the A0 jumper means 0 matches the wiring"],
    ] },

    { type: "section", title: "Method and glossary", paras: ["RCIN, RCOU, ATT and CTUN (10 Hz) were aligned with IMU (50 Hz), CURR (1 Hz), and MODE, EV and ERR events. Times are seconds since the APM powered up. A 0.4 s fragment at 296 s is left over from an older session and was ignored. Bench comparisons use the props-off test from 29 September. The physical position of each motor cannot be read from a log; positions here are the ones the APM assumes for each output."] },
    { type: "table", headers: ["Term", "Meaning"], rows: [
      ["RCIN CH1–CH5", "Roll, pitch, throttle, yaw and mode switch, in µs, as received by the APM"],
      ["RCOU M1–M4", "PWM to the ESCs: 1 front-right CCW, 2 back-left CCW, 3 front-left CW, 4 back-right CW"],
      ["Throttle in / out", "CTUN ThrIn (from the stick) and ThrOut (to the motors), 0–1000 shown as 0–100%"],
      ["ERR 2/2", "RC frames late: nothing new for 0.5 s"],
      ["ERR 5/1, 5/0", "Radio failsafe on / cleared"],
      ["ERR 18/2, 18/0", "Barometer glitch / cleared (11 glitches in this log)"],
      ["Placeholder frame", "A fixed set of channel values that does not come from your transmitter"],
    ] },
  ],
  source: SOURCE_32,
};

export default flight7;
