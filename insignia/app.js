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

// Extends the same keyword intelligence already used for category/palette
// choice down into a mark's own decorative choices — a "traditional"-
// leaning business nudges toward the more ornate/textured/laurel end of
// what's already possible, a "modern"-leaning one nudges the other way.
// This never *forces* a choice, only reweights the existing dice roll
// (see rollTextureBiased() and the badge/negspace cases in
// generateMarkSpec below), and a description that matches both moods
// (or neither) just falls back to the normal unbiased odds — no
// contradictory result, and "no strong signal" stays the common case.
const TRADITIONAL_MOOD_WORDS = ["heritage", "traditional", "classic", "law", "legal", "craft", "artisan", "academy", "estate", "vintage", "established", "family"];
const MODERN_MOOD_WORDS = ["tech", "startup", "digital", "modern", "software", "app", "ai", "saas", "innovative", "cloud"];

function keywordMoodBias(keywordsRaw) {
  const words = splitKeywords(keywordsRaw);
  if (!words.length) return null;
  const traditional = words.some((w) => TRADITIONAL_MOOD_WORDS.some((m) => keywordMatches(w, m)));
  const modern = words.some((w) => MODERN_MOOD_WORDS.some((m) => keywordMatches(w, m)));
  if (traditional && !modern) return "traditional";
  if (modern && !traditional) return "modern";
  return null;
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

// Alternating outer/inner radius polygon — an ordinary regular-polygon
// point generator can't produce a star's concave points, so it gets its
// own function instead of an entry in SIDES_MAP.
function starPoints(cx, cy, rOuter, rInner, points, rotationDeg) {
  const rot = (rotationDeg - 90) * Math.PI / 180;
  const step = Math.PI / points;
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = rot + i * step;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

const SIDES_MAP = { triangle: 3, square: 4, diamond: 4, pentagon: 5, hex: 6, octagon: 8 };

// The full shape vocabulary Geometric (and Negative Space's cut shape,
// and Combo's inner icon) draw from — 9 kinds instead of the original 5,
// specifically so a fixed-size random pool doesn't start repeating
// itself as fast. Kept as one shared list rather than inlined per call
// site so adding a 10th kind later is a one-line change.
const SHAPE_KINDS = ["circle", "triangle", "square", "diamond", "pentagon", "hex", "octagon", "star", "blob"];

// A fallback for "blob" when no per-spec radii were threaded through
// (old saved specs, or a context that didn't bother) — never used for a
// freshly generated mark, just insurance against a missing value.
const DEFAULT_BLOB_RADII = [1, 0.82, 1.12, 0.88, 1.15, 0.85, 1.05, 0.9];

// Every other shape kind here is rigid straight edges — "blob" is the
// one organic kind, a closed curve through `radii.length` randomized
// points (each a 0.72–1.28 multiple of `r`) instead of a regular
// polygon. The randomization has to happen once in spec generation and
// get threaded down as `radii`, never rolled here — same rule as every
// other bit of mark randomness, since this runs again on every re-render
// (palette regenerate, theme toggle, Recent/Favorites thumbnails) and
// must draw the exact same silhouette every time.
//
// Technique: for each of the n corner points P[i], curve through it as
// a quadratic control point, landing on the midpoint between P[i] and
// P[i+1] — starting from the midpoint before P[0]. Using edge-midpoints
// as the actual path vertices (rather than the corners themselves) is
// what makes the curve pass *near* each random point without ever
// hitting a hard corner, which is what makes it read as organic instead
// of a spiky star.
function blobPath(cx, cy, r, radii, rotationDeg) {
  const n = radii.length;
  const pts = radii.map((mult, i) => {
    const angle = (rotationDeg - 90 + i * 360 / n) * Math.PI / 180;
    const rad = r * mult;
    return [cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)];
  });
  const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const mids = pts.map((p, i) => midpoint(p, pts[(i + 1) % n]));
  const fmt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  let d = `M ${fmt(mids[n - 1])} `;
  for (let i = 0; i < n; i++) d += `Q ${fmt(pts[i])} ${fmt(mids[i])} `;
  return d.trim() + " Z";
}

function generateBlobRadii(pointCount) {
  const radii = [];
  for (let i = 0; i < pointCount; i++) radii.push(0.72 + Math.random() * 0.56);
  return radii;
}

// --- Engraved/hatched fill — the actual answer to "these are just flat
// shapes." A flat-filled polygon reads as a modern icon no matter how
// many of them are on screen; a hand-engraved one (parallel or
// cross-hatched line fill instead of solid color, clipped to the shape's
// own outline) reads as detailed and print-production the moment you
// look at it, which is exactly this app's whole visual premise. Needs a
// globally-unique <clipPath> id per call — several marks (Recent chips,
// Favorites, the primary + inverse swatch of the *same* generation) can
// all be inline SVGs on the page at once, and SVG ids must be unique
// across the whole document, not just within one <svg>. ---

let hatchIdCounter = 0;

// `clipShapeMarkup` is any raw SVG shape markup (a <circle>/<polygon>/
// <rect>/<path> string) describing the region to fill — reuses whatever
// geometry the caller already has instead of needing its own shape
// vocabulary. `cross` draws a second pass at +90° for a denser weave.
function hatchedFill(clipShapeMarkup, cx, cy, color, angleDeg, spacing, cross) {
  const id = `insignia-hatch-${hatchIdCounter++}`;
  const span = 70; // generous enough to fully cover any shape on this 0–100 canvas once clipped
  let lines = "";
  for (let off = -span; off <= span; off += spacing) {
    const y = (cy + off).toFixed(1);
    lines += `<line x1="${(cx - span).toFixed(1)}" y1="${y}" x2="${(cx + span).toFixed(1)}" y2="${y}" stroke="${color}" stroke-width="0.6"/>`;
  }
  let group = `<g transform="rotate(${angleDeg} ${cx} ${cy})">${lines}</g>`;
  if (cross) group += `<g transform="rotate(${angleDeg + 90} ${cx} ${cy})">${lines}</g>`;
  return `<clipPath id="${id}">${clipShapeMarkup}</clipPath><g clip-path="url(#${id})">${group}</g>`;
}

function shapeMarkup(kind, cx, cy, r, rotation, color, strokeOnly, texture, blobRadii) {
  if (!strokeOnly && texture) {
    const outline = shapeMarkup(kind, cx, cy, r, rotation, color, false, null, blobRadii);
    // Re-run undecorated to get this shape's own outline (fill doesn't
    // matter inside a <clipPath>, only the geometry does) as the hatch's
    // clip region — cheaper than a second geometry function per kind.
    return hatchedFill(outline, cx, cy, color, texture.angle, texture.spacing, texture.cross);
  }
  if (kind === "circle") {
    return strokeOnly
      ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="2.6"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
  }
  if (kind === "blob") {
    const d = blobPath(cx, cy, r, blobRadii || DEFAULT_BLOB_RADII, rotation);
    return strokeOnly
      ? `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.6"/>`
      : `<path d="${d}" fill="${color}"/>`;
  }
  if (kind === "star") {
    const pts = starPoints(cx, cy, r, r * 0.45, 5, rotation);
    return strokeOnly
      ? `<polygon points="${pts}" fill="none" stroke="${color}" stroke-width="2.6"/>`
      : `<polygon points="${pts}" fill="${color}"/>`;
  }
  // A regular 4-gon at rotation 0 already sits point-up (diamond
  // orientation) — polygonPoints() starts its first vertex straight up.
  // Only "square" needs the +45° correction to flatten that into an
  // axis-aligned square; "diamond" is already correct as-is. (These used
  // to both get +45°, which made them render as the exact same shape —
  // fixed here since that silently cut the shape vocabulary from 8 kinds
  // to 7.)
  const rot = kind === "square" ? rotation + 45 : rotation;
  const pts = polygonPoints(cx, cy, r, SIDES_MAP[kind], rot);
  return strokeOnly
    ? `<polygon points="${pts}" fill="none" stroke="${color}" stroke-width="2.6"/>`
    : `<polygon points="${pts}" fill="${color}"/>`;
}

// `n` distinct shape kinds from `pool` — replenishes if `n` exceeds the
// pool size (never happens today at 8 kinds / max 6 needed, but cheap
// insurance against a future layout wanting more).
function pickShapesDistinct(pool, n) {
  const shapes = [];
  const bag = pool.slice();
  for (let i = 0; i < n; i++) {
    if (!bag.length) bag.push(...pool);
    shapes.push(bag.splice(Math.floor(Math.random() * bag.length), 1)[0]);
  }
  return shapes;
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

// `n` distinct values from `arr` — used for Wordmark's occasional
// 3-treatment combos (`pickDistinct(arr, 2)` covers the old always-a-pair
// behavior).
function pickDistinct(arr, n) {
  const pool = arr.slice();
  const chosen = [];
  for (let i = 0; i < n && pool.length; i++) {
    chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return chosen;
}

// Chance any given "elaborate" mark also gets the denser ornate layer —
// a second ring, more orbit dots, alternating tick marks, a third nested
// echo, depending on category. Rolled once per category case below
// rather than as one shared flag, so it reads naturally as "how much
// further to push THIS mark" per spec, not a single global toggle.
const ORNATE_CHANCE = 0.35;

// A rarer third tier, only ever possible on top of an already-ornate
// result (an "extreme" mark is always also "ornate" — there's no jump
// straight from plain to extreme). This is specifically what makes *some*
// results come out extremely detailed rather than nudging every result
// up by the same fixed amount: roughly 35% of marks are ornate, and
// roughly 40% of *those* (~14% overall) go one tier further.
const EXTREME_CHANCE = 0.4;

function rollDetail() {
  const ornate = Math.random() < ORNATE_CHANCE;
  return { ornate, extreme: ornate && Math.random() < EXTREME_CHANCE };
}

// ~20% chance of the print-misregistration effect (see applyMisprint()).
// A small offset in both axes, never zero in either direction, so the
// ghost copy is never invisible-behind-the-original.
function rollMisprint() {
  if (Math.random() >= 0.2) return null;
  return { dx: pick([-3, -2, 2, 3]), dy: pick([-3, -2, 2, 3]) };
}

// Five genuinely different ways to arrange Geometric's shapes — not just
// parameter jitter on one template. This is the single biggest lever for
// "more differentiated": a fixed layout with randomized colors/rotation
// still reads as "the same logo" after a few generations, where a
// different *arrangement algorithm* reads as a different logo outright.
const GEOMETRIC_LAYOUTS = ["layered", "layered", "radial", "scatter", "grid", "cascade"];

// A 7th "recipe" for Line Mark, alongside the 6 hand-authored
// LINE_PATH_TEMPLATES: a genuinely procedural path, so results aren't
// forever limited to 6 possible shapes. 3–5 random points, sorted
// left-to-right before connecting so it reads as a considered route
// rather than a scribble crossing over itself. Shares its exact shape
// with `{d, nodes}` from data.js so renderLine() doesn't need to know or
// care which kind it got.
function generateRandomLinePath() {
  const count = 3 + Math.floor(Math.random() * 3);
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({ x: Math.round(8 + Math.random() * 84), y: Math.round(8 + Math.random() * 84) });
  }
  points.sort((a, b) => a.x - b.x);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return { d, nodes: points.map((p) => [p.x, p.y]) };
}

// Null ~55% of the time — plain flat fill stays the more common default,
// engraved/hatched fill the "wait, how did they draw that" minority, same
// "usually restrained, sometimes a lot more" balance as ornate/extreme.
function rollTexture() {
  if (Math.random() < 0.55) return null;
  return {
    angle: pick([30, 45, 60, 120, 135, 150]),
    spacing: pick([2.5, 3, 3.5]),
    cross: Math.random() < 0.4
  };
}

// Mood-aware version — "modern" keeps things flat (hatching reads as
// hand-engraved/vintage, the opposite of what a "modern"/"tech" business
// wants), "traditional" tries the roll twice, which raises the odds of
// landing texture without ever guaranteeing it outright.
function rollTextureBiased(mood) {
  if (mood === "modern") return null;
  if (mood === "traditional") return rollTexture() || rollTexture();
  return rollTexture();
}

function generateGeometricSpec(mood) {
  const layoutKind = pick(GEOMETRIC_LAYOUTS);
  const rotation = Math.floor(Math.random() * 360);
  const { ornate, extreme } = rollDetail();
  const base = {
    kind: "geometric", layoutKind, rotation, ornate, extreme,
    ring: Math.random() < 0.55, orbitDots: Math.random() < 0.5,
    accentDominant: Math.random() < 0.35, texture: rollTextureBiased(mood),
    blobRadii: generateBlobRadii(8), misprint: rollMisprint(), layout: "stack"
  };
  if (layoutKind === "radial") {
    const count = 3 + Math.floor(Math.random() * 4); // 3–6, arranged in a ring
    return { ...base, shapes: pickShapesDistinct(SHAPE_KINDS, count), count };
  }
  if (layoutKind === "scatter") {
    const count = 3 + Math.floor(Math.random() * 3); // 3–5, spread + optionally connected
    const shapes = pickShapesDistinct(SHAPE_KINDS, count);
    const positions = shapes.map(() => ({ x: Math.round(18 + Math.random() * 64), y: Math.round(18 + Math.random() * 64) }));
    const sizes = shapes.map(() => Math.round(9 + Math.random() * 10));
    return { ...base, shapes, positions, sizes, connect: Math.random() < 0.7 };
  }
  if (layoutKind === "grid") {
    const count = Math.random() < 0.6 ? 4 : 6; // 2x2 or 3x2 lattice
    return { ...base, shapes: pickShapesDistinct(SHAPE_KINDS, count), count, cellSize: count === 6 ? 13 : 16 };
  }
  if (layoutKind === "cascade") {
    const count = 3 + Math.floor(Math.random() * 2); // 3–4, diagonal staircase
    return { ...base, shapes: pickShapesDistinct(SHAPE_KINDS, count), count, dir: pick(["up-right", "up-left"]) };
  }
  // "layered" — the original recipe: 3 shapes, decreasing size, near center
  const shapes = pickShapesDistinct(SHAPE_KINDS, 3);
  const jitter = shapes.map(() => ({ dx: Math.round((Math.random() - 0.5) * 14), dy: Math.round((Math.random() - 0.5) * 14) }));
  return { ...base, shapes, jitter };
}

function generateMarkSpec(categoryKey, name, keywordsRaw) {
  const mood = keywordMoodBias(keywordsRaw);
  switch (categoryKey) {
    case "geometric":
      return generateGeometricSpec(mood);
    case "monogram": {
      const { ornate, extreme } = rollDetail();
      return {
        kind: "monogram", letters: deriveLetters(name), container: pick(["circle", "square", "hex", "pentagon", "octagon", "star"]),
        filled: Math.random() < 0.6, innerRing: Math.random() < 0.6, accentDominant: Math.random() < 0.35,
        texture: rollTextureBiased(mood), misprint: rollMisprint(), ornate, extreme, layout: "stack"
      };
    }
    case "badge": {
      const { ornate, extreme } = rollDetail();
      // "Traditional" pushes toward the seal+laurel+hatching combination
      // this whole category is themed around in the first place;
      // "modern" pulls the other way, toward a plainer seal with no
      // ornamentation at all — still a seal, since a badge/crest concept
      // itself doesn't stop fitting a modern brand, only how ornately
      // it's rendered does.
      let laurelChance = 0.4;
      if (mood === "traditional") laurelChance = 0.65;
      else if (mood === "modern") laurelChance = 0.15;
      return {
        kind: "badge", letter: deriveLetters(name, true), containerKind: pick(["seal", "seal", "shield"]),
        accentDominant: Math.random() < 0.35, texture: rollTextureBiased(mood), laurel: Math.random() < laurelChance,
        misprint: rollMisprint(), ornate, extreme, layout: "stack"
      };
    }
    case "line": {
      const { ornate, extreme } = rollDetail();
      const useGenerated = Math.random() < 0.4;
      return {
        kind: "line",
        pathIndex: useGenerated ? null : Math.floor(Math.random() * LINE_PATH_TEMPLATES.length),
        generatedPath: useGenerated ? generateRandomLinePath() : null,
        mirror: Math.random() < 0.5, rotate: pick([0, 0, 0, 90, 180]),
        strokeRole: pick(["accent", "accent", "ink"]), ornate, extreme, layout: "stack"
      };
    }
    case "negspace": {
      const { ornate, extreme } = rollDetail();
      // The letter-cut trick is a "clever branding" move in a way the
      // plain offset-shape crescent isn't — reads as more fitting for a
      // "modern"-leaning business than a "traditional" one, so nudge
      // toward it there and away from it for "traditional."
      let letterCutChance = 0.4;
      if (mood === "modern") letterCutChance = 0.6;
      else if (mood === "traditional") letterCutChance = 0.2;
      return {
        kind: "negspace", cutKind: pick(["circle", "circle", "square", "diamond", "hex", "blob"]),
        dx: pick([15, -15]), dy: pick([11, -11]), secondDot: Math.random() < 0.5,
        letterCut: Math.random() < letterCutChance, letter: deriveLetters(name, true),
        texture: rollTextureBiased(mood), blobRadii: generateBlobRadii(8), ornate, extreme, layout: "stack"
      };
    }
    case "wordmark": {
      const count = Math.random() < 0.3 ? 3 : 2;
      const treatments = pickDistinct(["underline", "dot", "brackets", "ticks"], count);
      return { kind: "flourish", treatments, layout: "stack" };
    }
    case "combo": {
      const innerKind = pick(["geometric-single", "monogram", "line", "negspace"]);
      let inner;
      // Icon-as-letter: when the inner icon is a monogram, ~40% of the
      // time it depicts the wordmark's *actual* first character (not
      // deriveLetters()'s semi-random 1-or-2-letter pick) and the
      // wordmark text drops that same character — see the `letterFusion`
      // handling in renderStage(). This is the honest version of "fuse
      // the icon into the word": the icon and text are two separate DOM
      // elements (an SVG canvas, a block of HTML text) with independent
      // sizing, so it can't be pixel-perfect custom typography the way a
      // real logo would hand-draw it — but "Insignia" rendered as [a
      // graphic I] + "nsignia", tight together, reads as one lockup
      // rather than an icon that happens to sit next to unrelated text.
      let letterFusion = false;
      if (innerKind === "monogram") {
        letterFusion = Math.random() < 0.4;
        const letters = letterFusion ? name.trim().charAt(0).toUpperCase() : deriveLetters(name);
        inner = { kind: "monogram", letters, container: pick(["circle", "square"]), filled: Math.random() < 0.6 };
      } else if (innerKind === "line") {
        inner = { kind: "line", pathIndex: Math.floor(Math.random() * LINE_PATH_TEMPLATES.length), generatedPath: null, mirror: Math.random() < 0.5, rotate: 0, strokeRole: "accent" };
      } else if (innerKind === "negspace") {
        inner = { kind: "negspace", cutKind: pick(["circle", "square"]), dx: pick([15, -15]), dy: pick([11, -11]), secondDot: false };
      } else {
        inner = { kind: "geometric", layoutKind: "layered", shapes: [pick(SHAPE_KINDS)], rotation: pick([0, 15, 30, 45]), jitter: [{ dx: 0, dy: 0 }], blobRadii: generateBlobRadii(8) };
      }
      // Fusion only reads as intended in the side-by-side layout —
      // stacked (icon above text) would just look like a mismatched
      // monogram sitting on top of a name missing its first letter.
      return { kind: "combo", inner, letterFusion, layout: letterFusion ? "side" : pick(["side", "stacked"]) };
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
  // Negative Space only quotes the name when this particular result rolled
  // the letter-cut variant — the plain offset-shape crescent doesn't
  // reference the name at all, so a wordmark reroll shouldn't force a
  // pointless mark reroll for those results.
  if (categoryKey === "negspace" && spec && spec.letterCut) return true;
  if (categoryKey === "combo" && spec && spec.inner && spec.inner.kind === "monogram") return true;
  return false;
}

// --- Rendering: spec + colors -> SVG markup for the 0–100 canvas ---
//
// Every renderer takes a trailing `elaborate` flag. `undefined` (the
// default, when a caller doesn't pass one) means "yes, draw the extra
// detail layers" — only an explicit `false` turns them off. renderMark()
// forces `false` when it recurses into a "combo" spec's inner icon, so a
// combination mark's icon stays compact next to its wordmark instead of
// getting as busy as a standalone mark; every other caller (the main
// stage, Recent/Favorites thumbnails, SVG/PNG export) just omits the
// argument and gets the full version.

// Five shape-arrangement algorithms for Geometric, dispatched by
// spec.layoutKind. Each is a pure function of the spec — any randomness
// (which positions, how many shapes) was already rolled once in
// generateGeometricSpec() and stored on the spec, never rolled here,
// since these run again on every re-render (theme toggle, palette
// regenerate, Recent/Favorites thumbnails) and must draw the exact same
// shapes every time, only recolored.

// `spec.accentDominant` swaps which color plays the "large/first" role
// vs the "secondary" role — every layout below resolves that through c1
// (dominant) / c2 (secondary) rather than reading `ink`/`accent`
// directly, so a mark can just as easily read as "mostly the bright
// accent color, ink as a small pop" as the reverse. Real perceptual
// variety, not just shape variety: two marks with the same layout and
// palette can still look like different results.

function renderLayeredShapes(spec, ink, accent) {
  const c1 = spec.accentDominant ? accent : ink;
  const c2 = spec.accentDominant ? ink : accent;
  const sizes = [30, 21, 13];
  let out = "";
  spec.shapes.forEach((kind, i) => {
    const j = spec.jitter[i] || { dx: 0, dy: 0 };
    const cx = 50 + j.dx, cy = 50 + j.dy;
    if (i === 0) out += shapeMarkup(kind, cx, cy, sizes[0], spec.rotation, c1, false, spec.texture, spec.blobRadii);
    else if (i === 1) out += shapeMarkup(kind, cx, cy, sizes[1], spec.rotation, c2, false, spec.texture, spec.blobRadii);
    else out += shapeMarkup(kind, cx, cy, sizes[2], spec.rotation, c1, true, null, spec.blobRadii);
  });
  return out;
}

function renderRadialShapes(spec, ink, accent) {
  const c1 = spec.accentDominant ? accent : ink;
  const c2 = spec.accentDominant ? ink : accent;
  let out = "";
  const n = spec.count;
  for (let i = 0; i < n; i++) {
    const deg = spec.rotation + (i * 360 / n);
    const rad = (deg - 90) * Math.PI / 180;
    // Numbers, not .toFixed() strings — shapeMarkup() feeds these into
    // polygonPoints()/starPoints() for anything but a circle, which does
    // real arithmetic (cx + r*cos(a)) on them. A stringified cx/cy works
    // fine for a circle (template-string interpolation doesn't care) but
    // silently breaks every polygon shape via string concatenation
    // instead of addition — caught by generating a few hundred radial
    // marks headlessly and finding `.toFixed is not a function` on
    // whatever `cx + r*cos(a)` had concatenated into a string.
    const cx = 50 + 28 * Math.cos(rad);
    const cy = 50 + 28 * Math.sin(rad);
    out += shapeMarkup(spec.shapes[i], cx, cy, 13, deg, i % 2 === 0 ? c1 : c2, false, spec.texture, spec.blobRadii);
  }
  out += shapeMarkup("circle", 50, 50, 7, 0, n % 2 === 0 ? c2 : c1, false, spec.texture);
  return out;
}

function renderScatterShapes(spec, ink, accent) {
  const c1 = spec.accentDominant ? accent : ink;
  const c2 = spec.accentDominant ? ink : accent;
  let out = "";
  const pts = spec.positions;
  if (spec.connect) {
    for (let i = 0; i < pts.length - 1; i++) {
      out += `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[i + 1].x}" y2="${pts[i + 1].y}" stroke="${c1}" stroke-width="0.7" opacity="0.35"/>`;
    }
  }
  pts.forEach((p, i) => {
    out += shapeMarkup(spec.shapes[i], p.x, p.y, spec.sizes[i], spec.rotation, i % 2 === 0 ? c1 : c2, i === pts.length - 1, spec.texture, spec.blobRadii);
  });
  return out;
}

function gridPositions(count) {
  const xs = count === 6 ? [28, 50, 72] : [34, 66];
  const ys = [34, 66];
  const pts = [];
  ys.forEach((y) => xs.forEach((x) => pts.push({ x, y })));
  return pts;
}

function renderGridShapes(spec, ink, accent) {
  const c1 = spec.accentDominant ? accent : ink;
  const c2 = spec.accentDominant ? ink : accent;
  let out = "";
  gridPositions(spec.count).forEach((p, i) => {
    out += shapeMarkup(spec.shapes[i], p.x, p.y, spec.cellSize, spec.rotation, i % 2 === 0 ? c1 : c2, false, spec.texture, spec.blobRadii);
  });
  return out;
}

function cascadePositions(count, dir) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0;
    const x = dir === "up-right" ? 25 + t * 50 : 75 - t * 50;
    pts.push({ x: Math.round(x), y: Math.round(75 - t * 50) });
  }
  return pts;
}

function renderCascadeShapes(spec, ink, accent) {
  const c1 = spec.accentDominant ? accent : ink;
  const c2 = spec.accentDominant ? ink : accent;
  let out = "";
  const positions = cascadePositions(spec.count, spec.dir);
  const sizes = [22, 17, 13, 10];
  positions.forEach((p, i) => {
    out += shapeMarkup(spec.shapes[i], p.x, p.y, sizes[i], spec.rotation, i % 2 === 0 ? c1 : c2, i === positions.length - 1, spec.texture, spec.blobRadii);
  });
  return out;
}

function renderGeometric(spec, ink, accent, elaborate) {
  const detailed = elaborate !== false;
  // Missing on any spec saved before layoutKind existed — falls back to
  // the original (and still most common) recipe, not a crash.
  const layoutKind = spec.layoutKind || "layered";
  let out = "";
  if (detailed && spec.ring) {
    out += `<circle cx="50" cy="50" r="45" fill="none" stroke="${ink}" stroke-width="1" opacity="0.3"/>`;
    if (spec.ornate) out += `<circle cx="50" cy="50" r="40" fill="none" stroke="${accent}" stroke-width="0.8" opacity="0.35"/>`;
  }
  if (layoutKind === "radial") out += renderRadialShapes(spec, ink, accent);
  else if (layoutKind === "scatter") out += renderScatterShapes(spec, ink, accent);
  else if (layoutKind === "grid") out += renderGridShapes(spec, ink, accent);
  else if (layoutKind === "cascade") out += renderCascadeShapes(spec, ink, accent);
  else out += renderLayeredShapes(spec, ink, accent);
  if (detailed && spec.orbitDots) {
    const angles = spec.ornate ? [0, 45, 90, 135, 180, 225, 270, 315] : [0, 120, 240];
    angles.forEach((deg) => {
      const rad = (deg - 90) * Math.PI / 180;
      const dx = (50 + 47 * Math.cos(rad)).toFixed(1);
      const dy = (50 + 47 * Math.sin(rad)).toFixed(1);
      out += `<circle cx="${dx}" cy="${dy}" r="2.4" fill="${accent}"/>`;
      if (spec.ornate) {
        const ix = (50 + 31 * Math.cos(rad)).toFixed(1), iy = (50 + 31 * Math.sin(rad)).toFixed(1);
        out += `<line x1="${ix}" y1="${iy}" x2="${dx}" y2="${dy}" stroke="${ink}" stroke-width="0.6" opacity="0.3"/>`;
      }
    });
  }
  if (detailed && spec.extreme) {
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg - 90) * Math.PI / 180;
      const x1 = (50 + 47.5 * Math.cos(rad)).toFixed(1), y1 = (50 + 47.5 * Math.sin(rad)).toFixed(1);
      const x2 = (50 + 49.5 * Math.cos(rad)).toFixed(1), y2 = (50 + 49.5 * Math.sin(rad)).toFixed(1);
      out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="0.5" opacity="0.35"/>`;
    }
  }
  return out;
}

function renderMonogram(spec, ink, accent, elaborate) {
  const c1 = spec.accentDominant ? accent : ink;
  const c2 = spec.accentDominant ? ink : accent;
  const bg = spec.filled ? c1 : "none";
  const letterColor = spec.filled ? c2 : c1;
  const strokeAttr = spec.filled ? "" : ` stroke="${c1}" stroke-width="2.6"`;
  const detailed = elaborate !== false;
  const useTexture = spec.filled && spec.texture; // hatching replaces a flat fill — nothing to hatch when unfilled
  let container, inset = "", outer = "";
  const insetColor = spec.filled ? c2 : c1;
  if (spec.container === "circle") {
    container = useTexture
      ? hatchedFill(`<circle cx="50" cy="50" r="38"/>`, 50, 50, c1, spec.texture.angle, spec.texture.spacing, spec.texture.cross)
      : `<circle cx="50" cy="50" r="38" fill="${bg}"${strokeAttr}/>`;
    if (detailed && spec.innerRing) inset = `<circle cx="50" cy="50" r="32" fill="none" stroke="${insetColor}" stroke-width="1" opacity="0.55"/>`;
    if (detailed && spec.ornate) outer = `<circle cx="50" cy="50" r="43" fill="none" stroke="${c2}" stroke-width="0.8" opacity="0.4"/>`;
  } else if (spec.container === "square") {
    container = useTexture
      ? hatchedFill(`<rect x="13" y="13" width="74" height="74" rx="10"/>`, 50, 50, c1, spec.texture.angle, spec.texture.spacing, spec.texture.cross)
      : `<rect x="13" y="13" width="74" height="74" rx="10" fill="${bg}"${strokeAttr}/>`;
    if (detailed && spec.innerRing) inset = `<rect x="19" y="19" width="62" height="62" rx="7" fill="none" stroke="${insetColor}" stroke-width="1" opacity="0.55"/>`;
    if (detailed && spec.ornate) outer = `<rect x="9" y="9" width="82" height="82" rx="12" fill="none" stroke="${c2}" stroke-width="0.8" opacity="0.4"/>`;
  } else if (spec.container === "star") {
    container = useTexture
      ? hatchedFill(`<polygon points="${starPoints(50, 50, 41, 20, 5, 0)}"/>`, 50, 50, c1, spec.texture.angle, spec.texture.spacing, spec.texture.cross)
      : `<polygon points="${starPoints(50, 50, 41, 20, 5, 0)}" fill="${bg}"${strokeAttr}/>`;
    if (detailed && spec.innerRing) inset = `<polygon points="${starPoints(50, 50, 34, 16, 5, 0)}" fill="none" stroke="${insetColor}" stroke-width="1" opacity="0.55"/>`;
    if (detailed && spec.ornate) outer = `<circle cx="50" cy="50" r="46" fill="none" stroke="${c2}" stroke-width="0.8" opacity="0.4"/>`;
  } else {
    const sides = { pentagon: 5, hex: 6, octagon: 8 }[spec.container] || 6;
    container = useTexture
      ? hatchedFill(`<polygon points="${polygonPoints(50, 50, 41, sides, 0)}"/>`, 50, 50, c1, spec.texture.angle, spec.texture.spacing, spec.texture.cross)
      : `<polygon points="${polygonPoints(50, 50, 41, sides, 0)}" fill="${bg}"${strokeAttr}/>`;
    if (detailed && spec.innerRing) inset = `<polygon points="${polygonPoints(50, 50, 34, sides, 0)}" fill="none" stroke="${insetColor}" stroke-width="1" opacity="0.55"/>`;
    if (detailed && spec.ornate) outer = `<polygon points="${polygonPoints(50, 50, 46, sides, 0)}" fill="none" stroke="${c2}" stroke-width="0.8" opacity="0.4"/>`;
  }
  let ticks = "";
  if (detailed && spec.ornate) {
    [0, 90, 180, 270].forEach((deg) => {
      const rad = (deg - 90) * Math.PI / 180;
      const x1 = (50 + 48 * Math.cos(rad)).toFixed(1), y1 = (50 + 48 * Math.sin(rad)).toFixed(1);
      const x2 = (50 + 53 * Math.cos(rad)).toFixed(1), y2 = (50 + 53 * Math.sin(rad)).toFixed(1);
      ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c1}" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>`;
    });
    if (spec.extreme) {
      [45, 135, 225, 315].forEach((deg) => {
        const rad = (deg - 90) * Math.PI / 180;
        const x1 = (50 + 49 * Math.cos(rad)).toFixed(1), y1 = (50 + 49 * Math.sin(rad)).toFixed(1);
        const x2 = (50 + 52 * Math.cos(rad)).toFixed(1), y2 = (50 + 52 * Math.sin(rad)).toFixed(1);
        ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c2}" stroke-width="1" stroke-linecap="round" opacity="0.45"/>`;
      });
    }
  }
  const fontSize = spec.letters.length > 1 ? 28 : 36;
  const text = `<text x="50" y="52" text-anchor="middle" dominant-baseline="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="${fontSize}" fill="${letterColor}">${spec.letters}</text>`;
  return outer + container + inset + ticks + text;
}

