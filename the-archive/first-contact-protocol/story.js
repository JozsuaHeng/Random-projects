// FIRST CONTACT PROTOCOL — story data. Act One draft.
// Page numbers are deliberately scattered, like the old paperbacks.

// 16x16 portrait: Dr. Okonkwo-Vance, research-suit collar, calm face.
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
  "...kkssskkk.....",
  "..ksssssssssk...",
  ".ksssskksssssk..",
  ".ksssk..kssssk..",
  ".kkkk....kkkk...",
];

const META = {
  title: "FIRST CONTACT PROTOCOL",
  subtitle: "An Interactive Gamebook — Act One",
  startPage: 1,
  backdrop: "xenoscan",
  player: {
    name: "Dr. A. Okonkwo-Vance",
    role: "Xenolinguist, Protocol Officer",
    bio: "Fourteen years studying languages nobody speaks anymore, hired eighteen months ago by the First Contact Directorate on the theory that someone who's good at dead languages might be good at ones that were never alive. Station Ketos-9 stopped transmitting five weeks ago. You're the second wave.",
  },
  stats: { health: 10, oxygen: 10, sanity: 10 },
  deathPages: { health: 90, oxygen: 92, sanity: 94 },
};

const ITEMS = {
  scanner:    { name: "Field Multiscanner", desc: "Spectrometer, radiation counter, and motion sensor in one battered housing.", slot: "held" },
  headlamp:   { name: "Headlamp",     desc: "Magnetic-mount beam. The farside gets very dark, very fast.", slot: "held" },
  cutter:     { name: "Cutting Laser",desc: "Meant for ice cores. Works on doors that disagree with you.", slot: "held" },
  traumakit:  { name: "Trauma Kit",   desc: "Standard field medical kit. USE: +4 health.", use: { health: 4 } },
  stim:       { name: "Adrenal Stim", desc: "Combat-grade stimulant. USE: +3 health, -1 sanity.", use: { health: 3, sanity: -1 } },
  rations:    { name: "Ration Bar",   desc: "Tastes like nothing, keeps you upright. USE: +2 health, +1 sanity.", use: { health: 2, sanity: 1 } },
  sealant:    { name: "Sealant Patch",desc: "Emergency suit/wound sealant. USE: +2 health.", use: { health: 2 } },
  stabilizer: { name: "Neural Stabilizer", desc: "Keeps intrusive certainty at bay. USE: +3 sanity, -1 health.", use: { sanity: 3, health: -1 } },
  evahelmet:  { name: "EVA Visor",    desc: "Full-seal helmet with HUD overlay. Wear it to survive the surface.", slot: "head" },
  evasuit:    { name: "EVA Suit",     desc: "Hard-shell surface suit, station-issue. Wear it to survive the surface.", slot: "body" },
  evagloves:  { name: "EVA Gloves",   desc: "Pressure-rated gauntlets. Wear them to survive the surface.", slot: "hands" },
  evaboots:   { name: "EVA Boots",    desc: "Magnetic soles for low-gravity traction. Wear them to survive the surface.", slot: "feet" },
  o2pack:     { name: "Oxygen Pack",  desc: "Backup life support. Wear it to survive the surface.", slot: "back" },
  override:   { name: "Director's Override", desc: "Station-Director-level access key. Opens what the crew locked." },
  shard:      { name: "Resonant Shard", desc: "A sliver of something not from here. It hums when you're right about something. +1 on luck tests.", luckBonus: true },
  blackbox:   { name: "Flight Recorder", desc: "The array's own black box. Every transmission in and out, unedited." },
  xenosample: { name: "Xeno Sample",  desc: "A sealed vial of something that isn't quite biological and isn't quite not." },
  translator: { name: "Translator Core", desc: "Dr. Achebe's unfinished linguistic model. Nearly ready to actually listen." },
  gift:       { name: "The Visitor's Gift", desc: "You don't have a word for what this is yet. You suspect you're going to need one." },
  resonantcore: { name: "Resonant Core",  desc: "A fragment of the Choir's shared resonance, still humming with every voice that ever answered yes." },
  codexfragment: { name: "Codex Fragment", desc: "A single page, if 'page' is even the right word, from an archive spanning more civilizations than you have names for." },
  relaykey:   { name: "Relay Key",        desc: "Full-bandwidth relay authorization. Whatever you send with this reaches Earth complete, unfiltered, and impossible to recall." },
};

const ROOMS = {
  airlock:     { name: "Airlock",         col: 0, row: 0, icon: "⌬" },
  commons:     { name: "Commons",         col: 1, row: 0, icon: "◎" },
  medbay:      { name: "Medbay",          col: 2, row: 0, icon: "✚" },
  comms:       { name: "Comms Array",     col: 3, row: 0, icon: "◈" },
  quarters:    { name: "Quarters",        col: 0, row: 1, icon: "▤" },
  labs:        { name: "Xenobiology Lab", col: 1, row: 1, icon: "⚗" },
  greenhouse:  { name: "Greenhouse Dome", col: 2, row: 1, icon: "❋" },
  observatory: { name: "Observatory",     col: 3, row: 1, icon: "✦" },
  reactor:     { name: "Reactor",         col: 0, row: 2, icon: "⚛" },
  garage:      { name: "Rover Garage",    col: 1, row: 2, icon: "▣" },
  archive:     { name: "Data Archive",    col: 2, row: 2, icon: "▦" },
  contact:     { name: "Contact Site",    col: 3, row: 2, icon: "◉" },
  // Act Two — beyond the threshold
  threshold:   { name: "The Threshold",   col: 0, row: 3, icon: "◐" },
  choir:       { name: "The Choir",       col: 1, row: 3, icon: "♫" },
  deeparchive: { name: "Deep Archive",    col: 2, row: 3, icon: "▥" },
  relay:       { name: "Relay Junction",  col: 3, row: 3, icon: "▲" },
  gardendeep:  { name: "Garden Deep",     col: 0, row: 4, icon: "❁" },
  vesselcore:  { name: "The Vessel's Heart", col: 1, row: 4, icon: "☉" },
  watchers:    { name: "Watchers' Gallery", col: 2, row: 4, icon: "⌾" },
};

