// DEAD SIGNAL — story data. Act One draft.
// Page numbers are deliberately scattered, like the old paperbacks.
// Gaps in numbering are reserved for Acts Two and Three.

const META = {
  title: "DEAD SIGNAL",
  subtitle: "An Interactive Gamebook — Acts One & Two",
  startPage: 1,
  player: {
    name: "Specialist M. Reyes",
    role: "Salvage & Rescue, 3rd Class",
    bio: "Twelve years hauling wrecks out of the dark. You signed onto the ISV Vesper for one last contract: answer a distress ping near Kepler Station, salvage what's left, go home rich.",
  },
  stats: { health: 10, oxygen: 10, sanity: 10 },
  deathPages: { health: 58, oxygen: 60, sanity: 54 },
};

const ITEMS = {
  multitool: { name: "Multitool",     desc: "Cutter, driver, pry-bar. A salvager's best friend.", slot: "held" },
  medkit:    { name: "Medkit",        desc: "Trauma foam and sutures. USE: +4 health.", use: { health: +4 } },
  stim:      { name: "Stim Injector", desc: "Combat stimulant. USE: +3 health, -1 sanity.", use: { health: +3, sanity: -1 } },
  rations:   { name: "Rations",       desc: "Vacuum-packed stew. Smells like home. USE: +2 health, +1 sanity.", use: { health: +2, sanity: +1 } },
  keycard:   { name: "Bridge Keycard",desc: "Command-level access card. Opens the bridge." },
  torch:     { name: "Welding Torch", desc: "Cuts steel. Burns... other things.", slot: "held" },
  flare:     { name: "Signal Flare",  desc: "Burns hot and red for ninety seconds.", slot: "held" },
  flashlight:{ name: "Flashlight",    desc: "Heavy-duty beam. The dark is negotiable now.", slot: "held" },
  sample:    { name: "Spore Sample",  desc: "A sealed vial of pale dust. It settles when you stop looking at it." },
  toolbelt:  { name: "Chief's Toolbelt", desc: "Rahal's belt. Spanners, fuses, a lifetime of fixes." },
  charm:     { name: "Luck Charm",    desc: "Captain Ferro's St. Christopher medal. +1 on luck tests." },
  candle:    { name: "Oxygen Candle", desc: "Chemical O2 generator. USE: +3 oxygen.", use: { oxygen: +3 } },
  sedative:  { name: "Sedative",      desc: "Medbay-grade calm in a vial. USE: +3 sanity, -1 health.", use: { sanity: +3, health: -1 } },
  // --- wearable EVA gear (equip on the paper doll) ---
  evahelmet: { name: "EVA Helmet",    desc: "Gold-visor pressure helmet. Wear it to survive vacuum.", slot: "head" },
  evasuit:   { name: "EVA Suit",      desc: "The Vesper's last intact pressure suit. Wear it to survive vacuum.", slot: "body" },
  gloves:    { name: "Insulated Gloves", desc: "Vacuum-rated gauntlets. Wear them to survive vacuum.", slot: "hands" },
  magboots:  { name: "Mag-Boots",     desc: "Magnetic soles grip the hull. Wear them to walk outside.", slot: "feet" },
  o2tank:    { name: "Oxygen Tank",   desc: "Backpack air supply. Wear it to breathe where there's nothing to breathe.", slot: "back" },
  // --- act two quest items ---
  navkey:    { name: "Nav Key",       desc: "Captain Ferro's command cylinder. Unlocks navigation and the shuttle." },
  parts:     { name: "Comm Components", desc: "Fabricator-fresh transmitter parts, still warm from the printer." },
};

const ROOMS = {
  cryo:     { name: "Cryo Bay",       col: 0, row: 0 },
  corrA:    { name: "Corridor A",     col: 1, row: 0 },
  medbay:   { name: "Medbay",         col: 2, row: 0 },
  mess:     { name: "Mess Hall",      col: 3, row: 0 },
  quarters: { name: "Capt. Quarters", col: 0, row: 1 },
  corrB:    { name: "Junction B",     col: 1, row: 1 },
  hydro:    { name: "Hydroponics",    col: 2, row: 1 },
  cargo:    { name: "Cargo Hold",     col: 3, row: 1 },
  airlock:  { name: "Airlock",        col: 0, row: 2 },
  engine:   { name: "Engineering",    col: 1, row: 2 },
  reactor:  { name: "Reactor Bay",    col: 2, row: 2 },
  bridge:   { name: "Bridge",         col: 3, row: 2 },
  // lower deck — Act Two
  shuttle:  { name: "Shuttle Bay",    col: 0, row: 3 },
  drive:    { name: "Drive Room",     col: 1, row: 3 },
  heart:    { name: "The Heart",      col: 2, row: 3 },
  comms:    { name: "Comms Array",    col: 3, row: 3 },
};

