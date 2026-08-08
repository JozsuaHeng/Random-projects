// Converts real-world lat/lon into map.svg's own coordinate space, so city
// pins can be placed precisely rather than eyeballed. map.svg has no
// documented projection, so these constants were fit by least-squares
// regression against ~28 compact countries' bounding-box centers vs. their
// real-world geographic centroids (see CLAUDE.md for the method) — accurate
// to roughly 5-10px on this map, which is plenty for a glowing dot.
const PROJECTION = { a: 2.2815138214076116, b: 407.3119118487601, c: -2.751862174319685, d: 531.2834774511837 };

function project(lat, lon) {
  return { x: PROJECTION.a * lon + PROJECTION.b, y: PROJECTION.c * lat + PROJECTION.d };
}

// Shuffle-bag playback: walks a shuffled copy of FACTS so nothing repeats
// until every fact has been shown once, then reshuffles (never repeating
// the fact that just played, even across a reshuffle boundary).
let queue = [];
let queueIndex = 0;
let lastFactId = null;
let activeCountries = [];
let exploredCountries = new Set();
let activeCityKeys = [];
let exploredCityKeys = new Set();
let shownCount = 0;

const revealBtn = document.getElementById('reveal-btn');
const factPanel = document.getElementById('fact-panel');
const factCategory = document.getElementById('fact-category');
const factTitle = document.getElementById('fact-title');
const factPlace = document.getElementById('fact-place');
const factBody = document.getElementById('fact-body');
const factWiki = document.getElementById('fact-wiki');
const factImage = document.getElementById('fact-image');
const factImageImg = document.getElementById('fact-image-img');
const factImageCredit = document.getElementById('fact-image-credit');
const counter = document.getElementById('counter');
const intro = document.getElementById('intro');
const svgRoot = document.getElementById('world-map');
const pinLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
pinLayer.setAttribute('id', 'pins');
svgRoot.appendChild(pinLayer);

const pinEls = new Map();

function cityKey(city) {
  return city.name;
}

function getOrCreatePin(city) {
  const key = cityKey(city);
  if (pinEls.has(key)) return pinEls.get(key);
  const { x, y } = project(city.lat, city.lon);
  const ns = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(ns, 'g');
  g.setAttribute('class', 'pin');
  const halo = document.createElementNS(ns, 'circle');
  halo.setAttribute('cx', x);
  halo.setAttribute('cy', y);
  halo.setAttribute('r', 4.2);
  halo.setAttribute('class', 'pin-halo');
  const dot = document.createElementNS(ns, 'circle');
  dot.setAttribute('cx', x);
  dot.setAttribute('cy', y);
  dot.setAttribute('r', 1.6);
  dot.setAttribute('class', 'pin-dot');
  const title = document.createElementNS(ns, 'title');
  title.textContent = city.name;
  g.appendChild(title);
  g.appendChild(halo);
  g.appendChild(dot);
  pinLayer.appendChild(g);
  pinEls.set(key, g);
  return g;
}

function setPinState(city, state) {
  const el = getOrCreatePin(city);
  el.classList.remove('active', 'explored');
  if (state) el.classList.add(state);
}

