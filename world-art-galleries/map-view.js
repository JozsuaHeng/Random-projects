// Renders the world-map alternative to the gallery grid. Fetches the local
// world-map.svg asset once and inlines it (rather than using <img>/<object>)
// so its paths can be recolored via CSS/theme, then overlays a clickable
// pin per gallery, colors/groups the landmass by continent, and animates
// the SVG viewBox to "zoom" in two layers: continent (click a continent's
// shape or filter chip), then a specific country within it (click a
// country's shape a second time, once its continent is already focused).
//
// The map's own <g id="positioner" transform="translate(180,90) scale(1,-1)">
// wrapper already converts raw (longitude, latitude) degree values into
// correctly-oriented screen space — pins and bounding boxes are computed
// with cx=lon, cy=lat directly, no separate projection math needed.

import { COUNTRY_CONTINENTS, COUNTRY_CODE_TO_GALLERY_COUNTRY, continentSlug } from "./map-continents.js";
import { resolveImages, THUMB_SIZE } from "./wiki-images.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const MAP_URL = "./world-map.svg";
const WORLD_BOX = { x: 0, y: 0, w: 360, h: 180 };
const WORLD_ASPECT = WORLD_BOX.w / WORLD_BOX.h;

// Two tiers of "how tight can a zoom get" — continent zoom stays fairly
// wide (context matters at that level); country zoom is allowed to go much
// tighter, which is exactly what separates a nucleated cluster like Paris's
// three museums into individually visible, individually clickable pins.
const CONTINENT_MIN_BOX_DEGREES = 50;
const CONTINENT_PADDING_FRACTION = 0.25;
const CONTINENT_MIN_PADDING_DEGREES = 8;
const COUNTRY_MIN_BOX_DEGREES = 12;
const COUNTRY_PADDING_FRACTION = 0.4;
const COUNTRY_MIN_PADDING_DEGREES = 3;

// Pins are sized proportionally to the current zoom (viewBox width relative
// to the full world), so they read as a roughly constant on-screen size
// instead of visually ballooning as the viewBox shrinks — BASE_PIN_RADIUS
// is the size at full world-zoom (unchanged from before this existed),
// MIN_PIN_RADIUS is a floor so pins never shrink into invisibility at the
// tightest country-level zoom.
const BASE_PIN_RADIUS = 1.7;
const MIN_PIN_RADIUS = 0.22;
const BASE_PIN_STROKE = 0.35;

let cachedSvgText = null;

async function loadMapSvg() {
  if (cachedSvgText) return cachedSvgText;
  const res = await fetch(MAP_URL);
  cachedSvgText = await res.text();
  return cachedSvgText;
}

function lonLatToOuter(lon, lat) {
  return { x: lon + 180, y: 90 - lat };
}

function fitAspect(box, targetAspect) {
  const currentAspect = box.w / box.h;
  if (currentAspect > targetAspect) {
    const newH = box.w / targetAspect;
    return { x: box.x, y: box.y - (newH - box.h) / 2, w: box.w, h: newH };
  }
  const newW = box.h * targetAspect;
  return { x: box.x - (newW - box.w) / 2, y: box.y, w: newW, h: box.h };
}

// Computes the SVG viewBox (in the map's own 0-360 x 0-180 space) that
// frames a set of galleries, padded and clamped to a sane minimum size,
// then stretched/centered to match the world map's own 2:1 aspect ratio so
// the container's on-screen shape never jumps mid-zoom. `tier` picks how
// tight the minimum/padding are (continent vs. the tighter country layer).
function boundingBoxForGalleries(galleries, tier = "continent") {
  if (galleries.length === 0) return WORLD_BOX;

  const minDegrees = tier === "country" ? COUNTRY_MIN_BOX_DEGREES : CONTINENT_MIN_BOX_DEGREES;
  const paddingFraction = tier === "country" ? COUNTRY_PADDING_FRACTION : CONTINENT_PADDING_FRACTION;
  const minPadding = tier === "country" ? COUNTRY_MIN_PADDING_DEGREES : CONTINENT_MIN_PADDING_DEGREES;

  const lats = galleries.map((g) => g.coords.lat);
  const lons = galleries.map((g) => g.coords.lon);
  let latMin = Math.min(...lats);
  let latMax = Math.max(...lats);
  let lonMin = Math.min(...lons);
  let lonMax = Math.max(...lons);

  const latPad = Math.max((latMax - latMin) * paddingFraction, minPadding);
  const lonPad = Math.max((lonMax - lonMin) * paddingFraction, minPadding);
  latMin -= latPad;
  latMax += latPad;
  lonMin -= lonPad;
  lonMax += lonPad;

  if (lonMax - lonMin < minDegrees) {
    const c = (lonMax + lonMin) / 2;
    lonMin = c - minDegrees / 2;
    lonMax = c + minDegrees / 2;
  }
  if (latMax - latMin < minDegrees) {
    const c = (latMax + latMin) / 2;
    latMin = c - minDegrees / 2;
    latMax = c + minDegrees / 2;
  }
  latMin = Math.max(latMin, -90);
  latMax = Math.min(latMax, 90);

  const topLeft = lonLatToOuter(lonMin, latMax);
  const bottomRight = lonLatToOuter(lonMax, latMin);
  const box = { x: topLeft.x, y: topLeft.y, w: bottomRight.x - topLeft.x, h: bottomRight.y - topLeft.y };
  return fitAspect(box, WORLD_ASPECT);
}

