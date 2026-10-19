# CLAUDE.md

## What this project is

**StateLine** (originally built as "Paycheck Atlas" — renamed 2026-10-19,
see naming options offered to the user) — a state-by-state map of how a
paycheck differs across all 50 states + DC: state income tax (including
local/city layers), Social Security & Medicare (federal, shown as a
baseline), state disability insurance, paid family/medical leave,
unemployment insurance (employer-paid), minimum wage, interstate tax
reciprocity, the "convenience of the employer" rule, and workers'-comp/
overtime quirks.

Built from a real problem: the user is job-hunting in NYC and noticed a
separate NY State tax *and* a separate NYC resident tax stacked on top of
federal withholding. The hero's "Try NY vs NJ vs CT →" chip (`#spotlight-compare`
— id kept from the original build) exists specifically to surface that:
NY state tax → NYC resident tax → the "convenience of the employer" rule
that catches NJ/CT remote workers. NY also gets a brief pulse animation on
first load (`pulseStateOnce("NY")` in `app.js`) as a quiet nudge toward it.

**Design iteration (2026-10-19)**: the first build had a long first-person
intro paragraph, a 3-card essay explaining the NY/NJ/CT situation, and an
always-visible glossary grid — user feedback was "too much words," wanting
a short description + feature highlights up top with the map right below,
and "more intuitive." Response: intro cut to 2 sentences + a row of
feature chips (`.hero-row`), the 3-card essay collapsed into one hero chip
+ CTA, the glossary became a collapsed native `<details>` (zero JS), dock/
compare-table notes now truncate via `noteHTML()` with a "more"/"less"
toggle instead of showing full prose by default, the map tooltip got
richer (shows tax rate + min wage + badges for every hover, not just the
selected metric), and a **Compare mode** toggle
(`#compare-mode-toggle`/`state.compareMode`) was added so clicking states
can add them straight to the compare tray instead of always opening the
dock first.

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend — same pattern as
every other project in `ai-slop/` (see `factlas/`, `corporate-radar/`).

- **`data.js`** — `META` (disclaimer + `asOf` date), `FEDERAL` (the one
  baseline that doesn't vary by state), and `STATES` (an object keyed by
  2-letter postal abbreviation + `DC`, 51 entries total). Each state has:
  `incomeTax`, `localTax`, `disability`, `paidLeave`, `ui` (unemployment
  insurance), `minWage` (has both a numeric `value` for sorting/coloring and
  a descriptive `rate` string for display — don't drop the numeric field if
  you edit an entry, the choropleth depends on it), `reciprocity` (agreement
  list + `convenienceRule` boolean + notes), and `workersComp`.
  **Data provenance**: NY/NJ/CT and all federal figures were checked against
  current official/news sources as of October 2026 (the user's own
  situation makes those three the ones that most need to be right). Every
  other state was compiled from general tax-policy knowledge at the same
  time and may already be slightly stale — that's disclosed in `META` and
  shown in the page footer, not hidden. If you update a figure, keep the
  `notes` field's tone (plain-language nuance, not statute citation) and
  update `META.asOf` if you touch more than one or two states.
- **`map.svg`** — spliced directly into `index.html` (same inlining
  technique as `factlas/map.svg`, for the same reason: CSS/JS need to
  target individual `<path id="NY">` elements by id, and that only works
  if the SVG is inline DOM, not loaded via `<img>`/`fetch`). Source: an
  MIT-licensed US states map (WebsiteBeaver,
  github.com/WebsiteBeaver/interactive-and-responsive-svg-map-of-us-states-capitals),
  stripped of its original Inkscape/sodipodi metadata and `data-info`
  tooltips (the page builds its own tooltips from `data.js` instead).
  DC is a `<g id="DC">` wrapping a tiny connector path plus a `<circle>` —
  `app.js`'s `colorablePartsFor()` handles group vs. plain-path nodes so
  DC gets colored/selected like every other state despite being two SVG
  elements, not one.
