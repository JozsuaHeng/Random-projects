// Renders the gallery-detail screen: hero (#gallery-hero), filter bar
// (#filter-bar), and artwork carousel (#artwork-carousel). Filter state
// (selected movements/artist/era) is kept module-scoped here rather than in
// ui.js, and resets whenever a *different* gallery is opened — per the
// plan, filters don't survive leaving the gallery.

import { resolveImages, THUMB_SIZE } from "./wiki-images.js";
import { ARCHITECTURE_STYLES } from "./galleries-data.js";
import { ART_MOVEMENTS } from "./artworks-data.js";
import { artworksForGallery, distinctArtists, eraBuckets, filterArtworks } from "./filters.js";
import { createMediaElement, applyImageResult } from "./media.js";

function archLabel(slug) {
  return ARCHITECTURE_STYLES.find((s) => s.slug === slug)?.label ?? slug;
}
function archGradient(slug) {
  return ARCHITECTURE_STYLES.find((s) => s.slug === slug)?.gradient ?? ["#ccc", "#999"];
}
function movementInfo(slug) {
  return ART_MOVEMENTS.find((m) => m.slug === slug) ?? { slug, label: slug, gradient: ["#ccc", "#999"] };
}

let filterState = { movements: [], artist: null, eraId: null };
let filterStateGalleryId = null;

export function renderGallery(container, gallery, allArtworks, { onSelectArtwork, activeArtworkId = null } = {}) {
  if (filterStateGalleryId !== gallery.id) {
    filterState = { movements: [], artist: null, eraId: null };
    filterStateGalleryId = gallery.id;
  }

  const heroEl = container.querySelector("#gallery-hero");
  const filterBarEl = container.querySelector("#filter-bar");
  const carouselEl = container.querySelector("#artwork-carousel");

  const galleryArtworks = artworksForGallery(allArtworks, gallery.id);
  const artists = distinctArtists(galleryArtworks);
  const buckets = eraBuckets(galleryArtworks);
  const movementSlugs = [...new Set(galleryArtworks.flatMap((a) => a.movements))].sort((a, b) =>
    movementInfo(a).label.localeCompare(movementInfo(b).label)
  );

  renderHero(heroEl, gallery);

  function redraw() {
    const visible = filterArtworks(galleryArtworks, { ...filterState, buckets });
    renderFilterBar(filterBarEl, {
      movementSlugs,
      artists,
      buckets,
      total: galleryArtworks.length,
      visibleCount: visible.length,
      onChange: redraw,
    });
    renderCarousel(carouselEl, visible, onSelectArtwork, activeArtworkId);
  }

  redraw();
}

function renderHero(heroEl, gallery) {
  heroEl.innerHTML = "";

  const media = createMediaElement({ gradient: archGradient(gallery.architectureTags[0]), caption: gallery.name });
  media.style.viewTransitionName = `gallery-card-${gallery.id}`;
  heroEl.appendChild(media);

  const info = document.createElement("div");
  info.className = "hero-info";

  const eyebrow = document.createElement("div");
  eyebrow.className = "hero-eyebrow";
  eyebrow.textContent = `${gallery.city}, ${gallery.country} · Est. ${gallery.yearOpened}`;
  info.appendChild(eyebrow);

  const heading = document.createElement("h1");
  heading.textContent = gallery.name;
  info.appendChild(heading);

  const meta = document.createElement("div");
  meta.className = "hero-meta";
  meta.textContent = gallery.architect;
  info.appendChild(meta);

  const description = document.createElement("p");
  description.className = "hero-description";
  description.textContent = gallery.description;
  info.appendChild(description);

  const tags = document.createElement("div");
  tags.className = "architecture-tags";
  for (const slug of gallery.architectureTags) {
    const tag = document.createElement("span");
    tag.className = "architecture-tag";
    tag.textContent = archLabel(slug);
    tags.appendChild(tag);
  }
  info.appendChild(tags);

  heroEl.appendChild(info);

  resolveImages([gallery.wikiTitle], THUMB_SIZE.HERO).then((results) => {
    applyImageResult(media, results.get(gallery.wikiTitle), gallery.name);
  });
}

