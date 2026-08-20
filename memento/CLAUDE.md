# CLAUDE.md

## What this project is

**Memento** — an existential/memento-mori calendar. You enter a date of
birth and a rough expected lifespan, and it visualizes your life as a
field of small flat squares on a warm, light card: some faint (already
lived), some in a solid accent color (still ahead), with a small
pulsing ring marker at "today." Below the headline number, a small
italic line always converts the precise remaining day count into a
relatable equivalent ("That's about 2,609 more weekends — or 618 more
full moons") regardless of which unit is currently displayed. Three
arrangements of the same dots (Grid / Constellation / Rings) and four
time units (Days / Weeks / Months / Years) are all togglable, and the
whole card can be exported as a PNG for sharing.

No backend, no accounts, no real actuarial data — the lifespan is a
user-adjustable guess (default 80 years), and the page says so
(footer: "An estimate, not a prediction"). This is a mood piece, not a
health tool.

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no dependencies — same
as every other project in `ai-slop/`.

- `index.html` — large italic "Memento" wordmark, minimal underlined
  date-of-birth + lifespan inputs, three segmented toggle groups
  (unit, mode, color theme), a `<canvas id="stage">`, and a
  text-only "Download image" action.
- `style.css` — warm light "sand" background (deliberately not dark,
  and deliberately not a pale near-white — see the eye-strain notes
  below), a single `--accent`/`--accent-bright` custom-property pair
  that the active color theme overwrites (see below), `Fraunces`
  italic (serif, for the wordmark and the big numbers), `JetBrains
  Mono` (labels/eyebrow), `Manrope` (body/UI) — deliberately not
  `Inter` everywhere, to avoid the generic-AI-tool look. Controls are
  intentionally chrome-light: no boxed panels, just underlined inputs
  and low-opacity pill toggles, so the visualization stays the
  dominant element on the page.
- `app.js` — all the logic. Key pieces:

### The canvas *is* the shareable card, at 1800×1200 (3:2 landscape)

`#stage` is a fixed-resolution `1800×1200` canvas. Everything the user
sees in the visualization area — eyebrow label, big number, subtitle,
the dots — is drawn directly onto it, at that same resolution,
regardless of how small or large it's displayed on screen (CSS scales
the whole bitmap up/down responsively, see below). That means
**export is just `canvas.toDataURL('image/png')`** — there's no
separate composition step for the downloadable image, because the
live view and the export are the same pixels. Keep it that way: if
you add new on-canvas content, it shows up in both places for free
(including "make everything 20% bigger," which only ever touched CSS
display sizes, not anything inside `app.js` — the whole bitmap just
gets scaled up by the browser). Don't build a second "export-only"
rendering path.

**This used to be `1080×1920` (portrait, Instagram Story shape).** It
was deliberately changed to landscape: a portrait card is inherently
narrow next to a landscape desktop monitor, and there's no way to make
it wider there without it also getting much taller than the viewport.
Landscape lets the card actually grow to fill real desktop width. If
"Instagram Story export" ever comes back as a request, treat it as a
*separate* need from "the on-screen card," not a reason to revert the
shape — e.g. a second export resolution/orientation option, not the
default.

### The stage fills the row it's in

`.stage-wrap` has `flex: 1 1 auto` (in both the mobile column layout
and the desktop row layout — not overridden per breakpoint), so it
always grows to fill whatever main-axis space its siblings didn't
claim: the rest of the column's height on mobile (nothing else is
beside it there), or the rest of the row's *width* next to `.panel` on
desktop (`@media (min-width: 860px)` in `style.css`). `.panel` is
`flex: 0 0 clamp(260px, 25vw, 460px)`-ish (~1/4 of the row), so
`.stage-wrap` — and therefore the card — gets the other ~3/4.

`.stage-frame` is then sized as `min(<up to ~98% of .stage-wrap>,
calc(<up to ~96vh> * 3 / 2))` — a plain **width** percentage of a
flex-grown container, which is safe/reliable, plus a viewport-height
cap (converted to width via the 3:2 ratio) so it doesn't get taller
than the screen on short windows. On mobile there's no sidebar so
`.stage-wrap`'s "remaining space" is just ~the full width, and the
vh-derived cap usually ends up the binding constraint instead — same
formula, different thing ends up limiting it.

