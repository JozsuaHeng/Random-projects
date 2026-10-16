/* Paycheck Atlas — interaction logic. Reads STATES/FEDERAL/META from data.js. */

const THEME_KEY = "paycheck-atlas-theme";
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
  ["State income tax", "A tax your state (sometimes also your city or county) takes out of your paycheck, on top of federal tax. Nine states have none at all."],
  ["Local / city income tax", "A second, separate wage tax layered on by a city, county, or school district — on top of the state's own rate. Most states don't have this; a handful (NY, PA, OH, MD, and others) do."],
  ["Social Security & Medicare", "Together called \"FICA\" on a paystub — federal payroll taxes that fund retirement and healthcare programs. Same rate in every state, split between you and your employer."],
  ["State disability insurance (SDI)", "A payroll deduction that funds short-term pay if you can't work due to a non-work injury or illness. Only 5 states require it."],
  ["Paid family / medical leave (PFML)", "Insurance-funded paid time off for a new child, a seriously ill family member, or your own serious health condition — distinct from unpaid federal FMLA, which only guarantees job protection, not pay."],
  ["Unemployment insurance (UI / SUTA)", "A payroll tax your employer pays (not you, in most states) that funds unemployment benefits. The \"wage base\" is how much of each employee's pay gets taxed for this each year."],
  ["Reciprocity agreement", "A deal between two states where a resident of one who works in the other only pays income tax to their home state — no dual filing."],
  ["\"Convenience of the employer\" rule", "Lets a state tax a remote worker's wages as if they worked in-state, even if they never set foot there, unless their home office meets a strict legal test."],
  ["Minimum wage", "The lowest hourly wage an employer can legally pay. The federal floor ($7.25) hasn't moved since 2009 — about a third of states still just use that."],
];

let state = {
  metric: "topIncomeTaxRate",
  compare: [],
  openAbbr: null,
};

function fmtMoney(n) {
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
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
      tooltip.innerHTML = `<strong>${s.name}</strong>${metric.label}: ${display}`;
      tooltip.hidden = false;
      const rect = wrap.getBoundingClientRect();
      let x = evt.clientX - rect.left + 14;
      let y = evt.clientY - rect.top + 14;
      tooltip.style.left = x + "px";
      tooltip.style.top = y + "px";
    };
    node.addEventListener("mousemove", show);
    node.addEventListener("mouseenter", show);
    node.addEventListener("mouseleave", () => { tooltip.hidden = true; });
    node.addEventListener("click", () => openDock(abbr));
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
}

/* ---------------- dock (state detail) ---------------- */
function factCard(value, note, extraClass) {
  return `<div class="dock-fact ${extraClass || ""}"><div class="fact-value">${value}</div>${note ? `<p class="fact-note">${note}</p>` : ""}</div>`;
}

function badge(yes, yesText, noText) {
  return yes ? `<span class="badge badge-yes">${yesText || "Yes"}</span>` : `<span class="badge badge-no">${noText || "No"}</span>`;
}

