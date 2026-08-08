// ASHFALL — story data. Act One draft.
// Page numbers are deliberately scattered, like the old paperbacks.

// 16x16 portrait: Runner Kele Adeyemi-Voss, ash-grey coat collar.
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
  "...kkccckkk.....",
  "..kccccccccck...",
  ".kccccrrccccck..",
  ".kcccc..cccccc..",
  ".kkkk....kkkk...",
];

const META = {
  title: "ASHFALL",
  subtitle: "An Interactive Gamebook — Act One",
  startPage: 1,
  backdrop: "ashfalldrift",
  player: {
    name: "Runner Kele Adeyemi-Voss",
    role: "Salvage Courier, Harrow's Rest",
    bio: "Three years since the Hush began — a fine grey ash that started falling everywhere at once and never stopped, and a world that didn't end loudly so much as grow quiet, then quieter, then walk calmly out into the drift and not come back. The last supply convoy out of Harrow's Rest went dark six days ago, headed for the Deep Ash. You're the one they send when the answer matters more than the odds.",
  },
  stats: { health: 10, oxygen: 10, sanity: 10 },
  deathPages: { health: 90, oxygen: 92, sanity: 94 },
};

const ITEMS = {
  pryrod:     { name: "Pry Rod",       desc: "Salvage-grade, worn smooth at the grip. Opens what doesn't want opening.", slot: "held" },
  handlamp:   { name: "Hand Lamp",     desc: "Crank-charged, no batteries to run dry. Honest light in a dishonest world.", slot: "held" },
  shivblade:  { name: "Shiv Blade",    desc: "Not for people. For crates, mostly, and the occasional bad decision.", slot: "held" },
  medsupply:  { name: "Med Supply",    desc: "Sealed field medical kit, pre-Hush manufacture. USE: +4 health.", use: { health: 4 } },
  stimpack:   { name: "Stimpack",      desc: "Keeps you moving. Costs you something for the privilege. USE: +3 health, -1 sanity.", use: { health: 3, sanity: -1 } },
  waterration: { name: "Water Ration", desc: "Filtered, flat, entirely unglamorous. USE: +2 health, +1 sanity.", use: { health: 2, sanity: 1 } },
  painkillers: { name: "Painkillers",  desc: "Take the edge off, and a little more besides. USE: +3 sanity, -1 health.", use: { sanity: 3, health: -1 } },
  luckycoin:  { name: "Lucky Coin",    desc: "Pre-Hush currency, worthless as money, warm in your pocket regardless. +1 on luck tests.", luckBonus: true },
  ashmask:    { name: "Filter Mask",   desc: "Keeps the worst of the drift out of your lungs. Wear it against the ash.", slot: "head" },
  duncoat:    { name: "Dun Coat",      desc: "Heavy canvas, ash-colored on purpose. Wear it against the ash.", slot: "body" },
  scavgloves: { name: "Scavenger Gloves", desc: "Reinforced palm, good grip on broken things. Wear them against the ash.", slot: "hands" },
  treadboots: { name: "Tread Boots",   desc: "Deep lugs, quiet in drift. Wear them against the ash.", slot: "feet" },
  filterpack: { name: "Filter Pack",   desc: "Backup air filtration, full cartridge. Wear it against the ash.", slot: "back" },
  convoymanifest: { name: "Convoy Manifest", desc: "The missing team's own cargo log, last entries increasingly personal." },
  hushsample: { name: "Hush Sample",   desc: "A sealed vial of the ash itself, oddly warm, oddly patient." },
  greyheart:  { name: "Grey Heart",    desc: "Not stone, not metal — something that pulses, faintly, in your pack, once every few seconds." },
  settlementledger: { name: "Settlement Ledger", desc: "Harrow's Rest's own founding records, considerably more informed about the Hush than anyone currently running the settlement." },
  warmstone:  { name: "Warm Stone",    desc: "Found, not mined. It holds heat the way a held hand holds heat, and for roughly the same reason." },
};

const ROOMS = {
  outpost:        { name: "Harrow's Rest",   col: 0, row: 0, icon: "⛺" },
  ashfields:      { name: "The Ash Fields",  col: 1, row: 0, icon: "❋" },
  depot:          { name: "Old Supply Depot", col: 2, row: 0, icon: "◇" },
  transitstation: { name: "Transit Station", col: 3, row: 0, icon: "▲" },
  sanctuary:      { name: "The Sanctuary",   col: 0, row: 1, icon: "✦" },
  bunker:         { name: "Research Bunker", col: 1, row: 1, icon: "◈" },
  markets:        { name: "The Grey Market", col: 2, row: 1, icon: "◎" },
  overwatch:      { name: "Overwatch Tower", col: 3, row: 1, icon: "☆" },
  archive:        { name: "City Archive",    col: 0, row: 2, icon: "❦" },
  greenhouse:     { name: "The Greenhouse",  col: 1, row: 2, icon: "☘" },
  thedeep:        { name: "The Deep Ash",    col: 2, row: 2, icon: "☠" },
  convoy:         { name: "Convoy's End",    col: 3, row: 2, icon: "◉" },
  // Act Two — the Hearth
  sourcegate:     { name: "The Source Gate", col: 0, row: 3, icon: "◐" },
  voices:         { name: "The Voices",      col: 1, row: 3, icon: "❦" },
  ledgerhall:     { name: "The Ledger Hall", col: 2, row: 3, icon: "◇" },
  emberwell:      { name: "The Ember Well",  col: 3, row: 3, icon: "☆" },
  hollowedtown:   { name: "The Hollowed Town", col: 0, row: 4, icon: "▲" },
  brink:          { name: "The Brink",       col: 1, row: 4, icon: "☠" },
  heart:          { name: "The Hearth's Heart", col: 2, row: 4, icon: "☥" },
};

