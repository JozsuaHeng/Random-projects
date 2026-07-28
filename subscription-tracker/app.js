// Pulse — Subscription Price Board
// Fully static/client-side. See CLAUDE.md for what this does and does not do.

// Static, approximate FX rates (per 1 USD) — NOT live, just for display
// convenience. All catalog prices are sourced in USD.
const FX_RATES_PER_USD = { USD: 1, EUR: 0.92, GBP: 0.79, IDR: 15800, AUD: 1.52 };

let displayCurrency = "USD";
let activeCategories = new Set();
let searchQuery = "";
let sortColumn = "last";
let sortDir = "desc";
let expandedId = null;

// ---------- Date helpers ----------

function todayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseLocalDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateNice(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function monthsAgoLabel(dateStr) {
  const then = parseLocalDate(dateStr);
  const now = todayMidnight();
  const m = (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
  if (m <= 0) return "this month";
  if (m === 1) return "1 month ago";
  if (m < 24) return `${m} months ago`;
  const y = Math.floor(m / 12);
  return y === 1 ? "1 year ago" : `${y} years ago`;
}

// ---------- Currency / money ----------

function convertPrice(amount, fromCurrency, toCurrency) {
  if (amount == null) return null;
  return (amount / FX_RATES_PER_USD[fromCurrency]) * FX_RATES_PER_USD[toCurrency];
}

function formatMoney(amount, sourceCurrency) {
  if (amount == null) return "—";
  const converted = convertPrice(amount, sourceCurrency || "USD", displayCurrency);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: displayCurrency,
      maximumFractionDigits: displayCurrency === "IDR" ? 0 : 2,
    }).format(converted);
  } catch {
    return `${displayCurrency} ${converted.toFixed(2)}`;
  }
}

// ---------- Escaping ----------

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

// Small favicon for a company, fetched by domain from a public favicon
// service — no logo files to source or host ourselves. This is an
// external network request (the one part of this app that isn't fully
// offline); if it fails to load, onerror removes the broken <img> and
// the colored-initial avatar underneath shows through untouched.
function logoUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

// ---------- Company price-history analysis ----------

// A company can have multiple tracked plans (e.g. Netflix has Standard,
// Standard-with-ads, Premium). We pick one "headline" plan per company
// (the one with the most tracked entries; ties broken by highest current
// price) to drive its row.
function planGroups(company) {
  const groups = {};
  for (const h of company.priceHistory) {
    const key = h.planLabel || "default";
    (groups[key] ||= []).push(h);
  }
  return groups;
}

function representativeHistory(company) {
  const groups = planGroups(company);
  const keys = Object.keys(groups);
  if (keys.length === 0) return [];
  keys.sort((a, b) => {
    const la = groups[a], lb = groups[b];
    if (lb.length !== la.length) return lb.length - la.length;
    const lastA = la[la.length - 1].newPrice ?? la[la.length - 1].oldPrice ?? 0;
    const lastB = lb[lb.length - 1].newPrice ?? lb[lb.length - 1].oldPrice ?? 0;
    return lastB - lastA;
  });
  return [...groups[keys[0]]].sort((a, b) => a.date.localeCompare(b.date));
}

function sparklinePrices(numericEntries) {
  const points = [];
  for (const h of numericEntries) {
    if (points.length === 0 || points[points.length - 1] !== h.oldPrice) points.push(h.oldPrice);
    points.push(h.newPrice);
  }
  return points;
}

// Every tracked plan's current price, cheapest first — this is what
// drives the multi-tier breakdown in the Price column (e.g. Netflix
// shows "Standard with ads / Standard / Premium" as three lines, not
// just one "headline" number). Each tier carries both its monthly price
// and (when known) a real annual price, shown inline together.
function allTierPrices(company) {
  const groups = planGroups(company);
  const tiers = [];
  for (const [label, entries] of Object.entries(groups)) {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const withPrice = sorted.filter(h => h.newPrice != null);
    const last = withPrice[withPrice.length - 1];
    if (last) tiers.push({ label, price: last.newPrice, annualPrice: last.annualPrice ?? null, currency: last.currency });
  }
  tiers.sort((a, b) => a.price - b.price);
  return tiers;
}

