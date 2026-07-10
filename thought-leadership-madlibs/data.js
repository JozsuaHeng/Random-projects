// Word banks. Each is a flat list of strings a blank can be filled with.
// Add more entries here to add variety -- generator.js and ui.js never need to change.

export const WORD_BANKS = {
  PERSON: [
    "my Uber driver", "a barista at Starbucks", "my 7-year-old niece",
    "a stranger at the airport", "my old drill sergeant", "a monk I met in Bali",
    "my therapist", "the janitor at my first job", "a homeless man outside my office",
    "my dog", "a toddler at the grocery store", "my grandmother",
  ],
  INDUSTRY: [
    "fintech", "Web3", "the wellness space", "B2B SaaS", "e-commerce",
    "the creator economy", "AI", "real estate", "supply chain", "recruiting",
    "venture capital", "the metaverse",
  ],
  ADJECTIVE: [
    "Exceptional", "Authentic", "Visionary", "Resilient", "Intentional",
    "Unstoppable", "Radically honest", "High-agency", "Values-driven",
    "Servant", "Unreasonable", "Anti-fragile",
  ],
  VERB: [
    "leverage", "operationalize", "unlock", "unpack", "champion",
    "double down on", "lean into", "circle back on", "action", "synergize",
    "scale", "own", "productize", "10x",
  ],
  NOUN_ABSTRACT: [
    "journey", "why", "north star", "narrative", "ecosystem", "mindset",
    "brand", "story", "purpose", "vision", "growth", "legacy", "flywheel",
    "moat",
  ],
  TIME_PERIOD: [
    "90 days", "a decade", "one quarter", "three sleepless nights",
    "my entire 20s", "a single Tuesday", "six months", "a cross-country flight",
    "one earnings call",
  ],
  NUMBER: ["3", "5", "7", "9", "27", "112"],
  BUZZWORD: [
    "Synergy", "Disruption", "Hustle", "Growth mindset", "Radical transparency",
    "Bandwidth", "Alignment", "Ideation", "Bleeding-edge innovation",
    "Servant leadership", "Thought leadership", "Grit", "Psychological safety",
  ],
  ANIMAL: [
    "eagle", "octopus", "cheetah", "hedgehog", "wolf", "phoenix", "shark",
    "bamboo (yes, a plant, stay with me)", "salmon swimming upstream",
  ],
  EMOTION: [
    "vulnerable", "grateful", "fired up", "humbled", "recharged", "seen",
    "unstoppable", "raw", "aligned",
  ],
  BAD_THING: [
    "laid off", "fired", "rejected from Harvard Business School", "demoted",
    "ghosted by a VC", "passed over for a promotion",
    "told I'd never make it in this industry", "denied a Series A",
  ],
  EVENT: [
    "SaaS Con", "a TEDx stage", "Davos", "a Rotary Club breakfast",
    "an all-hands meeting", "a founder retreat in Tulum", "a podcast recording",
    "career day at my kid's school",
  ],
  PLACE: [
    "my car in a Target parking lot", "a Delta terminal at 4am",
    "my parents' basement", "a coworking space I couldn't afford",
    "the back office of our first store", "a hotel bathroom before a pitch",
    "a Waffle House at 2am", "the stairwell outside a board meeting",
  ],
};

