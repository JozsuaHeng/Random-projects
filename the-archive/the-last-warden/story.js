// THE LAST WARDEN — story data. Act One draft.
// Page numbers are deliberately scattered, like the old paperbacks.

// 16x16 portrait: Ser Ashford — a steel great helm, narrow eye-slits and
// a T-shaped breathing grille (not one wide band — that reads as an
// alien's eyes, not a knight's visor), warden-blue cloak at the shoulders.
const PLAYER_PORTRAIT = [
  "................",
  "......kkkk......",
  "....kkkkkkkk....",
  "...kssssssssk...",
  "..kssksssskssk..",
  "...kssssssssk...",
  "...kssksskssk...",
  "....kssssssk....",
  ".....kddddk.....",
  "....kbbbbbbk....",
  "...kbbbbbbbbk...",
  "..kbbbbbbbbbbk..",
  ".kbbbbbbbbbbbbk.",
  "kbbbbbbbbbbbbbbk",
  "kbb..mm..mm..bbk",
  ".kkkkkkkkkkkkkk.",
];

const META = {
  title: "THE LAST WARDEN",
  subtitle: "An Interactive Gamebook — Acts One & Two",
  startPage: 1,
  backdrop: "parchmentmap",
  player: {
    name: "Ser B. Ashford",
    role: "Hedge Knight, Oathless",
    bio: "Stripped of your last lord's colors two winters back for a debt of honor you'd make good again tomorrow. Ash Hollow's reeve is paying in silver AND a word to the crown — enough to matter — if you'll walk into the Warden's Keep and find out why it went silent forty years ago.",
  },
  stats: { health: 10, oxygen: 10, sanity: 10 },
  deathPages: { health: 90, oxygen: 92, sanity: 94 },
};

const ITEMS = {
  shortsword:  { name: "Arming Sword",     desc: "Plain steel. Honest work.", slot: "held" },
  silverblade: { name: "Warden's Silver",  desc: "Old steel, warden-forged. The only blade that seems to bother them.", slot: "held" },
  woodtorch:   { name: "Pitch Torch",      desc: "Burns low but steady. The dark down here is not the ordinary kind.", slot: "held" },
  chainmail:   { name: "Chainmail Hauberk",desc: "Warden-issue mail, dusty but sound.", slot: "body" },
  greathelm:   { name: "Great Helm",       desc: "Dented once, badly, and someone walked away from it anyway.", slot: "head" },
  gauntlets:   { name: "Steel Gauntlets",  desc: "Warden-issue. Fits better than your own did.", slot: "hands" },
  warboots:    { name: "Warden's Boots",   desc: "Quiet soles. Someone knew this keep had ears.", slot: "feet" },
  wardencloak: { name: "Warden's Cloak",   desc: "Blue gone grey with dust, the sigil still visible if you tilt it to the light.", slot: "back" },
  shield:      { name: "Kite Shield",      desc: "Warden crest, dented but whole. Good for turning a blow you didn't see coming." },
  bread:       { name: "Hard Bread",       desc: "Forty years stale, somehow. USE: +2 health, +1 sanity.", use: { health: 2, sanity: 1 } },
  draught:     { name: "Healing Draught",  desc: "Red, bitter, effective. USE: +4 health.", use: { health: 4 } },
  holywater:   { name: "Vial of Holy Water", desc: "Chapel-blessed. USE: +3 sanity.", use: { sanity: 3 } },
  bandage:     { name: "Clean Bandage",    desc: "Simple linen wrap. USE: +2 health.", use: { health: 2 } },
  relic:       { name: "Warden's Token",   desc: "A small brass sun, warm to the touch. +1 on luck tests.", luckBonus: true },
  ironkey:     { name: "Iron Cell Key",    desc: "Heavy, cold, unmistakably a key to somewhere you're not meant to go." },
  wardenseal:  { name: "The Warden's Seal",desc: "Dame Vayne's own seal of office. It wants to go back where it came from." },
  warhorn:     { name: "Warden's Horn",    desc: "A single clean note, once, was how the Order called parley." },
  kingsbane:   { name: "Kingsbane",        desc: "An older blade than Warden's Silver, forged for exactly one purpose. Heavy in a way that has nothing to do with weight.", slot: "held" },
  phoenixdraught: { name: "Phoenix Draught", desc: "Reliquary-grade, older and stronger than any chapel vial. USE: +6 health.", use: { health: 6 } },
  boneward:    { name: "Boneward Charm",   desc: "Carved from a warden's own finger bone, centuries past. +1 on luck tests.", luckBonus: true },
};

const ROOMS = {
  gatehouse: { name: "Gatehouse",     col: 0, row: 0, icon: "⛩" },
  courtyard: { name: "Courtyard",     col: 1, row: 0, icon: "☘" },
  greathall: { name: "Great Hall",    col: 2, row: 0, icon: "⚔" },
  chapel:    { name: "Chapel",        col: 3, row: 0, icon: "✝" },
  barracks:  { name: "Barracks",      col: 0, row: 1, icon: "⛨" },
  armory:    { name: "Armory",        col: 1, row: 1, icon: "⛨" },
  kitchens:  { name: "Kitchens",      col: 2, row: 1, icon: "☗" },
  library:   { name: "Library",       col: 3, row: 1, icon: "❖" },
  crypt:     { name: "Crypt",         col: 0, row: 2, icon: "☠" },
  cells:     { name: "Cells",         col: 1, row: 2, icon: "⛓" },
  vault:     { name: "Vault Stair",   col: 2, row: 2, icon: "◇" },
  sanctum:   { name: "The Sanctum",   col: 3, row: 2, icon: "✡" },
  // Act Two — beneath the seal
  hollow:      { name: "The Hollow",       col: 0, row: 3, icon: "●" },
  reliquary:   { name: "Reliquary",        col: 1, row: 3, icon: "♦" },
  bonefields:  { name: "Bonefields",       col: 2, row: 3, icon: "☠" },
  chainedhall: { name: "Chained Hall",     col: 3, row: 3, icon: "⛓" },
  throat:      { name: "The Throat",       col: 0, row: 4, icon: "▲" },
  throne:      { name: "The Unmade Throne", col: 1, row: 4, icon: "♚" },
};