- **`app.js`** — all interaction logic:
  - `METRICS` drives both the map's color-by dropdown and its legend — to
    add a new choropleth metric, add one entry here (`kind: "seq"` for a
    numeric gradient or `"bool"` for a yes/no split) with a `get(state)`
    accessor; nothing else needs to change.
  - Choropleth coloring uses **quantile bins** (`quantileBins()`), not
    even min-max buckets — with a right tail like NY/CA/HI's top tax
    rates, even buckets would wash out the bottom 80% of states into one
    or two bins. Colors come from CSS classes (`map-bin-0`…`map-bin-5`,
    `map-yes`/`map-no`), which read `--seq-1`…`--seq-6` custom properties
    in `style.css` — that's deliberate, so light/dark mode just works
    without app.js needing to know which theme is active.
  - The sequential ramp (`--seq-1`…`--seq-6`) and status colors are the
    dataviz skill's validated default palette (`references/palette.md`),
    with **separately chosen dark-mode steps** (not an automatic
    light-ramp flip) per that skill's guidance — dark mode uses the
    *brighter* end of the same ramp so values still "pop" against the
    dark surface instead of receding into it the way they do on light.
  - **State breakdown** (`selectState`/`renderStateBreakdown`, inline in
    `#state-breakdown-content` — see the dedicated section below; this
    used to be a slide-in `dock`/overlay, replaced 2026-10-19) is the
    full per-state profile; the **compare overlay** (`openCompare`/
    `renderCompareContent`) renders the same categories as a table for up
    to 3 states at once. Both read straight from `STATES`, so a `data.js`
    edit shows up in both places automatically.
  - `state.compare` caps at 3 (`toggleCompare`); the hero's "Try NY vs NJ
    vs CT" chip just hardcodes that array and calls `openCompare`
    directly, bypassing the tray. **Compare mode**
    (`state.compareMode`, toggled by `#compare-mode-toggle`) changes what
    a map click does: off (default) calls `selectState()`, on calls
    `toggleCompare()` directly — `.map-wrap.is-compare-mode` swaps the
    cursor so it's visually obvious which mode is active.
  - **Ranked list panel** (`renderStateList()`/`initStateList()`, beside
    the map): same 51 rows as the map, sorted by whatever metric is
    active (`state.listSortAsc` flips direction for numeric metrics; a
    boolean metric groups Yes-then-No instead and hides the sort
    button). It reads `state.currentMetric`/`state.currentEdges`, which
    `paintMap()` now stashes on `state` precisely so the list doesn't
    recompute quantile bins separately and risk drifting from the map's
    own coloring. Map and list are **hover-linked both directions** via
    `highlightLinked(abbr, on)` — hovering a row adds `.is-hover-linked`
    to the matching SVG node, and vice versa; `refreshMapSelectionClasses()`
    was extended to also sync `.is-selected`/`.is-comparing` onto
    `.state-row` elements so the two views never disagree about what's
    open/compared.
  - `noteHTML(text, max)` truncates any note field to a sentence/word
    boundary near `max` chars with a "more" toggle (`handleNoteToggle`,
    delegated on both `#dock-content` and `#compare-content`) — used by
    `factCard()` and the compare table's note cells. If you add a new
    fact with a long note, route it through `noteHTML()` rather than
    interpolating the raw string, or it'll reintroduce the "too much
    text" problem this was built to fix.
- **`style.css`** — light/dark via the same convention used elsewhere in
  this repo: OS preference by default (`@media (prefers-color-scheme:
  dark)` scoped to `:root:not([data-theme="light"])`), overridable by the
  header toggle via `:root[data-theme="dark"]`/`[data-theme="light"]`,
  persisted to `localStorage["stateline-theme"]`. `main`'s max-width was
  widened from 1180px to 1420px (2026-10-19, "bigger map" feedback) —
  **don't use a viewport-relative breakout** (`calc(50vw - Npx)` margin
  tricks) to make the map section alone wider than the rest of the page;
  an earlier attempt did that and it silently misaligned the map against
  the hero text above it, because `main` is itself centered via
  `margin: 0 auto`, not pinned to the viewport edge — a breakout computed
  against `100vw` doesn't know about that centering offset. Widening
  `main` itself was the fix; if the map ever needs to be wider than the
  rest of the page again, compute the breakout relative to `main`'s own
  box, not the viewport.
  **Gotcha already hit once**: `.compare-overlay`/`.modal-overlay` set
  `display: flex` unconditionally for centering — that silently overrides
  the browser's built-in `[hidden] { display: none }` default (same
  specificity, author CSS wins), which made the whole page unclickable
  the first time this shipped. Fixed with an explicit
  `.compare-overlay[hidden], .modal-overlay[hidden] { display: none; }`
  override. If you add another overlay/modal that's toggled via the
  `hidden` attribute (not a class), it needs the same explicit override —
  don't rely on the browser default once you've set `display` in CSS.

