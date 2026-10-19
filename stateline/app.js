/* StateLine — interaction logic. Reads STATES/FEDERAL/META from data.js. */

const THEME_KEY = "stateline-theme";
const STATE_ABBRS = Object.keys(STATES).sort((a, b) => STATES[a].name.localeCompare(STATES[b].name));

const METRICS = [
  { key: "topIncomeTaxRate", label: "Top marginal state income tax rate", kind: "seq", fmt: (v) => v + "%", get: (s) => s.incomeTax.topRate },
  { key: "minWage", label: "Minimum wage", kind: "seq", fmt: (v) => "$" + v.toFixed(2), get: (s) => s.minWage.value },
  { key: "uiWageBase", label: "Unemployment insurance wage base (employer-paid)", kind: "seq", fmt: (v) => "$" + v.toLocaleString(), get: (s) => s.ui.wageBase },
  { key: "noIncomeTax", label: "No state income tax at all", kind: "bool", get: (s) => s.incomeTax.type === "none" },
  { key: "hasLocalTax", label: "Has a local / city income tax layer", kind: "bool", get: (s) => s.localTax.exists },
  { key: "hasSDI", label: "Mandatory state disability insurance", kind: "bool", get: (s) => s.disability.has },
  { key: "hasPaidLeave", label: "Paid family / medical leave program", kind: "bool", get: (s) => s.paidLeave.has },
  { key: "convenienceRule", label: '"Convenience of the employer" telecommute rule', kind: "bool", get: (s) => !!s.reciprocity.convenienceRule },
  { key: "hasReciprocity", label: "Has tax reciprocity with a neighboring state", kind: "bool", get: (s) => s.reciprocity.agreements.length > 0 },
];

const GLOSSARY = [
  ["State income tax", "A tax your state takes from your paycheck, on top of federal tax. Nine states have none at all."],
  ["Local / city income tax", "A second wage tax from a city, county, or school district — on top of the state's own rate. Most states don't have one."],
  ["Social Security & Medicare", "Federal payroll taxes (\"FICA\" on a paystub) that fund retirement and healthcare. Same rate everywhere, split with your employer."],
  ["State disability insurance (SDI)", "Payroll-funded short-term pay if you can't work due to a non-work injury or illness. Only 5 states require it."],
  ["Paid family / medical leave (PFML)", "Paid time off for a new child, a sick family member, or your own illness — unlike unpaid federal FMLA, which only protects your job."],
  ["Unemployment insurance (UI / SUTA)", "A tax your employer (usually not you) pays to fund unemployment benefits."],
  ["Reciprocity agreement", "A deal where working across a state line doesn't mean filing two income tax returns."],
  ["\"Convenience of the employer\" rule", "Lets a state tax your wages as if you worked there, even if you're fully remote."],
  ["Minimum wage", "The lowest hourly wage an employer can legally pay. The federal floor ($7.25) hasn't moved since 2009."],
];

let state = {
  metric: "topIncomeTaxRate",
  compare: [],
  openAbbr: null,
  compareMode: false,
  listSortAsc: false,
  currentMetric: null,
  currentEdges: null,
};

function fmtMoney(n) {
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Truncates a note to roughly `max` chars (cut at a sentence/word
   boundary) with a "more"/"less" toggle — keeps dock/compare cells from
   turning into paragraphs while the full text stays one click away. */
function noteHTML(text, max) {
  max = max || 110;
  if (!text) return "";
  if (text.length <= max) return `<p class="fact-note">${text}</p>`;
  let cut = text.indexOf(". ", Math.min(max, text.length - 1));
  if (cut === -1 || cut > max + 50) {
    cut = text.lastIndexOf(" ", max);
    if (cut <= 0) cut = max;
  } else {
    cut = cut + 1;
  }
  const short = text.slice(0, cut).trim();
  return `<p class="fact-note" data-short="${escapeAttr(short)}…" data-full="${escapeAttr(text)}" data-expanded="false">${short}… <button class="note-toggle" type="button">more</button></p>`;
}

function handleNoteToggle(e) {
  const btn = e.target.closest(".note-toggle");
  if (!btn) return;
  const p = btn.closest(".fact-note");
  const expanded = p.dataset.expanded === "true";
  p.innerHTML = expanded
    ? `${p.dataset.short} <button class="note-toggle" type="button">more</button>`
    : `${p.dataset.full} <button class="note-toggle" type="button">less</button>`;
  p.dataset.expanded = expanded ? "false" : "true";
}

/* ---------------- theme ---------------- */
(function initTheme() {
  const btn = document.getElementById("theme-toggle");
  btn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const curDark = cur === "dark" || (!cur && prefersDark);
    const next = curDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    paintMap();
  });
})();

