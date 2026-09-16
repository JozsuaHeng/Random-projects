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

### Two nagging mechanisms, because a static site can't page you

There's no server, so nothing can push a notification to you while the
tab is closed. `app.js` is upfront about this (footer note in
`index.html`) and covers the gap two ways:

1. **In-browser `Notification` API**, best-effort, while the tab is
   open. `checkNotifications()` runs on initial load and again on every
   `visibilitychange` back to `visible` (so leaving the tab open
   overnight and coming back to it the next day still triggers it, not
   just the exact moment the page first loaded). Each entry tracks
   `notifiedOn: [dateStr, ...]` so the same trial doesn't re-notify
   every time you reload the page on the same day — only once permission
   is granted, the browser actually supports `Notification`, and
   `daysLeftFor(entry)` is `0` or `1`.
2. **A downloadable `.ics` calendar file per trial** (`buildICS()`,
   the 📅 Calendar button), which is the mechanism that actually reaches
   you even with the tab closed — it drops a real event (plus a
   `VALARM`) onto whatever calendar app you already use, dated the day
   before the trial ends at 9am local, titled "Cancel `<service>` before
   it charges you." This is the same workaround-the-no-backend-
   constraint idea as Convene's shareable-link trick: instead of trying
   to fake server behavior, hand the user something that does the actual
   job through infrastructure they already have.

**If browser push notifications (a real backend, service worker, and
push subscription) ever get added as a third option, that's a
meaningfully bigger feature** — a real server, not just static hosting
— so treat it as a deliberate scope change, not a natural extension of
`checkNotifications()`.

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

### Wordmark: static neon glow, not animated

`.brand` ("Last Call," `Caveat` cursive, layered `text-shadow`) does
**not** flicker on the app page itself, even though the concept is a
neon bar sign — this page gets looked at repeatedly while entering and
checking data, and a flickering wordmark sitting at the top of a
frequently-revisited utility would get tiring fast, the same "no
shimmer on a stared-at element" lesson documented in `../memento/`'s and
`../nook/`'s CLAUDE.md files. The flicker animation exists, but only on
the hub tile (see below), which visitors only glance at once before
clicking through.

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
`../style.css`). It's a small neon bar-sign scene: a dark card, a
swinging bell line-icon (`.lastcall-bell`, CSS `swing` keyframe), and
the "Last Call" wordmark itself doing the flicker animation this app's
own header deliberately does *not* do — the tile is seen once on the
way in, so the flicker reads as a fun neon-sign flourish there instead
of becoming annoying the way it would on a page you keep open.

## Running it

Open `index.html` directly in a browser, or serve the folder
(`python3 -m http.server`) — no build step needed either way.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site. No environment variables, API keys, or backend. Nothing here ever
leaves the browser it was written in — the only thing that ever goes
"out" is the `.ics` file you choose to download into your own calendar.
