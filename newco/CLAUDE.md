# CLAUDE.md

## What this project is

**NewCo** — a fake startup name and tagline generator. Pick a category
(Fintech, Health, AI & Dev, Climate, Consumer, EdTech, Legal, Web3,
Logistics, or All — which picks a random category per generation so the
result stays internally consistent) and it produces a name, a tagline,
a two-sentence "company description" with concrete-sounding specifics
(founding year, HQ city, funding raised, customer count, uptime), and a
domain-availability joke (`<name>.com — taken`, `<name>.io — available`,
always — because it always is).

The design deliberately avoids the "AI tool" look (no violet/blue
gradient, no generic rounded sans everywhere) and also avoids jokey
chrome — no exclamation points, no emoji, no visible disclaimer. It's
built to look like a real, well-funded naming agency's internal tool: a
dark, editorial one-pager (near-black, warm off-white ink, a single
amber accent), a serif ("Fraunces," italic) treating each generated
name like an actual wordmark, and a clean grotesk ("Space Grotesk") for
everything else. The comedy is entirely in the generated content, not
the UI — same "play it straight" approach as `../guilt-trip`.

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend.

- `data.js` — pure data: `CATEGORIES` (9 verticals, each with `roots`
  for name generation and `nouns`/`verbs`/`adjectives` for filling
  templates — `verbs` must work after "to" and after "so you can,"
  `nouns` must work bare with no article, since templates supply their
  own), `CATEGORY_KEYS` (used when "All" picks a random category per
  generation), `NAME_SUFFIXES` and `TECH_WORDS` (shared across all
  categories, used by two of the name recipes below), the
  category-agnostic specifics arrays (`FOUNDING_YEARS`, `HQ_CITIES`,
  `FUNDING_AMOUNTS`, `CUSTOMER_COUNTS`, `GROWTH_RATES`, `UPTIME_RATES`,
  `TEAM_SIZES`) used only by `DESCRIPTION_DETAILS`, `TAGLINE_TEMPLATES`
  (12 one-liners), and the two-part description template arrays (see
  below). To add a category: add an entry to `CATEGORIES` with all four
  arrays plus a matching `.chip` button in `index.html`. To add a
  tagline or description line: add a function to the relevant template
  array — keep `nouns` bare (no embedded articles) since several
  templates depend on that.