// A heraldic shield silhouette — a genuinely different container from
// the seal's concentric circles, not just a parameter change on it. Two
// paths: the outline and a slightly inset copy (same technique as the
// seal's middle ring / the line marks' nested echoes) so the shield gets
// a visible double-line frame instead of one bare outline.
const SHIELD_PATH = "M50,7 L84,19 L84,52 C84,75 68,91 50,97 C32,91 16,75 16,52 L16,19 Z";
const SHIELD_PATH_INSET = "M50,14 L78,24 L78,51 C78,69 65,82 50,87 C35,82 22,69 22,51 L22,24 Z";

// A real laurel wreath, not another ring: ~10 small leaf ellipses along
// the outside of each side of the seal, sweeping from lower-side to
// upper-side (220°→320° on the left, its mirror 140°→40° on the right,
// in this file's clockwise-from-top angle convention — see the tick-mark
// loops above for the same convention). This is "more detail" in the
// sense the user actually meant: a genuinely different kind of element
// (many small individually-placed shapes), not more rings/dots stacked
// on the same three circles.
function renderLaurel(color) {
  let out = "";
  const leafCount = 5;
  for (let i = 0; i < leafCount; i++) {
    const t = i / (leafCount - 1);
    const degLeft = 220 + t * 100;
    const degRight = 360 - degLeft;
    [degLeft, degRight].forEach((deg) => {
      const rad = (deg - 90) * Math.PI / 180;
      const r = 47 + Math.sin(t * Math.PI) * 2.5; // slight outward bulge at the midpoint of the sweep
      const x = (50 + r * Math.cos(rad)).toFixed(1);
      const y = (50 + r * Math.sin(rad)).toFixed(1);
      const leafAngle = (deg + 90).toFixed(1);
      out += `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="1.5" transform="rotate(${leafAngle} ${x} ${y})" fill="${color}" opacity="0.82"/>`;
    });
  }
  return out;
}

