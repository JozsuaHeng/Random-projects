# CLAUDE.md

## What this project is

**Insignia** — NewCo's sibling: a logo/mark generator instead of a name
generator. Pick a style (Geometric, Monogram, Badge & Crest, Line Mark,
Negative Space, Wordmark, Combination, or All) and it produces a mark (an
SVG icon), a wordmark (a generated brand name in a matching type
treatment), and a palette (a curated ink+accent pair) — shown as a small
on-light/on-dark swatch pair with a deadpan "unauthorized recoloring is
prohibited" usage line underneath, the way a real brand-guideline PDF
would present a lockup.

Also does the thing NewCo can't: type your **actual business name** and a
few **keywords** describing it, and Insignia uses your name verbatim and
picks a style + palette that actually fits, instead of generating
something random. See "Business-details mode" below.

Same underlying mechanic as `../newco` throughout (category chips, a seed
word, one regenerate icon per field that touches only that field, a
Generate button that's the only action allowed to reroll everything, an 8-
entry recent history) — deliberately kept in sync so the two apps read as
one family. Where they differ structurally is documented inline below.

The design deliberately does **not** reuse NewCo's dark/amber/Fraunces
look. Insignia is a "print-production spec sheet": paper background with
a faint blueprint grid, corner crop-marks on the stage card, JetBrains
Mono for every technical annotation (category tag, palette name, usage
line, contrast line), Archivo for UI chrome and most wordmark treatments,
Playfair Display for the serif/italic treatment and the Badge category's
glyph. Single cobalt-blue UI accent (`--accent`) — unrelated to the
generated palette's accent, which is picked per result from `PALETTES` in
data.js. It ships in both light and dark: see "Theme" below — dark isn't
a NewCo-style reskin, it's the same spec-sheet idiom with the paper/ink
roles inverted, keeping the print-production feel in both.

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend — same as every
other project in this folder.

- **The core structural decision**: a mark's *shape* and its *color* are
  generated separately. `generateMarkSpec(categoryKey, name)` (app.js)
  returns a plain object describing what to draw — which shapes, which
  letter(s), which line-path index, rotation/jitter/mirror flags — with no
  color in it at all. `renderMark(spec, ink, accent, bg)` turns that spec
  into SVG markup for a given ink/accent/background. This split is *why*
  regenerating the palette can recolor the exact same mark instead of
  drawing a new one, and why the same mark renders correctly on both the
  light and dark swatch (see "on light / on dark" below) without ever
  generating two different-looking logos. Don't collapse these back into
  one function — every field's independent-regenerate behavior depends on
  the split.
- **Categories are logo *styles*, not industries** (unlike NewCo, where
  categories are industries). Style is the thing that actually changes the
  artwork — Geometric produces layered polygons, Badge produces a
  concentric-ring seal, etc. — so tying the chip directly to a recipe
  keeps mark and word choice internally consistent the same way NewCo's
  category ties word bank to industry. Each category still gets its own
  `roots` array in `CATEGORIES` (data.js), themed to the style's mood
  (heraldic words for Badge, fluid words for Line Mark, etc.) rather than
  an industry.
- `data.js` — `CATEGORIES` (7 style categories + `CATEGORY_KEYS` for "All"),
  `NAME_SUFFIXES`/`STUDIO_WORDS` (shared word banks, NewCo's
  `NAME_SUFFIXES`/`TECH_WORDS` equivalents), `PALETTES` (10 curated
  ink+accent pairs, each with a `moods` array used by keyword matching —
  see below), `LINE_PATH_TEMPLATES` (6 hand-authored single-stroke icon
  paths on a 0–100 grid, for the Line Mark category), `PAPER`/`INVERSE_INK`/
  `INVERSE_BG` (fixed colors for the on-light/on-dark swatches — these
  don't come from the palette, and don't change with the app's own
  light/dark theme either, see "Theme" below), `KEYWORD_MAP` (keyword →
  category, for business-details mode), and `usageLine(name)` — the
  deterministic "reproduction... requires written approval from Brand"
  line, same trick as NewCo's `domainLine()`: it's funnier for never
  varying, so don't templatize it further. Both `KEYWORD_MAP` entries and
  `PALETTES[].moods` only need to list one word form (e.g. "law") — see
  `keywordMatches()` in app.js, which matches by substring in both
  directions, so a typed "lawyers" still finds it.
