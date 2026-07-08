// Phrase banks and post "shapes" for the broetry generator.
// Every phrase has a `weight` from 1 (mild/genuine) to 5 (maximally insufferable).
// The Insufferability slider biases which weight gets picked more often.

// Each shape has a fixed `pre`/`post` section plus one `repeat` slot type
// whose count is controlled by the Post Length slider (see generator.js).
export const shapes = [
  // Classic "I failed, therefore I am wise" arc
  { name: "story-arc", pre: ["hook", "turn"], repeat: "lesson", post: ["brag", "cta"] },
  // Contrarian take
  { name: "unpopular-opinion", pre: ["opinion", "qualifier"], repeat: "justification", post: ["cta"] },
  // Humble-brag disguised as gratitude
  { name: "gratitude-brag", pre: ["gratitude", "actuallyBrag"], repeat: "stat", post: ["cta"] },
];

export const phraseBanks = {
  hook: [
    { text: "I got laid off on a Tuesday.", weight: 1 },
    { text: "Three years ago, I was working a job I hated.", weight: 1 },
    { text: "Nobody in my family went to college.", weight: 2 },
    { text: "I bombed the biggest pitch of my career.", weight: 2 },
    { text: "I used to think success meant a corner office.", weight: 3 },
    { text: "I turned down a six-figure offer last week.", weight: 4 },
    { text: "I fired myself as CEO of my own excuses.", weight: 5 },
    { text: "I woke up at 4:44am and manifested a Series A.", weight: 5 },
    { text: "My co-founder and I built this in a garage. Well, a rented WeWork, but same energy.", weight: 3 },
    { text: "I almost didn't post this.", weight: 2 },
    { text: "Everyone told me I was crazy to leave my job.", weight: 3 },
    { text: "I used to be the person crying in the office bathroom.", weight: 2 },
    { text: "Ten years ago I couldn't afford rent. Today I own two.", weight: 4 },
    { text: "I just got back from a silent retreat and I have thoughts.", weight: 5 },
  ],
  turn: [
    { text: "It taught me something I'll never forget.", weight: 1 },
    { text: "But here's what nobody tells you about hard times:", weight: 2 },
    { text: "That moment changed everything.", weight: 3 },
    { text: "Looking back, it was the best thing that ever happened to me.", weight: 4 },
    { text: "The universe was simply redirecting my main character energy.", weight: 5 },
    { text: "That's when I realized success was an inside job.", weight: 3 },
    { text: "Everything after that felt different.", weight: 2 },
    { text: "I haven't been the same since.", weight: 3 },
    { text: "The old me wouldn't recognize who I am now.", weight: 4 },
  ],
  lesson: [
    { text: "Hard work still matters.", weight: 1 },
    { text: "Ask for help before you think you need it.", weight: 1 },
    { text: "Your network is your net worth.", weight: 2 },
    { text: "Rejection is just redirection.", weight: 2 },
    { text: "Comfort zones are where dreams go to die.", weight: 3 },
    { text: "Sleep is a mindset, not a requirement.", weight: 4 },
    { text: "If you're not failing daily, you're not trying hard enough.", weight: 4 },
    { text: "I don't chase opportunities anymore. Opportunities chase me.", weight: 5 },
    { text: "Vulnerability is the new leadership superpower.", weight: 3 },
    { text: "I stopped calling it work-life balance. I call it life design.", weight: 5 },
    { text: "Done is better than perfect.", weight: 1 },
    { text: "Your circle determines your ceiling.", weight: 2 },
    { text: "Burnout is just ambition without boundaries.", weight: 3 },
    { text: "The best time to post on LinkedIn is always.", weight: 4 },
    { text: "Discipline is just self-love in a suit.", weight: 4 },
    { text: "Every 'no' is just a 'not yet' wearing a costume.", weight: 5 },
  ],
  brag: [
    { text: "Today, our small team hit a milestone I'm proud of.", weight: 1 },
    { text: "We just closed our best quarter yet.", weight: 2 },
    { text: "I was invited to speak about it on a panel.", weight: 3 },
    { text: "We 10x'd revenue in six weeks with a team of two.", weight: 4 },
    { text: "Forbes hasn't called yet, but it's only a matter of time.", weight: 5 },
    { text: "A stranger messaged me just to say thank you.", weight: 1 },
    { text: "We just wrapped our biggest launch to date.", weight: 2 },
    { text: "I got asked to guest lecture at a business school.", weight: 3 },
    { text: "Our waitlist just hit five figures overnight.", weight: 5 },
  ],
  cta: [
    { text: "Curious what others think. 👇", weight: 1 },
    { text: "Would love to hear your story in the comments.", weight: 2 },
    { text: "Repost if this resonated with you.", weight: 3 },
    { text: "Agree? Or am I just built different?", weight: 4 },
    { text: "Tag someone who needs to see this. Then tag me. Then tag yourself.", weight: 5 },
    { text: "What's one lesson you'd add?", weight: 1 },
    { text: "Let's connect if this hit home.", weight: 2 },
    { text: "Drop a 🙋 if you've been there.", weight: 3 },
    { text: "Screenshot this before I regret posting it.", weight: 5 },
  ],
  opinion: [
    { text: "Unpopular opinion: résumés are dying.", weight: 2 },
    { text: "Hot take: the 9-to-5 is a relic.", weight: 3 },
    { text: "Controversial: meetings are where productivity goes to die.", weight: 3 },
    { text: "Nobody wants to hear this, but hustle culture was right all along.", weight: 5 },
    { text: "I said what I said: sleep is optional if your purpose is big enough.", weight: 5 },
    { text: "Hot take: cover letters are cosplay.", weight: 3 },
    { text: "Controversial: your 'work-life balance' is a marketing term.", weight: 4 },
    { text: "I'll say it louder for the people in the back row of their cubicles.", weight: 5 },
    { text: "Unpopular opinion: burnout is a brand, not a diagnosis.", weight: 5 },
  ],
  qualifier: [
    { text: "I know this might ruffle some feathers.", weight: 1 },
    { text: "Downvote me if you must.", weight: 2 },
    { text: "I've thought about this for a long time.", weight: 2 },
    { text: "I'm not saying I'm right. I'm saying I'm not wrong.", weight: 4 },
    { text: "The haters will hate. The winners will read on.", weight: 5 },
    { text: "Feel free to disagree in the comments.", weight: 1 },
    { text: "I'll die on this hill.", weight: 4 },
    { text: "Say what you want, the numbers don't lie.", weight: 3 },
  ],
  justification: [
    { text: "Every top performer I know thinks the same way.", weight: 2 },
    { text: "The data backs this up, even if the data is just my gut.", weight: 3 },
    { text: "I've built two companies on this exact principle.", weight: 4 },
    { text: "This is the same mindset that got me to the top 1%.", weight: 5 },
    { text: "Show me a 9-to-5er who's changed the world. I'll wait.", weight: 5 },
    { text: "I read one book about this and now I'm basically an expert.", weight: 3 },
    { text: "This take alone has 10x'd my speaking fees.", weight: 5 },
    { text: "I've seen it work firsthand, more times than I can count.", weight: 2 },
    { text: "My mentor told me the same thing before their exit.", weight: 4 },
    { text: "Every framework I've ever tested points back to this.", weight: 3 },
  ],
  gratitude: [
    { text: "Feeling incredibly grateful today.", weight: 1 },
    { text: "Humbled beyond words.", weight: 2 },
    { text: "Not gonna lie, I got a little emotional about this.", weight: 3 },
    { text: "Blessed doesn't even begin to cover it.", weight: 4 },
    { text: "Manifestation is real and I am living proof.", weight: 5 },
    { text: "Words genuinely fail me right now.", weight: 3 },
    { text: "I don't take a single bit of this for granted.", weight: 2 },
    { text: "Grateful isn't even the right word anymore.", weight: 4 },
  ],
  actuallyBrag: [
    { text: "Our small project just crossed a milestone.", weight: 1 },
    { text: "I was named to a list I didn't know existed until I made it.", weight: 3 },
    { text: "My inbox has 400 unread congratulations and I'm not mad about it.", weight: 4 },
    { text: "Apparently I'm now a 'thought leader.' Their words, not mine. (Okay, also my words.)", weight: 5 },
    { text: "A journalist reached out. I said no comment, which is also a comment.", weight: 4 },
    { text: "I turned down two job offers this week alone.", weight: 3 },
    { text: "My calendar is now fully booked through next year.", weight: 5 },
  ],
  stat: [
    { text: "12 people reached out this week alone.", weight: 1 },
    { text: "Engagement is up 300% since I started posting my truth.", weight: 3 },
    { text: "We've onboarded 40 new clients since Monday.", weight: 4 },
    { text: "My DMs are currently a small, chaotic economy of their own.", weight: 5 },
    { text: "Our Slack channel now requires a content warning.", weight: 4 },
    { text: "I turned my morning coffee run into a networking event.", weight: 2 },
    { text: "Three separate podcasts asked me to guest this month.", weight: 3 },
    { text: "My newsletter open rate is embarrassingly high.", weight: 4 },
    { text: "I've had more 1:1s this week than sleep hours.", weight: 5 },
  ],
};

