# CLAUDE.md

## What this project is

A single-button trivia toy. The page starts almost empty: a dim world map
fills the background, a one-line prompt sits above the button, and a
"Reveal a fact" button sits bottom-center. Clicking it surfaces a random,
detailed "fun fact" about anything — science, history, nature, culture,
geography — in a dock that slides in from the right (the map's own box
shrinks to make room, so nothing ever sits on top of what it just lit
up), with one keyword highlighted inline as a link plus a "Read more on
Wikipedia" link at the end, both pointing at the same article. Revealing
a fact simultaneously lights up the country (or countries) it's about on
the map behind the dock, plus a glowing pin for any specific place it
names (a city, a landmark, a named region). Clicking again reveals a new
fact; whatever was previously lit fades to a dim "explored" tint rather
than disappearing, so the map fills in like a scrapbook the longer you
play. The whole page respects light/dark mode — following the OS by
default, overridable with the toggle in the top-right corner.

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend, no API calls.
Everything — including the map — is static and self-contained, so it
opens directly as a file or serves from GitHub Pages with zero setup.

- `map.svg` — a trimmed copy of ["Simple World Map"](https://github.com/flekschas/simple-world-map)
  by Al MacDonald (ed. Fritz Lekschas), CC BY-SA 3.0 (attribution kept in
  `index.html`'s footer). Each country is a `<path id="xx">` or, for
  archipelago nations with multiple landmasses, a `<g id="xx">` wrapping
  several unlabeled `<path>`s — `xx` is the lowercase ISO 3166-1 alpha-2
  code. A handful of micro-states (Bahrain, Fiji, Vatican, San Marino,
  Kiribati, Svalbard as its own entity) aren't present as distinct
  shapes in this map, so no fact relies on highlighting those. The raw
  SVG's content is spliced directly into `index.html` (not loaded via
  `<img>`/`fetch`) so CSS/JS can target individual country ids — that
  also means it works from `file://` without hitting CORS restrictions
  fetch() would run into locally.
- `data.js` — the `FACTS` array (51 facts as of writing, spanning 17
  categories — Geography and History are the biggest, but there's
  deliberately at least one each of more niche ones: Biology,
  Architecture, Music, Psychology, Language, Economics, Geology,
  Anthropology, Astronomy, Technology, Sports — added specifically to
  break up what was originally a very geography-heavy set). Each entry
  has `id`, `image` (see below), `category`, `title`,
  `place` (a human-readable location label shown in the fact card),
  `paragraphs` (an array of strings, one per `<p>`, not a single blob —
  facts run 2 paragraphs), `wiki` (a Wikipedia URL, checked against
  Wikipedia's API for a real/redirect-resolved title before being added —
  see below), `wikiTerm` (a substring that must appear verbatim, exact
  case, somewhere in `paragraphs` — `app.js` turns its first occurrence
  into an inline link to `wiki`, so the reader gets a highlighted keyword
  in the body text itself, not just the "Read more" link at the end;
  nothing validates this at runtime either, so a typo'd `wikiTerm` just
  silently never highlights — the check command is below), `countries`
  (lowercase ISO codes matching `map.svg` ids,
  every one verified to exist in the map), and an optional `cities` array
  of `{ name, lat, lon }` for places the fact names specifically — a real
  city, landmark, or named region, not just "somewhere in this country."
  Whole-country facts (e.g. Bhutan's Gross National Happiness) have no
  `cities` on purpose; only add a pin when the fact text names an actual
  place, so the map stays honest about what it's pointing at.
- **`image`** — `{ url, width, height, credit, creditUrl }`. Deliberately
  *not* fetched live at runtime — pulling from Wikipedia's API in the
  browser would mean a network round-trip (and a possible layout jump)
  every single reveal, plus it'd break the "open `index.html` straight
  from disk, no server" workflow the whole project depends on. Instead
  every image was resolved **once**, at authoring time, the same way the
  `wiki` links were, and the final CDN URL is hardcoded into `data.js` —
  the browser just does one plain `<img src>` request per reveal, same
  as loading a normal photo on any website.
  - `url` is a **480px-wide Wikimedia thumbnail**, not the original
    (originals can be several MB; 480px keeps each reveal's image
    request small, which is the whole point of asking for this to stay
    "light" — don't swap in a bigger size without a reason). It's each
    fact's own Wikipedia article's lead image (`pageimages` API,
    `piprop=thumbnail|name`, `pithumbsize=480`) wherever the article had
    one.
  - Four facts had no usable lead photo on their own article (abstract
    topics: `click-consonants-za`, `ethiopia-calendar`,
    `singapore-gum`, `bhutan-archery`) — for those, `image` points at a
    real photo from a *different*, closely related article instead
    (e.g. `singapore-gum`'s photo is of a Singapore MRT station, since
    the fact is literally about MRT door sensors), while `wiki`/
    `wikiTerm` still point at the fact's own correct article. If a new
    fact's topic also has no good lead photo, do the same: pick a
    real, clearly-related substitute rather than forcing a weak image
    or a stock-looking flag/map graphic.
  - `credit` + `creditUrl`: Commons/Wikipedia images require
    attribution, so every image shows a small credit chip (bottom-right
    corner, `.fact-image-credit` in `style.css`) linking to the file's
    description page. `credit` is the cleaned photographer/uploader
    name pulled from the file's `imageinfo` `extmetadata.Artist` field
    (HTML-stripped, wiki-signature junk like `(talk) 3 Feb 2009 (UTC)`
    trimmed off), falling back to `"Wikimedia Commons"` when no
    reasonably short artist name is available (public-domain NASA
    imagery, for instance, is usually credited this way).
  - `renderFactImage()` in `app.js` sets `.src` only when a fact is
    actually revealed (never preloaded in bulk), and keeps `.fact-image`
    at `opacity: 0; height: 0` until the browser's `onload` fires, so a
    slow-loading photo never shows a broken-image icon or shoves the
    text below it around — it just fades/expands in a beat after the
    text appears. `onerror` hides the slot the same way, so a dead link
    degrades to "no image" instead of a broken one.
  - To add or refresh an image for a fact, resolve it the same way (this
    hits Wikipedia's API, which needs a `User-Agent` header or it
    403s):
    `curl -s -A "Factlas/1.0" "https://en.wikipedia.org/w/api.php?action=query&titles=Your_Title&prop=pageimages&piprop=thumbnail|name&pithumbsize=480&redirects=1&format=json&formatversion=2"`
    then a second call with `titles=File:<the returned name>&prop=imageinfo&iiprop=extmetadata` to get the `Artist`/`LicenseShortName` for `credit`.
- `app.js` — all interaction logic:
  - `PROJECTION` + `project(lat, lon)` convert real-world coordinates into
    `map.svg`'s own coordinate space. **map.svg ships with no documented
    projection** (it's simplified/stretched, not true equirectangular or
    Mercator), so these four constants were fit by least-squares linear
    regression — bounding-box centers of ~28 geographically compact,
    roughly convex countries (e.g. Poland, Kenya, Uruguay, Iceland),
    computed from `map.svg`'s own path data with a hand-rolled SVG path
    parser (handles M/L/H/V/C/S/Q/T/A/Z, absolute and relative), fit
    against each country's real-world geographic centroid. Residual error
    lands mostly in the 2-8px range on this map (max observed ~18px on a
    784×458 viewBox), which is fine for a glowing dot but means **don't
    treat pin placement as survey-grade** — it's a stylized toy map, not
    GIS. If a future fact needs a pin far from anywhere already
    calibrated (e.g. deep Pacific or high Arctic), sanity-check the
    projected point against a nearby country's bounding box before
    trusting it blindly.
  - A shuffle-bag (`shuffledFactList()` + `queue`/`queueIndex`) walks a
    freshly shuffled copy of `FACTS` so every fact is shown once before
    any repeat, and never repeats the fact that just played even across
    a reshuffle boundary.
  - `applyFact()` diffs the previous fact's `countries` (and separately,
    `cities`) against the new fact's: anything not reused gets the
    `.explored` class (dim, sticks around), anything in the new fact gets
    `.active` (bright, pulses). Something present in both stays `.active`
    rather than flickering through `.explored`. Countries and pins are
    tracked as two independent active/explored sets.
  - `setCountryState()` looks country elements up by
    `document.getElementById` directly against the inlined SVG's ids —
    this only works because the SVG is inlined in the DOM, not loaded as
    an external image. Pins don't exist in `map.svg` at all — `app.js`
    creates a `<g id="pins">` layer at startup and builds each pin
    lazily on first use (`getOrCreatePin()`), keyed by city `name` (so
    two different facts naming the same place, e.g. two both mentioning
    Beijing, reuse one pin rather than stacking duplicates), then keeps
    it around and just toggles its active/explored classes afterward —
    same behavior as countries.
  - `renderParagraph()` builds one `<p>`, and — once per fact, via the
    `state.done` flag passed in from `renderFact()` — splits the first
    paragraph containing `wikiTerm` into text/anchor/text so only the
    first occurrence becomes a link, even if the same word shows up
    again later in the fact.
  - `renderFactImage()` (see the `image` field above for the full
    reasoning) sets the `<img>`'s `src` and lets its own `onload`/
    `onerror` control whether `.fact-image` becomes visible — nothing
    else in the render path waits on the image loading.
  - `renderFact()` swaps the fact card's text (title, place, category,
    each paragraph via `renderParagraph()`, the Wikipedia link's `href`)
    and retriggers its fade-in via a class toggle. It also adds
    `panel-open` to `<body>` (once — it's never removed, since the panel
    stays open from the first reveal onward), which is what tells
    `style.css` to shrink the map's box to make room for the dock.
  - The theme toggle button (`#theme-toggle`) flips `<html>`'s
    `data-theme` attribute between `"light"`/`"dark"` and saves the
    choice to `localStorage['factlas-theme']`. A tiny inline
    `<script>` in `index.html`'s `<head>` (before `style.css` even
    finishes loading) re-applies a saved value immediately, so returning
    visitors don't see a flash of the wrong theme. No stored value =
    theme just follows the OS via `prefers-color-scheme` in CSS, no JS
    involved.
- `style.css` — dark/navy-and-brass by default, with a full light
  ("parchment/atlas") palette defined twice: once inside
  `@media (prefers-color-scheme: light)` scoped to
  `:root:not([data-theme="dark"])` (so it applies automatically, unless
  the toggle has explicitly forced dark), and once under
  `:root[data-theme="light"]` (so the toggle can force it regardless of
  the OS). Both blocks set the exact same custom properties — if the
  palette ever changes, change it in both places, or the toggle and the
  OS-driven default will drift apart. The map itself is styled purely
  through CSS on `#world-map path`/`g` plus the `.active`/`.explored`
  classes JS toggles — no per-country or per-pin styling lives in
  `map.svg` or inline in `app.js`. Pins are a small `<g class="pin">`
  with two circles (`.pin-halo` for the pulsing glow ring, `.pin-dot`
  for the solid center).
- **The fact panel is a docked sidebar, not an overlay** — this was a
  deliberate change from an earlier version that centered the panel on
  top of the map and covered whatever it was highlighting. Now
  `.fact-panel` is `position: fixed; right: 0` at full viewport height,
  and `body.panel-open .map-wrap` gets extra `padding-right` (both with
  matching-duration transitions) so the map's own box visibly shrinks to
  make room the first time a fact is revealed, instead of anything
  sitting on top of it. Below 780px width it switches to a bottom sheet
  instead (a side dock would be too narrow on a phone) — see the
  `@media (max-width: 780px)` block, which overrides both the panel's
  position and which side of `.map-wrap` gets the padding.

To add a fact: add an entry to `FACTS` in `data.js`.
- Double-check any new `countries` codes exist in `map.svg` first
  (`grep 'id="xx"' map.svg`) — nothing validates this at runtime, a
  missing id just means that country silently doesn't light up.
- Only add `cities` for places the fact text actually names.
  Coordinates don't need to be exact to the metre — this projection has
  its own ~5-10px slack anyway — but they should be the real lat/lon of
  the real place, not a guess at "somewhere in that country."
- Verify any new `wiki` URL resolves before adding it (Wikipedia's API
  will follow redirects and flag anything that doesn't exist):
  `curl -s "https://en.wikipedia.org/w/api.php?action=query&titles=Your_Title&redirects=1&format=json&formatversion=2"`
  — check the response isn't `"missing": true`, and use the redirect
  target if there is one.
- Pick a `wikiTerm` that's an exact, verbatim substring of one of your
  `paragraphs` (same case, same punctuation) — a quick way to check a
  whole batch at once:
  `node -e "const FACTS=new Function(require('fs').readFileSync('data.js','utf8')+'; return FACTS;')(); FACTS.forEach(f => { if (!f.paragraphs.some(p => p.includes(f.wikiTerm))) console.log(f.id, 'BAD wikiTerm'); })"`

## Running it

Open `index.html` directly in a browser — no server needed.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site (linked from "The Quagmire" hub at the `ai-slop/` root). No
environment variables, API keys, or build step required.
