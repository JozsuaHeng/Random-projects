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
  `NAME_SUFFIXES`/`TECH_WORDS` equivalents), `PALETTES` (16 curated
  ink+accent pairs, each with a `moods` array used by keyword matching —
  see below), `LINE_PATH_TEMPLATES` (6 hand-authored single-stroke icon
  paths on a 0–100 grid for the Line Mark category, each a `{d, nodes}`
  object — `nodes` are that path's own hand-picked vertices, since pulling
  real coordinates back out of arbitrary SVG path data isn't worth the
  code; `renderLine()` draws a dot at each one), `PAPER`/`INVERSE_INK`/
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
  - **Detail layers / `elaborate`** — every renderer except `renderFlourish`
    takes a trailing `elaborate` argument. `undefined` (what every normal
    caller passes, by just not passing a 5th argument at all) means "draw
    the extra detail" — a framing ring and 3 orbit dots for Geometric, an
    inset ring for Monogram, 12 radial tick marks for Badge, a scaled-down
    faint echo of the path plus a dot at each of the template's `nodes`
    for Line Mark, a framing ring and a second small dot for Negative
    Space. Only an explicit `false` turns these off, and the only caller
    that ever passes it is `renderMark`'s own `"combo"` case recursing
    into `spec.inner` — a combination mark's icon stays compact next to
    its wordmark instead of getting as busy as a standalone mark. If you
    add a new detail layer to one of these renderers, gate it behind
    `elaborate !== false` the same way, not a bare truthy check — `false`
    is the only value that should ever suppress it, and only from that one
    call site. This is also what the user meant by "more complexity" when
    they first flagged it: Line Mark in particular used to be one bare
    stroke and nothing else, which read as too sparse next to every other
    category's multi-element compositions.
  - **`ornate`/`extreme` — two denser tiers on top of `elaborate`**
    (`rollDetail()`: `ornate = Math.random() < ORNATE_CHANCE` (0.35), then
    `extreme = ornate && Math.random() < EXTREME_CHANCE` (0.4) — extreme
    is only ever reachable *through* ornate, never on its own, so there's
    no jump straight from plain to extreme). `elaborate` is "on for every
    standalone mark, off only for combo's inner icon" — a structural
    switch. `ornate`/`extreme` are variety switches (~35% and ~14% of
    results respectively), added because the user specifically wanted
    *some* generations to come out extremely detailed, not *every* one
    uniformly bumped up a notch — `extreme` exists because after shipping
    `ornate` alone, that's exactly what they asked for again: still not
    detailed *enough*, for at least some results. Every ornate/extreme
    addition is gated **inside** an `elaborate`-gated block (never
    standalone), so a combo icon can never accidentally go ornate even
    though its inner spec might technically carry `ornate: true` — the
    `detailed &&`/`elaborate !== false &&` guard must stay the outer
    condition on anything added here. Roughly, per category: Geometric
    gets a second ring, the orbit dots going from 3 to 8 with thin spokes
    to center (ornate), then a 24-tick fine ring around the outside
    (extreme); Monogram gets a third outer ring and 4 cardinal ticks
    (ornate), then 4 more diagonal ticks (extreme); Badge gets a second
    set of 12 finer alternating ticks plus 4 cardinal dots (ornate), then
    a third even-finer tick ring (extreme); Line Mark gets a third nested
    echo plus a ring halo around each node (ornate), then a *fourth*,
    smaller-still echo (extreme); Negative Space gets a dashed outer ring
    plus a third interpolated dot (ornate), then a fourth, further-out dot
    (extreme). Wordmark doesn't get either flag — see "Compositional
    variety" below for what it gets instead.
  - **Compositional variety, not just parameter variety** — added after
    `ornate`/`extreme` alone still wasn't enough differentiation: the
    underlying *structure* was still one template per category, so
    results kept reading as "the same logo, recolored" after a few
    generates. The fix wasn't more detail on top of one template, it was
    more templates:
    - **Geometric's `layoutKind`** (`generateGeometricSpec()`, one of
      `GEOMETRIC_LAYOUTS`) is five genuinely different arrangement
      algorithms, not five parameter presets: `"layered"` (the original —
      3 shapes, decreasing size, near center), `"radial"` (3–6 same-size
      shapes evenly spaced in a ring, `renderRadialShapes`), `"scatter"`
      (3–5 shapes at random spread positions, optionally connected by thin
      lines, `renderScatterShapes`), `"grid"` (a 2×2 or 3×2 lattice,
      `renderGridShapes`), `"cascade"` (3–4 shapes decreasing size along a
      diagonal, `renderCascadeShapes`). Each renderer is a pure function
      of fields already rolled once in `generateGeometricSpec()` (position,
      count, direction) — **never call `Math.random()` inside a layout
      renderer**, only in the spec generator, or regenerating the palette
      (which re-renders with the same spec) would silently reshuffle the
      shapes too. A spec saved before `layoutKind` existed has no such
      field; `renderGeometric` defaults a missing one to `"layered"`
      rather than crashing.
    - **The shape vocabulary itself grew from 5 kinds to 8**
      (`SHAPE_KINDS`): added pentagon, octagon, and star (`starPoints()`,
      an alternating-radius polygon — an ordinary regular polygon can't
      produce a star's concave points). `pickShapesDistinct(pool, n)`
      draws `n` different kinds from that pool per spec.
    - **Badge's `containerKind`** can be `"seal"` (the original concentric
      rings) or `"shield"` (`SHIELD_PATH`/`SHIELD_PATH_INSET`, a heraldic
      outline — genuinely different silhouette, not a parameter change on
      the seal) — `renderBadgeSeal`/`renderBadgeShield`, dispatched by
      `renderBadge`. A shield skips the ribbon paths at the bottom (its
      own point already reads as the "crest" shape) and shifts the letter
      up slightly to sit inside the narrower top of the outline. Missing
      `containerKind` (pre-existing saved data) falls back to `"seal"`.
    - **Line Mark's `generatedPath`** is a 7th path option alongside the 6
      hand-authored `LINE_PATH_TEMPLATES`: `generateRandomLinePath()`
      picks 3–5 random points, sorts them left-to-right, and connects them
      — genuinely unique each time rather than one of only 6 possible
      shapes forever. `renderLine` reads `spec.generatedPath ||
      LINE_PATH_TEMPLATES[spec.pathIndex]` — old saved specs have
      `pathIndex` set and no `generatedPath`, so they fall through to the
      template lookup unchanged.
    - **Negative Space's `cutKind`** (circle/square/diamond/hex, via
      `shapeMarkup`) replaces the always-circles crescent — the technique
      (draw the shape in ink, draw the same shape offset in the canvas
      color to "cut" it) works identically for any shape, not just
      circles. Missing `cutKind` falls back to `"circle"`.
    - **A real bug this surfaced**: `shapeMarkup`'s "square" and
      "diamond" kinds used to both get the same `+45°` rotation
      correction, which made them render as the *exact same shape*
      whenever called with the same rotation — silently cutting the
      8-kind vocabulary down to 7 distinct-looking ones. Only "square"
      needs the correction (a regular 4-gon at rotation 0 already sits
      point-up, i.e. already looks like a diamond); fixed by removing
      "diamond" from that condition.
    - **`PALETTES` grew from 10 to 16** (data.js) — six more curated
      ink+accent pairs in hues the original 10 didn't cover (emerald, sky
      blue, magenta, olive, plum, slate), each with its own `moods` for
      keyword matching. Same reasoning as everywhere else color-related in
      this file: never raw random RGB, more curated options instead.
  - **The wordmark's own color — the actual root cause of "everything
    looks the same."** After a full pass adding five geometric layouts,
    three more shape kinds, a shield badge, procedural line paths, and a
    16-palette bump, the user reported no perceptible improvement. The
    reason: `.stage-wordmark`'s CSS was `color: var(--ink)` — the app's
    own light/dark *theme* neutral, completely unrelated to whichever of
    16 palettes had just been picked. The single biggest, most
    eye-catching element on the stage never changed color, no matter how
    much mark-level variety shipped underneath it. Fixed in
    `renderStage()`: `wordmarkEl.style.color` is now set explicitly from
    the palette (inline style, so it overrides the CSS class regardless
    of specificity), either `wordmarkInkColor(palette.ink)` — `palette.ink`
    in light app-theme, `INVERSE_INK` in dark (same "ink flips, accent
    doesn't" logic the mark's own on-light/on-dark swatches already use,
    since `palette.ink` is only ever designed to read against a *light*
    surface) — or, ~35% of the time, `palette.accent` outright, gated by
    `pickWordmarkColorRole()` checking `contrastRatio()` against the
    stage card's own background first, so an accent that wouldn't read
    well as hero-sized text just never gets offered that role. Whichever
    role the text *didn't* take becomes `--wm-accent` (the
    treatment-underline rule color), so text and its own underline never
    end up the same color. Rolled into `state.wordmarkColorRole` alongside
    `wordmarkTreatment` (in `rollFresh()` and `regenWordmark()`) and
    threaded through `recent`/`favorites` the same way — `rollFresh()`
    had to be reordered to resolve the palette *before* the wordmark now,
    since the color-role decision needs that generation's final accent.
    Missing `wordmarkColorRole` on an old saved favorite falls back to
    `"ink"`.
  - **`accentDominant`** — a second, independent color-variety lever
    alongside the wordmark fix: Geometric (all five layouts), Monogram,
    and Badge (both seal and shield) now each roll their own
    `accentDominant` (~35%) that swaps which color plays the
    "large/dominant" role and which plays "secondary accent" — resolved
    through local `c1`/`c2` variables at the top of each renderer rather
    than reading `ink`/`accent` directly, so the same shape/layout/palette
    combination can still read as two visibly different results: mostly
    neutral with a small color pop, or mostly the bright accent color
    with the neutral as the pop. Missing `accentDominant` on an old saved
    spec is falsy, same as any other boolean flag added this way — `c1`/
    `c2` just resolve to the original always-`ink`-dominant behavior.
  - **Engraved/hatched fill (`hatchedFill()`, `spec.texture`) — the actual
    answer to "these are just flat shapes."** More rings and dots around
    a flat-filled circle still reads as a flat-filled circle; the fix was
    changing what "filled" means, not adding more around it. `texture` is
    `null` ~55% of the time (plain flat fill, still the more common
    default) or `{ angle, spacing, cross }` the rest — when present,
    `shapeMarkup()`'s 8th argument, filled shapes render as parallel (or,
    when `cross` is true, cross-hatched) fine lines clipped to the
    shape's own outline via an SVG `<clipPath>`, instead of a flat
    `fill="color"`. **`<clipPath>` ids must be unique across the whole
    HTML document, not just within one `<svg>`** — Recent chips,
    Favorites, and a generation's own primary + inverse swatch can all be
    separate inline `<svg>` elements on the page at once, so
    `hatchIdCounter` is a plain incrementing module-level counter, not
    per-render or per-spec state. Wired into Geometric (every filled
    shape in all five layouts), Monogram (the container, only when
    `filled` — nothing to hatch on an outline-only container), Badge (the
    seal's inner circle / the shield's inset), and Negative Space (the
    *base* shape only — the cutout has to stay a flat solid fill exactly
    matching the canvas color, or the negative-space illusion breaks, so
    it's the one filled shape in this codebase that must never take a
    texture regardless of the spec). A spec's `texture` object is
    generated once by `rollTexture()` and reused for every hatch call
    that spec makes, so a mark's "grain direction" reads as one
    considered choice, not a different angle per shape.
  - **Laurel wreath (`renderLaurel()`, `spec.laurel`, seal Badge only)** —
    a different kind of detail from everything else in this file: not
    another ring or tick pattern on the same three circles, but ~10 small
    leaf ellipses individually placed along the outside of each side of
    the seal (220°→320° on one side, its mirror 140°→40° on the other,
    same clockwise-from-top angle convention as the tick-mark loops).
    This is what "more detail" turned out to actually mean on a second
    pass: more *elements*, not more layers of the same few elements.
    Shield doesn't get one — wrapping a wreath around a silhouette that
    doesn't match its own outline risked looking disconnected rather than
    detailed, untested since there's no way to preview it here; seal's
    circular ring gives the wreath's own arc something to sit flush
    against.
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
    **This means a saved favorite's `markSpec` can outlive a shape change
    to that spec** — a real one already happened (Wordmark's flourish
    spec went from a singular `treatment` string to a `treatments` array;
    `renderFlourish` falls back to the old singular field so an
    already-saved favorite doesn't crash instead of render). `recent`
    never has this problem since it's rebuilt fresh every page load. Any
    future change to a spec's shape needs the same kind of fallback, or a
    version-bumped storage key, if it should keep working for favorites
    saved under the old shape.
- `style.css` — palette is CSS custom properties (`--paper`, `--ink`,
  `--accent`, etc.), same pattern as NewCo's `--bg`/`--ink`/`--accent` set.
  `.crop`/`.crop-tl`/`.crop-tr`/`.crop-bl`/`.crop-br` draw the four L-shaped
  crop-mark ticks on the stage card via absolutely-positioned spans with
  `::before`/`::after` line pairs — this exact technique is reused (with
  its own class names) on the hub tile, see below.
- `favicon.svg` — a static (non-generated) triangle-behind-circle mark
  (ink triangle, crimson `#c23b2e` circle) on a paper rounded square; the
  same `viewBox="0 0 100 100"` shapes at the same coordinates are inlined
  again as `.mark` in the header brand, and a third time (same
  coordinates again) on the hub tile — see "Deployment" below. All three
  are the same fixed "Insignia's own logo," not a sample of generator
  output, same reasoning NewCo used for its own "N" mark; keep the three
  copies' `<polygon>`/`<circle>` numbers identical if this ever changes
  again, since that's what makes them read as one mark at three sizes
  rather than three different marks. **The three copies are not
  color-identical, though, and that's deliberate.** `favicon.svg` and the
  hub tile's copy both sit on their own fixed light "card" background
  (the favicon's own `<rect fill="#f7f4ec">`, the tile's `.insignia-card`),
  so a hardcoded `#1c1c1c` triangle is always readable there regardless of
  the surrounding page's theme. The header's `.mark`, by contrast, sits
  directly on the page background with no card behind it — a hardcoded
  `#1c1c1c` triangle there went invisible the moment dark mode shipped,
  since dark mode's `--paper`/`--paper-elevated` are themselves near-black.
  Fixed by making the header copy's polygon `fill="currentColor"` and
  setting `.brand .mark { color: var(--ink); }` in style.css, so it tracks
  the same light/dark ink flip every generated mark's own on-light swatch
  already relies on. The circle stays hardcoded crimson in all three
  copies — it reads fine on both light and dark, and it's the one color
  that visually ties the three together as one mark.
- **Palette hex codes** — `renderStage()` writes `palette.ink`/
  `palette.accent` as uppercase hex text (`#hexInk`/`#hexAccent`) right
  next to their swatch dots, so a result's exact colors are always on
  screen, not just implied by the dots. `INVERSE_INK`/`INVERSE_BG` aren't
  shown here even though they're what the dark swatch actually renders
  with — they're fixed constants, not part of the chosen palette, so
  showing them next to "the palette's colors" would be misleading rather
  than informative.

## Layout (sidebar + generator, not a single scrolling column)

`<main>` is `.workspace`, a two-pane flex row: `<aside class="sidebar">`
(every *input* — style chips, seed word, business-details panel, lock
row) on the left, `<section class="generator">` (every *output* — the
stage, the hint line, actions, Recent, Favorites) on the right. This
replaced an earlier single centered column where switching styles meant
scrolling back up past the whole result section — the complaint that
drove the redesign. `.sidebar` is `position: sticky; top: 24px;
align-self: flex-start;`, so the controls stay in view while Recent/
Favorites grow the right column taller through use; `align-self:
flex-start` specifically is what stops the sidebar being stretched to
`.generator`'s full height by the flex row's default `align-items:
stretch`, which is what actually lets it float instead of just sitting
pinned at a fixed height. Below 860px (`@media (max-width: 860px)`) the
row collapses to a single stacked column — sidebar first, generator
below, sticky positioning dropped, category chips reverting from a
vertical sidebar list back to horizontal wrapped pills — since the
side-by-side-scroll problem doesn't exist in a narrow single column
either.

**None of this touched `app.js`.** Every element kept its existing `id`;
only the wrapping structure and CSS layout changed. If a future layout
pass moves things around again, prefer the same discipline — reparenting
`#chips`/`#seedInput`/etc. is free, renaming their `id`s is not (every
`getElementById` call in app.js would need to move with it).

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

Open `index.html` directly in a browser — no server needed. `body` carries
`zoom: 1.15` in style.css (the default 1x read small on a real screen) —
deliberately `zoom`, not `transform: scale`, so layout still reflows
instead of just visually stretching; supported in all current evergreen
browsers.

## Verifying a change to the generator without a browser

There's no test suite, but `data.js` + `app.js` are plain functions with
no DOM access until the `DOMContentLoaded` block at the bottom — load
them into a Node `eval` (both files' source concatenated into *one* eval
call, since direct `eval`'s `const`/`function` bindings don't leak out of
separate calls) with that trailing block stripped, then call
`generateMarkSpec()`/`renderMark()` directly in a loop. This is how a real
bug in `renderRadialShapes()` got caught before it shipped: `cx`/`cy` were
pre-formatted with `.toFixed(1)` (fine for a circle, which just
interpolates them into a template string) before being handed to
`shapeMarkup()`, which for every *other* shape kind does real arithmetic
on them (`cx + r*Math.cos(a)` inside `polygonPoints()`) — string +
number silently concatenates instead of adding, and the result has no
`.toFixed` method, so it only threw for non-circle shapes in that one
layout. A few hundred generate+render calls per category surfaces this
class of bug immediately; eyeballing the stage in a browser might not,
since it would only show up on some category/layout/shape combinations.
Also worth running after any spec-shape change: construct a spec by hand
in the old (pre-change) shape and render it, to confirm favorites saved
under that old shape still work — see the `markSpec` shape-change note
under Favorites above.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site. Linked from "The Quagmire" hub (`../index.html`,
`data-theme="insignia"` in `../style.css`). The tile deliberately avoids
both patterns already in the grid — full-bleed dark illustration (most
tiles) and light graph-paper card (`playbook`, the only other light tile)
— by floating a small rotated paper "spec swatch" (a static triangle+circle
mark, not sampled generator output, same reasoning as NewCo's seal tile)
on a near-black tile background, with the same corner crop-marks the app
itself uses on its stage card, and a small monospace "Logo #39 — Insignia"
caption standing in for a title instead of a normal `.art-title` headline
— reinforcing the print-production idiom at tile scale, not just inside
the app. This tile's mark (ink triangle + crimson circle) is also the
canonical version of Insignia's own fixed logo — the header `.mark` and
`favicon.svg` were updated to match it exactly rather than the other way
around, after this tile's look was singled out as the one to keep.
