const LEVELS = [
  { n: 3, label: "Three Lamps", initialLit: [0] },
  { n: 5, label: "Five Lamps", initialLit: [0] },
  { n: 7, label: "Seven Lamps", initialLit: [] },
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

function litCount(state) {
  return state.reduce((sum, v) => sum + v, 0);
}

function isFullyLit(state, n) {
  return litCount(state) === n;
}

function startLevel(index) {
  levelIndex = index;
  const level = LEVELS[index];
  lampState = level.initialLit.length
    ? Array.from({ length: level.n }, (_, i) => (level.initialLit.includes(i) ? 1 : 0))
    : new Array(level.n).fill(0);
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
  for (let i = 0; i < level.n; i++) {
    const uid = `l${levelIndex}-${i}`;
    const wrapper = document.createElement("button");
    wrapper.className = "lamp";
    wrapper.setAttribute("aria-label", `Lamp ${i + 1}`);
    wrapper.style.width = `${Math.max(70, 190 - level.n * 15)}px`;
    wrapper.innerHTML = `<div class="lamp-halo"></div>${renderLamp(lampStyle, uid)}`;
    wrapper.addEventListener("click", () => handleLampClick(i));
    lampRow.appendChild(wrapper);
  }
  syncLampVisuals();
}

function syncLampVisuals() {
  const buttons = lampRow.querySelectorAll(".lamp");
  buttons.forEach((btn, i) => {
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
  const [a, b] = pairFor(level.n, i);
  lampState[a] ^= 1;
  lampState[b] ^= 1;
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
