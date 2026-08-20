# CLAUDE.md

## What this project is

A satirical "download our app" landing page for **Guilt Trip** — a fake
app that automatically notices when you skip the gym, ghost a group
chat, or forget a birthday, and lets your family know about it. Unlike
a lot of parody landing pages, the copy is written completely straight
in a serious, premium B2B-SaaS voice (the same register a real
productivity or wellness app would use) — the joke is entirely in the
gap between how seriously the page treats itself and what the "product"
actually does. There's no exaggerated jokey copy, minimal emoji, and no
satire disclaimer anywhere on the page — the tell is the interaction
itself (see below), not a label.

There is no real app. The App Store/Google Play badges are `<button>`s,
not links, and clicking any of them (or the nav "Download" button)
cycles a bottom toast through a few dry, in-character non-messages
(`app.js`) — that's the only place the page breaks character.

**Do not add real company names or claimed endorsements anywhere on
this page** (press mentions, "as seen on" bars, etc.) — claiming a real
outlet "featured" a nonexistent app is a false endorsement/affiliation
claim, which is a hard line regardless of how the request is phrased.
The "Featured in" section (`#press`) uses eight entirely invented
outlet names (The Ledger Review, Meridian, Vantage Capital Digest,
Harbor & Co., The Quarterly Standard, Northfield, Alder Street Weekly,
Cascade Finance), each with a small hand-drawn abstract logomark (never
reused between two outlets) plus a wordmark — extend with more invented
names/marks if needed, never real ones. The App Store/Google Play
badges are a looser case: they use a stylized-but-recognizable apple
silhouette and a play-triangle colored with Google's own brand palette
(blue/red/yellow/green — `#4285F4`/`#EA4335`/`#FBBC05`/`#34A853`), which
is the generic visual language almost every app-landing mockup uses for
"download" badges, not literal copies of Apple's/Google's official
asset files — that's a deliberately different line than the press
logos, because these badges don't claim any specific real entity
actually reviewed or distributed this software, they're just
conventional UI iconography for "this is a mobile app."

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend, no real
download links. Static and self-contained like every other project in
this folder.

- `index.html` — single page, sections in order: nav, hero (copy + an
  auto-playing iPhone screenshot carousel + floating notification
  chips), press section (a full section with its own heading, not a
  strip — an auto-scrolling logo carousel, see below), features grid,
  how-it-works steps (each with a small illustrative mockup above the
  text), stats bar, **pricing** (three tiers — see below), testimonials
  (an auto-scrolling marquee, styled like B2B SaaS customer quotes —
  name + corporate title — since the mismatch between that format and
  how personal the "product" is does a lot of the comedic work),
  security/trust badges (SOC 2, encryption, GDPR — real vocabulary
  borrowed straight, not parody names, again for the
  seriousness-as-the-joke effect), FAQ (`<details>/<summary>`, no JS
  needed), closing CTA, minimal footer (brand mark + copyright line
  only).
