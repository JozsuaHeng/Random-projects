// Word banks + name recipes for the NewCo generator.
// Each category supplies roots (used to build names) and
// nouns/verbs/adjectives (used to fill tagline templates).

const CATEGORIES = {
  fintech: {
    label: "Fintech",
    roots: ["Ledger", "Vault", "Yield", "Stake", "Bridge", "Wire", "Coin", "Reserve", "Equity", "Fund", "Vantage", "Anchor", "Escrow", "Mint", "Capital", "Payroll"],
    nouns: ["balance sheet", "cash flow", "payroll", "portfolio", "credit line", "invoice", "spend", "runway", "treasury", "ledger"],
    verbs: ["move money", "close the books", "get paid", "raise capital", "underwrite risk", "reconcile the books", "settle instantly"],
    adjectives: ["frictionless", "compliant", "instant", "audited", "borderless", "liquid", "bank-grade"]
  },
  health: {
    label: "Health",
    roots: ["Vital", "Mend", "Bloom", "Thrive", "Pulse", "Renew", "Remedy", "Kindred", "Restore", "Nourish", "Clarity", "Wellspring", "Haven", "Tend"],
    nouns: ["patient care", "health record", "recovery", "wellness routine", "diagnosis", "care team", "appointment", "checkup"],
    verbs: ["heal faster", "see a doctor", "track your health", "get diagnosed", "stay well", "manage care", "catch it early"],
    adjectives: ["personalized", "evidence-based", "proactive", "human", "clinical-grade", "judgment-free"]
  },
  ai: {
    label: "AI & Dev",
    roots: ["Cortex", "Vector", "Stack", "Forge", "Compile", "Nimbus", "Signal", "Loop", "Grid", "Synth", "Kernel", "Runtime", "Cache", "Query", "Latent"],
    nouns: ["codebase", "pipeline", "workflow", "infrastructure", "model", "stack", "deployment", "backlog"],
    verbs: ["ship faster", "train models", "automate everything", "scale infinitely", "deploy in seconds", "debug itself", "write its own code"],
    adjectives: ["autonomous", "composable", "real-time", "self-healing", "infinitely scalable", "model-agnostic"]
  },
  climate: {
    label: "Climate",
    roots: ["Grove", "Tide", "Terra", "Verdant", "Root", "Canopy", "Current", "Harvest", "Horizon", "Basin", "Meadow", "Solstice", "Evergreen"],
    nouns: ["carbon footprint", "the grid", "emissions", "supply chain", "energy bill", "the planet", "waste stream"],
    verbs: ["decarbonize", "go net-zero", "offset emissions", "electrify everything", "reduce waste", "close the loop"],
    adjectives: ["regenerative", "carbon-negative", "circular", "sustainable", "climate-positive", "net-zero"]
  },
  consumer: {
    label: "Consumer",
    roots: ["Nook", "Haven", "Wander", "Ritual", "Kindred", "Drift", "Ember", "Field", "Thread", "Grove", "Echo", "Hearth", "Glow", "Foster", "Bramble"],
    nouns: ["morning routine", "self-care ritual", "wardrobe", "weeknight dinner", "weekend", "downtime", "home"],
    verbs: ["shop smarter", "simplify life", "slow down", "start the day right", "make room for joy", "stop settling"],
    adjectives: ["effortless", "curated", "intentional", "joyful", "unfussy", "quietly better"]
  },
  edtech: {
    label: "EdTech",
    roots: ["Scholar", "Tutor", "Primer", "Lyceum", "Cognate", "Bright", "Learnly", "Chalk", "Campus", "Mentor", "Alcove", "Quill", "Recite", "Aptitude"],
    nouns: ["classroom", "curriculum", "homework", "lesson plan", "tuition", "transcript", "study group", "report card"],
    verbs: ["learn faster", "grade papers", "track progress", "engage students", "close skill gaps", "finish the semester"],
    adjectives: ["personalized", "gamified", "standards-aligned", "bite-sized", "mastery-based", "student-first"]
  },
  legal: {
    label: "Legal",
    roots: ["Statute", "Brief", "Counsel", "Docket", "Clause", "Verdict", "Precedent", "Redline", "Bench", "Litigant", "Affidavit", "Codex"],
    nouns: ["contract", "redline", "discovery", "compliance", "NDA", "billable hour", "case file", "clause"],
    verbs: ["review contracts", "close deals faster", "cut legal spend", "catch liability", "redline in minutes", "clear the docket"],
    adjectives: ["airtight", "compliant", "defensible", "ironclad", "court-ready", "plain-English"]
  },
  web3: {
    label: "Web3",
    roots: ["Chain", "Block", "Token", "Mint", "Node", "Protocol", "Wallet", "Genesis", "Hashrate", "Nonce", "Shard", "Ether"],
    nouns: ["wallet", "smart contract", "gas fee", "token supply", "mempool", "governance vote", "liquidity pool"],
    verbs: ["mint tokens", "stake assets", "go on-chain", "decentralize everything", "avoid gas fees", "vote on-chain"],
    adjectives: ["trustless", "decentralized", "permissionless", "on-chain", "composable", "non-custodial"]
  },
  logistics: {
    label: "Logistics",
    roots: ["Cargo", "Freight", "Convoy", "Depot", "Transit", "Pallet", "Route", "Dock", "Haul", "Relay", "Manifest", "Waybill"],
    nouns: ["shipment", "warehouse", "fleet", "inventory", "last mile", "freight cost", "supply run"],
    verbs: ["ship faster", "track shipments", "cut freight costs", "avoid delays", "optimize routes", "clear customs"],
    adjectives: ["real-time", "end-to-end", "carrier-agnostic", "fully tracked", "zero-touch", "door-to-door"]
  }
};

