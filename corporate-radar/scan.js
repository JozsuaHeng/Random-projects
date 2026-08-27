// Pure logic, no DOM access — everything here just takes text + a
// dictionary and returns data. It doesn't know or care whether the
// dictionary is buzzwords, weasel words, or urgency phrases; that's what
// lets the Buzzword Decoder, Weasel Word Scanner, and Manufactured
// Urgency Detector share this one file instead of three near-identical
// copies of it.

// Builds one regex that matches ANY key in the dictionary, longest phrases
// first. Longest-first matters: without it, scanning "move the needle"
// could match a shorter entry hiding inside a longer one before the regex
// ever tries the full phrase.
function buildPattern(dictionary) {
  const keys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
  const escaped = keys.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
}

// Splits `text` into an ordered list of segments: plain text runs, and
// "match" runs carrying their dictionary entry. The UI renders these
// directly instead of re-searching the text itself.
export function segmentText(text, dictionary) {
  const pattern = buildPattern(dictionary);
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const key = match[0].toLowerCase();
    const entry = dictionary[key];
    segments.push({
      type: "match",
      value: match[0],
      key,
      plain: entry.plain,
      cynical: entry.cynical,
      category: entry.category,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

// Rebuilds `segments` into a single string, swapping every match for its
// plain or cynical translation. This is the "Full Rewrite" view.
export function rewriteText(segments, tone) {
  return segments
    .map((seg) => (seg.type === "match" ? seg[tone] : seg.value))
    .join("");
}

function wordCount(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function tierFor(density, tiers) {
  for (const tier of tiers) {
    if (density <= tier.max) return tier;
  }
  return tiers[tiers.length - 1];
}

// Real stats computed from the segments — not canned numbers.
export function densityStats(text, segments, tiers) {
  const total = wordCount(text);
  const count = segments.filter((seg) => seg.type === "match").length;
  const density = total > 0 ? count / total : 0;
  return {
    totalWords: total,
    matchCount: count,
    density,
    tier: tierFor(density, tiers),
  };
}
