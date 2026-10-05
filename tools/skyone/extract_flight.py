"""Extract chart data for one SkyOne flight (APM 2.8, ArduCopter 3.2.1 dataflash .bin).

Writes src/app/projects/skyone/analysis/data/flight-<n>.json and prints a summary to check
against the written report.

    pip install pymavlink numpy
    python tools/skyone/extract_flight.py --flight 6 --bin path/to/log.bin

The APM only logs while armed, so the time axis has long gaps between arm cycles.
Times are seconds since the board powered up, as in the log.
"""

import argparse
import json
import os
import sys

import numpy as np
from pymavlink import mavutil

MODES = {0: "Stabilize", 2: "AltHold", 5: "Loiter", 6: "RTL", 9: "Land"}
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "src", "app", "projects", "skyone", "analysis", "data")


def r(x, nd=2):
    return None if x is None or (isinstance(x, float) and np.isnan(x)) else round(float(x), nd)


def read_log(path, shift=0.0):
    """Read every message. Untimed ones have no TimeMS: EV takes the next timed record's time
    (ARMED is written just before the first samples of an arm cycle); MODE and ERR take the
    last one, so an error at the end of a cycle stays in that cycle."""
    m = mavutil.mavlink_connection(path)
    rows = {k: [] for k in ["ATT", "CTUN", "RCIN", "RCOU", "IMU", "CURR", "BARO", "RAD"]}
    events, params, pending, t_last = [], {}, [], 0.0
    while True:
        msg = m.recv_match()
        if msg is None:
            break
        typ = msg.get_type()
        d = msg.to_dict()
        if "TimeMS" in d:
            d["TimeMS"] -= shift * 1000.0
            t_last = d["TimeMS"] / 1000.0
            events.extend((t_last, ty, dd) for ty, dd in pending)
            pending = []
        if typ in rows and "TimeMS" in d:
            rows[typ].append(d)
        elif typ == "EV":
            pending.append((typ, d))
        elif typ in ("MODE", "ERR"):
            events.append((t_last, typ, d))
        elif typ == "PARM":
            params[d["Name"]] = d["Value"]
    events.extend((t_last, ty, dd) for ty, dd in pending)
    return rows, events, params


def segments(att, gap=1.0):
    """Armed stretches: the APM only logs while armed, so each contiguous run of samples is one arm cycle."""
    t = [x["TimeMS"] / 1000.0 for x in att]
    out, a = [], t[0]
    for i in range(1, len(t)):
        if t[i] - t[i - 1] > gap:
            out.append([r(a), r(t[i - 1])])
            a = t[i]
    out.append([r(a), r(t[-1])])
    return out


def airborne_windows(events, armed):
    """EV 28 (not landed) up to the next EV 17/18 (land complete) or the end of that arm cycle."""
    out = []
    for t, typ, d in events:
        if typ != "EV" or d["Id"] != 28:
            continue
        seg_end = next((b for a, b in armed if a - 0.2 <= t <= b + 0.2), t)
        end = next((tt for tt, ty, dd in events if ty == "EV" and dd["Id"] in (17, 18) and t < tt <= seg_end), seg_end)
        out.append([r(t), r(end)])
    return out


def col(rows, key, scale=1.0):
    return [r(x[key] * scale) for x in rows]


def times(rows):
    return [r(x["TimeMS"] / 1000.0, 3) for x in rows]


def mode_windows(events, armed, t_end):
    """Mode bands, clipped to armed windows so disarmed gaps stay blank."""
    changes = [(t, MODES.get(d["Mode"], f"Mode {d['Mode']}")) for t, typ, d in events if typ == "MODE"]
    raw = []
    for i, (t, name) in enumerate(changes):
        nxt = changes[i + 1][0] if i + 1 < len(changes) else t_end
        raw.append((t, nxt, name))
    out = []
    for a, b, name in raw:
        for wa, wb in armed:
            lo, hi = max(a, wa), min(b, wb)
            if hi - lo > 0.05:
                out.append([r(lo), r(hi), name])
    return out


def near(v, target, tol):
    return abs(v - target) <= tol


