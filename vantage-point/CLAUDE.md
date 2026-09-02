# CLAUDE.md — The Quagmire (skills library page)

## What this is

A read-only, browsable website version of `claude-skills-library/` (a
separate standalone project at the shelf root, its own local git repo,
not pushed to GitHub). That project is the actual **functional** Claude
Skills — installed to `~/.claude/skills/` and used by Claude directly.
This project exists purely so Jozsua (or anyone else) can *view* that
same content easily in a browser, as a tile in the hub page.

Naming history: built as "The Playbook" (`the-playbook/`), renamed to
"Vantage Point" 2026-09-02, then renamed again the same day to **"The
Quagmire"** — Jozsua's explicit request ("swap out the name for the
quagmire"). **Note the resulting ambiguity, flagged but not resolved**:
the shelf's actual hub page (`ai-slop/index.html`, one level up) is
*also* called "The Quagmire" — its own `<h1>` says so, and this page's
own "&larr; The Quagmire" back-link points at it. So there are now two
differently-titled-the-same-thing pages one click apart. The hub *tile*
linking to this page (`data-theme="playbook"` in `../index.html`) still
reads "Vantage Point" and was deliberately left alone, since only this
page's own identity was asked to change — if that mismatch (tile says
one name, destination page says another) turns out to be unwanted,
updating the tile's `art-title` text in `../index.html` is the fix.
The folder itself stays `vantage-point/` (not renamed) to avoid breaking
the already-live GitHub Pages URL. If renaming again: update `SITE_NAME`
in `build.py` (mindmap center label), `index.html`'s
`<title>`/`<h1>`/meta description, and — if wanted — the hub tile's
art-title text + the folder name (which would need a URL update too).

