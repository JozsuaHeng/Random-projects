const LEVELS = [
  { n: 3, label: "Three Lamps" },
  { n: 5, label: "Five Lamps" },
  { n: 7, label: "Seven Lamps", chaos: true },
];

const TAUNTS = [
  "Try a different combination.",
  "That's certainly a choice.",
  "The wiring has opinions.",
  "One of these lamps is lying to you.",
  "The rain doesn't care either way.",
  "A bold click. Unrewarded, but bold.",
  "Somewhere, a fuse is smug.",
  "Consider the lamp you didn't press.",
];

const lampStyle = Math.floor(Math.random() * LAMP_STYLE_COUNT);

document.getElementById("glass").insertAdjacentHTML("afterbegin", skylineSVG(Date.now()));

let levelIndex = 0;
let lampState = [];
let lampOrder = [];
let chaosSets = null;
let clicksThisLevel = 0;
let totalClicks = 0;
let lastTaunt = "";

const lampRow = document.getElementById("lampRow");
const levelNameEl = document.getElementById("levelName");
const litCountEl = document.getElementById("litCount");
const tauntEl = document.getElementById("taunt");
const resetBtn = document.getElementById("resetBtn");
const giveUpBtn = document.getElementById("giveUpBtn");
const endingOverlay = document.getElementById("endingOverlay");
const totalClicksStat = document.getElementById("totalClicksStat");
const playAgainBtn = document.getElementById("playAgainBtn");

function pairFor(n, i) {
  return [i, (i + 1) % n];
}

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Every entry toggles an even number of lamps (2, 4, or 6 of them), always
// including its own index. The size varies per lamp so a click can make
// several lamps vanish while only one or two reappear, or the reverse.
function randomEvenToggleSets(n) {
  const sizeOptions = [2, 4, 6].filter((s) => s <= n);
  return Array.from({ length: n }, (_, i) => {
    const others = shuffled([...Array(n).keys()].filter((x) => x !== i));
    const roll = Math.random();
    const size = roll < 0.5 ? sizeOptions[0] : roll < 0.85 ? sizeOptions[1] : sizeOptions[2];
    return [i, ...others.slice(0, size - 1)];
  });
}

function togglesFor(level, i) {
  if (level.chaos) return chaosSets[i];
  return pairFor(level.n, i);
}

// Every odd-sized starting set is winnable under the ring-pair toggle
// (confirmed by brute force for every odd weight below n, both n=3 and
// n=5 — not just the single-lamp case), so any of them is a safe pick.
function randomOddLitSet(n) {
  const oddWeights = [];
  for (let w = 1; w < n; w += 2) oddWeights.push(w);
  const weight = oddWeights[Math.floor(Math.random() * oddWeights.length)];
  return new Set(shuffled([...Array(n).keys()]).slice(0, weight));
}

function litCount(state) {
  return state.reduce((sum, v) => sum + v, 0);
}

function isFullyLit(state, n) {
  return litCount(state) === n;
}

function startLevel(index) {
  levelIndex = index;
  const level = LEVELS[index];

  if (level.chaos) {
    lampState = new Array(level.n).fill(0);
    chaosSets = randomEvenToggleSets(level.n);
  } else {
    const initialLit = randomOddLitSet(level.n);
    lampState = Array.from({ length: level.n }, (_, i) => (initialLit.has(i) ? 1 : 0));
    chaosSets = null;
  }
  lampOrder = shuffled([...Array(level.n).keys()]);

  clicksThisLevel = 0;
  levelNameEl.textContent = `Level ${index + 1} — ${level.label}`;
  setTaunt("Light every lamp on the sill. (There may be a catch.)");
  giveUpBtn.textContent = "Give Up & Continue →";
  renderLampRow();
  updateLitCount();
}

function renderLampRow() {
  const level = LEVELS[levelIndex];
  lampRow.innerHTML = "";
  lampOrder.forEach((i) => {
    const uid = `l${levelIndex}-${i}`;
    const wrapper = document.createElement("button");
    wrapper.className = "lamp";
    wrapper.dataset.index = i;
    wrapper.setAttribute("aria-label", `Lamp ${i + 1}`);
    const idealWidth = Math.max(40, 190 - level.n * 15);
    wrapper.style.flex = `0 1 ${idealWidth}px`;
    wrapper.innerHTML = `<div class="lamp-halo"></div><div class="lamp-pool"></div>${renderLamp(lampStyle, uid)}`;
    wrapper.addEventListener("click", () => handleLampClick(i));
    lampRow.appendChild(wrapper);
  });
  syncLampVisuals();
}

function syncLampVisuals() {
  const buttons = lampRow.querySelectorAll(".lamp");
  buttons.forEach((btn) => {
    const i = Number(btn.dataset.index);
    btn.classList.toggle("is-lit", lampState[i] === 1);
  });
}

function updateLitCount() {
  const level = LEVELS[levelIndex];
  litCountEl.textContent = `${litCount(lampState)} / ${level.n} lit`;
}

function setTaunt(text) {
  tauntEl.textContent = text;
  lastTaunt = text;
}

function pickTaunt() {
  let choice = lastTaunt;
  while (choice === lastTaunt) {
    choice = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
  }
  return choice;
}

function handleLampClick(i) {
  const level = LEVELS[levelIndex];
  togglesFor(level, i).forEach((idx) => {
    lampState[idx] ^= 1;
  });
  clicksThisLevel++;
  totalClicks++;
  syncLampVisuals();
  updateLitCount();

  if (isFullyLit(lampState, level.n)) {
    setTaunt("Every lamp is lit. Well done.");
    giveUpBtn.textContent = levelIndex < LEVELS.length - 1 ? "Next Level →" : "Finish →";
    return;
  }

  const lit = litCount(lampState);
  if (lit === level.n - 1) {
    setTaunt(`${lit} out of ${level.n}. So close.`);
  } else {
    setTaunt(pickTaunt());
  }
}

resetBtn.addEventListener("click", () => {
  startLevel(levelIndex);
});

giveUpBtn.addEventListener("click", () => {
  if (levelIndex < LEVELS.length - 1) {
    startLevel(levelIndex + 1);
  } else {
    showEnding();
  }
});

playAgainBtn.addEventListener("click", () => {
  totalClicks = 0;
  endingOverlay.hidden = true;
  startLevel(0);
});

function showEnding() {
  totalClicksStat.textContent = totalClicks;
  endingOverlay.hidden = false;
}

startLevel(0);