- `app.js`:
  - **Name engine** — six weighted recipes (`pick`/`lastVowelDrop`/
    `suffixify`/`twoWordName`/`portmanteau`/`theRoot`) over
    `effectiveRoots()`, which folds a typed seed word in as 4 duplicate
    root-pool entries. This is copied down from NewCo almost verbatim
    (three fewer recipes — a logo tool leans on the mark more than the
    name) specifically so the two apps' "generate a plausible name" feel
    identical. Don't let it drift from NewCo's version without a reason.
  - **Business-details mode** (`resolveName`, `suggestCategoryFromKeywords`,
    `resolveCategory`, keyword-aware `pickPaletteIndex`) — a typed business
    name always wins over the generator, used verbatim (sanitized/
    title-cased, never remixed). Typed keywords are matched against
    `KEYWORD_MAP` to suggest a category and against each palette's `moods`
    to suggest a palette, but **only when "All" is the active chip** — an
    explicit chip pick is a stronger signal than an inferred one, so
    keywords never fight a category the user chose on purpose. This means
    keyword suggestions only ever apply inside `rollFresh()` (a full
    Generate), the same place NewCo's "All" category resolution lives —
    no new inconsistency, just a smarter version of the existing
    All-picks-something-random path. The seed-word input still works
    independently of all this; a business name simply makes it moot
    (`resolveName` checks the override first).
  - **Mark spec generation** (`generateMarkSpec`) — one function per
    category producing the shape/letter/path parameters described above.
    `markQuotesName(categoryKey, spec)` identifies when a mark's letters
    are derived from the current name (Monogram, Badge, or a Combo whose
    inner icon is a Monogram) — this is NewCo's name→description coupling,
    reapplied: `regenWordmark()` calls `generateMarkSpec()` again *only*
    when `markQuotesName()` is true, so a wordmark reroll never leaves a
    monogram quoting a name that's moved on, but never triggers a pointless
    mark reroll for categories where the two are unrelated (Geometric,
    Line Mark, Negative Space).
  - **Rendering** (`renderGeometric`/`renderMonogram`/`renderBadge`/
    `renderLine`/`renderNegspace`/`renderFlourish`, dispatched by
    `renderMark`) — pure functions from spec+colors to SVG markup string,
    for a `viewBox="0 0 100 100"` canvas. `renderNegspace` is the one
    renderer that needs to know the canvas background (`bg` param) —
    negative-space technique only works if the "cut" circle matches
    whatever it's sitting on, so it's rendered once against `PAPER` for
    the primary swatch and once against `INVERSE_BG` for the inverse one.
  - **On light / on dark** — `renderStage()` calls `renderMark()` twice per
    result: once with the palette's `ink` on `PAPER` (the primary, large
    canvas) and once with the fixed `INVERSE_INK` (near-white) on the
    fixed `INVERSE_BG` (near-black), both times with the *same* `markSpec`
    and the *same* palette `accent`. This mirrors how a real brand
    actually reverses a mark for dark backgrounds: the ink flips, the
    accent color doesn't. Both renders come from one spec, generated once
    — see the shape/color split above.
  - **State** — `activeCategory`/`categoryUsed` (as NewCo), `name`,
    `markSpec`, `wordmarkTreatment`, `paletteIndex`, `recent`/
    `historyIndex`. Same "no pinning, each field has its own regenerate
    icon, not clicking one means keep it" model as NewCo — see NewCo's
    CLAUDE.md for the two dead-end designs (pin+regen icon pairs) that led
    here; the reasoning transfers directly and isn't re-litigated in this
    file.
  - **Recent history thumbnails** — unlike NewCo's text chips, each
    `recent-chip` renders a small `renderMark()` call at chip scale
    instead of showing the brand name as text. A picture identifies a
    generated logo faster than its name would; the name is still there as
    a `title`/`aria-label` tooltip.
  - **Wordmark treatments** — `WORDMARK_TREATMENTS` (5 CSS classes:
    tracked-caps, italic serif, condensed, underlined, classic serif).
    Regenerating the wordmark picks a new name *and* a new treatment
    together (bundled the same way NewCo bundles name+description) since
    both live in the same "how the brand name presents" field. The
    underline treatment reads its rule color from a `--wm-accent` custom
    property set inline by `renderStage()`, since that's the one treatment
    that needs the *generated* palette's accent rather than the fixed UI
    accent.
  - **Export menu** — one "Export ▾" button (`#exportBtn`) opens a small
    popover (`#exportMenu`, plain absolute-positioned div, closed by an
    outside click, Escape, or picking an item) instead of three separate
    buttons crowding the action row. `Copy SVG` copies a standalone
    `<svg>` string (current mark, primary/light colors) to the clipboard —
    the more useful action here than NewCo's plain-text copy, since the
    whole point is to produce artwork. `Download SVG` (`downloadBlob()`)
    saves that same string as a file. `Download PNG` (`svgToPng()`)
    rasterizes it via an off-screen `<img>` + `<canvas>` at 512×512 —
    note this means Monogram/Badge's lettering can fall back to a system
    font in the PNG, since an `<img>`-loaded SVG doesn't reliably inherit
    the page's Google Fonts; not worth fixing by embedding font data for
    what this export is for. **Gotcha if you touch `.export-menu`'s
    CSS**: it sets `display: flex`, and an author-origin `display`
    declaration beats the browser's own `[hidden]{display:none}`
    regardless of specificity — there's an explicit
    `.export-menu[hidden] { display: none; }` rule for exactly this
    reason. Don't remove it without replacing the toggle mechanism too.
  - **Locks** (`state.locks`, the `.lock-toggle` row above the stage) —
    NewCo's CLAUDE.md documents why a pin icon bolted onto hero-sized
    brand text never read well (see its `.field-icon` note), and Insignia
    originally shipped without any pin/lock concept for the same reason.
    This row is the walk-back: instead of pinning inline next to each
    field, three small toggle pills sit in their own row, entirely away
    from the stage — same feature, without recreating the layout problem.
    A locked field is skipped by `rollFresh()` (Generate and a chip click
    both funnel through it) but **not** by that field's own regenerate
    icon — clicking a field's own icon is its own explicit "change just
    this" signal, stronger than the passive lock state, so it always
    works regardless of lock. A locked Monogram/Badge mark can drift out
    of sync with an unlocked wordmark that keeps changing underneath it —
    that's the literal, intentional meaning of "locked exactly as-is,"
    not a bug; unlock it to resync.
  - **Contrast line** (`contrastRatio`/`relativeLuminance`/`contrastBadge`,
    a standard WCAG relative-luminance formula) — checks the palette's
    `accent` against both `PAPER` and `INVERSE_BG`. Only `accent` is
    checked: `ink`/`INVERSE_INK` are fixed dark-on-light / light-on-dark
    pairs that are always safely high-contrast by construction, while
    `accent` is the one color reused verbatim across both swatches (see
    "On light / on dark" above) and can plausibly read poorly on one of
    them depending on the pair.
  - **Favorites** (`loadFavorites`/`saveFavoritesToStorage`, both
    `localStorage`-backed and wrapped in try/catch so a blocked/private-
    browsing store degrades to "favorites just don't persist" rather than
    throwing) — same entry shape as a `recent` entry, but added only on an
    explicit Save click and capped at 24 rather than a rolling last-8, so
    a result survives a reload the way `recent` deliberately doesn't.
