// Hash-based routing:
//   #/                              -> world view
//   #/gallery/<id>                  -> gallery detail
//   #/gallery/<id>/<artworkId>      -> artwork focus
//
// Hash routing (not pushState with real paths) is required because this
// deploys to GitHub Pages, which can't rewrite arbitrary paths server-side —
// a real-path router would 404 on refresh or a shared direct link.
//
// Nuance that shapes this file: history.pushState()/replaceState() never
// fire `hashchange` or `popstate` themselves — only user-driven back/forward
// (`popstate`) or a direct `location.hash = ...` assignment (`hashchange`)
// do. So `navigate()` below must call the render handler directly; it can't
// rely on any event firing as a side effect of changing the URL.

export function parseHash(hash) {
  const clean = hash.replace(/^#\/?/, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts[0] === "gallery" && parts[1]) {
    return parts[2]
      ? { view: "artwork", galleryId: parts[1], artworkId: parts[2] }
      : { view: "gallery", galleryId: parts[1] };
  }
  return { view: "world" };
}

export function buildHash(state) {
  if (state.view === "artwork") return `#/gallery/${state.galleryId}/${state.artworkId}`;
  if (state.view === "gallery") return `#/gallery/${state.galleryId}`;
  return "#/";
}

export function currentState() {
  return parseHash(location.hash);
}

let onNavigate = () => {};
// Browsers don't agree on whether same-page hash navigation fires
// `hashchange`, `popstate`, or both (e.g. back/forward reliably fires both
// in most current engines). Tracking the last hash we actually handled lets
// both listeners share one de-duplicated path instead of double-rendering
// (and double-triggering the view transition) for a single navigation.
let lastHandledHash = null;

// Registers the render callback and wires up browser-driven navigation
// (back/forward, manual address-bar hash edits). Call once at startup.
export function initRouter(handler) {
  onNavigate = handler;
  lastHandledHash = location.hash;

  function handleExternalNav() {
    if (location.hash === lastHandledHash) return;
    lastHandledHash = location.hash;
    handler(parseHash(location.hash));
  }

  window.addEventListener("popstate", handleExternalNav);
  window.addEventListener("hashchange", handleExternalNav);
}

// Script-driven navigation. `push: true` (default) adds a back-stop, for
// "real" navigation (world -> gallery, gallery -> artwork open/close).
// `push: false` uses replaceState instead, for prev/next stepping through
// artworks without piling up back-button history for every single step.
export function navigate(state, { push = true } = {}) {
  const hash = buildHash(state);
  lastHandledHash = hash;
  if (push) history.pushState(state, "", hash);
  else history.replaceState(state, "", hash);
  onNavigate(state);
}
