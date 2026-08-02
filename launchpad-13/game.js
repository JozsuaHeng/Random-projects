// ============================================================
// LAUNCHPAD-13 — game.js
// A single persistent scene (no page/screen switching). A right-hand
// panel handles vehicle select -> confirm -> manifest, and the launch
// sequence plays out in place on the same canvas. The scene's
// time-of-day/terrain follows the picked vehicle's real launch site.
// ============================================================

(function () {
  const PIXEL_SCALE = 3;
  const METERS_PER_PIXEL = 2.5;

  const DEFAULT_ENV = { time: "twilight", terrain: "coastal", locale: null };

  const TERRAIN_TINT = {
    coastal: { day: ["#7d97a8", "#63808f"], twilight: ["#241c3d", "#33254a"], night: ["#141225", "#1c1830"] },
    desert: { day: ["#b89a6f", "#a3855a"], twilight: ["#3a2c2a", "#4a3630"], night: ["#161018", "#20161a"] },
    tropical: { day: ["#4f8a5e", "#376b47"], twilight: ["#20302a", "#2c4034"], night: ["#101a16", "#16241c"] },
    alpine: { day: ["#8fa0b4", "#75899e"], twilight: ["#2a2e40", "#363c52"], night: ["#141826", "#1c2032"] },
  };

  const FARFAR_TINT = {
    coastal: { day: "#9db4c2", twilight: "#1a1530", night: "#0e0c1c" },
    desert: { day: "#d0b485", twilight: "#2c211f", night: "#100c14" },
    tropical: { day: "#6ba07a", twilight: "#182620", night: "#0c1410" },
    alpine: { day: "#a8b8c8", twilight: "#232538", night: "#0e1120" },
  };

  const GROUND_TINT = {
    day: ["#333f42", "#404f52"],
    twilight: ["#141021", "#221c38"],
    night: ["#0a0a14", "#161428"],
  };

  const FOG_TINT = {
    day: "rgba(140,155,160,0.35)",
    twilight: "rgba(60,45,70,0.4)",
    night: "rgba(10,12,26,0.55)",
  };

  const STAR_ALPHA = { day: 0, twilight: 0.75, night: 1 };

  const app = {
    rocket: null,
    items: new Set(),
    mode: "idle", // "idle" | "launching" | "debrief"
    launchModeId: null,
  };

  const canvas = document.getElementById("scene-canvas");
  let ctx = null;
  let S = null;

  const els = {
    infoPanel: document.getElementById("info-panel"),
    infoToggle: document.getElementById("info-toggle"),
    briefingLocale: document.getElementById("briefing-locale"),
    soundToggle: document.getElementById("sound-toggle"),
    zoomControl: document.getElementById("zoom-control"),
    zoomIn: document.getElementById("zoom-in"),
    zoomOut: document.getElementById("zoom-out"),
    zoomLevel: document.getElementById("zoom-level"),
    vehiclePanel: document.getElementById("vehicle-panel"),
    viewList: document.getElementById("view-list"),
    viewDetail: document.getElementById("view-detail"),
    viewItems: document.getElementById("view-items"),
    vehicleGrid: document.getElementById("vehicle-grid"),
    btnBackToList: document.getElementById("btn-back-to-list"),
    btnBackToDetail: document.getElementById("btn-back-to-detail"),
    panelVehicle: document.getElementById("panel-vehicle"),
    itemGrid: document.getElementById("item-grid"),
    itemCounter: document.getElementById("item-counter"),
    btnConfirmVehicle: document.getElementById("btn-confirm-vehicle"),
    btnLaunch: document.getElementById("btn-launch"),
    countdownOverlay: document.getElementById("countdown-overlay"),
    altitudeReadout: document.getElementById("altitude-readout"),
    altitudeValue: document.getElementById("altitude-value"),
    captionTicker: document.getElementById("caption-ticker"),
    debriefCard: document.getElementById("debrief-card"),
    reportTitle: document.getElementById("report-title"),
    reportVehicle: document.getElementById("report-vehicle"),
    reportBlurb: document.getElementById("report-blurb"),
    cargoReport: document.getElementById("cargo-report"),
    btnAgain: document.getElementById("btn-again"),
  };

  // ---------------- Persistent scene ----------------

  function logicalSize() {
    return {
      w: Math.max(140, Math.round(window.innerWidth / PIXEL_SCALE)),
      h: Math.max(100, Math.round(window.innerHeight / PIXEL_SCALE)),
    };
  }

  function makeScene(w, h) {
    const groundY = Math.round(h * 0.78);
    return {
      w, h, groundY,
      padX: Math.round(w * 0.5),
      env: DEFAULT_ENV,
      stars: makeStars(w, groundY, 100),
      sky: { x: w * 0.8, y: h * 0.12, r: Math.max(6, w * 0.02) },
      skyLights: makeSkyLights(w, h, 2),
      mountainsFarFar: [],
      mountainsFar: [],
      mountainsNear: [],
      skyline: [],
      groundDecor: [],
      waterGlints: [],
      clouds: makeClouds(w, h, 5),
      rocket: { x: Math.round(w * 0.5), y: groundY - 4, rot: 0, visible: false },
      rocketW: Math.max(26, w * 0.09),
      rocketH: Math.max(90, h * 0.58),
      groundBaseY: groundY - 4,
      shake: 0,
      camY: 0,
      showFlame: false,
      flameT: 0,
      t: 0,
      clock: 0,
      particles: new ParticleSystem(),
      vaporRing: null,
      flags: {},
    };
  }

  function applyEnvironment(rocket) {
    const env = rocket ? rocket.env : DEFAULT_ENV;
    S.env = env;
    const isDesert = env.terrain === "desert";
    S.mountainsFarFar = makeMountains(S.w, S.groundY, isDesert ? 0.1 : 0.34, true);
    S.mountainsFar = makeMountains(S.w, S.groundY, isDesert ? 0.15 : 0.24, isDesert);
    S.mountainsNear = makeMountains(S.w, S.groundY, isDesert ? 0.2 : 0.36, isDesert);
    S.groundDecor = makeGroundDecor(env.terrain, S.w);
    S.skyline = env.terrain === "coastal" ? makeSkyline(S.w, S.groundY, 16) : [];
    S.waterGlints = env.terrain === "coastal" ? makeWaterGlints(S.w, S.groundY, 24) : [];
    els.briefingLocale.textContent = env.locale ? `📍 ${env.locale}` : "";
  }

  function setupScene() {
    const { w, h } = logicalSize();
    ctx = preparePixelCanvas(canvas, w, h);
    S = makeScene(w, h);
    if (app.rocket) S.rocket.visible = true;
    applyEnvironment(app.rocket);
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (app.mode === "launching") return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupScene, 200);
  });

  function drawSceneFrame() {
    const shakeX = S.shake > 0.1 ? (Math.random() - 0.5) * S.shake : 0;
    const shakeY = S.shake > 0.1 ? (Math.random() - 0.5) * S.shake : 0;
    const time = S.env.time;
    const [farColor, nearColor] = TERRAIN_TINT[S.env.terrain]?.[time] || TERRAIN_TINT.coastal.twilight;
    const farFarColor = FARFAR_TINT[S.env.terrain]?.[time] || FARFAR_TINT.coastal.twilight;
    const [groundColor, groundLine] = GROUND_TINT[time] || GROUND_TINT.twilight;

    ctx.clearRect(0, 0, S.w, S.h);

    // Far backdrop: sky, sun/moon, stars, clouds, distant lights — a
    // slow, distant layer that doesn't pan with the camera.
    ctx.save();
    ctx.translate(shakeX * 0.3, shakeY * 0.3);
    drawSky(ctx, S.w, S.h, time);
    if (time === "day") {
      drawSun(ctx, S.sky.x, S.sky.y, S.sky.r);
    } else {
      drawMoon(ctx, S.sky.x, S.sky.y, S.sky.r);
      drawSkyLights(ctx, S.skyLights, S.w, S.clock);
    }
    drawStars(ctx, S.stars, STAR_ALPHA[time]);
    drawClouds(ctx, S.clouds, S.w, time === "day" ? "rgba(255,255,255,0.85)" : "rgba(232,230,240,0.55)");
    drawMountains(ctx, S.w, S.groundY + S.camY * 0.15, S.mountainsFarFar, farFarColor);
    ctx.restore();

    // Near scene: mountains, terrain decor, pad, gantry, rocket — pans
    // upward as the rocket climbs, so a high-altitude flight visibly
    // leaves the ground behind.
    ctx.save();
    ctx.translate(shakeX, shakeY + S.camY);
    ctx.translate(S.padX, S.groundY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-S.padX, -S.groundY);
    drawMountains(ctx, S.w, S.groundY, S.mountainsFar, farColor);
    drawMountains(ctx, S.w, S.groundY, S.mountainsNear, nearColor);
    if (S.env.terrain === "alpine") drawSnowCaps(ctx, S.mountainsFar, S.groundY, "#eef2f6");
    if (S.env.terrain === "coastal") {
      drawSkyline(ctx, S.groundY, S.skyline, "#1c1830", "#f2c66b");
      drawWaterGlints(ctx, S.waterGlints, S.groundY, time === "day" ? "rgba(255,255,255,0.6)" : "rgba(180,210,230,0.5)");
    }
    drawGroundDecor(ctx, S.groundDecor, S.groundY, nearColor);
    drawFogBand(ctx, S.w, S.groundY, S.h * 0.16, FOG_TINT[time]);
    drawGround(ctx, S.w, S.groundY, S.h, groundColor, groundLine);

    const gantryScale = Math.max(0.6, S.rocketW / 22);
    const gantryH = S.rocketH * 0.85;
    const blink = Math.floor(S.clock * 2) % 2 === 0;
    drawGantry(ctx, S.padX, S.groundY, gantryH, -S.rocketW * 1.3, blink, gantryScale);
    drawGantry(ctx, S.padX, S.groundY, gantryH, S.rocketW * 1.3, blink, gantryScale);
    drawFuelTanks(ctx, S.padX, S.groundY, -S.rocketW * 2.4, gantryScale);
    drawFuelTanks(ctx, S.padX, S.groundY, S.rocketW * 2.4, gantryScale);
    drawPad(ctx, S.padX, S.groundY, gantryScale);

    if (S.rocket.visible && app.rocket) {
      ctx.save();
      ctx.translate(S.rocket.x, S.rocket.y);
      ctx.rotate(S.rocket.rot);
      drawRocket(ctx, app.rocket, {
        cx: 0, baseY: 0, width: S.rocketW, height: S.rocketH,
        flameT: S.flameT, boosterFlameT: S.flameT * 0.8, showFlame: S.showFlame,
      });
      ctx.restore();
    }

    drawVaporRing(ctx, S.vaporRing);
    S.particles.draw(ctx);
    ctx.restore();

    drawVignette(ctx, S.w, S.h);
  }

  // Modes with a distinct single "climax" moment get a slow-motion
  // window leading up to it — the rocket visibly hangs in the air a
  // beat longer right before things go wrong. Modes with no single
  // dramatic beat (instant pad failures, the patient burn) are left at
  // normal speed.
  const CLIMAX_TIME = {
    "leaning-tower": 2.4,
    "pop-fly": 2.0,
    "corkscrew": 3.4,
    "confetti-mode": 1.8,
    "deadstick": 4.3,
    "off-axis": 3.6,
  };
  const SLOWMO_WINDOW = 1.0;
  const SLOWMO_MIN = 0.22;

  function timeScaleFor(modeId, t) {
    const climax = CLIMAX_TIME[modeId];
    if (climax == null) return 1;
    const dist = climax - t;
    if (dist <= 0 || dist >= SLOWMO_WINDOW) return 1;
    const p = dist / SLOWMO_WINDOW;
    return SLOWMO_MIN + (1 - SLOWMO_MIN) * p;
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    S.clock += dt;
    updateClouds(S.clouds, dt, S.w);
    updateSkyLights(S.skyLights, dt, S.w);

    if (app.mode === "launching") {
      const scale = timeScaleFor(app.launchModeId, S.t);
      const scaledDt = dt * scale;
      S.t += scaledDt;
      const done = MODE_FN[app.launchModeId](S.t, scaledDt, S);
      S.particles.update(scaledDt);
      const altitudePixels = Math.max(0, S.groundBaseY - S.rocket.y);
      S.camY = Math.min(S.h * 0.42, altitudePixels * 0.7);
      updateAltitudeReadout(altitudePixels);

      // A light trailing contrail while under thrust and climbing —
      // generic, so every ascent-capable mode gets it for free.
      if (S.showFlame && S.rocket.visible && altitudePixels > 4 && Math.random() < 0.4) {
        S.particles.spawnSmoke(S.rocket.x + (Math.random() - 0.5) * S.rocketW * 0.3, S.rocket.y, 1);
      }
      // A one-time condensation ring once the vehicle is well clear of the tower.
      if (!S.flags.vaporDone && altitudePixels > S.rocketH * 0.45) {
        S.flags.vaporDone = true;
        S.vaporRing = { x: S.rocket.x, y: S.rocket.y - S.rocketH * 0.3, r: S.rocketW * 0.7, life: 0.55, maxLife: 0.55 };
      }

      if (done) {
        app.mode = "debrief";
        stopCaptionCycle();
        hideAltitudeReadout();
        SFX.rumbleStop();
        const finishedMode = app.launchModeId;
        setTimeout(() => showDebrief(finishedMode), 400);
      }
    } else {
      S.particles.update(dt);
      S.camY = Math.max(0, S.camY - dt * S.h * 0.5);
      if (S.rocket.visible) {
        S.rocket.y = S.groundBaseY + Math.sin(S.clock * 1.3) * 1.2;
      }
    }

    if (S.vaporRing) {
      S.vaporRing.life -= dt;
      S.vaporRing.r += dt * S.rocketW * 2.4;
      if (S.vaporRing.life <= 0) S.vaporRing = null;
    }

    drawSceneFrame();
    requestAnimationFrame(loop);
  }

  function updateAltitudeReadout(altitudePixels) {
    const altitude = Math.round(altitudePixels * METERS_PER_PIXEL);
    if (altitude > 2) {
      els.altitudeReadout.classList.add("show");
      els.altitudeValue.textContent = `${altitude.toLocaleString()} m`;
    } else {
      els.altitudeReadout.classList.remove("show");
    }
  }

  function hideAltitudeReadout() {
    els.altitudeReadout.classList.remove("show");
  }

  // ---------------- Mission briefing (left panel, mobile toggle) ----------------

  els.infoToggle.addEventListener("click", () => {
    els.infoPanel.classList.toggle("info-open");
  });

  // ---------------- Sound toggle ----------------

  els.soundToggle.addEventListener("click", () => {
    const next = !SFX.enabled;
    SFX.setEnabled(next);
    els.soundToggle.textContent = next ? "🔊" : "🔇";
    els.soundToggle.classList.toggle("muted", !next);
    if (next) SFX.click();
  });

  // ---------------- Zoom control ----------------

  let zoomLevel = 0.75;
  const ZOOM_MIN = 0.45;
  const ZOOM_MAX = 1.3;
  const ZOOM_STEP = 0.12;

  function setZoom(z) {
    zoomLevel = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
    els.zoomLevel.textContent = Math.round(zoomLevel * 100) + "%";
  }
  setZoom(zoomLevel);

  els.zoomIn.addEventListener("click", () => {
    SFX.click();
    setZoom(zoomLevel + ZOOM_STEP);
  });
  els.zoomOut.addEventListener("click", () => {
    SFX.click();
    setZoom(zoomLevel - ZOOM_STEP);
  });
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      setZoom(zoomLevel - e.deltaY * 0.001);
    },
    { passive: false }
  );

  // ---------------- Vehicle panel ----------------

  let vehicleCtxs = [];

  function buildVehicleGrid() {
    els.vehicleGrid.innerHTML = "";
    vehicleCtxs = [];
    ROCKETS.forEach((rocket) => {
      const card = document.createElement("div");
      card.className = "vehicle-card";
      card.dataset.id = rocket.id;

      const canvasEl = document.createElement("canvas");
      const vctx = preparePixelCanvas(canvasEl, 70, 130);
      vehicleCtxs.push({ ctx: vctx, rocket });

      const name = document.createElement("div");
      name.className = "vname";
      name.textContent = rocket.name;

      const country = document.createElement("div");
      country.className = "vcountry";
      country.innerHTML = `<span class="vflag">${rocket.flag}</span> ${rocket.country}`;

      card.append(canvasEl, name, country);
      card.addEventListener("click", () => pickRocket(rocket.id));
      els.vehicleGrid.appendChild(card);
    });
  }

  function vehicleGridLoop(ts) {
    const flameT = ts / 130;
    for (const { ctx: vctx, rocket } of vehicleCtxs) {
      const w = vctx.canvas.width, h = vctx.canvas.height;
      vctx.clearRect(0, 0, w, h);
      drawRocket(vctx, rocket, { cx: w / 2, baseY: h - 4, width: w * 0.95, height: h - 8, flameT, boosterFlameT: flameT * 0.8 });
    }
    requestAnimationFrame(vehicleGridLoop);
  }

  function showListView() {
    els.viewList.hidden = false;
    els.viewDetail.hidden = true;
    els.viewItems.hidden = true;
  }
  function showDetailView() {
    els.viewList.hidden = true;
    els.viewDetail.hidden = false;
    els.viewItems.hidden = true;
  }
  function showItemsView() {
    els.viewList.hidden = true;
    els.viewDetail.hidden = true;
    els.viewItems.hidden = false;
  }

  function pickRocket(id) {
    SFX.click();
    app.rocket = ROCKETS.find((r) => r.id === id);
    app.items.clear();
    document.querySelectorAll(".item-card").forEach((c) => c.classList.remove("selected"));
    updateCounter();

    S.rocket.visible = true;
    S.rocket.rot = 0;
    applyEnvironment(app.rocket);
    document.querySelectorAll(".vehicle-card").forEach((c) => c.classList.toggle("selected", c.dataset.id === id));

    renderPanelVehicle(app.rocket);
    showDetailView();
  }

  els.btnBackToList.addEventListener("click", () => {
    SFX.click();
    showListView();
  });

  els.btnBackToDetail.addEventListener("click", () => {
    SFX.click();
    showDetailView();
  });

  function renderPanelVehicle(r) {
    const rows = [
      ["Country", `${r.flag} ${r.country}`],
      ["Operator", r.designation],
      ["Class", r.className],
      ["Stages", r.stages],
      ["Height", r.heightM + " m"],
      ["Diameter", r.diameterM + " m"],
      ["Liftoff mass", r.liftoffMassT + " t"],
      ["Payload", r.payload],
      ["Primary engine", `${r.primary.name} — ${r.primary.cycle} (×${r.primary.count}, ${r.primary.thrustEach} each)`],
      ["Secondary / RCS", `${r.secondary.name} (×${r.secondary.count}) — ${r.secondary.purpose}`],
    ];
    if (r.boosters.count > 0) {
      rows.push(["Boosters", `${r.boosters.name} (×${r.boosters.count}, ${r.boosters.type}, ${r.boosters.thrustEach} each)`]);
    }
    rows.push(["Propellant", r.propellant]);
    rows.push(["Guidance", r.guidance]);
    rows.push(["Launch site", r.env.locale]);

    els.panelVehicle.innerHTML = `
      <div class="spec-name" style="font-family:var(--font-pixel); font-size:16px; color:var(--gold); margin-bottom:6px;">${r.name}</div>
      <div style="font-style:italic; color:var(--ink-dim); margin-bottom:12px;">${r.tagline}</div>
      <table class="spec-table" style="width:100%; border-collapse:collapse; font-size:17px; margin-bottom:8px;">
        ${rows.map(([k, v]) => `<tr><td style="color:var(--ink-dim); padding:4px 10px 4px 0; border-bottom:1px dashed var(--line); white-space:nowrap; vertical-align:top;">${k}</td><td style="padding:4px 0; border-bottom:1px dashed var(--line); vertical-align:top;">${v}</td></tr>`).join("")}
      </table>
      <p style="color:var(--ink); line-height:1.4;">${r.flavor}</p>
    `;
  }

  els.btnConfirmVehicle.addEventListener("click", () => {
    SFX.click();
    showItemsView();
  });

  // ---------------- Items ----------------

  function buildItemGrid() {
    els.itemGrid.innerHTML = "";
    ITEMS.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";

      const iconCanvas = document.createElement("canvas");
      const ictx = preparePixelCanvas(iconCanvas, 24, 24);
      drawIcon(ictx, item.icon, 24);

      const label = document.createElement("div");
      label.className = "iname";
      label.textContent = item.name;

      card.append(iconCanvas, label);
      card.addEventListener("click", () => toggleItem(item, card, iconCanvas));
      els.itemGrid.appendChild(card);
    });
    updateCounter();
  }

  function flyItemToRocket(originCanvas, iconSpec) {
    const originRect = originCanvas.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const targetX = canvasRect.left + (S.rocket.x / S.w) * canvasRect.width;
    const targetY = canvasRect.top + ((S.rocket.y - S.rocketH * 0.35) / S.h) * canvasRect.height;

    const fly = document.createElement("canvas");
    fly.width = 24;
    fly.height = 24;
    drawIcon(fly.getContext("2d"), iconSpec, 24);
    fly.className = "fly-icon";
    fly.style.left = originRect.left + "px";
    fly.style.top = originRect.top + "px";
    fly.style.width = originRect.width + "px";
    fly.style.height = originRect.width + "px";
    fly.style.opacity = "1";
    document.body.appendChild(fly);

    requestAnimationFrame(() => {
      fly.style.left = targetX + "px";
      fly.style.top = targetY + "px";
      fly.style.width = "4px";
      fly.style.height = "4px";
      fly.style.opacity = "0";
    });
    setTimeout(() => fly.remove(), 650);
  }

  function toggleItem(item, card, iconCanvas) {
    if (app.items.has(item.name)) {
      app.items.delete(item.name);
      card.classList.remove("selected");
      SFX.deselect();
    } else {
      if (app.items.size >= 13) {
        SFX.error();
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
        return;
      }
      app.items.add(item.name);
      card.classList.add("selected");
      SFX.select();
      flyItemToRocket(iconCanvas, item.icon);
    }
    updateCounter();
  }

  function updateCounter() {
    const n = app.items.size;
    els.itemCounter.textContent = `${n} / 13 selected`;
    els.itemCounter.classList.toggle("full", n === 13);
    els.btnLaunch.disabled = n !== 13;
  }

  // ---------------- Launch sequence ----------------

  let captionTimer = null;

  function once(SS, key, cond, fn) {
    if (!SS.flags[key] && cond) {
      SS.flags[key] = true;
      fn();
    }
  }

  function rocketPalette() {
    const p = app.rocket.palette;
    return [p.hull, p.hullShadow, p.accent];
  }

  function boom(SS, x, y, fireN, smokeN, debrisN, bigN) {
    SS.particles.spawnFire(x, y, fireN);
    SS.particles.spawnSmoke(x, y, smokeN);
    SS.particles.spawnDebris(x, y, debrisN, rocketPalette());
    SS.particles.spawnBigDebris(x, y, bigN, rocketPalette());
    SFX.boom();
  }

  function modePadRud(t, dt, SS) {
    SS.showFlame = t > 0;
    SS.flameT = t * 8;
    if (t < 0.55) SS.shake = t * 3;
    once(SS, "boom", t >= 0.55, () => {
      const y = SS.rocket.y - SS.rocketH * 0.4;
      boom(SS, SS.rocket.x, y, 55, 32, 30, 6);
      SS.particles.spawnShockDust(SS.rocket.x, SS.groundBaseY, 26);
      SS.rocket.visible = false;
      SS.shake = 11;
    });
    if (SS.flags.boom) {
      SS.shake = Math.max(0, SS.shake - dt * 18);
      if (Math.random() < 0.3) SS.particles.spawnFire(SS.rocket.x, SS.groundBaseY - 6, 2);
    }
    return t > 4.2;
  }

  function modeLeaningTower(t, dt, SS) {
    SS.showFlame = t > 0;
    SS.flameT = t * 8;
    if (!SS.flags.impact) {
      if (t < 1.0) {
        SS.rocket.y = SS.groundBaseY - Math.min(6, t * 7);
        if (Math.random() < 0.2) SS.particles.spawnSmoke(SS.rocket.x, SS.rocket.y, 1);
      } else if (t < 2.4) {
        const p = (t - 1.0) / 1.4;
        const ease = p * p;
        SS.rocket.rot = ease * 0.7;
        SS.rocket.x = SS.padX + ease * SS.rocketW * 1.5;
        SS.rocket.y = SS.groundBaseY - 6 + ease * 10;
      }
    }
    once(SS, "impact", t >= 2.4, () => {
      const y = SS.rocket.y - SS.rocketH * 0.35;
      boom(SS, SS.rocket.x, y, 45, 28, 26, 5);
      SS.showFlame = false;
      SS.rocket.visible = false;
      SS.shake = 9;
    });
    if (SS.flags.impact) {
      SS.shake = Math.max(0, SS.shake - dt * 15);
      if (Math.random() < 0.35) SS.particles.spawnFire(SS.padX + SS.rocketW * 1.3, SS.groundBaseY - 10, 2);
    }
    return t > 5.0;
  }

  function modePopFly(t, dt, SS) {
    SS.showFlame = t > 0;
    SS.flameT = t * 8;
    if (!SS.flags.boom && t < 2.0) {
      const p = t / 2.0;
      SS.rocket.y = SS.groundBaseY - p * SS.rocketH * 1.15;
    }
    once(SS, "boom", t >= 2.0, () => {
      const y = SS.rocket.y - SS.rocketH * 0.4;
      boom(SS, SS.rocket.x, y, 60, 36, 32, 7);
      SS.rocket.visible = false;
      SS.shake = 8;
    });
    if (SS.flags.boom) SS.shake = Math.max(0, SS.shake - dt * 16);
    return t > 5.2;
  }

  function modeCorkscrew(t, dt, SS) {
    SS.showFlame = t > 0;
    SS.flameT = t * 8;
    if (!SS.flags.impact) {
      if (t < 1.2) {
        const p = t / 1.2;
        SS.rocket.y = SS.groundBaseY - p * SS.rocketH * 0.55;
        SS.rocket.rot = Math.sin(t * 9) * 0.15 * p;
      } else if (t < 3.4) {
        const p = (t - 1.2) / 2.2;
        SS.rocket.rot = Math.sin(t * 11) * (0.3 + p * 0.9) + p * p * 1.5;
        SS.rocket.x = SS.padX + Math.sin(t * 6.5) * SS.rocketW * 1.8 * p;
        SS.rocket.y = SS.groundBaseY - SS.rocketH * 0.55 + p * p * SS.rocketH * 0.6;
      }
    }
    once(SS, "impact", t >= 3.4, () => {
      boom(SS, SS.rocket.x, SS.groundBaseY - 6, 45, 28, 26, 5);
      SS.rocket.visible = false;
      SS.shake = 8;
    });
    if (SS.flags.impact) {
      SS.shake = Math.max(0, SS.shake - dt * 14);
      if (Math.random() < 0.3) SS.particles.spawnFire(SS.rocket.x, SS.groundBaseY - 8, 2);
    }
    return t > 5.6;
  }

  function modeSlowCook(t, dt, SS) {
    SS.rocket.y = SS.groundBaseY;
    SS.showFlame = true;
    SS.flameT = t * 3 + Math.sin(t * 17) * 0.5;
    if (t >= 0.3 && t < 1.0 && Math.random() < 0.5) {
      SS.particles.spawnFire(SS.padX, SS.groundBaseY - 4, 2);
    }
    if (t >= 1.0) {
      if (Math.random() < 0.55) SS.particles.spawnFire(SS.padX, SS.groundBaseY - 4, 3);
      if (Math.random() < 0.3) SS.particles.spawnSmoke(SS.padX, SS.groundBaseY - 16, 2);
    }
    once(SS, "lean", t >= 3.2, () => {
      SS.particles.spawnDebris(SS.padX, SS.groundBaseY - 24, 10, rocketPalette());
      SS.particles.spawnBigDebris(SS.padX, SS.groundBaseY - 24, 2, rocketPalette());
      SFX.boom();
    });
    if (SS.flags.lean) SS.rocket.rot = Math.min(0.16, (t - 3.2) * 0.3);
    return t > 4.6;
  }

  function modeConfetti(t, dt, SS) {
    SS.showFlame = t > 0;
    SS.flameT = t * 8;
    if (!SS.flags.break1 && t < 1.8) {
      const p = t / 1.8;
      SS.rocket.y = SS.groundBaseY - p * SS.rocketH * 1.35;
    }
    once(SS, "break1", t >= 1.8, () => {
      SS.lastX = SS.rocket.x;
      SS.lastY = SS.rocket.y - SS.rocketH * 0.4;
      boom(SS, SS.lastX, SS.lastY, 35, 22, 16, 4);
      SS.particles.spawnDebris(SS.lastX + 8, SS.lastY, 16, rocketPalette());
      SS.rocket.visible = false;
      SS.shake = 6;
    });
    once(SS, "break2", t >= 2.4, () => {
      boom(SS, SS.lastX - 16, SS.lastY + 20, 20, 12, 12, 3);
      SS.shake = 5;
    });
    once(SS, "break3", t >= 2.9, () => {
      boom(SS, SS.lastX + 18, SS.lastY + 34, 20, 12, 12, 3);
      SS.shake = 5;
    });
    if (SS.flags.break1) SS.shake = Math.max(0, SS.shake - dt * 12);
    return t > 5.6;
  }

  function modeDeadstick(t, dt, SS) {
    const ascendEnd = 2.0;
    const apexT = 2.6;
    const fallEnd = 4.3;
    const topY = SS.groundBaseY - SS.rocketH * 1.3;
    if (t < ascendEnd) {
      SS.showFlame = true;
      SS.flameT = t * 8;
      const p = t / ascendEnd;
      SS.rocket.y = SS.groundBaseY - p * SS.rocketH * 1.3;
    } else if (t < apexT) {
      once(SS, "cutout", true, () => {
        SS.particles.spawnSmoke(SS.rocket.x, SS.rocket.y, 14);
      });
      SS.showFlame = false;
      const p = (t - ascendEnd) / (apexT - ascendEnd);
      SS.rocket.y = topY - Math.sin(p * Math.PI) * SS.rocketH * 0.06;
    } else if (t < fallEnd) {
      const p = (t - apexT) / (fallEnd - apexT);
      SS.rocket.y = topY + p * p * (SS.groundBaseY - topY);
      SS.rocket.rot = Math.sin(t * 3) * 0.2 * p;
    }
    once(SS, "impact", t >= fallEnd, () => {
      boom(SS, SS.rocket.x, SS.groundBaseY - 8, 55, 32, 30, 6);
      SS.rocket.visible = false;
      SS.shake = 10;
    });
    if (SS.flags.impact) SS.shake = Math.max(0, SS.shake - dt * 16);
    return t > fallEnd + 1.2;
  }

  function modeOffAxis(t, dt, SS) {
    SS.showFlame = t > 0;
    SS.flameT = t * 8;
    if (!SS.flags.impact) {
      if (t < 1.4) {
        const p = t / 1.4;
        SS.rocket.y = SS.groundBaseY - p * SS.rocketH * 0.9;
      } else if (t < 3.6) {
        const p = (t - 1.4) / 2.2;
        const ease = p * p;
        SS.rocket.rot = ease * 1.4;
        SS.rocket.x = SS.padX + ease * SS.rocketW * 5;
        SS.rocket.y = SS.groundBaseY - SS.rocketH * 0.9 + ease * ease * SS.rocketH * 0.9;
      }
    }
    once(SS, "impact", t >= 3.6, () => {
      boom(SS, SS.rocket.x, SS.rocket.y, 50, 30, 28, 5);
      SS.rocket.visible = false;
      SS.shake = 9;
    });
    if (SS.flags.impact) SS.shake = Math.max(0, SS.shake - dt * 15);
    return t > 5.2;
  }

  const MODE_FN = {
    "pad-rud": modePadRud,
    "leaning-tower": modeLeaningTower,
    "pop-fly": modePopFly,
    "corkscrew": modeCorkscrew,
    "slow-cook": modeSlowCook,
    "confetti-mode": modeConfetti,
    "deadstick": modeDeadstick,
    "off-axis": modeOffAxis,
  };

  function startCaptionCycle(mode) {
    const captions = mode.captions;
    let i = 0;
    function show() {
      els.captionTicker.textContent = captions[i % captions.length];
      els.captionTicker.classList.add("show");
      i++;
    }
    show();
    captionTimer = setInterval(show, 1150);
  }

  function stopCaptionCycle() {
    clearInterval(captionTimer);
    els.captionTicker.classList.remove("show");
  }

  els.btnLaunch.addEventListener("click", () => {
    if (app.items.size !== 13) return;
    SFX.click();
    els.vehiclePanel.classList.add("vp-hidden");
    els.infoPanel.classList.add("info-hidden");
    els.soundToggle.classList.add("hidden-during-launch");
    els.zoomControl.classList.add("hidden-during-launch");
    setTimeout(runCountdown, 350);
  });

  function runCountdown() {
    S.flags = {};
    S.t = 0;
    S.shake = 0;
    S.camY = 0;
    S.showFlame = false;
    S.flameT = 0;
    S.rocket.rot = 0;
    S.rocket.x = S.padX;
    S.rocket.y = S.groundBaseY;
    S.rocket.visible = true;
    S.particles = new ParticleSystem();
    S.vaporRing = null;

    let n = 5;
    els.countdownOverlay.textContent = n;
    SFX.countdownTick(n);
    const iv = setInterval(() => {
      n -= 1;
      if (n > 0) {
        els.countdownOverlay.textContent = n;
        SFX.countdownTick(n);
      } else if (n === 0) {
        els.countdownOverlay.textContent = "IGNITION";
        SFX.countdownTick(0);
        SFX.rumbleStart();
      } else {
        clearInterval(iv);
        els.countdownOverlay.textContent = "";
        beginLaunch();
      }
    }, 500);
  }

  function beginLaunch() {
    const mode = FAILURE_MODES[Math.floor(Math.random() * FAILURE_MODES.length)];
    app.launchModeId = mode.id;
    app.mode = "launching";
    startCaptionCycle(mode);
  }

  function showDebrief(modeId) {
    const mode = FAILURE_MODES.find((m) => m.id === modeId);
    els.reportTitle.textContent = mode.reportTitle;
    els.reportVehicle.textContent = `Vehicle: ${app.rocket.name} (${app.rocket.flag} ${app.rocket.country})`;
    els.reportBlurb.textContent = mode.blurb;
    els.cargoReport.innerHTML = "";
    [...app.items].forEach((name) => {
      const li = document.createElement("li");
      const verdict = CARGO_VERDICTS[Math.floor(Math.random() * CARGO_VERDICTS.length)];
      li.innerHTML = `<span>${name}</span><span class="verdict">${verdict}</span>`;
      els.cargoReport.appendChild(li);
    });
    els.debriefCard.classList.add("show");
  }

  els.btnAgain.addEventListener("click", () => {
    SFX.click();
    els.debriefCard.classList.remove("show");
    app.mode = "idle";
    app.launchModeId = null;
    app.rocket = null;
    app.items.clear();
    updateCounter();
    document.querySelectorAll(".item-card").forEach((c) => c.classList.remove("selected"));
    document.querySelectorAll(".vehicle-card").forEach((c) => c.classList.remove("selected"));
    showListView();
    els.vehiclePanel.classList.remove("vp-hidden");
    els.infoPanel.classList.remove("info-hidden");
    els.soundToggle.classList.remove("hidden-during-launch");
    els.zoomControl.classList.remove("hidden-during-launch");
    S.rocket.visible = false;
    S.camY = 0;
    applyEnvironment(null);
  });

  // ---------------- Init ----------------

  setupScene();
  buildVehicleGrid();
  buildItemGrid();
  showListView();
  requestAnimationFrame(vehicleGridLoop);
  requestAnimationFrame(loop);
})();