- **Description is two sentences**, deliberately split by role so it
  reads like a real About-page blurb instead of one vague line:
  `DESCRIPTION_OPENERS` (10 entries, a concrete mechanism or moment,
  references the generated name — "X replaces the spreadsheet-and-email
  routine most teams use for..."; rewritten once already to cut
  mission-statement fluff like "ambitious teams" or "at scale" — keep
  new openers naming a specific workflow/moment, not stacking
  adjectives) and `DESCRIPTION_DETAILS` (12 entries, a metrics/social-
  proof sentence —
  "Founded in 2021 out of Austin, X now handles payroll for more than
  4,800 teams worldwide," or a namedrop like "used by teams at Cognate
  and Learnly Labs"). `DESCRIPTION_DETAILS` templates take `(bank, name,
  extra)` — `extra` is computed once per call in `generateDescription()`
  (in `app.js`, not `data.js`): `customer1`/`customer2` are two distinct
  fake "customer" company names produced by calling `generateName()`
  again on the same category (recursion one level deep — cheap way to
  get plausible company names instead of only citing a bare count), and
  `investor1`/`investor2` are two distinct picks from `INVESTOR_FIRMS`
  (also in `data.js`). Customer generation never gets the user's seed
  word (see below) — a namedropped "customer" coincidentally matching
  what the user just typed as their own company name would read as a
  strange bug, not a joke. If you add a new specifics array (e.g. a
  "press mentions" bank), wire it into `DESCRIPTION_DETAILS` the same
  way, not into the openers — keep the mission/metrics split.
- `app.js` — all generation logic:
  - **Name recipes** (`generateName()`): nine weighted recipes so
    roughly two-thirds of results are multi-word rather than a single
    mangled word every time — `pick(roots)` plain (10%), `lastVowelDrop()`
    (15%, mimics the real Flickr/Tumblr/Scribd pattern: finds the last
    vowel that isn't the first letter and removes it), `suffixify()`
    (15%, appends a random `NAME_SUFFIXES` entry), `twoWordName()` (15%,
    appends a random `TECH_WORDS` entry), `portmanteau()` (15%, blends
    two distinct roots — head ~60% of root A + tail ~60% of root B,
    lowercased), `adjectiveRoot()` (10%, `"Frictionless Ledger"`),
    `compoundRoots()` (10%, two roots as separate words, `"Thread OS"`-
    style), `theRoot()` (6%, `"The Anchor"`), `ampersandRoots()` (4%,
    `"Mend & Bloom"`). `distinctRootPair()` is the shared helper every
    two-root recipe uses to avoid picking the same root twice.
  - `generateTagline()`/`generateDescription()` just pick random
    template(s) and call them with the active category's bank.
  - `domainLine()` strips the name to `[a-z0-9]` and always reports
    `.com` taken / `.io` available — deterministic on purpose, it's the
    one joke that's funnier for never varying.
  - **State** lives in one object in the `DOMContentLoaded` handler:
    `activeCategory` (the chip selection, may be `"all"`), `categoryUsed`
    (the actual category the current result was generated from — shown
    in the small eyebrow tag above the name), `name`/`tagline`/
    `description`, and `recent` (last 8 generations, newest first).
  - **No pinning/locking — regenerating one field just leaves the other
    two alone, by default, always.** This went through two earlier
    designs first (documented here so nobody re-derives the same dead
    ends): a "pin to protect a field, Generate rerolls everything else"
    model needed a lock icon *and* a regen icon on every row, which
    never stopped looking like UI chrome bolted onto the wordmark no
    matter how those two icons were styled (see the `style.css` note
    below for that whole saga). Dropping pinning in favor of "each field
    has its own regenerate button, and not clicking a button means you
    want to keep it" needs only **one** icon per row — nothing to visually
    group, so the layout problem disappears along with the pin concept.
    `regenName()`/`regenTagline()`/`regenDescription()` each touch only
    their own field and always reuse `state.categoryUsed` (never
    re-resolve a random category, even under "All") — so a field you
    didn't touch never ends up mismatched with a new vertical. The one
    coupling: `regenName()` also regenerates `description`, since every
    `DESCRIPTION_OPENERS`/`DESCRIPTION_DETAILS` line quotes `name`
    directly — leaving the old description text in place after the name
    changes would show the wrong company name in its own About
    paragraph. That's not a "keep everything else" violation so much as
    description not being a truly independent field from name in the
    first place; tagline never mentions the name, so it's untouched by
    a name reroll.
  - **Generate** (`generateFull()` → `rollFresh()`) is the only action
    that resolves a *new* category (respecting "All"'s random pick, via
    `resolveCategory()`) and rerolls all three fields together — it's
    the "start over completely" action, distinct from the three regen
    icons' "tweak just this one thing" role. Both paths push to
    `recent` via `pushRecent()`, so history captures every meaningful
    change, not just full generates. Clicking a `recent` chip
    (`loadRecentAt()`) restores that entry's full state without pushing
    a duplicate.
  - **Transition**: `withTransition(mutate, after)` fades `#stageContent`
    to `opacity:0`, waits 160ms (matching the CSS transition duration),
    runs `mutate` (which is why `after` — e.g. `pushRecent` — has to be
    passed in rather than called right after `withTransition()` returns;
    the mutation itself hasn't happened yet at that point), re-renders,
    fades back in. Initial page load calls `rollFresh()`/`renderStage()`
    directly instead, skipping the fade — there's nothing on screen yet
    to fade from.
  - **Keyboard**: Space/Enter triggers Generate, guarded to skip when
    `document.activeElement` is a button/input/textarea/link so it
    doesn't double-fire on top of that element's own native space/enter
    click (e.g. a focused chip or the Copy button). The seed input (next)
    needs its own dedicated Enter listener since it's an `<input>` and
    is deliberately excluded by that guard.
  - **Seed word** (`#seedInput`): free-text, sanitized by `getSeed()` to
    letters-only, max 16 chars, Title Cased — so it reads like any other
    root word rather than standing out as raw user input. `effectiveRoots()`
    folds it into that generation's root pool as **4 duplicate entries**
    (not a special-cased "always use this" override), so every existing
    name recipe just works on the pool unchanged — no seed-specific
    branching anywhere in `generateName()`. This means the seed shows up
    in roughly a fifth to a quarter of generations, sometimes mutated
    past recognition by whichever recipe picked it (e.g. `lastVowelDrop`
    turning "Orbit" into "Orbt") — that's intentional per the brief ("a
    meaningful fraction," not "every single time" — a seed that always
    won would make the category/recipe variety pointless). Read live
    from the input on every call rather than cached in `state`, so
    clearing the field takes effect on the very next generation with no
    extra sync code.
  - **History stepper**: `state.historyIndex` tracks which entry of
    `recent` is currently on stage (`0` = newest). The ◀/▶ buttons next
    to the "Recent" label (`historyPrevBtn`/`historyNextBtn`) and
    `loadRecentAt(i)` move through it the same way browser back/forward
    does — ◀ ("older") increments the index, ▶ ("newer") decrements it;
    both disable at the respective end via `updateHistoryButtons()`. The
    currently-viewed `recent` chip also gets `.active` styling, kept in
    sync because `renderRecent()` rebuilds every chip's class from
    `state.historyIndex` on every call rather than toggling one chip in
    place. `pushRecent()` (called after every full Generate) resets
    `historyIndex` to `0` — same as a new browser navigation clearing
    the forward-stack.
  - Category chip clicks set `activeCategory` and immediately call
    `generateFull()` — no separate "apply" step, consistent with the
    rest of this folder's generators.
