// GREEN SILENCE — story data. Act One draft.
// Page numbers are deliberately scattered, like the old paperbacks.

// 16x16 portrait: Dr. Ferreira-Okonjo, field-vest collar.
const PLAYER_PORTRAIT = [
  "................",
  ".....kkkkkk.....",
  "....khhhhhhk....",
  "...khhhhhhhhk...",
  "...khhffffhhk...",
  "...kffffffffk...",
  "...kfkwfkwffk...",
  "...kffffffffk...",
  "...kffkkkfffk...",
  "...kfffffffk....",
  "....kffffk......",
  "...kkjjjkkk.....",
  "..kjjjjjjjjjk...",
  ".kjjjjkkjjjjjk..",
  ".kjjjk..kjjjjk..",
  ".kkkk....kkkk...",
];

const META = {
  title: "GREEN SILENCE",
  subtitle: "An Interactive Gamebook — Act One",
  startPage: 1,
  backdrop: "canopydrift",
  player: {
    name: "Dr. M. Ferreira-Okonjo",
    role: "Ethnobotanist, River Systems",
    bio: "Eleven years studying rivers that behave the way rivers are supposed to. The Camacho-Reyes Expedition set out three weeks ago to find the source of one that doesn't — a source that photographs differently on every satellite pass, as if the basin keeps quietly redrawing its own map. They stopped transmitting nine days in.",
  },
  stats: { health: 10, oxygen: 10, sanity: 10 },
  deathPages: { health: 90, oxygen: 92, sanity: 94 },
};

const ITEMS = {
  machete:    { name: "Machete",       desc: "Standard-issue, well-oiled. The jungle doesn't part on its own.", slot: "held" },
  fieldlamp:  { name: "Field Lamp",    desc: "Solar-charged, waterproof, dependable. Light that owes nothing to fire.", slot: "held" },
  resintorch: { name: "Resin Torch",   desc: "Local craft, not expedition issue. Someone else made this, recently.", slot: "held" },
  dressingkit: { name: "Field Dressing Kit", desc: "Standard trauma supplies. USE: +4 health.", use: { health: 4 } },
  quininetonic: { name: "Quinine Tonic", desc: "Bitter, effective, mildly disorienting. USE: +3 health, -1 sanity.", use: { health: 3, sanity: -1 } },
  driedrations: { name: "Dried Rations", desc: "Nutrient bars that taste like a compromise. USE: +2 health, +1 sanity.", use: { health: 2, sanity: 1 } },
  calmingleaf: { name: "Calming Leaf", desc: "Chewed, not smoked, locally sourced. USE: +3 sanity, -1 health.", use: { sanity: 3, health: -1 } },
  riverstone: { name: "River Stone",   desc: "Smooth, warm, humming faintly if you hold it long enough. +1 on luck tests.", luckBonus: true },
  junglehat:  { name: "Wide-Brim Hat", desc: "Keeps the canopy's worst off your neck. Wear it against the reach.", slot: "head" },
  oilcloak:   { name: "Oiled Cloak",   desc: "Waxed canvas, jungle-green, recovered rather than issued. Wear it against the reach.", slot: "body" },
  trackergloves: { name: "Tracker's Gloves", desc: "Fine grip, reinforced palm. Wear them against the reach.", slot: "hands" },
  muddedboots: { name: "Waterproof Boots", desc: "Already broken in by someone else's miles. Wear them against the reach.", slot: "feet" },
  waterpack:  { name: "Water Pack",    desc: "Filtration bladder, full. Wear it against the reach.", slot: "back" },
  brokencompass: { name: "Broken Compass", desc: "The needle spins freely near the city. It isn't damaged. It's being told something you can't hear yet." },
  expeditionjournal: { name: "Expedition Journal", desc: "Dr. Camacho-Reyes's own field notes, increasingly personal toward the end." },
  memoryseed: { name: "Memory Seed",   desc: "Warm, faintly pulsing, carried rather than planted. It remembers something. Possibly several somethings." },
  rootkey:    { name: "Root Key",      desc: "Not carved — grown, deliberately, into a shape that opens something specific." },
  silverleaf: { name: "Silverleaf",    desc: "A single leaf that hasn't decayed, wilted, or changed in any way since you picked it. It should have by now." },
  surveystake: { name: "Survey Stake", desc: "Corporate-issue, GPS-tagged, driven into ground that was never anyone's to stake. Evidence, if you ever get to use it as such." },
  heartwoodsap: { name: "Heartwood Sap", desc: "Drawn, not stolen, from something that offered before you asked. USE: +5 health.", use: { health: 5 } },
  kinshiptoken: { name: "Kinship Token", desc: "Not a seal, not a contract — an opening position, grown rather than written, for a relationship the outside world has never had to negotiate before." },
};

const ROOMS = {
  camp:         { name: "Base Camp",       col: 0, row: 0, icon: "⛺" },
  rivercrossing: { name: "The Sourceless River", col: 1, row: 0, icon: "≈" },
  canopywalk:   { name: "Canopy Walk",     col: 2, row: 0, icon: "❋" },
  ruinsgate:    { name: "Ruins Gate",      col: 3, row: 0, icon: "◈" },
  templeofroots: { name: "Temple of Roots", col: 0, row: 1, icon: "☥" },
  hollow:       { name: "The Hollow",      col: 1, row: 1, icon: "◎" },
  caves:        { name: "Limestone Caves", col: 2, row: 1, icon: "▲" },
  oldstation:   { name: "The Old Station", col: 3, row: 1, icon: "◇" },
  memorytrees:  { name: "Memory Trees",    col: 0, row: 2, icon: "❦" },
  nursery:      { name: "The Nursery",     col: 1, row: 2, icon: "☘" },
  overlook:     { name: "The Overlook",    col: 2, row: 2, icon: "☆" },
  city:         { name: "Kirawa",          col: 3, row: 2, icon: "◉" },
  // Act Two — beneath the plaza
  deeproot:     { name: "The Deep Root",   col: 0, row: 3, icon: "◐" },
  chorus:       { name: "The Chorus Grove", col: 1, row: 3, icon: "❦" },
  seedvault:    { name: "The Seed Vault",  col: 2, row: 3, icon: "◇" },
  wound:        { name: "The Wound",       col: 3, row: 3, icon: "▲" },
  canopycrown:  { name: "The Canopy Crown", col: 0, row: 4, icon: "☆" },
  heartwood:    { name: "The Heartwood",   col: 1, row: 4, icon: "☥" },
};

