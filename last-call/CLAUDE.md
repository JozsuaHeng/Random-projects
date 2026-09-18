# CLAUDE.md

## What this project is

**Last Call** — you tell it when each of your free trials ends, and it
nags you the day before (and the day of) so you actually cancel instead
of getting quietly charged. Same spirit as
[`../knotify/`](../knotify/CLAUDE.md)'s real converters,
[`../convene/`](../convene/CLAUDE.md), or [`../nook/`](../nook/CLAUDE.md)
— a genuinely useful tool, not satire like Guilt Trip or the Bitcoin
faucet.

No accounts, no backend, no sync — everything lives in the browser's
`localStorage`. That's an honest constraint, not just an implementation
detail: it's stated directly in the footer, because it changes what
"nags you" can actually mean here (see below).

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no dependencies beyond
Google Fonts — same as everything else in `ai-slop/`.

### Three nagging mechanisms, because a static site can't page you

There's no server, so nothing can push a notification to you while the
tab is closed. `app.js` is upfront about this (footer note in
`index.html`) and covers the gap three ways:

1. **In-browser `Notification` API**, best-effort, while the tab is
   open. `checkNotifications()` runs on initial load and again on every
   `visibilitychange` back to `visible` (so leaving the tab open
   overnight and coming back to it the next day still triggers it, not
   just the exact moment the page first loaded). Each entry tracks
   `notifiedOn: [dateStr, ...]` so the same trial doesn't re-notify
   every time you reload the page on the same day — only once permission
   is granted, the browser actually supports `Notification`, and
   `isUrgent(entry)` is true (see "Settings panel" below for what that
   means now).
2. **"Add to Google Calendar"** (`buildGoogleCalendarUrl()`, the 🗓️
   button) — Google Calendar has no API-key-free download format, but it
   does accept a plain URL that pre-fills its own "create event" page, no
   login flow or API call needed. `dates` has to be UTC (`...Z`); the
   function builds the reminder as an ordinary local `Date` (offset by
   the Settings-configured reminder day/hour — see below) and reads it
   back out via `.toISOString()`, which does the local→UTC conversion
   for free since a JS `Date` always holds a true UTC instant internally
   regardless of which local fields set it.
3. **A downloadable `.ics` calendar file per trial** (`buildICS()`,
   the 📥 Apple/Outlook button) — covers calendar apps that don't take a
   Google-style URL. Drops a real event (plus a `VALARM`) onto whatever
   calendar app opens it, same "Settings-configured day/hour, titled
   'Cancel `<service>` before it charges you'" content as the Google
   Calendar link, just as a file instead of a URL.

Both calendar options are the same workaround-the-no-backend-constraint
idea as Convene's shareable-link trick: instead of trying to fake server
behavior, hand the user something that does the actual job through
infrastructure they already have. **If browser push notifications (a
real backend, service worker, and push subscription) ever get added as
a fourth option, that's a meaningfully bigger feature** — a real server,
not just static hosting — so treat it as a deliberate scope change, not
a natural extension of `checkNotifications()`.

### Dates are parsed as local midnight, not `new Date(string)`

`parseLocalDate(ymd)` splits `"YYYY-MM-DD"` and constructs
`new Date(y, m-1, d)` explicitly. Handing that same string straight to
`new Date(...)` instead treats it as UTC midnight, which can silently
shift the displayed/compared date by a day depending on the viewer's own
time zone offset — the same pitfall documented in `../convene/`'s
CLAUDE.md. Every day-difference calculation (`daysLeftFor`) and display
string (`formatDate`) goes through `parseLocalDate`, never through a raw
`Date` constructor call on the stored string.

### Status thresholds (`statusFor`)

`daysLeftFor(entry)` = whole days between local-midnight-today and the
entry's `endDate`. `statusFor()` turns that into one of six states,
each with its own badge color in `style.css` (`.trial-card[data-status=
"..."]`):

- `cancelled` — user marked it done (`entry.cancelled`); dims the whole
  card and strikes through the service name.
- `ended` (`daysLeft < 0`) — trial end date has passed and it's *not*
  marked cancelled, i.e. "did this actually charge you? check your
  statement." Deliberately not auto-removed or auto-archived — silently
  dropping it would defeat the point of a tool whose whole job is "don't
  let this slip past you."
- `today` / `tomorrow` (`daysLeft` 0 or 1) — the two states that also
  drive the banner and `checkNotifications()`. Their badge gets a slow
  `badge-pulse` opacity animation (2.4s, subtle) — the one deliberate
  animated element on the page, reserved for the two states that
  actually warrant catching your eye.
