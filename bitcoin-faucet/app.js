// --- endless question generator ---
// Two sources, mixed at random: simple arithmetic (genuinely infinite —
// there's no pool to run out of, every pair of random numbers is a new
// question) and a pool of plain answerable trivia/word questions. Both
// are deliberately solvable — the joke is the endless grind, not that
// the questions themselves are unanswerable nonsense.

const TRIVIA = [
  "What is the capital of France?",
  "How many days are in a week?",
  "What color is the sky on a clear day?",
  "Spell the word “bitcoin.”",
  "What comes after Tuesday?",
  "How many letters are in the word “faucet”?",
  "Name a fruit.",
  "What is the opposite of “up”?",
  "How many sides does a triangle have?",
  "What do bees make?",
  "What is the freezing point of water in Celsius?",
  "Name a primary color.",
  "Type the word “satoshi” backwards.",
  "How many months are in a year?",
  "What is the largest planet in our solar system?",
  "What do you call a baby dog?",
  "Spell the word “blockchain.”",
  "What is the first letter of the alphabet?",
  "How many continents are there?",
  "What is the chemical symbol for water?",
  "Name a day of the week that starts with “S.”",
  "What is half of 100?",
  "Type any word that rhymes with “coin.”",
  "How many hours are in a day?",
  "What is the square root of 9?",
  "Name a country in Europe.",
  "What is the plural of “goose”?",
  "Type the number that comes after 41.",
  "What is 10 minus 3?",
  "How many minutes are in an hour?",
];

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 18) + 2;
  const b = Math.floor(Math.random() * 18) + 2;
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let x = a, y = b;
  if (op === "-" && y > x) [x, y] = [y, x];
  return `What is ${x} ${op} ${y}?`;
}

const VERIFYING_MESSAGES = [
  "Checking your answer…",
  "Confirming you are, in fact, a person…",
  "Mining your response…",
  "Validating on the blockchain (not really)…",
  "Waiting for 6 confirmations…",
];

const MILESTONES = {
  5: "5 questions down. 5 sanity points lost.",
  10: "Halfway there! (There is no halfway. There is no end.)",
  25: "You've now spent longer on this than most people spend choosing which altcoin to regret.",
  50: "50 questions. Somewhere, a real faucet gave out real Bitcoin in less time than this.",
  100: "Triple digits. Still no Lambo.",
  250: "At this point it's less “faucet” and more “lifestyle.”",
  500: "500 questions answered. The blockchain has confirmed more blocks than this page has given you Bitcoin.",
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let lastQuestion = "";
function generateQuestion() {
  let question;
  do {
    question = Math.random() < 0.5 ? generateMathQuestion() : randomFrom(TRIVIA);
  } while (question === lastQuestion);
  lastQuestion = question;
  return question;
}

// --- state ---

let questionCount = 0;
let available = 750;

const transcript = document.getElementById("transcript");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const reloadBtn = document.getElementById("reloadBtn");
const verifying = document.getElementById("verifying");
const availableEl = document.getElementById("available");

function showQuestion() {
  questionText.textContent = generateQuestion();
  answerInput.value = "";
  answerInput.focus();
}

function appendToTranscript(question, answer, n) {
  const item = document.createElement("div");
  item.className = "transcript-item";
  const q = document.createElement("p");
  q.className = "t-q";
  q.dataset.n = n;
  q.textContent = question;
  const a = document.createElement("p");
  a.className = "t-a";
  a.textContent = answer;
  item.append(q, a);
  transcript.appendChild(item);
}

function showMilestone(text) {
  const banner = document.createElement("div");
  banner.className = "milestone-banner";
  banner.textContent = text;
  transcript.appendChild(banner);
}

function handleSubmit() {
  const answer = answerInput.value.trim();
  if (!answer) {
    answerInput.classList.remove("shake");
    void answerInput.offsetWidth;
    answerInput.classList.add("shake");
    answerInput.focus();
    return;
  }

  questionCount++;
  appendToTranscript(questionText.textContent, answer, questionCount);

  available = Math.max(0, available - Math.floor(Math.random() * 2));
  availableEl.textContent = available;

  verifying.textContent = randomFrom(VERIFYING_MESSAGES);
  verifying.hidden = false;

  const milestoneNote = MILESTONES[questionCount];
  if (milestoneNote) showMilestone(milestoneNote);

  setTimeout(() => {
    verifying.hidden = true;
    showQuestion();
  }, 500 + Math.random() * 400);
}

submitBtn.addEventListener("click", handleSubmit);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});
reloadBtn.addEventListener("click", showQuestion);

showQuestion();
