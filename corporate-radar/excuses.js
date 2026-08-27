import { EXCUSE_BANK } from "./data.js";
import { pickRandom } from "./random.js";

// EXCUSE_BANK[scenario] is the lookup — an instant read, not a search.
// pickRandom then handles the one part that has to be random: which line
// from that scenario's list comes back this time.
export function generateExcuse(scenario) {
  const entry = EXCUSE_BANK[scenario];
  return { scenario, label: entry.label, excuse: pickRandom(entry.excuses) };
}

export function randomScenario() {
  const scenarios = Object.keys(EXCUSE_BANK);
  return pickRandom(scenarios);
}