- `soon` (`daysLeft` 2–3) — amber badge, no animation.
- `later` (`daysLeft` > 3) — neutral/muted badge.

### Sample state before any real trial is tracked

`render()` checks `trials.length === 0` and, if so, renders
`buildDemoTrials()` (two example cards — one ending tomorrow, one in 9
days, generated fresh off today's date rather than hardcoded strings so
they never look stale) instead of the real list. Demo cards get
`.trial-card-demo` (dashed border, dimmed) and have their whole
`.trial-actions` block removed in `renderCard()` — there's nothing real
to cancel/delete/export yet. This mirrors the sample-data pattern used
in `../memento/` (`sampleDob`) and `../convene/` (`SAMPLE`): demo data
is generated at render time and never touches `localStorage`, so it
disappears the instant a real entry exists and can never get confused
with real data on reload.

### Logo: a cut credit card, not a bell

**v1's mark was a bell** (favicon, header icon, hub tile). Direct
feedback: a bell is "too homogenous in the market" — every reminder,
alarm, and notification app uses a bell, so it carried zero identity
specific to *this* app's job. Replaced everywhere (`favicon.svg`, the
app header's `.brand-icon` in `index.html`, `icon-source.svg` for the
PWA icons, and the hub tile) with the same mark: a plain light credit
card with a bold dark diagonal line slashed across it — the "cut up
your card" idiom, rendered literally. It's deliberately simple (a
rounded rect + a stripe + one thick line) so it stays legible at every
size this app needs it at, from a 16px browser tab favicon up to a
512px PWA install icon. **If this mark ever changes again, keep the
same three pieces (card body, one stripe, one diagonal cut) — don't
drift toward a generic bell/clock/notification-badge shape**, that's
specifically the thing being avoided here.

### Wordmark: plain bold sans, not a neon sign

**v1 of this app's header used a cursive, flickering-neon "Last Call"
wordmark with a swinging bell — it read as a bar/restaurant last-call
marquee** (the exact wrong association for a bill-cancellation tool).
Direct user feedback: "looks like a last minute dining call app for
restaurants wanting to fill up tables." Replaced with `.brand-row`: the
cut-card icon above, in a small red rounded-square badge
(`.brand-icon`), next to `.brand` — now plain `Manrope` 800 weight, no
cursive font, no `text-shadow` glow, no animation. **If a "make the
header pop more" request comes in later, reach for weight/size/color
first — do not bring back a script font or a glow effect on this
header,** both are what caused the original misread.

