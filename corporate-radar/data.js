// All three tools on this site (Decoder, Excuse Generator, Sign-Off
// Generator) lean on the same idea: an object used as a LOOKUP TABLE.
// Instead of an array you'd have to loop through and compare item by item,
// an object lets you ask `BUZZWORD_DICTIONARY["circle back"]` and get the
// answer directly, in one step, no matter how many entries there are.
// See CLAUDE.md for more on why that matters here.
export const CATEGORIES = {
  meeting: { label: "Meeting Speak", color: "#3d6a8a" },
  strategy: { label: "Strategy Speak", color: "#8a4f3d" },
  verb: { label: "Management Verbs", color: "#4f6a3d" },
  layoff: { label: "Layoff Euphemism", color: "#8a3d3d" },
  hustle: { label: "Hustle Culture", color: "#6a4f8a" },
};

export const BUZZWORD_DICTIONARY = {
  // --- Meeting Speak ---
  "circle back": {
    plain: "Follow up on this later.",
    cynical: "I don't want to answer that right now and I'm hoping you forget to ask again.",
    category: "meeting",
  },
  "touch base": {
    plain: "Have a short conversation.",
    cynical: "An unscheduled interruption, rebranded as friendliness.",
    category: "meeting",
  },
  "take this offline": {
    plain: "Discuss it privately after the meeting.",
    cynical: "I don't want everyone here to see how unprepared I am for this question.",
    category: "meeting",
  },
  "put a pin in it": {
    plain: "Postpone the topic for now.",
    cynical: "This is never coming back.",
    category: "meeting",
  },
  "table this": {
    plain: "Postpone the discussion.",
    cynical: "We are burying this, politely.",
    category: "meeting",
  },
  "close the loop": {
    plain: "Finish following up so everyone knows the outcome.",
    cynical: "Send one more email so I can say I did something.",
    category: "meeting",
  },
  "sync up": {
    plain: "Have a coordination meeting.",
    cynical: "A meeting that could have been an email.",
    category: "meeting",
  },
  "level set": {
    plain: "Make sure everyone has the same information.",
    cynical: "Re-explain the thing, because half the room wasn't listening last time.",
    category: "meeting",
  },
  "get buy-in": {
    plain: "Secure agreement.",
    cynical: "Collect enough nods that no one can blame me alone if this fails.",
    category: "meeting",
  },
  "parking lot": {
    plain: "A list of off-topic items to revisit later.",
    cynical: "Where good ideas go to be forgotten.",
    category: "meeting",
  },
  "action item": {
    plain: "A task assigned during a meeting.",
    cynical: "A task nobody touches until three days before it's due.",
    category: "meeting",
  },
  "next steps": {
    plain: "What happens after this meeting.",
    cynical: "The sentence said at the end of every meeting, whether or not any next steps actually exist.",
    category: "meeting",
  },
  "run it up the flagpole": {
    plain: "Test an idea with leadership.",
    cynical: "Ask my boss so I have someone else to blame if it flops.",
    category: "meeting",
  },
  "steering committee": {
    plain: "A group that reviews and approves a project's direction.",
    cynical: "The meeting where your timeline quietly dies.",
    category: "meeting",
  },
  "readout": {
    plain: "A summary presentation of results.",
    cynical: "A deck built the night before, making three weeks of confusion look like a plan.",
    category: "meeting",
  },
  "one-pager": {
    plain: "A single-page summary document.",
    cynical: "Twelve slides of nuance, flattened into a page nobody will read either.",
    category: "meeting",
  },
  "war room": {
    plain: "A dedicated space or team for an urgent project.",
    cynical: "A Slack channel where everyone is stressed.",
    category: "meeting",
  },
  "tiger team": {
    plain: "A small team assembled to fix an urgent problem.",
    cynical: "The same five people, pulled off their actual jobs, again.",
    category: "meeting",
  },
  "bandwidth": {
    plain: "Available time or capacity.",
    cynical: "The polite way to say no without saying no.",
    category: "meeting",
  },
  "let's take it offline": {
    plain: "Let's discuss this outside the meeting.",
    cynical: "I would like this conversation to stop being witnessed.",
    category: "meeting",
  },

  // --- Strategy Speak ---
  "move the needle": {
    plain: "Make a measurable difference.",
    cynical: "The thing every initiative promises and few deliver.",
    category: "strategy",
  },
  "low-hanging fruit": {
    plain: "An easy win.",
    cynical: "The only thing actually getting done this quarter.",
    category: "strategy",
  },
  "boil the ocean": {
    plain: "Attempt something unnecessarily broad and complex.",
    cynical: "What happens when nobody said no to scope creep.",
    category: "strategy",
  },
  "quick win": {
    plain: "A fast, easy result.",
    cynical: "The thing leadership wants instead of the hard strategic work.",
    category: "strategy",
  },
  "heavy lift": {
    plain: "A difficult undertaking.",
    cynical: "The thing nobody wants to own.",
    category: "strategy",
  },
  "north star": {
    plain: "A guiding long-term goal.",
    cynical: "A metric picked in a workshop that nobody looks at again after Q1.",
    category: "strategy",
  },
  "north star metric": {
    plain: "The single most important metric a team optimizes for.",
    cynical: "Whichever number made the deck look good this quarter.",
    category: "strategy",
  },
  "30,000-foot view": {
    plain: "A high-level, big-picture perspective.",
    cynical: "I haven't looked at the details, and I don't plan to.",
    category: "strategy",
  },
  "in the weeds": {
    plain: "Caught up in low-level details.",
    cynical: "Actually doing the work, unlike whoever asked for the 30,000-foot view.",
    category: "strategy",
  },
  "deep dive": {
    plain: "A thorough, detailed review.",
    cynical: "A two-hour meeting that produces one useful sentence.",
    category: "strategy",
  },
  "double-click": {
    plain: "Look at something in more detail.",
    cynical: "Please explain the thing you just summarized. Again. Slower.",
    category: "strategy",
  },
  "peel the onion": {
    plain: "Investigate a problem layer by layer.",
    cynical: "We still don't understand the root cause after three meetings.",
    category: "strategy",
  },
  "unpack": {
    plain: "Explain something in more detail.",
    cynical: "Please justify the thing you just said.",
    category: "strategy",
  },
  "white space": {
    plain: "An unaddressed market opportunity.",
    cynical: "A market nobody has entered, possibly because it isn't actually profitable.",
    category: "strategy",
  },
  "greenfield": {
    plain: "A project built from scratch, with no existing constraints.",
    cynical: "No existing customers, no existing revenue, no existing proof it works.",
    category: "strategy",
  },
  "right to win": {
    plain: "A credible basis for competing successfully in a market.",
    cynical: "The slide that justifies entering a market we know nothing about.",
    category: "strategy",
  },
  "flywheel": {
    plain: "A self-reinforcing growth loop.",
    cynical: "A circular diagram with arrows that makes 'we're not sure how growth works' sound intentional.",
    category: "strategy",
  },
  "moat": {
    plain: "A durable competitive advantage.",
    cynical: "The thing every startup claims to have and almost none actually do.",
    category: "strategy",
  },
  "value chain": {
    plain: "The sequence of activities that create a product's value.",
    cynical: "A diagram consultants draw to justify an eight-week engagement.",
    category: "strategy",
  },
  "burning platform": {
    plain: "An urgent reason for change.",
    cynical: "The crisis leadership invents to justify a reorg they already wanted.",
    category: "strategy",
  },
  "80/20": {
    plain: "Focus on the 20% of effort that drives 80% of the result.",
    cynical: "The excuse for shipping something half-finished.",
    category: "strategy",
  },
  "so what": {
    plain: "The implication or conclusion of an analysis.",
    cynical: "The question that reveals forty hours of analysis led nowhere.",
    category: "strategy",
  },
  "directionally correct": {
    plain: "Roughly accurate, though not precisely verified.",
    cynical: "Wrong, but confidently.",
    category: "strategy",
  },
  "paralysis by analysis": {
    plain: "Being unable to decide because of overanalyzing.",
    cynical: "Spending six weeks studying a decision a coin flip would've settled just as well.",
    category: "strategy",
  },
  "pressure test": {
    plain: "Critically examine an idea for weaknesses.",
    cynical: "Let someone senior poke holes in it so they feel involved.",
    category: "strategy",
  },
  "gut check": {
    plain: "A quick, informal review to confirm something makes sense.",
    cynical: "Asking someone else to share the blame if this is wrong.",
    category: "strategy",
  },
  "workstream": {
    plain: "A defined thread of related work inside a larger project.",
    cynical: "A word that makes 'one person's to-do list' sound like a formal function.",
    category: "strategy",
  },
  "cadence": {
    plain: "A regular, recurring schedule.",
    cynical: "Why this meeting happens weekly even though nothing changes week to week.",
    category: "strategy",
  },
  "value-add": {
    plain: "The specific benefit something contributes.",
    cynical: "The thing everyone claims to provide and few can actually define.",
    category: "strategy",
  },
  "core competency": {
    plain: "The thing an organization is genuinely best at.",
    cynical: "Whatever the org already does, rebranded as a deliberate strategy.",
    category: "strategy",
  },
  "best-in-class": {
    plain: "The highest standard in the category.",
    cynical: "Nobody has actually benchmarked this against anyone else.",
    category: "strategy",
  },
  "disruptive innovation": {
    plain: "A new approach that displaces the existing market leader.",
    cynical: "The phrase every pitch deck uses, whether or not anything is being disrupted.",
    category: "strategy",
  },
  "game changer": {
    plain: "Something that meaningfully alters the competitive landscape.",
    cynical: "Said about every new feature, forgotten by the next release.",
    category: "strategy",
  },
  "paradigm shift": {
    plain: "A fundamental change in approach or thinking.",
    cynical: "A phrase used to make a modest change sound historic.",
    category: "strategy",
  },
  "secret sauce": {
    plain: "A proprietary advantage.",
    cynical: "The thing we can't actually explain, so we call it secret.",
    category: "strategy",
  },
  "net-net": {
    plain: "The overall bottom-line takeaway.",
    cynical: "Here's the one sentence you should have gotten instead of the last twenty minutes.",
    category: "strategy",
  },
  "at the end of the day": {
    plain: "Ultimately, when everything is considered.",
    cynical: "Here comes an opinion, dressed up as an inevitable conclusion.",
    category: "strategy",
  },
  "bake it in": {
    plain: "Incorporate something as a default, built-in part of the plan.",
    cynical: "We're not discussing this separately — just assume it's handled.",
    category: "strategy",
  },
  "boots on the ground": {
    plain: "People physically present, doing the actual work.",
    cynical: "The people who actually know what's happening, unlike whoever's presenting about it.",
    category: "strategy",
  },
  "bleeding edge": {
    plain: "The newest, most advanced approach available.",
    cynical: "Untested and likely to break, but it sounds impressive in a deck.",
    category: "strategy",
  },
  "cutting edge": {
    plain: "Highly advanced, at the forefront of the field.",
    cynical: "New enough that nobody can prove it doesn't work yet.",
    category: "strategy",
  },
  "table stakes": {
    plain: "The minimum required to be considered a serious competitor.",
    cynical: "The thing we should have already had, framed as a fresh insight.",
    category: "strategy",
  },
  "tam": {
    plain: "Total Addressable Market — the total possible revenue if you captured 100% of the market.",
    cynical: "The biggest number legally defensible in a pitch deck.",
    category: "strategy",
  },

  // --- Management Verbs ---
  "leverage": {
    plain: "Use.",
    cynical: "\"Use,\" but it sounds more strategic on a slide.",
    category: "verb",
  },
  "utilize": {
    plain: "Use.",
    cynical: "\"Use,\" with two extra syllables of confidence.",
    category: "verb",
  },
  "ideate": {
    plain: "Brainstorm ideas.",
    cynical: "\"Think,\" but said in a room with sticky notes.",
    category: "verb",
  },
  "operationalize": {
    plain: "Put a plan into practical action.",
    cynical: "The step that never actually happens after the strategy offsite.",
    category: "verb",
  },
  "actionize": {
    plain: "Turn an idea into something concrete enough to act on.",
    cynical: "Not a real word, but it shows up in the follow-up email anyway.",
    category: "verb",
  },
  "synergize": {
    plain: "Combine efforts for a greater combined effect.",
    cynical: "We merged two teams and are hoping it works out.",
    category: "verb",
  },
  "streamline": {
    plain: "Make a process simpler and more efficient.",
    cynical: "Cut steps — and probably a few jobs — without saying so directly.",
    category: "verb",
  },
  "optimize": {
    plain: "Improve efficiency or performance.",
    cynical: "Make a number go up without changing anything that costs money.",
    category: "verb",
  },
  "incentivize": {
    plain: "Provide a reason or reward to encourage a behavior.",
    cynical: "Pay people to do what they should already want to do.",
    category: "verb",
  },
  "empower": {
    plain: "Give someone the authority or confidence to act.",
    cynical: "Give someone the responsibility, minus the actual authority.",
    category: "verb",
  },
  "cascade": {
    plain: "Communicate information down through organizational levels.",
    cynical: "Tell the managers, so they can tell everyone else a slightly wrong version.",
    category: "verb",
  },
  "drill down": {
    plain: "Examine something in more detail.",
    cynical: "Ask the same question one level more specific, because the first answer was too vague to use.",
    category: "verb",
  },
  "granular": {
    plain: "Detailed, at a fine level.",
    cynical: "Specific enough that someone can finally be blamed.",
    category: "verb",
  },
  "holistic": {
    plain: "Considering the whole system, not just one part.",
    cynical: "We didn't actually analyze anything specific.",
    category: "verb",
  },
  "robust": {
    plain: "Strong and resistant to failure.",
    cynical: "Unlikely to fall apart during the one demo that matters.",
    category: "verb",
  },
  "seamless": {
    plain: "Smooth, without visible friction.",
    cynical: "We hid the friction from the user, not from the engineers who maintain it.",
    category: "verb",
  },
  "scalable": {
    plain: "Able to grow without a proportional increase in cost or effort.",
    cynical: "Works fine with 10 users. Untested at 10,000.",
    category: "verb",
  },
  "agile": {
    plain: "An iterative approach to work that adapts as it goes.",
    cynical: "We don't have a plan — we have two-week increments of not having a plan.",
    category: "verb",
  },
  "pivot": {
    plain: "Change strategic direction.",
    cynical: "The last plan didn't work.",
    category: "verb",
  },
  "disrupt": {
    plain: "Significantly change an existing market or process.",
    cynical: "We are still losing money, but aggressively.",
    category: "verb",
  },
  "deliverable": {
    plain: "A concrete output owed to a stakeholder.",
    cynical: "The thing that determines whether this meeting was worth having.",
    category: "verb",
  },
  "stakeholder alignment": {
    plain: "Agreement among the people affected by a decision.",
    cynical: "Getting everyone who could block this to stop objecting — not necessarily to agree.",
    category: "verb",
  },
  "alignment": {
    plain: "Shared agreement and direction.",
    cynical: "Everyone nodded, whether or not they agreed.",
    category: "verb",
  },
  "end-to-end": {
    plain: "Covering an entire process from start to finish.",
    cynical: "We tested the middle part.",
    category: "verb",
  },
  "turnkey": {
    plain: "Ready to use immediately, with nothing further required.",
    cynical: "Requires a six-week implementation. We call that 'onboarding.'",
    category: "verb",
  },
  "plug and play": {
    plain: "Works immediately, with no setup.",
    cynical: "Requires custom integration work we'll discover after signing.",
    category: "verb",
  },
  "best practice": {
    plain: "A widely accepted, proven approach.",
    cynical: "What a consultant saw work once, at a different company.",
    category: "verb",
  },
  "going forward": {
    plain: "From this point onward.",
    cynical: "A new rule, introduced right now, but framed as if it always existed.",
    category: "verb",
  },
  "socialize": {
    plain: "Informally share an idea to gather reactions.",
    cynical: "Test the idea on people who can't say no, before risking it on people who can.",
    category: "verb",
  },

  // --- Layoff Euphemisms ---
  "right-sizing": {
    plain: "Adjusting headcount to match business needs.",
    cynical: "Layoffs.",
    category: "layoff",
  },
  "restructuring": {
    plain: "Reorganizing the company's structure or teams.",
    cynical: "Layoffs, with an org chart redrawn to hide it.",
    category: "layoff",
  },
  "reduction in force": {
    plain: "A formal term for layoffs.",
    cynical: "Layoffs, phrased so HR can defend it in writing.",
    category: "layoff",
  },
  "role elimination": {
    plain: "Removing a specific position.",
    cynical: "We're firing the person, not the role, but this sounds less personal.",
    category: "layoff",
  },
  "synergy savings": {
    plain: "Cost reductions from combining teams or functions.",
    cynical: "Layoffs that follow a merger.",
    category: "layoff",
  },
  "optimizing headcount": {
    plain: "Adjusting staffing levels for efficiency.",
    cynical: "Layoffs, phrased for a shareholder call.",
    category: "layoff",
  },
  "doing more with less": {
    plain: "Achieving the same output with fewer resources.",
    cynical: "We cut your team. Your workload did not shrink to match.",
    category: "layoff",
  },
  "difficult but necessary decision": {
    plain: "Decisions with negative consequences, made for the business's greater good.",
    cynical: "The sentence right before an announcement nobody wanted to make.",
    category: "layoff",
  },

  // --- Hustle Culture ---
  "move fast and break things": {
    plain: "Prioritize speed over caution.",
    cynical: "We'll deal with the consequences later, probably in a postmortem nobody reads.",
    category: "hustle",
  },
  "fail fast": {
    plain: "Quickly identify what isn't working, so you can move on.",
    cynical: "We didn't plan carefully, so at least let's find out we were wrong quickly.",
    category: "hustle",
  },
  "hit the ground running": {
    plain: "Start productively right away, with no ramp-up time.",
    cynical: "There's no onboarding. Figure it out.",
    category: "hustle",
  },
  "wear many hats": {
    plain: "Handle a wide variety of responsibilities.",
    cynical: "This role is actually three jobs and one salary.",
    category: "hustle",
  },
  "all hands on deck": {
    plain: "Everyone needs to help with an urgent situation.",
    cynical: "Someone should have planned for this two weeks ago.",
    category: "hustle",
  },
  "above my pay grade": {
    plain: "Outside my level of authority to decide.",
    cynical: "I don't want to be blamed for this decision.",
    category: "hustle",
  },
  "herding cats": {
    plain: "Trying to coordinate a group of independent, hard-to-manage people.",
    cynical: "Managing this team.",
    category: "hustle",
  },
  "throw it over the wall": {
    plain: "Hand off work to another team without much coordination.",
    cynical: "Make it someone else's problem now.",
    category: "hustle",
  },
  "drink the kool-aid": {
    plain: "Fully adopt a group's beliefs or culture.",
    cynical: "Stop asking questions and agree with leadership.",
    category: "hustle",
  },
  "eat our own dog food": {
    plain: "Use your own product internally before selling it.",
    cynical: "We found the bugs the hard way. Now so will you.",
    category: "hustle",
  },
  "single source of truth": {
    plain: "One authoritative place where data is correct and up to date.",
    cynical: "The spreadsheet that's only correct for about a week after someone updates it.",
    category: "hustle",
  },
  "siloed": {
    plain: "Isolated, not sharing information with other teams.",
    cynical: "The natural state of any company with more than one department.",
    category: "hustle",
  },
  "break down silos": {
    plain: "Improve cross-team communication and collaboration.",
    cynical: "The goal of every reorg, which the next reorg will also promise to fix.",
    category: "hustle",
  },
  "cross-functional": {
    plain: "Involving people from multiple departments.",
    cynical: "A meeting where everyone represents a different team's excuse.",
    category: "hustle",
  },
  "digital transformation": {
    plain: "Adopting new technology to change how a business operates.",
    cynical: "We bought new software and are hoping the culture follows.",
    category: "hustle",
  },
  "change management": {
    plain: "The practice of guiding people through organizational change.",
    cynical: "The meetings that happen so people feel heard before the decision is implemented anyway.",
    category: "hustle",
  },
  "thought leadership": {
    plain: "Being recognized as an authority who shapes ideas in a field.",
    cynical: "Posts a lot on LinkedIn.",
    category: "hustle",
  },
  "elevator pitch": {
    plain: "A very brief summary of an idea.",
    cynical: "The version of the idea simple enough that leadership will actually listen to it.",
    category: "hustle",
  },
  "culture fit": {
    plain: "Compatibility with a company's values and working style.",
    cynical: "Sometimes a real signal, sometimes just 'reminds me of myself.'",
    category: "hustle",
  },
  "servant leadership": {
    plain: "A leadership style focused on supporting the team's needs first.",
    cynical: "A phrase managers use in the same week they cut the team's budget.",
    category: "hustle",
  },
  "punt": {
    plain: "Postpone a decision.",
    cynical: "Decide later, which sometimes means never.",
    category: "verb",
  },
  "value proposition": {
    plain: "The core benefit offered to customers.",
    cynical: "The sentence that's supposed to answer 'why should anyone care' and often doesn't.",
    category: "strategy",
  },
  "swim lane": {
    plain: "A defined area of responsibility within a larger process.",
    cynical: "Where blame gets neatly filed.",
    category: "strategy",
  },
  "circle the wagons": {
    plain: "Come together defensively in a crisis.",
    cynical: "Nobody wants to be blamed individually, so we'll be blamed as a group.",
    category: "hustle",
  },
  "move at the speed of trust": {
    plain: "Progress paced by relationship-building.",
    cynical: "This is going to take a while, and nobody will say why.",
    category: "hustle",
  },
  "buy vs build": {
    plain: "Deciding whether to purchase a solution or create one internally.",
    cynical: "A decision usually made by whoever's budget it comes out of.",
    category: "strategy",
  },
  "day one mentality": {
    plain: "Treating every day with startup-level urgency and freshness.",
    cynical: "A phrase used to justify having no institutional memory.",
    category: "strategy",
  },
  "growth mindset": {
    plain: "A belief that abilities can be developed through effort.",
    cynical: "Used to explain why the feedback is that you should want more feedback.",
    category: "hustle",
  },
  "bring your whole self to work": {
    plain: "Feel free to be authentic at work.",
    cynical: "As long as your whole self doesn't disagree in the all-hands.",
    category: "hustle",
  },
  "psychological safety": {
    plain: "A team environment where people feel safe to take risks and speak up.",
    cynical: "Talked about constantly in the meeting where nobody feels safe enough to say what they actually think.",
    category: "hustle",
  },
  "unicorn": {
    plain: "A rare candidate or company with an unusually complete set of qualities.",
    cynical: "A job requirement list combining five roles into one salary.",
    category: "strategy",
  },
  "rockstar": {
    plain: "An exceptionally skilled employee.",
    cynical: "A job title trying to make unpaid overtime sound cool.",
    category: "hustle",
  },
  "move up and to the right": {
    plain: "A chart showing consistent growth.",
    cynical: "The only acceptable shape for a chart in this deck.",
    category: "strategy",
  },
  "let's park that": {
    plain: "Set that aside for now.",
    cynical: "This is joining the parking lot. Permanently.",
    category: "meeting",
  },
  "own the outcome": {
    plain: "Take full responsibility for a result.",
    cynical: "The result had better be good, because now it's only your name on it.",
    category: "verb",
  },
  "raise your hand": {
    plain: "Volunteer, or flag an issue.",
    cynical: "The thing you do once, then quietly regret.",
    category: "meeting",
  },
  "single-threaded owner": {
    plain: "One person clearly responsible for a task.",
    cynical: "One person to blame, clearly identified in advance.",
    category: "verb",
  },
  "shift left": {
    plain: "Address issues earlier in a process.",
    cynical: "Someone upstream now has to do the work that used to happen downstream.",
    category: "verb",
  },
  "runway": {
    plain: "How much time or money remains before resources run out.",
    cynical: "The number nobody wants to say out loud in the all-hands.",
    category: "strategy",
  },
  "escalate": {
    plain: "Raise an issue to someone with more authority.",
    cynical: "Go over someone's head, professionally worded.",
    category: "verb",
  },
};

