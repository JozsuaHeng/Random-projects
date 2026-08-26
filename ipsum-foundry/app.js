// Each theme supplies four small word banks (noun/adj/verb/interj).
// A single shared TEMPLATES list turns those into full sentences —
// grammatically real, but structurally generic and non-narrative on
// purpose, so filling in absurd/unrelated words never accidentally
// reads as a real thing someone said (the classic "corporate
// bullshit generator" trick: correct grammar, empty of meaning).
const THEMES = {
  // The real thing. Unlike every other theme, this doesn't go through
  // TEMPLATES at all — genuine Lorem Ipsum isn't grammatical English
  // with Latin nouns swapped in, it's just scrambled pseudo-Latin word
  // salad. buildSentence() special-cases any theme with a flat `words`
  // array (no `banks`) and comma-strings words together instead of
  // filling a sentence template. This is the default theme on load.
  classic: {
    opener: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    words: ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"],
  },
  pirate: {
    opener: "Arrr, gather round the mast, ye scurvy dogs, and lend an ear.",
    banks: {
      noun: ["treasure", "doubloons", "rum", "cannon", "parrot", "plank", "compass", "anchor", "shipmate", "cutlass", "map", "chest", "tavern", "tide", "mutiny", "gold", "high seas", "crow's nest", "davy jones' locker", "black market", "tortuga", "kraken", "jolly roger", "bilge rat", "sea shanty", "barnacle"],
      adj: ["scurvy", "salty", "cursed", "briny", "plundered", "weathered", "mighty", "rusty"],
      verb: ["plunder", "hoist", "swab", "sail", "pillage", "navigate", "brawl", "drink"],
      interj: ["Arrr", "Shiver me timbers", "Yo ho", "Avast", "Blimey"],
    },
  },
  corporate: {
    opener: "Let's circle back and unpack this deep dive before we double-click into the details.",
    banks: {
      noun: ["synergy", "bandwidth", "roadmap", "deliverable", "stakeholder", "pipeline", "ecosystem", "headcount", "framework", "runway", "cadence", "takeaway", "boardroom", "org chart", "offsite", "all-hands", "low-hanging fruit", "north star", "quick win", "growth hacking"],
      adj: ["scalable", "agile", "actionable", "cross-functional", "data-driven", "best-in-class", "forward-thinking", "lean"],
      verb: ["leverage", "streamline", "optimize", "unpack", "operationalize", "socialize", "pivot", "disrupt"],
      interj: ["Let's circle back", "Per my last email", "Quick gut-check", "Just thinking out loud", "Noting for the group"],
    },
  },
  shakespeare: {
    opener: "Hark, gentle reader, lend thine ear unto this humble discourse.",
    banks: {
      noun: ["heart", "fortune", "dagger", "crown", "sorrow", "jest", "kin", "oath", "moon", "stage", "folly", "virtue", "yonder court", "moonlit garden", "castle wall", "tempest's edge", "fortune's fool", "sound and fury"],
      adj: ["fair", "cruel", "wretched", "noble", "feigned", "tempestuous", "sweet", "treacherous"],
      verb: ["wander", "tremble", "perish", "weep", "triumph", "conspire", "linger", "burn"],
      interj: ["Hark", "Alas", "Prithee", "Forsooth", "Good my lord"],
    },
  },
  hacker: {
    opener: "System check: decrypting the mainframe before the firewall reboots.",
    banks: {
      noun: ["mainframe", "firewall", "payload", "protocol", "node", "exploit", "uplink", "terminal", "cipher", "backdoor", "grid", "subnet", "darknet", "mainframe core", "black server", "network edge", "zero-day", "botnet"],
      adj: ["encrypted", "corrupted", "untraceable", "bleeding-edge", "quantum", "offline", "rogue", "patched"],
      verb: ["decrypt", "breach", "reroute", "spoof", "compile", "inject", "ping", "overwrite"],
      interj: ["System check", "Warning", "Access granted", "Incoming transmission", "Signal detected"],
    },
  },
  noir: {
    opener: "The rain hadn't stopped since Tuesday, and neither had the questions.",
    banks: {
      noun: ["dame", "alibi", "cigarette", "revolver", "shadow", "rain", "informant", "motive", "blackmail", "taxi", "whiskey", "secret", "docks", "smoky bar", "precinct", "back alley", "cold case", "wire tap"],
      adj: ["crooked", "restless", "two-faced", "dim", "dangerous", "weary", "cold", "unspoken"],
      verb: ["tail", "interrogate", "vanish", "lie", "confess", "double-cross", "disappear", "whisper"],
      interj: ["Trouble walked in", "Something didn't add up", "The city never sleeps", "I should've known", "Nobody talks"],
    },
  },
  wizard: {
    opener: "Hearken, apprentice, for the ancient runes speak only to the patient.",
    banks: {
      noun: ["rune", "grimoire", "spell", "potion", "relic", "familiar", "ley line", "incantation", "staff", "ember", "prophecy", "ward", "hidden grove", "astral plane", "sunken library", "old ruins", "dragon's hoard", "elder magic"],
      adj: ["ancient", "forbidden", "enchanted", "arcane", "sacred", "cursed", "shimmering", "unstable"],
      verb: ["conjure", "bind", "unravel", "awaken", "enchant", "banish", "summon", "whisper"],
      interj: ["Hearken", "By the old gods", "The runes have spoken", "Mark this well", "A warning, apprentice"],
    },
  },
  cowboy: {
    opener: "Well now, pull up a stool, partner, and let me spin you a yarn.",
    banks: {
      noun: ["saloon", "horizon", "six-shooter", "cattle", "dust", "sheriff", "outlaw", "canyon", "campfire", "spurs", "trail", "bounty", "frontier", "dead man's gulch", "ranch", "badlands", "wanted poster", "gold rush"],
      adj: ["dusty", "lawless", "weathered", "ornery", "rowdy", "sun-scorched", "quiet", "restless"],
      verb: ["ride", "wrangle", "holster", "drift", "gallop", "outrun", "settle", "lasso"],
      interj: ["Well now", "Reckon so", "Hold your horses", "Yeehaw", "That there's trouble"],
    },
  },
  surfer: {
    opener: "Dude, check it — the swell's rollin' in and the vibes are immaculate.",
    banks: {
      noun: ["wave", "board", "swell", "reef", "tide", "sunset", "barrel", "wax", "lineup", "breeze", "shoreline", "vibe", "point break", "boardwalk", "pier", "shore break", "tide pool"],
      adj: ["gnarly", "chill", "epic", "mellow", "glassy", "radical", "salty", "righteous"],
      verb: ["shred", "paddle", "catch", "wax", "cruise", "hang", "kick", "tube"],
      interj: ["Dude", "No way", "Check it", "Totally", "Right on"],
    },
  },
  valleygirl: {
    opener: "Okay so like, this is literally the most iconic thing that has ever happened to me, no cap.",
    banks: {
      noun: ["mall", "drama", "bestie", "vibe", "group chat", "receipts", "tea", "situationship", "aesthetic", "playlist", "fit check", "red flag", "green flag", "main character moment", "glow-up", "hot take"],
      adj: ["iconic", "unhinged", "extra", "lowkey", "cringe", "valid", "toxic", "chaotic"],
      verb: ["spill", "vibe", "ghost", "flex", "stan", "cancel", "gatekeep", "manifest"],
      interj: ["Like", "Oh my gosh", "No cap", "I can't even", "Literally"],
    },
  },
  knight: {
    opener: "By my honor, I ride forth to defend the realm, whatever peril awaits.",
    banks: {
      noun: ["honor", "quest", "steed", "banner", "joust", "castle", "chalice", "oath", "dragon", "shield", "tournament", "liege", "round table", "drawbridge", "suit of armor"],
      adj: ["valiant", "noble", "sworn", "steadfast", "gallant", "honorable", "fearsome", "unyielding"],
      verb: ["joust", "defend", "pledge", "vanquish", "kneel", "ride", "forge", "uphold"],
      interj: ["By my honor", "Hear ye", "For king and country", "Upon my oath", "Onward"],
    },
  },
  conspiracy: {
    opener: "Wake up sheeple — the truth is out there, and they don't want you to find it.",
    banks: {
      noun: ["government cover-up", "tinfoil hat", "deep state", "chemtrail", "lizard person", "secret society", "mainstream media", "hidden agenda", "black helicopter", "encrypted file", "whistleblower", "shadow government", "moon landing", "illuminati"],
      adj: ["classified", "suppressed", "unverified", "redacted", "alleged", "coded", "shadowy", "unexplained"],
      verb: ["expose", "decode", "question", "investigate", "uncover", "suppress", "leak", "connect"],
      interj: ["Wake up sheeple", "They don't want you to know this", "Do your own research", "Follow the money", "Open your eyes"],
    },
  },
  infomercial: {
    opener: "But wait, there's more — call now, because operators are standing by for a limited time only.",
    banks: {
      noun: ["limited time offer", "bonus gift", "money-back guarantee", "operator", "toll-free number", "easy payment plan", "miracle formula", "as-seen-on-tv gadget", "satisfaction guarantee", "free shipping", "exclusive deal", "lifetime warranty", "bundle", "breakthrough"],
      adj: ["revolutionary", "unbeatable", "incredible", "risk-free", "exclusive", "amazing", "discounted", "life-changing"],
      verb: ["order", "upgrade", "call", "unlock", "save", "bundle", "guarantee", "unbox"],
      interj: ["But wait, there's more", "Call now", "Operators are standing by", "Act fast", "Don't miss out"],
    },
  },
  drillsergeant: {
    opener: "Drop and give me twenty — there's no excuses on my watch, recruit.",
    banks: {
      noun: ["push-up", "boot camp", "drill", "formation", "chain of command", "barracks", "obstacle course", "rucksack", "inspection", "cadence", "dog tag", "mess hall", "discipline"],
      adj: ["relentless", "disciplined", "squared-away", "unacceptable", "regulation", "battle-ready", "merciless", "sharp"],
      verb: ["march", "drop", "report", "salute", "endure", "execute", "mobilize", "discipline"],
      interj: ["Drop and give me twenty", "Move it", "Sound off", "Is that clear", "No excuses"],
    },
  },
  fortuneteller: {
    opener: "The stars have spoken, and your destiny is written in the cosmic alignment above.",
    banks: {
      noun: ["crystal ball", "tarot card", "star chart", "destiny", "aura", "cosmic alignment", "palm reading", "third eye", "zodiac", "spirit guide", "fate line", "moon phase", "tea leaves", "omen"],
      adj: ["mystical", "cosmic", "fated", "celestial", "veiled", "prophetic", "ancient", "luminous"],
      verb: ["foresee", "divine", "align", "channel", "reveal", "manifest", "interpret", "awaken"],
      interj: ["The stars have spoken", "I sense a presence", "Trust the universe", "Your aura tells me", "The cards do not lie"],
    },
  },
};