- `style.css` — palette is CSS custom properties (`--paper`, `--ink`,
  `--accent`, etc.), same pattern as NewCo's `--bg`/`--ink`/`--accent` set.
  `.crop`/`.crop-tl`/`.crop-tr`/`.crop-bl`/`.crop-br` draw the four L-shaped
  crop-mark ticks on the stage card via absolutely-positioned spans with
  `::before`/`::after` line pairs — this exact technique is reused (with
  its own class names) on the hub tile, see below.
- `favicon.svg` — a static (non-generated) triangle-behind-circle mark on
  a paper rounded square; the same shapes are inlined again as `.mark` in
  the header brand. This is a fixed "Insignia's own logo," not a sample of
  generator output — same reasoning NewCo used for its own "N" mark.

## Theme (light / dark, follows the system by default)

Three states, cycled by the header's toggle button (`#themeToggleBtn`):
**System** (default — no `[data-theme]` attribute at all, so the page just
answers to `@media (prefers-color-scheme)` with no JS involved, including
live if the OS preference flips while the tab is open), **Light**, and
**Dark** (`[data-theme="light"]`/`[data-theme="dark"]` on `<html>`, saved
to `localStorage` under `insignia-theme`, explicit and sticky until cycled
back to System).

- `style.css`'s `:root` holds the light values (the default). A
  `@media (prefers-color-scheme: dark)` block guarded by
  `:root:not([data-theme="light"])` supplies the dark values when the
  system prefers dark and there's no explicit *light* override, and a
  plain `:root[data-theme="dark"]` block supplies the same values
  unconditionally for an explicit dark override regardless of system
  preference. This is the standard pattern for "follow the system, but
  let an explicit choice win" — don't collapse it to a single
  `[data-theme]`-only implementation, that would break the System state's
  whole point of tracking a live OS change with zero JS.
