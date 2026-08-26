# CLAUDE.md

## What this project is

**Knotify** is a satirical "AI-powered SaaS platform" landing page for
marine unit conversion. It advertises **9 converters** across sailing,
diving, surfing, and fishing ("one conversion engine, every marine
sport") — exactly **1 of them is real**. The other 8 are permanently
"🔒 Coming Soon" feature cards. The joke is structural, not written: real
functionality, wildly oversold marketing around it, classic cheap-AI-website-
builder visual language throughout (gradient-mesh blobs, glassmorphism
cards, a fake ticking "live activity" counter, a "4.9★ rating, based on 3
reviews" stat played completely straight).

This is the deliberate stylistic opposite of [`../guilt-trip/`](../guilt-trip/CLAUDE.md)
in this folder: guilt-trip is *zero* real functionality wrapped in a
restrained, hand-illustrated, deadpan-serious page. Knotify is *partial*
real functionality wrapped in a loud, generic, "generated in five minutes"
aesthetic — Poppins headings, emoji-in-gradient-circle icons instead of
hand-drawn SVGs, animated gradient buttons, glassmorphism everywhere. Keep
that contrast if either project is ever touched: don't make Knotify
tasteful, and don't make guilt-trip loud.

## Structure — landing page vs. the actual tool

Per the top-level instruction that shaped this: **the landing page and the
actual tool are deliberately separate pages**, not one page with an anchor
scroll.

- `index.html` — the marketing page. Hero pitch, a small **live** demo
  widget embedded right in the hero (`#demoKnots`/`#demoKmh`/`#demoMph`/
  `#demoMs` — genuinely functional, not a screenshot), a stats band, and
  the 9-card feature grid (`#features`) with one `.feature-live` card and
  eight `.status-pill`-only "Coming Soon" cards.
- `converter.html` — "the actual tool." A standalone, mostly-marketing-chrome-
  free page with the same converter (`#toolKnots` etc.), framed as
  "Converter 1 of 9," plus a `.locked-teaser` box listing the other 8 by
  name and linking back to `index.html#features`. This is where the
  "Open Full App" / "Launch Knotify Free" CTAs on the landing page lead.
- `app.js` — one shared file for both pages. `initConverter(idPrefix)` is
  generic or (`"demo"` for the hero widget, `"tool"` for the full-page
  version) — bidirectional: typing in any of the four fields recomputes
  the other three from `KNOT_FACTORS`. `initLiveStat()` is the fake
  ticking counter (`#liveStat`, landing page only) — increments by a
  small random amount every 2.2s, purely cosmetic. Both init functions
  no-op safely if their target elements aren't on the current page, so
  the one file works unmodified on both pages.

## The real feature

Knot ↔ km/h ↔ mph ↔ m/s, using `KNOT_FACTORS` in `app.js` (1 knot =
1.852 km/h = 1.150779 mph = 0.514444 m/s). Genuinely correct, genuinely
live — the entire joke depends on this one thing actually working while
everything around it is fake, so don't let this converter regress into
another decoration.

## What's intentionally not built

The 8 "Coming Soon" converters (Wave Height, Wind Force, Depth & Fathoms,
Tank Pressure, Line Strength, Water Temp & Wetsuit Advisor, Nautical
Distance, Fuel Range) are named consistently across `index.html`'s feature
grid and `converter.html`'s locked-teaser box — if one is ever renamed,
update both places, or the "wait, didn't it just say something else"
effect breaks the bit. None of them should ever get built here; if a real
version of any of these is wanted, that's a different, non-satirical
project.

## Hub page tile

This project's tile on the `ai-slop/` root hub ("The Quagmire",
`../index.html` + `../style.css`, `data-theme="knotify"`) is intentionally
the loudest, most generic-"AI-generated"-looking tile in the grid — a
light gradient-mesh card with glassy chips, on purpose standing apart from
every other tile's dark, hand-illustrated style (including guilt-trip's
near-black minimalism). That contrast **is** the tile's joke, so if the
rest of the hub's tiles ever get a redesign, keep this one visually loud
rather than bringing it in line.

## Running it

Open `index.html` directly in a browser — no server, no build step, no
dependencies beyond Google Fonts.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site (linked from "The Quagmire" hub — see `../CLAUDE.md`).