// Templates: {{key}} placeholders get filled from the `blanks` list, in order.
// Each blank's `bank` points at a WORD_BANKS key for randomization.
export const TEMPLATES = [
  {
    id: "mentor",
    name: "The Unlikely Mentor",
    blanks: [
      { key: "person", label: "An unlikely mentor", bank: "PERSON" },
      { key: "industry1", label: "An industry", bank: "INDUSTRY" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "time2", label: "Another time period", bank: "TIME_PERIOD" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "verb2", label: "Another corporate verb", bank: "VERB" },
      { key: "verb3", label: "Yet another corporate verb", bank: "VERB" },
      { key: "animal1", label: "An animal", bank: "ANIMAL" },
      { key: "verb4", label: "Another corporate verb", bank: "VERB" },
      { key: "verb5", label: "One more corporate verb", bank: "VERB" },
      { key: "emotion1", label: "An emotion", bank: "EMOTION" },
      { key: "noun3", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "buzz2", label: "Another buzzword", bank: "BUZZWORD" },
      { key: "buzz3", label: "One more buzzword", bank: "BUZZWORD" },
      { key: "noun4", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
    ],
    text: `I was talking to {{person}} yesterday, and they said something that changed how I think about {{industry1}} forever.

They looked at me and said: "{{adj1}} leaders don't {{verb1}} their {{noun1}}. They become it."

I sat with that for {{time1}}.

Here are {{number1}} things I learned that took me {{time2}} to understand — you can understand them in the next 30 seconds:

1️⃣ {{buzz1}} isn't a strategy. It's a {{noun2}}.
2️⃣ You can't {{verb2}} what you haven't {{verb3}}.
3️⃣ Like a {{animal1}}, you have to be willing to {{verb4}} before you can {{verb5}}.

I'm feeling {{emotion1}} today.

Not because we hit our numbers. Because we remembered our {{noun3}}.

{{buzz2}} > {{buzz3}}. Always.

So — genuine question — what's your {{noun4}}? 👇

♻️ Repost if this hit different.`,
  },
  {
    id: "origin",
    name: "The Humble-Brag Origin Story",
    blanks: [
      { key: "bad1", label: "A career setback", bank: "BAD_THING" },
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "verb2", label: "Another corporate verb", bank: "VERB" },
      { key: "verb3", label: "Yet another corporate verb", bank: "VERB" },
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "buzz2", label: "Another buzzword", bank: "BUZZWORD" },
      { key: "verb4", label: "Another corporate verb", bank: "VERB" },
      { key: "noun3", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "verb5", label: "One more corporate verb", bank: "VERB" },
      { key: "verb6", label: "A corporate verb (will get an -s)", bank: "VERB" },
      { key: "noun4", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "emotion1", label: "An emotion", bank: "EMOTION" },
      { key: "bad2", label: "Another career setback", bank: "BAD_THING" },
      { key: "noun5", label: "One final abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "verb7", label: "A final corporate verb (will get -ing)", bank: "VERB" },
    ],
    text: `Unpopular opinion: I got {{bad1}}, and it was the best thing that ever happened to my {{noun1}}.

Everyone told me to {{verb1}} my {{noun2}}. I didn't listen.

Instead, I spent {{time1}} learning to {{verb2}} before I could {{verb3}}.

{{number1}} years later, here's what I know:

→ {{buzz1}} is a myth. {{buzz2}} is the real unlock.
→ You don't need permission to {{verb4}} your {{noun3}}.
→ The {{adj1}} ones always {{verb5}} first.

Today, I run a team that {{verb6}}s {{noun4}} for a living, and I've never felt more {{emotion1}}.

To anyone going through getting {{bad2}} right now: your {{noun5}} is still being written.

Keep {{verb7}}ing. 🚀`,
  },
  {
    id: "contrarian",
    name: "The Contrarian Take",
    blanks: [
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "industry1", label: "An industry", bank: "INDUSTRY" },
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "animal1", label: "An animal", bank: "ANIMAL" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "adj2", label: "Another adjective", bank: "ADJECTIVE" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "verb2", label: "Another corporate verb", bank: "VERB" },
      { key: "noun3", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "verb3", label: "Yet another corporate verb", bank: "VERB" },
      { key: "noun4", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "adj3", label: "One more adjective", bank: "ADJECTIVE" },
      { key: "buzz2", label: "Another buzzword", bank: "BUZZWORD" },
      { key: "noun5", label: "A final abstract noun", bank: "NOUN_ABSTRACT" },
    ],
    text: `Hot take: {{noun1}} is dead. {{buzz1}} is the new {{noun1}}.

I know, I know. That's a {{adj1}} thing to say in {{industry1}}.

But hear me out.

Last {{time1}}, I watched a {{animal1}} {{verb1}} in the wild, and it taught me more about leadership than {{number1}} years in the boardroom.

Here's the framework I built off that (yes, I made a framework):

The {{adj2}} {{noun2}} Method™

Step 1: {{verb2}} your {{noun3}}.
Step 2: {{verb3}} it. Publicly.
Step 3: Let the {{noun4}} find you.

I'm not saying it's easy. I'm saying it's {{adj3}}.

{{buzz2}} isn't a buzzword. It's a {{noun5}}.

Fight me in the comments. 🥊`,
  },
  {
    id: "conference",
    name: "The Conference Epiphany",
    blanks: [
      { key: "event1", label: "An event", bank: "EVENT" },
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "industry1", label: "An industry", bank: "INDUSTRY" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "animal1", label: "An animal", bank: "ANIMAL" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "buzz2", label: "Another buzzword", bank: "BUZZWORD" },
      { key: "event2", label: "Another event", bank: "EVENT" },
    ],
    text: `I just got off stage at {{event1}} and I'm still shaking.

Not from nerves. From clarity.

Someone in the front row asked me: "What's the one thing you'd tell your {{time1}}-ago self about {{industry1}}?"

I didn't have an answer. So I made one up on the spot (that's basically {{buzz1}}, right?).

Here's what came out: "{{adj1}} people don't chase {{noun1}}. They build {{noun2}}."

The room went silent. {{number1}} people came up to me after.

I'm not saying I have it figured out. I'm saying {{animal1}}s don't ask for permission to {{verb1}}.

{{buzz2}} isn't taught in business school. It's earned in rooms like that one.

See you at the next {{event2}}. 🎤`,
  },
  {
    id: "confession",
    name: "The Controversial Confession",
    blanks: [
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "person1", label: "A person", bank: "PERSON" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "buzz2", label: "Another buzzword", bank: "BUZZWORD" },
      { key: "noun3", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "time2", label: "Another time period", bank: "TIME_PERIOD" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "verb2", label: "Another corporate verb", bank: "VERB" },
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "noun4", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "adj2", label: "Another adjective", bank: "ADJECTIVE" },
      { key: "noun5", label: "A final abstract noun", bank: "NOUN_ABSTRACT" },
    ],
    text: `Confession: I don't believe in {{noun1}} anymore.

There, I said it.

For {{time1}}, I built my entire {{noun2}} around it. Then {{person1}} said something that broke my brain: "{{buzz1}} was never the goal. {{buzz2}} was."

I went home and rewrote my entire {{noun3}}.

Now, every {{time2}}, I ask my team one question: are we {{verb1}}ing, or are we just {{verb2}}ing?

{{number1}} out of 10 times, we're just {{verb2}}ing.

So here's my unpopular opinion: {{adj1}} leadership isn't about {{noun4}}. It's about having the {{adj2}} to admit when the {{noun5}} was wrong.

Unfollow me if you disagree. I'll wait.`,
  },
  {
    id: "overnight",
    name: "The Overnight Success",
    blanks: [
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "place1", label: "A rock-bottom place", bank: "PLACE" },
      { key: "emotion1", label: "An emotion", bank: "EMOTION" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "person1", label: "A person", bank: "PERSON" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "verb2", label: "Another corporate verb", bank: "VERB" },
      { key: "verb3", label: "Yet another corporate verb", bank: "VERB" },
      { key: "verb4", label: "One more corporate verb", bank: "VERB" },
      { key: "number2", label: "Another number", bank: "NUMBER" },
      { key: "noun3", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "noun4", label: "A final abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "time2", label: "Another time period", bank: "TIME_PERIOD" },
    ],
    text: `People keep calling us an "overnight success."

Let me tell you what that overnight actually looked like: {{number1}} years. {{time1}}. One {{noun1}} that almost broke me.

I remember sitting in {{place1}}, {{emotion1}}, wondering if {{noun2}} was even worth it.

Then {{person1}} told me something I've never forgotten: "{{adj1}} people {{verb1}} when it's easy to {{verb2}}."

So I kept {{verb3}}ing.

Today we {{verb4}} {{number2}}x more {{noun3}} than we did on day one.

The lesson? {{buzz1}} isn't a moment. It's a {{noun4}} you choose every single {{time2}}.

Overnight success. Sure. Ten years in the making. 🌅`,
  },
  {
    id: "framework",
    name: "The Framework Nobody Asked For",
    blanks: [
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "person1", label: "A person", bank: "PERSON" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "buzz2", label: "Another buzzword", bank: "BUZZWORD" },
      { key: "noun3", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "adj2", label: "Another adjective", bank: "ADJECTIVE" },
      { key: "place1", label: "A place", bank: "PLACE" },
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
    ],
    text: `I built a framework. Nobody asked for it. I'm sharing it anyway.

I call it the {{adj1}} {{noun1}} Method.

It started when {{person1}} asked me how we {{verb1}} {{noun2}} at scale.

I didn't have a real answer, so I drew {{number1}} boxes on a whiteboard and connected them with arrows. {{buzz1}}. {{buzz2}}. {{noun3}}. Done.

It's not rocket science. It's just {{adj2}} enough to sound like it is.

Steal it. Rename it. Put your face next to it on a slide.

Just remember where it started: {{place1}}, {{time1}}, and a whiteboard marker that was almost out of ink.`,
  },
  {
    id: "gratitude",
    name: "The Gratitude Dump",
    blanks: [
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "bad1", label: "A career setback", bank: "BAD_THING" },
      { key: "place1", label: "A rock-bottom place", bank: "PLACE" },
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "industry1", label: "An industry", bank: "INDUSTRY" },
      { key: "verb2", label: "Another corporate verb", bank: "VERB" },
      { key: "person1", label: "A person", bank: "PERSON" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "buzz2", label: "Another buzzword", bank: "BUZZWORD" },
      { key: "verb3", label: "Yet another corporate verb", bank: "VERB" },
      { key: "animal1", label: "An animal", bank: "ANIMAL" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "time2", label: "Another time period", bank: "TIME_PERIOD" },
      { key: "emotion1", label: "An emotion", bank: "EMOTION" },
      { key: "noun3", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
    ],
    text: `As {{time1}} comes to a close, I've been reflecting.

{{number1}} years ago, I was {{bad1}}, sitting in {{place1}}, wondering if {{noun1}} would ever happen for me.

Today, I run a team that {{verb1}}s {{noun2}} for {{industry1}} companies, and I get to do it with people who make me want to {{verb2}} every single day.

So this is a thank-you.

To {{person1}}, who taught me that {{buzz1}} beats {{buzz2}} every time.
To my team, who {{verb3}} without being asked.
To every {{animal1}} out there, for the reminder that {{adj1}} things take {{time2}}.

I'm not perfect. I'm not done. But I'm {{emotion1}}.

Here's to {{noun3}} in the year ahead. 🙏`,
  },
  {
    id: "data",
    name: "The Data-Driven Insight",
    blanks: [
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "number1", label: "A number", bank: "NUMBER" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "industry1", label: "An industry", bank: "INDUSTRY" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "buzz2", label: "Another buzzword", bank: "BUZZWORD" },
      { key: "number2", label: "Another number", bank: "NUMBER" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "time2", label: "Another time period", bank: "TIME_PERIOD" },
      { key: "person1", label: "A person", bank: "PERSON" },
      { key: "adj2", label: "Another adjective", bank: "ADJECTIVE" },
      { key: "verb2", label: "Another corporate verb", bank: "VERB" },
      { key: "time3", label: "One more time period", bank: "TIME_PERIOD" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "noun3", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
    ],
    text: `New data just dropped, and it confirms what I've been saying for {{time1}}.

{{number1}}% of {{adj1}} {{industry1}} leaders say {{buzz1}} is now more important than {{buzz2}}.

Only {{number2}}% are actually doing anything about it.

I'll say the quiet part loud: if you're not {{verb1}}ing your {{noun1}} by {{time2}}, you're already behind.

I learned this the hard way when {{person1}} told me: "{{adj2}} companies don't wait for permission. They {{verb2}}."

So here's my prediction: by {{time3}}, {{noun2}} will be table stakes. {{noun3}} will be the real differentiator.

Bookmark this post. 📊`,
  },
  {
    id: "screenshot",
    name: "The Viral Screenshot Reaction",
    blanks: [
      { key: "person1", label: "A person", bank: "PERSON" },
      { key: "time1", label: "A time period", bank: "TIME_PERIOD" },
      { key: "bad1", label: "A career setback", bank: "BAD_THING" },
      { key: "adj1", label: "An adjective", bank: "ADJECTIVE" },
      { key: "time2", label: "Another time period", bank: "TIME_PERIOD" },
      { key: "verb1", label: "A corporate verb", bank: "VERB" },
      { key: "noun1", label: "An abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "verb2", label: "Another corporate verb", bank: "VERB" },
      { key: "noun2", label: "Another abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "buzz1", label: "A buzzword", bank: "BUZZWORD" },
      { key: "emotion1", label: "An emotion", bank: "EMOTION" },
      { key: "noun3", label: "One more abstract noun", bank: "NOUN_ABSTRACT" },
      { key: "noun4", label: "A final abstract noun", bank: "NOUN_ABSTRACT" },
    ],
    text: `I got this message from {{person1}} at {{time1}} last night. (screenshot attached, use your imagination)

They said they were {{bad1}} and didn't know what to do next.

I didn't send advice. I sent one question: "What would {{adj1}} you do?"

{{time2}} later, they {{verb1}} their {{noun1}} and {{verb2}} their {{noun2}}.

This is why I believe {{buzz1}} isn't a buzzword — it's a decision.

If you're reading this and you're {{emotion1}}: you don't need a {{noun3}}. You need a {{noun4}}.

Tag someone who needs to see this. 📲`,
  },
];

// Cycle of accent colors used for author avatars. Keep this short and
// deliberate rather than assigning every author a unique color.
export const PALETTE = [
  "#7c5cff", "#ff5c8a", "#ff9d4d", "#14b8a6", "#4d96ff", "#22c55e", "#f43f5e", "#ffb020",
];

// Fake authors for the post card -- purely cosmetic. `color` indexes PALETTE.
export const AUTHORS = [
  { name: "Brandon Voss", headline: "Chief Vision Officer | Ex-Nothing | Keynote Speaker", color: 0 },
  { name: "Priya Anand", headline: "Building the future of synergy | 3x Founder", color: 1 },
  { name: "Chad Whitfield", headline: "Helping leaders unlock their inner leader", color: 2 },
  { name: "Morgan Reyes", headline: "Growth-obsessed | Coffee-powered | LinkedIn Top Voice", color: 3 },
  { name: "Tyler Brandt", headline: "Not your average CEO (I journal)", color: 4 },
  { name: "Simone Achebe", headline: "Purpose-driven human first, executive second", color: 5 },
  { name: "Dakota Sterling", headline: "Failed my way to the top | Angel Investor", color: 6 },
  { name: "Wren Okafor", headline: "Building in public | Recovering perfectionist", color: 7 },
  { name: "Blake Kensington", headline: "I quit my job to post about quitting my job", color: 0 },
  { name: "Harper Lindqvist", headline: "Chief Storytelling Officer | TEDx Speaker", color: 1 },
  { name: "Zion Marchetti", headline: "Serial founder | Serial oversharer", color: 2 },
  { name: "Nova Whitfield", headline: "Democratizing access to hustle", color: 3 },
  { name: "Jasper Odame", headline: "Fractional CMO | Full-time optimist", color: 4 },
  { name: "Indira Vance", headline: "Scaling teams, not egos", color: 5 },
  { name: "Cyrus Beaumont", headline: "Ex-Google, ex-Meta, ex-normal life", color: 6 },
  { name: "Marlowe Cheng", headline: "Chief Culture Officer | Ping pong table procurer", color: 7 },
  { name: "Felix Adeyemi", headline: "Turning burnout into a personal brand", color: 0 },
  { name: "Sage Whitmore", headline: "Head of People (and feelings)", color: 1 },
  { name: "Rocco Delacroix", headline: "Bootstrapped to $1 (working on the rest)", color: 2 },
  { name: "Winnie Larsson", headline: "Unemployed. Building my next thing. DM me.", color: 3 },
  { name: "Ezra Castellanos", headline: "Thought leader before it was cringe", color: 4 },
  { name: "Talia Von Braun", headline: "Made a framework. You're welcome.", color: 5 },
  { name: "Duke Ferreira", headline: "LinkedIn's most humble bragger", color: 6 },
  { name: "Olivia Tran", headline: "Certified in vibes and Q3 planning", color: 7 },
];

// Snarky literal translations for the jargon-heavy banks. Only banks with an
// entry here get the click-to-translate treatment in the UI -- story
// elements like PERSON or ANIMAL aren't "corporate speak" so they're left
// alone. Unlisted words within a covered bank fall back to a generic joke.
export const TRANSLATIONS = {
  BUZZWORD: {
    "Synergy": "we don't talk to each other, but sure",
    "Disruption": "we broke something and called it strategy",
    "Hustle": "unpaid overtime",
    "Growth mindset": "I read one book",
    "Radical transparency": "I'll tell you the bad news in a fun font",
    "Bandwidth": "time I don't have",
    "Alignment": "a meeting that could've been an email",
    "Ideation": "brainstorming, but billable",
    "Bleeding-edge innovation": "we haven't tested this yet",
    "Servant leadership": "I still make the decisions",
    "Thought leadership": "posting on LinkedIn",
    "Grit": "burnout with better PR",
    "Psychological safety": "please stop crying in the all-hands",
  },
  VERB: {
    "leverage": "use",
    "operationalize": "actually do",
    "unlock": "find",
    "unpack": "explain, eventually",
    "champion": "mention in a meeting",
    "double down on": "keep doing the same thing",
    "lean into": "give up resisting",
    "circle back on": "never do",
    "action": "do (yes, as a verb, we know)",
    "synergize": "put two teams in one Slack channel",
    "scale": "hire more people and hope",
    "own": "get blamed for",
    "productize": "put a price tag on",
    "10x": "do slightly more, exaggerate the number",
  },
  NOUN_ABSTRACT: {
    "journey": "the thing that happened",
    "why": "the thing we forgot",
    "north star": "a guess with confidence",
    "narrative": "the story we tell instead of the truth",
    "ecosystem": "everyone we cc",
    "mindset": "mood",
    "brand": "logo plus vibes",
    "story": "spin",
    "purpose": "the mission statement nobody reads",
    "vision": "a slide with a sunset on it",
    "growth": "the number going up, hopefully",
    "legacy": "what we hope people forget kindly",
    "flywheel": "a loop we drew on a whiteboard",
    "moat": "a thing our lawyers made up",
  },
  ADJECTIVE: {
    "Exceptional": "fine, actually",
    "Authentic": "rehearsed to sound spontaneous",
    "Visionary": "hasn't shipped anything yet",
    "Resilient": "still here, barely",
    "Intentional": "we thought about it for five minutes",
    "Unstoppable": "hasn't been stopped yet",
    "Radically honest": "honest, but with a warning label",
    "High-agency": "ignores feedback",
    "Values-driven": "has a values slide",
    "Servant": "does the work, keeps the title",
    "Unreasonable": "the good kind, we promise",
    "Anti-fragile": "breaks differently than expected",
  },
};

const GENERIC_TRANSLATIONS = [
  "translation pending — our thought leadership team is aligning on it",
  "no real translation exists, and that's kind of the point",
  "this word tested well with focus groups",
  "our legal team asked us not to define this one",
];

export function translationFor(bank, word) {
  const bankMap = TRANSLATIONS[bank];
  if (!bankMap) return null;
  return bankMap[word] || GENERIC_TRANSLATIONS[word.length % GENERIC_TRANSLATIONS.length];
}

// Comment bodies for the fake engagement thread. "{{buzz}}" and "{{n}}" get
// substituted with a random buzzword / small number at render time.
export const COMMENT_TEMPLATES = [
  "This!! 🔥🔥",
  "Needed to read this today 🙏",
  "Saving this for later.",
  "The way you put this into words... 😭",
  "Screenshotting this for the whole team.",
  "This is the content LinkedIn needs more of.",
  "Sending this to my manager immediately.",
  "Not me tearing up at my desk right now",
  "{{buzz}} > everything else, honestly. Well said.",
  "Bookmarked. Rereading this every Monday.",
  "You just described my entire career in a few lines.",
  "This deserves way more than {{n}} likes.",
  "Printing this out and framing it.",
  "The real MVP post of the week.",
  "Adding this to my vision board.",
  "Sharing with my whole network, this is too real.",
];

// Self-aware closing lines appended when "Roast mode" is enabled.
export const ROAST_LINES = [
  "I have no idea what I just wrote, but it's getting posted anyway.",
  "None of this means anything and we both know it.",
  "I generated this with a mad-libs engine built to guarantee zero information content. You're welcome.",
  "My LinkedIn algorithm made me do this.",
  "If you got this far, congratulations — you just read a corporate horoscope.",
  "This post has the informational density of a fortune cookie.",
  "I wrote this in the group chat first and they said \"don't post that.\" I posted it anyway.",
  "This is what happens when \"authentic\" becomes a KPI.",
];
