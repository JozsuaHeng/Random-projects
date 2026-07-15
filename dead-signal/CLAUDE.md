# CLAUDE.md — dead-signal

## What this is

**DEAD SIGNAL** — a browser-based "choose your own adventure" gamebook in the
style of the old Fighting Fantasy / CYOA paperbacks, with a retro pixel-art
(CRT terminal) aesthetic. Pure static HTML/CSS/JS, no build step, no
dependencies. Open `index.html` directly or serve the folder.

Setting: you wake from cryosleep aboard the derelict salvage ship ISV Vesper.
Sci-fi mystery/horror.

## Status

**Draft — Act One only (~50 pages).** The full game is planned at 200–250
pages across three acts. Act One ends at cliffhanger pages 51 / 53 / 56.
Page numbers are deliberately non-sequential (like the paperbacks); the gaps
in numbering (4, 8, 10, 17, 19, 23, 27, 32, 45, etc.) are reserved for
Acts Two and Three.

## Files

- `index.html` — layout: storybook page (left), ship map (top right),
  character/stats/backpack (bottom right).
- `style.css` — CRT/pixel styling, scanlines, layout grid.
- `story.js` — all game data: `PAGES` (the story graph), `ITEMS`, `ROOMS`.
  **This is the only file that needs touching to extend the story.**
- `engine.js` — game state, page rendering, choices, luck tests (2d6),
  item use, autosave to localStorage, death/ending handling.
- `sprites.js` — pixel-art sprite data (items, portrait) drawn to canvas,
  plus the starfield.

## Story-graph conventions (story.js)

- Each page: `{ room, text, effects?, choices?, type? }`.
- `effects`: applied once per visit, e.g. `["add","medkit"]`,
  `["stat","sanity",-1]`, `["flag","powerOn"]`.
- Choices: `{ label, to }` plus optional `needItem`, `needFlag`,
  `needAnyItem` (gates), or `luck: {pass, fail}` for 2d6 luck tests
  (the `charm` item gives +1).
- `type: "death"` or `"act-end"` marks terminal pages.
- Deaths by stat: health→58, oxygen→60, sanity→54 (see engine.js).

## Checking your work

`node validate.js` walks the story graph and fails if any choice/luck
target references a page that doesn't exist, or if a page is unreachable.
Run it after any story.js edit.
