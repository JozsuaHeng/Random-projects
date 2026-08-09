// Fun fact dataset.
//
// `countries` uses the lowercase ISO 3166-1 alpha-2 codes that match the
// `id`/`g id` attributes in map.svg, so app.js can highlight them directly.
//
// `cities` (optional) is an array of { name, lat, lon } for places the fact
// names specifically — real-world coordinates, projected onto the map by
// app.js's project() function (see PROJECTION there for how that math was
// derived). Facts that are about a whole country rather than one place
// intentionally have no `cities` — only named, specific locations get a pin.
//
// `paragraphs` is an array of strings — each one rendered as its own <p>.
//
// `wiki` is a Wikipedia URL for further reading, checked against Wikipedia's
// API before being added here (see CLAUDE.md) so it shouldn't 404.

const FACTS = [
  {
    id: 'finland-lakes',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Finlandsat.jpg/500px-Finlandsat.jpg', width: 480, height: 696, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Finlandsat.jpg' },
    category: 'Nature',
    title: 'A Land of a Hundred Thousand Lakes',
    place: 'Finland',
    countries: ['fi'],
    paragraphs: [
      "Finland has roughly 188,000 lakes — more per capita than any other country on Earth, about one for every 26 people. They're a direct legacy of the last ice age: retreating glaciers gouged out basins across the bedrock as they withdrew around 10,000 years ago, and the meltwater never really left.",
      "The lakes are so central to Finnish life that the country's own nickname, \"Järvi-Suomi\" (Lakeland Finland), refers to the dense southeastern cluster around Saimaa, its largest lake system. Saimaa is also home to one of the rarest mammals on Earth, the Saimaa ringed seal, a freshwater seal population that's been cut off from the sea for thousands of years and evolved into its own subspecies found nowhere else."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Geography_of_Finland',
    wikiTerm: 'Lakeland Finland'
  },
  {
    id: 'great-barrier-reef',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/ISS-45_StoryOfWater%2C_Great_Barrier_Reef%2C_Australia.jpg/500px-ISS-45_StoryOfWater%2C_Great_Barrier_Reef%2C_Australia.jpg', width: 480, height: 320, credit: 'NASA/Kjell Lindgren', creditUrl: 'https://en.wikipedia.org/wiki/File:ISS-45_StoryOfWater%2C_Great_Barrier_Reef%2C_Australia.jpg' },
    category: 'Nature',
    title: 'The Only Living Structure Visible From Space',
    place: 'Australia',
    countries: ['au'],
    cities: [{ name: 'Great Barrier Reef', lat: -16.92, lon: 145.77 }],
    paragraphs: [
      "The Great Barrier Reef stretches over 2,300km off Australia's northeast coast — longer than the entire east coast of the United States — and is built entirely by billions of tiny coral polyps, each only a few millimetres across. It's the largest structure on Earth made by living organisms, and large enough to be identifiable from orbit.",
      "Coral reefs like this one are actually a partnership: the polyps host microscopic algae inside their own tissue, which photosynthesize and feed their host in exchange for shelter — it's this algae that gives coral its color. When water gets too warm, the polyps expel the algae in a stress response called bleaching, which is why marine heatwaves have caused several mass bleaching events on the reef in the past decade."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Great_Barrier_Reef',
    wikiTerm: 'Great Barrier Reef'
  },
  {
    id: 'sahara-green',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Sahara_satellite_hires.jpg/500px-Sahara_satellite_hires.jpg', width: 480, height: 269, credit: 'NASA', creditUrl: 'https://en.wikipedia.org/wiki/File:Sahara_satellite_hires.jpg' },
    category: 'Science',
    title: 'The Sahara Used to Be Green',
    place: 'North Africa',
    countries: ['dz', 'ly', 'td', 'ne', 'ml'],
    paragraphs: [
      "Around 6,000–11,000 years ago, the Sahara wasn't desert at all — it was a savanna dotted with lakes, rivers, hippos, and grassland, a period geologists call the African Humid Period. Rock art found deep in today's desert, showing cattle herding and swimming figures, is a direct record left by the people who lived there.",
      "The shift back to desert wasn't triggered by anything humans did — it came from a slow wobble in Earth's axial tilt (a cycle that repeats roughly every 20,000 years), which shifted the West African monsoon rains southward and let the region dry out over a few centuries. Some researchers argue the drying accelerated once vegetation loss began reflecting more sunlight back into space, a feedback loop that sped up its own cause."
    ],
    wiki: 'https://en.wikipedia.org/wiki/African_humid_period',
    wikiTerm: 'African Humid Period'
  },
  {
    id: 'great-wall-myth',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/500px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg', width: 480, height: 319, credit: 'Severin.stalder', creditUrl: 'https://en.wikipedia.org/wiki/File:The_Great_Wall_of_China_at_Jinshanling-edit.jpg' },
    category: 'History',
    title: "The Great Wall Isn't Visible From Space",
    place: 'China',
    countries: ['cn'],
    cities: [{ name: 'Badaling, near Beijing', lat: 40.36, lon: 116.02 }],
    paragraphs: [
      "Despite the popular claim, the Great Wall of China cannot be seen with the naked eye from space. It's extraordinarily long — current archaeological surveys put the full network of walls, built and rebuilt by different dynasties over roughly 2,000 years, at more than 21,000km — but it's rarely more than about 9 metres wide, thinner than most highways, and its stone and rammed-earth color blends into the surrounding terrain from orbit.",
      "Multiple astronauts, including China's own Yang Liwei in 2003, have confirmed directly that it isn't visible without aid from low Earth orbit, despite the myth having circulated in print since at least the 1930s. Oddly, things far less famous — like city lights at night, or the wake of a large ship — are often easier to spot from space than the wall is."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Great_Wall_of_China',
    wikiTerm: 'Great Wall of China'
  },
  {
    id: 'bhutan-happiness',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Four_pilars_of_Gross_National_Happiness.png/500px-Four_pilars_of_Gross_National_Happiness.png', width: 480, height: 488, credit: 'Felix Mueller', creditUrl: 'https://en.wikipedia.org/wiki/File:Four_pilars_of_Gross_National_Happiness.png' },
    category: 'Culture',
    title: 'Measuring Happiness, Not GDP',
    place: 'Bhutan',
    countries: ['bt'],
    paragraphs: [
      'Bhutan famously tracks "Gross National Happiness" as a guide for government policy instead of GDP, a concept its fourth king introduced in 1972. It\'s measured through a detailed national survey covering nine domains — things like psychological wellbeing, health, education, culture, and environmental resilience — and the results are meant to directly steer government spending, not just describe how people feel.',
      "The same conservation-first outlook shows up constitutionally: Bhutan is required by law to keep at least 60% of its land under forest cover in perpetuity, and it's currently well above that, at around 70%. Combined with a small population and heavy hydropower use, that forest cover is enough to absorb more carbon than the country emits, making Bhutan one of only a handful of nations verified to be carbon-negative."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Gross_National_Happiness',
    wikiTerm: 'Gross National Happiness'
  },
  {
    id: 'atacama-driest',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Atacama.png', width: 493, height: 728, credit: 'NASA', creditUrl: 'https://en.wikipedia.org/wiki/File:Atacama.png' },
    category: 'Geography',
    title: 'Drier Than Mars, in Places',
    place: 'Chile',
    countries: ['cl'],
    cities: [{ name: 'Atacama Desert', lat: -24.5, lon: -69.25 }],
    paragraphs: [
      "Parts of Chile's Atacama Desert have gone without recorded rainfall for decades at a time. It sits in a double rain shadow — blocked from Pacific moisture by the coastal range and from Amazonian moisture by the Andes — and some of its weather stations have never recorded a single drop since records began.",
      "Its soil is so barren and Mars-like that NASA has repeatedly used it as a proving ground for rover instruments meant to search for life on the red planet, including gear that flew on the Phoenix and Curiosity missions. Even so, the Atacama isn't lifeless — certain microbes survive in its salt crusts, and a few times a decade a rare rainfall event triggers a brief \"desierto florido\" (flowering desert), where dormant seeds burst into bloom across the sand almost overnight."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Atacama_Desert',
    wikiTerm: 'Atacama Desert'
  },
  {
    id: 'iceland-names',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Icelandic_Patronyms.svg/500px-Icelandic_Patronyms.svg.png', width: 480, height: 201, credit: 'Max Naylor', creditUrl: 'https://en.wikipedia.org/wiki/File:Icelandic_Patronyms.svg' },
    category: 'Culture',
    title: 'No Surnames, No Problem',
    place: 'Iceland',
    countries: ['is'],
    paragraphs: [
      'Icelanders are typically listed by first name in the phone directory, because most don\'t use inherited family surnames. Instead, a person\'s "last name" is usually a patronymic (or matronymic) — their parent\'s first name plus "-son" or "-dóttir" — so siblings can legally have completely different surnames from one another.',
      "This isn't just trivia — it's actively regulated. New given names have to be approved by the Icelandic Naming Committee, which checks that a name can be conjugated within Icelandic grammar and doesn't cause the bearer embarrassment, largely to preserve the language's structure. It also means Icelanders address even public figures — the president included — by first name as a matter of course, since a surname was never really the point of the system."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Icelandic_name',
    wikiTerm: 'Icelandic Naming Committee'
  },
  {
    id: 'dutch-below-sea',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/The_Netherlands_compared_to_sealevel.png/500px-The_Netherlands_compared_to_sealevel.png', width: 480, height: 500, credit: 'Jan Arkesteijn', creditUrl: 'https://en.wikipedia.org/wiki/File:The_Netherlands_compared_to_sealevel.png' },
    category: 'Geography',
    title: 'A Nation Below the Waves',
    place: 'Netherlands',
    countries: ['nl'],
    cities: [
      { name: 'Amsterdam', lat: 52.3676, lon: 4.9041 },
      { name: 'Rotterdam', lat: 51.9244, lon: 4.4777 }
    ],
    paragraphs: [
      'About a third of the Netherlands sits below sea level, kept dry by an extensive, centuries-old network of dikes, pumps, and windmills. Without it, cities including Amsterdam and Rotterdam — much of which sits on reclaimed land called "polder" — would be regularly flooded by the sea.',
      "The system got a major overhaul after the North Sea flood of 1953, which killed over 1,800 people in a single night and pushed the Dutch government to build the Delta Works — a vast set of storm surge barriers, dams, and sluices still considered one of the most ambitious flood-defense projects ever built. Dutch water management expertise is now exported worldwide, from New Orleans to Jakarta, as sea levels continue to rise."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Flood_control_in_the_Netherlands',
    wikiTerm: 'Delta Works'
  },
  {
    id: 'russia-timezones',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Map_of_Russian_time_zones_%282020%29_-_without_Crimea.svg/500px-Map_of_Russian_time_zones_%282020%29_-_without_Crimea.svg.png', width: 480, height: 277, credit: 'Sycewicz', creditUrl: 'https://en.wikipedia.org/wiki/File:Map_of_Russian_time_zones_%282020%29_-_without_Crimea.svg' },
    category: 'Geography',
    title: 'Eleven Time Zones, One Country',
    place: 'Russia',
    countries: ['ru'],
    cities: [
      { name: 'Kaliningrad', lat: 54.7104, lon: 20.4522 },
      { name: 'Petropavlovsk-Kamchatsky', lat: 53.0195, lon: 158.6499 }
    ],
    paragraphs: [
      "Russia spans eleven time zones, more than any other country in the world — nearly a third of all standard time zones on Earth belong to a single nation. When people in the Baltic exclave of Kaliningrad are just sitting down to breakfast, workers on the Pacific coast near Kamchatka are already having dinner, on the same calendar day.",
      "It briefly ran on just nine time zones between 2010 and 2014, after a Kremlin push to simplify the map, but two of the far-eastern zones were restored following local complaints that the merged zones left people commuting to work in the dark for much of the year. The country's full east-west span covers about 171 degrees of longitude, only a sliver short of half the planet's circumference."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Time_in_Russia',
    wikiTerm: 'Kaliningrad'
  },
  {
    id: 'png-languages',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Languages_Papua_New_Guinea.png/500px-Languages_Papua_New_Guinea.png', width: 480, height: 251, credit: 'MToumbola', creditUrl: 'https://en.wikipedia.org/wiki/File:Languages_Papua_New_Guinea.png' },
    category: 'Culture',
    title: 'The Most Languages Packed Into One Country',
    place: 'Papua New Guinea',
    countries: ['pg'],
    paragraphs: [
      "Papua New Guinea is home to more than 840 living languages — more than any other nation on Earth, roughly 12% of the world's total spoken by a population of about 10 million. It's the result of thousands of small communities separated for millennia by some of the most rugged, mountainous terrain on the planet, which let language evolve in near-total isolation valley by valley.",
      "To hold the country together across that fragmentation, Papua New Guinea leans on Tok Pisin, an English-based creole that developed during the colonial and plantation era and is now a lingua franca and one of the country's official languages, alongside English and Hiri Motu. Many Papua New Guineans grow up genuinely trilingual: a home village language, Tok Pisin for wider communication, and English for school and government."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Languages_of_Papua_New_Guinea',
    wikiTerm: 'Tok Pisin'
  },
  {
    id: 'nz-suffrage',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Tribute_to_the_Suffragettes%2C_Christchurch%2C_NZ_-_cropped.jpg/500px-Tribute_to_the_Suffragettes%2C_Christchurch%2C_NZ_-_cropped.jpg', width: 480, height: 588, credit: 'Robert Cutts', creditUrl: 'https://en.wikipedia.org/wiki/File:Tribute_to_the_Suffragettes%2C_Christchurch%2C_NZ_-_cropped.jpg' },
    category: 'History',
    title: 'First to Let Women Vote',
    place: 'New Zealand',
    countries: ['nz'],
    paragraphs: [
      "New Zealand became the first self-governing country to grant women the right to vote in national elections, in 1893 — decades ahead of the United Kingdom (1918), the United States (1920), and most of the rest of the world. The campaign was led by Kate Sheppard, whose petition to Parliament that year carried nearly 32,000 signatures, an enormous figure given the colony's total population at the time.",
      "The change was signed into law only days before that year's election, giving women just weeks to register — and turnout among newly enfranchised women still reached roughly 85%, higher than the male turnout rate. New Zealand's currency now honours the milestone directly: Kate Sheppard appears on the country's $10 note."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Women%27s_suffrage_in_New_Zealand',
    wikiTerm: 'Kate Sheppard'
  },
  {
    id: 'danakil-heat',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Map_Danakil.jpg/500px-Map_Danakil.jpg', width: 480, height: 307, credit: 'Val Rime', creditUrl: 'https://en.wikipedia.org/wiki/File:Map_Danakil.jpg' },
    category: 'Science',
    title: 'The Hottest Inhabited Place on Earth',
    place: 'Ethiopia & Eritrea',
    countries: ['et', 'er'],
    cities: [{ name: 'Danakil Depression', lat: 14.24, lon: 40.30 }],
    paragraphs: [
      "The Danakil Depression, straddling Ethiopia and Eritrea, has an average year-round temperature around 34°C (94°F) and is dotted with acid pools, sulfur springs in shades of yellow and green, and Erta Ale — one of the few volcanoes on Earth with a persistent, open lava lake.",
      "It also sits at the meeting point of three tectonic plates slowly pulling apart, a process geologists believe is in the early stages of eventually splitting Africa and forming a new ocean over the next several million years. Despite the extremes, the Afar people still live and work there, mining slabs of salt from the depression's dried lake beds and hauling them out by camel caravan, much as their ancestors have for centuries."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Danakil_Depression',
    wikiTerm: 'Danakil Depression'
  },
  {
    id: 'seed-vault',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Logo_Svalbard_Global_Seed_Vault.png/500px-Logo_Svalbard_Global_Seed_Vault.png', width: 480, height: 458, credit: 'Svalbard Global Seed Vault', creditUrl: 'https://en.wikipedia.org/wiki/File:Logo_Svalbard_Global_Seed_Vault.png' },
    category: 'Science',
    title: 'The Doomsday Vault',
    place: 'Norway (Svalbard)',
    countries: ['no'],
    cities: [{ name: 'Svalbard Global Seed Vault', lat: 78.238, lon: 15.492 }],
    paragraphs: [
      "Deep inside an Arctic mountain on the Norwegian archipelago of Svalbard, the Svalbard Global Seed Vault stores more than a million crop seed samples deposited by gene banks from almost every country on Earth. It's built roughly 130 metres into solid rock and kept naturally cold by the surrounding permafrost, so even a total loss of power wouldn't immediately thaw it.",
      "It's designed as a backup, not an everyday resource — a way to safeguard crop diversity against war, natural disaster, equipment failure, or funding collapse at any of the smaller gene banks that actually supply seeds to farmers. It's already been drawn on once for real: after the Syrian civil war damaged a seed bank near Aleppo, researchers withdrew Svalbard-stored duplicates to help rebuild it."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Svalbard_Global_Seed_Vault',
    wikiTerm: 'Svalbard Global Seed Vault'
  },
  {
    id: 'japan-islands',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Satellite_View_of_Japan_1999.jpg/500px-Satellite_View_of_Japan_1999.jpg', width: 480, height: 613, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Satellite_View_of_Japan_1999.jpg' },
    category: 'Geography',
    title: 'Thousands of Islands',
    place: 'Japan',
    countries: ['jp'],
    paragraphs: [
      "Japan is made up of 14,125 islands, according to a 2023 government recount using modern GPS and aerial mapping — more than double the figure of 6,852 that had been cited for decades, based on a manual 1987 survey. The new count didn't mean Japan grew; it just measured what was already there far more precisely, including huge numbers of uninhabited rocky islets too small to have shown up before.",
      "Of those thousands, only about 430 are inhabited, and the four largest — Honshu, Hokkaido, Kyushu, and Shikoku — account for roughly 97% of the country's total land area. Honshu alone, home to Tokyo, Osaka, and most of Japan's population, is the seventh-largest island on Earth."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Geography_of_Japan',
    wikiTerm: 'Honshu'
  },
  {
    id: 'indonesia-volcanoes',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Mahameru-volcano.jpeg/500px-Mahameru-volcano.jpeg', width: 480, height: 360, credit: 'Jan-Pieter Nap', creditUrl: 'https://en.wikipedia.org/wiki/File:Mahameru-volcano.jpeg' },
    category: 'Geography',
    title: "The Ring of Fire's Busiest Address",
    place: 'Indonesia',
    countries: ['id'],
    paragraphs: [
      "Indonesia has more active volcanoes than any other country — around 130 of them — a direct result of sitting at the meeting point of several tectonic plates along the Pacific Ring of Fire. It's also the site of the most powerful volcanic eruption in recorded history: Mount Tambora in 1815, which killed tens of thousands directly and lowered global temperatures enough the following year to cause what became known as \"the year without a summer\" as far away as Europe and North America.",
      "That volcanic activity is a double-edged sword — eruptions repeatedly enrich the surrounding soil with minerals, which is part of why Java, one of the most volcanically dense islands on Earth, is also one of the most agriculturally fertile and densely populated places on the planet."
    ],
    wiki: 'https://en.wikipedia.org/wiki/List_of_volcanoes_in_Indonesia',
    wikiTerm: 'Mount Tambora'
  },
  {
    id: 'mongolia-density',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Mongolia_single_age_population_pyramid_2020.png/500px-Mongolia_single_age_population_pyramid_2020.png', width: 480, height: 386, credit: 'Sdgedfegw', creditUrl: 'https://en.wikipedia.org/wiki/File:Mongolia_single_age_population_pyramid_2020.png' },
    category: 'Geography',
    title: 'The Emptiest Country',
    place: 'Mongolia',
    countries: ['mn'],
    paragraphs: [
      "Mongolia has the lowest population density of any independent country on Earth, at roughly two people per square kilometre — for comparison, that's over a hundred times lower than neighbouring China. Close to a third of its population still lives a nomadic or semi-nomadic herding lifestyle, moving seasonally between pastures with portable round tents called gers.",
      "That emptiness is largely climatic: Mongolia has one of the most extreme continental climates on Earth, with winter temperatures regularly dropping below -30°C and summer highs above 30°C in the same country. A recurring winter disaster called a dzud — brutal cold following a summer drought — can kill huge portions of a herder's livestock in a single season, which is part of why the population has steadily urbanized toward the capital, Ulaanbaatar, in recent decades."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Demographics_of_Mongolia',
    wikiTerm: 'dzud'
  },
  {
    id: 'pyramid-tallest',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg/500px-Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg', width: 480, height: 270, credit: 'Douwe C. van der Zee', creditUrl: 'https://en.wikipedia.org/wiki/File:Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg' },
    category: 'History',
    title: 'The Tallest Building for Almost 4,000 Years',
    place: 'Egypt',
    countries: ['eg'],
    cities: [{ name: 'Giza', lat: 29.9792, lon: 31.1342 }],
    paragraphs: [
      "The Great Pyramid of Giza was the tallest human-made structure on Earth for around 3,800 years after its completion in roughly 2560 BCE, at an original height of about 146.6 metres — a record unbroken until England's Lincoln Cathedral surpassed it in the 14th century (and that spire itself later collapsed, briefly handing the record back).",
      "It was built as the tomb of the pharaoh Khufu and originally cased in polished white limestone that would have made it gleam in the sun; most of that outer casing was stripped away over the centuries for building material elsewhere in Cairo. Estimates of its construction workforce have shifted a lot over time — early guesses ran into the hundreds of thousands, but archaeological evidence from workers' villages near the site now points to a smaller, skilled, and rotating labor force, not slaves, of perhaps 20,000 people at any one time."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza',
    wikiTerm: 'Great Pyramid of Giza'
  },
  {
    id: 'canada-lakes',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Canada_topo.jpg/500px-Canada_topo.jpg', width: 480, height: 415, credit: 'Anchjo', creditUrl: 'https://en.wikipedia.org/wiki/File:Canada_topo.jpg' },
    category: 'Geography',
    title: 'More Lakes Than the Rest of the World Combined',
    place: 'Canada',
    countries: ['ca'],
    paragraphs: [
      "Canada contains an estimated 2 million lakes, more than every other country on Earth combined. It's a direct legacy of the last ice age — retreating glaciers scraped out countless basins across the Canadian Shield, an ancient bedrock formation covering half the country, which filled with water as the ice melted roughly 10,000 years ago.",
      "Canada's Great Lakes basin, shared with the United States, holds about 21% of the world's surface fresh water by itself, and Lake Superior alone contains more water than all four other Great Lakes combined. Because so many of Canada's smaller lakes are unnamed and remote, the true count is really an estimate — surveyors keep finding more every time satellite imagery gets sharper."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Geography_of_Canada',
    wikiTerm: 'Canadian Shield'
  },
  {
    id: 'congo-river-deep',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Aerial_view_of_the_Congo_River_near_Kisangani.jpg/500px-Aerial_view_of_the_Congo_River_near_Kisangani.jpg', width: 480, height: 296, credit: 'MONUSCO/Myriam Asmani', creditUrl: 'https://en.wikipedia.org/wiki/File:Aerial_view_of_the_Congo_River_near_Kisangani.jpg' },
    category: 'Nature',
    title: 'The Deepest River on Earth',
    place: 'DR Congo',
    countries: ['cd'],
    paragraphs: [
      "The Congo River plunges to depths of over 220 metres (720ft) in places, making it the deepest river in the world by a wide margin. It's also the second-largest river by discharge on Earth after the Amazon, and the only major river to cross the equator twice, which keeps its flow remarkably steady year-round since it's always collecting rain from one hemisphere or the other.",
      "That extreme depth, combined with powerful currents and total darkness at the bottom, has produced strange evolutionary results: entire species of blind, pressure-adapted fish live only in specific deep stretches of the river, isolated from populations just a short distance away by rapids and currents they can't cross. Scientists studying the river's fish diversity have described some sections as evolutionary laboratories in their own right."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Congo_River',
    wikiTerm: 'Congo River'
  },
  {
    id: 'greenland-island',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/500px-Flag_of_Greenland.svg.png', width: 480, height: 320, credit: 'Jeffrey Connell (IceKarma)', creditUrl: 'https://en.wikipedia.org/wiki/File:Flag_of_Greenland.svg' },
    category: 'Geography',
    title: "The World's Largest Island",
    place: 'Greenland',
    countries: ['gl'],
    paragraphs: [
      "Greenland is the largest island on Earth that isn't also classified as a continent, covering over 2.1 million square kilometres — yet it's home to only around 56,000 people, one of the lowest population densities anywhere in the world. About 80% of its landmass is covered by a single ice sheet, second in size only to Antarctica's.",
      "Politically, it's a self-governing territory of Denmark, though it's geographically part of North America, sitting closer to Canada than to Europe — a mismatch that has repeatedly made it a subject of geopolitical attention, including renewed U.S. interest in acquiring it in recent years. If Greenland's ice sheet fully melted, global sea levels would rise by an estimated 7 metres."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Greenland',
    wikiTerm: 'Greenland'
  },
  {
    id: 'madagascar-endemic',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Maki.jpg/500px-Maki.jpg', width: 480, height: 360, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Maki.jpg' },
    category: 'Nature',
    title: 'An Island of Its Own Evolution',
    place: 'Madagascar',
    countries: ['mg'],
    paragraphs: [
      "Madagascar split from mainland Africa around 88 million years ago and has been evolving in near-total isolation ever since. As a result, roughly 90% of its wildlife — including every one of its more than 100 lemur species — exists nowhere else on the planet.",
      "That isolation cuts both ways: because so many of Madagascar's species survive nowhere else, the island holds an outsized share of the world's most endangered animals, and habitat loss there is considered one of the highest-stakes conservation problems on Earth. Fewer than 20% of Madagascar's original forest cover is thought to remain, mostly due to slash-and-burn agriculture, though large-scale replanting and protected-area efforts have expanded significantly in recent decades."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Wildlife_of_Madagascar',
    wikiTerm: 'lemur species'
  },
  {
    id: 'sahara-dust-amazon',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Chad_AMO_2004323_lrg.jpg/500px-Chad_AMO_2004323_lrg.jpg', width: 480, height: 367, credit: 'NASA', creditUrl: 'https://en.wikipedia.org/wiki/File:Chad_AMO_2004323_lrg.jpg' },
    category: 'Science',
    title: 'Desert Dust Feeds a Rainforest',
    place: 'Chad & Brazil',
    countries: ['td', 'br'],
    cities: [{ name: 'Bodélé Depression', lat: 16.62, lon: 18.13 }],
    paragraphs: [
      "Wind storms over Chad's Bodélé Depression — a dried-up ancient lakebed and the single dustiest place on Earth — lift huge clouds of mineral dust that cross the entire Atlantic Ocean and settle over the Amazon, roughly 8,000km away, in about a week.",
      "That dust matters ecologically: it carries phosphorus, a nutrient the Amazon's ancient, heavily leached soil is chronically short of, and NASA satellite studies estimate around 27 million tonnes of it arrives over the basin every year — quietly resupplying nutrients that rainfall otherwise washes straight out of the ecosystem. The dust plume is large enough to be tracked from space, and on its way it also fertilizes ocean plankton and helps deliver key minerals to Caribbean soils."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Bod%C3%A9l%C3%A9_Depression',
    wikiTerm: 'Bodélé Depression'
  },
  {
    id: 'panama-canal',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Panama_Canal_Map_EN.svg/500px-Panama_Canal_Map_EN.svg.png', width: 480, height: 496, credit: 'Thoroe', creditUrl: 'https://en.wikipedia.org/wiki/File:Panama_Canal_Map_EN.svg' },
    category: 'Geography',
    title: 'A Shortcut Between Oceans',
    place: 'Panama',
    countries: ['pa'],
    cities: [{ name: 'Panama City', lat: 8.9824, lon: -79.5199 }],
    paragraphs: [
      "The Panama Canal saves ships a journey of roughly 8,000 nautical miles around the tip of South America. A system of locks lifts each vessel about 26 metres above sea level to cross the isthmus via the artificial Gatún Lake, then lowers it back down on the other side — the whole transit takes 8 to 10 hours.",
      "Its construction, completed in 1914 after an earlier French effort collapsed from disease and financial ruin, remains one of the largest engineering projects in history, and it came at a brutal human cost — thousands of workers died, mostly from malaria and yellow fever, before mosquito-control measures brought the death toll down. The canal was under U.S. control for most of the 20th century before full sovereignty was transferred to Panama at the end of 1999, and it's since been widened to accommodate today's much larger container ships."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Panama_Canal',
    wikiTerm: 'Panama Canal'
  },
  {
    id: 'aurora-scandinavia',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Aurora_borealis_over_Eielson_Air_Force_Base%2C_Alaska.jpg/500px-Aurora_borealis_over_Eielson_Air_Force_Base%2C_Alaska.jpg', width: 480, height: 313, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Aurora_borealis_over_Eielson_Air_Force_Base%2C_Alaska.jpg' },
    category: 'Science',
    title: 'Lights Born From Solar Storms',
    place: 'Iceland, Norway, Sweden & Finland',
    countries: ['is', 'no', 'se', 'fi'],
    paragraphs: [
      "The aurora borealis, regularly visible over Iceland, Norway, Sweden, and Finland, is caused by charged particles thrown off the sun colliding with Earth's atmosphere near the magnetic poles. Earth's magnetic field funnels those particles down toward the polar regions, where they collide with oxygen and nitrogen atoms high in the atmosphere and excite them — the atoms then release that extra energy as light, green from oxygen at lower altitudes, and red or purple from oxygen and nitrogen higher up.",
      "The same physical process happens at the South Pole too, as the aurora australis, but far fewer people live at those latitudes to see it. Aurora activity roughly follows the sun's 11-year solar cycle, so displays get noticeably more frequent and intense around \"solar maximum\" — a peak that occurred around 2024–2025 — which is also when the same solar storms occasionally threaten satellites and power grids on the ground."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Aurora',
    wikiTerm: 'aurora borealis'
  },
  {
    id: 'silk-road',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Silk_road_Kazakhstan.svg/500px-Silk_road_Kazakhstan.svg.png', width: 480, height: 480, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Silk_road_Kazakhstan.svg' },
    category: 'History',
    title: 'A 6,400km Trade Network',
    place: "Xi'an to Istanbul",
    countries: ['cn', 'ir', 'tr', 'it'],
    cities: [
      { name: "Xi'an", lat: 34.3416, lon: 108.9398 },
      { name: 'Istanbul', lat: 41.0082, lon: 28.9784 }
    ],
    paragraphs: [
      "The historic Silk Road linked the Chinese city of Xi'an to Istanbul (then Constantinople) on the edge of Europe, threading through Central Asia, Iran, and Anatolia. It carried far more than silk — spices, paper, gunpowder, glassware, precious stones, and religious and scientific ideas moved along it in both directions for well over 1,500 years, connecting civilizations that, in most cases, never directly met.",
      "\"The Silk Road\" wasn't one road at all, but a shifting web of overland and maritime routes used by a relay of different traders and caravans, each covering just one segment rather than any single merchant crossing the whole distance. Oasis cities along the route, like Samarkand and Kashgar, grew wealthy purely as waypoints, and it was this same network that's believed to have carried the Black Death westward into Europe in the 14th century, alongside all the goods and ideas."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Silk_Road',
    wikiTerm: 'Silk Road'
  },
  {
    id: 'ring-of-fire',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Pacific_Ring_of_Fire.svg/500px-Pacific_Ring_of_Fire.svg.png', width: 480, height: 290, credit: 'Gringer', creditUrl: 'https://en.wikipedia.org/wiki/File:Pacific_Ring_of_Fire.svg' },
    category: 'Geography',
    title: 'Where 90% of Earthquakes Happen',
    place: 'Pacific Rim',
    countries: ['jp', 'ph', 'id', 'cl', 'us', 'nz', 'ru'],
    paragraphs: [
      "The Pacific Ring of Fire is a horseshoe-shaped belt of tectonic activity running roughly 40,000km through Japan, the Philippines, Indonesia, Chile, the western coasts of the Americas, New Zealand, and Russia's far east. It's home to roughly 90% of the world's earthquakes and about 75% of its active volcanoes, following the boundaries where the huge Pacific Plate grinds against its neighbours.",
      "Most of that activity comes from subduction zones, where one tectonic plate is forced beneath another and melts, feeding chains of volcanoes above — it's the same mechanism behind both devastating megathrust earthquakes, like Japan's 2011 Tōhoku quake, and the towering volcanic peaks that ring the entire Pacific basin. The belt isn't a perfect, unbroken ring, but the countries along it invest disproportionately in earthquake and tsunami early-warning systems for exactly this reason."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Ring_of_Fire',
    wikiTerm: 'Ring of Fire'
  },
  {
    id: 'wales-castles',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Caernarfon_Castle_1994.jpg/500px-Caernarfon_Castle_1994.jpg', width: 480, height: 320, credit: 'Herbert Ortner', creditUrl: 'https://en.wikipedia.org/wiki/File:Caernarfon_Castle_1994.jpg' },
    category: 'History',
    title: 'The Castle Capital of the World',
    place: 'Wales',
    countries: ['gb'],
    paragraphs: [
      "Wales has more castles per square mile than any other country in the world — around 600 of them packed into an area smaller than New Jersey. Most date from centuries of conflict between independent Welsh princes and English invaders, particularly the 13th-century Edwardian conquest, when King Edward I ringed north Wales with a chain of massive fortresses to lock down his new territory.",
      "Four of those Edwardian castles — Beaumaris, Caernarfon, Conwy, and Harlech — are UNESCO World Heritage Sites today, considered some of the finest surviving examples of medieval military architecture in Europe, built by an army of thousands of laborers and stonemasons brought in from across England. Caernarfon Castle in particular was designed to double as a royal palace, with banded stonework and polygonal towers deliberately echoing the walls of Constantinople to project imperial authority."
    ],
    wiki: 'https://en.wikipedia.org/wiki/List_of_castles_in_Wales',
    wikiTerm: 'Edwardian castles'
  },
  {
    id: 'singapore-gum',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/NS19_Toa_Payoh_MRT_Exit_D_20220712_192031_%28cropped_16_to_9%29.jpg/500px-NS19_Toa_Payoh_MRT_Exit_D_20220712_192031_%28cropped_16_to_9%29.jpg', width: 480, height: 270, credit: 'ZKang123', creditUrl: 'https://en.wikipedia.org/wiki/File:NS19_Toa_Payoh_MRT_Exit_D_20220712_192031_%28cropped_16_to_9%29.jpg' },
    category: 'Culture',
    title: 'A Ban Born From Sabotage',
    place: 'Singapore',
    countries: ['sg'],
    cities: [{ name: 'Singapore', lat: 1.3521, lon: 103.8198 }],
    paragraphs: [
      "Singapore banned the sale of chewing gum in 1992 after vandals repeatedly used it to jam the door sensors on the city's brand-new subway trains, causing costly delays and repairs to a system that had only just opened a few years earlier. The ban was part of a much broader, decades-long push for civic cleanliness under founding leader Lee Kuan Yew, who also cracked down hard on littering and jaywalking.",
      "The rule is narrower than its reputation — gum for medical or dental purposes, like nicotine or sugar-free therapeutic gum, has been legally sold with a pharmacist's involvement since a U.S. trade agreement loosened the ban slightly in 2004. Bringing in small personal amounts isn't actually enforced in practice, but selling it commercially still carries serious fines."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Chewing_gum_sales_ban_in_Singapore',
    wikiTerm: 'chewing gum'
  },
  {
    id: 'maldives-lowest',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Maldives.svg/500px-Flag_of_Maldives.svg.png', width: 480, height: 320, credit: 'See File history, below, for details.', creditUrl: 'https://en.wikipedia.org/wiki/File:Flag_of_Maldives.svg' },
    category: 'Geography',
    title: 'The Lowest Country on Earth',
    place: 'Maldives',
    countries: ['mv'],
    paragraphs: [
      "The Maldives has an average ground elevation of just 1.5 metres above sea level, making it the flattest and lowest-lying country on the planet. Its highest natural point, on the island of Villingili, is only around 2.4 metres up — lower than the roof of a typical house.",
      "That makes it one of the countries most existentially exposed to sea level rise: even moderate projections for this century put large parts of the archipelago's roughly 1,200 islands at risk of becoming uninhabitable. In 2009, the Maldivian government made global headlines by holding a cabinet meeting underwater, with ministers in scuba gear signing a document calling for global carbon cuts, to dramatize exactly this threat."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Maldives',
    wikiTerm: 'Maldives'
  },
  {
    id: 'nazca-lines',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/L%C3%ADneas_de_Nazca%2C_Nazca%2C_Per%C3%BA%2C_2015-07-29%2C_DD_49.JPG/500px-L%C3%ADneas_de_Nazca%2C_Nazca%2C_Per%C3%BA%2C_2015-07-29%2C_DD_49.JPG', width: 480, height: 319, credit: 'Diego Delso', creditUrl: 'https://en.wikipedia.org/wiki/File:L%C3%ADneas_de_Nazca%2C_Nazca%2C_Per%C3%BA%2C_2015-07-29%2C_DD_49.JPG' },
    category: 'History',
    title: 'Lines Only Visible From the Air',
    place: 'Peru',
    countries: ['pe'],
    cities: [{ name: 'Nazca', lat: -14.739, lon: -75.13 }],
    paragraphs: [
      "The Nazca Lines in Peru are a series of giant geoglyphs — animals, plants, and geometric shapes up to 370 metres across — etched into the desert floor by the Nazca culture roughly 2,000 years ago, made simply by removing a layer of reddish-brown pebbles to expose the pale ground beneath.",
      "They're so large that many were only fully recognised once commercial aircraft started flying over the region in the 1920s and 30s, though a few were noticed from nearby foothills earlier. Their exact purpose is still debated among archaeologists — leading theories include astronomical calendars, ritual pathways walked as part of ceremonies, or offerings meant to be seen by gods in the sky rather than by people on the ground — and the arid, near-rainless climate is the main reason they've survived intact for two millennia."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Nazca_lines',
    wikiTerm: 'Nazca Lines'
  },
  {
    id: 'switzerland-ch',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Eidtgenoschafft_1550.jpg/500px-Eidtgenoschafft_1550.jpg', width: 480, height: 368, credit: 'Sebastian Münster', creditUrl: 'https://en.wikipedia.org/wiki/File:Eidtgenoschafft_1550.jpg' },
    category: 'Culture',
    title: "Why Switzerland's Cars Say 'CH'",
    place: 'Switzerland',
    countries: ['ch'],
    paragraphs: [
      "Switzerland's official Latin name, Confoederatio Helvetica, is why its country code — used on car plates, internet domains (.ch), and ISO country listings — is \"CH\" rather than something built from its English name. \"Helvetica\" refers to the Helvetii, a Celtic tribe that once inhabited the Swiss plateau in Roman times.",
      "Using the neutral Latin form was a deliberate compromise across the country's four official languages — German, French, Italian, and Romansh — so that no single language group's version of the name (Schweiz, Suisse, Svizzera, or Svizra) had to appear alone on official state symbols. The same neutral logic is why the famous Helvetica typeface, designed by a Swiss team in 1957, took that name too."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Name_of_Switzerland',
    wikiTerm: 'Confoederatio Helvetica'
  },
  {
    id: 'ethiopia-calendar',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethiopian_New_Year.jpg/500px-Ethiopian_New_Year.jpg', width: 480, height: 853, credit: 'Nati Tad', creditUrl: 'https://en.wikipedia.org/wiki/File:Ethiopian_New_Year.jpg' },
    category: 'Culture',
    title: 'A Different Year Entirely',
    place: 'Ethiopia',
    countries: ['et'],
    paragraphs: [
      "Ethiopia uses its own calendar, currently running seven to eight years behind the Gregorian calendar most of the world follows — a gap that comes down to a different calculation, dating back to the early church, of the year Jesus was born. The Ethiopian calendar also has 13 months: twelve of 30 days each, plus a short thirteenth month of 5 or 6 days.",
      "Its clock system adds a second layer: the day is traditionally counted from sunrise rather than midnight, so what much of the world calls 7am is locally \"1 o'clock,\" since near the equator sunrise falls reliably around 6am year-round. Both systems are still in everyday use across Ethiopia today, alongside (not instead of) the internationally standard versions used for things like international flights and banking."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Ethiopian_calendar',
    wikiTerm: 'Ethiopian calendar'
  },
  {
    id: 'great-migration',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Tanzania-_Serengeti_National_Park-_elefante.jpg/500px-Tanzania-_Serengeti_National_Park-_elefante.jpg', width: 480, height: 360, credit: 'Mario Falcetti', creditUrl: 'https://en.wikipedia.org/wiki/File:Tanzania-_Serengeti_National_Park-_elefante.jpg' },
    category: 'Nature',
    title: 'The Great Migration',
    place: 'Kenya & Tanzania',
    countries: ['ke', 'tz'],
    cities: [
      { name: 'Serengeti', lat: -2.33, lon: 34.83 },
      { name: 'Maasai Mara', lat: -1.5, lon: 35.11 }
    ],
    paragraphs: [
      "Every year, roughly 1.5 million wildebeest, joined by hundreds of thousands of zebra and gazelle, migrate in a continuous clockwise loop between Tanzania's Serengeti and Kenya's Maasai Mara, chasing seasonal rains and fresh grazing across an ecosystem spanning nearly 40,000 square kilometres. It's widely considered the largest overland mammal migration left on Earth.",
      "The route's most dramatic moment comes at the Mara River crossing, where herds have to fight through strong currents and waiting crocodiles to reach fresh grazing on the other side — a bottleneck that kills thousands of animals most years, but one the ecosystem has come to depend on, since the die-offs cycle huge amounts of nutrients back into the river system. The migration isn't fixed to a strict calendar; the animals follow rainfall itself, so the timing and route shift somewhat year to year."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Serengeti',
    wikiTerm: 'Serengeti'
  },
  {
    id: 'everest-growing',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Mt._Everest_from_Gokyo_Ri_November_5%2C_2012.jpg/500px-Mt._Everest_from_Gokyo_Ri_November_5%2C_2012.jpg', width: 480, height: 320, credit: 'Rdevany', creditUrl: 'https://en.wikipedia.org/wiki/File:Mt._Everest_from_Gokyo_Ri_November_5%2C_2012.jpg' },
    category: 'Science',
    title: "Earth's Highest Point Is Still Rising",
    place: 'Nepal & China',
    countries: ['np', 'cn'],
    cities: [{ name: 'Mount Everest', lat: 27.9881, lon: 86.925 }],
    paragraphs: [
      "Mount Everest, on the border of Nepal and Tibet, grows by roughly 4mm a year as the Indian tectonic plate continues to push into the Eurasian plate — the same slow-motion collision that first raised the entire Himalayan range starting around 50 million years ago, when the Indian subcontinent was still an island drifting north across an ancient ocean.",
      "A 2020 joint survey by China and Nepal set its official height at 8,848.86 metres, resolving a long-standing few-metre discrepancy between the two countries' earlier measurements, some of which factored in snow depth differently. Everest isn't actually the tallest mountain measured base-to-peak (Hawaii's Mauna Kea is taller if you count from the seafloor), nor the one farthest from Earth's center (Ecuador's Chimborazo takes that title due to the planet's equatorial bulge) — Everest simply has the highest point above sea level."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Mount_Everest',
    wikiTerm: 'Mount Everest'
  },
  {
    id: 'axolotl-xochimilco',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Axolotl_ganz.jpg/500px-Axolotl_ganz.jpg', width: 480, height: 268, credit: 'LoKiLeCh', creditUrl: 'https://en.wikipedia.org/wiki/File:Axolotl_ganz.jpg' },
    category: 'Biology',
    title: 'A Salamander With Just One Wild Home',
    place: 'Xochimilco, Mexico City',
    countries: ['mx'],
    cities: [{ name: 'Xochimilco', lat: 19.2647, lon: -99.1031 }],
    paragraphs: [
      "The axolotl survives in the wild in exactly one place on Earth: the shrinking network of canals and lakes at Xochimilco, on the southern edge of Mexico City, remnants of the vast lake system the Aztecs once built their capital on. Unlike most amphibians, it never fully grows up — it keeps its feathery external gills and stays aquatic for life, a trait called neoteny, rather than metamorphosing into a land-dwelling adult like other salamanders.",
      "It's also become one of biology's favorite research animals, because it can regenerate not just lost limbs but damaged spinal cord, heart tissue, and even parts of its brain, fully and repeatedly, without scarring. Ironically, the wild population is now critically endangered — pollution, drained wetlands, and introduced fish that eat its eggs have left only a small fraction of its historic range intact, even as axolotls thrive by the millions in labs and aquariums worldwide."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Axolotl',
    wikiTerm: 'Xochimilco'
  },
  {
    id: 'parmesan-collateral',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Parmigiano_Reggiano%2C_Italien%2C_Europ%C3%A4ische_Union.jpg/500px-Parmigiano_Reggiano%2C_Italien%2C_Europ%C3%A4ische_Union.jpg', width: 480, height: 493, credit: 'Naturpuur', creditUrl: 'https://en.wikipedia.org/wiki/File:Parmigiano_Reggiano%2C_Italien%2C_Europ%C3%A4ische_Union.jpg' },
    category: 'Food',
    title: 'Cheese as Collateral',
    place: 'Emilia-Romagna, Italy',
    countries: ['it'],
    cities: [{ name: 'Parma', lat: 44.8015, lon: 10.3279 }],
    paragraphs: [
      "In Italy's Emilia-Romagna region, wheels of Parmigiano-Reggiano are valuable enough — and age predictably enough — that some Italian banks accept them as loan collateral. Producers can borrow against cheese that's still maturing, using the wheels themselves as security while they sit in climate-controlled warehouses for the one to three years the cheese needs to develop its flavor.",
      "Banks that offer this, like Credito Emiliano, actually store and insure thousands of wheels in dedicated vaults, complete with automated turning racks, as the cheese ages toward its eventual sale — meaning the collateral literally increases in value the longer it sits in the vault. Each wheel is stamped with its production date and rind markings that make it traceable and hard to counterfeit, which is part of what makes it viable as a financial asset in the first place."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Parmesan',
    wikiTerm: 'Parmigiano-Reggiano'
  },
  {
    id: 'sagrada-familia',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/SF_maig_2_cropped.jpg/500px-SF_maig_2_cropped.jpg', width: 480, height: 699, credit: 'Canaan', creditUrl: 'https://en.wikipedia.org/wiki/File:SF_maig_2_cropped.jpg' },
    category: 'Architecture',
    title: 'A Cathedral Still Being Finished After 140+ Years',
    place: 'Barcelona, Spain',
    countries: ['es'],
    cities: [{ name: 'Sagrada Família', lat: 41.4036, lon: 2.1744 }],
    paragraphs: [
      "Construction on Antoni Gaudí's Sagrada Família in Barcelona began in 1882 and still isn't finished. Gaudí took over the project a year later, worked on it for over 40 years, and reportedly said of the timeline, \"My client is not in a hurry\" — referring to God. He's buried in its crypt, having spent the last years of his life living on site.",
      "The project has always been funded entirely by private donations and, more recently, visitor ticket sales, rather than government money — one of the reasons it took so long, alongside interruptions from the Spanish Civil War, when anarchists burned Gaudí's original workshop and models. The main central tower, planned to be the tallest church spire in the world once complete, has an official completion target of 2026, a century after Gaudí's death — though the surrounding decorative work is expected to continue well beyond that."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Sagrada_Fam%C3%ADlia',
    wikiTerm: 'Sagrada Família'
  },
  {
    id: 'bone-flute-germany',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Hohler_Fels.jpg/500px-Hohler_Fels.jpg', width: 480, height: 722, credit: 'Dr. Eugen Lehle', creditUrl: 'https://en.wikipedia.org/wiki/File:Hohler_Fels.jpg' },
    category: 'Music',
    title: 'The Oldest Known Musical Instrument',
    place: 'Swabian Jura, Germany',
    countries: ['de'],
    cities: [{ name: 'Hohle Fels cave', lat: 48.3833, lon: 9.75 }],
    paragraphs: [
      "In 2008, archaeologists excavating the Hohle Fels cave in southern Germany's Swabian Jura uncovered a flute carved from a griffon vulture's wing bone, pieced together from fragments and dated to roughly 40,000 years ago. It has five finger holes and a notched mouthpiece, and it's among the oldest confirmed musical instruments ever found.",
      "It was made by some of the earliest modern humans to reach Europe, at a time they were sharing the continent with Neanderthals, and its precision — evenly spaced holes, careful shaping — suggests a musical tradition that was already established rather than brand new. Several other bone and mammoth-ivory flutes have since turned up in nearby caves in the same region, hinting this was a broader, ongoing practice rather than a single one-off find."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Hohle_Fels',
    wikiTerm: 'Hohle Fels'
  },
  {
    id: 'fan-death-korea',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Korean_fans_closeup.jpg', width: 480, height: 360, credit: 'Na-Rae Han', creditUrl: 'https://en.wikipedia.org/wiki/File:Korean_fans_closeup.jpg' },
    category: 'Psychology',
    title: 'The Belief That a Fan Can Kill You Overnight',
    place: 'South Korea',
    countries: ['kr'],
    paragraphs: [
      "In South Korea, a persistent popular belief holds that sleeping in a sealed room with an electric fan running can be fatal — supposedly through asphyxiation, a drop in body temperature, or the fan somehow chopping up the oxygen in the air. Known as fan death, the idea has been reported as a real cause of death in Korean media and even by some coroners for decades, despite no credible scientific mechanism behind it.",
      "Modern fans sold in Korea commonly include an automatic timer specifically marketed around this fear, so buyers can set the fan to switch off after they fall asleep. Doctors and safety researchers have repeatedly pointed out that the actual risks are ordinary ones — the cooling benefits of fans generally outweigh any theoretical harm — but the belief has proven remarkably durable, showing up in newspaper reports as recently as the 2000s and 2010s."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Fan_death',
    wikiTerm: 'fan death'
  },
  {
    id: 'click-consonants-za',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/South_Africa_2011_Xhosa_speakers_proportion_map.svg/500px-South_Africa_2011_Xhosa_speakers_proportion_map.svg.png', width: 480, height: 421, credit: 'Htonl', creditUrl: 'https://en.wikipedia.org/wiki/File:South_Africa_2011_Xhosa_speakers_proportion_map.svg' },
    category: 'Language',
    title: 'Languages Built Partly From Clicks',
    place: 'South Africa',
    countries: ['za'],
    paragraphs: [
      "Two of South Africa's official languages, Xhosa and Zulu, use click consonants as regular speech sounds — sharp, percussive clicks made with the tongue, written in Xhosa spelling as c, q, and x. They aren't sound effects or emphasis; they're full consonants that change the meaning of a word exactly like any other letter would.",
      "Linguists believe Xhosa and Zulu picked up clicks through centuries of close contact with the Khoisan languages of southern Africa, where click consonants are original and far more extensive — some Khoisan languages use dozens of distinct clicks. It makes Xhosa in particular unusual among the world's major languages: a Bantu language with millions of speakers that borrowed an entire category of sound from a completely unrelated language family."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Click_consonant',
    wikiTerm: 'click consonants'
  },
  {
    id: 'zimbabwe-hyperinflation',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Zimbabwe_Hyperinflation_2008_notes.jpg/500px-Zimbabwe_Hyperinflation_2008_notes.jpg', width: 480, height: 383, credit: 'en:User:Discott', creditUrl: 'https://en.wikipedia.org/wiki/File:Zimbabwe_Hyperinflation_2008_notes.jpg' },
    category: 'Economics',
    title: 'The Hundred-Trillion-Dollar Banknote',
    place: 'Zimbabwe',
    countries: ['zw'],
    paragraphs: [
      "Zimbabwe's economy collapsed into one of the worst cases of hyperinflation in recorded history through the 2000s, driven by a mix of land reform disruption to farming, government money-printing to cover its debts, and a shrinking economy trying to support a fixed level of spending. Prices are estimated to have doubled roughly every 24 hours at the peak in November 2008.",
      "The central bank kept issuing notes with more and more zeros to keep up, eventually printing a Z$100 trillion banknote in January 2009 — worth only a few US dollars at the time, and worth far less within weeks. Zimbabwe abandoned its own currency entirely a month later, switching to the US dollar and other foreign currencies for everyday transactions, an arrangement that lasted for most of the following decade."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Hyperinflation_in_Zimbabwe',
    wikiTerm: 'hyperinflation'
  },
  {
    id: 'darvaza-gas-crater',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Darvasa_gas_crater_panorama.jpg/500px-Darvasa_gas_crater_panorama.jpg', width: 480, height: 204, credit: 'Tormod Sandtorv', creditUrl: 'https://en.wikipedia.org/wiki/File:Darvasa_gas_crater_panorama.jpg' },
    category: 'Geology',
    title: 'The Door to Hell',
    place: 'Karakum Desert, Turkmenistan',
    countries: ['tm'],
    cities: [{ name: 'Darvaza gas crater', lat: 40.2528, lon: 58.4392 }],
    paragraphs: [
      "In the middle of Turkmenistan's Karakum Desert, a 70-metre-wide crater has been burning continuously since the 1970s. Soviet geologists drilling for natural gas are said to have hit an underground cavern that collapsed into a sinkhole, releasing methane; to stop the gas from poisoning nearby land and animals, they reportedly set it alight, expecting it to burn out within days.",
      "It's been burning for more than fifty years since. Locally nicknamed the \"Door to Hell,\" the Darvaza gas crater has become an unlikely tourist attraction, with visitors camping nearby to watch the flames at night, even as Turkmenistan's government has periodically announced plans to extinguish it to recover the gas and limit its environmental impact."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Darvaza_gas_crater',
    wikiTerm: 'Darvaza gas crater'
  },
  {
    id: 'shortest-war',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/AngloZanzibarWar.jpg/500px-AngloZanzibarWar.jpg', width: 480, height: 337, credit: 'Richard Mohun', creditUrl: 'https://en.wikipedia.org/wiki/File:AngloZanzibarWar.jpg' },
    category: 'History',
    title: 'The 38-Minute War',
    place: 'Zanzibar',
    countries: ['gb', 'tz'],
    cities: [{ name: 'Zanzibar', lat: -6.1659, lon: 39.2026 }],
    paragraphs: [
      "The Anglo-Zanzibar War, fought between the United Kingdom and the Sultanate of Zanzibar on 27 August 1896, is the shortest war on record, lasting somewhere between 38 and 45 minutes depending on the source. It broke out after the pro-British sultan died and his cousin took the throne without London's approval, violating a treaty that gave Britain a say in succession.",
      "When an ultimatum to step down was ignored, Royal Navy ships bombarded the sultan's palace; the new sultan fled, his forces surrendered, and a British-approved successor was installed the same day. Zanzibar — now part of Tanzania, united with Tanganyika in 1964 — remained a British protectorate for another six decades after the episode."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Anglo-Zanzibar_War',
    wikiTerm: 'Anglo-Zanzibar War'
  },
  {
    id: 'socotra-dragon-blood',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Dragonblood_tree_in_Socotra_2.jpg/500px-Dragonblood_tree_in_Socotra_2.jpg', width: 480, height: 639, credit: 'Alex38', creditUrl: 'https://en.wikipedia.org/wiki/File:Dragonblood_tree_in_Socotra_2.jpg' },
    category: 'Nature',
    title: 'An Island That Evolution Forgot',
    place: 'Socotra, Yemen',
    countries: ['ye'],
    cities: [{ name: 'Socotra', lat: 12.4634, lon: 53.8237 }],
    paragraphs: [
      "The Yemeni island of Socotra has been isolated in the Arabian Sea for millions of years, and around a third of its plant species grow nowhere else on Earth. Its most recognizable resident is Dracaena cinnabari, the dragon's blood tree, whose branches fan out into a dense, umbrella-shaped canopy that looks more like something from concept art than a real plant.",
      "The tree's thick red sap — the \"dragon's blood\" of its name — has been harvested for thousands of years as a dye, varnish, and traditional medicine, traded since antiquity along Indian Ocean and Red Sea routes. Socotra's isolation, combined with its otherworldly plant life, has led some ecologists to nickname it the \"Galápagos of the Indian Ocean.\""
    ],
    wiki: 'https://en.wikipedia.org/wiki/Dracaena_cinnabari',
    wikiTerm: 'Dracaena cinnabari'
  },
  {
    id: 'lake-natron-calcify',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Lake_Natron_%28Tanzania%29_%E2%80%93_2017-03-06_%28very_early_in_rainy_season%29_%E2%80%93_satellite_image_%28cropped%29.jpg/500px-Lake_Natron_%28Tanzania%29_%E2%80%93_2017-03-06_%28very_early_in_rainy_season%29_%E2%80%93_satellite_image_%28cropped%29.jpg', width: 480, height: 846, credit: 'Joshua Stevens/NASA', creditUrl: 'https://en.wikipedia.org/wiki/File:Lake_Natron_%28Tanzania%29_%E2%80%93_2017-03-06_%28very_early_in_rainy_season%29_%E2%80%93_satellite_image_%28cropped%29.jpg' },
    category: 'Nature',
    title: 'The Lake That Calcifies What Falls Into It',
    place: 'Tanzania',
    countries: ['tz'],
    cities: [{ name: 'Lake Natron', lat: -2.4167, lon: 36.0 }],
    paragraphs: [
      "Tanzania's Lake Natron is fed by mineral-rich springs and sits in a basin with no outlet, so intense evaporation concentrates sodium carbonate and other salts until the water's pH can reach 10.5 — caustic enough to burn skin and eyes on contact. Its red-tinted water gets its color from salt-loving microorganisms that thrive in exactly these harsh conditions.",
      "Animals that die in or near the lake are sometimes preserved by the same minerals that make it so hostile, calcifying into eerie, statue-like remains along the shoreline — a phenomenon that gained wide attention through photographer Nick Brandt's images of them. Despite the extreme chemistry, the lake is also the primary breeding site for roughly three-quarters of the world's lesser flamingos, which tolerate the alkalinity far better than almost anything else."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Lake_Natron',
    wikiTerm: 'Lake Natron'
  },
  {
    id: 'sentinelese-isolation',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Gallery-1491391768-north-sentinel-island.jpg/500px-Gallery-1491391768-north-sentinel-island.jpg', width: 480, height: 310, credit: 'Medici82', creditUrl: 'https://en.wikipedia.org/wiki/File:Gallery-1491391768-north-sentinel-island.jpg' },
    category: 'Anthropology',
    title: "The World's Most Isolated People",
    place: 'North Sentinel Island, India',
    countries: ['in'],
    cities: [{ name: 'North Sentinel Island', lat: 11.5533, lon: 92.2367 }],
    paragraphs: [
      "North Sentinel Island, part of India's Andaman Islands chain, is home to the Sentinelese, one of the last peoples on Earth to have essentially no sustained contact with the outside world. They've consistently and often forcefully rejected outside visitors for as long as contact has been attempted, and their language remains unclassified because so little of it has ever been recorded.",
      "The Indian government has designated a legal exclusion zone around the island and prohibits travel within several kilometres of it, partly out of respect for the Sentinelese people's choice to remain isolated and partly because they likely have no immunity to common outside diseases that could devastate the small population — estimated at somewhere between a few dozen and a few hundred people, though no reliable census has ever been possible."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Sentinelese',
    wikiTerm: 'Sentinelese'
  },
  {
    id: 'paranal-observatory-chile',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Paranal_and_the_Pacific_at_sunset_%28dsc4088%2C_retouched%2C_cropped%29.jpg/500px-Paranal_and_the_Pacific_at_sunset_%28dsc4088%2C_retouched%2C_cropped%29.jpg', width: 480, height: 336, credit: 'ESO/G. Hüdepohl (atacamaphoto.com)', creditUrl: 'https://en.wikipedia.org/wiki/File:Paranal_and_the_Pacific_at_sunset_%28dsc4088%2C_retouched%2C_cropped%29.jpg' },
    category: 'Astronomy',
    title: 'Some of the Clearest Skies on Earth',
    place: 'Atacama Desert, Chile',
    countries: ['cl'],
    cities: [{ name: 'Paranal Observatory', lat: -24.6272, lon: -70.4039 }],
    paragraphs: [
      "Chile's Atacama plateau combines extreme dryness, high altitude, and dark, stable air with almost no light pollution — conditions so good for astronomy that a large and growing share of the world's ground-based telescopes are clustered there. The European Southern Observatory's Very Large Telescope, at Paranal, uses four giant mirrors that can work individually or be combined into a single, far more powerful instrument.",
      "Nearby, the Atacama Large Millimeter Array (ALMA) links 66 separate radio dishes spread across the desert into one enormous virtual telescope, while the Extremely Large Telescope, under construction on a neighboring peak, is set to have a primary mirror nearly 40 metres across once finished — larger than any optical telescope built before it. By some estimates, Chile is on track to host well over half of the world's astronomical observing capacity within the next couple of decades."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Very_Large_Telescope',
    wikiTerm: 'Very Large Telescope'
  },
  {
    id: 'baikal-oldest-lake',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Baikal.A2001296.0420.250m-NASA.jpg/500px-Baikal.A2001296.0420.250m-NASA.jpg', width: 480, height: 621, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Baikal.A2001296.0420.250m-NASA.jpg' },
    category: 'Geology',
    title: "The World's Oldest and Deepest Lake",
    place: 'Siberia, Russia',
    countries: ['ru'],
    cities: [{ name: 'Lake Baikal', lat: 53.5, lon: 108.0 }],
    paragraphs: [
      "Siberia's Lake Baikal is both the deepest lake on Earth, reaching about 1,642 metres at its lowest point, and by far the oldest, estimated at 25-30 million years — most lakes are geologically short-lived and silt up or drain within tens of thousands of years. Baikal alone holds roughly 20% of all the unfrozen fresh surface water on the planet, more than all five of North America's Great Lakes combined.",
      "That age and isolation have made it a hotspot of unique evolution: well over half of its thousands of animal species live nowhere else, including the Baikal seal, the only seal species found exclusively in fresh water, hundreds of kilometres from any ocean. How its ancestors got there in the first place remains genuinely debated among biologists."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Lake_Baikal',
    wikiTerm: 'Lake Baikal'
  },
  {
    id: 'surstromming-sweden',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Surstr%C3%B6mming.jpg/500px-Surstr%C3%B6mming.jpg', width: 480, height: 360, credit: 'Lapplaender', creditUrl: 'https://en.wikipedia.org/wiki/File:Surstr%C3%B6mming.jpg' },
    category: 'Food',
    title: 'A Canned Fish Famous for Its Smell',
    place: 'Sweden',
    countries: ['se'],
    paragraphs: [
      "Surströmming, lightly salted Baltic herring fermented for months before canning, is often cited as one of the most pungent foods in the world, and lab measurements of its odor compounds back that reputation up. Unlike most canned food, fermentation doesn't fully stop after the can is sealed, so the cans keep slowly building internal pressure and visibly bulge on store shelves.",
      "Because opening one releases such a strong smell, it's traditionally eaten outdoors, and some people open the can underwater to contain the initial spray. Airlines and some ferry operators have banned it as cargo over fears that a can rupturing mid-transit could be mistaken for something more dangerous, and it remains, even in Sweden, a food that divides enthusiastic fans from people who can't get near it."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Surstr%C3%B6mming',
    wikiTerm: 'Surströmming'
  },
  {
    id: 'webcam-cambridge',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Trojan_Room_coffee_pot_xcoffee.png', width: 142, height: 159, credit: 'Quentin Stafford-Fraser', creditUrl: 'https://en.wikipedia.org/wiki/File:Trojan_Room_coffee_pot_xcoffee.png' },
    category: 'Technology',
    title: 'The First Webcam Watched a Coffee Pot',
    place: 'Cambridge, England',
    countries: ['gb'],
    cities: [{ name: 'Cambridge', lat: 52.2053, lon: 0.1218 }],
    paragraphs: [
      "In 1991, computer scientists at Cambridge University's Computer Laboratory got tired of walking to a shared coffee pot on another floor only to find it empty. Their fix was a camera pointed at the pot, feeding a low-resolution grayscale image to their internal network so anyone could check the coffee level before making the trip.",
      "In 1993, once early web browsers could display images, they put the same feed online — creating what's widely regarded as the first webcam ever connected to the internet, watched by curious visitors worldwide who had no connection to the lab at all. The \"Trojan Room coffee pot,\" as it became known, was finally switched off in 2001 when the lab moved buildings, by which point it had briefly become one of the most-viewed curiosities of the early web."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Trojan_Room_coffee_pot',
    wikiTerm: 'Trojan Room coffee pot'
  },
  {
    id: 'bhutan-archery',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/ArcheryGermanyEarly1980s-2.jpg/500px-ArcheryGermanyEarly1980s-2.jpg', width: 480, height: 312, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:ArcheryGermanyEarly1980s-2.jpg' },
    category: 'Sports',
    title: 'A National Sport Built Around Distraction',
    place: 'Bhutan',
    countries: ['bt'],
    paragraphs: [
      "Archery is Bhutan's official national sport, and matches look less like a quiet target range and more like a festival — teams sing, dance, and heckle their opponents mid-shot, trying to throw off their aim through friendly psychological pressure rather than silence and etiquette. Traditional bamboo bows are still used in village-level competitions alongside modern compound bows at higher levels.",
      "Targets are often set an unusually long distance apart compared to Olympic standards, and celebrations after a good shot can involve elaborate ceremonial dances performed right on the field. Bhutan sent archers to the Olympics as its very first Olympic team in 1984, and archery remains the country's most widely practiced organized sport at the village level today."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Sports_in_Bhutan',
    wikiTerm: 'archery'
  },
  {
    id: 'kolmanskop-ghost-town',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Kolmanskop_Ghost_Town.jpg/500px-Kolmanskop_Ghost_Town.jpg', width: 480, height: 270, credit: 'SkyPixels', creditUrl: 'https://en.wikipedia.org/wiki/File:Kolmanskop_Ghost_Town.jpg' },
    category: 'Ghost Towns',
    title: 'A Diamond Town Being Swallowed by the Desert',
    place: 'Kolmanskop, Namibia',
    countries: ["na"],
    cities: [{ name: "Kolmanskop", lat: -26.7167, lon: 15.2333 }],
    paragraphs: [
      "Kolmanskop was a booming diamond-mining town in the Namibian desert in the early 20th century, complete with a hospital, ballroom, theatre, and the first X-ray station in the southern hemisphere, all built to serve a population drawn in by a diamond rush that began in 1908. Diamonds were reportedly once so plentiful that workers could pick them off the sand by moonlight.",
      "Richer deposits found further south drew people away through the 1930s, and the town was fully abandoned by 1956. With nobody left to keep the desert out, sand has since poured through doors and windows, burying entire rooms halfway up their walls; the empty buildings, still mostly intact, have made Kolmanskop one of the most photographed ghost towns in the world."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Kolmanskop',
    wikiTerm: 'Kolmanskop'
  },
  {
    id: 'sealand-micronation',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Sealand.jpg/500px-Sealand.jpg', width: 480, height: 320, credit: 'Ryan Lackey', creditUrl: 'https://en.wikipedia.org/wiki/File:Sealand.jpg' },
    category: 'Micronations',
    title: 'A Country Built on a WWII Sea Fort',
    place: 'North Sea, off England',
    countries: ["gb"],
    cities: [{ name: "Principality of Sealand", lat: 51.8944, lon: 1.4817 }],
    paragraphs: [
      "The Principality of Sealand occupies a single abandoned anti-aircraft platform in the North Sea, built by Britain during WWII and abandoned afterward, about 10km off the English coast. A British family took it over in 1967, declared it an independent nation, and has run it as a self-styled sovereign micronation ever since, complete with its own flag, currency, passports, and a line of hereditary succession.",
      "No country formally recognises Sealand's sovereignty, and its legal status has never been fully tested, but it's survived a fire, a 1978 armed takeover by rival claimants (repelled and later negotiated back), and decades of tourists and journalists treating it as a genuine, if tiny, curiosity of international law — its entire land area is smaller than a football pitch."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Principality_of_Sealand',
    wikiTerm: 'Principality of Sealand'
  },
  {
    id: 'kowloon-walled-city',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Kowloon_Walled_City_-_1989_Aerial.jpg/500px-Kowloon_Walled_City_-_1989_Aerial.jpg', width: 480, height: 362, credit: 'Ian Lambot', creditUrl: 'https://en.wikipedia.org/wiki/File:Kowloon_Walled_City_-_1989_Aerial.jpg' },
    category: 'Urban Extremes',
    title: 'The Densest Place That Ever Existed',
    place: 'Kowloon, Hong Kong',
    countries: ["cn"],
    cities: [{ name: "Kowloon Walled City", lat: 22.3312, lon: 114.1904 }],
    paragraphs: [
      "Kowloon Walled City began as a small Chinese military outpost that, through a quirk of a 19th-century treaty, ended up governed by neither Hong Kong's British colonial administration nor mainland China. Left in a legal no-man's-land for decades, it grew almost entirely unregulated into a single sprawling structure of interconnected high-rises just 2.6 hectares in size.",
      "By the time it was demolished in 1993-94, an estimated 33,000 people lived inside it, making it, by most estimates, the most densely populated place that has ever existed — over a million people per square kilometre if scaled up. Sunlight barely reached its lower alleyways, power and water lines were a tangled improvised web, and it ran largely on its own internal economy of small workshops, clinics, and businesses, policed more by its own residents' associations than by any government."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Kowloon_Walled_City',
    wikiTerm: 'Kowloon Walled City'
  },
  {
    id: 'hashima-battleship-island',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Battle-Ship_Island_Nagasaki_Japan.jpg/500px-Battle-Ship_Island_Nagasaki_Japan.jpg', width: 480, height: 360, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Battle-Ship_Island_Nagasaki_Japan.jpg' },
    category: 'Ghost Towns',
    title: "Japan's Abandoned 'Battleship Island'",
    place: 'Hashima, Japan',
    countries: ["jp"],
    cities: [{ name: "Hashima Island", lat: 32.6275, lon: 129.7386 }],
    paragraphs: [
      "Hashima Island, nicknamed Gunkanjima (\"Battleship Island\") for its silhouette, was a densely packed undersea coal-mining community off Nagasaki, reaching a peak population density among the highest ever recorded — more than 80,000 people per square kilometre at its 1959 peak, packed into a cluster of concrete apartment blocks on a speck of land barely 6 hectares in size.",
      "When the coal mine closed in 1974 as Japan shifted to petroleum, the entire population left within months, and the island has sat empty and decaying ever since. It reopened to limited tourism in 2009 and later appeared as a filming location for a James Bond film, its crumbling apartment blocks now a UNESCO World Heritage Site alongside other Meiji-era industrial sites."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Hashima_Island',
    wikiTerm: 'Hashima Island'
  },
  {
    id: 'bir-tawil-unclaimed',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Topographic_Map_of_Bir_Tawil.png/500px-Topographic_Map_of_Bir_Tawil.png', width: 480, height: 217, credit: 'Maps-For-Free.com', creditUrl: 'https://en.wikipedia.org/wiki/File:Topographic_Map_of_Bir_Tawil.png' },
    category: 'Political Oddities',
    title: 'A Piece of Land No Country Wants',
    place: 'Bir Tawil, Egypt-Sudan border',
    countries: ["eg", "sd"],
    cities: [{ name: "Bir Tawil", lat: 21.8767, lon: 33.7361 }],
    paragraphs: [
      "Bir Tawil, a roughly 2,000 square kilometre stretch of desert between Egypt and Sudan, is one of the very few pieces of land on Earth claimed by no country at all. The situation is a side effect of two conflicting colonial-era border lines: Egypt insists on the older 1899 boundary, which puts Bir Tawil in Sudan, while Sudan insists on a 1902 administrative line that puts it in Egypt.",
      "Because each country's claim to the more valuable, resource-rich Hala'ib Triangle nearby depends on the border it prefers, both governments effectively have to disown Bir Tawil to keep their claim to Hala'ib consistent — leaving this smaller patch of desert unclaimed by design rather than oversight. It's occasionally 'claimed' by individuals hoping to found their own micronation there, none recognised by any government."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Bir_Tawil',
    wikiTerm: 'Bir Tawil'
  },
  {
    id: 'baarle-enclaves',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/P1070673Gemeentehuis.JPG/500px-P1070673Gemeentehuis.JPG', width: 480, height: 360, credit: 'G.Lanting', creditUrl: 'https://en.wikipedia.org/wiki/File:P1070673Gemeentehuis.JPG' },
    category: 'Border Oddities',
    title: 'A Border That Runs Through Living Rooms',
    place: 'Baarle, Netherlands-Belgium',
    countries: ["nl", "be"],
    cities: [{ name: "Baarle-Nassau / Baarle-Hertog", lat: 51.4415, lon: 4.9298 }],
    paragraphs: [
      "The twin towns of Baarle-Nassau (Netherlands) and Baarle-Hertog (Belgium) share one of the most tangled borders on Earth: two dozen small Belgian enclaves sit scattered inside Dutch territory, several of which contain smaller Dutch enclaves inside them, the result of a patchwork of medieval treaties and land swaps between local lords centuries before either modern country existed.",
      "The border is marked out in white crosses and studs set directly into the streets and pavements, and in a number of buildings it runs straight through the middle, meaning a shop or house can have a different nationality on each side of a single room — historically exploited for things like differing shop hours or tax rules between the two countries, and which house's front door counted as the 'official' address."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Baarle-Nassau',
    wikiTerm: 'Baarle-Nassau'
  },
  {
    id: 'whittier-one-building-town',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Whittier%2C_Alaska_aerial_view_2026.jpg/500px-Whittier%2C_Alaska_aerial_view_2026.jpg', width: 480, height: 320, credit: 'Quintin Soloviev', creditUrl: 'https://en.wikipedia.org/wiki/File:Whittier%2C_Alaska_aerial_view_2026.jpg' },
    category: 'Company Towns',
    title: 'A Town That Lives Inside One Building',
    place: 'Whittier, Alaska',
    countries: ["us"],
    cities: [{ name: "Whittier", lat: 60.7728, lon: -148.6864 }],
    paragraphs: [
      "Nearly the entire population of Whittier, Alaska — around 260 people — lives inside a single 14-story former military building called Begich Towers. The town was built by the US Army during WWII specifically because near-constant cloud cover made it hard to spot from the air, and the building was designed to be self-sufficient against Alaska's brutal winters.",
      "Begich Towers today houses not just apartments but the town's police station, church, and general store, all reachable without going outside; the local school is one of the only buildings that requires a short walk through the elements, connected to the tower by a tunnel in winter. The town is also only reachable by a single-lane tunnel shared with a railway, which closes overnight."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Whittier,_Alaska',
    wikiTerm: 'Whittier, Alaska'
  },
  {
    id: 'defenestrations-of-prague',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Prager_Fenstersturz_Wahrhafftige_Zeitung_aus_Prag.JPG/500px-Prager_Fenstersturz_Wahrhafftige_Zeitung_aus_Prag.JPG', width: 480, height: 327, credit: 'Unknown authorUnknown author', creditUrl: 'https://en.wikipedia.org/wiki/File:Prager_Fenstersturz_Wahrhafftige_Zeitung_aus_Prag.JPG' },
    category: 'Political History',
    title: 'A City With a Habit of Throwing People Out Windows',
    place: 'Prague, Czech Republic',
    countries: ["cz"],
    cities: [{ name: "Prague Castle", lat: 50.0909, lon: 14.4004 }],
    paragraphs: [
      "Prague has had at least three politically significant \"defenestrations\" — the act of throwing someone out of a window as a form of protest or coup — spaced across roughly 500 years of its history. The first, in 1419, saw a crowd of Hussite protesters throw several town councillors from a town hall window, helping trigger decades of religious war.",
      "The most consequential came in 1618, when Protestant nobles threw two Catholic regents (and a secretary) out of a Prague Castle window to protest Habsburg religious policy; all three reportedly survived the roughly 20-metre fall, which Catholic accounts attributed to divine intervention and Protestant accounts blamed on a conveniently placed dung heap. That incident helped spark the Thirty Years' War, one of the most destructive conflicts in European history."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Defenestrations_of_Prague',
    wikiTerm: 'defenestrations'
  },
  {
    id: 'dancing-plague-1518',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dancingplague2_%28alt%29.jpg/500px-Dancingplague2_%28alt%29.jpg', width: 480, height: 353, credit: 'Unknown authorUnknown author', creditUrl: 'https://en.wikipedia.org/wiki/File:Dancingplague2_%28alt%29.jpg' },
    category: 'Mass Hysteria',
    title: 'The City That Danced Itself to Exhaustion',
    place: 'Strasbourg (then part of the Holy Roman Empire)',
    countries: ["fr"],
    cities: [{ name: "Strasbourg", lat: 48.5734, lon: 7.7521 }],
    paragraphs: [
      "In July 1518, a woman in the city of Strasbourg reportedly began dancing in the street without music and didn't stop for days; within a month, contemporary accounts describe as many as 400 people caught up in the same compulsive dancing, some of whom collapsed from exhaustion, and some possibly dying from heart attacks or strokes brought on by it.",
      "City authorities, believing more dancing was the cure, initially made things worse by hiring musicians and clearing a hall to encourage it. The most widely accepted modern explanation is a form of mass psychogenic illness — stress-induced collective behaviour — plausibly amplified by a famine-stricken, superstitious population, though the episode, now generally known as the dancing plague of 1518, remains one of the strangest well-documented events in European history."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Dancing_plague_of_1518',
    wikiTerm: 'dancing plague of 1518'
  },
  {
    id: 'great-emu-war',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Deceased_emu_during_Emu_War.jpg/500px-Deceased_emu_during_Emu_War.jpg', width: 480, height: 577, credit: 'Unknown authorUnknown author', creditUrl: 'https://en.wikipedia.org/wiki/File:Deceased_emu_during_Emu_War.jpg' },
    category: 'Military Oddities',
    title: 'The War Australia Lost to Emus',
    place: 'Western Australia',
    countries: ["au"],
    paragraphs: [
      "In 1932, the Australian military was deployed against an unusual enemy: emus. Around 20,000 of the large flightless birds had migrated into Western Australian farmland after breeding season, trampling crops and fences, and soldiers were sent out with machine guns to cull them at farmers' request.",
      "The operation, later nicknamed the Great Emu War, went badly — emus proved surprisingly hard to hit in open terrain, scattering into small groups instead of forming an easy target, and the guns frequently jammed. After roughly a month and only a few hundred confirmed kills for thousands of rounds fired, the military withdrew; farmers were left to manage the birds themselves, and the emus have since been only half-jokingly described as having won."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Emu_War',
    wikiTerm: 'Great Emu War'
  },
  {
    id: 'tulip-mania-netherlands',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Jan_Brueghel_the_Younger%2C_Satire_on_Tulip_Mania%2C_c._1640.jpg/500px-Jan_Brueghel_the_Younger%2C_Satire_on_Tulip_Mania%2C_c._1640.jpg', width: 480, height: 307, credit: 'Jan Brueghel the Younger', creditUrl: 'https://en.wikipedia.org/wiki/File:Jan_Brueghel_the_Younger%2C_Satire_on_Tulip_Mania%2C_c._1640.jpg' },
    category: 'Financial History',
    title: 'When a Flower Bulb Cost More Than a House',
    place: 'Netherlands',
    countries: ["nl"],
    paragraphs: [
      "During the Dutch Golden Age in the 1630s, tulip bulbs — a still-novel import from the Ottoman Empire — became the subject of intense speculative trading, with prices for rare varieties climbing to many times an average worker's annual income. Contracts for bulbs still in the ground changed hands repeatedly before ever being dug up, an early form of futures trading.",
      "Prices collapsed abruptly in February 1637, wiping out paper fortunes almost overnight, in what's often cited as one of the first recorded speculative bubbles in economic history. Modern economic historians debate how widespread the damage really was outside a fairly narrow circle of wealthy traders, but tulip mania has remained a go-to shorthand for irrational market speculation ever since."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Tulip_mania',
    wikiTerm: 'tulip mania'
  },
  {
    id: 'boston-molasses-flood',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/BostonMolassesDisaster.jpg/500px-BostonMolassesDisaster.jpg', width: 480, height: 382, credit: 'BPL', creditUrl: 'https://en.wikipedia.org/wiki/File:BostonMolassesDisaster.jpg' },
    category: 'Industrial Disasters',
    title: 'The Flood Made of Molasses',
    place: 'Boston, Massachusetts',
    countries: ["us"],
    cities: [{ name: "Boston", lat: 42.3601, lon: -71.0589 }],
    paragraphs: [
      "In January 1919, a huge steel tank holding over 8.7 million litres of molasses ruptured in Boston's North End, sending a wave of molasses estimated at up to 8 metres high through the streets at an estimated 55km/h. It killed 21 people and injured about 150, some of whom drowned or suffocated in the thick, sticky liquid.",
      "A lengthy lawsuit afterward — one of the first major class-action suits in Massachusetts — found the company had cut corners on the tank's construction and failed to adequately test it. The disaster helped push forward some of the earliest engineering licensing requirements in the US, and residents reportedly claimed for decades afterward that the neighbourhood still smelled faintly of molasses on hot summer days."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Great_Molasses_Flood',
    wikiTerm: 'molasses'
  },
  {
    id: 'dyatlov-pass-incident',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA_%D0%B4%D1%8F%D1%82%D0%BB%D0%BE%D0%B2%D1%86%D0%B0%D0%BC_%D0%BD%D0%B0_%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%BA%D0%BB%D0%B0%D0%B4%D0%B1%D0%B8%D1%89%D0%B5.jpg/500px-%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA_%D0%B4%D1%8F%D1%82%D0%BB%D0%BE%D0%B2%D1%86%D0%B0%D0%BC_%D0%BD%D0%B0_%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%BA%D0%BB%D0%B0%D0%B4%D0%B1%D0%B8%D1%89%D0%B5.jpg', width: 480, height: 360, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA_%D0%B4%D1%8F%D1%82%D0%BB%D0%BE%D0%B2%D1%86%D0%B0%D0%BC_%D0%BD%D0%B0_%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%BC_%D0%BA%D0%BB%D0%B0%D0%B4%D0%B1%D0%B8%D1%89%D0%B5.jpg' },
    category: 'Unsolved Mysteries',
    title: 'Nine Hikers, an Abandoned Tent, and No Clear Answer',
    place: 'Ural Mountains, Russia',
    countries: ["ru"],
    cities: [{ name: "Dyatlov Pass", lat: 61.7558, lon: 59.4517 }],
    paragraphs: [
      "In February 1959, nine experienced Soviet hikers died during an expedition in the Ural Mountains under circumstances that remain genuinely disputed today. Their tent was found cut open from the inside, and the group had fled into sub-zero temperatures partially dressed, some without shoes, scattering across the slope in the dark rather than staying together.",
      "Investigators at the time closed the case citing a vague \"compelling natural force,\" and later theories have ranged from a small avalanche and a rare wind phenomenon, to far less credible military-testing or paranormal explanations. A 2019-2021 Russian government re-investigation and a physics-based avalanche study both leaned toward a slab avalanche as the most likely trigger, though not every detail of the case has been fully explained to everyone's satisfaction."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Dyatlov_Pass_incident',
    wikiTerm: 'compelling natural force'
  },
  {
    id: 'tunguska-event',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Tunguska_Ereignis-1.jpg/500px-Tunguska_Ereignis-1.jpg', width: 480, height: 326, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Tunguska_Ereignis-1.jpg' },
    category: 'Unsolved Mysteries',
    title: 'The Explosion With No Crater',
    place: 'Siberia, Russia',
    countries: ["ru"],
    cities: [{ name: "Tunguska", lat: 60.8858, lon: 101.9167 }],
    paragraphs: [
      "In June 1908, an enormous explosion flattened an estimated 80 million trees across roughly 2,150 square kilometres of remote Siberian forest, with a blast believed to be hundreds of times more powerful than the Hiroshima bomb. It was so remote that the first scientific expedition didn't reach the site until nearly 20 years later.",
      "The leading explanation is that a stony asteroid or comet fragment, roughly 50-60 metres across, exploded in an airburst several kilometres above the ground before ever reaching the surface — which is why, unusually for an impact event of this scale, no crater has ever been found. It remains the largest impact event in recorded history to affect a populated area, and is still used as a reference case in modern planetary-defence research on how to detect similar objects in advance."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Tunguska_event',
    wikiTerm: 'Siberian forest'
  },
  {
    id: 'karni-mata-rat-temple',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/20191212_%C5%9Awi%C4%85tynia_Karni_Maty_w_De%C5%9Bnok_1031_8078_DxO.jpg/500px-20191212_%C5%9Awi%C4%85tynia_Karni_Maty_w_De%C5%9Bnok_1031_8078_DxO.jpg', width: 480, height: 319, credit: 'Jakub Hałun', creditUrl: 'https://en.wikipedia.org/wiki/File:20191212_%C5%9Awi%C4%85tynia_Karni_Maty_w_De%C5%9Bnok_1031_8078_DxO.jpg' },
    category: 'Religious Sites',
    title: 'The Temple Where Rats Are Sacred',
    place: 'Deshnoke, India',
    countries: ["in"],
    cities: [{ name: "Karni Mata Temple", lat: 27.7936, lon: 73.34 }],
    paragraphs: [
      "The Karni Mata Temple in Deshnoke, Rajasthan, is home to an estimated 25,000 black rats, which devotees consider sacred and actively protect and feed — according to temple legend, they're the reincarnated descendants of the 14th-century mystic Karni Mata's storytellers and warriors.",
      "Visitors are expected to walk among the rats barefoot, and food or drink nibbled on by the rats is considered a blessing, sometimes eaten by devotees rather than discarded. A small number of white rats are also present in the temple and considered especially auspicious to spot, believed to be manifestations of Karni Mata herself and her sons."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Karni_Mata_Temple',
    wikiTerm: 'Karni Mata Temple'
  },
  {
    id: 'sokushinbutsu-self-mummification',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Ramses_I_Mummy.jpg/500px-Ramses_I_Mummy.jpg', width: 480, height: 360, credit: 'Alyssa Bivins', creditUrl: 'https://en.wikipedia.org/wiki/File:Ramses_I_Mummy.jpg' },
    category: 'Ascetic Practices',
    title: 'Monks Who Mummified Themselves Alive',
    place: 'Yamagata, Japan',
    countries: ["jp"],
    paragraphs: [
      "Between roughly the 11th and 19th centuries, a small number of Buddhist monks in Japan's Yamagata region, mainly practitioners of Shugendō, attempted an extraordinarily severe practice called sokushinbutsu: a years-long process of extreme dieting, meant to strip the body of fat and moisture while still alive, followed by ritual entombment in a small underground chamber with a breathing tube and a bell to signal they were still living.",
      "When the bell stopped ringing, the tomb was sealed; if the body was later found naturally preserved rather than decomposed, it was venerated as a successful sokushinbutsu and displayed in a temple. Very few of the attempts are believed to have succeeded — most monks who tried simply died and decomposed like anyone else — and the Japanese government formally banned the practice, and assisting in it, in the 19th century."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Sokushinbutsu',
    wikiTerm: 'sokushinbutsu'
  },
  {
    id: 'sedlec-ossuary-bone-church',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kostnice_Sedlec.JPG/500px-Kostnice_Sedlec.JPG', width: 480, height: 640, credit: 'Pudelek (Marcin Szala)', creditUrl: 'https://en.wikipedia.org/wiki/File:Kostnice_Sedlec.JPG' },
    category: 'Religious Sites',
    title: 'A Chapel Decorated With Tens of Thousands of Bones',
    place: 'Kutná Hora, Czech Republic',
    countries: ["cz"],
    cities: [{ name: "Sedlec Ossuary", lat: 49.9539, lon: 15.2814 }],
    paragraphs: [
      "The Sedlec Ossuary, a small Roman Catholic chapel near Kutná Hora, is decorated almost entirely with human bones — an estimated 40,000 to 70,000 skeletons' worth, arranged into chandeliers, garlands, a coat of arms, and a large bone-built centerpiece. Most of the remains date to a 14th-century plague and 15th-century wars, when the site's cemetery, already popular for being sprinkled with soil from Jerusalem, filled up dramatically.",
      "The current artistic arrangement dates mostly to 1870, when a local woodcarver named František Rint was hired to organise the enormous existing pile of bones that had accumulated in the chapel's crypt for centuries; he reportedly signed his work in bones on one wall. It remains an active, consecrated chapel and a popular tourist site today."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Sedlec_Ossuary',
    wikiTerm: 'Sedlec Ossuary'
  },
  {
    id: 'hutt-river-secession',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/LocationPHR.svg/500px-LocationPHR.svg.png', width: 480, height: 312, credit: 'Seb az86556', creditUrl: 'https://en.wikipedia.org/wiki/File:LocationPHR.svg' },
    category: 'Micronations',
    title: 'The Farm That Seceded From Australia for 50 Years',
    place: 'Western Australia',
    countries: ["au"],
    paragraphs: [
      "In 1970, a Western Australian wheat farmer named Leonard Casley declared his roughly 75-square-kilometre property an independent nation, the Principality of Hutt River, after a dispute with the government over wheat production quotas that he argued had been imposed unlawfully. He crowned himself Prince Leonard and issued his own currency, stamps, and passports.",
      "Australia never recognised Hutt River's independence, but also largely left it alone for five decades, during which it became a minor tourist attraction. It was formally dissolved in 2020 by Casley's son and successor, partly due to a large unpaid tax bill the Australian government said the self-declared 'nation' still owed, ending one of the longest-running micronation experiments in the world."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Principality_of_Hutt_River',
    wikiTerm: 'Principality of Hutt River'
  },
  {
    id: 'fordlandia-failed-city',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Fordlandia.JPG/500px-Fordlandia.JPG', width: 480, height: 360, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Fordlandia.JPG' },
    category: 'Company Towns',
    title: "Henry Ford's Failed City in the Amazon",
    place: 'Pará, Brazil',
    countries: ["br"],
    cities: [{ name: "Fordlândia", lat: -3.7975, lon: -55.4886 }],
    paragraphs: [
      "In 1928, Henry Ford leased a huge tract of Brazilian Amazon rainforest to grow rubber for Ford tires, building an entire American-style company town there called Fordlândia — complete with white picket fences, a golf course, and suburban-style housing — despite nobody involved in the planning having any tropical agriculture or rubber-growing expertise.",
      "The rubber trees, planted too close together in unfamiliar soil, were quickly devastated by South American leaf blight and insect pests that plantation-style monoculture made worse rather than better; workers also resented imposed American customs like mandatory square dancing and a ban on alcohol. The project never produced significant rubber and was abandoned by Ford's company in 1945, having lost the equivalent of well over $200 million in today's money."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Fordl%C3%A2ndia',
    wikiTerm: 'Fordlândia'
  },
  {
    id: 'wow-signal',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Wow_signal.jpg/500px-Wow_signal.jpg', width: 480, height: 271, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Wow_signal.jpg' },
    category: 'Unsolved Mysteries',
    title: "A 72-Second Radio Signal Nobody's Explained",
    place: 'Ohio, USA',
    countries: ["us"],
    cities: [{ name: "Big Ear Radio Observatory", lat: 40.2489, lon: -83.0378 }],
    paragraphs: [
      "In August 1977, an Ohio State University radio telescope called Big Ear detected an unusually strong, narrowband radio signal from the direction of the constellation Sagittarius, matching closely the exact frequency scientists had proposed as a likely one for interstellar communication. Astronomer Jerry Ehman, reviewing the printout days later, circled the data and wrote \"Wow!\" in the margin, giving the signal its name.",
      "The signal was never detected again despite repeated follow-up searches over the following decades, and its exact source has never been conclusively identified — proposed explanations range from a passing comet's hydrogen cloud, a theory later largely discredited, to signal reflection off space debris, to it simply being what it looked like at the time: an unexplained strong signal. It remains one of the most-cited candidate signals in the search for extraterrestrial intelligence, precisely because no one has ever definitively ruled it in or out."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Wow!_signal',
    wikiTerm: 'Wow!'
  },
  {
    id: 'bouvet-island-remote',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Bouvet_Island_on_the_globe_%28Antarctica_centered%29.svg/500px-Bouvet_Island_on_the_globe_%28Antarctica_centered%29.svg.png', width: 480, height: 480, credit: 'TUBS', creditUrl: 'https://en.wikipedia.org/wiki/File:Bouvet_Island_on_the_globe_%28Antarctica_centered%29.svg' },
    category: 'Remote Places',
    title: 'The Most Remote Island on Earth',
    place: 'Bouvet Island, Norway',
    countries: ["no"],
    cities: [{ name: "Bouvet Island", lat: -54.4208, lon: 3.3464 }],
    paragraphs: [
      "Bouvet Island, a Norwegian dependency in the South Atlantic, is generally considered the most remote island on Earth — the nearest land, Antarctica's Queen Maud Land, is about 1,700km away, and the nearest permanently inhabited place is roughly twice that distance. Over 90% of the island is covered by a glacier, and its coastline is mostly sheer ice cliffs.",
      "It has no permanent human population and only a small automated weather station; the few research expeditions that land there have to do so by helicopter, since there's no safe natural harbour. A lifeboat found abandoned on the island in 1964 remains an unsolved minor mystery — no wreck or bodies were ever found to explain where it, or its occupants, came from."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Bouvet_Island',
    wikiTerm: 'Bouvet Island'
  },
  {
    id: 'boiling-river-amazon',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Amazon17_%285641020319%29.jpg/500px-Amazon17_%285641020319%29.jpg', width: 480, height: 319, credit: 'CIAT', creditUrl: 'https://en.wikipedia.org/wiki/File:Amazon17_%285641020319%29.jpg' },
    category: 'Natural Phenomena',
    title: 'A River That Can Cook What Falls Into It',
    place: 'Peruvian Amazon',
    countries: ["pe"],
    cities: [{ name: "Shanay-timpishka", lat: -9.0575, lon: -75.9739 }],
    paragraphs: [
      "Deep in the Peruvian Amazon, a river known locally as Shanay-timpishka (\"boiled with the heat of the sun\") reaches temperatures averaging around 86°C across several kilometres of its length — hot enough to seriously scald or kill animals that fall in, despite there being no volcano anywhere nearby to obviously explain the heat.",
      "Geologist Andrés Ruzo, who studied the river after hearing about it as a childhood legend, traced its heat to geothermally heated water rising along a fault line rather than magma directly — a genuinely rare setup for a river this large to be heated this way without a nearby volcano. Local indigenous communities have long treated the river as sacred and dangerous, both a healing site and a place demanding real caution."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Shanay-timpishka',
    wikiTerm: 'Shanay-timpishka'
  },
  {
    id: 'georgia-guidestones',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Georgia_Guidestones%2C_Elbert_County%2C_GA%2C_US_%2805%29.jpg/500px-Georgia_Guidestones%2C_Elbert_County%2C_GA%2C_US_%2805%29.jpg', width: 480, height: 642, credit: 'Bubba73', creditUrl: 'https://en.wikipedia.org/wiki/File:Georgia_Guidestones%2C_Elbert_County%2C_GA%2C_US_%2805%29.jpg' },
    category: 'Unsolved Mysteries',
    title: 'A Monument With an Anonymous Message and a Mysterious End',
    place: 'Elbert County, Georgia, USA',
    countries: ["us"],
    cities: [{ name: "Georgia Guidestones (site)", lat: 34.2286, lon: -82.8964 }],
    paragraphs: [
      "In 1980, a granite monument known as the Georgia Guidestones was erected in rural Georgia, commissioned by a man using the pseudonym \"R. C. Christian,\" whose real identity was never publicly confirmed. The structure's four large slabs were inscribed with a set of ten guidelines for humanity, translated into eight languages, touching on population control, environmental balance, and world governance.",
      "It quickly attracted conspiracy theories from multiple directions, some framing it as a sinister globalist manifesto. In July 2022, an explosion severely damaged the monument in what authorities determined was a deliberate bombing; the remains were dismantled shortly after for safety reasons, and no suspect has ever been publicly identified or charged, leaving both its original purpose and its destruction unresolved."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Georgia_Guidestones',
    wikiTerm: 'Georgia Guidestones'
  },
  {
    id: 'wieliczka-salt-mine',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/%CE%91%CE%BB%CE%B1%CF%84%CF%89%CF%81%CF%85%CF%87%CE%B5%CE%AF%CE%B1_%CE%92%CE%B9%CE%B5%CE%BB%CE%AF%CF%84%CF%83%CE%BA%CE%B1_5021.jpg/500px-%CE%91%CE%BB%CE%B1%CF%84%CF%89%CF%81%CF%85%CF%87%CE%B5%CE%AF%CE%B1_%CE%92%CE%B9%CE%B5%CE%BB%CE%AF%CF%84%CF%83%CE%BA%CE%B1_5021.jpg', width: 480, height: 320, credit: 'C messier', creditUrl: 'https://en.wikipedia.org/wiki/File:%CE%91%CE%BB%CE%B1%CF%84%CF%89%CF%81%CF%85%CF%87%CE%B5%CE%AF%CE%B1_%CE%92%CE%B9%CE%B5%CE%BB%CE%AF%CF%84%CF%83%CE%BA%CE%B1_5021.jpg' },
    category: 'Underground Wonders',
    title: 'A Cathedral Carved Entirely From Salt',
    place: 'Wieliczka, Poland',
    countries: ["pl"],
    cities: [{ name: "Wieliczka Salt Mine", lat: 49.9856, lon: 20.0538 }],
    paragraphs: [
      "The Wieliczka Salt Mine near Kraków operated continuously from the 13th century until 2007, and over that time miners carved out an extraordinary underground world alongside their regular work — chapels, statues, and even entire chandeliers, all sculpted directly from rock salt by hand.",
      "Its centerpiece, the Chapel of St. Kinga, sits over 100 metres underground and includes salt-carved altarpieces, wall reliefs depicting biblical scenes, and chandeliers made from dissolved and recrystallised salt so clear it resembles glass. The mine is one of the world's oldest continuously operating tourist attractions, having welcomed visitors since at least the 15th century, and today the air in parts of it is considered so pure that a section operates as a respiratory health sanatorium."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Wieliczka_Salt_Mine',
    wikiTerm: 'Wieliczka Salt Mine'
  },
  {
    id: 'winchester-mystery-house',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Winchester_Mystery_House_2023-07-17_02.jpg/500px-Winchester_Mystery_House_2023-07-17_02.jpg', width: 480, height: 270, credit: 'The wub', creditUrl: 'https://en.wikipedia.org/wiki/File:Winchester_Mystery_House_2023-07-17_02.jpg' },
    category: 'Eccentric Architecture',
    title: 'A House Built Continuously for 38 Years',
    place: 'San Jose, California',
    countries: ["us"],
    cities: [{ name: "Winchester Mystery House", lat: 37.3183, lon: -121.9511 }],
    paragraphs: [
      "After inheriting a vast fortune from the Winchester repeating rifle company, Sarah Winchester bought a modest farmhouse in San Jose in 1886 and, according to popular legend, kept construction crews building on it around the clock for the next 38 years, allegedly on the advice of a medium who told her stopping construction would let vengeful spirits, of people killed by Winchester rifles, catch up with her.",
      "Whatever the real motivation, the result is a genuinely bewildering mansion: staircases that lead into ceilings, doors that open onto blank walls or steep drops, and a floor plan so tangled that even Sarah Winchester reportedly needed a servant's help to find certain rooms. Construction stopped only when she died in 1922; the house is now a museum, and historians increasingly attribute its odd design less to ghosts than to Sarah Winchester's own idiosyncratic, ever-changing architectural experimentation."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Winchester_Mystery_House',
    wikiTerm: 'Sarah Winchester'
  },
  {
    id: 'krubera-cave-deepest',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/View_on_Arabika_from_Rosa_Khutor.jpg/500px-View_on_Arabika_from_Rosa_Khutor.jpg', width: 480, height: 287, credit: 'Sergei Kazantsev', creditUrl: 'https://en.wikipedia.org/wiki/File:View_on_Arabika_from_Rosa_Khutor.jpg' },
    category: 'Speleology',
    title: "One of Earth's Deepest Known Caves",
    place: 'Abkhazia, Georgia',
    countries: ["ge"],
    cities: [{ name: "Krubera Cave", lat: 43.4058, lon: 40.3467 }],
    paragraphs: [
      "Krubera Cave, in the Arabika Massif of the Western Caucasus, plunges to a surveyed depth of roughly 2,197 metres, making it one of the two known deepest caves on Earth. Reaching its lowest known point requires a multi-day expedition through flooded, freezing passages and requires specialized cave-diving skills at several points where the route is submerged.",
      "It wasn't explored below about 340 metres until Ukrainian speleologists began systematic expeditions in the late 1990s, progressively pushing the known depth further down over more than a decade of return trips. Scientists have also found previously unknown species of blind, cave-adapted invertebrates at some of its deepest, most isolated points, adapted to complete darkness and near-freezing water."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Krubera_Cave',
    wikiTerm: 'Krubera Cave'
  },
  {
    id: 'lake-hillier-pink',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Lake_Hillier_2_Middle_Island_Recherche_Archipelago_NR_IV-2011.JPG/500px-Lake_Hillier_2_Middle_Island_Recherche_Archipelago_NR_IV-2011.JPG', width: 480, height: 360, credit: 'Aussie Oc', creditUrl: 'https://en.wikipedia.org/wiki/File:Lake_Hillier_2_Middle_Island_Recherche_Archipelago_NR_IV-2011.JPG' },
    category: 'Natural Phenomena',
    title: 'A Lake That Is Permanently, Genuinely Pink',
    place: 'Middle Island, Australia',
    countries: ["au"],
    cities: [{ name: "Lake Hillier", lat: -34.0966, lon: 123.2036 }],
    paragraphs: [
      "Lake Hillier, on a small island off the coast of Western Australia, is a solid, vivid bubblegum pink year-round — not a trick of lighting or a seasonal bloom, but its permanent, genuine colour. If you scoop the water into a glass, it stays pink.",
      "The exact cause isn't settled with total certainty, but researchers generally attribute it to a combination of salt-loving algae that produce a red pigment and pink-tinted halophilic (salt-loving) bacteria that thrive in the lake's very high salt concentration, similar to what happens in some commercial salt evaporation ponds elsewhere in the world. The lake is protected within a nature reserve, with access mostly restricted to flying over it, which is how most of its now-famous photographs are taken."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Lake_Hillier',
    wikiTerm: 'Lake Hillier'
  },
  {
    id: 'cave-of-crystals-mexico',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Cristales_cueva_de_Naica.JPG/500px-Cristales_cueva_de_Naica.JPG', width: 480, height: 320, credit: 'Alexander Van Driessche', creditUrl: 'https://en.wikipedia.org/wiki/File:Cristales_cueva_de_Naica.JPG' },
    category: 'Speleology',
    title: 'A Cave Full of House-Sized Crystals',
    place: 'Naica, Mexico',
    countries: ["mx"],
    cities: [{ name: "Cueva de los Cristales", lat: 27.85, lon: -105.4964 }],
    paragraphs: [
      "The Cave of the Crystals, discovered by miners in 2000 roughly 300 metres beneath a lead and silver mine in Naica, Mexico, contains some of the largest natural crystals ever found — translucent selenite beams up to about 12 metres long and weighing many tonnes, formed over an estimated half a million years by mineral-rich water held at an unusually steady temperature.",
      "That same steady heat makes the cave nearly unbearable for humans: temperatures reach around 45-50°C with close to 100% humidity, conditions in which a person can only survive for perhaps 10-20 minutes without specialized cooling suits and respirators, since the body can't cool itself through sweat in air already saturated with moisture. The mine has since been allowed to flood again, resubmerging the crystals and halting most further exploration."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Cave_of_the_Crystals',
    wikiTerm: 'Cave of the Crystals'
  },
  {
    id: 'roopkund-skeleton-lake',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Roopkund_Lake.jpg/500px-Roopkund_Lake.jpg', width: 480, height: 321, credit: 'Schwiki', creditUrl: 'https://en.wikipedia.org/wiki/File:Roopkund_Lake.jpg' },
    category: 'Archaeological Mysteries',
    title: 'A Himalayan Lake Full of Ancient Skeletons',
    place: 'Uttarakhand, India',
    countries: ["in"],
    cities: [{ name: "Roopkund", lat: 30.2557, lon: 79.7326 }],
    paragraphs: [
      "Roopkund, a small glacial lake high in the Indian Himalayas at around 5,000 metres elevation, holds the skeletal remains of several hundred people, first reported by a forest ranger in 1942; when the ice partly melts each year, some of the bones and even bits of preserved flesh, hair, and equipment become visible around the lake's edges.",
      "For decades, local legend and early theories pointed to a single catastrophic event — a hailstorm, an epidemic, or a battle. A detailed 2019 genetic study complicated that picture considerably: the remains actually belong to at least three genetically distinct groups who died in episodes centuries apart, including a group with ancestry closely matching people from the eastern Mediterranean, whose presence in the Himalayas at that time remains unexplained."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Roopkund',
    wikiTerm: 'Roopkund'
  },
  {
    id: 'catacombs-of-paris',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Catacumbas%2C_Par%C3%ADs%2C_Francia%2C_2022-11-01%2C_DD_105-107_HDR.jpg/500px-Catacumbas%2C_Par%C3%ADs%2C_Francia%2C_2022-11-01%2C_DD_105-107_HDR.jpg', width: 480, height: 320, credit: 'Diego Delso', creditUrl: 'https://en.wikipedia.org/wiki/File:Catacumbas%2C_Par%C3%ADs%2C_Francia%2C_2022-11-01%2C_DD_105-107_HDR.jpg' },
    category: 'Underground Wonders',
    title: 'Six Million People, Stacked Underground',
    place: 'Paris, France',
    countries: ["fr"],
    cities: [{ name: "Catacombs of Paris", lat: 48.8338, lon: 2.3324 }],
    paragraphs: [
      "By the late 18th century, some of Paris's overflowing cemeteries had become a public health crisis — mass graves collapsing into neighbouring basements was not unheard of — so the city began systematically transferring skeletal remains into abandoned limestone quarry tunnels beneath the city, a project that continued for decades.",
      "The result, the Catacombs of Paris, now holds the remains of an estimated six million people, with many of the bones stacked into deliberate, sometimes decorative arrangements — skulls and femurs pressed into patterns along the tunnel walls — rather than left as a random pile. Only a small, roughly 1.5km fraction of the roughly 320km of tunnels beneath Paris is open to the public; exploring the rest without authorization is illegal but still draws a dedicated subculture of unofficial urban explorers known as cataphiles."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Catacombs_of_Paris',
    wikiTerm: 'Catacombs of Paris'
  },
  {
    id: 'pig-beach-bahamas',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Vorobek_Bahamas_-_swimming_pigs.jpg/500px-Vorobek_Bahamas_-_swimming_pigs.jpg', width: 480, height: 640, credit: 'cdorobek', creditUrl: 'https://en.wikipedia.org/wiki/File:Vorobek_Bahamas_-_swimming_pigs.jpg' },
    category: 'Wildlife Oddities',
    title: 'An Uninhabited Island Full of Swimming Pigs',
    place: 'Exuma, Bahamas',
    countries: ["bs"],
    cities: [{ name: "Big Major Cay", lat: 24.1858, lon: -76.4553 }],
    paragraphs: [
      "Big Major Cay, an uninhabited island in the Bahamas' Exuma chain, is home to a population of feral pigs that swim out into the turquoise water to greet passing boats, an image that's made the spot, nicknamed Pig Beach, one of the most photographed animal attractions in the Caribbean.",
      "Nobody knows for certain how the pigs got there — competing stories include sailors leaving them intentionally as a future food source, a shipwreck survivors' tale, or a failed attempt at a tourist attraction — and no version has been definitively confirmed. The pigs are now fed daily by tour operators and have become such a fixture that their wellbeing, and occasional deaths linked to tourists' food and alcohol, has become a genuine local conservation concern."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Pig_Beach',
    wikiTerm: 'Pig Beach'
  },
  {
    id: 'oak-island-money-pit',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Island_and_Wharf%2C_Oak_Island%2C_Nova_Scotia%2C_Canada%2C_August_1931.jpg/500px-Island_and_Wharf%2C_Oak_Island%2C_Nova_Scotia%2C_Canada%2C_August_1931.jpg', width: 480, height: 344, credit: 'Richard McCully', creditUrl: 'https://en.wikipedia.org/wiki/File:Island_and_Wharf%2C_Oak_Island%2C_Nova_Scotia%2C_Canada%2C_August_1931.jpg' },
    category: 'Archaeological Mysteries',
    title: 'A 200-Year Treasure Hunt With Nothing Found',
    place: 'Oak Island, Canada',
    countries: ["ca"],
    cities: [{ name: "Oak Island", lat: 44.5027, lon: -64.3006 }],
    paragraphs: [
      "Oak Island, a small island off Nova Scotia, has drawn treasure hunters since 1795, when three teenagers reportedly discovered a mysterious depression in the ground — later dubbed the \"Money Pit\" — that seemed to have been deliberately dug and refilled by someone in the past.",
      "Over more than two centuries, numerous excavation attempts have reported finding wooden platforms, layers of charcoal and clay, and pieces of what might be old tools at various depths, fueling theories ranging from pirate treasure to Knights Templar relics to Shakespeare's lost manuscripts — but no definitive treasure or conclusive proof of an artificial origin has ever been recovered, and at least six people have died during excavation attempts over the years, most from cave-ins or gas exposure in the flooded shafts."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Oak_Island',
    wikiTerm: 'Oak Island'
  },
  {
    id: 'movile-cave-isolated',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Venenivibrio.jpg', width: 478, height: 653, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Venenivibrio.jpg' },
    category: 'Speleology',
    title: 'A Cave Sealed Off for 5 Million Years',
    place: 'Constanța, Romania',
    countries: ["ro"],
    cities: [{ name: "Movile Cave", lat: 43.8283, lon: 28.5644 }],
    paragraphs: [
      "Movile Cave, discovered by accident in 1986 during a survey for a power plant site in Romania, had been completely sealed off from the surface, and from sunlight, for an estimated 5.5 million years before workers broke through. Its air is low in oxygen and high in toxic gases like hydrogen sulfide and methane, unbreathable for more than short supervised visits even today.",
      "Despite that, the cave supports an entire ecosystem — dozens of species, many found nowhere else on Earth and most blind and colourless — that survives on chemosynthesis, where microbes derive energy directly from the cave's sulfur-rich chemistry rather than from sunlight-driven plant life the way almost every other ecosystem on the planet's surface does. Access is now tightly restricted to protect it, with only a small number of scientists permitted to enter each year."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Movile_Cave',
    wikiTerm: 'Movile Cave'
  },
  {
    id: 'coober-pedy-underground',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Coober_Pedy_-_panoramio_%284%29.jpg/500px-Coober_Pedy_-_panoramio_%284%29.jpg', width: 480, height: 240, credit: 'qwesy qwesy', creditUrl: 'https://en.wikipedia.org/wiki/File:Coober_Pedy_-_panoramio_%284%29.jpg' },
    category: 'Urban Extremes',
    title: 'A Town That Lives Underground to Escape the Heat',
    place: 'Coober Pedy, Australia',
    countries: ["au"],
    cities: [{ name: "Coober Pedy", lat: -29.0135, lon: 134.7544 }],
    paragraphs: [
      "Coober Pedy, an opal-mining town in the South Australian outback, sees summer temperatures regularly above 40°C, so a large share of its roughly 1,800 residents live in 'dugouts' — homes carved directly into the sandstone hillsides, which stay at a comfortable, stable temperature year-round without air conditioning.",
      "The underground layout extends well beyond housing: the town has underground churches, a bar, a bookshop, and even an underground campsite for tourists, many built by expanding old mining shafts left over from opal digging that began after WWI. It remains one of the world's main sources of precious opal, and its otherworldly, cratered above-ground landscape has repeatedly been used as a filming location for post-apocalyptic and alien-planet movie scenes."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Coober_Pedy',
    wikiTerm: 'Coober Pedy'
  },
  {
    id: 'aral-sea-disappearance',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/AralSea1989_2014.jpg/500px-AralSea1989_2014.jpg', width: 480, height: 408, credit: 'NASA. Collage by Producercunningham.', creditUrl: 'https://en.wikipedia.org/wiki/File:AralSea1989_2014.jpg' },
    category: 'Environmental Disasters',
    title: 'The Sea That Turned Into a Desert',
    place: 'Kazakhstan & Uzbekistan',
    countries: ["kz", "uz"],
    cities: [{ name: "Aral Sea (former shoreline)", lat: 45.0, lon: 60.0 }],
    paragraphs: [
      "The Aral Sea was once the fourth-largest lake in the world, until Soviet irrigation projects starting in the 1960s diverted the two major rivers that fed it to grow cotton across the surrounding desert. By the 2000s it had shrunk to roughly 10% of its original volume, splitting into several smaller, saltier remnants.",
      "Former fishing towns that once sat on the shoreline are now stranded tens of kilometres from any water, with rusted fishing boats sitting abandoned on what is now bare desert. Kazakhstan has managed to partly restore the smaller northern portion of the sea through a dam project completed in 2005, but the larger southern section, mostly in Uzbekistan, remains largely gone, and dust storms carrying salt and residual agricultural chemicals from the exposed seabed now cause ongoing health and environmental problems across the wider region."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Aral_Sea',
    wikiTerm: 'Aral Sea'
  },
  {
    id: 'svalbard-polar-bear-law',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/W_W_Svalbard_LandSat7_21.14475E_78.71545N.png/500px-W_W_Svalbard_LandSat7_21.14475E_78.71545N.png', width: 480, height: 450, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:W_W_Svalbard_LandSat7_21.14475E_78.71545N.png' },
    category: 'Local Law',
    title: "A Territory Where It's Illegal to Go Outside Town Unarmed",
    place: 'Svalbard, Norway',
    countries: ["no"],
    paragraphs: [
      "On the Norwegian archipelago of Svalbard, home to roughly 3,000 polar bears, more bears than people, it's a legal requirement to carry a firearm, or travel with someone who does, whenever you leave the main settlement of Longyearbyen, specifically as protection against polar bear encounters.",
      "Shops in Longyearbyen sell and rent rifles specifically for this purpose, and visitors are strongly encouraged to take a safety course before heading out. Despite the precaution, actual attacks are rare, and locals and conservation groups generally emphasize avoidance and deterrence over shooting, since polar bears are a protected species under Norwegian law even here — killing one in self-defence still triggers a mandatory police investigation."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Svalbard',
    wikiTerm: 'Longyearbyen'
  },
  {
    id: 'pitcairn-islands-smallest',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_the_Pitcairn_Islands.svg/500px-Flag_of_the_Pitcairn_Islands.svg.png', width: 480, height: 240, credit: 'Dbenbenn', creditUrl: 'https://en.wikipedia.org/wiki/File:Flag_of_the_Pitcairn_Islands.svg' },
    category: 'Remote Places',
    title: 'A Nation Descended From Mutineers',
    place: 'Pitcairn Islands',
    countries: ["gb"],
    cities: [{ name: "Adamstown, Pitcairn", lat: -25.066, lon: -130.1015 }],
    paragraphs: [
      "The Pitcairn Islands, a British Overseas Territory in the middle of the South Pacific, have the smallest population of any national jurisdiction in the world — around 35 to 50 people, depending on the year. Most residents are descended from the crew of HMS Bounty, who mutinied against their captain in 1789 and, along with several Tahitians, settled the then-uninhabited island to hide from the Royal Navy.",
      "Because so much of the tiny community shares mutineer ancestry, a small handful of surnames — Christian chief among them, after mutiny leader Fletcher Christian — still dominate the island. The only way in or out is by boat, with a supply ship visiting roughly every three months, and the islands remain one of the most isolated inhabited places on Earth."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Pitcairn_Islands',
    wikiTerm: 'Pitcairn Islands'
  },
  {
    id: 'tristan-da-cunha-remote',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Tristan_da_Cunha.svg/500px-Flag_of_Tristan_da_Cunha.svg.png', width: 480, height: 240, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Flag_of_Tristan_da_Cunha.svg' },
    category: 'Remote Places',
    title: 'The Most Remote Inhabited Island in the World',
    place: 'Tristan da Cunha',
    countries: ["gb"],
    cities: [{ name: "Edinburgh of the Seven Seas", lat: -37.0678, lon: -12.3116 }],
    paragraphs: [
      "Tristan da Cunha, a British Overseas Territory in the South Atlantic, is generally considered the most remote permanently inhabited island in the world — the nearest inhabited land, South Africa, is about 2,400km away, and the nearest continent, South America, is even farther. Its roughly 250 residents all live in a single settlement fittingly called Edinburgh of the Seven Seas.",
      "There's no airstrip; the only way to reach the island is a six-day boat journey from South Africa, and the entire population had to be evacuated to England for two years in 1961 after a volcanic eruption threatened the settlement, before nearly everyone chose to return once it was deemed safe. Just a handful of surnames account for most of the island's population today, a result of that same small founding community."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Tristan_da_Cunha',
    wikiTerm: 'Tristan da Cunha'
  },
  {
    id: 'marble-caves-patagonia',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Lago_Gral._Carrera_01.JPG/500px-Lago_Gral._Carrera_01.JPG', width: 480, height: 360, credit: 'Jorge Morales Piderit', creditUrl: 'https://en.wikipedia.org/wiki/File:Lago_Gral._Carrera_01.JPG' },
    category: 'Natural Phenomena',
    title: 'Caves Sculpted by a Lake, Not by Hand',
    place: 'General Carrera Lake, Chile',
    countries: ["cl"],
    cities: [{ name: "Marble Caves, General Carrera Lake", lat: -46.6167, lon: -72.4833 }],
    paragraphs: [
      "On the shores of General Carrera Lake, straddling the Chile-Argentina border, thousands of years of wave action against solid calcium-carbonate rock have carved out a network of swirling caverns, columns, and tunnels known as the Marble Caves, their walls polished smooth in sweeping blue-and-white patterns.",
      "The lake's striking colour, and the caves' appearance, shifts noticeably with the seasons: glacial meltwater raises the lake level and changes its mineral content through the year, making the caves look markedly different depending on when they're visited, from a pale, almost white marble in drier months to deep blue reflections when the lake is fuller. The caves are accessible only by boat or kayak, since there's no path along the cliff face itself."
    ],
    wiki: 'https://en.wikipedia.org/wiki/General_Carrera_Lake',
    wikiTerm: 'General Carrera Lake'
  },
  {
    id: 'longyearbyen-no-burial',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Longyearbyen-spisshus-2022.jpg/500px-Longyearbyen-spisshus-2022.jpg', width: 480, height: 327, credit: 'Bjørn Christian Tørrissen', creditUrl: 'https://en.wikipedia.org/wiki/File:Longyearbyen-spisshus-2022.jpg' },
    category: 'Local Law',
    title: "The Town Where You Can't Be Buried",
    place: 'Longyearbyen, Svalbard',
    countries: ["no"],
    cities: [{ name: "Longyearbyen", lat: 78.2232, lon: 15.6267 }],
    paragraphs: [
      "Longyearbyen, the main settlement on the Norwegian Arctic archipelago of Svalbard, stopped allowing new burials in its small cemetery back in the 1950s, after it became clear that the permafrost prevented bodies from ever fully decomposing — graves from the 1918 flu pandemic were later found to still contain the virus in a viable, if dormant, state decades later.",
      "Since then, anyone near death, or who dies suddenly, is generally flown to mainland Norway for burial rather than interred locally; it's often loosely summarized as being 'illegal to die' in Longyearbyen, though that's a simplification of the real policy, which is really about where burials can happen rather than banning death itself. The town's isolation, cold, and resident polar bears already make it an unusually practical-minded place to live."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Longyearbyen',
    wikiTerm: 'Longyearbyen'
  },
  {
    id: 'poveglia-plague-island',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Poveglia_Closeup_of_Hospital.jpg/500px-Poveglia_Closeup_of_Hospital.jpg', width: 480, height: 360, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Poveglia_Closeup_of_Hospital.jpg' },
    category: 'Ghost Towns',
    title: 'A Quarantine Island in the Venice Lagoon',
    place: 'Poveglia, Italy',
    countries: ["it"],
    cities: [{ name: "Poveglia", lat: 45.3742, lon: 12.3306 }],
    paragraphs: [
      "Poveglia, a small island in the Venetian Lagoon, served for centuries as a quarantine station for ships suspected of carrying plague, and later as a dumping ground for confirmed plague victims from Venice itself; some historical estimates suggest a significant share of the island's soil is composed of human remains from that period, though precise figures are hard to verify.",
      "In the 20th century it briefly operated as a psychiatric hospital before closing in the 1960s, after which the island was abandoned entirely. It's now off-limits to the public without special permission, and its layered history — plague quarantine, then asylum, then decades of abandonment — has made it one of the most persistently rumour-laden islands in Italy, regularly described in popular media as one of the world's 'most haunted' places, a reputation built more on that history than on anything formally documented."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Poveglia',
    wikiTerm: 'Poveglia'
  },
  {
    id: 'nagoro-scarecrow-village',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Kakashi2.jpg/500px-Kakashi2.jpg', width: 480, height: 387, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Kakashi2.jpg' },
    category: 'Cultural Oddities',
    title: 'A Village Where Scarecrows Outnumber People',
    place: 'Nagoro, Japan',
    countries: ["jp"],
    cities: [{ name: "Nagoro", lat: 33.9167, lon: 133.8833 }],
    paragraphs: [
      "In the small mountain village of Nagoro, on the island of Shikoku, resident Tsukimi Ayano began making life-sized scarecrows in 2002, originally to replace a deceased neighbour, then kept going — she has since made hundreds, dressed and posed to represent former residents, sitting at bus stops, farming fields, and fishing by the river.",
      "As Nagoro's actual human population has continued shrinking to roughly 30 people through rural depopulation and an aging demographic, the scarecrows now outnumber living residents by more than ten to one, effectively turning the village into a life-sized memorial to the community it used to be — including scarecrow versions of a former school's students and teachers, seated in a building that no longer holds real classes."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Nagoro',
    wikiTerm: 'Nagoro'
  },
  {
    id: 'crooked-forest-poland',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Crooked_Forest.jpg/500px-Crooked_Forest.jpg', width: 480, height: 630, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Crooked_Forest.jpg' },
    category: 'Natural Phenomena',
    title: 'A Forest of Trees Bent Into a Right Angle',
    place: 'Gryfino, Poland',
    countries: ["pl"],
    cities: [{ name: "Crooked Forest", lat: 53.2167, lon: 14.5 }],
    paragraphs: [
      "Near the town of Gryfino in Poland, around 400 pine trees, planted in the 1930s, all grow with a near-identical sharp 90-degree bend just above the ground before curving back upright and growing straight for the rest of their height — while the pines around them, planted at the same time, grew perfectly normally.",
      "No one recorded exactly why, and several theories compete: the most widely accepted is that farmers deliberately bent the young saplings using some kind of tool or technique, possibly to grow curved wood for furniture, boat parts, or farm equipment, a use interrupted by WWII before the trees were ever harvested. Other proposed explanations include heavy snowfall or a localised gravitational or soil anomaly, though neither has strong supporting evidence."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Crooked_Forest',
    wikiTerm: 'Gryfino'
  },
  {
    id: 'diomede-islands-time-gap',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Big_Diomede_2_2014-08-17.jpg/500px-Big_Diomede_2_2014-08-17.jpg', width: 480, height: 320, credit: 'Ansgar Walk', creditUrl: 'https://en.wikipedia.org/wiki/File:Big_Diomede_2_2014-08-17.jpg' },
    category: 'Border Oddities',
    title: 'Two Islands 21 Hours Apart, in Sight of Each Other',
    place: 'Bering Strait, Russia & USA',
    countries: ["ru", "us"],
    cities: [{ name: "Big Diomede Island", lat: 65.7833, lon: -169.05 }],
    paragraphs: [
      "The Diomede Islands sit in the middle of the Bering Strait, just 3.8km apart — close enough to see clearly from one to the other on a clear day. Big Diomede belongs to Russia, and Little Diomede belongs to the United States (Alaska), and the International Date Line runs directly between them.",
      "Because of that, despite the short physical distance, the islands can be up to 21 hours apart in local time — Big Diomede is sometimes nicknamed 'Tomorrow Island' and Little Diomede 'Yesterday Isle' as a result. In winter, the strait between them can freeze solid enough to theoretically walk across, though the border has been heavily restricted and rarely crossable in practice since the Cold War."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Big_Diomede_Island',
    wikiTerm: 'Big Diomede'
  },
  {
    id: 'snake-island-brazil',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Ilha_da_Queimada_Grande_-_Itanha%C3%A9m3.jpg/500px-Ilha_da_Queimada_Grande_-_Itanha%C3%A9m3.jpg', width: 480, height: 712, credit: 'Prefeitura Municipal de ItanhaÃ©m', creditUrl: 'https://en.wikipedia.org/wiki/File:Ilha_da_Queimada_Grande_-_Itanha%C3%A9m3.jpg' },
    category: 'Wildlife Oddities',
    title: 'An Island So Dangerous, Visits Are Banned',
    place: 'Ilha da Queimada Grande, Brazil',
    countries: ["br"],
    cities: [{ name: "Ilha da Queimada Grande", lat: -24.4867, lon: -46.6775 }],
    paragraphs: [
      "Ilha da Queimada Grande, off the coast of São Paulo state, is home to an extraordinarily dense population of golden lancehead pit vipers — one of the most venomous snakes in the Americas — with estimates ranging from one snake per square metre in parts of the island to a total population in the low thousands.",
      "The snakes evolved unusually potent venom, and fast-acting bites, likely because their main prey on the island is birds, which need to be incapacitated almost instantly or they'll simply fly away before the venom works. Because of the risk to human life, the Brazilian Navy restricts public access to the island entirely, permitting only scientific researchers and navy personnel who maintain the island's automated lighthouse."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Ilha_da_Queimada_Grande',
    wikiTerm: 'Ilha da Queimada Grande'
  },
  {
    id: 'spomenik-yugoslav-monuments',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Barutana_spomenik.jpg/500px-Barutana_spomenik.jpg', width: 480, height: 360, credit: 'Quatchenerlo', creditUrl: 'https://en.wikipedia.org/wiki/File:Barutana_spomenik.jpg' },
    category: 'Eccentric Architecture',
    title: 'Alien-Looking Monuments From a Country That No Longer Exists',
    place: 'Petrova Gora, Croatia',
    countries: ["hr"],
    cities: [{ name: "Petrova Gora monument", lat: 45.2333, lon: 15.75 }],
    paragraphs: [
      "Scattered across the countries of the former Yugoslavia are hundreds of enormous abstract concrete monuments, commissioned mostly in the 1960s-80s to commemorate WWII battles and victims, built in a strikingly futuristic style that looks more like alien spacecraft or brutalist sculpture than a typical war memorial.",
      "One of the largest, on Petrova Gora in Croatia, is a jagged, gleaming steel-clad structure that once housed a small museum inside. Many of these monuments, often called spomenik, simply the word for 'monument' in several regional languages, fell into disrepair or were vandalised after Yugoslavia broke apart in the 1990s, their original commemorative meaning complicated by the same ethnic conflicts they had originally been built to help prevent; in recent years a wave of photographers rediscovering them online has sparked renewed international interest in preserving what remains."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Petrova_Gora',
    wikiTerm: 'Petrova Gora'
  },
  {
    id: 'voynich-manuscript',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Voynich_Manuscript_%2832%29.jpg/500px-Voynich_Manuscript_%2832%29.jpg', width: 480, height: 645, credit: 'Unknown authorUnknown author', creditUrl: 'https://en.wikipedia.org/wiki/File:Voynich_Manuscript_%2832%29.jpg' },
    category: 'Unsolved Mysteries',
    title: 'A 600-Year-Old Book Nobody Can Read',
    place: 'Origin uncertain (Northern Italy suspected)',
    countries: ["it"],
    paragraphs: [
      "The Voynich manuscript, now held at Yale University, is a roughly 240-page illustrated book written entirely in an unknown script that has never been deciphered, despite a century of dedicated effort by professional and amateur cryptographers alike, including some of the codebreakers who cracked Germany's Enigma cipher in WWII.",
      "Radiocarbon dating of its vellum places its creation in the early 1400s, and its illustrations — invented-looking plants, astrological diagrams, and small figures bathing in green liquid — offer few obvious clues to its meaning or purpose; some stylistic details in its imagery have led researchers to tentatively suggest a Northern Italian origin, though this remains unconfirmed. Proposed explanations range from an unrecorded natural language or code, to an elaborate historical hoax, to a genuine but now-lost constructed language, with no single theory yet accepted by the wider academic community."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Voynich_manuscript',
    wikiTerm: 'Voynich manuscript'
  },
  {
    id: 'zone-rouge-france',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Red_Zone_Map-fr.svg/500px-Red_Zone_Map-fr.svg.png', width: 480, height: 322, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Red_Zone_Map-fr.svg' },
    category: 'War Remnants',
    title: "The French \"Red Zone\" Still Empty a Century Later",
    place: 'Verdun, France',
    countries: ["fr"],
    cities: [{ name: "Zone Rouge, Verdun", lat: 49.1667, lon: 5.4 }],
    paragraphs: [
      "After WWI, French authorities designated a large area around Verdun and other former front lines as \"zone rouge\" (red zone) — land judged too damaged and dangerous to be worth returning to agricultural or residential use, due to unexploded shells, collapsed trenches, and soil heavily contaminated with lead, arsenic, and other chemicals from a century of shelling.",
      "Originally covering well over 1,000 square kilometres, the zone has shrunk considerably as some areas were gradually cleared and reclaimed, but a smaller core area remains officially off-limits or unused, over a hundred years later — specialist ordnance-clearance teams still remove hundreds of tonnes of unexploded WWI munitions from the wider region every single year, in an ongoing task nicknamed the 'iron harvest.'"
    ],
    wiki: 'https://en.wikipedia.org/wiki/Zone_rouge',
    wikiTerm: 'zone rouge'
  },
  {
    id: 'kaali-meteorite-crater',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Kaali-crater-saaremaa-estonia-aug-2007.jpg/500px-Kaali-crater-saaremaa-estonia-aug-2007.jpg', width: 480, height: 231, credit: 'Mannobult', creditUrl: 'https://en.wikipedia.org/wiki/File:Kaali-crater-saaremaa-estonia-aug-2007.jpg' },
    category: 'Natural Phenomena',
    title: 'A Crater That May Have Inspired Ancient Myths',
    place: 'Saaremaa, Estonia',
    countries: ["ee"],
    cities: [{ name: "Kaali crater", lat: 58.3717, lon: 22.6689 }],
    paragraphs: [
      "The Kaali crater field on the Estonian island of Saaremaa was formed by a meteorite impact roughly 1600-2600 years ago (estimates vary), the main crater measuring about 110 metres across with eight smaller craters nearby — a remarkably recent, and remarkably well-preserved, impact site for an inhabited part of Europe.",
      "Archaeologists have found evidence that the site was treated as sacred for centuries afterward, including a fortified settlement built directly around the crater's rim; some researchers have proposed that the impact, likely dramatic enough to have been witnessed for hundreds of kilometres around, may be echoed in Baltic and Finnic mythology in stories about a sun falling from the sky, though this connection remains speculative rather than proven."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Kaali_crater',
    wikiTerm: 'Kaali crater'
  },
  {
    id: 'john-cage-longest-concert',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Halberstadt_St-Burchardi-Kirche.jpg/500px-Halberstadt_St-Burchardi-Kirche.jpg', width: 480, height: 338, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Halberstadt_St-Burchardi-Kirche.jpg' },
    category: 'Music',
    title: 'A Concert Lasting 639 Years',
    place: 'Halberstadt, Germany',
    countries: ["de"],
    cities: [{ name: "St. Burchardi church, Halberstadt", lat: 51.8925, lon: 11.0453 }],
    paragraphs: [
      "In a small church in Halberstadt, Germany, an organ has been playing a single John Cage composition, As Slow as Possible, since 2001 — on a performance schedule designed to last exactly 639 years, ending in the year 2640. The piece has no fixed tempo in Cage's original score, so organizers chose the timeframe partly to mark 639 years since the church's organ was first built.",
      "Because the notes are stretched out so extremely, individual chord changes can be years apart; the most recent change, in 2024, was still only the 15th note change since the performance began. A small, dedicated audience of visitors and livestream viewers still shows up for each rare change, and the project is expected to long outlive everyone currently involved in maintaining it."
    ],
    wiki: 'https://en.wikipedia.org/wiki/As_Slow_as_Possible',
    wikiTerm: 'As Slow as Possible'
  },
  {
    id: 'reggae-jamaica-heritage',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Bob-Marley.jpg', width: 500, height: 744, credit: 'Eddie Mallin', creditUrl: 'https://en.wikipedia.org/wiki/File:Bob-Marley.jpg' },
    category: 'Music',
    title: 'A Music Genre Recognized as World Heritage',
    place: 'Jamaica',
    countries: ["jm"],
    paragraphs: [
      "Reggae emerged in Jamaica in the late 1960s, growing out of earlier local genres like ska and rocksteady, blending them with strong offbeat rhythms, prominent basslines, and lyrics often rooted in social commentary and Rastafari spirituality; Bob Marley became by far its most internationally famous ambassador, though the genre had a large and distinct Jamaican scene well before his global fame.",
      "In 2018, UNESCO added reggae music to its Representative List of the Intangible Cultural Heritage of Humanity, citing its role in international discourse on issues of injustice, resistance, and love, and its function as an important vehicle for reflecting on daily challenges — an unusually formal honor for a genre still very much a living, evolving musical tradition rather than a historical relic."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Reggae',
    wikiTerm: 'reggae music'
  },
  {
    id: 'silbo-gomero-whistled-language',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/El_Silbo.jpg/500px-El_Silbo.jpg', width: 480, height: 673, credit: 'Akalvin', creditUrl: 'https://en.wikipedia.org/wiki/File:El_Silbo.jpg' },
    category: 'Language',
    title: 'A Language Whistled Across Ravines',
    place: 'La Gomera, Canary Islands, Spain',
    countries: ["es"],
    cities: [{ name: "La Gomera", lat: 28.1227, lon: -17.2245 }],
    paragraphs: [
      "On the mountainous island of La Gomera in Spain's Canary Islands, some residents still communicate using Silbo Gomero, a whistled substitute for spoken Spanish that replaces vowels and consonants with distinct whistled tones and can be understood clearly up to several kilometres away across the island's steep ravines — far further than a shouted voice could carry.",
      "Originally developed to communicate across the island's difficult terrain, Silbo Gomero nearly died out as telephones spread in the 20th century, but the local government made it a mandatory subject in island schools in 1999 specifically to keep it alive, and UNESCO recognised it as Intangible Cultural Heritage in 2009. It isn't a separate language exactly — it's a direct whistled encoding of Spanish itself, meaning any fluent Spanish speaker's words could theoretically be whistled, though understanding the whistled version well takes real practice."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Silbo_Gomero',
    wikiTerm: 'Silbo Gomero'
  },
  {
    id: 'kpop-trainee-system',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg/500px-BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg', width: 480, height: 188, credit: 'The White House', creditUrl: 'https://en.wikipedia.org/wiki/File:BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg' },
    category: 'Pop Culture',
    title: 'The Years-Long Pipeline Behind K-pop Idols',
    place: 'South Korea',
    countries: ["kr"],
    paragraphs: [
      "Most K-pop performers don't simply audition and debut — they're recruited as 'trainees,' often in their early teens, by large entertainment companies that then put them through years of intensive, company-funded training in singing, dancing, languages, and media presentation before a debut is even guaranteed, with many trainees dropped from the program without ever performing publicly.",
      "The system, pioneered largely by companies like SM Entertainment starting in the early 1990s, has been credited with K-pop's famously tight choreography and polished group performances, but has also drawn sustained criticism over trainee contract terms, strict weight and appearance monitoring, and the sheer psychological pressure on trainees, some of whom spend the better part of a decade training with no guarantee of ever debuting at all."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Korean_idol',
    wikiTerm: 'trainees'
  },
  {
    id: 'didgeridoo-aboriginal-instrument',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Australiandidgeridoos.jpg/500px-Australiandidgeridoos.jpg', width: 480, height: 354, credit: 'Hmarin', creditUrl: 'https://en.wikipedia.org/wiki/File:Australiandidgeridoos.jpg' },
    category: 'Music',
    title: 'One of the Oldest Wind Instruments Still Played',
    place: 'Arnhem Land, Australia',
    countries: ["au"],
    paragraphs: [
      "The didgeridoo, a long wooden wind instrument traditionally made from eucalyptus trunks naturally hollowed out by termites, originates with Aboriginal peoples of northern Australia's Arnhem Land, with some rock art depictions suggesting it may have been played for well over a thousand years, making it one of the oldest wind instruments still in continuous use anywhere in the world.",
      "Playing it relies on a technique called circular breathing — exhaling through the mouth while simultaneously inhaling through the nose, using the cheeks as a temporary air reservoir — which lets skilled players sustain a single continuous drone note indefinitely, sometimes for many minutes without an audible break. Traditionally, its use was restricted by gender and ceremonial context in many Aboriginal communities, a set of customs that continues to shape how, and by whom, it's respectfully played today."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Didgeridoo',
    wikiTerm: 'didgeridoo'
  },
  {
    id: 'guinness-world-records-origin',
    image: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Guinness_World_Records_logo.svg/500px-Guinness_World_Records_logo.svg.png', width: 480, height: 480, credit: 'Guinness World Records', creditUrl: 'https://en.wikipedia.org/wiki/File:Guinness_World_Records_logo.svg' },
    category: 'Pop Culture',
    title: 'A Record Book Born From a Pub Argument',
    place: 'Dublin, Ireland',
    countries: ["ie"],
    cities: [{ name: "Dublin", lat: 53.3498, lon: -6.2603 }],
    paragraphs: [
      "The Guinness World Records book exists because of an argument in an Irish pub: in 1951, Guinness brewery managing director Sir Hugh Beaver got into a dispute with fellow hunters over which was Europe's fastest game bird, and reportedly couldn't find a reference book anywhere with a clear answer.",
      "Beaver realized a book settling exactly these kinds of pub arguments could be useful publicity for the brewery, and commissioned two researchers to compile the first edition, published in 1955 as the Guinness Book of Records; it became a surprise bestseller almost immediately. It's since been published in dozens of languages and editions, tracking everything from the tallest person ever reliably measured to the largest gathering of people dressed as garden gnomes, and remains one of the best-selling copyrighted book series in history."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Guinness_World_Records',
    wikiTerm: 'Guinness World Records'
  }
];