**Do not switch the width cap to a "fill available space" *height*
technique** (e.g. `max-height: 100%` on `#stage`/`.stage-frame` inside
the flex parent) — that was tried and reverted once already. It needs
the flex item to have a *definite* height to resolve percentages
against, which isn't reliably true here (`.page` uses `min-height:
100vh`, not `height`), so `max-height: 100%` silently computed to
`none` and the canvas rendered at its full unclamped intrinsic height,
blowing out the page with a huge scroll. Percentage **widths** inside
a flex-grown container (what's used now) don't have this problem —
that distinction is why width-based sizing is used throughout instead
of height-based, even though the card's dominant axis is visually
"how tall can it get."

**Second gotcha hit along the way:** an earlier version tried
`.stage-wrap { flex: 0 0 auto }` (to *shrink* it to the card's width,
for a different centered-layout idea that's since been replaced). That
didn't work on its own — `.stage-wrap` still had `width: 100%` from
the base rule, and per spec `flex-basis: auto` defers to the `width`
property, so its basis silently resolved to 100% of the row regardless
of the `flex` shorthand, overflowing the viewport. If a "shrink/grow
this flex item" change stops working, check for a `width`/`height`
set elsewhere in the cascade first — it silently wins over
`flex-basis: auto`.

### Units are flat rounded squares, not glowing circles

The very first version drew each unit as a filled circle with a
per-unit `shadowBlur` glow on the "remaining" ones. At the unit counts
this app actually renders (up to `TARGET_DOTS`), that's hundreds of
overlapping blurred circles at high contrast against a near-black
background — which reads as a shimmering/vibrating grid to a lot of
people's eyes (the same family of effect as the "scintillating grid"
illusion), not just a stylistic quibble. It was reported as genuinely
uncomfortable to look at, not a preference.

Fixed by switching to `drawUnit()` — a plain filled rounded square via
`ctx.roundRect()`, **no `shadowBlur`/`shadowColor` at all**. Squares
alias less than circles at small sizes, and removing the per-unit glow
removes the overlapping-halo effect entirely. **This app has a
blanket "no `shadowBlur` on repeated elements" rule now** — the
pulsing "today" marker in `drawFrame()` originally kept a blurred
circle (single element, seemed harmless), but was later switched to a
plain stroked ring (`ctx.stroke()`, no shadow at all) once the
background went light — a colored blur glow reads as a soft *smudge*
on a light background rather than a glow, so it stopped looking
intentional. The ring pulses by animating its radius/alpha instead of
using blur for the "pulse" feeling. If you're ever tempted to add
glow/blur back anywhere on this canvas, don't — flat colors + a
measured pulse animation is the whole visual language now.

Squares alone didn't fully fix the eye strain, though. The first
follow-up kept a *dark* theme but lightened it (background moved off
near-black to a warm charcoal, dot brightness/alpha reduced) — that
still wasn't comfortable for everyone. **The background is now a
genuinely light, warm "sand" tone** (`#f3e7c9`→`#e6d29e` in the canvas
gradient, `--bg: #e9dcbc` for the page chrome around it) instead of
any shade of dark, with flat deep/saturated accent colors for contrast
(see `THEMES` below) instead of pale colors glowing on a dark base.
Two lessons from the back-and-forth: (1) shade-tuning a dark palette
has limits — if dark isn't working, try genuinely light rather than
"less dark"; (2) light backgrounds have their own failure mode to
avoid, which is reading as "boring"/washed-out if too close to white —
this uses a clearly-tinted sand/parchment color, not near-`#fff`, for
that reason specifically.

### Color themes are one JS object, applied via CSS custom properties

`THEMES` in `app.js` is the single source of truth for every palette
(`gold`/`rose`/`jade`/`ice`/`bone` — each an `{ accent, accentBright }`
hex pair). These are deep, saturated tones meant to sit on the light
sand background with enough contrast to read clearly *without* glow —
not the pale/bright pastels a dark-background version would use.
`accentBright` is the darker/higher-contrast of the pair (used for the
headline number and the today-marker), which is the *opposite*
direction from what "bright" would mean on a dark background — on
light, more contrast means going darker/deeper, not lighter. Clicking
a theme swatch calls `applyTheme()`, which sets
`--accent`/`--accent-bright` on `document.documentElement` — every UI
element that should retheme (slider, toggle active state, brand dot,
export text) already references those CSS variables, so they update
for free. `drawStatic()`/`drawFrame()` read the same `THEMES` object
directly (via `hexToRgba()`) rather than reading computed CSS, so the
canvas and the UI can never fall out of sync. The page background and
the "lived" (muted) dot color deliberately do **not** change with
theme — only the "remaining" dots, the headline number, and the UI
accent do — so the card stays grounded rather than fully repainting.
To add a theme: add one entry to `THEMES` and one swatch button
(`<button data-theme="..." style="--swatch:#hex">`) in the theme
toggle group; nothing else needs touching.

