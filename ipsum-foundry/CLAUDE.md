# CLAUDE.md

## What this project is

**Ipsum Foundry** — a themed Lorem Ipsum generator. It generates
placeholder text in fifteen voices — classic Latin plus fourteen
themed ones (Pirate, Corporate, Shakespearean, Hacker, Noir, Wizard,
Cowboy, Surfer, Valley Girl, Medieval Knight, Conspiracy Theorist,
Infomercial, Drill Sergeant, Fortune Teller) — by count of paragraphs,
sentences, or words. **Classic is the default theme on load**, with a
visible "Default" badge on its card and a hint line under the Style
group label saying so explicitly — this was a deliberate choice (an
earlier version defaulted to Corporate) so a first-time visitor sees
the actual, real Lorem Ipsum before anything else.

The design intentionally avoids the generic "AI tool" look (violet
gradients, one generic rounded sans-serif everywhere). Instead it leans
into a print-shop/type-foundry concept: warm paper background, ink
text, a single terracotta accent, a serif ("Spectral") for the
generated manuscript text and a monospace ("IBM Plex Mono") for all UI
chrome — the contrast between "typeset prose" and "terminal controls"
is deliberate, not just two fonts picked at random. The favicon and
in-page brand mark are both a pilcrow (¶), the actual typographic mark
for a paragraph. Supports light and dark mode (see below).

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend — static
and self-contained like every other project in this folder.

- `index.html` — a small inline `<script>` at the top of `<head>`
  (before the stylesheet) reads `localStorage` / `prefers-color-scheme`
  and sets `data-mode` on `<html>` immediately, so there's no flash of
  the wrong theme before `app.js` loads. Body: header (pilcrow mark +
  wordmark + tagline + `.topbar-actions`), a two-column layout
  (`.layout`, controls panel **420px** + flexible output panel, stacks
  to one column under 960px) footer, and a `<dialog id="aboutDialog">`
  for the "What is Lorem Ipsum?" explainer (see below).
- **Topbar actions** (`.topbar-actions`): `#aboutBtn` ("What is Lorem
  Ipsum?") opens `#aboutDialog` via native `showModal()`; `#modeToggle`
  flips `data-mode` between `"light"`/`"dark"` on `<html>` and persists
  the choice to `localStorage` (key `ipsumFoundryMode`) via
  `applyMode()` in `app.js`. Two SVGs (`.icon-sun`/`.icon-moon`) live in
  the same button; CSS shows/hides them off `:root[data-mode="dark"]`.
- **Controls panel** (`.controls`): a `theme-grid` of 15 theme cards in
  **3 columns** (2 below 640px, 1 below 380px — see the small-screens
  section of `style.css`; each card shows the theme name + a 3-word
  flavor preview, e.g. "arrr · plunder · doubloons" — the preview is
  static markup, not derived from the word banks, so if a theme's bank
  changes, update its card preview too if it drifts). Card heights
  aren't uniform across a row — longer previews wrap to more lines in
  the narrower 3-column cards, which is expected, not a bug. The
  Classic card carries `.default-badge` and the group has a
  `.group-hint` line above the grid announcing the default — both need
  updating together if the default theme ever changes. Below that: a
  unit toggle (Paragraphs/Sentences/Words) that swaps the
  counter's min/max/step/default via `UNIT_DEFAULTS` in `app.js`
  (paragraphs defaults to **8**, near the top of its 1–12 range —
  chosen so a fresh page load fills the output panel rather than
  leaving it looking sparse); a stepper (−/+ buttons plus a
  direct-entry number input, clamped to the active unit's bounds); an
  "opener" checkbox; the Generate button; and a dashed-border "Surprise
  me" button (`#surpriseBtn` → `surpriseMe()`) that jumps to a random
  *other* theme and regenerates — Generate only re-rolls the currently
  active theme, this is the one control that changes theme for you.
  Every control change re-renders immediately — there is no separate
  "apply" step.
- **Output panel** (`.output`): a toolbar (live word/character/
  paragraph count + a `.toolbar-actions` group holding Download and
  Copy) above `.manuscript`, the generated `<p>` tags. Copy (`#copyBtn`)
  flips its label to "Copied" for 1.5s via `navigator.clipboard`;
  Download (`#downloadBtn` → `downloadText()`) builds a `Blob`, drives a
  throwaway `<a download>` click, and revokes the object URL right
  after — saves the current output as `ipsum-foundry-<theme>.txt`. The
  first paragraph gets `.drop-cap` (a CSS `::first-letter` drop cap in
  the accent color) purely as a typographic flourish. `#liveStatus`
  (`.sr-only`, `aria-live="polite"`) sits below `.manuscript` and gets
  a short summary ("Generated 80 words of corporate text.") on every
  `render()` — deliberately a short status line and not `aria-live` on
  `.manuscript` itself, so screen readers announce a summary instead of
  reading the entire regenerated block out loud on every stepper tweak.
- **About dialog** (`#aboutDialog`, native `<dialog>`): a short,
  original write-up (not copied from lipsum.com, which was the
  inspiration for having this at all) in six sections — what it is, why
  design uses nonsense text instead of real copy, its actual history (a
  scrambled passage of Cicero's *De Finibus Bonorum et Malorum*,
  popularized via Letraset sheets and then desktop-publishing software),
  whether it's "real" Latin (no — real word roots, no grammar or
  meaning), practical guidance on how much filler to actually use, and
  what this site adds. Closes via `#aboutClose`, `Escape` (native
  `<dialog>` behavior), or clicking the backdrop (a click listener on
  the dialog itself checks `e.target === aboutDialog`). **Centering is
  done explicitly**, not left to the browser: `.about-dialog` sets
  `position: fixed; top: 50%; left: 50%; transform: translate(-50%,
  -50%); margin: 0;` itself. This project went through the "just trust
  native `<dialog>` centering" approach first (relying on the UA
  default `position:absolute/fixed` + `inset:0` + `margin:auto`
  behavior) and it did not reliably land in the middle of the viewport
  in practice — the explicit fixed+transform approach replaced it
  because it doesn't depend on browser-specific `:modal` UA rules at
  all. If this ever needs revisiting, keep the explicit version; don't
  strip it back down to relying on native centering again. Width/height
  are in `vw`/`vh` rather than `%` for the same reason — unambiguous
  regardless of what `position:fixed`'s containing block happens to be
  in a given browser. It does need `max-height`/`overflow-y:auto` since
  the content is long enough to exceed a small viewport.
