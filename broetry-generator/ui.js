// Wires all controls to the DOM and renders whatever generator.js returns.
import { generatePost } from "./generator.js";
import { createRng, randomSeed } from "./rng.js";

const sliders = [
  { key: "insufferability", input: document.getElementById("insufferability"), value: document.getElementById("insufferability-value") },
  { key: "emojiDensity", input: document.getElementById("emoji-density"), value: document.getElementById("emoji-density-value") },
  { key: "humbleBrag", input: document.getElementById("humble-brag"), value: document.getElementById("humble-brag-value") },
  { key: "corporateJargon", input: document.getElementById("corporate-jargon"), value: document.getElementById("corporate-jargon-value") },
  { key: "postLength", input: document.getElementById("post-length"), value: document.getElementById("post-length-value") },
];

const roastCheckbox = document.getElementById("roast-mode");
const generateBtn = document.getElementById("generate-btn");
const randomizeBtn = document.getElementById("randomize-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const output = document.getElementById("output");
const historyEl = document.getElementById("history");

const HISTORY_KEY = "broetry-history";
const THEME_KEY = "broetry-theme";

let postHistory = [];
try {
  postHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
} catch {
  postHistory = [];
}

function clamp(n) {
  return Math.min(100, Math.max(0, Math.round(n) || 0));
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function computeCringe(state) {
  const score = Math.round(
    (state.insufferability + state.emojiDensity + state.humbleBrag + state.corporateJargon) / 4
  );
  const label = score < 34 ? "Mild" : score < 60 ? "Spicy" : score < 85 ? "Unbearable" : "Nuclear";
  return { score, label };
}

// --- slider <-> number input syncing ---
sliders.forEach(({ input, value }) => {
  input.addEventListener("input", () => {
    value.value = input.value;
  });
  value.addEventListener("input", () => {
    input.value = clamp(Number(value.value));
  });
  value.addEventListener("blur", () => {
    value.value = clamp(Number(value.value));
  });
});

function getSliderValues() {
  const result = {};
  sliders.forEach(({ key, input }) => {
    result[key] = Number(input.value);
  });
  return result;
}

function setSliderValues(state) {
  sliders.forEach(({ key, input, value }) => {
    input.value = state[key];
    value.value = state[key];
  });
}

// --- URL (shareable link) ---
function updateUrl(state) {
  const params = new URLSearchParams({
    seed: state.seed,
    insuff: state.insufferability,
    emoji: state.emojiDensity,
    brag: state.humbleBrag,
    jargon: state.corporateJargon,
    length: state.postLength,
    roast: state.roastMode ? 1 : 0,
  });
  window.history.replaceState(null, "", `?${params.toString()}`);
}

function parseUrlState() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("seed")) return null;
  return {
    seed: Number(params.get("seed")) || randomSeed(),
    insufferability: clamp(Number(params.get("insuff"))),
    emojiDensity: clamp(Number(params.get("emoji"))),
    humbleBrag: clamp(Number(params.get("brag"))),
    corporateJargon: clamp(Number(params.get("jargon"))),
    postLength: clamp(Number(params.get("length"))),
    roastMode: params.get("roast") === "1",
  };
}

// --- dark mode ---
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem(THEME_KEY, theme);
}

