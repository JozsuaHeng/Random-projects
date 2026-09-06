# CLAUDE.md

## What this project is

**Convene** — paste a list of names and cities, get back the meeting
window that actually works for everyone, plus a link that reproduces
the exact same roster for whoever you send it to. No sign-up, no
account, no backend: the whole app is static HTML/CSS/JS, and a
"shared" roster is really just that data encoded into the URL itself.

This is a genuinely useful tool, not satire — same spirit as
[`../knotify/`](../knotify/CLAUDE.md)'s real converters or
[`../nook/`](../nook/CLAUDE.md), not a joke like Guilt Trip or the
Bitcoin faucet.

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no dependencies beyond
Google Fonts — same as everything else in `ai-slop/`.

### `cities.js` — the trick that avoids needing a geocoding API

Turning a typed city name into a real time zone normally means calling
an external API (geocode the city, then look up its zone) — not
possible here with no backend and no API keys. Instead, `CITY_ZONES` is
a hand-picked list of ~80 major world cities, each mapped directly to
its real **IANA time zone id** (`Asia/Tokyo`, `America/New_York`, etc.)
— the same zone database every browser already ships with via `Intl`.
Once a typed city resolves to one of these ids, all the DST-aware math
downstream is just the browser's own `Intl.DateTimeFormat` doing what
it already knows how to do. No entry needs its own UTC offset recorded
anywhere — the offset (and whether DST applies on a given date) is
whatever the browser's tzdata says for that id, which is why this stays
correct even for dates months in the future.

`findCity(query)` scores a typed query against every entry's city
name, country, aliases, and the human-readable tail of its own IANA id
(so "Tokyo" matches even though it's never listed as an alias) —
exact match scores highest, then prefix, then substring — and only
returns a match above a confidence threshold. `suggestCities(query)`
is the same scoring without the threshold, used to offer "did you
mean" chips when nothing was confident enough to auto-resolve.

Several entries intentionally share one IANA id under different city
names (Mumbai/Delhi/Bangalore/Kolkata are all `Asia/Kolkata`; Bali,
Denpasar, Lombok, and Mataram are all `Asia/Makassar` — real WITA
zone, and the reason **Lombok** is in here at all is that it's where
Golden Island Cruises actually operates). If you add a city, don't
invent an offset — find its real IANA zone id and reuse an existing
entry's `iana` value if another city in the list already shares it.

### Parsing a pasted roster (`app.js`)

People paste lines in all kinds of shapes — `"Alice - Tokyo"`,
`"Bob, London"`, or just a bare `"Singapore"` with no name. `parseLine`
tries a list of common separators (` - `, `,`, `:`, ` in `, etc.) in
order; for each one it tries resolving *both* sides against
`findCity()` and treats whichever side actually resolves as the city,
the other as the display name. A bare line with no separator is tried
whole. If nothing resolves, the line is marked `unresolved` and shown
in the roster list with up to 3 `suggestCities()` chips — clicking one
records a manual override keyed by that **exact line's text** (see
`overrides` in `app.js`), so it round-trips correctly but stops
applying the moment that line's text is edited to something else.

### Why the grid is anchored to the *viewer's* local day, not UTC

`renderGrid`'s 24 columns are `new Date(y, m-1, d, h, 0, 0, 0)` for
each hour of the chosen date — deliberately using the plain (no
timeZone option) `Date` constructor, which JavaScript always
interprets in the *system's* local time zone. Since the system running
the page **is** the viewer's own machine, this is already "midnight to
midnight in the viewer's local time" for free, with zero Intl calls
needed for that part. Only the *other* participants need
`Intl.DateTimeFormat(..., { timeZone: iana })` to find out what local
hour their zone is at for that same instant — the viewer's own row
never needs it. Don't swap this to construct the columns from UTC
midnight instead; that would anchor the grid to a date boundary that
usually isn't when the viewer's own day starts, which is confusing
since the viewer is almost always the person actually reading the
grid.

