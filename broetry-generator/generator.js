// Pure generation logic — no DOM here, so it's easy to read and test on its own.
// Every random choice takes an `rng` function (returning 0-1, like Math.random)
// so callers can pass a seeded RNG and get a fully reproducible post back.
import {
  shapes,
  phraseBanks,
  emojiTiers,
  bonusBrags,
  jargonBursts,
  roastLines,
  characters,
  commenterNames,
  commentTemplates,
} from "./data.js";

function pickRandom(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

// Turns a 0-100 slider value into a 1-5 "target weight", then picks an entry
// from a {text, weight} bank favoring entries whose weight is close to that
// target. Higher slider value -> more likely to land on weight-5 entries.
// Used for both phrase banks and the comment bank.
function weightedPick(bank, sliderValue, usedTexts, rng) {
  const targetWeight = 1 + (sliderValue / 100) * 4;
  const candidates = bank.filter((entry) => !usedTexts.has(entry.text));
  const pool = candidates.length > 0 ? candidates : bank;

  const scored = pool.map((entry) => ({
    entry,
    score: 1 / (1 + Math.abs(entry.weight - targetWeight)),
  }));
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);

  let roll = rng() * totalScore;
  for (const { entry, score } of scored) {
    roll -= score;
    if (roll <= 0) return entry.text;
  }
  return pool[pool.length - 1].text;
}

function pickShape(rng) {
  return shapes[Math.floor(rng() * shapes.length)];
}

// Post Length (0-100) maps to 2-8 repeats of the shape's repeatable slot
// (e.g. how many numbered lessons or bonus stats show up).
function repeatCountFor(postLength) {
  return Math.round(2 + (postLength / 100) * 6);
}

function buildSlots(shape, postLength) {
  const repeatCount = repeatCountFor(postLength);
  return [...shape.pre, ...Array(repeatCount).fill(shape.repeat), ...shape.post];
}

function emojiPoolFor(density) {
  const tier = emojiTiers.find((t) => density <= t.max);
  return tier.pool;
}

// Randomly appends 0-2 emoji to a line based on the emoji density slider.
function applyEmojis(line, emojiDensity, rng) {
  const pool = emojiPoolFor(emojiDensity);
  const chance = emojiDensity / 100;
  let result = line;
  if (rng() < chance) {
    result += " " + pickRandom(pool, rng);
  }
  if (emojiDensity > 66 && rng() < chance / 2) {
    result += " " + pickRandom(pool, rng);
  }
  return result;
}

function fakeEngagement(insufferability, humbleBrag, rng) {
  const hype = (insufferability + humbleBrag) / 2;
  const baseLikes = 50 + Math.floor(rng() * 250);
  const multiplier = 1 + hype / 15;
  const likes = Math.round(baseLikes * multiplier);
  const comments = Math.round((likes / 6) * (1 + hype / 50));
  const reposts = Math.round(likes / 20);
  return { likes, comments, reposts };
}

export function pickCharacter(rng) {
  return pickRandom(characters, rng);
}

// 1-3 fake sycophantic comments, more of them (and more unhinged ones) as
// Insufferability rises.
function generateComments(insufferability, rng) {
  const count = insufferability < 33 ? 1 : insufferability < 66 ? 2 : 3;
  const usedNames = new Set();
  const usedComments = new Set();
  const result = [];

  for (let i = 0; i < count; i++) {
    const name = pickRandom(
      commenterNames.filter((n) => !usedNames.has(n)),
      rng
    );
    usedNames.add(name);
    const text = weightedPick(commentTemplates, insufferability, usedComments, rng);
    usedComments.add(text);
    result.push({ name, text });
  }
  return result;
}

export function generatePost(insufferability, emojiDensity, humbleBrag, corporateJargon, postLength, roastMode, rng = Math.random) {
  const shape = pickShape(rng);
  const slots = buildSlots(shape, postLength);
  const usedTexts = new Set();
  let lessonCount = 0;

  const lines = slots.map((slotType) => {
    const bank = phraseBanks[slotType];
    const text = weightedPick(bank, insufferability, usedTexts, rng);
    usedTexts.add(text);

    let line = text;
    if (slotType === "lesson") {
      lessonCount += 1;
      const prefix =
        emojiDensity > 66
          ? emojiPoolFor(emojiDensity)[lessonCount % emojiPoolFor(emojiDensity).length]
          : `${lessonCount}.`;
      line = `${prefix} ${text}`;
    }
    return applyEmojis(line, emojiDensity, rng);
  });

  // Every shape ends in a call-to-action slot — pull it out, splice in any
  // bonus lines the Humble-Brag / Corporate Jargon sliders earn, then
  // restore the CTA as the closing line.
  const cta = lines.pop();

  if (rng() < corporateJargon / 100) {
    lines.push(applyEmojis(pickRandom(jargonBursts, rng), emojiDensity, rng));
  }
  if (rng() < humbleBrag / 100) {
    lines.push(applyEmojis(pickRandom(bonusBrags, rng), emojiDensity, rng));
  }

  lines.push(cta);

  if (roastMode) {
    lines.push(pickRandom(roastLines, rng));
  }

  const text = lines.join("\n\n");
  const { likes, comments, reposts } = fakeEngagement(insufferability, humbleBrag, rng);
  const character = pickCharacter(rng);
  const postComments = generateComments(insufferability, rng);

  return { text, likes, comments, reposts, character, postComments };
}
