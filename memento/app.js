(() => {
  const MS_DAY = 86400000;
  const DAYS_PER_YEAR = 365.2425;
  const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;
  const DIVISOR = { days: 1, weeks: 7, months: DAYS_PER_MONTH, years: DAYS_PER_YEAR };
  const UNIT_LABEL = {
    days: ["day", "days"],
    weeks: ["week", "weeks"],
    months: ["month", "months"],
    years: ["year", "years"],
  };

  // Landscape, not the old 1080x1920 portrait/story shape — a portrait card
  // is inherently narrow next to a landscape monitor and can't be made
  // meaningfully bigger there without just getting taller (see CLAUDE.md).
  // 1800x1200 (3:2) lets the card actually grow to fill the space next to
  // the sidebar on desktop instead of leaving a gap in the middle.
  const CANVAS_W = 1800;
  const CANVAS_H = 1200;
  const STAGE_X = 90;
  const STAGE_W = CANVAS_W - STAGE_X * 2;
  const TARGET_DOTS = 640;

  // Deep, saturated tones meant for a light/cream background, not the pale
  // "glows brightly on near-black" palette from earlier — see the "no glow"
  // comment in drawStatic for why glow got dropped entirely, on any bg.
  const THEMES = {
    gold: { accent: "#a97a2e", accentBright: "#7a5218" },
    rose: { accent: "#b15a68", accentBright: "#833e49" },
    jade: { accent: "#4f8467", accentBright: "#35604a" },
    ice: { accent: "#3f6f95", accentBright: "#2b4e6b" },
    bone: { accent: "#6b6255", accentBright: "#463f34" },
  };

  const dobInput = document.getElementById("dob");
  const lifespanRange = document.getElementById("lifespanRange");
  const lifespanNumber = document.getElementById("lifespanNumber");
  const unitToggle = document.getElementById("unitToggle");
  const modeToggle = document.getElementById("modeToggle");
  const themeToggle = document.getElementById("themeToggle");
  const sampleNote = document.getElementById("sampleNote");
  const exportBtn = document.getElementById("exportBtn");
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const buffer = document.createElement("canvas");
  buffer.width = CANVAS_W;
  buffer.height = CANVAS_H;
  const bctx = buffer.getContext("2d");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sampleDob = new Date(today.getTime() - 30 * DAYS_PER_YEAR * MS_DAY);

  const state = {
    dob: null,
    lifespanYears: 80,
    unit: "days",
    mode: "grid",
    theme: "gold",
  };

  let rafId = null;
  let renderStart = 0;
  let currentPositions = [];
  let todayIndex = -1;

  function mulberry32(seed) {
    let a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pluralize(unit, n) {
    const [singular, plural] = UNIT_LABEL[unit];
    return Math.round(n) === 1 ? singular : plural;
  }

  function formatNumber(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  function hexToRgba(hex, alpha) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function applyTheme(key) {
    const t = THEMES[key] || THEMES.gold;
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent-bright", t.accentBright);
  }

  function computeData() {
    const dob = state.dob || sampleDob;
    const totalDays = state.lifespanYears * DAYS_PER_YEAR;
    let livedDays = (Date.now() - dob.getTime()) / MS_DAY;
    livedDays = Math.max(0, Math.min(livedDays, totalDays));
    const percent = totalDays > 0 ? (livedDays / totalDays) * 100 : 0;
    const exceeded = livedDays >= totalDays;
    const remainingDays = Math.max(0, totalDays - livedDays);

    const divisor = DIVISOR[state.unit];
    const totalUnits = Math.max(1, Math.round(totalDays / divisor));
    let livedUnits = Math.round(livedDays / divisor);
    livedUnits = Math.max(0, Math.min(livedUnits, totalUnits));
    const remainingUnits = Math.max(0, totalUnits - livedUnits);

    // Rendering one dot per raw unit falls apart once there are thousands of
    // them (default 80y in "days" is ~29,200) — they pack so tight they read
    // as static instead of dots, and overlapping fills wash out the muted/
    // solid contrast. So the *dot count* is capped independently of the
    // precise headline numbers above: each dot can stand in for a group of
    // units, and a caption discloses that when it's not 1-for-1.
    const groupSize = Math.max(1, Math.ceil(totalUnits / TARGET_DOTS));
    const dotTotal = Math.max(1, Math.ceil(totalUnits / groupSize));
    const dotLived = Math.max(0, Math.min(dotTotal, Math.round(livedUnits / groupSize)));

    return {
      totalUnits,
      livedUnits,
      remainingUnits,
      remainingDays,
      percent,
      exceeded,
      lifespanYears: state.lifespanYears,
      unit: state.unit,
      isSample: !state.dob,
      groupSize,
      dotTotal,
      dotLived,
    };
  }

  // Grid and constellation reuse the same evenly-spaced "slots" (grid gives
  // the raw slot centers, constellation just jitters each one) so lived/
  // remaining share one consistent left-to-right, top-to-bottom order across
  // both modes, matching a chronological reading order.
  function gridSlots(n, bounds) {
    const cols = Math.max(1, Math.ceil(Math.sqrt((n * bounds.w) / bounds.h)));
    const rows = Math.max(1, Math.ceil(n / cols));
    const cellW = bounds.w / cols;
    const cellH = bounds.h / rows;
    const slots = [];
    for (let i = 0; i < n; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      slots.push({ x: bounds.x + cellW * (col + 0.5), y: bounds.y + cellH * (row + 0.5) });
    }
    const r = Math.max(1, Math.min(cellW, cellH) * 0.28);
    return { slots, r };
  }

  function layoutGrid(n, bounds) {
    const { slots, r } = gridSlots(n, bounds);
    return { positions: slots.map((s) => ({ x: s.x, y: s.y, r })), r };
  }

  function layoutConstellation(n, bounds) {
    const { slots, r } = gridSlots(n, bounds);
    const rng = mulberry32(42);
    const cellW = slots.length > 1 ? Math.abs((slots[1] && slots[1].x) - slots[0].x) || bounds.w : bounds.w;
    const jitter = Math.max(cellW * 0.32, r * 2);
    const positions = slots.map((s) => ({
      x: s.x + (rng() - 0.5) * jitter,
      y: s.y + (rng() - 0.5) * jitter,
      r: r * (0.55 + rng() * 0.85),
    }));
    return { positions, r };
  }

  function layoutRings(n, bounds) {
    const cx = bounds.x + bounds.w / 2;
    const cy = bounds.y + bounds.h / 2;
    const maxRadius = Math.min(bounds.w, bounds.h) / 2;
    const innerPad = maxRadius * 0.22;
    const ringCount = Math.max(1, Math.min(10, n));

    const radii = [];
    for (let k = 0; k < ringCount; k++) {
      radii.push(innerPad + ((maxRadius - innerPad) * (k + 1)) / ringCount);
    }
    const totalWeight = radii.reduce((a, b) => a + b, 0);
    const counts = radii.map((r) => Math.max(1, Math.round((n * r) / totalWeight)));
    let diff = n - counts.reduce((a, b) => a + b, 0);
    let i = counts.length - 1;
    while (diff !== 0 && counts.length) {
      if (diff > 0) {
        counts[i]++;
        diff--;
      } else if (counts[i] > 1) {
        counts[i]--;
        diff++;
      }
      i = i === 0 ? counts.length - 1 : i - 1;
    }

    const positions = [];
    for (let k = 0; k < ringCount; k++) {
      const count = counts[k];
      const radius = radii[k];
      const rotation = k * 0.35;
      for (let j = 0; j < count; j++) {
        const angle = (j / count) * Math.PI * 2 - Math.PI / 2 + rotation;
        positions.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        });
      }
    }
    const avgSpacing = (2 * Math.PI * radii[ringCount - 1]) / Math.max(1, counts[ringCount - 1]);
    const r = Math.max(0.9, Math.min(avgSpacing * 0.32, (maxRadius / ringCount) * 0.32));
    positions.forEach((p) => (p.r = r));
    return { positions, r };
  }

  function getLayout(mode, n, bounds) {
    if (mode === "constellation") return layoutConstellation(n, bounds);
    if (mode === "rings") return layoutRings(n, bounds);
    return layoutGrid(n, bounds);
  }

  function wrapLines(context, text, maxWidth) {
    const words = text.split(" ");
    let line = "";
    const lines = [];
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (context.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // Text is stacked top-to-bottom by measuring each block's actual ascent/
  // descent and adding a fixed gap after it, rather than fixed y coordinates
  // — that's what keeps the number comfortably padded regardless of how
  // short (and therefore how large-font) it renders, e.g. "50" for Years
  // vs "18,261" for Days.
  function drawStatic(data) {
    const g = bctx;
    const theme = THEMES[state.theme] || THEMES.gold;
    g.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Warm sand, not dark and not a washed-out near-white — a dark
    // background (even a lighter dark grey) wasn't comfortable for
    // everyone, and the first light pass was too pale/plain ("boring
    // white"). Flat fill, not a gradient — a gradient here read as
    // unintentional/muddy rather than deliberate; flat matches the
    // rest of this canvas's "no glow, no gradients" visual language.
    g.fillStyle = "#f0e4c8";
    g.fillRect(0, 0, CANVAS_W, CANVAS_H);

    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    let y = 68;

    g.font = "600 22px 'JetBrains Mono', monospace";
    g.fillStyle = hexToRgba(theme.accent, 0.92);
    const eyebrowText = spaceOut(data.exceeded ? "AN ESTIMATE, REVISITED" : `${UNIT_LABEL[data.unit][1].toUpperCase()} REMAINING`);
    const eyebrowM = g.measureText(eyebrowText);
    y += eyebrowM.actualBoundingBoxAscent || 18;
    g.fillText(eyebrowText, CANVAS_W / 2, y);
    y += (eyebrowM.actualBoundingBoxDescent || 5) + 32;

    const headline = data.exceeded ? "—" : formatNumber(data.remainingUnits);
    let size = 150;
    if (headline.length > 4) size = Math.max(78, 150 - (headline.length - 4) * 16);
    g.font = `600 ${size}px 'Fraunces', Georgia, serif`;
    const numM = g.measureText(headline);
    y += numM.actualBoundingBoxAscent || size * 0.72;
    // Flat fill, no shadow/glow at all — see the note above the dot loop
    // below for why glow got removed everywhere, not just here.
    g.fillStyle = theme.accentBright;
    g.fillText(headline, CANVAS_W / 2, y);
    y += (numM.actualBoundingBoxDescent || size * 0.1) + 18;

    g.font = "500 28px 'Fraunces', Georgia, serif";
    g.fillStyle = "#6c6047";
    const unitText = pluralize(data.unit, data.remainingUnits);
    const unitM = g.measureText(unitText);
    y += unitM.actualBoundingBoxAscent || 22;
    g.fillText(unitText, CANVAS_W / 2, y);
    y += (unitM.actualBoundingBoxDescent || 7) + 30;

    g.font = "400 24px 'Manrope', sans-serif";
    g.fillStyle = "#786c52";
    const subtitle = data.exceeded
      ? `You've already lived past an estimated ${data.lifespanYears}-year life. Consider raising the number above.`
      : `You've lived ${formatNumber(data.livedUnits)} ${pluralize(data.unit, data.livedUnits)} so far — ${data.percent.toFixed(1)}% of an estimated ${data.lifespanYears}-year life.`;
    const subtitleLines = wrapLines(g, subtitle, 1300);
    y += 18;
    subtitleLines.forEach((line, idx) => g.fillText(line, CANVAS_W / 2, y + idx * 33));
    y += (subtitleLines.length - 1) * 33 + 14 + 18;

    // A relatable equivalent, always derived from the precise remaining
    // day count regardless of which unit is currently toggled (days is
    // the finest granularity, so it stays accurate/consistent even when
    // the headline above is showing weeks/months/years). Deliberately
    // escalates within the sentence — weekends and full moons are the
    // "relatable" framing, but it closes on heartbeats (70bpm average)
    // specifically because a number that large is the classic memento
    // mori move: it's the same remaining time, reframed until it stops
    // being an abstraction. Skipped once the estimate is exceeded —
    // there's nothing to relate to at that point, the subtitle already
    // carries that message instead.
    if (!data.exceeded && data.remainingDays >= 7) {
      const weekends = Math.round(data.remainingDays / 7);
      const moons = Math.round(data.remainingDays / 29.53);
      const heartbeats = Math.round(data.remainingDays * 24 * 60 * 70);
      const funFact = `That's about ${formatNumber(weekends)} more weekends, ${formatNumber(moons)} more full moons — and roughly ${formatNumber(heartbeats)} more heartbeats.`;
      g.font = "italic 500 24px 'Fraunces', Georgia, serif";
      g.fillStyle = hexToRgba(theme.accent, 0.8);
      const funFactLines = wrapLines(g, funFact, 1300);
      y += 19;
      funFactLines.forEach((line, idx) => g.fillText(line, CANVAS_W / 2, y + idx * 31));
      y += (funFactLines.length - 1) * 31 + 12 + 24;
    } else {
      y += 10;
    }

    // Bottom caption stack — just the grouping disclosure when it applies
    // (e.g. "each dot ≈ 46 days"); no sample-data caption or watermark
    // line on the card itself. Built first so its height can be reserved
    // from the stage height, then the dot field fills what's left.
    const bottomLines = [];
    if (data.groupSize > 1) {
      bottomLines.push({ text: `each dot ≈ ${formatNumber(data.groupSize)} ${pluralize(data.unit, data.groupSize)}`, font: "500 19px 'JetBrains Mono', monospace", color: "rgba(43, 38, 33, 0.36)" });
    }

    const bottomLineGap = 26;
    const bottomPad = 42;
    // Rings mode maximizes its radius to exactly touch the bounds it's
    // given (unlike Grid, which usually has a little slack in its last
    // row) — so without a clearance buffer here, the ring's bottom edge
    // sits flush against the caption text with no breathing room.
    const bottomClearance = 30;
    const bottomBlockHeight = (bottomLines.length - 1) * bottomLineGap + bottomPad + bottomClearance;
    const stageBounds = { x: STAGE_X, y, w: STAGE_W, h: Math.max(160, CANVAS_H - bottomBlockHeight - y) };

    const layout = getLayout(state.mode, data.dotTotal, stageBounds);
    currentPositions = layout.positions;

    todayIndex = data.exceeded || data.dotTotal <= 0 ? -1 : Math.min(data.dotLived, data.dotTotal - 1);

    // Flat rounded squares, no per-unit glow/shadow anywhere on this canvas.
    // Hundreds of small blurred, overlapping *circles* at high contrast is
    // a textbook trigger for that "vibrating grid" eye strain — every
    // unit's blur halo bleeds into its neighbors'. Squares alias less than
    // circles at small sizes, and dropping shadowBlur entirely (not just
    // reducing it) removes the overlapping-halo effect completely. The
    // "today" marker in drawFrame uses a plain stroked ring instead of a
    // blurred glow for the same reason, kept flat/crisp like everything
    // else — do not reintroduce shadowBlur to the bulk unit loop.
    for (let i = 0; i < currentPositions.length; i++) {
      if (i === todayIndex) continue;
      const p = currentPositions[i];
      const fill = i < data.dotLived ? "rgba(43, 38, 33, 0.15)" : hexToRgba(theme.accent, 0.92);
      drawUnit(g, p.x, p.y, p.r, fill);
    }

    g.textAlign = "center";
    let by = CANVAS_H - bottomPad - (bottomLines.length - 1) * bottomLineGap;
    bottomLines.forEach((line) => {
      g.font = line.font;
      g.fillStyle = line.color;
      g.fillText(line.text, CANVAS_W / 2, by);
      by += bottomLineGap;
    });
  }

  function spaceOut(str) {
    return str.split("").join("  ");
  }

  // Rounded square, not a circle — see the comment above the dot loop in
  // drawStatic for why. `r` is the same "radius" the layout functions
  // already compute for circle sizing; the square's side is derived from
  // it so existing spacing/density tuning (TARGET_DOTS, cell sizing)
  // didn't need to change.
  function drawUnit(context, x, y, r, fill) {
    const s = r * 1.7;
    context.fillStyle = fill;
    if (context.roundRect) {
      context.beginPath();
      context.roundRect(x - s / 2, y - s / 2, s, s, s * 0.28);
      context.fill();
    } else {
      context.fillRect(x - s / 2, y - s / 2, s, s);
    }
  }

  function drawFrame(now) {
    if (!renderStart) renderStart = now;
    const elapsed = now - renderStart;
    const alpha = Math.min(1, elapsed / 450);
    const theme = THEMES[state.theme] || THEMES.gold;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.globalAlpha = alpha;
    ctx.drawImage(buffer, 0, 0);
    ctx.globalAlpha = 1;

    if (todayIndex >= 0 && currentPositions[todayIndex]) {
      const p = currentPositions[todayIndex];
      const pulse = 0.5 + 0.5 * Math.sin(now / 650);
      ctx.save();
      ctx.globalAlpha = alpha;
      // A plain expanding, fading stroked ring — not a blurred glow — reads
      // as a calm "pulse" without the shimmer a shadowBlur halo causes.
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1.6 + pulse * 1.3), 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(theme.accentBright, 0.3 + pulse * 0.25);
      ctx.lineWidth = Math.max(1.5, p.r * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 1.05, 0, Math.PI * 2);
      ctx.fillStyle = theme.accentBright;
      ctx.fill();
      ctx.restore();
    }

    rafId = requestAnimationFrame(drawFrame);
  }

  function render() {
    if (rafId) cancelAnimationFrame(rafId);
    renderStart = 0;
    const data = computeData();
    drawStatic(data);
    rafId = requestAnimationFrame(drawFrame);
  }

  function setActive(group, attr, value) {
    group.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset[attr] === value);
    });
  }

  dobInput.addEventListener("change", () => {
    if (dobInput.value) {
      state.dob = new Date(dobInput.value + "T00:00:00");
      sampleNote.textContent = "";
    } else {
      state.dob = null;
      sampleNote.textContent = "Sample life shown — enter your birth date above to see yours.";
    }
    render();
  });
  dobInput.max = new Date().toISOString().slice(0, 10);

  lifespanRange.addEventListener("input", () => {
    lifespanNumber.value = lifespanRange.value;
    state.lifespanYears = Number(lifespanRange.value);
    render();
  });
  lifespanNumber.addEventListener("input", () => {
    const v = Math.max(1, Math.min(120, Number(lifespanNumber.value) || 1));
    lifespanRange.value = Math.max(40, Math.min(100, v));
    state.lifespanYears = v;
    render();
  });

  unitToggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-unit]");
    if (!btn) return;
    state.unit = btn.dataset.unit;
    setActive(unitToggle, "unit", state.unit);
    render();
  });

  modeToggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    state.mode = btn.dataset.mode;
    setActive(modeToggle, "mode", state.mode);
    render();
  });

  themeToggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-theme]");
    if (!btn) return;
    state.theme = btn.dataset.theme;
    applyTheme(state.theme);
    setActive(themeToggle, "theme", state.theme);
    render();
  });

  exportBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `memento-${state.unit}-${state.mode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  applyTheme(state.theme);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(render);
  } else {
    render();
  }
  render();
})();
