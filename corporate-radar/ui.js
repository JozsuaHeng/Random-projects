import {
  BUZZWORD_DICTIONARY, CATEGORIES, JARGON_TIERS, EXAMPLES,
  WEASEL_DICTIONARY, WEASEL_CATEGORIES, WEASEL_TIERS, WEASEL_EXAMPLES,
  URGENCY_DICTIONARY, URGENCY_CATEGORIES, URGENCY_TIERS, URGENCY_EXAMPLES,
  SO_WHAT_INDICATORS, SO_WHAT_TIERS, SO_WHAT_EXAMPLES,
  EXCUSE_BANK, SIGNOFF_BANK,
} from "./data.js";
import { segmentText, rewriteText, densityStats } from "./scan.js";
import { analyzeSentences, soWhatStats } from "./sowhat.js";
import { generateExcuse, randomScenario } from "./excuses.js";
import { generateSignoff, randomMood } from "./signoffs.js";
import { pickRandom } from "./random.js";

// Five colors, worst-to-best density tier — muted ink tones to sit on
// paper rather than glow. Reused by every meter on the site so "red"
// always means the same thing everywhere.
const TIER_COLORS = ["#4f7a5a", "#8a9a4f", "#c9a13a", "#c1783a", "#a6362c"];

function setMeter(fillEl, tierIndex, tierCount, ratio, invert = false) {
  const colors = invert ? [...TIER_COLORS].reverse() : TIER_COLORS;
  const clampedIndex = Math.max(0, Math.min(tierCount - 1, tierIndex));
  fillEl.style.background = colors[clampedIndex];
  fillEl.style.width = `${Math.round(Math.min(1, ratio) * 100)}%`;
}

// --- Navigation: a persistent row of tabs up top, one tool view visible
// at a time. Buzzword Decoder is the default so the page shows real
// output (and the glossary) immediately, rather than landing on an empty
// picker screen. A one-line description under the tabs previews whichever
// tab is hovered/focused, falling back to the active tab otherwise — a
// lookup table again, just keyed by view id instead of a phrase. ---
const TOOL_DESCRIPTIONS = {
  "view-buzzword": "💡 Paste something corporate. Find out what it actually means.",
  "view-weasel": "💡 Paste a draft. Find every hedge, qualifier, and built-in excuse.",
  "view-urgency": "💡 Paste a message. Find out how much of the urgency is real.",
  "view-sowhat": "💡 Paste your analysis. Sentence by sentence: does it say something, or just describe it?",
  "view-excuses": "💡 Pick your crime. Get a corporate-safe alibi.",
  "view-signoffs": "💡 Say what you mean, without saying what you mean.",
};

const toolTabs = document.querySelectorAll(".tool-tab");
const toolViews = document.querySelectorAll(".tool-view");
const tabDescription = document.getElementById("tab-description");
let activeViewId = "view-buzzword";

function setTabDescription(id) {
  tabDescription.textContent = TOOL_DESCRIPTIONS[id] || "";
}

function showView(id) {
  activeViewId = id;
  toolViews.forEach((view) => view.classList.toggle("hidden", view.id !== id));
  toolTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.target === id));
  setTabDescription(id);
  window.scrollTo({ top: 0, behavior: "instant" });
}

toolTabs.forEach((tab) => {
  tab.addEventListener("click", () => showView(tab.dataset.target));
  tab.addEventListener("mouseenter", () => setTabDescription(tab.dataset.target));
  tab.addEventListener("focus", () => setTabDescription(tab.dataset.target));
  tab.addEventListener("mouseleave", () => setTabDescription(activeViewId));
  tab.addEventListener("blur", () => setTabDescription(activeViewId));
});

// --- Shared tooltip, used by every scanner tool ---
const tooltip = document.getElementById("tooltip");

function hideTooltip() {
  tooltip.classList.add("hidden");
}