- **Pricing** (`#pricing` / `.pricing-grid` / `.price-card`): three
  tiers, standard SaaS pricing-table layout (`.price-card-popular` gets
  a thicker maroon border, a floating "Most Popular" badge, and sits
  6px higher via `transform: translateY(-6px)` — collapses to `none` in
  the single-column mobile layout). The jokes are load-bearing, not
  decorative, so keep them if this section is ever edited: **Free**
  ($0/mo) is "forever free, emotionally nothing is"; **Premium**
  ($19/mo monthly, $15/mo billed $180/year) is priced as "or pay what
  you feel you owe — most pay more," a guilt-based variable-pricing
  gag, and its feature list calls back to the "2:14 AM" delivery-time
  joke from the features section (`#features` → "Delivered at the
  Right Moment") — don't let that timestamp drift between the two
  sections if either is edited; **Enterprise** is "Contact Sales — we
  already have your number," the classic SaaS "talk to us" tier played
  straight (its price stays "Custom" regardless of billing period — no
  monthly/yearly variant needed there). All three CTA buttons carry
  `data-download` like every other fake button on this page, so they
  trigger the same toast cycle — no separate wiring needed in `app.js`.
- **Monthly/yearly toggle** (`.price-toggle` / `#pricingGrid`): two
  buttons swap an `active` class on themselves and a `yearly` class on
  `#pricingGrid`; CSS does the rest — `.price-period-monthly` /
  `.price-period-yearly` spans (Premium's price and sub-copy each have
  both variants already written into the markup) are shown/hidden with
  `display: none` / `display: revert` off that one class, so `app.js`
  never touches text content directly. The 21% "Save" figure on the
  Yearly button is derived from $19×12=$228 vs. $180/year — if either
  Premium price ever changes, recompute that percentage rather than
  leaving it stale.
- **Press marquee** (`.press-marquee` / `.press-track`): same
  duplicate-and-loop technique as the testimonials marquee below — the
  eight logos are followed by an `aria-hidden="true"` duplicate of the
  same eight, and a `@keyframes` animation translates `0` to `-50%` on
  an infinite loop, pausing on `:hover`. Add a new outlet to **both**
  copies in the track, same rule as testimonials.
- **Hero phone carousel** (`.phone` / `#phoneViewport` / `#phoneDots`):
  a CSS-drawn iPhone frame (dynamic island, home indicator, no real
  device photo — there's nothing to photograph) containing six
  horizontally scroll-snapped `.phone-screen`s, each a distinct
  simulated screenshot: an iMessage-style thread with Mom, a lock-screen
  notification about a missed call from Dad, an in-app "Relationship
  Health Score" dashboard, a family group chat (Dad, Aunt Carol, Mom), a
  friends group chat ("Weekend Crew": Theo, Priya, Jamie) about a
  skipped hangout, and a calendar view with a few days flagged for a
  missed obligation. Deliberately spread across family *and* friends,
  and across different kinds of missed obligations (a call, the gym, an
  RSVP, a dinner, a hangout) rather than repeating "missed a call from
  a parent" six times — keep that variety if adding more screens or
  editing the dashboard/chip copy elsewhere on the page.
  `app.js` runs a `setInterval` that advances one screen every 3.5s and
  wraps back to the first after the last, calling `scrollTo()` on
  `#phoneViewport`. Below the phone, `#phoneDots` gives visible,
  Instagram-carousel-style manual controls — six small `button.dot`s,
  the active one filled and slightly scaled up — clicking one jumps
  straight to that screen via the same `goTo()` helper the autoplay
  uses. The viewport is also still natively scrollable (drag/swipe/
  trackpad all work), so a `pointerdown`/`wheel` listener (and the dot
  click handler) pauses autoplay for 4s after any manual interaction
  rather than fighting the visitor, then resumes from wherever they
  left it. To add another screen: add a `.phone-screen` inside
  `#phoneViewport` **and** a matching `button.dot` inside `#phoneDots`
  with the next `data-index` — unlike the old autoplay-only version,
  the dot count doesn't derive itself from the screen count, so both
  need updating together.
- **Hero floating chips** (`.float-chip`) and **`.hero-glow`** are the
  custom vector/CSS hero visual (two soft radial-gradient blobs behind
  the phone, two small floating notification pills bobbing via a CSS
  `@keyframes` animation) — deliberately built with no external image
  or video asset, keeping the project fully self-contained/offline like
  the rest of this folder. Hidden below 860px (`.float-chip` display:
  none) since there's no room for them once the layout stacks.
- **Testimonials marquee** (`.testi-marquee` / `.testi-track`): the six
  real testimonial cards are followed by an exact `aria-hidden="true"`
  duplicate of the same six, and a pure-CSS `@keyframes` animation
  translates the track from `0` to `-50%` on an infinite loop — because
  the second half is an identical copy of the first, the loop point is
  invisible. Pauses on `:hover` via `animation-play-state: paused`, no
  JS involved. To add a testimonial, add it to **both** copies in the
  track (once visible, once in the `aria-hidden` duplicate) or the loop
  will visibly jump.
- `style.css` — warm cream/maroon/gold palette, `Fraunces` for
  headings and `Inter` for body text (both via Google Fonts), except
  the App Store/Google Play badge wordmarks which intentionally switch
  to a system-sans stack (`-apple-system, BlinkMacSystemFont, ...`) to
  read as authentic store-badge typography rather than the page's own
  display serif. Icons throughout (features, security badges, press
  logos, the brand mark) are hand-written monochrome stroke SVGs, not
  emoji — keep new icons in the same style (viewBox around 20–24,
  `stroke="currentColor"`, `stroke-width` 1.4–2, no fill unless it's a
  solid mark) rather than reaching for emoji. Single theme, no
  dark/light toggle.
- `app.js` — two independent bits: the `data-download` toast cycle
  (any element with that attribute — both store badges in the hero,
  both in the closing CTA, the nav button — shares one click handler
  that rotates through `MESSAGES`), and the phone carousel autoplay
  loop described above.
- `favicon.svg` — small teardrop mark on a maroon rounded square; the
  same path is reused inline as `.brand-mark` in the nav and footer
  (as an SVG, not the emoji it used to be).

## Hub page tile

This project's tile on the `ai-slop/` root hub ("The Quagmire",
`../index.html` + `../style.css`, `data-theme="guilt"`) deliberately
breaks from the other tiles' bright gradient-art pattern: it's a
near-black card showing a small lock-screen-notification mockup ("Mom ·
now — Oh it's fine, don't worry about me"), which reads as distinct at
a glance against the colorful tiles next to it and previews the app's
actual conceit. Per `../CLAUDE.md`, hub tiles no longer carry a
one-line description under the title — just the art banner, name, and
"Open →".

## Running it

Open `index.html` directly in a browser — no server needed.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub
Pages site (linked from "The Quagmire" hub at the `ai-slop/` root — see
`../CLAUDE.md` for the tile convention). No environment variables, API
keys, or build step required.
