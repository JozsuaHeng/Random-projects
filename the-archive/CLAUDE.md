# CLAUDE.md — the-archive

## What this is

**THE ARCHIVE** — a browser-based library of "choose your own adventure"
gamebooks, in the style of the old Fighting Fantasy / CYOA paperbacks, with
a retro pixel-art (CRT terminal) aesthetic. Pure static HTML/CSS/JS, no
build step, no dependencies.

`home.html` is the library entry point — a shelf of story cards. Right now
it ships with one playable story, **DEAD SIGNAL** (`game.html`): you wake
from cryosleep aboard the derelict salvage ship ISV Vesper. Sci-fi
mystery/horror. Other genres (medieval, alien, Egyptian, Amazonian,
post-apocalyptic) are listed on the shelf as "Coming Soon" placeholders.

## Status

**Draft — 93 pages, Acts One & Two complete, 6 endings.** All story data
lives in `story.js`. Open `home.html` to browse, or `game.html` directly to
play. Page numbers are deliberately non-sequential (like the paperbacks).

## Files

- `home.html` — the library / story-picker landing page.
- `game.html` — the game itself: storybook page (left), ship map (top
  right), character/stats/backpack/equipment (bottom right).
- `style.css` — CRT/pixel styling, scanlines, layout grid, shared by both
  pages.
- `story.js` — all game data: `PAGES` (the story graph), `ITEMS`, `ROOMS`.
  **This is the only file that needs touching to extend the story.**
- `engine.js` — game state, page rendering, choices, luck tests (2d6),
  item use/equip, autosave to localStorage, death/ending handling.
- `sprites.js` — pixel-art sprite data (items, portrait, paper-doll
  silhouette) drawn to canvas, plus the starfield.

## Story-graph conventions (story.js)

- Each page: `{ room, text, effects?, choices?, type? }`.
- `effects`: applied once per visit, e.g. `["add","medkit"]`,
  `["stat","sanity",-1]`, `["flag","powerOn"]`.
- Choices: `{ label, to }` plus optional `needItem`, `needAnyItem`,
  `needFlag`, `needEquipAll` (gates), or `luck: {pass, fail}` for 2d6
  luck tests (the `charm` item gives +1).
- Items with a `slot` property (`head`/`body`/`hands`/`feet`/`back`/`held`)
  are wearable — click twice in the backpack to equip.
- `type: "death"` or `"act-end"` marks terminal pages.
- Deaths by stat: health→58, oxygen→60, sanity→54 (see engine.js).

## Adding a new story

To add another gamebook to the shelf: duplicate the `dead-signal`-style
folder pattern (own `story.js`/`ITEMS`/`ROOMS`/`game.html`, or param the
existing engine), then add a `.book-card` entry to `home.html` linking to
it.

## Checking your work

`node validate.js` walks the story graph and fails if any choice/luck
target references a page that doesn't exist, or if a page is unreachable.
Run it after any story.js edit.