function pinRadiusForViewBoxWidth(viewBoxWidth) {
  const scale = viewBoxWidth / WORLD_BOX.w;
  return Math.max(BASE_PIN_RADIUS * scale, MIN_PIN_RADIUS);
}

function resizePins(pinsGroup, viewBoxWidth) {
  const r = pinRadiusForViewBoxWidth(viewBoxWidth);
  const strokeW = Math.max(BASE_PIN_STROKE * (viewBoxWidth / WORLD_BOX.w), MIN_PIN_RADIUS * 0.2);
  for (const circle of pinsGroup.querySelectorAll("circle")) {
    circle.setAttribute("r", String(r));
    circle.style.strokeWidth = String(strokeW);
  }
}

let zoomAnimFrame = null;

// Animates the SVG's viewBox attribute from wherever it currently is to
// `target`, via requestAnimationFrame rather than a CSS transition —
// cross-browser support for transitioning `viewBox` directly is still
// inconsistent, while rAF-driven attribute updates work everywhere. Calls
// `onFrame(currentBoxWidth)` on every step so pin size can stay in sync
// with the zoom instead of only snapping at the end.
function animateViewBox(svg, target, onFrame, duration = 650) {
  if (zoomAnimFrame) cancelAnimationFrame(zoomAnimFrame);
  const [sx, sy, sw, sh] = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  const start = { x: sx, y: sy, w: sw, h: sh };
  const startTime = performance.now();

  function frame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - t) ** 3; // ease-out cubic
    const x = start.x + (target.x - start.x) * eased;
    const y = start.y + (target.y - start.y) * eased;
    const w = start.w + (target.w - start.w) * eased;
    const h = start.h + (target.h - start.h) * eased;
    svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    onFrame?.(w);
    zoomAnimFrame = t < 1 ? requestAnimationFrame(frame) : null;
  }
  zoomAnimFrame = requestAnimationFrame(frame);
}

// Groups galleries whose coordinates fall within CLUSTER_DEGREES of each
// other (e.g. London's three museums, ~a few km apart, are a fraction of a
// degree) and fans them out in a small circle around their shared centroid
// so co-located galleries stay individually visible and clickable instead
// of stacking into one pin. Uses the RAW gallery coordinates for the
// bounding-box zoom (boundingBoxForGalleries), never these fanned ones —
// the fan-out is a rendering trick only, not the real location. Because the
// fan radius is fixed in degree-space while zooming shrinks the viewBox,
// a fanned-out cluster naturally spreads FURTHER apart on screen at tighter
// zoom, which is most of what makes the country-level zoom layer useful for
// a nucleated cluster like Paris's three museums.
const CLUSTER_DEGREES = 1.2;
const FAN_RADIUS_DEGREES = 2.8;

function layoutPins(galleries) {
  const used = new Array(galleries.length).fill(false);
  const groups = [];

  for (let i = 0; i < galleries.length; i++) {
    if (used[i]) continue;
    const group = [galleries[i]];
    used[i] = true;
    for (let j = i + 1; j < galleries.length; j++) {
      if (used[j]) continue;
      const dLat = galleries[i].coords.lat - galleries[j].coords.lat;
      const dLon = galleries[i].coords.lon - galleries[j].coords.lon;
      if (Math.sqrt(dLat * dLat + dLon * dLon) < CLUSTER_DEGREES) {
        group.push(galleries[j]);
        used[j] = true;
      }
    }
    groups.push(group);
  }

  const positioned = [];
  for (const group of groups) {
    if (group.length === 1) {
      positioned.push({ gallery: group[0], lat: group[0].coords.lat, lon: group[0].coords.lon });
      continue;
    }
    const centroidLat = group.reduce((sum, g) => sum + g.coords.lat, 0) / group.length;
    const centroidLon = group.reduce((sum, g) => sum + g.coords.lon, 0) / group.length;
    group.forEach((gallery, i) => {
      const angle = (2 * Math.PI * i) / group.length;
      positioned.push({
        gallery,
        lat: centroidLat + FAN_RADIUS_DEGREES * Math.sin(angle),
        lon: centroidLon + FAN_RADIUS_DEGREES * Math.cos(angle),
      });
    });
  }
  return positioned;
}