## Design system (2026-10-19, "more aesthetic + character" pass)

- **`data.js`**: every taxed state (42 of 51 — all but the 9 no-income-tax
  states) now has `incomeTax.bracketsSingle`: an array of
  `{ rate, upTo }` pairs, single-filer, same shape as
  `FEDERAL.incomeTax.bracketsSingle`. Flat-tax states get a one-entry
  array (`upTo: null`); progressive states get the full ladder. This
  powers the real bracket table in the dock — `bracketTableHTML()` in
  `app.js` renders a `<table>` from it (or a one-line "flat rate" note
  for a single-entry array, or nothing for a no-tax state). If you ever
  add a new state field that needs this granularity, follow the same
  `{ rate, upTo }` shape rather than inventing a new one.
- **Categorical color system**: the 8 dock sections (income tax, local
  tax, disability, paid leave, UI, minimum wage, reciprocity, workers'
  comp) each get one hue from the dataviz skill's validated 8-hue
  categorical palette, assigned in **fixed source order** (never cycled —
  see `--cat-*` tokens in `style.css`, light + both dark blocks). Each
  section's left border and icon (`CATEGORY_ICONS` in `app.js`, via
  `catIcon()`) pick up that color through a `.dock-cat-*` class on the
  section wrapper. Adding a 9th section would need a new hue decision,
  not just reusing one — the skill's categorical slots cap out around 8
  before CVD-safety guarantees degrade.