function showTooltip(anchorEl, text) {
  tooltip.textContent = text;
  tooltip.classList.remove("hidden");
  const rect = anchorEl.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  const top = rect.top + window.scrollY - tipRect.height - 8;
  const left = rect.left + window.scrollX + rect.width / 2 - tipRect.width / 2;
  tooltip.style.top = `${Math.max(8, top)}px`;
  tooltip.style.left = `${Math.max(8, left)}px`;
}

async function copyToClipboard(text, btn, defaultLabel) {
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied!";
  } catch (err) {
    btn.textContent = "Copy failed";
  }
  setTimeout(() => (btn.textContent = defaultLabel), 1200);
}

// --- Generic scanner tool: powers Buzzword Decoder, Weasel Word Scanner,
// and Manufactured Urgency Detector. All three are "paste text, highlight
// dictionary matches, show a density score, browse the glossary" — this
// function is that shape, configured three different ways below instead
// of being copy-pasted three times.
//
// Earlier this had a second "View" toggle (Highlight vs. Full Rewrite),
// so only one output box existed and switching Tone while in Highlight
// view visibly did nothing (the substituted text only ever showed up in
// a tooltip). Feedback: that was confusing. Now both outputs render
// unconditionally — "Analysis" (original text, matches highlighted,
// hover for the current tone's meaning) and "Translation" (the whole
// text rewritten in the current tone) — so Tone has one job and always
// visibly does it. ---
function createScanner({ prefix, dictionary, categories, tiers, examples, countLabel }) {
  const els = {
    exampleButtons: document.getElementById(`${prefix}-example-buttons`),
    input: document.getElementById(`${prefix}-input`),
    toneToggle: document.getElementById(`${prefix}-tone-toggle`),
    decodeBtn: document.getElementById(`${prefix}-decode-btn`),
    copyBtn: document.getElementById(`${prefix}-copy-btn`),
    emptyState: document.getElementById(`${prefix}-empty-state`),
    result: document.getElementById(`${prefix}-result`),
    statsCount: document.getElementById(`${prefix}-stats-count`),
    statsDensity: document.getElementById(`${prefix}-stats-density`),
    statsTierLabel: document.getElementById(`${prefix}-stats-tier-label`),
    statsTierBlurb: document.getElementById(`${prefix}-stats-tier-blurb`),
    meterFill: document.getElementById(`${prefix}-meter-fill`),
    outputText: document.getElementById(`${prefix}-output-text`),
    translationText: document.getElementById(`${prefix}-translation-text`),
    glossarySearch: document.getElementById(`${prefix}-glossary-search`),
    glossaryFilters: document.getElementById(`${prefix}-glossary-filters`),
    glossaryList: document.getElementById(`${prefix}-glossary-list`),
  };

  let tone = "plain";
  let currentText = "";
  let currentSegments = [];
  let activeCategory = "all";

  // Loading an example sets the dim "is-example" look; the very first
  // time the user actually edits the field (not just clicks into it),
  // that class comes off for good — see the `input` listener below.
  function loadExample(text) {
    els.input.value = text;
    els.input.classList.add("is-example");
    run();
  }

  function populateExamples() {
    els.exampleButtons.innerHTML = "";
    for (const example of examples) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-mini";
      btn.textContent = example.label;
      btn.addEventListener("click", () => loadExample(example.text));
      els.exampleButtons.appendChild(btn);
    }
  }

  function setActiveButton(container, activeValue, datasetKey) {
    container.querySelectorAll(".toggle-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset[datasetKey] === activeValue);
    });
  }

  function renderAnalysis() {
    els.outputText.innerHTML = "";
    for (const seg of currentSegments) {
      if (seg.type === "text") {
        els.outputText.appendChild(document.createTextNode(seg.value));
        continue;
      }
      const span = document.createElement("span");
      span.className = "match";
      span.style.setProperty("--cat-color", categories[seg.category].color);
      span.textContent = seg.value;
      span.tabIndex = 0;
      span.addEventListener("mouseenter", () => showTooltip(span, seg[tone]));
      span.addEventListener("focus", () => showTooltip(span, seg[tone]));
      span.addEventListener("mouseleave", hideTooltip);
      span.addEventListener("blur", hideTooltip);
      els.outputText.appendChild(span);
    }
  }

  function renderTranslation() {
    els.translationText.innerHTML = "";
    for (const seg of currentSegments) {
      if (seg.type === "text") {
        els.translationText.appendChild(document.createTextNode(seg.value));
        continue;
      }
      const span = document.createElement("span");
      span.className = "rewritten";
      span.style.setProperty("--cat-color", categories[seg.category].color);
      span.textContent = seg[tone];
      els.translationText.appendChild(span);
    }
  }

  function renderResult() {
    if (currentSegments.length === 0) {
      els.emptyState.classList.remove("hidden");
      els.result.classList.add("hidden");
      return;
    }
    els.emptyState.classList.add("hidden");
    els.result.classList.remove("hidden");

    const stats = densityStats(currentText, currentSegments, tiers);
    els.statsCount.textContent = stats.matchCount;
    els.statsDensity.textContent = `${Math.round(stats.density * 100)}%`;
    els.statsTierLabel.textContent = stats.tier.label;
    els.statsTierBlurb.textContent = stats.tier.blurb;

    const tierIndex = tiers.indexOf(stats.tier);
    setMeter(els.meterFill, tierIndex, tiers.length, stats.density / 0.3);

    renderAnalysis();
    renderTranslation();
  }

  function run() {
    currentText = els.input.value;
    currentSegments = currentText.trim() ? segmentText(currentText, dictionary) : [];
    renderResult();
  }

  function glossaryEntries() {
    return Object.entries(dictionary).sort((a, b) => a[0].localeCompare(b[0]));
  }

  function populateGlossaryFilters() {
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "chip-filter active";
    allBtn.dataset.category = "all";
    allBtn.textContent = "All";
    els.glossaryFilters.appendChild(allBtn);

    for (const [key, info] of Object.entries(categories)) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-filter";
      btn.dataset.category = key;
      btn.style.setProperty("--cat-color", info.color);
      btn.textContent = info.label;
      els.glossaryFilters.appendChild(btn);
    }

    els.glossaryFilters.querySelectorAll(".chip-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.category;
        els.glossaryFilters.querySelectorAll(".chip-filter").forEach((b) => b.classList.toggle("active", b === btn));
        renderGlossary();
      });
    });
  }

  function renderGlossary() {
    const query = els.glossarySearch.value.trim().toLowerCase();
    els.glossaryList.innerHTML = "";

    const rows = glossaryEntries().filter(([term, info]) => {
      const matchesCategory = activeCategory === "all" || info.category === activeCategory;
      const matchesQuery =
        !query || term.includes(query) || info.plain.toLowerCase().includes(query) || info.cynical.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    if (rows.length === 0) {
      const empty = document.createElement("p");
      empty.className = "glossary-empty";
      empty.textContent = "No matches. Try a different search term.";
      els.glossaryList.appendChild(empty);
      return;
    }

    for (const [term, info] of rows) {
      const row = document.createElement("div");
      row.className = "glossary-row";

      const termEl = document.createElement("div");
      termEl.className = "glossary-term";
      const badge = document.createElement("span");
      badge.className = "glossary-badge";
      badge.style.setProperty("--cat-color", categories[info.category].color);
      badge.textContent = categories[info.category].label;
      termEl.appendChild(document.createTextNode(term));
      termEl.appendChild(badge);

      const plainEl = document.createElement("div");
      plainEl.className = "glossary-plain";
      plainEl.innerHTML = `<strong>Plain:</strong> ${info.plain}`;

      const cynicalEl = document.createElement("div");
      cynicalEl.className = "glossary-cynical";
      cynicalEl.innerHTML = `<strong>Really means:</strong> ${info.cynical}`;

      row.appendChild(termEl);
      row.appendChild(plainEl);
      row.appendChild(cynicalEl);
      els.glossaryList.appendChild(row);
    }
  }

  els.toneToggle.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      tone = btn.dataset.tone;
      setActiveButton(els.toneToggle, tone, "tone");
      renderResult();
    });
  });
  els.decodeBtn.addEventListener("click", run);
  els.copyBtn.addEventListener("click", () => {
    if (currentSegments.length === 0) return;
    copyToClipboard(rewriteText(currentSegments, tone), els.copyBtn, els.copyBtn.textContent);
  });
  els.glossarySearch.addEventListener("input", renderGlossary);
  els.input.addEventListener("input", () => els.input.classList.remove("is-example"));
  els.input.addEventListener("focus", () => {
    if (els.input.classList.contains("is-example")) {
      els.input.value = "";
      els.input.classList.remove("is-example");
    }
  });

  populateExamples();
  populateGlossaryFilters();
  renderGlossary();

  // Load with the first example already run, so the tool shows real
  // output the moment you land on it instead of an empty state.
  if (examples.length > 0) {
    loadExample(examples[0].text);
  }

  return { dictionary };
}

