import type { FlightAnalysis, TimeChart } from "@/components/flight-analysis/types";

const X = { min: 55, max: 748 };
const t = (c: Omit<TimeChart, "kind" | "x" | "bands"> & { x?: TimeChart["x"]; bands?: TimeChart["bands"] }): TimeChart =>
  ({ kind: "time", x: X, bands: "hops", ...c });

const flight1: FlightAnalysis = {
  flight: 1,
  meta: ["5 Sep 2025, 17:09", "Pixhawk (PX4v3) · ArduCopter 3.6.8", "First test flight"],
  headline: "Seven hops, one direction: back and to the left.",
  summary: ["The controller held the frame level the whole time, and no roll or pitch correction was given. So SkyTwo went where the air, or a small level bias, pushed it. This report walks through the whole 12-minute log and ends with every issue the data turned up."],
  stats: [
    { value: "ArduCopter 3.6.8", label: "Firmware" },
    { value: "11.4 min", label: "Log length" },
    { value: "11", label: "Arm cycles" },
    { value: "7 in Stabilize", label: "Hops" },
    { value: "about 3 m", label: "Highest climb" },
    { value: "up to 16 sats", label: "GPS" },
  ],
  hero: { chart: { kind: "radar" }, caption: "Each line is one hop's path from liftoff, drawn relative to the nose (up). Rings every 4 m." },
  blocks: [
    { type: "section", title: "Session overview", paras: ["11 arm/disarm cycles over about 11½ minutes. Seven of them produced a real hop (throttle output above hover level for more than two seconds); the rest were arm, spool, and disarm without leaving the ground. Pale blue bands are armed periods, orange bands are the hops."] },
    { type: "chart", title: "Altitude and throttle", caption: "EKF altitude (the vehicle's best estimate) against barometer altitude, with throttle output on the right axis. The deep negative dips after some landings are the EKF being jolted by hard touchdowns; the barometer stays near zero.", chart: t({
      y: { label: "Altitude (m)" }, y2: { label: "Throttle out", min: 0, max: 0.6 },
      series: [
        { src: "ctun", y: "alt", label: "EKF altitude", color: "s1", width: 2 },
        { src: "ctun", y: "balt", label: "Baro altitude", color: "muted", dash: true },
        { src: "ctun", y: "tho", label: "Throttle out", color: "s2", right: true, width: 1.2 },
      ] }) },
    { type: "section", title: "The seven hops", paras: ["All in Stabilize, all with the nose pointed roughly south-southwest (197–212°). Drift is measured from liftoff to touchdown in the drone's own frame: negative forward means it went backward, negative right means it went left."] },
    { type: "table", swatches: ["s1", "s2", "s3", "s4", "s5", "s6", "land"], headers: ["Hop", "Time (s)", "Length (s)", "Climb (m)", "Heading", "Drift fwd (m)", "Drift right (m)", "Peak speed (m/s)", "Mean roll / pitch", "Motors 1 / 2 / 3 / 4 (µs)"], rows: [
      ["Hop 1", "65.4–72.2", "6.8", "1.0", "204°", "-1.1", "-4.0", "1.13", "-0.2° / 0.1°", "1596 / 1550 / 1643 / 1682"],
      ["Hop 2", "85.7–91.3", "5.6", "3.0", "202°", "-0.9", "-3.8", "1.15", "0.3° / -0.1°", "1586 / 1562 / 1653 / 1694"],
      ["Hop 3", "103.5–106.0", "2.5", "0.8", "203°", "-1.3", "-0.1", "1.17", "0.9° / 1.8°", "1597 / 1590 / 1634 / 1652"],
      ["Hop 4", "186.3–196.4", "10.1", "2.6", "205°", "-7.1", "-12.1", "1.9", "-0.4° / 0.3°", "1632 / 1566 / 1665 / 1697"],
      ["Hop 5", "559.8–567.0", "7.2", "1.5", "197°", "-5.1", "-4.5", "1.53", "-0.3° / -0.0°", "1626 / 1571 / 1664 / 1703"],
      ["Hop 6", "666.5–677.2", "10.7", "0.7", "212°", "-8.2", "-4.2", "1.45", "0.9° / 0.4°", "1571 / 1534 / 1658 / 1690"],
      ["Hop 7", "733.1–740.8", "7.7", "2.8", "211°", "-8.9", "-6.7", "1.81", "-0.2° / 0.5°", "1643 / 1575 / 1662 / 1688"],
    ] },
    { type: "section", title: "Drift", paras: ["The reported problem, confirmed. Every hop moved back-left relative to the nose, which is east to east-northeast over the ground, at an average acceleration equivalent to a 1–2° lean."] },
    { type: "chart", title: "Over the ground", caption: "Track of each hop from liftoff, north up. The short white line shows where the nose pointed.", chart: { kind: "earth" } },
    { type: "chart", title: "Horizontal speed", caption: "Ground speed during each hop. It builds steadily instead of staying near zero, which is what uncorrected drift looks like.", chart: { kind: "hopSpeed" } },
    { type: "callout", label: "Why the cause can't be pinned down from this log", paras: ["Two explanations fit: a westerly wind (typical for Hyderabad in early September), or the flight controller's idea of \"level\" being off by 1–2° from true level. Because every hop faced the same way, both would produce the same result. The next test settles it: hover with the nose turned 90° or 180°. If the drift stays eastward over the ground, it was wind. If it follows the nose and stays back-left, it's the vehicle."] },
    { type: "section", title: "Attitude and stick inputs", paras: ["The stabilization loop worked. What it was asked to do was hold level, because the roll, pitch and yaw sticks never moved off centre during a hop."] },
    { type: "chart", title: "Roll and pitch, desired against actual", caption: "Desired angle (dashed) sits at 0° in flight; actual angle stays within a degree or two of it. Before each arm the log records the ground slope the drone was sitting on, 1.5–3° of roll, which is why the lines are offset while disarmed.", chart: t({
      y: { label: "Angle (°)", min: -8, max: 8 },
      series: [
        { src: "att", y: "r", label: "Roll", color: "s1" },
        { src: "att", y: "dr", label: "Desired roll", color: "s1", dash: true, width: 1 },
        { src: "att", y: "p", label: "Pitch", color: "s2" },
        { src: "att", y: "dp", label: "Desired pitch", color: "s2", dash: true, width: 1 },
      ] }) },
    { type: "chart", title: "Receiver inputs", caption: "Channels 1, 2 and 4 are flat at 1494 µs apart from the yaw-left disarm gestures. Throttle (channel 3) and the mode switch (channel 5) are the only controls that were used, as expected for a first throttle-only test.", chart: t({
      y: { label: "Pulse width (µs)", min: 950, max: 1550 },
      series: [
        { src: "rcin", y: "c1", label: "Ch1 roll", color: "s1", width: 2 },
        { src: "rcin", y: "c2", label: "Ch2 pitch", color: "s3", dash: true },
        { src: "rcin", y: "c3", label: "Ch3 throttle", color: "s2" },
        { src: "rcin", y: "c4", label: "Ch4 yaw", color: "s4", dash: true },
        { src: "rcin", y: "c5", label: "Ch5 mode", color: "s5" },
      ] }) },
    { type: "section", title: "Motor outputs", paras: ["Motor numbering follows ArduCopter's Quad X layout. The outputs aren't even: the two clockwise motors work consistently harder than the two counter-clockwise ones."] },
    { type: "chart", title: "Average PWM in hover, all hops", caption: "Seen from above, nose up.", chart: { kind: "quad" } },
    { type: "chart", title: "Where the extra effort goes", caption: "Sum of paired outputs. A large gap in one pair means the controller is constantly correcting on that axis.", chart: { kind: "pairs" } },
    { type: "chart", title: "Motor PWM during the longest hop", caption: "Hop at 186–196 s. Motor 4 (back right, CW) is on top almost throughout; motor 2 (back left, CCW) at the bottom.", chart: {
      kind: "time", x: { min: 186, max: 196.5 }, y: { label: "PWM (µs)" },
      series: [
        { src: "rcou", y: "m1", label: "M1", color: "s1", width: 1.8 },
        { src: "rcou", y: "m2", label: "M2", color: "s3", width: 1.8 },
        { src: "rcou", y: "m3", label: "M3", color: "s2", width: 1.8 },
        { src: "rcou", y: "m4", label: "M4", color: "s6", width: 1.8 },
      ] } },
    { type: "section", title: "Vibration", paras: ["Healthy while flying. Median vibration sits below 1 m/s² on every axis, well under ArduPilot's 30 m/s² concern level. Every spike and every clipping event lines up with a touchdown."] },
    { type: "chart", title: "Vibration and accelerometer clipping", caption: "Clipping means the accelerometer hit its measurement limit. The count rose from 0 to 57, in steps at each landing.", chart: t({
      y: { label: "Vibration (m/s²)" }, y2: { label: "Clip count", min: 0 },
      series: [
        { src: "vibe", y: "x", label: "X", color: "s1" },
        { src: "vibe", y: "y", label: "Y", color: "s3" },
        { src: "vibe", y: "z", label: "Z", color: "s4" },
        { src: "vibe", y: "clip", label: "Clipping (cumulative)", color: "warn", right: true, step: true, width: 2 },
      ] }) },
    { type: "section", title: "Power", paras: ["The flight controller's own 5 V supply was solid. The battery voltage reading is not trustworthy."] },
    { type: "chart", title: "Logged battery voltage against throttle", caption: "A real battery sags when throttle goes up. This reading does the opposite, rising about 0.5 V at every hop, and it also climbs across the session.", chart: t({
      y: { label: "Volts" }, y2: { min: 0, max: 0.6, label: "Throttle out" },
      series: [
        { src: "bat", y: "v", label: "Logged battery V", color: "s1", width: 1.8 },
        { src: "ctun", y: "tho", label: "Throttle out", color: "s2", right: true, width: 1 },
      ] }) },
    { type: "chart", title: "Board 5 V rail", caption: "4.79–4.97 V for the whole log, dipping only slightly under load. No brownout risk.", chart: t({
      y: { label: "Volts", min: 4.6, max: 5.1 }, series: [{ src: "powr", y: "vcc", label: "Board Vcc", color: "s3" }] }) },
    { type: "section", title: "GPS, EKF and compass", paras: ["The navigation side is in good shape, which matters because it means a position-holding mode like Loiter should work well on this airframe."] },
    { type: "chart", title: "Satellites and HDOP", caption: "10–16 satellites with a 3D or better fix throughout; HDOP 0.64–1.0.", chart: t({
      y: { label: "Satellites", min: 0, max: 18 }, y2: { label: "HDOP", min: 0, max: 2 },
      series: [
        { src: "gps", y: "ns", label: "Satellites", color: "s1", step: true, width: 2 },
        { src: "gps", y: "hd", label: "HDOP", color: "s2", right: true },
      ] }) },
    { type: "chart", title: "EKF innovation test ratios", caption: "How surprised the estimator is by each sensor. Values below 1 are fine; these average 0.01–0.1.", chart: t({
      y: { label: "Test ratio", min: 0, max: 1.2 },
      series: [
        { src: "nk4", y: "sv", label: "Velocity", color: "s1" },
        { src: "nk4", y: "sp", label: "Position", color: "s3" },
        { src: "nk4", y: "sh", label: "Height", color: "s4" },
        { src: "nk4", y: "sm", label: "Compass", color: "s2" },
      ] }) },
    { type: "chart", title: "Magnetic field strength, external against internal compass", caption: "The GPS-mounted external compass (the one in use) holds steady at about 396 with motors running. The internal one inside the Pixhawk swings between 449 and 545 with throttle, a sign it's picking up motor current.", chart: t({
      y: { label: "Field strength (mGauss)" },
      series: [
        { src: "mag", y: "f1", label: "External (primary)", color: "s1", width: 2 },
        { src: "mag", y: "f2", label: "Internal", color: "s2" },
      ] }) },
    { type: "section", title: "Telemetry radio and logging", paras: ["The drone was never more than about 15 m away, yet the radio link margin was thin."] },
    { type: "chart", title: "Telemetry radio signal against noise", caption: "Local RSSI stays only a few units above the noise floor. The remote side reported 0 for much of the session, and receive errors climbed from 52 to 211.", chart: t({
      y: { label: "SiK units" },
      series: [
        { src: "rad", y: "rssi", label: "Local RSSI", color: "s1", width: 2 },
        { src: "rad", y: "noise", label: "Local noise", color: "muted", dash: true },
        { src: "rad", y: "rrssi", label: "Remote RSSI", color: "s2" },
      ] }) },
    { type: "section", title: "Parameter snapshot", paras: ["Values as logged at boot. Highlighted ones come up in the issues below."] },
    { type: "chart", chart: { kind: "params" } },
    { type: "section", title: "What checked out" },
    { type: "checks", items: [
      { title: "Attitude control", body: "Actual roll and pitch tracked the desired angle to within about 1° on average." },
      { title: "Flight vibration", body: "Median below 1 m/s² on all axes while flying." },
      { title: "GPS", body: "Up to 16 satellites, HDOP under 1, no fix drops." },
      { title: "EKF health", body: "No failsafes or errors; innovation ratios stayed low." },
      { title: "External compass", body: "Steady field strength with motors running." },
      { title: "Board power", body: "5 V rail within 4.79–4.97 V." },
      { title: "Flight controller load", body: "No overruns of note; memory and loop timing normal." },
    ] },
    { type: "section", title: "Issues detected", paras: ["Ordered by how much each one matters before the next flight. The first is the drift you saw that day; the rest came out of the data."] },
    { type: "findings", items: [
      { tag: "watch", label: "Reported, cause open", title: "Drift back-left on every hop", body: ["All seven hops drifted back-left relative to the nose, 1.2 to 14 m per hop at up to 1.9 m/s. The frame stayed level and no correcting stick was given, so this is Stabilize doing exactly what Stabilize does. The push came from either wind or a 1–2° level bias, and this log can't tell which."], next: "Repeat a hover with the nose rotated 90° or 180° and see whether the drift turns with the drone. Before that, do a fresh accelerometer calibration on a truly level surface and check that the Pixhawk sits flat on its mount. Practice small right-stick corrections in Stabilize." },
      { tag: "issue", label: "High, safety", title: "Battery voltage reading is wrong", body: ["The logged voltage rises under load and rises across the session, both physically backwards. `BATT_VOLT_PIN` is 13 and `BATT_CURR_PIN` is 12, which are APM-style values; the standard power-module pins on a Pixhawk 1 / 2.4.8 are 2 (voltage) and 3 (current). `BATT_MONITOR` is 3, voltage only, so current and mAh aren't tracked either. The low-battery failsafe (10.8 V, RTL) is currently acting on a number that isn't the battery."], next: "Set the power module preset for Pixhawk (pins 2 and 3), set `BATT_MONITOR` to 4, then calibrate `BATT_VOLT_MULT` against a multimeter reading of the pack." },
      { tag: "fix", label: "Medium", title: "Constant yaw correction from the motors", body: ["The clockwise motors (3 and 4) average about 180 µs more combined than the counter-clockwise pair (1 and 2), in every hop. The frame keeps wanting to yaw, and the controller spends motor headroom holding it straight. The right side also works slightly harder than the left."], next: "Sight down each arm for twist, check each motor sits flat on its mount, confirm matching props on each diagonal, and check whether the battery sits off-centre to the right." },
      { tag: "fix", label: "Medium", title: "Hover throttle hasn't been learned", body: ["`MOT_THST_HOVER` is still at 0.35, but SkyTwo actually hovers at about 0.22–0.25 throttle. Learning is on, but it doesn't run in Stabilize, which is where nearly all of this flying happened. AltHold and Loiter use this value, so they'll behave off until it's right."], next: "Fly a couple of minutes in AltHold so it learns, or set it close to 0.25 by hand first." },
      { tag: "fix", label: "Medium", title: "Hard landings", body: ["All 57 accelerometer clipping events, and every vibration spike, happened at touchdown. Throttle was cut from 1–2 m, so the drone dropped rather than landed. That's hard on props, arms and the flight controller's mount, and it briefly throws off the altitude estimate."], next: "Descend on throttle until the legs touch, then cut. The Land mode on switch position 6 is another option." },
      { tag: "note", label: "Setup", title: "No position-hold mode on the switch", body: ["The six mode slots hold Stabilize four times, AltHold and Land. With GPS and EKF this healthy, Loiter would hold SkyTwo in place against wind and would be the quickest check that the airframe is basically sound."], next: "Put Loiter on one switch position once the hover throttle and compass are sorted." },
      { tag: "check", title: "Weak telemetry link at short range", body: ["Signal sat only a few units above noise within 15 m, the remote side often reported zero, and receive errors kept climbing. That points to an antenna problem more than distance."], next: "Check both radio antennas are fitted and tight, and that both radios share the same frequency settings and Net ID." },
      { tag: "note", label: "Minor", title: "Internal compass picks up motor interference", body: ["The internal compass field swings about 20% with throttle; the external one stays steady. The external one is primary, so this isn't hurting flight now."], next: "Consider setting `COMPASS_USE2` to 0 so only the clean external compass is used." },
      { tag: "check", title: "Only one accelerometer detected", body: ["`INS_ACC2_ID` is 0. A Pixhawk 2.4.8 normally reports two IMUs, so either this board has only one or the second isn't starting. It isn't linked to the drift, but it removes a backup sensor."], next: "Look at the sensor list on the ground station's status screen after the next boot." },
      { tag: "note", label: "Minor", title: "Dropped log data and old firmware", body: ["235 log messages were dropped during the session, which usually means a slow SD card. The firmware is ArduCopter 3.6.8 from 2019."], next: "Try a faster, freshly formatted SD card. A firmware update is worth planning once the airframe issues are solved, so you're not changing too many things at once." },
    ] },
  ],
  source: "Source: dataflash log 2025-09-05_17-09-44, ArduCopter V3.6.8 on Pixhawk (PX4v3), about 11½ minutes of data. Times on every chart are seconds since the flight controller booted.",
};

export default flight1;
