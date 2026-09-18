(function () {
  const chartEl = document.getElementById("chart");
  const tableBody = document.getElementById("tableBody");
  const tableWrap = document.getElementById("tableWrap");
  const tooltipEl = document.getElementById("tooltip");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  const chartViewBtn = document.getElementById("chartViewBtn");
  const tableViewBtn = document.getElementById("tableViewBtn");
  const footNote = document.getElementById("footNote");

  // Fixed scale reference so bar length means the same thing regardless of
  // sort/filter — always relative to the highest gross salary in the full
  // dataset, never just the currently visible rows.
  const MAX_GROSS = Math.max(...COUNTRIES.map((c) => c.grossUSD));

  function flagEmoji(iso2) {
    if (!iso2) return "🏳️";
    return iso2
      .toUpperCase()
      .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }

  function fmtUSD(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function sortRows(rows, mode) {
    const sorted = rows.slice();
    switch (mode) {
      case "gross-desc": return sorted.sort((a, b) => b.grossUSD - a.grossUSD);
      case "tax-asc": return sorted.sort((a, b) => a.taxPct - b.taxPct);
      case "tax-desc": return sorted.sort((a, b) => b.taxPct - a.taxPct);
      case "gdp-asc": return sorted.sort((a, b) => a.gdpRank - b.gdpRank);
      case "net-desc":
      default:
        return sorted.sort((a, b) => b.netUSD - a.netUSD);
    }
  }

  function currentRows() {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = q
      ? COUNTRIES.filter((c) => c.country.toLowerCase().includes(q))
      : COUNTRIES;
    return sortRows(filtered, sortSelect.value);
  }

  function showTooltip(evt, c) {
    tooltipEl.innerHTML = `
      <div class="t-title">${flagEmoji(c.iso2)} ${c.country}</div>
      <div class="t-row"><span class="k">Gross salary</span><span class="v">${fmtUSD(c.grossUSD)}</span></div>
      <div class="t-row"><span class="k">Tax (${c.taxPct.toFixed(1)}%)</span><span class="v">−${fmtUSD(c.taxUSD)}</span></div>
      <div class="t-row"><span class="k">Net income</span><span class="v">${fmtUSD(c.netUSD)}</span></div>
      <div class="t-source">${c.source}</div>
      <span class="t-confidence">${c.confidence} confidence</span>
    `;
    tooltipEl.classList.add("visible");
    positionTooltip(evt);
  }

  function positionTooltip(evt) {
    const pad = 16;
    const rect = tooltipEl.getBoundingClientRect();
    let x = evt.clientX + pad;
    let y = evt.clientY + pad;
    if (x + rect.width > window.innerWidth - 8) x = evt.clientX - rect.width - pad;
    if (y + rect.height > window.innerHeight - 8) y = evt.clientY - rect.height - pad;
    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
  }

  function hideTooltip() {
    tooltipEl.classList.remove("visible");
  }

  function renderChart(rows) {
    chartEl.innerHTML = "";
    if (!rows.length) {
      chartEl.innerHTML = '<div class="empty-state">No country matches that filter.</div>';
      return;
    }
    rows.forEach((c, i) => {
      const netPct = (c.netUSD / MAX_GROSS) * 100;
      const grossPct = (c.grossUSD / MAX_GROSS) * 100;
      const keptLabelFits = netPct > 14; // enough room to print the net figure inside the bar

      const row = document.createElement("div");
      row.className = "row";
      row.tabIndex = 0;
      row.setAttribute("role", "img");
      row.setAttribute(
        "aria-label",
        `${c.country}: gross ${fmtUSD(c.grossUSD)}, tax ${c.taxPct.toFixed(1)} percent, net ${fmtUSD(c.netUSD)}`
      );

      row.innerHTML = `
        <div class="row-rank">${i + 1}</div>
        <div class="row-country"><span class="row-flag">${flagEmoji(c.iso2)}</span>${c.country}</div>
        <div class="row-track">
          <div class="bar-kept" style="width:${netPct}%">
            ${keptLabelFits ? `<span class="bar-kept-label">${fmtUSD(c.netUSD)}</span>` : ""}
          </div>
          <div class="bar-taken" style="width:${Math.max(grossPct - netPct - 0.3, 0)}%; left:${netPct}%">
          </div>
          ${!keptLabelFits ? `<span class="bar-kept-label outside" style="left:${netPct}%">${fmtUSD(c.netUSD)}</span>` : ""}
        </div>
        <div class="row-gross"><span class="label">Gross</span>${fmtUSD(c.grossUSD)}</div>
      `;

      row.addEventListener("mouseenter", (e) => showTooltip(e, c));
      row.addEventListener("mousemove", positionTooltip);
      row.addEventListener("mouseleave", hideTooltip);
      row.addEventListener("focus", (e) => showTooltip(e, c));
      row.addEventListener("blur", hideTooltip);

      chartEl.appendChild(row);
    });
  }

  function renderTable(rows) {
    tableBody.innerHTML = rows
      .map(
        (c, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="country-cell">${flagEmoji(c.iso2)} ${c.country}</td>
        <td class="num">${fmtUSD(c.grossUSD)}</td>
        <td class="num">${c.taxPct.toFixed(1)}%</td>
        <td class="num">${fmtUSD(c.taxUSD)}</td>
        <td class="num">${fmtUSD(c.netUSD)}</td>
        <td>${c.source}</td>
      </tr>`
      )
      .join("");
  }

  function renderFoot() {
    const asof = typeof DATA_ASOF !== "undefined" && DATA_ASOF ? DATA_ASOF : "TBD";
    let modeNote = "";
    if (typeof DATA_MODE !== "undefined" && DATA_MODE === "placeholder") {
      modeNote = "<p><strong>These are placeholder figures</strong> — real sourced numbers are being researched and will replace this set.</p>";
    } else if (typeof DATA_MODE !== "undefined" && DATA_MODE === "partial") {
      const pending = typeof PENDING_COUNTRIES !== "undefined" ? PENDING_COUNTRIES : [];
      modeNote = `<p><strong>First draft — ${COUNTRIES.length} of the top ~30 economies by GDP so far.</strong>
        Figures below are real and sourced (OECD Taxing Wages), not placeholders.
        Still being researched: ${pending.join(", ")} — these need slower
        composite estimates since they aren't covered by OECD's wage/tax tables.</p>`;
    }
    footNote.innerHTML = `
      ${modeNote}
      <p><strong>Methodology:</strong> figures are for a single full-time
      worker with no children earning the national average wage. "Tax" is
      personal income tax plus employee-side mandatory social security
      contributions only — not employer contributions, not VAT/consumption
      tax. Converted to US dollars at market exchange rates (not
      purchasing-power-adjusted), as of ${asof}.</p>
      <p>Country list is the top economies by nominal GDP, not a
      cost-of-living or quality-of-life ranking — a country can tax little
      and still pay low wages in absolute dollar terms, or vice versa.
      Figures for countries without a standardized "average wage" survey
      (large informal-sector economies) are lower-confidence composite
      estimates — check the source and confidence tag on each row before
      citing a number. Two rows (Saudi Arabia, UAE) use a fixed currency
      peg rather than a floating spot rate; Argentina's wage figure is
      paired with a slightly later date than its exchange rate because of
      peso volatility.</p>
    `;
  }

  function render() {
    const rows = currentRows();
    renderChart(rows);
    renderTable(rows);
  }

  function setView(view) {
    const isChart = view === "chart";
    chartViewBtn.classList.toggle("active", isChart);
    tableViewBtn.classList.toggle("active", !isChart);
    chartEl.classList.toggle("hidden", !isChart);
    tableWrap.classList.toggle("active", !isChart);
  }

  sortSelect.addEventListener("change", render);
  searchInput.addEventListener("input", render);
  chartViewBtn.addEventListener("click", () => setView("chart"));
  tableViewBtn.addEventListener("click", () => setView("table"));

  renderFoot();
  render();
})();
