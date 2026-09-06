(() => {
  const rosterInput = document.getElementById("roster");
  const rosterList = document.getElementById("rosterList");
  const demoNote = document.getElementById("demoNote");
  const hoursToggle = document.getElementById("hoursToggle");
  const refDateInput = document.getElementById("refDate");
  const includeMeInput = document.getElementById("includeMe");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const resetBtn = document.getElementById("resetBtn");
  const linkStatus = document.getElementById("linkStatus");
  const tzGrid = document.getElementById("tzGrid");
  const results = document.getElementById("results");
  const quickName = document.getElementById("quickName");
  const quickCity = document.getElementById("quickCity");
  const quickSuggest = document.getElementById("quickSuggest");
  const quickAddBtn = document.getElementById("quickAddBtn");
  const quickAddWrap = document.getElementById("quickAdd");

  // Shown as the textarea's placeholder (real placeholder attribute, not
  // typed-in text) so it's always visibly example content — grey, and
  // gone the instant a real value is typed, pasted, or added via Quick
  // Add — rather than sample text a user would have to select and
  // delete first. When the textarea is empty, render() still parses this
  // for display, purely so the page never looks broken/empty on load.
  const SAMPLE = "Amara - Lagos\nDiego - Mexico City\nYuki - Tokyo\nElena - Berlin";

  const state = {
    workStart: 9,
    workEnd: 18,
    includeMe: true,
    dateStr: "",
  };

  // Manual fixes from "did you mean" chips, keyed by the exact trimmed
  // line of text they were resolved for. Cleared for a line as soon as
  // that line's text changes, since the override no longer applies to it.
  let overrides = {};
  let viewerZone = "UTC";

  try {
    viewerZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    viewerZone = "UTC";
  }

  function todayStr() {
    return dateToStr(new Date());
  }

  function dateToStr(d) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function defaultDateStr() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return dateToStr(d);
  }

  // Splits one pasted line into a name + a city query, trying the
  // separators people naturally use ("Alice - Tokyo", "Bob, London").
  // Whichever side of the separator actually resolves to a known city
  // is treated as the city; the other side becomes the display name.
  function parseLine(line) {
    if (overrides[line]) {
      return { name: overrides[line].displayName, match: overrides[line].entry, unresolved: false };
    }
    const seps = [" - ", " – ", " — ", ",", ":", "\t", " in "];
    for (const sep of seps) {
      const idx = line.indexOf(sep);
      if (idx === -1) continue;
      const left = line.slice(0, idx).trim();
      const right = line.slice(idx + sep.length).trim();
      let m = findCity(right);
      if (m) return { name: left || m.city, match: m, unresolved: false };
      m = findCity(left);
      if (m) return { name: right || m.city, match: m, unresolved: false };
    }
    const whole = findCity(line);
    if (whole) return { name: whole.city, match: whole, unresolved: false };

    let suggestQuery = line;
    for (const sep of seps) {
      const idx = line.indexOf(sep);
      if (idx > -1) {
        suggestQuery = line.slice(idx + sep.length).trim() || line.slice(0, idx).trim();
        break;
      }
    }
    return { name: null, unresolved: true, suggestions: suggestCities(suggestQuery) };
  }

  function parseRoster(text) {
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((raw, i) => ({ id: i, raw, ...parseLine(raw) }));
  }

  function renderRosterList(roster, isDemo) {
    rosterList.innerHTML = "";
    rosterList.classList.toggle("roster-list-demo", isDemo);
    if (roster.length === 0) return;
    roster.forEach((r) => {
      const row = document.createElement("div");
      row.className = "roster-row" + (r.unresolved ? " roster-row-bad" : "");
      if (r.unresolved) {
        const chips = (r.suggestions || [])
          .map(
            (s) =>
              `<button type="button" class="chip-suggest" data-raw="${escapeAttr(r.raw)}" data-iana="${escapeAttr(s.iana)}" data-city="${escapeAttr(s.city)}">${escapeHtml(s.city)}</button>`
          )
          .join("");
        row.innerHTML = `
          <span class="roster-bad-line">Couldn't place "${escapeHtml(r.raw)}"${chips ? " — did you mean:" : ""}</span>
          <span class="roster-chips">${chips}</span>
        `;
      } else {
        row.innerHTML = `
          <span class="roster-name">${escapeHtml(r.name)}</span>
          <span class="roster-city">${escapeHtml(r.match.city)}, ${escapeHtml(r.match.country)}</span>
        `;
      }
      rosterList.appendChild(row);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  rosterList.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip-suggest");
    if (!btn) return;
    const raw = btn.dataset.raw;
    const entry = CITY_ZONES.find((c) => c.iana === btn.dataset.iana && c.city === btn.dataset.city);
    if (!entry) return;
    overrides[raw] = { entry, displayName: entry.city };
    render();
  });

  // --- time zone math ---

  function zoneParts(date, timeZone) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });
    const parts = fmt.formatToParts(date);
    const get = (t) => parts.find((p) => p.type === t)?.value;
    return {
      year: +get("year"),
      month: +get("month"),
      day: +get("day"),
      hour: +get("hour"),
      minute: +get("minute"),
      weekday: get("weekday"),
    };
  }

  function dayOffset(parts, refY, refM, refD) {
    const a = Date.UTC(parts.year, parts.month - 1, parts.day);
    const b = Date.UTC(refY, refM - 1, refD);
    return Math.round((a - b) / 86400000);
  }

  function inRange(hour, minute, start, end) {
    const t = hour + minute / 60;
    return t >= start && t < end;
  }

  function fmtHM(hour, minute) {
    const period = hour < 12 ? "AM" : "PM";
    let h = hour % 12;
    if (h === 0) h = 12;
    return minute === 0 ? `${h}:00 ${period}` : `${h}:${String(minute).padStart(2, "0")} ${period}`;
  }

  const HOUR_LABELS = ["12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"];

  // Currently-selected candidate window, by its "start-end" key — set by
  // clicking an option in the results list. Cleared (falls back to the
  // top-ranked candidate) whenever it no longer matches any candidate in
  // a fresh render, e.g. after the roster/settings change underneath it.
  let selectedRunKey = null;
  function runKey(run) {
    return `${run.start}-${run.end}`;
  }

  // Splits the 24 hourly counts into maximal same-count runs, scores each
  // one (higher coverage always wins, then longer, then closer to 1pm
  // viewer-local), and returns the top few as a ranked list of candidate
  // meeting windows — not just the single best, so the results list can
  // offer real alternatives instead of one take-it-or-leave-it answer.
  function pickCandidates(counts, total, limit = 4) {
    const runs = [];
    let start = 0;
    for (let h = 1; h <= counts.length; h++) {
      if (h === counts.length || counts[h] !== counts[start]) {
        runs.push({ start, end: h, count: counts[start] });
        start = h;
      }
    }
    const usable = runs.filter((r) => r.count > 0);
    usable.forEach((r) => {
      const len = r.end - r.start;
      const mid = (r.start + r.end) / 2;
      r.isFull = r.count === total;
      r.score = r.count * 10000 + len * 100 - Math.abs(mid - 13);
    });
    usable.sort((a, b) => b.score - a.score);
    return usable.slice(0, limit);
  }

  function render() {
    const isDemo = rosterInput.value.trim() === "";
    demoNote.hidden = !isDemo;
    const rosterText = isDemo ? SAMPLE : rosterInput.value;
    const roster = parseRoster(rosterText);
    renderRosterList(roster, isDemo);

    const people = roster.filter((r) => !r.unresolved);

    const dateStr = refDateInput.value || defaultDateStr();
    const [ry, rm, rd] = dateStr.split("-").map(Number);

    // 25 columns: hour-of-day 0..23 for the viewer's local calendar day,
    // plus one extra at index 24 (midnight of the next day) purely so a
    // window that runs through the last hour has a real instant to use
    // as its closing boundary.
    const cols = [];
    for (let h = 0; h <= 24; h++) cols.push(new Date(ry, rm - 1, rd, h, 0, 0, 0));

    const participants = [];
    if (state.includeMe) {
      participants.push({ name: "You", city: "Your time zone", country: "", iana: viewerZone, isMe: true });
    }
    for (const p of people) {
      participants.push({ name: p.name, city: p.match.city, country: p.match.country, iana: p.match.iana, isMe: false });
    }

    // For each participant, the local {hour, minute, weekday, dayOffset}
    // at every one of the 25 column instants above.
    const rows = participants.map((p) => {
      const cells = cols.map((instant) => {
        const parts = zoneParts(instant, p.iana);
        return { ...parts, offset: dayOffset(parts, ry, rm, rd) };
      });
      return { person: p, cells };
    });

    const attending = rows.filter((r) => !r.person.isMe || state.includeMe);
    const total = attending.length;
    const counts = new Array(24).fill(0);
    attending.forEach((r) => {
      for (let h = 0; h < 24; h++) {
        if (inRange(r.cells[h].hour, r.cells[h].minute, state.workStart, state.workEnd)) counts[h]++;
      }
    });
    const candidates = total > 0 ? pickCandidates(counts, total) : [];

    // Keep whichever option was clicked, as long as it still exists in
    // this render's candidate list; otherwise fall back to the top pick.
    let active = candidates.find((c) => runKey(c) === selectedRunKey) || candidates[0] || null;
    selectedRunKey = active ? runKey(active) : null;

    renderGrid(rows, dateStr, active);
    renderResults(attending, total, candidates, active);
  }

  function renderGrid(rows, dateStr, active) {
    tzGrid.innerHTML = "";

    const header = document.createElement("div");
    header.className = "grid-row grid-header";
    header.appendChild(labelCell(""));
    HOUR_LABELS.forEach((l) => {
      const c = document.createElement("div");
      c.className = "hour-label";
      c.textContent = l;
      header.appendChild(c);
    });
    tzGrid.appendChild(header);

    rows.forEach((r) => {
      const rowEl = document.createElement("div");
      rowEl.className = "grid-row" + (r.person.isMe ? " grid-row-me" : "");
      rowEl.appendChild(labelCell(r.person.name, r.person.isMe ? "You" : `${r.person.city}, ${r.person.country}`));
      for (let h = 0; h < 24; h++) {
        const cell = r.cells[h];
        const on = inRange(cell.hour, cell.minute, state.workStart, state.workEnd);
        const cellEl = document.createElement("div");
        cellEl.className = "cell" + (on ? " cell-on" : "");
        if (active && h >= active.start && h < active.end) {
          cellEl.classList.add(active.isFull ? "cell-best" : "cell-best-partial");
        }
        const dayTag = cell.offset === 0 ? "" : cell.offset > 0 ? " (+1d)" : " (-1d)";
        cellEl.title = `${r.person.name}: ${cell.weekday} ${fmtHM(cell.hour, cell.minute)}${dayTag}`;
        rowEl.appendChild(cellEl);
      }
      tzGrid.appendChild(rowEl);
    });

    const isToday = dateStr === todayStr();
    let marker = tzGrid.querySelector(".now-marker");
    if (marker) marker.remove();
    if (isToday) {
      const now = new Date();
      const frac = (now.getHours() + now.getMinutes() / 60) / 24;
      marker = document.createElement("div");
      marker.className = "now-marker";
      marker.style.left = `calc(var(--label-w) + ${frac} * (100% - var(--label-w)))`;
      tzGrid.appendChild(marker);
    }
  }

  function labelCell(name, sub) {
    const c = document.createElement("div");
    c.className = "row-label";
    if (sub) {
      c.innerHTML = `<span class="row-name">${escapeHtml(name)}</span><span class="row-sub">${escapeHtml(sub)}</span>`;
    } else {
      c.textContent = name;
    }
    return c;
  }

  // Renders every candidate window as a clickable option — the top-ranked
  // one open by default, others collapsed to a summary line you can click
  // to expand (and to make that the grid's highlighted window instead).
  function renderResults(attending, total, candidates, active) {
    results.innerHTML = "";
    if (attending.length < 2) {
      results.innerHTML = `<p class="results-empty">Add at least one more city to find a shared meeting window.</p>`;
      return;
    }
    if (candidates.length === 0) {
      results.innerHTML = `<p class="results-empty">No overlapping hours at all within the current meeting-hours setting — try "Anytime awake."</p>`;
      return;
    }

    candidates.forEach((run, i) => {
      const isActive = active && runKey(run) === runKey(active);
      const card = document.createElement("div");
      card.className = "option-card" + (isActive ? " option-card-open" : "") + (run.isFull ? " option-card-good" : " option-card-partial");

      const label = run.isFull ? "Works for everyone" : `Covers ${run.count} of ${total} people`;
      const startCell0 = attending[0].cells[run.start];
      const endCell0 = attending[0].cells[run.end];
      const timeSummary = `${startCell0.weekday} ${fmtHM(startCell0.hour, startCell0.minute)} – ${fmtHM(endCell0.hour, endCell0.minute)} (your time)`;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-header";
      btn.innerHTML = `
        <span class="option-rank">${i === 0 ? "Best" : `Option ${i + 1}`}</span>
        <span class="option-label">${escapeHtml(label)}</span>
        <span class="option-time">${escapeHtml(timeSummary)}</span>
      `;
      btn.addEventListener("click", () => {
        selectedRunKey = runKey(run);
        render();
      });
      card.appendChild(btn);

      if (isActive) {
        const list = document.createElement("div");
        list.className = "result-list";
        attending.forEach((r) => {
          const startCell = r.cells[run.start];
          const endCell = r.cells[run.end];
          const covered = inRange(startCell.hour, startCell.minute, state.workStart, state.workEnd);
          const row = document.createElement("div");
          row.className = "result-row" + (covered ? "" : " result-row-excluded");
          const dayTag = startCell.offset === 0 ? "" : startCell.offset > 0 ? " · next day" : " · prev day";
          row.innerHTML = `
            <span class="result-name">${escapeHtml(r.person.name)}${r.person.isMe ? "" : ` <span class="result-city">— ${escapeHtml(r.person.city)}</span>`}</span>
            <span class="result-time">${startCell.weekday} ${fmtHM(startCell.hour, startCell.minute)} – ${fmtHM(endCell.hour, endCell.minute)}${dayTag}</span>
          `;
          list.appendChild(row);
        });
        card.appendChild(list);
      }

      results.appendChild(card);
    });
  }

  // --- shareable link ---

  function encodeState(roster) {
    const payload = {
      r: roster.filter((r) => !r.unresolved).map((r) => [r.name, r.match.city, r.match.iana]),
      ws: state.workStart,
      we: state.workEnd,
      im: state.includeMe ? 1 : 0,
      d: refDateInput.value || "",
    };
    const json = JSON.stringify(payload);
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  function decodeHash(hash) {
    try {
      let b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      return JSON.parse(decodeURIComponent(escape(atob(b64))));
    } catch {
      return null;
    }
  }

  function loadFromHash() {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return false;
    const data = decodeHash(hash);
    if (!data || !Array.isArray(data.r)) return false;

    overrides = {};
    const lines = data.r.map(([name, city, iana]) => {
      const line = name === city ? city : `${name} - ${city}`;
      overrides[line] = { entry: { city, country: countryForIana(iana), iana, aliases: [] }, displayName: name };
      return line;
    });
    rosterInput.value = lines.join("\n");

    if (typeof data.ws === "number") state.workStart = data.ws;
    if (typeof data.we === "number") state.workEnd = data.we;
    state.includeMe = data.im !== 0;
    includeMeInput.checked = state.includeMe;
    if (data.d) refDateInput.value = data.d;

    hoursToggle.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", +btn.dataset.start === state.workStart && +btn.dataset.end === state.workEnd);
    });
    return true;
  }

  copyLinkBtn.addEventListener("click", async () => {
    if (rosterInput.value.trim() === "") {
      linkStatus.textContent = "Add people first";
      clearTimeout(copyLinkBtn._t);
      copyLinkBtn._t = setTimeout(() => (linkStatus.textContent = ""), 2200);
      return;
    }
    const roster = parseRoster(rosterInput.value);
    const url = `${location.origin}${location.pathname}#${encodeState(roster)}`;
    history.replaceState(null, "", `#${encodeState(roster)}`);
    try {
      await navigator.clipboard.writeText(url);
      linkStatus.textContent = "Copied!";
    } catch {
      window.prompt("Copy this link:", url);
      linkStatus.textContent = "";
    }
    clearTimeout(copyLinkBtn._t);
    copyLinkBtn._t = setTimeout(() => (linkStatus.textContent = ""), 2200);
  });

  // --- quick add: type a city, click a suggestion, done — no need to
  // remember the "Name - City" line format at all. ---

  let quickMatches = [];
  let quickActiveIndex = -1;

  function renderQuickSuggestions() {
    const q = quickCity.value.trim();
    quickActiveIndex = -1;
    quickMatches = q ? suggestCities(q, 6) : [];
    quickSuggest.innerHTML = "";
    if (quickMatches.length === 0) {
      quickSuggest.hidden = true;
      return;
    }
    quickMatches.forEach((entry, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quick-suggest-item";
      btn.textContent = `${entry.city}, ${entry.country}`;
      btn.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus in the input
      btn.addEventListener("click", () => addQuickEntry(entry));
      quickSuggest.appendChild(btn);
    });
    quickSuggest.hidden = false;
  }

  function highlightQuickMatch() {
    [...quickSuggest.children].forEach((el, i) => el.classList.toggle("active", i === quickActiveIndex));
  }

  function addQuickEntry(entry) {
    const name = quickName.value.trim();
    const line = name ? `${name} - ${entry.city}` : entry.city;
    const current = rosterInput.value.trim();
    rosterInput.value = current ? `${current}\n${line}` : line;
    quickName.value = "";
    quickCity.value = "";
    quickSuggest.innerHTML = "";
    quickSuggest.hidden = true;
    quickCity.focus();
    render();
  }

  quickCity.addEventListener("input", renderQuickSuggestions);

  quickCity.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && quickMatches.length) {
      e.preventDefault();
      quickActiveIndex = (quickActiveIndex + 1) % quickMatches.length;
      highlightQuickMatch();
    } else if (e.key === "ArrowUp" && quickMatches.length) {
      e.preventDefault();
      quickActiveIndex = (quickActiveIndex - 1 + quickMatches.length) % quickMatches.length;
      highlightQuickMatch();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = quickActiveIndex >= 0 ? quickMatches[quickActiveIndex] : quickMatches[0] || findCity(quickCity.value);
      if (chosen) addQuickEntry(chosen);
    } else if (e.key === "Escape") {
      quickSuggest.hidden = true;
    }
  });

  quickAddBtn.addEventListener("click", () => {
    const chosen = quickMatches[quickActiveIndex] || quickMatches[0] || findCity(quickCity.value);
    if (chosen) addQuickEntry(chosen);
  });

  document.addEventListener("click", (e) => {
    if (!quickAddWrap.contains(e.target)) quickSuggest.hidden = true;
  });

  // --- reset ---

  resetBtn.addEventListener("click", () => {
    rosterInput.value = "";
    overrides = {};
    quickName.value = "";
    quickCity.value = "";
    quickSuggest.hidden = true;
    state.workStart = 9;
    state.workEnd = 18;
    hoursToggle.querySelectorAll("button").forEach((b) => b.classList.toggle("active", +b.dataset.start === 9 && +b.dataset.end === 18));
    state.includeMe = true;
    includeMeInput.checked = true;
    refDateInput.value = defaultDateStr();
    history.replaceState(null, "", location.pathname + location.search);
    render();
  });

  // --- wiring ---

  let debounceId = null;
  function scheduleRender() {
    clearTimeout(debounceId);
    debounceId = setTimeout(render, 120);
  }

  rosterInput.addEventListener("input", () => {
    // Any manual override only applies to the exact line text it was
    // made for — once the user edits a line, its override no longer
    // matches that text and normal matching takes back over.
    scheduleRender();
  });

  hoursToggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-start]");
    if (!btn) return;
    state.workStart = +btn.dataset.start;
    state.workEnd = +btn.dataset.end;
    hoursToggle.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });

  refDateInput.addEventListener("change", render);

  includeMeInput.addEventListener("change", () => {
    state.includeMe = includeMeInput.checked;
    render();
  });

  const hadHash = loadFromHash();
  if (!hadHash) {
    refDateInput.value = defaultDateStr();
  }
  render();
})();
