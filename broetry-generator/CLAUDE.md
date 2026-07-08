# CLAUDE.md

## What this project is

A satirical generator for LinkedIn "broetry" — those cringe-inducing
thought-leadership posts with aggressive line breaks, humble-brags, and
numbered life lessons. Four sliders plus a toggle control the tone:

- **Insufferability** (0-100): biases phrase selection toward more
  over-the-top, humble-braggy lines.
- **Emoji Density** (0-100): controls how often emoji get appended to each
  line, and which emoji pool they're drawn from.
- **Humble-Brag Intensity** (0-100): chance of splicing in an extra
  parenthetical brag line.
- **Corporate Jargon** (0-100): chance of splicing in a buzzword-heavy line.
- **Post Length** (0-100): how many times each shape's repeatable slot
  (lessons, justifications, or stats) appears — 2 reps at 0, 8 reps at 100.
- **Roast Mode** (toggle): appends a self-aware, fourth-wall-breaking aside
  as the closing line.

Every slider has a paired number input so exact values can be typed instead
of dragged. A random persona is picked per post from a 20-character library
(`characters` in `data.js`), and fake sycophantic comments are generated
underneath the post (more of them, and more unhinged, at higher
Insufferability). A "Cringe Meter" gauge on the card reflects the average of
all four sliders.

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend.

- `data.js` — phrase banks, post "shapes", the character library, and the
  bonus-line banks (roast lines, jargon bursts, comment templates). Pure
  data, no logic.
- `rng.js` — a seeded PRNG (mulberry32). Given the same seed, `generator.js`
  produces byte-identical output — this is what makes the shareable link and
  history features reproducible.
- `generator.js` — pure functions that take slider values + an injected RNG
  and return generated post text, fake engagement stats, a character, and
  fake comments. No DOM access, so this file can be read/tested in
  isolation (see the `node --input-type=module` snippets in past commits for
  examples).
- `ui.js` — wires all controls to the DOM, calls `generator.js`, renders the
  result as a fake LinkedIn post card, and handles:
  - **Shareable links**: current slider values + a seed are encoded in the
    URL query string via `history.replaceState`, so reloading or sharing the
    URL reproduces the exact same post.
  - **History strip**: last 5 generated posts are cached in
    `localStorage` (key `broetry-history`) and re-rendered on click without
    regenerating.
  - **Dark mode**: toggled via a `data-theme` attribute on `<html>`,
    persisted in `localStorage` (key `broetry-theme`).
  - **PNG export**: draws the post card onto an offscreen `<canvas>` and
    triggers a download — no external image library.
- `index.html` / `style.css` — page structure, the LinkedIn-card look, and
  the dark theme CSS variable overrides.

To extend the generator (add a new post shape, phrase bank, character, or
emoji tier), edit `data.js` only — `generator.js` and `ui.js` don't need to
change.

## Running it

No install step needed. Open `index.html` directly in a browser, or serve
the folder with any static file server (e.g. `python3 -m http.server`) since
some browsers restrict ES module imports over the `file://` protocol.

## Deployment

Static hosting only — GitHub Pages, Netlify, or Vercel (static mode). No
environment variables or API keys required.
