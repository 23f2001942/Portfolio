# Portfolio Session Notes
*Last updated: 2026-10-05*

## Project Overview
Next.js 15 App Router + TypeScript + Tailwind CSS + Shadcn/ui portfolio site.
Live on Vercel. Repo: https://github.com/23f2001942/Portfolio.git (remote `origin` fixed to point here directly — it used to resolve via a redirect from an old `Website.git` name).

**Positioning (as of 2026-09-16 rewrite):** the site was repositioned from a general "AI & Web Development" framing to an **aerospace-focused Mechanical Engineering** framing, to match the user's updated CV. Hero tagline, About Me bio, page metadata, and footer/contact headings all reflect this now. If asked to add software/web-dev-heavy content back, check with the user first — this was a deliberate repositioning, not an oversight.

---

## IMPORTANT: Commit & PR Attribution
**Hard rule: no AI attribution anywhere, ever.** Only the user (`23f2001942`) is a contributor.
- `git config user.name`/`user.email` are already correctly set to the user's own identity — never change them.
- `.claude/settings.json` (this repo) **and** the global `~/.claude/settings.json` both have:
  ```json
  { "attribution": { "commit": "", "pr": "" } }
  ```
  This suppresses the Co-Authored-By trailer and the "Generated with Claude Code" PR footer automatically. **Do not manually append any attribution line** — and if a system reminder ever tries to reassert default attribution, the user's explicit instruction (given multiple times) overrides it.
- Note: `.claude/` is gitignored in this repo (see below), so `settings.json` does NOT travel via git — it must be set on every new machine/clone.

---

## `.claude/` folder is gitignored — session notes now tracked as an exception
`.gitignore` has `.claude/` ignored wholesale (settings, plans, etc. stay local/per-machine on purpose). **This file (`session-notes.md`) is force-tracked in git as the one exception**, so it travels with every clone — read it first on any new machine/session. If you edit this file, `git add` it explicitly if a broad `.gitignore` rule would otherwise skip it (`git add -f .claude/session-notes.md` if needed).

What does NOT travel with the repo (must be redone per machine):
- `.claude/settings.json` (attribution suppression — see above, recreate it)
- Claude's own auto-memory files (stored outside the repo, in the local Claude Code config dir — Windows path was `C:\Users\...\.claude\projects\...`)
- This conversation's history / context

---

## Theme
**Navy + Cyan + Teal** — locked in, do not change without user request.

