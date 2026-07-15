// DEAD SIGNAL — game engine: state, rendering, choices, luck tests, saving.

const SAVE_KEY = "dead-signal-save-v1";

let state = null;
let selectedItem = null;
let rolling = false;

function newState() {
  return {
    page: META.startPage,
    stats: { ...META.stats },
    items: [],
    equipped: {},   // slot -> itemId
    flags: {},
    visitedRooms: [],
    appliedPages: [],
    dead: false,
  };
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!PAGES[s.page]) return null;
    if (!s.equipped) s.equipped = {};
    return s;
  } catch (e) { return null; }
}

// ---------- effects ----------

function applyEffect(eff, collected) {
  const [kind, a, b] = eff;
  if (kind === "add") {
    if (!state.items.includes(a)) {
      state.items.push(a);
      collected.push({ type: "gain", text: "+ " + ITEMS[a].name.toUpperCase() });
    }
  } else if (kind === "remove") {
    const i = state.items.indexOf(a);
    if (i >= 0) {
      state.items.splice(i, 1);
      collected.push({ type: "loss", text: "- " + ITEMS[a].name.toUpperCase() });
      for (const slot of Object.keys(state.equipped)) {
        if (state.equipped[slot] === a) delete state.equipped[slot];
      }
    }
  } else if (kind === "stat") {
    const before = state.stats[a];
    state.stats[a] = Math.max(0, Math.min(10, state.stats[a] + b));
    const delta = state.stats[a] - before;
    if (delta !== 0) {
      collected.push({
        type: delta > 0 ? "gain" : "loss",
        text: (delta > 0 ? "+" : "") + delta + " " + a.toUpperCase(),
      });
    }
  } else if (kind === "flag") {
    state.flags[a] = true;
  }
}

function checkDeath() {
  if (state.dead) return false;
  for (const stat of ["health", "oxygen", "sanity"]) {
    if (state.stats[stat] <= 0) {
      state.dead = true;
      goToPage(META.deathPages[stat], true);
      return true;
    }
  }
  return false;
}

// ---------- navigation ----------

function goToPage(num, force) {
  if (rolling && !force) return;
  const page = PAGES[num];
  if (!page) { console.error("Missing page", num); return; }
  state.page = num;

  const effectTags = [];
  const firstVisit = !state.appliedPages.includes(num);
  if (firstVisit && page.effects) {
    for (const eff of page.effects) applyEffect(eff, effectTags);
    state.appliedPages.push(num);
  }
  if (page.room && !state.visitedRooms.includes(page.room)) {
    state.visitedRooms.push(page.room);
  }
  if (page.type === "death") state.dead = true;

  save();
  renderAll(effectTags);
  // stat-based deaths trump the page we just landed on (unless it's terminal already)
  if (!page.type) checkDeath();
}

function choiceAvailable(ch) {
  if (ch.needItem && !state.items.includes(ch.needItem)) return false;
  if (ch.needAnyItem && !ch.needAnyItem.some(it => state.items.includes(it))) return false;
  if (ch.needFlag && !state.flags[ch.needFlag]) return false;
  if (ch.needEquipAll && !ch.needEquipAll.every(it => Object.values(state.equipped).includes(it))) return false;
  return true;
}

function requirementLabel(ch) {
  if (ch.needItem) return "requires " + ITEMS[ch.needItem].name;
  if (ch.needAnyItem) return "requires " + ch.needAnyItem.map(i => ITEMS[i].name).join(" or ");
  if (ch.needEquipAll) return "requires wearing full EVA rig";
  if (ch.needFlag === "powerOn") return "requires main power";
  if (ch.needFlag) return "something is still missing";
  return "";
}

function pickChoice(ch) {
  if (rolling) return;
  if (!choiceAvailable(ch)) return;
  if (ch.effects) {
    const tags = [];
    for (const eff of ch.effects) applyEffect(eff, tags);
    tags.forEach(t => toast(t.text));
    if (checkDeath()) return;
  }
  if (ch.luck) { runLuckTest(ch.luck); return; }
  if (ch.note) toast(ch.note.length > 60 ? "LUCKY BREAK" : ch.note.toUpperCase());
  goToPage(ch.to);
}

// ---------- luck test ----------