applyTheme(
  localStorage.getItem(THEME_KEY) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
);

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// --- canvas PNG export ---
function wrapText(ctx, text, maxWidth, font) {
  ctx.font = font;
  const lines = [];
  text.split("\n\n").forEach((paragraph, i, arr) => {
    let current = "";
    paragraph.split(" ").forEach((word) => {
      const test = current ? `${current} ${word}` : word;
      if (current && ctx.measureText(test).width > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    });
    if (current) lines.push(current);
    if (i < arr.length - 1) lines.push("");
  });
  return lines;
}

function downloadCardAsPng(post, cringe) {
  const width = 640;
  const padding = 32;
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  const bodyFont = "15px -apple-system, sans-serif";
  const bodyLines = wrapText(measureCtx, post.text, width - padding * 2, bodyFont);

  const headerHeight = 70;
  const lineHeight = 24;
  const gaugeHeight = 40;
  const statsHeight = 36;
  const commentsHeight = post.postComments.length * 36 + 16;
  const height =
    padding * 2 + headerHeight + bodyLines.length * lineHeight + gaugeHeight + statsHeight + commentsHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // avatar
  ctx.fillStyle = post.character.color;
  ctx.beginPath();
  ctx.arc(padding + 24, padding + 24, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials(post.character.name), padding + 24, padding + 26);

  // name / title
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#1d1d1d";
  ctx.font = "bold 16px -apple-system, sans-serif";
  ctx.fillText(post.character.name, padding + 60, padding + 18);
  ctx.fillStyle = "#666666";
  ctx.font = "12px -apple-system, sans-serif";
  let title = post.character.title;
  while (ctx.measureText(title).width > width - padding * 2 - 60 && title.length > 3) {
    title = title.slice(0, -4) + "...";
  }
  ctx.fillText(title, padding + 60, padding + 36);

  // body
  let y = padding + headerHeight;
  ctx.fillStyle = "#1d1d1d";
  ctx.font = bodyFont;
  bodyLines.forEach((line) => {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  });

  // cringe gauge
  y += 6;
  ctx.fillStyle = "#e3ded4";
  ctx.fillRect(padding, y, width - padding * 2, 10);
  ctx.fillStyle = "#f5a623";
  ctx.fillRect(padding, y, ((width - padding * 2) * cringe.score) / 100, 10);
  y += 22;
  ctx.fillStyle = "#666666";
  ctx.font = "12px -apple-system, sans-serif";
  ctx.fillText(`CRINGE METER: ${cringe.score}% · ${cringe.label}`, padding, y);

  // stats
  y += 26;
  ctx.fillStyle = "#666666";
  ctx.font = "13px -apple-system, sans-serif";
  ctx.fillText(`\u{1F44D} ${post.likes} · \u{1F4AC} ${post.comments} comments · \u{1F501} ${post.reposts} reposts`, padding, y);

  // divider
  y += 12;
  ctx.strokeStyle = "#e3ded4";
  ctx.beginPath();
  ctx.moveTo(padding, y);
  ctx.lineTo(width - padding, y);
  ctx.stroke();

  // comments
  y += 20;
  post.postComments.forEach((comment) => {
    ctx.fillStyle = "#1d1d1d";
    ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.fillText(comment.name, padding, y);
    ctx.fillStyle = "#333333";
    ctx.font = "13px -apple-system, sans-serif";
    ctx.fillText(comment.text, padding, y + 16);
    y += 36;
  });

  const link = document.createElement("a");
  link.download = "broetry-post.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// --- rendering ---
function renderPost(post, state) {
  output.innerHTML = "";
  const cringe = computeCringe(state);

  const card = document.createElement("article");
  card.className = "post-card";

  const header = document.createElement("div");
  header.className = "post-header";
  header.innerHTML = `
    <div class="avatar" style="background: ${post.character.color}">${initials(post.character.name)}</div>
    <div>
      <div class="name">${post.character.name}</div>
      <div class="title">${post.character.title}</div>
    </div>
  `;

  const body = document.createElement("div");
  body.className = "post-body";
  body.textContent = post.text;

  const gauge = document.createElement("div");
  gauge.className = "cringe-gauge";
  gauge.innerHTML = `
    <div class="cringe-track"><div class="cringe-fill" style="width: ${cringe.score}%"></div></div>
    <span class="cringe-text">CRINGE METER: ${cringe.score}% · ${cringe.label}</span>
  `;

  const stats = document.createElement("div");
  stats.className = "post-stats";
  stats.textContent = `👍 ${post.likes.toLocaleString()} · 💬 ${post.comments.toLocaleString()} comments · 🔁 ${post.reposts.toLocaleString()} reposts`;

  const commentsEl = document.createElement("div");
  commentsEl.className = "comments";
  post.postComments.forEach((comment) => {
    const row = document.createElement("div");
    row.className = "comment-row";
    row.innerHTML = `<span class="comment-name">${comment.name}</span> <span class="comment-text">${comment.text}</span>`;
    commentsEl.append(row);
  });

  const actions = document.createElement("div");
  actions.className = "action-row";

  const copyBtn = document.createElement("button");
  copyBtn.textContent = "Copy text";
  copyBtn.className = "copy-btn";
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(post.text);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy text"), 1500);
  });

  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "⬇️ PNG";
  downloadBtn.className = "copy-btn";
  downloadBtn.addEventListener("click", () => downloadCardAsPng(post, cringe));

  const shareBtn = document.createElement("button");
  shareBtn.textContent = "🔗 Share";
  shareBtn.className = "copy-btn";
  shareBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href);
    shareBtn.textContent = "Link copied!";
    setTimeout(() => (shareBtn.textContent = "🔗 Share"), 1500);
  });

  actions.append(copyBtn, downloadBtn, shareBtn);
  card.append(header, body, gauge, stats, commentsEl, actions);
  output.append(card);
}

function renderHistoryStrip() {
  historyEl.innerHTML = "";
  postHistory.forEach((entry) => {
    const btn = document.createElement("button");
    btn.className = "history-item";
    const snippet = entry.post.text.split("\n\n")[0].slice(0, 44);
    btn.innerHTML = `
      <span class="history-avatar" style="background: ${entry.post.character.color}">${initials(entry.post.character.name)}</span>
      <span class="history-snippet">${snippet}${snippet.length === 44 ? "…" : ""}</span>
    `;
    btn.addEventListener("click", () => {
      setSliderValues(entry.state);
      roastCheckbox.checked = entry.state.roastMode;
      renderPost(entry.post, entry.state);
      updateUrl(entry.state);
    });
    historyEl.append(btn);
  });
}

function generateAndRender(explicitState) {
  const state = explicitState || { ...getSliderValues(), roastMode: roastCheckbox.checked, seed: randomSeed() };
  setSliderValues(state);
  roastCheckbox.checked = state.roastMode;

  const rng = createRng(state.seed);
  const post = generatePost(state.insufferability, state.emojiDensity, state.humbleBrag, state.corporateJargon, state.postLength, state.roastMode, rng);

  renderPost(post, state);
  updateUrl(state);

  postHistory.unshift({ state, post });
  postHistory = postHistory.slice(0, 5);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(postHistory));
  renderHistoryStrip();
}

generateBtn.addEventListener("click", () => generateAndRender());

randomizeBtn.addEventListener("click", () => {
  generateAndRender({
    insufferability: Math.floor(Math.random() * 101),
    emojiDensity: Math.floor(Math.random() * 101),
    humbleBrag: Math.floor(Math.random() * 101),
    corporateJargon: Math.floor(Math.random() * 101),
    postLength: Math.floor(Math.random() * 101),
    roastMode: Math.random() < 0.5,
    seed: randomSeed(),
  });
});

// Load from a shared link if present, otherwise generate fresh.
renderHistoryStrip();
generateAndRender(parseUrlState() || undefined);