createScanner({ prefix: "buzzword", dictionary: BUZZWORD_DICTIONARY, categories: CATEGORIES, tiers: JARGON_TIERS, examples: EXAMPLES });
createScanner({ prefix: "weasel", dictionary: WEASEL_DICTIONARY, categories: WEASEL_CATEGORIES, tiers: WEASEL_TIERS, examples: WEASEL_EXAMPLES });
createScanner({ prefix: "urgency", dictionary: URGENCY_DICTIONARY, categories: URGENCY_CATEGORIES, tiers: URGENCY_TIERS, examples: URGENCY_EXAMPLES });

// --- So-What Test ---
const sowhatExampleButtons = document.getElementById("sowhat-example-buttons");
const sowhatInput = document.getElementById("sowhat-input");
const sowhatRunBtn = document.getElementById("sowhat-run-btn");
const sowhatEmptyState = document.getElementById("sowhat-empty-state");
const sowhatResult = document.getElementById("sowhat-result");
const sowhatStatsCount = document.getElementById("sowhat-stats-count");
const sowhatStatsTotal = document.getElementById("sowhat-stats-total");
const sowhatStatsDensity = document.getElementById("sowhat-stats-density");
const sowhatStatsTierLabel = document.getElementById("sowhat-stats-tier-label");
const sowhatStatsTierBlurb = document.getElementById("sowhat-stats-tier-blurb");
const sowhatMeterFill = document.getElementById("sowhat-meter-fill");
const sowhatOutputText = document.getElementById("sowhat-output-text");