// Shared across every theme. Deliberately generic/structural — no
// scene-setting or cause-and-effect between clauses — so plugging in
// unrelated words never accidentally reads as a coherent statement.
const TEMPLATES = [
  "{interj}, {noun} is nothing without {noun}.",
  "A {adj} {noun} always outlasts a {adj} {noun}.",
  "First you {verb} the {noun}, then you {verb} the {noun}.",
  "Nobody {verb3s} a {noun} quite like we do.",
  "Between {noun} and {noun}, only the {adj} survive.",
  "You can't {verb} a {noun} without a little {noun}.",
  "{interj} — the {adj} {noun} waits for no one.",
  "Some {verb} for the {noun}; others simply {verb}.",
  "There's no {noun} quite as {adj} as a {adj} {noun}.",
  "We {verb} the {noun}, we {verb} the {noun}, and still the {adj} {noun} remains.",
  "Why does the {noun} always {verb} when nobody's looking?",
  "{interj}! A {noun} just {verb3s} straight through the {adj} {noun}.",
  "If the {noun} could {verb}, it absolutely would.",
  "The {noun} does not care about the {adj} {noun}, and frankly, neither do we.",
  "{interj}? More like a {adj} {noun}.",
  "Legend says the {noun} shall {verb} again before the {noun} does.",
  "It's not about the {noun}; it's about the {adj} {noun} inside us all.",
  "{noun}, {noun}, {noun} — that's all anyone talks about anymore.",
];