/* ---------------- map ---------------- */
function getInteractiveMapNodes() {
  const svg = document.getElementById("us-svg-map");
  return Array.from(svg.querySelectorAll("#g5 > path[id], #g5 > g[id]")).filter((el) => STATES[el.id]);
}

function colorablePartsFor(node) {
  if (node.tagName.toLowerCase() === "g") return Array.from(node.querySelectorAll("path, circle"));
  return [node];
}

function quantileBins(values, n) {
  const sorted = [...values].sort((a, b) => a - b);
  const edges = [];
  for (let i = 1; i < n; i++) {
    const idx = Math.floor((i / n) * sorted.length);
    edges.push(sorted[Math.min(idx, sorted.length - 1)]);
  }
  return edges;
}

function binIndex(value, edges) {
  for (let i = 0; i < edges.length; i++) {
    if (value <= edges[i]) return i;
  }
  return edges.length;
}

function paintMap() {
  const metric = METRICS.find((m) => m.key === state.metric);
  const nodes = getInteractiveMapNodes();
  const allValues = STATE_ABBRS.map((abbr) => metric.get(STATES[abbr]));
  const edges = metric.kind === "seq" ? quantileBins(allValues, 6) : null;
  state.currentMetric = metric;
  state.currentEdges = edges;

  nodes.forEach((node) => {
    const parts = colorablePartsFor(node);
    parts.forEach((p) => {
      for (let i = 0; i < 6; i++) p.classList.remove("map-bin-" + i);
      p.classList.remove("map-yes", "map-no");
    });
    const val = metric.get(STATES[node.id]);
    if (metric.kind === "bool") {
      parts.forEach((p) => p.classList.add(val ? "map-yes" : "map-no"));
    } else {
      const bin = binIndex(val, edges);
      parts.forEach((p) => p.classList.add("map-bin-" + bin));
    }
  });

  renderLegend(metric, allValues, edges);
  renderStateList();
}

function renderLegend(metric, allValues, edges) {
  const el = document.getElementById("legend");
  if (metric.kind === "bool") {
    const yesCount = allValues.filter(Boolean).length;
    el.innerHTML = `
      <div class="legend-title">${metric.label}</div>
      <div class="legend-bool">
        <div class="legend-row"><span class="legend-swatch" style="background:var(--map-fill-yes)"></span> Yes — ${yesCount} jurisdictions</div>
        <div class="legend-row"><span class="legend-swatch" style="background:var(--map-fill-no)"></span> No — ${allValues.length - yesCount} jurisdictions</div>
      </div>`;
  } else {
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    el.innerHTML = `
      <div class="legend-title">${metric.label}</div>
      <div class="legend-scale">
        <span style="background:var(--seq-1)"></span><span style="background:var(--seq-2)"></span>
        <span style="background:var(--seq-3)"></span><span style="background:var(--seq-4)"></span>
        <span style="background:var(--seq-5)"></span><span style="background:var(--seq-6)"></span>
      </div>
      <div class="legend-labels"><span>${metric.fmt(min)}</span><span>${metric.fmt(max)}</span></div>`;
  }
}

/* ---------------- ranked list (side panel, linked to the map) ---------------- */
function renderStateList() {
  const metric = state.currentMetric;
  const edges = state.currentEdges;
  const list = document.getElementById("state-list");
  const sortBtn = document.getElementById("sort-toggle");
  sortBtn.hidden = metric.kind !== "seq";
  sortBtn.textContent = state.listSortAsc ? "Low → High" : "High → Low";

  let abbrs = [...STATE_ABBRS];
  if (metric.kind === "seq") {
    abbrs.sort((a, b) => (state.listSortAsc ? 1 : -1) * (metric.get(STATES[a]) - metric.get(STATES[b])));
  } else {
    abbrs.sort((a, b) => {
      const av = metric.get(STATES[a]) ? 1 : 0;
      const bv = metric.get(STATES[b]) ? 1 : 0;
      if (av !== bv) return bv - av;
      return STATES[a].name.localeCompare(STATES[b].name);
    });
  }

  list.innerHTML = abbrs.map((abbr) => {
    const s = STATES[abbr];
    const val = metric.get(s);
    const display = metric.kind === "bool" ? (val ? "Yes" : "No") : metric.fmt(val);
    const swatchClass = metric.kind === "bool" ? (val ? "yes" : "no") : "bin-" + binIndex(val, edges);
    const isSelected = abbr === state.openAbbr;
    const isComparing = state.compare.includes(abbr);
    return `<li class="state-row${isSelected ? " is-selected" : ""}${isComparing ? " is-comparing" : ""}" data-abbr="${abbr}">
      <span class="state-row-swatch ${swatchClass}"></span>
      <span class="state-row-name">${s.name}</span>
      <span class="state-row-value">${display}</span>
    </li>`;
  }).join("");
}