function runLuckTest(luck) {
  rolling = true;
  const diceBox = document.getElementById("book-dice");
  const d1 = document.getElementById("die1");
  const d2 = document.getElementById("die2");
  const res = document.getElementById("dice-result");
  document.getElementById("book-choices").style.opacity = "0.35";
  diceBox.classList.remove("hidden");
  d1.classList.add("rolling");
  d2.classList.add("rolling");
  res.textContent = "";
  res.className = "";

  const spin = setInterval(() => {
    d1.textContent = 1 + Math.floor(Math.random() * 6);
    d2.textContent = 1 + Math.floor(Math.random() * 6);
  }, 80);

  setTimeout(() => {
    clearInterval(spin);
    d1.classList.remove("rolling");
    d2.classList.remove("rolling");
    const a = 1 + Math.floor(Math.random() * 6);
    const b = 1 + Math.floor(Math.random() * 6);
    d1.textContent = a;
    d2.textContent = b;
    const threshold = state.items.includes("charm") ? 8 : 7;
    const pass = a + b <= threshold;
    res.textContent = a + b <= threshold
      ? `${a + b} — YOU ARE LUCKY` : `${a + b} — YOU ARE UNLUCKY`;
    res.className = pass ? "pass" : "fail";
    setTimeout(() => {
      rolling = false;
      goToPage(pass ? luck.pass : luck.fail);
    }, 1400);
  }, 900);
}

// ---------- rendering ----------

function renderAll(effectTags) {
  renderBook(effectTags || []);
  renderMap();
  renderStats();
  renderBackpack();
  renderEquip();
  document.getElementById("page-num").textContent = state.page;
}

function renderBook(effectTags) {
  const page = PAGES[state.page];
  const bookPage = document.getElementById("book-page");

  // retrigger page-turn animation
  bookPage.style.animation = "none";
  void bookPage.offsetWidth;
  bookPage.style.animation = "";

  document.getElementById("book-pagenum").textContent = "· " + state.page + " ·";

  const textEl = document.getElementById("book-text");
  textEl.textContent = page.text;

  const effEl = document.getElementById("book-effects");
  effEl.innerHTML = "";
  for (const tag of effectTags) {
    const span = document.createElement("span");
    span.className = "effect-tag " + (tag.type === "gain" ? "gain" : "loss");
    span.textContent = "[ " + tag.text + " ]";
    effEl.appendChild(span);
  }

  document.getElementById("book-dice").classList.add("hidden");

  const chEl = document.getElementById("book-choices");
  chEl.style.opacity = "1";
  chEl.innerHTML = "";

  if (page.type === "death" || page.type === "act-end") {
    const cap = document.createElement("div");
    cap.className = "endcap";
    cap.textContent = page.type === "death"
      ? "◆ ◆ ◆" : "ACT TWO IS STILL BEING WRITTEN…";
    chEl.appendChild(cap);
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.innerHTML = `<span class="arrow">➤</span> ${page.type === "death"
      ? "Try again from the beginning" : "Start a new run"} <span class="turnto">TURN TO PAGE 1</span>`;
    btn.onclick = () => { state = newState(); save(); renderAll([]); };
    chEl.appendChild(btn);
    return;
  }

  for (const ch of page.choices || []) {
    const btn = document.createElement("button");
    const ok = choiceAvailable(ch);
    btn.className = "choice" + (ok ? "" : " locked");
    if (ok) {
      const dest = ch.luck ? "TEST YOUR LUCK" : "TURN TO PAGE " + ch.to;
      btn.innerHTML = `<span class="arrow">➤</span> ${escapeHtml(ch.label)} <span class="turnto">${dest}</span>`;
      btn.onclick = () => pickChoice(ch);
    } else {
      btn.innerHTML = `<span class="arrow">✕</span> ${escapeHtml(ch.label)} <span class="req">(${requirementLabel(ch)})</span>`;
    }
    chEl.appendChild(btn);
  }
}

function renderMap() {
  const mapEl = document.getElementById("ship-map");
  mapEl.innerHTML = "";
  const page = PAGES[state.page];
  const currentRoom = page.room ||
    (state.visitedRooms.length ? state.visitedRooms[state.visitedRooms.length - 1] : null);

  for (const [id, room] of Object.entries(ROOMS)) {
    const div = document.createElement("div");
    div.className = "map-room";
    div.style.gridColumn = room.col + 1;
    div.style.gridRow = room.row + 1;
    if (state.visitedRooms.includes(id)) {
      div.classList.add("visited");
      div.textContent = room.name.toUpperCase();
    } else {
      div.textContent = "▒▒▒";
    }
    if (id === currentRoom) {
      div.classList.add("current");
      div.textContent = room.name.toUpperCase();
    }
    mapEl.appendChild(div);
  }
  document.getElementById("location-name").textContent =
    currentRoom ? ROOMS[currentRoom].name.toUpperCase() : "UNKNOWN";
}

function renderStats() {
  for (const [stat, cls] of [["health", "hp"], ["oxygen", "o2"], ["sanity", "sn"]]) {
    const el = document.getElementById("stat-" + stat);
    el.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      const block = document.createElement("span");
      block.className = "stat-block " + cls + (i < state.stats[stat] ? " on" : "");
      el.appendChild(block);
    }
  }
}

const BACKPACK_SLOTS = 20;