This also makes the earlier "keep bright/flicker things off the app's
own repeatedly-viewed header" reasoning *moot* rather than wrong — it
was true before and still is (same lesson in `../memento/`'s and
`../nook/`'s CLAUDE.md files), it's just that the new header has no
glow/flicker to begin with.

### Money-saved stat (`#savedStat`)

`renderSavedStat()` sums `parsePriceNumber(entry.price)` across every
`cancelled` entry and shows it as `💰 $X.XX saved so far, across N
cancelled trials`. `parsePriceNumber` just grabs the first plain number
out of whatever free text is in the price field (`"$14.99/mo"` → `14.99`)
— **it does not parse currency or billing period**, so a mix of
monthly/yearly prices will sum into a number that isn't really "dollars
per month saved," just a rough running total. That's an intentional
simplification for a fun motivational number, not a real accounting
feature; don't present it anywhere as more precise than that. Uses a
dedicated green (`#7dd88a`), the only non-red/amber/muted color on the
page, since it's the one number here that's good news rather than a
warning — reusing `--accent` (which means "urgent" everywhere else)
would have muddied that.

### Snooze (`isSnoozed`, `.snoozeBtn`)

`entry.snoozedUntil` is a `YYYY-MM-DD` string meaning "don't nag about
this one until this date arrives." **It never touches the real
`endDate`** — the card's badge keeps showing the true status ("Ends
tomorrow") even while snoozed; only `renderBanner()` and
`checkNotifications()` check `isSnoozed()` and skip a snoozed entry.
That split is deliberate: snoozing is "stop bugging me," not "hide this
from me" — a tool whose whole purpose is not letting a charge slip past
you shouldn't have a mode that actually hides one.

The snooze button (`canSnooze` in `renderCard()`) only appears on
`today`/`tomorrow` cards — the two states that actually produce a nag —
since snoozing a `soon`/`later`/`ended` card would do nothing
observable. Clicking it sets `snoozedUntil` to tomorrow via
`addDaysStr(1)`; clicking again (now labeled "Undo snooze") just
deletes the field. Because `isSnoozed()` compares against today's date
fresh on every check rather than storing a boolean, a snooze **expires
on its own** the day it names arrives — there's no separate "wake up
and un-snooze everything" logic needed anywhere.

### Settings panel (`#settingsOverlay`, gear icon top-right)

Added on direct feedback: notifications used to be a standalone button
right under the header that **disappeared** once you'd granted/denied
permission (replaced by a status line), so on any later visit there was
no visible control at all — and there was no answer whatsoever to
"where do I configure calendar reminder timing," because there wasn't
one; the day-before/9am reminder was hardcoded. Both are now one panel:

- **Notifications** — same permission logic as before
  (`initNotifyUI`/`updateNotifyStatus`), just always-visible inside the
  panel instead of a disappearing inline button, so the current state is
  checkable on any visit, not just the first one.
- **Reminder timing** (`settings.reminderDaysBefore`,
  `settings.reminderHour`, persisted under `lastcall.settings.v1`) —
  this is what "calendar syncing settings" actually turned into. Default
  matches the old hardcoded behavior (1 day before, 9am) so nobody's
  existing habits change unless they touch it. `isUrgent(entry)` (used
  by both `renderBanner()` and `checkNotifications()`) is `daysLeft ===
  0 || daysLeft === settings.reminderDaysBefore` — **the day-of-charge
  nag is always on regardless of this setting**, only the *advance*
  warning day is configurable. `buildICS()`/`buildGoogleCalendarUrl()`
  read the same two settings for where to place the event. Changing
  either input re-renders (banner/badges can depend on the new
  threshold) but does **not** retroactively move calendar events you've
  already added to your calendar — those already-created events keep
  whatever day/hour was configured at the moment you clicked the
  button, which is stated directly in the panel's hint text.
- **Backup** (export/import) — `{ trials, settings }` as one JSON file,
  same shape both ways. Import accepts either that shape or a bare
  trials array (an old-format or hand-edited file), confirms before
  overwriting (`window.confirm`, same pattern as `../nook/`'s
  import), and re-fills every trial field defensively (falls back to a
  sane default for anything missing/mistyped) rather than trusting the
  file's shape blindly.

**A real bug worth knowing about if this panel is ever touched again:**
`.settings-overlay` sets `display: flex` directly in `style.css`. An
*author* stylesheet rule beats the browser's own built-in `[hidden] {
display: none }` rule on a cascade tie (author styles always win over
the user-agent stylesheet, specificity being equal) — so without an
explicit `.settings-overlay[hidden] { display: none; }` override
sitting right next to it, the panel showed **by default on every page
load**, caught only by actually rendering the page and looking, not by
reading the HTML/CSS separately. Any other `hidden`-controlled element
that gets a non-`none` `display` value in this file needs the same
explicit `[hidden]` override — the existing ones (`.banner`,
`.empty-state`, `#toast`, etc.) never needed this only because none of
them declare `display` at all, they just rely on the default block
flow, which doesn't fight with the UA rule.

### PWA install support (`manifest.webmanifest`)

A `<link rel="manifest">` + `apple-touch-icon` + `theme-color` meta in
`index.html`'s `<head>`, backed by `icon-192.png`/`icon-512.png`/
`apple-touch-icon.png` — all rasterized from `icon-source.svg` (same
cut-card mark as the favicon/header, but filled edge-to-edge on a solid
red square rather than a rounded badge, since OS icon masking expects a
full-bleed square and applies its own corner rounding). This lets a
visitor "install" the page to their phone's home screen with a real
icon, opening in `"display": "standalone"` (no browser address bar)
instead of just bookmarking a tab. **This is still a static site with
no backend** — installing does not enable the push notifications
described above; it only changes how the page is launched/framed once
someone's on it. If real push notifications ever get built (see the
"nagging mechanisms" section), a service worker would need registering
separately; this manifest alone doesn't provide one.

`icon-source.svg` was rasterized to PNG via macOS's Quick Look
thumbnailer (`qlmanage -t -s <size> -o <dir> icon-source.svg`) since no
image-conversion CLI (ImageMagick, rsvg-convert) was available in this
environment — a fine one-off approach, but if these icons ever need
regenerating at a different size, any SVG-to-PNG tool works equally
well; there's nothing `qlmanage`-specific baked into the output files
themselves.

### Delete has an undo toast; cancel is a plain toggle

