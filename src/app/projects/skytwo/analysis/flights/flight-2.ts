import type { FlightAnalysis } from "@/components/flight-analysis/types";

const flight2: FlightAnalysis = {
  flight: 2,
  meta: ["1 Oct 2026, 08:47", "Pixhawk 2.4.8 · ArduCopter 4.6.3"],
  headline: "One prop on the wrong motor, caught in seconds.",
  summary: ["Flight 2 has two arm cycles and no real flight. On the second, SkyTwo rose about half a metre, tilted toward its back-left corner and swung 70° clockwise while the flight controller ran out of authority. The log points at the back-left motor (Motor 2) as the one carrying the reversed prop."],
  stats: [
    { value: "2", label: "Arm cycles, 31 s and 18 s" },
    { value: "~0.7 m", label: "Highest point, second cycle" },
    { value: "199° → 270°", label: "Uncommanded clockwise yaw" },
    { value: "73 mAh", label: "Used from the pack" },
  ],
  blocks: [
    { type: "section", title: "Arm cycle 2: the one that tells the story", paras: ["Armed at 195.0 s in Stabilize, disarmed at 212.7 s. The throttle stick came up to about 66%, and motor thrust peaked at 0.42."] },
    { type: "chart", title: "Motor outputs", caption: "Motor outputs. From 205.8 s Motor 1 sits on its 1150 µs floor while Motor 2 runs highest, up to 1818 µs.", chart: {
      kind: "time", x: { label: "Time (s)", min: 194, max: 213.5 }, y: { label: "PWM (µs)", min: 950, max: 1900 }, y2: { label: "Altitude (m)", min: -0.2, max: 1.6 }, shade: [[205.8, 211.5]],
      series: [
        { src: "c2", y: "m1", label: "Motor 1, front right (CCW)", color: "s1", width: 2.2 },
        { src: "c2", y: "m2", label: "Motor 2, back left (CCW)", color: "s2", width: 2.2 },
        { src: "c2", y: "m3", label: "Motor 3, front left (CW)", color: "s3", width: 1.4 },
        { src: "c2", y: "m4", label: "Motor 4, back right (CW)", color: "s4", width: 1.4 },
        { src: "c2", y: "alt", label: "Altitude (m)", color: "muted", dash: true, right: true },
      ] } },
    { type: "chart", title: "Attitude and heading", caption: "Roll, pitch (left axis) and heading (right axis). The pilot asked for level the whole time; desired roll and pitch averaged 0°.", chart: {
      kind: "time", x: { label: "Time (s)", min: 194, max: 213.5 }, y: { label: "Degrees", min: -10, max: 12 }, y2: { label: "Heading (°)", min: 180, max: 290 }, shade: [[205.8, 211.5]],
      series: [
        { src: "c2", y: "roll", label: "Roll (°)", color: "s2", width: 2 },
        { src: "c2", y: "pitch", label: "Pitch (°)", color: "s3", width: 2 },
        { src: "c2", y: "yaw", label: "Heading (°)", color: "ink", dash: true, right: true },
      ] } },
    { type: "prose", paras: ["From about 205 s the frame tilted up to 7° left and 9° nose-up, a lean toward the back-left corner. At the same time it began yawing clockwise and the yaw output saturated at its limit."] },
    { type: "section", title: "Why the log points at Motor 2", paras: [
      "When one corner stops making lift, the controller pushes that motor harder and cuts the diagonally opposite one. That's exactly what happened: Motor 2 (back left) climbed to the highest output, and Motor 1 (front right) went all the way to its minimum. Even so, the back-left corner kept sagging, so Motor 2 wasn't producing useful thrust.",
      "The yaw follows from the same thing. Motors 1 and 2 are the counter-clockwise pair. With Motor 1 at idle and Motor 2 driving a prop that wasn't lifting properly, the controller had no room left to fight the yaw, so the frame turned.",
      "If the wrong prop had been on Motor 1 instead, the drone would have leaned the other way, nose-down to the front right. The log shows the opposite.",
    ] },
    { type: "table", headers: ["Motor", "Position", "Spin", "Average, 205.8 to 211.5 s", "Role in this run"], rows: [
      ["1", "Front right", "CCW", "1,212 µs", "Cut to the floor, opposite the weak corner"],
      ["2", "Back left", "CCW", "1,712 µs", "Highest output, still not lifting its corner"],
      ["3", "Front left", "CW", "1,653 µs", "Normal"],
      ["4", "Back right", "CW", "1,639 µs", "Normal"],
    ] },
    { type: "section", title: "Arm cycle 1: a ground run-up", paras: ["Logging started at 77.3 s, just as the drone was armed, and it disarmed at 109.2 s. Throttle only reached about 16% and the drone never left the ground. Motor outputs spread apart (Motor 2 settled on its floor), but with the frame sitting on its legs the controller is reacting to tiny ground-contact errors, so this cycle doesn't say much about the props."] },
    { type: "chart", title: "Motor outputs, first arm cycle", caption: "Motor outputs during the first arm cycle. Altitude stayed within 15 cm of the ground.", chart: {
      kind: "time", x: { label: "Time (s)", min: 77.3, max: 110.5 }, y: { label: "PWM (µs)", min: 950, max: 1600 },
      series: [
        { src: "c1", y: "m1", label: "Motor 1, front right (CCW)", color: "s1", width: 2.2 },
        { src: "c1", y: "m2", label: "Motor 2, back left (CCW)", color: "s2", width: 2.2 },
        { src: "c1", y: "m3", label: "Motor 3, front left (CW)", color: "s3", width: 1.4 },
        { src: "c1", y: "m4", label: "Motor 4, back right (CW)", color: "s4", width: 1.4 },
      ] } },
    { type: "section", title: "Everything else was healthy" },
    { type: "table", headers: ["Check", "Measured", "Verdict"], rows: [
      ["Battery", "12.41 V at the start, dipping to 11.1 V at 18 A peak current. 73 mAh used", "Fine"],
      ["Vibration", "X and Y under 8 m/s², Z under 19. No clipping", "Good"],
      ["GPS", "Up to 19 satellites, HDOP 0.66 or better", "Good"],
      ["Errors", "None logged. Only arm, disarm and land-detector events", "Clean"],
      ["Mode", "Stabilize throughout", "–"],
    ] },
    { type: "section", title: "What changed for Flight 3", paras: ["The prop was swapped before the next flight, and Flight 3 confirms the fix: in Loiter the clockwise and counter-clockwise motor pairs ran within about 30 µs of each other, and the drone held position within 40 cm."] },
    { type: "callout", label: "A quick pre-flight check for next time", paras: ["Before each session, look at each prop with the drone facing away from you. The leading edge (the thicker, rounded edge) should face the direction that motor spins: counter-clockwise on front right and back left, clockwise on front left and back right. On most prop sets, the ones marked \"R\" are the clockwise props."] },
  ],
  source: "Analysed from the 2026-10-01 08:47:16 dataflash log. Most messages are logged at about 10 Hz.",
};

export default flight2;
