// A hand-picked list of ~80 major world cities, each mapped to its real
// IANA time zone id (the same "Area/City" names browsers already carry
// internally, e.g. "Asia/Tokyo"). This is what lets the app turn a typed
// city name into an actual, DST-aware time zone with zero backend and no
// geocoding API call — the browser's own Intl object already knows every
// rule for these ids, we just need to point it at the right one.
const CITY_ZONES = [
  { city: "Honolulu", country: "USA", iana: "Pacific/Honolulu", aliases: ["hawaii"] },
  { city: "Anchorage", country: "USA", iana: "America/Anchorage", aliases: ["alaska"] },
  { city: "Los Angeles", country: "USA", iana: "America/Los_Angeles", aliases: ["la", "california"] },
  { city: "San Francisco", country: "USA", iana: "America/Los_Angeles", aliases: ["sf", "bay area", "silicon valley"] },
  { city: "Seattle", country: "USA", iana: "America/Los_Angeles", aliases: ["pnw"] },
  { city: "Vancouver", country: "Canada", iana: "America/Vancouver", aliases: [] },
  { city: "Denver", country: "USA", iana: "America/Denver", aliases: ["colorado"] },
  { city: "Phoenix", country: "USA", iana: "America/Phoenix", aliases: ["arizona"] },
  { city: "Chicago", country: "USA", iana: "America/Chicago", aliases: ["illinois"] },
  { city: "Houston", country: "USA", iana: "America/Chicago", aliases: ["texas"] },
  { city: "Dallas", country: "USA", iana: "America/Chicago", aliases: [] },
  { city: "Mexico City", country: "Mexico", iana: "America/Mexico_City", aliases: ["cdmx", "mexico"] },
  { city: "New York", country: "USA", iana: "America/New_York", aliases: ["nyc", "manhattan"] },
  { city: "Boston", country: "USA", iana: "America/New_York", aliases: [] },
  { city: "Washington DC", country: "USA", iana: "America/New_York", aliases: ["dc"] },
  { city: "Miami", country: "USA", iana: "America/New_York", aliases: ["florida"] },
  { city: "Toronto", country: "Canada", iana: "America/Toronto", aliases: ["ontario"] },
  { city: "Bogota", country: "Colombia", iana: "America/Bogota", aliases: ["colombia"] },
  { city: "Lima", country: "Peru", iana: "America/Lima", aliases: ["peru"] },
  { city: "Santiago", country: "Chile", iana: "America/Santiago", aliases: ["chile"] },
  { city: "Sao Paulo", country: "Brazil", iana: "America/Sao_Paulo", aliases: ["brazil", "sao paulo"] },
  { city: "Buenos Aires", country: "Argentina", iana: "America/Argentina/Buenos_Aires", aliases: ["argentina"] },
  { city: "London", country: "UK", iana: "Europe/London", aliases: ["uk", "england", "britain"] },
  { city: "Dublin", country: "Ireland", iana: "Europe/Dublin", aliases: ["ireland"] },
  { city: "Lisbon", country: "Portugal", iana: "Europe/Lisbon", aliases: ["portugal"] },
  { city: "Madrid", country: "Spain", iana: "Europe/Madrid", aliases: ["spain"] },
  { city: "Paris", country: "France", iana: "Europe/Paris", aliases: ["france"] },
  { city: "Brussels", country: "Belgium", iana: "Europe/Brussels", aliases: ["belgium"] },
  { city: "Amsterdam", country: "Netherlands", iana: "Europe/Amsterdam", aliases: ["holland", "netherlands"] },
  { city: "Berlin", country: "Germany", iana: "Europe/Berlin", aliases: ["germany"] },
  { city: "Frankfurt", country: "Germany", iana: "Europe/Berlin", aliases: [] },
  { city: "Zurich", country: "Switzerland", iana: "Europe/Zurich", aliases: ["switzerland"] },
  { city: "Vienna", country: "Austria", iana: "Europe/Vienna", aliases: ["austria"] },
  { city: "Rome", country: "Italy", iana: "Europe/Rome", aliases: ["italy"] },
  { city: "Copenhagen", country: "Denmark", iana: "Europe/Copenhagen", aliases: ["denmark"] },
  { city: "Stockholm", country: "Sweden", iana: "Europe/Stockholm", aliases: ["sweden"] },
  { city: "Oslo", country: "Norway", iana: "Europe/Oslo", aliases: ["norway"] },
  { city: "Warsaw", country: "Poland", iana: "Europe/Warsaw", aliases: ["poland"] },
  { city: "Athens", country: "Greece", iana: "Europe/Athens", aliases: ["greece"] },
  { city: "Helsinki", country: "Finland", iana: "Europe/Helsinki", aliases: ["finland"] },
  { city: "Istanbul", country: "Turkey", iana: "Europe/Istanbul", aliases: ["turkey"] },
  { city: "Moscow", country: "Russia", iana: "Europe/Moscow", aliases: ["russia"] },
  { city: "Cairo", country: "Egypt", iana: "Africa/Cairo", aliases: ["egypt"] },
  { city: "Nairobi", country: "Kenya", iana: "Africa/Nairobi", aliases: ["kenya"] },
  { city: "Lagos", country: "Nigeria", iana: "Africa/Lagos", aliases: ["nigeria"] },
  { city: "Johannesburg", country: "South Africa", iana: "Africa/Johannesburg", aliases: ["south africa", "cape town"] },
  { city: "Tel Aviv", country: "Israel", iana: "Asia/Jerusalem", aliases: ["israel", "jerusalem"] },
  { city: "Dubai", country: "UAE", iana: "Asia/Dubai", aliases: ["uae", "abu dhabi"] },
  { city: "Riyadh", country: "Saudi Arabia", iana: "Asia/Riyadh", aliases: ["saudi arabia"] },
  { city: "Doha", country: "Qatar", iana: "Asia/Qatar", aliases: ["qatar"] },
  { city: "Karachi", country: "Pakistan", iana: "Asia/Karachi", aliases: ["pakistan"] },
  { city: "Mumbai", country: "India", iana: "Asia/Kolkata", aliases: ["bombay"] },
  { city: "Delhi", country: "India", iana: "Asia/Kolkata", aliases: ["new delhi"] },
  { city: "Bangalore", country: "India", iana: "Asia/Kolkata", aliases: ["bengaluru"] },
  { city: "Kolkata", country: "India", iana: "Asia/Kolkata", aliases: ["calcutta", "india"] },
  { city: "Kathmandu", country: "Nepal", iana: "Asia/Kathmandu", aliases: ["nepal"] },
  { city: "Dhaka", country: "Bangladesh", iana: "Asia/Dhaka", aliases: ["bangladesh"] },
  { city: "Colombo", country: "Sri Lanka", iana: "Asia/Colombo", aliases: ["sri lanka"] },
  { city: "Bangkok", country: "Thailand", iana: "Asia/Bangkok", aliases: ["thailand"] },
  { city: "Yangon", country: "Myanmar", iana: "Asia/Yangon", aliases: ["myanmar", "rangoon"] },
  { city: "Jakarta", country: "Indonesia", iana: "Asia/Jakarta", aliases: ["indonesia"] },
  { city: "Bali", country: "Indonesia", iana: "Asia/Makassar", aliases: ["denpasar", "lombok", "mataram"] },
  { city: "Singapore", country: "Singapore", iana: "Asia/Singapore", aliases: ["sg"] },
  { city: "Kuala Lumpur", country: "Malaysia", iana: "Asia/Kuala_Lumpur", aliases: ["malaysia", "kl"] },
  { city: "Manila", country: "Philippines", iana: "Asia/Manila", aliases: ["philippines"] },
  { city: "Ho Chi Minh City", country: "Vietnam", iana: "Asia/Ho_Chi_Minh", aliases: ["saigon", "hanoi", "vietnam"] },
  { city: "Hong Kong", country: "Hong Kong", iana: "Asia/Hong_Kong", aliases: [] },
  { city: "Beijing", country: "China", iana: "Asia/Shanghai", aliases: ["china", "shanghai"] },
  { city: "Taipei", country: "Taiwan", iana: "Asia/Taipei", aliases: ["taiwan"] },
  { city: "Seoul", country: "South Korea", iana: "Asia/Seoul", aliases: ["korea"] },
  { city: "Tokyo", country: "Japan", iana: "Asia/Tokyo", aliases: ["japan"] },
  { city: "Perth", country: "Australia", iana: "Australia/Perth", aliases: ["western australia"] },
  { city: "Adelaide", country: "Australia", iana: "Australia/Adelaide", aliases: ["south australia"] },
  { city: "Darwin", country: "Australia", iana: "Australia/Darwin", aliases: ["northern territory"] },
  { city: "Brisbane", country: "Australia", iana: "Australia/Brisbane", aliases: ["queensland"] },
  { city: "Sydney", country: "Australia", iana: "Australia/Sydney", aliases: ["nsw"] },
  { city: "Melbourne", country: "Australia", iana: "Australia/Melbourne", aliases: ["victoria"] },
  { city: "Auckland", country: "New Zealand", iana: "Pacific/Auckland", aliases: ["new zealand", "nz"] },
  { city: "Fiji", country: "Fiji", iana: "Pacific/Fiji", aliases: [] },
];