const PAGES = {

  // ============ AIRLOCK ============

  1: {
    room: "airlock",
    effects: [["add", "scanner"]],
    text: `The lander's ramp touches lunar regolith without a sound, because on the farside there's nothing to carry one. Station Ketos-9 sits half-buried in a crater rim ahead of you, running on emergency amber lights, exactly as the last low-bandwidth ping described it five weeks ago.

You were sent to reestablish contact with the station. Not with whatever the station found. Nobody has said that distinction out loud yet, but everyone in the briefing room was thinking it.

Your suit reads the airlock cycling from the inside — someone, or something, left it unsealed.`,
    choices: [
      { label: "Check the airlock control panel", to: 3 },
      { label: "Cycle through immediately", to: 6 },
    ],
  },

  3: {
    room: "airlock",
    effects: [["stat", "sanity", -1]],
    text: `The panel's log shows the airlock cycled four times in the last five weeks. Each time, outbound only — someone leaving, nobody coming back in through this door.

The station's internal atmosphere reads nominal. Whatever silenced Ketos-9, it isn't a hull breach.

A hand-written label is stuck to the panel, in handwriting you don't recognize yet but will: LEAVE IT UNLOCKED. SHE MIGHT COME BACK FOR SOMETHING.`,
    choices: [{ label: "Cycle through", to: 6 }],
  },

  6: {
    room: "airlock",
    text: `The inner door opens on a mudroom of EVA lockers, most standing open and empty. Station atmosphere is thin but breathable — someone's been rationing the recyclers.

A duty roster is taped beside the lockers: eight names. Six are crossed out in the same careful hand, each with a date. Two are not crossed out. One of the two is Dr. R. Achebe, Chief Linguist. The other is smudged past reading.

Beyond the mudroom, Commons is lit and, somehow, worse for it.`,
    choices: [{ label: "Enter Commons", to: 9 }],
  },

  // ============ COMMONS (hub) ============

  9: {
    room: "commons",
    text: `Commons is the heart of the station — mess tables, a threadbare couch, a wall someone turned into a corkboard of printed photos and handwritten notes, overlapping like a shrine or a case file, hard to say which.

Doors lead to Medbay, the Comms Array, Quarters, and a stairwell down. A second corridor leads to the Xenobiology Lab, Greenhouse, and Observatory. A hatch marked UTILITY leads to Reactor, the Rover Garage, and the Archive.`,
    choices: [
      { label: "Read the corkboard", to: 11 },
      { label: "Medbay", to: 14 },
      { label: "Comms Array", to: 18 },
      { label: "Quarters", to: 25 },
      { label: "Xenobiology Lab", to: 31 },
      { label: "Greenhouse Dome", to: 38 },
      { label: "Observatory", to: 45 },
      { label: "Reactor", to: 52 },
      { label: "Rover Garage", to: 58 },
      { label: "Data Archive", to: 65 },
      { label: "You've seen enough. Head for the surface", to: 70 },
    ],
  },

  11: {
    room: "commons",
    effects: [["stat", "sanity", -1], ["flag", "knowCrew"]],
    text: `The corkboard is a timeline. Photos of the crew — eight faces, easy and unposed, taken before any of this. Printouts of a waveform, annotated in three different colors of ink, growing more confident over the weeks. A crude phonetic alphabet, half-invented, taped beside a translation attempt that trails into a single word repeated eleven times.

The word is HELLO. Or their best guess at it. Someone was so close.

Pinned at the center, alone: a photo of the crater rim at night, and beside it, in block letters: WE ANSWERED FIRST. WE SHOULD HAVE ASKED PERMISSION.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ MEDBAY ============

  14: {
    room: "medbay",
    effects: [["add", "traumakit"]],
    text: `Medbay is orderly, which is somehow more unsettling than wreckage would be. A TRAUMA KIT sits restocked on the shelf. The exam table is made up like nobody's used it in weeks.

The medical log terminal is still logged in. Six patient files, all flagged with the same anomalous note: ELEVATED THETA ACTIVITY, SUSTAINED. PATIENT REPORTS NO DISCOMFORT. PATIENT REPORTS, IF ANYTHING, RELIEF.`,
    choices: [
      { label: "Read the full medical log", to: 16 },
      { label: "Back to Commons", to: 9 },
    ],
  },

  16: {
    room: "medbay",
    effects: [["stat", "sanity", -1], ["flag", "knowTheta"]],
    text: `Dr. Osei — station physician — kept detailed notes right up until her own file starts showing the same reading.

Final entry, in a hand growing looser by the sentence: "It isn't a symptom. I keep writing 'symptom' because I don't have a better word yet. It feels like understanding something a half-second before you consciously know what it is. All six of us have it now. Achebe says the array has it too, if an array can be said to have anything. I don't think this is a disease. I think it's a fluency."`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ COMMS ARRAY ============

  18: {
    room: "comms",
    text: `The Comms Array control room is the one space on the station kept spotless — banks of receivers, a wall display looping the same waveform from the corkboard, and a direct feed to the dish itself, still patiently listening.

A locked cabinet sits beneath the main console, DIRECTOR ACCESS ONLY stenciled across it. The transmission log scrolls past, five weeks of outbound messages with no acknowledged reply since Day 121. A secondary terminal, off to one side, still has Achebe's translation model open mid-edit.`,
    choices: [
      { label: "Review the transmission log", to: 20 },
      { label: "Force the locked cabinet", needAnyItem: ["cutter", "override"], to: 23 },
      { label: "Try to complete Achebe's translation model", needFlag: "knowLanguage", to: 98 },
      { label: "Back to Commons", to: 9 },
    ],
  },

  98: {
    room: "comms",
    text: `Achebe's model is close — closer than the whiteboard in the lab suggested. Most of the grammar is mapped. What's missing is the last, hardest part: teaching it to distinguish a genuine answer from the half-second of borrowed certainty the signal keeps offering for free.

It's finicky, exacting work, and you have exactly one clean run of station power to attempt it in.`,
    choices: [{ label: "Attempt it", luck: { pass: 99, fail: 100 } }],
  },

  99: {
    room: "comms",
    effects: [["add", "translator"], ["flag", "knowTranslatorDone"]],
    text: `The model locks into place with a clean, satisfying certainty that is, this time, entirely your own — you checked. The TRANSLATOR CORE is finished, or as finished as five weeks of one linguist's obsessive notes were ever going to get it.

Achebe would probably want you to have this. You suspect, somehow, she already does.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  100: {
    room: "comms",
    effects: [["stat", "sanity", -1]],
    text: `The model crashes twice, then a third time, throwing up a cascade of grammar rules that contradict each other in ways that feel less like a bug and more like the language itself resisting being pinned down by anyone who isn't already fluent.

You'll need to come back to this with a clearer head.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  20: {
    room: "comms",
    effects: [["flag", "knowSignal"], ["stat", "sanity", -1]],
    text: `Day 1 through Day 120: routine. Standard deep-listening logs, the occasional false positive, the slow grind of a program nobody expected to succeed.

Day 121: a structured return signal, unmistakably artificial, arriving from a bearing that maps to nothing catalogued in this system. Not a reply to Earth's original broadcast — a reply keyed specifically to THIS station's callsign, as if it had been listening back for a while before it bothered to answer.

The crew's own outbound messages after that point aren't reports to Earth anymore. They're conversation.`,
    choices: [
      { label: "Force the locked cabinet", needAnyItem: ["cutter", "override"], to: 23 },
      { label: "Back to Commons", to: 9 },
    ],
  },

  23: {
    room: "comms",
    effects: [["add", "blackbox"], ["stat", "sanity", -1]],
    text: `The cabinet gives way to reveal the array's FLIGHT RECORDER — every transmission in and out, unedited, unfiltered by whatever the crew chose to summarize in their reports.

You don't play it yet. You already suspect it will change how you read everything else on this station, and you'd rather gather the rest of the picture first.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ QUARTERS ============

  25: {
    room: "quarters",
    text: `Eight bunks, six made with the same tight precision as the medbay exam table. Two are unmade — one recently, sheets still faintly warm to a thermal reader; one long enough ago that dust has settled evenly across it.

A locker stands open, personal effects scattered like someone packed in a hurry and then simply stopped, mid-motion, and never finished.`,
    choices: [
      { label: "Search the open locker", to: 27 },
      { label: "Check the recently-used bunk", to: 29 },
      { label: "Back to Commons", to: 9 },
    ],
  },

  27: {
    room: "quarters",
    effects: [["add", "override"]],
    text: `The locker belongs to Station Director Reyes-Park, by the nameplate. Tucked beneath a folded uniform: a DIRECTOR'S OVERRIDE key, still on its lanyard.

A note is folded around it, addressed to no one in particular: "Whoever finds this — I'm not missing. I made a choice with eyes open and I'd make it again. Use the override. See what we saw. Then decide for yourself, the way I got to."`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  29: {
    room: "quarters",
    effects: [["add", "shard"], ["stat", "sanity", -1]],
    text: `The recently-slept-in bunk belongs to Dr. Achebe. On the pillow, deliberately placed: a RESONANT SHARD, a sliver of pale material that catches light in ways light doesn't usually agree to.

It hums faintly when you pick it up — not a sound exactly, more a certainty arriving slightly ahead of its explanation. You find you trust your own judgment a little more with it in your pocket.

Achebe's bunk is otherwise empty. Not abandoned-empty. Packed-up empty.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ XENOBIOLOGY LAB ============

  31: {
    room: "labs",
    text: `The lab is a mess of good, careful science interrupted mid-thought. Centrifuge still spinning down. A sample rack, one vial removed and never returned to its slot. A whiteboard covered in a phonetic alphabet more complete than the one on the corkboard.

A sealed containment case sits on the counter, unlabeled, humming very faintly on its own.`,
    choices: [
      { label: "Open the containment case", to: 33 },
      { label: "Read the whiteboard", to: 35 },
      { label: "Back to Commons", to: 9 },
    ],
  },

  33: {
    room: "labs",
    effects: [["add", "xenosample"], ["stat", "sanity", -1]],
    text: `Inside: a single sealed vial, gently warm, containing something that reads on every instrument as simultaneously organic and crystalline, alive and inert, present and — according to one baffled sensor — "in two places at a slight temporal offset."

The label, in careful handwriting: XENOSAMPLE 7. IT WAS OFFERED, NOT TAKEN. PLEASE REMEMBER THAT DISTINCTION WHEN YOU WRITE THIS UP.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  35: {
    room: "labs",
    effects: [["flag", "knowLanguage"], ["stat", "sanity", -1]],
    text: `The whiteboard's phonetic alphabet is dense with revision, crossed-out theories, Achebe's handwriting getting steadily more confident across the weeks. Near the bottom, underlined twice:

"It's not a language built to describe THINGS. It's a language built to describe RELATIONSHIPS — between the speaker and whoever's listening. You can't translate it neutrally. The act of understanding it changes what you are to it. I don't think that's a flaw in the design. I think that's the entire point of the design."`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ GREENHOUSE DOME ============

  38: {
    room: "greenhouse",
    text: `The greenhouse dome should be the most ordinary room on the station — hydroponic racks, grow lights, the smell of wet soil. Instead, every plant in the dome has turned, slowly and unanimously, to face the same direction: not toward any light source, but toward the crater rim outside.

They pulse very faintly, in unison, roughly once every four seconds. You find yourself timing your own breath to match before you notice you're doing it.`,
    choices: [
      { label: "Approach the racks for a closer look", to: 40 },
      { label: "Time the pulse against your scanner", needItem: "scanner", to: 42 },
      { label: "Back to Commons", to: 9 },
    ],
  },

  40: {
    room: "greenhouse",
    effects: [["stat", "sanity", -1]],
    text: `Up close, the pulse isn't light. It's the plants themselves flexing, fractionally, all together — leaves angling a half-degree and back, over and over, patient as a held note.

It takes you a long moment to place why it looks familiar. It's the same period as the "listening rings" pattern on the array's old sonar displays. The greenhouse isn't reacting to the signal.

The greenhouse is repeating it.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  42: {
    room: "greenhouse",
    effects: [["add", "rations"], ["flag", "knowResonance"]],
    text: `Your scanner clocks the pulse at a frequency that matches, almost exactly, the carrier wave from the Day 121 signal — scaled down by a factor even a hydroponics rack could physically manage.

Whatever arrived here didn't just talk to the crew. It's still, quietly, talking to the whole station. You find a case of sealed RATION BARS undisturbed on a lower shelf and take what you can carry, grateful for something in this room that's still just what it looks like.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ OBSERVATORY ============

  45: {
    room: "observatory",
    text: `The observatory dome's main scope is aimed, not at the sky, but level with the horizon — locked in position, pointed at a spot on the crater rim about four hundred meters from the station.

Through the eyepiece: a shape, low and pale, half-embedded in regolith, unmistakably not a rock and unmistakably not built by anyone from Earth. It hasn't moved, as far as you can tell, in five weeks.`,
    choices: [
      { label: "Check the scope's logged observations", to: 47 },
      { label: "Back to Commons", to: 9 },
    ],
  },

  47: {
    room: "observatory",
    effects: [["stat", "sanity", -1], ["flag", "knowSite"]],
    text: `The observation log spans five weeks of the crew watching that shape, in shifts, like a vigil. Notes range from clinical to increasingly personal:

"Day 130: No structural change. No further signal. It's just... waiting. Politely, somehow.
Day 144: Achebe went out alone today. Didn't clear it with anyone. Came back six hours later and wouldn't say what happened. She hasn't stopped smiling since, and it's the worst thing I've seen all mission.
Day 151: I think some of us are going to go out and not come back, and I don't think it's going to be a tragedy when it happens."`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ REACTOR ============

  52: {
    room: "reactor",
    text: `The reactor room is dim, running on a conservative idle setting — enough for life support, not enough for the array's full listening power. The main output breaker has been manually throttled, deliberately, by someone who knew exactly what they were doing.

A service note is clipped to the breaker panel: "Don't bring her back to full power without thinking hard about why we throttled it. — R.P."`,
    choices: [
      { label: "Restore full reactor output", to: 54 },
      { label: "Leave it throttled. Back to Commons", to: 9 },
    ],
  },

  54: {
    room: "reactor",
    text: `You reach for the override, and the breaker panel makes clear this won't be a simple flip of a switch — five weeks throttled has let pressure build somewhere in the feed lines that a full-power jump could vent badly.`,
    choices: [{ label: "Bring her up to full power", luck: { pass: 56, fail: 57 } }],
  },

  56: {
    room: "reactor",
    effects: [["flag", "arrayOnline"], ["stat", "sanity", -1]],
    text: `The feed lines hold. The station's lights climb from amber to full white, systems waking one deck at a time — and, distantly, through the hull, you feel the array dish begin to turn, aiming itself back at that spot on the crater rim with the eager, unhurried patience of something that's been waiting for exactly this.

Somewhere outside, you'd swear the ground itself exhales.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  57: {
    room: "reactor",
    effects: [["flag", "arrayOnline"], ["stat", "health", -2], ["stat", "sanity", -1]],
    text: `A relief valve blows with a bang that knocks you flat, superheated coolant venting past you close enough to feel through your suit. The station still comes up to full power a moment later, lights climbing white, array dish turning outward — R.P.'s note, it turns out, was not being dramatic.

You'll be feeling that one for a while.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ ROVER GARAGE ============

  58: {
    room: "garage",
    text: `The garage holds one rover, fully charged, and a wall of EVA lockers — most raided, one still sealed. Beyond a reinforced hatch, the surface airlock leads out toward the crater rim itself.

A hand-chalked countdown is scrawled beside the hatch, numbers crossed out one at a time, currently reading: 2 LEFT WHO HAVEN'T DECIDED.`,
    choices: [
      { label: "Open the sealed EVA locker", to: 60 },
      { label: "Run a diagnostic on the rover", to: 62 },
      { label: "Back to Commons", to: 9 },
    ],
  },

  60: {
    room: "garage",
    effects: [["add", "evahelmet"], ["add", "evasuit"], ["add", "evagloves"], ["add", "evaboots"], ["add", "o2pack"]],
    text: `The last sealed locker holds a complete surface kit — visor, suit, gloves, boots, and a full oxygen pack, station-issue and untouched. Whoever this was reserved for one, they never came to collect it.

You suit up anyway. Somebody has to go out there eventually, and the countdown on the wall is starting to feel less like graffiti and more like a schedule.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  62: {
    room: "garage",
    text: `The rover's charge reads full, but something in its nav log catches your eye — a route logged and driven repeatedly over the last five weeks, always the same four hundred meters out and never quite the same distance back.`,
    choices: [{ label: "Pull the full nav history", luck: { pass: 63, fail: 64 } }],
  },

  63: {
    room: "garage",
    effects: [["add", "sealant"], ["flag", "knowRoute"]],
    text: `The log resolves cleanly: nine outbound trips, eight returns, the ninth traveler presumably still out there or not needing a ride back anymore. A SEALANT PATCH kit rattles loose from a side compartment as you dig through the rover's stores — small, practical, exactly the kind of thing worth having before your own trip out.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  64: {
    room: "garage",
    effects: [["stat", "sanity", -1]],
    text: `The log is corrupted past the fifth trip, timestamps looping and overlapping in a way no diagnostic tool you have can untangle. You give up before the numbers start meaning something they shouldn't.`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ DATA ARCHIVE ============

  65: {
    room: "archive",
    text: `The archive is a cold, humming closet of redundant storage — the station's entire institutional memory, backed up in triplicate. A terminal here can pull crew biometrics going back to Day 1, cross-referenced against the theta readings from medbay.

A final summary file sits at the top of the directory, timestamped Day 151, authored by all six theta-positive crew jointly.`,
    choices: [
      { label: "Open the joint summary file", to: 67, needFlag: "knowTheta" },
      { label: "Back to Commons", to: 9 },
    ],
  },

  67: {
    room: "archive",
    effects: [["flag", "knowChoice"], ["stat", "sanity", -1]],
    text: `The file is short, and it isn't a distress call.

"To whoever reads this next: we are not lost, not taken, not infected. We were asked a question and we've spent five weeks answering it honestly, one at a time. Some of us said yes. If you're reading this, you get asked too, eventually, whether you want to or not. We'd rather you heard that from us first, plainly, than pieced it together from wreckage that isn't there. There is no wreckage. There was never any danger. There was only ever a choice."`,
    choices: [{ label: "Back to Commons", to: 9 }],
  },

  // ============ THE SURFACE / CONTACT SITE ============

  70: {
    room: "commons",
    text: `You've seen enough of the station. Whatever answer you're going to give, it isn't waiting in these corridors — it's four hundred meters out, on the crater rim, patient as it's apparently always been.

The surface airlock is back through the garage. You'll need a full seal to survive the walk.`,
    choices: [
      { label: "Suit up and go to the airlock", needEquipAll: ["evahelmet", "evasuit", "evagloves", "evaboots", "o2pack"], to: 72 },
      { label: "Keep exploring the station first", to: 9 },
    ],
  },

  72: {
    room: "garage",
    text: `The surface airlock cycles, and lunar dawn — if you can call four hundred hours of unbroken sunlight a dawn — spreads flat and merciless across the crater floor. Your HUD reads oxygen reserves, suit integrity, the long patient silence of a world with no weather to erode anything, ever.

The shape from the observatory scope is visible immediately: low, pale, and — as you get closer — unmistakably not stone.`,
    choices: [{ label: "Walk the four hundred meters", to: 75 }],
  },

  75: {
    room: "contact",
    effects: [["stat", "oxygen", -2]],
    text: `Up close, the structure resists easy description the way Achebe's whiteboard warned you it would. It isn't a ship, exactly. It isn't a probe, exactly. It's closer to a held door — an invitation shaped like architecture.

Footprints, human, converge on it from every direction and don't all lead back out again. Yours will be the ninth set.

Something in the structure, without moving, becomes aware of you.`,
    choices: [{ label: "Approach", to: 78 }],
  },

  78: {
    room: "contact",
    text: `The door — you're already thinking of it as a door — opens without hinges, without sound, the way a thought completes itself. Inside, or perhaps simply presented to you without an "inside" at all, is a presence rather than a shape, waiting the way the corkboard's photos suggested it has always been waiting: patiently, and with what you're fairly sure is genuine curiosity rather than hunger.

It asks its question the only way it apparently knows how — not in words, but in the same structured pulse from the greenhouse, the array, the corkboard's translation notes, arriving in your mind a half-second ahead of understanding, exactly as Osei described.

Do you understand it, or does it simply let you believe you do? You suspect, by now, that the distinction is the entire point.`,
    choices: [
      { label: "Offer the Translator Core, and answer carefully", needItem: "translator", to: 80 },
      { label: "Offer the Resonant Shard, and answer on instinct", needItem: "shard", to: 82 },
      { label: "Refuse to answer. Turn back now", to: 85 },
      { label: "Answer with nothing but yourself", to: 87 },
    ],
  },

  80: {
    room: "contact",
    effects: [["stat", "sanity", -1], ["flag", "answeredCareful"], ["add", "gift"]],
    text: `You run the Translator Core the way Achebe built it to run — slow, deliberate, checking your own understanding against the model at every step rather than trusting the half-second certainty it keeps offering for free.

It is, without question, the harder way to have this conversation. It is also, you're increasingly sure, the only way to have it and still know afterward which parts of the answer were actually yours.

The presence seems to... approve. Or perhaps simply notice the effort, which may be the same thing to something like this.

— END OF ACT ONE —`,
    choices: [{ label: "See what it says back", to: 89 }],
  },

  82: {
    room: "contact",
    effects: [["stat", "sanity", -2], ["flag", "answeredInstinct"], ["add", "gift"]],
    text: `You let the shard's certainty answer for you, trusting the half-second of understanding that arrives before the conscious thought does, the way six theta-positive crew members apparently learned to trust it before you.

It is fast. It is fluent in a way that frightens you a little, arriving whole and complete and utterly convincing. You're no longer entirely sure, three sentences in, whether the words in your head are a translation or a suggestion.

— END OF ACT ONE —`,
    choices: [{ label: "See what it says back", to: 89 }],
  },

  85: {
    room: "contact",
    effects: [["flag", "refused"], ["stat", "sanity", 1]],
    text: `You take one step back. Then another. The presence doesn't pursue, doesn't plead, doesn't so much as flicker in apparent disappointment — it simply waits, the way it has for five weeks, the way it will presumably wait for five hundred more if that's what the question requires.

Walking away from a door that isn't hurt by your leaving is its own kind of unsettling. You make it back to the rover with your own thoughts entirely, provably, your own.

— END OF ACT ONE —`,
    choices: [{ label: "Head back to the station to think", to: 89 }],
  },

  87: {
    room: "contact",
    effects: [["stat", "sanity", -2], ["flag", "answeredRaw"], ["add", "gift"]],
    text: `You don't reach for a tool or a translation. You just stand there, unequipped and unprepared in every sense the Directorate's briefing packets meant to prevent, and let whatever happens, happen.

What arrives isn't language at all, not at first — it's closer to being *known*, thoroughly and all at once, the way Osei's log tried and failed to describe. Every dead language you ever loved, it turns out, was practice for exactly one conversation, and you're having it now, unarmed, on instinct, the way six other people apparently decided was the only honest way to do this.

— END OF ACT ONE —`,
    choices: [{ label: "See what it says back", to: 89 }],
  },

  89: {
    room: "contact",
    effects: [["flag", "act2"]],
    text: `Whatever passed between you and the structure on the crater rim, you walk back to Ketos-9 changed by an amount you won't be able to measure until later — maybe much later, maybe for the rest of your life.

The station's lights are still on. The array is still listening. And somewhere in your own thinking, alongside your own voice, is now a second one, quiet and patient, waiting to see what you decide to do with the rest of this mission.

— END OF ACT ONE —`,
    choices: [{ label: "Report back to the Directorate. Begin the real work", to: 101 }],
  },

  // ============ ACT TWO — THE THRESHOLD ============

  101: {
    room: "commons",
    effects: [["stat", "sanity", -1]],
    text: `You draft the Directorate report three times and send none of them. The truth doesn't compress into a status update, and you suspect they'll know that the moment they read whatever you finally do send.

What you can't put in any report: the structure on the crater rim isn't closed anymore. Where there was one door, your HUD's last surface scan shows a second reading, fainter, deeper, opening onto something considerably larger than a threshold was ever built to hold back.

Earth is going to ask you what happens next. You'd like to actually know before you answer.`,
    choices: [{ label: "Go back out and find out", to: 102 }],
  },

  102: {
    room: "threshold",
    text: `Beyond the first structure, a second one — not a door this time but a genuine interior, vast in the specific way that architecture built by something that doesn't experience claustrophobia tends to be. Passages lead toward a resonant chamber the size of a cathedral, a repository humming faintly with stored information, and a relay junction that appears, impossibly, already wired for a connection to Earth.

A fourth passage slopes downward, toward warmth and green light that has no business existing this far from a sun.`,
    choices: [
      { label: "The Choir", to: 104 },
      { label: "The Deep Archive", to: 121 },
      { label: "The Relay Junction", to: 135 },
      { label: "The Garden Deep", to: 148 },
      { label: "The Watchers' Gallery", to: 190 },
      { label: "Search the antechamber", to: 156 },
      { label: "Wait and observe the Threshold's rhythm", to: 204 },
      { label: "Rest a moment first", to: 103 },
      { label: "Take stock of everything you've learned here", to: 155 },
      { label: "You're ready. Go to the Vessel's Heart", needFlag: "readyForCore", to: 160 },
    ],
  },

  103: {
    room: "threshold",
    effects: [["stat", "sanity", 1], ["stat", "health", 1]],
    text: `You sit against the threshold wall for exactly as long as you can spare, which is not very long, and let yourself simply not be asked anything for a few minutes. The structure, to its credit, doesn't seem to mind the pause. It has apparently had practice waiting.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  // ---- The Choir ----

  104: {
    room: "choir",
    text: `The Choir is a chamber built entirely around resonance — walls, floor, and a ceiling you can't quite focus on, all tuned to hold a sound that isn't quite sound. Layered within it, you can pick out individual voices if you listen carefully: hundreds of them, maybe thousands, none of them human, all of them saying, in their own way, the same single word the crew's corkboard tried to translate.`,
    choices: [
      { label: "Listen closely", luck: { pass: 106, fail: 107 } },
      { label: "Search for a physical record", to: 109 },
      { label: "Follow a faint, older signal half-buried in the resonance", to: 159 },
      { label: "Back to the Threshold", to: 102 },
    ],
  },

  106: {
    room: "choir",
    effects: [["add", "resonantcore"], ["flag", "knowChoir"]],
    text: `You let the layered voices resolve instead of fighting to isolate any one of them, and the Choir rewards the patience — a single clear fragment breaks loose and settles into your hands as something you can actually carry: a RESONANT CORE, warm, humming faintly in harmony with your own shard.

Whatever else this place is, it is not a threat choir. It is a very large room full of beings who all, at some point, said yes, and are apparently glad they did.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  107: {
    room: "choir",
    effects: [["stat", "sanity", -2]],
    text: `You try to isolate a single voice and the whole chamber seems to lean toward you at once, thousands of "yes" arriving with none of the individual context that made any of them meaningful. It passes, but you keep one hand on the wall until it does.`,
    choices: [{ label: "Back to the Choir", to: 104 }],
  },

  109: {
    room: "choir",
    effects: [["flag", "knowChoirOrigin"], ["stat", "sanity", -1]],
    text: `Near the chamber's edge, a physical inscription — the first one in this entire complex that looks deliberately, permanently written rather than resonated. A tally, not unlike the Order's duty roster back on the station, except this one has been running for longer than your species has had a written language, and it is still, patiently, being added to.`,
    choices: [{ label: "Back to the Choir", to: 104 }],
  },

  // ---- The Deep Archive ----

  121: {
    room: "deeparchive",
    text: `The Deep Archive holds information the way the Choir holds voices — not on shelves, but suspended, cross-referenced, alive with cross-connection in a way your own station's data terminals never managed. A reading alcove nearby seems built, almost considerately, to human proportions.`,
    choices: [
      { label: "Use the alcove", to: 123 },
      { label: "Search for anything about Earth specifically", to: 126 },
      { label: "Search the archive's oldest wing", luck: { pass: 128, fail: 129 } },
      { label: "Back to the Threshold", to: 102 },
    ],
  },

  123: {
    room: "deeparchive",
    effects: [["add", "codexfragment"], ["stat", "sanity", -1]],
    text: `The alcove responds to your presence the way the greenhouse plants responded to the array — a half-second ahead of your conscious request. What it offers is a CODEX FRAGMENT: not an answer, but a genuinely complete map of the question, in a form your own mind can hold without your translator's help.

You understand, reading it, why Achebe's model needed to be so careful. This is not information. This is a relationship, offered in writing.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  126: {
    room: "deeparchive",
    effects: [["flag", "knowEarthEntry"], ["stat", "sanity", -1]],
    text: `There is, it turns out, already an entry cross-referenced to your own solar system — sparse, decades old by your calendar, dated to well before Ketos-9's Day 121 signal. Someone, or something, has been quietly cataloguing Earth's radio noise since long before anyone here knew to look.

The entry ends with a single annotation, in the same structured grammar as everything else: NOT YET READY. STILL LISTENING. STILL HOPING.`,
    choices: [{ label: "Back to the Deep Archive", to: 121 }],
  },

  128: {
    room: "deeparchive",
    effects: [["flag", "knowOldestWing"], ["stat", "sanity", -1]],
    text: `The oldest wing predates the alcove's polite human-scaled accommodations entirely — you're reading it the hard way, half-intuited, half-guessed, and what comes through is staggering in scope: this archive did not start with your visitor. It started with whoever taught your visitor to keep one.

Civilizations cataloguing civilizations cataloguing civilizations, as far back as the structure's memory apparently goes, which is considerably further back than "far" usually means.`,
    choices: [{ label: "Back to the Deep Archive", to: 121 }],
  },

  129: {
    room: "deeparchive",
    effects: [["stat", "sanity", -1]],
    text: `The oldest wing doesn't resolve into anything you can hold onto — scale without handholds, time without a calendar you recognize, until you have to consciously step back before the sheer depth of it stops feeling like vertigo and starts feeling like something worse.`,
    choices: [{ label: "Back to the Deep Archive", to: 121 }],
  },

  // ---- The Relay Junction ----

  135: {
    room: "relay",
    text: `The Relay Junction is unmistakably built for exactly one purpose: sending something to Earth, cleanly, completely, on a bandwidth Ketos-9's own dish could never manage alone. Whether you're meant to use it, or simply capable of it, isn't obvious.

A secondary conduit nearby looks like it could be reconfigured for a narrower, more controlled transmission — filtered, curated, safer in every sense but the honest one.`,
    choices: [
      { label: "Prepare a full, unfiltered transmission", needItem: "blackbox", to: 137 },
      { label: "Prepare a filtered, careful transmission", to: 139 },
      { label: "Try to clean up the signal alignment first", luck: { pass: 141, fail: 142 } },
      { label: "Back to the Threshold", to: 102 },
    ],
  },

  137: {
    room: "relay",
    effects: [["add", "relaykey"], ["flag", "knowFullRelay"]],
    text: `You stage the Flight Recorder, the corkboard's photographs, Osei's medical log, Achebe's notes, all of it, ready to go out complete and unedited the moment you commit to sending it. The junction accepts the staging with the same patient readiness it's shown for everything else.

A RELAY KEY locks the transmission ready. You haven't sent it yet. You're not sure you're the one who should decide that alone.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  139: {
    room: "relay",
    effects: [["flag", "knowFilteredRelay"], ["stat", "sanity", -1]],
    text: `You draft a version Earth can survive reading calmly: contact confirmed, no hostility detected, further study recommended, several inconvenient specifics — Achebe's disappearance, the theta readings, the exact nature of the "choice" — quietly smoothed into recommendations for follow-up research.

It's not a lie. It's just not everything. You sit with how uncomfortable that distinction has started to feel.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  141: {
    room: "relay",
    effects: [["flag", "knowCleanSignal"], ["stat", "sanity", 1]],
    text: `You trim the noise out of the carrier wave with a patience that would have made Achebe proud, and the resulting signal path reads clean all the way to Earth's receiving stations — whatever you send now, if you send anything, will arrive exactly as clearly as you intended it.`,
    choices: [{ label: "Back to the Relay Junction", to: 135 }],
  },

  142: {
    room: "relay",
    effects: [["stat", "health", -1]],
    text: `You misjudge a coupling and a feedback spike catches your hand before you can pull clear — nothing serious, but enough to make you respect the junction's patience with a little more caution going forward.`,
    choices: [{ label: "Back to the Relay Junction", to: 135 }],
  },

  // ---- The Garden Deep ----

  148: {
    room: "gardendeep",
    text: `The Garden Deep shouldn't exist this far from any sun, and yet: bioluminescent growth in slow, patient sheets down every wall, pulsing in the same four-second rhythm as the station greenhouse, vastly older, vastly more of it.`,
    choices: [
      { label: "Follow the growth to its source", luck: { pass: 150, fail: 151 } },
      { label: "Rest here a while and just watch it pulse", to: 154 },
      { label: "Take a sample for the record", needItem: "scanner", to: 153 },
      { label: "Back to the Threshold", to: 102 },
    ],
  },

  154: {
    room: "gardendeep",
    effects: [["stat", "sanity", 1], ["stat", "health", 1]],
    text: `You sit down among the growth and let the four-second pulse set the pace for a while — for your breathing, your heartbeat, the low hum of thoughts you've been too busy to actually finish thinking since you landed.

It is, against every reasonable expectation for a lightless cavern half a threshold's-depth beneath an alien listening structure, one of the more restful stretches of your entire posting.`,
    choices: [{ label: "Back to the Garden Deep", to: 148 }],
  },

  150: {
    room: "gardendeep",
    effects: [["flag", "knowGardenSource"], ["stat", "sanity", -1]],
    text: `The growth converges, eventually, on a single point: not a light source, not a machine, but something closer to a heart, if a heart could photosynthesize. It has been beating, you realize, this entire visit, underneath every pulse you've been unconsciously timing your breath to since the station greenhouse.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  151: {
    room: "gardendeep",
    effects: [["stat", "health", -2]],
    text: `You lose the thread of growth in a fold of the passage that seems to actively discourage backtracking, and it takes real effort — and one badly scraped knee — to find your way back out to familiar ground.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  153: {
    room: "gardendeep",
    effects: [["add", "xenosample"], ["stat", "sanity", -1]],
    text: `Your scanner logs readings that don't resolve into anything your training prepared you for, and you take a second XENO SAMPLE mostly out of professional habit, fully aware that "professional habit" stopped being an adequate framework for this posting several rooms ago.`,
    choices: [{ label: "Back to the Garden Deep", to: 148 }],
  },

  // ---- Readiness gate ----

  155: {
    room: "threshold",
    effects: [["flag", "readyForCore"]],
    text: `You've seen enough of the Threshold's outer chambers to stop feeling like a trespasser and start feeling like a very small, very late guest at a gathering that has been going on for a very long time.

Whatever you decide at the center of this place, you'll decide it as someone who at least tried to understand what's actually being offered.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  // ---- Threshold Antechamber ----

  156: {
    room: "threshold",
    text: `A side alcove off the main threshold holds what might generously be called storage — objects left behind by visitors considerably less human-shaped than you, alongside a few items that are unmistakably, heartbreakingly ordinary: a thermos, a pair of reading glasses, a child's drawing, gone soft with age.`,
    choices: [{ label: "Search carefully", luck: { pass: 157, fail: 158 } }],
  },

  157: {
    room: "threshold",
    effects: [["add", "traumakit"]],
    text: `Tucked behind the ordinary keepsakes, a sealed TRAUMA KIT, station-issue, decades out of date but still sound. Whoever left it clearly meant it as a courtesy for whoever came looking next. You add it to your kit with real gratitude.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  158: {
    room: "threshold",
    effects: [["stat", "health", -2]],
    text: `You disturb a precarious stack of what might be centuries-old debris and it comes down around your ankles in a small, undignified avalanche. Nothing serious. Your pride and your shin both take the worse of it.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  // ---- Old Signal Cache (off the Choir) ----

  159: {
    room: "choir",
    effects: [["flag", "knowOldSignal"], ["stat", "sanity", -1]],
    text: `Buried under the layered voices, older and quieter than the rest, is a signal that doesn't match the Choir's grammar at all — clipped, urgent, unmistakably human, and decades old by any calendar you trust. It takes you a long moment to place it: an Arecibo-era test broadcast, one of the earliest, half-forgotten transmissions Earth ever sent out into the dark.

The Choir kept it. Not filed away — kept, the way you'd keep a first letter from someone you'd grown to love.`,
    choices: [{ label: "Back to the Choir", to: 104 }],
  },

  // ---- The Watchers' Gallery ----

  190: {
    room: "watchers",
    text: `The Gallery holds what might be statues, might be recordings, might be something with no equivalent in any human museum — likenesses, at least, of a great many of the Choir's members, arranged without any apparent hierarchy, each one simply given equal room to be looked at.`,
    choices: [
      { label: "Examine the nearest figure", to: 192 },
      { label: "Search for Earth's placeholder entry", needFlag: "knowEarthEntry", to: 194 },
      { label: "Try to leave a mark of your own", luck: { pass: 198, fail: 199 } },
      { label: "Back to the Threshold", to: 102 },
    ],
  },

  192: {
    room: "watchers",
    effects: [["flag", "knowGallery"], ["stat", "sanity", -1]],
    text: `The nearest figure resolves, the longer you look, into something that was very obviously proud of what it looked like — an aesthetic entirely alien and entirely, recognizably, the product of someone who cared how they were remembered. You find that oddly moving, in a gallery otherwise built on a scale too vast for individual vanity to matter.`,
    choices: [{ label: "Back to the Gallery", to: 190 }],
  },

  194: {
    room: "watchers",
    effects: [["stat", "sanity", -1]],
    text: `Earth's placeholder stands exactly where the Deep Archive's entry said it would — empty, unshaped, waiting, a blank space left with the same careful respect as every finished likeness around it. Not a judgment. An invitation, held open for longer than your species has known it existed.`,
    choices: [{ label: "Back to the Gallery", to: 190 }],
  },

  198: {
    room: "watchers",
    effects: [["stat", "sanity", 1], ["flag", "knowLeftMark"]],
    text: `You're not sculptor, recording device, or whatever passes for an artist among the Choir's membership, but the Gallery seems to accept the attempt anyway — a small, plain, entirely human mark, added to a wall that has apparently never once turned away an honest effort.`,
    choices: [{ label: "Back to the Gallery", to: 190 }],
  },

  199: {
    room: "watchers",
    effects: [["stat", "sanity", -1]],
    text: `Whatever you attempt doesn't take — the Gallery's medium, if it even has one you'd recognize, isn't cooperating today. You step back before frustration curdles into something you'd regret directing at a room full of strangers' memorials.`,
    choices: [{ label: "Back to the Gallery", to: 190 }],
  },

  // ---- Ambient: the Threshold's rhythm ----

  204: {
    room: "threshold",
    text: `You stop moving through the Threshold for a moment and simply let it move around you instead — a slow structural pulse, barely perceptible, timed to something considerably larger than the Choir's own resonance.`,
    choices: [{ label: "Try to place the rhythm", luck: { pass: 206, fail: 207 } }],
  },

  206: {
    room: "threshold",
    effects: [["flag", "knowRhythm"], ["stat", "sanity", 1]],
    text: `It clicks, all at once: the pulse matches the greenhouse, the array's old sonar, the Garden Deep's bioluminescence, all of it, one single patient heartbeat running underneath this entire structure and, you now suspect, underneath the original signal itself. You've been standing inside the answer to a question you didn't know you were still asking.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  207: {
    room: "threshold",
    effects: [["stat", "sanity", -1]],
    text: `You can't quite resolve the pattern, and the effort of trying leaves you with the distinct, uncomfortable sense of a rhythm you'll keep hearing in quiet moments for a long time after you leave this place, whether you ever place it or not.`,
    choices: [{ label: "Back to the Threshold", to: 102 }],
  },

  // ============ THE VESSEL'S HEART (climax) ============

  160: {
    room: "vesselcore",
    text: `The passages converge on a chamber that makes the Choir feel like an antechamber — vast, resonant, and at its center, something that isn't quite a shape, the way the contact structure on the surface wasn't quite a door. It has been waiting here, you understand now, for considerably longer than Ketos-9 has existed, patient the way only something that doesn't fear running out of time can afford to be.

"You came further than most," it says, in the layered Choir-voice, warm with something that might be pride. "Now. What will you carry back, and what will you leave here with us?"`,
    choices: [
      { label: "Send the full transmission — let Earth choose for itself", needItem: "relaykey", to: 162 },
      { label: "Send the filtered report — protect them a while longer", needFlag: "knowFilteredRelay", to: 164 },
      { label: "Offer the Resonant Core, and join the Choir", needItem: "resonantcore", to: 166 },
      { label: "Seal the Threshold behind you, for now", to: 168 },
      { label: "Present the Codex Fragment — propose formal contact terms", needItem: "codexfragment", to: 170 },
      { label: "Say nothing. Simply leave", to: 172 },
    ],
  },

  162: {
    room: "vesselcore",
    effects: [["stat", "sanity", -1]],
    text: `You commit the relay key, and everything — the corkboard, the medical log, Achebe's notes, the Codex's careful map of the question — goes out to Earth complete, uncensored, and completely out of your hands the moment it leaves the dish.

The presence inclines toward you, something like respect in the gesture. "That is the hardest transmission your species has ever sent," it says. "Also, I think, the most honest one. We will be listening for the reply. So, I imagine, will you."`,
    choices: [{ label: "Read the epilogue", to: 174 }],
  },

  164: {
    room: "vesselcore",
    effects: [["stat", "sanity", -1]],
    text: `You send the careful version instead, buying Earth time to catch up to a truth you're not sure it's ready to receive all at once. The presence doesn't object — if anything, it seems to have expected this, the way a patient teacher expects a student to need the material in stages.

"We have never been in a hurry," it says. "Send them the rest when you believe they're ready. We will still be here."`,
    choices: [{ label: "Read the epilogue", to: 176 }],
  },

  166: {
    room: "vesselcore",
    effects: [["stat", "sanity", -2], ["flag", "joinedChoir"]],
    text: `You offer the Resonant Core back, and something in the gesture is understood immediately and completely — an answer given in the Choir's own language rather than translated into yours. The layered voices shift, briefly, to make room for one more.

It doesn't hurt. It doesn't feel like loss, exactly, though you suspect the people who knew you before this moment might disagree. It feels like finally finishing a sentence you'd been leaving open your entire life without realizing it.`,
    choices: [{ label: "Read the epilogue", to: 178 }],
  },

  168: {
    room: "vesselcore",
    effects: [["flag", "sealedThreshold"], ["stat", "sanity", 1]],
    text: `You choose the harder, quieter answer: not now. Not like this, not delivered by one exhausted xenolinguist standing in for an entire species that never got a vote.

The presence doesn't argue. "Caution is also an answer," it says, without any detectable disappointment. "We have been patient for longer than your species has existed. We can be patient a while longer, for the rest of you to catch up to the one of you standing here."`,
    choices: [{ label: "Read the epilogue", to: 180 }],
  },

  170: {
    room: "vesselcore",
    effects: [["stat", "sanity", -1], ["flag", "formalContact"]],
    text: `You present the Codex Fragment back, annotated now in your own careful linguistic hand — not a surrender and not a refusal, but the opening move of an actual negotiation between equals, exactly the kind Achebe spent five weeks trying to build the vocabulary for.

The presence studies your annotations for a long moment. "A protocol," it says, turning the word over like it's pleased to have a new one. "Yes. I believe we can work within a protocol."`,
    choices: [{ label: "Read the epilogue", to: 182 }],
  },

  172: {
    room: "vesselcore",
    text: `You turn and walk back out through the Garden Deep, the Relay Junction, the Deep Archive, the Choir, and the Threshold, all the way to surface daylight that isn't really daylight, without giving an answer at all.

Nothing stops you. Nothing seems even mildly surprised. The structure, you're fairly sure, has met this response before, from someone else, a long time ago, and knows better than you do that "not yet" and "never" are not the same word.`,
    choices: [{ label: "Read the epilogue", to: 184 }],
  },

  174: {
    room: "vesselcore",
    text: `Earth takes eleven days to reply, and when it does, it isn't one message — it's thousands, from every government, every faith, every argument humanity has ever had about itself, all arriving at once, contradictory and magnificent and completely, gloriously unfiltered.

You stay at Ketos-9 to help translate the flood. It is, by a wide margin, the hardest and most hopeful work you have ever done.`,
    choices: [{ label: "One year later...", to: 220 }],
  },

  220: {
    room: "vesselcore",
    type: "act-end",
    text: `EPILOGUE — FULL DISCLOSURE

A permanent translation office now operates out of Ketos-9, three shifts, never fully caught up, gladly so. You've stopped thinking of yourself as a xenolinguist and started thinking of yourself as something closer to a switchboard operator for a species finally, messily, learning to speak with one voice to something that's been waiting for it to try.

The corkboard is still up in Commons. Somebody added your photo to it, weeks ago, without asking. You haven't taken it down.`,
  },

  176: {
    room: "vesselcore",
    text: `The Directorate accepts your report at face value, commends the station, and quietly funds a follow-up mission for "further study" — never quite catching up to how much further the study already went.

You carry the rest of it alone for a long time, the way Osei and Achebe apparently learned to. Some nights you're certain that was the right call. Other nights, considerably less so.`,
    choices: [{ label: "One year later...", to: 222 }],
  },

  222: {
    room: "vesselcore",
    type: "act-end",
    text: `EPILOGUE — A CAREFUL TRUTH

You finally send the rest of it, quietly, a year to the day after the first careful version — not because you decided Earth was ready, but because you realized you'd been the one deciding, alone, for far too long, and that was never actually your call to keep making.

The Directorate is furious for exactly one news cycle. Then, mostly, relieved.`,
  },

  178: {
    room: "vesselcore",
    text: `Ketos-9 logs you as missing, presumed departed, in a report the Directorate will spend years trying to reconcile with the recovered station data.

You are not missing. You are exactly where you meant to be, layered now among voices that span more of the galaxy than your species has yet mapped, adding your own thread to a tally that will keep being added to, patiently, long after everyone who ever knew your name has finished forgetting it.`,
    choices: [{ label: "One year later...", to: 224 }],
  },

  224: {
    room: "vesselcore",
    type: "act-end",
    text: `EPILOGUE — THE CHOIR, NEWLY LARGER

Time, here, stopped meaning quite what it used to. You are aware, distantly and without alarm, that Ketos-9 has changed hands twice, that Earth has asked its careful questions and received its careful answers, that none of it required you to intervene.

You are not gone. You are simply, finally, part of something that was never in a hurry, and you find you aren't either, anymore.`,
  },

  180: {
    room: "vesselcore",
    text: `You seal the deeper Threshold as best a lone xenolinguist can seal something that vast, file a report describing exactly what the Directorate needs to know and not one careful word more, and recommend, in the strongest terms available to you, that Ketos-9 be left listening, and left alone, until humanity is asking better questions than "is it dangerous."

The array keeps listening. So, quietly, do you.`,
    choices: [{ label: "One year later...", to: 226 }],
  },

  226: {
    room: "vesselcore",
    type: "act-end",
    text: `EPILOGUE — NOT YET

You return to Ketos-9 once a year, unofficially, to check the seal and sit with the Threshold a while. It has never once tried to reopen on its own. You've started to suspect that was never really the risk — the risk was always whether humanity would go looking again before it was ready, and that part, at least, you can still watch over.`,
  },

  182: {
    room: "vesselcore",
    text: `You spend the next several years as humanity's first, and for a long while only, formally accredited translator to something that was cataloguing your species before your grandparents were born.

It is slow, exacting, occasionally maddening work, building a relationship neither side gets to define alone. Achebe's whiteboard, you think, would be proud of how far the grammar has come. First Contact Protocol, it turns out, was never a document. It was always going to be a job.`,
    choices: [{ label: "One year later...", to: 228 }],
  },

  228: {
    room: "vesselcore",
    type: "act-end",
    text: `EPILOGUE — PROTOCOL

The protocol has a name now, officially filed, co-authored, genuinely bilateral in a way nothing between your species and anything else has ever managed before. You didn't get everything you wanted in the drafting. Neither did they. That, it turns out, is roughly how you know it's a real agreement.`,
  },

  184: {
    room: "vesselcore",
    text: `You write a report that is, technically, entirely true and somehow explains nothing, and you request reassignment the moment the relief crew's transport clears the crater rim.

Ketos-9 stays staffed, stays listening, stays exactly as strange as you left it. You never go back. You think about it, some nights, in the particular way you think about doors you're fairly sure you could still choose to open, if you ever decided you were ready to stop being afraid of what's patiently waiting on the other side.`,
    choices: [{ label: "One year later...", to: 230 }],
  },

  230: {
    room: "vesselcore",
    type: "act-end",
    text: `EPILOGUE — THE ONE WHO WALKED AWAY

You take a teaching post, dead languages again, comfortably ordinary. You're good at it. Nobody in your lecture hall knows what you actually saw on the crater rim, and most days that's exactly the amount of peace you were hoping reassignment would buy you.

Most days.`,
  },

  // ============ DEATHS ============

  90: {
    room: null,
    type: "death",
    text: `Your vitals give out somewhere between one corridor and the next, and the station's lights don't so much as flicker in response. Ketos-9 keeps running exactly as it has for five weeks — patient, self-sufficient, and now, again, unstaffed.

Far out on the crater rim, if it notices at all, it doesn't say so.

YOUR TRANSMISSION ENDS HERE.`,
  },

  92: {
    room: null,
    type: "death",
    text: `Your suit's reserve reads zero, then the display itself dims, and the last thing you register is how quiet true vacuum actually is — no gasp, no struggle the old films promised you, just a very small, very final absence of sound.

The station logs one more unresolved entry. It will not be the last.

YOUR TRANSMISSION ENDS HERE.`,
  },

  94: {
    room: null,
    type: "death",
    text: `Somewhere in the station's corridors, you stop being able to tell your own thoughts from the ones arriving a half-second early, and the distinction that mattered so much an hour ago quietly stops mattering at all.

You sit down against a bulkhead that pulses, faintly, once every four seconds. You find, to your own vanishing surprise, that you don't mind keeping time with it.

YOUR TRANSMISSION ENDS HERE.`,
  },

};
