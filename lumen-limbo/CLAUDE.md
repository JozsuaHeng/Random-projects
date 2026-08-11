# CLAUDE.md

## What this project is

A whimsical, unwinnable lamp puzzle set in a dim, rain-streaked room at
twilight: a row of detailed lamps rests on a windowsill, and the goal —
stated plainly on screen — is to click a combination that lights every
lamp. Four levels in sequence (2, then 3, then 5, then 7 lamps). No
combination on any level ever lights every lamp; the only way forward is
the "Give Up & Continue" button, which is the actual progression
mechanic. Finishing level 4 shows a tongue-in-cheek "certificate of
futility."

On page load, one of three lamp styles (brass banker's lamp, Tiffany
stained-glass, bare Edison bulb) is picked at random and used for every
lamp that session.

## The actual trick (why it's unwinnable)

Clicking lamp `i` toggles lamp `i` **and** its ring-neighbor `(i+1) % n`
(`pairFor()` in `game.js`) — always an even number of lamps per click.
That makes the parity of "how many lamps are lit" invariant: it can never
change, no matter what's clicked or in what order (double-clicking a lamp
just cancels out, so only the *set* of distinct lamps pressed matters).
Each level's starting parity is deliberately set to the opposite of a
full board's parity, so "all lit" is outside the reachable set entirely —
not just hard, structurally impossible:

- n=2: starts with **one** lamp already lit (odd count) — a full board is
  even (2), so it can never match.
- n=3, 5, 7: start with **zero** lamps lit (even count) — a full board on
  an odd-sized level is odd, so it can never match.

Verified by brute force for all four sizes (every 2^n press combination)
before writing any UI: `all_on_reachable` is `False` in every case, and
the best reachable state is always exactly one lamp short (`n-1` lit) —
see the taunt text keyed to that count in `game.js`.

`isFullyLit()` in `game.js` is a real, honest win check — it isn't
special-cased or short-circuited. It's just never satisfiable given the
toggle rule above. There's no "neverWin" flag anywhere; the impossibility
is a structural property of `pairFor()` plus each level's starting state,
not a runtime guard. Keep it that way — if this ever needs to change
(e.g. adding a level), pick a new starting lit-count with the opposite
parity of `n`, or the level becomes accidentally winnable.

## Architecture

Plain HTML/CSS/JS, no framework, no build step.

- `lamps.js` — `renderLamp(styleIndex, uid)` returns one of three inline
  SVG lamp strings (brass banker's lamp with a green glass dome and pull
  chain; Tiffany lamp with a stained-glass dome built from a `clipPath`
  + radiating triangular panes so imprecise pane geometry never overflows
  the dome silhouette; bare Edison bulb with a squiggle filament path).
  Every gradient/clip-path id is templated with a `uid` so multiple lamp
  instances on the same page don't collide. Lit/unlit state is driven
  entirely by CSS classes (`.lamp-emit`, `.lamp-core`, `.is-lit` on the
  wrapper) in `style.css`, not by swapping markup.
- `game.js` — `LEVELS` (size + starting lit set per level), the click
  handler (`pairFor` + XOR toggle), taunt text, and the give-up/ending
  flow. `lampStyle` is rolled once per page load and threaded into every
  `renderLamp()` call so the whole session stays visually consistent.
- `style.css` — the twilight scene (gradient wall, a window with layered
  CSS-only rain via animated `repeating-linear-gradient` backgrounds,
  blurred "bokeh" lights, a condensation/fog blob), a wood-grain
  windowsill the lamps sit on, a fixed bottom control dock, and a film
  grain overlay (inline SVG `feTurbulence` data URI, low opacity,
  `mix-blend-mode: overlay`) for the lo-fi look.

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