function normalizeStr(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

// Scores how well a typed query matches one city entry. An exact match on
// the city name or an alias wins outright; a prefix match is still strong
// (someone typing "Sing" for "Singapore"); a plain substring match is the
// weakest signal, since short substrings can appear inside unrelated words.
function scoreEntry(query, entry) {
  const q = normalizeStr(query);
  if (!q) return 0;
  const candidates = [entry.city, entry.country, ...entry.aliases, entry.iana.split("/").pop().replace(/_/g, " ")];
  let best = 0;
  for (const raw of candidates) {
    const c = normalizeStr(raw);
    if (!c) continue;
    let score = 0;
    if (c === q) score = 100;
    else if (c.startsWith(q) || q.startsWith(c)) score = 75 + 10 * (Math.min(c.length, q.length) / Math.max(c.length, q.length));
    else if (c.includes(q)) score = 40 + 10 * (q.length / c.length);
    if (score > best) best = score;
  }
  return best;
}

// Best single match for a typed query, or null if nothing clears the bar.
function findCity(query) {
  if (!query || normalizeStr(query).length < 2) return null;
  let best = null;
  let bestScore = 0;
  for (const entry of CITY_ZONES) {
    const s = scoreEntry(query, entry);
    if (s > bestScore) {
      bestScore = s;
      best = entry;
    }
  }
  return bestScore >= 55 ? best : null;
}

// Top few loose matches for a query, used to offer "did you mean" chips
// when nothing scored high enough for findCity to auto-accept.
function suggestCities(query, limit = 3) {
  if (!query) return [];
  return CITY_ZONES
    .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.entry);
}

function countryForIana(iana) {
  const hit = CITY_ZONES.find((e) => e.iana === iana);
  return hit ? hit.country : "";
}
