// Knotify — three real converters. Everything else on the page is vaporware.

const SPEED_FACTORS = { knots: 1, kmh: 1.852, mph: 1.150779, ms: 0.514444 };
const DEPTH_FACTORS = { fathoms: 1, meters: 1.8288, feet: 6 };

const BEAUFORT_SCALE = [
  { max: 1, force: 0, label: "Calm" },
  { max: 3, force: 1, label: "Light Air" },
  { max: 6, force: 2, label: "Light Breeze" },
  { max: 10, force: 3, label: "Gentle Breeze" },
  { max: 16, force: 4, label: "Moderate Breeze" },
  { max: 21, force: 5, label: "Fresh Breeze" },
  { max: 27, force: 6, label: "Strong Breeze" },
  { max: 33, force: 7, label: "Near Gale" },
  { max: 40, force: 8, label: "Gale" },
  { max: 47, force: 9, label: "Strong Gale" },
  { max: 55, force: 10, label: "Storm" },
  { max: 63, force: 11, label: "Violent Storm" },
  { max: Infinity, force: 12, label: "Hurricane Force" },
];

function beaufortFromKnots(knots) {
  return BEAUFORT_SCALE.find((b) => knots <= b.max) || BEAUFORT_SCALE[BEAUFORT_SCALE.length - 1];
}

// Informal displacement/planing speed bands — not an official scale like
// Beaufort, but a widely-used rule of thumb (hull speed vs. planing).
const SPEED_CLASS_SCALE = [
  { max: 5, label: "Displacement / Trolling" },
  { max: 12, label: "Cruising" },
  { max: 25, label: "Planing" },
  { max: Infinity, label: "High-Performance" },
];

// Recreational dive-depth bands, roughly matching PADI certification limits.
const DIVE_ZONE_SCALE = [
  { max: 12, label: "Open Water" },
  { max: 18, label: "Advanced Open Water" },
  { max: 30, label: "Deep Diving" },
  { max: 40, label: "Technical Diving" },
  { max: Infinity, label: "Extended Range" },
];

function classify(value, scale) {
  return (scale.find((b) => value <= b.max) || scale[scale.length - 1]).label;
}

// Generic bidirectional converter: typing in any field recomputes the rest
// from a shared base value, using `factors` (each unit's multiplier relative
// to whichever unit has factor 1).
function wireLinear(fields, factors, seedUnit) {
  const present = Object.keys(fields).filter((unit) => fields[unit]);
  if (present.length === 0) return null;

  function recompute(sourceUnit) {
    const raw = Number(fields[sourceUnit].value);
    const baseValue = Number.isFinite(raw) ? raw / factors[sourceUnit] : 0;
    for (const unit of present) {
      if (unit === sourceUnit) continue;
      fields[unit].value = (baseValue * factors[unit]).toFixed(2);
    }
    return baseValue;
  }

  for (const unit of present) {
    fields[unit].addEventListener("input", () => recompute(unit));
  }
  recompute(seedUnit);
  return recompute;
}

function initSpeedConverter(prefix) {
  const fields = {
    knots: document.getElementById(`${prefix}Knots`),
    kmh: document.getElementById(`${prefix}Kmh`),
    mph: document.getElementById(`${prefix}Mph`),
    ms: document.getElementById(`${prefix}Ms`),
  };
  if (!fields.knots) return;
  const classEl = document.getElementById(`${prefix}Class`);

  wireLinear(fields, SPEED_FACTORS, "knots");

  function updateClass() {
    const knots = Number(fields.knots.value) || 0;
    if (classEl) classEl.textContent = `Speed Class — ${classify(knots, SPEED_CLASS_SCALE)}`;
  }
  for (const unit in fields) fields[unit].addEventListener("input", updateClass);
  updateClass();
}

function initDepthConverter(prefix) {
  const fields = {
    fathoms: document.getElementById(`${prefix}Fathoms`),
    meters: document.getElementById(`${prefix}Meters`),
    feet: document.getElementById(`${prefix}Feet`),
  };
  if (!fields.fathoms) return;
  const zoneEl = document.getElementById(`${prefix}Zone`);

  wireLinear(fields, DEPTH_FACTORS, "fathoms");

  function updateZone() {
    const meters = Number(fields.meters.value) || 0;
    if (zoneEl) zoneEl.textContent = `Dive Zone — ${classify(meters, DIVE_ZONE_SCALE)}`;
  }
  for (const unit in fields) fields[unit].addEventListener("input", updateZone);
  updateZone();
}

function initWindConverter(prefix) {
  const fields = {
    knots: document.getElementById(`${prefix}Knots`),
    kmh: document.getElementById(`${prefix}Kmh`),
    mph: document.getElementById(`${prefix}Mph`),
  };
  if (!fields.knots) return;
  const beaufortEl = document.getElementById(`${prefix}Beaufort`);

  wireLinear(fields, SPEED_FACTORS, "knots");

  function updateBeaufort() {
    const knots = Number(fields.knots.value) || 0;
    const { force, label } = beaufortFromKnots(knots);
    if (beaufortEl) beaufortEl.textContent = `Force ${force} — ${label}`;
  }
  for (const unit in fields) fields[unit].addEventListener("input", updateBeaufort);
  updateBeaufort();
}

// The classic cheap-SaaS "live activity" ticker — fake, and not trying hard to hide it.
function initLiveStat() {
  const el = document.getElementById("liveStat");
  if (!el) return;
  let count = 1247;
  el.textContent = count.toLocaleString();
  setInterval(() => {
    count += Math.floor(Math.random() * 3) + 1;
    el.textContent = count.toLocaleString();
  }, 2200);
}

// Pricing monthly/yearly toggle, guilt-trip style: swap an `active` class on
// the buttons and a `yearly` class on the grid; CSS shows/hides the rest.
function initPricingToggle() {
  const grid = document.getElementById("pricingGrid");
  const buttons = document.querySelectorAll(".price-toggle button");
  if (!grid || buttons.length === 0) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      grid.classList.toggle("yearly", btn.dataset.period === "yearly");
    });
  });
}

for (const prefix of ["demoSpeed", "toolSpeed"]) initSpeedConverter(prefix);
for (const prefix of ["demoWind", "toolWind"]) initWindConverter(prefix);
for (const prefix of ["demoDepth", "toolDepth"]) initDepthConverter(prefix);
initLiveStat();
initPricingToggle();