export const emojiTiers = [
  { max: 33, pool: ["✅", "➡️", "📈"] },
  { max: 66, pool: ["🙌", "💪", "🔥", "👇"] },
  { max: 100, pool: ["🚀", "💯", "🔥", "🙏", "😤", "👏", "💥"] },
];

// Extra lines that can get spliced into a post, gated by their own sliders
// rather than the general Insufferability weighting.
export const bonusBrags = [
  "(Not to brag, but three recruiters slid into my DMs this morning.)",
  "(Also, I was just asked to ghostwrite a book. No big deal.)",
  "(P.S. My inbox looks like a small country's GDP in opportunities right now.)",
  "(Side note: my mentor cried reading a draft of this. Happy tears. I think.)",
  "(Also also, my dog has more LinkedIn followers than most VPs. Coincidence? I think not.)",
  "(Humble brag: I turned this exact post into a 6-figure consulting deal already.)",
  "(Also, a VC liked my comment. I'm framing my phone screen.)",
  "(Not to mention the two speaking invites I haven't answered yet.)",
  "(P.P.S. My assistant said this might be my best post yet. She's not wrong.)",
];

// Self-aware, fourth-wall-breaking asides for Roast Mode. Always appended
// as the closing line when Roast Mode is on.
export const roastLines = [
  "(Yes, I know how this sounds. No, I will not delete it.)",
  "(My therapist said I should share my truth. She meant something else, but here we are.)",
  "(I wrote this at 2am and I stand by every word, unfortunately.)",
  "(If you're cringing, that means it's working.)",
  "(This is peak LinkedIn and I am not sorry.)",
  "(Someone stop me. Actually, don't. Let me cook.)",
  "(I'll see myself out.)",
  "(This is what growth looks like, apparently.)",
  "(Engagement bait? Never heard of her.)",
];