// Distinct dates the company touched pricing on any plan — used both for
// the "how often does this company hike prices" summary and for the
// estimated-forecast heuristic below.
function hikeDates(company) {
  return [...new Set(company.priceHistory.map(h => h.date))].sort();
}

function avgIntervalMonths(dates) {
  if (dates.length < 2) return null;
  const first = parseLocalDate(dates[0]);
  const last = parseLocalDate(dates[dates.length - 1]);
  const totalMonths = (last.getFullYear() - first.getFullYear()) * 12 + (last.getMonth() - first.getMonth());
  return totalMonths > 0 ? totalMonths / (dates.length - 1) : null;
}

// Drives the "Hike Frequency" column — how often this company touches
// pricing at all (across every plan), not tied to any fixed lookback
// window, so it's fillable for any company with 2+ tracked changes.
function hikeCadenceInfo(company) {
  const dates = hikeDates(company);
  return { count: dates.length, intervalMonths: avgIntervalMonths(dates) };
}

// Summary used in the expanded row detail: how long we've tracked this
// company, cumulative change over that span, and how often it tends to
// touch pricing at all (across every plan, not just the headline one).
function historicalSummary(company) {
  const rep = representativeHistory(company).filter(h => h.newPrice != null);
  if (rep.length === 0) return null;
  const first = rep[0], last = rep[rep.length - 1];
  const cumulativePct = rep.length > 1 ? pctChange(first.newPrice, last.newPrice) : null;
  const dates = hikeDates(company);
  return {
    trackedSince: first.date,
    changeCount: rep.length,
    cumulativePct,
    totalHikesAcrossAllPlans: dates.length,
    avgIntervalMonths: avgIntervalMonths(dates),
  };
}

// A clearly-labeled ESTIMATE of the next likely price change, based on
// how often this company has historically touched pricing (across every
// plan). This is a pattern-based guess, never an official announcement —
// kept visually and textually distinct from `company.forecast`, which is
// only ever filled in from a real, sourced, publicly-announced change.
function estimatedForecast(company) {
  const dates = hikeDates(company);
  const interval = avgIntervalMonths(dates);
  if (interval == null) return null;
  const last = parseLocalDate(dates[dates.length - 1]);
  const estDate = new Date(last.getFullYear(), last.getMonth() + Math.round(interval), 1);
  return { date: estDate, intervalMonths: interval, basedOnHikes: dates.length };
}

function companyStats(company) {
  const rep = representativeHistory(company);
  // Entries with a known resulting price, even a single current-reference
  // point with no prior price on record — enough to answer "what was the
  // price as of date X."
  const repWithPrice = rep.filter(h => h.newPrice != null);
  // Entries with a full before/after pair — needed for a % delta and the
  // sparkline, which both require two points.
  const repFullDelta = rep.filter(h => h.oldPrice != null && h.newPrice != null);

  const lastEvent = rep[rep.length - 1] || null;
  const lastWithPrice = repWithPrice[repWithPrice.length - 1] || null;
  const lastFullDelta = repFullDelta[repFullDelta.length - 1] || null;
  const currentPrice = lastWithPrice ? lastWithPrice.newPrice : null;
  const currency = lastEvent?.currency || "USD";

  const isLastEventNumeric = lastEvent && lastFullDelta && lastEvent.date === lastFullDelta.date && lastEvent.planLabel === lastFullDelta.planLabel;

  // Cumulative change from the earliest tracked price point to today —
  // whatever that date happens to be, rather than a rigid "exactly N
  // years ago" checkpoint that's empty whenever research didn't reach
  // that far back.
  const earliestWithPrice = repWithPrice[0] || null;
  const sinceTrackedPct = (earliestWithPrice && repWithPrice.length > 1) ? pctChange(earliestWithPrice.newPrice, currentPrice) : null;

  return {
    hasHistory: rep.length > 0,
    currentPrice,
    currency,
    lastEvent,
    isLastEventNumeric,
    lastChangePct: isLastEventNumeric ? ((lastFullDelta.newPrice - lastFullDelta.oldPrice) / lastFullDelta.oldPrice) * 100 : null,
    trackedSinceDate: earliestWithPrice?.date || null,
    sinceTrackedPct,
    sparklinePoints: sparklinePrices(repFullDelta),
  };
}