There are 25 columns internally, not 24 — index 24 is the *next* day's
midnight, kept only so a meeting window that runs through the last
visible hour still has a real instant to compute its closing local
time from. It's never rendered as a 25th visible column.

### Full overlap vs. best partial overlap

`counts[h]` = how many attending participants (including "You" if the
checkbox is on) have their local time inside the current meeting-hours
setting at hour `h`. If any hour block hits `counts[h] === total`,
those form the highlighted **coral** "works for everyone" window
(`.cell-best`). If none do, the best it can do is highlight whichever
hour(s) hit the highest count as an amber **"closest option"** window
(`.cell-best-partial`) and the results panel lists who that window
actually excludes — the color difference (coral vs. amber) is
deliberate so the chart itself communicates "this is a real answer"
vs. "this is a compromise" without needing to read the text underneath
it. `pickBestRun` breaks ties between same-length candidate windows by
preferring the one centered closest to 1pm viewer-local, as a rough
proxy for "a civilized time for whoever's actually building this
roster."

### The results panel shows several candidate windows, not just one

`pickCandidates` (`app.js`) splits the 24 hourly `counts[h]` values (how
many attending people are in range at hour `h`) into maximal runs of a
*constant* count — not just the runs that hit the maximum — scores
every run (`count * 10000 + length * 100 - |midpoint − 13|`, so higher
coverage always wins outright, length is the tiebreaker, and centering
near 1pm viewer-local only breaks ties between otherwise-equal runs),
and returns the top 4. `renderResults` shows all of them as clickable
`.option-card`s — the top-ranked one expanded with the full per-person
breakdown, the rest collapsed to a one-line summary. Clicking any
option sets `selectedRunKey` (`"start-end"`) and re-renders: that run
becomes the expanded one *and* the grid's highlighted window
(`renderGrid` takes the same `active` run `render()` resolved, not
always "the best one"). `selectedRunKey` is intentionally re-validated
every render — `render()` only keeps it if a candidate with that exact
key still exists in the freshly computed list, otherwise it silently
falls back to the top pick — so changing the roster, date, or
meeting-hours preset can't leave a stale, no-longer-meaningful
selection highlighted.

### How "You" knows your time zone (no location access at all)

`viewerZone` is read once, at startup, from
`Intl.DateTimeFormat().resolvedOptions().timeZone` — a completely
standard, permission-free browser API that just reports back the time
zone your operating system is already configured with (the same
setting your computer uses to display your own clock). It is **not**
geolocation: no GPS, no IP lookup, no permission prompt, and nothing is
sent anywhere — it's a local read of a setting the browser already
had. The only way "You" would show the wrong zone is if your OS itself
is set to the wrong one. If this is ever swapped for anything
geolocation-based, that would be a meaningfully different (and far
more invasive) feature — don't casually "upgrade" it without flagging
that tradeoff explicitly.

### The shareable link *is* the save mechanism

There's no backend, so "share this roster" can't mean "save it
somewhere and send a pointer" — it means encoding the roster directly
into the URL. `encodeState` builds a small JSON payload (`[[name, city,
iana], ...]` plus the meeting-hours/date/include-me settings),
UTF-8-safe base64-encodes it (`btoa(unescape(encodeURIComponent(...)))`,
the standard workaround for `btoa` only handling Latin1), and
URL-safes the result (`+`/`/`/`=` swapped out) into `location.hash`.
`loadFromHash` reverses this on page load, and deliberately writes a
synthetic `overrides` entry for every reconstructed line rather than
re-running `findCity` on it — that guarantees the roster reappears
*exactly* as the original sender saw it, even for a city whose display
name doesn't match its own alias (e.g. someone who typed "Lombok" gets
their line back as "Lombok", not silently renamed to "Bali").
Critically, only the *roster* is encoded — each visitor's "You" row is
always computed fresh from their own browser's `Intl` time zone, so
the same link correctly personalizes itself for whoever opens it.

