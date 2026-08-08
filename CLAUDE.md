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
tile (themed art banner, name, one-line description, and a link into
that project). It's the front door for the GitHub Pages site
(`jozsuaheng.github.io/Random-projects/`).

- **Whenever a new project subfolder is added here, add a matching tile**
  to `index.html`: a themed art banner (gradient/decorative doodles in
  `.art`, following the pattern of the existing themes in `style.css`),
  name, one-liner, and tag. Don't let the hub page go stale.
- Tiles link with **absolute GitHub Pages URLs**
  (`https://jozsuaheng.github.io/Random-projects/<project>/`), not
  relative paths — clicking a tile should always land on the live
  deployed site, even when `index.html` is opened locally.
- Keep the hub page itself minimal — it's a directory, not a project in
  its own right. No build step, no dependencies, just plain HTML/CSS
  (plus Google Fonts for a couple of display fonts used in the tile art).
