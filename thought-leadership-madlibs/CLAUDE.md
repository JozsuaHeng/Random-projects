# CLAUDE.md

## What this project is

A literal mad-libs engine for LinkedIn "thought leadership" posts. Unlike
[broetry-generator](../broetry-generator), which uses sliders to bias phrase
selection, this one shows the blanks: pick one of ten story templates,
fill in each labeled blank (an adjective, a corporate verb, a buzzword,
etc.) — each with its own 🎲 button to randomize just that field — or hit
**Surprise Me** to auto-fill everything at random, then "publish." The joke
is structural — every template is a sentence skeleton that sounds profound
regardless of which words go in the blanks, so the output is guaranteed to
carry zero actual information.

## Architecture

Plain HTML/CSS/JS, ES modules, no framework, no build step, no backend.

- `data.js` — pure data: `WORD_BANKS` (buzzword, industry, corporate verb,
  etc. word lists) and `TEMPLATES` (ten post skeletons, each a `text`
  string with `{{key}}` placeholders plus an ordered `blanks` list mapping
  each key to a label and a bank). `AUTHORS` holds 24 fake LinkedIn personas
  (name + headline + a `color` index into `PALETTE`) used on the post card
  and in the fake comments thread. `TRANSLATIONS` + `translationFor(bank,
  word)` hold snarky literal translations for the jargon-heavy banks
  (`BUZZWORD`, `VERB`, `NOUN_ABSTRACT`, `ADJECTIVE`) with a generic joke
  fallback for anything uncurated. `COMMENT_TEMPLATES` and `ROAST_LINES`
  feed the fake comments thread and Roast mode respectively.
  Add a new story by adding a template here — nothing else needs to change.
- `generator.js` — pure functions: `randomizeValues` (fills every blank
  from its bank), `fillSegments` (splits a template into an ordered list of
  text/blank segments, each blank tagged with its bank — lets the UI wrap
  individual blanks without re-parsing), `fillTemplate` (joins those
  segments into plain text; empty blanks fall back to `___`),
  `buzzwordDensity` (real stat: what fraction of buzzword-bank blanks
  actually got a buzzword), `fakeEngagement` (random reaction/comment/repost
  counts), `fakeComments(count, excludeName)` (picks distinct commenters,
  never the post's own author), `randomRoastLine`. No DOM access.
- `ui.js` — renders the blank-fill form for the selected template (each row
  gets a text input plus a per-field 🎲 randomize button), wires the
  template dropdown, Surprise Me, Publish, Roast mode toggle, and Copy post
  text buttons. Renders the post body from `fillSegments` output rather than
  a plain string: `BUZZWORD` blanks get highlighted (`<mark>`), and blanks
  from the four jargon banks become clickable spans that pop a tooltip with
  their translation (shared `#jargon-tooltip` div, positioned via
  `getBoundingClientRect`). Also renders the LinkedIn-style post card (avatar
  colored from `PALETTE` by author), a fake comments thread underneath, and
  a "Content Audit" panel (Information Content pinned at 0%, buzzword
  density computed for real and color-coded).

To add a new mad-lib story: add an entry to `TEMPLATES` in `data.js` with a
`text` template and matching `blanks` array. To add vocabulary: extend the
relevant list in `WORD_BANKS`.

## Running it

Open `index.html` directly, or serve the folder with a static server (some
browsers block ES module imports over `file://`):

```
python3 -m http.server
```

## Deployment

Static hosting only (GitHub Pages, Netlify, Vercel static mode). No
environment variables or API keys required.