function shuffledFactList() {
  const list = FACTS.slice();
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function nextFact() {
  if (queueIndex >= queue.length) {
    queue = shuffledFactList();
    queueIndex = 0;
    if (queue[0].id === lastFactId && queue.length > 1) {
      [queue[0], queue[1]] = [queue[1], queue[0]];
    }
  }
  const fact = queue[queueIndex];
  queueIndex++;
  lastFactId = fact.id;
  return fact;
}

function setCountryState(code, state) {
  const el = document.getElementById(code);
  if (!el) return;
  el.classList.remove('active', 'explored');
  if (state) el.classList.add(state);
}

function applyFact(fact) {
  const cities = fact.cities || [];

  // Countries: downgrade whatever was active to "explored" unless the new
  // fact touches the same country again, in which case it just stays active.
  const nextCountrySet = new Set(fact.countries);
  activeCountries.forEach((code) => {
    if (!nextCountrySet.has(code)) {
      exploredCountries.add(code);
      setCountryState(code, 'explored');
    }
  });
  fact.countries.forEach((code) => {
    exploredCountries.delete(code);
    setCountryState(code, 'active');
  });
  activeCountries = fact.countries;

  // Cities/pins: same active/explored handling, keyed by city name.
  const nextCityKeys = new Set(cities.map(cityKey));
  activeCityKeys.forEach((key) => {
    if (!nextCityKeys.has(key)) {
      exploredCityKeys.add(key);
      const el = pinEls.get(key);
      if (el) { el.classList.remove('active'); el.classList.add('explored'); }
    }
  });
  cities.forEach((city) => {
    exploredCityKeys.delete(cityKey(city));
    setPinState(city, 'active');
  });
  activeCityKeys = cities.map(cityKey);
}

// Renders one paragraph, turning the first occurrence of fact.wikiTerm
// (across the whole fact, tracked by the caller via `state`) into an inline
// link to fact.wiki — a highlighted keyword pointing at the same article
// the "Read more" link at the bottom goes to, not a second unrelated link.
function renderParagraph(text, fact, state) {
  const p = document.createElement('p');
  if (!state.done && fact.wikiTerm && text.includes(fact.wikiTerm)) {
    const idx = text.indexOf(fact.wikiTerm);
    const before = text.slice(0, idx);
    const term = text.slice(idx, idx + fact.wikiTerm.length);
    const after = text.slice(idx + fact.wikiTerm.length);
    if (before) p.appendChild(document.createTextNode(before));
    const a = document.createElement('a');
    a.href = fact.wiki;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'wiki-term';
    a.textContent = term;
    p.appendChild(a);
    if (after) p.appendChild(document.createTextNode(after));
    state.done = true;
  } else {
    p.textContent = text;
  }
  return p;
}

function renderFactImage(fact) {
  if (!fact.image) {
    factImage.classList.remove('visible');
    return;
  }
  // Hide the image slot until it's actually loaded, rather than showing a
  // broken-image icon if a remote thumbnail is slow or briefly unavailable.
  factImage.classList.remove('visible');
  factImageImg.onload = () => factImage.classList.add('visible');
  factImageImg.onerror = () => factImage.classList.remove('visible');
  factImageImg.src = fact.image.url;
  factImageImg.alt = fact.title;
  factImageCredit.textContent = fact.image.credit;
  factImageCredit.href = fact.image.creditUrl;
}

function renderFact(fact) {
  factPanel.classList.remove('visible');
  window.requestAnimationFrame(() => {
    renderFactImage(fact);
    factCategory.textContent = fact.category;
    factPlace.textContent = fact.place;
    factTitle.textContent = fact.title;
    factBody.innerHTML = '';
    const state = { done: false };
    fact.paragraphs.forEach((text) => {
      factBody.appendChild(renderParagraph(text, fact, state));
    });
    factWiki.href = fact.wiki;
    factPanel.classList.add('visible');
    document.body.classList.add('panel-open');
  });
}

function handleReveal() {
  const fact = nextFact();
  applyFact(fact);
  renderFact(fact);

  shownCount++;
  const placesTouched = exploredCountries.size + activeCountries.length + exploredCityKeys.size + activeCityKeys.length;
  counter.textContent = `${shownCount} fact${shownCount === 1 ? '' : 's'} uncovered · ${placesTouched} place${placesTouched === 1 ? '' : 's'} touched`;
  counter.classList.add('visible');

  if (intro) {
    intro.classList.add('hidden');
  }
  revealBtn.textContent = 'Reveal another';
  revealBtn.blur();
}

revealBtn.addEventListener('click', handleReveal);

// --- Theme toggle ---
const themeToggle = document.getElementById('theme-toggle');

function currentTheme() {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit) return explicit;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('factlas-theme', next);
});
