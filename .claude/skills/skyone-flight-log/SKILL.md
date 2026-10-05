---
name: skyone-flight-log
description: Add a new SkyOne test flight to the portfolio from its APM 2.8 / ArduCopter 3.2.1 dataflash log (.bin), optionally with an analysed HTML report. Use when the user shares a new SkyOne flight log, says "new SkyOne flight", "add SkyOne flight N", or wants a SkyOne log analysed for the SkyOne project page.
---

# Adding a new SkyOne test flight

SkyOne is the user's F450 quadcopter on an **APM 2.8 running ArduCopter 3.2.1**. It has no GPS, the barometer is faulty, and the drone was grounded as of Oct 2026.

Each test flight appears on `/projects/skyone` as a card. Flights with a log get two dialogs: **Detailed Log Analysis**, a full report rendered natively in the site's UI, and **Media**. Flights without a log get Media only.

This skill turns one `.bin` log into that card, its report and its chart data. If the user also has an analysed HTML report, port that report's content.

## What the user gives you

Ask for whatever is missing, in one question:

1. **The `.bin` log.** Read it from wherever it is, such as Downloads. Never copy it into the repo or commit it.
2. **An analysed HTML report**, if they have one. If they do, the report is the content source: port it, don't rewrite it.
3. **What they were testing and anything they noticed:** feel, sounds, crashes, hot motors, wind.
4. **Any repairs or parameter changes** since the last flight.
5. **Media** is optional; photos and video come later.

Never invent numbers. Every figure must come from the log, the extractor output, the HTML report, or the user.

## Where things live

| What | Path |
|---|---|
| Page (flight cards, configuration, results) | `src/app/projects/skyone/page.tsx` |
| Shared engine (also used by SkyTwo; keep changes backward-compatible) | `src/components/flight-analysis/`: `types.ts`, `charts.tsx`, `FlightAnalysisView.tsx`, `FlightReport.tsx` |
| SkyOne chart presets + fault legend | `src/app/projects/skyone/analysis/presets.ts` |
| One report per flight | `src/app/projects/skyone/analysis/flights/flight-<n>.ts` |
| Chart data per flight | `src/app/projects/skyone/analysis/data/flight-<n>.json` |
| Registry (register new flights here) | `src/app/projects/skyone/analysis/FlightAnalysisLoader.tsx` (`reports` and `data` maps) |
| Log extractor | `tools/skyone/extract_flight.py` |
| Templates | `flights/flight-7.ts` (RC faults, motors, vibration), `flight-5.ts` (no IMU/RCOU, take-off table) |

## Steps

### 1. Extract the data
```bash
pip install pymavlink numpy
python tools/skyone/extract_flight.py --flight <n> --bin "<path>.bin" [--shift s] [--tmax s] [--motor-window a b]
```
This writes the flight's JSON and prints a summary: armed and airborne windows, modes, mAh, Vcc, RC fault windows, ERR/EV events, peak accel X, max pitch and key parameters.

The APM only logs while armed, so each contiguous run of samples is one arm cycle. Take-offs run from EV 28 (not landed) to EV 17/18 (land complete) or the end of the cycle.

The three options:

| Option | Use it when | Example |
|---|---|---|
| `--shift` | A report counts time from when logging began rather than from boot | Flight 5 used `--shift 14.137`. Otherwise leave it at 0; times are seconds since boot. |
| `--tmax` | The log ends with a leftover fragment from an older session | Flight 7 used `--tmax 70` |
| `--motor-window a b` | A finding is about one motor saturating | Builds `motorMax`, `motorMean` and `motorQuad` (highlighted motor) |

RC fault classes, written to `data.faults` and drawn by `bands: "faults"`:

| Class | What it looks like |
|---|---|
| Throttle-low | CH3 ≈ 996 and CH5 ≈ 1495; the other sticks still live |
| Corrupted | CH1–CH4 identical |
| Frozen | Unchanging frames running into an ERR 2/2 |
| Placeholder A | 1500/1500/~1000/1500/1500 |
| Placeholder B | 1500/1500/1100/1500/1555 |

