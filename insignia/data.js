// Word banks + palettes + line-mark paths for the Insignia generator.
// Mirrors NewCo's data.js shape: each category supplies `roots` used to
// build a brand name, the way NewCo's categories do — except here a
// "category" is a logo STYLE (Geometric, Monogram, Badge...) rather than
// an industry, because style is the thing that actually changes the
// generated artwork. Word mood still tracks the style (crisp/technical
// roots for Geometric, heraldic roots for Badge, etc.) so name and mark
// read as one consistent decision, same as NewCo's fintech/health split.

const CATEGORIES = {
  geometric: {
    label: "Geometric",
    roots: ["Prism", "Facet", "Vertex", "Axis", "Strata", "Meridian", "Polar", "Cipher", "Vantage", "Angular", "Nodal", "Tangent"]
  },
  monogram: {
    label: "Monogram",
    roots: ["Ansel", "Rowan", "Crane", "Alder", "Marsh", "Vance", "Sterling", "Cole", "Reed", "Harlow", "Quill", "Osric"]
  },
  badge: {
    label: "Badge & Crest",
    roots: ["Warden", "Oakley", "Crest", "Bastion", "Sentinel", "Forge", "Regal", "Ironwood", "Bellwether", "Garrison", "Keep", "Ledgerstone"]
  },
  line: {
    label: "Line Mark",
    roots: ["Current", "Drift", "Arc", "Wisp", "Glide", "Tide", "Flux", "Ripple", "Cascade", "Contour", "Wren", "Swale"]
  },
  negspace: {
    label: "Negative Space",
    roots: ["Duality", "Pivot", "Shift", "Fold", "Reverse", "Echo", "Contrast", "Threshold", "Hinge", "Split", "Mirror", "Cleave"]
  },
  wordmark: {
    label: "Wordmark",
    roots: ["Marlowe", "Sonder", "Elder", "Merit", "Folio", "Atlas", "Ledger", "Amble", "Weston", "Harrow", "Grove", "Brindle"]
  },
  combo: {
    label: "Combination",
    roots: ["Union", "Compass", "Bond", "Kindred", "Alloy", "Junction", "Foundry", "Bridgeway", "Cornerstone", "Wayfarer", "Anchor", "Coalition"]
  }
};

// Keys used when "All" is selected — a random one is picked per generation
// so a single mark+name+palette stays internally consistent (same idea as
// NewCo's CATEGORY_KEYS).
const CATEGORY_KEYS = ["geometric", "monogram", "badge", "line", "negspace", "wordmark", "combo"];

// Shared across every category — appended after a root in the "suffix" recipe.
const NAME_SUFFIXES = ["ify", "io", "ly", "eum", "ora", "ix", "house", "form", "mark", "craft", "stead", "co"];

// Shared across every category — paired with a root in the "two word" recipe.
// (NewCo's equivalent is TECH_WORDS; a branding studio's equivalent is these.)
const STUDIO_WORDS = ["Studio", "Co", "House", "Works", "Atelier", "Group", "Collective", "Supply", "Union", "Press"];

