import type { FlightAnalysis } from "../types";

const X: [number, number] = [75, 700];

const flight3: FlightAnalysis = {
  flight: 3,
  meta: ["1 Oct 2026, 09:27", "Pixhawk 2.4.8 · ArduCopter 4.6.3"],
  headline: "It holds position to within 40 cm. Now it needs to land.",
  summary: ["Flight 3: seven arm cycles and about four minutes in the air on the 6200 mAh pack. GPS, compass, EKF, vibration, motors and the position controller all check out. Every hard landing today happened the same way, and the fix is one parameter plus one habit."],
  stats: [
    { value: "7", label: "Arm cycles" },
    { value: "≈ 4 min", label: "In the air" },
    { value: "13–17 cm", label: "Loiter hold, RMS" },
    { value: "1,007 mAh", label: "Logged from the pack" },
  ],
  hero: {
    caption: "Flight 3, altitude above the arming point (barometer/EKF), whole session. Shading shows the flight mode; numbers above the trace are arm cycles. Ground readings wander by ±0.5 m between cycles, so treat peak heights as approximate.",
    chart: { kind: "time", bands: "modes", cycleLabels: true, x: { min: X[0], max: X[1] }, y: { label: "Altitude (m)", min: -1, max: 10 }, series: [{ src: "sess", y: "alt", label: "Altitude", color: "ink", width: 1.6 }] },
  },
  blocks: [
    { type: "modeLegend", modes: ["stab", "alth", "loit", "rtl"] },
    { type: "section", title: "What worked", paras: ["Last September's log had a 180 µs yaw imbalance, a mis-wired battery monitor, a 474 hPa barometer and no Loiter. All of that is gone. This is what the log says now."] },
    { type: "table", headers: ["Check", "Measured in flight", "Verdict"], rows: [
      ["Loiter position hold", "Cycle 6: 13 cm RMS, worst 26 cm over 34 s. Cycle 7: 17 cm RMS, worst 40 cm over 30 s. In the breeze.", "Excellent"],
      ["Altitude hold (AltHold and Loiter)", "4 to 6 cm RMS error, worst 18 cm", "Excellent"],
      ["Vibration", "Z median 6.2 m/s², 95th percentile 11 (limit 30). X and Y about 2. Clipping only at the impacts", "Good"],
      ["GPS (M8N)", "19 to 22 satellites, HDOP 0.53 to 0.56 the whole time", "Excellent"],
      ["Compass (external HMC5883)", "Field 399 to 432 mG. Motor current moves it by 0.14 mG per amp, under 1% at 18 A. Internal compass correctly unused", "Clean"],
      ["EKF", "99th-percentile innovations in flight: velocity 0.20, position 0.04, compass 0.05. Spikes only at the impacts", "Healthy"],
      ["Yaw balance", "Clockwise and counter-clockwise motor pairs within 1 to 41 µs of each other (was about 180 µs in 2025)", "Fixed"],
      ["Board power", "5 V rail 4.85 to 4.94 V", "Good"],
      ["Battery monitor", "Voltage tracks sensibly and falls under load (it rose under load on 3.6.8). Current is plausible but still uncalibrated", "Working"],
    ] },
    { type: "section", title: "Every arm cycle in this session", paras: ["Touchdown speed is the EKF's descent rate in the last sample before ground contact. For scale, 1 m/s is like dropping the drone from 5 cm, 3 m/s from 45 cm and 5 m/s from 1.3 m. The Land mode descends at 0.5 m/s."] },
    { type: "table", headers: ["Cycle", "Armed", "Peak", "Modes in order", "Touchdown", "Notes"], rows: [
      ["1", "7 s", "–", "Stabilize", "–", "Arm and disarm only"],
      ["2", "52 s", "7.9 m", "Stab, RTL 4.6 s, Stab", "5.3 m/s", "Bounce at 1.4 m/s mid-flight, then the drop from 7.8 m"],
      ["3", "29 s", "5.2 m", "Stabilize", "0.6 m/s", "Best landing of the day"],
      ["4", "43 s", "8.9 m", "Stab, RTL 0.8 s, Stab", "1.8 m/s", "Firm. Came down at 1.5 m/s and throttle was cut at the ground"],
      ["5", "45 s", "8.4 m", "Stab, AltHold 24 s, Stab", "3.0 m/s", "Dropped after leaving AltHold at 8.4 m. \"GPS Glitch\" flag at impact"],
      ["6", "58 s", "6.8 m", "Stab, AltHold 5 s, Loiter 34 s, RTL 1 s, Stab", "2.8 m/s", "Throttle stick never moved during the fall. EKF yaw reset and EKF failsafe flag at impact"],
      ["7", "62 s", "5.6 m", "Stab, AltHold 8 s, Loiter 30 s, RTL 1 s, Stab", "5.1+ m/s", "The very hard one. Log stops 0.15 s before contact, with no disarm"],
    ] },
    { type: "prose", paras: ["The GPS glitch, EKF yaw reset and EKF failsafe messages all appear in the second after an impact, when the barometer and accelerometers get a jolt. They're consequences of the landings, not causes."] },
    { type: "section", title: "Why the landings were hard", paras: ["Cycles 2, 5, 6 and 7 all end the same way. The drone is hovering at 3 to 8 m in a mode where the flight controller manages throttle (AltHold, Loiter or RTL). Then it's switched to Stabilize, where the stick position is raw thrust. In every case the stick was sitting somewhere that, in Stabilize, meant a different thrust from what the drone needed to hover."] },
    { type: "chart", title: "The four drops", caption: "Altitude (line) and motor thrust (shaded) from 3 s before the switch to Stabilize (dashed line) until touchdown. The flat dotted level is the thrust that drone needed to hover at that moment.", chart: { kind: "landings" } },
    { type: "table", headers: ["Cycle", "Switch", "Stick", "Thrust given", "Needed to hover", "What happened"], rows: [
      ["2", "RTL to Stab at 6.5 m, climbing", "57% then 53%", "0.31, then 0.28", "0.34", "Peaked at 7.8 m, then fell all the way. 5.3 m/s at the ground"],
      ["5", "AltHold to Stab at 8.4 m", "46%", "0.21", "0.38", "Fell at up to 4.3 m/s. Throttle added 1.3 s later, slowed it to 3.0 m/s"],
      ["6", "RTL to Stab at 6.7 m", "61%", "0.35", "0.43", "Slow, steady fall for 4 s with the stick untouched. 2.8 m/s"],
      ["7", "RTL to Stab at 2.7 m", "59%, then 30%", "0.49, then 0.20", "0.41", "Climbed to 5.6 m, then throttle cut to half of hover for 2 s. 5.1 m/s and still accelerating"],
    ] },
    { type: "subheading", text: "The hidden cause: MOT_THST_HOVER was 0.25 all day" },
    { type: "prose", paras: [
      "In Stabilize, ArduPilot bends the throttle curve so that mid-stick gives exactly `MOT_THST_HOVER`. Mid-stick is supposed to equal hover. It was set to 0.25, but SkyTwo actually needed 0.33 on a fresh pack, rising to 0.42 as the battery sagged. So mid-stick in Stabilize gave only 60 to 75% of the thrust needed.",
      "In AltHold and Loiter the same mid-stick means \"hold altitude\", so the mismatch is invisible there. It only bites the instant you switch to Stabilize, which is exactly when every drop began.",
      "Hover learning (`MOT_HOVER_LEARN` = 2) did kick in during Cycle 7's Loiter and climbed from 0.25 to 0.40 in 30 s. It saves the value on disarm, though, and Cycle 7 never logged a disarm. The stored value is very likely still about 0.25.",
    ] },
    { type: "chart", title: "Stabilize throttle curve", caption: "Stabilize throttle curve. The shaded band is the thrust SkyTwo needed to hover today.", chart: { kind: "throttleCurve" } },
    { type: "section", title: "The last landing, second by second" },
    { type: "chart", caption: "Cycle 7, 684 to 698.7 s. Altitude (left axis), motor thrust and throttle stick position (right axis, 0 to 1).", chart: {
      kind: "time", bands: "modes", x: { label: "Time (s)", min: 684, max: 698.7 }, y: { label: "Altitude (m)", min: 0, max: 6 }, y2: { label: "Thrust / stick", min: 0, max: 0.8 },
      series: [
        { src: "fin", y: "alt", label: "Altitude (m)", color: "ink", width: 2.4 },
        { src: "fin", y: "tho", label: "Thrust", color: "s2", right: true },
        { src: "fin", y: "stk", label: "Throttle stick", color: "muted", dash: true, right: true },
        { src: "fin", y: "thh", label: "Learned hover thrust", color: "loit", dash: true, right: true },
      ] } },
    { type: "list", items: [
      "**662 to 693 s, Loiter at 2.6 m.** Rock steady, within 40 cm horizontally and 10 cm vertically. Stick at 59%, inside the centre deadband.",
      "**692.9 s, SC flipped to RTL.** RTL's first job is to climb to `RTL_ALT`, which is 15 m, so thrust starts rising.",
      "**693.8 to 694.1 s, mode switch moved to Stabilize.** By now hover learning had reached 0.40, so 59% stick gave 0.49 thrust against 0.41 needed. It kept climbing, up to 1.5 m/s.",
      "**696.3 s, throttle pulled to 30%.** That's 0.20 thrust, half of hover, and it was held there for about 2 s. The climb stopped at 5.55 m and the drone began to fall.",
      "**697 to 698.7 s, the fall.** Descent built from 0 to 5.1 m/s. A small throttle increase to 0.26 came too late and was still well below hover.",
      "**698.66 s, the log stops.** The drone was 0.75 m up and dropping at 5 m/s, so impact was about 0.15 s later. No disarm and no ground data were recorded. The flight controller lost power at impact (the battery lead or power-module plug likely jolted loose), taking its last buffered fraction of a second with it.",
    ] },
    { type: "prose", paras: ["This wasn't a hardware or tuning failure. The drone did exactly what the stick told it, at a moment when the stick meant something different from a second earlier."] },
    { type: "section", title: "The RTL switch", paras: [
      "SC went to RTL four times today (Cycles 2, 4, 6 and 7), and each time the mode went back to Stabilize within 1 to 5 s. RTL never got further than its initial climb. In Cycle 2 it took the drone from 2 m to 7.8 m in 4.6 s.",
      "If the intent was a \"bring it down\" switch, that's Land on SA, which wasn't used once today. RTL climbs to 15 m, flies back over the arming spot, waits 5 s, then descends. It's worth testing once deliberately from 10 m or more, hands off, letting it finish.",
    ] },
    { type: "section", title: "Battery: plenty of capacity, too much sag", paras: ["The pack started at 12.36 V resting (4.12 V per cell) and ended at 11.73 to 11.84 V resting after 1,007 mAh was logged, about 16% of 6200 mAh. Under hover current of 14 to 18 A it sagged to 10.3 to 10.6 V. That's about 1.3 V of sag at 15 A, or roughly 85 mΩ in the whole power path. ArduPilot's own estimate agrees, at 75 to 90 mΩ. A healthy 6200 mAh 40C pack is more like 20 to 30 mΩ."] },
    { type: "chart", caption: "Measured voltage, ArduPilot's sag-corrected resting voltage, and current. The dotted line is `BATT_LOW_VOLT` at 10.5 V.", chart: {
      kind: "time", bands: "modes", x: { min: X[0], max: X[1] }, y: { label: "Volts", min: 10, max: 12.6 }, y2: { label: "Amps", min: 0, max: 40 }, refs: [{ y: 10.5, label: "BATT_LOW_VOLT 10.5 V" }],
      series: [
        { src: "bat", y: "v", label: "Voltage", color: "s2", width: 1.4 },
        { src: "bat", y: "vr", label: "Resting (sag-corrected)", color: "loit", width: 1.6 },
        { src: "bat", y: "i", label: "Current (A)", color: "s4", width: 1.1, right: true },
      ] } },
    { type: "prose", paras: ["Three things follow from this. Hover thrust crept from 0.33 to 0.42 over the session, which is part of why Stabilize felt inconsistent. The raw voltage dipped to 10.34 V, below `BATT_LOW_VOLT`, and with `BATT_FS_VOLTSRC` = 0 a low-battery RTL could trigger on sag with 80% of the pack left. And the sag itself points at an aged pack, a worn XT60 or connection, or a current reading that's too low (`BATT_AMP_PERVLT` is still the default 17)."] },
    { type: "section", title: "Motors and lean in Loiter" },
    { type: "chart", caption: "Average motor output during the two Loiter segments.", chart: { kind: "motorBars" } },
    { type: "prose", paras: ["The right-side motors (1 and 4) run 40 to 50 µs above the left (2 and 3), which matches a slight lean. Yaw pairs are balanced. Peak outputs reached 1,780 to 1,840 µs, so there's headroom, though less as the pack sags."] },
    { type: "chart", caption: "Loiter position, metres east and north of the average point.", chart: { kind: "loiterScatter" } },
    { type: "prose", paras: ["To hold position, Loiter needed about 1.2° of left roll and 0.5 to 1.1° nose-up with the nose at about 205°. A breeze from the south-southwest would hit the nose and call for a nose-down lean, so wind alone doesn't explain it. It may be a small level offset of around 1°, or the wind at 5 m differed from the ground. Loiter compensates either way, so this is low priority."] },
    { type: "section", title: "Vibration", paras: ["In steady flight, Z sits around 6 m/s² and X and Y around 2. The tall spikes all line up with ground contacts, as does every clipping event (8 at start, 248 by the end, all at touchdowns or handling). Props, motors and the FC mount are in good shape."] },
    { type: "chart", chart: {
      kind: "time", bands: "modes", x: { min: X[0], max: X[1] }, y: { label: "m/s²", min: 0, max: 60 }, refs: [{ y: 30, label: "30 m/s²" }],
      series: [
        { src: "vibe", y: "z", label: "Z", color: "s4", width: 1.2 },
        { src: "vibe", y: "x", label: "X", color: "s1", width: 1 },
        { src: "vibe", y: "y", label: "Y", color: "s3", width: 1 },
      ] } },
    { type: "section", title: "Before the next flight", paras: ["In priority order."] },
    { type: "list", items: [
      "**Set `MOT_THST_HOVER` to 0.38 in QGC.** Check the current value first; it's very likely still 0.25. Leave `MOT_HOVER_LEARN` at 2 so it refines and saves after a normal disarm.",
      "**Land from Loiter or AltHold, not Stabilize.** Lower the stick below centre and it descends at a controlled rate, touches down, and disarms itself after a few seconds at zero throttle. Set `PILOT_SPEED_DN` to 100 (1 m/s); at 0 it borrows `PILOT_SPEED_UP` and descends at 2.5 m/s with the stick fully down. Or flip SA for Land, which comes down at 0.5 m/s below 10 m.",
      "**Treat Stabilize as a near-ground mode.** If you switch into it in the air, centre the throttle stick first and stay below 1 to 2 m. With the hover value fixed, centre will finally mean hover.",
      "**Inspect after the last impact.** Battery strap, XT60 and the power-module lead to the Pixhawk (find out why power dropped), landing gear, props, the GPS mast, and that the FC hasn't shifted on its mount. Redo level horizon if anything moved.",
      "**Battery settings and health.** Set `BATT_FS_VOLTSRC` to 1 so failsafes use sag-corrected voltage. After recharging, compare the charger's mAh with the logged 1,007 mAh and scale `BATT_AMP_PERVLT`. Measure the pack's internal resistance per cell if your charger can.",
      "**Test RTL on purpose once.** From 10 m or more in open space, flip SC and let it complete the climb, return and landing without touching anything.",
      "**Later, in calm air.** A Loiter hover with the nose north, then south, to separate wind from level offset. After that, AutoTune in AltHold if you want a crisper feel.",
    ] },
    { type: "callout", label: "Minor notes", paras: ["Only one accelerometer and gyro are detected (`INS_ACC2_ID` = 0), so there's no IMU redundancy on this board; it's been flying fine on one. \"PreArm: EKF attitude is bad\" early in this session cleared once GPS settled, and \"Arm: Throttle too high\" was a single rejected arm. Both are normal."] },
  ],
  source: "Analysed from the 2026-10-01 09:27:08 dataflash log. Flight 2 (the reversed-prop attempt) has its own report. Most messages are logged at 10 Hz and IMU at 25 Hz, so impact peaks are under-sampled; touchdown speeds come from the EKF velocity just before contact.",
};

export default flight3;
