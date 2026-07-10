import { TEMPLATES, PALETTE, translationFor } from "./data.js";
import {
  randomizeValues,
  randomWordFor,
  fillSegments,
  randomAuthor,
  buzzwordDensity,
  fakeEngagement,
  fakeComments,
  randomRoastLine,
} from "./generator.js";

const templateSelect = document.getElementById("template-select");
const blanksList = document.getElementById("blanks-list");
const surpriseBtn = document.getElementById("surprise-btn");
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");
const roastToggle = document.getElementById("roast-toggle");

const emptyState = document.getElementById("empty-state");
const postCard = document.getElementById("post-card");
const auditPanel = document.getElementById("audit-panel");
const postBody = document.getElementById("post-body");
const roastLineEl = document.getElementById("roast-line");
const commentsSection = document.getElementById("comments-section");
const tooltip = document.getElementById("jargon-tooltip");

// Only these banks get the click-to-translate treatment -- they're the
// "corporate jargon" slots. Story elements (person, animal, place...) aren't.
const TRANSLATABLE_BANKS = new Set(["BUZZWORD", "VERB", "NOUN_ABSTRACT", "ADJECTIVE"]);

let currentTemplate = TEMPLATES[0];

function initials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function populateTemplateSelect() {
  templateSelect.innerHTML = "";
  for (const t of TEMPLATES) {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name;
    templateSelect.appendChild(opt);
  }
}

function renderBlanksForm(template, values = {}) {
  blanksList.innerHTML = "";
  template.blanks.forEach((blank, i) => {
    const li = document.createElement("li");
    li.className = "blank-item";

    const number = document.createElement("span");
    number.className = "blank-number";
    number.textContent = `${i + 1}`;

    const fields = document.createElement("div");
    fields.className = "blank-fields";

    const label = document.createElement("label");
    label.setAttribute("for", `blank-${blank.key}`);
    label.textContent = blank.label;

    const row = document.createElement("div");
    row.className = "field-row";

    const input = document.createElement("input");
    input.id = `blank-${blank.key}`;
    input.type = "text";
    input.dataset.key = blank.key;
    input.value = values[blank.key] || "";
    input.placeholder = `e.g. ${randomWordFor(blank.bank)}`;

    const diceBtn = document.createElement("button");
    diceBtn.type = "button";
    diceBtn.className = "btn-dice";
    diceBtn.title = "Randomize this field";
    diceBtn.setAttribute("aria-label", `Randomize ${blank.label}`);
    diceBtn.textContent = "🎲";
    diceBtn.addEventListener("click", () => {
      input.value = randomWordFor(blank.bank);
    });

    row.appendChild(input);
    row.appendChild(diceBtn);

    fields.appendChild(label);
    fields.appendChild(row);

    li.appendChild(number);
    li.appendChild(fields);
    blanksList.appendChild(li);
  });
}

function collectValues(template) {
  const values = {};
  for (const blank of template.blanks) {
    const input = document.getElementById(`blank-${blank.key}`);
    values[blank.key] = input ? input.value : "";
  }
  return values;
}

function hideTooltip() {
  tooltip.classList.add("hidden");
}

function showTooltip(anchorEl, text) {
  tooltip.textContent = text;
  tooltip.classList.remove("hidden");
  const rect = anchorEl.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  const top = rect.top + window.scrollY - tipRect.height - 8;
  const left = rect.left + window.scrollX + rect.width / 2 - tipRect.width / 2;
  tooltip.style.top = `${Math.max(8, top)}px`;
  tooltip.style.left = `${Math.max(8, left)}px`;
}

// Renders the post body as DOM nodes (not one text blob) so buzzword blanks
// can be highlighted and jargon-bank blanks can be made clickable.
function renderPostBody(template, values) {
  postBody.innerHTML = "";
  const segments = fillSegments(template, values);
  for (const seg of segments) {
    if (seg.type === "text") {
      postBody.appendChild(document.createTextNode(seg.value));
      continue;
    }
    if (seg.bank === "BUZZWORD") {
      const mark = document.createElement("mark");
      mark.className = "buzzword";
      mark.textContent = seg.value;
      postBody.appendChild(mark);
      continue;
    }
    if (TRANSLATABLE_BANKS.has(seg.bank)) {
      const span = document.createElement("span");
      span.className = "jargon-word";
      span.tabIndex = 0;
      span.textContent = seg.value;
      const translation = translationFor(seg.bank, seg.value);
      span.addEventListener("click", (e) => {
        e.stopPropagation();
        showTooltip(span, `"${seg.value}" really means: ${translation}`);
      });
      span.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showTooltip(span, `"${seg.value}" really means: ${translation}`);
        }
      });
      postBody.appendChild(span);
      continue;
    }
    postBody.appendChild(document.createTextNode(seg.value));
  }
}

