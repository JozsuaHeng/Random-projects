# CLAUDE.md — The Playbook

## What this is

A read-only, browsable website version of `claude-skills-library/` (a
separate standalone project at the shelf root, its own local git repo,
not pushed to GitHub). That project is the actual **functional** Claude
Skills — installed to `~/.claude/skills/` and used by Claude directly.
This project exists purely so Jozsua (or anyone else) can *view* that
same content easily in a browser, as a tile in The Quagmire.

- `index.html` + `style.css` + `app.js`: the catalog page (client-side
  search filter only, no backend). Categories and skills are both
  `<details>`/`<summary>` — collapsible at both levels, plus
  Expand-all/Collapse-all controls.
- `guide.html`: a separate step-by-step how-to page (install, trigger
  behavior, writing your own), including two hand-drawn inline SVG
  diagrams (progressive disclosure trigger flow, install flow) — linked
  from `index.html`'s top nav.
- All skills' full content (both `SKILL.md` and any `references/*.md`) is
  generated into `index.html` by `build.py`, between the
  `<!-- CONTENT:START -->` / `<!-- CONTENT:END -->` markers. The category
  list (name + slugs, in order) is hardcoded in `build.py` — add a new
  skill there too when one is added to the source library.

## Keeping it in sync

This site is a **generated copy**, not the source of truth. If a skill in
`claude-skills-library/skills/` changes (content edited, a skill added or
removed), regenerate this page:

```bash
cd ai-slop/the-playbook
python3 build.py
```

This rewrites only the content between the markers — the hero, styles,
search box, and script are untouched. Commit the updated `index.html`
along with whatever changed on the source side.

## Design notes

- Palette/typography is deliberately its own thing (warm paper +
  ink-teal, Fraunces serif headings) — distinct from The Quagmire hub's
  dark maximalist look, matching how other project subfolders here each
  have their own visual identity.
- Supports both light and dark mode via `prefers-color-scheme` (and a
  `data-theme` override hook), since this is meant to be a genuinely
  readable reference page, not just a novelty tile destination.
- The hub tile for this project (`data-theme="playbook"` in
  `../index.html` / `../style.css`) uses a light, gridded "whiteboard"
  card with a small hand-drawn strategy-diagram doodle and the name in a
  handwriting face (Caveat) — the only light/gridded tile in the grid, on
  purpose, so it stands apart at a glance per the hub's own tile-design
  rule.
