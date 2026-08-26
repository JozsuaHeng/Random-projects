# CLAUDE.md

## What this project is

**Knotify** is a satirical "AI-powered SaaS platform" landing page for
marine unit conversion. It advertises **18 converters** across sailing,
diving, surfing, kitesurfing, fishing, and open water ("one conversion
engine, every marine sport") — exactly **3 of them are real**. The other
15 are permanently labeled **"Premium"** (not "Coming Soon" — see the
Pricing section below for why that reads funnier). There's also a full
pricing section (three tiers, monthly/yearly toggle) selling access to
those same 3 converters — because the brief was explicitly "showcase the
app to people before buying," the way a real SaaS marketing site would.

**Copy is deliberately generic, not sailing-specific.** An earlier pass
used "mariners"/"sailors" as the default persona throughout (hero copy,
trust-band heading, pricing tier names "Crew"/"Skipper"/"Fleet") — this
was cut because it reads as a walled garden for boat people specifically,
when the actual premise ("every marine sport") explicitly includes
divers, surfers, kitesurfers, swimmers, and anyone else in/on/under the
water. Copy now either stays persona-neutral ("Why people trust
Knotify") or, where a persona is useful for texture, lists several
("trusted by sailors, divers, surfers, and everyone else...") rather than
defaulting to one. Keep this in mind if editing copy again — it's easy to
slip back into boat-only language given the domain.

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
   dark-navy `.trust-band` "why people trust Knotify" section right
   after the hero, both discussed further below.

## Structure — landing page vs. the actual tool

The landing page and the actual tool are deliberately separate pages, not
one page with an anchor scroll.

- `index.html` — the marketing page: nav (Sports / Try It / Features /
  Pricing + "Open App"), a two-column hero (copy + CTAs on the left, the
  `.phone-mockup` on the right — order flips via `.hero-visual { order:
  -1 }` under 860px), a `.hero-wave` SVG divider (fill hardcoded to match
  whatever section comes right after it, so it seams cleanly — currently
  white, since `#sports` follows directly), an **`#sports` "Built for
  every water sport" section** (`.sport-grid`, 10 activity cards — see
  below), a `.trust-band` "why people trust Knotify" section, a
  **`#try-it` section with all 3 live converters stacked full-width**
  (`.try-it-grid`, three `.panel` cards), a stats band, the 18-card
  `#features` grid (3 `.feature-live` cards + 15 "Premium"), and a
  `#pricing` section (3 tiers: Free/Premium/Business, monthly/yearly
  toggle).
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
  `.price-period-yearly` spans inside the Premium card's price — the other
  two tiers' prices don't change with billing period, so they're plain
  text outside that toggle.

## Sports & activities (`#sports`)

Ten activity cards (`.sport-card`) right after the hero, directly
delivering on the "Every Marine Sport" headline before anything else on
the page: Sailing, Scuba Diving, Surfing, Kite & Windsurfing,
Powerboating, Fishing, Freediving, Paddleboarding, Open-Water Swimming,
Kayaking & Rowing. Each card names the real conversions relevant to that
activity (e.g. Fishing → "Line strength, distance") — genuine domain
knowledge, not filler, even though the converters themselves mostly
don't exist yet. Icons are small stroke SVGs, one distinct shape per
activity (no reuse of the feature-grid icons here — these represent the
*activity*, not a specific converter). Cards cycle through three accent
colors via `:nth-child(3n+1/2/0)` (`--orange`, `--teal`, `--coral` — the
latter two introduced specifically for this section) on the icon badge
background and a 3px top border, purely for visual rhythm across a
10-card grid — not tied to any meaning (unlike the feature grid's
green-for-live convention). `grid-template-columns: repeat(auto-fit,
minmax(180px, 1fr))` — plain auto-fit, not a bento/mixed-span layout,
deliberately: this section needed to look richer/more colorful than the
rest of the page without becoming fragile across breakpoints. Icons went
through two rounds — the first pass was too abstract to read at a
glance (e.g. freediving was a vague leaf/flame blob, kayaking was four
dots joined by two lines); the current set favors recognizable silhouettes
over cleverness (a monofin shape for freediving, an actual crossed-paddle
icon for kayaking, a diving mask with lens circles for scuba). If revising
further, judge each icon by "would this read correctly at 20px with no
label," not just whether it looks fine at full size in an editor.

## The three real features

All in `app.js`, all genuinely correct and genuinely live — the whole
joke depends on these actually working while everything around them is
fake, so don't let any of them regress into decoration. Each also has a
derived **categorization readout** underneath its fields
(`.category-readout`, shared styling for all three) — the pattern started
with Beaufort and was deliberately extended to the other two so all three
converters feel equally "real":

- **Knot Speed**: knots ↔ km/h ↔ mph ↔ m/s (`SPEED_FACTORS`; 1 knot =
  1.852 km/h = 1.150779 mph = 0.514444 m/s). Readout: **Speed Class**
  (`SPEED_CLASS_SCALE`, informal displacement/planing bands — not an
  official scale like Beaufort, just widely-used rule-of-thumb knots
  ranges: Displacement/Trolling, Cruising, Planing, High-Performance).
- **Wind Force**: same `SPEED_FACTORS` fields, plus the derived Beaufort
  reading (`BEAUFORT_SCALE`, standard knots-based bands, force 0–12,
  e.g. "Force 5 — Fresh Breeze").
- **Depth & Fathoms**: fathoms ↔ meters ↔ feet (`DEPTH_FACTORS`; 1 fathom
  = 1.8288 m = 6 ft exactly). Readout: **Dive Zone**
  (`DIVE_ZONE_SCALE`, bands roughly matching real PADI recreational
  certification depth limits: Open Water, Advanced Open Water, Deep
  Diving, Technical Diving, Extended Range).

All three readouts share one `classify(value, scale)` helper (Beaufort
keeps its own function since it also needs the numeric force number, not
just a label). If a fourth live converter is ever added, give it a
categorization readout too rather than leaving it as the odd one out.

## The trust band (`.trust-band`)

Four "why people trust Knotify" items, dark navy band right after
`#sports`. The offline item's copy is deliberately vivid rather than
generic ("no standing on the bow waving your phone at the sky for one
bar" instead of just "no problem") — the brief was specifically to make
this land as a concrete, relatable moment, not a bland feature bullet.
The hero also carries a small `.hero-badge` ("Works with zero bars — no
signal required, ever.") right under the CTAs, reinforcing the same
point before a visitor even scrolls to the trust band — don't let these
two drift out of sync if either is edited. The joke here is that every claim is **actually true** of a static
webpage with no backend, just reframed in premium trust-badge language —
same "seriousness as the joke" mechanism as guilt-trip's security badges:
100% Offline-Capable (it's static files, of course it works offline),
Zero Signup/Zero Tracking (there's no server to send data to), Instant
(no API to time out), Works Anywhere (a browser is all it needs). Don't
let these drift into obviously-jokey copy — the deadpan is the point.

## Icons

Small monochrome stroke SVGs (24×24 viewBox, `stroke="currentColor"`,
no fill except tiny solid accent dots) run throughout, reusing the same
handful of shapes rather than inventing a new icon per spot: the
speedometer/wind-lines/anchor trio from the feature grid also appears
next to the matching `.try-it`/tool-page card titles; the brand mark
(`.brand-icon`, a stylized anchor) appears in both navs and both
footers; `.stat-icon` sits above each stats-band number; `.price-icon`
sits in a small rounded badge at the top of each pricing card
(life-ring/wheel/fleet-chevrons for Free/Premium/Business); `.lock-icon`
replaced the emoji lock on `converter.html`'s locked-teaser box;
`#sports`' ten `.sport-icon`s are their own distinct set (see the Sports
section above). If adding a new icon, match this style rather than
reaching for emoji — emoji-as-icons was one of the tells of the first
(too-AI-generated) design pass, see above. The favicon (`favicon.svg`)
has followed the same three passes as the rest of the site (purple
gradient → navy+orange → current flat navy+white anchor mark, no
gradient) — it was flagged as "still too colorful/AI-generated" even
after matching the navy+orange site palette, so it's now deliberately
two-tone only. If the site's palette changes again, don't reflexively
add a second accent color back into the favicon just because it's in
the palette — a plain single-accent-color mark reads calmer at
favicon size regardless.

## What's intentionally not built

The 15 "Premium" converters (Wave Height, Tank Pressure, Line
Strength, Water Temp & Wetsuit Advisor, Nautical Distance, Fuel Range,
Sail Area, Board Volume, Kite & Sail Size, Engine Power, Displacement &
Tonnage, Barometric Pressure, GPS Coordinates, Swim Pace, Visibility &
Clarity) are named identically in `index.html`'s feature grid and
`converter.html`'s locked-teaser box — if one is ever renamed, update
both places. None of them should ever get built here; a real version of
any of these belongs in a different, non-satirical project. Their
`.status-pill` reads **"Premium"**, not "Coming Soon" — deliberately
implying they're paywalled rather than unbuilt, which sharpens the joke:
the Premium *pricing tier* (see below) claims to unlock them, but since
nothing behind that paywall is actually built, paying gets you nothing
new. Don't revert this to "Coming Soon" — "Premium" is funnier and ties
directly into the pricing section.

## Pricing section

Three tiers (`#pricing` / `.pricing-grid` / `.price-card`), each with a
`.price-icon` badge, standard SaaS pricing-table layout —
`.price-card-popular` (**Premium**) gets an orange border/icon, a
floating "Most Popular" badge, and sits 6px higher via `transform:
translateY(-6px)` (collapses to `none` under 700px). Tier names are
generic on purpose (**Free** / **Premium** / **Business**, not sailing
jargon like the earlier Crew/Skipper/Fleet — see the note on generic
copy near the top of this file) — and **Premium** as a tier name is a
deliberate pun on the "Premium" status-pill label above, not a
coincidence. Pricing itself is deliberately cheap/simple-app-tier, not
enterprise B2B: **Free** ($0) is "3 live converters... the other 15 stay
locked, probably forever"; **Premium** is $0.99/mo, or $0.83/mo billed
$9.99/yr — the "Save 16%" on the Yearly toggle button is `1 −
9.99/(0.99×12) ≈ 15.9%`, recompute this if either price ever changes —
with "a nicer font on the numbers" and "priority access to converters
that don't exist yet"; **Business** is "Contact Sales" for "SLA on
features we haven't built." Keep these jokes if the section is ever
edited.

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