// Fake commenters and their sycophantic replies. Higher Insufferability
// biases toward higher-weight (more unhinged) comments, and adds more of them.
export const commenterNames = [
  "Priya K.", "Jordan M.", "Alex T.", "Sam R.", "Taylor B.",
  "Morgan L.", "Casey W.", "Jamie F.", "Riley S.", "Devon P.",
];

export const commentTemplates = [
  { text: "This is exactly what I needed to read today.", weight: 1 },
  { text: "Saving this for later!", weight: 1 },
  { text: "So real. Thank you for your vulnerability.", weight: 2 },
  { text: "This needs to be a book. Sign me up.", weight: 3 },
  { text: "Sharing this with my entire team right now.", weight: 3 },
  { text: "This just changed my entire outlook on leadership.", weight: 4 },
  { text: "I printed this out and taped it to my monitor.", weight: 4 },
  { text: "Not crying at my desk, you're crying at your desk.", weight: 5 },
  { text: "Tagging my CEO, my mentor, and my therapist.", weight: 5 },
  { text: "This is the LinkedIn post of the decade.", weight: 5 },
  { text: "Bookmarking this for my next all-hands.", weight: 2 },
  { text: "Screenshotting this immediately.", weight: 3 },
  { text: "I have chills. Actual chills.", weight: 4 },
  { text: "This deserves way more than 'like' — give me a 'revere' button.", weight: 5 },
];