function renderStateDockContent(abbr) {
  const s = STATES[abbr];
  const inCompare = state.compare.includes(abbr);
  return `
    <div class="dock-header">
      <span class="eyebrow">${s.isDistrict ? "Federal district" : "State"}</span>
      <h2>${s.name}</h2>
      <div class="dock-capital">Capital: ${s.capital}</div>
      <button class="dock-add-compare" data-action="toggle-compare" data-abbr="${abbr}" ${!inCompare && state.compare.length >= 3 ? "disabled" : ""}>
        ${inCompare ? "✓ In comparison" : "＋ Add to comparison"}
      </button>
    </div>

    <div class="dock-section">
      <h3>Income tax ${badge(s.incomeTax.type !== "none", s.incomeTax.type === "flat" ? "Flat" : "Progressive", "No income tax")}</h3>
      ${factCard(s.incomeTax.type === "none" ? "0%" : s.incomeTax.topRate + "%" + (s.incomeTax.type === "flat" ? " flat" : " top rate"), s.incomeTax.notes)}
    </div>

    <div class="dock-section">
      <h3>Local / city income tax ${badge(s.localTax.exists)}</h3>
      ${factCard(s.localTax.exists ? "Layered on top of state tax" : "None", s.localTax.notes)}
    </div>

    <div class="dock-section">
      <h3>State disability insurance ${badge(s.disability.has)}</h3>
      ${s.disability.has ? factCard(s.disability.program, (s.disability.employeeRate ? "Employee pays: " + s.disability.employeeRate + ". " : "") + (s.disability.notes || "")) : factCard("Not required", s.disability.notes)}
    </div>

    <div class="dock-section">
      <h3>Paid family / medical leave ${badge(s.paidLeave.has, s.paidLeave.status === "active" ? "Active" : s.paidLeave.status)}</h3>
      ${s.paidLeave.has ? factCard(s.paidLeave.program, (s.paidLeave.employeeRate ? "Employee pays: " + s.paidLeave.employeeRate + ". " : "") + (s.paidLeave.notes || "")) : factCard("No program", s.paidLeave.notes)}
    </div>

    <div class="dock-section">
      <h3>Unemployment insurance (employer-paid)</h3>
      ${factCard(fmtMoney(s.ui.wageBase) + " wage base", `New-employer rate ${s.ui.newEmployerRate}, full range ${s.ui.rateRange}.` + (s.ui.notes ? " " + s.ui.notes : ""))}
    </div>

    <div class="dock-section">
      <h3>Minimum wage</h3>
      ${factCard(s.minWage.rate, s.minWage.notes)}
    </div>

    <div class="dock-section">
      <h3>Reciprocity & commuter tax rules ${s.reciprocity.convenienceRule ? '<span class="badge badge-critical">Convenience rule</span>' : ""}</h3>
      ${s.reciprocity.agreements.length ? `<div class="pill-list">${s.reciprocity.agreements.map((a) => `<span class="pill">${STATES[a] ? STATES[a].name : a}</span>`).join("")}</div>` : ""}
      ${factCard(s.reciprocity.agreements.length ? "Reciprocity with " + s.reciprocity.agreements.length + " neighbor" + (s.reciprocity.agreements.length > 1 ? "s" : "") : "No reciprocity agreements", s.reciprocity.notes)}
    </div>

    <div class="dock-section">
      <h3>Workers' comp & overtime quirks</h3>
      ${factCard("", s.workersComp.notes)}
    </div>
  `;
}

function openDock(abbr) {
  state.openAbbr = abbr;
  document.getElementById("dock-content").innerHTML = renderStateDockContent(abbr);
  document.getElementById("dock").classList.add("is-open");
  document.getElementById("dock").setAttribute("aria-hidden", "false");
  document.getElementById("dock-scrim").classList.add("is-visible");
  refreshMapSelectionClasses();
}

function closeDock() {
  state.openAbbr = null;
  document.getElementById("dock").classList.remove("is-open");
  document.getElementById("dock").setAttribute("aria-hidden", "true");
  document.getElementById("dock-scrim").classList.remove("is-visible");
  refreshMapSelectionClasses();
}

function initDock() {
  document.getElementById("dock-close").addEventListener("click", closeDock);
  document.getElementById("dock-scrim").addEventListener("click", closeDock);
  document.getElementById("dock-content").addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="toggle-compare"]');
    if (!btn) return;
    toggleCompare(btn.dataset.abbr);
    document.getElementById("dock-content").innerHTML = renderStateDockContent(state.openAbbr);
  });
}

/* ---------------- compare tray / overlay ---------------- */
function toggleCompare(abbr) {
  const idx = state.compare.indexOf(abbr);
  if (idx >= 0) {
    state.compare.splice(idx, 1);
  } else if (state.compare.length < 3) {
    state.compare.push(abbr);
  }
  renderCompareTray();
  refreshMapSelectionClasses();
}

function renderCompareTray() {
  const chips = document.getElementById("compare-chips");
  chips.innerHTML = state.compare
    .map((abbr) => `<span class="compare-chip">${STATES[abbr].name} <button data-abbr="${abbr}" aria-label="Remove">×</button></span>`)
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
  document.getElementById("compare-go").addEventListener("click", () => openCompare(state.compare));
}

