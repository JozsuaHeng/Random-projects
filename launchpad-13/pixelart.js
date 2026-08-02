// ============================================================
// LAUNCHPAD-13 — pixelart.js
// Canvas drawing primitives: rocket sprites, pad/gantry/sky, and a
// small particle system for smoke, fire, and debris. Every draw call
// snaps to integer coordinates on a low-resolution canvas so the
// browser's "pixelated" image rendering keeps it chunky when scaled up.
// ============================================================

function preparePixelCanvas(canvas, logicalW, logicalH) {
  canvas.width = logicalW;
  canvas.height = logicalH;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

function px(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

// Draws a stepped (staircase) taper — the classic blocky pixel-art nose
// cone / fin silhouette — rather than a smooth polygon.
function drawTaper(ctx, color, cx, yTop, height, steps, widthStart, widthEnd) {
  const stepH = height / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1 || 1);
    const w = widthStart + (widthEnd - widthStart) * t;
    px(ctx, color, cx - w / 2, yTop + i * stepH, w, stepH + 0.5);
  }
}

// Lightens (positive amt) or darkens (negative amt) a "#rrggbb" color.
// Used to derive highlight/shadow tones from a single hull color instead
// of hand-picking every shade in data.js.
function shadeColor(hex, amt) {
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
  if (amt >= 0) {
    r += (255 - r) * amt;
    g += (255 - g) * amt;
    b += (255 - b) * amt;
  } else {
    r *= 1 + amt;
    g *= 1 + amt;
    b *= 1 + amt;
  }
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

// Hand-tuned nose-cone silhouettes, as a row-by-row width fraction of
// the base width (tip to base). A continuous curve formula degrades to
// a flat-looking triangle once it's only a few dozen pixels tall, so
// these are tuned by eye instead: "round" rounds out fast then eases
// into the body, "point" stays needle-thin then rushes to full width,
// "blunt" is a stubby capsule cap.
const NOSE_PROFILES = {
  round: [0.2, 0.38, 0.53, 0.65, 0.75, 0.83, 0.89, 0.94, 0.98, 1],
  point: [0.07, 0.12, 0.18, 0.25, 0.33, 0.43, 0.55, 0.68, 0.83, 1],
  blunt: [0.62, 0.8, 0.9, 0.95, 0.98, 1, 1, 1, 1, 1],
};

function drawDome(ctx, cx, yTop, h, wBase, colors, profile) {
  const rows = profile.length;
  for (let i = 0; i < rows; i++) {
    const w = wBase * profile[i];
    const rowH = h / rows + 0.6;
    const y = yTop + i * (h / rows);
    px(ctx, colors.mid, cx - w / 2, y, w, rowH);
    px(ctx, colors.dark, cx + w * 0.02, y, w * 0.46, rowH);
    px(ctx, colors.light, cx - w / 2, y, w * 0.3, rowH);
  }
}

// A shaded cylinder: flat rect body with a light column on the left, a
// dark column on the right, and the base "mid" tone in between.
function drawShadedColumn(ctx, x, y, w, h, colors) {
  px(ctx, colors.mid, x, y, w, h);
  px(ctx, colors.dark, x + w * 0.66, y, w * 0.34, h);
  px(ctx, colors.light, x, y, w * 0.3, h);
}

function hullColors(pal) {
  return { light: shadeColor(pal.hull, 0.24), mid: pal.hull, dark: pal.hullShadow };
}

function drawRocket(ctx, spec, geom) {
  const { cx, baseY, width, height, flameT = 0, boosterFlameT = 0, showFlame = true } = geom;
  const { palette: pal, build } = spec;
  const hc = hullColors(pal);
  const trimDark = shadeColor(pal.trim, -0.32);

  const noseFrac = build.nose === "blunt" ? 0.17 : build.nose === "round" ? 0.24 : 0.29;
  const finFrac = 0.13;
  const noseH = height * noseFrac;
  const finH = height * finFrac;
  const bodyH = height - noseH - finH;
  const bodyW = width * (build.bodyWidthFrac || 0.46);
  const bodyTop = baseY - height;
  const bodyBottom = bodyTop + noseH + bodyH;
  const finTop = bodyBottom - finH * 0.3;
  const noseProfile = NOSE_PROFILES[build.nose] || NOSE_PROFILES.point;

  // Boosters (drawn first so the body/fins overlap them at the root)
  if (build.boosters > 0 && showFlame !== "hide-boosters") {
    const bW = bodyW * 0.4;
    const bH = bodyH * (build.boosterHeightFrac || 0.55);
    const bTop = bodyBottom - bH;
    const spacing = bodyW * 0.92;
    for (let i = 0; i < build.boosters; i++) {
      const offset = (i - (build.boosters - 1) / 2) * spacing;
      const bx = cx + offset;
      drawDome(ctx, bx, bTop - bW * 0.55, bW * 0.55, bW, hc, NOSE_PROFILES.round);
      drawShadedColumn(ctx, bx - bW / 2, bTop, bW, bH, hc);
      px(ctx, trimDark, bx - bW / 2, bTop + bH * 0.08, bW, bH * 0.05);
      if (showFlame) drawFlame(ctx, bx, bTop + bH, bW * 0.9, pal, boosterFlameT, 0.6);
    }
  }

  // Fins — a small swept triangular silhouette with a darker
  // trailing-edge shade, instead of a stack of shrinking rectangles
  const finSpread = (build.fin === "wide" ? 0.5 : build.fin === "small" ? 0.2 : 0.34) * bodyW;
  const finSweep = build.fin === "sweep" ? finH * 0.7 : finH * 0.1;
  for (const side of [-1, 1]) {
    const rootX = cx + side * (bodyW / 2 - 0.5);
    const tipX = rootX + side * finSpread;
    const tipY = finTop + finH * 0.32 + finSweep;
    const backX = rootX + side * finSpread * 0.22;
    ctx.fillStyle = pal.trim;
    ctx.beginPath();
    ctx.moveTo(rootX, finTop);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(backX, finTop + finH);
    ctx.lineTo(rootX, finTop + finH * 0.82);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = trimDark;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(backX, finTop + finH);
    ctx.lineTo(rootX + side * finSpread * 0.42, finTop + finH * 0.66);
    ctx.closePath();
    ctx.fill();
  }

  // Body
  drawShadedColumn(ctx, cx - bodyW / 2, bodyTop + noseH, bodyW, bodyH, hc);

  // Shoulder highlight — a single bright line just under the nose joint
  px(ctx, hc.light, cx - bodyW / 2, bodyTop + noseH + bodyH * 0.02, bodyW, Math.max(1, bodyH * 0.012));

  if (build.stripes) {
    const stripeH = Math.max(1.5, bodyH * 0.055);
    px(ctx, pal.accent, cx - bodyW / 2, bodyTop + noseH + bodyH * 0.34, bodyW, stripeH);
    px(ctx, shadeColor(pal.accent, -0.25), cx - bodyW / 2, bodyTop + noseH + bodyH * 0.34 + stripeH, bodyW, Math.max(1, stripeH * 0.4));
  }

  // A couple of restrained panel lines rather than a busy greeble grid
  px(ctx, hc.dark, cx - bodyW / 2 + bodyW * 0.1, bodyTop + noseH + bodyH * 0.14, bodyW * 0.1, bodyH * 0.02);
  px(ctx, hc.dark, cx - bodyW / 2 + bodyW * 0.1, bodyTop + noseH + bodyH * 0.58, bodyW * 0.1, bodyH * 0.02);

  // Interstage ring — a thin dark band marking a stage separation
  px(ctx, hc.dark, cx - bodyW / 2, bodyTop + noseH - 1, bodyW, bodyH * 0.018 + 1);
  px(ctx, hc.dark, cx - bodyW / 2, bodyBottom - bodyH * 0.03, bodyW, bodyH * 0.018);

  // Window — a porthole: dark rim, glass color, and a tiny reflection dot
  const winSize = Math.max(2.5, bodyW * 0.24);
  const winX = cx - winSize / 2;
  const winY = bodyTop + noseH + bodyH * 0.16;
  px(ctx, hc.dark, winX - 1, winY - 1, winSize + 2, winSize + 2);
  px(ctx, pal.window, winX, winY, winSize, winSize);
  px(ctx, shadeColor(pal.window, 0.5), winX + winSize * 0.15, winY + winSize * 0.15, Math.max(1, winSize * 0.28), Math.max(1, winSize * 0.28));

  // Grid fins (decorative)
  if (build.gridfins) {
    const gfW = bodyW * 0.3;
    const gfH = bodyW * 0.52;
    for (const side of [-1, 1]) {
      const gx = cx + side * (bodyW / 2 + gfW * 0.42);
      const gy = bodyTop + noseH + bodyH * 0.05;
      px(ctx, pal.trim, gx - gfW / 2, gy, gfW, gfH);
      px(ctx, trimDark, gx - gfW / 2, gy, gfW, gfH * 0.14);
      px(ctx, trimDark, gx - gfW / 2, gy + gfH * 0.42, gfW, gfH * 0.1);
      px(ctx, trimDark, gx - gfW / 2, gy + gfH * 0.84, gfW, gfH * 0.1);
    }
  }

  // Landing legs (decorative, folded)
  if (build.legs) {
    const legW = bodyW * 0.16;
    for (const side of [-1, 1]) {
      const lx = cx + side * (bodyW / 2 - legW * 0.2);
      drawTaper(ctx, hc.dark, lx, bodyBottom - bodyH * 0.05, bodyH * 0.16, 3, legW, legW * 0.4);
    }
  }

  // Body flaps (Starship-style aerodynamic control surfaces)
  if (build.flaps) {
    const flapW = bodyW * 0.5;
    for (const side of [-1, 1]) {
      const fx = cx + side * bodyW / 2;
      ctx.fillStyle = hc.dark;
      ctx.beginPath();
      ctx.moveTo(fx, bodyTop + noseH + bodyH * 0.04);
      ctx.lineTo(fx + side * flapW, bodyTop + noseH + bodyH * 0.1);
      ctx.lineTo(fx, bodyTop + noseH + bodyH * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fx, bodyBottom - bodyH * 0.24);
      ctx.lineTo(fx + side * flapW * 0.8, bodyBottom - bodyH * 0.16);
      ctx.lineTo(fx, bodyBottom - bodyH * 0.06);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Nose cone — a rounded dome, drawn last so it sits atop the body
  drawDome(ctx, cx, bodyTop, noseH, bodyW, hc, noseProfile);

  // Launch escape tower (Soyuz-style spike above the nose)
  if (build.escapeTower) {
    const towerH = noseH * 1.1;
    drawTaper(ctx, pal.trim, cx, bodyTop - towerH, towerH, 6, 1, bodyW * 0.14);
    px(ctx, pal.trim, cx - bodyW * 0.13, bodyTop - towerH * 0.35, bodyW * 0.02, towerH * 0.35);
    px(ctx, pal.trim, cx + bodyW * 0.11, bodyTop - towerH * 0.35, bodyW * 0.02, towerH * 0.35);
  }

  // Aft skirt + engine nozzles at the base, drawn whether lit or not
  px(ctx, hc.dark, cx - bodyW / 2, bodyBottom, bodyW, finH * 0.12);
  const flameCount = spec.primary.count > 1 ? Math.min(5, spec.primary.count) : 1;
  const totalW = bodyW * 0.8;
  for (let i = 0; i < flameCount; i++) {
    const t = flameCount === 1 ? 0 : i / (flameCount - 1) - 0.5;
    const nx = cx + t * totalW;
    const nw = (totalW / flameCount) * 0.72;
    drawTaper(ctx, hc.dark, nx, bodyBottom + finH * 0.12, finH * 0.42, 3, nw * 0.55, nw);
    px(ctx, shadeColor(pal.hullShadow, 0.18), nx - nw * 0.36, bodyBottom + finH * 0.12, nw * 0.72, 1);
  }

  // Main engine flame
  if (showFlame) {
    for (let i = 0; i < flameCount; i++) {
      const t = flameCount === 1 ? 0 : i / (flameCount - 1) - 0.5;
      drawFlame(ctx, cx + t * totalW, bodyBottom + finH * 0.5, totalW / flameCount, pal, flameT, 1);
    }
  }

  return { bodyTop, bodyBottom, noseTipY: bodyTop, width: bodyW };
}

function drawFlame(ctx, cx, yTop, width, pal, t, scale) {
  const jitter = Math.sin(t * 13.1) * 0.5 + Math.sin(t * 27.7) * 0.3;
  const h = (width * 1.6 + jitter * width * 0.4) * scale;
  const w1 = width * (0.9 + jitter * 0.1);
  drawTaper(ctx, pal.flameOuter, cx, yTop, h, 5, w1, w1 * 0.15);
  drawTaper(ctx, pal.flameCore, cx, yTop, h * 0.6, 4, w1 * 0.55, w1 * 0.1);
}

// ---------------- Scene dressing: sky, pad, gantry ----------------

const SKY_GRADIENTS = {
  day: [
    [0, "#3c5a72"],
    [0.6, "#6d8a99"],
    [1, "#b7c2bd"],
  ],
  twilight: [
    [0, "#1b1436"],
    [0.55, "#4a2a5c"],
    [1, "#a85a4a"],
  ],
  night: [
    [0, "#080a1c"],
    [1, "#1c1638"],
  ],
};

function drawSky(ctx, w, h, time) {
  const stops = SKY_GRADIENTS[time] || SKY_GRADIENTS.twilight;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  for (const [t, color] of stops) grad.addColorStop(t, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawSun(ctx, x, y, r) {
  drawBlob(ctx, "#fff3c4", x - r, y - r, r * 2, r * 2, 10);
  drawBlob(ctx, "#ffe089", x - r * 0.6, y - r * 0.6, r * 1.2, r * 1.2, 6);
}

function drawStars(ctx, stars, alpha = 1) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  for (const s of stars) {
    px(ctx, s.c, s.x, s.y, 1, 1);
  }
  ctx.restore();
}

function makeStars(w, h, count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h * 0.7,
      c: Math.random() < 0.15 ? "#ffe9b0" : "#e6e6f0",
    });
  }
  return stars;
}

function drawGround(ctx, w, groundY, h, color = "#141021", lineColor = "#221c38") {
  px(ctx, color, 0, groundY, w, h - groundY);
  px(ctx, lineColor, 0, groundY, w, 2);
}

// A soft haze near the horizon — sells the "mysterious" atmosphere and
// helps the foreground layers blend together instead of reading as
// flat cutouts.
function drawFogBand(ctx, w, groundY, bandH, color) {
  const grad = ctx.createLinearGradient(0, groundY - bandH, 0, groundY);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, groundY - bandH, w, bandH);
}