- `index.html` + `style.css` + `app.js`: the catalog page (client-side
  search filter only, no backend).
  - A large, animated, colour-coded radial **mindmap** is the primary
    visual overview — center hub, one branch per category, one leaf per
    skill. Leaf label positions are resolved by an **actual iterative
    collision-avoidance pass** in `build_mindmap()`, not hand-tuned
    spacing constants: each leaf starts at a jittered angle/radius
    (deterministic per slug — same layout every rebuild, not random),
    then every pair of leaf label bounding boxes is checked and any
    overlapping pair gets pushed further from the hub, repeated (up to
    600 passes, converges in practice well under that) until zero pairs
    overlap. `build.py` prints the result of this check on every run
    ("Mindmap collision resolution: 0 overlapping leaf labels" — treat
    any other output as a real bug to fix, not noise to ignore). Canvas
    size (`viewBox`, `cx`/`cy`) is then computed *from* the resolved
    layout's actual extent plus a margin, not guessed ahead of time —
    this is what let leaf/category font sizes go from 14px→20px→40px
    (and category 18px→24px→48px) across three rounds of "still too
    small" feedback without needing to re-derive spacing constants by
    hand each time; a future font/count change should just work the same
    way. (An earlier version used a fixed angular-gap formula with
    hardcoded constants — it silently produced real overlaps twice
    before this rewrite; don't revert to that approach.)
    Branch/leaf lines start at the **hub's edge**, not its exact center
    point, and the hub `<g>` is emitted **last** so it paints on top of
    every line — both were needed together to stop lines from
    roughly-opposite branches visibly crossing through the hub circle's
    interior (a real bug from the first pass, caught from a screenshot —
    verify any future change to `r_center`/line logic by checking every
    branch line's start distance from center equals `r_center`, not 0).
    On load it draws itself outward (hub pops in, each branch's line
    draws, its category node bounces in, then its leaves cascade the
    same way — see `.mm-pop`/`.mm-line` keyframes in `style.css`; the
    pop keyframe deliberately overshoots twice, not once, for a visibly
    springier bounce). Once the entrance sequence settles (~2.6s), a
    slow, low-opacity **pulse ring** (`.mm-pulse-ring`, a second circle
    behind the hub) keeps expanding and fading on an infinite loop —
    added because the finished, static mindmap read as inert; kept
    deliberately subtle (long duration, low opacity peak) rather than
    distracting, and respects `prefers-reduced-motion`.
    It supports pan (click-drag or single-finger touch) and zoom
    (+/−/reset buttons only — mouse-wheel zoom was tried and removed,
    since it hijacked normal page-scroll whenever the cursor was over the
    mindmap), implemented by transforming the `#mm-viewport` `<g>` — see
    the pan/zoom block in `app.js`. Its `CX`/`CY`/`VB` constants are read
    from the SVG's actual `viewBox` attribute at runtime, not hardcoded —
    they'd otherwise drift out of sync every time `build_mindmap()`'s
    computed canvas size changes. Clicking a **leaf** opens that
    skill's popup directly (see below); clicking a **category node**
    opens and scrolls to that category section, since categories (unlike
    skills) still expand inline. Drag-then-release is distinguished from
    a real click via a movement threshold, so panning near a node doesn't
    accidentally trigger it.
  - **Skill cards open in a centered popup, not inline.** A skill card
    shows only name/description/download-link; clicking the card (or its
    "Read more →" button, or its mindmap leaf) opens `#skill-modal` with
    that skill's full rendered content copied in via JS
    (`openSkillModal()` in `app.js`, reading the card's hidden
    `.skill-body` div). This replaced an earlier version where each
    skill was itself a `<details>` expanding inline — with 50 cards that
    made the page unwieldy to scan. **Categories are unaffected** and
    still expand inline as `<details>`/`<summary>` (collapsed by
    default) — only individual skills moved to the popup pattern.
    Expand-all/Collapse-all now only target `.category` elements
    accordingly.
  - **Downloads**: every skill has a small "⬇ .zip" link (in its
    summary, and again in the skill popup's header), every category has
    a "⬇ download N" link, and there's a "⬇ Download all 50" button
    right below the mindmap, right-aligned, above the first category
    (moved out of the hero's button row — with 4 buttons there it was
    overflowing the page's padding on narrower widths). All served from
    `dl/*.zip`, generated by `build_zips()` in `build.py` using Python's
    stdlib `zipfile` (no dependency) — each zip preserves the real
    `<slug>/SKILL.md` + `<slug>/references/*.md` structure, so extracting
    one straight into `~/.claude/skills/` (drag-and-drop in Finder, no
    Terminal required) works exactly like the source library. `dl/` is
    regenerated (old zips deleted first) on every `build.py` run and
    must be committed — GitHub Pages serves it as static files, there's
    no build step on the hosting side.
  - The **"How to use this"** button opens an in-page flip-card modal
    (9 cards, prev/next/dots) written for a genuinely non-technical
    reader, with real multi-paragraph elaboration per card. Card 2
    explicitly names all three "Claudes" (claude.ai, Claude Desktop app,
    Claude Code) up front, each its own short paragraph, not one dense
    paragraph. Card 4 ("Getting a skill into that folder") presents
    **two equally-valid paths as numbered sub-steps each** (1/2/3/4 for
    Way 1, 1/2/3 for Way 2) rather than flowing prose: Way 1 is
    Terminal-free (download the zip from this site, unzip, drag the
    folder into `~/.claude/skills/` via Finder — added after Jozsua
    asked whether Terminal was mandatory); Way 2 is the `cp` command,
    and its step 3 now explicitly tells the reader to run
    `ls ~/.claude/skills/` afterward and what they should see — Jozsua
    tried the command himself and reported "there's nothing after
    clicking enter," which the original "no news is good news" framing
    didn't resolve for a first-timer. Card 8
    (claude.ai/Desktop upload path) went through an elaborate pass and
    then a simplification pass — Jozsua found the elaborate version too
    long; it's now 3 short paragraphs covering the same facts (Desktop
    = same as web, the correct **Settings → Customize → Skills →
    Upload** path behind a **Code execution** capability toggle —
    verified via live web search, an earlier draft had the path wrong —
    and that uploaded skills start switched off). The last card's
    "next" button shows a checkmark (`✓`, styled `.flip-btn-done`) on
    the final card instead of the word "Done," which didn't fit the
    circular button cleanly.
  - The hero has title+tagline stacked full-width, then a second row
    (`.hero-bottom`) putting the tagline and the search/button controls
    as top-aligned flex siblings — the controls sit literally in line
    with the tagline's top edge, not just "somewhere to the right."
    Stacks to one column under 900px. `.btn-row` wraps
    (`flex-wrap: wrap`) rather than forcing buttons to overflow past the
    column's edge on narrower widths.
- All skills' full content (both `SKILL.md` and any `references/*.md`) is
  generated into `index.html` by `build.py`, between the
  `<!-- CONTENT:START -->` / `<!-- CONTENT:END -->` markers, and the
  mindmap between `<!-- MINDMAP:START -->` / `<!-- MINDMAP:END -->`. The
  category list (name + slugs, in order), `CATEGORY_COLORS`, and
  `CATEGORY_ICONS` are hardcoded in `build.py` — add a new skill to the
  right category's list there too when one is added to the source
  library; adding a whole new category needs an entry in all four dicts
  (`CATEGORIES`, `MINDMAP_LABELS`, `CATEGORY_COLORS`, `CATEGORY_ICONS`).

## Keeping it in sync

This site is a **generated copy**, not the source of truth. If a skill in
`claude-skills-library/skills/` changes (content edited, a skill added or
removed), regenerate this page:

```bash
cd ai-slop/vantage-point
python3 build.py
```

This rewrites only the mindmap and category/skill content between their
markers — the hero, flipchart modal, zoom controls, styles, and script
are untouched. Commit the updated `index.html` along with whatever
changed on the source side.

## Design notes

- Palette/typography: warm paper + ink, Source Serif 4 for headings,
  Inter for body/UI — chosen for a more professional, less
  editorial/whimsical feel than an earlier Fraunces + Caveat pass. Font
  links live only in `index.html`'s `<head>`.
- Category colour-coding runs through the whole page (mindmap branch →
  category border/heading → each skill's left-border accent), so the
  same seven hues tie the overview and the detail view together.
- Supports both light and dark mode via `prefers-color-scheme` (and a
  `data-theme` override hook), since this is meant to be a genuinely
  readable reference page, not just a novelty tile destination.
- Mindmap entrance animation respects `prefers-reduced-motion` (skips
  straight to the final state).
- The hub tile for this project (`data-theme="playbook"` in
  `../index.html` / `../style.css` — internal CSS name kept as-is
  through the rename, only the visible label/link changed) uses a
  light, gridded "whiteboard" card with a small hand-drawn
  strategy-diagram doodle and the name in a handwriting face (Caveat,
  kept only there) — the only light/gridded tile in the grid, on
  purpose, so it stands apart at a glance per the hub's own tile-design
  rule.