function renderBadgeSeal(spec, ink, accent, detailed) {
  const c1 = spec.accentDominant ? accent : ink;
  const c2 = spec.accentDominant ? ink : accent;
  let ticks = "";
  if (detailed) {
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg - 90) * Math.PI / 180;
      const x1 = (50 + 39.5 * Math.cos(rad)).toFixed(1), y1 = (50 + 39.5 * Math.sin(rad)).toFixed(1);
      const x2 = (50 + 43 * Math.cos(rad)).toFixed(1), y2 = (50 + 43 * Math.sin(rad)).toFixed(1);
      ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c1}" stroke-width="1" opacity="0.4"/>`;
    }
    if (spec.ornate) {
      for (let deg = 15; deg < 360; deg += 30) {
        const rad = (deg - 90) * Math.PI / 180;
        const x1 = (50 + 40.5 * Math.cos(rad)).toFixed(1), y1 = (50 + 40.5 * Math.sin(rad)).toFixed(1);
        const x2 = (50 + 43 * Math.cos(rad)).toFixed(1), y2 = (50 + 43 * Math.sin(rad)).toFixed(1);
        ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c1}" stroke-width="0.6" opacity="0.3"/>`;
      }
      [0, 90, 180, 270].forEach((deg) => {
        const rad = (deg - 90) * Math.PI / 180;
        const dx = (50 + 49 * Math.cos(rad)).toFixed(1), dy = (50 + 49 * Math.sin(rad)).toFixed(1);
        ticks += `<circle cx="${dx}" cy="${dy}" r="1.8" fill="${c2}"/>`;
      });
      if (spec.extreme) {
        for (let deg = 7.5; deg < 360; deg += 15) {
          const rad = (deg - 90) * Math.PI / 180;
          const x1 = (50 + 41.5 * Math.cos(rad)).toFixed(1), y1 = (50 + 41.5 * Math.sin(rad)).toFixed(1);
          const x2 = (50 + 43 * Math.cos(rad)).toFixed(1), y2 = (50 + 43 * Math.sin(rad)).toFixed(1);
          ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c2}" stroke-width="0.5" opacity="0.3"/>`;
        }
      }
    }
  }
  const innerFill = spec.texture
    ? hatchedFill(`<circle cx="50" cy="50" r="29"/>`, 50, 50, c1, spec.texture.angle, spec.texture.spacing, spec.texture.cross)
    : `<circle cx="50" cy="50" r="29" fill="${c1}"/>`;
  const laurel = detailed && spec.laurel ? renderLaurel(c2) : "";
  return `<circle cx="50" cy="50" r="45" fill="none" stroke="${c2}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="0.4 5.4" opacity="0.85"/>` +
    ticks + laurel +
    `<circle cx="50" cy="50" r="37" fill="none" stroke="${c1}" stroke-width="1" opacity="0.5"/>` +
    innerFill +
    `<text x="50" y="53" text-anchor="middle" dominant-baseline="middle" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-weight="700" font-size="26" fill="${c2}">${spec.letter}</text>` +
    `<path d="M38,76 L33,92 L45,83 Z" fill="${c1}"/>` +
    `<path d="M62,76 L67,92 L55,83 Z" fill="${c1}"/>`;
}