// Tiers for the "jargon density" score, ordered from lowest to highest
// density. `max` is the upper bound (as a fraction of total words) for
// that tier — the app walks this list top to bottom and stops at the
// first tier the density fits under.
export const JARGON_TIERS = [
  { max: 0, label: "Plain Speaker", blurb: "Suspiciously clear. HR will want to know what you're hiding." },
  { max: 0.04, label: "Junior Associate", blurb: "A light seasoning of jargon. Respectable." },
  { max: 0.09, label: "Senior Manager", blurb: "Comfortably fluent in corporate. You could run a standup in your sleep." },
  { max: 0.16, label: "Principal Consultant", blurb: "Billable-hour energy. This memo could open a client engagement." },
  { max: 1, label: "Partner-Track", blurb: "Pure vapor. Nobody in the room could tell you what this actually says." },
];

// Sample corporate text — used by the "Load an example" buttons so
// there's something to decode on first load.
export const EXAMPLES = [
  {
    label: "Q3 Strategy Sync",
    text: "Team — wanted to circle back after yesterday's deep dive. At the end of the day, we need to move the needle on this initiative, so let's ideate some low-hanging fruit before we boil the ocean. I'll socialize the one-pager with the steering committee to get buy-in, then we can operationalize next steps. Let's touch base Thursday to level set and close the loop. Great alignment today, team — this is a real paradigm shift for the org. Appreciate everyone's bandwidth on this.",
  },
  {
    label: "Post-Merger Memo",
    text: "As part of our ongoing efforts to optimize headcount and drive synergy savings following the merger, we've made the difficult but necessary decision to move forward with a reduction in force. This right-sizing reflects our commitment to doing more with less and streamlining the org so we can operate with greater agility going forward. We recognize this is a heavy lift for everyone, and we're grateful for your resilience as we navigate this restructuring together.",
  },
  {
    label: "Startup Pitch Narration",
    text: "Our flywheel creates a defensible moat in a massive greenfield TAM. We're not just disrupting the category — we're redefining the paradigm. Our secret sauce is a scalable, best-in-class platform built to move fast and break things. At the end of the day, this is a game changer with serious white space to capture, and our north star metric proves we're already moving the needle.",
  },
];