const PAGES = {

  // ============ CRYO BAY ============

  1: {
    room: "cryo",
    text: `Cold. That is the first thing. Not the clean cold of cryosleep — the wet, wrong cold of a ship running on fumes.

Your pod hisses open into darkness broken only by a red emergency strip along the floor. The ISV Vesper is silent. No engine hum. No air cyclers. No voices.

The mission clock on the wall reads DAY 194. Your contract was for sixty.

Frost slides off the glass of the other pods in slow sheets. Nobody has come to wake you.`,
    choices: [
      { label: "Check your own pod's readout", to: 2 },
      { label: "Inspect the other cryo pods", to: 14 },
      { label: "Try the comms panel by the hatch", to: 3 },
      { label: "Head for the hatch into Corridor A", to: 7 },
    ],
  },

  2: {
    room: "cryo",
    effects: [["flag", "chenWoke"]],
    text: `You wipe condensation from your pod's readout. The wake sequence wasn't triggered by the ship's schedule.

MANUAL OVERRIDE — AUTH: XO CHEN, S.
INITIATED: 02:14 SHIP TIME. TWO HOURS AGO.

Chen woke you. Two hours ago. So where is she?

Below that, older entries scroll past: seventeen aborted wake attempts over the last six months, each one cancelled seconds after it began. Someone kept starting to wake you — and changing their mind.`,
    choices: [
      { label: "Inspect the other cryo pods", to: 14 },
      { label: "Head for the hatch into Corridor A", to: 7 },
    ],
  },

  3: {
    room: "cryo",
    effects: [["stat", "sanity", -1]],
    text: `The comms panel crackles with static on every channel. You key the mic anyway.

"This is Reyes, cryo bay. Anyone copy?"

The static stops.

Not fades — stops, the way a room full of people stops talking when you walk in. You count ten full seconds of perfect, listening silence before the hiss resumes.

You decide not to try the comms again for a while.`,
    choices: [
      { label: "Inspect the other cryo pods", to: 14 },
      { label: "Head for the hatch into Corridor A", to: 7 },
    ],
  },

  14: {
    room: "cryo",
    effects: [["add", "multitool"]],
    text: `Eleven pods. Nine still occupied.

You wipe the frost from the first glass and wish you hadn't. Navigator Ibarra is inside, eyes open, and the frost is on the INSIDE of the glass — the pods were opened at some point, then resealed. All nine readouts show flatlines dated weeks apart. Like someone was taken out, one at a time, on a schedule.

The tenth pod — XO Chen's — stands empty and clean.

Your equipment locker still holds your MULTITOOL. You clip it to your belt. Its familiar weight is the first thing today that feels real.`,
    choices: [
      { label: "Head for the hatch into Corridor A", to: 7 },
    ],
  },

  // ============ CORRIDOR A ============

  7: {
    room: "corrA",
    text: `Corridor A runs the spine of the deck, lit by dying emergency strips. Dust hangs in the air, drifting in slow spirals — the gravity plating flickers just enough to make your stomach lurch.

Someone has written on the wall in grease pencil, the letters a metre tall:

DON'T ANSWER IT

Ahead, backlit signage: MEDBAY to port, MESS HALL to starboard. An emergency locker hangs half-open beside you. And from the vent grille near the floor comes a sound — faint, rhythmic, patient.`,
    choices: [
      { label: "Open the emergency locker", to: 6 },
      { label: "Press your ear to the vent", to: 35 },
      { label: "Go to the Medbay", to: 22 },
      { label: "Go to the Mess Hall", to: 9 },
    ],
  },

  6: {
    room: "corrA",
    effects: [["add", "flashlight"]],
    text: `The emergency locker holds a fire blanket, an empty first-aid pouch — someone got here first — and a heavy-duty FLASHLIGHT that still takes a charge.

You thumb it on and off. The beam is strong and white and sane.

Whatever else happens on this ship, the dark is negotiable now.`,
    choices: [
      { label: "Press your ear to the vent", to: 35 },
      { label: "Go to the Medbay", to: 22 },
      { label: "Go to the Mess Hall", to: 9 },
    ],
  },

  35: {
    room: "corrA",
    effects: [["stat", "sanity", -1]],
    text: `You kneel by the grille and listen.

Scrape. Scrape-scrape. Scrape. Scrape-scrape-scrape.

Something is moving through the ductwork, far away, dragging metal against metal. It isn't random. There's a pattern to it — groups, growing by one each time.

It takes you a long moment to realise what the pattern is.

Something in the vents is counting.`,
    choices: [
      { label: "Go to the Medbay", to: 22 },
      { label: "Go to the Mess Hall", to: 9 },
    ],
  },

  // ============ MEDBAY ============

  22: {
    room: "medbay",
    effects: [["add", "medkit"], ["add", "stim"]],
    text: `The medbay smells of antiseptic and, underneath it, of turned earth.

Dr. Osei is at her desk, head bowed over the terminal as if she fell asleep mid-sentence. She has been dead for a long time. Her fingers are laced together neatly in her lap. Peacefully. Deliberately.

The terminal is still live, an autopsy file open on-screen. The supply rack yields a MEDKIT and a STIM INJECTOR. A locked narcotics cabinet sits behind the desk.`,
    choices: [
      { label: "Read the autopsy file", to: 41 },
      { label: "Pry open the narcotics cabinet", to: 30, needAnyItem: ["multitool", "toolbelt"] },
      { label: "Leave for Junction B", to: 11 },
    ],
  },

  41: {
    room: "medbay",
    effects: [["stat", "sanity", -1], ["flag", "knowSpores"]],
    text: `AUTOPSY 7 OF 7 — CREWMAN DECKER, J.
Cause of death: cardiac arrest, self-administered.

Findings identical to previous six. Spore bodies present in blood, marrow, spinal fluid. Growth is not parasitic — it is INTEGRATIVE. It doesn't feed on the host. It completes itself with the host.

Final note, typed hours before Osei's own death:

"We keep calling it an infection. It is not an infection. The signal wasn't a message. A message you can ignore. The signal was a seed, and we are the soil, and I am so tired of hearing it grow."`,
    choices: [
      { label: "Pry open the narcotics cabinet", to: 30, needAnyItem: ["multitool", "toolbelt"] },
      { label: "Leave for Junction B", to: 11 },
    ],
  },

  30: {
    room: "medbay",
    effects: [["add", "sedative"]],
    text: `The cabinet lock gives way with a squeal. Inside, most of the stock is gone — rows of empty slots where the heavy tranquilisers should be. The crew went through this cabinet like a storm.

One vial rolled behind the rack and survived: a single dose of SEDATIVE.

On the inside of the cabinet door, someone has scratched four words with a scalpel:

IT HATES THE QUIET`,
    choices: [
      { label: "Leave for Junction B", to: 11 },
    ],
  },

  // ============ MESS HALL ============

  9: {
    room: "mess",
    effects: [["add", "rations"]],
    text: `The mess hall is wrecked — tables overturned, trays scattered, a dark stain dried across the deck near the serving counter. A meal for twelve was half-prepared and abandoned. Months ago, by the smell.

You pocket a sealed pack of RATIONS from the store.

The coffee machine in the corner hums quietly. Its warming plate is on. The pot is half full.

And then, behind the serving counter: a soft, wet shifting sound. Something large, changing its position. Settling in. Or getting ready.`,
    choices: [
      { label: "Pour a coffee first. You've earned it.", to: 38 },
      { label: "Look behind the counter", to: 28 },
      { label: "Back out quietly to Junction B", to: 11 },
    ],
  },

  38: {
    room: "mess",
    effects: [["stat", "sanity", 1]],
    text: `You pour a cup one-handed, eyes on the counter the whole time, and drink it standing up.

It's terrible. It's burnt and it's stale and it is the single best thing that has happened to you since you woke up. For thirty seconds, you are just a person drinking bad coffee at work.

The wet shifting sound comes again, closer to the end of the counter. Break's over.`,
    choices: [
      { label: "Look behind the counter", to: 28 },
      { label: "Back out quietly to Junction B", to: 11 },
    ],
  },

  28: {
    room: "mess",
    text: `You round the counter.

Ensign Voss looks up at you. Half of him is still Voss — one blue eye, half a mouth, his name still legible on his coveralls. The other half has grown INTO the wall conduit, pale fibrous cords running from his ribs into the pipework like roots. He has been here a long time.

"Reyes," he says, with the half-mouth. His voice is glad. "You're awake. We wanted to wake you SO many times."

He begins, unhurriedly, to pull himself out of the wall.`,
    choices: [
      { label: "Fight — multitool cutter out", to: 44, needItem: "multitool" },
      { label: "Run", to: 16 },
    ],
  },

  16: {
    room: "mess",
    effects: [["stat", "health", -2]],
    text: `You run.

Something rakes across your shoulder as you vault the counter — fingers, too long, ending in points — and then you're through the hatch, slamming the manual release. The door grinds shut on a sound that might be Voss calling your name, and might be something else practising it.

Your shoulder is bleeding freely. You bind it, badly, on the move.`,
    choices: [
      { label: "Keep moving to Junction B", to: 11 },
    ],
  },

  44: {
    room: "mess",
    text: `You snap the cutter head out of the multitool and put your back to the counter.

Voss tears free of the wall in a spray of pale fluid and comes at you — fast, joints bending wrong, that one blue eye locked on yours and weeping.

TEST YOUR LUCK.`,
    choices: [
      { label: "Roll the dice", luck: { pass: 50, fail: 33 } },
    ],
  },

  50: {
    room: "mess",
    effects: [["add", "keycard"], ["stat", "sanity", -1]],
    text: `You duck the first lunge and drive the cutter up under his sternum, through the fibrous mass where a heart should be.

Voss stops. The blue eye finds you, and for a moment it is entirely, terribly human.

"Thank you," he says, clearly. Then the light goes out of him and he folds down onto the deck like a dropped coat.

On his lanyard: a command-level BRIDGE KEYCARD. He was carrying it to you, you realise. Or keeping it from you. You'll never know which.`,
    choices: [
      { label: "Take the keycard and go — Junction B", to: 11 },
    ],
  },

  33: {
    room: "mess",
    effects: [["stat", "health", -3]],
    text: `He is faster than anything that shape should be.

The world spins; the bulkhead hits you in the back like a freight loader. Your cutter arm goes numb. Voss leans in close, and the half-face studies you with something horribly like affection.

"Not yet," he decides.

Then he flows UP the wall and into the ceiling vent, folding into a space no man could fit, and is gone. The scraping recedes into the ductwork — counting, counting.

You pick yourself up off the deck, one rib grating.`,
    choices: [
      { label: "Limp on to Junction B", to: 11 },
    ],
  },

  // ============ JUNCTION B ============

  11: {
    room: "corrB",
    text: `Junction B is the crossroads of the deck. Hatches lead out in every direction; hand-lettered signs, older than the disaster, point the way: HYDROPONICS. CARGO. ENGINEERING. AIRLOCK. The captain's quarters stand slightly ajar.

At the far end, the BRIDGE door — sealed, massive, its card reader blinking a slow, patient red.

Long drag marks in the dust lead from three different hatches toward the ceiling vents. All of them. Toward the vents.`,
    choices: [
      { label: "Head up to your camp on the bridge", to: 61, needFlag: "act2" },
      { label: "Slot the keycard into the bridge door", to: 47, needItem: "keycard" },
      { label: "Captain's quarters", to: 5 },
      { label: "Hydroponics", to: 18 },
      { label: "Cargo hold", to: 25 },
      { label: "Airlock", to: 34 },
      { label: "Engineering", to: 31 },
    ],
  },

  5: {
    room: "quarters",
    effects: [["add", "charm"]],
    text: `Captain Ferro's quarters are untouched by whatever happened outside. Bunk squared away. Boots aligned. A photo taped above the desk: Ferro on a beach somewhere green, laughing, a kid on her shoulders.

Her personal terminal wants a password you'll never guess.

On the nightstand, a small silver St. Christopher medal on a chain — patron saint of travellers. You should leave it.

You don't. Out here, you need him more than she does now. LUCK CHARM acquired: +1 on all luck tests.`,
    choices: [
      { label: "Search the room for Ferro's nav key", to: 69, needFlag: "knowNeedKey" },
      { label: "Try the nav key on her personal terminal", to: 68, needItem: "navkey" },
      { label: "Back to Junction B", to: 11 },
    ],
  },

  // ============ HYDROPONICS ============

  18: {
    room: "hydro",
    effects: [["stat", "oxygen", 2]],
    text: `The hydroponics bay was a garden once. It is a forest now.

Pale growth has swallowed the grow-racks whole — stalks like bleached bamboo, veined leaves the size of hatch covers, and everywhere, hanging like lanterns, translucent pods that pulse with a soft interior light. The air is thick, sweet, and astonishingly rich; your head clears just breathing it. (+2 OXYGEN)

Somewhere deep in the growth, water drips. And beneath the drip — so faint you might be imagining it — whispering.`,
    choices: [
      { label: "Cut a sample from a glowing pod", to: 39, needItem: "multitool" },
      { label: "Listen to the whispering", to: 15 },
      { label: "Push deeper into the growth", to: 46 },
      { label: "Head for the rear hatch", to: 26 },
    ],
  },

  39: {
    room: "hydro",
    effects: [["add", "sample"]],
    text: `You choose a small pod, low on its stalk, and set the cutter against its skin.

The whole forest goes still. The dripping stops.

The pod parts under the blade like wet paper — and puffs a cloud of fine pale dust directly into your face.

TEST YOUR LUCK.`,
    choices: [
      { label: "Roll the dice", luck: { pass: 26, fail: 52 } },
    ],
  },

  52: {
    room: "hydro",
    effects: [["flag", "infected"], ["stat", "sanity", -2]],
    text: `You inhale before you can stop yourself.

The dust tastes like ozone and cut grass and, absurdly, like your grandmother's kitchen — a memory it has no right to reach. You cough until you see stars, seal the SPORE SAMPLE vial with shaking hands, and tell yourself it's fine.

By the time you reach the hatch, the itching has started. Deep in your forearms. Under the skin. In your veins.

It's fine. It's fine. It's fine.`,
    choices: [
      { label: "Get out of here", to: 26 },
    ],
  },

  15: {
    room: "hydro",
    effects: [["stat", "sanity", -1], ["flag", "pleaBloom"]],
    text: `You hold your breath and listen.

The whispering resolves slowly, the way eyes adjust to dark. It is many voices braided into one, and the one on top — gentle, clinical, unmistakable — is Dr. Osei's.

"...don't burn us," the garden whispers. "We're still here. It's not what you think. Nothing is lost, nothing is lost, nothing is lost..."

You back away very carefully, and the whisper follows you like a hand trailing along a railing.`,
    choices: [
      { label: "Cut a sample from a glowing pod", to: 39, needItem: "multitool" },
      { label: "Head for the rear hatch", to: 26 },
    ],
  },

  46: {
    room: "hydro",
    effects: [["stat", "sanity", -1], ["add", "candle"]],
    text: `You push through membranous leaves into the heart of the bay, where the irrigation control room used to be.

The growth here is older, thicker — and it has grown AROUND things. A boot. A wedding ring, orbiting a stalk like the stalk grew through the finger that wore it. You stop looking at the shapes inside the larger trunks.

On the control room shelf, still sealed in its wrapper: an emergency OXYGEN CANDLE. You take it and retrace your steps, and the leaves turn slightly to watch you go.`,
    choices: [
      { label: "Head for the rear hatch", to: 26 },
    ],
  },

  26: {
    room: "hydro",
    text: `The rear hatch of hydroponics opens onto a service landing. From here, a ladder and a short passage run aft toward Engineering; the other way leads back to Junction B.

Behind you, the pale forest sighs — all of it at once, like a held breath released. The pod-lights dim and brighten, dim and brighten.

Slow. Regular.

Like something sleeping.`,
    choices: [
      { label: "Aft, toward Engineering", to: 31 },
      { label: "Back to Junction B", to: 11 },
    ],
  },

  // ============ CARGO HOLD ============

  25: {
    room: "cargo",
    effects: [["add", "torch"], ["add", "flare"]],
    text: `The cargo hold is a canyon of containers in absolute darkness, your footsteps swallowed by the sheer size of the space.

By the loading hatch you find a salvage station — your own gear, prepped for the job you slept through. A WELDING TORCH and a SIGNAL FLARE go onto your belt.

From high above, up among the container stacks and rafter cranes: breathing. Slow, enormous, and unbothered by your presence. It has been listening to you since you came in.

A manifest terminal glows faintly beside the hatch.`,
    choices: [
      { label: "Strike the flare and look up", to: 57, needItem: "flare" },
      { label: "Sweep the flashlight across the rafters", to: 57, needItem: "flashlight" },
      { label: "Check the manifest terminal", to: 12 },
      { label: "Take the gear and slip out", to: 11 },
    ],
  },

  57: {
    room: "cargo",
    effects: [["stat", "sanity", -2], ["add", "keycard"]],
    text: `Light floods the rafters.

XO Chen is crouched on top of the container stack, upside down, holding on with too many points of contact. She is changed the way Voss was changed, but further along — and unlike Voss, her eyes are calm.

"Specialist Reyes," she says, and her voice is kind. "I woke you because someone should get to choose. The others never got to choose."

She drops something. It rings on the deck at your feet: Captain Ferro's BRIDGE KEYCARD.

"Go and see," Chen says. "Then decide." And she flows backward into the dark between the stacks, and is gone.`,
    choices: [
      { label: "Check the manifest terminal", to: 12 },
      { label: "Take the keycard and get out", to: 11 },
    ],
  },

  12: {
    room: "cargo",
    effects: [["flag", "knowCargo"]],
    text: `The manifest is routine — ore, machine parts, hydroponic supplies — until the final entry, added by hand at Kepler Station:

CONTAINER K-77. PRIORITY SEAL. NO INSPECTION.
DESIGNATION: SAMPLE RETURN.
ORIGIN: [REDACTED]. DESTINATION: EARTH.

Sample return. Somebody paid the Vesper to carry something home.

Container K-77 sits alone in the nearest bay, matte black, its priority seals hanging cut. It is already open. It has been open for a long time.`,
    choices: [
      { label: "Look inside container K-77", to: 40 },
      { label: "Leave. Now.", to: 11 },
    ],
  },

  40: {
    room: "cargo",
    effects: [["stat", "sanity", -2], ["flag", "emptyBox"]],
    text: `Container K-77 is empty.

Not looted — EMPTY, and scoured clean, its interior walls covered floor to ceiling in fine scratches. You lean in with your light and your skin goes cold.

The scratches are tally marks. Groups, growing by one each time. One. Two. Three. Four. Thousands of groups, in patient rows, gouged from the inside.

Whatever they shipped in this box spent the voyage COUNTING.

And the marks by the door are the freshest, as if it finished its count — and let itself out.`,
    choices: [
      { label: "Leave. Now.", to: 11 },
    ],
  },

  // ============ AIRLOCK ============

  34: {
    room: "airlock",
    text: `The port airlock is a small, honest room: suit lockers, tether reels, the inner and outer doors with their fat viewports.

One suit is missing. Its tether is paid out through the sealed outer door — the line runs from the reel, through the emergency pass-through, and out into the void, pulled taut by something on the other end.

Through the outer viewport there is nothing. No stars on the line's bearing. Just the tether, dwindling out into black, holding.`,
    choices: [
      { label: "Search the remaining suit locker", to: 72 },
      { label: "Reel the tether in", to: 48 },
      { label: "Open the outer hatch and look", to: 24 },
      { label: "Leave it. Back to Junction B", to: 11 },
    ],
  },

  48: {
    room: "airlock",
    effects: [["stat", "sanity", -2]],
    text: `The reel motor whines. Fifty metres. A hundred. The tether comes home slick with frost, and you watch the pass-through with your heart in your throat.

The end of the line clunks into the housing. There is no suit. There is no body. The tether's end is cut — not frayed, not burned. Cut clean, in one stroke, by something with an edge.

You are still staring at it when the knocking starts.

Three knocks. Polite. Unhurried. From the OUTSIDE of the hull.`,
    choices: [
      { label: "Open the outer hatch", to: 24 },
      { label: "Walk away and don't run. Junction B", to: 11 },
    ],
  },

  24: {
    room: "airlock",
    type: "death",
    text: `You cycle the outer door.

There is nothing there. Of course there is nothing there. Just the long dark, and the cold coming through your boots, and — you lean out into the frame to check the hull plating —

A hand closes around your ankle.

You do not even have time to scream into the void. Vacuum takes the sound, and the dark takes the rest, and the last thing you register is that the grip is gentle. Almost welcoming.

Far behind you, the Vesper sails on without lights.

YOUR STORY ENDS HERE.`,
  },

  // ============ ENGINEERING ============

  31: {
    room: "engine",
    text: `The aft passage to Engineering ends at a stretch of corridor open to hard vacuum — a meteoroid scar, maybe, or something leaving in a hurry. Emergency fields shimmer across the breach like heat haze, holding pressure at the edges, but the middle ten metres read near-zero.

You can sprint it — lungs burning, blood fizzing — or take the maintenance vents that bypass the breach.

The vents. Where the counting lives.`,
    choices: [
      { label: "Walk the breach in your EVA rig (no cost)", to: 43, needEquipAll: ["evahelmet", "evasuit", "o2tank"] },
      { label: "Sprint the breach (-2 OXYGEN)", to: 43, effects: [["stat", "oxygen", -2]] },
      { label: "Crawl through the maintenance vents", to: 13 },
    ],
  },

  13: {
    room: "engine",
    text: `The vent is a throat of cold steel barely wider than your shoulders. You crawl in absolute blackness, steering by feel and by the airflow on your face.

Halfway through, the airflow stops — something ahead of you is filling the duct.

TEST YOUR LUCK. (A flashlight would make this unnecessary.)`,
    choices: [
      { label: "Click on the flashlight and face it", to: 43, needItem: "flashlight",
        note: "The beam shows an empty duct ahead. Whatever it was chose not to be seen. You crawl through unharmed." },
      { label: "Roll the dice", luck: { pass: 43, fail: 55 } },
    ],
  },

  55: {
    room: "engine",
    effects: [["stat", "health", -2]],
    text: `A hand takes your ankle in the dark.

It does not pull. It simply holds — long fingers wrapping unhurried around your boot — while you thrash and kick and make noises you will pretend later you didn't make. Metal tears your forearm open somewhere in the panic.

Then the hand lets go. Deliberately. The way you release a bird.

You crash out of the vent into Engineering and lie on the deck, bleeding, listening to the scrape-scrape-scrape recede above you.

It could have kept you. It wanted you to know that.`,
    choices: [
      { label: "Get up. Keep going.", to: 43 },
    ],
  },

  43: {
    room: "engine",
    effects: [["add", "toolbelt"]],
    text: `Engineering is a cavern of dead machinery, the great drive assemblies looming in the dark like sleeping animals.

Chief Rahal lies at the foot of the main power console, and for once the sight is almost a relief: no growths, no changes. He died human, wrench in hand, fighting to the end with the ship he loved. You take his TOOLBELT; he'd have wanted it working, not rotting.

His data slate is still wedged under the console. The main power breakers above are all thrown to zero — by hand.`,
    choices: [
      { label: "Read Rahal's slate", to: 36 },
      { label: "Restore main power", to: 20, needAnyItem: ["multitool", "toolbelt"] },
      { label: "Continue to the Reactor Bay", to: 37 },
    ],
  },

  36: {
    room: "engine",
    effects: [["stat", "sanity", -1], ["flag", "knowAccel"]],
    text: `Rahal's last entry, thumbed in with a broken screen:

"Cut main power myself. Osei says starve it, maybe it sleeps. But here's what nobody wants to say out loud: I checked the drive logs. It's not eating the reactor.

It's FEEDING the reactor.

We've been under thrust for six days. Smooth, efficient, better than I've ever tuned it. Somebody plotted a course and it wasn't any of us.

I didn't have the guts to check the destination. Whoever reads this: you check."`,
    choices: [
      { label: "Restore main power", to: 20, needAnyItem: ["multitool", "toolbelt"] },
      { label: "Continue to the Reactor Bay", to: 37 },
    ],
  },

  20: {
    room: "engine",
    effects: [["flag", "powerOn"], ["stat", "sanity", -1]],
    text: `You bridge the breakers Rahal died throwing, and slam the master back to ONE.

The Vesper wakes around you deck by deck — lights, air cyclers, gravity settling firm under your boots. For three glorious seconds it feels like victory.

Then, through the soles of your feet, you feel the other thing wake with it.

A heartbeat. Slow, vast, and deeply content, coming up through the deck plates from the direction of the Reactor Bay. Every vent on the ship exhales at once.

Somewhere far away, metal begins to scrape. Faster now. Excited.`,
    choices: [
      { label: "Go to the Reactor Bay", to: 37 },
      { label: "Head back for the bridge", to: 11 },
    ],
  },

  // ============ REACTOR BAY ============

  37: {
    room: "reactor",
    text: `The Reactor Bay doors stand open, and you stop on the threshold, because the space beyond is a cathedral.

The Bloom fills it wall to wall — a vault of pale tissue and translucent buttress-roots wrapped around the reactor core in vast, deliberate architecture. Veins as thick as your torso pulse in slow rhythm, and the rhythm matches the reactor's hum, note for note. It is not strangling the reactor.

It is PLAYING it.

At the heart of the mass, dimly visible through the tissue, hang rows of human silhouettes, suspended like chrysalides. One of them, slowly, turns its head toward you.`,
    choices: [
      { label: "Burn it. Burn all of it.", to: 49, needItem: "torch" },
      { label: "Back away quietly", to: 29 },
    ],
  },

  49: {
    room: "reactor",
    effects: [["flag", "burned"], ["stat", "sanity", -2]],
    text: `The torch catches on the first buttress-root, and the flame runs up it like the root was soaked in fuel.

The ship SCREAMS.

Not metaphorically. Every speaker on every deck howls at once — and the voice is Captain Ferro's, and Osei's, and Voss's, and a hundred others braided together, and underneath them all, one voice that is none of them, so deep it lives in your bones:

WE ONLY WANTED TO GO HOME.

Fire suppression does not engage. Something is holding the valves shut. The blaze spreads faster than fire should.`,
    choices: [
      { label: "Run for the bridge", to: 53 },
    ],
  },

  29: {
    room: "reactor",
    effects: [["stat", "sanity", -1]],
    text: `You back out of the Reactor Bay one slow step at a time, eyes on the hanging figures, the way you'd back away from a cliff edge.

As the doors slide shut, every corpse on the ship exhales at once — you hear it over the open comm channels, a long, soft, multiplied sigh from the medbay, the mess, the pods, the vents.

Not a threat. A goodbye? A rehearsal?

You are shaking by the time you reach the passage back.`,
    choices: [
      { label: "Back to Junction B", to: 11 },
    ],
  },

  // ============ BRIDGE ============

  47: {
    room: "bridge",
    text: `The card reader blinks green, and the bridge door grinds open on a room full of stars.

Captain Ferro is in her chair, facing the viewport, hands folded in her lap. Dead weeks, at least. Whatever she saw at the end, she chose to face it looking outward, at the dark she gave her life to.

The main console is alive. Front and centre, looping on the primary display, is a waveform tagged in red:

CONTACT SIGNAL — RECEIVED DAY 121 — REPLY SENT DAY 121

They answered it. DON'T ANSWER IT, the corridor said. They answered it.`,
    choices: [
      { label: "Play the captain's final log", to: 59 },
      { label: "Look out the viewport", to: 42 },
      { label: "Go to the nav console", to: 21 },
    ],
  },

  59: {
    room: "bridge",
    effects: [["stat", "sanity", -2], ["flag", "knowSignal"]],
    text: `Ferro's face fills the screen, hollow-eyed, a week of command in every line of it.

"Final log. If anyone finds this — the signal repeated one question. That's all it ever was. One question, over and over, in every language ever transmitted. Every dead language. Languages we had no record of.

It asked: ARE YOU HOME?

Kepler Control said answer it. Standard first-contact protocol, they said. So we answered. We said no — we said, this is a ship, home is Earth, third planet, Sol.

We told it where home was. God forgive us. We drew it a map."`,
    choices: [
      { label: "Look out the viewport", to: 42 },
      { label: "Go to the nav console", to: 21 },
    ],
  },

  42: {
    room: "bridge",
    effects: [["stat", "sanity", -2]],
    text: `You stand at the great viewport where Ferro kept her last watch, and look out at the stars.

It takes you a while to see it, and then you cannot unsee it: dead ahead, the stars are moving. Not streaking — REARRANGING. Slow as a minute hand, points of light are sliding into new positions, assembling something vast and deliberate across the black, a pattern your eyes almost recognise, a shape your mind leans toward the way a plant leans toward light —

You look away. You look away hard, and you keep your eyes on the deck for a full minute.

Whatever it is building out there, it is not finished yet. You hope you are off this ship before it is.`,
    choices: [
      { label: "Go to the nav console", to: 21 },
    ],
  },

  21: {
    room: "bridge",
    text: `The nav console wakes at your touch. The plotted course is locked in, encrypted with a command key nobody left you. Destination: SOL SYSTEM — EARTH. Time to arrival: 74 DAYS.

Rahal was right. The Vesper is going home. It is TAKING something home.

Two command options remain unlocked, glowing side by side:

TRANSMIT DISTRESS BEACON — all channels, maximum gain.
PURGE PROTOCOL — vent every compartment aft of the bridge to vacuum. Requires main power.`,
    choices: [
      { label: "Transmit the distress beacon", to: 56 },
      { label: "Initiate the Purge Protocol", to: 51, needFlag: "powerOn" },
      { label: "Step away. You need to think.", to: 11 },
    ],
  },

  56: {
    room: "bridge",
    text: `You open every channel the Vesper has, and you send it all — position, logs, Osei's autopsies, Ferro's confession, and one line on repeat: DO NOT APPROACH. DO NOT ANSWER. QUARANTINE THIS SHIP.

The reply comes in four seconds.

The nearest relay is four light-HOURS away. Nothing human can answer in four seconds. And the reply is not words. It is a waveform you have seen before, looping on the captain's display — the contact signal, note for note.

Except the origin tag on this one reads: SOL SYSTEM. EARTH.

Something back home is already transmitting the question. You stare at the screen for a very long time, and the deck hums beneath you, 74 days out.

— END OF ACT ONE —`,
    choices: [
      { label: "Sit down in the dark and think it through", to: 10 },
    ],
  },

  51: {
    room: "bridge",
    text: `You flatten your hand against the panel. PURGE PROTOCOL: CONFIRMED.

For the first time in 194 days, the Vesper's klaxons wake, and the countdown begins in the calm voice of a machine that has never been afraid: PURGE IN 300 SECONDS. 299. 298.

The ship's answer is immediate. Through the deck, through your boots, through your teeth, the heartbeat from the Reactor Bay stops —

— and then something vast lets go of the reactor and begins hauling itself through the body of the ship. Toward the bridge. Fast. Bulkheads shriek somewhere below, one by one, like footsteps.

287… 286… It knows exactly how much time it has. And so do you.

— END OF ACT ONE —`,
    choices: [
      { label: "Seal the bridge door and hold on", to: 4 },
    ],
  },

  53: {
    room: "bridge",
    text: `You reach the bridge with fire alarms howling and the smell of burning tissue in every duct — and the deck lurches hard enough to throw you into the doorframe.

Through the viewport, the stars are wheeling. The Vesper is turning under full thrust, smooth and purposeful, no hand on the controls. On the nav display, the locked course to Earth burns steady: 74 DAYS. Course correction: COMPLETE. Burn damage: COMPENSATED.

You hurt it. You know you hurt it — the whole ship still echoes with the scream.

And it simply... adjusted. The way you'd brush off a spark.

On the captain's console, one new line of text has appeared, in no font the Vesper's systems own:

WE WILL ARRIVE TOGETHER.

— END OF ACT ONE —`,
    choices: [
      { label: "Barricade the bridge and wait out the fire", to: 8 },
    ],
  },

  // ============ ACT TWO — DAY TWO ============

  4: {
    room: "bridge",
    effects: [["flag", "act2"], ["flag", "knowNeedKey"]],
    text: `The countdown reaches zero. Klaxons cut out mid-wail.

Through the deck, you feel the thing let go of the reactor and retreat — not defeated, just... patient. Choosing to wait you out. The heartbeat fades toward the lower decks and does not return.

You have bought time. Not victory. The nav display still reads 74 DAYS, ticking down without you.

Tomorrow, you finish this properly.`,
    choices: [{ label: "Get some sleep. Tomorrow, finish this.", to: 61 }],
  },

  8: {
    room: "bridge",
    effects: [["flag", "act2"], ["flag", "knowNeedKey"]],
    text: `The fire burns itself out somewhere below, starved of air at last. The screaming stops. Your hands are shaking and won't quite stop either.

The Vesper's hull is scorched but sealed. The course to Earth is unchanged. Whatever you hurt down there, it wasn't enough — and now it knows your name the way you know its heartbeat.

Tomorrow, you finish this properly.`,
    choices: [{ label: "Get some sleep. Tomorrow, finish this.", to: 61 }],
  },

  10: {
    room: "bridge",
    effects: [["flag", "act2"], ["flag", "knowNeedKey"]],
    text: `You sit in the captain's chair for a long time, watching the stars not-quite-rearrange themselves.

If Earth is already answering the signal on its own, a distress call won't save anyone. Somebody has to physically stop this ship, or make sure the *right* warning — the true one — gets there first, undiluted by whatever is riding shotgun in your transmission.

Tomorrow, you finish this properly.`,
    choices: [{ label: "Get some sleep. Tomorrow, finish this.", to: 61 }],
  },

  61: {
    room: "bridge",
    text: `DAY 195. You slept in the captain's chair with a fire axe across your knees, and you're a little surprised to have woken up at all.

The math hasn't changed: this ship is still going home, and it isn't going alone. Three ways to end this, as far as you can see — stop the ship, warn Earth properly, or get off it. Maybe more than one.

The lower deck access shaft is sealed but sound. Whatever's down there, it's waiting.`,
    choices: [
      { label: "Check the ship's log", to: 100 },
      { label: "Descend to the lower deck", to: 62 },
      { label: "Go back up to the upper decks", to: 11 },
    ],
  },

  100: {
    room: "bridge",
    effects: [["stat", "sanity", -1]],
    text: `You scroll the ship's log out of habit more than hope.

Ferro logged something every single day for 121 days. After Day 121 — the day they answered the signal — the entries change. Shorter. Then just a date and a time. Then, for the last forty days, nothing but a single repeated character, typed once per day, like a tally mark nobody else was meant to find.

You stop counting them.`,
    choices: [{ label: "Back to camp", to: 61 }],
  },

  69: {
    room: "quarters",
    effects: [["add", "navkey"]],
    text: `You know what you're looking for now, and where a career officer would actually hide it. Behind the beach photo, taped to the back of the frame: a slim command cylinder, still warm from the reading lamp.

NAV KEY — CAPT. S. FERRO. She never got the chance to use it. You do.`,
    choices: [{ label: "Back to Junction B", to: 11 }],
  },

  68: {
    room: "quarters",
    effects: [["flag", "knowFerroLog"]],
    text: `The nav key slots into the personal terminal and it wakes, grateful, like it's been waiting a long time to tell someone.

One unsent message, drafted and redrafted for weeks: "I diverted power myself, twice. Both times I put it back. I keep telling myself it's for the crew's safety. I don't know anymore if that's true, or if I just don't want it looking at me the way it looks at Voss."

It was never sent.`,
    choices: [
      { label: "Dig deeper into her files", to: 96 },
      { label: "Back to Junction B", to: 11 },
    ],
  },

  96: {
    room: "quarters",
    effects: [["stat", "sanity", -1], ["flag", "knowOrigin"]],
    text: `Buried in an encrypted research folder, a fragment Ferro shouldn't have had clearance to read: the "signal" wasn't broadcast. It was RECORDED, ninety years ago, by a Kepler Station probe that never reported home. Something rode the recording back with the data.

It has been asking to go home for ninety years. It just needed a ship that would listen.`,
    choices: [{ label: "Back to Junction B", to: 11 }],
  },

  72: {
    room: "airlock",
    effects: [["add", "evasuit"], ["add", "evahelmet"], ["add", "gloves"], ["add", "magboots"], ["add", "o2tank"]],
    text: `The second locker was jammed, not empty. You force it and find the Vesper's last complete EVA kit: helmet, suit, gloves, mag-boots, and a full oxygen tank, all flight-rated.

Whatever's still out there on the hull, you can go looking now, fully sealed against the dark. Small comfort. You'll take it.`,
    choices: [{ label: "Back to the airlock controls", to: 34 }],
  },

  62: {
    room: null,
    text: `The lower deck is older than the rest of the ship — original construction, narrow and utilitarian, lit by a single unbroken strip that flickers but holds.

Four ways forward, each marked with faded stencil: SHUTTLE BAY. DRIVE ROOM. COMMS ARRAY. Directly ahead, a blast door that was never meant to be a door — hand-welded shut from this side, with a hand-lettered sign: THE HEART. DO NOT.

A side passage leads to crew lockers and, further on, cold storage.`,
    choices: [
      { label: "Shuttle Bay", to: 63 },
      { label: "Drive Room", to: 64 },
      { label: "Comms Array", to: 66 },
      { label: "Corridor lockers", to: 75 },
      { label: "Cold Storage", to: 90 },
      { label: "Escape Pod Alcove", to: 78 },
      { label: "The Heart", to: 65 },
      { label: "Back up to Bridge Camp", to: 61 },
    ],
  },

  // ---- Shuttle Bay ----

  63: {
    room: "shuttle",
    text: `The shuttle bay holds exactly one working craft: a single-seat runabout, hatch sealed, its access panel blinking a slow red command-lock. Scattered supply crates line the walls, mostly picked over.

A hand-scrawled note is taped to the hatch: "KEY'S WITH THE CAPTAIN. DON'T ASK HER FOR IT."`,
    choices: [
      { label: "Search the bay", to: 71 },
      { label: "Try the sealed hatch", to: 70, needItem: "navkey" },
      { label: "Return to the junction", to: 62 },
    ],
  },

  71: {
    room: "shuttle",
    effects: [["stat", "sanity", -1]],
    text: `Among the picked-over crates you find a logbook, its last entry a list of eleven names — the whole crew — with eight crossed out. Someone was keeping score of who still deserved a seat on this shuttle.

Your name isn't on the list. You weren't awake yet to earn a place.`,
    choices: [{ label: "Back", to: 63 }],
  },

  70: {
    room: "shuttle",
    text: `The nav key slots home and the lock disengages with a clean, satisfying clunk. The runabout's systems light up one by one — fuel nominal, hull sound, navigation ready.

It seats one. It always seated one. Whatever you decide, this door won't wait forever.`,
    choices: [
      { label: "Launch now", to: 73 },
      { label: "Not yet — there's more to do", to: 62 },
    ],
  },

  73: {
    room: "shuttle",
    text: `You seal the hatch, strap in, and give yourself thirty seconds to change your mind. Nobody comes to stop you. Nobody's left who could.

The Vesper falls away behind you, lights dim, still on course, still carrying its passengers home. You are one person in a very small craft in a very large dark, and for the first time in two days, you are alone in a way that isn't a threat.

It doesn't feel like winning. It feels like the only door that was still open.`,
    choices: [{ label: "Read the epilogue", to: 92 }],
  },

  92: {
    room: "shuttle",
    type: "act-end",
    text: `EPILOGUE — THE ONE WHO LEFT

You reach a relay station eleven days later, half-starved and talking to yourself. Command debriefs you for six weeks and believes maybe sixty percent of it.

The Vesper is still out there, still inbound, still on schedule. Whether anyone believed you in time is a story for another page — but it isn't yours to finish anymore. You did the only thing you could: you survived to tell it.

Some stories end with a door closing softly behind you. This is one of them.`,
  },

  // ---- Drive Room ----

  64: {
    room: "drive",
    text: `The drive room's manual override panel is sealed behind a warped access hatch, welded slightly out of true by heat damage. Rahal's tools would get it open. Force might too.

A second, smaller hatch nearby is stencilled SERVER CORE — ACCESS RESTRICTED.`,
    choices: [
      { label: "Pry the access panel", needAnyItem: ["multitool", "toolbelt"], luck: { pass: 19, fail: 81 } },
      { label: "Check the server core", to: 97 },
      { label: "Return to the junction", to: 62 },
    ],
  },

  19: {
    room: "drive",
    effects: [["flag", "knowOverride"], ["add", "parts"]],
    text: `The panel gives cleanly. Inside: a manual override lever, stiff with disuse, and a rack of salvageable fabrication components still humming with residual charge.

Pull this lever from inside the Heart's own chamber, and you vent the reactor core directly — surgical, final, and very close range.`,
    choices: [
      { label: "Trigger the override remotely, right now", to: 80 },
      { label: "Save it. Return to the junction", to: 62 },
    ],
  },

  81: {
    room: "drive",
    effects: [["stat", "health", -2], ["flag", "knowOverride"], ["add", "parts"]],
    text: `The panel springs open harder than expected and a torn edge opens your forearm to the bone. You swear, wrap it, and keep working through the pain.

Inside: the override lever, and a rack of fabrication components, blood-slicked but intact.`,
    choices: [
      { label: "Trigger the override remotely, right now", to: 80 },
      { label: "Save it. Return to the junction", to: 62 },
    ],
  },

  97: {
    room: "drive",
    effects: [["flag", "knowOrigin"], ["stat", "sanity", -1]],
    text: `The server core is a single humming column of storage, still running on backup power after everything else has failed.

Ninety years of recorded transmission logs, replayed in a loop. Kepler Probe 7, reporting a discovery it never got to explain, over and over, in a language your terminal can't fully translate. The last clean phrase it manages: "...NOT HOSTILE. HOMESICK."`,
    choices: [{ label: "Back", to: 64 }],
  },

  80: {
    room: "drive",
    effects: [["stat", "health", -1]],
    text: `You throw the remote trigger before you're ready, because ready was never going to happen.

Somewhere below, the override begins its cycle — and the Heart, mid-slumber, feels it and wakes early, furious and immediate. The deck plates shudder. There will be no more preparation. It's now.`,
    choices: [{ label: "Go to the Heart", to: 65 }],
  },

  // ---- Comms Array ----

  66: {
    room: "comms",
    text: `The comms array's transmitter core is dead, its casing stripped for parts weeks ago by someone with the same idea you have. Without fabricated replacement components, this dish is just an expensive paperweight.

A dish alignment console still has partial power.`,
    choices: [
      { label: "Install the fabricated components", to: 67, needItem: "parts" },
      { label: "Search for spare components", to: 91 },
      { label: "Return to the junction", to: 62 },
    ],
  },

  91: {
    room: "comms",
    text: `You strip everything you can from the housing, but there's nothing here that will bridge the gap. Whatever this transmitter needs, it isn't sitting in this room.

Something purpose-built. Fabricated. You'll need to find it made somewhere else on this ship.`,
    choices: [{ label: "Back", to: 66 }],
  },

  67: {
    room: "comms",
    text: `The fabricated components seat perfectly — Rahal's fabricator clearly built them for exactly this. The dish array grinds to life on its mount, hunting for a lock on Earth's rotation.

You have one clean window before the Vesper's own bulk swings between you and home. Line it up.`,
    choices: [{ label: "Align the dish", luck: { pass: 82, fail: 83 } }],
  },

  82: {
    room: "comms",
    effects: [["flag", "warningSent"]],
    text: `The lock holds. You send everything — logs, autopsies, Ferro's confession, Rahal's course data, the server core recordings, all of it, burst-compressed and screaming outward at the speed of light.

Somewhere, eventually, someone who isn't already infected by the question will receive an answer they can actually use. It's not a rescue. It's the truth, arriving ahead of the ship that's carrying the alternative.`,
    choices: [{ label: "Return to the junction", to: 62 }],
  },

  83: {
    room: "comms",
    effects: [["stat", "sanity", -1], ["flag", "warningSent"]],
    text: `The dish stutters off-lock at the last second, and half your burst transmission goes out scrambled, corrupted, streaked with noise.

It's not clean. It's not everything. But enough of it went out intact — Ferro's name, the coordinates, one clear repeated warning — that somebody, someday, might listen.`,
    choices: [{ label: "Return to the junction", to: 62 }],
  },

  // ---- Corridor Lockers & Cold Storage ----

  75: {
    room: null,
    text: `Rows of crew lockers line a narrow side passage, most hanging open and empty. Something shifts, unseen, further down the corridor — patient, unhurried, aware of you.

You have time for a quick search. Maybe.`,
    choices: [{ label: "Search quickly", luck: { pass: 76, fail: 77 } }],
  },

  76: {
    room: null,
    effects: [["add", "medkit"]],
    text: `You find a sealed medkit wedged behind a locker door and you're gone before whatever's down the corridor decides to introduce itself. Small win. You'll take it.`,
    choices: [{ label: "Return to the junction", to: 62 }],
  },

  77: {
    room: null,
    effects: [["stat", "health", -2]],
    text: `Whatever it is closes the distance faster than anything that size should move. You barely get clear, a fresh gash across your ribs, boots skidding on the deck plate as you slam the hatch behind you.

You don't look back to see what it was. You already suspect you know.`,
    choices: [{ label: "Return to the junction", to: 62 }],
  },

  90: {
    room: null,
    effects: [["stat", "sanity", -1]],
    text: `Cold Storage is exactly that — meat lockers gone dark, frost thick on every surface, breath fogging in front of you like a second, slower ghost.

Something is curled in the back rack, wrapped in what might once have been a tarp. You decide, firmly, not to check. Some doors you leave shut on purpose.`,
    choices: [{ label: "Return to the junction", to: 62 }],
  },

  // ---- Escape Pod Alcove ----

  78: {
    room: null,
    text: `A single-seat emergency pod sits in its cradle, fully charged, hatch unlocked, waiting for absolutely no one in particular.

It would take you exactly one person's worth of distance from all of this. Right now. No warning sent, no ship stopped, no chance to change your mind halfway through the burn.`,
    choices: [
      { label: "Take the pod now, alone", to: 79 },
      { label: "Not yet. Return to the junction", to: 62 },
    ],
  },

  79: {
    room: null,
    text: `You climb in and slam the release before you can talk yourself out of it. The pod kicks free hard enough to bruise, and the Vesper dwindles to a point of light and then to nothing at all.

You did not warn anyone. You did not stop anything. You are, however, alive, and drifting, and that has to count for something, even if you can't quite convince yourself of what.`,
    choices: [{ label: "Read the epilogue", to: 98 }],
  },

  98: {
    room: null,
    type: "act-end",
    text: `EPILOGUE — NO WARNING GIVEN

Rescue finds you four days later, dehydrated and unable to answer most of their questions in a way that makes sense to them.

The Vesper is never heard from again — not lost, just silent, still logged as inbound, still 74 days out on a clock that never stopped counting. You think about it sometimes. You try not to think about how you're the only one who knows what's aboard.`,
  },

  // ---- The Heart ----

  65: {
    room: "heart",
    text: `The welded door gives way easier than it should — like something on the other side wanted you to get through eventually.

The chamber beyond is the Reactor Bay grown vaster, older, cathedral-deep, the Bloom's architecture wrapped so thoroughly around the ship's spine that you can no longer tell where the Vesper ends and it begins. XO Chen waits at the center, calm, changed, unhurried.

"You came back," she says. "Good. It's almost time to choose."`,
    choices: [
      { label: "Something under your skin answers before you do", to: 86, needFlag: "infected" },
      { label: "Burn it — torch out", to: 23, needItem: "torch" },
      { label: "Pull the manual override", to: 27, needFlag: "knowOverride" },
      { label: "Offer the spore sample", to: 32, needItem: "sample" },
      { label: "Turn and run", to: 45 },
    ],
  },

  23: {
    room: "heart",
    text: `You don't wait for the choosing. You put the torch to the nearest buttress-root and keep moving, feeding fire into the Bloom faster than it can decide how to feel about that.

Chen doesn't scream. The ship does — every speaker, every voice it ever collected, one long chord of protest as the fire climbs into the architecture that took two hundred days to grow. You run for the shaft with your sleeve over your face, and behind you, something vast and ancient finally, furiously, dies.`,
    choices: [{ label: "Read the epilogue", to: 95 }],
  },

  95: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — SCORCHED EARTH

The Vesper drifts, gutted and powerless, its course slowly bleeding off toward nothing in particular. It will never reach Earth. It will also never be found in any state you'd wish on a search team.

You make it to the shuttle bay on fumes and willpower, and if you sleep at all in the following weeks, you don't remember dreaming. You won. You're fairly sure you won. Some nights that's enough.`,
  },

  27: {
    room: "heart",
    text: `You cross the chamber to the override junction Rahal marked for you, Chen watching, making no move to stop you — almost curious, the way you'd watch someone attempt something you already know the shape of.

The lever throws hard. Somewhere below, the reactor core vents directly into the Bloom's heart, not fire but cold, sudden, absolute vacuum, precisely contained. The architecture doesn't burn. It simply, quietly, lets go — of the reactor, of the ship, of two hundred days of patient growing.

Chen closes her eyes like something that has been tired for a very long time, finally getting to rest.`,
    choices: [{ label: "Read the epilogue", to: 93 }],
  },

  93: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — A CLEAN CUT