function renderBadgeShield(spec, ink, accent, detailed) {
  const c1 = spec.accentDominant ? accent : ink;
  const c2 = spec.accentDominant ? ink : accent;
  const insetStroke = detailed && spec.ornate ? ` stroke="${c2}" stroke-width="0.8" opacity="0.9"` : "";
  const rule = detailed && spec.ornate ? `<line x1="30" y1="60" x2="70" y2="60" stroke="${c2}" stroke-width="1" opacity="0.5"/>` : "";
  const doubleRule = detailed && spec.extreme ? `<line x1="26" y1="68" x2="74" y2="68" stroke="${c2}" stroke-width="0.6" opacity="0.4"/>` : "";
  const inset = spec.texture
    ? hatchedFill(`<path d="${SHIELD_PATH_INSET}"/>`, 50, 50, c1, spec.texture.angle, spec.texture.spacing, spec.texture.cross) +
      (insetStroke ? `<path d="${SHIELD_PATH_INSET}" fill="none"${insetStroke}/>` : "")
    : `<path d="${SHIELD_PATH_INSET}" fill="${c1}"${insetStroke}/>`;
  return `<path d="${SHIELD_PATH}" fill="none" stroke="${c2}" stroke-width="2.2" opacity="0.85"/>` +
    inset +
    `<text x="50" y="46" text-anchor="middle" dominant-baseline="middle" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-weight="700" font-size="24" fill="${c2}">${spec.letter}</text>` +
    rule + doubleRule;
}