// Positions the hover popup right next to a point (in viewport/client
// coordinates — a pin's own bounding-rect center, or the raw mouse
// position when hovering a country shape), flipping to whichever side of
// that point keeps it inside the map container instead of overflowing off
// the edge. Made visible first (at a throwaway position) purely so it has
// a real, measurable box — since this all happens synchronously before the
// next paint, that throwaway position is never actually rendered on screen.
function positionPopupNear(container, hoverInfo, clientX, clientY) {
  hoverInfo.hidden = false;
  hoverInfo.style.left = "0px";
  hoverInfo.style.top = "0px";

  const containerRect = container.getBoundingClientRect();
  const popupRect = hoverInfo.getBoundingClientRect();
  const anchorX = clientX - containerRect.left;
  const anchorY = clientY - containerRect.top;
  const margin = 16;
  const edgeGap = 8;

  let left = anchorX + margin;
  if (left + popupRect.width > containerRect.width - edgeGap) {
    left = anchorX - margin - popupRect.width;
  }
  left = Math.max(edgeGap, Math.min(left, containerRect.width - popupRect.width - edgeGap));

  let top = anchorY - popupRect.height / 2;
  top = Math.max(edgeGap, Math.min(top, containerRect.height - popupRect.height - edgeGap));

  hoverInfo.style.left = `${left}px`;
  hoverInfo.style.top = `${top}px`;
}

function setUpChrome(container) {
  const svg = container.querySelector("svg");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.classList.add("world-map-svg");

  // The embedded stylesheet's `.country { fill: #444444 }` would win the
  // cascade over our external stylesheet (later in the DOM once inlined) —
  // remove it and apply colors as inline styles instead, which win on
  // specificity and stay live across theme toggles since they reference
  // CSS custom properties.
  svg.querySelector("style")?.remove();

  for (const path of svg.querySelectorAll(".country")) {
    const code = [...path.classList].find((c) => c !== "country");
    const continent = COUNTRY_CONTINENTS[code];
    path.dataset.code = code;
    if (continent) {
      path.dataset.continent = continent;
      path.style.fill = `var(--map-${continentSlug(continent)})`;
    } else {
      // Antarctica and any unmapped code: neutral color, not clickable.
      path.style.fill = "var(--map-land)";
      path.classList.add("is-antarctica");
    }
  }

  const positioner = svg.querySelector("#positioner");
  const pinsGroup = document.createElementNS(SVG_NS, "g");
  pinsGroup.setAttribute("id", "map-pins");
  positioner.appendChild(pinsGroup);

  const hoverInfo = document.createElement("div");
  hoverInfo.className = "map-hover-info";
  hoverInfo.hidden = true;
  const hoverThumb = document.createElement("div");
  hoverThumb.className = "map-hover-thumb";
  const hoverText = document.createElement("div");
  hoverText.className = "map-hover-text";
  hoverInfo.append(hoverThumb, hoverText);
  container.appendChild(hoverInfo);

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "map-reset-zoom";
  resetBtn.textContent = "← Zoom out";
  resetBtn.hidden = true;
  resetBtn.addEventListener("click", () => container._onReset?.());
  container.appendChild(resetBtn);

  const caption = document.createElement("p");
  caption.className = "map-caption";
  caption.textContent = "Click a pin to step inside a gallery, or a continent (then a country) to zoom in.";
  container.appendChild(caption);

  // Event delegation instead of one listener per path (there are 243 of
  // them) — click/hover anywhere on a country shape resolves via
  // .closest(). Continent/country shapes are intentionally NOT made
  // keyboard-focusable (243 extra tab stops would be worse UX than the
  // shapes being mouse/touch-only); the continent filter chips are the
  // fully keyboard-accessible way to reach the same filter+zoom.
  svg.addEventListener("click", (event) => {
    const path = event.target.closest(".country");
    const continent = path?.dataset.continent;
    if (continent) container._onCountryClick?.(path.dataset.code, continent);
  });
  svg.addEventListener("mouseover", (event) => {
    const path = event.target.closest(".country");
    const continent = path?.dataset.continent;
    if (continent) {
      hoverThumb.hidden = true;
      hoverText.textContent = `${continent} — click to explore`;
      positionPopupNear(container, hoverInfo, event.clientX, event.clientY);
    }
  });
  svg.addEventListener("mousemove", (event) => {
    if (!hoverInfo.hidden && hoverThumb.hidden) {
      // Follow the cursor while hovering a (thumbnail-less) continent —
      // pins reposition on their own fixed point instead, see below.
      positionPopupNear(container, hoverInfo, event.clientX, event.clientY);
    }
  });
  svg.addEventListener("mouseout", (event) => {
    if (event.target.closest(".country")?.dataset.continent) hoverInfo.hidden = true;
  });

  container._svg = svg;
  container._pinsGroup = pinsGroup;
  container._hoverInfo = hoverInfo;
  container._hoverThumb = hoverThumb;
  container._hoverText = hoverText;
  container._resetBtn = resetBtn;
  container.dataset.mapReady = "true";
}

