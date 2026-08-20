# CLAUDE.md

## What this folder is

`ai-slop` is a single git repository that holds small, throwaway, or
satirical projects as subfolders — things that don't warrant their own
GitHub repo. Unlike `visa-map/` or `cost-of-living-map/` (each a full
standalone project with its own git history and remote), everything in here
shares one repo, so it can be pushed to a single GitHub repository as a
collection.

- Each project still gets its **own subfolder** (e.g. `broetry-generator/`),
  fully self-contained with its own `CLAUDE.md` describing that specific
  project.
- When starting a new quick/fun/satirical project, create a new subfolder
  here rather than adding files loose in this folder or giving it a
  top-level spot in the shelf.
- Git history is shared across all subfolders here — there is one `.git` at
  the `ai-slop/` level, not one per project.

## Landing page (`index.html` at this folder's root) — "The Quagmire"

This folder's root `index.html` + `style.css` is "The Quagmire," a
neal.fun-style hub page that lists every project here as an illustrated
tile (themed art banner, name, and a link into that project). It's the
front door for the GitHub Pages site
(`jozsuaheng.github.io/Random-projects/`).

- **Tiles carry no description text on purpose** — just the art banner
  and the name. The art itself should hint at what the project is; the
  rest is for visitors to find out by clicking in. Don't add a
  one-liner back under the title.
- **A tile is the art banner, full stop — there's no separate text band
  below it.** `.art` is the tile's only content; `"Open →"` (`.go`) is
  an absolutely-positioned overlay pinned to `.art`'s bottom-right
  corner (small dark pill, `backdrop-filter: blur`), revealed on hover,
  not a sibling element with its own padding. Earlier versions had a
  `.meta` div below `.art` for the description text — once descriptions
  were dropped, that left a padded, mostly-empty band under every tile,
  which read as an unbalanced gap. Don't reintroduce a `.meta` (or
  anything else) below `.art`; if a new tile needs an "Open →" hint,
  give it a `.go` span as the last child inside `.art`, not a wrapper
  below it.
- **Whenever a new project subfolder is added here, add a matching tile**
  to `index.html`: a themed art banner (gradient/decorative doodles in
  `.art`, following the pattern of the existing themes in `style.css`)
  and name. Don't let the hub page go stale. Give each tile's art its
  own distinct visual treatment (palette, layout, motif) rather than
  reusing another tile's pattern with different colors — the art is the
  only signal a visitor gets before clicking in, so it should stand
  apart at a glance.
- Tiles link with **absolute GitHub Pages URLs**
  (`https://jozsuaheng.github.io/Random-projects/<project>/`), not
  relative paths — clicking a tile should always land on the live
  deployed site, even when `index.html` is opened locally.
- Keep the hub page itself minimal — it's a directory, not a project in
  its own right. No build step, no dependencies, just plain HTML/CSS
  (plus Google Fonts for a couple of display fonts used in the tile art).
