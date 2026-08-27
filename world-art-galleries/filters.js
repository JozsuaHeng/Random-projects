// Pure functions, no DOM access — filters a single gallery's artworks by
// movement (multi-select, OR within the facet), artist (single-select),
// and era bucket (single-select). All three combine with AND logic.
// Testable in isolation via `node --input-type=module`.

export function artworksForGallery(artworks, galleryId) {
  return artworks.filter((a) => a.galleryId === galleryId);
}

export function distinctArtists(artworks) {
  return [...new Set(artworks.map((a) => a.artist))].sort();
}

export function distinctMovements(artworks) {
  return [...new Set(artworks.flatMap((a) => a.movements))];
}

// Which galleries have at least one artwork in the given movement — powers
// the world-view art-type filter (map pins + grid cards).
export function galleryIdsWithMovement(artworks, movement) {
  return new Set(artworks.filter((a) => a.movements.includes(movement)).map((a) => a.galleryId));
}

function formatEraYear(year) {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year}`;
}

// Era buckets are computed dynamically from whatever years are actually
// present in this gallery (rather than a fixed global scheme), with bucket
// width adapting to the span so a narrow-range gallery (e.g. a museum built
// on one 17th-century collection) still gets several useful buckets instead
// of one giant one. Empty buckets are dropped.
export function eraBuckets(artworks) {
  if (artworks.length === 0) return [];
  const years = artworks.map((a) => a.year);
  const min = Math.min(...years);
  const max = Math.max(...years);
  const span = max - min;
  const bucketSize = span > 300 ? 100 : span > 80 ? 50 : 10;

  const buckets = [];
  let start = Math.floor(min / bucketSize) * bucketSize;
  while (start <= max) {
    const end = start + bucketSize - 1;
    const count = years.filter((y) => y >= start && y <= end).length;
    if (count > 0) {
      buckets.push({
        id: `${start}`,
        label: `${formatEraYear(start)}–${formatEraYear(end)}`,
        start,
        end,
        count,
      });
    }
    start += bucketSize;
  }
  return buckets;
}

export function filterArtworks(artworks, { movements = [], artist = null, eraId = null, buckets = [] } = {}) {
  return artworks.filter((a) => {
    if (movements.length > 0 && !a.movements.some((m) => movements.includes(m))) return false;
    if (artist && a.artist !== artist) return false;
    if (eraId) {
      const bucket = buckets.find((b) => b.id === eraId);
      if (bucket && (a.year < bucket.start || a.year > bucket.end)) return false;
    }
    return true;
  });
}

// Used for prev/next stepping inside the artwork focus dialog. Cycles
// through the FULL gallery collection in data order (not the currently
// filtered/visible subset) — the dialog is a "browse the whole collection"
// view, independent of whatever the carousel happens to be filtered to.
export function adjacentArtwork(artworks, galleryId, currentArtworkId, direction) {
  const list = artworksForGallery(artworks, galleryId);
  const idx = list.findIndex((a) => a.id === currentArtworkId);
  if (idx === -1 || list.length === 0) return null;
  const nextIndex = (idx + direction + list.length) % list.length;
  return list[nextIndex].id;
}
