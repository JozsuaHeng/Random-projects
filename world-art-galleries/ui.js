// Orchestrator: theme toggle, router wiring, the single view-transition
// call site, and the dialog/carousel chrome that persists across
// re-renders (so it's wired once here rather than inside the render-*
// modules, which redraw their own contents on every navigation).

import { initRouter, navigate, currentState } from "./router.js";
import { GALLERIES } from "./galleries-data.js";
import { ARTWORKS } from "./artworks-data.js";
import { adjacentArtwork, distinctMovements, galleryIdsWithMovement } from "./filters.js";
import { renderNotableMuseums, renderContinentFilter, renderArtTypeFilter } from "./render-world.js";
import { renderMap, countryToGalleryCountry } from "./map-view.js";
import { renderGallery } from "./render-gallery.js";
import { renderArtworkFocus } from "./render-artwork.js";

const THEME_KEY = "wag-theme";

const worldSection = document.getElementById("view-world");
const gallerySection = document.getElementById("view-gallery");
const notableMuseumsEl = document.getElementById("notable-museums");
const mapContainer = document.getElementById("world-map-container");
const continentFilterEl = document.getElementById("continent-filter");
const artTypeFilterEl = document.getElementById("art-type-filter");
const carouselEl = document.getElementById("artwork-carousel");
const dialog = document.getElementById("artwork-dialog");
const artworkFocus = document.getElementById("artwork-focus");
const themeToggle = document.getElementById("theme-toggle");

// ---- Theme ----

function preferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // localStorage unavailable (private browsing, etc) — fall through
  }
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

applyTheme(preferredTheme());

// ---- View transitions ----
// Same-document View Transitions are broadly supported at this point; the
// feature-detect + prefers-reduced-motion check below is what falls back to
// a plain, instant swap where unsupported — still fully functional, just
// without the morph/crossfade.

function transition(updateDom) {
  if (typeof document.startViewTransition !== "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    updateDom();
    return;
  }
  const vt = document.startViewTransition(updateDom);
  // AbortError here just means a later navigation superseded this
  // transition before it finished (e.g. rapid clicking) — expected per
  // spec, not a bug, and the DOM update itself already applied regardless.
  // Anything else is worth surfacing rather than swallowing silently.
  const logIfUnexpected = (err) => {
    if (err?.name !== "AbortError") console.error("[view-transition]", err);
  };
  vt.ready?.catch(logIfUnexpected);
  vt.updateCallbackDone?.catch(logIfUnexpected);
}

// ---- World view: interactive map + notable-museums strip ----
// The map is always visible; the continent/art-type filters below narrow
// down its pins. The "Notable museums" strip beneath it is a separate,
// unfiltered shortcut — always every gallery with NOTABLE_MIN_ARTWORKS or
// more researched artworks, sorted by depth, so it grows on its own as more
// batches of artwork research land rather than needing a hardcoded list.

const NOTABLE_MIN_ARTWORKS = 12;

let worldContinentFilter = null;
// Art-type (movement) filter, independent of the continent filter — the two
// combine with AND. Unlike the continent filter, changing this never touches
// zoomedCountry: it's a "which galleries qualify" filter, not a camera move.
let worldArtTypeFilter = null;
// Second zoom layer, map-only (doesn't filter the grid/pins — it's purely a
// tighter "camera" position within the already-focused continent). Shape:
// { code: "FRA", name: "France" } | null. Always cleared whenever the
// continent filter itself changes, so it can never point at a country in a
// continent that's no longer selected.
let zoomedCountry = null;
const CONTINENTS = [...new Set(GALLERIES.map((g) => g.continent))].sort();
const WORLD_MOVEMENTS = distinctMovements(ARTWORKS);

function visibleGalleries() {
  let galleries = worldContinentFilter ? GALLERIES.filter((g) => g.continent === worldContinentFilter) : GALLERIES;
  if (worldArtTypeFilter) {
    const ids = galleryIdsWithMovement(ARTWORKS, worldArtTypeFilter);
    galleries = galleries.filter((g) => ids.has(g.id));
  }
  return galleries;
}

// Independent of the map's continent/art-type filters — always the same
// "most complete" set regardless of what the map is currently showing.
function notableGalleries() {
  const counts = new Map();
  for (const a of ARTWORKS) counts.set(a.galleryId, (counts.get(a.galleryId) ?? 0) + 1);
  return GALLERIES.filter((g) => (counts.get(g.id) ?? 0) >= NOTABLE_MIN_ARTWORKS).sort(
    (a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0)
  );
}

// Single source of truth for "which continent is selected" — used by the
// filter chips and by the map's "zoom out" button (stepping back from
// continent to world), so both stay in sync with each other and with the
// map's zoom state.
function setContinentFilter(continent) {
  worldContinentFilter = continent;
  zoomedCountry = null;
  renderWorldScreen();
}

function setArtTypeFilter(movement) {
  worldArtTypeFilter = movement;
  renderWorldScreen();
}

