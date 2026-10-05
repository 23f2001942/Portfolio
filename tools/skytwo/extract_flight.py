"""Turn one SkyTwo dataflash log (.bin) into chart data for the portfolio, and print
the numbers needed to write that flight's analysis report.

Usage (from the repo root):
    pip install pymavlink numpy
    python tools/skytwo/extract_flight.py --flight 13 --bin path/to/log.bin
    python tools/skytwo/extract_flight.py --flight 13 --bin log.bin --spectrum-takeoff 2

Writes src/app/projects/skytwo/analysis/data/flight-<n>.json and prints a summary
(take-off windows, per-take-off stats, mode changes, messages, key parameters).

Works for ArduCopter 4.x logs (4.6.3 at the time of writing). Older 3.6.x logs lack
some fields (ATT.DesRoll naming, ISBH, ARM) and need manual handling.
"""
import argparse, json, math, os
import numpy as np
from pymavlink import mavutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "src", "app", "projects", "skytwo", "analysis", "data")

MODE_NAMES = {0: "Stabilize", 2: "AltHold", 3: "Auto", 4: "Guided", 5: "Loiter", 6: "RTL",
              9: "Land", 15: "AutoTune", 16: "PosHold", 17: "Brake", 21: "SmartRTL"}
# ArduCopter EV ids used to find take-offs and landings.
EV_NOT_LANDED, EV_LAND_COMPLETE = 28, 18
KEY_PARAMS = ["MOT_THST_HOVER", "MOT_HOVER_LEARN", "FENCE_ENABLE", "FENCE_TYPE", "FENCE_RADIUS", "FENCE_ALT_MAX",
              "BATT_LOW_MAH", "BATT_CRT_MAH", "BATT_AMP_PERVLT", "BATT_VOLT_MULT", "BATT_FS_VOLTSRC", "BATT_ARM_VOLT",
              "RC6_OPTION", "RC7_OPTION", "AUTOTUNE_AXES", "INS_HNTCH_ENABLE", "INS_HNTCH_FREQ", "INS_LOG_BAT_OPT",
              "ATC_RAT_RLL_P", "ATC_RAT_RLL_I", "ATC_RAT_RLL_D", "ATC_ANG_RLL_P", "ATC_RAT_PIT_P", "ATC_RAT_PIT_I",
              "ATC_RAT_PIT_D", "ATC_ANG_PIT_P", "ATC_RAT_YAW_P", "ATC_RAT_YAW_I", "ATC_ANG_YAW_P", "RTL_ALT", "PILOT_SPEED_DN"]


def r(v, d=2):
    return None if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))) else round(float(v), d)


def binned(t, cols, step, how="mean"):
    """Average (or max) samples into fixed time bins."""
    t = np.asarray(t)
    out = {"t": [], **{k: [] for k in cols}}
    if len(t) == 0:
        return out
    idx = np.digitize(t, np.arange(math.floor(t[0]), t[-1] + step, step))
    for b in np.unique(idx):
        m = idx == b
        out["t"].append(round(float(t[m].mean()), 2))
        for k, v in cols.items():
            a = np.asarray(v, dtype=float)[m]
            a = a[~np.isnan(a)]
            out[k].append(None if len(a) == 0 else r(a.max() if how == "max" else a.mean(), 3))
    return out


def decimate(t, cols, every):
    return {"t": [round(float(x), 1) for x in t[::every]], **{k: [r(x, 1) for x in v[::every]] for k, v in cols.items()}}


def read_log(path):
    m = mavutil.mavlink_connection(path)
    S = {k: [] for k in ("CTUN", "BAT", "RCOU", "ATT", "VIBE", "GPS", "POS")}
    modes, arm, ev, msgs, params, isbh, isbd = [], [], [], [], {}, {}, []
    while True:
        x = m.recv_match(type=list(S) + ["MODE", "ARM", "EV", "MSG", "PARM", "ISBH", "ISBD"])
        if x is None:
            break
        k = x.get_type()
        if k == "PARM":
            params[x.Name] = x.Value
            continue
        t = x.TimeUS / 1e6
        if k == "CTUN":
            S[k].append((t, x.Alt, x.DAlt, x.ThO, x.CRt / 100 if abs(x.CRt) > 50 else x.CRt))
        elif k == "BAT":
            S[k].append((t, x.Volt, x.VoltR, x.Curr, x.CurrTot))
        elif k == "RCOU":
            S[k].append((t, x.C1, x.C2, x.C3, x.C4))
        elif k == "ATT":
            S[k].append((t, x.DesRoll, x.Roll, x.DesPitch, x.Pitch))
        elif k == "VIBE" and getattr(x, "IMU", 0) == 0:
            S[k].append((t, x.VibeX, x.VibeY, x.VibeZ, getattr(x, "Clip", getattr(x, "Clip0", 0))))
        elif k == "GPS" and getattr(x, "I", 0) == 0:
            S[k].append((t, x.NSats, x.HDop))
        elif k == "POS":
            S[k].append((t, x.Lat, x.Lng, x.RelHomeAlt))
        elif k == "MODE":
            modes.append((t, MODE_NAMES.get(x.ModeNum, str(x.ModeNum)), getattr(x, "Rsn", None)))
        elif k == "ARM":
            arm.append((t, x.ArmState))
        elif k == "EV":
            ev.append((t, x.Id))
        elif k == "MSG":
            msgs.append((t, x.Message))
        elif k == "ISBH":
            isbh[x.N] = (x.type, x.instance, x.mul, x.smp_rate, t)
        elif k == "ISBD":
            isbd.append((x.N, x.seqno, x.x, x.y))
    return {k: np.array(v, dtype=float) for k, v in S.items()}, modes, arm, ev, msgs, params, isbh, isbd


