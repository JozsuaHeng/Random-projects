// Pure logic, no DOM access. Unlike scan.js, this doesn't look for
// individual phrases — it works sentence by sentence, checking each one
// against SO_WHAT_INDICATORS (an array used as a membership list, not a
// lookup table — see the comment on that export in data.js for why).

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function hasSoWhat(sentence, indicators) {
  const lower = sentence.toLowerCase();
  return indicators.some((phrase) => lower.includes(phrase));
}

// Returns one entry per sentence: the sentence text, and whether it
// contains a clear implication/action, not just a description.
export function analyzeSentences(text, indicators) {
  return splitSentences(text).map((sentence) => ({
    sentence,
    hasSoWhat: hasSoWhat(sentence, indicators),
  }));
}

function tierFor(ratio, tiers) {
  for (const tier of tiers) {
    if (ratio <= tier.max) return tier;
  }
  return tiers[tiers.length - 1];
}

export function soWhatStats(analysis, tiers) {
  const total = analysis.length;
  const withSoWhat = analysis.filter((a) => a.hasSoWhat).length;
  const ratio = total > 0 ? withSoWhat / total : 0;
  return {
    total,
    withSoWhat,
    ratio,
    tier: tierFor(ratio, tiers),
  };
}
