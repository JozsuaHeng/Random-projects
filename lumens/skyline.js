// Procedurally generates a detailed night-city skyline as an SVG string.
// Three depth layers of buildings, each with its own lit-window grid, plus
// a moon, drifting cloud bands, and a couple of aviation beacon lights.

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildingWindows(rng, x, y, w, h, cellW, cellH, litColorFn) {
  let out = "";
  const cols = Math.max(1, Math.floor((w - 6) / cellW));
  const rows = Math.max(1, Math.floor((h - 10) / cellH));
  const padX = (w - cols * cellW) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rng() > 0.62) continue;
      const wx = x + padX + c * cellW + 1.4;
      const wy = y + 6 + r * cellH + 1.4;
      out += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${(cellW - 2.4).toFixed(1)}" height="${(cellH - 2.4).toFixed(1)}" fill="${litColorFn(rng)}"/>`;
    }
  }
  return out;
}

function litColorFar(rng) {
  const r = rng();
  if (r < 0.75) return "rgba(232, 182, 76, 0.35)";
  return "rgba(140, 170, 210, 0.3)";
}

function litColorMid(rng) {
  const r = rng();
  if (r < 0.78) return "rgba(255, 207, 107, 0.55)";
  return "rgba(150, 190, 230, 0.45)";
}

function litColorNear(rng) {
  const r = rng();
  if (r < 0.8) return "rgba(255, 207, 107, 0.85)";
  return "rgba(170, 205, 240, 0.65)";
}

function buildingsLayer(rng, opts) {
  const { count, xSpan, yBase, minH, maxH, minW, maxW, color, cellW, cellH, litFn, jitter } = opts;
  let x = -20;
  let out = "";
  let beacons = "";
  const step = (xSpan + 40) / count;
  for (let i = 0; i < count; i++) {
    const w = minW + rng() * (maxW - minW);
    const h = minH + rng() * (maxH - minH);
    const bx = x + rng() * jitter;
    const by = yBase - h;
    out += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${color}"/>`;
    // occasional rooftop antenna / water tower silhouette
    if (rng() > 0.65) {
      const midX = bx + w * 0.5;
      out += `<rect x="${(midX - 1).toFixed(1)}" y="${(by - 10).toFixed(1)}" width="2" height="10" fill="${color}"/>`;
      if (rng() > 0.5) {
        beacons += `<circle class="beacon" cx="${midX.toFixed(1)}" cy="${(by - 11).toFixed(1)}" r="1.6" fill="#ff5c4d"/>`;
      }
    }
    out += buildingWindows(rng, bx, by, w, h, cellW, cellH, litFn);
    x += step;
  }
  return out + beacons;
}

function skylineSVG(seed) {
  const rng = mulberry32(seed);
  const far = buildingsLayer(rng, {
    count: 14, xSpan: 1200, yBase: 560, minH: 90, maxH: 190, minW: 60, maxW: 110,
    color: "#1c2438", cellW: 9, cellH: 11, litFn: litColorFar, jitter: 26,
  });
  const mid = buildingsLayer(rng, {
    count: 11, xSpan: 1200, yBase: 580, minH: 150, maxH: 300, minW: 70, maxW: 130,
    color: "#141a2c", cellW: 8, cellH: 10, litFn: litColorMid, jitter: 30,
  });
  const near = buildingsLayer(rng, {
    count: 8, xSpan: 1200, yBase: 610, minH: 230, maxH: 420, minW: 90, maxW: 160,
    color: "#0b0e1a", cellW: 7.5, cellH: 9.5, litFn: litColorNear, jitter: 34,
  });

  return `
  <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMax slice" class="skyline-svg">
    <defs>
      <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f4ecd8" stop-opacity="0.9"/>
        <stop offset="40%" stop-color="#f4ecd8" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#f4ecd8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="920" cy="110" r="90" fill="url(#moon-glow)"/>
    <circle cx="920" cy="110" r="30" fill="#f4ecd8"/>
    <circle cx="932" cy="100" r="26" fill="#0e1522" opacity="0.55"/>
    <rect x="600" y="60" width="420" height="16" rx="8" fill="#141a2c" opacity="0.35"/>
    <rect x="700" y="95" width="320" height="12" rx="6" fill="#141a2c" opacity="0.25"/>
    <g opacity="0.9">${far}</g>
    <g opacity="0.95">${mid}</g>
    <g>${near}</g>
  </svg>`;
}
