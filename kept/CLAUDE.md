# CLAUDE.md

## What this project is

**Kept** — "which country lets you keep the most of your paycheck," inspired
by an OECD-style infographic (gross salary / taxes / net take-home, per
country) shared on Reddit. Rebuilt with its own sourced dataset rather than
copying the original image's numbers, covering the world's largest
economies by nominal GDP (a different, broader list than the original's
OECD-only set — it includes China, India, Brazil, Indonesia, Nigeria,
Bangladesh, etc.), built up across three research passes and now past 50
countries. If adding more later, double-check the candidate isn't already
in `data.js` first — Singapore was accidentally omitted from the original
top-30 list and had to be added as a batch-3 correction.

Plain HTML/CSS/JS, no framework, no build step, no dependencies beyond
Google Fonts — same as everything else in `ai-slop/`.

## Data (`data.js`)

Each country entry is: single full-time worker, no children, national
average wage, converted to **USD at market exchange rate** (not
PPP-adjusted). "Tax" = personal income tax **+ employee-side** mandatory
social security contributions only — never employer contributions, never
VAT/consumption tax. `netUSD = grossUSD - taxUSD`.

- OECD member countries: sourced from the OECD "Taxing Wages" report, which
  already computes exactly this "average single worker, no children" figure
  — use its published average-wage and tax-wedge tables directly rather than
  re-deriving from statutory brackets.
- Non-OECD countries (China, India, Brazil, Russia, Indonesia, Saudi Arabia,
  Taiwan, Argentina, Thailand, UAE, etc.): composite estimates built from the
  national statistics bureau's average wage figure plus statutory income tax
  + mandatory employee social insurance rates. These carry `confidence:
  "medium"` or `"low"` and should say so honestly in the tooltip/table — large
  informal-sector economies (India, Indonesia) make "average wage" a shakier
  concept than in OECD data, and that caveat belongs in the UI, not just this
  file.
- `DATA_MODE` at the bottom of `data.js` is one of `"placeholder"` (fake
  numbers), `"partial"` (real, sourced, but not every top-GDP country
  covered yet — pairs with `PENDING_COUNTRIES`, the list still to research),
  or `"sourced"` (full list covered). `DATA_ASOF` is the exchange-rate date
  used throughout. `app.js`'s footer note reads `DATA_MODE` and renders the
  matching banner automatically — don't hardcode that warning elsewhere,
  just flip `DATA_MODE` (and clear `PENDING_COUNTRIES`) once the full list
  lands.
- Every entry needs a real `source` string (report name, e.g. "OECD Taxing
  Wages 2024", or "Composite: [statistics bureau] wage + statutory tax
  rates") — never publish a row with a fabricated or unstated source.
- `note` (optional) is for a genuinely standout quirk worth surfacing
  directly in the UI — not a restatement of `source`. It renders as a ✦
  badge next to the country name (chart row and table), and as a
  highlighted line in the hover tooltip. Reserve it for things a reader
  would actually want to know at a glance (Russia's 0%-employee-SSC
  structure, UAE/Saudi having no income tax, India/Indonesia's wage figure
  excluding most of the workforce) — not every row needs one, and adding
  one to every row would make none of them stand out.

## Chart (`app.js` / `style.css`)

A horizontal 2-segment stacked bar per country — **not** three separate
dots — because the actual question ("how much do you keep") is a
part-to-whole split (net vs. tax) of one total (gross), and a stacked bar
makes that legible at a glance across ~20-30 rows without needing the
reader to do subtraction themselves.

- Bar length = gross salary, scaled against `MAX_GROSS` (the highest gross
  salary in the **full** dataset, not the currently filtered/sorted rows) —
  so bar length always means the same absolute dollar amount regardless of
  sort or search state. Don't rescale per-view; that would make the same bar
  length mean different things depending on what's currently visible.
- Two colors only: `--kept` (aqua/green, validated for CVD-safe contrast
  against `--surface-2` via the dataviz skill's palette validator) and
  `--taken` (red). Both carry a direct label (the net figure on the bar,
  gross at the row's end) as the required secondary encoding — this pair
  sits in the palette's 6-8 ΔE "warn" band for protanopia, which the skill
  says is only legal with direct labels, not color alone.
- Net income label sits **inside** the kept segment when there's room
  (`keptLabelFits`, >14% of `MAX_GROSS`), otherwise it's placed just outside
  the bar's end — never let it overflow or get clipped by a narrow segment.
- Table view (`#tableWrap`) is a real fallback, not decoration — it's the
  accessible alternative to the bar chart and the place to actually read a
  precise number and its source, per the dataviz skill's "a table view
  always exists" rule.
- Default sort is `net-desc` (highest take-home first) since that's the
  chart's actual headline question. `gdp-asc` recovers the original GDP
  ranking order if that's ever wanted. Sort is driven by pill buttons
  (`.sort-btn`, plain-language labels like "Keeps the most" rather than a
  raw field name) rather than a `<select>` — a beginner glancing at the
  page shouldn't need to decode what "net-desc" means. The sortable table
  headers (`thead th[data-sort]`) call the same `setSort()` so both
  controls always agree on the active sort; don't let them drift into two
  separate sort states.
- Each row carries a small confidence dot (`.row-conf-dot`, colored
  green/amber/red for high/medium/low) before the flag, and the same dot
  repeats in the table's Confidence column — this is meant to be
  skimmable without opening a tooltip, since burying data quality only in
  hover text means most readers never see it.
- `AVG_NET_PCT` draws a subtle vertical tick (`.row-avg-tick`) inside
  *every* row's track at the dataset's average net income — cheap context
  ("is this country above or below the pack?") without needing a second
  chart or a shared axis overlay across rows.

## Running it

Open `index.html` directly, or serve the folder (`python3 -m http.server`)
— no build step either way.

## Hub page tile

Per `../CLAUDE.md`, this gets a themed tile on "The Quagmire"
(`data-theme="kept"` in `../index.html` / `../style.css`). The tile carries
no visible wordmark — `.art-title` is `sr-only` (same pattern as
Passportly's stamp / NewCo's seal) because the art itself already reads as
"a paycheck chart" without needing the word "Kept" competing for space.
Instead it's six flag+bar mini-rows (`.kept-bars`), each a miniature of the
real chart's own row — actual kept-ratios from the dataset (Switzerland,
UAE, India, Mexico, Germany, Belgium), not arbitrary decorative numbers, so
the tile is a truthful preview rather than a made-up graphic. If the
underlying data changes enough to meaningfully shift these countries'
ratios, it's fine for the tile to drift slightly out of sync — it's
illustrative art, not a live-bound view — but a large change (e.g. a
country's tax rate correction) is worth refreshing the six `width:` values
to match.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site. No environment variables, API keys, or backend.
