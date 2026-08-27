# CLAUDE.md

## What this project is

A digital directory of fifty famous art galleries and museums around the
world. Explore them on an interactive world map (filterable by continent and
art type), or jump straight into one via the "Notable museums" strip below
it, to see each gallery's exterior architecture, click into one to view
its history and a filterable carousel of its best-known artworks (filter by
artist, era, or art movement — Cubism, Surrealism, Dadaism, and others),
then click any artwork to see it magnified alongside a "wall of text" panel
with its description and history. Dark mode is supported throughout.

Two vocabularies are kept deliberately separate: `ARCHITECTURE_STYLES`
(gallery buildings — Renaissance, Brutalist, Deconstructivist, etc.) and
`ART_MOVEMENTS` (the art inside them — Cubism, Surrealism, Dadaism, etc.).
Brutalism, for instance, describes a building (the Hirshhorn Museum, MASP),
never a painting — it only ever appears in the first list.

## Architecture

Plain HTML/CSS/JS, ES modules, no framework, no build step, no backend —
same conventions used across this shelf's other hand-rolled JS projects.

- `galleries-data.js` / `artworks-data.js` — pure data: the 50 galleries
  (each with a `coords: {lat, lon}` used by the map view) and their
  artworks, plus the two controlled vocabularies above (each vocabulary
  entry carries its own curated gradient, used by the placeholder below).
  This is where to add a new gallery or artwork. Artwork depth is
  intentionally tiered, not uniform: encyclopedic flagship museums (Louvre,
  MoMA, Met, Hermitage, British Museum, etc.) carry far more artworks than
  smaller, more specialized ones — forcing every gallery to the same count
  would mean padding the smaller collections with invented or unverifiable
  pieces, which this project avoids on principle (see Content accuracy
  below).
- `map-view.js` — the interactive world map (the primary way to browse).
  Fetches `world-map.svg` (a local, public-domain CC0 equirectangular map from
  Wikimedia Commons — see its own header comment for the source) once and
  inlines it into the DOM rather than using `<img>`/`<object>`, specifically
  so its country paths can be recolored via theme variables. Pins are placed
  directly at each gallery's raw `(lon, lat)` — the map's own
  `<g id="positioner" transform="translate(180,90) scale(1,-1)">` wrapper
  already converts degrees into correctly oriented screen space, no
  separate projection math needed. Galleries whose coordinates fall within
  ~1.2° of each other (e.g. London's three museums) are fanned out around
  their shared centroid so they stay individually clickable instead of
  stacking into one pin.
  - `map-continents.js` maps every ISO 3166-1 alpha-3 country code in
    `world-map.svg` to one of the six continent names used elsewhere in this
    project. Each country `<g class="country XXX">` gets tagged with
    `dataset.continent` and colored via a per-continent `--map-<slug>` CSS
    variable, giving the "denoted by lines" continent grouping its color;
    the visible border *lines* between landmasses are just a thin `stroke`
    applied to every country shape (see `.world-map-svg .country` in
    style.css), not literal continent-only outlines — simpler to implement
    correctly than computing real inter-continent adjacency, and reads the
    same visually.
  - **Two zoom layers.** Clicking a continent's shape *or* its filter chip
    both zoom to that continent (padded, 50°-minimum box size so a
    sparsely-populated continent like Oceania doesn't zoom in past
    recognizability). Clicking a country's shape a *second* time — once its
    continent is already the focused one — drills one layer further into
    that specific country (12°-minimum box, much tighter), which is what
    actually separates a nucleated cluster like Paris's three museums into
    individually clickable pins. `ui.js` owns this decision
    (`handleCountryClick`): first click on any country in a not-yet-focused
    continent = continent zoom; second click on a country within the
    already-focused continent = country zoom; a gallery-less country
    clicked at that point is a deliberate no-op, not a dead end. `map-view.js`
    itself doesn't know about "layers" — it just reports which country was
    clicked and lets `ui.js`'s state decide what that means.
    `map-continents.js`'s `COUNTRY_CODE_TO_GALLERY_COUNTRY` is the (deliberately
    small — only the ~26 countries with a gallery) map from a clicked
    country's ISO code to the exact `country` string used on `GALLERIES`,
    which is what the country-zoom bounding box is computed from.
  - **Zoom animation + dynamic pin sizing.** The zoom itself is a
    hand-rolled `requestAnimationFrame` interpolation of the SVG `viewBox`
    attribute, not a CSS transition — cross-browser support for
    transitioning `viewBox` directly is still inconsistent. Every animation
    frame also recomputes pin `r` (and stroke-width) proportionally to the
    *current* interpolated viewBox width relative to the full world
    (`pinRadiusForViewBoxWidth`), floored at a small minimum so pins never
    shrink to invisibility at the tightest country zoom. Without this, pins
    stay a fixed size in *map* (degree) units, which means they visually
    balloon as the viewBox shrinks — this is what "dynamic" pin sizing
    means here: roughly constant *screen* size across zoom levels, the same
    convention real map pins (Google Maps, etc.) use. The hover-enlarge
    effect is a CSS `transform: scale()` on top of whatever that current
    size is (see `.map-pin:hover circle` in style.css), not a fixed radius,
    so it stays proportionate at every zoom level too.
  - **Hover popup.** `.map-hover-info` is a small thumbnail + name/location
    card (not just text) — the thumbnail reuses `wiki-images.js`'s
    `resolveImages` at `THUMB_SIZE.CARD`, the same size/cache key the
    notable-museums strip already uses, so a gallery hovered on the map
    after having appeared in that strip (or vice versa) resolves from
    `localStorage` instantly rather than re-fetching. Falls back to a plain
    letter-monogram tile
    (first letter of the gallery name) while the fetch is in flight or if
    it never resolves to an image — same "never a broken-image icon"
    principle as everywhere else on the site.
  - **Country `<g>` vs `<path>` gotcha**: each country in the source SVG is
    `<g class="country XXX"><path d="..."/>...</g>` — the class lives on the
    `<g>` wrapper, not the path(s) inside it. Styling (`fill`) cascades down
    fine, but click/hover event delegation must use `event.target.closest(".country")`,
    never compare `event.target` to the `<g>` directly — `event.target` for
    a real click is always the innermost `<path>`, not its wrapper. Some
    countries (ones with overseas territories, e.g. France) are split across
    *multiple* same-class `<g>` elements scattered worldwide, so don't
    assume "biggest bounding box among same-code elements" finds the
    mainland piece — it can just as easily find whichever piece has the most
    scattered sub-paths.