function highlightLinked(abbr, on) {
  const node = document.getElementById(abbr);
  if (node) colorablePartsFor(node).forEach((p) => p.classList.toggle("is-hover-linked", on));
  const row = document.querySelector(`.state-row[data-abbr="${abbr}"]`);
  if (row) row.classList.toggle("is-hover", on);
}

function initStateList() {
  const list = document.getElementById("state-list");
  list.addEventListener("click", (e) => {
    const row = e.target.closest(".state-row");
    if (!row) return;
    if (state.compareMode) toggleCompare(row.dataset.abbr);
    else selectState(row.dataset.abbr);
  });
  list.addEventListener("mouseover", (e) => {
    const row = e.target.closest(".state-row");
    if (row) highlightLinked(row.dataset.abbr, true);
  });
  list.addEventListener("mouseout", (e) => {
    const row = e.target.closest(".state-row");
    if (row) highlightLinked(row.dataset.abbr, false);
  });
  document.getElementById("sort-toggle").addEventListener("click", () => {
    state.listSortAsc = !state.listSortAsc;
    renderStateList();
  });
}

function initMetricSelect() {
  const sel = document.getElementById("metric-select");
  sel.innerHTML = METRICS.map((m) => `<option value="${m.key}">${m.label}</option>`).join("");
  sel.value = state.metric;
  sel.addEventListener("change", () => {
    state.metric = sel.value;
    paintMap();
  });
}

function initMapInteraction() {
  const tooltip = document.getElementById("map-tooltip");
  const wrap = document.getElementById("map-wrap");
  const nodes = getInteractiveMapNodes();

  nodes.forEach((node) => {
    const abbr = node.id;
    const show = (evt) => {
      const metric = METRICS.find((m) => m.key === state.metric);
      const s = STATES[abbr];
      const val = metric.get(s);
      const display = metric.kind === "bool" ? (val ? "Yes" : "No") : metric.fmt(val);
      const badges = [
        s.localTax.exists ? '<span class="mini-badge">Local tax</span>' : "",
        s.disability.has ? '<span class="mini-badge">SDI</span>' : "",
        s.paidLeave.has ? '<span class="mini-badge">PFL</span>' : "",
        s.reciprocity.convenienceRule ? '<span class="mini-badge mini-badge-warn">Convenience rule</span>' : "",
      ].filter(Boolean).join("");
      tooltip.innerHTML = `
        <strong>${s.name}</strong>
        <div class="tooltip-stats">Tax ${s.incomeTax.type === "none" ? "none" : s.incomeTax.topRate + "%"} · Min wage $${s.minWage.value.toFixed(2)}</div>
        ${badges ? `<div class="tooltip-badges">${badges}</div>` : ""}
        <div class="tooltip-metric">${metric.label}: <strong>${display}</strong></div>
      `;
      tooltip.hidden = false;
      const rect = wrap.getBoundingClientRect();
      let x = evt.clientX - rect.left + 14;
      let y = evt.clientY - rect.top + 14;
      tooltip.style.left = x + "px";
      tooltip.style.top = y + "px";
    };
    node.addEventListener("mousemove", show);
    node.addEventListener("mouseenter", (evt) => { show(evt); highlightLinked(abbr, true); });
    node.addEventListener("mouseleave", () => { tooltip.hidden = true; highlightLinked(abbr, false); });
    node.addEventListener("click", () => {
      if (state.compareMode) toggleCompare(abbr);
      else selectState(abbr);
    });
  });
}

function refreshMapSelectionClasses() {
  const nodes = getInteractiveMapNodes();
  nodes.forEach((node) => {
    const parts = colorablePartsFor(node);
    const isSelected = node.id === state.openAbbr;
    const isComparing = state.compare.includes(node.id);
    parts.forEach((p) => {
      p.classList.toggle("is-selected", isSelected);
      p.classList.toggle("is-comparing", isComparing && !isSelected);
    });
  });
  document.querySelectorAll(".state-row").forEach((row) => {
    const abbr = row.dataset.abbr;
    row.classList.toggle("is-selected", abbr === state.openAbbr);
    row.classList.toggle("is-comparing", state.compare.includes(abbr) && abbr !== state.openAbbr);
  });
}

/* Briefly glows one state on first load — a quiet nudge toward the
   state the whole page was built around, instead of making the visitor
   hunt for it. */