export async function renderMap(
  container,
  galleries,
  { onSelect, activeContinent = null, zoomedCountry = null, onCountryClick, onReset }
) {
  if (!container.dataset.mapReady) {
    container.innerHTML = await loadMapSvg();
    setUpChrome(container);
  }

  // Re-bind every render so the closures always see ui.js's latest state.
  container._onCountryClick = onCountryClick;
  container._onReset = onReset;

  const {
    _svg: svg,
    _pinsGroup: pinsGroup,
    _hoverInfo: hoverInfo,
    _hoverThumb: hoverThumb,
    _hoverText: hoverText,
    _resetBtn: resetBtn,
  } = container;
  resetBtn.hidden = !activeContinent && !zoomedCountry;
  pinsGroup.innerHTML = "";

  const mediaByGalleryId = new Map();

  for (const { gallery, lat, lon } of layoutPins(galleries)) {
    const link = document.createElementNS(SVG_NS, "a");
    link.setAttribute("href", `#/gallery/${gallery.id}`);
    link.setAttribute("class", "map-pin");
    link.setAttribute("tabindex", "0");

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", String(lon));
    circle.setAttribute("cy", String(lat));
    link.appendChild(circle);

    const title = document.createElementNS(SVG_NS, "title");
    title.textContent = gallery.name;
    link.appendChild(title);

    link.addEventListener("mouseenter", () => {
      hoverThumb.hidden = false;
      hoverThumb.style.background = "";
      const resolved = mediaByGalleryId.get(gallery.id);
      hoverThumb.innerHTML = "";
      if (resolved?.status === "image") {
        const img = document.createElement("img");
        img.src = resolved.url;
        img.alt = "";
        hoverThumb.appendChild(img);
      } else {
        hoverThumb.textContent = gallery.name.slice(0, 1);
      }
      hoverText.innerHTML = `<strong>${gallery.name}</strong><span>${gallery.city}, ${gallery.country}</span>`;
      const circleRect = circle.getBoundingClientRect();
      positionPopupNear(container, hoverInfo, circleRect.left + circleRect.width / 2, circleRect.top + circleRect.height / 2);
    });
    link.addEventListener("mouseleave", () => {
      hoverInfo.hidden = true;
    });
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      onSelect(gallery.id);
    });

    pinsGroup.appendChild(link);
  }

  const viewBoxNow = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  resizePins(pinsGroup, viewBoxNow[2]);

  let targetBox = WORLD_BOX;
  if (zoomedCountry) {
    const countryGalleries = galleries.filter((g) => g.country === zoomedCountry.name);
    targetBox = boundingBoxForGalleries(countryGalleries.length ? countryGalleries : galleries, "country");
  } else if (activeContinent) {
    targetBox = boundingBoxForGalleries(galleries, "continent");
  }

  animateViewBox(svg, targetBox, (currentWidth) => resizePins(pinsGroup, currentWidth));

  // Pre-fetch thumbnails for every gallery currently in view (fast follow —
  // pins already work without this; the popup just upgrades from an
  // initial letter monogram to the real photo once it resolves).
  resolveImages(galleries.map((g) => g.wikiTitle), THUMB_SIZE.CARD).then((results) => {
    for (const gallery of galleries) mediaByGalleryId.set(gallery.id, results.get(gallery.wikiTitle));
  });
}

export function countryToGalleryCountry(code) {
  return COUNTRY_CODE_TO_GALLERY_COUNTRY[code] ?? null;
}
