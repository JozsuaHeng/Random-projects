# CLAUDE.md

## What this project is

A whimsical lamp puzzle set in a dim room at twilight, full of rain and
a detailed city skyline outside the window: a row of ornate lamps rests
on the windowsill in front of it, and the goal — stated plainly on
screen — is to click a combination that lights every lamp. Three levels
in sequence (3, then 5, then 7 lamps). The first two are genuinely
winnable — a real combination lights every lamp, and the "Give Up &
Continue" button relabels to "Next Level →" once it happens. The third
(7 lamps) is not winnable by anyone, on any combination; the same button
(still labeled "Give Up & Continue," since here it's the only way
forward) is what actually moves the player past it. It's always enabled,
never gated on making an attempt first — an earlier version required a
first click before it lit up, which read as broken/stuck rather than
intentional. Finishing level 3 shows a tongue-in-cheek "certificate of
partial futility."

On page load, one of four lamp styles (brass banker's lamp, Tiffany
stained-glass, bare Edison bulb, mid-century articulated desk lamp) is
picked at random and used for every lamp that session, and a fresh
procedurally-generated skyline is drawn behind the rain. The lamps sit
on a raised desk (not the floor/bottom edge of the viewport) dressed
with static props — an open book, a steaming cup, a small plant, a
curled cat — so they read as "things on a desk," not just switches in a
row; a full window-pane grid plus curtains and a valance frame the scene
above them. The lamp *order* on screen and, for levels 1-2, *which*
lamp(s) start lit are both re-randomized every time a level is entered
(see below) — so neither the visual arrangement nor the winning click
sequence is the same twice in a row.

Public-facing copy (hub tile, README, in-page tagline) is deliberately
soft — "there may be a catch" rather than "you cannot win" — so the page
itself doesn't spoil the trick. The project used to be named "Lumen
Limbo," which was dropped for the same reason: "Limbo" gives the twist
away before anyone's clicked a single lamp.

## The actual trick (why level 3 is unwinnable, and 1 & 2 aren't)

Levels 1-2 use the same click rule: clicking lamp `i` toggles lamp `i`
**and** its ring-neighbor `(i+1) % n` (`pairFor()` in `game.js`) —
always exactly two lamps per click. Whether "all lit" is reachable from
a level's starting state is a linear-algebra question over GF(2)
(double-clicking a lamp cancels out, so only the *set* of distinct lamps
pressed matters, and the reachable states form a coset of the span of
the click vectors) — not a difficulty dial. It depends on both `n` and
which lamp(s) start lit, and it can flip from solvable to impossible
with a one-lamp change to the starting state. `randomOddLitSet(n)` in
`game.js` picks a fresh starting set every time a level is (re)entered
— but only from starting weights that are exhaustively verified safe,
not arbitrary randomness:

- **n=3**: every odd-weight starting set (i.e. exactly 1 lamp lit — the
  only odd weight below 3) is winnable — all 3 possible single-lamp
  starts confirmed by brute force. Solvable in as few as 1 click.
- **n=5**: every odd-weight starting set below 5 (weight 1, 5 ways, or
  weight 3, 10 ways — 15 total) is winnable — all 15 confirmed by brute
  force, not just the weight-1 cases. Solvable in as few as 2 clicks.
  `randomOddLitSet` picks uniformly from whichever odd weight it rolls,
  then a random subset of that size — every output of that function is
  therefore pre-verified, not merely likely-safe.