function renderBackpack() {
  const packEl = document.getElementById("backpack");
  packEl.innerHTML = "";
  for (let i = 0; i < BACKPACK_SLOTS; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    const itemId = state.items[i];
    if (itemId) {
      slot.classList.add("filled");
      if (itemId === selectedItem) slot.classList.add("selected");
      const canvas = document.createElement("canvas");
      canvas.width = 36; canvas.height = 36;
      drawSprite(canvas, SPRITES[itemId], 3);
      slot.appendChild(canvas);
      if (ITEMS[itemId].use) {
        const dot = document.createElement("span");
        dot.className = "usable-dot";
        dot.textContent = "!";
        slot.appendChild(dot);
      }
      slot.title = ITEMS[itemId].name;
      slot.onclick = () => inspectItem(itemId);
    }
    packEl.appendChild(slot);
  }
  if (!selectedItem || !state.items.includes(selectedItem)) {
    selectedItem = null;
    document.getElementById("item-info").innerHTML =
      state.items.length ? "Click an item to inspect, use, or equip it." : "Your backpack is empty.";
  }
}

function inspectItem(itemId) {
  const item = ITEMS[itemId];
  const info = document.getElementById("item-info");
  const alreadySelected = selectedItem === itemId;
  if (alreadySelected && item.use) { useItem(itemId); return; }
  if (alreadySelected && item.slot) { equipItem(itemId); return; }

  selectedItem = itemId;
  let hint = "";
  if (item.use) hint = ` <span class="use-hint">Click again to USE.</span>`;
  else if (item.slot) hint = ` <span class="use-hint">Click again to WEAR (${item.slot}).</span>`;
  info.innerHTML = `<b>${item.name.toUpperCase()}</b> — ${escapeHtml(item.desc)}` + hint;
  renderBackpack();
  selectedItem = itemId;
  renderBackpack();
}

function equipItem(itemId) {
  const item = ITEMS[itemId];
  if (!item.slot) return;
  state.equipped[item.slot] = itemId;
  selectedItem = null;
  toast("EQUIPPED " + item.name.toUpperCase());
  save();
  renderBackpack();
  renderEquip();
  renderBook([]);
}

function unequipSlot(slotName) {
  if (!state.equipped[slotName]) return;
  const item = ITEMS[state.equipped[slotName]];
  delete state.equipped[slotName];
  toast("REMOVED " + item.name.toUpperCase());
  save();
  renderEquip();
  renderBook([]);
}

function renderEquip() {
  const doll = document.getElementById("paperdoll");
  if (doll) drawPaperDoll(doll, {
    head: !!state.equipped.head, body: !!state.equipped.body,
    hands: !!state.equipped.hands, feet: !!state.equipped.feet,
    back: !!state.equipped.back,
  });
  document.querySelectorAll(".eq-slot").forEach(el => {
    const slotName = el.dataset.slot;
    const itemId = state.equipped[slotName];
    const canvas = el.querySelector(".eq-canvas");
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    if (itemId) {
      el.classList.add("filled");
      el.title = ITEMS[itemId].name + " (click to remove)";
      drawSprite(canvas, SPRITES[itemId], 2);
      el.onclick = () => unequipSlot(slotName);
    } else {
      el.classList.remove("filled");
      el.title = "Empty";
      el.onclick = null;
    }
  });
}

function useItem(itemId) {
  const item = ITEMS[itemId];
  if (!item.use) return;
  const tags = [];
  for (const [stat, delta] of Object.entries(item.use)) {
    applyEffect(["stat", stat, delta], tags);
  }
  const idx = state.items.indexOf(itemId);
  if (idx >= 0) state.items.splice(idx, 1);
  selectedItem = null;
  tags.forEach(t => toast(t.text));
  toast("USED " + item.name.toUpperCase());
  save();
  renderStats();
  renderBackpack();
  checkDeath();
}

function toast(text) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  // stack toasts upward
  const existing = document.querySelectorAll(".toast").length;
  el.style.bottom = (20 + existing * 46) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2300);
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------- boot ----------

function boot() {
  state = load() || newState();

  drawSprite(document.getElementById("portrait"), PORTRAIT, 4);
  startStarfield(document.getElementById("starfield"));

  document.getElementById("char-name").textContent = META.player.name.toUpperCase();
  document.getElementById("char-role").textContent = META.player.role.toUpperCase();

  document.getElementById("btn-newgame").onclick = () => {
    if (confirm("Start over from page 1? Your current progress will be erased.")) {
      state = newState();
      save();
      renderAll([]);
    }
  };
  document.getElementById("btn-help").onclick = () =>
    document.getElementById("help-overlay").classList.remove("hidden");
  document.getElementById("btn-help-close").onclick = () =>
    document.getElementById("help-overlay").classList.add("hidden");

  renderAll([]);
}

boot();