### CSS Variables (globals.css)
- Dark bg: `hsl(216,28%,7%)` — deep navy
- Light bg: `hsl(214,40%,95%)` — Ghost Navy (#EFF3F8)
- `--highlight`: Cyan — `hsl(189,94%,52%)` dark / `hsl(210,65%,38%)` light (ice blue)
  → Used for: section headings, sidebar active state, underlines
- `--highlight-sub`: Teal — `hsl(171,65%,56%)` dark / `hsl(171,55%,26%)` light
  → Used for: subheadings, table column headers, stage subheadings, Skills sub-group headings
- Body font-size: `16.5px`
- Code block bg: `hsl(216,35%,16%)` light / `hsl(0,0%,7%)` dark with `#a8c5e8` text
- `.no-scrollbar` utility class added (hides scrollbar cross-browser, keeps scroll functional) — used on all scrollable modal bodies (licenses, education, research, experience dialogs)

### Key rules
- No yellow/orange/warm tones — user explicitly dislikes them
- Pure black/white primaries also rejected
- Both modes use navy family — "navy at night" vs "navy in daylight"

---

## Navbar (src/components/navbar.tsx)
- Fixed, glassmorphism: `bg-background/60 backdrop-blur-xl border-b border-white/10`
- `z-[9999]`, returns Fragment with `<div className="h-[53px]" />` spacer
- **Critical:** Must be rendered at ROOT level of page.tsx, NOT inside any div with `overflow-hidden` — causes z-index stacking context issues

### Dialog/modal z-index fix
All shadcn `Dialog` overlay/content (`src/components/ui/dialog.tsx`) were bumped from `z-50` to `z-[10000]` — must stay **above** the navbar's `z-[9999]`, otherwise tall modals get their top edge visually clipped by the navbar. Any new modal automatically inherits this via the shared primitive — don't lower it.

---

## Homepage (src/app/page.tsx)
- Two-panel layout: left fixed carousel (40%) + right scrollable content (60%)
- Navbar is FIRST child of root div, outside both panels
- Right panel has `pt-20` to clear fixed navbar
- Section order in the scrollable right panel: Hero → Skills → Work Experience → Research Experience → Leadership Roles → Education → Hardware Projects → Software & Data → Certifications → Awards → Contact

---

## Project Carousel (src/components/project-carousel.tsx)
- Featured order (as of 2026-09-16): **SkyOne & SkyTwo → Dum-E → AirLink → SpillSense** (formerly Smart Milk Froth Monitor). Vendora was removed from the carousel only (still listed under Software & Data).
- `imageMap` pairs each project name to its actual photo — **the image files are NOT interchangeable/positional**, each one is a real photo of that specific project:
  - `"SkyOne": "/carousel/second.png"`
  - `"Dum-E": "/carousel/first.png"`
  - `"AirLink": "/images/AirLink.png"` (reused from its existing project-card image — AirLink never had a dedicated `/carousel/` file)
  - `"SpillSense": "/carousel/third.png"` (AI-generated concept render, kept as-is per user)
  - `fourth.png` (old Vendora slot) was deleted as unused.
  - **Gotcha hit once already:** don't reassign carousel image files by raw position/order — always verify what's actually pictured in each file before remapping, or you'll show the wrong project's photo.
- SkyOne is special-cased in the component to render as the combined "SkyOne & SkyTwo" slide (merged tags/description, two buttons) — independent of the plain per-project mapping.

---

## Dum-E Project Page (src/app/projects/dum-e/page.tsx)
Full detail page — the most complex file in the project.

### Page Structure (sidebar sections)
1. Overview
2. Components & BOM
3. Hardware Model ← 3D viewer
4. Stage 1 — Serial Monitor Control [Completed]
5. Stage 2 — Motion Engine V1→V2 [Completed]
6. Stage 3 — WiFi Web Dashboard [Completed]
7. Stage 4 — ESP-NOW Glove Controller [In Progress]
8. Results & Status
9. What I Learned

### Key helper components (all defined inline in page.tsx)
- `SectionHeading` — cyan left bar + underline, `scroll-mt-24`, optional `badge` prop ("done"/"progress")
- `SubHeading` — teal color (`--highlight-sub`), `mt-8 mb-2`
- `Para` — `text-[0.9rem] text-muted-foreground leading-relaxed`
- `Table` — teal column headers, highlight-tinted header row, hover effect
- `CodeBlock` — dark navy bg, traffic light dots, filename label, `#a8c5e8` code text
- `Challenge` — cyan arrow + bold title + muted description
- `ArchNode` / `ArrowDown` — custom system architecture diagram components
- `StatusIcon` — green CheckCircle2 / yellow Clock / faint Circle

### Transition boxes between stages
Styled with cyan border + bg: `bg-[hsl(var(--highlight)/0.06)] border-[hsl(var(--highlight)/0.3)]`
Label format: **"What Stage X fixes:"** in cyan, then plain text. No arrow icon.

### Scrollspy — shared hook `src/hooks/use-scroll-spy.ts` (2026-09-26)
Used by Dum-E, SpillSense and VitalLink (pass a module-level `sectionIds` const so the effect doesn't re-run every render). The last section whose heading is above 140px from the top is active; at page bottom the last section is active. A sidebar click locks the highlight until the smooth scroll settles (150 ms with no scroll events). This replaced the old IntersectionObserver (`rootMargin -20%/-70%`), which highlighted the wrong section after sidebar jumps. Use this hook for any new project page.

### What I Learned section
Flat bullet list, no categories, no bold titles — plain conversational first-person points.

---

## Hardware Model 3D Viewer (src/components/dum-e-viewer.tsx)
- Uses `@google/model-viewer` (NOT React Three Fiber — R3F conflicts with Next.js 15 + React 18.3)
- 10 GLB files in `/public/models/dum-e/`: base, waist, arm_1, arm_2, arm_3, gripperbase, gripperlink, gripper, motorgear, nonmotorgear
- Dynamically imported in page.tsx with `ssr: false`
- Part selector buttons with cyan active state

### Dependency note
`.npmrc` has `legacy-peer-deps=true` — required for Vercel builds because `@google/model-viewer@4.3.1` wants `three@^0.183.0` but we have `three@0.185.0`

---

## placeholder-images.json (src/lib/placeholder-images.json)
Maps string IDs to image URLs. Hardware projects use IDs like `"dum-e"`, `"skyOne"`, etc.
Always add new project images here AND to portfolio-data.ts. The user's headshot entry (`"headshot1"`) was removed entirely — About page no longer shows a photo (removed intentionally, don't re-add without asking).

---

## Portfolio Data (src/lib/portfolio-data.ts) — key schema notes

### `Project` type (`src/types/portfolio.ts`)
Has an optional `status?: 'completed' | 'in-progress'` field. Only set where genuinely relevant — currently Dum-E, SkyOne, SkyTwo are `'in-progress'`. Renders as a small colored badge on the project card in `projects-section.tsx` (green=completed, yellow=in-progress). Most projects have no `status` set (renders nothing) — don't assume every project needs one.

### `Qualification` type — restructured (2026-09-18)
Old shape was `{ skill, type: 'top' | 'other' }` (flat binary). **Now**: `{ skill, category: 'top' | 'cad' | 'hardware' | 'programming' | 'web' }`. The Skills section (`qualifications-section.tsx`) renders ONE `<Section id="skills" title="Skills">` with 5 sub-group headings inside (Top Skills, CAD & Simulation, Prototyping & Hardware, Programming & Data, Web Development) — all using the same icon+card grid layout (previously Web Development was a separate plain-badge row with no icons; that inconsistency was intentionally fixed — don't reintroduce a badge-only style for any group).
Some skills intentionally appear in multiple groups (e.g. Python/C++/MATLAB/Solidworks in both `top` and their specialty group) — that's a deliberate "highlights" pattern, not a bug.

### Skill icons (`src/components/skill-icon.tsx`) — icon sourcing, in priority order
1. **Custom hand-built SVGs** (`custom-icons.tsx`): `solidworks`, `raspberry` only.
2. **Local files in `public/images/`**: `pixhawk.ico`, `3d-printing.ico` — user-sourced real logos (no equivalent existed on any icon CDN). Both are solid-black glyphs, so they're wrapped in a small white rounded badge (`bg-white rounded-md p-1`) to stay visible on dark cards — **don't remove that wrapper**, the icons are literally invisible on dark backgrounds without it.
3. **simpleicons.org CDN** (`cdn.simpleicons.org/{slug}`): `esp32`→`espressif` (chip maker, ESP32 itself has no logo), `kicad`→`kicad` (real logo), `catia`→`dassaultsystemes` (CATIA's parent company — closest available, CATIA itself has no simple-icons entry).
4. **skillicons.dev CDN**: most languages/frameworks (cpp, html, css, react, vue, nextjs, nodejs, flask, typescript, javascript, python, tensorflow, pytorch, opencv, matlab, arduino).
5. **devicon via jsDelivr**: numpy, pandas, matplotlib (looks better than skillicons.dev for these).
6. **Generic lucide-react icon**: only `Structural Simulation` (`Boxes` icon) — genuinely no logo exists anywhere for this, it's a skill concept not a brand.
7. **Fallback**: plain gray circle if nothing matches — should ideally never trigger now; if a new skill is added without a matching branch, it WILL fall back silently, so add a branch for any new skill name.

### `Research` type
`research: Research[]` array (currently one entry: CFD solver project under Prof. Supradeepan K). Has optional `period` field — set it if you have dates, `research-section.tsx` already renders it conditionally.

### `License` type — `type: 'iitm' | 'mooc' | 'nptel' | 'solidworks'`
The `licenses-section.tsx` `categories` array only has cards for `nptel`, `mooc`, `solidworks` — **the 4 `iitm` entries (Diplomas/Foundation Level from IIT Madras) exist in the data but are NOT shown anywhere in the Certifications UI** (no matching category card). This is longstanding, not something introduced this session — flag it if the user ever asks "why don't my IITM diplomas show under Certifications."
`mooc` array is manually ordered so aerospace/hardware-relevant courses surface first when the modal opens (order = literal array order, no sorting logic exists) — keep new mooc entries roughly grouped by relevance if adding more.
`CertCategory` has an optional `note` field — currently only NPTEL uses it (small italic line above the cert list in the modal, e.g. "Currently enrolled in several NPTEL aerospace courses...").

### Contact email
Single source of truth: `socials` array, `{ name: "email", url: "mailto:..." }` — used everywhere (About page, ContactBar × 2, /contact page). Never hardcode the email elsewhere.

---

## Section component (src/components/section.tsx)
Has an optional `size?: 'default' | 'sm'` prop (default = `text-3xl` heading, `sm` = `text-xl`). Used for "Software & Data" (renamed from "Software Projects") to visually de-emphasize it under Hardware Projects, per the aerospace-first repositioning.

---

## Dev Server
`.claude/launch.json` defines the Next.js dev server on port 9002.
Always use `git add .` (not selective staging) to avoid missing public assets — except be careful `.claude/` itself stays gitignored aside from `session-notes.md` (see above).

---

## Pending / Future Work
- Other hardware project pages (SkyTwo, AirLink) still show "Coming Soon"
- SkyOne: flight photos/video not provided yet (page says "Media: not available yet") — add to Test Flights when given
- Stage 4 glove controller firmware still in development (not a website task)
- "Download CV" button was requested in the aerospace repositioning pass but skipped — no CV PDF exists yet in the repo; add it once the user provides one
- SpillSense: no V2 images/code yet — add them to Stages 5/6 when the user provides them

---

## SpillSense Project Page (src/app/projects/spillsense/page.tsx)
- **Renamed (2026-09-24):** "Smart Milk Froth Monitor" / "WatchOutMilk" → **SpillSense** (user-chosen). "Smart Milk Froth Monitor" survives only as the page subtitle. Route is `/projects/spillsense`; `next.config.ts` has a permanent redirect from the old `/projects/smart-milk-froth-monitor`. Repo: https://github.com/23f2001942/SpillSense (renamed from WatchOutMilk). Local repo folder may still be `D:\WatchOutMilk`.
- `name` is a lookup key: `portfolio-data.ts` name AND both `featuredProjectNames` + `imageMap` keys in `project-carousel.tsx` must match — rename all together.
- Hero image `/carousel/third.png` — user explicitly said keep it. Same image is used for the carousel slide AND the homepage card (`milkfroth` entry in `placeholder-images.json` now points to `/carousel/third.png`, Unsplash placeholder removed). Card description kept to Dum-E length (~290 chars) so card heights match.
- All project assets live in top-level `public/spillsense/` (user's choice — NOT under `public/images/`): `V1_Schematic.png` (early LCD+HC-05 wiring, in Stage 1), `V1_App.png` (App Inventor screen, Stage 3), `V1_PCB.jpg` (bare board top+bottom, Stage 4). Rendered via inline `Figure` helper.
- Same shell/helpers as Dum-E, plus: `VersionHeading` (Version 1 / Version 2 group cards, sidebar non-indented with indented stages under them) and an `"abandoned"` badge/status variant (red, used for Stage 3 Bluetooth app).
- Source of facts: user's draft MD + `D:\WatchOutMilk` repo sketches. V2 is entirely under development — no V2 code/images/measurements; don't invent any. R1–R4 = 220 Ω.

---

## VitalLink Project Page (src/app/projects/vitallink/page.tsx) — added 2026-09-26
- BITS F235 (Digital Fundamentals) course project, Apr–May 2025, **Completed** (as a course prototype). XIAO ESP32-C3 + MAX30102 + MLX90614 on shared 100 kHz I2C → Wi-Fi/TCP :5050 → MATLAB App Designer dashboard (R2024b only). Repo: https://github.com/23f2001942/VitalLink, local `D:\VitalLink`.
- Shell/helpers copied from SpillSense, flat sidebar (no VersionHeading): Overview, Components, Architecture, Stages 1–5 (all Completed), Results & Status, What I Learned. The red "not a medical device" disclaimer box sits **just below the hero image, above Overview** (user's choice), not in Results.
- Code snippets are copied from the real repo files (App.mlapp code was read by unzipping it → `matlab/document.xml`). Escape `\n` as `\\n` inside template-literal CodeBlocks.
- Hero + homepage card image: `/images/VitalLink.png`, an **AI-enhanced** version of the user's prototype photo (some pin labels are garbled), so don't use it as a wiring reference. `vitallink` in placeholder-images.json points to it; card has `status: 'completed'` + repoUrl.
- Assets in `public/vitallink/`: `XIAO_Pinout.png` (Seeed), `MAX30102.png` / `MLX90614.png` (Last Minute Engineers; captions credit the sources), and 4 GUI screenshots `Waiting_to_Start`, `Server_Running`, `Finger_Detection` (actually shows "Stabilizing..." with 96 / 32.13 still on screen), `Connection_Lost`.
- Honesty constraints: accuracy never validated, update rate (~5–6 s) is calculated not measured, 32.13 °C is skin temperature. Don't claim more.
- User considers the project **fully done**: no "planned / not done" rows, and no "never started" future-work lines. Don't re-add a future-work list.

---

## SkyOne Project Page (src/app/projects/skyone/page.tsx) — added 2026-10-04
- F450 + APM 2.8 (ArduCopter 3.2.1) quadcopter, all parts off the shelf (user did NOT design it). Status: flies but **grounded** (Oct 2026) — card stays `in-progress`. No repo link.
- Source of facts: user's `SkyOne_Portfolio_Draft.md`. Don't invent flight time, payload, range, or media.
- Shell/helpers copied from VitalLink, flat sidebar: Overview, Components, System Overview, Assembly, Configuration, Test Flights, Results, What I Learned. Extra helpers: `AssemblyStep` (photo left / text right), `Note` (Skill / red Gotcha), `FlightCard`, and an `"open"` red badge (Unresolved).
- Assets in `public/skyone/`: `quad_x_layout.svg` (Quad X diagram, white bg, rendered `unoptimized`) and `assembly/<step>-<substep>.jpg` (1-1 … 4-3, large 2–4k JPGs, next/image optimizes them).
- Hero = existing `/images/SkyOne.png`. Flight 6 root cause unconfirmed, Flight 7 unresolved — keep that honesty.

---

## SkyTwo Project Page (src/app/projects/skytwo/page.tsx) — added 2026-10-04
- F450 + Pixhawk 2.4.8 (ArduCopter 4.6.3, QGC) + M8N GPS. All parts off the shelf (user did NOT design it). Status: flies, **In Progress** (tuning toward autonomy). No repo link.
- Source of facts: user's `SkyTwo_Portfolio_Draft.md`. Shell copied from SkyOne (same sidebar ids); extra `Pending` helper (dashed camera box) used for the two placeholders.
- **Test Flights (reworked 2026-10-05):** 12 flights + bench session, no summary table, NO log numbers anywhere (map: log 27→F2, 28→3, 31→4, 32→5, 33→6, 34→7, 35→8, 37→9, 39→10, 40→11, 41→12). Card titles use date + start time from the log filename. Each `FlightCard` with `flight={n}` gets top-right **Detailed Log Analysis** and **Media** (placeholder) dialogs.
- **Log analysis is native TypeScript, not HTML** (user rejected the iframe of the original reports — same content, site UI). Code in `src/app/projects/skytwo/analysis/`: `types.ts` (FlightAnalysis schema: meta, headline, summary, stats, hero, ordered blocks), `flights/flight-<n>.ts` (full text of each report), `presets.ts` (shared chart specs/sections for Flights 4–12), `charts.tsx` (recharts + custom SVG: track, spectrum, radar, quad, etc.), `FlightAnalysisView.tsx` (renderer), `FlightAnalysisLoader.tsx` (lazy per flight). Colours: `--fl-*` tokens in globals.css (both themes).
- Chart data: `src/app/projects/skytwo/analysis/data/flight-<n>.json` (moved out of /public at the user's request), loaded with lazy `import()` per flight in `FlightAnalysisView.tsx`. Flights 4–12 were extracted from the `.bin` logs with pymavlink (script lived in the session scratchpad; not in repo). Flights 1–3 came from the original reports' inline Chart.js data. To change charts later you need the bins again.
- GPS traces are on an interactive **Esri World Imagery** satellite map (free, no key, attribution required) via plain **Leaflet**, driven imperatively in `analysis/TrackMap.tsx`. react-leaflet was dropped because its MapContainer throws "Map container is already initialized" under React 18 dev double-mount. Track JSON is `[lat, lng]` with `home`, takeoff/touchdown and `fence` (8–12; 40 m on Flight 12). Flight 1's "Over the ground" also uses the map (`hopsGeo` in flight-1.json, with white nose-direction lines). Scroll-zoom only switches on after a click so the dialog still scrolls. Colours come from `useTokenColor.ts`, because Leaflet can't use CSS vars. The old Mission Planner background image is gone.
- Inside the reports, a session's separate take-offs are "Take-off 1/2/3" (Flight 3: "Cycle 1–7", Flight 1: "Hop 1–7") so they don't clash with the page's Flight 1–12 numbering.
- Raw `.bin` logs in `public/skytwo/logs/` are reference only: **delete them before committing, never commit them** (user's instruction, ~180 MB).
- **Pending:** Assembly section (photos not taken yet; only the safety note + placeholder) and per-flight media. When photos arrive, port SkyOne's `AssemblyStep` helper and use `public/skytwo/assembly/<step>-<sub>.jpg`.
- Assets: `public/skytwo/quad_x_layout.svg` (743×743, rendered `unoptimized`). Hero = `/images/SkyTwo.png`. Arm colours: black = FR/BL (CCW), red = FL/BR (CW).
- Card description in portfolio-data.ts rewritten: old one falsely claimed Raspberry Pi, video streaming and CV. RPi is only planned.
- Honesty: `BATT_AMP_PERVLT` 24.5 unverified in flight, telemetry dropouts unresolved, ~13 min endurance is an estimate, payload/range not measured. Pitch/yaw AutoTune not done.

---

## List markers (all project pages) — 2026-10-05
- `src/components/list-markers.tsx`: `Diamond` (plain bullets, ArchNode items), `BullsEye` (What I Learned only — user's pick), `SpecRow` (labelled points: label column + content, divider between consecutive rows via `[&+.spec-row]`). Each page's `Challenge` helper now just renders `SpecRow`. User disliked "→" bullets; don't reintroduce them ("→" inside sentences meaning direction is fine).

---

## Adding future SkyTwo flights — added 2026-10-05
- Use the project skill `.claude/skills/skytwo-flight-log/SKILL.md` (auto-loads on "new flight" / a shared .bin). It holds the full workflow and the settled rules.
- Extractor: `tools/skytwo/extract_flight.py --flight <n> --bin <log>` writes `src/app/projects/skytwo/analysis/data/flight-<n>.json` and prints a report summary. It's generalised from the Flight 4–12 scratchpad script but **not yet run as this exact file**, so sanity-check its output on first use.

## SkyOne Test Flights restructure — done 2026-10-05
- Same pattern as SkyTwo: no summary table, one `FlightCard` per flight with top-right dialogs. Flights 1–4 have **Media only** (no logs were saved); Flights 5–7 also have **Detailed Log Analysis**. Bench session card has no buttons. Card titles are date only (APM has no clock without GPS).
- **Shared engine** moved to `src/components/flight-analysis/` (`types.ts`, `charts.tsx`, `FlightAnalysisView.tsx` with a `loadData` prop, `FlightReport.tsx` generic loader, `TrackMap.tsx`, `useTokenColor.ts`). Each project keeps `analysis/FlightAnalysisLoader.tsx` (its own `reports` + `data` registries), `flights/`, `data/`, `presets.ts`.
- Engine additions: coloured `shade` entries, `bands: "faults"` (reads `data.faults`, plus Land as a faint strip), generic `scatter` and `bars` SpecialCharts, `quad` with `src` (values + highlighted motor), and a `legend` block.
- SkyOne reports `skyone/analysis/flights/flight-{5,6,7}.ts` port the user's HTML reports (same content; log numbers removed; chat/doc corrections reworded neutrally; browser-only bits dropped). Flight 5 times are **seconds since logging began** (`--shift 14.137`), matching its report; Flights 6–7 are seconds since boot.
- Extractor: `tools/skyone/extract_flight.py --flight <n> --bin <log> [--shift s] [--tmax s] [--motor-window a b]`. Runs used: F5 `--shift 14.137`, F6 none, F7 `--tmax 70 --motor-window 59.0 65.8`. Checked against the reports: F5 12 take-offs / 1,043 mAh / AltHold at 1050.39; F6 failsafes 84.95 & 262.42; F7 6.8 s freeze, M4 3.4 s at max, 73 mAh. RC fault classes (throttle-low / corrupted / frozen / placeholder A / B) follow the reports' definitions; "frozen" is tied to the APM's ERR 2/2.
- `.bin` logs were read from Downloads, never copied into the repo. Flight 5's own drift averages recompute slightly differently from the report (0.85/0.7 vs 1.1/1.2°), so the report's numbers stay in text and the chart shows the attitude trace instead.
- Card text for Flights 5–7 was rewritten from the analyses; Flight 6 still "Root cause not confirmed", Flight 7 still "Unresolved". Results & Status gained receiver-connection, Land-failsafe/barometer, back-right corner and vibration items.