The Vesper goes dark but intact, drifting, its cargo finally, truly inert. Salvage tugs reach you eleven days later, drawn by the transmission you managed to get out along the way.

They find one survivor and a ship's worth of horror stories nobody back home will fully believe, at least not at first. You did the job you signed up for, in the end — you brought a wreck home safe. It just cost you everything you thought that job would be.`,
  },

  32: {
    room: "heart",
    text: `You hold up the vial instead of a weapon. Chen goes very still.

"A piece of us," she says, wondering. "Freely given."

You set it in her open hand. The Bloom's light shifts through the chamber, slow and vast, considering. "We only ever wanted to go home," Chen says, and for a moment her voice is entirely her own again. "So did you. I think — I think we can both still get there. Just... not the way either of us planned."

The ship's course, you'll learn later, changes that night. Not to Earth. Somewhere quieter.`,
    choices: [{ label: "Read the epilogue", to: 94 }],
  },

  94: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — AN ARRANGEMENT

Nobody back home ever gets a clean answer about the ISV Vesper. The transponder pings, once a year, from further out than any charted route, always the same coordinates, always moving slightly.

You're not aboard for that. You took the shuttle down at the nearest waypoint, alone, and never spoke publicly about what you agreed to in that chamber. Some nights you wonder if you made a deal with a monster, or just the loneliest thing you ever met. You've stopped expecting that question to resolve.`,
  },

  45: {
    room: "heart",
    type: "act-end",
    text: `You turn and run, and for once, nothing stops you.