// --- Weasel Word Scanner ---
// Same shape as BUZZWORD_DICTIONARY on purpose: scan.js's segmentText,
// rewriteText, and densityStats are generic — they don't know or care
// whether they're scanning for buzzwords, hedges, or urgency signals.
// This dictionary is what turns that generic machinery into "weasel word
// scanner" instead of a second buzzword decoder.
export const WEASEL_CATEGORIES = {
  hedge: { label: "Hedge", color: "#3d6a8a" },
  qualifier: { label: "Soft Qualifier", color: "#4f6a3d" },
  deflection: { label: "Passive Deflection", color: "#8a3d3d" },
  certainty: { label: "Fake Certainty", color: "#8a4f3d" },
};

export const WEASEL_DICTIONARY = {
  "sort of": {
    plain: "Partially or imprecisely.",
    cynical: "I'm not confident enough to commit, but I don't want to say that.",
    category: "hedge",
  },
  "kind of": {
    plain: "Partially or imprecisely.",
    cynical: "I'm not confident enough to commit, but I don't want to say that.",
    category: "hedge",
  },
  "somewhat": {
    plain: "To a limited degree.",
    cynical: "Enough that I noticed, not enough that I'll defend a number.",
    category: "hedge",
  },
  "relatively": {
    plain: "Compared to some baseline.",
    cynical: "Compared to what, exactly? Never specified.",
    category: "hedge",
  },
  "fairly": {
    plain: "To a moderate degree.",
    cynical: "A softener with no actual measurement behind it.",
    category: "hedge",
  },
  "to some extent": {
    plain: "Partially.",
    cynical: "Enough to mention, not enough to defend.",
    category: "hedge",
  },
  "to a certain degree": {
    plain: "Partially.",
    cynical: "Enough to mention, not enough to defend.",
    category: "hedge",
  },
  "more or less": {
    plain: "Approximately.",
    cynical: "Close enough that I don't have to be precise.",
    category: "hedge",
  },
  "in some ways": {
    plain: "According to certain aspects.",
    cynical: "Vague enough to be unfalsifiable.",
    category: "hedge",
  },
  "arguably": {
    plain: "By some reasonable interpretation.",
    cynical: "I'm not sure, but 'arguably' sounds smarter than 'maybe.'",
    category: "hedge",
  },
  "it could be argued": {
    plain: "Some might reasonably claim this.",
    cynical: "I want credit for the idea without actually committing to it.",
    category: "hedge",
  },
  "one might say": {
    plain: "This is one way of framing it.",
    cynical: "I'm floating an opinion while pretending it isn't mine.",
    category: "hedge",
  },
  "in a manner of speaking": {
    plain: "Loosely, or metaphorically.",
    cynical: "I want to say this without being pinned to it literally.",
    category: "hedge",
  },
  "i think": {
    plain: "In my opinion or assessment.",
    cynical: "Hedging so I can walk this back if I'm wrong.",
    category: "qualifier",
  },
  "i feel like": {
    plain: "My impression is...",
    cynical: "Framing an opinion as a feeling so it's harder to argue with.",
    category: "qualifier",
  },
  "possibly": {
    plain: "There's a chance of this.",
    cynical: "True of almost anything, so it commits to nothing.",
    category: "qualifier",
  },
  "it's possible that": {
    plain: "There's a chance that...",
    cynical: "Technically true of almost anything, so it commits to nothing.",
    category: "qualifier",
  },
  "perhaps": {
    plain: "Maybe.",
    cynical: "'Maybe,' dressed up for a client deck.",
    category: "qualifier",
  },
  "maybe": {
    plain: "Uncertain either way.",
    cynical: "A word that keeps every option open, including doing nothing.",
    category: "qualifier",
  },
  "potentially": {
    plain: "Under the right conditions, this could happen.",
    cynical: "Might happen, might not — either way I already said 'potentially.'",
    category: "qualifier",
  },
  "presumably": {
    plain: "Assumed to be true, without direct confirmation.",
    cynical: "I'm guessing, but 'presumably' sounds researched.",
    category: "qualifier",
  },
  "seemingly": {
    plain: "Based on appearances.",
    cynical: "I haven't verified this, but it looked true.",
    category: "qualifier",
  },
  "apparently": {
    plain: "Based on what I've heard or observed.",
    cynical: "I heard this secondhand and am not vouching for it.",
    category: "qualifier",
  },
  "as far as i know": {
    plain: "Based on my current information.",
    cynical: "Built-in deniability if this turns out to be wrong.",
    category: "qualifier",
  },
  "my understanding is": {
    plain: "Based on what I currently know.",
    cynical: "If this is wrong, I only said 'understanding,' not 'fact.'",
    category: "qualifier",
  },
  "i would imagine": {
    plain: "My expectation, without direct confirmation.",
    cynical: "A guess wearing a confidence costume.",
    category: "qualifier",
  },
  "may or may not": {
    plain: "Uncertain either way.",
    cynical: "A sentence that commits to literally nothing.",
    category: "qualifier",
  },
  "mistakes were made": {
    plain: "Errors occurred.",
    cynical: "Errors occurred, and nobody involved will be named.",
    category: "deflection",
  },
  "it was decided": {
    plain: "A decision was reached.",
    cynical: "By someone I'm not going to name.",
    category: "deflection",
  },
  "concerns were raised": {
    plain: "Some people expressed concerns.",
    cynical: "By someone unnamed, about something unspecified.",
    category: "deflection",
  },
  "issues were identified": {
    plain: "Problems were found.",
    cynical: "Problems were found. Ownership pending.",
    category: "deflection",
  },
  "it is what it is": {
    plain: "This outcome can't be changed now.",
    cynical: "I don't want to discuss this further.",
    category: "deflection",
  },
  "lessons were learned": {
    plain: "The team reflected on what went wrong.",
    cynical: "Nobody is being held accountable, but we did think about it.",
    category: "deflection",
  },
  "generally speaking": {
    plain: "As a broad pattern, with exceptions.",
    cynical: "I'm about to make a claim I don't want held to specifics.",
    category: "certainty",
  },
  "for the most part": {
    plain: "As a broad pattern, with exceptions.",
    cynical: "I'm about to make a claim I don't want held to specifics.",
    category: "certainty",
  },
  "as a general rule": {
    plain: "As a typical pattern.",
    cynical: "True often enough that I don't have to defend the exceptions.",
    category: "certainty",
  },
  "more often than not": {
    plain: "Usually, but not always.",
    cynical: "A number I'm not willing to actually give you.",
    category: "certainty",
  },
  "in most cases": {
    plain: "Usually, but not always.",
    cynical: "A number I'm not willing to actually give you.",
    category: "certainty",
  },
  "typically": {
    plain: "In the usual case.",
    cynical: "Except when it's inconvenient to the point I'm making.",
    category: "certainty",
  },
  "should be fine": {
    plain: "Expected to work, though not fully verified.",
    cynical: "Haven't tested this.",
    category: "certainty",
  },
  "should work": {
    plain: "Expected to work, though not fully verified.",
    cynical: "Haven't tested this.",
    category: "certainty",
  },
  "at this point in time": {
    plain: "Now.",
    cynical: "'Now,' but padded to sound weightier.",
    category: "certainty",
  },
  "not necessarily": {
    plain: "Not always true.",
    cynical: "A hedge stapled onto whatever was just said.",
    category: "qualifier",
  },
  "in theory": {
    plain: "According to the idea, though not tested in practice.",
    cynical: "I know this doesn't actually work, but the plan sounded good.",
    category: "qualifier",
  },
  "loosely speaking": {
    plain: "In a general, imprecise sense.",
    cynical: "Please don't fact-check this.",
    category: "hedge",
  },
  "if that makes sense": {
    plain: "Checking whether the explanation landed.",
    cynical: "I'm not fully sure it made sense to me either.",
    category: "qualifier",
  },
  "correct me if i'm wrong": {
    plain: "Inviting correction before stating a claim.",
    cynical: "Pre-loading an excuse in case I'm wrong.",
    category: "qualifier",
  },
  "just a thought": {
    plain: "An informal suggestion.",
    cynical: "An idea I want credit for without being responsible for it.",
    category: "hedge",
  },
  "not to be that person, but": {
    plain: "Introducing a criticism gently.",
    cynical: "I am about to be exactly that person.",
    category: "deflection",
  },
  "no offense, but": {
    plain: "A disclaimer before a critical remark.",
    cynical: "Offense is coming regardless.",
    category: "deflection",
  },
  "with all due respect": {
    plain: "A polite preface to disagreement.",
    cynical: "The amount of respect due is about to be very little.",
    category: "deflection",
  },
  "for what it's worth": {
    plain: "Offering an opinion with modest confidence.",
    cynical: "In case this gets ignored, at least I said it.",
    category: "hedge",
  },
  "just my two cents": {
    plain: "A modestly offered opinion.",
    cynical: "An opinion, pre-shrunk so it can't be blamed for anything.",
    category: "hedge",
  },
  "take this with a grain of salt": {
    plain: "Consider this information cautiously.",
    cynical: "I'm about to say something I'm not confident in.",
    category: "qualifier",
  },
  "if i had to guess": {
    plain: "An estimate without full information.",
    cynical: "A guess, dressed up as analysis.",
    category: "qualifier",
  },
  "long story short": {
    plain: "Summarizing to save time.",
    cynical: "About to tell the long story anyway.",
    category: "certainty",
  },
  "at the risk of oversimplifying": {
    plain: "Acknowledging a simplified explanation.",
    cynical: "Oversimplifying, on purpose, so nobody can push back.",
    category: "hedge",
  },
};

