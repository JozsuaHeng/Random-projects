import { WORD_BANKS, AUTHORS, COMMENT_TEMPLATES, ROAST_LINES } from "./data.js";

export function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomWordFor(bank) {
  return randomFrom(WORD_BANKS[bank]);
}

// Fills every blank in a template with a random word from its bank.
export function randomizeValues(template) {
  const values = {};
  for (const blank of template.blanks) {
    values[blank.key] = randomWordFor(blank.bank);
  }
  return values;
}

// Splits a template's text into an ordered list of segments -- plain text
// and filled-in blanks (each tagged with its bank, or null for unknown keys)
// -- so the UI can wrap individual blanks (for buzzword highlighting /
// jargon translation) without re-parsing the template itself.
export function fillSegments(template, values) {
  const blankByKey = Object.fromEntries(template.blanks.map((b) => [b.key, b]));
  const parts = template.text.split(/{{(\w+)}}/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return { type: "text", value: part };
    const blank = blankByKey[part];
    const value = (values[part] || "").trim() || "___";
    return { type: "blank", value, bank: blank ? blank.bank : null };
  });
}

// Replaces {{key}} placeholders in the template text with the given values.
// Any blank left empty falls back to "___" so an unfinished mad-lib still renders.
export function fillTemplate(template, values) {
  return fillSegments(template, values)
    .map((s) => s.value)
    .join("");
}

export function randomAuthor() {
  return randomFrom(AUTHORS);
}

// Picks `count` distinct commenters (never the post's own author) and a
// random comment line for each, filling any {{buzz}} / {{n}} placeholders.
export function fakeComments(count, excludeName) {
  const pool = AUTHORS.filter((a) => a.name !== excludeName);
  const commenters = [];
  const used = new Set();
  while (commenters.length < count && commenters.length < pool.length) {
    const candidate = randomFrom(pool);
    if (used.has(candidate.name)) continue;
    used.add(candidate.name);
    commenters.push(candidate);
  }
  return commenters.map((author) => {
    const text = randomFrom(COMMENT_TEMPLATES)
      .replace("{{buzz}}", randomWordFor("BUZZWORD"))
      .replace("{{n}}", Math.floor(50 + Math.random() * 400));
    return { author, text };
  });
}

export function randomRoastLine() {
  return randomFrom(ROAST_LINES);
}

// Counts how many filled-in words came straight from the BUZZWORD bank,
// as a fraction of total blanks. Purely for the joke "audit" panel.
export function buzzwordDensity(template, values) {
  const buzzBlanks = template.blanks.filter((b) => b.bank === "BUZZWORD");
  if (buzzBlanks.length === 0) return 0;
  const used = buzzBlanks.filter((b) =>
    WORD_BANKS.BUZZWORD.includes((values[b.key] || "").trim())
  ).length;
  return Math.round((used / buzzBlanks.length) * 100);
}

export function fakeEngagement() {
  return {
    reactions: Math.floor(200 + Math.random() * 9800),
    comments: Math.floor(10 + Math.random() * 400),
    reposts: Math.floor(1 + Math.random() * 90),
  };
}
