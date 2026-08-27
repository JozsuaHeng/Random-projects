# CLAUDE.md

## What this project is

**Corporate Radar** — a six-tool "see through corporate BS" kit. A
persistent row of tabs (`.tools-nav`) sits under the header on every
view; **Buzzword Decoder** is the default tab so the page shows real
output — and its glossary — immediately on load, rather than landing on
an empty picker screen first. (An earlier pass tried a dashboard-of-cards
home screen you had to click into; reverted in favor of tabs you can
switch between directly, with a working tool always on screen.) Visual
identity is a paper case-file: cream background, navy header, red
"stamp" accents, Georgia serif type — styled like a folder of documents
someone's annotated in red pen, not a dashboard app. (There was also a
brief detour through a dark "instrument panel" HUD look — amber/red on
near-black, monospace readouts — between the paper version and this one.
Reverted: paper won.)

Three tools share one scanning mechanic (paste text → highlight dictionary
matches → density score): **Buzzword Decoder** (corporate jargon),
**Weasel Word Scanner** (hedges: "kind of," "I think," "mistakes were
made"), **Manufactured Urgency Detector** (fake time pressure: "ASAP,"
"per my last email," "quick favor"). Each is laid out input-on-top,
results-below rather than side by side — a full-width input panel (paste
text, run it), then a full-width results panel underneath holding the
stats/meter plus two output boxes at once, side by side — **Analysis**
(your original text, matches underlined and hoverable for their meaning)
and **Translation** (the whole thing rewritten) — plus a searchable
glossary further down. A Plain/Cynical **Tone** toggle sits right next
to the Translation heading, since that's the only thing it visibly
changes. Every textarea carries a small italic, low-opacity
`.textarea-hint` line right under its heading (before the example
buttons) — a loaded example reads as finished content unless something
explicitly says "edit me."

(This went through two revisions from feedback. First: one output box
with a second Highlight/Full-Rewrite "View" toggle alongside Tone —
confusing, because toggling Tone while in Highlight view didn't visibly
change anything, since the alternate wording only ever showed up in a
tooltip. Fixed by always showing both outputs instead of switching
between them. Second: input and results sat side by side in a 2-column
`.layout` — cramped for a textarea, and Analysis/Translation stacked
vertically inside the narrow results column read as one long block.
Fixed by stacking input-then-results full-width instead, and moving the
2-column `.layout` grid one level in, to sit between Analysis and
Translation specifically.)

**The So-What Test** works differently — sentence by sentence rather than
phrase by phrase, checking whether each sentence states an implication or
action (a "so-what") versus just describing something.

**Excuse Generator** and **Sign-Off Generator** are pick-a-category,
get-a-random-line generators.

A **📡 Pick Up a Random Signal** (BS Bingo, internally — see `ui.js`)
button in the header pulls one random item from five of the six tools
(all but the So-What Test, whose output is a per-sentence breakdown, not
a one-liner). A disclaimer under the header says nothing typed here is
stored — true by construction, since there's no backend at all. (The
header used to carry a fake "FILE NO. 0429-CR" stamp for case-file
flavor; cut it — invented specificity like that reads as an AI tell, not
as charm.)

Under the tab row, a one-line description previews whichever tab you're
hovering/focused on (falling back to the active tab otherwise), so you
don't have to click a tool to find out roughly what it does.

Every scanning tool (Buzzword, Weasel, Urgency) and the So-What Test load
with their first example already run — real output on screen the moment
you land on the tab, not an empty textarea waiting for input. The Excuse
and Sign-Off Generators each pair their controls with a "Previously
Generated" history panel on the right, newest first, capped at 30 items
and kept only in memory (nothing persisted, same as the rest of the
site) — a lightweight way to browse several outputs at once instead of
overwriting the one result box each time you hit Generate.

This project started as just a Buzzword Decoder
([see the ai-slop repo history](../..) if you want the very first version),
grew into a 3-tool tabbed site called "The Bullshit Detector," then into
a 6-tool dashboard-of-cards, then got the current name, paper styling,
and — full circle — tabs again instead of the dashboard. Internal
identifiers (`bingoCard`, `rollBingo`, CSS class names like `.match`)
still use naming from earlier passes in places — cosmetic only,
renaming them isn't worth the churn unless you're touching that code
anyway.

## Architecture

Plain HTML/CSS/JS, ES modules, no framework, no build step, no backend.