function loadSoWhatExample(text) {
  sowhatInput.value = text;
  sowhatInput.classList.add("is-example");
  runSoWhatTest();
}

function populateSoWhatExamples() {
  sowhatExampleButtons.innerHTML = "";
  for (const example of SO_WHAT_EXAMPLES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-mini";
    btn.textContent = example.label;
    btn.addEventListener("click", () => loadSoWhatExample(example.text));
    sowhatExampleButtons.appendChild(btn);
  }
}

function runSoWhatTest() {
  const text = sowhatInput.value;
  const analysis = text.trim() ? analyzeSentences(text, SO_WHAT_INDICATORS) : [];

  if (analysis.length === 0) {
    sowhatEmptyState.classList.remove("hidden");
    sowhatResult.classList.add("hidden");
    return;
  }
  sowhatEmptyState.classList.add("hidden");
  sowhatResult.classList.remove("hidden");

  const stats = soWhatStats(analysis, SO_WHAT_TIERS);
  sowhatStatsCount.textContent = stats.withSoWhat;
  sowhatStatsTotal.textContent = stats.total;
  sowhatStatsDensity.textContent = `${Math.round(stats.ratio * 100)}%`;
  sowhatStatsTierLabel.textContent = stats.tier.label;
  sowhatStatsTierBlurb.textContent = stats.tier.blurb;

  const tierIndex = SO_WHAT_TIERS.indexOf(stats.tier);
  setMeter(sowhatMeterFill, tierIndex, SO_WHAT_TIERS.length, stats.ratio, true);

  sowhatOutputText.innerHTML = "";
  for (const { sentence, hasSoWhat } of analysis) {
    const row = document.createElement("div");
    row.className = "sowhat-row";
    const tag = document.createElement("span");
    tag.className = hasSoWhat ? "tag-yes" : "tag-no";
    tag.textContent = hasSoWhat ? "✓ Has a so-what" : "⚠ So what?";
    const text = document.createElement("p");
    text.textContent = sentence;
    row.appendChild(tag);
    row.appendChild(text);
    sowhatOutputText.appendChild(row);
  }
}