export const WEASEL_TIERS = [
  { max: 0, label: "Ice Cold", blurb: "Zero hedging. Either very confident, or very brave." },
  { max: 0.03, label: "Reasonably Sure", blurb: "A little softening here and there. Normal human speech." },
  { max: 0.07, label: "Diplomatically Vague", blurb: "Nothing here is quite a commitment." },
  { max: 0.13, label: "Committee-Written", blurb: "Every claim has a built-in exit ramp." },
  { max: 1, label: "Legally Reviewed", blurb: "Nothing here could be held against anyone in a court of law." },
];

export const WEASEL_EXAMPLES = [
  {
    label: "The Hedge-Everything Status Update",
    text: "I think we're kind of on track, generally speaking, though it could be argued that timelines have somewhat shifted. As far as I know, the vendor issue should be fine, but mistakes were made on our side too. My understanding is that concerns were raised in most cases before the deadline, so at this point in time we're more or less where we expected to be.",
  },
  {
    label: "The Non-Apology",
    text: "Mistakes were made, and lessons were learned. It could be argued that, generally speaking, issues were identified fairly early, though it is what it is at this point in time. As far as I know, this should work going forward.",
  },
];

// --- Manufactured Urgency Detector ---
// Same generic scanning machinery again, pointed at a third kind of
// phrase: not jargon, not hedging, but manufactured time pressure.
export const URGENCY_CATEGORIES = {
  deadline: { label: "Deadline Pressure", color: "#8a3d3d" },
  escalation: { label: "Escalation Language", color: "#8a4f3d" },
  social: { label: "Social Pressure", color: "#4f6a3d" },
};