// Handles a click on a country's shape on the map. First click on any
// country in a not-yet-focused continent zooms to that CONTINENT (same
// as clicking its filter chip). A second click, on a country within the
// continent that's already focused, drills one layer further into that
// specific COUNTRY — this is what separates a nucleated cluster like
// Paris's three museums once you're already looking at Europe.
function handleCountryClick(code, continent) {
  if (worldContinentFilter !== continent) {
    setContinentFilter(continent);
    return;
  }
  const countryName = countryToGalleryCountry(code);
  const hasGalleries = countryName && GALLERIES.some((g) => g.country === countryName && g.continent === continent);
  if (hasGalleries) {
    zoomedCountry = { code, name: countryName };
    renderWorldScreen();
  }
  // A country with no galleries, clicked while its continent is already
  // focused, has nothing to zoom to further — no-op rather than a dead end.
}

// Steps back exactly one zoom layer: country -> continent -> world.
function zoomOut() {
  if (zoomedCountry) {
    zoomedCountry = null;
  } else {
    worldContinentFilter = null;
  }
  renderWorldScreen();
}

function renderWorldScreen() {
  renderContinentFilter(continentFilterEl, {
    continents: CONTINENTS,
    current: worldContinentFilter,
    onChange: setContinentFilter,
  });

  renderArtTypeFilter(artTypeFilterEl, {
    movements: WORLD_MOVEMENTS,
    current: worldArtTypeFilter,
    onChange: setArtTypeFilter,
  });

  renderMap(mapContainer, visibleGalleries(), {
    onSelect: goToGallery,
    activeContinent: worldContinentFilter,
    zoomedCountry,
    onCountryClick: handleCountryClick,
    onReset: zoomOut,
  });

  renderNotableMuseums(notableMuseumsEl, notableGalleries(), { onSelect: goToGallery });
}

// ---- Rendering ----

function findGallery(id) {
  return GALLERIES.find((g) => g.id === id);
}
function findArtwork(id) {
  return ARTWORKS.find((a) => a.id === id);
}

function applyState(state) {
  if (state.view === "gallery" || state.view === "artwork") {
    const gallery = findGallery(state.galleryId);
    if (!gallery) {
      applyState({ view: "world" });
      return;
    }

    worldSection.hidden = true;
    gallerySection.hidden = false;
    renderGallery(gallerySection, gallery, ARTWORKS, {
      onSelectArtwork: goToArtwork,
      activeArtworkId: state.view === "artwork" ? state.artworkId : null,
    });

    if (state.view === "artwork") {
      const artwork = findArtwork(state.artworkId);
      if (!artwork || artwork.galleryId !== gallery.id) {
        navigate({ view: "gallery", galleryId: gallery.id }, { push: false });
        return;
      }
      renderArtworkFocus(artworkFocus, artwork, gallery);
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  } else {
    worldSection.hidden = false;
    gallerySection.hidden = true;
    if (dialog.open) dialog.close();
    renderWorldScreen();
  }
}

function goToGallery(galleryId) {
  navigate({ view: "gallery", galleryId });
}
function goToArtwork(galleryId, artworkId, options) {
  navigate({ view: "artwork", galleryId, artworkId }, options);
}

// `navigate()` (router.js) is the single trigger for re-renders — both
// script-driven calls (card clicks, dialog buttons below) and
// browser-driven ones (back/forward, manual hash edits) funnel through this
// one transition-wrapped handler, so nothing double-wraps startViewTransition.
initRouter((state) => transition(() => applyState(state)));
applyState(currentState()); // initial load: no transition, nothing to morph from yet

// ---- Dialog chrome (static; wired once) ----

function closeToGallery() {
  const state = currentState();
  if (state.view === "artwork") {
    navigate({ view: "gallery", galleryId: state.galleryId });
  }
}

function stepArtwork(direction) {
  const state = currentState();
  if (state.view !== "artwork") return;
  const nextId = adjacentArtwork(ARTWORKS, state.galleryId, state.artworkId, direction);
  if (!nextId || nextId === state.artworkId) return;
  navigate({ view: "artwork", galleryId: state.galleryId, artworkId: nextId }, { push: false });
}

document.getElementById("dialog-close").addEventListener("click", closeToGallery);
document.getElementById("dialog-prev").addEventListener("click", () => stepArtwork(-1));
document.getElementById("dialog-next").addEventListener("click", () => stepArtwork(1));

// Escape: let <dialog> tell us it wants to close (native 'cancel' event),
// but drive the actual close through navigate() so the URL and dialog state
// never disagree with each other.
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeToGallery();
});

// Click on the backdrop to close. Listens on `document` (not `dialog`) and
// hit-tests by coordinate rather than checking `event.target === dialog`:
// right after a view-transition-wrapped showModal(), Chromium has a brief
// window (observed up to ~1-2s) where the dialog is open and correctly
// positioned, but a backdrop click's event.target resolves to <html>
// instead of the dialog — meaning the click never even reaches a listener
// attached to the dialog element itself. Listening on `document` catches it
// regardless of what the browser attributes as the target, and comparing
// coordinates against the dialog's own (always-accurate) bounding box
// sidesteps the timing gap entirely.
document.addEventListener("click", (event) => {
  if (!dialog.open) return;
  const rect = dialog.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) closeToGallery();
});

document.addEventListener("keydown", (event) => {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") stepArtwork(-1);
  if (event.key === "ArrowRight") stepArtwork(1);
});

// ---- Carousel scroll chrome (static; wired once) ----

document.getElementById("carousel-prev").addEventListener("click", () => {
  carouselEl.scrollBy({ left: -320, behavior: "smooth" });
});
document.getElementById("carousel-next").addEventListener("click", () => {
  carouselEl.scrollBy({ left: 320, behavior: "smooth" });
});