// Keys used when "All" is selected — a random one is picked per generation
// so a single name+tagline pair stays internally consistent.
const CATEGORY_KEYS = ["fintech", "health", "ai", "climate", "consumer", "edtech", "legal", "web3", "logistics"];

// Shared across every category — appended after a root in the "suffix" recipe.
const NAME_SUFFIXES = ["ify", "io", "ly", "eum", "ora", "ix", "stack", "base", "hub", "kit", "sync", "wave", "grid", "co"];

// Shared across every category — paired with a root in the "two word" recipe.
const TECH_WORDS = ["Labs", "AI", "OS", "HQ", "Systems", "Studio", "Works", "Collective", "Cloud"];

// Shared, generic-sounding specifics used to make the "company description"
// read like a real About page instead of vague ad copy.
const FOUNDING_YEARS = ["2015", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
const HQ_CITIES = ["San Francisco", "Austin", "New York", "Denver", "Toronto", "London", "Berlin", "Singapore", "Miami", "Seattle"];
const FUNDING_AMOUNTS = ["$2.4M", "$6.1M", "$14M", "$28M", "$52M", "$110M"];
const CUSTOMER_COUNTS = ["1,200", "4,800", "12,000", "30,000", "65,000", "180,000"];
const GROWTH_RATES = ["18%", "24%", "31%", "40%", "55%"];
const UPTIME_RATES = ["99.9%", "99.95%", "99.99%"];
const TEAM_SIZES = ["9", "14", "22", "38", "61", "140"];
const INVESTOR_FIRMS = ["Northbridge Capital", "Meridian Ventures", "Anchorpoint Partners", "Cascade Ventures", "Foundry Row Capital", "Lower Basin Partners", "Greyfield Ventures", "Union Peak Capital", "Harborlight Ventures", "Wayfinder Capital"];

// Tagline templates. Each takes a category's word bank and returns a line.
const TAGLINE_TEMPLATES = [
  (b) => `The ${pick(b.adjectives)} way to ${pick(b.verbs)}.`,
  (b) => `${cap(pick(b.nouns))}, reimagined.`,
  (b) => `Built different, so you can ${pick(b.verbs)}.`,
  (b) => `We're making ${pick(b.nouns)} obsolete.`,
  (b) => `The operating system for ${pick(b.nouns)}.`,
  (b) => `${cap(pick(b.adjectives))}. ${cap(pick(b.adjectives))}. ${cap(pick(b.nouns))}.`,
  (b) => `We fixed ${pick(b.nouns)}. Finally.`,
  (b) => `Category-defining ${pick(b.nouns)}, for the ${pick(b.adjectives)} enterprise.`,
  (b) => `Your ${pick(b.nouns)}, on autopilot.`,
  (b) => `${cap(pick(b.nouns))} shouldn't be this hard.`,
  (b) => `One place to ${pick(b.verbs)}.`,
  (b) => `${cap(pick(b.adjectives))} ${pick(b.nouns)}, without the ${pick(b.nouns)}.`
];

// "Company description" copy, shown below the tagline, built from two
// sentences: an OPENER (a concrete mechanism or scenario — what the
// product actually does, or the specific moment it replaces — never
// mission-statement fluff like "ambitious teams" or "at scale") and a
// DETAIL (concrete numbers/namedrops — founding year, city, funding,
// customer or investor names — so the blurb reads like a real About
// page instead of vague ad copy). Both take a category's word bank plus
// name. Keep new OPENER lines grounded the same way: name a workflow,
// a moment, or a specific claim, not an adjective-stacked aspiration.
const DESCRIPTION_OPENERS = [
  (b, name) => `${name} replaces the spreadsheet-and-email routine most teams use for ${pick(b.nouns)} with one screen built to ${pick(b.verbs)}.`,
  (b, name) => `We started ${name} after watching one team lose hours every week to ${pick(b.nouns)} — now it takes them minutes.`,
  (b, name) => `Instead of another dashboard nobody opens, ${name} sends one alert the moment your ${pick(b.nouns)} actually needs a human.`,
  (b, name) => `${name} connects directly to your existing ${pick(b.nouns)} — no migration, no re-training, just a faster way to ${pick(b.verbs)}.`,
  (b, name) => `${name} is live and ${pick(b.adjectives)} within ten minutes of connecting your ${pick(b.nouns)} — no onboarding call, no setup guide.`,
  (b, name) => `${name} turns three separate tools and a shared spreadsheet into one place to ${pick(b.verbs)}.`,
  (b, name) => `We believe ${pick(b.nouns)} is broken. ${name} is how we fix it.`,
  (b, name) => `Every feature in ${name} exists to answer one question — does this help you ${pick(b.verbs)} faster — and if not, it doesn't ship.`,
  (b, name) => `${name} watches your ${pick(b.nouns)} around the clock and only interrupts you when something actually needs a decision.`,
  (b, name) => `${name} skips the demo call entirely — connect your ${pick(b.nouns)} and you can ${pick(b.verbs)} the same day.`
];

// `extra` is precomputed by generateDescription() in app.js — it holds
// two distinct fake customer-company names (generated by the same name
// engine, one level removed) and two distinct fake investor firms, so
// a handful of DETAIL lines can name-drop specific "companies" instead
// of just citing a number.
const DESCRIPTION_DETAILS = [
  (b, name, extra) => `Founded in ${pick(FOUNDING_YEARS)} out of ${pick(HQ_CITIES)}, ${name} now handles ${pick(b.nouns)} for more than ${pick(CUSTOMER_COUNTS)} teams worldwide.`,
  (b, name, extra) => `Backed by ${pick(FUNDING_AMOUNTS)} in funding from ${extra.investor1}, ${name} is growing ${pick(GROWTH_RATES)} month over month.`,
  (b, name, extra) => `A team of ${pick(TEAM_SIZES)}, split across ${pick(HQ_CITIES)} and ${pick(HQ_CITIES)}, keeps ${name} running at ${pick(UPTIME_RATES)} uptime.`,
  (b, name, extra) => `Since launching in ${pick(FOUNDING_YEARS)}, ${name} has helped more than ${pick(CUSTOMER_COUNTS)} teams ${pick(b.verbs)}.`,
  (b, name, extra) => `${name} has raised ${pick(FUNDING_AMOUNTS)} from ${extra.investor1} and ${extra.investor2}, and now processes ${pick(b.nouns)} for ${pick(CUSTOMER_COUNTS)}+ customers.`,
  (b, name, extra) => `Headquartered in ${pick(HQ_CITIES)} since ${pick(FOUNDING_YEARS)}, ${name} is used by teams at ${extra.customer1} and ${extra.customer2} to ${pick(b.verbs)} every single day.`,
  (b, name, extra) => `${name}'s ${pick(TEAM_SIZES)}-person team ships weekly, with ${pick(UPTIME_RATES)} uptime and ${pick(CUSTOMER_COUNTS)} teams depending on it.`,
  (b, name, extra) => `In the last year alone, ${name} grew ${pick(GROWTH_RATES)} and now counts ${extra.customer1} among its customers.`,
  (b, name, extra) => `Early believers include ${extra.investor1}, who led the round alongside ${extra.investor2}.`,
  (b, name, extra) => `${name} now runs the ${pick(b.nouns)} for teams at ${extra.customer1}, ${extra.customer2}, and hundreds more.`,
  (b, name, extra) => `With ${pick(CUSTOMER_COUNTS)} customers and ${pick(UPTIME_RATES)} uptime, ${name} has quietly become the default choice for teams that ${pick(b.verbs)}.`,
  (b, name, extra) => `${name} closed a ${pick(FUNDING_AMOUNTS)} round led by ${extra.investor1} in ${pick(FOUNDING_YEARS)}, and hasn't slowed down since.`
];
