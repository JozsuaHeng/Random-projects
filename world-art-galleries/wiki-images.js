// Looks up images for galleries/artworks at runtime via Wikipedia's public,
// key-less, CORS-enabled MediaWiki API. No DOM access — returns plain data,
// same "pure logic, no DOM" contract as filters.js and router.js, just
// async because it involves a network call.
//
// origin=* is Wikimedia's documented mechanism for unauthenticated
// client-side API access (see mw:API:Cross-site_requests) — not a
// workaround, and not a reason to feel bad about hotlinking the thumbnails.

const API_BASE = "https://en.wikipedia.org/w/api.php";
const CACHE_PREFIX = "wag-img-cache:v1:";
const TTL_OK_MS = 30 * 24 * 60 * 60 * 1000; // successful lookups: cache 30 days
const TTL_FAIL_MS = 1 * 24 * 60 * 60 * 1000; // failed/missing lookups: retry after 1 day
const BATCH_LIMIT = 50; // Wikipedia's documented max titles per query

export const THUMB_SIZE = { CARD: 250, HERO: 960 };

function cacheKey(title, size) {
  return `${CACHE_PREFIX}${size}:${title}`;
}

function readCache(title, size) {
  try {
    const raw = localStorage.getItem(cacheKey(title, size));
    if (!raw) return null;
    const entry = JSON.parse(raw);
    const ttl = entry.status === "image" ? TTL_OK_MS : TTL_FAIL_MS;
    if (Date.now() - entry.fetchedAt > ttl) return null;
    return entry;
  } catch {
    return null;
  }
}

function writeCache(title, size, entry) {
  try {
    localStorage.setItem(cacheKey(title, size), JSON.stringify({ ...entry, fetchedAt: Date.now() }));
  } catch {
    // localStorage full/unavailable (private browsing, etc) — fine to skip caching
  }
}

// Maps each FINAL resolved page title back to the ORIGINAL requested title,
// by composing the API's normalization + redirect chains, so results can be
// looked up by the title callers actually asked for.
function buildTitleBacklinks(data) {
  const backlinks = new Map();
  const afterNormalize = new Map();
  for (const n of data?.query?.normalized ?? []) afterNormalize.set(n.to, n.from);
  for (const r of data?.query?.redirects ?? []) {
    backlinks.set(r.to, afterNormalize.get(r.from) ?? r.from);
  }
  for (const n of data?.query?.normalized ?? []) {
    if (!backlinks.has(n.to)) backlinks.set(n.to, n.from);
  }
  return backlinks;
}

async function fetchBatch(titles, size) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    redirects: "1",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: String(size),
    titles: titles.join("|"),
  });
  const res = await fetch(`${API_BASE}?${params}`);
  if (!res.ok) throw new Error(`Wikipedia API responded ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages ?? {};
  const backlinks = buildTitleBacklinks(data);
  const byTitle = new Map();

  for (const page of Object.values(pages)) {
    const thumb = page.thumbnail;
    const result = thumb
      ? { status: "image", url: thumb.source, width: thumb.width, height: thumb.height }
      : { status: "placeholder" };
    byTitle.set(page.title, result);
    const original = backlinks.get(page.title);
    if (original) byTitle.set(original, result);
  }
  return byTitle;
}

/**
 * Resolves images for a list of wikiTitle strings at the given thumbnail
 * width (use a standard Wikimedia bucket — see THUMB_SIZE — to avoid the
 * image scaler's rate limiting on non-standard sizes).
 *
 * Returns Map<wikiTitle, {status:'image',url,width,height} | {status:'placeholder'}>.
 * Never throws — offline/API failures resolve every requested title to
 * {status:'placeholder'} instead, so callers never need their own try/catch.
 */
export async function resolveImages(wikiTitles, size) {
  const results = new Map();
  const needsFetch = [];

  for (const title of wikiTitles) {
    const cached = readCache(title, size);
    if (cached) results.set(title, cached);
    else needsFetch.push(title);
  }

  for (let i = 0; i < needsFetch.length; i += BATCH_LIMIT) {
    const batch = needsFetch.slice(i, i + BATCH_LIMIT);
    try {
      const fetched = await fetchBatch(batch, size);
      for (const title of batch) {
        const result = fetched.get(title) ?? { status: "placeholder" };
        results.set(title, result);
        writeCache(title, size, result);
      }
    } catch {
      for (const title of batch) {
        const result = { status: "placeholder" };
        results.set(title, result);
        writeCache(title, size, result);
      }
    }
  }

  return results;
}