function renderBadge(spec, ink, accent, elaborate) {
  const detailed = elaborate !== false;
  return spec.containerKind === "shield"
    ? renderBadgeShield(spec, ink, accent, detailed)
    : renderBadgeSeal(spec, ink, accent, detailed);
}

function renderLine(spec, ink, accent, elaborate) {
  const tmpl = spec.generatedPath || LINE_PATH_TEMPLATES[spec.pathIndex];
  const color = spec.strokeRole === "accent" ? accent : ink;
  const echoColor = spec.strokeRole === "accent" ? ink : accent;
  let transform = "";
  if (spec.mirror) transform += "translate(100,0) scale(-1,1) ";
  if (spec.rotate) transform += `rotate(${spec.rotate},50,50) `;
  let out = transform ? `<g transform="${transform.trim()}">` : "<g>";
  const detailed = elaborate !== false;
  if (detailed) {
    out += `<g transform="translate(50,50) scale(0.55) translate(-50,-50)" opacity="0.4"><path d="${tmpl.d}" fill="none" stroke="${echoColor}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    if (spec.ornate) {
      out += `<g transform="translate(50,50) scale(0.3) translate(-50,-50)" opacity="0.28"><path d="${tmpl.d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      if (spec.extreme) {
        out += `<g transform="translate(50,50) scale(0.16) translate(-50,-50)" opacity="0.22"><path d="${tmpl.d}" fill="none" stroke="${echoColor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      }
    }
  }
  out += `<path d="${tmpl.d}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (detailed) {
    tmpl.nodes.forEach(([nx, ny]) => {
      out += `<circle cx="${nx}" cy="${ny}" r="3.4" fill="${echoColor}"/>`;
      if (spec.ornate) out += `<circle cx="${nx}" cy="${ny}" r="6" fill="none" stroke="${echoColor}" stroke-width="0.7" opacity="0.5"/>`;
    });
  }
  return out + "</g>";
}

