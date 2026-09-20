# CLAUDE.md

## What this project is

**Autopsy** — a Mac storage diagnostic tool. You point it at a folder,
it recursively maps out what's actually taking up space, and it gives every
notable item a plain-English verdict: **safe to delete**, **worth a look**,
or **keep**. It never deletes, moves, or modifies anything itself — the only
output is information, so the person using it keeps full discretion over
what actually gets trashed.

Plain HTML/CSS/JS, no framework, no build step, no dependencies beyond
Google Fonts — same as everything else in `ai-slop/`.

## Why it's built this way (read before changing the scan logic)

- **It uses the browser's File System Access API** (`showDirectoryPicker`,
  `FileSystemDirectoryHandle.entries()`), not a backend. That's a deliberate
  choice, not a limitation worked around later: a static page hosted on
  GitHub Pages has no way to read a visitor's disk *except* this API, which
  requires the person to explicitly grant access to one folder at a time via
  the OS's native picker. Nothing is uploaded — the scan runs entirely in
  the tab. This only works in Chrome/Edge; Safari and Firefox don't
  implement it, hence the `unsupported` notice gated on
  `'showDirectoryPicker' in window`.
- **There's no "scan the whole Mac" button.** `showDirectoryPicker` never grants
  blanket disk access — every scan is one explicit folder grant. The quick-scan
  chips (Downloads/Desktop/Documents) use the `startIn` option purely to point
  the OS dialog's starting location; it grants nothing by itself, the person
  still has to pick and confirm.
- **A single Home folder grant already covers `~/Library`.** Finder hiding
  `Library` from view is a Finder-only UI convention (a `chflags hidden` bit
  on that one folder) — it has no effect on `FileSystemDirectoryHandle.entries()`,
  which lists the real directory contents regardless. Once someone grants
  access to their Home folder, the recursive scan walks into `Library`,
  `.cache`, `.npm`, `.Trash`, and every other dotfile/hidden folder inside it
  automatically. Earlier copy in this project told people to separately
  `⌘⇧G` into `~/Library` — that was unnecessary and has been removed; it's
  only relevant if someone wants to scan *just* Library in isolation, not
  for full coverage.
- **`/Applications` needs its own grant** because it's a top-level folder
  outside the user's Home directory (a sibling of `/Users`, not a descendant
  of it), hence the separate `scanAppsBtn` button.
- **`scanLibraryBtn`** (in the `.forgotten-panel`) is functionally identical
  to `scanBtn` — same plain `runScan()` call, no `startIn` — it exists only
  because `startIn`'s well-known-directory enum has no `'library'` option,
  so there's no way to pre-navigate the OS picker there. The button's job is
  just to sit next to the "commonly forgotten spots" list as a direct call
  to action; the copy tells the person to `⌘⇧G` to `~/Library` themselves.
- **Don't try to shortcut full coverage by pointing the picker at the volume
  root ("Macintosh HD") or other OS folders.** This isn't just impractical —
  Chrome's own File System Access implementation refuses to grant access to
  a blocklist of OS-critical directories (the volume root, `/System`,
  top-level `/Library`, `/usr`, `/bin`, and similar) and shows its own "choose
  a different folder" error. That block is enforced by the browser, not this
  app, and there's no way around it from page code. Home + Applications is
  the practical ceiling.
- **The API can't see live RAM usage, and was never meant to** — that needs
  OS-level APIs no browser exposes. This tool is disk/storage only. If RAM
  diagnostics are ever wanted, that's a different tool (a Terminal script),
  not a feature to bolt onto this one.
- **The API never exposes an absolute filesystem path** (e.g. it can't tell
  you a file lives at `/Users/joz/Downloads/x`) — only a handle plus names
  relative to whatever folder was granted. That's why rows show a breadcrumb
  built from the picked root's own name, not a real path, and why the "how
  this works" panel tells people to go find it themselves in Finder rather
  than promising a copyable path.