def classify_rc(rc, late_times):
    """Label each RCIN frame (10 Hz) with the fault patterns described in the reports.

    placeholderB  1500/1500/1100/1500/1555: values no transmitter switch position produces
    placeholderA  sticks centred, throttle ~1000, mode ~1500: whole input replaced
    throttleLow   only CH3 ~996 and CH5 ~1495 snap to fixed values; other sticks still live
    corrupted     CH1-CH4 all read one identical number (or CH3/CH4 at 1104/1108 together)
    frozen        an unchanging frame that runs into an APM late-frame error (ERR 2/2)
    """
    labels = []
    for x in rc:
        c = [x["C1"], x["C2"], x["C3"], x["C4"], x["C5"]]
        centred = all(near(v, 1500, 3) for v in (c[0], c[1], c[3]))
        if centred and near(c[2], 1100, 1) and near(c[4], 1555, 1):
            lab = "placeholderB"
        elif centred and 995 <= c[2] <= 1000 and near(c[4], 1500, 3):
            lab = "placeholderA"
        elif 994 <= c[2] <= 998 and 1490 <= c[4] <= 1500:
            lab = "throttleLow"
        elif c[0] == c[1] == c[2] == c[3] or (c[2] == 1104 and c[3] == 1108):
            lab = "corrupted"
        else:
            lab = None
        labels.append(lab)
    key = lambda x: tuple(x[k] for k in ("C1", "C2", "C3", "C4", "C5"))
    for te in late_times:
        # last frame at or before the error, then walk back over identical frames
        idx = max((i for i, x in enumerate(rc) if x["TimeMS"] / 1000.0 <= te + 0.05), default=None)
        if idx is None or labels[idx] is not None:
            continue
        i = idx
        while i > 0 and key(rc[i - 1]) == key(rc[idx]) and labels[i - 1] is None:
            i -= 1
        j = idx
        while j + 1 < len(rc) and key(rc[j + 1]) == key(rc[idx]) and rc[j + 1]["TimeMS"] - rc[j]["TimeMS"] < 300:
            j += 1
        for k in range(i, j + 1):
            labels[k] = "frozen"
    return labels


def label_windows(rc, labels):
    out, i = [], 0
    while i < len(rc):
        if labels[i] is None:
            i += 1
            continue
        j = i
        while j + 1 < len(rc) and labels[j + 1] == labels[i] and rc[j + 1]["TimeMS"] - rc[j]["TimeMS"] < 300:
            j += 1
        out.append([r(rc[i]["TimeMS"] / 1000.0), r(rc[j]["TimeMS"] / 1000.0 + 0.1), labels[i]])
        i = j + 1
    return out