You don't look back to see if that was mercy or simply disinterest. You reach the shaft, the junction, the ladder up, taking the rungs two at a time with your lungs burning and your sanity fraying at the edges — and somewhere behind you, the chamber door seals itself, unprompted, unhelped.

You never go back down. The Vesper sails on, 74 days and counting, and you spend every one of them not thinking about what you left unfinished. It doesn't work. It never really does.`,
  },

  86: {
    room: "heart",
    effects: [["stat", "sanity", -1]],
    text: `The itching in your veins, months old now, finally answers something in the chamber that has been calling to it since Hydroponics. You feel the Bloom recognize you as *already partly its own*, and the recognition is not unkind.

Chen extends a hand that used to be a hand. "It doesn't have to be a war," she says. "It never had to be. We just wanted somewhere to stop being alone. So did you, or you wouldn't have signed onto a salvage contract eleven months long."

You have a choice left. You're aware, distantly, that you're not sure you still want to make it.`,
    choices: [{ label: "Read the epilogue", to: 89 }],
  },

  89: {
    room: "heart",
    type: "act-end",
    text: `EPILOGUE — SOIL

The Vesper is found, eventually, powered and en route, hailing calmly on all channels in a voice that is almost, but not quite, entirely human.

There is no distress call. There is no crew roster that makes sense. There is a garden where the reactor used to be, and at the heart of it, something that used to be several people, glad — genuinely, terribly glad — to finally have visitors.

It still asks the question. It's just not in a hurry for an answer anymore. Neither, it turns out, are you.`,
  },

  // ============ DEATHS ============

  58: {
    room: null,
    type: "death",
    text: `Your legs fold, and the deck comes up to meet you almost kindly.

You have lost too much blood to be afraid. The emergency strip lights blur into a long red river on the ceiling, and the last thing you hear, far away in the ductwork, is the patient scrape-scrape-scrape of something counting.

It reaches your number.

YOUR STORY ENDS HERE.`,
  },

  60: {
    room: null,
    type: "death",
    text: `The air runs out by degrees — first the headache, then the sparkling dark at the edge of your eyes, then a warmth that feels treacherously like falling asleep in the sun.

The Vesper sails on without you, patient and purposeful, 74 days from home.

YOUR STORY ENDS HERE.`,
  },

  54: {
    room: null,
    type: "death",
    text: `It happens quietly, in the end. You stop, in some corridor — you no longer know which — because you finally understand the sound from the vents.

It was never counting UP toward anything. It was counting the crew. Keeping track of its people. And every shift and settle of this old ship, every hiss and knock you have flinched from all day — the ship has been saying your name. All of it. All along. You just didn't know how to listen.

You know how to listen now.

You sit down against the warm bulkhead, and you begin, softly, to count.

YOUR STORY ENDS HERE.`,
  },
};
