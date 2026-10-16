# CLAUDE.md

## What this project is

**Paycheck Atlas** — an exhaustive, state-by-state map of how a paycheck
differs across all 50 states + DC: state income tax (including local/city
layers), Social Security & Medicare (federal, shown as a baseline), state
disability insurance, paid family/medical leave, unemployment insurance
(employer-paid), minimum wage, interstate tax reciprocity, the "convenience
of the employer" rule, and workers'-comp/overtime quirks.

Built from a real problem: the user is job-hunting in NYC and noticed a
separate NY State tax *and* a separate NYC resident tax stacked on top of
federal withholding — the "spotlight" section at the top of the page exists
specifically to explain that (NY state tax → NYC resident tax → the
"convenience of the employer" rule that catches NJ/CT remote workers), and
the map's default view and the hero CTA both point at a live NY/NJ/CT
comparison.

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
  - `state.compare` caps at 3 (`toggleCompare`); the spotlight's "Compare
    NY · NJ · CT" button just hardcodes that array and calls
    `openCompare` directly, bypassing the tray.
- **`style.css`** — light/dark via the same convention used elsewhere in
  this repo: OS preference by default (`@media (prefers-color-scheme:
  dark)` scoped to `:root:not([data-theme="light"])`), overridable by the
  header toggle via `:root[data-theme="dark"]`/`[data-theme="light"]`,
  persisted to `localStorage["paycheck-atlas-theme"]`.
  **Gotcha already hit once**: `.compare-overlay`/`.modal-overlay` set
  `display: flex` unconditionally for centering — that silently overrides
  the browser's built-in `[hidden] { display: none }` default (same
  specificity, author CSS wins), which made the whole page unclickable
  the first time this shipped. Fixed with an explicit
  `.compare-overlay[hidden], .modal-overlay[hidden] { display: none; }`
  override. If you add another overlay/modal that's toggled via the
  `hidden` attribute (not a class), it needs the same explicit override —
  don't rely on the browser default once you've set `display` in CSS.

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
`data-theme="paycheck"`). No environment variables, API keys, or build
step required.