**Always check the summary** against the HTML report (or the user's account) before writing anything:
- take-off count
- mAh
- failsafe times
- fault windows

If the log has no IMU or RCOU (`LOG_BITMASK` 894), there's no vibration or motor data. Say so in the report; don't fake it.

### 2. Analyse the log
If there's no HTML report, work through the data yourself and compare with the previous flight:
- **RC input:** fault windows, failsafes (ERR 2/2, 5/1) and what mode they triggered. Remember `FS_THR_VALUE` 975: values above it are never a failsafe.
- **Barometer:** any mode except Stabilize (AltHold, Land, the Land failsafe) trusts the faulty barometer. Look at baro altitude vs the fused estimate and throttle out.
- **Motors** (if RCOU is logged): time at ≥ 2000 µs, mean per motor, and the offset from the mean (±25 µs is normal). Quad X layout: 1 FR CCW, 2 BL CCW, 3 FL CW, 4 BR CW.
- **Vibration** (if IMU is logged): accel X/Y within about ±3 m/s² is healthy, Z between −15 and −5. Use the vibration-vs-throttle scatter (`data.vib`).
- **Power:** current, mAh against the 2200 mAh pack, and board Vcc (brownouts).
- **Attitude:** desired vs actual, and which corner dropped (roll + pitch direction).

### 3. Write `analysis/flights/flight-<n>.ts`
Keep the `FlightAnalysis` structure the other SkyOne reports use:
- `meta`: date · "APM 2.8 · ArduCopter 3.2.1" · arm cycles or logged length.
- `headline`: one sentence of what happened. `summary`: one or two paragraphs, including a **Verdict**.
- `stats`: 4–6 tiles, taken from the report's own key-number strip where it has one.
- `hero`: the chart that tells the story, usually `throttle({ x: session })`.
- Blocks, in report order, using these block types:
  - `faultLegend([...])` from presets above any fault-shaded chart
  - per-session event `table`s
  - per-session charts using the presets `throttle`, `rcInputs`, `motors`, `attitude`, `vibration` and `battery`, each with `x: { min, max }` zoomed to one arm cycle
  - findings as `section`s with `prose`, `list`, `table`, `chart` and `callout`
  - `checks` for "What was healthy"
  - the action plan as `list`s
  - parameter table, method and glossary
- `source: SOURCE_32`.
- Text markup: `**bold**` and `` `PARAM_NAME` `` only.
- A new chart type goes into the shared engine as a reusable `SpecialChart` kind. Generic `scatter`, `bars`, `quad` (with `src`) and the `legend` block already exist.

### 4. Register it
In `FlightAnalysisLoader.tsx`:
- add `<n>: () => import("./flights/flight-<n>")` to `reports`
- add `<n>: () => import("./data/flight-<n>.json")` to `data`

### 5. Update the page (`page.tsx`)
- Add `<FlightCard flight={n} log title="Flight <n> — <d Mon yyyy>" badge=… badgeLabel=… rows={[…]} />` in the 2026 section, in date order.
  - Use the date only: the APM has no clock without GPS.
  - Leave out `log` if there's no log; the card then shows Media only.
  - Rows: Testing / What happened / Root cause (or Suspected cause) / Fix.
  - Badges: `done` + "Resolved" or "Passed"; `progress` + "Issue found" or "Root cause not confirmed"; `open` + "Unresolved".
- Add a "Timing & Conditions" bullet if this flight adds anything new.
- Update **Results & Status**: "What Works Now", "What Doesn't Work Yet" and "Measured Results".
- Update the Overview status line if SkyOne is no longer grounded.
- Update **Configuration & Calibration** if parameters changed.
- If an earlier open issue is now fixed by evidence in the log, update that card's badge, and say what proved it.

### 6. Verify
- `npx tsc --noEmit` passes clean.
- Preview `/projects/skyone`:
  - Open the new flight's dialog; every chart shows data and the fault bands line up with the event table.
  - Check both themes and phone width, with no console errors.
  - Also open one SkyTwo analysis if you touched the shared engine.
- Update `.claude/session-notes.md` (the SkyOne section: extractor flags used, checks done).
- Commit and push only when the user asks.

## Rules (settled with the user — don't relitigate)

- **No log numbers anywhere** (e.g. "log 94"); flights are numbered 1, 2, 3… by date.
  - Inside a report, separate take-offs are "Take-off 1/2/3" and arm cycles are "Session 1/2/3", never "Flight 1/2".
  - A bench test is "the <date> bench test".
- **Same content, site UI.** Port the HTML report's text faithfully, but:
  - Reword chat/doc asides neutrally ("An earlier guess…", "Changes from the Flight <n−1> analysis").
  - Drop browser-only features (saved checklist ticks, linked-cursor explorers).
  - No iframes or copied HTML.
- **Honesty:** keep SkyOne grounded until a log proves the fixes. Keep "not confirmed" and "unresolved" wording until the evidence changes. Say "estimated" for anything not measured. Don't chart numbers that you recomputed differently from the report; keep the report's in text instead.
- **Bullets:** diamonds for lists, spec-sheet rows for labelled points, bull's-eyes only in "What I Learned". Never "→" bullets.
- **Voice:** the analysis may address the pilot ("you"); page text is first person ("I").
- **Commits:** no AI attribution or Co-Authored-By lines. Never commit `.bin` logs.