def find_airborne(ev, end):
    """Take-off (EV 28, not landed) to touchdown (EV 18, land complete) windows."""
    wins, start = [], None
    for t, i in ev:
        if i == EV_NOT_LANDED and start is None:
            start = t
        elif i == EV_LAND_COMPLETE and start is not None:
            wins.append((start, t)); start = None
    if start is not None:
        wins.append((start, end))  # log ended in the air (e.g. power lost at impact)
    return [(round(a, 1), round(b, 1)) for a, b in wins]


def spectrum(isbh, isbd, window):
    w0, w1 = window
    batches = {}
    for N, seq, gx, gy in isbd:
        batches.setdefault(N, []).append((seq, gx, gy))
    acc = {}
    for N, rows in batches.items():
        if N not in isbh:
            continue
        typ, inst, mul, rate, t = isbh[N]
        if typ != 1 or not (w0 + 5 <= t <= w1 - 5):   # type 1 = gyro; skip take-off/landing edges
            continue
        rows.sort()
        gx = np.concatenate([np.asarray(rw[1]) for rw in rows]) / mul
        gy = np.concatenate([np.asarray(rw[2]) for rw in rows]) / mul
        if len(gx) < 512:
            continue
        win = np.hanning(len(gx))
        a = acc.setdefault(inst, {"f": np.fft.rfftfreq(len(gx), 1.0 / rate), "x": [], "y": []})
        a["x"].append(np.abs(np.fft.rfft((gx - gx.mean()) * win)) / len(gx))
        a["y"].append(np.abs(np.fft.rfft((gy - gy.mean()) * win)) / len(gy))
    if 0 not in acc:
        return None
    freqs = acc[0]["f"]; keep = freqs <= 400
    avg = lambda inst, ax: [r(x, 4) for x in binned(freqs[keep], {"v": np.mean(acc[inst][ax], axis=0)[keep] * 57.2958}, 2.0)["v"]]
    spec = {"f": binned(freqs[keep], {"v": freqs[keep]}, 2.0)["t"], "roll_pre": avg(0, "x"), "pitch_pre": avg(0, "y")}
    if 1 in acc:   # instance 1 = post-filter (INS_LOG_BAT_OPT 4)
        spec["roll_post"] = avg(1, "x")
    return spec


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--flight", type=int, required=True)
    ap.add_argument("--bin", required=True)
    ap.add_argument("--spectrum-takeoff", type=int, default=1, help="which take-off (1-based) the gyro spectrum uses")
    ap.add_argument("--fence", type=float, help="override the fence radius drawn on the map (m)")
    a = ap.parse_args()

    A, modes, arm, ev, msgs, P, isbh, isbd = read_log(a.bin)
    end = float(A["CTUN"][-1, 0])
    out = {"series": {}}
    c, b, o, at, v, g, p = (A[k] for k in ("CTUN", "BAT", "RCOU", "ATT", "VIBE", "GPS", "POS"))
    out["series"]["alt"] = binned(c[:, 0], {"alt": c[:, 1], "dalt": c[:, 2]}, 0.5)
    out["series"]["bat"] = binned(b[:, 0], {"v": b[:, 1], "vr": b[:, 2], "i": b[:, 3]}, 0.5)
    out["series"]["mot"] = binned(o[:, 0], {f"m{i}": o[:, i] for i in range(1, 5)}, 1.0)
    out["series"]["att"] = decimate(at[:, 0], {"dr": at[:, 1], "r": at[:, 2], "dp": at[:, 3], "p": at[:, 4]}, 3)
    out["series"]["vibe"] = binned(v[:, 0], {"x": v[:, 1], "y": v[:, 2], "z": v[:, 3]}, 0.5, how="max")
    out["series"]["gps"] = binned(g[:, 0], {"ns": g[:, 1], "hd": g[:, 2]}, 1.0)

    mi = [[r(t0, 1), r(modes[i + 1][0] if i + 1 < len(modes) else end, 1), nm] for i, (t0, nm, _) in enumerate(modes)]
    out["modes"] = mi
    armed, s = [], (float(c[0, 0]) if arm and not arm[0][1] else None)   # logging starts at arming
    for t0, st in arm:
        if st and s is None: s = t0
        elif not st and s is not None: armed.append([r(s, 1), r(t0, 1)]); s = None
    if s is not None: armed.append([r(s, 1), r(end, 1)])
    out["armed"] = armed
    air = find_airborne(ev, end)
    out["airborne"] = [list(w) for w in air]

    # GPS track in lat/lng, split by mode. Home = position at first arm.
    j = int(np.searchsorted(p[:, 0], armed[0][0] if armed else p[0, 0]))
    hl, hg = p[min(j, len(p) - 1), 1], p[min(j, len(p) - 1), 2]
    mode_at = lambda t: next((nm for t0, t1, nm in reversed(mi) if t0 <= t), mi[0][2] if mi else "Stabilize")
    segs, takeoff, touchdown = [], [], []
    for w0, w1 in air:
        sel = np.where((p[:, 0] >= w0) & (p[:, 0] <= w1))[0][::2]
        if len(sel) == 0: continue
        takeoff.append([r(p[sel[0], 1], 6), r(p[sel[0], 2], 6)]); touchdown.append([r(p[sel[-1], 1], 6), r(p[sel[-1], 2], 6)])
        cur, pts = None, []
        for k in sel:
            md = mode_at(p[k, 0])
            if md != cur and pts: segs.append({"mode": cur, "pts": pts}); pts = [pts[-1]]
            cur = md; pts.append([r(p[k, 1], 6), r(p[k, 2], 6)])
        if pts: segs.append({"mode": cur, "pts": pts})
    track = {"home": [r(hl, 6), r(hg, 6)], "segs": segs, "takeoff": takeoff, "touchdown": touchdown}
    fence = a.fence or (P.get("FENCE_RADIUS") if P.get("FENCE_ENABLE") and int(P.get("FENCE_TYPE", 0)) & 2 else None)
    if fence: track["fence"] = r(fence, 0)
    out["track"] = track

    if isbh and air:
        sp = spectrum(isbh, isbd, air[min(a.spectrum_takeoff, len(air)) - 1])
        if sp: out["spectrum"] = sp

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"flight-{a.flight}.json")
    json.dump(out, open(path, "w"), separators=(",", ":"))

    # ---------- summary for writing the report ----------
    mlat, mlng = 110574.0, 111320.0 * math.cos(math.radians(hl))
    dist = np.hypot((p[:, 1] - hl) * mlat, (p[:, 2] - hg) * mlng)
    print(f"\nWrote {os.path.relpath(path, ROOT)} ({os.path.getsize(path) // 1024} KB)")
    print(f"Log length {end:.0f} s | home {hl:.6f}, {hg:.6f} | fence {fence} | spectrum {'spectrum' in out} "
          f"({'pre+post' if 'spectrum' in out and 'roll_post' in out['spectrum'] else 'pre only'})")
    print("\nTake-off | Airborne | Time | Max alt | Max dist | mAh | Curr mean/max | Min V raw/comp | Motors M1-M4 | CW-CCW | Vibe X/Y/Z med | Clips | Sats/HDOP | Touchdown")
    for i, (w0, w1) in enumerate(air, 1):
        sl = lambda X: X[(X[:, 0] >= w0) & (X[:, 0] <= w1)]
        cc, bb, oo, vv, gg, pp = sl(c), sl(b), sl(o), sl(v), sl(g), (p[:, 0] >= w0) & (p[:, 0] <= w1)
        mot = oo[:, 1:5].mean(0) if len(oo) else [0] * 4
        td = cc[cc[:, 0] >= w1 - 3][:, 4] if len(cc) else []
        clips = (vv[-1, 4] - vv[0, 4]) if len(vv) else 0
        print(f"{i} | {w0:.0f}-{w1:.0f} s | {int((w1 - w0) // 60)}:{int((w1 - w0) % 60):02d} | {cc[:, 1].max():.1f} m | {dist[pp].max():.1f} m | "
              f"{(bb[-1, 4] - bb[0, 4]):.0f} | {bb[:, 3].mean():.1f}/{bb[:, 3].max():.1f} A | {bb[:, 1].min():.2f}/{bb[:, 2].min():.2f} V | "
              f"{' '.join(f'{x:.0f}' for x in mot)} | {(mot[2] + mot[3] - mot[0] - mot[1]) / 2:+.0f} | "
              f"{np.median(vv[:, 1]):.1f}/{np.median(vv[:, 2]):.1f}/{np.median(vv[:, 3]):.1f} | {clips:.0f} | "
              f"{gg[:, 1].min():.0f}-{gg[:, 1].max():.0f}/{gg[:, 2].max():.2f} | {(-min(td) if len(td) else 0):.2f} m/s")
    print(f"\nTotal mAh logged: {b[-1, 4]:.0f} | battery start {b[0, 1]:.2f} V, lowest raw {b[:, 1].min():.2f} V")
    print("\nMode changes:"); [print(f"  {t:8.1f} s  {nm}  (reason {rsn})") for t, nm, rsn in modes]
    print("\nMessages:"); [print(f"  {t:8.1f} s  {msg}") for t, msg in msgs]
    print("\nKey parameters:"); [print(f"  {k} = {P[k]:g}") for k in KEY_PARAMS if k in P]


if __name__ == "__main__":
    main()