def vib_windows(imu, ctun, sessions, win=0.4):
    """Std-dev of accel X per 0.4 s window vs mean throttle out (%) in that window."""
    t_imu = np.array([x["TimeMS"] / 1000.0 for x in imu])
    ax = np.array([x["AccX"] for x in imu])
    t_ct = np.array([x["TimeMS"] / 1000.0 for x in ctun])
    thr = np.array([x["ThrOut"] / 10.0 for x in ctun])
    out = {}
    for k, (a, b) in enumerate(sessions, 1):
        pts, t = [], a
        while t + win <= b:
            m_i = (t_imu >= t) & (t_imu < t + win)
            m_c = (t_ct >= t) & (t_ct < t + win)
            if m_i.sum() >= 10 and m_c.sum() >= 2 and thr[m_c].mean() > 2:
                pts.append({"x": r(thr[m_c].mean(), 1), "y": r(ax[m_i].std(), 2)})
            t += win
        out[f"s{k}"] = pts
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--flight", type=int, required=True)
    ap.add_argument("--bin", required=True)
    ap.add_argument("--shift", type=float, default=0.0, help="seconds to subtract from every timestamp")
    ap.add_argument("--motor-window", type=float, nargs=2, default=None, help="window for time-at-max / mean motor output")
    ap.add_argument("--tmax", type=float, default=None, help="drop everything after this time (leftover fragments)")
    a = ap.parse_args()

    rows, events, params = read_log(a.bin, a.shift)
    if a.tmax is not None:
        rows = {k: [x for x in v if x["TimeMS"] / 1000.0 <= a.tmax] for k, v in rows.items()}
        events = [e for e in events if e[0] <= a.tmax]
    att, ctun, rc, rcou, imu, curr, baro, rad = (rows[k] for k in ["ATT", "CTUN", "RCIN", "RCOU", "IMU", "CURR", "BARO", "RAD"])
    t_end = att[-1]["TimeMS"] / 1000.0

    armed = segments(att)
    airborne = airborne_windows(events, armed)
    modes = mode_windows(events, armed, t_end)

    series = {
        "att": {"t": times(att), "dr": col(att, "DesRoll"), "r": col(att, "Roll"), "dp": col(att, "DesPitch"),
                "p": col(att, "Pitch"), "dy": col(att, "DesYaw"), "y": col(att, "Yaw")},
        "thr": {"t": times(ctun), "tin": col(ctun, "ThrIn", 0.1), "tout": col(ctun, "ThrOut", 0.1),
                "alt": col(ctun, "Alt"), "dalt": col(ctun, "DAlt"), "balt": col(ctun, "BarAlt"), "crt": col(ctun, "CRt", 0.01)},
        "rc": {"t": times(rc), **{f"c{k}": col(rc, f"C{k}") for k in range(1, 6)}},
        "bat": {"t": times(curr), "v": col(curr, "Volt", 0.01), "i": col(curr, "Curr", 0.01),
                "vcc": col(curr, "Vcc", 0.001), "mah": col(curr, "CurrTot", 1.0)},
    }
    if rcou:
        series["mot"] = {"t": times(rcou), **{f"m{k}": col(rcou, f"Chan{k}") for k in range(1, 5)}}
    if imu:
        series["imu"] = {"t": times(imu), "ax": col(imu, "AccX"), "ay": col(imu, "AccY"), "az": col(imu, "AccZ"),
                         "gx": [r(np.degrees(x["GyrX"]), 1) for x in imu]}
    if baro:
        series["baro"] = {"t": times(baro), "alt": col(baro, "Alt"), "press": col(baro, "Press", 0.01)}
    if rad:
        series["rad"] = {"t": times(rad), "rssi": col(rad, "RSSI"), "remrssi": col(rad, "RemRSSI"),
                         "noise": col(rad, "Noise"), "remnoise": col(rad, "RemNoise")}

    data = {"series": series, "modes": modes, "armed": armed, "airborne": airborne, "cycles": airborne}

    late = [t for t, typ, d in events if typ == "ERR" and d["Subsys"] == 2 and d["ECode"] == 2]
    labels = classify_rc(rc, late)
    faults = label_windows(rc, labels)
    data["faults"] = faults

    if imu:
        data["vib"] = vib_windows(imu, ctun, armed)

    if rcou:
        m = np.array([[x[f"Chan{k}"] for k in range(1, 5)] for x in rcou], dtype=float)
        t_ou = np.array([x["TimeMS"] / 1000.0 for x in rcou])
        bad = np.zeros(len(t_ou), bool)
        for fa, fb, _ in faults:
            bad |= (t_ou >= fa - 0.1) & (t_ou <= fb + 0.3)
        clean = (m.min(axis=1) > 1150) & ~bad
        off = (m[clean] - m[clean].mean(axis=1, keepdims=True)).mean(axis=0) if clean.any() else np.zeros(4)
        names = ["M1 FR", "M2 BL", "M3 FL", "M4 BR"]
        data["motorOffset"] = [{"k": names[k], "v": r(off[k], 1)} for k in range(4)]
        data["motorPeak"] = {"values": [int(m[:, k].max()) for k in range(4)]}

    # Average lean asked for vs flown while airborne in Stabilize (the steady-drift check).
    stab = [(x0, x1) for x0, x1, name in modes if name == "Stabilize"]
    sel = [x for x in att if any(a0 <= x["TimeMS"] / 1000.0 <= a1 for a0, a1 in airborne)
           and any(s0 <= x["TimeMS"] / 1000.0 <= s1 for s0, s1 in stab)]
    if sel:
        avg = lambda k: float(np.mean([x[k] for x in sel]))
        data["drift"] = [{"k": "Roll asked", "v": r(avg("DesRoll"), 2)}, {"k": "Roll flown", "v": r(avg("Roll"), 2)},
                         {"k": "Pitch asked", "v": r(avg("DesPitch"), 2)}, {"k": "Pitch flown", "v": r(avg("Pitch"), 2)}]
        print(f"drift: {len(sel) / 10:.0f} s airborne Stabilize ->", data["drift"])

    if rcou and a.motor_window:
        w0, w1 = a.motor_window
        sel = [x for x in rcou if w0 <= x["TimeMS"] / 1000.0 <= w1]
        names = ["M1 FR", "M2 BL", "M3 FL", "M4 BR"]
        at_max = [sum(0.1 for x in sel if x[f"Chan{k}"] >= 2000) for k in range(1, 5)]
        mean = [float(np.mean([x[f"Chan{k}"] for x in sel])) for k in range(1, 5)]
        top = int(np.argmax(at_max))
        data["motorMax"] = [{"k": names[k], "v": r(at_max[k], 1), "hi": k == top} for k in range(4)]
        data["motorMean"] = [{"k": names[k], "v": r(mean[k], 0), "hi": k == top} for k in range(4)]
        data["motorQuad"] = {"values": [int(round(v)) for v in mean], "highlight": top + 1}
        print("motor window", a.motor_window, "s at max:", data["motorMax"], "mean:", data["motorMean"])

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f"flight-{a.flight}.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"))

    # ---- summary ----
    print(f"wrote {out} ({os.path.getsize(out) // 1024} KB)")
    print("armed:", armed)
    print("airborne:", airborne, "count", len(airborne))
    print("modes:", modes)
    print("mAh used:", r(curr[-1]["CurrTot"], 0), " V min:", min(x["Volt"] for x in curr) / 100, " I max:", max(x["Curr"] for x in curr) / 100,
          " Vcc:", min(x["Vcc"] for x in curr) / 1000, "-", max(x["Vcc"] for x in curr) / 1000)
    print("faults:", faults)
    print("errors:", [(r(t), d["Subsys"], d["ECode"]) for t, typ, d in events if typ == "ERR"])
    print("events:", [(r(t), d["Id"]) for t, typ, d in events if typ == "EV"])
    if imu:
        print("accX peak:", r(max(abs(x["AccX"]) for x in imu)))
    pk = max(att, key=lambda x: abs(x["Pitch"]))
    print("max |pitch|:", pk["Pitch"], "at", pk["TimeMS"] / 1000)
    print("params:", {k: params.get(k) for k in ["LOG_BITMASK", "FS_THR_ENABLE", "FS_THR_VALUE", "THR_MID", "BATT_VOLT_PIN", "BATT_CURR_PIN", "MOT_TCRV_ENABLE", "ARMING_CHECK"]})


if __name__ == "__main__":
    sys.exit(main())