function renderComments(authorName) {
  const comments = fakeComments(2 + Math.floor(Math.random() * 3), authorName);
  commentsSection.innerHTML = "";
  for (const { author, text } of comments) {
    const row = document.createElement("div");
    row.className = "comment-row";

    const avatar = document.createElement("div");
    avatar.className = "comment-avatar";
    avatar.textContent = initials(author.name);
    avatar.style.background = PALETTE[author.color % PALETTE.length];

    const body = document.createElement("div");
    body.className = "comment-body";
    const name = document.createElement("span");
    name.className = "comment-name";
    name.textContent = author.name;
    const bubble = document.createElement("p");
    bubble.className = "comment-text";
    bubble.textContent = text;
    body.appendChild(name);
    body.appendChild(bubble);

    row.appendChild(avatar);
    row.appendChild(body);
    commentsSection.appendChild(row);
  }
  commentsSection.classList.remove("hidden");
}

function renderPost(template, values) {
  const author = randomAuthor();
  const engagement = fakeEngagement();
  const density = buzzwordDensity(template, values);

  const avatar = document.getElementById("post-avatar");
  avatar.textContent = initials(author.name);
  avatar.style.background = PALETTE[author.color % PALETTE.length];

  document.getElementById("post-name").textContent = author.name;
  document.getElementById("post-headline").textContent = author.headline;
  renderPostBody(template, values);

  if (roastToggle.checked) {
    roastLineEl.textContent = randomRoastLine();
    roastLineEl.classList.remove("hidden");
  } else {
    roastLineEl.classList.add("hidden");
  }

  document.getElementById("post-reactions").textContent = `👍 ${engagement.reactions.toLocaleString()}`;
  document.getElementById("post-comments").textContent = `💬 ${engagement.comments.toLocaleString()} comments`;
  document.getElementById("post-reposts").textContent = `🔁 ${engagement.reposts.toLocaleString()} reposts`;

  const buzzEl = document.getElementById("audit-buzzword");
  buzzEl.textContent = `${density}%`;
  buzzEl.style.color = density >= 60 ? "var(--pink)" : density >= 30 ? "var(--orange)" : "var(--teal)";

  renderComments(author.name);

  copyBtn.textContent = "📋 Copy post text";

  emptyState.classList.add("hidden");
  postCard.classList.remove("hidden");
  auditPanel.classList.remove("hidden");
  copyBtn.classList.remove("hidden");
}

templateSelect.addEventListener("change", () => {
  currentTemplate = TEMPLATES.find((t) => t.id === templateSelect.value);
  renderBlanksForm(currentTemplate);
  emptyState.classList.remove("hidden");
  postCard.classList.add("hidden");
  auditPanel.classList.add("hidden");
  copyBtn.classList.add("hidden");
});

surpriseBtn.addEventListener("click", () => {
  currentTemplate = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  templateSelect.value = currentTemplate.id;
  const values = randomizeValues(currentTemplate);
  renderBlanksForm(currentTemplate, values);
  renderPost(currentTemplate, values);
});

generateBtn.addEventListener("click", () => {
  const values = collectValues(currentTemplate);
  renderPost(currentTemplate, values);
});

copyBtn.addEventListener("click", async () => {
  let text = postBody.textContent;
  if (!roastLineEl.classList.contains("hidden")) {
    text += `\n\n${roastLineEl.textContent}`;
  }
  await navigator.clipboard.writeText(text);
  copyBtn.textContent = "✅ Copied!";
  setTimeout(() => {
    copyBtn.textContent = "📋 Copy post text";
  }, 1500);
});

document.addEventListener("click", hideTooltip);
window.addEventListener("scroll", hideTooltip, true);

populateTemplateSelect();
renderBlanksForm(currentTemplate);