### Text is laid out by measuring, not by fixed y-coordinates

`drawStatic()` walks a running `y` cursor down the canvas, and after
each text block (eyebrow / number / unit label / subtitle) advances
`y` by that block's *actual measured* ascent/descent
(`ctx.measureText(...).actualBoundingBoxAscent/Descent`) plus a fixed
gap, rather than using hardcoded pixel positions. This is what keeps
the number comfortably padded regardless of how large its font renders
— a short string like "50" (Years) gets a much bigger font than
"18,261" (Days), and fixed y-coordinates made the short/huge case look
cramped against the eyebrow and subtitle above/below it. If you add
another text block, follow the same pattern (measure, advance `y`,
draw) rather than picking a fixed offset.

### The "fun fact" line is always derived from days, not the active unit

The italic line under the subtitle (weekends/full-moons) reads
`data.remainingDays` — a precise, unrounded day count that
`computeData()` returns *in addition to* `remainingUnits` — rather
than converting whatever unit is currently toggled. That's
deliberate: days is the finest granularity available, so the
weekends/moons numbers stay accurate and (more importantly) don't
change when you switch the Days/Weeks/Months/Years toggle, even
though the big headline number above them does. If more equivalents
get added here, derive them from `remainingDays` the same way, not
from `remainingUnits`. Skipped entirely (no line, no reserved space)
when `data.exceeded` or when there's less than a week left — "0 more
weekends" isn't a fun fact.

### The canvas background is a flat fill, not a gradient

It was a top-to-bottom linear gradient originally; that read as
muddy/unintentional rather than deliberate once the rest of the
canvas had already committed to a flat, no-glow visual language (see
"Units are flat rounded squares" above) — a gradient was the one
remaining thing that wasn't flat. Single `fillStyle` now. If a
background treatment is revisited, keep it flat; the whole point of
this canvas's visual language is "nothing on it is trying to look
dimensional."

### Two-canvas render: static buffer + animated overlay

There's a hidden offscreen `buffer` canvas the same size as `#stage`.
`drawStatic()` draws the *entire* card (background, text, all dots)
onto `buffer` once per data change. Then a `requestAnimationFrame`
loop (`drawFrame`) just blits `buffer` onto the visible `#stage` and
draws a small pulsing glow on top at the "today" dot's position.

This split exists because the dot count can be in the thousands —
redrawing every dot every animation frame would be wasteful and janky.
Blitting a pre-rendered bitmap is cheap regardless of dot count, so
the pulse stays smooth no matter how dense the visualization is. If
you add more animation, prefer adding it to the cheap overlay pass in
`drawFrame`, not to `drawStatic`.

### Dot count is capped independently of the precise numbers (`TARGET_DOTS`)

This was the one real bug found while testing: rendering one dot per
raw day (default 80-year life ≈ 29,200 days) packed them so tight they
read as TV static instead of dots, and in Rings mode the overlapping
semi-transparent fills visually washed out the muted/glowing contrast
between lived and remaining days.

