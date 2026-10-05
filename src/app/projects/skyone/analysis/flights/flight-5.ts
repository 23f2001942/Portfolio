import type { FlightAnalysis } from "@/components/flight-analysis/types";
import { attitude, battery, rcInputs, SOURCE_32 } from "../presets";

const T = { label: "Time since logging began (s)" };

const flight5: FlightAnalysis = {
  flight: 5,
  meta: ["27 Sep 2026", "APM 2.8 · ArduCopter 3.2.1", "One power-up, 11 arm cycles, about 17.5 min recorded"],
  headline: "Twelve take-offs, then a sudden loss of thrust at the back-left corner half a second after switching to AltHold",
  summary: [
    "Time on every chart is seconds since logging began (the board was powered up about 14 s earlier). Background colour shows the flight mode.",
    "The crash matches a sudden loss of thrust at the back-left corner, 0.5 s after switching to AltHold. That fits the Back Left motor connector you found disconnected. The steady back-left drift is real: to hold position you were leaning it about 1° forward-right the whole time. AltHold's height estimate was noisy, and in two runs the throttle stick sat below the hold zone.",
  ],
  stats: [
    { value: "12", label: "Take-offs" },
    { value: "148 s", label: "Longest (take-off 7)" },
    { value: "≈ 60%", label: "Throttle needed to hover" },
    { value: "1,043 mAh", label: "Used of 2,200 mAh" },
    { value: "0.2 s", label: "Level to 53° nose-up" },
    { value: "4.81–5.03 V", label: "Board 5 V (no brownout)" },
  ],
  hero: {
    caption: "The whole session: estimated altitude, with take-off numbers above the trace. The red dashed line is the crash.",
    chart: {
      kind: "time", bands: "modes", cycleLabels: true, x: T, y: { label: "Altitude est. (m)", min: -2, max: 10 },
      refs: [{ x: 1050.9, color: "warn", label: "crash" }],
      series: [{ src: "thr", y: "alt", label: "Altitude estimate", color: "s1", width: 1.4 }],
    },
  },
  blocks: [
    { type: "modeLegend", modes: ["stab", "alth", "land"], note: "Shaded bands show the flight mode." },

    { type: "section", title: "The whole session", paras: ["Every take-off, landing and mode switch in one view."] },
    { type: "table", headers: ["Take-off", "Start (s)", "Airborne (s)", "Max height est. (m)", "Hover throttle (%)", "Max tilt (°)", "Modes"], rows: [
      ["1", "6", "5.3", "0.4", "—", "2.0", "Stabilize"],
      ["2", "44", "7.5", "1.8", "49.6", "4.0", "Stabilize"],
      ["3", "89", "25.6", "1.2", "54.0", "9.0", "Stabilize"],
      ["4", "156", "11.6", "2.5", "57.9", "11.0", "Stabilize"],
      ["5", "175", "23.0", "3.5", "57.6", "19.0", "Stabilize, AltHold, Land"],
      ["6", "262", "28.1", "3.1", "58.3", "14.0", "Stabilize, Land, AltHold"],
      ["7", "375", "148.5", "4.2", "59.0", "41.0", "Stabilize, AltHold, Land"],
      ["8", "487", "36.5", "4.2", "59.1", "16.0", "Stabilize, AltHold, Land"],
      ["9", "726", "101.9", "3.8", "61.9", "25.0", "Stabilize, AltHold, Land"],
      ["10", "794", "33.4", "3.8", "62.9", "25.0", "Stabilize, AltHold, Land"],
      ["11", "887", "35.2", "3.7", "61.4", "24.0", "Stabilize, Land, AltHold"],
      ["12", "1017", "33.5", "~7 (unreliable)", "65.6", "flipped", "Stabilize, AltHold, Land"],
    ], note: "Hover throttle rises from about 50% to about 65% over the session. That's the battery emptying: a weaker battery needs more throttle for the same lift. It's normal, but it also tells you take-off 12 was flown on a well-used battery." },

    { type: "section", title: "The crash" },
    { type: "chart", title: "Attitude around the crash", caption: "Desired (dashed) versus actual roll and pitch from 1048 to 1054 s. Pitch runs away nose-up while the desired angle is back at 0°.",
      chart: attitude({ x: { ...T, min: 1048, max: 1054 } }) },
    { type: "chart", title: "Throttle around the crash", caption: "Throttle from the stick versus throttle sent to the motors. AltHold drives the motors to 100% right after the switch.",
      chart: { kind: "time", bands: "modes", x: { ...T, min: 1048, max: 1054 }, y: { label: "Throttle (%)", min: 0, max: 100 }, series: [
        { src: "thr", y: "tin", label: "Throttle stick", color: "ink", width: 1.8 },
        { src: "thr", y: "tout", label: "Throttle to motors", color: "s2", width: 1.5 },
      ] } },
    { type: "subheading", text: "Timeline" },
    { type: "table", headers: ["Time (s)", "What happened"], rows: [
      ["1050.4", "You switch to AltHold at roughly 7 m (estimate). At almost the same moment the yaw stick jabs full left for about 0.2 s. That's likely a thumb slip while reaching for the switch; it's harmless on its own."],
      ["1050.5–1050.8", "AltHold raises motor throttle from 62% to 85%, then 100%, to hold height. More thrust means more current through every motor connector."],
      ["1050.8", "You ask for 7° nose-up for a moment, then back to 0°."],
      ["1050.9", "You're asking for 0°, but the drone is at 53° nose-up and 10° left-down with the motors at 100%. The flight controller is at full power and still can't correct it."],
      ["1051.0", "Roll −175°, upside down. From there it tumbles for about 1.5 s to the ground."],
    ] },
    { type: "prose", paras: [
      "Nose-up plus left-down means the back-left corner fell. A quad can only do that against full correction if that corner's motor stopped pushing. Together with the Back Left connector you found disconnected, and the fact that it happened right when current jumped, the most likely story is that the loose bullet connector let go under load in the air. This is the same pattern as the Front Right arm earlier.",
      "After the crash, while it lay upside down, the radio briefly dropped out and the failsafe switched it to Land. That was after impact, so it wasn't a cause. It does show your failsafe works.",
    ] },

    { type: "section", title: "The back-left drift" },
    { type: "chart", title: "Attitude during take-off 7", caption: "Desired versus actual roll and pitch during the longest take-off (148 s). Roll sits slightly right and pitch slightly forward throughout.",
      chart: attitude({ x: { ...T, min: 370, max: 530 } }) },
    { type: "prose", paras: ["Across about 3.4 minutes of Stabilize flying, your average command was roll **+1.1° (right)** and pitch **−0.7° (forward)**, and the drone's average actual lean was **+1.2° right** and **1.2° forward**. In other words, to stay in place it had to lean slightly forward-right the whole time. Something is pushing it back-left, most likely one of these:"] },
    { type: "list", items: [
      "**Level calibration is about 1° off.** This is most likely, since you rebuilt the board mount after the last accel calibration.",
      "The centre of gravity sits toward the back-left (battery position).",
      "A weaker motor or prop on the back-left, which fits with that arm's connector problem.",
    ] },
    { type: "callout", label: "Fix", paras: ["Repair the mount, then redo the 6-position Accel Calibration on a flat surface. Centre the battery. If a small drift remains, trim it with ArduPilot's own trim rather than transmitter trims."] },

    { type: "section", title: "Why AltHold felt like it kept sinking" },
    { type: "table", headers: ["Run", "Start (s)", "Length (s)", "Height at switch (m)", "Target set (m)", "Lowest (m)", "Baro swing (m)", "Avg stick (%)", "Stick below hold zone"], rows: [
      ["1", "183", "8.2", "2.73", "2.95", "2.73", "2.88", "49.4", "15%"],
      ["2", "271", "8.0", "2.83", "2.62", "2.53", "4.09", "57.0", "0%"],
      ["3", "282", "1.8", "1.69", "1.19", "1.38", "1.29", "55.7", "0%"],
      ["4", "388", "7.9", "3.09", "2.76", "2.68", "2.67", "56.1", "0%"],
      ["5", "508", "5.2", "3.19", "2.96", "3.01", "1.6", "52.9", "0%"],
      ["6", "821", "5.7", "2.23", "1.07", "0.75", "5.64", "54.8", "5%"],
      ["7", "904", "18.3", "3.06", "2.5", "0.02", "7.82", "41.8", "24%"],
      ["8", "1050", "2.1", "7.06", "7.12", "−1.33", "27.8", "38.5", "41%"],
    ] },
    { type: "prose", paras: ["Three separate things show up:"] },
    { type: "list", items: [
      "**The barometer was noisy.** While flying it wandered ±0.8 m (1 standard deviation) from the height estimate, and in several runs it swung 3–8 m in a few seconds. The flight controller partly trusts that signal, so the \"hold\" height itself moved around. With motors off on the ground the noise was only about half as big, so prop wash and vibration are adding to it.",
      "**In runs 6 and 7 the target was set well below the real height** (for example 1.07 m target vs 2.23 m at the switch). The drone then flew down to its target on purpose. This comes from the noisy height estimate at the moment you switched.",
      "**In runs 7 and 8 your stick was below the 40–60% hold zone** for 24–41% of the time. Below the zone, AltHold reads the stick as \"descend\".",
    ] },
    { type: "chart", title: "AltHold run 7: height, target and barometer", caption: "Estimated altitude, AltHold's target and the raw barometer altitude during run 7 (904–922 s).",
      chart: { kind: "time", bands: "modes", x: { ...T, min: 900, max: 925 }, y: { label: "Altitude (m)" }, series: [
        { src: "thr", y: "dalt", label: "Target altitude", color: "muted", dash: true },
        { src: "thr", y: "alt", label: "Altitude estimate", color: "s1", width: 1.8 },
        { src: "thr", y: "balt", label: "Barometer altitude", color: "s2", width: 1.1 },
      ] } },
    { type: "chart", title: "AltHold run 7: throttle stick against the hold zone", caption: "Throttle stick position. Between the dotted lines (40–60%) AltHold holds height; below them it descends.",
      chart: { kind: "time", bands: "modes", x: { ...T, min: 900, max: 925 }, y: { label: "Throttle stick (%)", min: 0, max: 100 },
        refs: [{ y: 40, color: "loit", label: "40%" }, { y: 60, color: "loit", label: "60%" }],
        series: [{ src: "thr", y: "tin", label: "Throttle stick", color: "ink", width: 1.8 }] } },
    { type: "callout", label: "About THR_MID", paras: ["An earlier guess was that `THR_MID` being too low (50% against about 60% hover) made AltHold sag on entry. The log shows the motors stayed at about 60% in the first second of every switch, so that wasn't the main cause. Setting `THR_MID` = 600 is still worthwhile, because then hover sits at mid-stick in Stabilize too, and your stick is already in the hold zone when you switch."] },

    { type: "section", title: "How well it followed your commands" },
    { type: "chart", title: "Attitude during take-off 10", caption: "Desired versus actual roll and pitch during take-off 10.",
      chart: attitude({ x: { ...T, min: 790, max: 830 } }) },
    { type: "prose", paras: ["Roll and pitch follow your commands to within about 3–4° RMS, and yaw about 3°. That's acceptable for a first tune, a little loose, and the tails of the distribution include take-off and landing bumps. Don't tune PIDs until the mount and vibration are fixed."] },

    { type: "section", title: "Power" },
    { type: "chart", title: "Battery voltage and current", caption: "The logged voltage stays flat while current swings from about 1 A to 22 A, which a real battery can't do. The current reading is sensible.",
      chart: battery({ x: T }) },
    { type: "chart", title: "Board 5 V supply", caption: "The APM's own 5 V rail stayed between 4.81 and 5.03 V all session, including the crash.",
      chart: { kind: "time", bands: "modes", x: T, y: { label: "Vcc (V)", min: 4.6, max: 5.2 }, series: [{ src: "bat", y: "vcc", label: "Board 5 V", color: "s3", width: 1.6 }] } },
    { type: "prose", paras: [
      "The battery voltage in this log (about 13.8 V) isn't real. A battery's voltage drops when current rises from 1 A to 22 A; this reading stays flat. `BATT_VOLT_PIN` is set to **0**, which isn't the power-module voltage pin. On APM 2.5/2.6/2.8 it should be **13** (current pin 12 is already correct). That explains the 0 V on the HUD.",
      "What is good: current sensing looks sensible (up to about 23 A at full throttle), you used 1,043 of 2,200 mAh, and the board's 5 V supply stayed between 4.81 and 5.03 V the whole time. There were no brownouts, even during the crash.",
    ] },
    { type: "callout", label: "Later update", paras: ["After this flight the voltage signal was jumpered to analog pin A0. With that wiring `BATT_VOLT_PIN` = 0 is the matching value (see the Flight 6 and 7 analyses)."] },

    { type: "section", title: "Telemetry radio" },
    { type: "chart", title: "SiK radio signal", caption: "Signal strength (RSSI) and noise for the drone radio and the ground radio, as reported by the drone.",
      chart: { kind: "time", bands: "modes", x: T, y: { label: "Level" }, series: [
        { src: "rad", y: "rssi", label: "Drone RSSI", color: "s1", width: 1.3 },
        { src: "rad", y: "noise", label: "Drone noise", color: "s1", dash: true, width: 1 },
        { src: "rad", y: "remrssi", label: "Ground RSSI", color: "s2", width: 1.3 },
        { src: "rad", y: "remnoise", label: "Ground noise", color: "s2", dash: true, width: 1 },
      ] } },
    { type: "prose", paras: ["The ground radio was heard only 18% of the time, and the drone radio's signal sat barely above the noise. For most of the session the SiK link wasn't really connected. It doesn't affect flying (that's the R88), but check that both radios link (solid green) before the next field test if you want live data on the laptop."] },

    { type: "section", title: "Your stick inputs" },
    { type: "chart", title: "RC inputs", caption: "Roll, pitch, throttle, yaw and mode-switch channels as the APM received them.",
      chart: rcInputs({ x: T, bands: "modes" }) },

    { type: "section", title: "What this log couldn't show" },
    { type: "prose", paras: ["Motor outputs (RCOU) and vibration (IMU) weren't logged, because `LOG_BITMASK` = **894**. With motor outputs we would see exactly which motor went to 100% before the flip. Set `LOG_BITMASK` = **2046** so the next log records both. The log fills faster, so download after every session."] },

    { type: "section", title: "Fix list before the next flight" },
    { type: "list", items: [
      "Check all 12 motor bullet connectors: each should need a firm pull to separate. Heat-shrink each joint and zip-tie the wires to the arm.",
      "Replace both damaged props and check the two back motor shafts for bends.",
      "Repair the APM suspension so the board is level and isolated from vibration. Foam over the barometer.",
      "Redo the Accel Calibration. Centre the battery.",
      "Parameters: `BATT_VOLT_PIN` = 13, `THR_MID` = 600, `LOG_BITMASK` = 2046. Write Params, then reboot.",
      "Check the HUD shows a real battery voltage with the battery plugged in.",
      "First flight: Stabilize only, low. Then AltHold at about 2 m with the stick parked at mid.",
    ] },
  ],
  source: SOURCE_32 + " This log has no motor-output or vibration data (`LOG_BITMASK` 894).",
};

export default flight5;