const PAGES = {

  // ============ GATEHOUSE ============

  1: {
    room: "gatehouse",
    effects: [["add", "shortsword"]],
    text: `The Warden's Keep has stood empty on Ash Hollow's hill for forty years, and the village still pays a tithe to a garrison that stopped answering letters two generations ago. You're here to find out why, or to at least bring back proof that no one's left to ask.

The gatehouse portcullis is rusted half-open, just wide enough for one armed fool to duck under. Your own sword is at your hip, at least — small comfort against forty years of silence.

A fallen banner, warden-blue, lies half-buried in drifted leaves by the gate.`,
    choices: [
      { label: "Examine the fallen banner", to: 3 },
      { label: "Search the guardroom", to: 4 },
      { label: "Push on into the courtyard", to: 6 },
    ],
  },

  3: {
    room: "gatehouse",
    effects: [["stat", "sanity", -1]],
    text: `You lift the banner and the cloth comes apart in your hands, rotten through. Underneath, someone scratched a message into the stone lintel, the letters gone shallow with weathering:

"THE WATCH DOES NOT END. IT ONLY CHANGES HANDS."

Not a warning. A job description. You don't find that especially comforting.`,
    choices: [
      { label: "Search the guardroom", to: 4 },
      { label: "Push on into the courtyard", to: 6 },
    ],
  },

  4: {
    room: "gatehouse",
    effects: [["add", "woodtorch"]],
    text: `The guardroom is bare but for a duty roster nailed to the wall, its ink long faded, and a bundle of pitch torches still dry in an oilcloth wrap. You take one — the deeper halls will not be kind to the eyes.

The roster's last entry, forty years old, isn't a name. It's a single tally mark, and beneath it, in a different, shakier hand: "SHE SAID NOT TO WRITE ANY MORE."`,
    choices: [{ label: "Push on into the courtyard", to: 6 }],
  },

  // ============ COURTYARD (hub) ============

  6: {
    room: "courtyard",
    text: `The courtyard is open to the sky, choked with forty years of bramble, ringed by the keep's four wings. A statue of the Order's first Commander stands center, weather-worn, sword still raised.

An old well sits capped near the barracks door. Passages lead to the Great Hall ahead, the Chapel to your right, the Barracks to your left.`,
    choices: [
      { label: "Examine the statue", to: 5 },
      { label: "Search the old well", to: 10 },
      { label: "Wait and watch the courtyard a moment", to: 45 },
      { label: "Great Hall", to: 8 },
      { label: "Chapel", to: 19 },
      { label: "Barracks", to: 28 },
    ],
  },

  5: {
    room: "courtyard",
    effects: [["flag", "knowOrder"]],
    text: `The plaque at the statue's base is still legible: "TO WATCH IS TO SUFFER GLADLY, THAT OTHERS NEED NOT SUFFER AT ALL." Beneath it, a list of names, six columns deep, going back three centuries.

The list simply stops. No final entry, no explanation. Whatever ended the Order didn't think it owed the stone an ending.`,
    choices: [{ label: "Back to the courtyard", to: 6 }],
  },

  10: {
    room: "courtyard",
    text: `You haul the well's cap aside. The shaft drops into blackness, and the air coming up smells of cold stone and older water. Something metallic glints on the first ledge, just within reach if you're willing to lean in.`,
    choices: [{ label: "Reach for it", luck: { pass: 12, fail: 13 } }],
  },

  12: {
    room: "courtyard",
    effects: [["add", "bandage"]],
    text: `Your fingers close on a dropped supply satchel, decades waterlogged but its contents oilcloth-wrapped and dry: a clean bandage, still usable. You straighten up before your balance reconsiders the favor.`,
    choices: [{ label: "Back to the courtyard", to: 6 }],
  },

  13: {
    room: "courtyard",
    effects: [["stat", "health", -1]],
    text: `Your boot skids on wet stone and you catch yourself hard against the well's lip, more startled than hurt. Somewhere below, the splash of a dropped pebble takes far too long to land.

You decide the well has told you everything it's going to.`,
    choices: [{ label: "Back to the courtyard", to: 6 }],
  },

  45: {
    room: "courtyard",
    text: `You go still against the gatehouse wall and wait.

A shape crosses the far end of the courtyard on a slow, unhurried patrol — warden-blue cloak, armor plate, a gait that hasn't been alive in a long time. It doesn't look your way. It doesn't need to hurry. It has had forty years of nights to walk this circuit.`,
    choices: [{ label: "Hold perfectly still", luck: { pass: 47, fail: 49 } }],
  },

  47: {
    room: "courtyard",
    effects: [["flag", "knowPatrol"]],
    text: `It passes without turning its head, cloak dragging soundlessly over stone. You catalogue its route out of old habit — you'll know which halls it favors, and when. Small knowledge. Might be the difference between quiet and not.`,
    choices: [{ label: "Back to the courtyard", to: 6 }],
  },

  49: {
    room: "courtyard",
    effects: [["stat", "health", -2], ["stat", "sanity", -1]],
    text: `It stops mid-stride. Turns its head the way a door turns on a hinge, slow and complete. You're moving before it finishes turning, and it doesn't chase — it simply resumes its circuit, unbothered, as if you were never worth the detour.

You don't feel lucky. You feel catalogued.`,
    choices: [{ label: "Back to the courtyard", to: 6 }],
  },

  // ============ GREAT HALL ============

  8: {
    room: "greathall",
    text: `The Great Hall's rafters have half-collapsed, moonlight coming through in long dusty columns. Long tables lie overturned. Doorways lead to the Armory, the Kitchens, and the Library. A stair in the corner spirals down into dark — the cellars.`,
    choices: [
      { label: "Search the hall itself", to: 9 },
      { label: "Armory", to: 14 },
      { label: "Kitchens", to: 16 },
      { label: "Library", to: 18 },
      { label: "Descend the cellar stair", to: 50 },
      { label: "Back to the courtyard", to: 6 },
    ],
  },

  9: {
    room: "greathall",
    text: `A rusted chandelier hangs by one remaining chain overhead, groaning faintly with every draft. Something valuable glints beneath the nearest overturned table — worth the risk of standing under that thing a moment longer.`,
    choices: [{ label: "Reach for it", luck: { pass: 15, fail: 17 } }],
  },

  15: {
    room: "greathall",
    effects: [["add", "bandage"]],
    text: `You snatch a fallen supply kit — another bandage, still sealed — and step clear just as the chandelier's chain groans louder. You don't wait to see if that was a coincidence.`,
    choices: [{ label: "Back to the hall", to: 8 }],
  },

  17: {
    room: "greathall",
    effects: [["stat", "health", -2]],
    text: `The chain gives with a shriek of old iron and you throw yourself clear, mostly. A rafter beam catches your shoulder on the way down, hard enough to see stars.

The chandelier lies in ruin exactly where you were standing.`,
    choices: [{ label: "Back to the hall", to: 8 }],
  },

  // ============ ARMORY ============

  14: {
    room: "armory",
    text: `Racks of warden-issue gear line the armory walls, mail and plate gone dull with dust but largely intact — the Order clearly didn't lose this place to looters. A locked weapon rack sits apart from the rest, its mechanism rusted stiff.`,
    choices: [
      { label: "Take the mail, helm, and shield", to: 20 },
      { label: "Force the locked weapon rack", to: 21 },
      { label: "Back to the hall", to: 8 },
    ],
  },

  20: {
    room: "armory",
    effects: [["add", "chainmail"], ["add", "greathelm"], ["add", "shield"]],
    text: `The mail fits like it was cut for someone your exact size, which is either a comfort or the least comforting thing that's happened all day. You'll decide later.`,
    choices: [{ label: "Back to the hall", to: 8 }],
  },

  21: {
    room: "armory",
    text: `You put your shoulder into the rusted lock. It's going to give, one way or another — the question is whether it does that cleanly.`,
    choices: [{ label: "Force it", luck: { pass: 23, fail: 25 } }],
  },

  23: {
    room: "armory",
    effects: [["add", "gauntlets"]],
    text: `The lock snaps clean. Inside: a pair of steel gauntlets, warden-issue, and — tucked behind them, deliberately hidden — a small brass token shaped like a sun. You pocket both.`,
    choices: [{ label: "Back to the hall", to: 8 }],
  },

  25: {
    room: "armory",
    effects: [["stat", "health", -2], ["add", "gauntlets"]],
    text: `The rack tears open violently, throwing rusted metal in every direction — one edge catches your forearm before you can pull back. You get the gauntlets. You also get a fresh cut to remember it by.`,
    choices: [{ label: "Back to the hall", to: 8 }],
  },

  // ============ KITCHENS ============

  16: {
    room: "kitchens",
    text: `The kitchens are cold and dry, cookware still hung in neat rows like the last cook expected to be back by supper. A pantry door stands slightly ajar. A well-worn table bears forty years of knife-scars in one exact spot.`,
    choices: [
      { label: "Search the pantry", to: 24 },
      { label: "Examine the worn table", to: 26 },
      { label: "Back to the hall", to: 8 },
    ],
  },

  24: {
    room: "kitchens",
    effects: [["add", "bread"], ["add", "draught"]],
    text: `Warden rations don't spoil easily, it turns out — sealed hard bread and a corked healing draught, both still good. Whoever stocked this pantry meant for the Order to outlast a siege. It just wasn't the siege they got.`,
    choices: [{ label: "Back to the kitchens", to: 16 }],
  },

  26: {
    room: "kitchens",
    effects: [["stat", "sanity", -1], ["flag", "knowRations"]],
    text: `The scars aren't cutting marks. They're tally marks, hundreds of them, cut by the same hand at the same spot over years — someone standing at this table counting something, every single day, for a very long time.

You don't finish counting them yourself.`,
    choices: [{ label: "Back to the hall", to: 8 }],
  },

  // ============ LIBRARY ============

  18: {
    room: "library",
    text: `The library's shelves have mostly collapsed, but a reading table near the cold hearth is still set with an open book, as if someone stepped away mid-sentence forty years ago and never came back to finish it.`,
    choices: [
      { label: "Read the Order's histories", to: 27 },
      { label: "Search the fallen shelves for anything useful", to: 29 },
      { label: "Back to the hall", to: 8 },
    ],
  },

  27: {
    room: "library",
    effects: [["flag", "knowOrigin"], ["stat", "sanity", -1]],
    text: `The open book is the Order's true founding charter, not the polite version carved on the courtyard statue. The Wardens were never guarding treasure. Three centuries ago, something was bound beneath this keep — a king who wouldn't stay dead, sealed by an oath sworn in blood and renewed generation after generation.

The last entry, in a hand you'll come to recognize: "Our numbers are too few to renew the oath properly. I will not let it lapse on my watch. There is another way."`,
    choices: [{ label: "Back to the library", to: 18 }],
  },

  29: {
    room: "library",
    text: `Behind a collapsed shelf you find a satchel someone packed in a hurry and never retrieved — a spare cloak, badly patched, and nothing else of note. Dust, mostly. Old dust.`,
    choices: [{ label: "Back to the hall", to: 8 }],
  },

  // ============ CHAPEL ============

  19: {
    room: "chapel",
    text: `The chapel is small and startlingly intact, stained glass still holding despite everything. An altar stands at the far end; the wall behind it bears a long inscription in the Order's formal script.`,
    choices: [
      { label: "Examine the altar", to: 30 },
      { label: "Read the Oath inscription", to: 32 },
      { label: "Back to the courtyard", to: 6 },
    ],
  },

  30: {
    room: "chapel",
    effects: [["add", "holywater"]],
    text: `A single vial of holy water sits undisturbed on the altar, sealed with warden-blue wax that never cracked. Whoever last stood here left it as an offering, or a warning, or simply forgot to take it. You take it now.`,
    choices: [{ label: "Back to the chapel", to: 19 }],
  },

  32: {
    room: "chapel",
    effects: [["flag", "knowOath"]],
    text: `The Oath is carved deep, meant to outlast the Order that swore it:

"I STAND BETWEEN. I DO NOT SLEEP. I DO NOT ASK WHY. I ONLY ASK WHERE."

Simple words. You find yourself murmuring them once, testing the shape, and immediately wish you hadn't — the chapel's silence seems to lean in, listening, like it noticed.`,
    choices: [{ label: "Back to the chapel", to: 19 }],
  },

  // ============ BARRACKS ============

  28: {
    room: "barracks",
    text: `Rows of narrow bunks fill the barracks, most still made with military precision. A single desk near the door is cluttered with the only mess in the room — someone was packing in a hurry, once.`,
    choices: [
      { label: "Search the bunks", to: 33 },
      { label: "Check the desk and diary", to: 35 },
      { label: "Back to the courtyard", to: 6 },
    ],
  },

  33: {
    room: "barracks",
    effects: [["add", "warboots"], ["add", "wardencloak"]],
    text: `One footlocker yields a pair of warden's boots and a folded cloak, both untouched by forty years of dust — sealed inside cedar, deliberately preserved. Someone meant these for a successor. You suppose that's you now.`,
    choices: [{ label: "Back to the barracks", to: 28 }],
  },

  35: {
    room: "barracks",
    effects: [["add", "ironkey"], ["flag", "knowDiary"], ["stat", "sanity", -1]],
    text: `The diary belongs to a recruit named Petra, barely into her training when the entries stop. The last legible page: "Commander Vayne sent the rest of us away tonight. Wouldn't say why. I came back for my kit and I can hear singing from the cellar stair. I don't think it's one voice."

An iron key is tucked into the diary's spine, marked CELLS in careful lettering.`,
    choices: [{ label: "Someone's coming", to: 37 }],
  },

  37: {
    room: "barracks",
    text: `A warden sentinel fills the doorway, drawn by the sound of the footlocker, or by something older than sound. It doesn't announce itself. It simply draws its blade.`,
    choices: [
      { label: "Stand and fight, armored and ready", needEquipAll: ["chainmail", "greathelm"], to: 39 },
      { label: "Fight it with steel", needItem: "shortsword", luck: { pass: 39, fail: 41 } },
      { label: "Duck behind the bunks and wait it out", to: 43 },
    ],
  },

  39: {
    room: "barracks",
    effects: [["stat", "sanity", -1]],
    text: `Steel rings on steel, once, twice — and the sentinel breaks off the attack as suddenly as it began, stepping back into the corridor shadow like a soldier called off post by a whistle you didn't hear. It doesn't flee. It simply has somewhere else, apparently, to be.

Your hands are shaking. You let them.`,
    choices: [{ label: "Back to the courtyard", to: 6 }],
  },

  41: {
    room: "barracks",
    effects: [["stat", "health", -3]],
    text: `It's faster than the rust on its joints has any right to allow. A blow catches your side before you get clear through the far door, and you don't stop moving until the barracks is well behind you.`,
    choices: [{ label: "Back to the courtyard", to: 6 }],
  },

  43: {
    room: "barracks",
    effects: [["stat", "sanity", -2]],
    text: `You go still between two bunks and hold your breath. The sentinel crosses the room slowly, close enough that you could count the tarnish on its cloak-pin, and passes without turning its head — the same unhurried patrol as the one in the courtyard.

It isn't hunting. It's simply making its rounds. That's somehow worse.`,
    choices: [{ label: "Back to the courtyard", to: 6 }],
  },

  // ============ CELLAR / CRYPT / CELLS / VAULT ============

  50: {
    room: "vault",
    text: `The cellar stair ends in a low stone antechamber, colder than the halls above by a wide margin. Two passages lead onward: one marked CRYPT in old paint, the other a barred door marked CELLS. A third way, ahead, descends further still toward something the map on the wall simply labels THE VAULT.`,
    choices: [
      { label: "Search the antechamber", to: 51 },
      { label: "Crypt", to: 52 },
      { label: "Cells", to: 54, needItem: "ironkey" },
      { label: "Back up to the Great Hall", to: 8 },
    ],
  },

  51: {
    room: "vault",
    effects: [["add", "bandage"]],
    text: `A supply cache, wedged behind a loose stone, holds one more sealed bandage and nothing else. Someone down here was still thinking practically, right up until they weren't.`,
    choices: [{ label: "Back to the antechamber", to: 50 }],
  },

  52: {
    room: "crypt",
    text: `The crypt stair spirals down into absolute dark, the kind that makes torchlight feel like a small, defiant argument.`,
    choices: [
      { label: "Hold the torch high", needItem: "woodtorch", to: 56 },
      { label: "Feel your way through blind", luck: { pass: 56, fail: 58 } },
    ],
  },

  58: {
    room: "crypt",
    effects: [["stat", "health", -2], ["stat", "sanity", -1]],
    text: `You misjudge a step in the dark and take the last stretch of stairs the hard way, cracking a shin and biting back a shout that would have echoed for a very long time. You make it down all the same, wounded and quieter than you'd have liked.`,
    choices: [{ label: "Continue into the crypt", to: 56 }],
  },

  56: {
    room: "crypt",
    effects: [["add", "silverblade"], ["flag", "knowSacrifice"], ["stat", "sanity", -1]],
    text: `Rows of tombs line the crypt, each bearing a warden's name and dates — until the final row, where thirty-one tombs share a single date. Thirty-one Wardens, entombed the same day the Order's roster stopped being written.

Above them, mounted on the wall, a sword of pale, cold steel: WARDEN'S SILVER — TAKE UP THE WATCH, the plaque reads, in Commander Vayne's own hand.

A side alcove holds one tomb apart from the rest, unmarked, its lid slightly ajar.`,
    choices: [
      { label: "Search the unmarked alcove", to: 57 },
      { label: "Cells", to: 54, needItem: "ironkey" },
      { label: "Vault Stair", to: 60 },
      { label: "Back to the antechamber", to: 50 },
    ],
  },

  57: {
    room: "crypt",
    effects: [["add", "warhorn"], ["stat", "sanity", -1]],
    text: `The unmarked tomb is empty. Whoever it was built for never occupied it. Resting where a body should be: a warden's signal horn, tarnished but whole, and a folded note that simply reads, "IN CASE SOMEONE COMES LOOKING FOR ME AND MEANS WELL."

You take the horn. You try not to think too hard about who left that note, or for whom.`,
    choices: [{ label: "Back to the crypt", to: 56 }],
  },

  54: {
    room: "cells",
    effects: [["add", "wardenseal"], ["flag", "knowTruth"], ["stat", "sanity", -2]],
    text: `The cells are empty but one — the last, its door still locked from outside, a skeleton in warden colors slumped against the bars. Recruit Petra, by the ring on her finger, matching the diary upstairs. She didn't die trying to escape. She died guarding something, from the inside, on purpose.

Clutched in what's left of her hand: the Warden's Seal itself, Dame Vayne's own mark of office. Someone gave it to a barely-trained recruit to keep safe, rather than trust it to whoever came down those stairs after her.

You take it gently. It feels like the heaviest thing you've carried today.`,
    choices: [
      { label: "Vault Stair", to: 60 },
      { label: "Back to the antechamber", to: 50 },
    ],
  },

  // ============ THE SANCTUM ============

  60: {
    room: "sanctum",
    text: `The passage narrows and drops toward a final stair, cold air rising from below like breath. At its base: a door unlike any other in this keep, iron-banded, warden sigils worked into every inch of it, humming faintly in a way you feel in your teeth more than hear.

This is the Vault. Whatever the Order gave everything to hold shut is on the other side of that door.`,
    choices: [
      { label: "Steady your nerves with the holy water", needItem: "holywater", to: 63 },
      { label: "Enter the Sanctum", to: 65 },
      { label: "Back to the antechamber", to: 50 },
    ],
  },

  63: {
    room: "sanctum",
    effects: [["remove", "holywater"], ["stat", "sanity", 2]],
    text: `You break the wax seal and drink, and for one clean moment your head is entirely your own. Whatever's behind that door, you'll meet it as yourself, at least.`,
    choices: [{ label: "Enter the Sanctum", to: 65 }],
  },

  65: {
    room: "sanctum",
    text: `Beyond the door, the Sanctum: a round chamber built entirely around a second, smaller seal set into the floor, glowing faint and steady beneath a lattice of old wardstone. And waiting beside it, exactly where you somehow knew she'd be, a warden in captain's plate, cloak immaculate despite everything.

"You found your way further than most," says Dame Vayne — or what's left of wearing her name. "Good. It's time someone else decided what happens next."`,
    choices: [
      { label: "Sound the Warden's horn", needItem: "warhorn", to: 66 },
      { label: "Speak the Oath-words", needFlag: "knowOath", to: 70 },
      { label: "Press the Seal to the door, and open your vein", needItem: "wardenseal", to: 72 },
      { label: "Break the seal with warden-forged steel", needItem: "silverblade", to: 74 },
      { label: "Turn and run", to: 76 },
    ],
  },

  66: {
    room: "sanctum",
    effects: [["stat", "sanity", 1]],
    text: `The horn's single note fills the chamber, and something in Dame Vayne's bearing eases, just slightly — an old, formal courtesy, finally answered after forty years of silence.

"It has been a long watch," she says, quietly. "Whatever you choose now, I am glad it was someone who thought to ask, rather than simply take."`,
    choices: [{ label: "Now — choose.", to: 65 }],
  },

  70: {
    room: "sanctum",
    effects: [["flag", "oathBound"]],
    text: `You speak the words, and the chamber answers them the way stone answers a struck bell — a resonance that goes through you and doesn't entirely stop.

"I stand between," you say, and mean it more with every syllable. "I do not sleep. I do not ask why. I only ask where."

Dame Vayne's shoulders ease for the first time in forty years. "Then the watch changes hands," she says, "and I may finally rest." She does not explain what happens to you now. She doesn't have to. You already feel it beginning — a patience settling into your bones that has nothing to do with age.

— END OF ACT ONE —`,
    choices: [{ label: "Rise, and begin your watch", to: 2 }],
  },

  72: {
    room: "sanctum",
    effects: [["remove", "wardenseal"], ["flag", "properSeal"]],
    text: `You press the Seal to the door and draw your blade across your palm without letting yourself think about it further.

The wardstone drinks the offering greedily, hungrily, and the smaller seal in the floor brightens, then steadies, then holds — properly renewed, for the first time in forty years, by someone who chose it rather than had it forced upon them. Dame Vayne watches, and something in her posture might, if you squinted, be relief.

"Then it is done properly," she says. "The last Warden, and — perhaps, this time — not the last for long." Whether that's a comfort or a life sentence, you won't know until tomorrow.

— END OF ACT ONE —`,
    choices: [{ label: "Let the silence settle", to: 7 }],
  },

  74: {
    room: "sanctum",
    effects: [["flag", "sealBroken"], ["stat", "sanity", -1]],
    text: `Warden's Silver bites into the seal exactly where the plaque promised it would, and the wardstone lattice shatters like struck glass, all at once, all around the chamber.

Dame Vayne doesn't move to stop you. She simply watches, expression unreadable, as the smaller seal in the floor dims — not extinguished, but weakened, badly, for the first time in three centuries. Something far below shifts in its sleep, and you feel the whole keep answer the movement, stone groaning in every wall at once.

"That," Dame Vayne says softly, "was not the choice I would have made for you."

— END OF ACT ONE —`,
    choices: [{ label: "See what you've done", to: 11 }],
  },

  76: {
    room: "sanctum",
    effects: [["flag", "fled"]],
    text: `You turn and run, and Dame Vayne lets you — doesn't call out, doesn't give chase, simply watches you go the way you'd watch weather pass.

You take the stairs two at a time, then three, and don't stop until moonlight and open sky confirm you've actually left the keep behind. Somewhere below, faint through solid stone, a bell you never saw begins, very softly, to toll.

You don't go back down to ask what for.

— END OF ACT ONE —`,
    choices: [{ label: "Look back at the keep", to: 22 }],
  },

  // ============ ACT TWO — WHAT THE SEAL WOKE ============

  2: {
    room: "sanctum",
    text: `You do not sleep, precisely, but something like sleep takes you anyway — a long, patient stillness, standing at your post beside Dame Vayne while the chamber's light holds steady.

When your thoughts are entirely your own again, she is watching you with something like approval. "The ward held the night," she says. "That was the easy part. Something under this keep felt you take up the oath. It will want to meet its newest Warden properly."

Stone grinds somewhere below — a passage, opening.`,
    choices: [{ label: "Answer it", to: 31 }],
  },

  7: {
    room: "sanctum",
    text: `The chamber's hum settles into something almost peaceful, the wardstone lattice glowing steady blue-white for the first time in living memory. Dame Vayne allows herself to look, briefly, like someone who has finally set down a weight.

"It should hold for another three centuries," she says. "Should. I would feel better if you confirmed it — properly renewed wards have a way of stirring whatever they hold, if only to test the new lock."

Stone grinds somewhere below — a passage, opening.`,
    choices: [{ label: "Go and confirm it", to: 31 }],
  },

  11: {
    room: "sanctum",
    effects: [["stat", "health", -1]],
    text: `The chamber doesn't stop shuddering all the way through the night. You keep watch anyway, sword out, expecting the door to give at any moment. It doesn't — not yet. But something in the dark below is awake now, and testing the edges of what's left of the ward.

Dame Vayne finds you at first light, grim. "You broke it. You get to see what you broke."

Stone grinds somewhere below — a passage, opening on its own.`,
    choices: [{ label: "Go down and face it", to: 31 }],
  },

  22: {
    room: null,
    effects: [["stat", "sanity", -1]],
    text: `You make it as far as the village before the ground itself seems to exhale behind you, a low tremor that rattles Ash Hollow's shutters and sets every dog in the village barking at once.

The reeve pays you anyway, technically true to the letter of the contract. But you find you can't take the coin and simply walk away — not with that tremor still settling in your chest, not knowing what you left standing open behind you.

You go back up the hill at dawn.`,
    choices: [{ label: "Return to the Sanctum", to: 31 }],
  },

  31: {
    room: "sanctum",
    text: `Whatever choice you made, the keep itself has changed. The Sanctum's floor, once solid, now shows a hairline seam where none existed — a passage down, into ground that hasn't been walked since before the Order's founding.

Dame Vayne, or what's left of wearing her name, watches you approach it. "The Wardens sealed the door," she says. "We never had cause to go further down than that. You may be the first person in three centuries to see what we were actually guarding."`,
    choices: [{ label: "Descend into the Hollow", to: 34 }],
  },

  // ---- The Hollow (hub) ----

  34: {
    room: "hollow",
    text: `The Hollow is older stonework entirely — not warden-built, not human-built, by the look of the joinery. Passages lead to a Reliquary, a field of ancient bones, a hall of old chains, and a narrow throat of a tunnel leading further down still.

A trickle of water runs along one wall from somewhere far above — the courtyard well, you realize, draining down here after all these centuries.`,
    choices: [
      { label: "Reliquary", to: 36 },
      { label: "Bonefields", to: 38 },
      { label: "Chained Hall", to: 40 },
      { label: "Follow the trickling water", to: 44 },
      { label: "The Throat — press onward", to: 42 },
      { label: "Back up to the Sanctum", to: 31 },
    ],
  },

  44: {
    room: "hollow",
    effects: [["stat", "sanity", 1]],
    text: `You trace the water back to a narrow crack overhead, and it takes you a moment to place the faint echo carried down with it: someone, far above, dropping a pebble into the courtyard well, exactly the way you did on your first day here.

It's a strange comfort, hearing the ordinary world still going on directly above your head. You'll take what comfort's on offer down here.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  // ---- Reliquary ----

  36: {
    room: "reliquary",
    text: `The Reliquary holds what the Order considered too dangerous to issue and too important to destroy. A blade rests alone on a stone plinth, unlike anything upstairs — older, heavier, purposeful. Sealed vaults line the far wall.`,
    choices: [
      { label: "Take the ancient blade", to: 46 },
      { label: "Search the sealed vaults", to: 48 },
      { label: "Back to the Hollow", to: 34 },
    ],
  },

  46: {
    room: "reliquary",
    effects: [["add", "kingsbane"], ["stat", "sanity", -1]],
    text: `The plinth's inscription is worn to almost nothing, but you make out enough: KINGSBANE — FORGED FOR THE UNMAKING, NOT THE WARDING.

The Order never used this blade. Whatever they were sealing, they were prepared to end it outright, and chose not to. That decision sits uneasily in your hand along with the sword's considerable weight.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  48: {
    room: "reliquary",
    text: `The nearest vault's seal is old and brittle. It'll open, but not gently.`,
    choices: [{ label: "Force it", luck: { pass: 53, fail: 55 } }],
  },

  53: {
    room: "reliquary",
    effects: [["add", "phoenixdraught"]],
    text: `The vault yields a single sealed flask, its contents still faintly warm after three centuries — a reliquary-grade healing draught, stronger than anything brewed upstairs. You take it carefully, the way you'd take anything that's outlasted an empire.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  55: {
    room: "reliquary",
    effects: [["stat", "health", -2]],
    text: `The seal doesn't open so much as detonate, a puff of ancient pressurized air throwing you back into the wall. Whatever the vault held is long gone to dust now — you got noise and bruises for your trouble, nothing more.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  // ---- Bonefields ----

  38: {
    room: "bonefields",
    text: `The Bonefields are exactly that — a chamber floored in old remains, some human, some very much not, all of it centuries settled into a single vast layer of quiet ruin. Something valuable catches torchlight among the bones.`,
    choices: [
      { label: "Search among the bones", to: 59 },
      { label: "Cross carefully to the far passage", luck: { pass: 64, fail: 67 } },
      { label: "Back to the Hollow", to: 34 },
    ],
  },

  59: {
    room: "bonefields",
    effects: [["add", "boneward"], ["stat", "sanity", -1]],
    text: `Among the remains, one skeletal hand still grips a small carved charm — a warden's own finger bone, shaped deliberately, worn smooth by centuries of handling before that. You ease it free with more respect than the task strictly requires.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  64: {
    room: "bonefields",
    text: `You pick your way across without disturbing a single bone, light-footed and lucky. Whatever's buried in here stays buried a while longer.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  67: {
    room: "bonefields",
    effects: [["stat", "health", -2], ["stat", "sanity", -1]],
    text: `Bone gives way underfoot with a sound you will not be forgetting soon, and you go down hard into three centuries of dust and worse. Nothing follows you back up. You don't stay to find out if that's because nothing noticed, or because nothing needed to.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  // ---- Chained Hall ----

  40: {
    room: "chainedhall",
    text: `Older wardens than any upstairs line this hall, chained upright to the walls, armor styles that predate the Order's current form by centuries. Some still murmur, faintly, in a language you don't recognize but somehow understand the shape of.`,
    choices: [
      { label: "Listen to the whispers", to: 68 },
      { label: "Free one of the chained wardens", to: 71 },
      { label: "Back to the Hollow", to: 34 },
    ],
  },

  68: {
    room: "chainedhall",
    effects: [["flag", "knowAncientOath"], ["stat", "sanity", -1]],
    text: `The whispering resolves into a single repeated phrase, older than the Oath carved in the chapel above: "WE MADE IT SO IT COULD NOT BE UNMADE. WE DID NOT ASK IF THAT WAS MERCY."

Whatever the Order has always been guarding wasn't born a monster. Someone built it into one, or bound it into becoming one, a very long time ago — and the wardens down here have had centuries to regret the method, if not the necessity.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  71: {
    room: "chainedhall",
    text: `One warden's chains look older than the rest, worn thin near the wrist. It would take very little to finish the job time has already mostly done.`,
    choices: [{ label: "Break the chain", luck: { pass: 73, fail: 75 } }],
  },

  73: {
    room: "chainedhall",
    effects: [["flag", "allyFreed"], ["stat", "sanity", -1]],
    text: `The chain parts and the freed warden straightens slowly, joints unused to movement, and regards you with an attention that feels entirely, unnervingly present.

It does not speak. It simply falls into step half a pace behind you, the way an old soldier falls in beside a new officer — reserving judgment, for now, on whether you're worth following.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  75: {
    room: "chainedhall",
    effects: [["stat", "health", -3], ["stat", "sanity", -1]],
    text: `The chain doesn't break so much as the warden does, crumbling to old armor and older dust the instant the tension releases — and whatever held it animate this long objects violently to the interruption, one final desperate grasp catching you across the ribs before it finally, truly, stops.

You back out of the hall considerably more careful than you went in.`,
    choices: [{ label: "Back to the Hollow", to: 34 }],
  },

  // ---- The Throat ----

  42: {
    room: "throat",
    text: `The Throat narrows to barely a shoulder's width, sloping down into a dark that swallows torchlight whole. A side niche, easy to miss, breaks the tunnel wall a short way in.`,
    choices: [
      { label: "Search the side niche first", to: 79 },
      { label: "Push forward, torch held high", needItem: "woodtorch", to: 80 },
      { label: "Push forward blind", luck: { pass: 80, fail: 82 } },
      { label: "Back to the Hollow", to: 34 },
    ],
  },

  79: {
    room: "throat",
    effects: [["add", "bandage"]],
    text: `The niche holds a long-dead scout's forgotten kit — one more clean bandage, still sealed after all this time. Someone came this far before you and didn't come back for their supplies. You try not to read too much into that.`,
    choices: [{ label: "Back to the Throat", to: 42 }],
  },

  82: {
    room: "throat",
    effects: [["stat", "health", -2]],
    text: `You misjudge the tunnel's narrowing in the dark and take a nasty scrape down one whole side, but you keep your footing and keep moving. The Throat doesn't get any friendlier the further down you go.`,
    choices: [{ label: "Continue down", to: 80 }],
  },

  80: {
    room: "throne",
    text: `The Throat opens, at last, into a vast cavern lit by nothing you can identify, and the light isn't the strange part. At the chamber's heart, on a throne grown from the same stone as the walls, something that used to be a king waits with the patience of three hundred years.

It does not have Dame Vayne's borrowed familiarity. It has never needed to explain itself to anyone. It simply opens eyes that were sealed shut a very long time ago, and looks directly at you.`,
    choices: [{ label: "Approach the Unmade Throne", to: 85 }],
  },

  // ---- The Unmade Throne (climax) ----

  85: {
    room: "throne",
    text: `"A visitor," it says, in a voice like stone settling. "Not a Warden. Not quite. Something in between, same as they always were, in the end."

It doesn't rise. It doesn't need to. Whatever happens next in this chamber will happen because you decide it, or because it finally, after three centuries, decides it's tired of waiting to be decided about.`,
    choices: [
      { label: "Strike with Kingsbane", needItem: "kingsbane", to: 87 },
      { label: "Call your freed warden ally to your side", needFlag: "allyFreed", to: 89 },
      { label: "Answer as one already bound by oath", needFlag: "oathBound", to: 91 },
      { label: "Invoke the seal you renewed yourself", needFlag: "properSeal", to: 93 },
      { label: "Fight with whatever ward is left", needFlag: "sealBroken", to: 95 },
      { label: "Turn and run for the Throat", to: 97 },
    ],
  },

  87: {
    room: "throne",
    effects: [["stat", "sanity", -1]],
    text: `Kingsbane goes in clean, exactly where the old smiths intended, and the Unmade King does not scream so much as *unwind* — three centuries of held-together purpose coming apart all at once, with a sound like a held breath finally, finally released.

When it's done, the throne is just stone again. You stand alone in a cavern that no longer needs a Warden, holding a sword that has finally done the one thing it was ever forged to do.`,
    choices: [{ label: "Read the epilogue", to: 96 }],
  },

  96: {
    room: "throne",
    type: "act-end",
    text: `EPILOGUE — THE UNMAKING

You walk out of the Warden's Keep in daylight, for the first time since you arrived, and Ash Hollow's tithe finally, formally, ends. Dame Vayne's remnant does not follow you up — whatever bound her to that duty ended when its purpose did.

You take the reeve's silver. You don't take the crown's offer of a new commission, not yet. Some watches are worth finishing properly before you start another one.`,
  },

  89: {
    room: "throne",
    effects: [["stat", "sanity", -1]],
    text: `Your freed warden steps forward without being asked, sword already drawn, and meets the Unmade King's first strike so you don't have to. It is old and slow and utterly without fear, and between the two of you, the fight is shorter than three centuries of dread led you to expect.

When it's over, your ally kneels, briefly, at the foot of the now-empty throne — a soldier's courtesy to a fallen enemy, or perhaps simply to the end of a very long watch — before rising to walk beside you back toward the light.`,
    choices: [{ label: "Read the epilogue", to: 98 }],
  },

  98: {
    room: "throne",
    type: "act-end",
    text: `EPILOGUE — TWO WARDENS

You return to Ash Hollow with an escort no one in the village quite knows how to explain to the crown's inspector, and honestly, neither do you.

Your companion doesn't speak much, and doesn't age at all, and seems entirely content simply standing watch at the edge of whatever village you settle near. You never do figure out its name. It never seems to mind you not asking.`,
  },

  91: {
    room: "throne",
    effects: [["stat", "sanity", -2]],
    text: `You don't reach for a blade at all. You simply stand, the Oath's shape still settled in your bones, and the Unmade King regards you the way it might regard a familiar piece of furniture — recognized, catalogued, no longer a question worth asking.

"Then you already know the answer," it says, and something in you, quietly and without ceremony, agrees to keep it exactly where it is, forever, the way thirty-one Wardens agreed before you.`,
    choices: [{ label: "Read the epilogue", to: 99 }],
  },

  99: {
    room: "throne",
    type: "act-end",
    text: `EPILOGUE — THE WATCH CONTINUES

Ash Hollow gets its silver and its answer, delivered by a courier who was, until recently, a disgraced hedge knight and is now something considerably harder to put a name to.

You do not go back to the village. You stand your post instead, in a keep that finally has someone to hold it, exactly as long as it takes for someone else to come asking the same questions you once did. You find, to your own quiet surprise, that you don't much mind the wait.`,
  },

  93: {
    room: "throne",
    effects: [["stat", "sanity", 1]],
    text: `You press your palm flat against the cavern wall and feel the renewed seal answer from three hundred feet above — the ward you reinforced with your own blood, still holding, still yours.

The Unmade King strains against it, once, testing, and finds exactly the resistance it expected. "Properly done," it concedes, almost respectfully, and settles back onto its throne of stone. Not defeated. Simply, correctly, contained.`,
    choices: [{ label: "Read the epilogue", to: 100 }],
  },

  100: {
    room: "throne",
    type: "act-end",
    text: `EPILOGUE — HELD

You climb back up through the Hollow, the Sanctum's stair, the Great Hall, the courtyard, the gatehouse, and finally the ordinary cold night air, and every step of it holds.

Dame Vayne's remnant is gone when you pass through the Sanctum — released, you assume, by a ward finally strong enough to stand without her. Ash Hollow pays you in full. You find you're already, quietly, planning to come back and check on the seal in a year or two. Old habits, apparently, form faster than you'd like.`,
  },

  95: {
    room: "throne",
    type: "act-end",
    text: `What's left of the ward is thin, but it's not nothing, and you throw everything you have left into holding the Unmade King's attention while the cavern itself seems to fight on your behalf — old stone, older purpose, straining to do the job thirty-one Wardens usually shared between them.

It is not a clean fight. It is not a fight you're entirely sure you win, even after it's over and you're still standing and the throne is, for now, quiet again. You limp back up through the Throat with the distinct sense that you've bought time, not victory, and that whatever comes to collect on that loan will not be gentle about it.

— TO BE CONTINUED —`,
  },

  97: {
    room: "throne",
    type: "act-end",
    text: `You run, and it lets you — or perhaps simply doesn't consider you worth the effort of rising from a throne it's occupied for three centuries.

You take every stair at a dead sprint, past the Chained Hall, past Dame Vayne's Sanctum, up into a night sky you weren't certain you'd see again. Behind you, far below, stone settles back into stillness. You don't know if that's the sound of something sleeping again, or something patiently waiting for you to come back and finish what you started.

— TO BE CONTINUED —`,
  },

  // ============ DEATHS ============

  90: {
    room: null,
    type: "death",
    text: `Your legs give out first, then your grip on the sword, then everything else in slower order. The last thing you're aware of is the particular quality of the dark in this keep — patient, unhurried, in absolutely no rush to claim what it already knows is coming.

YOUR STORY ENDS HERE.`,
  },

  92: {
    room: null,
    type: "death",
    text: `You simply cannot go another step. The keep doesn't finish you — it just outlasts you, the way it has outlasted everyone else who came here with good intentions and not enough left in reserve.

You sit down against a cold wall to rest, only for a moment, and the moment doesn't end.

YOUR STORY ENDS HERE.`,
  },

  94: {
    room: null,
    type: "death",
    text: `Somewhere in the dark, you stop being able to tell the difference between what the keep is showing you and what it's always been. You sit down, quite calmly, and wait for the patrol to come around again.

It does. You fall in step beside it. It doesn't seem to mind the company, and after a while, neither do you.

YOUR STORY ENDS HERE.`,
  },

};