- `style.css` — palette is CSS custom properties (`--bg`,
  `--bg-elevated`, `--ink`, `--ink-soft`, `--ink-faint`, `--rule`,
  `--accent`, `--accent-ink`). Single dark theme by design (no light
  mode toggle) — this is meant to read as one confident, finished
  product, not a themeable tool. A very faint fractal-noise SVG
  data-URI on `body` (same technique as `../ipsum-foundry`) plus a
  soft radial glow behind the header keep the near-black background
  from looking flat. `.chips` carries an explicit `width: 100%` — it's
  a flex-wrap row inside `.layout`, which uses `align-items: center`,
  and without an explicit width a wrapping flex container's shrink-to-fit
  sizing can behave inconsistently across engines; the explicit width
  guarantees it always wraps against the real available width instead
  of relying on that. `.field-icon` (the one regenerate control next to
  name/tagline/description — see the `app.js` note above) went through
  three visual rounds before this: a bordered filled pill grouping a
  regen icon with a separate pin icon (read as a "badge" competing with
  the wordmark for attention), a borderless version of that same pairing
  (still two icons + a divider, still competed on scale against a 56px
  hero word), then a single bare pin icon after cutting the regen icon
  (better, but still framed as "protect this from the *next* Generate,"
  which needed its own filled/active state). What actually fixed it
  wasn't a CSS change at all — it was dropping the pin concept for
  "regenerating one field leaves the rest alone by default," which
  leaves exactly one icon per row with no active/pinned state to
  represent, no grouping to visually solve. `.field-icon` itself is
  about as plain as a button can be: no background/border at rest, just
  `color: var(--ink-faint)` shifting to `var(--accent)` on hover — no
  `.active` state, because there's no persistent state left to show.
  The lesson, if this needs revisiting again: the problem was never the
  border radius or fill color, it was that *any* visible container next
  to large hero text reads as UI stuck onto a brand wordmark, and two
  controls per row will always need some kind of grouping treatment to
  read as related rather than random. Keep it to one control per row if
  at all possible.
- `favicon.svg` — an italic bold "N" on an amber rounded square; the
  same mark is reused inline as `.mark` in the header.

## Running it

Open `index.html` directly in a browser — no server needed.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub
Pages site. Linked from "The Quagmire" hub (`../index.html`,
`data-theme="newco"` in `../style.css`) — the tile deliberately reuses
NewCo's own palette (near-black, single amber accent, italic Fraunces
wordmark) rather than inventing tile-only colors, the same way
`../knotify`'s tile borrows its site's navy/orange. Kept restrained on
purpose (mark + wordmark + the domain-availability line, no scattered
chips/deco) since the real site is a quiet one-pager and a busy tile
would misrepresent it. Adding this tile also added `Fraunces` to the
hub's shared Google Fonts `<link>` — it wasn't loaded before, so
`../guilt-trip`'s tile (which also specifies `font-family: "Fraunces"`)
was silently falling back to Georgia; it now renders correctly too.