export const URGENCY_DICTIONARY = {
  "asap": {
    plain: "As soon as possible.",
    cynical: "No actual deadline was set, but urgency was assumed anyway.",
    category: "deadline",
  },
  "by eod": {
    plain: "By the end of the business day.",
    cynical: "A deadline invented in the last five minutes.",
    category: "deadline",
  },
  "by end of day": {
    plain: "By the end of the business day.",
    cynical: "A deadline invented in the last five minutes.",
    category: "deadline",
  },
  "urgent": {
    plain: "Requires prompt attention.",
    cynical: "Marked urgent by someone who didn't plan ahead.",
    category: "deadline",
  },
  "high priority": {
    plain: "Ranked above other current work.",
    cynical: "Everything is 'high priority' until nothing is.",
    category: "deadline",
  },
  "top priority": {
    plain: "Ranked above other current work.",
    cynical: "Everything is 'top priority' until nothing is.",
    category: "deadline",
  },
  "drop everything": {
    plain: "Stop current work to address this immediately.",
    cynical: "Someone else's poor planning is now your emergency.",
    category: "deadline",
  },
  "time-sensitive": {
    plain: "Has a meaningful deadline attached.",
    cynical: "Said about things with and without an actual deadline, equally.",
    category: "deadline",
  },
  "need this today": {
    plain: "A same-day deadline.",
    cynical: "Discovered today, needed today.",
    category: "deadline",
  },
  "need it today": {
    plain: "A same-day deadline.",
    cynical: "Discovered today, needed today.",
    category: "deadline",
  },
  "right away": {
    plain: "Immediately.",
    cynical: "Immediately, for reasons that will not be explained.",
    category: "deadline",
  },
  "immediately": {
    plain: "Without delay.",
    cynical: "Without delay, and without much notice either.",
    category: "deadline",
  },
  "need this yesterday": {
    plain: "Retroactively urgent framing.",
    cynical: "The planning failure is being passed to you as a time crunch.",
    category: "deadline",
  },
  "fire drill": {
    plain: "A sudden, high-pressure situation requiring immediate response.",
    cynical: "Usually a symptom of nobody having planned this earlier.",
    category: "deadline",
  },
  "can't wait": {
    plain: "Requires action before some near-term point.",
    cynical: "Emotional framing standing in for an actual deadline.",
    category: "deadline",
  },
  "per my last email": {
    plain: "Referring back to a previous message.",
    cynical: "A polite way of saying you didn't answer me the first time.",
    category: "escalation",
  },
  "following up again": {
    plain: "A repeated follow-up.",
    cynical: "The urgency is rising with each unanswered message, not with the actual stakes.",
    category: "escalation",
  },
  "just following up": {
    plain: "A gentle follow-up.",
    cynical: "The second message that pretends to be as casual as the first.",
    category: "escalation",
  },
  "third time asking": {
    plain: "A third follow-up request.",
    cynical: "At this point it's about being ignored, not about the task.",
    category: "escalation",
  },
  "escalating this": {
    plain: "Raising the issue to someone with more authority.",
    cynical: "Going over your head, professionally.",
    category: "escalation",
  },
  "looping in leadership": {
    plain: "Including senior stakeholders in the conversation.",
    cynical: "A visibility play, not a strategy.",
    category: "escalation",
  },
  "flagging this for visibility": {
    plain: "Making sure the right people are aware.",
    cynical: "Building a paper trail, just in case.",
    category: "escalation",
  },
  "this is now blocking": {
    plain: "Other work cannot proceed until this is resolved.",
    cynical: "Reframing a request as a dependency, to jump the queue.",
    category: "escalation",
  },
  "gentle reminder": {
    plain: "A polite follow-up.",
    cynical: "'Gentle' is doing a lot of work in this sentence.",
    category: "escalation",
  },
  "just need a quick yes/no": {
    plain: "A simple, fast decision.",
    cynical: "A complex decision, minimized to make it harder to say no.",
    category: "social",
  },
  "shouldn't take long": {
    plain: "Expected to be quick.",
    cynical: "Said by someone who isn't the one doing it.",
    category: "social",
  },
  "quick favor": {
    plain: "A small, fast request.",
    cynical: "A request sized down to make it harder to decline.",
    category: "social",
  },
  "five minutes of your time": {
    plain: "A brief request.",
    cynical: "Rarely actually five minutes.",
    category: "social",
  },
  "won't take long, i promise": {
    plain: "A reassurance about the length of a task.",
    cynical: "A promise made before anyone actually timed it.",
    category: "social",
  },
  "everyone else has responded": {
    plain: "Other people have already replied.",
    cynical: "Social pressure, dressed as a status update.",
    category: "social",
  },
  "before end of business": {
    plain: "By the close of the business day.",
    cynical: "'By EOD,' in a more formal costume.",
    category: "deadline",
  },
  "this can't slip again": {
    plain: "The deadline must be met this time.",
    cynical: "It slipped before, and everyone's pretending that's new information.",
    category: "deadline",
  },
  "we're already behind": {
    plain: "The timeline has already been missed.",
    cynical: "Announced today, blamed on you starting tomorrow.",
    category: "deadline",
  },
  "closing the loop asap": {
    plain: "Resolving something quickly.",
    cynical: "Said to sound proactive about a delay that already happened.",
    category: "escalation",
  },
  "want to keep this moving": {
    plain: "Encouraging progress.",
    cynical: "Please respond before I have to follow up again.",
    category: "social",
  },
  "just need your sign-off": {
    plain: "Requesting final approval.",
    cynical: "A decision already made, waiting on a formality.",
    category: "social",
  },
  "before this falls through the cracks": {
    plain: "Before this gets lost or forgotten.",
    cynical: "It's already falling through the cracks, and this message is the safety net.",
    category: "escalation",
  },
  "not to add pressure, but": {
    plain: "A disclaimer before an urgent request.",
    cynical: "Pressure is precisely what's being added.",
    category: "social",
  },
  "wanted to make sure this didn't get lost": {
    plain: "A follow-up to ensure visibility.",
    cynical: "A polite way of saying you're being ignored.",
    category: "escalation",
  },
  "given the timeline": {
    plain: "Considering the schedule constraints.",
    cynical: "A phrase used to justify why corners are about to be cut.",
    category: "deadline",
  },
  "we're up against it": {
    plain: "Facing a tight deadline.",
    cynical: "A tight deadline that somehow wasn't mentioned until now.",
    category: "deadline",
  },
  "hate to be a broken record, but": {
    plain: "Acknowledging a repeated request.",
    cynical: "The record isn't broken. It's just being ignored.",
    category: "escalation",
  },
  "need eyes on this": {
    plain: "Requesting review or attention.",
    cynical: "A request phrased to sound smaller than the actual ask.",
    category: "social",
  },
  "this is time-critical": {
    plain: "Timing significantly affects the outcome.",
    cynical: "Said about things that are, and are not, actually time-critical — interchangeably.",
    category: "deadline",
  },
  "can you prioritize this over everything else": {
    plain: "A request to make this the top priority.",
    cynical: "Someone else's fire, now yours.",
    category: "social",
  },
};

