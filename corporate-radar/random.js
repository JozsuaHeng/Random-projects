// One tiny shared helper — the excuse generator, sign-off generator, and
// BS Bingo button all just need "give me one random item from this list."
export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