- `wiki-images.js` — looks up real images at *runtime* via Wikipedia's
  public, key-less MediaWiki API (`action=query&prop=pageimages`), keyed by
  a `wikiTitle` field on each gallery/artwork entry, rather than hardcoded
  image URLs (which would mean hand-verifying ~80 direct links). Batches
  requests per screen, caches results in `localStorage`
  (`wag-img-cache:v1:*`), and resolves failures/offline/no-match to a
  `{status:'placeholder'}` result instead of throwing. No DOM access.
- `filters.js` — pure functions: filtering a gallery's artworks by
  movement/artist/era, computing the artist list and era buckets for a
  gallery, stepping to the next/previous artwork for the focus dialog's
  prev/next buttons, and (for the world view) `distinctMovements`/
  `galleryIdsWithMovement`, which power the art-type filter below. No DOM
  access — testable via `node --input-type=module`, the same convention
  used across this shelf's other hand-rolled JS projects.
- `router.js` — hash-based routing (`#/`, `#/gallery/<id>`,
  `#/gallery/<id>/<artworkId>`). Hash routing is required (not
  `pushState` with real paths) because this deploys to GitHub Pages, which
  can't rewrite arbitrary paths server-side. `navigate(state, {push})` is
  the one function that changes the URL; `push:false` (used for
  prev/next-ing through artworks) uses `replaceState` instead of
  `pushState`, so stepping through ten artworks doesn't add ten back-button
  stops.
- `media.js` — tiny shared DOM helper (not in the original plan file list,
  added during implementation once it became clear all three render
  modules needed identical placeholder → image markup/crossfade behavior).
  Renders a gradient placeholder immediately, then swaps in a real `<img>`
  once `wiki-images.js` resolves one.
- `render-world.js` / `render-gallery.js` / `render-artwork.js` — DOM
  rendering for the three screens (world map + notable-museums strip,
  gallery detail, artwork focus). `render-world.js` also exports
  `renderContinentFilter` (the chip row that filters the map's pins) and
  `renderArtTypeFilter` (a `<select>` dropdown, not a chip row — the
  movement vocabulary is ~30 entries, too many to wrap cleanly as chips the
  way the 6 continents do). `renderNotableMuseums` shows an explicit "No
  notable museums yet" empty state rather than silently rendering nothing,
  though in practice this can't currently happen (three flagship galleries
  already clear the threshold). Each module owns only its own screen's
  dynamic content; the persistent chrome around them (theme toggle, dialog
  close/prev/next, carousel scroll buttons) is wired once in `ui.js`
  instead, since those elements aren't recreated on every navigation.
- `ui.js` — orchestrator: theme toggle (`data-theme` on `<html>`,
  persisted in `localStorage` under `wag-theme`, defaulting from
  `prefers-color-scheme`), the continent filter *and* art-type filter state
  (the two filters AND together via `visibleGalleries()`, which feeds only
  the map — the map is always visible, no view-mode toggle), the router
  wiring, and the single `document.startViewTransition` call site. The
  art-type filter never touches `zoomedCountry` (unlike the continent
  filter, which always clears it) — it changes *which galleries qualify*,
  not the map's camera position, so a country you'd zoomed into stays
  zoomed even if the newly selected art type happens to filter its pins
  down to none. `notableGalleries()` is a *separate*, unfiltered list —
  every gallery with `NOTABLE_MIN_ARTWORKS` (currently 12) or more
  researched artworks, sorted by depth — feeding the horizontally-scrolling
  "Notable museums" strip below the map. It deliberately ignores the
  continent/art-type filters (it's a fixed shortcut, not another filtered
  view) and needs no manual upkeep: it grows on its own as more artwork
  batches get merged in. Every navigation — script-driven (card clicks,
  dialog buttons) or browser-driven (back/forward, manual hash edits) —
  funnels through one transition-wrapped handler, so nothing ever
  double-wraps a view transition.
