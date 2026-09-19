// Insignia — logo & mark generator. Logic only; word banks + palettes
// live in data.js. Architecture mirrors NewCo's app.js: a name engine with
// weighted recipes, a category bank that keeps everything internally
// consistent, per-field regenerate buttons that touch only their own
// field, and a Generate button that's the only action allowed to pick a
// fresh category and reroll everything at once.
//
// The one structural difference from NewCo: a mark's SHAPE and its COLOR
// are generated separately on purpose. `generateMarkSpec()` decides what
// to draw (which shapes, which letter, which line path — pure geometry,
// no color), and `renderMark()` decides how to color it. That split is
// what lets "regenerate palette" recolor the exact same mark instead of
// drawing a new one, and lets the same mark render correctly on both the
// light and dark swatch without generating two different-looking logos.

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Name engine (same mechanic as NewCo: weighted recipes over a
// category's root words, with an optional seed word folded in) ---

function lastVowelDrop(word) {
  const vowels = "aeiouAEIOU";
  for (let i = word.length - 1; i >= 1; i--) {
    if (vowels.includes(word[i])) return word.slice(0, i) + word.slice(i + 1);
  }
  return word;
}

function suffixify(root) {
  return root + pick(NAME_SUFFIXES);
}

function twoWordName(root) {
  return root + " " + pick(STUDIO_WORDS);
}

function portmanteau(a, b) {
  const headLen = Math.max(2, Math.round(a.length * 0.6));
  const head = a.slice(0, headLen);
  const tailStart = Math.max(1, Math.round(b.length * 0.4));
  let tail = b.slice(tailStart) || b.slice(-2);
  tail = tail.charAt(0).toLowerCase() + tail.slice(1);
  return head + tail;
}

function theRoot(root) {
  return `The ${root}`;
}

function distinctRootPair(roots) {
  const a = pick(roots);
  let b = pick(roots);
  let guard = 0;
  while (b === a && guard++ < 5) b = pick(roots);
  return [a, b];
}

// If a seed word was typed in, it's folded into the root pool with extra
// weight (4 duplicate entries) — same trick as NewCo, so it shows up in a
// meaningful fraction of results without swamping every one.
function effectiveRoots(bank, seed) {
  return seed ? bank.roots.concat(Array(4).fill(seed)) : bank.roots;
}

// Six weighted recipes — fewer than NewCo's nine since a logo generator
// leans more on the mark than the name, but the mechanic (roll a number,
// walk down weighted bands) is identical.
function generateName(categoryKey, seed) {
  const bank = CATEGORIES[categoryKey];
  const roots = effectiveRoots(bank, seed);
  const roll = Math.random();
  if (roll < 0.10) return pick(roots);
  if (roll < 0.30) return lastVowelDrop(pick(roots));
  if (roll < 0.50) return suffixify(pick(roots));
  if (roll < 0.70) return twoWordName(pick(roots));
  if (roll < 0.90) {
    const [a, b] = distinctRootPair(roots);
    return portmanteau(a, b);
  }
  return theRoot(pick(roots));
}

// A typed-in business name always wins over the generator — it's used
// verbatim (just sanitized/title-cased), never remixed. This is what
// "generate for your actual business" hooks into: everything downstream
// (mark letters, wordmark text, recent-history entries) just reads
// state.name, with no idea whether it came from the generator or from
// the business-name field.
function resolveName(categoryKey, seed, override) {
  return override || generateName(categoryKey, seed);
}

// --- Keyword → category / palette matching (business-details feature) ---
// Only ever consulted when "All" is the active chip — an explicit chip
// pick is a stronger signal than an inferred one, so typed keywords
// never fight a category the user chose on purpose.

// Substring match in both directions, so a typed "lawyers" matches a
// KEYWORD_MAP/mood entry of "law" (entry is a substring of the typed
// word) and a typed "law" matches an entry of "lawfirm" (typed word is a
// substring of the entry) without needing every inflection spelled out.
function keywordMatches(word, entry) {
  return word.includes(entry) || entry.includes(word);
}

function splitKeywords(raw) {
  return (raw || "").toLowerCase().split(/[,\s]+/).filter(Boolean);
}

function suggestCategoryFromKeywords(raw) {
  const words = splitKeywords(raw);
  if (!words.length) return null;
  let best = null, bestScore = 0;
  CATEGORY_KEYS.forEach((key) => {
    const score = words.filter((w) => KEYWORD_MAP[key].some((entry) => keywordMatches(w, entry))).length;
    if (score > bestScore) { best = key; bestScore = score; }
  });
  return best;
}

function resolveCategory(activeCategory, keywords) {
  if (activeCategory !== "all") return activeCategory;
  return suggestCategoryFromKeywords(keywords) || pick(CATEGORY_KEYS);
}

// Palette pick: if any typed keyword matches a palette's `moods`, choose
// randomly among the matching palettes instead of fully at random —
// "smart but still varied," not "always the same brass-and-navy combo
// for every law firm."
function pickPaletteIndex(exclude, keywordsRaw) {
  const words = splitKeywords(keywordsRaw);
  if (words.length) {
    const matches = [];
    PALETTES.forEach((p, i) => {
      if (i === exclude) return;
      if (p.moods.some((m) => words.some((w) => keywordMatches(w, m)))) matches.push(i);
    });
    if (matches.length) return pick(matches);
  }
  let idx = Math.floor(Math.random() * PALETTES.length);
  let guard = 0;
  while (idx === exclude && guard++ < 5) idx = Math.floor(Math.random() * PALETTES.length);
  return idx;
}

// --- Mark geometry helpers (0–100 viewBox, center at 50,50) ---

function polygonPoints(cx, cy, r, sides, rotationDeg) {
  const rot = (rotationDeg - 90) * Math.PI / 180;
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + (i * 2 * Math.PI / sides);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

const SIDES_MAP = { triangle: 3, square: 4, diamond: 4, hex: 6 };

function shapeMarkup(kind, cx, cy, r, rotation, color, strokeOnly) {
  if (kind === "circle") {
    return strokeOnly
      ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="2.6"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
  }
  const rot = (kind === "diamond" || kind === "square") ? rotation + 45 : rotation;
  const pts = polygonPoints(cx, cy, r, SIDES_MAP[kind], rot);
  return strokeOnly
    ? `<polygon points="${pts}" fill="none" stroke="${color}" stroke-width="2.6"/>`
    : `<polygon points="${pts}" fill="${color}"/>`;
}

// Derives 1–2 monogram/badge letters from whatever the current name is
// (generated or a typed business name) — punctuation-only "words" (e.g.
// an "&" in "Smith & Co") are skipped so they never end up as a letter.
function deriveLetters(name, forceOne) {
  const words = name.trim().split(/\s+/).filter((w) => /[a-zA-Z0-9]/.test(w));
  if (!forceOne && words.length > 1 && Math.random() < 0.5) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  const w = words[0] || name;
  return w.slice(0, Math.random() < 0.3 ? Math.min(2, w.length) : 1).toUpperCase();
}

// --- Mark spec generation: pure geometry/letters/path choice, no color.
// Regenerating the mark calls this again; regenerating the palette never
// does (same spec, new renderMark() colors). ---

function generateMarkSpec(categoryKey, name) {
  switch (categoryKey) {
    case "geometric": {
      const kinds = ["circle", "triangle", "square", "diamond", "hex"];
      const count = Math.random() < 0.5 ? 2 : 3;
      const pool = kinds.slice();
      const shapes = [];
      for (let i = 0; i < count; i++) shapes.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      const jitter = shapes.map(() => ({ dx: Math.round((Math.random() - 0.5) * 14), dy: Math.round((Math.random() - 0.5) * 14) }));
      return { kind: "geometric", shapes, rotation: pick([0, 15, 30, 45, 60]), jitter, layout: "stack" };
    }
    case "monogram":
      return { kind: "monogram", letters: deriveLetters(name), container: pick(["circle", "square", "hex"]), filled: Math.random() < 0.6, layout: "stack" };
    case "badge":
      return { kind: "badge", letter: deriveLetters(name, true), layout: "stack" };
    case "line":
      return { kind: "line", pathIndex: Math.floor(Math.random() * LINE_PATH_TEMPLATES.length), mirror: Math.random() < 0.5, rotate: pick([0, 0, 0, 90, 180]), strokeRole: pick(["accent", "accent", "ink"]), layout: "stack" };
    case "negspace":
      return { kind: "negspace", dx: pick([15, -15]), dy: pick([11, -11]), layout: "stack" };
    case "wordmark":
      return { kind: "flourish", treatment: pick(["underline", "dot", "brackets", "ticks"]), layout: "stack" };
    case "combo": {
      const innerKind = pick(["geometric-single", "monogram", "line"]);
      let inner;
      if (innerKind === "monogram") {
        inner = { kind: "monogram", letters: deriveLetters(name), container: pick(["circle", "square"]), filled: Math.random() < 0.6 };
      } else if (innerKind === "line") {
        inner = { kind: "line", pathIndex: Math.floor(Math.random() * LINE_PATH_TEMPLATES.length), mirror: Math.random() < 0.5, rotate: 0, strokeRole: "accent" };
      } else {
        inner = { kind: "geometric", shapes: [pick(["circle", "triangle", "square", "diamond", "hex"])], rotation: pick([0, 15, 30, 45]), jitter: [{ dx: 0, dy: 0 }] };
      }
      return { kind: "combo", inner, layout: pick(["side", "stacked"]) };
    }
    default:
      return { kind: "geometric", shapes: ["circle"], rotation: 0, jitter: [{ dx: 0, dy: 0 }], layout: "stack" };
  }
}

// A mark "quotes" the current name when its letters are derived from it
// (monogram, badge, or a combo whose inner icon is a monogram) — same
// coupling NewCo has between name and description. Regenerating the
// wordmark when this is true also regenerates the mark spec, so the
// letters never go stale next to a name that's moved on.
function markQuotesName(categoryKey, spec) {
  if (categoryKey === "monogram" || categoryKey === "badge") return true;
  if (categoryKey === "combo" && spec && spec.inner && spec.inner.kind === "monogram") return true;
  return false;
}

// --- Rendering: spec + colors -> SVG markup for the 0–100 canvas ---

function renderGeometric(spec, ink, accent) {
  const sizes = [30, 21, 13];
  let out = "";
  spec.shapes.forEach((kind, i) => {
    const j = spec.jitter[i] || { dx: 0, dy: 0 };
    const cx = 50 + j.dx, cy = 50 + j.dy;
    if (i === 0) out += shapeMarkup(kind, cx, cy, sizes[0], spec.rotation, ink, false);
    else if (i === 1) out += shapeMarkup(kind, cx, cy, sizes[1], spec.rotation, accent, false);
    else out += shapeMarkup(kind, cx, cy, sizes[2], spec.rotation, ink, true);
  });
  return out;
}

function renderMonogram(spec, ink, accent) {
  const bg = spec.filled ? ink : "none";
  const letterColor = spec.filled ? accent : ink;
  const strokeAttr = spec.filled ? "" : ` stroke="${ink}" stroke-width="2.6"`;
  let container;
  if (spec.container === "circle") {
    container = `<circle cx="50" cy="50" r="38" fill="${bg}"${strokeAttr}/>`;
  } else if (spec.container === "square") {
    container = `<rect x="13" y="13" width="74" height="74" rx="10" fill="${bg}"${strokeAttr}/>`;
  } else {
    container = `<polygon points="${polygonPoints(50, 50, 41, 6, 0)}" fill="${bg}"${strokeAttr}/>`;
  }
  const fontSize = spec.letters.length > 1 ? 28 : 36;
  const text = `<text x="50" y="52" text-anchor="middle" dominant-baseline="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="${fontSize}" fill="${letterColor}">${spec.letters}</text>`;
  return container + text;
}

function renderBadge(spec, ink, accent) {
  return `<circle cx="50" cy="50" r="45" fill="none" stroke="${accent}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="0.4 5.4" opacity="0.85"/>` +
    `<circle cx="50" cy="50" r="37" fill="none" stroke="${ink}" stroke-width="1" opacity="0.5"/>` +
    `<circle cx="50" cy="50" r="29" fill="${ink}"/>` +
    `<text x="50" y="53" text-anchor="middle" dominant-baseline="middle" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-weight="700" font-size="26" fill="${accent}">${spec.letter}</text>` +
    `<path d="M38,76 L33,92 L45,83 Z" fill="${ink}"/>` +
    `<path d="M62,76 L67,92 L55,83 Z" fill="${ink}"/>`;
}

function renderLine(spec, ink, accent) {
  const d = LINE_PATH_TEMPLATES[spec.pathIndex];
  const color = spec.strokeRole === "accent" ? accent : ink;
  let transform = "";
  if (spec.mirror) transform += "translate(100,0) scale(-1,1) ";
  if (spec.rotate) transform += `rotate(${spec.rotate},50,50) `;
  const open = transform ? `<g transform="${transform.trim()}">` : "<g>";
  return `${open}<path d="${d}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

function renderNegspace(spec, ink, accent, bg) {
  return `<circle cx="50" cy="50" r="36" fill="${ink}"/>` +
    `<circle cx="${50 + spec.dx}" cy="${50 + spec.dy}" r="36" fill="${bg}"/>` +
    `<circle cx="${50 - spec.dx * 0.45}" cy="${50 - spec.dy * 0.45}" r="6.5" fill="${accent}"/>`;
}

function renderFlourish(spec, ink, accent) {
  switch (spec.treatment) {
    case "underline":
      return `<line x1="20" y1="62" x2="80" y2="62" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>`;
    case "dot":
      return `<circle cx="50" cy="50" r="9" fill="${accent}"/>`;
    case "brackets":
      return `<path d="M40,20 C28,20 24,35 24,50 C24,65 28,80 40,80" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>` +
        `<path d="M60,20 C72,20 76,35 76,50 C76,65 72,80 60,80" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>`;
    case "ticks":
      return `<line x1="18" y1="50" x2="32" y2="50" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>` +
        `<line x1="68" y1="50" x2="82" y2="50" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>`;
    default:
      return "";
  }
}

function renderMark(spec, ink, accent, bg) {
  switch (spec.kind) {
    case "geometric": return renderGeometric(spec, ink, accent);
    case "monogram": return renderMonogram(spec, ink, accent);
    case "badge": return renderBadge(spec, ink, accent);
    case "line": return renderLine(spec, ink, accent);
    case "negspace": return renderNegspace(spec, ink, accent, bg);
    case "flourish": return renderFlourish(spec, ink, accent);
    case "combo": return renderMark(spec.inner, ink, accent, bg);
    default: return "";
  }
}

function standaloneSVG(spec, ink, accent, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">${renderMark(spec, ink, accent, bg)}</svg>`;
}

const WORDMARK_TREATMENTS = ["treatment-tracked", "treatment-italic", "treatment-condensed", "treatment-underline", "treatment-serif"];

// --- WCAG contrast check — the accent color is the one part of a
// palette that's reused verbatim on both the light and dark swatch (see
// the CLAUDE.md note on "on light / on dark"), so it's the one worth
// checking against both backgrounds; ink/inverse-ink are fixed dark/light
// colors on a fixed opposite background and are always safely high-
// contrast by construction. ---

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function relativeLuminance({ r, g, b }) {
  const [rl, gl, bl] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(hexA, hexB) {
  const la = relativeLuminance(hexToRgb(hexA));
  const lb = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(la, lb), darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function contrastBadge(ratio) {
  if (ratio >= 4.5) return "✓ AA";
  if (ratio >= 3) return "△ AA-large";
  return "⚠ low";
}

// --- Export helpers ---

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "insignia";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Rasterizes the current mark to a PNG by loading the standalone SVG into
// an <img> and drawing it to a canvas. Text-based marks (Monogram, Badge)
// may fall back to a system font here — an <img>-loaded SVG doesn't
// reliably inherit the page's Google Fonts across browsers, and embedding
// font data just to fix that is more than this export needs.
function svgToPng(svgString, size, onDone) {
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvas.getContext("2d").drawImage(img, 0, 0, size, size);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => onDone(blob), "image/png");
  };
  img.src = url;
}

// --- localStorage helpers — wrapped in try/catch throughout since
// private-browsing / storage-blocked settings can make any of these
// throw; the app should degrade to "theme/favorites just don't persist,"
// never crash. ---

const THEME_KEY = "insignia-theme";
const FAVORITES_KEY = "insignia-favorites";

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (e) {
    return null;
  }
}

function setStoredTheme(value) {
  try {
    if (value) localStorage.setItem(THEME_KEY, value);
    else localStorage.removeItem(THEME_KEY);
  } catch (e) {
    // ignore
  }
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveFavoritesToStorage(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    // ignore — private browsing / storage blocked
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const chips = Array.from(document.querySelectorAll(".chip"));
  const categoryTag = document.getElementById("categoryTag");
  const stageContent = document.getElementById("stageContent");
  const markPrimary = document.getElementById("markPrimary");
  const markInverse = document.getElementById("markInverse");
  const wordmarkEl = document.getElementById("stageWordmark");
  const swatchInk = document.getElementById("swatchInk");
  const swatchAccent = document.getElementById("swatchAccent");
  const paletteName = document.getElementById("paletteName");
  const usageLineEl = document.getElementById("usageLine");
  const contrastLineEl = document.getElementById("contrastLine");
  const generateBtn = document.getElementById("generateBtn");
  const regenMarkBtn = document.getElementById("regenMarkBtn");
  const regenWordmarkBtn = document.getElementById("regenWordmarkBtn");
  const regenPaletteBtn = document.getElementById("regenPaletteBtn");
  const copySvgBtn = document.getElementById("copySvgBtn");
  const downloadSvgBtn = document.getElementById("downloadSvgBtn");
  const downloadPngBtn = document.getElementById("downloadPngBtn");
  const exportBtn = document.getElementById("exportBtn");
  const exportMenu = document.getElementById("exportMenu");
  const saveFavoriteBtn = document.getElementById("saveFavoriteBtn");
  const favoritesList = document.getElementById("favoritesList");
  const favoritesEmpty = document.getElementById("favoritesEmpty");
  const lockMarkBtn = document.getElementById("lockMarkBtn");
  const lockWordmarkBtn = document.getElementById("lockWordmarkBtn");
  const lockPaletteBtn = document.getElementById("lockPaletteBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const seedInput = document.getElementById("seedInput");
  const businessNameInput = document.getElementById("businessNameInput");
  const businessKeywordsInput = document.getElementById("businessKeywordsInput");
  const recentList = document.getElementById("recentList");
  const historyPrevBtn = document.getElementById("historyPrevBtn");
  const historyNextBtn = document.getElementById("historyNextBtn");

  const state = {
    activeCategory: "all",
    categoryUsed: "geometric",
    name: "",
    markSpec: null,
    wordmarkTreatment: "treatment-tracked",
    paletteIndex: 0,
    recent: [], // { name, categoryUsed, markSpec, wordmarkTreatment, paletteIndex }
    historyIndex: 0,
    favorites: loadFavorites(), // same shape as `recent` entries, persisted
    // Locks only affect Generate / a chip click (both funnel through
    // rollFresh()) — a field's own regenerate button ignores its lock,
    // since clicking it is its own explicit "change just this" signal.
    locks: { mark: false, wordmark: false, palette: false }
  };

  function getSeed() {
    const raw = seedInput.value.trim().replace(/[^a-zA-Z]/g, "").slice(0, 16);
    return raw ? cap(raw.toLowerCase()) : null;
  }

  // Sanitized to letters/digits/&/'/- , title-cased word by word, so a
  // typed business name renders like a real wordmark instead of showing
  // stray punctuation or shouting in whatever case it was typed in.
  function getBusinessName() {
    const raw = businessNameInput.value.trim().replace(/[^a-zA-Z0-9&'\- ]/g, "").slice(0, 28);
    if (!raw) return null;
    return raw.split(/\s+/).filter(Boolean).map((w) => cap(w.toLowerCase())).join(" ");
  }

  function getBusinessKeywords() {
    return businessKeywordsInput.value.trim();
  }

  function renderStage() {
    const palette = PALETTES[state.paletteIndex];
    categoryTag.textContent = CATEGORIES[state.categoryUsed].label;
    markPrimary.innerHTML = renderMark(state.markSpec, palette.ink, palette.accent, PAPER);
    markInverse.innerHTML = renderMark(state.markSpec, INVERSE_INK, palette.accent, INVERSE_BG);
    wordmarkEl.textContent = state.name;
    wordmarkEl.className = "stage-wordmark " + state.wordmarkTreatment;
    wordmarkEl.style.setProperty("--wm-accent", palette.accent);
    paletteName.textContent = palette.name;
    swatchInk.style.background = palette.ink;
    swatchAccent.style.background = palette.accent;
    usageLineEl.textContent = usageLine(state.name);
    const onLight = contrastRatio(palette.accent, PAPER);
    const onDark = contrastRatio(palette.accent, INVERSE_BG);
    contrastLineEl.textContent = `Contrast — on light ${onLight.toFixed(1)}:1 (${contrastBadge(onLight)}) · on dark ${onDark.toFixed(1)}:1 (${contrastBadge(onDark)})`;
    stageContent.classList.toggle("layout-row", !!(state.markSpec && state.markSpec.layout === "side"));
  }

  function withTransition(mutate, after) {
    stageContent.classList.add("fading");
    window.setTimeout(() => {
      mutate();
      renderStage();
      stageContent.classList.remove("fading");
      if (after) after();
    }, 160);
  }

  function renderRecent() {
    recentList.innerHTML = "";
    state.recent.forEach((entry, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "recent-chip" + (i === state.historyIndex ? " active" : "");
      btn.title = entry.name;
      btn.setAttribute("aria-label", entry.name);
      const palette = PALETTES[entry.paletteIndex];
      btn.innerHTML = `<svg viewBox="0 0 100 100">${renderMark(entry.markSpec, palette.ink, palette.accent, PAPER)}</svg>`;
      btn.addEventListener("click", () => loadRecentAt(i));
      recentList.appendChild(btn);
    });
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    historyPrevBtn.disabled = state.historyIndex >= state.recent.length - 1;
    historyNextBtn.disabled = state.historyIndex <= 0;
  }

  function loadRecentAt(i) {
    const entry = state.recent[i];
    if (!entry) return;
    withTransition(() => {
      state.historyIndex = i;
      state.categoryUsed = entry.categoryUsed;
      state.name = entry.name;
      state.markSpec = entry.markSpec;
      state.wordmarkTreatment = entry.wordmarkTreatment;
      state.paletteIndex = entry.paletteIndex;
    }, renderRecent);
  }

  function pushRecent() {
    state.recent.unshift({
      name: state.name,
      categoryUsed: state.categoryUsed,
      markSpec: state.markSpec,
      wordmarkTreatment: state.wordmarkTreatment,
      paletteIndex: state.paletteIndex
    });
    if (state.recent.length > 8) state.recent.length = 8;
    state.historyIndex = 0;
    renderRecent();
  }

  // Favorites — same entry shape as `recent`, but explicit (only added on
  // a Save click) and persisted to localStorage instead of capped at 8 by
  // a rolling window, so a result survives a reload.
  function renderFavorites() {
    favoritesList.innerHTML = "";
    favoritesEmpty.hidden = state.favorites.length > 0;
    state.favorites.forEach((entry, i) => {
      const wrap = document.createElement("div");
      wrap.className = "favorite-chip";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.title = entry.name;
      btn.setAttribute("aria-label", "Load " + entry.name);
      const palette = PALETTES[entry.paletteIndex];
      btn.innerHTML = `<svg viewBox="0 0 100 100">${renderMark(entry.markSpec, palette.ink, palette.accent, PAPER)}</svg>`;
      btn.addEventListener("click", () => loadFavoriteAt(i));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "favorite-remove";
      removeBtn.setAttribute("aria-label", "Remove " + entry.name + " from favorites");
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.favorites.splice(i, 1);
        saveFavoritesToStorage(state.favorites);
        renderFavorites();
      });

      wrap.appendChild(btn);
      wrap.appendChild(removeBtn);
      favoritesList.appendChild(wrap);
    });
  }

  function loadFavoriteAt(i) {
    const entry = state.favorites[i];
    if (!entry) return;
    withTransition(() => {
      state.categoryUsed = entry.categoryUsed;
      state.name = entry.name;
      state.markSpec = entry.markSpec;
      state.wordmarkTreatment = entry.wordmarkTreatment;
      state.paletteIndex = entry.paletteIndex;
    });
  }

  function saveFavorite() {
    state.favorites.unshift({
      name: state.name,
      categoryUsed: state.categoryUsed,
      markSpec: state.markSpec,
      wordmarkTreatment: state.wordmarkTreatment,
      paletteIndex: state.paletteIndex
    });
    if (state.favorites.length > 24) state.favorites.length = 24;
    saveFavoritesToStorage(state.favorites);
    renderFavorites();
    saveFavoriteBtn.classList.add("saved");
    setTimeout(() => saveFavoriteBtn.classList.remove("saved"), 900);
  }

  // Generate is the only action that resolves a fresh category (via the
  // keyword-aware resolveCategory) and rerolls all three fields — except
  // whichever fields are locked (see state.locks). Every regen* function
  // below deliberately reuses state.categoryUsed and only writes the
  // field(s) it owns — see markQuotesName() for the one documented
  // exception, mirroring NewCo's name/description coupling. A locked
  // field is frozen exactly as-is, including monogram/badge letters, even
  // if the (unlocked) wordmark changes underneath it — unlock it to bring
  // it back in sync.
  function rollFresh() {
    const keywords = getBusinessKeywords();
    state.categoryUsed = resolveCategory(state.activeCategory, keywords);
    if (!state.locks.wordmark) {
      state.name = resolveName(state.categoryUsed, getSeed(), getBusinessName());
      state.wordmarkTreatment = pick(WORDMARK_TREATMENTS);
    }
    if (!state.locks.mark) {
      state.markSpec = generateMarkSpec(state.categoryUsed, state.name);
    }
    if (!state.locks.palette) {
      state.paletteIndex = pickPaletteIndex(undefined, keywords);
    }
  }

  function generateFull() {
    withTransition(rollFresh, pushRecent);
  }

  function regenMark() {
    withTransition(() => {
      state.markSpec = generateMarkSpec(state.categoryUsed, state.name);
    }, pushRecent);
  }

  function regenWordmark() {
    withTransition(() => {
      state.name = resolveName(state.categoryUsed, getSeed(), getBusinessName());
      state.wordmarkTreatment = pick(WORDMARK_TREATMENTS);
      if (markQuotesName(state.categoryUsed, state.markSpec)) {
        state.markSpec = generateMarkSpec(state.categoryUsed, state.name);
      }
    }, pushRecent);
  }

  function regenPalette() {
    withTransition(() => {
      state.paletteIndex = pickPaletteIndex(state.paletteIndex, getBusinessKeywords());
    }, pushRecent);
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-checked", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-checked", "true");
      state.activeCategory = chip.dataset.category;
      generateFull();
    });
  });

  generateBtn.addEventListener("click", generateFull);
  regenMarkBtn.addEventListener("click", regenMark);
  regenWordmarkBtn.addEventListener("click", regenWordmark);
  regenPaletteBtn.addEventListener("click", regenPalette);
  historyPrevBtn.addEventListener("click", () => loadRecentAt(state.historyIndex + 1));
  historyNextBtn.addEventListener("click", () => loadRecentAt(state.historyIndex - 1));

  const lockButtons = { mark: lockMarkBtn, wordmark: lockWordmarkBtn, palette: lockPaletteBtn };
  Object.keys(lockButtons).forEach((key) => {
    lockButtons[key].addEventListener("click", () => {
      state.locks[key] = !state.locks[key];
      lockButtons[key].classList.toggle("locked", state.locks[key]);
      lockButtons[key].setAttribute("aria-pressed", String(state.locks[key]));
    });
  });

  saveFavoriteBtn.addEventListener("click", saveFavorite);

  // Export menu: one "Export ▾" button opens a small popover with the
  // three output actions, closed by an outside click, Escape, or picking
  // an item.
  function closeExportMenu() {
    exportMenu.hidden = true;
    exportBtn.setAttribute("aria-expanded", "false");
  }
  function toggleExportMenu() {
    const willOpen = exportMenu.hidden;
    exportMenu.hidden = !willOpen;
    exportBtn.setAttribute("aria-expanded", String(willOpen));
  }
  exportBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleExportMenu();
  });
  document.addEventListener("click", (e) => {
    if (!exportMenu.hidden && !exportMenu.contains(e.target) && e.target !== exportBtn) closeExportMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeExportMenu();
  });

  // The global Space/Enter shortcut below skips focused inputs on
  // purpose, so every text field needs its own Enter handler.
  [seedInput, businessNameInput, businessKeywordsInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      generateFull();
    });
  });

  copySvgBtn.addEventListener("click", () => {
    const palette = PALETTES[state.paletteIndex];
    const svg = standaloneSVG(state.markSpec, palette.ink, palette.accent, PAPER);
    navigator.clipboard.writeText(svg).then(() => {
      const original = copySvgBtn.textContent;
      copySvgBtn.textContent = "Copied";
      copySvgBtn.classList.add("copied");
      setTimeout(() => {
        copySvgBtn.textContent = original;
        copySvgBtn.classList.remove("copied");
        closeExportMenu();
      }, 900);
    });
  });

  downloadSvgBtn.addEventListener("click", () => {
    const palette = PALETTES[state.paletteIndex];
    const svg = standaloneSVG(state.markSpec, palette.ink, palette.accent, PAPER);
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `${slugify(state.name)}-mark.svg`);
    closeExportMenu();
  });

  downloadPngBtn.addEventListener("click", () => {
    const palette = PALETTES[state.paletteIndex];
    const svg = standaloneSVG(state.markSpec, palette.ink, palette.accent, PAPER);
    svgToPng(svg, 512, (blob) => downloadBlob(blob, `${slugify(state.name)}-mark.png`));
    closeExportMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space" && e.key !== "Enter") return;
    const focusedTag = document.activeElement ? document.activeElement.tagName : "";
    if (focusedTag === "BUTTON" || focusedTag === "INPUT" || focusedTag === "TEXTAREA" || focusedTag === "A") return;
    e.preventDefault();
    generateFull();
  });

  // Theme: null/absent = "follow the system" (pure CSS handles that case
  // via the @media query — nothing here needs to track it), "light"/"dark"
  // = an explicit override, cycled System -> Light -> Dark -> System. The
  // inline script in index.html's <head> already set html[data-theme]
  // before first paint if there was a stored override; this just keeps
  // the toggle button's own icon in sync with that on every load.
  function applyTheme(value) {
    if (value === "light" || value === "dark") {
      document.documentElement.setAttribute("data-theme", value);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const shown = value || "system";
    themeToggleBtn.dataset.state = shown;
    themeToggleBtn.title = `Theme: ${cap(shown)} — click to change`;
    themeToggleBtn.setAttribute("aria-label", `Theme: ${shown}. Click to change.`);
  }

  function cycleTheme() {
    const current = getStoredTheme();
    const next = current === null ? "light" : current === "light" ? "dark" : null;
    setStoredTheme(next);
    applyTheme(next);
  }

  themeToggleBtn.addEventListener("click", cycleTheme);
  applyTheme(getStoredTheme());

  rollFresh();
  renderStage();
  pushRecent();
  renderFavorites();
});
