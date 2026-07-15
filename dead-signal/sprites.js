// DEAD SIGNAL — pixel sprite data + canvas renderers.
// Sprites are arrays of strings; each char is a palette key, "." = transparent.
// Rows may be ragged; the renderer treats missing chars as transparent.

const PALETTE = {
  k: "#10141f", // outline / black
  w: "#f4f4f4", // white
  r: "#e23b3b", // red
  o: "#ff8a2a", // orange
  y: "#ffd23e", // yellow
  g: "#46c46a", // green
  b: "#3e6fe2", // blue
  t: "#35d0c4", // teal
  s: "#b8c0cc", // silver
  d: "#5a6272", // dark grey
  m: "#a06a3a", // brown
  p: "#dcd7ff", // pale spore
  f: "#e8a06a", // skin
  h: "#3a2a1e", // hair
  v: "#7de07d", // phosphor green
};

const SPRITES = {
  multitool: [
    "..........ss",
    ".........ss.",
    "........ss..",
    ".......ss...",
    "......ss....",
    ".....kk.....",
    "....krrk....",
    "...krrrrk...",
    "..krrrrk....",
    "..krrrk.....",
    "...kkk......",
    "............",
  ],
  medkit: [
    "............",
    ".kkkkkkkkkk.",
    ".kwwwwwwwwk.",
    ".kwwwrrwwwk.",
    ".kwwwrrwwwk.",
    ".kwrrrrrrwk.",
    ".kwrrrrrrwk.",
    ".kwwwrrwwwk.",
    ".kwwwrrwwwk.",
    ".kwwwwwwwwk.",
    ".kkkkkkkkkk.",
    "............",
  ],
  stim: [
    "............",
    "..k.........",
    "..kk........",
    "..kkkkkkkk..",
    "..ksssssstk.",
    "..kssssssttk",
    "..ksssssstk.",
    "..kkkkkkkk..",
    "..kk........",
    "..k.........",
    "............",
    "............",
  ],
  rations: [
    "............",
    "...kkkkkk...",
    "..kmmmmmmk..",
    "..kmyyyymk..",
    "..kmyyyymk..",
    "..kmmmmmmk..",
    "..kmwwwwmk..",
    "..kmwwwwmk..",
    "..kmmmmmmk..",
    "...kkkkkk...",
    "............",
    "............",
  ],
  keycard: [
    "............",
    "............",
    ".kkkkkkkkkk.",
    ".kttttttttk.",
    ".ktwwtttttk.",
    ".ktwwtttttk.",
    ".kttttttttk.",
    ".ktddddddtk.",
    ".kttttttttk.",
    ".kkkkkkkkkk.",
    "............",
    "............",
  ],
  torch: [
    ".....oo.....",
    "....oyyo....",
    "....oyyo....",
    ".....oo.....",
    "....kssk....",
    "....kssk....",
    "....kssk....",
    "...kddddk...",
    "...kddddk...",
    "...kddddk...",
    "....kkkk....",
    "............",
  ],
  flare: [
    ".....yy.....",
    "....yooy....",
    "....yooy....",
    ".....rr.....",
    ".....rr.....",
    ".....rr.....",
    ".....rr.....",
    ".....ww.....",
    ".....rr.....",
    ".....rr.....",
    ".....kk.....",
    "............",
  ],
  flashlight: [
    "............",
    "..kkk.......",
    ".kyyyk......",
    ".kyyykkkkkk.",
    ".kyyydssssk.",
    ".kyyydssssk.",
    ".kyyykkkkkk.",
    ".kyyyk......",
    "..kkk.......",
    "............",
    "............",
    "............",
  ],
  sample: [
    "....kkkk....",
    "....kmmk....",
    "....kmmk....",
    "...k....k...",
    "...k....k...",
    "...k.pp.k...",
    "...k.pp.k...",
    "...kppppk...",
    "...kppppk...",
    "....kkkk....",
    "............",
    "............",
  ],
  toolbelt: [
    "............",
    "............",
    "..kkkkkkkk..",
    ".kmmmmmmmmk.",
    ".kmmkyykmmk.",
    ".kmmkyykmmk.",
    ".kmmmmmmmmk.",
    ".kdmmkkmmdk.",
    ".kdmmkkmmdk.",
    "..kkkkkkkk..",
    "............",
    "............",
  ],
  charm: [
    ".....ss.....",
    "....s..s....",
    "....s..s....",
    ".....ss.....",
    "....ksssk...",
    "...ksssssk..",
    "...kssyssk..",
    "...ksyyysk..",
    "...kssyssk..",
    "...ksssssk..",
    "....ksssk...",
    "............",
  ],
  candle: [
    "............",
    "....kkkk....",
    "...koooo k..",
    "...kooook...",
    "...kwwwwk...",
    "...kooook...",
    "...kooook...",
    "...kooook...",
    "...kooook...",
    "....kkkk....",
    "............",
    "............",
  ],
  evahelmet: [
    "....kkkkkk..",
    "...kssssssk.",
    "..kssttttssk",
    "..ksttttttsk",
    "..kstttwttsk",
    "..ksttttttsk",
    "..kssttttssk",
    "...kssssssk.",
    "....kddddk..",
    "............",
    "............",
    "............",
  ],
  evasuit: [
    "....kkkk....",
    "...kwwwwk...",
    "...kwoowk...",
    "..kwwoowwk..",
    "..kwwoowwk..",
    "..kwwwwwwk..",
    "..kwdd..ddk.",
    "..kwd....dk.",
    "...kd....dk.",
    "............",
    "............",
    "............",
  ],
  gloves: [
    "............",
    "...k....k...",
    "..kfk..kfk..",
    "..kfk..kfk..",
    ".kffffkffffk",
    ".kffffkffffk",
    ".kfffffffffk",
    "..kfffffffk.",
    "...kkkkkkk..",
    "............",
    "............",
    "............",
  ],
  magboots: [
    "............",
    "...kk..kk...",
    "..ksk..ksk..",
    "..ksk..ksk..",
    "..ksk..ksk..",
    ".kdddkkdddk.",
    ".kdddkkdddk.",
    "kddddkkddddk",
    "kddddkkddddk",
    "............",
    "............",
    "............",
  ],
  o2tank: [
    "....kkkk....",
    "...kssssk...",
    "...ksssgk...",
    "...ksssgk...",
    "...ksssgk...",
    "...ksssgk...",
    "...ksssgk...",
    "...kssssk...",
    "....kkkk....",
    "............",
    "............",
    "............",
  ],
  navkey: [
    "............",
    ".....kk.....",
    "....kyyk....",
    "....kyyk....",
    ".....kk.....",
    ".....kk.....",
    "....kkkk....",
    "...kddddk...",
    "....kkkk....",
    "............",
    "............",
    "............",
  ],
  parts: [
    "............",
    "..kkkk.kkkk.",
    ".kssssksssk.",
    ".kstttkstsk.",
    ".ksssskssssk",
    ".kkkk...kkk.",
    "..kddk.kddk.",
    "............",
    "............",
    "............",
    "............",
    "............",
  ],
  sedative: [
    "............",
    "....kkkk....",
    "....kssk....",
    "...kkkkkk...",
    "...kbbbbk...",
    "...kbbbbk...",
    "...kbwbbk...",
    "...kbbbbk...",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
};

// 16x16 portrait: Specialist Reyes in an orange salvage jumpsuit.
const PORTRAIT = [
  "................",
  ".....kkkkkk.....",
  "....khhhhhhk....",
  "...khhhhhhhhk...",
  "...khhffffhhk...",
  "...kffffffffk...",
  "...kfkwfkwffk...",
  "...kffffffffk...",
  "...kffkkkfffk...",
  "...kfffffffk....",
  "....kffffk......",
  "...kkoookkk.....",
  "..koooooooook...",
  ".kooookkoooook..",
  ".koook..kooook..",
  ".kkkk....kkkk...",
];

function drawSprite(canvas, sprite, scale) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < sprite.length; y++) {
    const row = sprite[y];
    for (let x = 0; x < row.length; x++) {
      const c = PALETTE[row[x]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

// Simple pixel silhouette of a person, with per-slot highlight color
// when that equipment slot is filled. 6x10 grid, scaled up.
const DOLL_BASE = [
  "..kk..",
  ".kffk.",
  ".kffk.",
  ".kook.",
  "kooook",
  "kooook",
  ".ko.ok",
  ".ko.ok",
  ".ko.ok",
  ".kk.kk",
];
function drawPaperDoll(canvas, equipped) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scale = Math.floor(canvas.width / 6);
  for (let y = 0; y < DOLL_BASE.length; y++) {
    for (let x = 0; x < DOLL_BASE[y].length; x++) {
      const c = PALETTE[DOLL_BASE[y][x]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  const glow = (row, on) => {
    if (!on) return;
    ctx.fillStyle = "rgba(125,224,125,0.55)";
    ctx.fillRect(0, row * scale, canvas.width, scale);
  };
  glow(0, equipped.head);
  glow(3, equipped.body);
  glow(6, equipped.hands);
  glow(9, equipped.feet);
  glow(4, equipped.back);
}

// --- Starfield (top-right panel backdrop) ---
function startStarfield(canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    stars = [];
    const n = Math.floor((canvas.width * canvas.height) / 900);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() < 0.85 ? 1 : 2,
        v: 0.03 + Math.random() * 0.12,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);
  function frame(t) {
    ctx.fillStyle = "#05070d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const st of stars) {
      st.x -= st.v;
      if (st.x < 0) { st.x = canvas.width; st.y = Math.random() * canvas.height; }
      const a = 0.5 + 0.5 * Math.sin(t / 700 + st.tw);
      ctx.fillStyle = `rgba(220, 230, 255, ${0.35 + 0.55 * a})`;
      ctx.fillRect(Math.round(st.x), Math.round(st.y), st.s, st.s);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
