// NewCo — startup name & tagline generator. Logic only; word banks live in data.js.

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Like pick(), but rerolls (a few times, then gives up) to avoid handing
// back the same value as `exclude` — used wherever two picks from the
// same list need to read as two distinct things (two investors, etc).
function distinctPick(arr, exclude) {
  let val = pick(arr);
  let guard = 0;
  while (val === exclude && guard++ < 5) val = pick(arr);
  return val;
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Mimics the real "drop a vowel" naming pattern (Flickr, Tumblr, Scribd):
// removes the last vowel that isn't the first letter of the word.
function lastVowelDrop(word) {
  const vowels = "aeiouAEIOU";
  for (let i = word.length - 1; i >= 1; i--) {
    if (vowels.includes(word[i])) {
      return word.slice(0, i) + word.slice(i + 1);
    }
  }
  return word;
}

function suffixify(root) {
  return root + pick(NAME_SUFFIXES);
}

function twoWordName(root) {
  return root + " " + pick(TECH_WORDS);
}

function portmanteau(a, b) {
  const headLen = Math.max(2, Math.round(a.length * 0.6));
  const head = a.slice(0, headLen);
  const tailStart = Math.max(1, Math.round(b.length * 0.4));
  let tail = b.slice(tailStart) || b.slice(-2);
  tail = tail.charAt(0).toLowerCase() + tail.slice(1);
  return head + tail;
}

function adjectiveRoot(root, adjective) {
  return `${cap(adjective)} ${root}`;
}

function compoundRoots(a, b) {
  return `${a} ${b}`;
}

function theRoot(root) {
  return `The ${root}`;
}

function ampersandRoots(a, b) {
  return `${a} & ${b}`;
}

// Two distinct roots picked from the same category — used by every
// recipe below that needs a *pair* of words instead of just one.
function distinctRootPair(roots) {
  const a = pick(roots);
  let b = pick(roots);
  let guard = 0;
  while (b === a && guard++ < 5) b = pick(roots);
  return [a, b];
}

// If a seed word was typed in, it's folded into the root pool with extra
// weight (4 duplicate entries) so it shows up in a meaningful fraction of
// results without swamping every single one — every existing recipe just
// works on this pool unchanged, no special-casing needed downstream.
function effectiveRoots(bank, seed) {
  return seed ? bank.roots.concat(Array(4).fill(seed)) : bank.roots;
}

// Nine recipes, weighted so about two-thirds of results are multi-word
// names (adjective+root, root+root, "The X", "X & Y", root+tech word)
// rather than a single mangled word every time.
function generateName(categoryKey, seed) {
  const bank = CATEGORIES[categoryKey];
  const roots = effectiveRoots(bank, seed);
  const roll = Math.random();
  if (roll < 0.10) return pick(roots);
  if (roll < 0.25) return lastVowelDrop(pick(roots));
  if (roll < 0.40) return suffixify(pick(roots));
  if (roll < 0.55) return twoWordName(pick(roots));
  if (roll < 0.70) {
    const [a, b] = distinctRootPair(roots);
    return portmanteau(a, b);
  }
  if (roll < 0.80) return adjectiveRoot(pick(roots), pick(bank.adjectives));
  if (roll < 0.90) {
    const [a, b] = distinctRootPair(roots);
    return compoundRoots(a, b);
  }
  if (roll < 0.96) return theRoot(pick(roots));
  const [a, b] = distinctRootPair(roots);
  return ampersandRoots(a, b);
}

function generateTagline(categoryKey) {
  const bank = CATEGORIES[categoryKey];
  return pick(TAGLINE_TEMPLATES)(bank);
}

// "Customers" are just other names from the same category's generator,
// one recursive call removed — cheap way to get plausible-looking company
// names for the DETAIL templates to namedrop instead of only citing a
// bare count. No seed word here: folding the user's own typed-in word
// into a *namedropped customer* would read as a strange coincidence.
function generateDescription(categoryKey, name) {
  const bank = CATEGORIES[categoryKey];
  const opener = pick(DESCRIPTION_OPENERS)(bank, name);
  const customer1 = generateName(categoryKey);
  let customer2 = generateName(categoryKey);
  let guard = 0;
  while (customer2 === customer1 && guard++ < 3) customer2 = generateName(categoryKey);
  const investor1 = pick(INVESTOR_FIRMS);
  const investor2 = distinctPick(INVESTOR_FIRMS, investor1);
  const extra = { customer1, customer2, investor1, investor2 };
  const detail = pick(DESCRIPTION_DETAILS)(bank, name, extra);
  return `${opener} ${detail}`;
}

function domainLine(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${base}.com — taken &middot; ${base}.io — available`;
}

// "All" picks a fresh random category — only Generate (a full reroll)
// calls this. The three per-field regenerate actions always reuse
// `categoryUsed` directly instead, never calling this at all: they
// touch exactly one field and leave the rest as they are, so jumping
// to a new random vertical mid-field-reroll would strand the untouched
// fields with a mismatched category.
function resolveCategory(activeCategory) {
  return activeCategory === "all" ? pick(CATEGORY_KEYS) : activeCategory;
}

document.addEventListener("DOMContentLoaded", () => {
  const chips = Array.from(document.querySelectorAll(".chip"));
  const categoryTag = document.getElementById("categoryTag");
  const stageContent = document.getElementById("stageContent");
  const stageName = document.getElementById("stageName");
  const stageTagline = document.getElementById("stageTagline");
  const stageDescription = document.getElementById("stageDescription");
  const stageDomain = document.getElementById("stageDomain");
  const generateBtn = document.getElementById("generateBtn");
  const regenNameBtn = document.getElementById("regenNameBtn");
  const regenTaglineBtn = document.getElementById("regenTaglineBtn");
  const regenDescriptionBtn = document.getElementById("regenDescriptionBtn");
  const copyBtn = document.getElementById("copyBtn");
  const seedInput = document.getElementById("seedInput");
  const recentList = document.getElementById("recentList");
  const historyPrevBtn = document.getElementById("historyPrevBtn");
  const historyNextBtn = document.getElementById("historyNextBtn");

  const state = {
    activeCategory: "all",
    categoryUsed: "fintech",
    name: "",
    tagline: "",
    description: "",
    recent: [], // { name, tagline, description, categoryUsed }
    historyIndex: 0 // position into `recent` currently on stage; 0 = newest
  };

  // Sanitized to letters only, capped short, Title Case — so a typed
  // seed reads like every other root word instead of standing out as
  // obviously user input.
  function getSeed() {
    const raw = seedInput.value.trim().replace(/[^a-zA-Z]/g, "").slice(0, 16);
    return raw ? cap(raw.toLowerCase()) : null;
  }

  function renderStage() {
    categoryTag.textContent = CATEGORIES[state.categoryUsed].label;
    stageName.textContent = state.name;
    stageTagline.textContent = state.tagline;
    stageDescription.textContent = state.description;
    stageDomain.innerHTML = domainLine(state.name);
  }

  // Fades the whole stage out, applies the mutation, re-renders, fades
  // back in — so a reroll reads as a considered swap instead of a snap.
  // `after` (if given) runs once the new state is live, e.g. pushing it
  // to history — it has to happen after `mutate`, not before, since
  // `mutate` itself is deferred until the fade-out finishes.
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
      btn.textContent = entry.name;
      btn.addEventListener("click", () => loadRecentAt(i));
      recentList.appendChild(btn);
    });
    updateHistoryButtons();
  }

  // ◀ moves toward older entries (higher index), ▶ toward newer ones
  // (lower index, 0 = newest) — same relationship as browser back/forward.
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
      state.tagline = entry.tagline;
      state.description = entry.description;
    }, renderRecent);
  }

  function pushRecent() {
    state.recent.unshift({ name: state.name, tagline: state.tagline, description: state.description, categoryUsed: state.categoryUsed });
    if (state.recent.length > 8) state.recent.length = 8;
    state.historyIndex = 0;
    renderRecent();
  }

  // Generate is the only action that touches every field and picks a
  // fresh category (respecting "All"'s random pick). Every other action
  // below — the three per-field regenerate icons — deliberately reuses
  // `state.categoryUsed` and only ever writes the one field it owns
  // (plus description, when name changes — see regenName), so nothing
  // it doesn't touch ever changes. That "leave everything else alone by
  // default" behavior is the entire interaction model now; there's no
  // separate pin/lock concept to opt into it.
  function rollFresh() {
    state.categoryUsed = resolveCategory(state.activeCategory);
    state.name = generateName(state.categoryUsed, getSeed());
    state.tagline = generateTagline(state.categoryUsed);
    state.description = generateDescription(state.categoryUsed, state.name);
  }

  function generateFull() {
    withTransition(rollFresh, pushRecent);
  }

  // Description literally quotes the name in its sentences, so it isn't
  // really an independent field once name changes — regenerating name
  // without also refreshing description would leave the paragraph
  // quoting a company that's no longer the one in the title above it.
  // Tagline never mentions the name, so it's untouched here.
  function regenName() {
    withTransition(() => {
      state.name = generateName(state.categoryUsed, getSeed());
      state.description = generateDescription(state.categoryUsed, state.name);
    }, pushRecent);
  }

  function regenTagline() {
    withTransition(() => {
      state.tagline = generateTagline(state.categoryUsed);
    }, pushRecent);
  }

  function regenDescription() {
    withTransition(() => {
      state.description = generateDescription(state.categoryUsed, state.name);
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
  regenNameBtn.addEventListener("click", regenName);
  regenTaglineBtn.addEventListener("click", regenTagline);
  regenDescriptionBtn.addEventListener("click", regenDescription);
  historyPrevBtn.addEventListener("click", () => loadRecentAt(state.historyIndex + 1));
  historyNextBtn.addEventListener("click", () => loadRecentAt(state.historyIndex - 1));

  // The global Space/Enter shortcut below skips focused inputs on
  // purpose, so the seed field needs its own Enter handler.
  seedInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    generateFull();
  });

  copyBtn.addEventListener("click", () => {
    const text = `${state.name} — ${state.tagline}\n${state.description}`;
    navigator.clipboard.writeText(text).then(() => {
      const original = copyBtn.textContent;
      copyBtn.textContent = "Copied";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = original;
        copyBtn.classList.remove("copied");
      }, 1500);
    });
  });

  // Spacebar/Enter triggers Generate — but only when nothing else has
  // focus, so it doesn't double-fire on top of a focused button's own
  // native space/enter activation (e.g. a chip or the Copy button).
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space" && e.key !== "Enter") return;
    const focusedTag = document.activeElement ? document.activeElement.tagName : "";
    if (focusedTag === "BUTTON" || focusedTag === "INPUT" || focusedTag === "TEXTAREA" || focusedTag === "A") return;
    e.preventDefault();
    generateFull();
  });

  // Populate the stage directly on first load — no fade-out-then-in for
  // content that was never visible yet.
  rollFresh();
  renderStage();
  pushRecent();
});