function drawVignette(ctx, w, h) {
  const grad = ctx.createRadialGradient(w / 2, h * 0.5, h * 0.2, w / 2, h * 0.5, h * 0.8);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function makeWaterGlints(w, groundY, count) {
  const glints = [];
  for (let i = 0; i < count; i++) {
    glints.push({ x: Math.random() * w, y: 1 + Math.random() * 7, w: 3 + Math.random() * 6 });
  }
  return glints;
}

function drawWaterGlints(ctx, glints, groundY, color) {
  for (const g of glints) px(ctx, color, g.x, groundY - g.y, g.w, 1);
}

function drawFuelTanks(ctx, cx, groundY, offsetX, scale) {
  const tW = 9 * scale, tH = 15 * scale;
  const tx = cx + offsetX;
  drawBlob(ctx, "#3a3a44", tx - tW / 2, groundY - tH, tW, tW * 0.6, 4);
  px(ctx, "#3a3a44", tx - tW / 2, groundY - tH + tW * 0.3, tW, tH - tW * 0.3);
  px(ctx, "#26262e", tx - tW * 0.15, groundY - tH + tW * 0.5, tW * 0.15, tH - tW * 0.5);
}

function makeSkyLights(w, h, count) {
  const lights = [];
  for (let i = 0; i < count; i++) {
    lights.push({ x: Math.random() * w, y: h * 0.1 + Math.random() * h * 0.3, speed: 2 + Math.random() * 3, phase: Math.random() * 10 });
  }
  return lights;
}

function drawSkyLights(ctx, lights, w, clock) {
  for (const l of lights) {
    const x = ((l.x % (w + 10)) + (w + 10)) % (w + 10) - 5;
    if (Math.sin(clock * 3 + l.phase) > 0.6) px(ctx, "#ffe9b0", x, l.y, 1, 1);
  }
}

function updateSkyLights(lights, dt, w) {
  for (const l of lights) {
    l.x += l.speed * dt;
    if (l.x > w + 10) l.x = -10;
  }
}

function drawPad(ctx, cx, groundY, scale = 1) {
  px(ctx, "#3a3a44", cx - 26 * scale, groundY - 4, 52 * scale, 6);
  px(ctx, "#26262e", cx - 20 * scale, groundY - 4, 40 * scale, 3);
  px(ctx, "#0d0d12", cx - 6 * scale, groundY - 6, 12 * scale, 8);
}

function drawGantry(ctx, cx, groundY, height, offsetX, blink, scale = 1) {
  const gx = cx + offsetX;
  const w = Math.max(3, 6 * scale);
  px(ctx, "#565b66", gx, groundY - height, w, height);
  px(ctx, "#3a3e47", gx + w - Math.max(1, 2 * scale), groundY - height, Math.max(1, 2 * scale), height);
  const rungGap = Math.max(5, 9 * scale);
  const rungs = Math.floor(height / rungGap);
  for (let i = 0; i < rungs; i++) {
    const y = groundY - height + i * rungGap + 3;
    px(ctx, "#3a3e47", gx - 2 * scale, y, w + 4 * scale, 1);
  }
  const armY = groundY - height + 6;
  const armLen = (offsetX < 0 ? 14 : -14) * scale;
  px(ctx, "#565b66", offsetX < 0 ? gx + w : gx + armLen, armY, Math.abs(armLen), 2);
  if (blink) px(ctx, "#ff5a5a", gx + (offsetX < 0 ? -1 : w), groundY - height - 2, 2, 2);
}

function drawMoon(ctx, x, y, r) {
  drawBlob(ctx, "#e8e2c8", x - r, y - r, r * 2, r * 2, 10);
  drawBlob(ctx, "#c9c2a8", x - r + r * 0.7, y - r, r * 1.1, r * 1.6, 6);
}

function makeMountains(w, groundY, heightFrac, smooth = false) {
  const pts = [];
  let x = -20;
  const segMin = smooth ? 34 : 24;
  const segRange = smooth ? 24 : 30;
  const variance = smooth ? 0.25 : 0.7;
  while (x < w + 20) {
    const seg = segMin + Math.random() * segRange;
    pts.push({ x, h: groundY * heightFrac * (1 - variance + Math.random() * variance) });
    x += seg;
  }
  return pts;
}

function drawSnowCaps(ctx, pts, groundY, color) {
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    if (p.h > groundY * 0.16) px(ctx, color, p.x - 3, groundY - p.h, 6, 3);
  }
}

