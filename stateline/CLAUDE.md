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
  - The right-side **dock** (`openDock`/`renderStateDockContent`) is the
    full per-state profile; the **compare overlay** (`openCompare`/
    `renderCompareContent`) renders the same categories as a table for up
    to 3 states at once. Both read straight from `STATES`, so a `data.js`
    edit shows up in both places automatically.
  - `state.compare` caps at 3 (`toggleCompare`); the hero's "Try NY vs NJ
    vs CT" chip just hardcodes that array and calls `openCompare`
    directly, bypassing the tray. **Compare mode**
    (`state.compareMode`, toggled by `#compare-mode-toggle`) changes what
    a map click does: off (default) opens the dock, on calls
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

## Testing this project

No test suite — it's static content + DOM manipulation. The real
verification that caught the bug above was driving it with Playwright
(`chromium.launch()`, no project dependency — installed ad hoc in a
scratch folder, not checked into this repo) against a plain
`python3 -m http.server`, then screenshotting every major interaction
(map paint, state click → dock, metric switch, compare overlay, search,
dark-mode toggle) and reading `console --errors`. If you make a UI change
here, that's the fastest way to catch a real browser bug instead of a
plausible-looking static read.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site (linked from "The Quagmire" hub at the `ai-slop/` root, tile
`data-theme="stateline"`). No environment variables, API keys, or build
step required.