function compareRow(label, cells) {
  return `<tr><th>${label}</th>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
}

function renderCompareContent(abbrs) {
  const states = abbrs.map((a) => STATES[a]);
  return `
    <h2>Side by side</h2>
    <table class="compare-table">
      <thead><tr><th></th>${states.map((s) => `<th>${s.name}</th>`).join("")}</tr></thead>
      <tbody>
        ${compareRow("Income tax", states.map((s) => `<span class="fact-value">${s.incomeTax.type === "none" ? "0%" : s.incomeTax.topRate + "%"}</span>${s.incomeTax.notes || ""}`))}
        ${compareRow("Local / city tax", states.map((s) => (s.localTax.exists ? `<span class="badge badge-yes">Yes</span> ${s.localTax.notes}` : `<span class="badge badge-no">No</span>`)))}
        ${compareRow("Disability insurance", states.map((s) => (s.disability.has ? `<span class="fact-value">${s.disability.program}</span>${s.disability.employeeRate || ""}` : "None")))}
        ${compareRow("Paid family/medical leave", states.map((s) => (s.paidLeave.has ? `<span class="fact-value">${s.paidLeave.program}</span>` : "None")))}
        ${compareRow("Unemployment insurance (employer)", states.map((s) => `<span class="fact-value">${fmtMoney(s.ui.wageBase)} base</span>${s.ui.newEmployerRate} new-employer rate`))}
        ${compareRow("Minimum wage", states.map((s) => `<span class="fact-value">${s.minWage.rate}</span>`))}
        ${compareRow("Reciprocity", states.map((s) => (s.reciprocity.agreements.length ? s.reciprocity.agreements.map((a) => (STATES[a] ? STATES[a].name : a)).join(", ") : "None")))}
        ${compareRow('"Convenience" rule', states.map((s) => (s.reciprocity.convenienceRule ? '<span class="badge badge-critical">Yes</span>' : '<span class="badge badge-no">No</span>')))}
        ${compareRow("Reciprocity / commuter notes", states.map((s) => s.reciprocity.notes || "—"))}
        ${compareRow("Workers' comp & overtime", states.map((s) => s.workersComp.notes))}
      </tbody>
    </table>
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
}

/* ---------------- search ---------------- */
function initSearch() {
  const input = document.getElementById("search");
  const results = document.getElementById("search-results");

  function render(query) {
    const q = query.trim().toLowerCase();
    if (!q) { results.hidden = true; results.innerHTML = ""; return; }
    const matches = STATE_ABBRS.filter((abbr) => STATES[abbr].name.toLowerCase().includes(q) || abbr.toLowerCase() === q).slice(0, 8);
    if (!matches.length) { results.hidden = true; results.innerHTML = ""; return; }
    results.innerHTML = matches.map((abbr) => `<button type="button" data-abbr="${abbr}">${STATES[abbr].name}</button>`).join("");
    results.hidden = false;
  }

  input.addEventListener("input", () => render(input.value));
  input.addEventListener("focus", () => { if (input.value) render(input.value); });
  results.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-abbr]");
    if (!btn) return;
    openDock(btn.dataset.abbr);
    input.value = "";
    results.hidden = true;
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) results.hidden = true;
  });
}

/* ---------------- federal strip ---------------- */
function initFederalStrip() {
  const grid = document.getElementById("federal-grid");
  const f = FEDERAL;
  grid.innerHTML = `
    <div class="federal-card">
      <div class="fed-label">Federal income tax</div>
      <div class="fed-value">10%–37%</div>
      <p class="fed-note">7 brackets, same nationwide. Standard deduction: ${fmtMoney(f.incomeTax.standardDeduction.single)} single / ${fmtMoney(f.incomeTax.standardDeduction.mfj)} joint (2026).</p>
    </div>
    <div class="federal-card">
      <div class="fed-label">Social Security</div>
      <div class="fed-value">6.2% + 6.2%</div>
      <p class="fed-note">Only on the first ${fmtMoney(f.socialSecurity.wageBase2026)} of 2026 wages — the cap above which this tax simply stops.</p>
    </div>
    <div class="federal-card">
      <div class="fed-label">Medicare</div>
      <div class="fed-value">1.45% + 1.45%</div>
      <p class="fed-note">No wage cap, plus an extra 0.9% employee-only surtax above ${f.medicare.additionalMedicareTax.threshold.split("/")[0].trim()} (single).</p>
    </div>
    <div class="federal-card">
      <div class="fed-label">FUTA (employer-only)</div>
      <div class="fed-value">~0.6%</div>
      <p class="fed-note">On the first ${fmtMoney(f.futa.wageBase)} of wages — nearly every employer gets the full 5.4% credit, so this is the real-world rate.</p>
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

/* ---------------- spotlight CTA ---------------- */
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
  else if (document.getElementById("dock").classList.contains("is-open")) closeDock();
});

/* ---------------- init ---------------- */
initMetricSelect();
initMapInteraction();
initDock();
initCompareTray();
initCompareOverlay();
initSearch();
initFederalStrip();
initGlossary();
initDisclaimer();
initSpotlight();
paintMap();
