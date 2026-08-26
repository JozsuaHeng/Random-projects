# CLAUDE.md

## What this project is

**Knotify** is a satirical "AI-powered SaaS platform" landing page for
marine unit conversion. It advertises **18 converters** across sailing,
diving, surfing, kitesurfing, fishing, and open water ("one conversion
engine, every marine sport") — exactly **3 of them are real**. The other
15 are permanently "Coming Soon" feature cards. There's also a full
pricing section (three tiers, monthly/yearly toggle) selling access to
those same 3 converters — because the brief was explicitly "showcase the
app to people before buying," the way a real SaaS marketing site would.

The joke is structural (real functionality, wildly oversold marketing
around it, dead-straight B2B SaaS pricing/feature-grid copy), not visual —
closer to how [`../guilt-trip/`](../guilt-trip/CLAUDE.md) actually works:
a **good-looking, non-satirical-looking** page selling an absurd premise
dead straight is funnier than a bad-looking page. Don't reach for
glassmorphism/gradient-mesh/emoji-icons here — that was tried (see design
history below) and read as too literally AI-generated rather than funny.

**Design history (three passes, in order):**
1. Light purple/pink/blue gradient-mesh, glassmorphism, emoji icons —
   deliberately "generated in five minutes" as the joke itself. Read as
   too literally AI-generated rather than satire.
2. Dark navy + gold, borrowed directly from
   [`../../charter-booking/`](../../charter-booking/CLAUDE.md)'s palette —
   fixed the "looks AI-generated" problem, but as a premium/luxury feel
   (right for a boat charter site, wrong for a *measurement/reliability*
   tool) and the 3-up `.try-it-grid` packed 3–4 number inputs into cards
   as narrow as 240px, clipping the converted values.
3. **Current**: deep ocean navy (`--navy-deep:#0b3556`) + safety orange
   (`--orange:#ff6b35`, the actual color of real marine safety
   equipment — lifejackets, flares, MOB markers — chosen deliberately to
   read as *reliable/safety-conscious* rather than luxury) on a light
   sky-blue-to-white background, Manrope headings + Inter body. The
   `.try-it-grid` converters are now stacked full-width instead of 3-up,
   each `.demo-grid`/`.tool-grid` using `repeat(auto-fit, minmax(120px,
   1fr))` so number inputs always get enough room regardless of field
   count. Added a CSS-drawn iPhone mockup in the hero (`.phone-mockup`,
   no real device photo, same technique as guilt-trip's phone —
   `../guilt-trip/CLAUDE.md` has the fuller explanation of why) and a
   dark-navy `.trust-band` "why sailors trust Knotify" section right
   after the hero, both discussed further below.

## Structure — landing page vs. the actual tool

The landing page and the actual tool are deliberately separate pages, not
one page with an anchor scroll.

- `index.html` — the marketing page: nav (Try It / Features / Pricing +
  "Open App"), a two-column hero (copy + CTAs on the left, the
  `.phone-mockup` on the right — order flips via `.hero-visual { order:
  -1 }` under 860px), a `.hero-wave` SVG divider (fill hardcoded to match
  `--navy-deep` exactly, so it seams into the section below), a
  `.trust-band` "why sailors trust Knotify" section, a **`#try-it` section
  with all 3 live converters stacked full-width** (`.try-it-grid`, three
  `.panel` cards), a stats band, the 18-card `#features` grid (3
  `.feature-live` cards + 15 "Coming Soon"), and a `#pricing` section (3
  tiers: Crew/Skipper/Fleet, monthly/yearly toggle).
- `converter.html` — "the actual tool": the same 3 converters as full-width
  `.panel` cards, framed as "Converters 1–3 of 18," plus a
  `.locked-teaser` box listing the other 15 by name and linking back to
  `index.html#features`.
- `app.js` — one shared file for both pages. `wireLinear(fields, factors,
  seedUnit)` is the generic bidirectional-conversion engine (typing in any
  field recomputes the rest from a shared base value) — `initSpeedConverter`
  and `initDepthConverter` are thin wrappers around it with
  `SPEED_FACTORS`/`DEPTH_FACTORS`. `initWindConverter` reuses the same
  speed fields/factors *and* layers on a read-only Beaufort-force readout
  (`beaufortFromKnots()`, a lookup table in `BEAUFORT_SCALE` — Beaufort is
  a banded scale, not a linear unit, so it's one-way: speed → force
  number + label, never the reverse). Every init function takes an
  `idPrefix` (`"demoSpeed"`/`"toolSpeed"`, etc.) and no-ops safely if its
  elements aren't on the current page, so the one file works unmodified
  on both pages. `initLiveStat()` is the fake ticking counter (`#liveStat`,
  landing page only). `initPricingToggle()` swaps an `active` class
  between the two `.price-toggle` buttons and toggles a `yearly` class on
  `#pricingGrid`, which CSS uses to show/hide the `.price-period-monthly`/
  `.price-period-yearly` spans inside the Skipper card's price — the other
  two tiers' prices don't change with billing period, so they're plain
  text outside that toggle.

## The three real features

All in `app.js`, all genuinely correct and genuinely live — the whole
joke depends on these actually working while everything around them is
fake, so don't let any of them regress into decoration:

- **Knot Speed**: knots ↔ km/h ↔ mph ↔ m/s (`SPEED_FACTORS`; 1 knot =
  1.852 km/h = 1.150779 mph = 0.514444 m/s).
- **Wind Force**: same `SPEED_FACTORS` fields, plus the derived Beaufort
  reading (`BEAUFORT_SCALE`, standard knots-based bands, force 0–12).
- **Depth & Fathoms**: fathoms ↔ meters ↔ feet (`DEPTH_FACTORS`; 1 fathom
  = 1.8288 m = 6 ft exactly).

## The trust band (`.trust-band`)

Four "why sailors trust Knotify" items, dark navy band right after the
hero. The joke here is that every claim is **actually true** of a static
webpage with no backend, just reframed in premium trust-badge language —
same "seriousness as the joke" mechanism as guilt-trip's security badges:
100% Offline-Capable (it's static files, of course it works offline),
Zero Signup/Zero Tracking (there's no server to send data to), Instant
(no API to time out), Works Anywhere (a browser is all it needs). Don't
let these drift into obviously-jokey copy — the deadpan is the point.

## What's intentionally not built

The 15 "Coming Soon" converters (Wave Height, Tank Pressure, Line
Strength, Water Temp & Wetsuit Advisor, Nautical Distance, Fuel Range,
Sail Area, Board Volume, Kite & Sail Size, Engine Power, Displacement &
Tonnage, Barometric Pressure, GPS Coordinates, Swim Pace, Visibility &
Clarity) are named identically in `index.html`'s feature grid and
`converter.html`'s locked-teaser box — if one is ever renamed, update
both places. None of them should ever get built here; a real version of
any of these belongs in a different, non-satirical project.

## Pricing section

Three tiers (`#pricing` / `.pricing-grid` / `.price-card`), standard SaaS
pricing-table layout — `.price-card-popular` (Skipper) gets an orange
border, a floating "Most Popular" badge, and sits 6px higher via
`transform: translateY(-6px)` (collapses to `none` under 700px). The jokes
are load-bearing: **Crew** ($0) is "3 live converters... the other 15 stay
locked, probably forever"; **Skipper** ($19/mo, or $15/mo billed
$180/yr — the 21% figure on the Yearly toggle button is derived from
$19×12=$228 vs $180/yr, recompute it if either price ever changes) is "a
nicer font on the numbers" and "priority access to converters that don't
exist yet"; **Fleet** is "Contact Sales" for "SLA on features we haven't
built." Keep these if the section is ever edited.

## Hub page tile

This project's tile on the `ai-slop/` root hub ("The Quagmire",
`../index.html` + `../style.css`, `data-theme="knotify"`) matches the
site's current navy-and-orange palette — a small orange compass rose
watermark (`.knotify-compass`) on a navy `radial-gradient`, "Knotify" in
white Manrope, an orange bottom border/hover border. Keep this in sync if
the site's palette changes again — the tile should always preview the
actual site, not an earlier version of it.

## Running it

Open `index.html` directly in a browser — no server, no build step, no
dependencies beyond Google Fonts (Manrope + Inter).

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site (linked from "The Quagmire" hub — see `../CLAUDE.md`).
