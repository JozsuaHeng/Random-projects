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

  // --- The Last Warden items ---
  shortsword: [
    "......kk....",
    ".....kssk...",
    ".....kssk...",
    ".....kssk...",
    ".....kssk...",
    ".....kssk...",
    "....kkkkkk..",
    ".....kmmk...",
    ".....kmmk...",
    "....kddddk..",
    "............",
    "............",
  ],
  silverblade: [
    "......kk....",
    ".....kwwk...",
    "....kwwwwk..",
    ".....kwwk...",
    ".....kwwk...",
    ".....kwwk...",
    "....kkkkkk..",
    ".....kyyk...",
    ".....kyyk...",
    "....kddddk..",
    "............",
    "............",
  ],
  woodtorch: [
    "....k..kk...",
    "...ko.okk...",
    "..koooook...",
    "..kyyyyyk...",
    "...kyyyk....",
    "....kkk.....",
    "....kmmk....",
    "....kmmk....",
    "....kmmk....",
    "....kmmk....",
    ".....kk.....",
    "............",
  ],
  chainmail: [
    "...kkkkkk...",
    "..ksssssssk.",
    "..kssssssk..",
    ".kssssssssk.",
    ".kssssssssk.",
    ".kssssssssk.",
    ".kssssssssk.",
    "..ksssssssk.",
    "..kssssssk..",
    "...kssssk...",
    "............",
    "............",
  ],
  greathelm: [
    "...kkkkkk...",
    "..kddddddk..",
    ".kddwwwwddk.",
    ".kdd.kk.ddk.",
    ".kddwwwwddk.",
    ".kddd..dddk.",
    ".kdddkkdddk.",
    "..kddkkddk..",
    "...kdkkdk...",
    "....kkkk....",
    "............",
    "............",
  ],
  gauntlets: [
    "............",
    "..kkk..kkk..",
    ".ksssk.ksssk",
    ".ksssk.ksssk",
    ".ksssksksssk",
    ".ksssssssssk",
    ".ksssssssssk",
    "..ksssssssk.",
    "...kkkkkkk..",
    "............",
    "............",
    "............",
  ],
  warboots: [
    "............",
    "...kk..kk...",
    "..kmmk.kmmk.",
    "..kmmk.kmmk.",
    "..kmmk.kmmk.",
    ".kdddkkdddk.",
    ".kdddkkdddk.",
    "kddddkkddddk",
    "kddddkkddddk",
    "............",
    "............",
    "............",
  ],
  wardencloak: [
    "....kkkk....",
    "...kbbbbk...",
    "..kbbbbbbk..",
    "..kbbbbbbk..",
    ".kbbbbbbbbk.",
    ".kbbbbbbbbk.",
    ".kbbbbbbbbk.",
    ".kbb....bbk.",
    ".kb......bk.",
    "kb........bk",
    "............",
    "............",
  ],
  bread: [
    "............",
    "...kkkkkk...",
    "..kmmmmmmk..",
    ".kmyyyyyymk.",
    ".kmyyyyyymk.",
    ".kmyyyyyymk.",
    ".kmmmmmmmmk.",
    "..kmmmmmmk..",
    "............",
    "............",
    "............",
    "............",
  ],
  draught: [
    "............",
    "....kkkk....",
    "....kwwk....",
    "...kkwwkk...",
    "...krrrrk...",
    "..krrrrrrk..",
    "..krrrrrrk..",
    "..krrrrrrk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  holywater: [
    "............",
    "....kkkk....",
    "....kssk....",
    "...kkttkk...",
    "...ktttttk..",
    "..kttttttk..",
    "..ktttttttk.",
    "..kttttttk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  relic: [
    ".....kk.....",
    "....kyyk....",
    "...kyyyyk...",
    "..kyyyyyyk..",
    ".kyyyyyyyyk.",
    "..kyyyyyyk..",
    "...kyyyyk...",
    "....kyyk....",
    ".....kk.....",
    "............",
    "............",
    "............",
  ],
  ironkey: [
    "............",
    "....kkk.....",
    "...kdddk....",
    "...kdddk....",
    "....kkk.....",
    "....kdk.....",
    "....kdk.....",
    "...kdddk....",
    "...kd.dk....",
    "...kd.dk....",
    "............",
    "............",
  ],
  wardenseal: [
    "....kkkk....",
    "...kyyyyk...",
    "..kyywwyyk..",
    "..kywwwwyk..",
    "..kywwwwyk..",
    "..kyywwyyk..",
    "...kyyyyk...",
    "....kkkk....",
    "............",
    "............",
    "............",
    "............",
  ],
  bandage: [
    "............",
    "..kkkkkkkk..",
    ".kwwwwwwwwk.",
    ".kwwwwwwwwk.",
    ".kwwrrrrwwk.",
    ".kwwrrrrwwk.",
    ".kwwwwwwwwk.",
    "..kkkkkkkk..",
    "............",
    "............",
    "............",
    "............",
  ],
  shield: [
    "...kkkkkk...",
    "..kddddddk..",
    ".kdyyyyyydk.",
    ".kdyy..yydk.",
    ".kdy.kk.ydk.",
    ".kdyy..yydk.",
    ".kdyyyyyydk.",
    "..kdddddk...",
    "...kdddk....",
    "....kdk.....",
    "............",
    "............",
  ],
  warhorn: [
    "............",
    "........kk..",
    ".......kyyk.",
    "......kyyyk.",
    "....kkyyk...",
    "...kyyyk....",
    "..kyyyk.....",
    ".kyyyk......",
    "kdyk........",
    "kdk.........",
    "............",
    "............",
  ],
  kingsbane: [
    ".......kk...",
    "......kwwk..",
    ".....kwwwwk.",
    "......kwwk..",
    "......kwwk..",
    "......kwwk..",
    "......kwwk..",
    "....kkkkkkk.",
    ".....kyyk...",
    "....kdddddk.",
    ".....kdk....",
    "............",
  ],
  phoenixdraught: [
    "............",
    "....kkkk....",
    "....kwwk....",
    "...kkwwkk...",
    "...koooook..",
    "..koyyyyook.",
    "..koyyyyook.",
    "..koooooook.",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  boneward: [
    "............",
    "....kwwk....",
    "...kwwwwk...",
    "....kwwk....",
    ".....kk.....",
    "....kwwk....",
    "...kw..wk...",
    "....kwwk....",
    ".....kk.....",
    "............",
    "............",
    "............",
  ],
};

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

