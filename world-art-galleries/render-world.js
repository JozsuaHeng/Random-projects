// Renders the "Notable museums" horizontal strip (#notable-museums) shown
// below the world map — one card per gallery, each carrying a
// view-transition-name on its media element so clicking it can morph
// straight into the gallery-detail hero image. Map pins carry no
// view-transition-name of their own, so there's never a naming collision
// even though the map and this strip are visible at the same time.

import { resolveImages, THUMB_SIZE } from "./wiki-images.js";
import { ARCHITECTURE_STYLES } from "./galleries-data.js";
import { ART_MOVEMENTS } from "./artworks-data.js";
import { createMediaElement, applyImageResult } from "./media.js";

function archGradient(slug) {
  return ARCHITECTURE_STYLES.find((s) => s.slug === slug)?.gradient ?? ["#ccc", "#999"];
}

function archLabel(slugs) {
  return slugs.map((s) => ARCHITECTURE_STYLES.find((a) => a.slug === s)?.label ?? s).join(" · ");
}

function movementLabel(slug) {
  return ART_MOVEMENTS.find((m) => m.slug === slug)?.label ?? slug;
}

export function renderNotableMuseums(container, galleries, { onSelect }) {
  container.innerHTML = "";

  if (galleries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No notable museums yet — check back as more artwork research is added.";
    container.appendChild(empty);
    return;
  }

  const mediaByGallery = new Map();

  for (const gallery of galleries) {
    const card = document.createElement("a");
    card.href = `#/gallery/${gallery.id}`;
    card.className = "gallery-card";

    const media = createMediaElement({
      gradient: archGradient(gallery.architectureTags[0]),
      caption: gallery.name,
    });
    media.style.viewTransitionName = `gallery-card-${gallery.id}`;
    mediaByGallery.set(gallery.id, media);
    card.appendChild(media);

    const body = document.createElement("div");
    body.className = "card-body";

    const eyebrow = document.createElement("div");
    eyebrow.className = "card-eyebrow";
    eyebrow.textContent = archLabel(gallery.architectureTags);
    body.appendChild(eyebrow);

    const heading = document.createElement("h2");
    heading.textContent = gallery.name;
    body.appendChild(heading);

    const location = document.createElement("div");
    location.className = "card-location";
    location.textContent = `${gallery.city}, ${gallery.country}`;
    body.appendChild(location);

    card.appendChild(body);

    card.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      onSelect(gallery.id);
    });

    container.appendChild(card);
  }

  resolveImages(galleries.map((g) => g.wikiTitle), THUMB_SIZE.CARD).then((results) => {
    for (const gallery of galleries) {
      applyImageResult(mediaByGallery.get(gallery.id), results.get(gallery.wikiTitle), gallery.name);
    }
  });
}

// Renders the continent chip row shared by both the grid and map sub-views.
// `current` is the active continent (or null for "All"); `onChange` is
// called with the newly selected continent (or null).
export function renderContinentFilter(container, { continents, current, onChange }) {
  container.innerHTML = "";

  const allChip = document.createElement("button");
  allChip.type = "button";
  allChip.className = "chip";
  allChip.textContent = "All continents";
  allChip.setAttribute("aria-pressed", String(current === null));
  allChip.addEventListener("click", () => onChange(null));
  container.appendChild(allChip);

  for (const continent of continents) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = continent;
    chip.setAttribute("aria-pressed", String(current === continent));
    chip.addEventListener("click", () => onChange(continent));
    container.appendChild(chip);
  }
}

// Renders the art-type (movement) filter shown alongside the continent
// filter above the world map/grid. A dropdown rather than a chip row since
// the movement vocabulary (~30 entries) is far larger than continents.
// `current` is the active movement slug (or null for "All"); `onChange` is
// called with the newly selected slug (or null).
export function renderArtTypeFilter(container, { movements, current, onChange }) {
  container.innerHTML = "";

  const label = document.createElement("label");
  label.className = "filter-label";
  label.textContent = "Art type";
  label.htmlFor = "world-art-type-select";
  container.appendChild(label);

  const select = document.createElement("select");
  select.className = "filter-select";
  select.id = "world-art-type-select";
  const sorted = [...movements].sort((a, b) => movementLabel(a).localeCompare(movementLabel(b)));
  select.innerHTML =
    `<option value="">All art types</option>` +
    sorted.map((slug) => `<option value="${slug}"${slug === current ? " selected" : ""}>${movementLabel(slug)}</option>`).join("");
  select.addEventListener("change", () => onChange(select.value || null));
  container.appendChild(select);
}