Fix: `computeData()` always computes the *exact* headline numbers
(`totalUnits`/`livedUnits`/`remainingUnits`/`percent`) from the real
date math, but separately derives a capped `dotTotal`/`dotLived` for
what actually gets rendered — grouping multiple raw units into one dot
when needed (`groupSize = ceil(totalUnits / TARGET_DOTS)`, currently
`TARGET_DOTS = 640`). When `groupSize > 1`, a small caption ("each dot
≈ 46 days") is drawn under the visualization so the grouping is
disclosed, not hidden. **Never feed `totalUnits`/`livedUnits` directly
into a layout function — always go through `dotTotal`/`dotLived`.**
If `TARGET_DOTS` ever needs tuning, the tradeoff is: higher = more
literal (closer to one-dot-per-unit) but risks the static/noise look
again at high unit counts; lower = cleaner/more legible dots but a
coarser "each dot ≈" grouping.

### Three layouts share one flat lived/remaining order

`layoutGrid`, `layoutConstellation`, and `layoutRings` each take `n`
and a bounding box and return `n` `{x, y, r}` positions. The bounding
box itself is computed fresh each render, from wherever the measured
text layout above left off down to the reserved bottom-caption block
(see "Text is laid out by measuring" above) — it is not a fixed
constant. Whichever layout is active, index `0..dotLived-1` in the
returned array is drawn faint (lived, theme-independent, flat dark
ink at low alpha) and `dotLived..dotTotal-1` is drawn solid in the
active theme's `accent` color (remaining) — same flat order feeding
all three, just arranged differently:

- **Grid**: plain row-major slots (`gridSlots()`), left-to-right,
  top-to-bottom — literal chronological reading order, closest to the
  classic "life in weeks" grid.
- **Constellation**: reuses the exact same `gridSlots()` positions,
  then jitters each one with a seeded RNG (`mulberry32(42)`, fixed
  seed so the scatter is stable across re-renders of the same data,
  not re-randomized every render) and varies each dot's radius
  slightly for an organic starfield look. Same slot order as Grid, so
  the lived/remaining split still reads as an (organic-edged) top
  region vs. bottom region, not scattered arbitrarily.
- **Rings**: `n` points distributed across up to 10 concentric rings,
  point count per ring weighted by that ring's radius (so spacing
  around each ring's circumference stays roughly even), innermost
  ring first in the flat order. That makes the innermost rings = the
  earliest years of life (a tree-ring metaphor) — they're the ones
  that fade to nearly invisible once mostly "lived," while the outer,
  solid-colored rings do the visual work. A fixed `bottomClearance`
  buffer is subtracted from the available bounds height before layout
  runs, specifically because Rings maximizes its radius to exactly
  touch whatever bounds it's given (Grid/Constellation usually have a
  little natural slack instead) — without it, the outer ring sits
  flush against the caption text below with no breathing room.

### "Today" marker

`todayIndex` is set to `dotLived` (clamped) after each render and
reused by `drawFrame`'s pulse overlay — it's `-1` (no marker drawn) if
the estimate has already been exceeded (`data.exceeded`) or there are
no dots. If you change how `dotLived`/`dotTotal` are derived, make
sure `todayIndex` still points at the actual lived/remaining boundary
in the (possibly grouped) dot array, not the raw unit array.

### Sample state before a real date of birth

`sampleDob` (today minus 30 years) is used whenever `state.dob` is
`null`, so the page shows a live-looking demo on first load instead of
an empty card. `data.isSample` is still computed and returned from
`computeData()`, but as of the "remove the on-card captions" request
it no longer drives any on-canvas text — only the `#sampleNote` text
*below* the card ("Sample life shown — enter your birth date above to
see yours.") tells the user it's sample data, and that clears the
moment a real date is entered. If `data.isSample` ever looks unused
inside `drawStatic()`, that's expected, not dead code to delete blindly
— check `computeData()`'s return value is still consumed elsewhere
before removing it.

## Hub page tile

Per `../CLAUDE.md`, every project here gets a themed tile on the
`ai-slop/` root hub ("The Quagmire"). Memento's tile
(`.tile[data-theme="memento"]` in `../style.css`) is a small, very
restrained dark card — a row of small dots fading up in size/opacity
left to right, ending in a tiny two-tone "cute" skull (rounded
cranium, two punched-out eye dots, a small triangular nose notch, a
soft two-lobed jaw — no sharp/creepy detailing), echoing the app's own
"lived → remaining" dot progression in miniature. The title uses
`Cormorant Garamond` italic (loaded specifically for this tile via
`../index.html`'s Google Fonts link — the main app itself uses
`Fraunces`, kept deliberately distinct) at low-ish opacity. Everything
on this tile is intentionally subtle/low-contrast — it should read as
the quietest, most restrained tile on the hub (closest in spirit to
the "guilt" tile's near-black restraint, but with a different motif),
not compete visually with the brighter tiles next to it.

## Running it

Open `index.html` directly in a browser, or serve the folder
(`python3 -m http.server`) — no build step needed either way.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub
Pages site. No environment variables, API keys, or backend.
