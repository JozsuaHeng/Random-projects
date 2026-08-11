// Procedurally generates a detailed night-city skyline as an SVG string.
// A starfield, three depth layers of buildings (one with a signature
// spire landmark), a moon, drifting cloud bands, and aviation beacons.

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function starfield(rng, count) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = rng() * 1200;
    const y = rng() * 380;
    if (x > 760 && x < 1080 && y < 260) continue; // leave room around the moon
    const r = 0.6 + rng() * 1.3;
    const o = 0.35 + rng() * 0.55;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#f2ecd8" opacity="${o.toFixed(2)}"/>`;
  }
  return out;
}

function buildingWindows(rng, x, y, w, h, cellW, cellH, litColorFn, density) {
  let out = "";
  const cols = Math.max(1, Math.floor((w - 8) / cellW));
  const rows = Math.max(1, Math.floor((h - 12) / cellH));
  const padX = (w - cols * cellW) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rng() > density) continue;
      const wx = x + padX + c * cellW + 1.6;
      const wy = y + 7 + r * cellH + 1.6;
      out += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${(cellW - 3).toFixed(1)}" height="${(cellH - 3).toFixed(1)}" fill="${litColorFn(rng)}"/>`;
    }
  }
  return out;
}

function litColorFar(rng) {
  return rng() < 0.75 ? "rgba(224, 182, 118, 0.32)" : "rgba(148, 175, 210, 0.26)";
}
function litColorMid(rng) {
  return rng() < 0.78 ? "rgba(240, 196, 126, 0.5)" : "rgba(158, 195, 225, 0.4)";
}
function litColorNear(rng) {
  return rng() < 0.8 ? "rgba(250, 206, 138, 0.72)" : "rgba(168, 205, 235, 0.55)";
}

function buildingsLayer(rng, opts) {
  const { count, xSpan, yBase, minH, maxH, minW, maxW, color, cellW, cellH, litFn, jitter, density } = opts;
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
    if (rng() > 0.65) {
      const midX = bx + w * 0.5;
      out += `<rect x="${(midX - 1).toFixed(1)}" y="${(by - 10).toFixed(1)}" width="2" height="10" fill="${color}"/>`;
      if (rng() > 0.6) {
        beacons += `<circle class="beacon" cx="${midX.toFixed(1)}" cy="${(by - 11).toFixed(1)}" r="1.6" fill="#e08a72"/>`;
      }
    }
    out += buildingWindows(rng, bx, by, w, h, cellW, cellH, litFn, density);
    x += step;
  }
  return out + beacons;
}

// A single tall, tapering landmark tower (Empire-State-ish silhouette) so
// the skyline has a clear focal building rather than reading as a flat,
// repetitive block of similar-height boxes.
function landmarkTower(rng, baseX, yBase) {
  const w = 74;
  const h = 300 + rng() * 60;
  const by = yBase - h;
  let out = `<rect x="${baseX}" y="${by}" width="${w}" height="${h}" fill="#0d1220"/>`;
  out += `<rect x="${baseX + 10}" y="${by - 22}" width="${w - 20}" height="22" fill="#0d1220"/>`;
  out += `<path d="M${baseX + 16} ${by - 22} L${baseX + w / 2} ${by - 92} L${baseX + w - 16} ${by - 22} Z" fill="#0d1220"/>`;
  out += `<rect x="${baseX + w / 2 - 1.4}" y="${by - 112}" width="2.8" height="20" fill="#0d1220"/>`;
  out += `<circle class="beacon" cx="${baseX + w / 2}" cy="${by - 113}" r="2" fill="#e08a72"/>`;
  // window columns, evenly lit for a proud/lived-in look rather than random gaps
  for (let r = 0; r < Math.floor((h - 20) / 13); r++) {
    for (let c = 0; c < 4; c++) {
      if (rng() > 0.62) continue;
      const wx = baseX + 9 + c * 14;
      const wy = by + 14 + r * 13;
      out += `<rect x="${wx}" y="${wy}" width="9" height="8" fill="${litColorNear(rng)}"/>`;
    }
  }
  return out;
}

function skylineSVG(seed) {
  const rng = mulberry32(seed);
  const stars = starfield(rng, 70);
  const far = buildingsLayer(rng, {
    count: 8, xSpan: 1200, yBase: 540, minH: 80, maxH: 180, minW: 90, maxW: 150,
    color: "#1c2438", cellW: 16, cellH: 18, litFn: litColorFar, jitter: 30, density: 0.16,
  });
  const mid = buildingsLayer(rng, {
    count: 6, xSpan: 1200, yBase: 560, minH: 130, maxH: 260, minW: 110, maxW: 180,
    color: "#141a2c", cellW: 15, cellH: 17, litFn: litColorMid, jitter: 34, density: 0.2,
  });
  const near = buildingsLayer(rng, {
    count: 4, xSpan: 1200, yBase: 590, minH: 190, maxH: 320, minW: 130, maxW: 210,
    color: "#0b0e1a", cellW: 14, cellH: 16, litFn: litColorNear, jitter: 40, density: 0.24,
  });
  const landmark = landmarkTower(rng, 420, 600);

  return `
  <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMax slice" class="skyline-svg">
    <defs>
      <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f0e6c8" stop-opacity="0.85"/>
        <stop offset="40%" stop-color="#f0e6c8" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#f0e6c8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="horizon-glow" cx="50%" cy="100%" r="70%">
        <stop offset="0%" stop-color="#e8a94c" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#e8a94c" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <g>${stars}</g>
    <circle cx="920" cy="110" r="95" fill="url(#moon-glow)"/>
    <circle cx="920" cy="110" r="32" fill="#f0e6c8" opacity="0.95"/>
    <circle cx="933" cy="99" r="27" fill="#0e1522" opacity="0.55"/>
    <rect x="600" y="60" width="420" height="16" rx="8" fill="#141a2c" opacity="0.3"/>
    <rect x="700" y="95" width="320" height="12" rx="6" fill="#141a2c" opacity="0.22"/>
    <ellipse cx="600" cy="620" rx="700" ry="180" fill="url(#horizon-glow)"/>
    <g opacity="0.92">${far}</g>
    <g opacity="0.96">${mid}</g>
    <g>${near}</g>
    <g>${landmark}</g>
  </svg>`;
}
