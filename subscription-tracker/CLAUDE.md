# CLAUDE.md

## What this is

**Pulse** — a subscription price board, styled a bit like a stock/crypto
screener (think CoinMarketCap), for subscription companies instead of
coins. Full-width, sortable table of ~38 well-known subscription
companies (streaming, music, software, gaming, fitness, etc), each row
showing:

- **Price** — every tracked plan/tier for that company (e.g. Netflix
  shows Standard-with-ads, Standard, and Premium as three lines), not
  just one number. Toggle `/mo` vs `/yr` in the top bar — `/yr` uses a
  real published annual price when one is known, otherwise falls back to
  a clearly-tagged "est." (monthly × 12).
- **Last Change** — the most recent sourced price change (for the
  row's "headline" plan — see below), and how long ago it was.
- **Since Tracked** — cumulative % change from whatever the *earliest*
  tracked price point actually is, to today. This replaced a rigid "1Y /
  2Y / 3Y ago" trio that was empty for most companies whenever research
  didn't happen to reach exactly that far back — this is fillable for
  any company with 2+ tracked price points instead.
- **Hike Frequency** — how often this company touches pricing at all
  (e.g. "~every 12mo, 5 hikes tracked"), across every plan, not tied to
  any fixed lookback window.
- **vs Category Avg** — how this company's current price compares to the
  average current price across its whole category (e.g. "+18% vs
  Streaming avg"). Computed purely from current prices, so it works for
  all 38 companies regardless of how much price-change history exists —
  the one column that's never gated by research depth.
- **Forecast** — either a **Confirmed** publicly-announced future price
  change (from `company.forecast`, sourced), or — when nothing official
  exists — a clearly-labeled **Estimated** guess based on how often that
  company has historically touched pricing (e.g. "~Mar 2027, based on 3
  tracked changes, roughly every 15 months"). The estimate is a pattern
  extrapolation, never a claim about a real announcement — it's styled
  and worded differently from a confirmed one so the two are never
  confused. "Unknown" only appears when there's too little history (0-1
  tracked changes) to estimate a cadence at all.
- **Trend** — a step-chart sparkline (flat while the price holds, a
  sharp jump on the change date) rather than a smooth diagonal line —
  prices don't glide from A to B, they jump on a specific date, so the
  chart shouldn't imply otherwise.

Click any row to expand its full sourced price-change history for every
tracked plan (not just the row's "headline" one), plus a summary line
(tracked-since date, cumulative % change, and how many price-change
events have been recorded across all of that company's plans).

There is no personal subscription tracking / "add your own subscription"
feature — that was deliberately removed. This app is purely a public
reference board.

## How it's built (and why)

Plain HTML/CSS/vanilla JS, no build step, matching the rest of this
`ai-slop/` shelf. Just open `index.html`.

- `data.js` — `SUBSCRIPTION_CATALOG`: the hand-curated, hand-researched
  dataset. See the comment at the top of the file for the exact entry
  shape (including the optional `forecast` field). **This is a
  point-in-time snapshot, not a live feed** — nothing in this app scrapes
  the internet or calls any API.
- `storage.js` — tiny `localStorage` wrapper for exactly two UI
  preferences: theme (light/dark) and display currency. That's the only
  thing this app ever persists.
- `app.js` — all logic:
  - `allTierPrices()` lists every tracked plan's current price for the
    Price column. `representativeHistory()` separately picks one
    "headline" plan (the one with the most tracked entries; ties broken
    by highest current price) to drive the Last Change / Since Tracked /
    Trend columns — click the row to see every plan's own history.
  - `companyStats()`'s `sinceTrackedPct` is cumulative change from the
    earliest tracked price point to now — deliberately not tied to a
    fixed 1/2/3-year lookback.
  - `hikeDates()` / `avgIntervalMonths()` / `hikeCadenceInfo()` drive the
    Hike Frequency column and `estimatedForecast()`'s cadence-based guess
    — both computed across *all* of a company's plans, not just the
    headline one (a broader "how often does this company touch pricing"
    signal, not a per-plan prediction).
  - `categoryAverages()` / `categoryAvgPct()` drive "vs Category Avg" —
    averaged across the whole catalog (not the current filter/search) so
    the comparison stays stable while browsing.
  - Sortable column headers (click to sort by Price / Last Change / Since
    Tracked / Hike Frequency / vs Category Avg / Company name), category
    filter chips, search, a monthly/annual price toggle, a currency
    toggle (static approximate FX rates in `FX_RATES_PER_USD` — not
    live), and a light/dark theme toggle.
- `style.css` — full-width table layout; dark theme is the base `:root`,
  light theme overrides live under `:root[data-theme="light"]`.

## Why there's no live scraping / real-time data

An always-on system that actually re-checks 50-100 companies' pricing
pages needs a hosted server, a database, and a scheduled job — and
scrapers break constantly when vendor sites change their markup, plus
some sites' terms of service don't allow it. That's a different, much
bigger project than anything else on this shelf.

Instead, the dataset is refreshed **on request**: when asked to "update
the price tracker" (or similar), research current price-change news (and
any newly-requested companies) and edit `data.js` — always with a real
source URL, never invented numbers, and never inventing a specific
forecast date that wasn't actually reported. There is no automatic/
scheduled refresh; this was a deliberate choice over a cron-scheduled
agent or a real scraper backend, both heavier, ongoing-maintenance
commitments.

## Refreshing / extending the dataset later

To add companies, newer price changes, a newly-announced forecast, or a
real annual price (`annualPrice` field —
only set it from an actually-published annual plan, never a guess):
research it (get a real source URL), then add/edit an entry in
`SUBSCRIPTION_CATALOG` in `data.js`. No other file needs to change. If a
plan's official name is ambiguous, verify it rather than guessing — e.g.
Disney+'s ad tier is officially "Disney+ Basic", not just "with ads".

Currently 50 companies are planned but only ~38 are in `data.js` — the
remaining ~12 (plus filling any newly-noticed gaps) are a deliberately
separate follow-up pass, not forgotten.