// A different negative-space technique from the offset-shape crescent
// below: cut the business's actual initial *out* of a filled circle via
// an SVG <mask> (white = visible, black = cut away — the letter is drawn
// in black, so it becomes a hole showing whatever's behind, i.e. the
// canvas color) instead of a generic shape-on-shape offset. This is the
// FedEx-arrow style trick — the mark and the name are no longer
// independent, which nothing else in this file does. Needs the same
// globally-unique-id discipline as hatchedFill()'s <clipPath>, just its
// own counter so "insignia-mask-N" ids never collide with
// "insignia-hatch-N" ones even at the same N.
let maskIdCounter = 0;

function renderNegspaceLetter(spec, ink, accent, elaborate) {
  const detailed = elaborate !== false;
  const id = `insignia-mask-${maskIdCounter++}`;
  let out = `<mask id="${id}"><rect x="0" y="0" width="100" height="100" fill="white"/>` +
    `<text x="50" y="60" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="58" fill="black">${spec.letter}</text></mask>` +
    `<circle cx="50" cy="50" r="40" fill="${ink}" mask="url(#${id})"/>`;
  if (detailed) {
    out += `<circle cx="50" cy="50" r="45" fill="none" stroke="${ink}" stroke-width="1" opacity="0.3"/>`;
    if (spec.ornate) {
      out += `<circle cx="50" cy="50" r="48" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.4 4.6" opacity="0.6"/>`;
    }
  }
  const dotX = 50 + spec.dx * 0.85, dotY = 50 + spec.dy * 0.85;
  out += `<circle cx="${dotX}" cy="${dotY}" r="5.5" fill="${accent}"/>`;
  if (detailed && spec.ornate && spec.extreme) {
    out += `<circle cx="${50 - spec.dx * 0.85}" cy="${50 - spec.dy * 0.85}" r="3" fill="${accent}" opacity="0.5"/>`;
  }
  return out;
}