- **Logo mark**: a small rounded-square badge (navy + lighter-blue
  diagonal wedge, a dashed white line as the literal "state line," a
  white dot) — inline SVG, duplicated in `index.html`'s header
  (`.logo-mark`) and in the Quagmire hub tile (`ai-slop/index.html`'s
  `.st-mark`, inside the tile's own inline map SVG). Keep both copies in
  sync if the mark ever changes; it's intentionally the same icon in
  both places for brand continuity between the hub and the app.
- **Fonts**: `--font-display` (Unbounded, loaded alongside Fraunces/
  Inter/JetBrains Mono) is reserved for the brand wordmark only — the
  header `<h1>`, the dock's state-name `<h2>` on its colored banner, and
  the hub tile's label. Section headings elsewhere (`"Color the map
  by…"`, `"What do these terms mean?"`, etc.) stay on `--font-serif`
  (Fraunces) — don't swap those to Unbounded, the pairing is deliberate
  (Unbounded = brand/identity moments, Fraunces = editorial body
  headings).
- **Dock header banner**: `.dock-header` is a full-bleed gradient block
  (negative-margined to `.dock-inner`'s own padding, so don't change that
  padding without checking this still lines up) using a fixed brand-blue
  gradient — deliberately NOT tied to the state's own map color/metric,
  since the dock can stay open across a metric change and re-deriving the
  banner color live added complexity for little payoff.
- **Background texture**: `body` has a very low-opacity dot-grid
  (`radial-gradient` repeating at 22px) behind everything — subtle on
  purpose, should read as texture, not pattern, in both themes.

## Compare view (2026-10-19, "visualize the data better" pass)

The compare overlay (`renderCompareContent()`) used to be a plain text
table — user feedback was that it didn't feel like it was "really
working" even though it was, mechanically; the real problem was the
output had no visual structure. Rebuilt around three pieces, all keyed
off `SERIES_VARS` (comparison-slot colors 1–3, the first three
categorical hues — the only subset the dataviz skill validates
all-pairs CVD-safe, which is exactly this "up to 3 things side by side"
case): a grouped horizontal bar chart per numeric metric
(`compareBarChart()`, for top income tax rate / minimum wage / UI wage
base), a yes/no matrix for boolean facts (`renderCompareMatrix()`), and
a row of per-state detail cards with a full bracket table each
(`renderCompareDetailCards()`, reusing `bracketTableHTML()` from the
dock). The same slot colors carry through the state chips at the top,
the bars, the detail cards' top border, and the compare tray's chips —
assigned by **selection order**, not state identity, since the compared
set changes every time.

Two small compare-mode robustness fixes landed alongside this: clicking
a 4th state while already at the 3-state cap now shakes the tray
(`shakeCompareTray()`) instead of silently doing nothing, and the
"Compare →" button pulses once (`pulseCompareGo()`) the moment a 2nd
state is added, so it's obvious there's now something to click. (Turning
on Compare mode also closes an open dock, though in practice the dock's
own full-screen scrim already blocks every other click while it's open,
so a user can never actually reach the toggle with a dock open — this is
defensive, not reachable in normal use.)

## Map styling (2026-10-19, "more professional, less AI-generated" pass)

Two changes to `.map-wrap`/`#us-svg-map`, both in `style.css` + the SVG's
own attributes in `index.html`:

- **Height**: `.map-area` went from `align-items: start` to `stretch`,
  and `.map-wrap` is now a flex column with `#us-svg-map { flex: 1 1
  auto; min-height: 0; }` — the map card now always matches the side
  column's height (legend + ranked list + tray) instead of stopping
  short and leaving a gap. **`preserveAspectRatio` is `xMidYMid meet`**
  (centered, fully uncropped) — a same-day follow-up tried `xMidYMid
  slice` (crop-to-fill) to avoid letterbox margins, but that cropped the
  map's edges, and the user flagged it as looking "cut off." Reverted:
  `meet` shows 100% of the map, letterboxed/centered within the taller
  card, with the card's own radial-gradient background showing through
  the margin instead of flat empty space. Don't switch back to `slice`
  for this reason — it was deliberately tried and rejected.
- **Choropleth palette**: `--seq-1`..`--seq-6` and `--map-fill-yes` (in
  all three light/dark token blocks) were swapped from the saturated
  "SaaS blue" ramp to a muted, desaturated slate-to-ink-navy ramp —
  deliberately *not* the same hue as `--accent`/`--cat-income`/
  `--series-1` (those stayed the vivid brand blue; this was a
  map-specific complaint, not a full rebrand). Still one hue, light→dark
  monotonic, same method as the dataviz skill's default — just a more
  editorial/muted instance of it. If the map ever needs re-tuning again,
  change only these tokens; don't touch the brand accent tokens unless
  asked separately.

## State breakdown moved inline (2026-10-19, "below instead of a pop up")

The per-state profile was a slide-in panel (`<aside class="dock">`, fixed
position, `transform: translateX`, a full-screen `.dock-scrim` behind it)
— the user described this as feeling like "a pop up" and asked for it
inline instead. It's now a normal section in the page flow:

- **`index.html`**: `<section class="breakdown-section">` sits right
  after the map section (before the federal strip), containing
  `<div class="breakdown-panel" id="state-breakdown">` →
  `#state-breakdown-content`, which `renderStateBreakdown()` fills. No
  more `#dock`, `#dock-scrim`, `#dock-close`, `#dock-inner` — all
  removed, don't recreate them.
- **`app.js`**: `openDock(abbr)` → `selectState(abbr, scroll = true)`,
  which fills `#state-breakdown-content` and (unless `scroll` is
  `false`) calls `scrollIntoView({ behavior: "smooth" })` on the section
  — so clicking a state from anywhere (map, ranked list, search) brings
  the result down to you instead of sliding a panel over the page.
  `closeDock()` → `clearSelection()`, now triggered by an explicit
  "✕ Clear" button (`data-action="clear-selection"`, delegated in
  `initBreakdown()`) rather than a scrim click or Escape, since there's
  no overlay to dismiss anymore. **NY is pre-selected on page load**
  (`selectState("NY", false)` at the end of the init sequence) so a
  first-time visitor sees a filled-in example immediately instead of an
  empty placeholder — the `false` skips the scroll since there's nothing
  to scroll to yet on initial load.
- **Tax stack, v1 → replaced same day**: the first version
  (`taxStackHTML()`) showed each layer's top MARGINAL bracket rate
  (federal 37%, etc.) stacked together. The user flagged this almost
  immediately as misleading — 37% is the rate on income over $640,600,
  not "your" rate — so it was replaced by the salary calculator below.
  `taxStackHTML()` no longer exists; don't resurrect a top-rate-only
  summary as the headline number for "what will I actually pay."
- **Category grid**: what used to stack single-column in the narrow dock
  is now `.breakdown-grid`, a `repeat(auto-fit, minmax(300px, 1fr))`
  responsive grid (collapses to 1 column on mobile) — reuses the same
  `.dock-section`/`.dock-cat-*`/`.dock-fact` class names from before,
  just in a wider container, so don't rename those classes without
  checking both this grid and nothing else that might reference them.
- **Federal section also expanded** in the same pass ("breakdown this
  section further"): `#federal-bracket-table` now renders the real
  7-bracket federal table via the same `bracketTableHTML()` the state
  breakdown uses, in its own `.federal-income-block` above the 3
  remaining summary cards (Social Security / Medicare / FUTA — income
  tax's own card was removed from that grid since it has its own block
  now).

## Salary calculator (2026-10-19, replaced the top-marginal tax stack)

`computePaycheck(s, salary)` is the real math — a standard progressive
bracket calculator (`computeBracketTax(brackets, income)`: sums tax
owed through each bracket up to `income`, not `income * top rate`)
applied to federal (minus the federal standard deduction — we don't
model state-specific deductions, flagged in the UI via
`.paycheck-note`), FICA (Social Security capped at the wage base, plus
Medicare with the 0.9% additional-Medicare kicker over $200k), state
(flat-rate states just multiply; progressive states use
`incomeTax.bracketsSingle`), and local (uses `localTax.bracketsSingle`
where it exists — **only NY has this**, the real NYC bracket ladder,
since NYC is the flagship example this whole app is built around; every
other local-tax state falls back to `localTax.topRate` as a flat
approximation, flagged with "(approx.)" in the label and a
`.paycheck-note` under the bar).

- **`state.salary`** (default `65000` — a round, defensible "example"
  full-time-worker figure, not tied to any one state) persists across
  state switches, so comparing NY vs. TX at the same salary doesn't
  require retyping it.
- **`salaryBoxHTML()`** renders the `#salary-input` text field — always
  pre-filled with a real computed example (never an empty placeholder
  the user has to clear first). `initBreakdown()` listens for `input` on
  it (live, every keystroke) and re-renders *only*
  `#paycheck-breakdown`'s innerHTML, not the whole breakdown section —
  critical, because replacing the input element itself on every
  keystroke would steal focus/cursor position. Reformatting with commas
  happens on `focusout` (bubbles, unlike `blur`, so one delegated
  listener on `#state-breakdown-content` catches it) rather than on
  every keystroke, so the user isn't fighting a cursor that jumps around
  while they type.
- **`paycheckBreakdownHTML()`** renders one stacked bar
  (`.paycheck-bar`/`.paycheck-segment`, width % of each segment relative
  to gross salary) plus a line-item legend with both the dollar amount
  and effective % — take-home first (green, `--good`), then federal
  (muted gray), FICA (`--cat-reciprocity`, violet — deliberately NOT
  reusing the state-tax blue, an earlier pass had FICA in
  `--accent-ink` and it read as too close to `--cat-income` in dark
  mode), state (`--cat-income`, blue), local (`--cat-local`, orange).
  State/local segments are omitted entirely for a no-income-tax state
  (not shown as a 0%-width segment) — check `s.incomeTax.type !==
  "none"` / `s.localTax.exists` before pushing into the `segments` array.

## Testing this project

No test suite — it's static content + DOM manipulation. The real
verification that caught the bug above was driving it with Playwright
(`chromium.launch()`, no project dependency — installed ad hoc in a
scratch folder, not checked into this repo) against a plain
`python3 -m http.server`, then screenshotting every major interaction
(map paint, state click → inline breakdown, metric switch, compare overlay, search,
dark-mode toggle) and reading `console --errors`. If you make a UI change
here, that's the fastest way to catch a real browser bug instead of a
plausible-looking static read.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site (linked from "The Quagmire" hub at the `ai-slop/` root, tile
`data-theme="stateline"`). No environment variables, API keys, or build
step required.