// Foreground silhouettes that hint at each launch site's terrain.
function makeGroundDecor(terrain, w) {
  const type = terrain === "tropical" ? "palm" : terrain === "desert" ? "cactus" : terrain === "alpine" ? "pine" : null;
  if (!type) return [];
  const items = [];
  let x = 14;
  while (x < w - 14) {
    items.push({ x, type, h: 9 + Math.random() * 12 });
    x += 26 + Math.random() * 46;
  }
  return items;
}

function drawGroundDecor(ctx, items, groundY, color) {
  for (const it of items) {
    if (it.type === "palm") {
      px(ctx, color, it.x, groundY - it.h, 2, it.h);
      for (const a of [-1, -0.35, 0.35, 1]) {
        px(ctx, color, it.x + a * 5 - 1, groundY - it.h - 2, Math.abs(a) * 4 + 2, 2);
      }
    } else if (it.type === "cactus") {
      px(ctx, color, it.x, groundY - it.h, 3, it.h);
      px(ctx, color, it.x - 4, groundY - it.h * 0.55, 3, it.h * 0.35);
      px(ctx, color, it.x + 4, groundY - it.h * 0.4, 3, it.h * 0.3);
    } else if (it.type === "pine") {
      drawTaper(ctx, color, it.x, groundY - it.h, it.h, 4, 1, it.h * 0.55);
    }
  }
}