export const URGENCY_TIERS = [
  { max: 0, label: "No Rush", blurb: "Zero urgency signals. This can probably wait." },
  { max: 0.04, label: "Mildly Inflated", blurb: "A little pressure, but plausibly real." },
  { max: 0.09, label: "Fire Drill", blurb: "Everything reads urgent. Some of it might even be." },
  { max: 0.16, label: "Code Red", blurb: "Stacked escalation and deadline language, back to back." },
  { max: 1, label: "The Boy Who Cried Wolf", blurb: "So much manufactured urgency that the real emergencies won't be believed." },
];

export const URGENCY_EXAMPLES = [
  {
    label: "The Friday 4:47pm Email",
    text: "Hi team, following up again — this is now blocking the launch and I need this today. I know it's a quick favor, shouldn't take long, but this is time-sensitive and high priority. Per my last email, everyone else has responded except your team. Escalating this and looping in leadership if I don't hear back ASAP.",
  },
  {
    label: "The Manufactured Fire Drill",
    text: "URGENT — need this immediately, drop everything. I know it's a fire drill, I promise it won't take long, just need a quick yes/no. Flagging this for visibility since I can't wait until Monday. Third time asking, gentle reminder that this was due by EOD.",
  },
];

// --- So-What Test ---
// A deliberately different data shape from the three dictionaries above:
// this one is just an ARRAY (used as a Set) of phrases, because all this
// tool needs is a yes/no membership check — "does this sentence contain
// an action-indicating phrase?" — not a value to look up. Good contrast:
// reach for an object when you need to look something UP, an array/Set
// when you only need to check whether something's THERE.
export const SO_WHAT_INDICATORS = [
  "should",
  "must",
  "recommend",
  "propose",
  "we need to",
  "we should",
  "requires",
  "means that",
  "therefore",
  "as a result",
  "so we",
  "which means",
  "next step",
  "decide",
  "prioritize",
  "focus on",
  "stop doing",
  "start doing",
  "invest in",
  "cut",
  "eliminate",
  "double down on",
  "shift toward",
  "commit to",
  "implication is",
  "the takeaway",
  "will",
  "let's",
  "plan to",
];