const PAGES = {

  // ============ HARROW'S REST ============

  1: {
    room: "outpost",
    effects: [["add", "pryrod"]],
    text: `Harrow's Rest keeps the ash off with tarps, angled roofs, and a discipline about doors that took the settlement a full year of bad lessons to develop properly. Quartermaster Osei hands you a PRY ROD and the convoy's last known heading without much ceremony — six days overdue isn't panic yet, but it's close enough that nobody's pretending otherwise.

"Manifest says they were chasing a rumor near the Deep Ash," Osei says. "Bigger cache than usual. Or something else. Find out which."`,
    choices: [
      { label: "Check the supply cache before heading out", to: 3 },
      { label: "Talk to Osei about the convoy", to: 5 },
      { label: "Head into the ash", to: 8 },
    ],
  },

  3: {
    room: "outpost",
    effects: [["add", "handlamp"], ["add", "waterration"]],
    text: `The cache issues you a HAND LAMP, crank-charged and dependable, and a WATER RATION for the road. Harrow's Rest doesn't have much to spare, but it spares what it can for a runner headed toward the Deep.`,
    choices: [{ label: "Head into the ash", to: 8 }],
  },

  5: {
    room: "outpost",
    effects: [["add", "settlementledger"], ["stat", "sanity", -1]],
    text: `Osei's more forthcoming than usual, maybe because six days is starting to weigh on her too. "The founding ledger's yours if you want it," she says, handing over a battered SETTLEMENT LEDGER. "Written the first year, when people still thought the Hush might be temporary. There's things in there the council doesn't love people reading. Read them anyway. Might help."`,
    choices: [{ label: "Head into the ash", to: 8 }],
  },

  // ============ INTO THE ASH (hub) ============

  8: {
    room: "outpost",
    text: `Beyond Harrow's Rest walls, the drift starts almost immediately — grey, fine, endless, settling on everything with the patience of something that has nowhere else to be. Routes lead toward the open ash fields, an old supply depot, a transit station half-swallowed by drift, and a handful of other settlement fixtures your convoy would have passed on the way out.`,
    choices: [
      { label: "The Ash Fields", to: 10 },
      { label: "Old Supply Depot", to: 20 },
      { label: "Transit Station", to: 30 },
      { label: "The Sanctuary", to: 40 },
      { label: "Research Bunker", to: 50 },
      { label: "The Grey Market", to: 60 },
      { label: "Overwatch Tower", to: 70 },
      { label: "City Archive", to: 80 },
      { label: "The Greenhouse", to: 88 },
      { label: "Checkpoint Ruins", to: 190 },
      { label: "You've gathered enough. Head for the Deep Ash", to: 95 },
    ],
  },

  // ============ THE ASH FIELDS ============

  10: {
    room: "ashfields",
    text: `The open fields are where the drift is thickest, ash piled in slow dunes over what used to be farmland, silent except for the faint, constant hiss of more ash falling. Tracks — recent, multiple sets — head deeper in, toward the Deep.`,
    choices: [
      { label: "Follow the tracks", luck: { pass: 12, fail: 13 } },
      { label: "Wait and watch the ash settle", to: 15 },
      { label: "Search a drift-buried vehicle", to: 14 },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  12: {
    room: "ashfields",
    effects: [["add", "luckycoin"], ["stat", "sanity", -1]],
    text: `The tracks hold clean for longer than drift conditions should allow, and following them turns up a dropped LUCKY COIN, pre-Hush currency, worn smooth by a nervous thumb. Whoever dropped it was moving fast, and moving scared.`,
    choices: [{ label: "Back to the Ash Fields", to: 10 }],
  },

  13: {
    room: "ashfields",
    effects: [["stat", "sanity", -1]],
    text: `The tracks vanish under fresh fall before you've gone far, the ash filling every depression with the same patient indifference it fills everything else. You stand a moment in a field with no landmarks, letting your bearings settle before they properly scatter.`,
    choices: [{ label: "Back to the Ash Fields", to: 10 }],
  },

  14: {
    room: "ashfields",
    effects: [["add", "medsupply"], ["stat", "sanity", -1]],
    text: `A drift-buried transport, pre-Hush, yields a sealed MED SUPPLY kit from its cab — and, in the passenger seat, a set of belongings arranged with the same careful, deliberate calm you've heard described from a dozen other "walked out" accounts. Whoever left this vehicle didn't crash it. They parked it.`,
    choices: [{ label: "Back to the Ash Fields", to: 10 }],
  },

  // ============ OLD SUPPLY DEPOT ============

  20: {
    room: "depot",
    text: `The depot's roof has held better than most, keeping a fair stretch of the warehouse floor merely dusty instead of drift-buried. Shelving stands mostly intact, picked over by prior runs but not stripped clean.`,
    choices: [
      { label: "Search the loading dock", to: 22 },
      { label: "Search for a working vehicle", luck: { pass: 25, fail: 26 } },
      { label: "Search the office", to: 24 },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  22: {
    room: "depot",
    effects: [["add", "duncoat"]],
    text: `The loading dock's lockers hold a DUN COAT, heavy canvas, ash-colored on purpose by whoever stocked this depot for exactly the world that eventually arrived. Someone here was planning for the Hush before it had a name.`,
    choices: [{ label: "Back to the depot", to: 20 }],
  },

  24: {
    room: "depot",
    effects: [["flag", "knowDepotLog"], ["stat", "sanity", -1]],
    text: `The office logbook tracks routine shipments right up until it doesn't — the final entries clipped, professional, then simply stop mid-week with no note of closure. Whoever managed this depot didn't evacuate. They just, at some point, stopped needing to log anything.`,
    choices: [{ label: "Back to the depot", to: 20 }],
  },

  // ============ TRANSIT STATION ============

  30: {
    room: "transitstation",
    text: `The transit station's platforms are half-swallowed by drift, an old rail car derailed and canted at the edge of the ash, doors hanging open on a compartment nobody's bothered to fully search.`,
    choices: [
      { label: "Search the derailed car", to: 32 },
      { label: "Search the ticket booth", to: 35 },
      { label: "Check the station's departure boards", to: 34 },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  32: {
    room: "transitstation",
    effects: [["add", "shivblade"], ["stat", "sanity", -1]],
    text: `The rail car holds a SHIV BLADE tucked under a seat, and rows of belongings left in orderly rows along the aisle — bags, coats, a few personal effects, arranged like passengers stepped off for a scheduled stop and simply never got back on.`,
    choices: [{ label: "Back to the station", to: 30 }],
  },

  34: {
    room: "transitstation",
    effects: [["flag", "knowDepartureBoard"], ["stat", "sanity", -1]],
    text: `The departure board's final scheduled service is dated the third week of the Hush, destination field left conspicuously blank on the printed schedule — as if whoever set the final route knew exactly where it was going and simply didn't think the word belonged on a public board.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  // ============ THE SANCTUARY ============

  40: {
    room: "sanctuary",
    text: `The Sanctuary is where Harrow's Rest sends anyone who wants to talk before deciding anything permanent about the ash — a quiet chapel-turned-waystation, ash swept carefully off its steps every morning by someone whose job that apparently still is.`,
    choices: [
      { label: "Sit with the caretaker a while", luck: { pass: 42, fail: 43 } },
      { label: "Leave a note in the guestbook", to: 45 },
      { label: "Read the guestbook", to: 44 },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  42: {
    room: "sanctuary",
    effects: [["add", "painkillers"], ["stat", "sanity", 1]],
    text: `The caretaker doesn't ask what's bothering you, just makes tea and lets the silence do the actual conversation. Before you leave, she presses a small tin of PAINKILLERS into your hand. "For the road," she says. "Or for whatever you find at the end of it."`,
    choices: [{ label: "Back to the Sanctuary", to: 40 }],
  },

  43: {
    room: "sanctuary",
    effects: [["stat", "sanity", -1]],
    text: `You can't quite settle into the stillness the way the Sanctuary clearly wants you to, some runner's instinct insisting on staying alert rather than accepting the caretaker's careful hospitality. She doesn't push. She just looks a little sad on your behalf as you leave early.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  44: {
    room: "sanctuary",
    effects: [["flag", "knowGuestbook"], ["stat", "sanity", -1]],
    text: `The guestbook is thick with entries spanning three years, most ending the same understated way: a name, a date, and the words "GONE TO SEE." Not goodbye. Not even really an ending. Just a simple, calm statement of intent, over and over, in dozens of different hands.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  // ============ RESEARCH BUNKER ============

  50: {
    room: "bunker",
    text: `The bunker predates the Hush by decades, a Cold-War-era relic repurposed at some point for climate research, its blast door propped permanently open by whoever last used it and never bothered to reseal.`,
    choices: [
      { label: "Search the research terminals", needAnyItem: ["handlamp"], to: 52 },
      { label: "Search the barracks", luck: { pass: 46, fail: 47 } },
      { label: "Feel your way in blind", luck: { pass: 52, fail: 54 } },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  52: {
    room: "bunker",
    effects: [["add", "hushsample"], ["flag", "knowBunker"], ["stat", "sanity", -1]],
    text: `The terminals, running on stubborn backup power, hold the last research project anyone here ever ran: atmospheric intervention, a global project to reverse the worst of the old climate collapse, deployed at scale three years ago. A sealed containment case yields a HUSH SAMPLE — a vial of the ash itself, warm, deliberate, entirely unlike inert particulate matter.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  54: {
    room: "bunker",
    effects: [["stat", "health", -2], ["stat", "sanity", -1]],
    text: `You crack a shin against unseen equipment in the dark and retreat, more embarrassed than hurt, without having learned anything the terminals might have offered a more careful visit.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  // ============ THE GREY MARKET ============

  60: {
    room: "markets",
    text: `The Grey Market is Harrow's Rest's least official institution — traders, other settlements' runners, and a general willingness to overlook where things came from as long as the price is fair. Word travels here faster than official channels.`,
    choices: [
      { label: "Ask around about the missing convoy", to: 62 },
      { label: "Ask about the warm glow at the Deep Ash", to: 65 },
      { label: "Trade for supplies", to: 64 },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  62: {
    room: "markets",
    effects: [["flag", "knowConvoyRumor"], ["stat", "sanity", -1]],
    text: `A trader who deals mostly in pre-Hush salvage has heard something: your convoy wasn't just chasing a supply cache. They were chasing a rumor about the Hush's actual source — a location, specific enough that at least one of them apparently believed it, calmly, entirely.`,
    choices: [{ label: "Back to the market", to: 60 }],
  },

  64: {
    room: "markets",
    effects: [["add", "stimpack"]],
    text: `You trade a bit of spare gear for a STIMPACK, the market's version of a going-away gift for anyone headed toward the Deep. Nobody here says good luck. They just nod, the way you nod at someone doing a job you're glad isn't yours.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  // ============ OVERWATCH TOWER ============

  70: {
    room: "overwatch",
    text: `The Overwatch Tower gives Harrow's Rest its only real vantage over the drift, a converted water tower topped with salvaged optics and a permanent, patient watch rotation.`,
    choices: [
      { label: "Scan the Deep Ash from up here", to: 72 },
      { label: "Scan the settlement's own perimeter", to: 75 },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  72: {
    room: "overwatch",
    effects: [["flag", "knowDeepView"], ["stat", "sanity", -1]],
    text: `Through the tower's optics, the Deep Ash resolves into something more structured than open wasteland — a faint, warm glow at its center, visible only through the thickest drift, pulsing at an interval you'll recognize later as entirely too regular to be weather.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  // ============ CITY ARCHIVE ============

  80: {
    room: "archive",
    text: `The old city archive survived the Hush better than most civic buildings, its climate-controlled vaults keeping records dry long after the rest of the city stopped needing them read.`,
    choices: [
      { label: "Search early Hush-era records", to: 82 },
      { label: "Search for personal letters left behind", to: 85 },
      { label: "Search for the research project's public filings", needFlag: "knowBunker", to: 84 },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  82: {
    room: "archive",
    effects: [["flag", "knowEarlyHush"], ["stat", "sanity", -1]],
    text: `Early records describe the Hush's first weeks with a kind of clinical panic that curdled, within a month, into something closer to relief — official bulletins growing calmer even as the ash thickened, as if whatever was falling was actively, deliberately soothing the people trying to document it.`,
    choices: [{ label: "Back to the archive", to: 80 }],
  },

  84: {
    room: "archive",
    effects: [["flag", "knowProjectFilings"], ["stat", "sanity", -2]],
    text: `The public filings for the atmospheric intervention project are heavily redacted, but the surviving language is unambiguous about intent: a desperate, last-resort attempt to reverse ecological collapse through engineered particulate deployment, approved in the project's final year with a note that "conventional safety review was expedited given severity of baseline trajectory."

They knew it was a gamble. They ran it anyway. The world was already ending slowly. They just changed how.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  // ============ THE GREENHOUSE ============

  88: {
    room: "greenhouse",
    text: `Against every reasonable expectation for a world under three years of endless grey ash, Harrow's Rest's greenhouse is thriving — green, humid, stubbornly alive, tended with a discipline the rest of the settlement reserves for water rationing.`,
    choices: [
      { label: "Ask the greenhouse keeper how it survives", to: 89 },
      { label: "Help with the day's watering", to: 86 },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  89: {
    room: "greenhouse",
    effects: [["add", "filterpack"], ["flag", "knowGreenhouse"], ["stat", "sanity", -1]],
    text: `"The ash isn't actually toxic to growth," the keeper says, handing over a spare FILTER PACK without being asked. "Took us a year to figure that out properly. It's toxic to hurry. Everything in here grows slow, careful, patient — same as everything out there seems to be asking the rest of us to do. Draw your own conclusions."`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  // ============ THE DEEP ASH ============

  95: {
    room: "outpost",
    text: `You've gathered what Harrow's Rest can offer — supplies, rumors, records, and a slowly accumulating unease about what "the source" might actually mean. The convoy's heading points straight into the Deep Ash, where the drift runs thickest and the overwatch tower's warm, patient glow waits at the center of everything.`,
    choices: [{ label: "Head into the Deep Ash", to: 96 }],
  },

  96: {
    room: "thedeep",
    text: `The Deep Ash makes the outer fields look sparse by comparison — drift piled in slow, deliberate dunes, visibility dropping to arm's length, and a warmth radiating up through the ground that has no business existing this far from anything resembling a heat source.

Your convoy's tracks converge here, all of them, headed toward a single point.`,
    choices: [{ label: "Follow the convergence", to: 97 }],
  },

  97: {
    room: "convoy",
    text: `The convoy's vehicles sit exactly where their crew parked them, deliberately, engines off, cargo undisturbed. And beyond them, gathered loosely around a low rise in the ash, your six missing colleagues, upright, unharmed, and — as you get close enough to be certain — entirely, calmly themselves.

Convoy lead Dara Nkemelu turns to meet you before you've fully processed what you're looking at. "You made good time," she says. "Come see what we found. It's not what the settlement's afraid it is."`,
    choices: [{ label: "Approach", to: 98 }],
  },

  98: {
    room: "convoy",
    effects: [["stat", "sanity", -1], ["flag", "knowSourceName"]],
    text: `"We call it the Hearth," Nkemelu says, "because that's what it feels like standing near it, not because anyone's confirmed what it actually is. It's not radiation. It's not a weapon. It's what's left of the intervention project, still running, still doing exactly the patient, slow work it was built for — just considerably more of it, and considerably stranger, than the people who launched it ever planned for."`,
    choices: [
      { label: "Ask how the convoy found this place", to: 195 },
      { label: "Ask what happened to everyone who's walked out over the years", to: 99 },
      { label: "Ask what the Hearth actually wants", to: 100 },
    ],
  },

  99: {
    room: "convoy",
    effects: [["stat", "sanity", -1], ["flag", "knowWalkedOut"]],
    text: `"Nothing happens TO them," Nkemelu says. "They're not consumed. They're included — folded into whatever the Hearth's actually doing to hold this planet together, the slow way, the patient way, instead of the fast catastrophic way we were headed before. I've spoken to some of them. They still sound like themselves. They just also, now, sound like considerably more than themselves."`,
    choices: [
      { label: "Ask if she ever regrets not walking out herself", to: 198 },
      { label: "Continue the conversation", to: 100 },
    ],
  },

  198: {
    room: "convoy",
    effects: [["stat", "sanity", -1]],
    text: `She considers it honestly rather than brushing it off. "Some days," she says. "Mostly ordinary regret — a particular meal, a particular argument I never finished with my brother. Never the kind of regret that makes me wish I'd said yes already. Those are different feelings. I wish more people understood that before they asked me."`,
    choices: [{ label: "Continue the conversation", to: 100 }],
  },

  100: {
    room: "convoy",
    effects: [["flag", "act2"]],
    text: `"What it wants," Nkemelu says, "is roughly what anything patient and enormous wants from a new visitor: honesty, and enough time to actually explain itself before you decide anything permanent. You've earned that much just by getting here with your eyes open instead of your nerve broken."

Beyond the rise, past where the convoy stopped, the source of that warmth waits — closer now than the overwatch tower's glimpse ever suggested, patient as the ash itself.

— END OF ACT ONE —`,
    choices: [{ label: "Go closer", to: 101 }],
  },

  // ============ ACT TWO — THE HEARTH ============

  101: {
    room: "convoy",
    effects: [["stat", "sanity", -1]],
    text: `Nkemelu doesn't follow you past the rise. "This part," she says, "you do alone. It's not a test. Some conversations only work one voice at a time, and this one's been waiting three years for yours specifically to show up."

Beyond the rise, the drift thins into something less like weather and more like architecture — passages of settled ash packed firm enough to walk, warmth rising steadily from below.`,
    choices: [{ label: "Descend", to: 102 }],
  },

  102: {
    room: "sourcegate",
    text: `The Source Gate is where the Hearth's actual structure begins — corridors of compacted, warm ash, glowing faintly amber at every seam, vast enough to make the convoy site above feel like a doorstep.

Passages lead toward a grove of settled voices, a hall of records, the warmth's actual source, a preserved fragment of the world before, and a section radiating heat fierce enough to be genuinely dangerous.`,
    choices: [
      { label: "The Voices", to: 104 },
      { label: "The Ledger Hall", to: 114 },
      { label: "The Brink", to: 124 },
      { label: "The Hollowed Town", to: 134 },
      { label: "Wait and feel the warmth breathe", to: 140 },
      { label: "Check a warm alcove nearby", to: 197 },
      { label: "Rest a moment", to: 103 },
      { label: "Take stock of everything you've learned", to: 150 },
      { label: "You're ready. Go to the Hearth's Heart", needFlag: "readyForHeart", to: 160 },
    ],
  },

  103: {
    room: "sourcegate",
    effects: [["stat", "sanity", 1], ["stat", "health", 1]],
    text: `You sit against warm, settled ash and let your pulse slow into whatever rhythm this place keeps. Down here, stillness doesn't feel wasted. It might be the only currency that actually spends cleanly.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  // ---- The Voices ----

  104: {
    room: "voices",
    text: `The Voices is a grove of settled warmth where every "walked out" resident of the region seems to have gathered, layered into a single patient hum you can, with effort, pick individual threads from.`,
    choices: [
      { label: "Listen for someone from Harrow's Rest specifically", luck: { pass: 106, fail: 107 } },
      { label: "Search for the intervention project's engineers here too", to: 110 },
      { label: "Listen for the very first voice here", to: 108 },
      { label: "Back to the Source Gate", to: 102 },
    ],
  },

  106: {
    room: "voices",
    effects: [["add", "warmstone"], ["flag", "knowVoicesFound"]],
    text: `You find one — a settler who walked out the first year, recognizably themselves, glad, unmistakably, that someone finally came looking rather than simply mourning quietly from a distance. Something in the grove, pleased, presses a WARM STONE into your keeping, heat radiating from it like a held hand.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  107: {
    room: "voices",
    effects: [["stat", "sanity", -2]],
    text: `You reach for one specific thread and the whole grove answers at once instead, dozens of settled lives arriving without the context that would make any one of them individually bearable. It passes. You keep both hands on warm stone until it does.`,
    choices: [{ label: "Back to the Voices", to: 104 }],
  },

  108: {
    room: "voices",
    effects: [["flag", "knowFirstVoice"], ["stat", "sanity", -1]],
    text: `The very first voice here predates the Hush's public announcement by several months — one of the intervention project's own engineers, apparently, who understood exactly what the deployment would do and chose, quietly, to be first rather than explain it to anyone who might have stopped it.`,
    choices: [{ label: "Back to the Voices", to: 104 }],
  },

  // ---- The Ledger Hall ----

  114: {
    room: "ledgerhall",
    text: `The Ledger Hall holds a complete accounting of everyone the Hearth has ever folded in — not a graveyard, a genuine record, names and dates and, disturbingly, ongoing status updates that read like a very long, very patient census.`,
    choices: [
      { label: "Search for the convoy's own future entries", to: 116 },
      { label: "Search for Harrow's Rest's very first walked-out settler", to: 111 },
      { label: "Search for the project's original engineers", to: 118 },
      { label: "Back to the Source Gate", to: 102 },
    ],
  },

  116: {
    room: "ledgerhall",
    effects: [["flag", "knowOwnEntry"], ["stat", "sanity", -1]],
    text: `There's already a page started for your own convoy, thin, recent, still being filled in — including, unsettlingly, a blank line clearly reserved for whatever you decide today. The Hearth, like the networks other basins apparently keep too, started cataloguing you before you arrived.`,
    choices: [{ label: "Back to the Ledger Hall", to: 114 }],
  },

  118: {
    room: "ledgerhall",
    effects: [["flag", "knowEngineers"], ["stat", "sanity", -1]],
    text: `The project's original engineering team fills an early page, most entries dated within the Hush's first year — people who built the intervention, watched what it actually did, and made the same quiet choice as everyone who's followed them since, apparently convinced it was the more honest option available.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  // ---- The Brink ----

  124: {
    room: "brink",
    text: `The Brink runs hot enough to feel through your boots, ash here glowing faint amber rather than settled grey, a section of the Hearth's structure clearly under more active strain than the rest.`,
    choices: [
      { label: "Investigate the strain directly", luck: { pass: 126, fail: 127 } },
      { label: "Try to reinforce the seam yourself", to: 120 },
      { label: "Take a sample from the glowing seam", needItem: "handlamp", to: 128 },
      { label: "Back to the Source Gate", to: 102 },
    ],
  },

  126: {
    room: "brink",
    effects: [["flag", "knowBrinkCause"], ["stat", "sanity", -1]],
    text: `The strain traces to something outside the Hearth's own patient design — distant settlements, further out than Harrow's Rest, attempting to burn or blast their way through drift zones rather than working with the Hush's slow logic. The Hearth is absorbing the disruption, but not without visible cost.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  127: {
    room: "brink",
    effects: [["stat", "health", -2], ["stat", "sanity", -1]],
    text: `You get close enough to feel real heat before good sense pulls you back, singed at the edges and considerably more respectful of a section of tunnel that was clearly announcing a boundary rather than inviting closer inspection.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  128: {
    room: "brink",
    effects: [["add", "greyheart"], ["stat", "sanity", -1]],
    text: `Carefully, at arm's length, you draw a sample from the glowing seam — a GREY HEART, pulsing faintly in your pack now, warm the way the ash itself is warm, entirely unlike inert particulate matter behaving the way particulate matter should.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  // ---- The Hollowed Town ----

  134: {
    room: "hollowedtown",
    text: `A preserved fragment of pre-Hush life sits perfectly intact within the Hearth's structure — a single street, storefronts, a stopped clock, all of it settled in ash so fine and careful it reads less like ruin and more like a held breath.`,
    choices: [
      { label: "Walk the street", to: 136 },
      { label: "Check the stopped clock", to: 130 },
      { label: "Back to the Source Gate", to: 102 },
    ],
  },

  136: {
    room: "hollowedtown",
    effects: [["flag", "knowHollowedTown"], ["stat", "sanity", -1]],
    text: `Every door stands ajar, every shop mid-transaction, every detail preserved with a reverence that has nothing to do with decay and everything to do with memory — the Hearth, you realize, didn't erase what it was built inside of. It's keeping it, gently, the way you'd keep something you loved and lost, unwilling to let the last true afternoon of the old world disappear along with everything else.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  // ---- Readiness gate ----

  150: {
    room: "sourcegate",
    effects: [["flag", "readyForHeart"]],
    text: `You've seen enough of the Hearth's actual substance — its settled voices, its records, its very real strain, the world it's quietly, carefully preserving — to stop feeling like a trespasser and start feeling like someone who understands, roughly, what's actually being offered.

Whatever you decide at its center, you'll decide it having seen the whole of it, not just the warmth that drew you in.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  // ============ THE HEARTH'S HEART (climax) ============

  160: {
    room: "heart",
    text: `The Hearth's Heart is the source of everything — warmth, voices, the endless patient ash — a vast, glowing convergence point that makes even the Voices grove feel like an anteroom.

"You came all the way down," it says, warm and layered, entirely without menace. "Most stop at the convoy. Ask your question, Runner. I have been patient for three years and considerably longer before that. I can spare a few more minutes."`,
    choices: [
      { label: "Ask why it agreed to see you at all", to: 196 },
      { label: "Offer the Grey Heart — ask to help stabilize the Brink", needItem: "greyheart", to: 162 },
      { label: "Show the Settlement Ledger — negotiate formal terms for Harrow's Rest", needItem: "settlementledger", to: 164 },
      { label: "Propose telling the wider world the truth, carefully", needFlag: "knowProjectFilings", to: 166 },
      { label: "Ask to stay, and mean it", to: 168 },
      { label: "Offer the Hush Sample back — ask it to slow down and let people choose freely", needItem: "hushsample", to: 170 },
      { label: "Take the truth back to Harrow's Rest and decide later", to: 172 },
    ],
  },

  162: {
    room: "heart",
    effects: [["stat", "sanity", -1]],
    text: `You offer the sample back along with a direct, practical question: what do you actually need to hold the Brink steady against settlements determined to fight the drift instead of working with it. The Hearth considers this with what feels, unmistakably, like relief at being asked something solvable.`,
    choices: [{ label: "One year later...", to: 174 }],
  },

  164: {
    room: "heart",
    effects: [["stat", "sanity", -1]],
    text: `You lay out real terms — official recognition, protected routes, a formal channel between Harrow's Rest and whatever the Hearth actually is, rather than three years of rumor and unofficial supply runs. "An accord," it says, turning the word over. "Nobody has offered one of those. Let us discuss terms properly."`,
    choices: [{ label: "One year later...", to: 176 }],
  },

  166: {
    room: "heart",
    effects: [["stat", "sanity", -2]],
    text: `You make the harder case — that three years of rumor and quiet disappearances has cost the Hearth more trust than a carefully managed truth ever would, and that hiding won't hold indefinitely against settlements willing to burn their way through drift out of fear. "You may be right," it says slowly. "That is a considerably larger risk than any I have taken since the first year."`,
    choices: [{ label: "One year later...", to: 178 }],
  },

  168: {
    room: "heart",
    effects: [["stat", "sanity", -2], ["flag", "chosenToStay"]],
    text: `You say it plainly, the way the guestbook's dozens of entries apparently meant it: not fleeing anything, choosing this, freely, eyes open. The Hearth's attention settles on you fully, weighing the offer with real care rather than eager acceptance.

"Then let us not pretend this is a small decision," it says. "Come. Let me show you everything properly, before you finish deciding."`,
    choices: [{ label: "One year later...", to: 180 }],
  },

  170: {
    room: "heart",
    effects: [["stat", "sanity", -1]],
    text: `You propose the harder, slower path — asking the Hearth to ease its pace, to let people choose without three years of ambient, patient pressure doing some of the choosing for them. It's quiet for a long moment. "That would cost time we may not have," it says finally. "But you are not wrong that speed and consent make uneasy neighbors. I will consider it seriously."`,
    choices: [{ label: "One year later...", to: 182 }],
  },

  172: {
    room: "heart",
    text: `You decide, in the end, to carry what you've learned back to Harrow's Rest rather than commit to anything down here, in the heat, on the spot. The Hearth doesn't object. "Wise," it says, unhurried as ever. "Go. Tell them plainly. I will still be here, however long it takes them to decide."`,
    choices: [{ label: "One year later...", to: 184 }],
  },

  174: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — A STEADY BRINK

The distant settlements' assault on the drift slows, eventually, not because they're convinced but because the Brink simply stops giving them anything to push against. You spend the following months as an unlikely liaison, explaining, patiently, why fighting the ash was never going to work the way fighting usually works.

Harrow's Rest starts calling you something other than Runner. You haven't settled on how you feel about that yet.`,
  },

  176: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — THE ACCORD

The paperwork nobody has a template for takes the better part of a year to draft and considerably longer to enforce, but it holds — a genuine, negotiated relationship between a settlement council and something that predates the concept of a council entirely. You're the accord's first official liaison. Unofficially, you're just the first person who happened to ask nicely and stick around for the follow-up meeting.`,
  },

  178: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — THE CAREFUL TRUTH

Harrow's Rest's public bulletins change, gradually, from rumor management to something closer to honesty — not everything, not all at once, but enough that fewer people arrive at the Sanctuary already terrified rather than simply uncertain. The Hearth's warmth doesn't recede. If anything, the settlement's collective unease around it finally starts to.`,
  },

  180: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — THE SEVENTH VOICE

Harrow's Rest logs you as missing, presumed walked out, in a report the council will spend years trying to reconcile with the convoy's otherwise-complete return. You are not missing. You are exactly where you decided, with your eyes open, to be — one more warm thread in a patient hum that has never once, in three years, hurried anyone into anything.`,
  },

  182: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — A SLOWER HUSH

Whether the Hearth actually eases its pace, or whether it was always this patient and you simply notice it more now, the walk-outs from Harrow's Rest slow to a fraction of their old rate over the following year. Nobody can prove which explanation is correct. You find you don't need proof as much as you thought you would.`,
  },

  184: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — CARRIED HOME

You bring the truth back to Harrow's Rest exactly as promised, plainly, without softening it, and let the settlement decide for itself what to do with it — town meetings, arguments, at least one resignation from the council, and, eventually, a slow, uneven, entirely human process of coming to terms.

You think about going back down sometimes. You haven't yet. You suspect, when you finally do, the warmth will still be there, patient as ever, waiting for whatever the settlement decides to send it next.`,
  },

  // ---- Extra branches (Act One) ----

  15: {
    room: "ashfields",
    text: `You crouch and watch the ash settle for a while, the way you'd watch anything you were trying to understand rather than clear out of your way.`,
    choices: [{ label: "Try to read the pattern", luck: { pass: 16, fail: 17 } }],
  },

  16: {
    room: "ashfields",
    effects: [["stat", "sanity", 1]],
    text: `The pattern resolves, eventually — not chaos, but a slow, deliberate drift, falling in a rhythm that matches, you'll realize later, the same warm pulse the overwatch tower's optics caught from the Deep.`,
    choices: [{ label: "Back to the Ash Fields", to: 10 }],
  },

  17: {
    room: "ashfields",
    effects: [["stat", "sanity", -1]],
    text: `The longer you watch, the less certain you are the ash is only falling, and the less you want to keep testing that particular observation out here alone.`,
    choices: [{ label: "Back to the Ash Fields", to: 10 }],
  },

  25: {
    room: "depot",
    effects: [["flag", "knowDepotVehicle"], ["stat", "sanity", -1]],
    text: `One transport, tucked in a back bay, still turns over — barely, reluctantly, but it runs. Whoever parked it here clearly meant to come back for it. The keys are still in it. They just never did.`,
    choices: [{ label: "Back to the depot", to: 20 }],
  },

  26: {
    room: "depot",
    effects: [["stat", "health", -1]],
    text: `Every vehicle in the bay is thoroughly, permanently dead, and one stubborn hood latch takes a chunk out of your knuckles for the trouble of checking.`,
    choices: [{ label: "Back to the depot", to: 20 }],
  },

  35: {
    room: "transitstation",
    effects: [["stat", "sanity", -1]],
    text: `The ticket booth's till is untouched, currency exactly where it was left, worthless now but preserved with the same strange reverence you'll keep noticing everywhere the Hush has quietly passed through.`,
    choices: [{ label: "Back to the station", to: 30 }],
  },

  45: {
    room: "sanctuary",
    effects: [["stat", "sanity", 1]],
    text: `You add your own entry, brief and uncertain, to a guestbook that's clearly seen plenty of both. It feels less like commitment and more like leaving a marker for whoever reads it next — including, possibly, yourself.`,
    choices: [{ label: "Back to the Sanctuary", to: 40 }],
  },

  46: {
    room: "bunker",
    effects: [["add", "medsupply"], ["stat", "sanity", -1]],
    text: `The barracks held a skeleton research staff, bunks made, personal effects arranged with the same deliberate calm you've seen everywhere else. A sealed MED SUPPLY sits in an unclaimed locker, still good.`,
    choices: [{ label: "Back to the bunker", to: 50 }],
  },

  47: {
    room: "bunker",
    effects: [["stat", "sanity", -1]],
    text: `The barracks are thoroughly picked over already, whatever was here long since claimed by someone else's earlier, more successful search. You don't stay long in a room this thoroughly finished with being useful.`,
    choices: [{ label: "Back to the bunker", to: 50 }],
  },

  65: {
    room: "markets",
    effects: [["flag", "knowGlowRumor"], ["stat", "sanity", -1]],
    text: `Ask the right trader and the rumor gets specific fast: the warm glow at the Deep Ash isn't new. It's been there since the first year, growing steadier rather than dimmer, and every runner who's gotten close enough to describe it uses the same word, independently, without comparing notes first — patient.`,
    choices: [{ label: "Back to the market", to: 60 }],
  },

  75: {
    room: "overwatch",
    effects: [["stat", "sanity", -1]],
    text: `Scanning the settlement's own perimeter instead of the Deep, you notice something you'd missed from ground level: the ash drifts noticeably lighter directly around Harrow's Rest's walls, as if the Hush itself is, in some small deliberate way, going easier on the people who haven't walked out yet.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  85: {
    room: "archive",
    effects: [["stat", "sanity", -1]],
    text: `Personal letters from the Hush's early months are the hardest records in the archive to read professionally — ordinary people, ordinary fears, ordinary small kindnesses, all of it filed away with the same careful permanence as the official bulletins.`,
    choices: [{ label: "Back to the archive", to: 80 }],
  },

  86: {
    room: "greenhouse",
    effects: [["add", "waterration"], ["stat", "sanity", 1]],
    text: `You spend an hour on the unglamorous, genuinely restful work of watering rows that don't need much convincing to grow. The keeper sends you off with an extra WATER RATION and the closest thing to a smile you've seen in Harrow's Rest all week.`,
    choices: [{ label: "Back to the Greenhouse", to: 88 }],
  },

  // ---- Checkpoint Ruins ----

  190: {
    room: null,
    text: `A collapsed highway checkpoint marks the old boundary of what used to be a much larger city, ash drifted deep against its concrete barriers, a single guard booth still standing at an angle.`,
    choices: [
      { label: "Search the guard booth", luck: { pass: 191, fail: 192 } },
      { label: "Back to Harrow's Rest", to: 8 },
    ],
  },

  191: {
    room: null,
    effects: [["add", "stimpack"], ["stat", "sanity", -1]],
    text: `The booth's locker yields a STIMPACK, expedition-grade, alongside a logbook whose last entry simply reads: "TRAFFIC'S STOPPED COMING BOTH WAYS. GOING TO SEE WHY." No panic. Just the same calm, patient curiosity you keep finding everywhere.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  192: {
    room: null,
    effects: [["stat", "sanity", -1]],
    text: `The booth's structure groans alarmingly under investigation, and you decide whatever's left inside isn't worth the risk of a collapse this far from help.`,
    choices: [{ label: "Back to Harrow's Rest", to: 8 }],
  },

  // ---- Extra branches (Act Two) ----

  110: {
    room: "voices",
    effects: [["stat", "sanity", -1]],
    text: `You search for the intervention project's own team specifically, and find several — quieter than the more recent arrivals, their voices settled long enough into the grove that individual argument has softened into something closer to harmony. They don't sound like people arguing about whether the project was a mistake anymore. They sound like people who've had three years to actually watch it work.`,
    choices: [{ label: "Back to the Voices", to: 104 }],
  },

  111: {
    room: "voices",
    effects: [["flag", "knowFirstSettler"], ["stat", "sanity", -1]],
    text: `Harrow's Rest's very first walked-out settler is here too, recognizable by name alone from the settlement's own founding records — the first person the council quietly stopped discussing, three years ago, and apparently the reason the Sanctuary exists at all, built shortly after by people who wanted the next ones to at least have somewhere calm to decide.`,
    choices: [{ label: "Back to the Voices", to: 104 }],
  },

  120: {
    room: "brink",
    effects: [["stat", "health", -2], ["flag", "knowReinforceAttempt"]],
    text: `You try, with what tools you're carrying, to shore up the strained seam yourself, and the heat pushes back hard enough to leave a real burn across your forearm before you concede the section needs considerably more than field expedients. The Hearth doesn't seem to mind the attempt. If anything, it seems to appreciate that you tried.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  130: {
    room: "hollowedtown",
    effects: [["stat", "sanity", -1]],
    text: `The stopped clock reads 4:17, and cross-referencing against every dated record you've collected today, that's the exact hour the Hush's first official bulletin went out. This street didn't stop by accident. It stopped at the precise moment everything else started.`,
    choices: [{ label: "Back to the Hollowed Town", to: 134 }],
  },

  // ---- Ambient: the source gate's warmth ----

  140: {
    room: "sourcegate",
    text: `You stop moving and let the warmth of the place settle around you instead of hurrying through it — a slow, steady pulse, patient in a way that makes your own urgency feel, briefly, like the wrong instrument for this particular room.`,
    choices: [{ label: "Try to match it", luck: { pass: 141, fail: 142 } }],
  },

  141: {
    room: "sourcegate",
    effects: [["flag", "knowHearthRhythm"], ["stat", "sanity", 1]],
    text: `You match it, and for a handful of seconds understand, bodily rather than intellectually, why three years of patient work might actually add up to something. It isn't passivity. It's the specific, deliberate steadiness of something that intends to outlast a crisis rather than win it quickly.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  142: {
    room: "sourcegate",
    effects: [["stat", "sanity", -1]],
    text: `You can't quite find the rhythm, and the attempt leaves you aware of your own hurried pulse in a room that clearly has no use for hurry at all.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  195: {
    room: "convoy",
    effects: [["stat", "sanity", -1]],
    text: `"The rumor was real, if incomplete," Nkemelu says. "Old survey data, cross-referenced against the overwatch logs, a hunch one of our engineers had about the warmth pattern. We didn't expect to actually find it. We definitely didn't expect it to be this — reasonable, once you're standing in front of it."`,
    choices: [{ label: "Continue", to: 98 }],
  },

  196: {
    room: "heart",
    effects: [["stat", "sanity", -1]],
    text: `"Because you asked good questions on the way down," it says, "and because you tried to reinforce a strained seam before you asked me for anything in return, even knowing it might not work. Motive matters more here than credentials. Most visitors arrive already certain what they want from me. You arrived, refreshingly, still willing to be surprised."`,
    choices: [{ label: "Continue", to: 160 }],
  },

  197: {
    room: "sourcegate",
    effects: [["stat", "sanity", -1]],
    text: `Tucked into a warm alcove near the Source Gate, a small cache of personal effects waits — not preserved reverently like the Hollowed Town, just left, practically, by someone who knew they wouldn't need to carry them any further. A worn photograph. A house key to a door that doesn't exist anymore. You leave them exactly where you found them.`,
    choices: [{ label: "Back to the Source Gate", to: 102 }],
  },

  // ============ DEATHS ============

  90: {
    room: null,
    type: "death",
    text: `Your body finally gives out somewhere in the drift, and the ash doesn't so much claim you as simply, gently, decline to hurry you along. It settles. The Hush continues. One more silence folds into everything else it's already holding.

YOUR RUN ENDS HERE.`,
  },

  92: {
    room: null,
    type: "death",
    text: `Your filter finally fails somewhere far from any clean air, and the ash finishes what exhaustion started — not violently, just thoroughly, the way anything patient eventually finishes what it starts.

YOUR RUN ENDS HERE.`,
  },

  94: {
    room: null,
    type: "death",
    text: `Somewhere in the grey, you stop being able to tell your own thoughts from the vast, patient quiet pressing in around them. You sit down against warm, ash-drifted ground, and find, distantly, that you don't especially mind losing the argument.

YOUR RUN ENDS HERE.`,
  },

};
