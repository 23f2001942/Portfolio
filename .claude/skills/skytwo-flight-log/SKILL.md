---
name: skytwo-flight-log
description: Add a new SkyTwo test flight to the portfolio from its ArduPilot dataflash log (.bin). Use when the user shares a new SkyTwo flight log, says "new flight", "add flight N", or wants a flight's log analysed for the SkyTwo project page.
---

# Adding a new SkyTwo test flight

SkyTwo is the user's Pixhawk 2.4.8 F450 quadcopter (ArduCopter 4.6.3). Each test flight
appears on `/projects/skytwo` as a card with two dialogs: **Detailed Log Analysis**
(a full report rendered natively in the site's UI) and **Media**. This skill turns one
`.bin` log into that card, its report and its chart data.

## What the user gives you

Ask for whatever is missing, in one question:

1. The `.bin` log. Put it in `public/skytwo/logs/` while working. It is **never committed**; delete it before committing.
2. What they were testing and anything they noticed (feel, sounds, crashes, wind).
3. Any parameter changes since the last flight, and the charger's mAh put back after the previous flight, if they have it.
4. Media is optional: photos/videos come later.

Never invent numbers. Every figure in the report must come from the log, the extractor output, or the user.

## Where things live

| What | Path |
|---|---|
| Page (flight cards, config, results) | `src/app/projects/skytwo/page.tsx` |
| Report schema (shared with SkyOne) | `src/components/flight-analysis/types.ts` |
| Shared chart presets and sections | `src/app/projects/skytwo/analysis/presets.ts` |
| One report per flight | `src/app/projects/skytwo/analysis/flights/flight-<n>.ts` |
| Chart data per flight | `src/app/projects/skytwo/analysis/data/flight-<n>.json` |
| Lazy loaders (register new flights here) | `analysis/FlightAnalysisLoader.tsx` (`reports` and `data` maps) |
| Shared renderer, charts, satellite map | `src/components/flight-analysis/` (`FlightAnalysisView.tsx`, `FlightReport.tsx`, `charts.tsx`, `TrackMap.tsx`; used by SkyOne too, so keep changes backward-compatible) |
| Log extractor | `tools/skytwo/extract_flight.py` |
| Best template to copy | `analysis/flights/flight-12.ts` (newest 4.6.3 format) |

## Steps

### 1. Extract the data
```bash
pip install pymavlink numpy
python tools/skytwo/extract_flight.py --flight <n> --bin public/skytwo/logs/<file>.bin
```
- This writes `analysis/data/flight-<n>.json` and prints a summary:
  - take-off windows and per-take-off stats
  - mode changes with reasons
  - every MSG line
  - key parameters
- Take-offs are found from log events (EV 28 not-landed → EV 18 land-complete). If a window looks wrong, check against altitude and fix it by hand in the JSON `airborne` field.
- The fence radius comes from `FENCE_RADIUS` when the circle fence is on; override it with `--fence`.
- The gyro spectrum uses take-off 1 by default. Pick the steadiest hover with `--spectrum-takeoff <k>`. A post-filter line appears only if `INS_LOG_BAT_OPT` = 4.
- First use of this script on a new log: sanity-check the summary against the charts (max altitude, distance, mAh). It was written from the Flight 4–12 extractor but not yet run as this exact file.

### 2. Analyse the log
Work through the data and the MSG list. Check these, and compare with the previous flight:
- **Modes and events:** take-off and landing mode; touchdown descent rate (> 1.5 m/s is firm, > 3 m/s is hard); failsafes (radio, battery, fence, EKF); RTL behaviour; disarm method.
- **AutoTune:** start and end times, Success or "Failed to level", and whether the gains were saved. They only save if the drone lands and disarms in AutoTune.
- **Battery:** mAh used against the 4200 mAh-used RTL failsafe (`BATT_LOW_MAH` 2000 remaining); min raw vs sag-compensated volts; pack resistance; current calibration (`BATT_AMP_PERVLT` 24.5, checked against the charger).
- **Control:** roll and pitch error RMS and peak, motors near 1949–2000 µs (saturation), CW−CCW split (about 25–38 µs has been normal; watch the trend).
- **Vibration:** X/Y/Z medians (good under 15 m/s², limit 30) and clips; the 80 Hz notch should still remove the roll peak.
- **Navigation:** sats and HDOP, EKF innovations (healthy under 1.0), compass field spread, GPS lock before take-off.
- **Telemetry:** whether the uplink (packets from the laptop) kept working; this is a long-running open issue.

### 3. Write `analysis/flights/flight-<n>.ts`
Copy `flight-12.ts` and keep the same structure so every report looks identical:
- `meta`: date, time and IST from the log filename; "Pixhawk 2.4.8 · ArduCopter 4.6.3"; logged length.
- `headline`: one sentence of what happened. `summary`: one paragraph.
- `stats`: 8 tiles in this order:
  1. take-offs · air time
  2. max altitude
  3. max distance
  4. energy used (with %)
  5. battery start → lowest
  6. GPS sats / worst HDOP
  7. hover throttle (saved)
  8. accelerometer clips
- Blocks, in this order:
  1. `Take-off by take-off` table: `FULL_HEADERS` + `TABLE_NOTE_FULL` from presets.
  2. `Findings` with tags `healthy | watch | note | fix | issue | check`. Problems go first; "Healthy: …" roll-ups go last.
  3. `What changed since Flight <n-1>` table, if anything changed.
  4. `Next session` callout.
  5. `...chartsSection({...})` with one caption per chart.
- Text markup: `**bold**` and `` `PARAM_NAME` `` only.

### 4. Register it
- `FlightAnalysisLoader.tsx`: add `<n>: () => import("./flights/flight-<n>")` to `reports` and `<n>: () => import("./data/flight-<n>.json")` to `data`.

### 5. Update the page (`page.tsx`)
- Add a `<FlightCard flight={n} title="Flight <n> — <d Mon yyyy>, <HH:MM>" badge=… badgeLabel=…>` under "2026: Upgrade & Flight Testing". Its rows are Testing / What happened / Root cause / Fix, as relevant.
  - Badges: `done` + "Passed" or "Resolved"; `progress` + "Issue found" or "Passed, habit to fix"; `open` + "Unresolved".
- Add a "Timing & Conditions" bullet for the date, if new.
- Update **Results & Status**:
  - "What Works Now"
  - "Still To Do"
  - the "Measured Results" table (longest flight, highest altitude, furthest distance, top speed), but only when a record is beaten
- Update **Configuration** if parameters changed.

### 6. Verify
- `npx tsc --noEmit` passes clean.
- Preview `/projects/skytwo`:
  - Open the new flight's dialog. Every chart shows data, and the satellite map shows the trace at the BITS New Football Ground.
  - Check both themes and phone width, with no console errors.
- Delete `public/skytwo/logs/`, then commit and push only when the user asks.

## Rules (settled with the user — don't relitigate)

- **No log numbers anywhere.** Flights are numbered 1, 2, 3… by date. Inside a report, separate take-offs are "Take-off 1/2/3", never "Flight 1/2", to avoid clashing with page numbering.
- **Same content, site UI.** No iframes, no copied HTML, no new one-off layouts. If a new chart type is really needed, add it as a `SpecialChart` kind in `src/components/flight-analysis/types.ts` + `charts.tsx` so it stays reusable (generic `scatter` and `bars` kinds already exist).
- **Bullets:** diamonds for lists, spec-sheet rows for labelled points, bull's-eyes only in "What I Learned". Never "→" bullets.
- **Honesty:** say "estimated" for anything not measured, and keep open issues (for example telemetry dropouts) visible until the log shows they're fixed.
- **Commits:** no AI attribution or Co-Authored-By lines. Never commit `.bin` logs.
- Report voice: the analysis may address the pilot ("you"). Page text is first person ("I").
