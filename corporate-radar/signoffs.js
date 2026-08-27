import { SIGNOFF_BANK } from "./data.js";
import { pickRandom } from "./random.js";

export function generateSignoff(mood) {
  const entry = SIGNOFF_BANK[mood];
  return { mood, label: entry.label, signoff: pickRandom(entry.signoffs) };
}

export function randomMood() {
  const moods = Object.keys(SIGNOFF_BANK);
  return pickRandom(moods);
}
