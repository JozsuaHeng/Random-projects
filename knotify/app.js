// Knotify — the one real feature. Everything else on the landing page is vaporware.

const KNOT_FACTORS = { knots: 1, kmh: 1.852, mph: 1.150779, ms: 0.514444 };

function initConverter(idPrefix) {
  const fields = {
    knots: document.getElementById(`${idPrefix}Knots`),
    kmh: document.getElementById(`${idPrefix}Kmh`),
    mph: document.getElementById(`${idPrefix}Mph`),
    ms: document.getElementById(`${idPrefix}Ms`),
  };
  if (!fields.knots) return;

  function recompute(sourceUnit) {
    const raw = Number(fields[sourceUnit].value);
    const knotsValue = Number.isFinite(raw) ? raw / KNOT_FACTORS[sourceUnit] : 0;
    for (const unit in fields) {
      if (unit === sourceUnit) continue;
      fields[unit].value = (knotsValue * KNOT_FACTORS[unit]).toFixed(2);
    }
  }

  for (const unit in fields) {
    fields[unit].addEventListener("input", () => recompute(unit));
  }

  recompute("knots");
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

initConverter("demo");
initConverter("tool");
initLiveStat();
