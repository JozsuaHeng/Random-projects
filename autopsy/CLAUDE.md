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

## Sunburst view (`app.js` — Sunburst section, built with the `dataviz` skill)

The primary visualization is a radial hierarchy chart (rings = depth, arc
angle = share of the parent's size, color = verdict) rather than a treemap
or a force-directed node graph — chosen deliberately (see the conversation
that shaped this: a sunburst was requested by name over those alternatives).
The List view is kept as an equal, always-reachable alternative (a `dataviz`
skill requirement: "a table view always exists") because a sunburst is built
for *"which branch is way bigger than its siblings"* at a glance, not for
precisely comparing two similar-sized items — that's the List view's job.

- **Fill colors are a separately-tuned step of the same three hues as the
  badges**, not the same hex values. The badges (`--safe`/`--review`/`--keep`
  in `style.css`) are tuned bright for small text on a dark background; the
  dataviz skill's dark-mode lightness band for a *filled chart mark*
  (~OKLCH L 0.48–0.67) is lower than that, so reusing the badge hex directly
  failed the skill's own lightness-band check. `--fill-safe` (`#009c5c`),
  `--fill-review` (`#b37900`), and `--fill-keep` (`#4b79c8`) are the badge
  hues re-stepped to the correct lightness for a fill, keeping the same hue
  identity a person already learned from the List view's badges. Validated
  via the skill's `validate_palette.js` against the dark card surface
  (`#12121a`, `--pairs all` since any two arcs can sit side by side): all
  checks pass except a CVD floor **WARN** between review↔safe under
  protanopia/tritanopia (ΔE 7.6/5.5, inside the legal 6–8 floor band *only*
  with secondary encoding) — covered by the tooltip's text label, the
  legend, and the badge-styled reason text, never color alone. If these
  hexes are ever changed, re-run the validator before shipping; don't
  eyeball a replacement.
- **Rings only render `MAX_RINGS` (4) deep from whatever node is currently
  focused**, not the whole tree at once. A real home-folder scan is often
  10+ levels deep; rendering all of it at once would produce arcs a
  fraction of a degree wide at the outer rings — invisible and unclickable.
  Zooming in (`zoomTo`) re-centers the chart on the clicked node and
  re-runs the same 4-ring layout from there, so depth is always reachable,
  just not all at once.
- **Each ring caps at `MAX_CHILDREN_PER_RING` (7) individual arcs**, folding
  any remainder into one grey `+N smaller items` arc (`isOther: true`,
  `--fill-neutral`, not clickable). This exists because a home folder can
  easily have 50+ entries at one level — without capping, a ring would be a
  chaotic hairball of sliver arcs, which is exactly the "too many series"
  failure the dataviz skill's color-formula guidance warns about (fold the
  tail into "Other" rather than generating more identity). The List view has
  no such cap — if someone needs to see every item in a big folder
  individually, that's what it's for.
- **The synthetic multi-root wrapper** (`getSunburstRoot()`'s `{ name: 'All
  scans', ... }` node, built only when `forest.length > 1`, e.g. after
  scanning both Home and Applications) exists purely so the sunburst always
  has one root to center on. It's rebuilt fresh on every `resetSunburstFocus()`
  call — don't hold a reference to an old wrapper across scans, its
  `children[].parent` pointers get reassigned to the newest wrapper each time.
- Tooltip content is built with `textContent`/`createElement`, never
  `innerHTML` — folder and file names are effectively untrusted strings (they
  come from the visitor's real filesystem, not from this code), same
  discipline as the List view's node rendering.

## Live scan visualization (`app.js` — "Live scan visualization" section)

A Canvas-based radial particle show that runs *while* a scan is in progress
(inside `#progress`, replacing the plain spinner), requested explicitly as a
"hub and spoke, the more detailed and complex the better" view of files
appearing in real time. It is deliberately **not** the same code path as the
Sunburst — different job, different constraints:

- **It's a decoupled producer/consumer, not a direct render-per-file.**
  `onDiscover(item)` is a swappable no-op hook called from inside
  `scanEntry`/`sumSizeOnly` for every single file and folder the scan
  touches. During live viz it just pushes onto `liveQueue` — it never
  touches the DOM or canvas directly. A separate `requestAnimationFrame`
  loop (`liveFrame`) drains up to `LIVE_DRAIN_PER_FRAME` (50) items per
  frame into `liveNodes`. This split is what keeps the scan itself fast: a
  real home-folder scan can touch 100,000+ files, and rendering one visual
  update per file synchronously would make the *scan* wait on the *frame
  rate*, not the other way around.
- **Position is an approximation, not a real layout.** Unlike the Sunburst
  (which computes exact angles from real sibling sizes), a live bubble's
  angle comes from `sectorAngleFor(topName)` — a stable per-top-level-folder
  angle (assigned by golden-angle spacing as new top-level folders are first
  seen) plus random jitter that widens with depth. This is intentional: a
  real parent-accurate layout would need the item's full ancestor chain
  positioned first, which isn't available yet for a file discovered deep
  inside a folder that's still being walked. The approximation still reads
  correctly as "these files are all under Downloads, that cluster over
  there is Library" — which is the actual goal (a lively, legible show),
  not exact geometry (that's what the Sunburst is for, after the scan).
- **`LIVE_NODE_CAP` (1400) and `LIVE_QUEUE_CAP` (3000) bound memory/CPU
  regardless of scan size.** Once over the node cap, unflagged bubbles are
  evicted first (`findIndex((n) => !n.flag)`) so the visually interesting
  (colored, flagged) bubbles survive longer than plain neutral filler —
  don't change the eviction order without keeping that priority.
- **Nothing here is kept after the scan.** `stopLiveViz()` clears
  `liveNodes`/`liveQueue` and cancels the animation frame the moment the
  scan ends (in `runScan`'s `finally` block) — the Sunburst and List views
  render from the actual scanned tree, not from anything the live viz
  accumulated. If a future change wants the live view's positions to persist
  into the results view, that's a different, harder feature (real parent-
  accurate coordinates), not a tweak to this one.
- Hit-testing for the hover tooltip (`liveHitTest`) manually inverts the
  canvas's rotation transform to convert pointer coordinates back into each
  node's pre-rotation space — there's no DOM element per bubble to attach a
  listener to, so this is the only way hover works on a `<canvas>`.

## Running it

Needs a secure context for `showDirectoryPicker` to work — serve the folder
(`python3 -m http.server`) rather than opening `index.html` directly via
`file://`, which Chrome treats as insecure and where the picker will fail
silently or throw. The deployed GitHub Pages version (https) works fine.

## Hub page tile

Per `../CLAUDE.md`, this gets a themed tile on "The Quagmire"
(`data-theme="autopsy"` in `../index.html` / `../style.css`) — a
magnifying glass sweeping over a small stack of file blocks that shrink
and fade as it passes, implying "finding and clearing clutter" without
needing a text description. (The tile's internal CSS classes still use a
`dd-` prefix, a holdover from this project's original working name "Disk
Detective" — cosmetic only, safe to rename if ever touched again.)

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site. No environment variables, API keys, or backend — and by design, no
data of any kind leaves the visitor's own browser tab.