const PAGES = {

  // ============ BASE CAMP ============

  1: {
    room: "camp",
    effects: [["add", "machete"]],
    text: `The Camacho-Reyes camp sits in a clearing the jungle hasn't reclaimed yet, which is itself strange — three weeks of silence and the undergrowth still keeps a respectful, unnatural distance from the tents. Solar panels still trickle-charge a bank of dead radios. A MACHETE leans against the supply crate, exactly where a right-handed person would leave it for a moment, meaning to come back.

Your own satellite uplink shows the river's source in yet another position, a full kilometer from where it photographed yesterday.`,
    choices: [
      { label: "Check the supply cache", to: 3 },
      { label: "Read Dr. Camacho-Reyes's field journal", to: 5 },
      { label: "Head into the jungle", to: 8 },
    ],
  },

  3: {
    room: "camp",
    effects: [["add", "fieldlamp"], ["add", "waterpack"]],
    text: `The cache is orderly, professionally packed — a FIELD LAMP still holding its charge, a full WATER PACK, and a second radio unit nobody thought to grab on their way out. Whatever happened, it happened calmly enough to leave good gear behind rather than fight over it.`,
    choices: [{ label: "Head into the jungle", to: 8 }],
  },

  5: {
    room: "camp",
    effects: [["add", "expeditionjournal"], ["stat", "sanity", -1]],
    text: `Camacho-Reyes's JOURNAL is dense, professional, and increasingly personal. The final legible entry: "The river isn't hiding its source. It's protecting it, the way you'd shield a candle, not the way you'd hide a body. Ilana says the compass needles have started pointing at each other instead of north. I told her that's not how magnetism works. She didn't argue. She just smiled like she already understood something I hadn't caught up to yet."`,
    choices: [{ label: "Head into the jungle", to: 8 }],
  },

  // ============ INTO THE JUNGLE (hub) ============

  8: {
    room: "camp",
    text: `A trail marked in survey tape leads out from camp in four directions: toward the river, up into a canopy walkway your team apparently rigged themselves, toward stone ruins glimpsed in an aerial photo, and toward a passage your team's own map labels only OLD STATION — not a name, a designation, as if they weren't sure what else to call it.`,
    choices: [
      { label: "The Sourceless River", to: 10 },
      { label: "Canopy Walk", to: 20 },
      { label: "Ruins Gate", to: 30 },
      { label: "The Old Station", to: 40 },
      { label: "The Hollow", to: 50 },
      { label: "Limestone Caves", to: 60 },
      { label: "The Overlook", to: 70 },
      { label: "Temple of Roots", to: 80 },
      { label: "Memory Trees", to: 84 },
      { label: "The Nursery", to: 88 },
      { label: "A clearing thick with spore-light", to: 145 },
      { label: "You've mapped enough. Head for the city", to: 95 },
    ],
  },

  // ============ THE SOURCELESS RIVER ============

  10: {
    room: "rivercrossing",
    text: `The river is real, cold, and entirely convinced of its own right to exist — which makes its complete absence of a traceable source all the stranger standing at its bank rather than reading about it in a satellite report. Follow it upstream far enough and it simply... continues, around a bend that shouldn't logically still be river.

Your team's own rope crossing still hangs here, taut, recently used.`,
    choices: [
      { label: "Follow the river upstream", luck: { pass: 12, fail: 13 } },
      { label: "Search the crossing point", to: 14 },
      { label: "Wait and watch the water", to: 15 },
      { label: "Back to camp", to: 8 },
    ],
  },

  12: {
    room: "rivercrossing",
    effects: [["add", "riverstone"], ["stat", "sanity", -1]],
    text: `You follow the bank a good distance before the geography starts repeating in ways that would be funny if you weren't the one lost in them — the same fallen log, the same bend, the same patch of white flowers, three times. On the third pass, a smooth, warm RIVER STONE sits in the shallows exactly where it wasn't the first two times you walked past.

You take it. It seems to want taking.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  13: {
    room: "rivercrossing",
    effects: [["stat", "sanity", -2]],
    text: `You lose track of how far you've walked somewhere around the fourth identical bend, and the unsettling part isn't being lost — it's the growing certainty that the river is choosing which bends to show you, and hasn't yet decided you're allowed to see the rest.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  14: {
    room: "rivercrossing",
    effects: [["flag", "knowCrossing"], ["stat", "sanity", -1]],
    text: `The crossing rope is expedition rigging, but the knotwork securing it to the far bank isn't — a technique your outdoor training never covered, elegant and clearly not first-timer's work. Someone who knew what they were doing came through here after your team did, and tied off a rope meant to make the crossing easier for whoever came next.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ============ CANOPY WALK ============

  20: {
    room: "canopywalk",
    text: `The canopy walkway is genuinely impressive engineering for a team that expected to be here a matter of weeks — rope and plank bridges strung between ancient trees, rising high enough that the jungle floor disappears beneath drifting mist. From up here, you can see further than the map admits exists.`,
    choices: [
      { label: "Look for the city from up here", to: 22 },
      { label: "Search the walkway's tool cache", to: 24 },
      { label: "Cross the swaying rope bridge to a further platform", luck: { pass: 25, fail: 26 } },
      { label: "Back to camp", to: 8 },
    ],
  },

  22: {
    room: "canopywalk",
    effects: [["flag", "knowCityGlimpse"], ["stat", "sanity", -1]],
    text: `Far off, past several ridgelines your satellite imagery insists are simply more unbroken canopy, you catch — for exactly as long as it takes to be sure you're not imagining it — the clean geometric lines of worked stone breaking the tree line. Then mist rolls back across the gap, and the view is ordinary jungle again, as if it were embarrassed to have been caught showing you something.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  24: {
    room: "canopywalk",
    effects: [["add", "trackergloves"]],
    text: `The walkway's tool cache holds a pair of TRACKER'S GLOVES, fine-gripped and reinforced, expedition-issue but well-used beyond what three weeks should account for. Somebody put a great deal of climbing time into this canopy before whatever happened to them, happened.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ============ RUINS GATE ============

  30: {
    room: "ruinsgate",
    text: `Worked stone breaks the tree line here — not ruins in the picturesque, collapsed sense, but architecture the jungle has grown around rather than through, roots draping structures still recognizably, deliberately built. A gateway stands mostly clear, flanked by carvings weathered past easy reading.`,
    choices: [
      { label: "Study the carvings", to: 32 },
      { label: "Search among the fallen stone blocks", luck: { pass: 35, fail: 36 } },
      { label: "Pass through the gate", to: 34 },
      { label: "Back to camp", to: 8 },
    ],
  },

  32: {
    room: "ruinsgate",
    effects: [["stat", "sanity", -1], ["flag", "knowGateCarvings"]],
    text: `The carvings, once your eyes adjust to a style no catalogued regional tradition quite matches, depict the same repeated scene: a figure entering a tree line, and a second panel showing the same figure — recognizably the same, by consistent posture and dress — standing among the roots themselves, no longer quite separate from them. Not devoured. Included.`,
    choices: [{ label: "Pass through the gate", to: 34 }],
  },

  34: {
    room: "ruinsgate",
    effects: [["flag", "knowGatePassed"]],
    text: `Beyond the gate, the ruins continue further than any survey photograph suggested — this isn't an isolated structure, but the edge of something considerably larger, deliberately positioned at the threshold like a formal entrance rather than a random outcropping.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ============ THE OLD STATION ============

  40: {
    room: "oldstation",
    text: `The Old Station predates your expedition by decades — a research outpost, weathered but structurally sound, logged in nobody's current database. A brass plaque, green with age but legible, credits a scientific survey from over sixty years ago. They, too, according to the historical record you vaguely recall, were never heard from again.`,
    choices: [
      { label: "Search the old records", to: 42 },
      { label: "Check the equipment shed", to: 45 },
      { label: "Check the specimen archive", to: 192 },
      { label: "Search the living quarters", to: 44 },
      { label: "Back to camp", to: 8 },
    ],
  },

  42: {
    room: "oldstation",
    effects: [["add", "brokencompass"], ["stat", "sanity", -1]],
    text: `Sixty-year-old records, astonishingly preserved, describe the same river, the same impossible source, in the same baffled scientific language your own team's logs eventually adopted. Tucked in a specimen drawer: a BROKEN COMPASS, needle spinning gently on its own, decades of use worn into its casing by a hand that clearly carried it a very long way before setting it down here, deliberately, for someone else to find.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  44: {
    room: "oldstation",
    effects: [["flag", "knowOldExpedition"], ["stat", "sanity", -1]],
    text: `The living quarters are dust-free in a way sixty years shouldn't allow, beds made, personal effects arranged with the particular care of people who left expecting to return and simply never got around to it. A final duty roster hangs on the wall, every name checked off the same day, in the same hand, like a single administrative decision made jointly and calmly.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ============ THE HOLLOW ============

  50: {
    room: "hollow",
    text: `The Hollow is a natural amphitheater of a clearing, canopy parting overhead in a near-perfect circle, silent in a way the rest of the jungle — birdsong, insects, the constant low hum of a living system — conspicuously isn't. The quiet here isn't absence. It's attention.`,
    choices: [
      { label: "Stand in the center and wait", luck: { pass: 52, fail: 53 } },
      { label: "Leave an offering of your own", to: 55 },
      { label: "Search the clearing's edge", to: 54 },
      { label: "Back to camp", to: 8 },
    ],
  },

  52: {
    room: "hollow",
    effects: [["add", "silverleaf"], ["flag", "knowHollowCalm"], ["stat", "sanity", -1]],
    text: `You stand still long enough that stillness stops feeling like a strategy and starts feeling like a conversation, and something in the quiet — not a voice, more a settling, the way a room settles when someone stops holding their breath — leaves a single SILVERLEAF resting in your open palm, unhurried, deliberate, a gift rather than a discovery.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  53: {
    room: "hollow",
    effects: [["stat", "sanity", -1]],
    text: `You can't hold the stillness long enough — some old animal instinct insists on checking over your shoulder, breaking whatever delicate attention was building, and the Hollow's particular quality of silence recedes, unoffended but unmistakably withdrawn, like company that's decided you weren't quite ready yet.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  54: {
    room: "hollow",
    effects: [["flag", "knowHollowEdge"], ["stat", "sanity", -1]],
    text: `At the clearing's edge, half-swallowed by root growth, personal effects from more than one expedition lie gently, deliberately arranged rather than discarded — boots, a canteen, a wedding ring, each item positioned like a small, respectful memorial rather than debris. Whoever curates this space does so with real, unhurried care.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ============ LIMESTONE CAVES ============

  60: {
    room: "caves",
    text: `The cave mouth breathes cooler air than the jungle has any right to produce this close to the equator, roots trailing down from the entrance like the forest is dipping a hand below its own floor to check on something.`,
    choices: [
      { label: "Light your way in", needAnyItem: ["fieldlamp", "resintorch"], to: 62 },
      { label: "Feel your way in blind", luck: { pass: 62, fail: 64 } },
      { label: "Back to camp", to: 8 },
    ],
  },

  62: {
    room: "caves",
    effects: [["add", "resintorch"], ["flag", "knowCaves"], ["stat", "sanity", -1]],
    text: `The caves open into a network lined, floor to ceiling, in root systems too organized to be accidental — channels, almost architectural, guiding water and, you suspect, considerably more than water. A RESIN TORCH burns steadily in a wall bracket, clearly maintained, clearly not by anyone still checking in with your expedition's roster.`,
    choices: [
      { label: "Press deeper into the root-lined tunnels", to: 65 },
      { label: "Back to camp", to: 8 },
    ],
  },

  64: {
    room: "caves",
    effects: [["stat", "health", -2], ["stat", "sanity", -1]],
    text: `You crack a knee against unseen stone in the dark and beat a careful retreat, more embarrassed than hurt, roots brushing your shoulders the whole way out with what you could almost, uncomfortably, describe as concern rather than menace.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ============ THE OVERLOOK ============

  70: {
    room: "overlook",
    text: `A rock outcropping above the canopy line offers the clearest view the basin has grudgingly allowed anyone yet — ridgelines, river bends, and, unmistakably now, a suggestion of worked stone geometry laid into the landscape at a scale no small ruin could account for.`,
    choices: [
      { label: "Study the layout carefully", to: 72 },
      { label: "Search for a safer path down", to: 193 },
      { label: "Back to camp", to: 8 },
    ],
  },

  72: {
    room: "overlook",
    effects: [["flag", "knowLayout"], ["stat", "sanity", -1]],
    text: `Mapped from up here, the basin's geography stops looking random and starts looking deliberately arranged — the river's many false sources, the ruins, the Hollow, all positioned like the outer rooms of something considerably larger and more intentional than untouched wilderness. You are standing, you realize, at the edge of a threshold considerably bigger than any one gate.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ============ TEMPLE OF ROOTS ============
  // (reached once the ruins gate has been passed)

  80: {
    room: "templeofroots",
    text: `Past the ruins gate, a temple structure stands mostly intact, roots threaded through every joint and doorway with a precision that reads less like decay and more like reinforcement — the jungle isn't consuming this building. It's holding it up.`,
    choices: [
      { label: "Enter the temple", needFlag: "knowGatePassed", to: 82 },
      { label: "Back to camp", to: 8 },
    ],
  },

  82: {
    room: "templeofroots",
    effects: [["add", "memoryseed"], ["stat", "sanity", -2]],
    text: `Inside, the temple's central chamber holds a single growth at its heart — a seed pod, root-veined, warm, resting in a stone cradle shaped precisely to hold it. The moment your hand closes around the MEMORY SEED, a fragment of something not-quite-memory arrives with it: laughter, unmistakably Camacho-Reyes's own team, recent, easy, entirely unafraid.`,
    choices: [
      { label: "Search the temple further", to: 190 },
      { label: "Back to camp", to: 8 },
    ],
  },

  // ============ MEMORY TREES ============
  // (a deeper grove, reached once the layout is understood)

  84: {
    room: "memorytrees",
    text: `Following the Overlook's revealed geography leads to a grove unlike anything else in the basin — trees whose bark carries carved records in layers going back, by growth-ring count alone, centuries, each carving a name, a date, a single line.`,
    choices: [
      { label: "Search for Camacho-Reyes's own entry", needFlag: "knowLayout", to: 86 },
      { label: "Back to camp", to: 8 },
    ],
  },

  86: {
    room: "memorytrees",
    effects: [["flag", "knowHerEntry"], ["stat", "sanity", -2]],
    text: `Her entry is fresh, bark still healing around the letters: "ILANA CAMACHO-REYES. CHOSE TO STAY. CHOSE TO REMEMBER. CHOSE, FINALLY, TO BE REMEMBERED CORRECTLY, WHICH IS MORE THAN MOST EXPEDITIONS EVER GET." Beneath it, considerably older, dozens of names in dozens of hands, going back further than any institution currently funding basin research has existed.`,
    choices: [
      { label: "Search for the old station team's entry", to: 191 },
      { label: "Back to camp", to: 8 },
    ],
  },

  // ============ THE NURSERY ============

  88: {
    room: "nursery",
    text: `A low grove near the memory trees hums with active, visible growth — seedlings pushing through soil in accelerated, unnatural time, tended by nothing you can see, thriving with an attentiveness the rest of the "untouched" jungle only implies.`,
    choices: [
      { label: "Take a growing root key", to: 89 },
      { label: "Search for more growth to study", to: 155 },
      { label: "Back to camp", to: 8 },
    ],
  },

  89: {
    room: "nursery",
    effects: [["add", "rootkey"], ["stat", "sanity", -1]],
    text: `One growth stands apart from the rest — not a plant exactly, more a deliberately shaped ROOT KEY, grown rather than carved, clearly meant to open something specific. You ease it free of the soil with the distinct sense of being permitted rather than succeeding.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ============ THE APPROACH ============

  95: {
    room: "camp",
    text: `You've traced the basin's outer edges as far as they'll casually give — the river, the canopy, the ruins, the old station's quiet warning, the Hollow's patient attention. One direction remains unexplored: straight toward the geometry the Overlook revealed, through whatever the reach considers its actual front door.`,
    choices: [{ label: "Head for the city", to: 96 }],
  },

  96: {
    room: "city",
    text: `The tree line simply, finally, stops resisting, and Kirawa opens in front of you — not ruins, not abandoned, but genuinely, quietly alive, stonework interwoven so thoroughly with root and canopy that the distinction between built and grown stopped mattering centuries ago.

Your team is here. All eight of them, and beneath the temple steps, considerably more people than eight, spanning clothing styles from decades and, judging by a few unmistakably formal expedition jackets, at least two centuries.`,
    choices: [{ label: "Approach", to: 97 }],
  },

  97: {
    room: "city",
    text: `Dr. Camacho-Reyes meets you at the base of the steps, calm, present, unmistakably herself. "You found the front door," she says. "Most people find a side entrance first — the river, usually, or the Hollow. Welcome to the part of the survey nobody funds a follow-up grant for."

Behind her, the city itself seems to lean in slightly, the way a room leans in around a conversation it's interested in.`,
    choices: [{ label: "Ask what this place actually is", to: 98 }],
  },

  98: {
    room: "city",
    effects: [["stat", "sanity", -1], ["flag", "knowSilenceName"]],
    text: `"We call it the Green Silence," she says, "because that's the closest translation anyone's ever managed. It isn't quiet because nothing's happening. It's quiet the way a library is quiet — an enormous amount occurring, carefully, so as not to disturb the parts still working.

It's a network. Root, fungus, memory, held together across a scale your field doesn't have equipment to properly measure yet. It's been protecting this basin — this city, this knowledge, everyone who's ever chosen to stay — for longer than either of our institutions has existed. It isn't hiding from the world out of malice. It's hiding because every single time it hasn't, the world has taken something it couldn't give back."`,
    choices: [
      { label: "Ask how it chooses who stays and who doesn't", to: 200 },
      { label: "Ask what happens to those who stay", to: 99 },
      { label: "Ask what it wants from you specifically", to: 100 },
    ],
  },

  200: {
    room: "city",
    effects: [["stat", "sanity", -1]],
    text: `"It doesn't," Camacho-Reyes says, gently correcting the premise. "It offers. Every single time, to every single person who finds their way this deep, without exception. Most people say no, live full lives, and never think about this basin again except as a strange story from one expedition. The choosing was always going to be yours. That part's never once been up for negotiation."`,
    choices: [
      { label: "Ask what happens to those who stay", to: 99 },
      { label: "Ask what it wants from you specifically", to: 100 },
    ],
  },

  99: {
    room: "city",
    effects: [["stat", "sanity", -1], ["flag", "knowStaying"]],
    text: `"Nothing happens TO us," Camacho-Reyes says, a little wry. "We're not consumed, converted, or filed away. We're included — folded into something considerably larger than any one of us, the way a single tree is included in a forest without stopping being a tree. I still remember my grandmother's recipes. I still argue with Dr. Osei about methodology. I'm just also, now, part of something that remembers everything else too."`,
    choices: [
      { label: "Ask if she ever regrets it", to: 202 },
      { label: "Continue the conversation", to: 100 },
    ],
  },

  202: {
    room: "city",
    effects: [["stat", "sanity", -1]],
    text: `She considers the question honestly, which you appreciate more than a quick reassurance would have landed. "Some days," she says. "Mostly the ordinary kind of regret, missing small things — a particular coffee, a particular argument with my sister. Never the kind of regret that makes me wish I'd said no. Those are different feelings. I wish more people understood that before they asked."`,
    choices: [{ label: "Continue the conversation", to: 100 }],
  },

  100: {
    room: "city",
    effects: [["flag", "act2"]],
    text: `"What it wants," Camacho-Reyes says, "is roughly what any patient, ancient thing wants from a visitor: honesty, and enough time to actually explain itself before you decide anything. You've earned that much just by finding the front door properly instead of stumbling through a side entrance by accident."

Somewhere beneath the temple steps, deeper into Kirawa than the plaza you're currently standing in, something vast and green and unhurried waits to actually meet you.

— END OF ACT ONE —`,
    choices: [{ label: "Go deeper", to: 101 }],
  },

  // ============ ACT TWO — THE DEEP ROOT ============

  101: {
    room: "city",
    effects: [["stat", "sanity", -1]],
    text: `The temple steps descend further than their footprint above ground should allow, root and stonework giving way to something rawer — the actual living substrate Kirawa was built to sit gently on top of, rather than in place of.

Camacho-Reyes doesn't follow you down. "This part," she says, "you do alone. It's not a test. It's just — some conversations only work one voice at a time."`,
    choices: [{ label: "Descend", to: 102 }],
  },

  102: {
    room: "deeproot",
    text: `The Deep Root is exactly what the name promises — a cavern-scale lattice of root and mycelial growth, pulsing faintly with the same four-second rhythm you first noticed in the Hollow, vast enough now to feel less like a plant and more like architecture with a pulse.

Passages lead toward a grove of layered voices, a vault of preserved memory, a section that smells, faintly and wrongly, of diesel and scorched wood, and a passage climbing toward daylight far above.`,
    choices: [
      { label: "The Chorus Grove", to: 104 },
      { label: "The Seed Vault", to: 114 },
      { label: "The Wound", to: 124 },
      { label: "The Canopy Crown", to: 134 },
      { label: "Wait and feel the network breathe", to: 140 },
      { label: "Rest a moment", to: 103 },
      { label: "Take stock of everything you've learned", to: 150 },
      { label: "You're ready. Go to the Heartwood", needFlag: "readyForHeartwood", to: 160 },
    ],
  },

  103: {
    room: "deeproot",
    effects: [["stat", "sanity", 1], ["stat", "health", 1]],
    text: `You sit against warm, breathing root-mass and let your pulse settle into its rhythm rather than fighting it. Down here, stillness isn't wasted time. It might be the only language that actually translates cleanly.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  // ---- The Chorus Grove ----

  104: {
    room: "chorus",
    text: `The Chorus Grove holds every joined voice at once, layered the way the Hollow's silence was layered — not noise, but attention, hundreds of perspectives folded into a single patient hum you can, if you concentrate, pick individual threads out of.`,
    choices: [
      { label: "Listen for Camacho-Reyes's team specifically", luck: { pass: 106, fail: 107 } },
      { label: "Search for a specific old friend among the voices", to: 110 },
      { label: "Listen for the oldest voice here", to: 108 },
      { label: "Back to the Deep Root", to: 102 },
    ],
  },

  106: {
    room: "chorus",
    effects: [["add", "kinshiptoken"], ["flag", "knowChorusTeam"]],
    text: `You find them — all eight, distinct, unmistakably themselves, arguing amiably about methodology in a register that isn't quite sound. Something in the grove, pleased by the successful listening, presses a KINSHIP TOKEN into your awareness the way you'd hand a good student their first real fieldwork credit.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  107: {
    room: "chorus",
    effects: [["stat", "sanity", -2]],
    text: `You reach for one specific thread and the whole grove answers at once instead, hundreds of unrelated perspectives arriving with none of the context that would make any of them individually bearable. It passes. You keep one hand on solid root until it does.`,
    choices: [{ label: "Back to the Chorus Grove", to: 104 }],
  },

  108: {
    room: "chorus",
    effects: [["flag", "knowOldestVoice"], ["stat", "sanity", -1]],
    text: `The oldest thread here predates every catalogued civilization in the basin's written record by a margin your field has no comfortable number for — not hostile, not even especially alien anymore after everything else you've seen today, just extremely, patiently old, and quietly pleased that someone finally asked to listen for it specifically.`,
    choices: [{ label: "Back to the Chorus Grove", to: 104 }],
  },

  // ---- The Seed Vault ----

  114: {
    room: "seedvault",
    text: `The Seed Vault holds exactly what it sounds like — rows of dormant seeds, each one, your instruments increasingly insist, actually a complete stored memory rather than simple genetic material. A library that grows instead of shelving.`,
    choices: [
      { label: "Search for records of the outside threat", to: 116 },
      { label: "Search for your own expedition's eventual entry", to: 111 },
      { label: "Search for the very first seed", to: 118 },
      { label: "Back to the Deep Root", to: 102 },
    ],
  },

  116: {
    room: "seedvault",
    effects: [["flag", "knowThreatHistory"], ["stat", "sanity", -1]],
    text: `Recent seeds — recent being relative, but recognizably within living memory — record a pattern the basin has weathered before: surveyors, prospectors, the occasional well-funded expedition with less patience than yours. Most turned back, quietly discouraged. A concerning few didn't, and needed... managing, described in careful, non-specific language you don't fully trust yourself to translate accurately.`,
    choices: [{ label: "Back to the Seed Vault", to: 114 }],
  },

  118: {
    room: "seedvault",
    effects: [["flag", "knowFirstSeed"], ["stat", "sanity", -1]],
    text: `The very first seed is small, unassuming, and — when your scanner finally manages a reading — considerably older than the current geological understanding of this basin's formation allows for. Whatever the Green Silence actually is, it was here taking notes before the river itself finished deciding on a shape.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  // ---- The Wound ----

  124: {
    room: "wound",
    text: `The smell reaches you before the sight does — diesel, scorched bark, a section of the Deep Root's lattice visibly charred and cut, crude survey stakes driven straight through living growth. Whatever encroachment the Seed Vault's records warned about, it happened here, recently, and it clearly hurt.`,
    choices: [
      { label: "Examine the survey stakes", to: 126 },
      { label: "Try to identify who did this specifically", to: 112 },
      { label: "Offer the wound your own supplies", needAnyItem: ["dressingkit", "heartwoodsap"], to: 128 },
      { label: "Back to the Deep Root", to: 102 },
    ],
  },

  126: {
    room: "wound",
    effects: [["add", "surveystake"], ["flag", "knowSurveyors"], ["stat", "sanity", -1]],
    text: `The SURVEY STAKE is corporate-issue, GPS-tagged, stamped with a consortium name your own funding committee has, uncomfortably, taken meetings with before. This wasn't an accident or an old wound. It's recent, deliberate, and exactly the kind of institutional encroachment the basin has apparently held off for centuries — until now.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  128: {
    room: "wound",
    effects: [["flag", "healedWound"], ["stat", "sanity", -1]],
    text: `You offer what you can spare, and the wound — slowly, gratefully, the way any injury accepts real help — begins, faintly, to knit. It won't undo the damage. It's not nothing, either. Something in the lattice registers the gesture and, you'd swear, relaxes fractionally in your direction.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  // ---- The Canopy Crown ----

  134: {
    room: "canopycrown",
    text: `A passage climbs, unexpectedly, all the way back up through the canopy itself, emerging on a natural platform above even the tallest trees — a crown, not a summit, offering a view of the basin's full scale and, distressingly, its border.`,
    choices: [
      { label: "Look toward the basin's edge", to: 136 },
      { label: "Search the platform for anything left behind", to: 113 },
      { label: "Back to the Deep Root", to: 102 },
    ],
  },

  136: {
    room: "canopycrown",
    effects: [["flag", "knowBorderThreat"], ["stat", "sanity", -1]],
    text: `From up here, the threat the Wound only hinted at is unmistakable — cleared ground at the basin's northern edge, access roads cut in straight, patient lines, heavy equipment parked and waiting for a permit or a decision or simply enough time. The Green Silence has held its border for centuries. That border, for the first time in a very long while, looks genuinely finite.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  // ---- Readiness gate ----

  150: {
    room: "deeproot",
    effects: [["flag", "readyForHeartwood"]],
    text: `You've seen enough of the network's actual substance — its memory, its voices, its very real wound — to stop feeling like a visitor being given a tour and start feeling like someone who understands, at least roughly, what's actually being asked of them.

Whatever you decide at the Heartwood, you'll decide it having seen the whole basin, not just the parts that were easy to admire.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  // ============ THE HEARTWOOD (climax) ============

  160: {
    room: "heartwood",
    text: `The Heartwood is the network's actual center, a cavern-filling growth vast enough to make the Chorus Grove feel like an anteroom — old, patient, and, you realize on approach, entirely aware of exactly how much of the basin you've now personally seen.

"You came all the way down," it says, in the layered Chorus-voice, warm rather than imposing. "Most stop at the plaza. Ask your question, ethnobotanist. I have been patient for longer than your discipline has existed. I can afford a few more minutes."`,
    choices: [
      { label: "Ask why it agreed to see you at all", to: 201 },
      { label: "Offer the Kinship Token — propose a formal accord", needItem: "kinshiptoken", to: 162 },
      { label: "Show the Survey Stake — ask for help fighting the threat directly", needItem: "surveystake", to: 164 },
      { label: "Propose exposing everything to protect it through fame instead of secrecy", needFlag: "knowBorderThreat", to: 166 },
      { label: "Ask to stay, and mean it", to: 168 },
      { label: "Offer to fight for the basin's legal protection through outside channels", needItem: "expeditionjournal", to: 170 },
      { label: "Take what you've learned and simply leave", to: 172 },
    ],
  },

  201: {
    room: "heartwood",
    effects: [["stat", "sanity", -1]],
    text: `"Because you asked good questions on the way down," it says, "and because you offered the Wound help before you asked it for anything in return. Motive matters here more than credentials ever could. Most visitors arrive already certain what they want from me. You arrived, refreshingly, still willing to be surprised."`,
    choices: [{ label: "Continue", to: 160 }],
  },

  162: {
    room: "heartwood",
    effects: [["stat", "sanity", -1]],
    text: `You lay out terms rather than pleas — a real accord, negotiated rather than assumed, between an institution that can offer legal standing and a network old enough to remember when legal standing wasn't a concept anyone needed. The Heartwood considers this with what feels, unmistakably, like genuine respect for the attempt.

"An accord," it says. "Nobody has offered one of those in quite some time. Let us discuss terms properly."`,
    choices: [{ label: "One year later...", to: 174 }],
  },

  164: {
    room: "heartwood",
    effects: [["stat", "sanity", -1]],
    text: `You hold up the stake, plainly, and ask the direct question: what do you actually need from someone on the outside who can move through the world you're trying to keep this basin protected from. The Heartwood is quiet for a long moment — not offended, genuinely considering, as if the question itself was rarer than the offer to help.`,
    choices: [{ label: "One year later...", to: 176 }],
  },

  166: {
    room: "heartwood",
    effects: [["stat", "sanity", -2]],
    text: `You make the harder case — that secrecy has protected this basin for centuries but can't outlast a determined, well-funded consortium forever, and that visibility, properly managed, might succeed where hiding eventually won't. The Heartwood doesn't dismiss it, which is its own kind of unsettling. "You may be right," it says slowly. "That is a considerably larger risk than any I have taken before."`,
    choices: [{ label: "One year later...", to: 178 }],
  },

  168: {
    room: "heartwood",
    effects: [["stat", "sanity", -2], ["flag", "chosenToStay"]],
    text: `You say it plainly, the way Camacho-Reyes apparently did before you: not fleeing anything, not running from a life that failed you, simply choosing this one, freely, with eyes open. The Heartwood's attention settles on you fully for the first time, weighing the offer the way the Chorus weighed its oldest thread — carefully, and without hurry.

"Then let us not waste either of our time pretending this is a small decision," it says. "Come. Let me show you everything, properly, before you finish deciding."`,
    choices: [{ label: "One year later...", to: 180 }],
  },

  170: {
    room: "heartwood",
    effects: [["stat", "sanity", -1]],
    text: `You propose the slower, more institutional path — using Camacho-Reyes's journal and your own credentials to pursue formal protected-status designation, fighting the consortium with paperwork and precedent rather than secrecy or exposure. The Heartwood seems almost amused by the mundanity of it. "A wall of documents," it says. "I have never tried that particular defense. It might even work."`,
    choices: [{ label: "One year later...", to: 182 }],
  },

  172: {
    room: "heartwood",
    text: `You decide, in the end, to simply leave with what you've learned rather than commit to anything in the heat of one very long day underground. The Heartwood doesn't object. "Wise," it says, unhurried as ever. "Go. Think. The border will still be here, one way or another, whenever you're ready to come back to it."`,
    choices: [{ label: "One year later...", to: 184 }],
  },

  174: {
    room: "heartwood",
    type: "act-end",
    text: `EPILOGUE — THE ACCORD

The paperwork nobody in either institution has a template for takes the better part of a year to draft, and considerably longer to enforce, but it holds: a genuine, negotiated relationship between a research consortium and something that predates the concept of a consortium entirely.

You are, officially, the accord's first liaison. Unofficially, you suspect you're just the first person who happened to ask nicely.`,
  },

  176: {
    room: "heartwood",
    type: "act-end",
    text: `EPILOGUE — A QUIET DEFENSE

The consortium's survey permits hit an unusual quantity of procedural obstacles over the following eighteen months — misplaced filings, expired licenses, a remarkable string of institutional bad luck that you never quite ask the Heartwood to confirm or deny. The basin's border holds. You've stopped needing to know exactly how.`,
  },

  178: {
    room: "heartwood",
    type: "act-end",
    text: `EPILOGUE — THE VISIBLE BASIN

Your published findings — carefully worded, coordinates deliberately vague, focus firmly on the science rather than the geometry — make considerably more noise than either of you expected. Public attention turns out to be a strange, unpredictable shield: harder for a single consortium to quietly bulldoze something the whole world is suddenly, briefly, watching.

It's not a permanent solution. Camacho-Reyes tells you, and you believe her, that nothing ever really is.`,
  },

  180: {
    room: "heartwood",
    type: "act-end",
    text: `EPILOGUE — THE NINTH VOICE

Your own university eventually lists you as "extended independent fieldwork, indefinite," which is either the most honest or least honest line ever filed in that department's history. You are not lost. You are not converted. You are exactly where you decided, with your eyes open, to be — one more voice in a chorus old enough to have infinite patience for new ones.`,
  },

  182: {
    room: "heartwood",
    type: "act-end",
    text: `EPILOGUE — PRECEDENT

The protected-status filing takes four years, two lawsuits, and considerably more of your career than you budgeted for it, but it succeeds — not because bureaucracy is fast, but because it is, eventually, durable in a way secrecy alone never could be. The basin gets a designation. The designation gets a wall of paperwork nobody particularly wants to test in court.`,
  },

  184: {
    room: "heartwood",
    type: "act-end",
    text: `EPILOGUE — LEFT TO DECIDE

You write the report that's true and deliberately incomplete, recommend further study in the vaguest terms your funding body will accept, and go home to think about it properly, the way the Heartwood suggested.

You think about going back sometimes. You haven't yet. You suspect, when you finally do, the border will still be there — thinner, maybe, but still holding, patient as ever, waiting for someone who reads the whole basin before deciding anything.`,
  },

  // ---- Extra branches (Act One) ----

  15: {
    room: "rivercrossing",
    text: `You sit on the bank and simply watch the current for a while, the way you'd watch anything you were trying to understand rather than solve.`,
    choices: [{ label: "Try to read the pattern", luck: { pass: 16, fail: 17 } }],
  },

  16: {
    room: "rivercrossing",
    effects: [["flag", "knowRiverPattern"], ["stat", "sanity", 1]],
    text: `The pattern resolves, eventually — not randomness, but a slow, deliberate braiding, the water folding back on itself in a rhythm that matches, you're almost certain, the same four-second pulse you'll keep noticing all day without yet knowing why it matters.`,
    choices: [{ label: "Back to the river", to: 10 }],
  },

  17: {
    room: "rivercrossing",
    effects: [["stat", "sanity", -1]],
    text: `The longer you watch, the less certain you are that the current is moving in only one direction, and the less you want to keep testing that particular observation.`,
    choices: [{ label: "Back to the river", to: 10 }],
  },

  25: {
    room: "canopywalk",
    effects: [["flag", "knowFarPlatform"], ["stat", "sanity", -1]],
    text: `The far platform holds a survey marker your own team planted, aimed at a point in the canopy that, cross-referenced against the Overlook's later view, lines up exactly with the city's rough position. Someone here was closer to certain than their official reports ever let on.`,
    choices: [{ label: "Back to the canopy walk", to: 20 }],
  },

  26: {
    room: "canopywalk",
    effects: [["stat", "health", -2]],
    text: `A plank gives without warning halfway across, and only a fast grab at the guide rope keeps the crossing from becoming considerably more serious. You make it to solid platform shaking, and considerably more respectful of expedition-grade rigging left unattended for three weeks.`,
    choices: [{ label: "Back to the canopy walk", to: 20 }],
  },

  35: {
    room: "ruinsgate",
    effects: [["add", "dressingkit"], ["stat", "sanity", -1]],
    text: `Beneath a collapsed lintel, a stocked FIELD DRESSING KIT sits exactly where someone would leave it for whoever came through this gate next, in a waterproof case that's clearly weathered more than one rainy season waiting.`,
    choices: [{ label: "Back to the ruins gate", to: 30 }],
  },

  36: {
    room: "ruinsgate",
    effects: [["stat", "sanity", -1]],
    text: `The fallen blocks shift under investigation in a way that feels less like settling stone and more like something underneath adjusting its own comfort, and you decide the search has answered enough questions for now.`,
    choices: [{ label: "Back to the ruins gate", to: 30 }],
  },

  45: {
    room: "oldstation",
    effects: [["add", "quininetonic"]],
    text: `The equipment shed's stock has held up remarkably well across six decades — a sealed QUININE TONIC among the surviving supplies, expired by any label's standard and, your own field testing confirms, still entirely usable.`,
    choices: [{ label: "Back to the Old Station", to: 40 }],
  },

  55: {
    room: "hollow",
    effects: [["stat", "sanity", 1]],
    text: `You leave something small and genuinely yours at the clearing's edge, alongside the others — not because you're certain it matters, but because everyone else's offering here was clearly made in the same uncertain, hopeful spirit. The quiet, if anything, seems to approve.`,
    choices: [{ label: "Back to the Hollow", to: 50 }],
  },

  65: {
    room: "caves",
    effects: [["flag", "knowCavesDeep"], ["stat", "sanity", -1]],
    text: `Deeper in, the root channels converge into something unmistakably deliberate — a confluence point where dozens of separate systems braid into one considerably larger structure, disappearing into bedrock at an angle that, if your mental map is right, points directly toward the geometry the Overlook glimpsed.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  // ---- The Spore Clearing ----

  145: {
    room: null,
    text: `A small clearing thick with drifting, faintly luminous spore-light, undisturbed by any wind the rest of the jungle is currently managing. Breathing it feels harmless. It also feels like it's being noticed.`,
    choices: [{ label: "Breathe it in and hold still", luck: { pass: 146, fail: 147 } }],
  },

  146: {
    room: null,
    effects: [["add", "calmingleaf"], ["stat", "sanity", 1]],
    text: `The spore-light settles around you rather than through you, and something in the sensation is unmistakably gentle — an offered CALMING LEAF drifts down and settles in your open palm, the clearing's version, you suspect, of a friendly greeting.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  147: {
    room: null,
    effects: [["stat", "sanity", -1]],
    text: `You breathe too deeply too fast, and the clearing's attention arrives all at once instead of gently — not hostile, just more than you were braced for. You back out coughing, faintly, apologetically dizzy.`,
    choices: [{ label: "Back to camp", to: 8 }],
  },

  155: {
    room: "nursery",
    text: `You crouch among the accelerated seedlings, cataloguing growth rates your training insists shouldn't be biologically possible, and something about the attention you're paying seems to please whatever's tending this place.`,
    choices: [{ label: "See if anything's ready to share", luck: { pass: 156, fail: 157 } }],
  },

  156: {
    room: "nursery",
    effects: [["add", "driedrations"]],
    text: `A cluster of nutrient-dense pods, unmistakably cultivated rather than wild, proves to be exactly as edible as they look — DRIED RATIONS, effectively, grown rather than processed, and considerably better tasting than the freeze-dried kind.`,
    choices: [{ label: "Back to the Nursery", to: 88 }],
  },

  157: {
    room: "nursery",
    effects: [["stat", "sanity", -1]],
    text: `Whatever's ready to share, it isn't ready to share with you specifically, not yet — the nursery's attention simply, politely, redirects itself elsewhere, leaving you crouched among seedlings that have stopped acknowledging you're there.`,
    choices: [{ label: "Back to the Nursery", to: 88 }],
  },

  190: {
    room: "templeofroots",
    effects: [["stat", "sanity", -1]],
    text: `Further into the temple, side chambers hold personal effects from every expedition that's ever passed through this doorway — cameras, notebooks, a child's drawing tucked incongruously among survey equipment. Not a trophy room. A waiting room, patiently accumulating the belongings of people who simply, eventually, stopped needing them the same way.`,
    choices: [{ label: "Back to the temple entrance", to: 80 }],
  },

  191: {
    room: "memorytrees",
    effects: [["flag", "knowOldTeamEntry"], ["stat", "sanity", -1]],
    text: `You find them — the sixty-year-old survey team, every name accounted for, carved in a hand as steady and unhurried as Camacho-Reyes's own recent entry. The basin has clearly been doing this for a very long time, and clearly, by every account carved into this grove, doing it kindly.`,
    choices: [{ label: "Back to Memory Trees", to: 84 }],
  },

  192: {
    room: "oldstation",
    effects: [["stat", "sanity", -1]],
    text: `The specimen archive holds sixty years of collected samples, meticulously labeled, several of which — cross-referenced against your own modern equipment — read as biologically active in ways nothing preserved that long should still manage. Someone, or something, has been quietly maintaining this archive long after its original curators stopped being able to.`,
    choices: [{ label: "Back to the Old Station", to: 40 }],
  },

  193: {
    room: "overlook",
    effects: [["stat", "sanity", -1]],
    text: `Scouting for an easier descent, you find a second, gentler trail already cut — recently, deliberately, switchbacked with real trail-building expertise nobody on your expedition roster claims. Someone wanted the view from up here to be easy to reach. You're increasingly unsure that someone was entirely human.`,
    choices: [{ label: "Back to the Overlook", to: 70 }],
  },

  // ---- Extra branches (Act Two) ----

  110: {
    room: "chorus",
    effects: [["stat", "sanity", -1]],
    text: `You search, on a hunch, for the sixty-year-old survey team from the Old Station, and find them too — quieter than Camacho-Reyes's group, settled long enough into the Chorus that their individual voices have started, gently, harmonizing rather than merely coexisting.`,
    choices: [{ label: "Back to the Chorus Grove", to: 104 }],
  },

  111: {
    room: "seedvault",
    effects: [["flag", "knowOwnEntry"], ["stat", "sanity", -1]],
    text: `There's already a folder started on your own expedition — thin, recent, still being added to, in handwriting that shifts between your missing colleagues' and something else entirely. The vault, like the Duat libraries other basins apparently keep too, started cataloguing you before you ever arrived.`,
    choices: [{ label: "Back to the Seed Vault", to: 114 }],
  },

  112: {
    room: "wound",
    effects: [["flag", "knowConsortiumName"], ["stat", "sanity", -1]],
    text: `The stakes and equipment tags all trace to the same corporate designation, methodical and entirely unremarkable-looking — the kind of name that appears in a hundred permit filings a year, never once suggesting the scale of what it's actually threatening here.`,
    choices: [{ label: "Back to the Wound", to: 124 }],
  },

  113: {
    room: "canopycrown",
    effects: [["add", "silverleaf"], ["stat", "sanity", -1]],
    text: `Tucked into a wind-break at the platform's edge, another SILVERLEAF waits, undecayed, deliberately left where anyone reaching this vantage point would eventually find it — a small, patient reminder that someone wants you to remember this view exactly as urgently as you're currently feeling it.`,
    choices: [{ label: "Back to the Canopy Crown", to: 134 }],
  },

  140: {
    room: "deeproot",
    text: `You stop moving and let the Deep Root's slow, vast pulse set the pace instead — steadier down here than anywhere above, patient in a way that makes your own heartbeat feel briefly, pleasantly irrelevant.`,
    choices: [{ label: "Try to match it", luck: { pass: 141, fail: 142 } }],
  },

  141: {
    room: "deeproot",
    effects: [["flag", "knowNetworkRhythm"], ["stat", "sanity", 1]],
    text: `You match it, and for a handful of seconds understand, bodily rather than intellectually, why an entire basin might organize itself around this particular patience. It's not passivity. It's the kind of steadiness that outlasts things by simply, quietly, refusing to hurry.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  142: {
    room: "deeproot",
    effects: [["stat", "sanity", -1]],
    text: `You can't quite find the rhythm, and the attempt leaves you aware of your own pulse in a way that feels, briefly, like an intrusion into a much larger and much older room than the one you thought you were standing in.`,
    choices: [{ label: "Back to the Deep Root", to: 102 }],
  },

  // ============ DEATHS ============

  90: {
    room: null,
    type: "death",
    text: `Your body finally, quietly, gives out somewhere in the green, and the jungle doesn't so much claim you as simply, gently, decline to hurry you along. Vines settle. Birdsong continues. The reach absorbs one more silence into everything else it's already holding.

YOUR EXPEDITION ENDS HERE.`,
  },

  92: {
    room: null,
    type: "death",
    text: `Exhaustion finally outpaces whatever's kept you moving this long, and you go down somewhere the canopy never quite lets sunlight reach. The basin doesn't feel triumphant about it. If anything, it feels almost apologetic, the way an accident feels apologetic rather than intended.

YOUR EXPEDITION ENDS HERE.`,
  },

  94: {
    room: null,
    type: "death",
    text: `Somewhere among the repeating bends and the watching quiet, you stop being able to tell where your own thoughts end and the basin's patient attention begins. You sit down against warm, root-threaded stone, and find, distantly, that you don't especially mind losing the argument.

YOUR EXPEDITION ENDS HERE.`,
  },

};
