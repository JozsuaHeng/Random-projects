# CLAUDE.md

## What this project is

A retro, pixel-art rocket launch toy, built as a single persistent scene
(no page/screen navigation, no scrolling). Pick one of 10 real-world
launch vehicles from a panel on the right — the scene's time-of-day and
terrain switch to match that vehicle's real launch site — confirm it to
open the cargo manifest, pack exactly 13 items from a 50-item list of
plausible spaceflight equipment, then watch the launch play out on the
same scenic pixel-art launch pad, with a live altitude readout, a
zoom control, and a camera that pans upward with the rocket on
high-altitude flights. Rocket
names/specs are inspired by real vehicles (Falcon Heavy, Starship, Soyuz,
Long March 5, Ariane 6, H3, LVM3, Nuri, Electron, Vulcan Centaur) —
rounded public figures kept for flavor, not a technical reference (nor a
pixel-perfect replica — see the note in `pixelart.js` below).

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend, no audio
files. Two Google Fonts (`Press Start 2P`, `VT323`) are loaded via
`<link>` for the retro look; everything else, including sound, is
self-contained.

- `data.js` — pure data: the `ROCKETS` catalog (10 vehicles, each with a
  full spec sheet, a `country`/`flag`/`designation`, an `env` object
  (`time`: day/twilight/night, `terrain`: coastal/desert/tropical/alpine,
  `locale`: the real launch site name), and a `palette`/`build` object
  describing how its pixel sprite is assembled), the `ITEMS` manifest list
  (each with an `icon` spec — a template name + a 3-color scheme),
  `CARGO_VERDICTS` (flavor text for the post-flight cargo readout), and
  `FAILURE_MODES` (the outcome library — 8 entries, each with a title,
  blurb, and mission-control captions).
- `pixelart.js` — canvas drawing primitives:
  - `drawRocket()` assembles a rocket sprite procedurally from a spec's
    `build` object (nose shape, fin style, booster count/layout/height,
    body width, stripes, grid fins, legs, engine nozzle cluster, panel
    greebles, interstage ring, and two vehicle-specific flourishes —
    `escapeTower` for Soyuz, `flaps` for Starship). The nose is a rounded
    dome (`drawDome()` + `NOSE_PROFILES`) — a hand-tuned row-by-row width
    table per nose type (round/point/blunt), not a continuous curve
    formula. A formula-based curve (an ogive) was tried first and
    degrades to a flat-looking triangle once it's only a few dozen pixels
    tall; the hand-tuned table reads as a clean silhouette at both the
    small vehicle-grid thumbnails and the large on-pad size. Body/nose/
    booster shading all derive light and dark tones from a single hull
    color via `shadeColor()` rather than hand-picked shadow colors. This
    is a shared parametric generator, not hand-authored sprites, so it
    can't reach true "exact replica" fidelity — pushing further would
    mean bespoke per-rocket pixel art instead of shared `build` flags.
  - Scene dressing — day/twilight/night sky gradients + sun/moon/distant
    blinking lights, stars, a 3-layer mountain/dune parallax, terrain
    foreground silhouettes (palm/cactus/pine), a lit-window skyline +
    water glints (coastal only), fuel tanks by the pad, a horizon fog
    band, and a vignette — all in service of a moodier, quieter
    atmosphere than a bright default "game" look.
  - `drawIcon()` + `ICON_DRAWERS` render each manifest item's small pixel
    icon from its `tpl` name, reusing a `drawBlob()` helper (a stepped
    ellipse silhouette) plus simple rect/taper primitives.
  - `ParticleSystem` (smoke, fire, debris, `spawnBigDebris` for chunkier
    wreckage) used by the launch sequence. `drawVaporRing()` draws a
    brief expanding condensation-ring effect around the rocket body
    during ascent.
- `sound.js` — a small Web Audio SFX module (`SFX`). Every sound is
  synthesized (oscillators + a filtered noise buffer) rather than loaded
  from a file: short tones for UI actions, a noise+thump `boom()` for
  explosions, and a start/stop sawtooth `rumbleStart()/rumbleStop()` drone
  for sustained engine sound. Gated by `SFX.enabled`, toggled from the
  `#sound-toggle` button in `game.js`.
- `game.js` — one persistent `requestAnimationFrame` loop drives the scene
  at all times. There is no screen switching: a right-hand `.vehicle-panel`
  cycles through three views (`view-list` → `view-detail` → `view-items`,
  shown/hidden via the `hidden` attribute) for picking a vehicle,
  reviewing its spec sheet, and packing the manifest; a debrief card fades
  in centered over the scene when a launch resolves. Selecting an item
  animates a floating clone of its icon from the manifest card to the
  rocket's on-canvas position (`flyItemToRocket()`, a plain DOM element
  transitioning over the canvas — not part of the canvas rendering
  itself). Each entry in `FAILURE_MODES` has a matching animation function
  (`modePadRud`, `modeDeadstick`, `modeOffAxis`, etc.) that mutates the
  scene frame-by-frame over a scripted timeline; one is picked at random
  when a launch starts. Altitude is derived generically from the rocket's
  current vs. resting y-position (`METERS_PER_PIXEL`), and drives both the
  readout and a camera-pan offset (`S.camY`, applied only to the "near"
  draw layer — sky/stars/moon are a separate, non-panning layer drawn
  first) so high-altitude flights visibly leave the ground behind. Modes
  with a single dramatic beat (a `CLIMAX_TIME` entry) get a slow-motion
  window in the second before it — `timeScaleFor()` shrinks `dt` as the
  mode's internal clock (`S.t`) approaches that moment, so the rocket
  visibly hangs in the air a beat longer for suspense; modes without an
  entry (instant pad failures, the patient burn) stay at normal speed.
  Every ascent-capable mode also gets a generic trailing contrail
  (smoke spawned each frame while under thrust) and a one-time vapor
  ring once altitude crosses ~45% of the rocket's height — both computed
  from altitude in the main loop, not wired per-mode. The canvas's
  logical resolution tracks the viewport (`PIXEL_SCALE`) so the
  pixel-art stays chunky at any window size.

  A `zoomLevel` (default 0.75, adjustable via the bottom-center +/−
  control or mouse wheel over the canvas) scales only the "near" layer
  around the pad's base point (`ctx.translate` to the pad, `ctx.scale`,
  translate back) — purely a rendering transform. `rocketW`/`rocketH`
  (used for altitude math and mode timelines) are untouched by zoom, so
  physics and the visual zoom stay decoupled.

To add a rocket: add an entry to `ROCKETS` in `data.js` (spec fields +
`env` + `palette` + `build`) — no drawing code needed. To add a manifest
item: add an entry to `ITEMS` with an `icon` spec, reusing an existing
`tpl` or adding a new drawer to `ICON_DRAWERS`. To add an outcome: add an
entry to `FAILURE_MODES` and a matching function in `game.js`'s
`MODE_FN` map.

## Running it

Open `index.html` directly in a browser, or serve the folder with any
static file server (`python3 -m http.server`). Sound needs a user
gesture before it can play (browser autoplay policy) — the first click
anywhere in the vehicle panel satisfies that.

## Deployment

Static hosting only (this repo is pushed to GitHub Pages alongside the
other `ai-slop` projects). No environment variables, API keys, or audio
assets required.