const UNIT_DEFAULTS = {
  paragraphs: { value: 8, min: 1, max: 12, step: 1 },
  sentences: { value: 8, min: 1, max: 40, step: 1 },
  words: { value: 80, min: 10, max: 300, step: 10 },
};

const state = {
  theme: "classic",
  unit: "paragraphs",
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Third-person-singular conjugation ("catch" -> "catches"), needed
// because {verb3s} sits directly after "Nobody" in a template.
function conjugate3ps(verb) {
  if (/([sxz]|[cs]h)$/.test(verb)) return verb + "es";
  if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + "ies";
  return verb + "s";
}

function buildSentence(theme) {
  // Classic Lorem Ipsum: comma-strung pseudo-Latin, no sentence grammar.
  if (theme.words) {
    const n = randInt(4, 8);
    const parts = [];
    for (let i = 0; i < n; i++) parts.push(pick(theme.words));
    return capitalize(parts.join(", ") + ".");
  }

  const tmpl = pick(TEMPLATES);
  let filled = tmpl.replace(/\{(\w+)\}/g, (_, key) => {
    if (key === "verb3s") return conjugate3ps(pick(theme.banks.verb));
    return pick(theme.banks[key]);
  });
  // "a" -> "an" whenever it lands right before a vowel-led word, since
  // slots get filled after the article is already written in the template.
  filled = filled.replace(/\b([aA])(\s+)(?=[aeiouAEIOU])/g, (_, aWord, space) => (aWord === "A" ? "An" : "an") + space);
  return capitalize(filled);
}

function buildParagraphs(themeKey, unit, count, useOpener) {
  const theme = THEMES[themeKey];
  const paragraphs = [];

  if (unit === "paragraphs") {
    for (let p = 0; p < count; p++) {
      const sentenceCount = randInt(3, 5);
      const sentences = [];
      for (let i = 0; i < sentenceCount; i++) {
        sentences.push(p === 0 && i === 0 && useOpener ? theme.opener : buildSentence(theme));
      }
      paragraphs.push(sentences.join(" "));
    }
    return paragraphs;
  }

  // "sentences" and "words" both build one running list of sentences,
  // then chunk it into paragraphs of 4 for readability.
  const sentences = [];
  if (unit === "sentences") {
    for (let i = 0; i < count; i++) {
      sentences.push(i === 0 && useOpener ? theme.opener : buildSentence(theme));
    }
  } else {
    let wordCount = 0;
    let i = 0;
    while (wordCount < count && i < 500) {
      const s = i === 0 && useOpener ? theme.opener : buildSentence(theme);
      sentences.push(s);
      wordCount += s.split(/\s+/).length;
      i++;
    }
  }

  const chunkSize = 4;
  for (let i = 0; i < sentences.length; i += chunkSize) {
    paragraphs.push(sentences.slice(i, i + chunkSize).join(" "));
  }
  return paragraphs;
}

function render() {
  const count = Number(document.getElementById("countInput").value);
  const useOpener = document.getElementById("openerCheck").checked;
  const paragraphs = buildParagraphs(state.theme, state.unit, count, useOpener);

  const output = document.getElementById("output");
  output.innerHTML = "";
  paragraphs.forEach((text, idx) => {
    const p = document.createElement("p");
    if (idx === 0) p.className = "drop-cap";
    p.textContent = text;
    output.appendChild(p);
  });

  const fullText = paragraphs.join(" ");
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const charCount = fullText.length;
  document.getElementById("outputStat").textContent = `${wordCount.toLocaleString()} words · ${charCount.toLocaleString()} characters · ${paragraphs.length} paragraph${paragraphs.length === 1 ? "" : "s"}`;

  // A concise status announcement for screen readers, kept separate from
  // #output so assistive tech doesn't re-read the whole manuscript on
  // every tweak — it only hears a short summary of what changed.
  document.getElementById("liveStatus").textContent = `Generated ${wordCount} words of ${state.theme} text.`;
}

function surpriseMe() {
  const keys = Object.keys(THEMES).filter((key) => key !== state.theme);
  setTheme(pick(keys));
  render();
}

function downloadText() {
  const text = document.getElementById("output").innerText;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ipsum-foundry-${state.theme}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function setUnit(unit) {
  state.unit = unit;
  document.querySelectorAll(".unit-btn").forEach((btn) => {
    const active = btn.dataset.unit === unit;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-checked", String(active));
  });
  const defaults = UNIT_DEFAULTS[unit];
  const input = document.getElementById("countInput");
  input.min = defaults.min;
  input.max = defaults.max;
  input.step = defaults.step;
  input.value = defaults.value;
}

function setTheme(themeKey) {
  state.theme = themeKey;
  document.querySelectorAll(".theme-card").forEach((card) => {
    const active = card.dataset.theme === themeKey;
    card.setAttribute("aria-checked", String(active));
  });
}

function clampCount() {
  const input = document.getElementById("countInput");
  const min = Number(input.min);
  const max = Number(input.max);
  let value = Number(input.value) || min;
  value = Math.min(max, Math.max(min, value));
  input.value = value;
}

// The initial mode (saved choice, else OS preference) is applied by an
// inline script in <head> so there's no flash of the wrong theme before
// this file loads. This just handles the manual toggle from then on.
function applyMode(mode) {
  document.documentElement.setAttribute("data-mode", mode);
  localStorage.setItem("ipsumFoundryMode", mode);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".theme-card").forEach((card) => {
    card.addEventListener("click", () => {
      setTheme(card.dataset.theme);
      render();
    });
  });

  document.querySelectorAll(".unit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setUnit(btn.dataset.unit);
      render();
    });
  });

  const countInput = document.getElementById("countInput");
  document.getElementById("stepDown").addEventListener("click", () => {
    countInput.value = Number(countInput.value) - Number(countInput.step);
    clampCount();
    render();
  });
  document.getElementById("stepUp").addEventListener("click", () => {
    countInput.value = Number(countInput.value) + Number(countInput.step);
    clampCount();
    render();
  });
  countInput.addEventListener("change", () => {
    clampCount();
    render();
  });

  document.getElementById("openerCheck").addEventListener("change", render);
  document.getElementById("generateBtn").addEventListener("click", render);
  document.getElementById("surpriseBtn").addEventListener("click", surpriseMe);
  document.getElementById("downloadBtn").addEventListener("click", downloadText);

  document.getElementById("modeToggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-mode");
    applyMode(current === "dark" ? "light" : "dark");
  });

  const aboutDialog = document.getElementById("aboutDialog");
  document.getElementById("aboutBtn").addEventListener("click", () => aboutDialog.showModal());
  document.getElementById("aboutClose").addEventListener("click", () => aboutDialog.close());
  aboutDialog.addEventListener("click", (e) => {
    if (e.target === aboutDialog) aboutDialog.close();
  });

  const copyBtn = document.getElementById("copyBtn");
  const copyLabel = document.getElementById("copyLabel");
  copyBtn.addEventListener("click", () => {
    const text = document.getElementById("output").innerText;
    navigator.clipboard.writeText(text).then(() => {
      copyLabel.textContent = "Copied";
      setTimeout(() => {
        copyLabel.textContent = "Copy";
      }, 1500);
    });
  });

  render();
});