function pulseStateOnce(abbr) {
  const node = document.getElementById(abbr);
  if (!node) return;
  const parts = colorablePartsFor(node);
  parts.forEach((p) => p.classList.add("pulse-intro"));
  setTimeout(() => parts.forEach((p) => p.classList.remove("pulse-intro")), 1700);
}

/* ---------------- compare mode (click-to-add straight from the map) ---------------- */
function initCompareModeToggle() {
  const btn = document.getElementById("compare-mode-toggle");
  const wrap = document.getElementById("map-wrap");
  const hint = document.getElementById("map-hint");
  btn.addEventListener("click", () => {
    state.compareMode = !state.compareMode;
    btn.setAttribute("aria-pressed", String(state.compareMode));
    wrap.classList.toggle("is-compare-mode", state.compareMode);
    hint.innerHTML = state.compareMode
      ? "Click states to add or remove them from the comparison tray below."
      : "Click a state for its full profile. Turn on <strong>Compare mode</strong> to click states onto the tray instead.";
  });
}

/* ---------------- dock (state detail) ---------------- */
function factCard(value, note, extraClass) {
  return `<div class="dock-fact ${extraClass || ""}">${value ? `<div class="fact-value">${value}</div>` : ""}${noteHTML(note)}</div>`;
}

function badge(yes, yesText, noText) {
  return yes ? `<span class="badge badge-yes">${yesText || "Yes"}</span>` : `<span class="badge badge-no">${noText || "No"}</span>`;
}

/* One icon per dock category, in the dataviz skill's fixed categorical
   order (see the --cat-* tokens in style.css) — stroke-based line icons
   so they inherit color via currentColor from the section's accent. */
const CATEGORY_ICONS = {
  income: '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><line x1="18" y1="6" x2="6" y2="18"/>',
  local: '<rect x="4" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="16" y="15" width="4" height="6"/>',
  disability: '<path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/>',
  leave: '<rect x="4" y="5" width="16" height="15" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>',
  ui: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  wage: '<circle cx="12" cy="12" r="8"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="700" stroke="none" fill="currentColor">$</text>',
  reciprocity: '<path d="M4 8h13M17 8l-3-3M17 8l-3 3M20 16H7M7 16l3-3M7 16l3 3"/>',
  workerscomp: '<path d="M4 16a8 8 0 0116 0z"/><path d="M2 16h20"/>',
};

function catIcon(key) {
  return `<svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${CATEGORY_ICONS[key]}</svg>`;
}