- A tiny inline `<script>` at the very top of `index.html`'s `<head>`
  (before the stylesheet `<link>`) reads `localStorage` and sets
  `[data-theme]` on `<html>` synchronously, before first paint. Without
  it, a stored override would flash the system-resolved theme for one
  frame before app.js's `DOMContentLoaded` handler corrected it. app.js's
  own `applyTheme()` call at init is mostly there to sync the toggle
  button's icon (`[data-state]`, one of three inline SVGs shown/hidden by
  CSS) — the attribute itself is usually already set by the time it runs.
- `--swatch-light`/`--swatch-dark` (used for the primary/inverse mark
  canvas backgrounds) are deliberately **not** part of the themed variable
  set — seeing "how this logo looks on white/black" has to stay true
  regardless of whether Insignia's own UI is currently light or dark, so
  they're fixed constants matching data.js's `PAPER`/`INVERSE_BG`, not
  `--paper`/`--ink`. This was a real bug in an earlier pass: the primary
  mark canvas had no explicit background and just sat on `.stage`'s own
  (themed) background, so it would have gone invisible-on-dark-on-dark
  the moment dark mode shipped. If you add another element that needs to
  represent "the light swatch" or "the dark swatch," reach for these two,
  not `--paper`/`--ink`.

## Running it

Open `index.html` directly in a browser — no server needed.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site. Linked from "The Quagmire" hub (`../index.html`,
`data-theme="insignia"` in `../style.css`). The tile deliberately avoids
both patterns already in the grid — full-bleed dark illustration (most
tiles) and light graph-paper card (`playbook`, the only other light tile)
— by floating a small rotated paper "spec swatch" (a static triangle+circle
mark, not sampled generator output, same reasoning as NewCo's seal tile)
on a near-black tile background, with the same corner crop-marks the app
itself uses on its stage card, and a small monospace "Fig. 01 — Insignia"
caption standing in for a title instead of a normal `.art-title` headline
— reinforcing the print-production idiom at tile scale, not just inside
the app.