function drawMountains(ctx, w, groundY, pts, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (const p of pts) ctx.lineTo(p.x, groundY - p.h);
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();
}

function makeSkyline(w, groundY, count) {
  const buildings = [];
  let x = 10;
  for (let i = 0; i < count; i++) {
    const bw = 4 + Math.random() * 7;
    const h = 6 + Math.random() * 22;
    const lit = [];
    for (let wy = 3; wy < h - 2; wy += 4) {
      if (Math.random() < 0.35) lit.push(wy);
    }
    buildings.push({ x, w: bw, h, lit });
    x += bw + 2 + Math.random() * 6;
    if (x > w - 10) break;
  }
  return buildings;
}

function drawSkyline(ctx, groundY, buildings, color, litColor) {
  for (const b of buildings) {
    px(ctx, color, b.x, groundY - b.h, b.w, b.h);
    for (const wy of b.lit) {
      px(ctx, litColor, b.x + b.w * 0.3, groundY - b.h + wy, 1, 1);
    }
  }
}

function makeClouds(w, h, count) {
  const clouds = [];
  for (let i = 0; i < count; i++) {
    clouds.push({
      x: Math.random() * w,
      y: h * 0.08 + Math.random() * h * 0.22,
      w: 14 + Math.random() * 16,
      speed: 1.5 + Math.random() * 2,
    });
  }
  return clouds;
}

function drawClouds(ctx, clouds, w, color) {
  for (const c of clouds) {
    const x = ((c.x % (w + 40)) + (w + 40)) % (w + 40) - 20;
    px(ctx, color, x, c.y, c.w, 2);
    px(ctx, color, x + c.w * 0.2, c.y - 2, c.w * 0.6, 2);
  }
}

function updateClouds(clouds, dt, w) {
  for (const c of clouds) {
    c.x += c.speed * dt;
    if (c.x > w + 40) c.x = -40;
  }
}

// ---------------- Item icons ----------------
//
// Every icon is drawn inside a size x size logical square using the
// same three-color scheme (body/accent/detail) from each item's `icon`
// spec in data.js. drawBlob() gives a chunky ellipse silhouette — the
// workhorse shape behind most of these.

function drawBlob(ctx, color, x, yTop, w, h, steps = 8) {
  const cx = x + w / 2;
  const rows = Math.max(3, Math.round(steps));
  for (let i = 0; i < rows; i++) {
    const t = (i + 0.5) / rows;
    const width = w * Math.sqrt(Math.max(0, 1 - Math.pow(2 * t - 1, 2)));
    const rowH = h / rows + 0.5;
    px(ctx, color, cx - width / 2, yTop + i * (h / rows), width, rowH);
  }
}