function renderFilterBar(filterBarEl, { movementSlugs, artists, buckets, total, visibleCount, onChange }) {
  filterBarEl.innerHTML = "";
  const hasFilters = filterState.movements.length > 0 || filterState.artist || filterState.eraId;

  // Movement: multi-select chips (OR within the facet).
  const movementGroup = document.createElement("div");
  movementGroup.className = "filter-group";
  const movementLabel = document.createElement("span");
  movementLabel.className = "filter-label";
  movementLabel.textContent = "Movement";
  movementGroup.appendChild(movementLabel);
  for (const slug of movementSlugs) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = movementInfo(slug).label;
    chip.setAttribute("aria-pressed", String(filterState.movements.includes(slug)));
    chip.addEventListener("click", () => {
      filterState.movements = filterState.movements.includes(slug)
        ? filterState.movements.filter((m) => m !== slug)
        : [...filterState.movements, slug];
      onChange();
    });
    movementGroup.appendChild(chip);
  }
  filterBarEl.appendChild(movementGroup);

  // Artist: single-select dropdown.
  const artistGroup = document.createElement("div");
  artistGroup.className = "filter-group";
  const artistLabel = document.createElement("label");
  artistLabel.className = "filter-label";
  artistLabel.textContent = "Artist";
  artistLabel.htmlFor = "filter-artist";
  artistGroup.appendChild(artistLabel);
  const artistSelect = document.createElement("select");
  artistSelect.className = "filter-select";
  artistSelect.id = "filter-artist";
  artistSelect.innerHTML =
    `<option value="">All artists</option>` +
    artists.map((a) => `<option value="${a}"${a === filterState.artist ? " selected" : ""}>${a}</option>`).join("");
  artistSelect.addEventListener("change", () => {
    filterState.artist = artistSelect.value || null;
    onChange();
  });
  artistGroup.appendChild(artistSelect);
  filterBarEl.appendChild(artistGroup);

  // Era: single-select dropdown of dynamically computed buckets.
  const eraGroup = document.createElement("div");
  eraGroup.className = "filter-group";
  const eraLabel = document.createElement("label");
  eraLabel.className = "filter-label";
  eraLabel.textContent = "Era";
  eraLabel.htmlFor = "filter-era";
  eraGroup.appendChild(eraLabel);
  const eraSelect = document.createElement("select");
  eraSelect.className = "filter-select";
  eraSelect.id = "filter-era";
  eraSelect.innerHTML =
    `<option value="">All years</option>` +
    buckets
      .map((b) => `<option value="${b.id}"${b.id === filterState.eraId ? " selected" : ""}>${b.label} (${b.count})</option>`)
      .join("");
  eraSelect.addEventListener("change", () => {
    filterState.eraId = eraSelect.value || null;
    onChange();
  });
  eraGroup.appendChild(eraSelect);
  filterBarEl.appendChild(eraGroup);

  // Results count + clear-filters, right-aligned.
  const tail = document.createElement("div");
  tail.className = "filter-bar-tail";
  const count = document.createElement("span");
  count.textContent = `${visibleCount} of ${total}`;
  tail.appendChild(count);
  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "clear-filters";
  clearBtn.textContent = "Clear filters";
  clearBtn.hidden = !hasFilters;
  clearBtn.addEventListener("click", () => {
    filterState = { movements: [], artist: null, eraId: null };
    onChange();
  });
  tail.appendChild(clearBtn);
  filterBarEl.appendChild(tail);
}

function renderCarousel(carouselEl, visibleArtworks, onSelectArtwork, activeArtworkId) {
  carouselEl.innerHTML = "";

  if (visibleArtworks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No artworks match these filters. Try clearing one.";
    carouselEl.appendChild(empty);
    return;
  }

  for (const artwork of visibleArtworks) {
    const card = document.createElement("a");
    card.href = `#/gallery/${artwork.galleryId}/${artwork.id}`;
    card.className = "artwork-card";

    const media = createMediaElement({
      gradient: movementInfo(artwork.movements[0]).gradient,
      caption: artwork.title,
    });
    // Skip the shared transition name on whichever card is currently open
    // in the focus dialog — the dialog's own image is carrying that name
    // instead, and the API rejects two elements sharing one name at once.
    if (artwork.id !== activeArtworkId) {
      media.style.viewTransitionName = `artwork-${artwork.id}`;
    }
    card.appendChild(media);

    const body = document.createElement("div");
    body.className = "card-body";

    const heading = document.createElement("h3");
    heading.textContent = artwork.title;
    body.appendChild(heading);

    const artist = document.createElement("div");
    artist.className = "card-artist";
    artist.textContent = `${artwork.artist} · ${artwork.yearDisplay}`;
    body.appendChild(artist);

    const movement = document.createElement("div");
    movement.className = "card-movement";
    movement.textContent = artwork.movements.map((m) => movementInfo(m).label).join(" · ");
    body.appendChild(movement);

    card.appendChild(body);

    card.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      onSelectArtwork(artwork.galleryId, artwork.id);
    });

    carouselEl.appendChild(card);
  }

  resolveImages(visibleArtworks.map((a) => a.wikiTitle), THUMB_SIZE.CARD).then((results) => {
    const cards = [...carouselEl.children];
    visibleArtworks.forEach((artwork, i) => {
      const media = cards[i]?.querySelector(".media");
      applyImageResult(media, results.get(artwork.wikiTitle), artwork.title);
    });
  });
}