`deleteTrial()` splices the entry out immediately, re-renders, and shows
a toast with an "Undo" button that re-inserts it at its original index
(same pattern as `../nook/`'s note deletion) — deleting is the
destructive one, so it gets the safety net. Marking "Cancelled ✓" is
just a boolean toggle with no confirmation or undo toast: it's fully
reversible in the UI itself (the button becomes "Undo cancel"), so a
separate undo mechanism would be redundant.

## Hub page tile

Per `../CLAUDE.md`, every project here gets a themed tile on the
`ai-slop/` root hub ("The Quagmire", `.tile[data-theme="lastcall"]` in
`../style.css`). Seven versions so far — this tile took more iteration
than anything else on the hub, worth reading in full before touching it
again:

- **v1**: a flickering cursive "Last Call" neon sign + swinging bell —
  read as a bar/restaurant marquee.
- **v2**: a small mocked-up phone notification banner — too
  small/subtle to read as anything in particular at a glance.
- **v3**: a credit card sliced clean in half, blown up to fill almost
  the whole tile (two clipped/offset copies of one card shape + a glow
  line at the seam). Bold and correctly-cropped (see the viewBox lesson
  below, which is still true and still applies to *any* full-bleed SVG
  art added to this tile), but the illustration itself came back as
  reading "messy" rather than bold once actually looked at.
- **v4**: a pivot away from "big bold illustration" toward restrained/
  editorial, per explicit direction ("minimalistic, stylish, aesthetic,
  sleek"). A hairline-outlined card with a rotated rubber-stamp "VOID"
  seal overlapping its corner, wordmark in italic serif (`Fraunces`,
  then swapped to `Playfair Display` on "nicer font please" feedback —
  both already loaded via the hub's shared font link, so a one-line
  change each time), and a muted oxblood accent (`#d94a4a`) instead of
  the bright red used since v1. Four candidate directions were actually
  *rendered* side by side before this one was picked, not just guessed
  — worth repeating any time a tile stalls after one or two tries rather
  than iterating blind on the same idea again.

  This fixed the "messy/loud" problem from v3, but introduced a new one:
  called out directly as looking like "a credit card cancellation
  program" — i.e. reads as a banking tool, not "cancel your Netflix."
  **A single literal credit card is apparently too specific to banking
  regardless of how it's styled** — if a future pass reaches for a card
  shape again, pair it with something unambiguously about subscriptions
  (app icons, a streaming-style UI, etc.), don't rely on the card alone.

- **v5**: keeps v4's calmer, graphic (not illustrative-mess) spirit but
  replaces the subject entirely — a small cluster of colorful rounded-
  square app icons (`.lastcall-app-a/b/c/front`, plain generic glyphs: a
  cloud, a music note, a heart, a play triangle — **deliberately not
  real brand logos**, to avoid impersonating actual services) with the
  front one wearing a small dark "×" badge in its top-left corner
  (`.lastcall-badge`). That's the actual iOS/Android "long-press an app
  to delete it" gesture, which reads as "removing a subscription" far
  more specifically than a card, bell, calendar, or stamp ever did —
  the whole reason this version exists is that v4's card, however
  nicely styled, was specific to the wrong domain (banking) rather than
  not specific enough.

  Wordmark also moved off serif entirely, to `Sora` (bold weight 800) —
  matched the tonal shift from "elegant banking" to "colorful consumer
  app" at the time, and was a genuinely new font addition to the hub's
  shared Google Fonts link in `../index.html` (not a reuse). **Sora
  didn't stick** — see v6.

  **This tile's illustration is intentionally its own scene, not a
  blown-up copy of the app's small icon** — `favicon.svg` and the app
  header still use the credit-card-cut mark from v3's era, unchanged.
  Several other tiles on this hub work the same way (Convene's Venn
  diagram and SubScreener's fake ticker aren't blowups of those apps'
  favicons either), so this is not an inconsistency to "fix" — don't
  feel obligated to make the tile and the favicon match pixel-for-pixel,
  and don't read v5's departure from cards as reason to update the
  favicon/header to match — that mark is independently fine and wasn't
  part of this feedback.

- **v6**: a polish pass on v5's concept, not another pivot — the
  icon-cluster/delete-badge idea itself was never in question here,
  only its execution. Two things called out directly: the wordmark
  ("looks so plain and boring") and wanting "a bit more detail" on the
  tile overall.

  Wordmark: `Sora` → `Fredoka` (bold weight 700). Sora's strokes are
  plain/geometric with almost no distinguishing character at tile size;
  Fredoka's rounded terminals read with real personality even that
  small — **confirmed by actually rendering both and comparing, not by
  reasoning about the font names**, same discipline as every prior round
  of this tile. `Fredoka` was swapped straight into the hub's shared
  Google Fonts link in place of `Sora` (`../index.html`), since nothing
  else on the hub had claimed `Sora` either — no orphaned import left
  behind. If the wordmark ever changes again: `Marcellus` and `Cinzel`
  are still the only currently-loaded display fonts with zero tile
  owners, but they're classical serifs — likely the wrong register for
  this tile's current "colorful consumer app" direction; a fresh
  Google Fonts addition (the `Sora`→`Fredoka` pattern) is probably right
  again rather than reaching for an unclaimed-but-mismatched option.

  Detail added **without new copy** (the hub's "no description text on
  tiles" rule still applies — see `../CLAUDE.md`):
  - `.lastcall-app-z` — a faint, desaturated 5th icon peeking from
    behind the cluster. Pure depth cue ("more than 4 subscriptions
    piled up"); no glyph inside it, so it doesn't compete for attention.
  - `.lastcall-motion` — a pair of small curved SVG strokes flanking the
    front icon, echoing the little motion-lines iOS/Android draw around
    an icon in "jiggle mode." Reinforces the delete-gesture read from
    v5 rather than adding a new idea. **Needed a visible-strength check,
    not just placement math** — the first attempt (thin, low-opacity)
    was nearly invisible once actually rendered at tile scale and had
    to be thickened/brightened (`stroke-width: 2.5`, `opacity: 0.55`)
    before it read as an intentional mark rather than a stray artifact.
  - `.art`'s flat two-stop gradient became four soft color-matched
    radial blobs (red/blue/purple/green, matching the icon palette) for
    a blurred-wallpaper-behind-icons feel.

  **Keep all of this restrained if touched again** — the brief was
  "more detail," not "busier." Every v6 addition is either very
  low-opacity (the ghost icon, the bokeh blobs) or very small (the
  motion strokes), specifically so the four real icons + badge stay the
  obvious focal point and don't get visually competed with.

- **v7 (current)**: the same two asks came back almost verbatim after
  v6 shipped — "more detail," "nicer font," "more please." Read as: v6's
  polish moved in the right direction but hadn't gone far enough yet,
  not as a sign to change direction again.

  Wordmark: `Fredoka` → `Grandstander` (bolder, more overtly bouncy
  letterforms). **But the font swap alone was not treated as sufficient
  this time** — a plain flat-white fill had apparently read as "boring"
  across three different typefaces in a row (`Sora`, `Fredoka`, and
  presumably `Grandstander` too if left flat), so `.art-title` also
  picked up a soft white-to-coral `linear-gradient` fill via
  `background-clip: text` plus a `drop-shadow` for depth. **The lesson
  for next time: if "nicer font" comes back a third time, the fix is
  probably a fill/shadow *treatment*, not a fourth typeface** — swapping
  families alone had already been tried twice by this point.

  New detail: `.lastcall-dollar`, a small gold coin badge (`$`) near the
  ghost icon — the first element on this tile referencing *money* rather
  than *apps*, tying "a pile of subscription icons" back to the actual
  reason this app exists. Deliberately positioned near the icon cluster
  (`top: 6px; right: 122px`) rather than near the wordmark — an early
  placement attempt near the bottom-right came close to overlapping
  "Last Call" on the hub's narrowest tile columns (min 260px wide),
  since bold `Grandstander` can run close to 150px wide on its own; keep
  any future addition near the icon cluster, not the text corner, for
  the same reason.

**The viewBox-cropping lesson from v3 is still real and still applies**
to any future full-bleed SVG/graphic added to this or any tile: `.art`
is a fixed 100px tall but flexible-width box (grid columns run 260px+),
so a real tile's aspect ratio is much wider than a naive square-ish
viewBox. `preserveAspectRatio="xMidYMid slice"` scales up to cover the
box and crops whatever doesn't fit — verify by actually rendering the
tile (e.g. via `qlmanage -t` on a standalone HTML file that links this
project's real `style.css`), not just by reading the coordinates.

## Running it

Open `index.html` directly in a browser, or serve the folder
(`python3 -m http.server`) — no build step needed either way.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site. No environment variables, API keys, or backend. Nothing here ever
leaves the browser it was written in on its own — the only things that
ever go "out" are the `.ics` file you choose to download, or the
Google Calendar tab you choose to open, for a specific trial.