populateSoWhatExamples();
sowhatRunBtn.addEventListener("click", runSoWhatTest);
sowhatInput.addEventListener("input", () => sowhatInput.classList.remove("is-example"));
sowhatInput.addEventListener("focus", () => {
  if (sowhatInput.classList.contains("is-example")) {
    sowhatInput.value = "";
    sowhatInput.classList.remove("is-example");
  }
});

// Same as the scanners above: show real output immediately.
if (SO_WHAT_EXAMPLES.length > 0) {
  loadSoWhatExample(SO_WHAT_EXAMPLES[0].text);
}

// --- History list, shared shape for both generators: newest first, capped
// so a long session doesn't grow the DOM without bound. Lives only in
// memory — reload the page and it's gone, same as everything else here. ---
const HISTORY_LIMIT = 30;

function pushHistory(history, entry) {
  history.unshift(entry);
  if (history.length > HISTORY_LIMIT) history.length = HISTORY_LIMIT;
}

function renderHistory(listEl, history, textKey) {
  listEl.innerHTML = "";
  if (history.length === 0) {
    const empty = document.createElement("p");
    empty.className = "history-empty";
    empty.textContent = "Nothing generated yet — hit Generate to start.";
    listEl.appendChild(empty);
    return;
  }
  for (const entry of history) {
    const row = document.createElement("div");
    row.className = "history-item";
    const tag = document.createElement("span");
    tag.className = "history-tag";
    tag.textContent = entry.label;
    const text = document.createElement("p");
    text.textContent = entry[textKey];
    row.appendChild(tag);
    row.appendChild(text);
    listEl.appendChild(row);
  }
}

// --- Excuse Generator ---
const scenarioButtons = document.getElementById("scenario-buttons");
const excuseBtn = document.getElementById("excuse-btn");
const excuseResult = document.getElementById("excuse-result");
const excuseScenarioLabel = document.getElementById("excuse-scenario-label");
const excuseTextEl = document.getElementById("excuse-text");
const excuseCopyBtn = document.getElementById("excuse-copy-btn");
const excuseHistoryEl = document.getElementById("excuse-history");
const excuseHistory = [];

let selectedScenario = null;

function populateScenarios() {
  scenarioButtons.innerHTML = "";
  for (const [key, entry] of Object.entries(EXCUSE_BANK)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip-filter";
    btn.dataset.scenario = key;
    btn.textContent = entry.label;
    btn.addEventListener("click", () => {
      selectedScenario = key;
      scenarioButtons.querySelectorAll(".chip-filter").forEach((b) => b.classList.toggle("active", b === btn));
    });
    scenarioButtons.appendChild(btn);
  }
  const first = scenarioButtons.querySelector(".chip-filter");
  if (first) {
    first.classList.add("active");
    selectedScenario = first.dataset.scenario;
  }
}

function runExcuseGenerator() {
  const scenario = selectedScenario || randomScenario();
  const { label, excuse } = generateExcuse(scenario);
  excuseScenarioLabel.textContent = label;
  excuseTextEl.textContent = excuse;
  excuseResult.classList.remove("hidden");
  pushHistory(excuseHistory, { label, excuse });
  renderHistory(excuseHistoryEl, excuseHistory, "excuse");
}