export const jargonBursts = [
  "Let's circle back and leverage our synergies to move the needle.",
  "At the end of the day, it's about doubling down on our core competencies.",
  "We need to boil the ocean and ideate some blue-sky thinking here.",
  "Low-hanging fruit aside, this is a real paradigm shift.",
  "Let's take this offline and socialize it with the stakeholders.",
  "I'm just going to unpack this holistically and put a pin in it.",
  "We're not pivoting, we're iterating toward product-market fit.",
  "This is peak synergy, honestly. Chef's kiss for the ecosystem.",
  "Let's action this and drive alignment cross-functionally.",
  "We're going to double-click on this and unpack the why.",
  "This is a north-star initiative, not a nice-to-have.",
];

// A little library of insufferable LinkedIn personas. One gets picked at
// random for each generated post.
export const characters = [
  { name: "Chad Thoughtleader", title: "Founder & CEO @ Synergy Ventures | Ex-Nothing | Keynote Speaker", color: "#0a66c2" },
  { name: "Brittany Grindset", title: "Chief Vibes Officer @ Elevate Collective | TEDx Speaker (pending)", color: "#7a5195" },
  { name: "Marcus Synergy", title: "Serial Entrepreneur | 4x Failed Founder | LinkedIn Top Voice", color: "#c9821a" },
  { name: "Dr. Skye Alignment", title: "Chief Manifestation Officer @ Abundance Labs | Bestselling Author (self-published)", color: "#2f9e44" },
  { name: "Trevor Bandwidth", title: "VP of People & Culture @ Disruptr | Podcast Host (11 downloads)", color: "#0f8b8d" },
  { name: "Ashley Pivot", title: "Growth Hacker turned Life Coach | \"Retired\" at 27", color: "#e0575b" },
  { name: "Jaxon Circleback", title: "Head of Innovation @ NoCode Ventures | Angel Investor (in theory)", color: "#5c5cbf" },
  { name: "Sunny Optimizeher", title: "Chief Everything Officer @ HustleHouse | 6-Figure Newsletter (unverified)", color: "#d99a1b" },
  { name: "Blake Diamondhands", title: "Web3 Visionary | NFT Thought Leader | \"Early\" to Everything", color: "#b23a48" },
  { name: "Piper Biohack", title: "Chief Longevity Officer @ Optimize Me | Cold Plunge Evangelist", color: "#3aa0c9" },
  { name: "Reginald Ninefigures", title: "Angel Investor | Ex-Wall Street | \"I Don't Do 9-to-5 Anymore\"", color: "#1f3a5f" },
  { name: "Harmony Solstice", title: "Certified Life & Business Alchemist | Full Moon Manifestor", color: "#9b6bcf" },
  { name: "Duke Overtime", title: "Grindset Coach | 5am Club Founding Member | Sleep Is a Choice", color: "#4a4a4a" },
  { name: "Cassidy Funnels", title: "Digital Marketing Ninja | 7-Figure Agency Owner | DM Me \"GROWTH\"", color: "#e0468a" },
  { name: "Prescott Bootstrap", title: "Bootstrapped to $1M ARR | No VC, No Problem | Solo-preneur", color: "#276e4d" },
  { name: "Nova Quantumleap", title: "AI Prompt Engineer | Future of Work Speaker | ChatGPT Whisperer", color: "#7b2cbf" },
  { name: "Chip Synergy Jr.", title: "Executive Presence Coach | LinkedIn Algorithm Hacker | Views ≠ Value (But Also It Does)", color: "#c1440e" },
  { name: "Meadow Wellworth", title: "Chief People Officer | Trauma-Informed Leadership Speaker | Healing at Scale", color: "#7c9473" },
  { name: "Rex Disruptor", title: "Chaos Coordinator @ Disruptco | \"We Don't Do Titles Here\" (My Title Is CEO)", color: "#8b2e3f" },
  { name: "Bianca Networth", title: "Personal Branding Strategist | Turned My Face Into a Business | DM for Rates", color: "#c2185b" },
];