function pctChange(from, to) {
  if (from == null || to == null || from === 0) return null;
  return ((to - from) / from) * 100;
}

// A small trend chart, not a rigorous one: the exact numbers already live
// in the columns beside it, so this can prioritize being legible and
// pleasant at a glance. Each real price point is connected with a smooth
// "ease" curve (a cubic bezier with a horizontal tangent at both ends)
// rather than a harsh diagonal or a right-angle step — it still lands
// exactly on every recorded price, it just doesn't look like a jagged
// EKG doing it. A soft area wash under the line and a small end-dot
// (ringed in the row's background color, per the usual sparkline/stat-
// tile treatment) add just enough visual weight without shouting.
function sparklineSvg(points) {
  const w = 72, h = 30, pad = 5;

  if (points.length < 2) {
    // Not enough data for a trend yet — a quiet placeholder, not a
    // dashed "in progress" line (dashing reads as a threshold/projection,
    // which this isn't).
    return `<svg class="sparkline" viewBox="0 0 ${w} ${h}"><line x1="${pad}" y1="${h / 2}" x2="${w - pad}" y2="${h / 2}" stroke="currentColor" stroke-width="1.5" opacity="0.25"/><circle cx="${w / 2}" cy="${h / 2}" r="2.5" fill="currentColor" opacity="0.5"/></svg>`;
  }

  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const n = points.length;
  const step = (w - pad * 2) / (n - 1);
  const coords = points.map((p, i) => [
    pad + i * step,
    h - pad - ((p - min) / range) * (h - pad * 2),
  ]);

  let d = `M ${coords[0][0].toFixed(1)} ${coords[0][1].toFixed(1)}`;
  for (let i = 1; i < coords.length; i++) {
    const [x0, y0] = coords[i - 1];
    const [x1, y1] = coords[i];
    const midX = (x0 + x1) / 2;
    d += ` C ${midX.toFixed(1)} ${y0.toFixed(1)}, ${midX.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }

  const trendUp = points[n - 1] > points[0];
  const trendDown = points[n - 1] < points[0];
  const color = trendUp ? "var(--bad)" : trendDown ? "var(--good)" : "var(--text-faint)";
  const [endX, endY] = coords[n - 1];
  const areaPath = `${d} L ${coords[n - 1][0].toFixed(1)} ${h - pad} L ${coords[0][0].toFixed(1)} ${h - pad} Z`;

  return `
    <svg class="sparkline" viewBox="0 0 ${w} ${h}">
      <path d="${areaPath}" fill="${color}" opacity="0.12" stroke="none"/>
      <path d="${d}" fill="none" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="2.75" fill="${color}" stroke="var(--card)" stroke-width="1.5"/>
    </svg>
  `;
}

// ---------- Cell renderers ----------

function changeCellHtml(fromPrice, toPrice, currency) {
  const pct = pctChange(fromPrice, toPrice);
  if (pct == null) return `<span class="cell-unknown">Unknown</span>`;
  const sign = pct >= 0 ? "+" : "";
  const cls = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return `
    <div class="change-cell">
      <span class="change-pct ${cls}">${sign}${pct.toFixed(1)}%</span>
      <span class="change-ref">${formatMoney(fromPrice, currency)} &rarr; ${formatMoney(toPrice, currency)}</span>
    </div>
  `;
}

// Last Change, split into three columns per row (% / the actual price
// movement / how long ago) instead of one crowded cell.
function lastChangePctCellHtml(stats) {
  if (!stats.hasHistory) return `<span class="cell-unknown">Unknown</span>`;
  if (!stats.isLastEventNumeric) return `<span class="cell-unknown">—</span>`;
  const pct = stats.lastChangePct;
  const sign = pct >= 0 ? "+" : "";
  const cls = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return `<span class="change-pct ${cls}">${sign}${pct.toFixed(1)}%</span>`;
}

function lastChangeMovementCellHtml(stats) {
  if (!stats.hasHistory) return `<span class="cell-unknown">Unknown</span>`;
  if (stats.isLastEventNumeric) {
    return `<span class="change-ref">${formatMoney(stats.lastEvent.oldPrice, stats.currency)} &rarr; ${formatMoney(stats.lastEvent.newPrice, stats.currency)}</span>`;
  }
  return `<span class="cell-note">${escapeHtml(stats.lastEvent.note || stats.lastEvent.planLabel)}</span>`;
}

function lastChangeDateCellHtml(stats) {
  if (!stats.hasHistory) return `<span class="cell-unknown">Unknown</span>`;
  return `<span class="change-date-standalone">${monthsAgoLabel(stats.lastEvent.date)}</span>`;
}

// Price column: every tracked plan, each showing its monthly price and
// (when known) a real annual price inline together — no separate toggle
// to click, both units are just always visible.
function priceCellHtml(company) {
  const tiers = allTierPrices(company);
  if (tiers.length === 0) return `<span class="cell-unknown">No confirmed pricing</span>`;
  return `<div class="tier-list">` + tiers.map(t => {
    const hasRealAnnual = t.annualPrice != null;
    const annualAmount = hasRealAnnual ? t.annualPrice : t.price * 12;
    return `
      <div class="tier-row">
        <span class="tier-label">${escapeHtml(t.label)}</span>
        <span class="tier-prices">
          <span class="tier-price">${formatMoney(t.price, t.currency)}<span class="tier-unit">/mo</span></span>
          <span class="tier-annual">${formatMoney(annualAmount, t.currency)}<span class="tier-unit">/yr</span>${!hasRealAnnual ? `<span class="est-tag" title="No confirmed annual plan — this is monthly × 12">est.</span>` : ""}</span>
        </span>
      </div>
    `;
  }).join("") + `</div>`;
}

function sinceTrackedCellHtml(stats) {
  if (stats.sinceTrackedPct == null) {
    return `<span class="cell-unknown">${stats.hasHistory ? "Only 1 price point tracked" : "Unknown"}</span>`;
  }
  const sign = stats.sinceTrackedPct >= 0 ? "+" : "";
  const cls = stats.sinceTrackedPct > 0 ? "up" : stats.sinceTrackedPct < 0 ? "down" : "flat";
  return `
    <div class="change-cell">
      <span class="change-pct ${cls}">${sign}${stats.sinceTrackedPct.toFixed(1)}%</span>
      <span class="change-ref">since ${formatDateNice(parseLocalDate(stats.trackedSinceDate))}</span>
    </div>
  `;
}

function hikeFrequencyCellHtml(company) {
  const { count, intervalMonths } = hikeCadenceInfo(company);
  if (count === 0) return `<span class="cell-unknown">No hikes tracked</span>`;
  if (count === 1) return `<span class="cell-note">1 hike tracked</span>`;
  if (intervalMonths == null) return `<span class="cell-note">${count} hikes tracked</span>`;
  return `
    <div class="change-cell">
      <span class="freq-value">~every ${intervalMonths.toFixed(0)}mo</span>
      <span class="change-ref">${count} hikes tracked</span>
    </div>
  `;
}

// Average current price per category, in USD, across the *whole* catalog
// (not just whatever's currently filtered/searched) so the comparison
// stays stable while browsing. Computed fresh each render — cheap at
// this catalog size.
function categoryAverages() {
  const sums = {};
  for (const c of SUBSCRIPTION_CATALOG) {
    const stats = companyStats(c);
    if (stats.currentPrice == null) continue;
    const usd = convertPrice(stats.currentPrice, stats.currency, "USD");
    const s = (sums[c.category] ||= { total: 0, count: 0 });
    s.total += usd;
    s.count += 1;
  }
  const avgs = {};
  for (const [cat, s] of Object.entries(sums)) avgs[cat] = s.total / s.count;
  return avgs;
}

function categoryAvgPct(company, stats, avgs) {
  if (stats.currentPrice == null) return null;
  const avg = avgs[company.category];
  if (!avg) return null;
  const usd = convertPrice(stats.currentPrice, stats.currency, "USD");
  return ((usd - avg) / avg) * 100;
}

function categoryAvgCellHtml(company, pct) {
  if (pct == null) return `<span class="cell-unknown">No price to compare</span>`;
  const sign = pct >= 0 ? "+" : "";
  const cls = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return `
    <div class="change-cell">
      <span class="change-pct ${cls}">${sign}${pct.toFixed(0)}%</span>
      <span class="change-ref">vs ${escapeHtml(company.category)} avg</span>
    </div>
  `;
}

function subscribersCellHtml(company) {
  if (!company.subscribers) return `<span class="cell-unknown">Not disclosed</span>`;
  const s = company.subscribers;
  return `
    <div class="change-cell">
      <span class="subscriber-count">${escapeHtml(s.count)}</span>
      <span class="change-ref">${escapeHtml(s.asOf)}</span>
    </div>
  `;
}

function forecastCellHtml(company) {
  if (company.forecast) {
    const f = company.forecast;
    const dateLabel = f.date ? formatDateNice(parseLocalDate(f.date)) : "Date unknown";
    return `<div class="forecast-cell forecast-confirmed"><span class="forecast-tag">Confirmed</span><span class="forecast-date">${escapeHtml(dateLabel)}</span></div>`;
  }
  const est = estimatedForecast(company);
  if (est) {
    return `<div class="forecast-cell forecast-estimated"><span class="forecast-tag">Estimated</span><span class="forecast-date">~${escapeHtml(formatDateNice(est.date))}</span></div>`;
  }
  return `<span class="cell-unknown">Unknown</span>`;
}

// ---------- Category chips ----------

function renderCategoryChips() {
  const wrap = document.getElementById("categoryChips");
  const categories = [...new Set(SUBSCRIPTION_CATALOG.map(c => c.category))].sort();
  wrap.innerHTML = `<button class="chip ${activeCategories.size === 0 ? "active" : ""}" data-cat="__all">All</button>` +
    categories.map(cat => `<button class="chip ${activeCategories.has(cat) ? "active" : ""}" data-cat="${escapeAttr(cat)}">${escapeHtml(cat)}</button>`).join("");

  wrap.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const cat = chip.dataset.cat;
      if (cat === "__all") activeCategories.clear();
      else if (activeCategories.has(cat)) activeCategories.delete(cat);
      else activeCategories.add(cat);
      renderCategoryChips();
      renderTable();
    });
  });
}

// ---------- Sorting ----------

function sortValue(entry) {
  const { company, stats, freq, catAvgPct } = entry;
  switch (sortColumn) {
    case "name": return company.name.toLowerCase();
    case "price": return convertPrice(stats.currentPrice, stats.currency, displayCurrency);
    case "last": return stats.lastChangePct;
    case "since": return stats.sinceTrackedPct;
    case "freq": return freq.intervalMonths;
    case "catavg": return catAvgPct;
    default: return null;
  }
}

function compareEntries(a, b) {
  const va = sortValue(a), vb = sortValue(b);
  if (va == null && vb == null) return a.company.name.localeCompare(b.company.name);
  if (va == null) return 1;
  if (vb == null) return -1;
  if (typeof va === "string") {
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  }
  return sortDir === "asc" ? va - vb : vb - va;
}

function updateSortHeaderIndicators() {
  document.querySelectorAll("th.sortable").forEach(th => {
    th.classList.toggle("sorted", th.dataset.sort === sortColumn);
    th.dataset.dir = th.dataset.sort === sortColumn ? sortDir : "";
  });
}

// ---------- Table rendering ----------

function renderTable() {
  const tbody = document.getElementById("companyTableBody");
  const empty = document.getElementById("boardEmpty");
  tbody.innerHTML = "";

  const companies = SUBSCRIPTION_CATALOG
    .filter(c => activeCategories.size === 0 || activeCategories.has(c.category))
    .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery));

  const avgs = categoryAverages();
  const entries = companies.map(c => {
    const stats = companyStats(c);
    return { company: c, stats, freq: hikeCadenceInfo(c), catAvgPct: categoryAvgPct(c, stats, avgs) };
  }).sort(compareEntries);

  updateSortHeaderIndicators();

  if (entries.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const COLSPAN = 12;

  entries.forEach((entry, idx) => {
    const { company, stats, catAvgPct } = entry;

    const mainRow = document.createElement("tr");
    mainRow.className = "company-row" + (expandedId === company.id ? " expanded" : "");
    mainRow.innerHTML = `
      <td class="col-rank">${idx + 1}</td>
      <td class="col-name">
        <div class="row-id">
          <div class="logo-slot">
            <div class="sub-avatar">${initials(company.name)}</div>
            <img class="company-logo" src="${escapeAttr(logoUrl(company.domain))}" alt="" loading="lazy" onerror="this.remove()">
          </div>
          <div>
            <div class="row-name">${escapeHtml(company.name)}</div>
            <div class="row-category">${escapeHtml(company.category)}</div>
          </div>
        </div>
      </td>
      <td class="col-price">${priceCellHtml(company)}</td>
      <td class="col-change-sm">${lastChangePctCellHtml(stats)}</td>
      <td class="col-change">${lastChangeMovementCellHtml(stats)}</td>
      <td class="col-change-sm">${lastChangeDateCellHtml(stats)}</td>
      <td class="col-change">${sinceTrackedCellHtml(stats)}</td>
      <td class="col-change">${hikeFrequencyCellHtml(company)}</td>
      <td class="col-change">${categoryAvgCellHtml(company, catAvgPct)}</td>
      <td class="col-change">${subscribersCellHtml(company)}</td>
      <td class="col-forecast">${forecastCellHtml(company)}</td>
      <td class="col-trend">${sparklineSvg(stats.sparklinePoints)}</td>
    `;

    const detailRow = document.createElement("tr");
    detailRow.className = "detail-tr";
    detailRow.hidden = expandedId !== company.id;
    const td = document.createElement("td");
    td.colSpan = COLSPAN;
    td.innerHTML = renderDetailContent(company);
    detailRow.appendChild(td);

    mainRow.addEventListener("click", () => {
      expandedId = expandedId === company.id ? null : company.id;
      renderTable();
    });

    tbody.appendChild(mainRow);
    tbody.appendChild(detailRow);
  });
}

function renderDetailContent(company) {
  let html = `<div class="row-detail">`;

  const summary = historicalSummary(company);
  if (summary) {
    const parts = [`Tracked since ${formatDateNice(parseLocalDate(summary.trackedSince))}`];
    if (summary.cumulativePct != null) {
      const sign = summary.cumulativePct >= 0 ? "+" : "";
      parts.push(`${sign}${summary.cumulativePct.toFixed(0)}% cumulative on this plan`);
    }
    parts.push(`${summary.totalHikesAcrossAllPlans} price-change event${summary.totalHikesAcrossAllPlans === 1 ? "" : "s"} tracked across all plans`);
    if (summary.avgIntervalMonths != null) {
      parts.push(`roughly every ${summary.avgIntervalMonths.toFixed(0)} months`);
    }
    html += `<div class="detail-summary">${parts.join(" · ")}</div>`;
  }

  if (company.forecast) {
    const f = company.forecast;
    html += `
      <div class="detail-forecast">
        <span class="detail-forecast-label confirmed">Confirmed forecast</span>
        <span>${f.date ? escapeHtml(formatDateNice(parseLocalDate(f.date))) : "Date unknown"} — ${escapeHtml(f.note)}</span>
        <a class="detail-source" href="${escapeAttr(f.source)}" target="_blank" rel="noopener noreferrer">Source ↗</a>
      </div>
    `;
  } else {
    const est = estimatedForecast(company);
    if (est) {
      html += `
        <div class="detail-forecast">
          <span class="detail-forecast-label estimated">Estimated, not confirmed</span>
          <span>~${escapeHtml(formatDateNice(est.date))} — based on ${est.basedOnHikes} tracked changes, roughly every ${est.intervalMonths.toFixed(0)} months. Not an official announcement.</span>
        </div>
      `;
    }
  }

  if (company.priceHistory.length === 0) {
    html += `<p class="row-detail-empty">No confirmed price changes on record for ${escapeHtml(company.name)} yet.</p>`;
  } else {
    const sorted = [...company.priceHistory].sort((a, b) => b.date.localeCompare(a.date));
    html += sorted.map(h => {
      let deltaHtml = "";
      if (h.oldPrice != null && h.newPrice != null) {
        const pct = ((h.newPrice - h.oldPrice) / h.oldPrice) * 100;
        deltaHtml = `<span class="detail-delta">${formatMoney(h.oldPrice, h.currency)} &rarr; ${formatMoney(h.newPrice, h.currency)} <span class="pct">+${pct.toFixed(0)}%</span></span>`;
      } else if (h.newPrice != null) {
        deltaHtml = `<span class="detail-delta">${formatMoney(h.newPrice, h.currency)}</span>`;
      }
      return `
        <div class="detail-row">
          <div class="detail-top">
            <span class="detail-plan">${escapeHtml(h.planLabel || "")}</span>
            <span class="detail-date">${formatDateNice(parseLocalDate(h.date))}</span>
          </div>
          ${deltaHtml}
          ${h.note ? `<div class="detail-note">${escapeHtml(h.note)}</div>` : ""}
          <a class="detail-source" href="${escapeAttr(h.source)}" target="_blank" rel="noopener noreferrer">Source ↗</a>
        </div>
      `;
    }).join("");
  }

  html += `</div>`;
  return html;
}

// ---------- Controls ----------

document.getElementById("companySearch").addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderTable();
});

document.querySelectorAll("th.sortable").forEach(th => {
  th.addEventListener("click", () => {
    const col = th.dataset.sort;
    if (sortColumn === col) {
      sortDir = sortDir === "asc" ? "desc" : "asc";
    } else {
      sortColumn = col;
      sortDir = col === "name" ? "asc" : "desc";
    }
    renderTable();
  });
});

document.getElementById("currencySelect").addEventListener("change", (e) => {
  displayCurrency = e.target.value;
  saveCurrency(displayCurrency);
  renderTable();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  const next = current === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  saveTheme(next);
});

// ---------- Init ----------

(function initTheme() {
  const stored = loadTheme();
  const theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.dataset.theme = theme;
})();

(function initCurrency() {
  displayCurrency = loadCurrency();
  document.getElementById("currencySelect").value = displayCurrency;
})();

renderCategoryChips();
renderTable();