- `data.js` — every tool's content as a **lookup table**: a plain object
  keyed by an id, not an array you'd loop through.
  - `BUZZWORD_DICTIONARY` / `CATEGORIES` / `JARGON_TIERS` / `EXAMPLES` —
    the original buzzword decoder data. `dict[key]` is a direct O(1)
    read.
  - `WEASEL_DICTIONARY` / `WEASEL_CATEGORIES` / `WEASEL_TIERS` /
    `WEASEL_EXAMPLES` — same shape, for hedges and qualifiers.
  - `URGENCY_DICTIONARY` / `URGENCY_CATEGORIES` / `URGENCY_TIERS` /
    `URGENCY_EXAMPLES` — same shape again, for manufactured urgency.
    All three dictionaries share one entry shape (`{ plain, cynical,
    category }`), which is exactly what lets `scan.js` stay generic.
  - `SO_WHAT_INDICATORS` — deliberately a plain **array**, not an object.
    This tool only needs a yes/no membership check ("does this sentence
    contain an action-indicating phrase?"), not a value to look up — a
    useful contrast to the three dictionaries above. Reach for an object
    when you need to look something *up*; an array/Set when you only
    need to check whether something's *there*. Also `SO_WHAT_TIERS` and
    `SO_WHAT_EXAMPLES`.
  - `EXCUSE_BANK` / `SIGNOFF_BANK` — keyed by scenario/mood id, each
    value `{ label, excuses/signoffs: [...] }`. Lookup is instant; the
    randomness is picking one line out of the array afterward. Excuse
    lines are written to read as plausible things a real person would
    actually say — deadpan, not winking at the reader — on purpose:
    an earlier draft leaned sarcastic/jokey ("calendar gremlins," "the
    black hole between Slack and my inbox") and it undercut the tool;
    corporate deflection is funnier played straight.
- `random.js` — `pickRandom(list)`, shared by the two generators and BS
  Bingo so "pick one at random" isn't written three times.
- `scan.js` — the generic engine behind all three scanning tools, no DOM
  access. `segmentText(text, dictionary)` builds one regex from every
  dictionary key (longest phrase first, so "north star metric" matches
  before "north star" could grab part of it) and splits the input into
  `{type: "text", value}` / `{type: "match", value, key, plain, cynical,
  category}` segments. `rewriteText(segments, tone)` rebuilds the string
  with each match swapped for its `plain` or `cynical` field.
  `densityStats(text, segments, tiers)` computes match count, density,
  and which tier it falls into. This file doesn't know which dictionary
  it's scanning — that's the point; it's configured three different ways
  in `ui.js` instead of being copy-pasted three times.
- `sowhat.js` — pure logic for the So-What Test. `splitSentences` breaks
  text on `. ! ?`; `analyzeSentences(text, indicators)` tags each
  sentence with whether it contains any indicator phrase; `soWhatStats`
  computes the ratio of sentences with a so-what and its tier.
- `excuses.js` / `signoffs.js` — `generateExcuse(scenario)` /
  `generateSignoff(mood)` look up the bank entry and hand back one
  `pickRandom`-picked line; `randomScenario()` / `randomMood()` pick a
  random key for BS Bingo.
- `ui.js` — all DOM work.
  - **Navigation**: `showView(id)` toggles which `.tool-view` section is
    visible and which `.tool-tab` carries the `active` class, then calls
    `setTabDescription(id)`. `index.html` marks `view-buzzword` and its
    tab active by default (no `hidden` class on that section, `active`
    class on that tab) so the page opens already showing a working tool,
    not a menu.
  - **`TOOL_DESCRIPTIONS`** — a lookup table (view id → one-line blurb)
    powering the `#tab-description` line under the tab row. Each
    `.tool-tab` sets it on `mouseenter`/`focus` and reverts to the active
    tab's description on `mouseleave`/`blur`, so hovering previews a tool
    without committing to switching.
  - **`createScanner({ prefix, dictionary, categories, tiers, examples
    })`** — one factory function that wires up an entire scanner tool
    (textarea, example buttons, tone toggle, decode button, the density
    meter, and the glossary with search + category filters) from a
    config object. `renderResult()` always calls both `renderAnalysis()`
    (into `{prefix}-output-text`: original text, matches wrapped in
    hover/focus-tooltip spans) and `renderTranslation()` (into
    `{prefix}-translation-text`: the whole thing rewritten in the current
    tone) — no toggle decides which one shows, both always render. It's
    called three times — once each for `prefix: "buzzword"`, `"weasel"`,
    `"urgency"` — relying on each tool's DOM ids following the same
    `{prefix}-input`, `{prefix}-decode-btn`, `{prefix}-translation-text`,
    etc. pattern in `index.html`. At the end of the factory it also loads
    `examples[0]` into the textarea and runs it immediately, so every
    scanner shows real output on first paint (the textarea also gets a
    `.textarea-hint` line under it — a loaded example reads as "finished
    content" unless something says otherwise, so it says otherwise).
    Adding a fourth scanning tool later means adding its data to
    `data.js`, a same-shaped section to `index.html` with a new prefix,
    and one more `createScanner({...})` call — no new logic.
  - **So-What Test wiring** is separate (different shape: per-sentence
    rows, not per-phrase highlighting), but follows the same "run the
    first example on load" pattern.
  - **Excuse / Sign-Off wiring**: populate a row of chip buttons from the
    bank's keys, track the selection, generate on click. Each generation
    also calls `pushHistory` (unshift onto an array, capped at
    `HISTORY_LIMIT`) and `renderHistory`, which redraws that tool's
    "Previously Generated" panel from the array — shared helpers, since
    both generators need the exact same behavior.
  - **`setMeter(fillEl, tierIndex, tierCount, ratio, invert)`** — shared
    by every tool's density meter. Colors run green→red across the tier
    list for the three "lower is better" scanners; `invert` flips it for
    the So-What Test, where a *higher* ratio is good.
  - **BS Bingo** picks one of five tools at random and shows one random
    item from it in a dismissible card.

To add a new phrase-scanning tool: add its dictionary/categories/tiers/
examples to `data.js` (same shape as the existing three), copy one tool
view's HTML block with a new id prefix, add a `.tool-tab` button plus a
`TOOL_DESCRIPTIONS` entry, and call `createScanner({...})` once in
`ui.js`. To add a new generator: same `EXCUSE_BANK`-shaped data, copy the
excuse/sign-off wiring pattern (including its history panel), plus a tab
and description.

## Running it

Open `index.html` directly, or serve the folder with a static server (some
browsers block ES module imports over `file://`):

```
python3 -m http.server
```

## Deployment

Static hosting only (GitHub Pages, Netlify, Vercel static mode). No
environment variables or API keys required — and no server means the
"nothing is stored" disclaimer in the header holds by construction, not
just by promise.