const ICON_DRAWERS = {
  duck(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.12, S * 0.42, S * 0.68, S * 0.46, 7);
    drawBlob(ctx, c.body, S * 0.34, S * 0.08, S * 0.4, S * 0.36, 6);
    px(ctx, c.accent, S * 0.68, S * 0.24, S * 0.22, S * 0.09);
    px(ctx, c.detail, S * 0.56, S * 0.16, S * 0.07, S * 0.07);
  },
  plant(ctx, c, S) {
    px(ctx, c.detail, S * 0.28, S * 0.62, S * 0.44, S * 0.3);
    px(ctx, c.accent, S * 0.32, S * 0.66, S * 0.36, S * 0.06);
    if (c.leafy) {
      drawBlob(ctx, c.body, S * 0.2, S * 0.2, S * 0.28, S * 0.42, 6);
      drawBlob(ctx, c.body, S * 0.48, S * 0.14, S * 0.3, S * 0.48, 6);
      drawBlob(ctx, c.accent, S * 0.36, S * 0.36, S * 0.24, S * 0.3, 5);
    } else {
      px(ctx, c.body, S * 0.4, S * 0.16, S * 0.2, S * 0.48);
      px(ctx, c.body, S * 0.22, S * 0.3, S * 0.18, S * 0.3);
      px(ctx, c.body, S * 0.6, S * 0.24, S * 0.18, S * 0.36);
      px(ctx, c.accent, S * 0.44, S * 0.22, S * 0.05, S * 0.36);
    }
  },
  jar(ctx, c, S) {
    px(ctx, c.detail, S * 0.34, S * 0.14, S * 0.32, S * 0.1);
    drawBlob(ctx, c.body, S * 0.2, S * 0.22, S * 0.6, S * 0.18, 4);
    px(ctx, c.body, S * 0.2, S * 0.34, S * 0.6, S * 0.44);
    drawBlob(ctx, c.body, S * 0.2, S * 0.7, S * 0.6, S * 0.18, 4);
    px(ctx, c.accent, S * 0.24, S * 0.4, S * 0.1, S * 0.3);
  },
  umbrella(ctx, c, S) {
    if (c.broken) {
      drawBlob(ctx, c.body, S * 0.14, S * 0.14, S * 0.5, S * 0.24, 5);
      px(ctx, c.detail, S * 0.44, S * 0.3, S * 0.06, S * 0.2);
      px(ctx, c.detail, S * 0.3, S * 0.5, S * 0.24, S * 0.06);
      px(ctx, c.accent, S * 0.36, S * 0.56, S * 0.06, S * 0.3);
    } else {
      drawBlob(ctx, c.body, S * 0.1, S * 0.14, S * 0.72, S * 0.32, 6);
      px(ctx, c.accent, S * 0.16, S * 0.24, S * 0.14, S * 0.14);
      px(ctx, c.accent, S * 0.56, S * 0.24, S * 0.14, S * 0.14);
      px(ctx, c.detail, S * 0.44, S * 0.42, S * 0.08, S * 0.44);
    }
  },
  battery(ctx, c, S) {
    px(ctx, c.body, S * 0.28, S * 0.16, S * 0.16, S * 0.06);
    px(ctx, c.body, S * 0.22, S * 0.22, S * 0.5, S * 0.62);
    px(ctx, c.detail, S * 0.28, S * 0.32, S * 0.38, S * 0.12);
    px(ctx, c.accent, S * 0.34, S * 0.5, S * 0.26, S * 0.2);
  },
  paper(ctx, c, S) {
    px(ctx, c.body, S * 0.2, S * 0.1, S * 0.6, S * 0.78);
    px(ctx, c.accent, S * 0.28, S * 0.24, S * 0.44, S * 0.06);
    px(ctx, c.accent, S * 0.28, S * 0.38, S * 0.44, S * 0.06);
    px(ctx, c.accent, S * 0.28, S * 0.52, S * 0.3, S * 0.06);
    px(ctx, c.detail, S * 0.2, S * 0.1, S * 0.6, S * 0.06);
  },
  disc(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.14, S * 0.14, S * 0.72, S * 0.72, 8);
    drawBlob(ctx, c.accent, S * 0.36, S * 0.36, S * 0.28, S * 0.28, 5);
    px(ctx, c.detail, S * 0.24, S * 0.24, S * 0.06, S * 0.06);
    px(ctx, c.detail, S * 0.7, S * 0.24, S * 0.06, S * 0.06);
    px(ctx, c.detail, S * 0.24, S * 0.7, S * 0.06, S * 0.06);
  },
  horn(ctx, c, S) {
    px(ctx, c.body, S * 0.1, S * 0.34, S * 0.4, S * 0.14);
    drawTaper(ctx, c.body, S * 0.62, S * 0.2, S * 0.3, 5, S * 0.14, S * 0.42);
    px(ctx, c.accent, S * 0.14, S * 0.36, S * 0.3, S * 0.05);
    px(ctx, c.detail, S * 0.34, S * 0.24, S * 0.06, S * 0.14);
  },
  tape(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.12, S * 0.24, S * 0.76, S * 0.52, 7);
    drawBlob(ctx, c.detail, S * 0.36, S * 0.4, S * 0.28, S * 0.2, 5);
    px(ctx, c.accent, S * 0.14, S * 0.48, S * 0.72, S * 0.06);
  },
  cylinder(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.28, S * 0.08, S * 0.44, S * 0.16, 4);
    px(ctx, c.body, S * 0.28, S * 0.16, S * 0.44, S * 0.68);
    drawBlob(ctx, c.body, S * 0.28, S * 0.76, S * 0.44, S * 0.16, 4);
    px(ctx, c.accent, S * 0.44, S * 0.02, S * 0.12, S * 0.1);
    px(ctx, c.detail, S * 0.32, S * 0.36, S * 0.36, S * 0.08);
  },
  tile(ctx, c, S) {
    px(ctx, c.detail, S * 0.16, S * 0.5, S * 0.68, S * 0.34);
    px(ctx, c.body, S * 0.16, S * 0.16, S * 0.68, S * 0.36);
    px(ctx, c.accent, S * 0.16, S * 0.16, S * 0.68, S * 0.06);
  },
  chute(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.08, S * 0.1, S * 0.84, S * 0.4, 6);
    px(ctx, c.detail, S * 0.46, S * 0.44, S * 0.08, S * 0.24);
    px(ctx, c.detail, S * 0.28, S * 0.44, S * 0.05, S * 0.2);
    px(ctx, c.detail, S * 0.66, S * 0.44, S * 0.05, S * 0.2);
    px(ctx, c.accent, S * 0.36, S * 0.68, S * 0.28, S * 0.18);
  },
  techbox(ctx, c, S) {
    px(ctx, c.body, S * 0.14, S * 0.16, S * 0.72, S * 0.62);
    if (c.variant === "vents") {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          px(ctx, c.accent, S * (0.22 + col * 0.18), S * (0.24 + row * 0.16), S * 0.1, S * 0.1);
        }
      }
    } else if (c.variant === "slot") {
      px(ctx, c.accent, S * 0.22, S * 0.26, S * 0.56, S * 0.14);
      px(ctx, c.detail, S * 0.22, S * 0.48, S * 0.56, S * 0.06);
    } else {
      px(ctx, c.accent, S * 0.22, S * 0.24, S * 0.56, S * 0.34);
    }
    if (c.blip) px(ctx, c.detail, S * 0.68, S * 0.66, S * 0.08, S * 0.08);
  },
  panel(ctx, c, S) {
    px(ctx, c.detail, S * 0.06, S * 0.16, S * 0.88, S * 0.62);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        px(ctx, c.body, S * (0.1 + col * 0.2), S * (0.2 + row * 0.19), S * 0.16, S * 0.15);
      }
    }
    px(ctx, c.accent, S * 0.06, S * 0.16, S * 0.88, S * 0.04);
  },
  satellite(ctx, c, S) {
    px(ctx, c.accent, S * 0.04, S * 0.36, S * 0.24, S * 0.3);
    px(ctx, c.accent, S * 0.72, S * 0.36, S * 0.24, S * 0.3);
    px(ctx, c.body, S * 0.34, S * 0.3, S * 0.32, S * 0.4);
    drawBlob(ctx, c.detail, S * 0.36, S * 0.12, S * 0.28, S * 0.2, 4);
  },
  dish(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.08, S * 0.14, S * 0.72, S * 0.42, 6);
    drawBlob(ctx, c.accent, S * 0.22, S * 0.24, S * 0.44, S * 0.24, 4);
    px(ctx, c.detail, S * 0.42, S * 0.5, S * 0.08, S * 0.34);
    px(ctx, c.detail, S * 0.3, S * 0.82, S * 0.32, S * 0.06);
  },
  ring(ctx, c, S) {
    const oh = c.flat ? S * 0.3 : S * 0.62;
    const oy = S * 0.5 - oh / 2;
    drawBlob(ctx, c.body, S * 0.1, oy, S * 0.8, oh, 8);
    const ih = oh * 0.42;
    const iy = S * 0.5 - ih / 2;
    drawBlob(ctx, "#191f42", S * 0.1 + S * 0.8 * 0.25, iy, S * 0.8 * 0.5, ih, 6);
    if (c.spokes) {
      px(ctx, c.detail, S * 0.48, oy, S * 0.04, oh);
      px(ctx, c.detail, S * 0.1, S * 0.5 - S * 0.02, S * 0.8, S * 0.04);
    }
    px(ctx, c.accent, S * 0.1, oy, S * 0.8, S * 0.06);
  },
  arm(ctx, c, S) {
    ctx.save();
    ctx.translate(S * 0.2, S * 0.72);
    ctx.rotate(-0.6);
    px(ctx, c.body, 0, -S * 0.06, S * 0.4, S * 0.12);
    ctx.translate(S * 0.4, 0);
    ctx.rotate(0.9);
    px(ctx, c.accent, 0, -S * 0.05, S * 0.32, S * 0.1);
    ctx.translate(S * 0.32, 0);
    px(ctx, c.detail, -S * 0.02, -S * 0.08, S * 0.12, S * 0.16);
    ctx.restore();
  },
  scope(ctx, c, S) {
    ctx.save();
    ctx.translate(S * 0.5, S * 0.5);
    ctx.rotate(-0.5);
    px(ctx, c.body, -S * 0.42, -S * 0.1, S * 0.6, S * 0.2);
    drawBlob(ctx, c.accent, S * 0.14, -S * 0.14, S * 0.26, S * 0.28, 5);
    px(ctx, c.detail, S * 0.2, -S * 0.06, S * 0.1, S * 0.12);
    ctx.restore();
  },
  firstaid(ctx, c, S) {
    px(ctx, c.body, S * 0.14, S * 0.2, S * 0.72, S * 0.6);
    px(ctx, c.accent, S * 0.14, S * 0.2, S * 0.72, S * 0.1);
    px(ctx, c.detail, S * 0.42, S * 0.36, S * 0.16, S * 0.36);
    px(ctx, c.detail, S * 0.32, S * 0.46, S * 0.36, S * 0.16);
  },
  shieldplates(ctx, c, S) {
    px(ctx, c.body, S * 0.12, S * 0.16, S * 0.76, S * 0.16);
    px(ctx, c.accent, S * 0.12, S * 0.36, S * 0.76, S * 0.16);
    px(ctx, c.body, S * 0.12, S * 0.56, S * 0.76, S * 0.16);
    px(ctx, c.detail, S * 0.12, S * 0.16, S * 0.06, S * 0.56);
  },
  purifier(ctx, c, S) {
    px(ctx, c.body, S * 0.18, S * 0.14, S * 0.64, S * 0.7);
    drawBlob(ctx, c.accent, S * 0.36, S * 0.32, S * 0.28, S * 0.34, 6);
    px(ctx, c.detail, S * 0.3, S * 0.66, S * 0.4, S * 0.08);
  },
  blanket(ctx, c, S) {
    px(ctx, c.body, S * 0.12, S * 0.16, S * 0.76, S * 0.68);
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.moveTo(S * 0.12, S * 0.5);
    ctx.lineTo(S * 0.5, S * 0.16);
    ctx.lineTo(S * 0.62, S * 0.16);
    ctx.lineTo(S * 0.24, S * 0.84);
    ctx.lineTo(S * 0.12, S * 0.84);
    ctx.closePath();
    ctx.fill();
    px(ctx, c.detail, S * 0.12, S * 0.16, S * 0.76, S * 0.06);
  },
  toolbox(ctx, c, S) {
    px(ctx, c.body, S * 0.1, S * 0.36, S * 0.8, S * 0.46);
    px(ctx, c.accent, S * 0.1, S * 0.36, S * 0.8, S * 0.08);
    ctx.strokeStyle = c.detail;
    ctx.lineWidth = S * 0.05;
    ctx.beginPath();
    ctx.arc(S * 0.5, S * 0.36, S * 0.16, Math.PI, 2 * Math.PI);
    ctx.stroke();
    px(ctx, c.detail, S * 0.46, S * 0.56, S * 0.08, S * 0.1);
  },
  bolt(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.2, S * 0.2, S * 0.6, S * 0.6, 7);
    drawBlob(ctx, "#191f42", S * 0.36, S * 0.36, S * 0.28, S * 0.28, 5);
    px(ctx, c.accent, S * 0.2, S * 0.46, S * 0.6, S * 0.08);
    px(ctx, c.detail, S * 0.46, S * 0.2, S * 0.08, S * 0.6);
  },
  pin(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.2, S * 0.1, S * 0.6, S * 0.5, 7);
    drawTaper(ctx, c.body, S * 0.5, S * 0.5, S * 0.3, 4, S * 0.3, S * 0.02);
    drawBlob(ctx, c.accent, S * 0.36, S * 0.24, S * 0.28, S * 0.22, 5);
    px(ctx, c.detail, S * 0.4, S * 0.86, S * 0.2, S * 0.06);
  },
  drone(ctx, c, S) {
    px(ctx, c.body, S * 0.36, S * 0.4, S * 0.28, S * 0.2);
    const armLen = S * 0.28;
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const ex = S * 0.5 + dx * armLen, ey = S * 0.5 + dy * armLen;
      px(ctx, c.detail, Math.min(S * 0.5, ex), Math.min(S * 0.5, ey), Math.abs(dx * armLen) || S * 0.03, Math.abs(dy * armLen) || S * 0.03);
      drawBlob(ctx, c.accent, ex - S * 0.08, ey - S * 0.08, S * 0.16, S * 0.16, 4);
    }
  },
  crate(ctx, c, S) {
    px(ctx, c.body, S * 0.14, S * 0.3, S * 0.72, S * 0.56);
    px(ctx, c.detail, S * 0.14, S * 0.46, S * 0.72, S * 0.04);
    px(ctx, c.detail, S * 0.14, S * 0.3, S * 0.04, S * 0.56);
    px(ctx, c.detail, S * 0.82, S * 0.3, S * 0.04, S * 0.56);
    px(ctx, c.accent, S * 0.44, S * 0.12, S * 0.06, S * 0.2);
    drawBlob(ctx, c.accent, S * 0.34, S * 0.06, S * 0.2, S * 0.16, 4);
  },
  vial(ctx, c, S) {
    px(ctx, c.detail, S * 0.38, S * 0.12, S * 0.24, S * 0.1);
    px(ctx, c.body, S * 0.4, S * 0.22, S * 0.2, S * 0.5);
    drawBlob(ctx, c.body, S * 0.4, S * 0.68, S * 0.2, S * 0.16, 4);
    drawBlob(ctx, c.accent, S * 0.4, S * 0.5, S * 0.2, S * 0.3, 4);
  },
  pouch(ctx, c, S) {
    px(ctx, c.body, S * 0.2, S * 0.28, S * 0.6, S * 0.56);
    px(ctx, c.detail, S * 0.2, S * 0.2, S * 0.6, S * 0.1);
    px(ctx, c.accent, S * 0.28, S * 0.4, S * 0.44, S * 0.08);
  },
  coffee(ctx, c, S) {
    px(ctx, c.body, S * 0.16, S * 0.14, S * 0.68, S * 0.4);
    px(ctx, c.detail, S * 0.36, S * 0.54, S * 0.28, S * 0.2);
    px(ctx, c.accent, S * 0.4, S * 0.58, S * 0.2, S * 0.12);
    px(ctx, c.accent, S * 0.42, S * 0.06, S * 0.04, S * 0.08);
    px(ctx, c.accent, S * 0.54, S * 0.06, S * 0.04, S * 0.08);
  },
  tablet(ctx, c, S) {
    px(ctx, c.body, S * 0.18, S * 0.1, S * 0.64, S * 0.8);
    px(ctx, c.accent, S * 0.24, S * 0.16, S * 0.52, S * 0.6);
    px(ctx, c.detail, S * 0.46, S * 0.82, S * 0.08, S * 0.04);
  },
  camera(ctx, c, S) {
    px(ctx, c.body, S * 0.12, S * 0.3, S * 0.76, S * 0.44);
    px(ctx, c.detail, S * 0.34, S * 0.2, S * 0.32, S * 0.12);
    drawBlob(ctx, c.accent, S * 0.34, S * 0.32, S * 0.32, S * 0.32, 6);
    px(ctx, c.detail, S * 0.44, S * 0.42, S * 0.12, S * 0.12);
  },
  patch(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.14, S * 0.14, S * 0.72, S * 0.72, 8);
    drawBlob(ctx, c.accent, S * 0.26, S * 0.26, S * 0.48, S * 0.48, 6);
    px(ctx, c.detail, S * 0.46, S * 0.36, S * 0.08, S * 0.08);
    px(ctx, c.detail, S * 0.4, S * 0.5, S * 0.2, S * 0.06);
  },
  flag(ctx, c, S) {
    px(ctx, c.detail, S * 0.2, S * 0.1, S * 0.05, S * 0.78);
    ctx.fillStyle = c.body;
    ctx.beginPath();
    ctx.moveTo(S * 0.25, S * 0.12);
    ctx.lineTo(S * 0.78, S * 0.28);
    ctx.lineTo(S * 0.25, S * 0.44);
    ctx.closePath();
    ctx.fill();
    px(ctx, c.accent, S * 0.36, S * 0.22, S * 0.14, S * 0.1);
  },
  capsule(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.14, S * 0.16, S * 0.72, S * 0.3, 5);
    px(ctx, c.body, S * 0.14, S * 0.32, S * 0.72, S * 0.4);
    px(ctx, c.accent, S * 0.14, S * 0.46, S * 0.72, S * 0.06);
    drawBlob(ctx, c.detail, S * 0.44, S * 0.5, S * 0.12, S * 0.12, 4);
  },
  suit(ctx, c, S) {
    drawBlob(ctx, c.accent, S * 0.32, S * 0.1, S * 0.36, S * 0.2, 5);
    drawBlob(ctx, c.body, S * 0.22, S * 0.26, S * 0.56, S * 0.52, 7);
    px(ctx, c.detail, S * 0.42, S * 0.4, S * 0.16, S * 0.3);
    drawBlob(ctx, c.body, S * 0.06, S * 0.32, S * 0.2, S * 0.34, 5);
    drawBlob(ctx, c.body, S * 0.74, S * 0.32, S * 0.2, S * 0.34, 5);
  },
  helmet(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.14, S * 0.1, S * 0.72, S * 0.68, 9);
    px(ctx, c.accent, S * 0.2, S * 0.4, S * 0.6, S * 0.26);
    px(ctx, c.detail, S * 0.2, S * 0.4, S * 0.6, S * 0.05);
  },
  pallet(ctx, c, S) {
    px(ctx, c.detail, S * 0.1, S * 0.78, S * 0.8, S * 0.1);
    px(ctx, c.body, S * 0.18, S * 0.4, S * 0.3, S * 0.38);
    px(ctx, c.accent, S * 0.52, S * 0.3, S * 0.3, S * 0.48);
    px(ctx, c.detail, S * 0.14, S * 0.56, S * 0.72, S * 0.06);
  },
  weights(ctx, c, S) {
    drawBlob(ctx, c.body, S * 0.14, S * 0.14, S * 0.36, S * 0.72, 8);
    drawBlob(ctx, c.accent, S * 0.5, S * 0.14, S * 0.36, S * 0.72, 8);
    px(ctx, c.detail, S * 0.42, S * 0.42, S * 0.16, S * 0.16);
  },
  beacon(ctx, c, S) {
    px(ctx, c.detail, S * 0.34, S * 0.6, S * 0.32, S * 0.24);
    drawBlob(ctx, c.body, S * 0.28, S * 0.34, S * 0.44, S * 0.32, 6);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = S * 0.05;
    ctx.beginPath();
    ctx.arc(S * 0.5, S * 0.5, S * 0.32, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(S * 0.5, S * 0.5, S * 0.42, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  },
};

function drawIcon(ctx, spec, S) {
  const fn = ICON_DRAWERS[spec.tpl] || ICON_DRAWERS.disc;
  fn(ctx, spec, S);
}

// A brief expanding condensation ring around the rocket body — the
// classic "punched through a cloud of its own vapor" launch moment.
function drawVaporRing(ctx, ring) {
  if (!ring) return;
  const alpha = Math.max(0, ring.life / ring.maxLife) * 0.5;
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#eef2f6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(ring.x, ring.y, ring.r, ring.r * 0.38, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// ---------------- Particle system ----------------

class Particle {
  constructor(x, y, vx, vy, size, color, life, gravity = 0, fade = true) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.gravity = gravity;
    this.fade = fade;
    this.rot = 0;
    this.vr = (Math.random() - 0.5) * 0.3;
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += this.gravity * dt;
    this.rot += this.vr * dt;
    this.life -= dt;
    return this.life > 0;
  }
  draw(ctx) {
    const lifeRatio = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = this.fade ? Math.min(1, lifeRatio * 1.4) : 1;
    ctx.translate(this.x, this.y);
    if (this.rot) ctx.rotate(this.rot);
    ctx.fillStyle = this.color;
    const s = this.size;
    ctx.fillRect(Math.round(-s / 2), Math.round(-s / 2), Math.round(s), Math.round(s));
    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }
  spawnSmoke(x, y, count) {
    for (let i = 0; i < count; i++) {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const speed = 6 + Math.random() * 14;
      this.particles.push(
        new Particle(
          x, y,
          Math.cos(ang) * speed * 0.4,
          Math.sin(ang) * speed - 8,
          2 + Math.random() * 3,
          Math.random() < 0.5 ? "#8f8f9a" : "#c4c4cf",
          0.8 + Math.random() * 0.7,
          -4
        )
      );
    }
  }
  spawnFire(x, y, count) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 60;
      this.particles.push(
        new Particle(
          x, y,
          Math.cos(ang) * speed,
          Math.sin(ang) * speed,
          2 + Math.random() * 3,
          Math.random() < 0.5 ? "#ffcf6b" : "#ff5a2d",
          0.25 + Math.random() * 0.35,
          40
        )
      );
    }
  }
  spawnDebris(x, y, count, colors) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 90;
      const p = new Particle(
        x, y,
        Math.cos(ang) * speed,
        Math.sin(ang) * speed - 30,
        2 + Math.random() * 3,
        colors[Math.floor(Math.random() * colors.length)],
        1.2 + Math.random() * 1.2,
        140,
        false
      );
      this.particles.push(p);
    }
  }
  spawnBigDebris(x, y, count, colors) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 70;
      const p = new Particle(
        x, y,
        Math.cos(ang) * speed,
        Math.sin(ang) * speed - 40,
        5 + Math.random() * 6,
        colors[Math.floor(Math.random() * colors.length)],
        1.6 + Math.random() * 1.4,
        150,
        false
      );
      p.vr = (Math.random() - 0.5) * 4;
      this.particles.push(p);
    }
  }
  spawnShockDust(x, y, count) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 40;
      this.particles.push(
        new Particle(x, y, Math.cos(ang) * speed, Math.sin(ang) * speed * 0.4, 1 + Math.random() * 2, "#d8d0c0", 0.5 + Math.random() * 0.4, 20)
      );
    }
  }
  update(dt) {
    this.particles = this.particles.filter((p) => p.update(dt));
  }
  draw(ctx) {
    for (const p of this.particles) p.draw(ctx);
  }
  get count() {
    return this.particles.length;
  }
}