// --- Embers (top-right panel backdrop, torchlit dungeon stone) ---
function startEmbers(canvas) {
  const ctx = canvas.getContext("2d");
  let embers = [];
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    embers = [];
    const n = Math.floor((canvas.width * canvas.height) / 1400);
    for (let i = 0; i < n; i++) {
      embers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() < 0.8 ? 1 : 2,
        vy: 0.05 + Math.random() * 0.14,
        drift: (Math.random() - 0.5) * 0.05,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);
  function frame(t) {
    // dark stone base with a faint warm vignette, as if lit from one corner
    ctx.fillStyle = "#0e0a06";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const glow = ctx.createRadialGradient(
      canvas.width * 0.18, canvas.height * 1.05, 0,
      canvas.width * 0.18, canvas.height * 1.05, canvas.width * 0.9
    );
    const flicker = 0.5 + 0.5 * Math.sin(t / 260) * 0.15 + 0.35;
    glow.addColorStop(0, `rgba(120, 70, 20, ${0.25 + flicker * 0.1})`);
    glow.addColorStop(1, "rgba(14, 10, 6, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const em of embers) {
      em.y -= em.vy;
      em.x += em.drift;
      if (em.y < 0) { em.y = canvas.height; em.x = Math.random() * canvas.width; }
      const a = 0.4 + 0.6 * Math.sin(t / 500 + em.tw);
      ctx.fillStyle = `rgba(255, ${140 + Math.round(60 * a)}, 60, ${0.3 + 0.5 * a})`;
      ctx.fillRect(Math.round(em.x), Math.round(em.y), em.s, em.s);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Parchment map (top-right panel backdrop: an aged, hand-charted map) ---
function startParchmentMap(canvas) {
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function compassRose(cx, cy, r, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = `rgba(217,164,65,${alpha})`;
    ctx.fillStyle = `rgba(217,164,65,${alpha})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i;
      const len = i % 2 === 0 ? r : r * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const stains = [[0.15, 0.2, 0.5], [0.82, 0.15, 0.4], [0.6, 0.85, 0.55], [0.22, 0.78, 0.45]];

  function frame(t) {
    ctx.fillStyle = "#120c07";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const [sx, sy, sr] of stains) {
      const g = ctx.createRadialGradient(
        canvas.width * sx, canvas.height * sy, 0,
        canvas.width * sx, canvas.height * sy, canvas.width * sr
      );
      g.addColorStop(0, "rgba(90,60,25,0.14)");
      g.addColorStop(1, "rgba(90,60,25,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.strokeStyle = "rgba(140,110,60,0.12)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const yBase = canvas.height * (0.22 + i * 0.3);
      ctx.moveTo(0, yBase);
      for (let x = 0; x <= canvas.width; x += 18) {
        ctx.lineTo(x, yBase + Math.sin(x / 45 + i * 1.7) * 7);
      }
      ctx.stroke();
    }

    const glow = 0.3 + 0.15 * Math.sin(t / 900);
    compassRose(canvas.width - 24, canvas.height - 24, 15, glow);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