export const SO_WHAT_TIERS = [
  { max: 0, label: "All Filler", blurb: "Every sentence describes. None of them decide." },
  { max: 0.25, label: "Mostly Description", blurb: "Some signal, buried in a lot of scene-setting." },
  { max: 0.5, label: "Getting There", blurb: "About half of this earns its place." },
  { max: 0.75, label: "Consultant-Grade", blurb: "Most sentences carry a real implication." },
  { max: 1, label: "Recommendation Machine", blurb: "Nothing here just describes. Every line decides something." },
];

export const SO_WHAT_EXAMPLES = [
  {
    label: "All Description, No Decision",
    text: "Revenue was up in Q2 compared to Q1. Customer churn stayed roughly flat. The support team fielded more tickets than last quarter. Engineering shipped three new features. The marketing team ran two campaigns. Overall sentiment on the last survey was mixed.",
  },
  {
    label: "Actually Has a So-What",
    text: "Revenue was up in Q2, but churn stayed flat, which means growth is coming entirely from new customers, not retention. We should prioritize a retention initiative next quarter. The support team's ticket volume implies our onboarding flow needs work — we recommend cutting the sign-up steps from six to three. Let's commit to shipping that by end of quarter.",
  },
];

// --- Excuse Generator ---
// Another lookup table: keyed by scenario id, each value is a label plus
// an array of ready-made excuses. Looking up a scenario is still an
// instant `EXCUSE_BANK[scenario]` read — the randomness only happens
// afterward, picking one line out of that scenario's array.
export const EXCUSE_BANK = {
  late: {
    label: "You're late to a meeting",
    excuses: [
      "Sorry, I got pulled into an urgent call right before this.",
      "Apologies for the delay — back-to-back meetings today.",
      "Sorry, I'm coming from a session that ran long.",
      "My previous meeting ran over, joining now.",
      "Apologies, I had a scheduling conflict I couldn't move.",
      "Sorry, a technical issue on my end delayed me a few minutes.",
    ],
  },
  deadline: {
    label: "You missed a deadline",
    excuses: [
      "We ran into some unexpected dependencies that pushed the timeline.",
      "The scope shifted partway through, so the schedule moved with it.",
      "We had to prioritize an urgent request from leadership.",
      "We're waiting on input from another team before we can finish.",
      "It's nearly complete — just finishing final review.",
      "We wanted to make sure it was done right rather than rush it out.",
    ],
  },
  unread: {
    label: "You didn't read the email everyone's referencing",
    excuses: [
      "Could you send me a quick summary? I want to make sure I respond accurately.",
      "Let's discuss this directly so I don't misinterpret anything.",
      "I saw it come through and wanted to give it a proper read rather than skim it.",
      "Can we sync briefly instead of continuing in the thread?",
    ],
  },
  camera: {
    label: "Your camera's been off the whole call",
    excuses: [
      "My connection's a bit unstable today, so I've kept my camera off.",
      "I'm dialing in from a shared space today, still following along.",
      "Stepping back from video today, but I'm here and listening.",
      "Keeping bandwidth free for whoever's presenting.",
    ],
  },
  unprepared: {
    label: "You're unprepared for a status update",
    excuses: [
      "We're on track overall — I'll share specific numbers in a follow-up.",
      "Let me confirm the details and get back to you by end of day.",
      "At a high level things are progressing well; I don't want to share unverified specifics yet.",
      "I'll follow up with the exact figures once I've confirmed them.",
    ],
  },
  leftOnRead: {
    label: "You left someone on read for two days",
    excuses: [
      "Sorry for the delayed response — this needed more than a quick reply.",
      "I saw your message and wanted to respond properly rather than rush it.",
      "Apologies, I've been heads-down on a few urgent items. Following up now.",
      "Thanks for the nudge — this got buried, appreciate you flagging it again.",
    ],
  },
  notStarted: {
    label: "You haven't started the thing you said was 'almost done'",
    excuses: [
      "It's underway — just wrapping up the final steps.",
      "I've been laying the groundwork before diving into execution.",
      "I wanted to confirm alignment before building this out.",
      "I'm finishing up a couple of dependencies before this can move forward.",
    ],
  },
};