function renderNegspace(spec, ink, accent, bg, elaborate) {
  if (spec.letterCut) return renderNegspaceLetter(spec, ink, accent, elaborate);
  const detailed = elaborate !== false;
  const cutKind = spec.cutKind || "circle";
  // Only the base shape can be textured — the cutout has to stay a flat
  // solid fill exactly matching the canvas color, or the negative-space
  // illusion breaks (hatching would let the "erased" region show through
  // as a pattern instead of reading as empty background).
  let out = shapeMarkup(cutKind, 50, 50, 36, 0, ink, false, spec.texture, spec.blobRadii) +
    shapeMarkup(cutKind, 50 + spec.dx, 50 + spec.dy, 36, 0, bg, false);
  if (detailed) {
    out += `<circle cx="50" cy="50" r="43" fill="none" stroke="${ink}" stroke-width="1" opacity="0.3"/>`;
    if (spec.ornate) {
      out += `<circle cx="50" cy="50" r="47" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.4 4.6" opacity="0.6"/>`;
    }
  }
  const dotX = 50 - spec.dx * 0.45, dotY = 50 - spec.dy * 0.45;
  const dot2X = 50 - spec.dx * 0.9, dot2Y = 50 - spec.dy * 0.9;
  out += `<circle cx="${dotX}" cy="${dotY}" r="6.5" fill="${accent}"/>`;
  if (detailed && spec.secondDot) {
    out += `<circle cx="${dot2X}" cy="${dot2Y}" r="3.2" fill="${accent}" opacity="0.6"/>`;
  }
  if (detailed && spec.ornate) {
    out += `<circle cx="${(dotX + dot2X) / 2}" cy="${(dotY + dot2Y) / 2}" r="2" fill="${accent}" opacity="0.45"/>`;
    if (spec.extreme) {
      out += `<circle cx="${50 - spec.dx * 1.3}" cy="${50 - spec.dy * 1.3}" r="1.5" fill="${accent}" opacity="0.3"/>`;
    }
  }
  return out;
}