- `style.css` — one stylesheet, sectioned by screen. Brass/museum-plaque
  accent palette, system sans for body text, system serif for headings, all
  offline-safe (no external font requests — only the artwork/gallery images
  themselves depend on the network).

### The two trickier pieces, if you're extending this

- **View transitions**: gallery cards, the gallery hero, artwork cards, and
  the artwork focus dialog's image all get a shared `view-transition-name`
  (`gallery-card-<id>` / `artwork-<id>`) set via `element.style.viewTransitionName`
  in JS. The API requires a name to be unique across the *visible* document
  at any one moment, so `render-gallery.js` deliberately skips setting the
  name on whichever artwork card is currently open in the dialog (the
  dialog's own image is using that name instead) — search for
  `activeArtworkId` if a similar clash shows up when adding new shared
  elements.
- **Routing de-duplication**: `router.js` tracks the last hash it actually
  handled, because browsers don't agree on whether same-page hash
  navigation fires `hashchange`, `popstate`, or both — without the guard,
  a single back/forward press can trigger two renders (and two competing
  view transitions).
- **`[hidden]` vs. an unconditional `display` rule**: any element that's
  both toggled via the `hidden` attribute *and* has its own unconditional
  `display: grid`/`flex`/etc. in `style.css` needs an explicit
  `.the-class[hidden] { display: none; }` override (see `.view`,
  `.map-hover-info`). Author-stylesheet rules beat the user-agent's
  built-in `[hidden]` rule at equal specificity because origin is resolved
  before specificity in the cascade — without the override, `hidden`
  silently does nothing. (`#world-map-container` used to need this too,
  back when a Map/Grid toggle hid it — now the map is always visible, so
  there's one less place this gotcha applies, but watch for it if a future
  toggle gets added anywhere.)

## Live image lookups also power the map's country coloring

Not just artwork/gallery photos — `map-view.js` inlines `world-map.svg`
purely so its `.country` paths can be recolored to match the current theme
via CSS, which an `<img>` or `<object>` embed can't do from the parent
page's stylesheet.

## Running it

No install step needed. Open `index.html` directly, or serve the folder
with a static server (some browsers restrict ES module imports over the
`file://` protocol, and the Wikipedia image lookups need a real origin
for their CORS request either way):

```
python3 -m http.server
```

## Content accuracy & the runtime image dependency

This is a curated hobby dataset, not a live museum API — gallery/artwork
facts were hand-authored and spot-checked against current sources at
writing time, but museums do rotate, loan, and occasionally relocate their
holdings, so treat this as illustrative rather than authoritative.

Every gallery/artwork image is fetched live from Wikipedia at runtime
(nothing is bundled or hardcoded) — see `wiki-images.js`. If a page is
opened offline, or a `wikiTitle` doesn't resolve to a Wikipedia page with a
thumbnail, that entry falls back to its curated gradient placeholder rather
than a broken-image icon, so the site stays fully usable either way. Not
every real artwork has a dedicated Wikipedia article with a detected page
image — a meaningful fraction of entries showing a placeholder instead of a
photo is expected, not a bug.

`world-map.svg` is the one bundled (not runtime-fetched) asset: a static,
public-domain (CC0) equirectangular world map from Wikimedia Commons
(`BlankMap-Equirectangular.svg`), saved locally rather than hotlinked since
it's part of the page's own layout, not swappable per-item content the way
artwork photos are.

Given the scale here (50 galleries, each needing individually verified
artworks), most of the artwork data was authored by parallel research
agents given the same schema, accuracy bar, and "verify anything uncertain
via web search, drop it rather than guess" instruction used for the
original 13 galleries — then spot-checked and integrity-checked (duplicate
IDs, broken `galleryId` references, movement-vocabulary typos) before being
merged in. Treat any oddities you spot as a data-authoring gap to fix in
`artworks-data.js`, not a sign the whole dataset is unreliable.

## Deployment

Static hosting only — GitHub Pages, Netlify, or Vercel (static mode). No
environment variables or API keys required. Lives in the shared `ai-slop`
repo (`github.com/JozsuaHeng/Random-projects`, "The Quagmire") alongside
the shelf's other quick/fun projects — see `ai-slop/CLAUDE.md` for that
convention. Uses the shared `.gitignore` and `.nojekyll` at the `ai-slop/`
repo root rather than duplicating them here. Previously lived in its own
`Art-Projects` repo; migrated back into `ai-slop` as a single tile on the
Quagmire hub page rather than a separate collection.
