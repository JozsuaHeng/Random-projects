# CLAUDE.md — the-archive

## What this is

**THE ARCHIVE** — a browser-based library of "choose your own adventure"
gamebooks, in the style of the old Fighting Fantasy / CYOA paperbacks, with
a retro pixel-art (CRT terminal) aesthetic. Pure static HTML/CSS/JS, no
build step, no dependencies.

`home.html` is the library entry point — a shelf of story cards. Two
playable stories so far:
- **DEAD SIGNAL** (`game.html`, repo root) — you wake from cryosleep aboard
  the derelict salvage ship ISV Vesper. Sci-fi mystery/horror. 93 pages,
  Acts One & Two, 6 endings.
- **THE LAST WARDEN** (`the-last-warden/game.html`) — a hedge knight enters
  a keep whose garrison went silent forty years ago, and finds out the
  watch never actually ended. Dungeon fantasy. 90 pages, Acts One & Two,
  6 endings.

Other genres (alien, Egyptian, Amazonian, post-apocalyptic) are listed on
the shelf as "Coming Soon" placeholders.

## Architecture: shared engine, per-story folders

`engine.js`, `sprites.js`, and `style.css` live at the repo root and are
shared by every story. Each story owns its own `story.js` (all narrative
data) and its own `game.html` (which loads the shared files by relative
path, e.g. `../engine.js` from a subfolder).

Dead Signal's `story.js`/`game.html` live at the repo root for historical
reasons (it was the first story, before this became a multi-story shelf).
**New stories should get their own subfolder**, e.g. `the-last-warden/`,
containing just `story.js` and `game.html`.

Two things a story's `story.js` MUST define, since they're story-specific
but referenced by the shared `engine.js`:
- `const PLAYER_PORTRAIT = [...]` — the 16x16 sprite grid shown in the
  character panel. (Item/sprite art in `sprites.js` is shared and keyed by
  item id — pick fresh ids per story to avoid another story's art bleeding
  through, e.g. Dead Signal's `torch` vs. Last Warden's `woodtorch`.)
- `META.title` — also used to namespace the localStorage save key
  (`archive-save-<slug>-v1` in `engine.js`), so two stories' saves don't
  collide.

## Files (shared, at repo root)

- `home.html` — the library / story-picker landing page.
- `style.css` — CRT/pixel styling, scanlines, layout grid.
- `engine.js` — game state, page rendering, choices, luck tests (2d6),
  item use/equip, autosave to localStorage, death/ending handling. Assumes
  `META`/`ITEMS`/`ROOMS`/`PAGES`/`PLAYER_PORTRAIT` are already in scope
  (loaded from that story's `story.js` before this script runs).
- `sprites.js` — shared pixel-art sprite data (`SPRITES` keyed by item id,
  `PALETTE`, the paper-doll silhouette drawer, the starfield). Does NOT
  contain a portrait — that's per-story now.
- `validate.js` — story-graph validator, works on any story folder (see
  below).

## Story-graph conventions (each story's story.js)

- Each page: `{ room, text, effects?, choices?, type? }`.
- `effects`: applied once per visit, e.g. `["add","medkit"]`,
  `["stat","sanity",-1]`, `["flag","powerOn"]`.
- Choices: `{ label, to }` plus optional `needItem`, `needAnyItem`,
  `needFlag`, `needEquipAll` (gates), or `luck: {pass, fail}` for 2d6
  luck tests (an item with `+1 on luck tests` in its description, like
  Dead Signal's `charm` or Last Warden's `relic`, raises the pass
  threshold from 7 to 8 — see `runLuckTest` in engine.js).
- Items with a `slot` property (`head`/`body`/`hands`/`feet`/`back`/`held`)
  are wearable — click twice in the backpack to equip. `needEquipAll`
  choice gates check the *equipped* state specifically, unlike `needItem`
  which just checks inventory.
- `type: "death"` or `"act-end"` marks terminal pages (no `choices` needed;
  the engine renders a restart prompt automatically).
- `META.deathPages` maps each stat (`health`/`oxygen`/`sanity`) to its
  death page number. Note: the `oxygen` stat key is fixed by the shared
  engine/HTML markup, even if a story relabels it in the UI (Last Warden
  shows it as "STAMINA" — only the visible `<span>` text changed, not the
  underlying `oxygen` id, since engine.js hardcodes that key).

## Adding a new story

1. Create `<story-name>/` with its own `story.js` (META/ITEMS/ROOMS/PAGES/
   PLAYER_PORTRAIT) and `game.html` (copy an existing one, fix the relative
   `../engine.js` etc. paths, retitle).
2. Add any new item sprites to the shared `sprites.js` (pick ids that don't
   collide with other stories' items).
3. Add a `.book-card` entry to `home.html` linking to
   `<story-name>/game.html`.
4. (Optional) Reskin to match the setting: add `<story-name>/theme.css`
   overriding the `:root` color variables from `style.css` (`--bg`,
   `--panel`, `--phosphor`, `--alert`, etc. — see
   `the-last-warden/theme.css` for the medieval-torchlight example), link
   it in `game.html` *after* `../style.css`. For the animated top-right
   backdrop, set `META.backdrop` to pick an effect (`"starfield"` is the
   default; `"embers"` gives a torchlit-dungeon look) — add a new
   `start<Name>(canvas)` function to the shared `sprites.js` for other
   settings and wire it into the `if (META.backdrop === ...)` chain in
   `engine.js`'s `boot()`.
4. Run `node validate.js <story-name>` from the repo root.

## Checking your work

`node validate.js [story-folder]` walks that story's graph and fails if any
choice/luck target references a page that doesn't exist, or if a page is
unreachable, or if an item has no matching sprite. Defaults to the current
directory (i.e. `node validate.js` alone checks Dead Signal, since it's at
the root). For a story in its own subfolder: `node validate.js
the-last-warden`. Run it after any story.js edit.
