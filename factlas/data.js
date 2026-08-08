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
    title: "Where 90% of Earthquakes Happen",
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
  }
];