### The sample roster is a real `placeholder`, not pre-typed text

`SAMPLE` (`app.js`) is never written into `#roster`'s `value` — it's
set as the textarea's `placeholder` attribute (in `index.html`, with
`&#10;` line breaks) and, separately, parsed on-the-fly by `render()`
whenever `rosterInput.value.trim() === ""` purely so the grid/results
below aren't empty on first load. This matters for two reasons: the
browser renders placeholder text muted/grey automatically (so it never
looks like real, already-entered data), and — the actual ask that
drove this — a user who starts typing is typing into a genuinely empty
box, not fighting with four lines of someone else's example they'd
otherwise have to select and delete first. `renderRosterList` also
takes an `isDemo` flag that adds `.roster-list-demo` (dims + italicizes
the roster rows) and toggles `#demoNote`'s `hidden` attribute, so the
example is unmistakably marked as one in two more places, not just the
placeholder color. Because this check is just "is the textarea empty,"
clearing the roster back to nothing (by hand, or via the Reset button)
naturally falls back to showing the example again — no separate
"restore demo" code path needed.

**Never put a real person's name in `SAMPLE`.** It should read as
obviously invented placeholder data — a diverse spread of first names
and major cities across continents, not anyone real. If it's ever
regenerated, keep that spread (a genuinely global meeting is the whole
point of the app) rather than defaulting to English-language names in
one region.

### Quick Add — an autocomplete alternative to typing full lines

Typing correctly-formatted `"Name - City"` lines is the power-user
path; `#quickAdd` (`app.js`'s `renderQuickSuggestions`/`addQuickEntry`)
is the low-typing one. It's a plain name field plus a city field that
calls the existing `suggestCities()` on every keystroke and renders up
to 6 matches in a dropdown (`arrow keys` to move `quickActiveIndex`,
`Enter` or a click to commit). Committing doesn't touch any new state
— it just builds a `"Name - City"` line and appends it to
`rosterInput.value`, then calls the normal `render()`, so Quick Add and
pasting are just two different ways of writing into the same textarea,
never two separate data paths to keep in sync.

### Reset button

`#resetBtn` clears the textarea, `overrides`, and every setting back to
its default (9–6 workday, include-me on, date reset to tomorrow), and
strips `location.hash` via `history.replaceState` — i.e. it's "go back
to exactly the state a fresh page load would be in," including falling
back to the example roster, not "clear the roster but leave settings
changed."

## Hub page tile

Per `../CLAUDE.md`, every project gets a themed tile on the `ai-slop/`
root hub ("The Quagmire", `data-theme="convene"` in `../index.html` /
`../style.css`). The tile is still the two-circle Venn diagram (indigo
+ coral, lens-shaped intersection filled solid coral) from
`favicon.svg`, but the wordmark is no longer a separate floating
caption — every other tile on the hub puts its title bottom-left, and
a first pass here did too, which read as generic. Instead, the name
itself is split into the diagram: an SVG `<text>` reading **"Con"**
sits inside the indigo circle, a second reading **"vene"** sits inside
the coral one (`.convene-word-a`/`.convene-word-b` in `../style.css`,
both `Unbounded` to match the app's own wordmark font) — so the two
halves of "Convene" visually overlap exactly where the two circles do,
the same pun the Venn diagram is already making. The `"vene"` text
lives inside the same `.convene-drift` `<g>` as the coral circle, so it
rides along with the breathing-overlap animation instead of sitting
static while its circle moves under it.

## Running it

Open `index.html` directly in a browser, or serve the folder
(`python3 -m http.server`) — no build step needed either way.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub
Pages site. No environment variables, API keys, or backend — the
"shareable link instead of an account" pitch only holds because there
really is nowhere for the data to go except the URL itself.
