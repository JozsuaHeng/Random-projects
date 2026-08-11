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

On page load, one of three lamp styles (brass banker's lamp, Tiffany
stained-glass, bare Edison bulb) is picked at random and used for every
lamp that session, and a fresh procedurally-generated skyline is drawn
behind the rain.

Public-facing copy (hub tile, README, in-page tagline) is deliberately
soft — "there may be a catch" rather than "you cannot win" — so the page
itself doesn't spoil the trick. The project used to be named "Lumen
Limbo," which was dropped for the same reason: "Limbo" gives the twist
away before anyone's clicked a single lamp.

## The actual trick (why level 3 is unwinnable, and 1 & 2 aren't)

Every level uses the exact same click rule: clicking lamp `i` toggles
lamp `i` **and** its ring-neighbor `(i+1) % n` (`pairFor()` in
`game.js`) — always exactly two lamps per click. Whether "all lit" is
reachable from a level's starting state is a linear-algebra question
over GF(2) (double-clicking a lamp cancels out, so only the *set* of
distinct lamps pressed matters, and the reachable states form a coset of
the span of the click vectors) — not a difficulty dial. It depends on
both `n` and which lamp(s) start lit, and it can flip from solvable to
impossible with a one-lamp change to the starting state. Concretely,
each level's `initialLit` in `LEVELS` was chosen after brute-forcing
every 2^n press combination for that exact `n`/start pair — not by
formula, and not interchangeably:

- **n=3, starts with lamp 0 lit**: solvable, in as few as 1 click
  (pressing the lamp whose pair is `{1,2}` alone completes it).
- **n=5, starts with lamp 0 lit**: solvable, in as few as 2 clicks
  (pressing lamps 1 and 3).
- **n=7, starts with nothing lit**: unreachable, full stop — the best
  reachable state is always exactly one lamp short (6 of 7), no matter
  the combination or order. This one *is* a genuine parity trap: every
  click toggles an even number of lamps, so the lit-count's parity never
  changes, and it starts even (0) while a full board is odd (7) — they
  can never meet. That specific argument is what makes level 3
  provably, not just practically, impossible.

`isFullyLit()` in `game.js` is a real, honest win check used identically
on all three levels — it isn't special-cased per level or short-circuited
for level 3. There's no "neverWin" flag; level 3's impossibility is a
structural property of `pairFor()` plus its starting state, not a
runtime guard. If `LEVELS` ever changes (a different `n`, a different
`initialLit`, an added level), re-verify reachability by brute force
before assuming a level is winnable *or* unwinnable — nothing here
generalizes by intuition alone, as the n=3/5-vs-n=7 split shows.

## Architecture

Plain HTML/CSS/JS, no framework, no build step.

- `skyline.js` — `skylineSVG(seed)` procedurally generates a three-layer
  night skyline (far/mid/near buildings via a seeded `mulberry32` PRNG,
  each with its own lit-window density/color and occasional rooftop
  antenna + blinking aviation beacon), plus a moon with a soft glow and
  thin cloud bands. Re-rolled once per page load in `game.js` and
  injected into `#glass`, behind the rain layers.
- `lamps.js` — `renderLamp(styleIndex, uid)` returns one of three inline
  SVG lamp strings (brass banker's lamp with a green glass dome, rivets,
  a glass sheen highlight, and a pull chain; Tiffany lamp with a
  10-pane stained-glass dome built from a `clipPath` + radiating
  triangular panes — so imprecise pane geometry never overflows the dome
  silhouette — plus an acorn finial and a two-tone bead fringe; bare
  Edison bulb with a double-loop filament, a glass reflection highlight,
  and a cloth-cord-to-wall-plug detail resting against the base). Every
  gradient/clip-path id is templated with a `uid` so multiple lamp
  instances on the same page don't collide. Lit/unlit state is driven
  entirely by CSS classes (`.lamp-emit`, `.lamp-core`, `.is-lit` on the
  wrapper) in `style.css`, not by swapping markup.
- `game.js` — `LEVELS` (size + starting lit set per level), the click
  handler (`pairFor` + XOR toggle), taunt text, and the give-up/ending
  flow. `lampStyle` is rolled once per page load and threaded into every
  `renderLamp()` call so the whole session stays visually consistent.
- `style.css` — the full-bleed twilight scene: a `.glass` layer holding
  the generated skyline plus layered CSS-only rain (animated
  `repeating-linear-gradient` backgrounds), a fixed moon glow, window
  mullions spanning the full viewport (the horizontal one pinned just
  above the sill via `bottom: 102px`, not a percentage, so it stays put
  regardless of viewport height), a wood-grain windowsill spanning the
  full width, a fixed bottom control dock, and a film grain overlay
  (inline SVG `feTurbulence` data URI, low opacity, `mix-blend-mode:
  overlay`) for the lo-fi look.

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