// --- Email Sign-Off Generator ---
// Same pattern again: keyed by mood id, each value a label plus an array
// of sign-offs. Three tools, one pattern, reused on purpose.
export const SIGNOFF_BANK = {
  extraNice: {
    label: "Extra Nice",
    signoffs: [
      "Thanks so much, you're a star! ✨",
      "Really appreciate you, always!",
      "You're the best, thank you!!",
      "Sending good vibes your way today 🌟",
    ],
  },
  passiveAggressive: {
    label: "Passive-Aggressive",
    signoffs: [
      "Per my last email,",
      "Just circling back on this (third time's the charm),",
      "Gentle bump on this, in case it got buried,",
      "Following up once more, as discussed,",
      "For visibility, looping in your manager,",
      "As previously mentioned, but happy to resend,",
    ],
  },
  genuinelyWarm: {
    label: "Genuinely Warm",
    signoffs: [
      "Hope you have a great rest of your week!",
      "Thanks for your patience on this one.",
      "Appreciate you taking the time — really.",
      "No rush at all, whenever works for you.",
    ],
  },
  corporateNeutral: {
    label: "Corporate Neutral",
    signoffs: ["Best regards,", "Kind regards,", "Thanks in advance,", "Looking forward to your thoughts,"],
  },
  exhausted: {
    label: "Running on Empty",
    signoffs: [
      "Sent from my phone, forgive the brevity.",
      "Apologies for the delay — it's been a week.",
      "Typing this between meetings, will follow up properly later.",
      "Running on coffee and optimism at this point.",
    ],
  },
};