populateScenarios();
excuseBtn.addEventListener("click", runExcuseGenerator);
excuseCopyBtn.addEventListener("click", () => copyToClipboard(excuseTextEl.textContent, excuseCopyBtn, "Copy Excuse"));

// --- Sign-Off Generator ---
const moodButtons = document.getElementById("mood-buttons");
const signoffBtn = document.getElementById("signoff-btn");
const signoffResult = document.getElementById("signoff-result");
const signoffMoodLabel = document.getElementById("signoff-mood-label");
const signoffTextEl = document.getElementById("signoff-text");
const signoffCopyBtn = document.getElementById("signoff-copy-btn");
const signoffHistoryEl = document.getElementById("signoff-history");
const signoffHistory = [];

let selectedMood = null;

function populateMoods() {
  moodButtons.innerHTML = "";
  for (const [key, entry] of Object.entries(SIGNOFF_BANK)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip-filter";
    btn.dataset.mood = key;
    btn.textContent = entry.label;
    btn.addEventListener("click", () => {
      selectedMood = key;
      moodButtons.querySelectorAll(".chip-filter").forEach((b) => b.classList.toggle("active", b === btn));
    });
    moodButtons.appendChild(btn);
  }
  const first = moodButtons.querySelector(".chip-filter");
  if (first) {
    first.classList.add("active");
    selectedMood = first.dataset.mood;
  }
}

function runSignoffGenerator() {
  const mood = selectedMood || randomMood();
  const { label, signoff } = generateSignoff(mood);
  signoffMoodLabel.textContent = label;
  signoffTextEl.textContent = signoff;
  signoffResult.classList.remove("hidden");
  pushHistory(signoffHistory, { label, signoff });
  renderHistory(signoffHistoryEl, signoffHistory, "signoff");
}

populateMoods();
signoffBtn.addEventListener("click", runSignoffGenerator);
signoffCopyBtn.addEventListener("click", () => copyToClipboard(signoffTextEl.textContent, signoffCopyBtn, "Copy Sign-Off"));

// --- BS Bingo: one random pull from whichever tool comes up. Skips the
// So-What Test — its output is a per-sentence breakdown, not a one-liner,
// so it doesn't fit the "random dose" format the other five do. ---
const bingoBtn = document.getElementById("bingo-btn");
const bingoCard = document.getElementById("bingo-card");
const bingoTag = document.getElementById("bingo-tag");
const bingoTextEl = document.getElementById("bingo-text");
const bingoClose = document.getElementById("bingo-close");

function rollBingo() {
  const roll = pickRandom(["buzzword", "weasel", "urgency", "excuse", "signoff"]);

  if (roll === "buzzword" || roll === "weasel" || roll === "urgency") {
    const dict = roll === "buzzword" ? BUZZWORD_DICTIONARY : roll === "weasel" ? WEASEL_DICTIONARY : URGENCY_DICTIONARY;
    const cats = roll === "buzzword" ? CATEGORIES : roll === "weasel" ? WEASEL_CATEGORIES : URGENCY_CATEGORIES;
    const toolLabel = roll === "buzzword" ? "Buzzword" : roll === "weasel" ? "Weasel Word" : "Urgency Signal";
    const [term, info] = pickRandom(Object.entries(dict));
    bingoTag.textContent = `${toolLabel} — ${cats[info.category].label}`;
    bingoTextEl.textContent = `"${term}" really means: ${info.cynical}`;
  } else if (roll === "excuse") {
    const { label, excuse } = generateExcuse(randomScenario());
    bingoTag.textContent = `Excuse — ${label}`;
    bingoTextEl.textContent = excuse;
  } else {
    const { label, signoff } = generateSignoff(randomMood());
    bingoTag.textContent = `Sign-Off — ${label}`;
    bingoTextEl.textContent = signoff;
  }
  bingoCard.classList.remove("hidden");
}

bingoBtn.addEventListener("click", rollBingo);
bingoClose.addEventListener("click", () => bingoCard.classList.add("hidden"));