function bracketTableHTML(brackets) {
  if (!brackets || !brackets.length) return "";
  if (brackets.length === 1) {
    return `<p class="bracket-flat-note">Flat rate — <strong>${brackets[0].rate}%</strong> on all taxable income, no brackets to climb.</p>`;
  }
  const rows = brackets.map((b, i) => {
    const prevUpTo = i === 0 ? 0 : brackets[i - 1].upTo;
    const range = b.upTo === null
      ? `Over ${fmtMoney(prevUpTo)}`
      : i === 0
        ? `Up to ${fmtMoney(b.upTo)}`
        : `${fmtMoney(prevUpTo)}–${fmtMoney(b.upTo)}`;
    return `<tr><td>${range}</td><td class="bracket-rate">${b.rate}%</td></tr>`;
  }).join("");
  return `
    <table class="bracket-table">
      <caption>Single filer, by taxable income</caption>
      <thead><tr><th>Bracket</th><th>Rate</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* The combined "federal + state + local" picture — the exact thing a
   NYC hire is missing when they only see one line on an offer letter.
   Bars are scaled relative to the combined total, not to some fixed
   max, so the stack always fills the track regardless of how high the
   actual numbers run. */
function taxStackHTML(s) {
  const fedBrackets = FEDERAL.incomeTax.bracketsSingle;
  const fedTop = fedBrackets[fedBrackets.length - 1].rate;
  const stateTop = s.incomeTax.type === "none" ? 0 : s.incomeTax.topRate;
  const hasLocalRate = s.localTax.exists && typeof s.localTax.topRate === "number";
  const localTop = hasLocalRate ? s.localTax.topRate : 0;
  const combined = fedTop + stateTop + localTop;

  const layers = [
    { label: "Federal", rate: fedTop, sub: "Same in every state", color: "var(--text-muted)" },
    {
      label: s.name + " state",
      rate: stateTop,
      sub: s.incomeTax.type === "none" ? "No state income tax" : s.incomeTax.type === "flat" ? "Flat rate" : "Top bracket",
      color: "var(--cat-income)",
    },
  ];
  if (s.localTax.exists) {
    layers.push({
      label: s.localTax.topRateLabel ? s.localTax.topRateLabel.replace(/\s*\(.*\)$/, "") : "Local / city",
      rate: hasLocalRate ? localTop : null,
      sub: hasLocalRate ? "Top of range" : "Varies by city — see below",
      color: "var(--cat-local)",
    });
  }

  const rows = layers.map((l) => {
    const pct = l.rate ? Math.max((l.rate / combined) * 100, 3) : 0;
    return `
      <div class="stack-row">
        <div class="stack-label">${l.label}<span class="stack-sub">${l.sub}</span></div>
        <div class="stack-track"><div class="stack-fill" style="width:${pct}%; background:${l.color}"></div></div>
        <span class="stack-value">${l.rate !== null ? l.rate + "%" : "—"}</span>
      </div>`;
  }).join("");

  return `
    <div class="tax-stack">
      <div class="tax-stack-title">Your full tax stack — top marginal rates</div>
      ${rows}
      <div class="tax-stack-total">
        Combined top marginal: <strong>~${combined.toFixed(combined % 1 === 0 ? 0 : 1)}%</strong>
        <span class="stack-caveat">adds each layer's own top rate — a rough ceiling, not how deductions or credits actually interact</span>
      </div>
    </div>`;
}

function renderStateBreakdown(abbr) {
  const s = STATES[abbr];
  const inCompare = state.compare.includes(abbr);
  return `
    <div class="dock-header">
      <span class="eyebrow">${s.isDistrict ? "Federal district" : "State"}</span>
      <h2>${s.name}</h2>
      <div class="dock-capital">Capital: ${s.capital}</div>
      <div class="breakdown-actions">
        <button class="dock-add-compare" data-action="toggle-compare" data-abbr="${abbr}" ${!inCompare && state.compare.length >= 3 ? "disabled" : ""}>
          ${inCompare ? "✓ In comparison" : "＋ Add to comparison"}
        </button>
        <button class="breakdown-clear" data-action="clear-selection" type="button">✕ Clear</button>
      </div>
    </div>

    ${taxStackHTML(s)}

    <div class="breakdown-grid">
    <div class="dock-section dock-cat-income">
      <h3>${catIcon("income")} Income tax ${badge(s.incomeTax.type !== "none", s.incomeTax.type === "flat" ? "Flat" : "Progressive", "No income tax")}</h3>
      ${s.incomeTax.type === "none"
        ? factCard("0%", s.incomeTax.notes)
        : `${factCard(s.incomeTax.topRate + "%" + (s.incomeTax.type === "flat" ? " flat" : " top rate"), s.incomeTax.notes)}${bracketTableHTML(s.incomeTax.bracketsSingle)}`}
    </div>

    <div class="dock-section dock-cat-local">
      <h3>${catIcon("local")} Local / city income tax ${badge(s.localTax.exists)}</h3>
      ${factCard(s.localTax.exists ? "Layered on top of state tax" : "None", s.localTax.notes)}
    </div>

    <div class="dock-section dock-cat-disability">
      <h3>${catIcon("disability")} State disability insurance ${badge(s.disability.has)}</h3>
      ${s.disability.has ? factCard(s.disability.program, (s.disability.employeeRate ? "Employee pays: " + s.disability.employeeRate + ". " : "") + (s.disability.notes || "")) : factCard("Not required", s.disability.notes)}
    </div>

    <div class="dock-section dock-cat-leave">
      <h3>${catIcon("leave")} Paid family / medical leave ${badge(s.paidLeave.has, s.paidLeave.status === "active" ? "Active" : s.paidLeave.status)}</h3>
      ${s.paidLeave.has ? factCard(s.paidLeave.program, (s.paidLeave.employeeRate ? "Employee pays: " + s.paidLeave.employeeRate + ". " : "") + (s.paidLeave.notes || "")) : factCard("No program", s.paidLeave.notes)}
    </div>

    <div class="dock-section dock-cat-ui">
      <h3>${catIcon("ui")} Unemployment insurance (employer-paid)</h3>
      ${factCard(fmtMoney(s.ui.wageBase) + " wage base", `New-employer rate ${s.ui.newEmployerRate}, full range ${s.ui.rateRange}.` + (s.ui.notes ? " " + s.ui.notes : ""))}
    </div>

    <div class="dock-section dock-cat-wage">
      <h3>${catIcon("wage")} Minimum wage</h3>
      ${factCard(s.minWage.rate, s.minWage.notes)}
    </div>

    <div class="dock-section dock-cat-reciprocity">
      <h3>${catIcon("reciprocity")} Reciprocity & commuter tax rules ${s.reciprocity.convenienceRule ? '<span class="badge badge-critical">Convenience rule</span>' : ""}</h3>
      ${s.reciprocity.agreements.length ? `<div class="pill-list">${s.reciprocity.agreements.map((a) => `<span class="pill">${STATES[a] ? STATES[a].name : a}</span>`).join("")}</div>` : ""}
      ${factCard(s.reciprocity.agreements.length ? "Reciprocity with " + s.reciprocity.agreements.length + " neighbor" + (s.reciprocity.agreements.length > 1 ? "s" : "") : "No reciprocity agreements", s.reciprocity.notes)}
    </div>

    <div class="dock-section dock-cat-workerscomp">
      <h3>${catIcon("workerscomp")} Workers' comp & overtime quirks</h3>
      ${factCard("", s.workersComp.notes)}
    </div>
    </div>
  `;
}

/* Renders the full breakdown inline (no more slide-in panel/overlay —
   this used to be a dock the user described as feeling like "a pop
   up"). `scroll` is false on initial page load (NY is pre-selected so
   the page isn't just an empty placeholder) and true for every actual
   click, so the page brings the result into view without the user
   having to go find it. */
function selectState(abbr, scroll) {
  if (scroll === undefined) scroll = true;
  state.openAbbr = abbr;
  document.getElementById("state-breakdown-content").innerHTML = renderStateBreakdown(abbr);
  refreshMapSelectionClasses();
  if (scroll) {
    document.getElementById("state-breakdown").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function clearSelection() {
  state.openAbbr = null;
  document.getElementById("state-breakdown-content").innerHTML = `
    <div class="breakdown-placeholder">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-6.1-9.5-10.2C.7 7 2.3 3 6.5 3 9 3 11 4.5 12 6c1-1.5 3-3 5.5-3 4.2 0 5.8 4 3.9 7.8C19.5 14.9 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
      Click a state on the map, in the list, or search above — its full federal + state + local breakdown appears right here.
    </div>`;
  refreshMapSelectionClasses();
}

function initBreakdown() {
  document.getElementById("state-breakdown-content").addEventListener("click", (e) => {
    handleNoteToggle(e);
    if (e.target.closest('[data-action="clear-selection"]')) {
      clearSelection();
      return;
    }
    const btn = e.target.closest('[data-action="toggle-compare"]');
    if (!btn) return;
    toggleCompare(btn.dataset.abbr);
    document.getElementById("state-breakdown-content").innerHTML = renderStateBreakdown(state.openAbbr);
  });
}

/* ---------------- compare tray / overlay ---------------- */
/* Comparison-slot colors: the first 3 categorical hues, the only subset
   the dataviz skill validates CVD-safe for all pairwise comparisons at
   once (see --series-* tokens) — assigned by selection order, not by
   state identity, since the compared set changes every time. */
const SERIES_VARS = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];

function pulseCompareGo() {
  const go = document.getElementById("compare-go");
  go.classList.remove("is-ready-pulse");
  void go.offsetWidth;
  go.classList.add("is-ready-pulse");
}

function shakeCompareTray() {
  const tray = document.getElementById("compare-tray");
  tray.classList.remove("is-maxed");
  void tray.offsetWidth;
  tray.classList.add("is-maxed");
}

function toggleCompare(abbr) {
  const idx = state.compare.indexOf(abbr);
  if (idx >= 0) {
    state.compare.splice(idx, 1);
  } else if (state.compare.length < 3) {
    state.compare.push(abbr);
    if (state.compare.length === 2) pulseCompareGo();
  } else {
    shakeCompareTray();
  }
  renderCompareTray();
  refreshMapSelectionClasses();
}

function renderCompareTray() {
  const chips = document.getElementById("compare-chips");
  chips.innerHTML = state.compare
    .map((abbr, i) => `<span class="compare-chip" style="border-color:${SERIES_VARS[i]}"><span class="legend-swatch" style="background:${SERIES_VARS[i]}"></span>${STATES[abbr].name} <button data-abbr="${abbr}" aria-label="Remove">×</button></span>`)
    .join("");
  const go = document.getElementById("compare-go");
  go.disabled = state.compare.length < 2;
}

function initCompareTray() {
  document.getElementById("compare-chips").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-abbr]");
    if (!btn) return;
    toggleCompare(btn.dataset.abbr);
  });
  document.getElementById("compare-go").addEventListener("click", () => {
    document.getElementById("compare-go").classList.remove("is-ready-pulse");
    openCompare(state.compare);
  });
}

function compareBarChart(metricKey, abbrs) {
  const metric = METRICS.find((m) => m.key === metricKey);
  const allValues = STATE_ABBRS.map((a) => metric.get(STATES[a]));
  const max = Math.max(...allValues) || 1;
  const rows = abbrs.map((abbr, i) => {
    const val = metric.get(STATES[abbr]);
    const pct = val > 0 ? Math.max((val / max) * 100, 2) : 0;
    return `
      <div class="cbar-row">
        <span class="cbar-label">${STATES[abbr].name}</span>
        <div class="cbar-track"><div class="cbar-fill" style="width:${pct}%; background:${SERIES_VARS[i]}"></div></div>
        <span class="cbar-value">${metric.fmt(val)}</span>
      </div>`;
  }).join("");
  return `<div class="compare-chart"><div class="compare-chart-title">${metric.label}</div>${rows}</div>`;
}

function compareMatrixRow(label, abbrs, getter, trueText) {
  const cells = abbrs.map((abbr) => {
    const v = getter(STATES[abbr]);
    return `<td>${v ? `<span class="badge badge-yes">✓ ${trueText || "Yes"}</span>` : `<span class="badge badge-no">No</span>`}</td>`;
  }).join("");
  return `<tr><th>${label}</th>${cells}</tr>`;
}

function renderCompareMatrix(abbrs) {
  const header = abbrs.map((a) => `<th>${STATES[a].name}</th>`).join("");
  const rows = [
    compareMatrixRow("Local / city tax", abbrs, (s) => s.localTax.exists),
    compareMatrixRow("Disability insurance", abbrs, (s) => s.disability.has),
    compareMatrixRow("Paid family/medical leave", abbrs, (s) => s.paidLeave.has),
    compareMatrixRow("Reciprocity with a neighbor", abbrs, (s) => s.reciprocity.agreements.length > 0),
    compareMatrixRow('"Convenience" rule', abbrs, (s) => s.reciprocity.convenienceRule),
  ].join("");
  return `<table class="compare-matrix"><thead><tr><th></th>${header}</tr></thead><tbody>${rows}</tbody></table>`;
}

function renderCompareDetailCards(abbrs) {
  return `<div class="compare-detail-grid">${abbrs.map((abbr, i) => {
    const s = STATES[abbr];
    const bracketPart = s.incomeTax.type === "none"
      ? `<p class="bracket-flat-note">No state income tax.</p>`
      : bracketTableHTML(s.incomeTax.bracketsSingle);
    const commuterPart = s.reciprocity.notes ? `<p><strong>Commuter rules:</strong></p>${noteHTML(s.reciprocity.notes, 130)}` : "";
    return `
      <div class="compare-detail-card" style="--card-color:${SERIES_VARS[i]}">
        <h4>${s.name}</h4>
        ${bracketPart}
        ${commuterPart}
      </div>`;
  }).join("")}</div>`;
}

function renderCompareContent(abbrs) {
  const stateChips = abbrs.map((abbr, i) => `<span class="compare-state-chip" style="background:${SERIES_VARS[i]}"><span class="swatch"></span>${STATES[abbr].name}</span>`).join("");
  return `
    <h2>Side by side</h2>
    <div class="compare-states">${stateChips}</div>
    ${compareBarChart("topIncomeTaxRate", abbrs)}
    ${compareBarChart("minWage", abbrs)}
    ${compareBarChart("uiWageBase", abbrs)}
    ${renderCompareMatrix(abbrs)}
    <div class="compare-detail-title">Income tax brackets &amp; commuter notes</div>
    ${renderCompareDetailCards(abbrs)}
  `;
}

function openCompare(abbrs) {
  if (abbrs.length < 2) return;
  document.getElementById("compare-content").innerHTML = renderCompareContent(abbrs);
  document.getElementById("compare-overlay").hidden = false;
}

function initCompareOverlay() {
  document.getElementById("compare-close").addEventListener("click", () => {
    document.getElementById("compare-overlay").hidden = true;
  });
  document.getElementById("compare-overlay").addEventListener("click", (e) => {
    if (e.target.id === "compare-overlay") document.getElementById("compare-overlay").hidden = true;
  });
  document.getElementById("compare-content").addEventListener("click", handleNoteToggle);
}

/* ---------------- search ---------------- */
function initSearch() {
  const input = document.getElementById("search");
  const results = document.getElementById("search-results");
  let matches = [];
  let activeIndex = -1;

  function render(query) {
    const q = query.trim().toLowerCase();
    activeIndex = -1;
    if (!q) { results.hidden = true; results.innerHTML = ""; matches = []; return; }
    matches = STATE_ABBRS.filter((abbr) => STATES[abbr].name.toLowerCase().includes(q) || abbr.toLowerCase() === q).slice(0, 8);
    if (!matches.length) { results.hidden = true; results.innerHTML = ""; return; }
    results.innerHTML = matches.map((abbr) => `<button type="button" data-abbr="${abbr}">${STATES[abbr].name}</button>`).join("");
    results.hidden = false;
  }

  function setActive(i) {
    const buttons = results.querySelectorAll("button");
    buttons.forEach((b) => b.classList.remove("active"));
    activeIndex = i;
    if (i >= 0 && buttons[i]) {
      buttons[i].classList.add("active");
      buttons[i].scrollIntoView({ block: "nearest" });
    }
  }

  function select(abbr) {
    selectState(abbr);
    input.value = "";
    results.hidden = true;
  }

  input.addEventListener("input", () => render(input.value));
  input.addEventListener("focus", () => { if (input.value) render(input.value); });
  input.addEventListener("keydown", (e) => {
    if (results.hidden || !matches.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(activeIndex + 1, matches.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(activeIndex - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); select(matches[activeIndex >= 0 ? activeIndex : 0]); }
    else if (e.key === "Escape") { results.hidden = true; }
  });
  results.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-abbr]");
    if (!btn) return;
    select(btn.dataset.abbr);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) results.hidden = true;
  });
}

/* ---------------- federal strip ---------------- */
function initFederalStrip() {
  const f = FEDERAL;

  document.getElementById("federal-deduction-note").textContent =
    `Standard deduction: ${fmtMoney(f.incomeTax.standardDeduction.single)} single / ` +
    `${fmtMoney(f.incomeTax.standardDeduction.mfj)} joint (2026).`;
  document.getElementById("federal-bracket-table").innerHTML = bracketTableHTML(f.incomeTax.bracketsSingle);

  document.getElementById("federal-grid").innerHTML = `
    <div class="federal-card">
      <div class="fed-label">Social Security</div>
      <div class="fed-value">6.2% + 6.2%</div>
      <p class="fed-note">Capped at ${fmtMoney(f.socialSecurity.wageBase2026)} of 2026 wages.</p>
    </div>
    <div class="federal-card">
      <div class="fed-label">Medicare</div>
      <div class="fed-value">1.45% + 1.45%</div>
      <p class="fed-note">No cap, +0.9% above $200K (single).</p>
    </div>
    <div class="federal-card">
      <div class="fed-label">FUTA (employer-only)</div>
      <div class="fed-value">~0.6%</div>
      <p class="fed-note">On the first ${fmtMoney(f.futa.wageBase)} of wages.</p>
    </div>
  `;
}

/* ---------------- glossary ---------------- */
function initGlossary() {
  const grid = document.getElementById("glossary-grid");
  grid.innerHTML = GLOSSARY.map(([term, def]) => `<div class="glossary-item"><dt>${term}</dt><dd>${def}</dd></div>`).join("");
}

/* ---------------- disclaimer modal ---------------- */
function initDisclaimer() {
  document.getElementById("disclaimer-text").textContent = META.disclaimer;
  document.getElementById("footer-disclaimer").textContent = "As of " + META.asOf + ". " + META.disclaimer;
  document.getElementById("open-disclaimer").addEventListener("click", () => {
    document.getElementById("disclaimer-overlay").hidden = false;
  });
  document.getElementById("disclaimer-close").addEventListener("click", () => {
    document.getElementById("disclaimer-overlay").hidden = true;
  });
  document.getElementById("disclaimer-overlay").addEventListener("click", (e) => {
    if (e.target.id === "disclaimer-overlay") document.getElementById("disclaimer-overlay").hidden = true;
  });
}

/* ---------------- NY/NJ/CT quick-compare CTA ---------------- */
function initSpotlight() {
  document.getElementById("spotlight-compare").addEventListener("click", () => {
    state.compare = ["NY", "NJ", "CT"];
    renderCompareTray();
    openCompare(state.compare);
  });
}

/* ---------------- global escape key ---------------- */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!document.getElementById("compare-overlay").hidden) document.getElementById("compare-overlay").hidden = true;
  else if (!document.getElementById("disclaimer-overlay").hidden) document.getElementById("disclaimer-overlay").hidden = true;
});

/* ---------------- init ---------------- */
initMetricSelect();
initMapInteraction();
initStateList();
initCompareModeToggle();
initBreakdown();
initCompareTray();
initCompareOverlay();
initSearch();
initFederalStrip();
initGlossary();
initDisclaimer();
initSpotlight();
paintMap();
pulseStateOnce("NY");
selectState("NY", false);