- `app.js` — all generation logic:
  - `THEMES.classic` is the odd one out: it has a flat `words` array
    (the real, standard Lorem Ipsum word list) instead of `banks`, and
    `buildSentence()` special-cases any theme with `.words` to
    comma-string 4-8 random words into a pseudo-sentence, the same way
    genuine Lorem Ipsum reads — because real Lorem Ipsum isn't
    grammatical English with Latin nouns dropped in, it's scrambled
    pseudo-Latin with no sentence grammar at all. Don't route Classic
    through `TEMPLATES`.
  - Every other theme has a `banks` object (`noun`/`adj`/`verb`/`interj`
    word arrays — every entry must actually function as that part of
    speech, since it gets slotted into real sentence grammar; avoid
    multi-word clauses like "ping the server" in `verb`, they break the
    sentence shape) plus a hand-written `opener` line. This has been
    through a few approaches — worth knowing before changing it again:
    narrative sentence templates per theme read too much like real
    dialogue ("We'll ride past the frontier before the dusty saloon
    catches up."); pure comma-joined word lists ("Arrr, doubloons,
    plank, cutlass.") didn't read as sentences at all. The current
    design is a **single shared `TEMPLATES` array** (18 entries), used
    by every non-classic theme, of generic/structural sentence shapes
    with no scene-setting or cause-and-effect between clauses ("A {adj}
    {noun} always outlasts a {adj} {noun}.", "Why does the {noun}
    always {verb} when nobody's looking?") — real grammar, but abstract
    and a little unhinged, so plugging in absurd/unrelated words reads
    as whimsical nonsense rather than something a person actually said.
    Keep sentence *shape* in `TEMPLATES` theme-agnostic; put all the
    theme's personality in its `banks`. To add a 16th theme: write its
    four banks (mind the part-of-speech constraint above), write one
    in-character `opener` sentence, then add a matching `.theme-card`
    button in `index.html` with a 3-word preview pulled from its actual
    `noun`/`verb` banks.
  - `buildSentence()` branches on `theme.words` vs `theme.banks` as
    described above; `buildParagraphs()` handles all three units —
    "paragraphs" builds N paragraphs of 3–5 sentences each,
    "sentences" and "words" both build one flat sentence list (the
    latter stopping once the word target is met, which may slightly
    overshoot rather than truncate mid-sentence) and then chunk it into
    paragraphs of 4 for readability.
  - The "classic opener" checkbox, when checked, substitutes the
    theme's `opener` line in for the very first sentence only.
  - `render()` computes word count, character count, and paragraph
    count for the toolbar stat line and the `#liveStatus` summary.
- `style.css` — palette lives entirely in CSS custom properties
  (`--paper`, `--paper-2`, `--ink`, `--ink-soft`, `--rule`, `--accent`,
  `--accent-ink`, `--surface-selected`) so light/dark is just two sets
  of values: the light palette on bare `:root`, a dark palette on
  `:root[data-mode="dark"]` (warm charcoal paper, off-white ink,
  brighter terracotta accent so it still contrasts on a dark surface).
  **Any new color must go through one of these variables** — a
  hardcoded hex anywhere in a rule that should adapt will look wrong in
  one of the two modes (this already happened once with the selected
  theme-card background, fixed via `--surface-selected`). "Spectral"
  for display/manuscript text and "IBM Plex Mono" for controls (both
  via Google Fonts), a very faint noise texture on `body` (same
  fractal-noise SVG data-URI technique used elsewhere in this folder)
  for a bit of paper grain — tuned for the light palette, so it's
  barely visible in dark mode, which is fine.
- `favicon.svg` — a pilcrow on an ink rounded square; the same glyph is
  reused inline as `.mark` in the header and `.pilcrow` in the Generate
  button.

## Responsive behavior

Breakpoints, largest to smallest: `.layout` drops to one column below
960px; a small-screens block near the end of `style.css` (below 720px)
shrinks page/panel padding and type scale, moves `.tagline` to its own
row under the brand+actions row (`order: 3`, `width: 100%`, with
`.brand` picking up `margin-right: auto` to keep the actions pinned
right on that first row), and shrinks the About dialog's padding;
`.theme-grid` drops from 3 to 2 columns at 640px and to 1 at 380px
(kept next to the grid's own base rule rather than in the small-screens
block); below 480px the About button's text collapses to icon-only
(`.btn-label { display: none }`, `aria-label` on the button itself
carries the accessible name instead) and the stepper/unit buttons grow
slightly for touch. If you add a new fixed-width element to the
controls panel, check it against 420px (the panel's own width) before
assuming the 960px breakpoint alone makes it safe.

## Content notes

- Real word-for-part-of-speech constraint on `banks.verb` (see above)
  is the single most common way this file breaks when extended — a
  multi-word clause slipped into `verb` silently produces a broken
  sentence, and the automated grammar checks used during development
  (a/an correction, no double articles) won't catch a bad verb clause,
  only article agreement.

## Hub page tile

This project's tile on the `ai-slop/` root hub ("The Quagmire",
`../index.html` + `../style.css`, `data-theme="foundry"`) is the only
light/paper-colored tile in the grid — a deliberate break from every
other tile's dark card, so it stands apart at a glance the way
`../CLAUDE.md` asks. It's styled as a torn, stained specimen sheet
absolutely packed with collage elements, on purpose — the brief was
"fill the entire tile with stickers, with the title obviously popping
out": a jagged `clip-path` cuts the bottom edge so the dark tile
background shows through like ripped paper, a crooked red rubber stamp
reads "SPECIMEN" bleeding off the top-right corner
(`mix-blend-mode: multiply` plus a doubled text-shadow, so the ink
looks unevenly struck), a faint coffee-ring (`.foundry-ring`) bleeds
off the top-left corner, and **thirty-nine** scattered word-scraps —
covering all fifteen themes many times over — in **eight** mismatched
treatments (`.foundry-scrap-a`–`h`, reused across many positions each):
plain italic serif, a taped mono strip, a red-pen strikethrough, a
circled proofreader mark, a solid dark ink-stamp badge, a handwritten
red annotation with a wavy underline, a large faint watermark word
(`z-index: 1`, sitting behind everything else as texture rather than a
foreground sticker), and a small dashed-border tag. The last 20 were
added as a 5-column × 4-row grid (`top:2px`/`top:30px`/`bottom:30px`/
`bottom:2px` rows, five `%`-based columns) laid entirely in the y-bands
that are safe regardless of x — see the title note below — with two
exceptions (`swell`, `bundle`) that started in the dead-center column
and had to be manually shifted off to the side because that column's
`top:30px`/`bottom:30px` rows *do* intrude into the title's vertical
range, so centered x there was hidden behind the title card. If adding
another grid of scraps, prefer y ≤ ~20px or ≥ ~80px (safe at any x)
over the 30px/70px-ish rows unless you also keep x away from the
horizontal center. This tile has been through three rounds of "make it
busier" feedback already because sparser versions kept reading as too
similar to the hub's other tiles — err toward more clutter, not less,
and toward *more style variety*, not just more copies of the same
four treatments, if asked to add scraps again.
**The title is the one element that has to win against all that noise**:
it's `.art-title`, dead center (`top/left: 50%`,
`transform: translate(-50%, -50%)`), in bold italic Spectral at
~19px — much larger than any scrap — on an opaque near-white card with
a thick black border and a hard drop shadow, sitting at `z-index: 3`
(above the scraps' `z-index: 2`). That contrast — one big clean card
against many small busy scraps — is what makes it "pop" as the obvious
title; don't let it shrink back down to a small corner tag or the
tile reads as noise with no focal point again (it went through that
exact regression once already: it started as a big italic wordmark,
got demoted to a small dashed-border corner tag, then got promoted
back to big-and-centered when the tile started looking too similar to
the site's other tiles).  When adding or moving scraps, keep them clear
of the title's rough bounding box (roughly the middle third
horizontally, middle third vertically) — items placed at `top`/`bottom`
under ~10px or beyond the tile's outer ~15% on either side are safely
outside that zone regardless of the exact tile width. `../index.html`'s
Google Fonts `<link>` includes "Spectral" for both the scrap and the
title — don't drop that font if that link is ever edited. Per
`../CLAUDE.md`, hub tiles carry no description text — just the art
banner, name, and "Open →".

## Running it

Open `index.html` directly in a browser — no server needed.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub
Pages site (linked from "The Quagmire" hub at the `ai-slop/` root — see
`../CLAUDE.md` for the tile convention). No environment variables, API
keys, or build step required.