- **There is intentionally no delete button.** `FileSystemDirectoryHandle`
  does support `removeEntry()`, which would make one-click delete possible —
  it was left out on purpose. That call deletes permanently, bypassing the
  Trash, which is one accidental click away from unrecoverable data loss on
  a tool whose whole pitch is "you're in control." Recommending is this
  tool's job; deleting stays a manual, Trash-safe action in Finder. Don't
  add a delete button without discussing that tradeoff first.

## Scan engine (`app.js`)

- `RULES` is an ordered list of `{ test(name), category, level, reason,
  stop }`. First match wins, so put more specific names before generic
  patterns (e.g. `DerivedData` before the generic `Cache$` regex). `level`
  is one of `'safe' | 'review' | 'keep'`.
- **Rules match on `name` alone — there is no path context.** This is why
  some obviously-common folder names are deliberately *not* rules:
  `Backup`, `Archives`, and `Messages` are all real macOS clutter spots
  (`MobileSync`'s inner backup folders, Xcode's `Archives`, the Messages
  app's attachment store) but are also common names people give their own
  personal folders anywhere on disk — adding a rule for the generic name
  would false-flag those. Prefer the more distinctive *parent* or
  sibling name instead (`MobileSync` rather than the `Backup` folder
  inside it), or skip the rule entirely if nothing distinctive exists.
  Before adding a new rule, ask "could an ordinary person's own folder
  reasonably be named exactly this?" — if yes, don't add it as a bare name
  match.
- The "commonly forgotten" rules (`DiagnosticReports`, `Logs`, `Saved
  Application State`, `MobileSync`, `WebKit`, `Cookies.binarycookies`,
  `iOS DeviceSupport`/`watchOS DeviceSupport`/`tvOS DeviceSupport`,
  `Docker.raw`/`Docker.qcow2`) exist because they're real, well-known Mac
  storage traps that live inside the normally-hidden `~/Library` (reachable
  via Finder's Go → Go to Folder, ⌘⇧G) or similar out-of-sight spots —
  added directly in response to being asked for exactly this category.
  `MobileSync` (old iPhone/iPad backups) and `WebKit`/`Cookies.binarycookies`
  (Safari site data/cookies) are `review`, not `safe` — unlike a pure cache,
  losing them has a real consequence (no recent backup, signed out of
  sites), so the tool shouldn't undersell that. The `.forgotten-panel` in
  `index.html` surfaces this same list *before* scanning, partly to teach
  and partly to be upfront that **local Time Machine snapshots are the one
  storage category no browser tool can see** — they're APFS snapshot
  metadata, not regular files, invisible to `FileSystemDirectoryHandle`
  entirely. Don't imply this tool covers that; only Apple's own storage
  panel can.
- `stop: true` marks a "bucket" — a folder whose *total* size matters but
  whose contents don't need to be listed individually (`node_modules`,
  `Caches`, `.app` bundles, etc.). Once a bucket is matched, `sumSizeOnly()`
  totals everything inside it without building tree nodes for each file —
  this is what keeps a 40,000-file `node_modules` from becoming 40,000 rows,
  and keeps the scan fast. If you add a new bucket rule, make sure it really
  is something a person would treat as one unit (delete/keep as a whole),
  not something they'd want to browse inside.
- Everything *not* matched by a bucket rule gets a real tree node and is
  recursed into normally, so manual browsing always works even for
  unflagged folders (Documents, Desktop, project folders, etc.) — the rule
  set only decorates the obviously-actionable items, it doesn't limit what
  can be explored.
- A lone file over `LARGE_FILE_BYTES` (300 MB) gets flagged `review` even
  with no name match — this is the catch-all for "some huge thing that
  isn't a known cache pattern but is still worth a look" (old exports,
  backups, DMGs that didn't match the extension rule, etc.).
- `hasFlaggedDescendant` (computed bottom-up during the scan) drives
  auto-expand: a folder auto-opens (up to depth 4) only if something
  actionable lives inside it, so the tree opens itself to the interesting
  parts instead of dumping a fully-expanded file tree or making the person
  click through every folder to find anything.
- The root folder a person picks is always scanned in full (`forceFull` in
  `scanEntry`) even if its own name happens to match a bucket rule — you
  can't usefully "bucket" the one thing someone explicitly asked to explore.
- Errors during `entries()`/`getFile()` (permission-denied on
  Spotlight/system dirs, TCC-protected folders, etc.) are caught silently
  per-entry and counted in `stats.skipped`, surfaced as one summary line
  rather than as individual error rows.
- Each directory node's children get `c.parent = dirNode` set once, right
  before `scanEntry` returns. This is the only reason parent pointers exist
  at all — the sunburst's breadcrumb and zoom-out need to walk upward through
  the tree, and nothing else does. Don't repurpose it for anything else
  without checking both consumers still make sense.

## Tesseract engine (`app.js` — shared math + live scan + results view)

**Replaced the sunburst entirely** (2026-09-20) after it was asked to be
removed in favor of a literal rotating 4D hypercube, "extremely detailed,"
paced like Idle Cosmos's piece-by-piece cosmic build-up, used for *both* the
scan-in-progress show and the after-scan results view — one engine, two
callers, not two unrelated systems. The tesseract math (`TESS_VERTS`,
`TESS_EDGES`, `TESS_BUILD_ORDER`, `rotate4D`, `project4D`, `makeTesseract`,
`tesseractRevealFraction`, `drawTesseract`) is shared; live-scan and results
mode differ only in what drives the reveal and what they draw on top.

- **The math is a real 4D rotation + projection, not a spinning cube icon.**
  16 vertices (every `±1` combination across 4 axes), 32 edges (any two
  vertices differing in exactly one axis — `diff & (diff-1) === 0`).
  `rotate4D` rotates in the XW and YZ planes (the two that make a tesseract
  visually warp its inner/outer cubes into each other, the classic "4D
  rotation" look) plus a slower XY spin for good measure, then `project4D`
  does a perspective divide by `w` (4D→3D) followed by one by `z` (3D→2D).
  If this ever needs a "flatter"/"more dramatic" look, tune the `wDist`/
  `zDist` perspective constants in `project4D`, not the rotation speeds.
- **Staged reveal is `Math.min(timeFraction, itemFraction)`**
  (`tesseractRevealFraction`) — deliberately the *slower* of "how much wall
  time has passed since this instance unlocked" and "how many real items
  have been found since then." This was the direct fix for "slow it down so
  people can actually see it being put together": a fast scan of a small
  folder still takes `minBuildMs` (7.5s for the primary hypercube) to
  finish visibly, because time-fraction gates it; a slow scan of a huge
  folder never *looks* done early just because a clock ran out, because
  item-fraction gates it instead. Don't swap this for `Math.max` or an
  average — either breaks one of the two guarantees.
- **`TESS_BUILD_ORDER` reveals all 16 vertices before any edges**, and
  edges are pre-sorted so one never appears before both its endpoints
  (`Math.max(...edge)` as the primary sort key). This is what makes the
  build look like points appearing then wiring themselves together, rather
  than half-formed floating lines.
- **Bigger scans unlock satellite hypercubes** (`LIVE_SATELLITE_THRESHOLDS`
  = `[3000, 12000, 40000, 120000]` items), each smaller, orbiting the
  primary, each running its own reveal on its own `unlockedAt`/
  `itemsAtUnlock` window — the Idle-Cosmos-style "more usage unlocks the
  next thing out" structure applied to hypercubes instead of planets. A
  quick Downloads-folder scan will likely only ever build the primary one;
  a full Home scan is where the escalation actually pays off.
- **`onDiscover` only ever spawns a decorative particle during live mode**
  (`startLiveViz`'s callback) — a drifting spark colored by verdict, capped
  at `LIVE_PARTICLE_CAP` (260), never a full tracked object. This keeps a
  six-figure item count from ever touching the DOM or blocking a frame —
  same reasoning as the old hub-and-spoke version, just simpler now that
  particles don't need exact positions, only ambient motion.
- **Results mode (`buildResultsTesseract`/`resultsFrame`) reuses the exact
  same `drawTesseract`, just with `forceFull: true`** (skips the reveal
  math, always draws the complete structure) and attaches up to 16 "notable
  item" nodes per hypercube — the biggest top-level things found
  (`getNotableItems`, same top-N + "+N more" folding idea the sunburst used)
  — to that instance's vertex positions ("primary" nodes).
- **The Map view (its user-facing name — internally still "tesseract"/
  "results" in code, e.g. `#tesseractView`, `buildResultsTesseract`) is a
  frozen still frame, not a loop**, on purpose: it's meant to be held still
  long enough to actually click, unlike the live scan show, which is meant
  to move. `startResultsViz` captures one `resultsFrozenTs` timestamp and
  calls `renderResultsStatic(ts)` once; there is no `requestAnimationFrame`
  loop for this view at all. A filter-pill click or a tab-switch-in or a
  window resize each just call `renderResultsStatic(resultsFrozenTs)` again
  with the *same* timestamp — the orientation must never drift between
  those calls, only the frame's inputs (canvas size, `activeFilter`) do.
- **"Child" nodes make the graph reflect real containment, not just
  decoration** ("intelligent bubbles and spokes," asked for by name): a
  primary node whose item has children spawns up to 3 secondary nodes for
  its own biggest sub-items, connected by a spoke line drawn from the
  primary's *actual resolved position* outward, away from center. This can
  only happen inside `renderResultsStatic`, after the tesseract's vertices
  are projected — a child node has no position of its own until its
  parent's position is known, which is why `buildResultsTesseract` only
  builds the data relationship (`kind: 'child'`, a `parent` reference) and
  leaves `x`/`y`/`r` at 0 until render time.
- **Click opens the `#mapInspector` panel** (name, size, verdict badge,
  reason, a "View in List →" button) rather than jumping to List view
  immediately — this replaced an earlier version that switched tabs
  directly on click, which felt like an unexplained jump rather than an
  inspectable result. The panel is a fixed corner overlay inside
  `.sunburst-stage`, not positioned near the clicked node, so it never
  covers whatever was just clicked.
- **`.sunburst-stage` fills its full container width edge-to-edge** (no
  `max-width`, `overflow: hidden` clips the canvas to the panel's own
  rounded corners) — asked for explicitly after the first version rendered
  as a small centered square with wasted side margins.
- Tooltip content (`showTooltip`/`hideTooltip`, unchanged from the sunburst
  era) is built with `textContent`/`createElement`, never `innerHTML` —
  folder and file names are effectively untrusted strings.

## Running it

Needs a secure context for `showDirectoryPicker` to work — serve the folder
(`python3 -m http.server`) rather than opening `index.html` directly via
`file://`, which Chrome treats as insecure and where the picker will fail
silently or throw. The deployed GitHub Pages version (https) works fine.

## Hub page tile

Per `../CLAUDE.md`, this gets a themed tile on "The Quagmire"
(`data-theme="autopsy"` in `../index.html` / `../style.css`, classes
prefixed `au-`) — redesigned 2026-09-20 from an earlier magnifying-glass
version into a lab-specimen exam board: four corner brackets frame a
12-cell grid behind a sweeping scan beam, cells lighting up in the app's
own safe/review/keep colors roughly as the beam passes, plus an animated
ECG line along the bottom. No visible wordmark (`.art-title` is
`sr-only`, same pattern as Kept/Passportly) — the art carries the name.
If revisiting this tile, keep the "diagnosis," not "generic disk icon,"
read: the ECG line and ordered cell-lighting are what make it read as
*examining* something rather than just scanning a folder.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site. No environment variables, API keys, or backend — and by design, no
data of any kind leaves the visitor's own browser tab.