function renderFlourishPart(treatment, ink, accent) {
  switch (treatment) {
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

// Renders both of the spec's two distinct treatments together (e.g.
// underline + dot) — Wordmark is the one category built around having no
// icon at all, so it stays deliberately lighter-touch than the others
// even at its most detailed, rather than growing a full icon to match.
function renderFlourish(spec, ink, accent) {
  // Favorites persist to localStorage, so a spec saved before treatments
  // became an array can still show up here with the old singular
  // `spec.treatment` — fall back to it instead of crashing on `.map`.
  const treatments = spec.treatments || (spec.treatment ? [spec.treatment] : []);
  return treatments.map((t) => renderFlourishPart(t, ink, accent)).join("");
}

// Vintage print-misregistration effect: a faded, offset echo of the same
// mark sitting just behind the real one, like a badge stamped slightly
// off-register. `renderFn` gets called *twice* rather than reusing one
// rendered string, on purpose — anything textured/letter-cut generates
// its own globally-unique <clipPath>/<mask> id per call (see
// hatchedFill()/renderNegspaceLetter()), and reusing the same rendered
// string twice would paste that id into the document twice, which is
// invalid SVG. Re-invoking the renderer gives the ghost copy its own
// fresh ids instead. Only wired into Geometric/Monogram/Badge — Line's
// already-layered echoes and Negative Space's exact-match cutout
// technique don't need or suit a second offset copy.
function applyMisprint(spec, elaborate, renderFn) {
  const body = renderFn();
  if (elaborate === false || !spec.misprint) return body;
  const ghost = renderFn();
  return `<g transform="translate(${spec.misprint.dx},${spec.misprint.dy})" opacity="0.4">${ghost}</g>` + body;
}

function renderMark(spec, ink, accent, bg, elaborate) {
  switch (spec.kind) {
    case "geometric": return applyMisprint(spec, elaborate, () => renderGeometric(spec, ink, accent, elaborate));
    case "monogram": return applyMisprint(spec, elaborate, () => renderMonogram(spec, ink, accent, elaborate));
    case "badge": return applyMisprint(spec, elaborate, () => renderBadge(spec, ink, accent, elaborate));
    case "line": return renderLine(spec, ink, accent, elaborate);
    case "negspace": return renderNegspace(spec, ink, accent, bg, elaborate);
    case "flourish": return renderFlourish(spec, ink, accent);
    case "combo": return renderMark(spec.inner, ink, accent, bg, false);
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

// --- Wordmark color — the biggest, most eye-catching element on the
// stage was, until now, always the app's own neutral --ink theme color,
// completely untied to the generated palette. Every mark-level variety
// added above this could double and it would still read as "the same
// logo" at a glance, because the one thing your eye lands on first never
// changed. Fixed by coloring the wordmark from the palette itself,
// occasionally in the accent color outright for real punch — gated by
// the same contrast math the contrast-line readout already uses, so an
// accent that wouldn't read well as hero-sized text just doesn't get
// picked for that role. ---

const STAGE_PAPER_LIGHT = "#fffdf8"; // must match style.css's light --paper-elevated
const STAGE_PAPER_DARK = "#1c1f27"; // must match style.css's dark --paper-elevated

function isAppDarkMode() {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "dark") return true;
  if (explicit === "light") return false;
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

// "ink" role still means "whatever's readable against the stage card in
// the app's CURRENT theme" (mirrors how a generated mark's own ink flips
// between the light and dark swatch) — palette.ink in light mode,
// INVERSE_INK in dark mode, since palette.ink is only ever designed to
// read against a light surface.
function wordmarkInkColor(paletteInk) {
  return isAppDarkMode() ? INVERSE_INK : paletteInk;
}

function pickWordmarkColorRole(accentHex) {
  const stageBg = isAppDarkMode() ? STAGE_PAPER_DARK : STAGE_PAPER_LIGHT;
  const accentReadable = contrastRatio(accentHex, stageBg) >= 3;
  return accentReadable && Math.random() < 0.35 ? "accent" : "ink";
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
  const hexInk = document.getElementById("hexInk");
  const hexAccent = document.getElementById("hexAccent");
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
  const themeToggleLabel = document.getElementById("themeToggleLabel");
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
    wordmarkColorRole: "ink",
    paletteIndex: 0,
    recent: [], // { name, categoryUsed, markSpec, wordmarkTreatment, wordmarkColorRole, paletteIndex }
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
    // Letter-fusion combos drop their first character from the visible
    // wordmark text — the monogram icon depicts it instead. Every other
    // reference to the brand (usage line, hex codes, Recent/Favorites
    // tooltips) still uses the full state.name; only this one element's
    // displayed text is shortened.
    const isFusion = !!(state.markSpec && state.markSpec.kind === "combo" && state.markSpec.letterFusion);
    wordmarkEl.textContent = isFusion ? state.name.slice(1) : state.name;
    wordmarkEl.className = "stage-wordmark " + state.wordmarkTreatment;
    // Text and its own underline/rule never share a color — whichever
    // role the text didn't take becomes the rule color, so the
    // treatment-underline rule stays visible under accent-colored text
    // instead of nearly vanishing into it.
    const inkColor = wordmarkInkColor(palette.ink);
    const isAccentText = state.wordmarkColorRole === "accent";
    wordmarkEl.style.color = isAccentText ? palette.accent : inkColor;
    wordmarkEl.style.setProperty("--wm-accent", isAccentText ? inkColor : palette.accent);
    paletteName.textContent = palette.name;
    swatchInk.style.background = palette.ink;
    swatchAccent.style.background = palette.accent;
    hexInk.textContent = palette.ink.toUpperCase();
    hexAccent.textContent = palette.accent.toUpperCase();
    usageLineEl.textContent = usageLine(state.name);
    const onLight = contrastRatio(palette.accent, PAPER);
    const onDark = contrastRatio(palette.accent, INVERSE_BG);
    contrastLineEl.textContent = `Contrast — on light ${onLight.toFixed(1)}:1 (${contrastBadge(onLight)}) · on dark ${onDark.toFixed(1)}:1 (${contrastBadge(onDark)})`;
    stageContent.classList.toggle("layout-row", !!(state.markSpec && state.markSpec.layout === "side"));
    stageContent.classList.toggle("fusion", isFusion);
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
      state.wordmarkColorRole = entry.wordmarkColorRole || "ink"; // pre-existing entries predate this field
      state.paletteIndex = entry.paletteIndex;
    }, renderRecent);
  }

  function pushRecent() {
    state.recent.unshift({
      name: state.name,
      categoryUsed: state.categoryUsed,
      markSpec: state.markSpec,
      wordmarkTreatment: state.wordmarkTreatment,
      wordmarkColorRole: state.wordmarkColorRole,
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
      state.wordmarkColorRole = entry.wordmarkColorRole || "ink"; // pre-existing entries predate this field
      state.paletteIndex = entry.paletteIndex;
    });
  }

  function saveFavorite() {
    state.favorites.unshift({
      name: state.name,
      categoryUsed: state.categoryUsed,
      markSpec: state.markSpec,
      wordmarkTreatment: state.wordmarkTreatment,
      wordmarkColorRole: state.wordmarkColorRole,
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
    // Palette resolves before wordmark now (used to be the other way
    // round) — wordmarkColorRole needs this generation's *final* accent
    // to decide whether accent-colored text would even be readable.
    // Palette resolution never depends on name/mark, so reordering it
    // earlier is free.
    if (!state.locks.palette) {
      state.paletteIndex = pickPaletteIndex(undefined, keywords);
    }
    if (!state.locks.wordmark) {
      state.name = resolveName(state.categoryUsed, getSeed(), getBusinessName());
      state.wordmarkTreatment = pick(WORDMARK_TREATMENTS);
      state.wordmarkColorRole = pickWordmarkColorRole(PALETTES[state.paletteIndex].accent);
    }
    if (!state.locks.mark) {
      state.markSpec = generateMarkSpec(state.categoryUsed, state.name, keywords);
    }
  }

  function generateFull() {
    withTransition(rollFresh, pushRecent);
  }

  function regenMark() {
    withTransition(() => {
      state.markSpec = generateMarkSpec(state.categoryUsed, state.name, getBusinessKeywords());
    }, pushRecent);
  }

  function regenWordmark() {
    withTransition(() => {
      state.name = resolveName(state.categoryUsed, getSeed(), getBusinessName());
      state.wordmarkTreatment = pick(WORDMARK_TREATMENTS);
      state.wordmarkColorRole = pickWordmarkColorRole(PALETTES[state.paletteIndex].accent);
      if (markQuotesName(state.categoryUsed, state.markSpec)) {
        state.markSpec = generateMarkSpec(state.categoryUsed, state.name, getBusinessKeywords());
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
    themeToggleLabel.textContent = shown === "system" ? "Auto" : cap(shown);
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
