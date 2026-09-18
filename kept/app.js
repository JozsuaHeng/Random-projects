(function () {
  const chartEl = document.getElementById("chart");
  const tableBody = document.getElementById("tableBody");
  const tableWrap = document.getElementById("tableWrap");
  const tooltipEl = document.getElementById("tooltip");
  const sortButtons = Array.from(document.querySelectorAll(".sort-btn"));
  const sortableHeaders = Array.from(document.querySelectorAll("thead th[data-sort]"));
  const searchInput = document.getElementById("searchInput");
  const chartViewBtn = document.getElementById("chartViewBtn");
  const tableViewBtn = document.getElementById("tableViewBtn");
  const footNote = document.getElementById("footNote");

  let currentSort = "net-desc";

  // Fixed scale reference so bar length means the same thing regardless of
  // sort/filter — always relative to the highest gross salary in the full
  // dataset, never just the currently visible rows.
  const MAX_GROSS = Math.max(...COUNTRIES.map((c) => c.grossUSD));
  const AVG_NET = COUNTRIES.reduce((sum, c) => sum + c.netUSD, 0) / COUNTRIES.length;
  const AVG_NET_PCT = (AVG_NET / MAX_GROSS) * 100;

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
      case "country-asc": return sorted.sort((a, b) => a.country.localeCompare(b.country));
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
    return sortRows(filtered, currentSort);
  }

  function setSort(mode) {
    currentSort = mode;
    sortButtons.forEach((b) => b.classList.toggle("active", b.dataset.sort === mode));
    sortableHeaders.forEach((h) => h.classList.toggle("active", h.dataset.sort === mode));
    render();
  }

  function showTooltip(evt, c) {
    const noteLine = c.note ? `<div class="t-note">✦ ${c.note}</div>` : "";
    tooltipEl.innerHTML = `
      <div class="t-title">${flagEmoji(c.iso2)} ${c.country}</div>
      <div class="t-row"><span class="k">Gross salary</span><span class="v">${fmtUSD(c.grossUSD)}</span></div>
      <div class="t-row"><span class="k">Tax (${c.taxPct.toFixed(1)}%)</span><span class="v">−${fmtUSD(c.taxUSD)}</span></div>
      <div class="t-row"><span class="k">Net income</span><span class="v">${fmtUSD(c.netUSD)}</span></div>
      ${noteLine}
      <div class="t-source">${c.source}</div>
      <span class="t-confidence ${c.confidence}">${c.confidence} confidence</span>
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
        `${c.country}: gross ${fmtUSD(c.grossUSD)}, tax ${c.taxPct.toFixed(1)} percent, net ${fmtUSD(c.netUSD)}, ${c.confidence} confidence${c.note ? ". Note: " + c.note : ""}`
      );

      row.innerHTML = `
        <div class="row-rank">${i + 1}</div>
        <div class="row-country">
          <span class="row-conf-dot ${c.confidence}" title="${c.confidence} confidence"></span>
          <span class="row-flag">${flagEmoji(c.iso2)}</span>${c.country}
          ${c.note ? `<span class="row-note-badge" title="${c.note}">✦</span>` : ""}
        </div>
        <div class="row-track">
          <div class="row-avg-tick" style="left:${AVG_NET_PCT}%"></div>
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
        <td class="country-cell">${flagEmoji(c.iso2)} ${c.country}${c.note ? ` <span class="row-note-badge" title="${c.note}">✦</span>` : ""}</td>
        <td class="num">${fmtUSD(c.grossUSD)}</td>
        <td class="num">${c.taxPct.toFixed(1)}%</td>
        <td class="num">${fmtUSD(c.taxUSD)}</td>
        <td class="num">${fmtUSD(c.netUSD)}</td>
        <td><span class="conf-cell"><span class="conf-dot ${c.confidence}"></span>${c.confidence}</span></td>
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
      <p><strong>Currency:</strong> every figure is in <strong>US dollars at
      market exchange rates</strong> — not purchasing-power-adjusted (PPP).
      That means this chart shows who earns/keeps the most in raw dollar
      terms, not who has the most local buying power; a country can look
      "poor" here while still going a long way locally.</p>
      <p><strong>Methodology:</strong> figures are for a single full-time
      worker with no children earning the national average wage. "Tax" is
      personal income tax plus employee-side mandatory social security
      contributions only — not employer contributions, not VAT/consumption
      tax. Converted to USD as of ${asof}.</p>
      <p><strong>Confidence ratings:</strong> <strong>High</strong> = a
      single official government or OECD figure. <strong>Medium</strong> =
      reliable data, but combined from more than one source (e.g. a
      national wage survey paired with statutory tax rates instead of one
      ready-made table). <strong>Low</strong> = a real data-quality
      limitation applies — most often because the country's official
      "average wage" excludes a large informal or self-employed workforce,
      or because currency volatility makes a dollar figure date-sensitive.
      Never treat a Low-confidence number as precise; treat it as
      directionally right.</p>
      <p>Country list is the top economies by nominal GDP, not a
      cost-of-living or quality-of-life ranking — a country can tax little
      and still pay low wages in absolute dollar terms, or vice versa.
      Two rows (Saudi Arabia, UAE) use a fixed currency peg rather than a
      floating spot rate; Argentina's wage figure is paired with a
      slightly later date than its exchange rate because of peso
      volatility. Rows marked with a ✦ have a notable caveat or quirk —
      hover (or check the table) for specifics.</p>
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

  sortButtons.forEach((btn) => btn.addEventListener("click", () => setSort(btn.dataset.sort)));
  sortableHeaders.forEach((th) => th.addEventListener("click", () => setSort(th.dataset.sort)));
  searchInput.addEventListener("input", render);
  chartViewBtn.addEventListener("click", () => setView("chart"));
  tableViewBtn.addEventListener("click", () => setView("table"));

  renderFoot();
  render();
})();