// Curated ink+accent pairs — never raw random RGB, so every result still
// looks "designed." `ink` is the primary dark color (used on the light/
// paper swatch); `paper` is the light background it sits on. The accent
// carries across both the light and dark (inverse) swatch unchanged, the
// way a real brand's accent color stays fixed while the mark itself
// reverses to white on a dark background.
// `moods` are matched (by substring, via keywordMatches() in app.js)
// against the free-text "keywords" business field — see KEYWORD_MAP
// below for the same idea applied to category choice.
const PALETTES = [
  { name: "Onyx & Brass", ink: "#181613", accent: "#b8863b", moods: ["heritage", "law", "legal", "lawyer", "attorney", "finance", "financial", "classic", "traditional", "academy", "bank", "banking", "insurance", "notary"] },
  { name: "Paper & Crimson", ink: "#1c1c1c", accent: "#c23b2e", moods: ["bold", "retail", "restaurant", "bakery", "energy", "sport", "sports", "fitness", "gym", "pizza", "burger"] },
  { name: "Slate & Cobalt", ink: "#1b1f24", accent: "#3454d1", moods: ["tech", "technology", "software", "startup", "data", "digital", "app", "ai", "crypto", "saas", "cloud", "engineering", "developer"] },
  { name: "Charcoal & Moss", ink: "#181a16", accent: "#5c7a4c", moods: ["eco", "ecology", "outdoor", "outdoors", "farm", "farming", "wellness", "nature", "sustainable", "sustainability", "garden", "gardening", "organic", "green"] },
  { name: "Ink & Coral", ink: "#17171a", accent: "#e2604f", moods: ["creative", "agency", "studio", "fashion", "design", "designer", "marketing", "branding", "advertising"] },
  { name: "Graphite & Gold", ink: "#19191c", accent: "#c9a227", moods: ["luxury", "jewelry", "jeweler", "private", "wealth", "boutique", "hotel", "hospitality", "premium", "concierge"] },
  { name: "Onyx & Teal", ink: "#15181a", accent: "#2c8c86", moods: ["health", "healthcare", "spa", "clinic", "yoga", "therapy", "therapist", "medical", "dental", "dentist", "physio", "pharmacy"] },
  { name: "Ink & Violet", ink: "#18161c", accent: "#7355c7", moods: ["creative", "publishing", "publisher", "literary", "magazine", "gaming", "game", "music", "musician", "podcast", "media"] },
  { name: "Charcoal & Rust", ink: "#1a1815", accent: "#b25a2e", moods: ["craft", "coffee", "cafe", "artisan", "brewery", "brewing", "outfitter", "leather", "woodwork", "carpentry", "woodworking", "roastery"] },
  { name: "Slate & Berry", ink: "#181820", accent: "#a1315f", moods: ["fashion", "boutique", "perfume", "editorial", "beauty", "salon", "cosmetics", "makeup", "hairdresser", "stylist"] }
];

// Free-text keyword → category suggestion, used only when "All" is the
// active chip (an explicit chip choice is a stronger signal than an
// inferred one, so keywords never override it — see resolveCategory() in
// app.js). Each category's list leans toward words that would plausibly
// describe that kind of business. Matching is substring-based (see
// keywordMatches() in app.js), so e.g. a typed "lawyers" still matches
// "law" below — the lists only need one form of a word, not every one.
const KEYWORD_MAP = {
  geometric: ["tech", "software", "ai", "data", "code", "engineer", "startup", "app", "crypto", "analytics", "cloud", "platform", "dev", "digital", "saas", "algorithm", "robotics", "blockchain"],
  monogram: ["law", "legal", "attorney", "consult", "finance", "bank", "account", "wealth", "advisory", "capital", "private", "personal", "firm", "notary", "insurance", "estate"],
  badge: ["heritage", "craft", "brewery", "coffee", "roaster", "outdoor", "adventure", "academy", "club", "farm", "traditional", "artisan", "distillery", "outfitter", "expedition", "scout", "guild", "society"],
  line: ["yoga", "wellness", "health", "spa", "fitness", "water", "ocean", "travel", "motion", "flow", "coach", "clinic", "therap", "athletic", "swim", "surf", "run", "cycle", "pilates"],
  negspace: ["creative", "agency", "balance", "mediation", "contrast", "duo", "partner", "bridge", "dual", "consult", "architect", "studio"],
  wordmark: ["fashion", "editorial", "boutique", "publish", "magazine", "luxury", "jewel", "literary", "perfume", "atelier", "beauty", "salon", "cosmetic", "florist", "gallery"],
  combo: ["retail", "restaurant", "cafe", "shop", "brand", "product", "store", "market", "bakery", "grocery", "kitchen", "deli", "diner", "catering", "food"]
};

const PAPER = "#f7f4ec"; // fixed light swatch background, used by every palette
const INVERSE_INK = "#f7f4ec"; // what "ink" reverses to on the dark swatch
const INVERSE_BG = "#1c1c1c"; // fixed dark swatch background

// Hand-authored single-stroke icon paths for the Line Mark category, each
// normalized to a 0–100 box. Picked at random, occasionally mirrored.
const LINE_PATH_TEMPLATES = [
  "M10,72 L35,32 L55,56 L90,18", // ascent / peak
  "M8,50 C22,28 34,72 50,50 C66,28 78,72 92,50", // wave
  "M10,86 L10,64 L35,64 L35,42 L60,42 L60,20 L85,20", // ascending steps
  "M12,54 L38,80 L90,16", // swoop / checkmark
  "M62,10 C32,10 22,50 62,90", // open bracket
  "M5,50 L26,50 L36,20 L52,80 L62,50 L95,50" // signal pulse
];

// Deadpan, deterministic "usage rule" line under every generated lockup —
// same trick as NewCo's domainLine(): funnier for never varying.
function usageLine(name) {
  return `${name} mark — reproduction, recoloring, or rotation requires written approval from Brand.`;
}