- **n=7, starts with nothing lit, `chaos: true`**: unreachable, full
  stop. Level 3 doesn't use `pairFor()` — instead `randomEvenToggleSets()`
  gives each of the 7 lamps its own random toggle set (2, 4, or 6 lamps,
  always including itself), re-rolled every time the level is (re)entered,
  including on "Reset Lamps." Visually this reads as chaotic — one click
  can make several lit lamps vanish while only one or two reappear — but
  every set's size is even by construction, which is the only property
  that matters: toggling an even number of lamps changes the total
  lit-count by an even amount (`(size of the set) - 2 × (how many in it
  were already on)`, which always shares the size's parity), so the
  lit-count's parity is invariant no matter which specific lamps end up
  in each set. It starts even (0) and a full board is odd (7), so they
  can never meet — this holds for *any* random assignment, not just the
  one rolled at load time. Confirmed by brute-forcing `all_on_reachable`
  across 500 independently-seeded random toggle-set assignments (zero
  counterexamples) before relying on the general argument. The lamp
  *positions* are independently shuffled too (`lampOrder`, also re-rolled
  per level entry) so the on-screen arrangement doesn't hint at anything
  — each lamp's `data-index` attribute is what `syncLampVisuals()` and
  the click handler actually key off, not DOM position.

`isFullyLit()` in `game.js` is a real, honest win check used identically
on all three levels — it isn't special-cased per level or short-circuited
for level 3. There's no "neverWin" flag; level 3's impossibility is a
structural property of `randomEvenToggleSets()` always producing
even-sized sets plus its empty starting state, not a runtime guard. If
`LEVELS` ever changes (a different `n`, a different odd-weight cap in
`randomOddLitSet`, an added level, a non-chaos level's click rule),
re-verify reachability by brute force before assuming a level is
winnable *or* unwinnable — nothing here generalizes by intuition alone,
as the n=3/5-vs-n=7 split shows.

## Architecture

Plain HTML/CSS/JS, no framework, no build step.

- `skyline.js` — `skylineSVG(seed)` procedurally generates a three-layer
  night skyline (far/mid/near buildings via a seeded `mulberry32` PRNG,
  each with its own lit-window density/color and occasional rooftop
  antenna + blinking aviation beacon), plus a moon with a soft glow and
  thin cloud bands. Re-rolled once per page load in `game.js` and
  injected into `#glass`, behind the rain layers. Deliberately kept low-
  density and low-contrast (window density maxes out around 20%, plus a
  `blur(1.4px)` + desaturate/darken filter on `.skyline-svg` in
  `style.css`) so it reads as a soft, out-of-focus backdrop — the lamps,
  not the skyline, are meant to be the sharpest, brightest thing in the
  frame. A `.depth-fade` gradient darkens the lower third of the scene
  for the same reason: more contrast for the lamp glow to pop against.
- `lamps.js` — `renderLamp(styleIndex, uid)` returns one of four inline
  SVG lamp strings (brass banker's lamp with a green glass dome, rivets,
  a glass sheen highlight, and a pull chain; Tiffany lamp with a
  10-pane stained-glass dome built from a `clipPath` + radiating
  triangular panes — so imprecise pane geometry never overflows the dome
  silhouette — plus an acorn finial and a two-tone bead fringe; bare
  Edison bulb with a double-loop filament, a glass reflection highlight,
  and a cloth-cord-to-wall-plug detail resting against the base; a
  mid-century articulated desk lamp with two jointed metal arm segments,
  a cone shade, and a translucent light-beam triangle that fades in with
  the rest of its `lamp-emit` elements). Every gradient/clip-path id is
  templated with a `uid` so multiple lamp instances on the same page
  don't collide. Lit/unlit state is driven entirely by CSS classes
  (`.lamp-emit`, `.lamp-core`, `.is-lit` on the wrapper) in `style.css`,
  not by swapping markup.
- `game.js` — `LEVELS` (just `n`/`label`/optional `chaos` now — no fixed
  starting state lives here), `togglesFor()` (dispatches to `pairFor()`
  for levels 1-2 or `chaosSets` for level 3), `randomOddLitSet()` (levels
  1-2's starting state) and `randomEvenToggleSets()` (level 3's click
  rule), taunt text, and the give-up/ending flow. `lampOrder` — an
  independently shuffled sequence, re-rolled on every `startLevel()` call
  regardless of level — controls the on-screen left-to-right order;
  `renderLampRow()` iterates it and stamps each button's real index in
  `data-index`, which `syncLampVisuals()` reads back rather than assuming
  DOM position matches lamp index. Each lamp button's width is set via
  `flex: 0 1 <ideal>px` (not a fixed pixel width computed from
  `window.innerWidth`, which proved unreliable to test against headless
  Chrome's `--window-size` flag) so the row shrinks correctly on narrow
  viewports using ordinary CSS flex-shrink. `lampStyle` is rolled once
  per page load and threaded into every `renderLamp()` call so the whole
  session stays visually consistent.
- `style.css` — the full-bleed twilight scene: a `.glass` layer holding
  the generated skyline plus layered CSS-only rain (animated
  `repeating-linear-gradient` backgrounds), a fixed moon glow, a
  `.depth-fade` gradient, a `.valance` + two `.curtain` panels framing
  the sides, a window mullion grid (`.mullion-v`/`.mullion-h`/
  `.mullion-h2`) spanning only the window portion of the viewport — they
  stop at `bottom: 260px`, which is also where the raised `.sill` (desk)
  begins, so panes don't run behind the desk. Inside `.sill`: a
  108px-tall `.desk-surface` plank at the very bottom, four static
  `.prop` elements (book, cup with animated steam, plant, cat) positioned
  around `bottom: 96-108px` — deliberately *not* near the desk's front
  edge, which is covered by the fixed bottom `.dock` (game controls) — and
  `.lamp-row` at `bottom: 104px`, all sitting on the same visible band
  above the dock. Plus a film grain overlay (inline SVG `feTurbulence`
  data URI, low opacity, `mix-blend-mode: overlay`) for the lo-fi look.
  Each lamp gets
  two glow layers behind it (`.lamp-halo`, a large soft radial glow
  around the fixture; `.lamp-pool`, a flatter wash pooling onto the sill
  wood below it) — both `z-index: -1`, which only stays scoped to the
  lamp itself (rather than escaping behind the whole `.sill`) because
  `.lamp` has an explicit `z-index: 0` to give it its own stacking
  context.

To add a lamp style: add a `*LampSVG(uid)` function in `lamps.js` (give
its glow elements the `lamp-emit` class and, if it has a distinct light
source like a filament, `lamp-core`), add it to `LAMP_RENDERERS`, and it
enters the random rotation automatically.

## Running it

Open `index.html` directly, or serve the folder with any static file
server (`python3 -m http.server`). No build step, no dependencies beyond
two Google Fonts loaded via `<link>`.

## Deployment

Static hosting only (pushed to GitHub Pages alongside the other
`ai-slop` projects). No environment variables or API keys.
