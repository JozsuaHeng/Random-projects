// TOMB OF THE UNBROKEN SEAL — story data. Act One draft.
// Page numbers are deliberately scattered, like the old paperbacks.

// 16x16 portrait: Dr. Asante-Kofi, field khaki collar.
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
  "...kkeeekkk.....",
  "..keeeeeeeeek...",
  ".keeeekkeeeeek..",
  ".keeek..keeeek..",
  ".kkkk....kkkk...",
];

const META = {
  title: "TOMB OF THE UNBROKEN SEAL",
  subtitle: "An Interactive Gamebook — Act One",
  startPage: 1,
  backdrop: "dunedrift",
  player: {
    name: "Dr. N. Asante-Kofi",
    role: "Epigrapher, Late Kingdom Studies",
    bio: "Nine years reading the inscriptions other people's expeditions dig up. This is your first dig where the ground-penetrating radar found something no prior survey, no looter, and no tomb robber in three thousand years ever found first. Your team went quiet twelve days ago, the day they finally cleared the outer seal.",
  },
  stats: { health: 10, oxygen: 10, sanity: 10 },
  deathPages: { health: 90, oxygen: 92, sanity: 94 },
};

const ITEMS = {
  lamp:       { name: "Oil Lamp",      desc: "Old technology, still the most reliable light down here.", slot: "held" },
  chisel:     { name: "Excavation Chisel", desc: "For stone that's had three thousand years to decide it isn't moving.", slot: "held" },
  blade:      { name: "Bronze Dagger", desc: "Recovered, not brought. Ceremonial, but the edge is real.", slot: "held" },
  tonic:      { name: "Bitter Tonic",  desc: "Field medicine, foul-tasting on purpose. USE: +3 health, -1 sanity.", use: { health: 3, sanity: -1 } },
  waterskin:  { name: "Waterskin",     desc: "Warm, sandy, exactly what you need. USE: +2 health, +1 sanity.", use: { health: 2, sanity: 1 } },
  linenwrap:  { name: "Linen Wrap",    desc: "Clean bandaging, some things really don't change in three thousand years. USE: +2 health.", use: { health: 2 } },
  calmherb:   { name: "Calming Herb",  desc: "Chewed, not smoked. USE: +3 sanity, -1 health.", use: { sanity: 3, health: -1 } },
  scarab:     { name: "Carved Scarab", desc: "Small, deliberate, worn smooth by a thumb that isn't yours. +1 on luck tests.", luckBonus: true },
  priestmask: { name: "Priest's Mask", desc: "A ritual mask, unbroken. Wear it to be recognized as someone who belongs here.", slot: "head" },
  ceremonialrobe: { name: "Ceremonial Robe", desc: "Linen and faience beading, preserved by the sealed dark. Wear it to be recognized as someone who belongs here.", slot: "body" },
  ritualgloves: { name: "Ritual Gloves", desc: "Fine linen, deliberately woven for handling sacred things.", slot: "hands" },
  sacredsandals: { name: "Sacred Sandals", desc: "Reed and leather, remarkably intact. Quiet on stone.", slot: "feet" },
  amuletcord: { name: "Amulet Cord",   desc: "An empty cord, waiting for something to be hung on it.", slot: "back" },
  sealring:   { name: "Seal-Bearer's Ring", desc: "A signet ring bearing an authority you are fairly sure predates every authority you actually hold." },
  papyrus:    { name: "Fragment of Papyrus", desc: "Brittle, dense with careful handwriting, unmistakably a warning." },
  canopicjar: { name: "Canopic Jar",   desc: "Sealed, heavier than it should be, and — according to your scanner — not empty." },
  heartweight: { name: "The Heart and the Feather", desc: "A balance scale in miniature, gold and stone, worn from use that predates any museum." },
  ankh:       { name: "The Unbroken Ankh", desc: "Cast in solid gold. It is warm to the touch, which it should not be." },
  trueseal:   { name: "The True Seal",  desc: "Not a stamp, not a stone — a completed working, waiting for a hand willing to finish it properly." },
  duatwater:  { name: "Water of the Duat", desc: "Cold in a way that has nothing to do with temperature. USE: +4 health.", use: { health: 4 } },
  predecessorscroll: { name: "Predecessor's Scroll", desc: "A full accounting of every guardian who held this watch before her, in her own careful hand." },
  isfetshard: { name: "Shard of Isfet", desc: "A fragment of the absence itself, somehow contained in something small enough to carry. It should not be possible. You are carrying it anyway." },
  accordtoken: { name: "Token of Accord", desc: "Neither seal nor weapon — an opening position, offered in good faith, for a negotiation three thousand years overdue." },
};

const ROOMS = {
  camp:         { name: "Base Camp",       col: 0, row: 0, icon: "⛺" },
  antechamber:  { name: "Antechamber",     col: 1, row: 0, icon: "◈" },
  offeringhall: { name: "Offering Hall",   col: 2, row: 0, icon: "❖" },
  judgmenthall: { name: "Judgment Hall",   col: 3, row: 0, icon: "⚖" },
  embalming:    { name: "Embalming Chamber", col: 0, row: 1, icon: "☥" },
  treasury:     { name: "Treasury",        col: 1, row: 1, icon: "◇" },
  library:      { name: "Scribes' Archive", col: 2, row: 1, icon: "❦" },
  falseburial:  { name: "False Burial",    col: 3, row: 1, icon: "◎" },
  trueburial:   { name: "True Burial",     col: 0, row: 2, icon: "▲" },
  shrine:       { name: "Hidden Shrine",   col: 1, row: 2, icon: "✦" },
  starchamber:  { name: "Star Chamber",    col: 2, row: 2, icon: "☆" },
  sanctum:      { name: "The Unbroken Seal", col: 3, row: 2, icon: "◉" },
  // Act Two — beyond the circle
  duatgate:     { name: "The Duat Gate",   col: 0, row: 3, icon: "◐" },
  hallofscales: { name: "Hall of Scales",  col: 1, row: 3, icon: "⚖" },
  crypts:       { name: "Guardians' Crypts", col: 2, row: 3, icon: "☠" },
  riverbelow:   { name: "The River Below", col: 3, row: 3, icon: "≈" },
  duatlibrary:  { name: "The Duat Library", col: 0, row: 4, icon: "❦" },
  isfetrim:     { name: "The Rim of Isfet", col: 1, row: 4, icon: "◈" },
  steles:       { name: "Whispering Steles", col: 2, row: 4, icon: "❖" },
  finalweighing: { name: "The Final Weighing", col: 3, row: 4, icon: "☥" },
  reflectingbasin: { name: "Reflecting Basin", col: 0, row: 5, icon: "◎" },
};

const PAGES = {

  // ============ BASE CAMP ============

  1: {
    room: "camp",
    effects: [["add", "lamp"]],
    text: `The camp sits exactly as it was twelve days ago, tents still standing, generator still idling, radio still transmitting nothing but its own static back at you. Whoever left last did not leave in a hurry. They left the way you'd leave a room you fully intended to come back to.

The tomb entrance yawns dark at the base of the excavation trench, freshly cleared, the outer seal broken for the first time in three thousand years. Someone propped an OIL LAMP by the entrance, still fueled, waiting.`,
    choices: [
      { label: "Check the camp's equipment cache", to: 3 },
      { label: "Read the expedition's field log", to: 5 },
      { label: "Descend into the tomb", to: 8 },
    ],
  },

  3: {
    room: "camp",
    effects: [["add", "chisel"], ["add", "waterskin"]],
    text: `The equipment cache is orderly, professionally packed, nothing missing that shouldn't be. You take an EXCAVATION CHISEL and a full WATERSKIN — sensible gear for a site nobody expected to need urgent rescuing from.

A second radio, backup unit, sits charged and untouched. Nobody thought to grab it on the way in. Nobody thought they'd need to.`,
    choices: [{ label: "Descend into the tomb", to: 8 }],
  },

  5: {
    room: "camp",
    effects: [["stat", "sanity", -1], ["flag", "knowFieldLog"]],
    text: `The field log's final entries are professional right up until they aren't. "Outer seal cleared, inscription unlike anything catalogued for this period, Dr. Voss translating." Then, two entries later, in a different, hastier hand: "Voss says the name on the seal isn't a name we're allowed to read out loud. I told her that's not how epigraphy works. She didn't laugh."

The log simply stops after that. No damage, no violence noted. Just a stop.`,
    choices: [{ label: "Descend into the tomb", to: 8 }],
  },

  // ============ ANTECHAMBER ============

  8: {
    room: "antechamber",
    text: `The antechamber is intact in a way that should be archaeologically impossible — paint still vivid on the walls, tools still laid out by your own team exactly where they were set down, mid-task. The outer seal, cleared and swung open, rests against the wall where someone leaned it, carefully, rather than discarding it.

Passages lead onward to an Offering Hall and a Judgment Hall. A side alcove holds neatly stacked survey equipment.`,
    choices: [
      { label: "Examine the broken outer seal", to: 10 },
      { label: "Check the survey equipment", to: 12 },
      { label: "Offering Hall", to: 14 },
      { label: "Judgment Hall", to: 20 },
      { label: "Embalming Chamber", to: 30 },
      { label: "A hidden passage marked False Burial", to: 60 },
      { label: "You've traced enough. Go to the Seal", to: 95 },
    ],
  },

  10: {
    room: "antechamber",
    effects: [["stat", "sanity", -1], ["flag", "knowSealText"]],
    text: `The seal's inscription is dense, formal, and — once you slow down enough to actually translate it rather than skim it — increasingly specific about what it is: not a curse in the threatening sense scholars love to overstate, but a binding. A promise, made by someone, to keep something contained by keeping her own identity buried alongside it.

The text refers to her only as "She Who Is Not Named," which epigraphers usually read as ceremonial modesty. You are starting to suspect it was meant literally.`,
    choices: [{ label: "Back to the antechamber", to: 8 }],
  },

  12: {
    room: "antechamber",
    effects: [["add", "sealring"]],
    text: `Among the survey gear, tucked carefully into a specimen case rather than left loose, is a SEAL-BEARER'S RING — gold, heavy, bearing an authority mark your team must have recovered before things went quiet. Someone packaged it properly before whatever happened, happened. That itself tells you something about how much time they had.`,
    choices: [{ label: "Back to the antechamber", to: 8 }],
  },

  // ============ OFFERING HALL ============

  14: {
    room: "offeringhall",
    text: `The Offering Hall is stacked floor to ceiling with grave goods that should have been looted a hundred times over in three thousand years and instead sit precisely as placed — food offerings desiccated but whole, vessels unbroken, gold leaf undimmed by any light until your lamp.

At the hall's center, a low table holds a single item set apart from the rest, deliberately isolated from the wealth surrounding it.`,
    choices: [
      { label: "Examine the isolated item", to: 16 },
      { label: "Search the grave goods for anything portable", to: 18 },
      { label: "Back to the antechamber", to: 8 },
    ],
  },

  16: {
    room: "offeringhall",
    effects: [["add", "heartweight"], ["stat", "sanity", -1]],
    text: `The isolated item is a THE HEART AND THE FEATHER — a miniature balance scale, gold and dark stone, worn smooth from use that long predates any museum handling. It's not funerary regalia. It's a working tool, kept apart from the wealth because it was never meant as wealth.

You understand, holding it, exactly what it was used to weigh, and exactly why someone kept it close at hand for as long as she had hands to hold it with.`,
    choices: [{ label: "Back to the offering hall", to: 14 }],
  },

  18: {
    room: "offeringhall",
    effects: [["stat", "sanity", -1], ["flag", "knowOfferings"]],
    text: `You resist the urge to pocket anything — three thousand years of intact provenance is not something you're prepared to be the one who compromises — but cataloguing what's here tells its own story. These aren't offerings FOR her. Every inscription reads as offerings FROM her, to whatever she spent her reign appeasing, one careful gift at a time, for as long as her reign lasted.

A reign that, by the burial goods' dating, appears to have lasted considerably longer than any single human lifetime should.`,
    choices: [{ label: "Back to the offering hall", to: 14 }],
  },

  // ============ JUDGMENT HALL ============

  20: {
    room: "judgmenthall",
    text: `The Judgment Hall's mural is the most complete weighing-of-the-heart scene you have ever personally seen, larger than any known example, and subtly, unmistakably wrong in one detail: the scale never tips. In every panel, in every stage of the ritual depicted floor to ceiling, the heart and the feather rest in perfect, eternal balance.

A raised dais at the hall's center holds an empty stone cradle, shaped exactly for something you are currently carrying, if you found it.`,
    choices: [
      { label: "Place the Heart and the Feather in the cradle", needItem: "heartweight", to: 22 },
      { label: "Study the mural more closely", to: 24 },
      { label: "Treasury", to: 40 },
      { label: "Star Chamber", to: 86 },
      { label: "Back to the antechamber", to: 8 },
    ],
  },

  22: {
    room: "judgmenthall",
    effects: [["flag", "knowJudgmentSet"], ["stat", "sanity", -1]],
    text: `The scale settles into the cradle with a fit so precise it can only have been made for exactly this object. Nothing happens immediately — no grinding stone, no revealed passage — but you have the unmistakable, prickling sense of something distant taking note of a scale finally, correctly, completed.

You leave it in place. It seems wrong, suddenly, to take it back out.`,
    choices: [{ label: "Back to the antechamber", to: 8 }],
  },

  24: {
    room: "judgmenthall",
    effects: [["stat", "sanity", -1], ["flag", "knowMuralTruth"]],
    text: `Reading the panels in sequence rather than admiring them individually, the mural isn't depicting the standard judgment of a soul. It's depicting one specific, repeated judgment, over and over, always balanced, always resolved the same way — the same figure, weighed against the same feather, every single time, across what the accompanying text implies is not one death but many, many returns.

Someone here was judged, and passed, and judged again. Repeatedly. As though the test never actually finished.`,
    choices: [{ label: "Back to the antechamber", to: 8 }],
  },

  // ============ EMBALMING CHAMBER ============

  // (accessed via a passage the team's survey notes marked from the antechamber's side corridor)

  30: {
    room: "embalming",
    text: `You backtrack to a side corridor the survey notes marked but your team apparently hadn't finished exploring — it opens on an embalming chamber, tools and natron salts still arranged with clinical precision, untouched by three millennia or by whatever happened to your colleagues.

A CANOPIC JAR sits apart from its matching set of four, alone on its own shelf, clearly added to the room's arrangement long after the original burial.`,
    choices: [
      { label: "Take the isolated canopic jar", to: 32 },
      { label: "Examine the embalming tools", to: 34 },
      { label: "Back to the antechamber", to: 8 },
    ],
  },

  32: {
    room: "embalming",
    effects: [["add", "canopicjar"], ["stat", "sanity", -1]],
    text: `The jar is heavier than an empty vessel should be, and your scanner's reading refuses to resolve into anything as simple as "organ" or "empty." Whatever's sealed inside was placed here recently by the tomb's own three-thousand-year standard of recently — added, not original, deliberately incomplete against a matched set of four.

You take it anyway. Curatorial ethics feel like a luxury you can revisit once your colleagues are accounted for.`,
    choices: [{ label: "Back to the antechamber", to: 8 }],
  },

  34: {
    room: "embalming",
    effects: [["flag", "knowEmbalming"], ["stat", "sanity", -1]],
    text: `The tools are used, not ceremonial — genuine wear patterns, genuine technique, on a body that the burial record insists was interred once, finally, completely. You are increasingly certain "once" undersells the actual number by a significant margin.`,
    choices: [{ label: "Back to the antechamber", to: 8 }],
  },

  // ============ TREASURY ============

  40: {
    room: "treasury",
    text: `The Treasury, reached through a passage off the Judgment Hall, is a controlled, catalogued wealth — gold, lapis, faience, all of it arranged with a precision that reads more like a filing system than a hoard. Your team's own equipment sits here too: cameras, notebooks, a tripod still assembled, all abandoned mid-task.`,
    choices: [
      { label: "Search the abandoned equipment", to: 42 },
      { label: "Search the treasury itself", to: 44 },
      { label: "Scribes' Archive", to: 50 },
      { label: "Back to the Judgment Hall", to: 20 },
    ],
  },

  42: {
    room: "treasury",
    effects: [["flag", "knowTeamFate"], ["stat", "sanity", -2]],
    text: `The last camera's memory card still holds footage. You watch it standing exactly where it was filmed. Your team, all six of them, gathered around something off-frame, calm, unhurried, taking turns speaking to it in a language none of them should have known how to pronounce.

The last frame shows all six of them walking, together, toward the deeper passages, none of them looking back at the camera they left recording.`,
    choices: [{ label: "Back to the treasury", to: 40 }],
  },

  44: {
    room: "treasury",
    effects: [["add", "amuletcord"], ["stat", "sanity", -1]],
    text: `Among the catalogued wealth, an AMULET CORD lies empty, clearly meant to carry something specific rather than simple decoration. You take it, uneasily certain you already know, roughly, what it's meant to eventually carry.`,
    choices: [{ label: "Back to the treasury", to: 40 }],
  },

  // ============ SCRIBES' ARCHIVE ============

  50: {
    room: "library",
    text: `The Scribes' Archive, off the Treasury, holds shelf after shelf of papyrus in a dryness so perfect it might as well be a modern climate-controlled vault. Your predecessor epigraphers — the actual ancient ones — clearly understood how to build for permanence.`,
    choices: [
      { label: "Search for anything about the seal itself", to: 52 },
      { label: "Search for anything about the queen herself", to: 54 },
      { label: "Back to the Treasury", to: 40 },
    ],
  },

  52: {
    room: "library",
    effects: [["add", "papyrus"], ["stat", "sanity", -1]],
    text: `You find a FRAGMENT OF PAPYRUS separate from the archive's careful cataloguing, hidden rather than filed, tucked behind a support beam like something meant for exactly one specific future reader. Its opening line reads, in a hurried hand utterly unlike the archive's formal scribal style: "If you have found this, she is still holding. Do not help her stop."`,
    choices: [{ label: "Back to the archive", to: 50 }],
  },

  54: {
    room: "library",
    effects: [["flag", "knowQueenName"], ["stat", "sanity", -1]],
    text: `Cross-referencing decades of your own field's scholarship against what's actually written here, you find her name — genuinely, actually find it, the one thing every prior study of this dynasty assumed was lost to deliberate erasure. It sits in exactly one place in this entire archive, in the smallest possible script, as if hidden even from scribes who otherwise had full access to everything else here.

You do not say it aloud. You're not entirely sure, reading the surrounding text, that saying it aloud is something you're meant to be able to undo.`,
    choices: [{ label: "Back to the archive", to: 50 }],
  },

  // ============ FALSE BURIAL ============

  60: {
    room: "falseburial",
    text: `A passage off the False Burial's entrance is disguised as a dead end, convincingly enough that you nearly miss it — a decoy chamber, sarcophagus sealed, goods arranged, everything a robber or a lesser scholar would need to believe they'd found the tomb's heart and stop looking further.

Your team's tool marks are here too, recent, careful, someone having worked out the deception before you did.`,
    choices: [
      { label: "Open the decoy sarcophagus anyway", luck: { pass: 62, fail: 63 } },
      { label: "Follow your team's marks past the deception", to: 64 },
    ],
  },

  62: {
    room: "falseburial",
    effects: [["add", "linenwrap"], ["stat", "sanity", -1]],
    text: `You crack the decoy open with more care than speed, and it holds exactly what a decoy should: a substitute burial, a lesser priest given the dignity of a queen's wrappings in service of protecting the real one. Among the wrappings, a still-sealed LINEN WRAP kit, remarkably preserved.

You reseal what you can and leave the rest of him his dignity.`,
    choices: [{ label: "Follow your team's marks past the deception", to: 64 }],
  },

  63: {
    room: "falseburial",
    effects: [["stat", "sanity", -2]],
    text: `The decoy's substitute occupant is not as gently preserved as the queen's own effects, and the reason why is written across what's left of him in a way you will not be forgetting soon. Whatever guarded this deception took its job seriously, once. You close the lid.`,
    choices: [{ label: "Follow your team's marks past the deception", to: 64 }],
  },

  64: {
    room: "falseburial",
    effects: [["flag", "knowFalseBurial"]],
    text: `Past the decoy, your team's tool marks lead to a passage the original architects clearly meant to be found only by someone who'd already proven, through patience or through scholarship, that they weren't simply here to loot the nearest gold. The passage slopes down, toward the tomb's true burial chamber.`,
    choices: [{ label: "Continue to the True Burial", to: 70 }],
  },

  // ============ TRUE BURIAL ============

  70: {
    room: "trueburial",
    text: `The True Burial Chamber holds a sarcophagus of black stone, undecorated except for a single band of text running its full length — not funerary prayers, but what reads, translated carefully, like a job description. Guardian. Warden. The one who stayed so the rest of you wouldn't have to.

The sarcophagus lid is already off, set aside, gently, by careful hands. It has been off for twelve days.`,
    choices: [
      { label: "Look inside the sarcophagus", to: 72 },
      { label: "Read the full inscription band", to: 74 },
      { label: "A gap behind the sarcophagus", to: 80 },
      { label: "Back to the False Burial", to: 60 },
    ],
  },

  72: {
    room: "trueburial",
    effects: [["stat", "sanity", -2], ["flag", "knowSarcophagusEmpty"]],
    text: `The sarcophagus is empty. Not robbed-empty, not decayed-to-nothing empty — clean, prepared, and waiting, wrappings folded neatly to one side as though their occupant simply, recently, stepped out of them and intends to step back in eventually.

There is no dust inside. Three thousand years, and no dust.`,
    choices: [{ label: "Back to the antechamber", to: 8 }],
  },

  74: {
    room: "trueburial",
    effects: [["stat", "sanity", -1], ["flag", "knowGuardianText"]],
    text: `The full inscription, read start to finish, resolves into something closer to a standing order than an epitaph: "I am not dead. I am on watch. Should the watch ever need relief, the relief must be freely offered, never taken, never tricked, never forced — or there is no relief at all, only a second warden bound beside the first, and the weight doubled instead of passed on."

You think, uncomfortably, about your team walking calmly into the deeper passages, none of them looking back at the camera.`,
    choices: [{ label: "Back to the antechamber", to: 8 }],
  },

  // ============ HIDDEN SHRINE ============

  80: {
    room: "shrine",
    text: `A gap behind the True Burial's sarcophagus, easy to miss unless you're looking for exactly this, opens onto a small shrine — no grave goods, no wealth, nothing meant for display. Just a single niche, and within it, resting on undisturbed stone, a small carved SCARAB.`,
    choices: [
      { label: "Take the scarab", to: 82 },
      { label: "Search the shrine for anything else", to: 84 },
      { label: "Back to the True Burial", to: 70 },
    ],
  },

  82: {
    room: "shrine",
    effects: [["add", "scarab"]],
    text: `The scarab is small, worn smooth by handling rather than by time — someone kept this on their person, turning it over in a pocket or a palm, for a very long stretch of a very long watch. It settles into yours the same way, immediately, like it's used to the job.`,
    choices: [{ label: "Back to the True Burial", to: 70 }],
  },

  84: {
    room: "shrine",
    effects: [["stat", "sanity", -1], ["flag", "knowShrine"]],
    text: `The shrine's walls, unlike every other surface in this tomb, are entirely unadorned except for a single repeated phrase, carved small, over and over, floor to ceiling, in a hand that grows visibly more tired with each repetition: "Still holding. Still holding. Still holding."`,
    choices: [{ label: "Back to the True Burial", to: 70 }],
  },

  // ============ STAR CHAMBER ============

  86: {
    room: "starchamber",
    text: `A passage off the Judgment Hall, marked on your team's survey but apparently unexplored by them, opens on a chamber whose ceiling is a complete, staggeringly detailed star map — not decorative, but functional, tracking something across a timescale your own astronomy would need serious equipment to verify by eye.

A viewing table beneath the map holds an alignment tool, precisely calibrated, aimed at one specific point overhead.`,
    choices: [
      { label: "Look through the alignment tool", to: 88 },
      { label: "Back to the Judgment Hall", to: 20 },
    ],
  },

  88: {
    room: "starchamber",
    effects: [["flag", "knowStars"], ["stat", "sanity", -1]],
    text: `The tool is aimed at nothing visible from a buried chamber — until you realize it was never meant to track the sky above you. It's tracking the sky as it will appear at a specific, calculated future date, plotted with an accuracy that took either extraordinary patience or a genuinely inhuman amount of time to compile.

The date, cross-referenced against your own calendar, is disturbingly close to now.`,
    choices: [{ label: "Back to the Judgment Hall", to: 20 }],
  },

  // ============ THE UNBROKEN SEAL (Act One climax) ============

  95: {
    room: "antechamber",
    text: `You've traced your team's path as far as the tomb's outer chambers will let you without a final decision. One passage remains: the one the False Burial's deception was built to hide, the one the star chamber's calculated date is counting down toward, the one your colleagues walked into calmly, together, and never walked back out of.

It leads to a chamber your team's own last notes simply label: THE SEAL.`,
    choices: [{ label: "Go to the Seal", to: 96 }],
  },

  96: {
    room: "sanctum",
    text: `The chamber beyond is smaller than the scale of everything leading to it would suggest — a single circle of dark stone, and at its center, kneeling calmly around it in a loose ring, your entire missing team. They look up as you enter, unsurprised, unafraid, unmistakably present in a way that argues against every worse thing you'd braced yourself to find.

"You made it," says Dr. Voss, and her voice is entirely her own. "Good. She's been asking about you specifically. Something about needing someone who reads dead languages for a living."`,
    choices: [{ label: "Approach the circle", to: 97 }],
  },

  97: {
    room: "sanctum",
    text: `Within the circle, seated rather than entombed, is a woman who should by every reasonable measure be three thousand years dead and is, very evidently, not — Hemet-Nebtawy, if the shrine's endless repetition is any guide, still on watch, still holding, and visibly, achingly tired of both.

"Twelve days," she says, in a language you understand a half-second before you consciously translate it, "is not very long to wait for someone to finish reading my library. You read quickly. That is good. I no longer have very much patience left to spend."`,
    choices: [
      { label: "Ask what she's actually containing", needFlag: "knowMuralTruth", to: 98 },
      { label: "Offer to relieve her watch, freely, as the sarcophagus demands", needFlag: "knowGuardianText", to: 99 },
      { label: "Ask what happens if no one ever relieves her", to: 100 },
    ],
  },

  98: {
    room: "sanctum",
    effects: [["stat", "sanity", -1], ["flag", "knowIsfetName"]],
    text: `"Isfet," she says, and the word costs her something to say plainly, the way it apparently always has. "Not a demon. Not a monster your language has a tidy shelf for. The absence that waits on the other side of every made thing, patient the way only an absence can afford to be. I did not defeat it. Nothing defeats an absence. I simply agreed to stand in the gap, and I have been standing in it since before your dynasty's dynasty had a name."

She looks, for the first time, less like a queen and more like someone extremely tired.`,
    choices: [{ label: "Continue the conversation", to: 100 }],
  },

  99: {
    room: "sanctum",
    effects: [["stat", "sanity", -2], ["flag", "offeredRelief"]],
    text: `You say it plainly, the way the inscription demanded it be said — not tricked, not forced, freely offered — and Hemet-Nebtawy goes very still, studying you with an attention that feels like it's checking every corner of the offer for a hidden condition you didn't know you'd attached.

"You would not be the first to offer," she says finally. "You would be the first to mean it without wanting something back first. That matters more than you understand yet."`,
    choices: [{ label: "Continue the conversation", to: 100 }],
  },

  100: {
    room: "sanctum",
    text: `"If no one relieves the watch," she says, answering the question you asked or the one you were both actually circling, "I hold anyway. I have held through six false reliefs, three attempted bindings, and one memorably ambitious robbery. I will hold through your visit too, if that is what you decide. I would simply, very much, prefer not to have to."

Around the circle, your team watches, calm, unhurried, waiting to see what you'll do with the next several minutes of a three-thousand-year conversation.`,
    choices: [
      { label: "Take up the watch yourself", needFlag: "offeredRelief", to: 102 },
      { label: "Propose taking her name and story back to the world instead", needFlag: "knowQueenName", to: 104 },
      { label: "Ask your team to leave with you, now, all of you", to: 106 },
      { label: "Refuse to decide anything today", to: 108 },
    ],
  },

  102: {
    room: "sanctum",
    effects: [["stat", "sanity", -2], ["flag", "tookWatch"]],
    text: `She rises, for the first time in longer than she can apparently precisely count, and the tiredness in her doesn't vanish so much as transfer, gently, deliberately, into the space you're now standing in. It does not feel like a curse. It feels exactly like what the inscription promised: a weight, freely passed, freely accepted.

"Thank you," she says, and means it with three thousand years of specific, exhausted weight behind the words. "Now. Let me tell you what you're actually watching for."

— END OF ACT ONE —`,
    choices: [{ label: "Listen", to: 110 }],
  },

  104: {
    room: "sanctum",
    effects: [["stat", "sanity", -1], ["flag", "proposedTelling"]],
    text: `She considers this longer than anything else you've offered. "My name, spoken back into the world, spent instead of hidden," she says slowly. "That is not nothing. That is not the watch itself, but it is not nothing." Something in her posture, ancient and precise, adjusts to account for a possibility she genuinely had not modeled in three thousand years of visitors.

"Tell me," she says, "exactly what you would say, and to whom, before I agree to anything."

— END OF ACT ONE —`,
    choices: [{ label: "Explain your plan", to: 110 }],
  },

  106: {
    room: "sanctum",
    effects: [["stat", "sanity", -1], ["flag", "askedTeamLeave"]],
    text: `Your team exchanges a look that has clearly already had this exact conversation among themselves, extensively, in the twelve days since you last saw any of them. "We talked about that," Dr. Voss says, gently. "We're not being kept. That's the part that's hard to explain topside. Ask her yourself what happens if we all just walk out."

Hemet-Nebtawy watches you ask the question you're visibly working up to.

— END OF ACT ONE —`,
    choices: [{ label: "Ask her directly", to: 110 }],
  },

  108: {
    room: "sanctum",
    effects: [["flag", "refusedDecide"]],
    text: `"Wise," she says, and you can't quite tell if it's approval or simple weary agreement that this decision shouldn't be made in the first twelve minutes of a three-thousand-year conversation. "Rest, then. Eat something that isn't three millennia old. Come back to me when the answer feels like yours instead of like an instinct to be finished with an uncomfortable room."

— END OF ACT ONE —`,
    choices: [{ label: "Step back and take stock", to: 110 }],
  },

  110: {
    room: "sanctum",
    effects: [["flag", "act2"]],
    text: `Whatever you decide here, you understand — with the specific clarity of someone who has just watched a demonstrably true impossibility calmly explain its own operating rules to her — that this is not a decision you finish today. Twelve days changed your team. Twelve minutes has already started changing you.

Hemet-Nebtawy waits, patient as ever, patient as the inscription always insisted she would be, for you to decide how the rest of this visit is going to go.

— END OF ACT ONE —`,
    choices: [{ label: "Ask what lies beyond the circle", to: 111 }],
  },

  // ============ ACT TWO — BEYOND THE CIRCLE ============

  111: {
    room: "sanctum",
    effects: [["stat", "sanity", -1]],
    text: `"There is a gate," Hemet-Nebtawy says, "behind where I sit. I do not use it often. Most who come this far are satisfied with a conversation. You strike me as someone who reads footnotes."

Behind the circle, a passage you would have sworn was solid stone a moment ago stands open, sloping down into architecture your team's own reports never mapped — older than the tomb above it, older, you suspect, than the dynasty that built the tomb around it as an afterthought.`,
    choices: [{ label: "Go through the gate", to: 112 }],
  },

  112: {
    room: "duatgate",
    text: `Beyond the gate, the tomb's polite museum-quality preservation gives way to something rawer — a genuine threshold architecture, built to contain rather than to commemorate. Passages lead to a Hall of Scales, the crypts of guardians before her, a river that shouldn't exist this far underground, and a library holding considerably more than one dynasty's worth of history.

A narrower gap leads toward something the air itself seems reluctant to approach.`,
    choices: [
      { label: "Hall of Scales", to: 114 },
      { label: "Guardians' Crypts", to: 120 },
      { label: "The River Below", to: 130 },
      { label: "The Duat Library", to: 140 },
      { label: "Whispering Steles", to: 195 },
      { label: "Reflecting Basin", to: 200 },
      { label: "The Rim of Isfet", to: 150 },
      { label: "Wait and watch this place breathe", to: 190 },
      { label: "Rest a moment", to: 113 },
      { label: "Take stock of everything you now know", to: 160 },
      { label: "You're ready. Go to the Final Weighing", needFlag: "readyForWeighing", to: 170 },
    ],
  },

  113: {
    room: "duatgate",
    effects: [["stat", "sanity", 1], ["stat", "health", 1]],
    text: `You sit against stone that has never once seen a tourist and let your pulse settle. Whatever this place is, it doesn't seem to mind a moment's stillness — if anything, stillness seems to be the one thing it fully understands.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  // ---- Hall of Scales ----

  114: {
    room: "hallofscales",
    text: `The Hall of Scales holds row upon row of identical balances, each one mid-weighing, each one — impossibly, when you check more than a few — precisely level. This is not a hall of judgments rendered. It is a hall of judgments perpetually, patiently, still in progress.`,
    choices: [
      { label: "Submit to your own weighing", luck: { pass: 116, fail: 117 } },
      { label: "Study the hall's records instead", to: 118 },
      { label: "Examine the mechanism itself", to: 119 },
      { label: "Back to the Duat Gate", to: 112 },
    ],
  },

  116: {
    room: "hallofscales",
    effects: [["add", "accordtoken"], ["flag", "knowWeighed"], ["stat", "sanity", -1]],
    text: `Your own scale settles level, and stays level, and a small TOKEN OF ACCORD detaches itself from the mechanism into your open hand — not a reward exactly, more a receipt, proof that whatever weighed you found the balance genuine rather than performed.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  117: {
    room: "hallofscales",
    effects: [["stat", "sanity", -2]],
    text: `Your scale tips, hard, and rights itself only slowly, reluctantly, the mechanism apparently willing to keep trying rather than record a verdict it clearly finds as uncomfortable as you do. You step back before it finishes deciding.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  118: {
    room: "hallofscales",
    effects: [["flag", "knowScalesHistory"], ["stat", "sanity", -1]],
    text: `The hall's records are a genealogy of tests, not people — every guardian who ever held this watch, weighed here first, before the sarcophagus above ever accepted them. Hemet-Nebtawy's own entry is the longest in the hall, and the only one still, actively, open.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  119: {
    room: "hallofscales",
    effects: [["stat", "sanity", -1]],
    text: `The mechanism beneath the nearest scale is neither clockwork nor anything your field's conservation labs could meaningfully x-ray — it simply weighs, correctly, the way gravity simply pulls, without moving parts you can identify as parts at all. You give up trying to sketch it for publication. Some things resist being reduced to a diagram.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  // ---- Guardians' Crypts ----

  120: {
    room: "crypts",
    text: `The crypts hold every guardian who came before Hemet-Nebtawy — dozens, their names carved plainly, unlike hers. Whatever demanded her own erasure was apparently a newer, harsher term than her predecessors negotiated.`,
    choices: [
      { label: "Search for a written account", to: 122 },
      { label: "Explore the deeper rows", luck: { pass: 124, fail: 125 } },
      { label: "Check the crypt reserved but never used", to: 126 },
      { label: "Back to the Duat Gate", to: 112 },
    ],
  },

  122: {
    room: "crypts",
    effects: [["add", "predecessorscroll"], ["stat", "sanity", -1]],
    text: `Tucked into the newest crypt — new being a relative term measured in centuries rather than millennia — a PREDECESSOR'S SCROLL, written in Hemet-Nebtawy's own hand, a careful accounting of everyone who held this watch before her and exactly how each of their terms ended.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  124: {
    room: "crypts",
    effects: [["flag", "knowPredecessors"], ["stat", "sanity", -1]],
    text: `The deeper rows go back further than any dynasty your own field has ever catalogued — the guardianship, you realize, considerably predates the specific dynasty currently credited with inventing it. Someone simply attached their own name to a job that already existed.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  125: {
    room: "crypts",
    effects: [["stat", "health", -2]],
    text: `A collapsed row gives way underfoot, and you catch yourself hard against older stone, more startled than hurt. The crypts, you decide, have earned the benefit of the doubt about structural integrity for approximately three thousand more years.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  126: {
    room: "crypts",
    effects: [["stat", "sanity", -1], ["flag", "knowCryptEnd"]],
    text: `One crypt, near the very back, is conspicuously, deliberately empty — carved, labeled, prepared, and never occupied. You do not need the accompanying inscription translated to understand whose name it was reserved for, or why it has stayed empty for exactly as long as Hemet-Nebtawy has stayed on watch.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  // ---- The River Below ----

  130: {
    room: "riverbelow",
    text: `The River Below shouldn't exist — no water table, no geological reason for a moving current this far under solid rock — and yet it runs, dark and cold and entirely convinced of its own necessity, the way only a mythologically load-bearing river can afford to be.`,
    choices: [
      { label: "Drink from the river", to: 132 },
      { label: "Try to cross to the far bank", luck: { pass: 134, fail: 135 } },
      { label: "Just watch the current for a while", to: 136 },
      { label: "Back to the Duat Gate", to: 112 },
    ],
  },

  132: {
    room: "riverbelow",
    effects: [["add", "duatwater"]],
    text: `You fill a container with WATER OF THE DUAT, cold in a way that has nothing to do with temperature. It tastes, absurdly, like nothing at all — not stale, not mineral, not anything your palate has a category for.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  134: {
    room: "riverbelow",
    effects: [["flag", "knowFarBank"], ["stat", "sanity", -1]],
    text: `You pick your way across on stones that seem to surface specifically to be stepped on, and the far bank holds only silence and a view back at the passage you came from, from an angle no one was apparently ever meant to have. You've seen enough. You cross back.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  135: {
    room: "riverbelow",
    effects: [["stat", "health", -2], ["stat", "sanity", -1]],
    text: `A stone shifts under your weight at the worst possible moment, and the current — far stronger than a windless underground river has any business being — takes you a good ten meters before you claw your way back to the bank you started on, soaked, shaken, and considerably more respectful of the water's opinion of visitors.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  136: {
    room: "riverbelow",
    effects: [["stat", "sanity", -1], ["flag", "knowRiverPurpose"]],
    text: `Watching the current long enough, you notice it doesn't flow toward or away from anything you'd call a source — it circulates, endlessly, past the same handful of landmarks, the way a held breath circulates through a body that has stopped needing to actually breathe.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  // ---- The Duat Library ----

  140: {
    room: "duatlibrary",
    text: `The Duat Library dwarfs the Scribes' Archive above by an order of magnitude — not one dynasty's records, but a great many, catalogued by a hand, or many hands, working to a standard your field has no name for yet.`,
    choices: [
      { label: "Search the deep shelves", luck: { pass: 142, fail: 143 } },
      { label: "Read Isfet's own record", to: 144 },
      { label: "Search for anything about your own expedition", to: 146 },
      { label: "Back to the Duat Gate", to: 112 },
    ],
  },

  142: {
    room: "duatlibrary",
    effects: [["add", "trueseal"], ["flag", "knowTrueSeal"], ["stat", "sanity", -1]],
    text: `Deep in the stacks, in a case built for exactly one object, you find THE TRUE SEAL — not a stamp or a stone, but a completed working, a binding finished properly rather than held open indefinitely by one exhausted guardian's continuous effort. Someone built the actual solution. It was simply never used.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  143: {
    room: "duatlibrary",
    effects: [["stat", "sanity", -1]],
    text: `The deep shelves resist your search with a specific, almost personal stubbornness, texts sliding just out of reach or reshelving themselves when you're not quite looking. You get the distinct impression the library is still deciding whether you've earned this particular section yet.`,
    choices: [{ label: "Back to the Duat Library", to: 140 }],
  },

  144: {
    room: "duatlibrary",
    effects: [["flag", "knowIsfetRecord"], ["stat", "sanity", -2]],
    text: `Isfet's own record, if "record" is even the right word for an entry about an absence, describes something that predates every named god in every catalogued pantheon — not a rival power, but the specific shape of what's left when nothing has been made yet. Every guardian's task, across every dynasty, has been the same: keep something from ending before its ending was actually due.`,
    choices: [
      { label: "Search for what happened to the very first guardian", to: 145 },
      { label: "Back to the Duat Library", to: 140 },
    ],
  },

  145: {
    room: "duatlibrary",
    effects: [["flag", "knowFirstGuardian"], ["stat", "sanity", -1]],
    text: `The first guardian's fate is recorded plainly, almost gently: eventually relieved, freely, by someone who simply asked to help and meant it, exactly as the sarcophagus inscription upstairs still insists is the only acceptable method. It has happened before. It can happen again. That is, apparently, the entire, patient point of the arrangement.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  146: {
    room: "duatlibrary",
    effects: [["flag", "knowOwnFate"], ["stat", "sanity", -1]],
    text: `Unsettlingly, there's already a folder started on your own expedition — thin, recent, still being added to, in handwriting that shifts between your missing colleagues' and one you don't recognize at all. The library, it seems, started cataloguing you before you ever found it.`,
    choices: [{ label: "Back to the Duat Library", to: 140 }],
  },

  // ---- Whispering Steles ----

  195: {
    room: "steles",
    text: `A gallery of standing steles, each inscribed not with royal decree but with something closer to a diary entry — centuries of guardians, one stone apiece, recording what the watch actually felt like from the inside, in their own unguarded words.`,
    choices: [
      { label: "Read the nearest stele closely", luck: { pass: 196, fail: 197 } },
      { label: "Search for Hemet-Nebtawy's own stele", to: 198 },
      { label: "Search for other footnotes among the stones", to: 199 },
      { label: "Back to the Duat Gate", to: 112 },
    ],
  },

  196: {
    room: "steles",
    effects: [["stat", "sanity", 1], ["flag", "knowSteleComfort"]],
    text: `The stele you settle on turns out to be unexpectedly comforting — a guardian centuries dead, describing the watch not as suffering but as purpose, plainly and without self-pity. It helps, more than you expected, to read that this was survivable, even meaningful, for someone else first.`,
    choices: [{ label: "Back to the Whispering Steles", to: 195 }],
  },

  197: {
    room: "steles",
    effects: [["stat", "sanity", -1]],
    text: `The stele you settle on is considerably less comforting — a guardian whose entry ends mid-sentence, the final lines carved in a noticeably less steady hand than the ones before it. Not every account here has a peaceful ending. You knew that already. You didn't need it quite this specific.`,
    choices: [{ label: "Back to the Whispering Steles", to: 195 }],
  },

  198: {
    room: "steles",
    effects: [["stat", "sanity", -1], ["flag", "knowHerStele"]],
    text: `Hemet-Nebtawy's own stele stands apart from the others, its entry updated repeatedly over the centuries in the same hand, each addition shorter and more tired than the last, the most recent one dated to considerably before your team ever arrived: "Still holding. Still hoping someone reads the footnotes."`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  199: {
    room: "steles",
    effects: [["stat", "sanity", -1]],
    text: `Further back among the stones, footnotes to footnotes: smaller inscriptions, clearly added by visitors rather than guardians, spanning what must be centuries of quiet, unofficial pilgrimage. People have found their way this deep before. Most of them, it seems, simply left a mark and went home.`,
    choices: [{ label: "Back to the Whispering Steles", to: 195 }],
  },

  // ---- Reflecting Basin ----

  200: {
    room: "reflectingbasin",
    text: `A shallow basin of still water, undisturbed by any current, angled to catch light from a source you can't identify anywhere in the chamber. Its surface, when you finally look, doesn't quite show your own reflection.`,
    choices: [{ label: "Look into the basin", luck: { pass: 202, fail: 203 } }],
  },

  202: {
    room: "reflectingbasin",
    effects: [["flag", "knowBasin"], ["stat", "sanity", 1]],
    text: `The surface settles, eventually, into something that is your own reflection after all — just delayed, by a beat or two, like the basin needed a moment to decide you were worth showing accurately. It's oddly reassuring, being recognized correctly by something this old.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  203: {
    room: "reflectingbasin",
    effects: [["stat", "sanity", -1]],
    text: `The reflection that finally resolves isn't quite yours — close, but wearing an expression you don't remember making, at an angle you don't remember standing at. You step back from the basin and don't look into it again.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  // ---- The Rim of Isfet ----

  150: {
    room: "isfetrim",
    text: `The Rim is the closest this entire complex comes to admitting what it's actually for — a chamber where the wall itself simply stops being wall, replaced by an absence your eyes refuse to focus on, patient and enormous and, disturbingly, aware of your attention the instant you offer it.`,
    choices: [
      { label: "Reach toward the rim", luck: { pass: 152, fail: 153 } },
      { label: "Study it from a careful distance", to: 154 },
      { label: "Back to the Duat Gate", to: 112 },
    ],
  },

  152: {
    room: "isfetrim",
    effects: [["add", "isfetshard"], ["flag", "knowRim"], ["stat", "sanity", -2]],
    text: `Your fingers close on something that shouldn't be graspable at all, and a SHARD OF ISFET comes away into your palm — small, impossible, and undeniably, uncomfortably real. The rim doesn't object. If anything, it seems almost amused, the way something ancient might be amused by a child confidently picking up something much too heavy for them.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  153: {
    room: "isfetrim",
    effects: [["stat", "sanity", -2], ["stat", "health", -2]],
    text: `Your hand meets something that is emphatically not there to be touched, and the recoil costs you — not violence exactly, more a correction, firm and entirely impersonal, the way you'd flinch back a child's hand from a stove without particularly meaning them harm.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  154: {
    room: "isfetrim",
    effects: [["stat", "sanity", -1], ["flag", "knowRimCareful"]],
    text: `Studied rather than touched, the rim resolves — slightly, unwillingly — into something almost like a face, or the memory of the shape a face might make. You do not think it is hostile. You are increasingly unsure "hostile" is a concept that applies to it at all, any more than it applies to weather, or to gravity, or to the specific patient shape of an ending whose time simply hasn't come yet.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  // ---- Ambient: the gate's breathing ----

  190: {
    room: "duatgate",
    text: `You stop moving and let the space around you do whatever it does when no one's actively asking anything of it. There's a rhythm here too, slower even than the Choir-adjacent pulse other expeditions have reported from other kinds of thresholds — this one closer to a very long, very patient exhale.`,
    choices: [{ label: "Try to match it", luck: { pass: 192, fail: 193 } }],
  },

  192: {
    room: "duatgate",
    effects: [["flag", "knowGateRhythm"], ["stat", "sanity", 1]],
    text: `You match it, more or less, and for a handful of seconds you understand — bodily, not intellectually — why someone might volunteer for three thousand years of exactly this. There is something almost restful about a task with no ambiguity left in it at all.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  193: {
    room: "duatgate",
    effects: [["stat", "sanity", -1]],
    text: `You can't quite find the rhythm, and the attempt leaves you slightly disoriented, aware of your own heartbeat in a way that feels, briefly, like an intrusion into a much larger and much older room.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  // ---- Readiness gate ----

  160: {
    room: "duatgate",
    effects: [["flag", "readyForWeighing"]],
    text: `You've seen enough of what lies beneath the tomb to stop feeling like a trespasser in someone else's three-thousand-year job and start feeling like someone qualified, at minimum, to have an informed opinion about it.

Whatever you decide at the Final Weighing, you'll decide it having actually read the footnotes.`,
    choices: [{ label: "Back to the Duat Gate", to: 112 }],
  },

  // ============ THE FINAL WEIGHING (climax) ============

  170: {
    room: "finalweighing",
    text: `Beyond the gap the air was reluctant to approach, the passage opens on a chamber that makes the Hall of Scales look like a rehearsal space — one final balance, vast, ancient, and — for the first time since you arrived — not quite level.

Hemet-Nebtawy stands beside it, and beside her, patient and enormous and entirely without malice, the shape the Rim only ever let you glimpse sideways.

"You came prepared," she says. "That is rarer than you'd think. Now. Tell me what you've decided, epigrapher."`,
    choices: [
      { label: "Take up the watch, permanently, as you already offered", needFlag: "tookWatch", to: 172 },
      { label: "Reveal her true name and full story to the world", needFlag: "proposedTelling", needItem: "predecessorscroll", to: 174 },
      { label: "Complete the True Seal", needItem: "trueseal", to: 176 },
      { label: "Propose a formal Accord with Isfet itself", needItem: "accordtoken", to: 178 },
      { label: "Shatter the cycle with the Shard of Isfet", needItem: "isfetshard", to: 180 },
      { label: "Walk away. Leave everything exactly as it was", to: 182 },
    ],
  },

  172: {
    room: "finalweighing",
    effects: [["stat", "sanity", -2]],
    text: `You step onto the balance and the weight transfers the way it did in the sanctum, except final this time, complete, no longer a promise but an actual exchange. Hemet-Nebtawy steps off her own three-thousand-year post with the specific, careful relief of someone who has genuinely, finally, been believed.

"Read the footnotes," she says, one last time, "for whoever comes after you. There will be a whoever. There always is."`,
    choices: [{ label: "One year later...", to: 173 }],
  },

  173: {
    room: "finalweighing",
    type: "act-end",
    text: `EPILOGUE — THE NEW GUARDIAN

You do not return topside in any sense your former colleagues would recognize as retirement. You are, technically, still on the expedition's payroll, filed as "extended fieldwork, indefinite," which is either the most honest or the least honest line item in the Directorate's history, depending on the week.

The scale stays level. You've stopped needing to think about how.`,
  },

  174: {
    room: "finalweighing",
    effects: [["stat", "sanity", -1]],
    text: `You lay out the full case, methodically, the way you'd defend any contested attribution to a skeptical review board — her name, her scroll, her three thousand years of unglamorous, uncredited labor, spoken plainly into a chamber built to hold silence rather than testimony.

Hemet-Nebtawy listens to her own biography read back to her by a stranger, and something in her bearing that has been braced for three millennia finally, visibly, uncoils.`,
    choices: [{ label: "One year later...", to: 175 }],
  },

  175: {
    room: "finalweighing",
    type: "act-end",
    text: `EPILOGUE — THE NAME RESTORED

The paper takes eleven months to clear peer review and considerably longer to reach anyone outside the field, but it clears, and her name — her actual name, not "She Who Is Not Named" — enters the historical record for the first time in three thousand years, attributed, cited, real.

She is still, as far as you know, exactly where you left her. Being remembered correctly, it turns out, was never quite the same thing as being relieved. But she asked for it anyway, and meant it, and that has to count for something.`,
  },

  176: {
    room: "finalweighing",
    effects: [["stat", "sanity", -1]],
    text: `You complete the True Seal exactly as the library's careful instructions describe — not a shortcut, not a trick, simply the finished version of the working Hemet-Nebtawy has spent three thousand years holding open by continuous, unfinished effort. The balance settles, genuinely, permanently level, without needing anyone standing on it at all.

She watches her own reflection in stone that no longer requires her personal attention, and looks, for the first time, like someone allowed to simply be dead.`,
    choices: [{ label: "One year later...", to: 177 }],
  },

  177: {
    room: "finalweighing",
    type: "act-end",
    text: `EPILOGUE — A CLEAN CLOSE

The tomb is resealed, catalogued, and — per an agreement you personally insisted on with the Directorate — left substantially unexcavated, its true chambers a footnote rather than a museum wing. Some doors, you've decided, are better documented than opened.

You still dream about the scale sometimes. In every dream, it's level. You've stopped minding.`,
  },

  178: {
    room: "finalweighing",
    effects: [["stat", "sanity", -1]],
    text: `You set the Token of Accord on the balance instead of yourself, and address the shape beside Hemet-Nebtawy directly, the way you'd open any negotiation you actually intended to honor: terms, not demands. Time, not victory. A watch that ends by mutual agreement rather than by one side's exhaustion.

The shape considers this for a silence that feels considerably longer than it probably was. Then, somehow, it agrees.`,
    choices: [{ label: "One year later...", to: 179 }],
  },

  179: {
    room: "finalweighing",
    type: "act-end",
    text: `EPILOGUE — THE ACCORD

Nobody in your field will ever be able to publish what actually happened in that chamber, but the practical result is measurable enough: Hemet-Nebtawy rotates duty now, a formal arrangement, sharing the watch with volunteers found through channels you were only partially briefed on.

You are, occasionally, one of them. It is, against every reasonable expectation, some of the most peaceful work you've ever done.`,
  },

  180: {
    room: "finalweighing",
    effects: [["stat", "sanity", -2]],
    text: `You set the shard against the balance's fulcrum and press, and the entire chamber responds at once — not violence, but a vast, structural reordering, three thousand years of careful containment architecture reconsidering its own necessity in real time. Hemet-Nebtawy doesn't stop you. She looks, if anything, like someone watching a gamble she stopped believing was possible.

The scale doesn't break. It simply, finally, finishes tipping — all the way, deliberately, to a resolution nobody in this chamber's very long history ever actually tried.`,
    choices: [{ label: "One year later...", to: 181 }],
  },

  181: {
    room: "finalweighing",
    type: "act-end",
    text: `EPILOGUE — THE BROKEN CYCLE

What you did in that chamber doesn't match any category your field has a name for, and you've given up trying to write the paper. The tomb reads, on every instrument since, as simply, finally, empty — no guardian, no absence pressed up against a rim, no watch left to keep.

Whether that's a victory or simply a different, quieter kind of unfinished business, you genuinely don't know yet. You suspect you'll know in about three thousand years.`,
  },

  182: {
    room: "finalweighing",
    text: `You decide, in the end, not to decide — not out of cowardice, you tell yourself, but out of the same caution the sarcophagus inscription demanded of everyone who came before you. Some offers shouldn't be accepted in the heat of the one conversation you've ever had about them.

Hemet-Nebtawy doesn't argue. "Wise," she says again, the same word from the sanctum, meant, you think, exactly as sincerely the second time.`,
    choices: [{ label: "One year later...", to: 183 }],
  },

  183: {
    room: "finalweighing",
    type: "act-end",
    text: `EPILOGUE — LEFT AS FOUND

The expedition is quietly wound down, the tomb resealed under a classification your Directorate contact won't fully explain, your team reassigned to postings considerably less interesting than this one. You write the version of the report that's true and useless in equal measure.

You think about going back sometimes. You haven't yet. You suspect, when you finally do, she'll still be exactly where you left her, patient as ever, waiting for someone else who reads the footnotes.`,
  },

  // ============ DEATHS ============

  90: {
    room: null,
    type: "death",
    text: `The tomb doesn't need to be hostile to be fatal — three thousand years of settled stone and thin air do the work well enough on their own. You go still in a chamber that has, by now, had a great deal of practice keeping things exactly as they fell.

YOUR ACCOUNT ENDS HERE.`,
  },

  92: {
    room: null,
    type: "death",
    text: `The sealed air finally runs out somewhere between one chamber and the next, and the last thing you register is how patient the dark is about it — no rush, no violence, just an absence, closing in exactly the way the mural described one.

YOUR ACCOUNT ENDS HERE.`,
  },

  94: {
    room: null,
    type: "death",
    text: `Somewhere in the tomb's repeating inscriptions, you stop being able to tell your own thoughts from the ones carved into the walls a hundred generations before you were born. You sit down against warm stone that should not be warm, and find, distantly, that you don't mind staying.

YOUR ACCOUNT ENDS HERE.`,
  },

};
