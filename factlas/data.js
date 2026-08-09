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
  },
  {
    id: 'kopi-luwak-coffee',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Kopi_luwak_090910-0075_lamb.JPG', width: 500, height: 442, credit: 'Wibowo Djatmiko (Wie146)', creditUrl: 'https://en.wikipedia.org/wiki/File:Kopi_luwak_090910-0075_lamb.JPG' },
    category: 'Food',
    title: 'Coffee Made by Passing Through an Animal',
    place: 'Indonesia',
    countries: ["id"],
    paragraphs: [
      "Kopi luwak, among the most expensive coffees in the world, is made from coffee cherries that have been eaten, partially digested, and excreted by the Asian palm civet, a small nocturnal mammal native to Indonesia. Traditionally, farmers collected the beans from wild civet droppings; producers claim enzymes in the animal's digestive tract break down proteins in the beans in a way that changes, and supposedly smooths, the coffee's flavor.",
      "Demand has since pushed much of the industry toward caged civets force-fed cherries rather than wild collection, which multiple animal welfare investigations have documented as involving cramped, stressful conditions — a shift that's drawn substantial criticism and led some retailers to drop the product entirely. Genuine wild-sourced kopi luwak remains hard to verify at the point of sale, since there's no reliable way to tell caged from wild origin just by tasting the coffee."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Kopi_luwak',
    wikiTerm: 'Kopi luwak'
  },
  {
    id: 'casu-marzu-cheese',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Casu_Marzu_cheese.jpg/500px-Casu_Marzu_cheese.jpg', width: 480, height: 360, credit: 'Shardan', creditUrl: 'https://en.wikipedia.org/wiki/File:Casu_Marzu_cheese.jpg' },
    category: 'Food',
    title: 'A Cheese That Is Technically Illegal, and Alive',
    place: 'Sardinia, Italy',
    countries: ["it"],
    paragraphs: [
      "Casu marzu is a traditional Sardinian sheep's-milk cheese deliberately left exposed to cheese flies, whose larvae burrow through it, breaking down its fats and giving it an extremely soft, almost liquid texture; it's typically eaten with the live larvae still inside, which can leap several centimetres if disturbed.",
      "Because it violates EU food hygiene regulations, its sale has technically been illegal for years, though small-scale trading and home production have continued regardless, treated locally as a folk tradition rather than a food-safety violation. Sardinian producers have periodically pushed for a protected traditional-food exemption, similar to ones granted to other unpasteurized regional foods elsewhere in Europe, so far without full success."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Casu_martzu',
    wikiTerm: 'Casu marzu'
  },
  {
    id: 'piraha-language-brazil',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Amazon17_%285641020319%29.jpg/500px-Amazon17_%285641020319%29.jpg', width: 480, height: 319, credit: 'CIAT', creditUrl: 'https://en.wikipedia.org/wiki/File:Amazon17_%285641020319%29.jpg' },
    category: 'Language',
    title: 'A Language With No Words for Numbers',
    place: 'Amazon, Brazil',
    countries: ["br"],
    paragraphs: [
      "The Pirahã, an Indigenous people living along a tributary of the Amazon in Brazil, speak a language that linguist Daniel Everett, who lived among them for years, controversially argued has no words for exact numbers, no color terms, and no grammatical recursion — the ability to embed phrases inside other phrases indefinitely, which many linguists consider a universal feature of human language.",
      "Everett's claims, especially about recursion, directly challenged influential theories from linguist Noam Chomsky's school of thought, sparking a genuine and still-unresolved academic dispute, since very few outside researchers have been able to independently study the small, relatively isolated Pirahã community to verify the details. Whatever the final linguistic verdict, the Pirahã are broadly agreed to show little cultural interest in counting, historical narrative about the distant past, or numbers as a concept at all."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Pirah%C3%A3_language',
    wikiTerm: 'Pirahã'
  },
  {
    id: 'ubykh-language-extinct',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Northwest_Caucasian_languages_map.png/500px-Northwest_Caucasian_languages_map.png', width: 480, height: 286, credit: 'Gaga.vaa', creditUrl: 'https://en.wikipedia.org/wiki/File:Northwest_Caucasian_languages_map.png' },
    category: 'Language',
    title: 'A Language With 81 Consonants and One Last Speaker',
    place: 'Turkey (Ubykh diaspora)',
    countries: ["tr"],
    paragraphs: [
      "Ubykh, a language once spoken in the northwestern Caucasus, is generally credited with the largest confirmed consonant inventory of any documented language — around 81 distinct consonants, compared to just two vowel sounds — reflecting a broader pattern among Northwest Caucasian languages of extremely consonant-heavy sound systems.",
      "Its speakers were forced from their Caucasus homeland into the Ottoman Empire during the mass expulsions of Circassian peoples in the 1860s, scattering the language across villages in what's now Turkey. The last fully fluent native speaker, Tevfik Esenç, worked closely with linguists to document the language extensively before his death in 1992, after which Ubykh was declared extinct — one of the most thoroughly recorded language deaths in linguistic history, precisely because researchers saw it coming."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Ubykh_language',
    wikiTerm: 'Ubykh'
  },
  {
    id: 'richat-structure-mauritania',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Richat_Structure_ISS030-E-12516.jpg/500px-Richat_Structure_ISS030-E-12516.jpg', width: 480, height: 319, credit: 'NASA', creditUrl: 'https://en.wikipedia.org/wiki/File:Richat_Structure_ISS030-E-12516.jpg' },
    category: 'Geology',
    title: "The 'Eye of the Sahara'",
    place: 'Adrar Plateau, Mauritania',
    countries: ["mr"],
    cities: [{ name: "Richat Structure", lat: 21.1268, lon: -11.399 }],
    paragraphs: [
      "The Richat Structure, a near-perfect set of concentric rings roughly 40km across in the Mauritanian desert, is so vast and geometric that it's become a landmark astronauts use to orient themselves from orbit, earning it the nickname the \"Eye of the Sahara.\" Its striking symmetry initially led some geologists to suspect it was formed by a meteorite impact.",
      "Closer study has instead shown it to be a deeply eroded geological dome — layers of rock that bulged upward without ever erupting, then were sliced through by millions of years of wind and water erosion, exposing the different rock layers as concentric rings once buried underground. It remains one of the most-photographed geological formations on Earth specifically because of how legible its structure looks from directly above."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Richat_Structure',
    wikiTerm: 'Richat Structure'
  },
  {
    id: 'fly-geyser-nevada',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Fly_geyser.jpg/500px-Fly_geyser.jpg', width: 480, height: 362, credit: 'Jeremy C. Munns', creditUrl: 'https://en.wikipedia.org/wiki/File:Fly_geyser.jpg' },
    category: 'Geology',
    title: 'A Geyser That Only Exists Because of a Drilling Mistake',
    place: 'Washoe County, Nevada',
    countries: ["us"],
    cities: [{ name: "Fly Geyser", lat: 40.8622, lon: -119.3313 }],
    paragraphs: [
      "Fly Geyser, a small but strikingly colorful mound in the Nevada desert, isn't a natural geyser at all — it formed after a 1964 geothermal energy test well was drilled and then left improperly capped, allowing hot mineral-rich water to escape continuously and slowly build up layers of travertine rock around the opening.",
      "Thermophilic algae thriving in the constantly wet mineral deposits give the mound its vivid green and red coloring, and it continues to grow taller each year as more dissolved minerals precipitate out of the escaping water. It sits on private land and was inaccessible to the public for decades until a nonprofit land trust began offering limited guided tours."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Fly_Geyser',
    wikiTerm: 'Fly Geyser'
  },
  {
    id: 'christiania-copenhagen',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Freetown_Christiania_-_main_entrance.jpg/500px-Freetown_Christiania_-_main_entrance.jpg', width: 480, height: 360, credit: 'Franklin Heijnen', creditUrl: 'https://en.wikipedia.org/wiki/File:Freetown_Christiania_-_main_entrance.jpg' },
    category: 'Micronations',
    title: 'A Self-Declared Free Town Inside a Capital City',
    place: 'Copenhagen, Denmark',
    countries: ["dk"],
    cities: [{ name: "Freetown Christiania", lat: 55.6736, lon: 12.5992 }],
    paragraphs: [
      "Freetown Christiania is a roughly 34-hectare neighbourhood in Copenhagen that a group of squatters declared a self-governing commune in 1971, taking over a disused military barracks and establishing its own informal rules, collective decision-making assemblies, and for decades an openly tolerated (though never formally legal) open-air cannabis market known as Pusher Street.",
      "Danish authorities have alternated between crackdowns and semi-official tolerance ever since, and residents eventually negotiated a formal legal arrangement in 2011 that let the community collectively purchase parts of the land from the state, folding some of Christiania into ordinary Danish property law while it kept much of its self-governing character. It remains one of Denmark's most visited tourist attractions despite, or partly because of, its unresolved legal status."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Freetown_Christiania',
    wikiTerm: 'Freetown Christiania'
  },
  {
    id: 'molossia-micronation',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Molossia_-_Government_House.jpg/500px-Molossia_-_Government_House.jpg', width: 480, height: 360, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Molossia_-_Government_House.jpg' },
    category: 'Micronations',
    title: "A Backyard Nation \"At War\" With a Country That No Longer Exists",
    place: 'Nevada, USA',
    countries: ["us"],
    paragraphs: [
      "The Republic of Molossia is a self-declared micronation covering about one hectare of a family property in Nevada, run since 1977 by a man who styles himself its president, complete with its own currency, stamps, a tongue-in-cheek space program, and a national bank that mostly just exchanges souvenir Molossian currency for US dollars.",
      "As a running joke rooted in an old bureaucratic technicality, Molossia has long claimed to still be technically at war with East Germany, a country that stopped existing in 1990, on the grounds that no peace treaty was ever signed between the two; the \"conflict\" has never involved anything beyond the joke itself. The project is openly satirical, but it draws real visitors on scheduled open days and has outlasted plenty of other novelty micronations founded around the same era."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Republic_of_Molossia',
    wikiTerm: 'Republic of Molossia'
  },
  {
    id: 'mexico-city-sinking',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg/500px-Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg', width: 480, height: 252, credit: 'Gobierno CDMX', creditUrl: 'https://en.wikipedia.org/wiki/File:Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg' },
    category: 'Urban Extremes',
    title: 'A Capital City Built on a Drained Lake, Still Sinking',
    place: 'Mexico City, Mexico',
    countries: ["mx"],
    paragraphs: [
      "Mexico City was built where the Aztec capital of Tenochtitlan once stood, on an island in the middle of Lake Texcoco; Spanish colonizers drained most of the lake over the following centuries, and the city has been slowly sinking into the soft, water-logged clay left behind ever since, a process accelerated hugely by modern groundwater pumping for the city's roughly 22 million residents.",
      "Some parts of the city are sinking by as much as 30-50cm a year, among the fastest urban subsidence rates recorded anywhere in the world, visibly tilting older buildings, cracking streets, and straining underground pipes not designed to flex that much. Because the ground is sinking unevenly — faster where clay is thicker, slower over old lakebed sediment or bedrock — the uneven settling itself is now a significant engineering and infrastructure problem layered on top of the sinking."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Mexico_City',
    wikiTerm: 'Lake Texcoco'
  },
  {
    id: 'cairo-garbage-city',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/A_Group_of_Boys_at_Moqattam_Village_Dec_2009.JPG/500px-A_Group_of_Boys_at_Moqattam_Village_Dec_2009.JPG', width: 480, height: 360, credit: 'Ayoung ShinAyoung0131', creditUrl: 'https://en.wikipedia.org/wiki/File:A_Group_of_Boys_at_Moqattam_Village_Dec_2009.JPG' },
    category: 'Urban Extremes',
    title: "Cairo's Neighbourhood That Recycles by Hand",
    place: 'Manshiyat Naser, Cairo',
    countries: ["eg"],
    cities: [{ name: "Manshiyat Naser", lat: 30.0298, lon: 31.2925 }],
    paragraphs: [
      "Manshiyat Naser, a densely packed neighbourhood on the edge of Cairo nicknamed \"Garbage City,\" is home to the Zabbaleen, an Egyptian Christian community that has collected and sorted much of Cairo's household waste by hand for generations, without a formal municipal contract for much of that history.",
      "Working largely without industrial machinery, Zabbaleen households and small workshops reportedly recycle somewhere around 80% of the waste they collect, a far higher recovery rate than most fully mechanized municipal recycling systems in wealthier cities achieve. The neighbourhood is also home to the Cave Church, a massive amphitheatre-style church carved into the surrounding limestone cliffs, one of the largest churches in the Middle East, built to serve the community that grew up around the waste-sorting trade."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Zabbaleen',
    wikiTerm: 'Zabbaleen'
  },
  {
    id: 'neutral-moresnet',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_Moresnet.svg/500px-Flag_of_Moresnet.svg.png', width: 480, height: 324, credit: 'ThrashedParanoid', creditUrl: 'https://en.wikipedia.org/wiki/File:Flag_of_Moresnet.svg' },
    category: 'Border Oddities',
    title: 'The Tiny Neutral Zone Born From a Zinc Mine Dispute',
    place: 'Moresnet (now Belgium)',
    countries: ["be"],
    paragraphs: [
      "Neutral Moresnet was a roughly 3.5 square kilometre territory that existed from 1816 to 1920, jointly administered as neutral ground by the Netherlands (later Belgium) and Prussia after the two powers couldn't agree who owned a valuable zinc mine straddling their proposed shared border, and simply declared the whole area neutral rather than resolve the dispute.",
      "The tiny territory developed its own quirky institutions over the following century, including brief 19th-century proposals to make Esperanto its official language and rename it \"Amikejo\" (Esperanto for \"place of friendship\"), and by some accounts issued its own small coinage. It was formally dissolved and absorbed into Belgium after WWI, once the underlying zinc deposit the whole dispute had originally been about was largely exhausted."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Neutral_Moresnet',
    wikiTerm: 'Neutral Moresnet'
  },
  {
    id: 'korean-dmz-wildlife',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/070401_Panmunjeom3.jpg/500px-070401_Panmunjeom3.jpg', width: 480, height: 319, credit: 'Driedprawns at en.wikipedia', creditUrl: 'https://en.wikipedia.org/wiki/File:070401_Panmunjeom3.jpg' },
    category: 'Border Oddities',
    title: 'A War Zone That Became an Accidental Wildlife Refuge',
    place: 'Korean Demilitarized Zone',
    countries: ["kp", "kr"],
    cities: [{ name: "Korean DMZ", lat: 38.0, lon: 127.0 }],
    paragraphs: [
      "The Korean Demilitarized Zone, a roughly 250km-long, 4km-wide buffer strip separating North and South Korea since the 1953 armistice, is one of the most heavily fortified and mined borders on Earth — and, almost entirely by accident, one of the most ecologically intact stretches of land in East Asia, since it's been essentially free of farming, development, or hunting for over 70 years.",
      "Researchers have documented healthy populations of species that have become rare or locally extinct elsewhere on the peninsula, including Asiatic black bears and various endangered crane species that winter in its wetlands. Conservationists have periodically proposed formally protecting the zone as a peace park should the two Koreas ever reunify, worried that development could quickly undo seven decades of unintentional rewilding."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Korean_Demilitarized_Zone',
    wikiTerm: 'Korean Demilitarized Zone'
  },
  {
    id: 'pullman-chicago',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pullman_Chicago_Clock_Tower.jpg/500px-Pullman_Chicago_Clock_Tower.jpg', width: 480, height: 569, credit: 'Boven', creditUrl: 'https://en.wikipedia.org/wiki/File:Pullman_Chicago_Clock_Tower.jpg' },
    category: 'Company Towns',
    title: 'The Company Town That Sparked a National Strike',
    place: 'Chicago, Illinois',
    countries: ["us"],
    cities: [{ name: "Pullman Historic District", lat: 41.6989, lon: -87.6067 }],
    paragraphs: [
      "George Pullman, whose company built luxury railroad sleeping cars, constructed an entire planned town south of Chicago in the 1880s to house his workers, complete with company-owned housing, shops, and a church, all designed to project an image of a clean, orderly model community — and all rented back to workers at prices Pullman set himself.",
      "When Pullman cut wages sharply during the 1893 economic depression without correspondingly cutting the rents and prices workers still owed the company for housing and goods, it triggered the Pullman Strike of 1894, which spread nationally and was ultimately broken by federal troops after significant violence. The backlash from the strike was severe enough that Illinois's state supreme court later forced the Pullman Company to sell off the town's non-industrial property, ruling that a private company running an entire municipality was against public policy."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Pullman,_Chicago',
    wikiTerm: 'Pullman Strike'
  },
  {
    id: 'jamshedpur-india',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Green_City_Jamshedpur.jpg/500px-Green_City_Jamshedpur.jpg', width: 480, height: 241, credit: 'Shahbaz26', creditUrl: 'https://en.wikipedia.org/wiki/File:Green_City_Jamshedpur.jpg' },
    category: 'Company Towns',
    title: "India's First Major Steel Town",
    place: 'Jamshedpur, India',
    countries: ["in"],
    cities: [{ name: "Jamshedpur", lat: 22.8046, lon: 86.2029 }],
    paragraphs: [
      "Jamshedpur, founded in 1908 by industrialist Jamsetji Tata to house workers for India's first large-scale steel plant, was built as a fully planned company town from the outset, with the Tata Group historically funding and running not just housing but much of the city's roads, schools, hospitals, and utilities directly, well beyond what's typical even for other company towns.",
      "Unlike many company towns elsewhere that declined once their founding industry automated or moved on, Jamshedpur's steel plant has remained continuously operational for over a century, and Tata-run civic services have continued alongside a growing local municipal government. It's often cited in urban planning literature as an unusually long-lived example of a corporate-built city that avoided the sharp decline typical of single-industry towns."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Jamshedpur',
    wikiTerm: 'Jamshedpur'
  },
  {
    id: 'mount-kailash-tibet',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kailash_north.JPG/500px-Kailash_north.JPG', width: 480, height: 320, credit: 'Ondřej Žváček', creditUrl: 'https://en.wikipedia.org/wiki/File:Kailash_north.JPG' },
    category: 'Religious Sites',
    title: 'A Mountain Considered Too Sacred to Climb',
    place: 'Tibet, China',
    countries: ["cn"],
    cities: [{ name: "Mount Kailash", lat: 31.0672, lon: 81.3119 }],
    paragraphs: [
      "Mount Kailash, a 6,638-metre peak in a remote part of Tibet, is considered sacred by four separate religions — Hinduism, Buddhism, Jainism, and the Tibetan Bon tradition — each with different beliefs about which deity or cosmic structure the mountain represents, making it one of the very few mountains venerated across multiple, otherwise unrelated religious traditions at once.",
      "Despite being technically climbable and of only moderate technical difficulty by Himalayan standards, no confirmed ascent to its summit has ever been permitted or completed, since climbing it is considered a serious act of sacrilege by all four traditions; even the Chinese government has generally declined to authorize summit expeditions out of respect for that religious significance. Instead, pilgrims from all four faiths walk a roughly 52km circuit around its base, known as the kora, which some undertake as a full prostration covering the entire distance."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Mount_Kailash',
    wikiTerm: 'Mount Kailash'
  },
  {
    id: 'lalibela-rock-churches',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Lalibela%2C_san_giorgio%2C_esterno_24.jpg/500px-Lalibela%2C_san_giorgio%2C_esterno_24.jpg', width: 480, height: 416, credit: 'Sailko', creditUrl: 'https://en.wikipedia.org/wiki/File:Lalibela%2C_san_giorgio%2C_esterno_24.jpg' },
    category: 'Religious Sites',
    title: 'Eleven Churches Carved Downward Into Solid Rock',
    place: 'Lalibela, Ethiopia',
    countries: ["et"],
    cities: [{ name: "Lalibela", lat: 12.0316, lon: 39.0473 }],
    paragraphs: [
      "The eleven medieval churches of Lalibela, Ethiopia, weren't built up from the ground in the usual way — they were carved directly downward out of solid volcanic rock, starting from the surface and excavating around and beneath each structure until a complete freestanding church, roof, windows, interior pillars and all, remained standing in its own pit, connected to the others by a network of tunnels and trenches.",
      "Traditionally dated to the reign of King Gebre Mesqel Lalibela in the 12th-13th century and, according to local tradition, intended as a \"New Jerusalem\" for Ethiopian Christians unable to make the journey to the real one, the complex remains an active pilgrimage site and working place of worship today, not a preserved ruin — priests still hold regular services inside churches that have been in continuous use for roughly 800 years."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Rock-Hewn_Churches,_Lalibela',
    wikiTerm: 'Lalibela'
  },
  {
    id: 'cu-chi-tunnels-vietnam',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/C%E1%BB%A7_Chi_tunnels_entrance.JPG/500px-C%E1%BB%A7_Chi_tunnels_entrance.JPG', width: 480, height: 320, credit: 'Lars Curfs (Grashoofd)', creditUrl: 'https://en.wikipedia.org/wiki/File:C%E1%BB%A7_Chi_tunnels_entrance.JPG' },
    category: 'Underground Wonders',
    title: 'A 250km Tunnel Network Built by Hand',
    place: 'Củ Chi, Vietnam',
    countries: ["vn"],
    cities: [{ name: "Củ Chi tunnels", lat: 11.1425, lon: 106.4525 }],
    paragraphs: [
      "The Củ Chi tunnels, northwest of what's now Ho Chi Minh City, formed part of a vast underground network — ultimately stretching well over 200km — dug largely by hand by Viet Cong forces and local villagers, first against French colonial rule and then during the Vietnam War, allowing fighters to move, hide, and resupply largely undetected beneath areas under heavy American aerial bombardment.",
      "At their most developed, the tunnels included multiple levels housing kitchens with cleverly diffused smoke vents, hospitals, weapons workshops, and living quarters, all connected by passages deliberately built small and low to slow down larger American soldiers pursuing underground. Sections have since been preserved, and in some cases widened, as a war memorial site open to visitors, including a few original narrow crawl passages left unmodified to give visitors a sense of the tunnels' original scale."
    ],
    wiki: 'https://en.wikipedia.org/wiki/C%E1%BB%A7_Chi_tunnels',
    wikiTerm: 'Củ Chi tunnels'
  },
  {
    id: 'derinkuyu-underground-city',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Derinkuyu_Underground_City_9910_Nevit.jpg/500px-Derinkuyu_Underground_City_9910_Nevit.jpg', width: 480, height: 360, credit: 'Nevit Dilmen', creditUrl: 'https://en.wikipedia.org/wiki/File:Derinkuyu_Underground_City_9910_Nevit.jpg' },
    category: 'Underground Wonders',
    title: 'An Underground City for 20,000 People, Found by Accident',
    place: 'Cappadocia, Turkey',
    countries: ["tr"],
    cities: [{ name: "Derinkuyu", lat: 38.3737, lon: 34.735 }],
    paragraphs: [
      "Derinkuyu, in Turkey's Cappadocia region, is an ancient multi-level underground city carved into soft volcanic rock, extending roughly 85 metres deep across at least 18 levels, with ventilation shafts, wells, stables, wine and oil presses, chapels, and enormous circular stone doors that could be rolled shut from the inside to block off passages, only operable from within.",
      "It was rediscovered entirely by accident in 1963, when a local resident knocked down a wall during home renovations and found a hidden passage behind it, leading eventually to the full complex. Historians believe the city, likely expanded gradually over centuries starting perhaps as early as the Phrygian era, served as a refuge where thousands of people could shelter with their livestock for extended periods during invasions and raids, sealed off entirely from the surface."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Derinkuyu_underground_city',
    wikiTerm: 'Derinkuyu'
  },
  {
    id: 'palais-ideal-facteur-cheval',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Ferdinand_Cheval.jpg', width: 318, height: 490, credit: 'Unknown authorUnknown author', creditUrl: 'https://en.wikipedia.org/wiki/File:Ferdinand_Cheval.jpg' },
    category: 'Eccentric Architecture',
    title: 'A Postman Spent 33 Years Building a Palace Alone',
    place: 'Hauterives, France',
    countries: ["fr"],
    cities: [{ name: "Palais Idéal", lat: 45.2589, lon: 5.0286 }],
    paragraphs: [
      "Ferdinand Cheval, a French rural postman, spent 33 years — nights and days off, entirely by himself — building an elaborate fantastical palace out of stones he collected on his daily mail route, after reportedly tripping over an unusually shaped rock in 1879 and becoming fixated on the idea of building something extraordinary from what he could find.",
      "The finished Palais Idéal (\"Ideal Palace\") blends architectural references Cheval had only ever seen in postcards and magazines — Hindu temples, medieval castles, mosques — into one continuous, densely carved structure covered in his own inscriptions about the project's meaning. Initially dismissed by contemporaries as the eccentric obsession of an untrained laborer, it's since been recognised as an important work of naive/outsider art and a protected French historical monument, visited by figures including Pablo Picasso decades after Cheval's death."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Ferdinand_Cheval',
    wikiTerm: 'Palais Idéal'
  },
  {
    id: 'crooked-house-sopot',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Krzywy_Domek_w_Sopocie.jpg/500px-Krzywy_Domek_w_Sopocie.jpg', width: 480, height: 351, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Krzywy_Domek_w_Sopocie.jpg' },
    category: 'Eccentric Architecture',
    title: 'A Shopping Building Designed to Look Melted',
    place: 'Sopot, Poland',
    countries: ["pl"],
    cities: [{ name: "Krzywy Domek", lat: 54.4418, lon: 18.5658 }],
    paragraphs: [
      "The Krzywy Domek (\"Crooked House\"), a shopping and entertainment building in the Polish seaside resort town of Sopot, was deliberately designed in 2004 with every wall, window, and roofline warped and distorted, as if the entire structure were slowly melting or being viewed through a fairground mirror.",
      "Its architects took direct inspiration from the whimsical, fluid illustrations of Polish children's book artists Jan Marcin Szancer and Swedish illustrator Per Dahlberg, aiming to translate storybook-style drawn distortion directly into a real, structurally sound building — no small engineering feat, since every warped wall still had to support real weight. It's become one of the most photographed buildings in Poland, despite housing fairly ordinary shops and restaurants inside."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Krzywy_Domek',
    wikiTerm: 'Krzywy Domek'
  },
  {
    id: 'baghdad-battery',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Ironie_pile_Bagdad.jpg', width: 466, height: 374, credit: 'Ironie', creditUrl: 'https://en.wikipedia.org/wiki/File:Ironie_pile_Bagdad.jpg' },
    category: 'Archaeological Mysteries',
    title: 'Ancient Jars That Might, or Might Not, Be Batteries',
    place: 'Khujut Rabu, Iraq',
    countries: ["iq"],
    paragraphs: [
      "The so-called Baghdad Battery is a set of small clay jars, each containing a copper cylinder and an iron rod, discovered near Baghdad and generally dated to the Parthian or Sassanid era (roughly 250 BCE-650 CE). When German archaeologist Wilhelm König first described them in 1938, he proposed they might have functioned as simple galvanic cells, capable of producing a weak electric current if filled with an acidic liquid like vinegar.",
      "Later experimenters built working replicas that did generate a small voltage, keeping the \"ancient battery\" idea alive in popular culture for decades. Most mainstream archaeologists remain skeptical of the electrical use, however, pointing out there's no evidence of any matching ancient technology the current could have powered, and favoring a far more mundane explanation: that the jars were most likely used to store sacred scrolls, the acidic residue from decayed papyrus simply mimicking a battery's chemistry by coincidence."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Baghdad_Battery',
    wikiTerm: 'Baghdad Battery'
  },
  {
    id: 'longyou-caves-china',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Longyou_Xiaonanhai_Shishi_2016.12.11_16-10-51.jpg/500px-Longyou_Xiaonanhai_Shishi_2016.12.11_16-10-51.jpg', width: 480, height: 320, credit: 'Zhangzhugang', creditUrl: 'https://en.wikipedia.org/wiki/File:Longyou_Xiaonanhai_Shishi_2016.12.11_16-10-51.jpg' },
    category: 'Archaeological Mysteries',
    title: 'Massive Ancient Caverns With No Historical Record',
    place: 'Longyou, China',
    countries: ["cn"],
    cities: [{ name: "Longyou Caves", lat: 29.0281, lon: 119.1064 }],
    paragraphs: [
      "In 1992, villagers in Longyou County pumped water out of what they'd always assumed was a natural, bottomless pond, and discovered instead a network of enormous man-made caverns beneath it, some with ceilings over 30 metres high, their walls and columns covered in precise, uniform chisel marks left by an enormous and clearly well-organized excavation effort.",
      "Radiometric and stylistic dating suggests the caves were carved at least 2,000 years ago, requiring what engineers estimate would have been an extraordinary amount of coordinated labor — yet no historical text, inscription, or local legend from the region makes any clear reference to their construction, purpose, or the workforce involved. Proposed explanations range from ancient stone quarrying to a possible imperial military or ceremonial project, but without any supporting written record, the caves' original purpose remains genuinely unresolved."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Longyou_Caves',
    wikiTerm: 'Longyou County'
  },
  {
    id: 'christmas-island-crabs',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Christmas_Island_%285774532171%29.jpg/500px-Christmas_Island_%285774532171%29.jpg', width: 480, height: 320, credit: 'DIAC images', creditUrl: 'https://en.wikipedia.org/wiki/File:Christmas_Island_%285774532171%29.jpg' },
    category: 'Wildlife Oddities',
    title: 'Tens of Millions of Crabs Migrate at Once',
    place: 'Christmas Island, Australia',
    countries: ["au"],
    paragraphs: [
      "Every year, at the start of the wet season, an estimated 40-50 million red crabs on Australia's Christmas Island leave their forest burrows all at once and march to the coast to breed, a migration so massive that roads across the island are temporarily closed and specially built crab bridges and underpasses divert the crabs safely around traffic.",
      "The migration is precisely timed to the lunar cycle — crabs need to release their eggs into the sea during the receding tide of a specific pre-dawn high tide near a new moon — and the resulting mass hatching briefly turns the surrounding ocean visibly reddish with baby crab larvae. Christmas Island's crab population has also faced a serious modern threat from invasive yellow crazy ants, which can kill adult crabs and have wiped out sections of the population in badly infested areas."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Christmas_Island_red_crab',
    wikiTerm: 'Christmas Island'
  },
  {
    id: 'komodo-dragon-venom',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/202306_Varanus_komodoensis.jpg/500px-202306_Varanus_komodoensis.jpg', width: 480, height: 343, credit: 'James Jolokia (james1203)', creditUrl: 'https://en.wikipedia.org/wiki/File:202306_Varanus_komodoensis.jpg' },
    category: 'Wildlife Oddities',
    title: "The World's Largest Lizard Turned Out to Be Venomous",
    place: 'Komodo, Indonesia',
    countries: ["id"],
    paragraphs: [
      "Komodo dragons, native to a handful of Indonesian islands, are the largest living lizards on Earth, growing up to about 3 metres long, and for decades scientists believed their notoriously dangerous bite worked mainly by delivering dangerous bacteria into a wound, weakening prey over subsequent days of infection.",
      "A 2009 study using MRI scans and tissue analysis instead found the lizards have genuine venom glands producing compounds that prevent blood clotting and cause rapid blood pressure drops, meaning their bite is directly toxic on its own, not just infectious — a finding that significantly revised decades of accepted textbook knowledge about how the animal actually kills. Wild Komodo dragons are found on only five Indonesian islands and remain a vulnerable species, with total wild population estimates generally in the low thousands."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Komodo_dragon',
    wikiTerm: 'Komodo dragon'
  },
  {
    id: 'bhutan-tobacco-ban',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flag_of_Bhutan.svg/500px-Flag_of_Bhutan.svg.png', width: 480, height: 320, credit: 'See File history below for details.', creditUrl: 'https://en.wikipedia.org/wiki/File:Flag_of_Bhutan.svg' },
    category: 'Local Law',
    title: 'A Country That Banned Selling Tobacco Entirely',
    place: 'Bhutan',
    countries: ["bt"],
    paragraphs: [
      "In 2004, Bhutan became the first country in the world to ban the sale of tobacco products nationwide, prohibiting growing, harvesting, producing, and selling tobacco anywhere within its borders — a step considerably further than the smoking bans in public places many other countries have adopted.",
      "The law didn't outlaw personal consumption outright, but for years required anyone bringing tobacco into the country for personal use to pay steep import duties and keep proof of purchase to show they hadn't bought it locally. Enforcement proved difficult in practice, with a persistent black market and cross-border smuggling from India, and Bhutan eventually eased parts of the law during the COVID-19 pandemic, when it briefly banned tobacco sales even more strictly to reduce virus transmission from shared smoking, before gradually loosening restrictions again afterward."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Bhutan',
    wikiTerm: 'ban the sale of tobacco'
  },
  {
    id: 'denmark-baby-names',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/2018_-_Christiansborg_from_the_Marble_Bridge.jpg/500px-2018_-_Christiansborg_from_the_Marble_Bridge.jpg', width: 480, height: 317, credit: 'Moahim', creditUrl: 'https://en.wikipedia.org/wiki/File:2018_-_Christiansborg_from_the_Marble_Bridge.jpg' },
    category: 'Local Law',
    title: 'A Government List of Approved Baby Names',
    place: 'Denmark',
    countries: ["dk"],
    paragraphs: [
      "Denmark maintains an official government list of several thousand pre-approved first names that parents can freely choose from when registering a newborn; picking a name already on the list requires no extra steps, but choosing anything not already approved means submitting it for review by Denmark's Ministry of Ecclesiastical Affairs.",
      "Names can be rejected for various reasons, including if officials judge them likely to burden the child, if they don't clearly indicate a gender, or if they use letters not found in the Danish alphabet; the law traces back to a 19th-century push to standardise naming partly to curb parents inventing surnames from unrelated family names. Several other Nordic countries maintain broadly similar approved-name systems, though Denmark's is often cited as one of the stricter and better-documented versions."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Naming_law',
    wikiTerm: 'Ministry of Ecclesiastical Affairs'
  },
  {
    id: 'eurovision-song-contest',
    image: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Eurovision_Song_Contest_2025.svg/500px-Eurovision_Song_Contest_2025.svg.png', width: 480, height: 160, credit: 'European Broadcasting Union', creditUrl: 'https://en.wikipedia.org/wiki/File:Eurovision_Song_Contest_2025.svg' },
    category: 'Pop Culture',
    title: 'A Song Contest Bigger Than the World Cup',
    place: 'Stockholm, Sweden',
    countries: ["se"],
    paragraphs: [
      "The Eurovision Song Contest, first held in 1956 to help unify a war-divided Europe through a shared television broadcast, has grown into one of the most-watched non-sporting events on Earth, regularly drawing an estimated global audience of over 150 million people across dozens of participating countries, several of which aren't geographically part of Europe at all (Australia has competed since 2015).",
      "Sweden, which launched ABBA to global fame after their 1974 Eurovision win with \"Waterloo,\" has hosted the contest more times than almost any other country and is often cited as running one of its most polished national selection processes, Melodifestivalen, which itself draws huge domestic television audiences of its own. Beyond the music, Eurovision has a long-running reputation as a showcase for elaborate staging and deliberately over-the-top performances, alongside a devoted global fan culture that treats the annual voting results as genuinely high-stakes."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Eurovision_Song_Contest',
    wikiTerm: 'Eurovision Song Contest'
  },
  {
    id: 'bollywood-mumbai',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Mumbai_Bandra-Worli_Sea_Link.jpg/500px-Mumbai_Bandra-Worli_Sea_Link.jpg', width: 480, height: 360, credit: 'Rutiknatekar', creditUrl: 'https://en.wikipedia.org/wiki/File:Mumbai_Bandra-Worli_Sea_Link.jpg' },
    category: 'Pop Culture',
    title: 'An Industry That Outproduces Hollywood',
    place: 'Mumbai, India',
    countries: ["in"],
    paragraphs: [
      "Hindi-language cinema, centred in Mumbai and commonly nicknamed Bollywood, produces more feature films per year than the United States film industry, and Indian cinema as a whole (including its many other regional-language industries) sells more movie tickets annually than any other country on Earth.",
      "Bollywood films have historically leaned on a distinctive formula blending drama, elaborate musical numbers, and dance sequences within a single film, a style that grew partly out of India's deep tradition of folk theatre and classical dance rather than being modeled on Western musicals. The industry has increasingly found large audiences well beyond India itself, particularly across the Middle East, Africa, and among the global Indian diaspora, making it one of the most-watched film traditions in the world despite receiving comparatively little mainstream attention in North America and Europe."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Hindi_cinema',
    wikiTerm: 'Bollywood'
  },
  {
    id: 'tardigrades-water-bears',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2_%28white_background%29.png/500px-SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2_%28white_background%29.png', width: 480, height: 419, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2_%28white_background%29.png' },
    category: 'Biology',
    title: 'The Animal That Can Survive the Vacuum of Space',
    place: 'First described in Germany',
    countries: ["de"],
    paragraphs: [
      "Tardigrades, microscopic eight-legged animals often called \"water bears,\" were first described by German pastor and naturalist Johann August Ephraim Goeze in 1773. Under stress, they can enter a dried-out dormant state called cryptobiosis, shrinking into a nearly lifeless ball and shutting down their metabolism almost entirely for years at a time, then reviving within hours once rehydrated.",
      "In that dormant state, tardigrades have survived conditions that would instantly kill nearly every other known animal, including temperatures near absolute zero, extreme pressure, high doses of radiation, and, in a 2007 European Space Agency experiment, the unprotected vacuum and radiation of open space for over a week, with a portion of the exposed specimens successfully reviving back on Earth. Despite the space-survival headlines, tardigrades live ordinary lives in damp moss, lichen, and sediment nearly everywhere on the planet, and spend almost none of their actual lifespan in that extreme dormant state."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Tardigrade',
    wikiTerm: 'tardigrades'
  },
  {
    id: 'immortal-jellyfish',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Turritopsis_dohrnii.jpg', width: 300, height: 192, credit: 'Bachware', creditUrl: 'https://en.wikipedia.org/wiki/File:Turritopsis_dohrnii.jpg' },
    category: 'Biology',
    title: 'A Jellyfish That Can Reverse Its Own Aging',
    place: 'Mediterranean Sea, Italy',
    countries: ["it"],
    paragraphs: [
      "Turritopsis dohrnii, a tiny jellyfish first studied in detail in the Mediterranean near Italy, has a genuinely unusual ability among animals: when injured, starving, or otherwise stressed, an adult can revert its cells back into an earlier juvenile polyp stage, effectively restarting its life cycle from a kind of biological beginning rather than dying.",
      "This process, called transdifferentiation, lets individual cells change into entirely different cell types, something extremely rare outside of a few specific tissue-repair contexts in most other animals. In theory, a Turritopsis dohrnii that keeps successfully reverting could do so indefinitely, which is why it's often nicknamed the \"immortal jellyfish\" — though in practice, most individuals in the wild are eaten by predators or die from disease long before that theoretical immortality would ever really matter."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Turritopsis_dohrnii',
    wikiTerm: 'immortal jellyfish'
  },
  {
    id: 'ryugyong-hotel-north-korea',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Pr%C3%A1zdn%C3%A9_slnice_a_rozestav%C4%9Bn%C3%BD_hotel_Ryugyong_-_panoramio.jpg/500px-Pr%C3%A1zdn%C3%A9_slnice_a_rozestav%C4%9Bn%C3%BD_hotel_Ryugyong_-_panoramio.jpg', width: 480, height: 640, credit: 'Martin Cígler', creditUrl: 'https://en.wikipedia.org/wiki/File:Pr%C3%A1zdn%C3%A9_slnice_a_rozestav%C4%9Bn%C3%BD_hotel_Ryugyong_-_panoramio.jpg' },
    category: 'Architecture',
    title: "The World's Tallest Unopened Building",
    place: 'Pyongyang, North Korea',
    countries: ["kp"],
    cities: [{ name: "Ryugyong Hotel", lat: 39.03, lon: 125.7325 }],
    paragraphs: [
      "The Ryugyong Hotel, a 105-storey pyramid-shaped skyscraper in Pyongyang, began construction in 1987 with plans to be one of the tallest hotels in the world, but funding collapsed after the Soviet Union — North Korea's main economic backer — dissolved in 1991, leaving the concrete shell standing empty and unfinished for the next 16 years, earning it nicknames like the \"Hotel of Doom\" in international media.",
      "Construction resumed in 2008 with Egyptian investment, and by 2011 the exterior had finally been completed with reflective glass panelling and, later, an elaborate LED light display, but the interior has still never been finished to the point of accepting guests. It remains, decades after breaking ground, one of the most prominent examples anywhere of a genuinely enormous building that has never opened for its intended purpose."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Ryugyong_Hotel',
    wikiTerm: 'Ryugyong Hotel'
  },
  {
    id: 'habitat-67-montreal',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Habitat_67_2019_dllu_01.jpg/500px-Habitat_67_2019_dllu_01.jpg', width: 480, height: 394, credit: 'Dllu', creditUrl: 'https://en.wikipedia.org/wiki/File:Habitat_67_2019_dllu_01.jpg' },
    category: 'Architecture',
    title: 'An Apartment Building Made From Stacked Concrete Boxes',
    place: 'Montreal, Canada',
    countries: ["ca"],
    cities: [{ name: "Habitat 67", lat: 45.5041, lon: -73.5423 }],
    paragraphs: [
      "Habitat 67, built for Montreal's Expo 67 world's fair, stacks 354 identical prefabricated concrete boxes into 146 irregularly arranged apartments, each unit given its own private garden terrace formed by the roof of the box below it — an attempt by its architect, Moshe Safdie, then only in his twenties and working from his master's thesis, to bring suburban-style privacy and outdoor space to affordable high-density urban housing.",
      "The building was hugely influential architecturally and became an instantly recognizable symbol of Montreal, but its modular construction method never achieved the mass-produced affordability Safdie originally envisioned, and Habitat 67 apartments are now among the most expensive real estate in the city rather than the affordable housing model it was designed to prove out. It remains fully inhabited today, over 55 years after it was built essentially as a temporary fair exhibit."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Habitat_67',
    wikiTerm: 'Habitat 67'
  },
  {
    id: 'stockholm-syndrome-origin',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Former_Kreditbanken_Norrmalmstorg_Stockholm_Sweden.jpg/500px-Former_Kreditbanken_Norrmalmstorg_Stockholm_Sweden.jpg', width: 480, height: 357, credit: 'Tage Olsin', creditUrl: 'https://en.wikipedia.org/wiki/File:Former_Kreditbanken_Norrmalmstorg_Stockholm_Sweden.jpg' },
    category: 'Psychology',
    title: 'The Bank Robbery That Named a Psychological Phenomenon',
    place: 'Stockholm, Sweden',
    countries: ["se"],
    paragraphs: [
      "In August 1973, a failed bank robbery in Stockholm turned into a six-day hostage standoff, during which the four hostages reportedly grew sympathetic toward, and even protective of, their captors — resisting rescue efforts, defending the robbers publicly afterward, and in one case staying in contact with a captor for years. Criminologist Nils Bejerot, consulting for police during the standoff, coined the term \"Stockholm syndrome\" to describe the pattern.",
      "The term spread quickly into popular use, later applied retroactively to other high-profile cases like the kidnapping of Patty Hearst, but it's never been formally recognised as a diagnosable psychiatric condition in medical classification systems, and some psychologists have since questioned how common or predictable the bonding response actually is across hostage situations generally, given how much the original account relies on a single, fairly unusual case."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Stockholm_syndrome',
    wikiTerm: 'Stockholm syndrome'
  },
  {
    id: 'dunning-kruger-effect',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Dunning%E2%80%93Kruger_Effect2.svg/500px-Dunning%E2%80%93Kruger_Effect2.svg.png', width: 480, height: 399, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Dunning%E2%80%93Kruger_Effect2.svg' },
    category: 'Psychology',
    title: 'Why the Least Skilled Can Feel the Most Confident',
    place: 'Cornell University, USA',
    countries: ["us"],
    paragraphs: [
      "In a 1999 study at Cornell University, psychologists David Dunning and Justin Kruger found that people who scored lowest on tests of grammar, logic, and humor also tended to most overestimate their own performance and ability relative to others — not because they were arrogant, the researchers argued, but because the same lack of skill that caused poor performance also made it harder for them to recognise good performance, in themselves or anyone else.",
      "The finding, now widely known as the Dunning-Kruger effect, has become one of the most frequently cited (and frequently oversimplified) concepts in popular psychology, often misrepresented as claiming stupid people are always more confident than experts in general. The original research was narrower: it described a specific gap between self-assessment and actual performance on particular skill-based tasks, and subsequent research has debated how much of the statistical pattern is explained by simple mathematical artifacts of the test design rather than a genuine psychological bias."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect',
    wikiTerm: 'Dunning-Kruger effect'
  },
  {
    id: 'bretton-woods-system',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Price_of_gold.webp/500px-Price_of_gold.webp.png', width: 480, height: 245, credit: 'Wikideas1', creditUrl: 'https://en.wikipedia.org/wiki/File:Price_of_gold.webp' },
    category: 'Economics',
    title: 'The Meeting That Set the Rules for Global Money',
    place: 'Bretton Woods, New Hampshire, USA',
    countries: ["us"],
    paragraphs: [
      "In July 1944, representatives from 44 Allied nations met at a resort in Bretton Woods, New Hampshire, to design a new international monetary system for the post-WWII world, ultimately agreeing to peg major currencies to the US dollar, which was itself pegged to gold at a fixed rate of $35 an ounce, with the newly created International Monetary Fund and World Bank overseeing the arrangement.",
      "The system gave the world unusual monetary stability for roughly 25 years, but it depended entirely on the US holding enough gold to honestly back every dollar in circulation abroad, a promise that became harder to keep as US spending (including on the Vietnam War) grew. In August 1971, President Nixon unilaterally suspended the dollar's convertibility into gold, an event later nicknamed the \"Nixon Shock,\" effectively ending the Bretton Woods system and ushering in the floating, gold-free currency exchange system most of the world still uses today."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Bretton_Woods_system',
    wikiTerm: 'Bretton Woods'
  },
  {
    id: 'argentina-debt-defaults',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Prat_gay_en_Washington.jpg/500px-Prat_gay_en_Washington.jpg', width: 480, height: 299, credit: 'Presidencia de la Nación', creditUrl: 'https://en.wikipedia.org/wiki/File:Prat_gay_en_Washington.jpg' },
    category: 'Economics',
    title: 'A Country That Has Defaulted on Debt Nine Times',
    place: 'Argentina',
    countries: ["ar"],
    paragraphs: [
      "Argentina has defaulted on its sovereign debt at least nine separate times since gaining independence in the 19th century, more than almost any other country, including a 2001 default on roughly $100 billion that was, at the time, the largest sovereign default in history, triggered by a currency crisis after Argentina's peso-to-dollar peg collapsed.",
      "A subsequent decades-long legal battle with a group of investors who'd bought Argentina's defaulted bonds at steep discounts, nicknamed \"vulture funds\" by Argentine officials, dragged through US courts and blocked Argentina from fully accessing international debt markets again until a settlement was finally reached in 2016. Argentina defaulted again in 2020, underscoring just how recurring the pattern has been across the country's economic history rather than being isolated to any single crisis."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Argentine_debt_restructuring',
    wikiTerm: 'vulture funds'
  },
  {
    id: 'denisova-cave-siberia',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/%D0%98%D0%B7%D0%B2%D0%B5%D1%81%D1%82%D0%BD%D0%B0%D1%8F_%D0%BD%D0%B0_%D0%B2%D0%B5%D1%81%D1%8C_%D0%9C%D0%B8%D1%80_%D0%94%D0%B5%D0%BD%D0%B8%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B5%D1%89%D0%B5%D1%80%D0%B0._01.jpg/500px-%D0%98%D0%B7%D0%B2%D0%B5%D1%81%D1%82%D0%BD%D0%B0%D1%8F_%D0%BD%D0%B0_%D0%B2%D0%B5%D1%81%D1%8C_%D0%9C%D0%B8%D1%80_%D0%94%D0%B5%D0%BD%D0%B8%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B5%D1%89%D0%B5%D1%80%D0%B0._01.jpg', width: 480, height: 360, credit: 'Демин Алексей Барнаул', creditUrl: 'https://en.wikipedia.org/wiki/File:%D0%98%D0%B7%D0%B2%D0%B5%D1%81%D1%82%D0%BD%D0%B0%D1%8F_%D0%BD%D0%B0_%D0%B2%D0%B5%D1%81%D1%8C_%D0%9C%D0%B8%D1%80_%D0%94%D0%B5%D0%BD%D0%B8%D1%81%D0%BE%D0%B2%D0%B0_%D0%BF%D0%B5%D1%89%D0%B5%D1%80%D0%B0._01.jpg' },
    category: 'Anthropology',
    title: 'A New Kind of Ancient Human, Identified From One Finger Bone',
    place: 'Altai Mountains, Russia',
    countries: ["ru"],
    cities: [{ name: "Denisova Cave", lat: 51.3975, lon: 84.6764 }],
    paragraphs: [
      "In 2010, geneticists analysing a small finger bone fragment and a tooth found in Denisova Cave in Siberia's Altai Mountains discovered DNA that didn't match either modern humans or known Neanderthals, revealing an entirely distinct group of ancient humans, now called Denisovans, previously completely unknown to science and identified purely from genetic evidence rather than a substantial fossil skeleton.",
      "Later research found that Denisovan DNA persists today in modern populations across parts of Asia and Oceania — Melanesians and some Indigenous Australians carry a notably higher proportion than almost anyone else, in some cases several percent of their genome, evidence of interbreeding between Denisovans and modern humans tens of thousands of years ago. Remarkably, the cave has also yielded direct physical evidence of a first-generation Neanderthal-Denisovan hybrid individual, confirming the two distinct ancient human groups interbred with each other as well, not just with modern humans."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Denisova_Cave',
    wikiTerm: 'Denisovans'
  },
  {
    id: 'trepanation-ancient-peru',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Hieronymus_Bosch_053_detail.jpg/500px-Hieronymus_Bosch_053_detail.jpg', width: 480, height: 455, credit: 'Hieronymus Bosch', creditUrl: 'https://en.wikipedia.org/wiki/File:Hieronymus_Bosch_053_detail.jpg' },
    category: 'Anthropology',
    title: 'Ancient Skull Surgery With a Surprisingly High Survival Rate',
    place: 'Ancient Peru',
    countries: ["pe"],
    paragraphs: [
      "Trepanation, the practice of drilling or scraping a hole into the skull, was performed independently by cultures across the ancient world, but nowhere more extensively than in pre-Columbian Peru, where archaeologists have recovered thousands of trepanned skulls, some populations showing rates of the procedure far higher than almost anywhere else studied.",
      "Bone regrowth around many of the holes shows clear evidence of healing, meaning a substantial share of patients survived the operation, sometimes by a considerable margin — one study of Peruvian skulls found survival rates improving over centuries, plausibly climbing well above 80% in some later periods, rivalling or exceeding survival rates for cranial surgery in 19th-century Europe performed without any understanding of germ theory. Reasons for the surgery likely varied, from treating head injuries and skull fractures to, in some cases, apparent ritual or spiritual purposes."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Trepanning',
    wikiTerm: 'Trepanation'
  },
  {
    id: 'arecibo-observatory-collapse',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Arecibo_radio_telescope_SJU_06_2019_6144.jpg/500px-Arecibo_radio_telescope_SJU_06_2019_6144.jpg', width: 480, height: 720, credit: 'Mariordo (Mario Roberto Durán Ortiz)', creditUrl: 'https://en.wikipedia.org/wiki/File:Arecibo_radio_telescope_SJU_06_2019_6144.jpg' },
    category: 'Astronomy',
    title: 'A Legendary Telescope That Collapsed Without Warning',
    place: 'Arecibo, Puerto Rico',
    countries: ["us"],
    cities: [{ name: "Arecibo Observatory", lat: 18.3441, lon: -66.7528 }],
    paragraphs: [
      "The Arecibo Observatory in Puerto Rico, its 305-metre dish built into a natural sinkhole in 1963, was for over 50 years the largest single-aperture radio telescope on Earth, used to send the famous 1974 Arecibo message toward a distant star cluster, discover the first known exoplanets, and track potentially hazardous near-Earth asteroids, while also appearing as a filming location in movies including GoldenEye and Contact.",
      "Years of funding cuts had already left some of its support cables in poor condition when one snapped in August 2020, followed by a second in November; engineers determined the remaining structure was too unstable to safely repair, and before planned controlled demolition could even begin, the 900-tonne receiver platform crashed down into the dish on its own in December 2020. Puerto Rico's scientific community has since pushed for a replacement facility, though nothing built so far has matched Arecibo's original scale."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Arecibo_Observatory',
    wikiTerm: 'Arecibo Observatory'
  },
  {
    id: 'nebra-sky-disc-germany',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Nebra_disc_1.jpg/500px-Nebra_disc_1.jpg', width: 480, height: 389, credit: 'Frank Vincentz', creditUrl: 'https://en.wikipedia.org/wiki/File:Nebra_disc_1.jpg' },
    category: 'Astronomy',
    title: 'One of the Oldest Known Maps of the Sky',
    place: 'Saxony-Anhalt, Germany',
    countries: ["de"],
    paragraphs: [
      "The Nebra sky disc, a bronze disc about 30cm across inlaid with gold symbols representing the sun, a crescent moon, and stars including a cluster generally identified as the Pleiades, was buried around 1600 BCE near what's now Nebra, Germany, and unearthed by looters with metal detectors in 1999 before eventually being recovered by authorities and authenticated.",
      "It's widely considered one of the oldest surviving concrete depictions of astronomical phenomena anywhere in the world, and researchers have proposed that later-added gold arcs along its edges may have functioned as a practical tool for reconciling the lunar and solar calendars, marking the range of sunset positions across the year. UNESCO added it to the Memory of the World Register in 2013, and it's often described as one of the most important individual archaeological finds of the 20th century."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Nebra_sky_disc',
    wikiTerm: 'Nebra sky disc'
  },
  {
    id: 'first-computer-bug-moth',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Codebeispiel_-_Syntax_error.png/500px-Codebeispiel_-_Syntax_error.png', width: 480, height: 381, credit: 'Rherschke', creditUrl: 'https://en.wikipedia.org/wiki/File:Codebeispiel_-_Syntax_error.png' },
    category: 'Technology',
    title: "Why We Call Software Problems \"Bugs\"",
    place: 'Harvard University, USA',
    countries: ["us"],
    paragraphs: [
      "In September 1947, operators working on the Harvard Mark II computer found a moth trapped in one of its electromechanical relays, causing a malfunction; they taped the actual moth into the machine's logbook with the note \"first actual case of bug being found,\" a physical artifact that still survives in a US naval museum collection today.",
      "The word \"bug\" for a technical fault already existed in engineering slang before this incident, reportedly used by Thomas Edison decades earlier, so the moth didn't coin the term — but the Harvard logbook entry is the most famous and literal illustration of it, and popularized the specific phrase \"debugging\" for the process of finding and removing the problem. Computing pioneer Grace Hopper, who worked on the Mark II team, is often credited with popularizing the anecdote in later years, even though she wasn't the one who wrote the original logbook entry."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Software_bug',
    wikiTerm: 'debugging'
  },
  {
    id: 'estonia-digital-government',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Wifi_accesspoint_in_tartu_estonia.jpg/500px-Wifi_accesspoint_in_tartu_estonia.jpg', width: 480, height: 360, credit: 'A. Fiedler', creditUrl: 'https://en.wikipedia.org/wiki/File:Wifi_accesspoint_in_tartu_estonia.jpg' },
    category: 'Technology',
    title: 'A Country Where Almost Everything Government Is Online',
    place: 'Estonia',
    countries: ["ee"],
    paragraphs: [
      "Estonia runs one of the most digitized governments in the world — an estimated 99% of public services are available online, citizens can vote in national elections over the internet, and the country built a legal digital identity system so thorough that a marriage, divorce, or property sale are among the very few remaining transactions Estonians are still required to handle in person.",
      "The push began in earnest after a devastating 2007 wave of cyberattacks against Estonian institutions, which pushed the country to invest heavily in resilient digital infrastructure rather than retreat from it. It also introduced \"e-Residency\" in 2014, letting non-citizens anywhere in the world register and remotely manage an Estonian company entirely online, a program that has since attracted tens of thousands of digital entrepreneurs with no physical connection to the country at all."
    ],
    wiki: 'https://en.wikipedia.org/wiki/E-Estonia',
    wikiTerm: 'e-Residency'
  },
  {
    id: 'finger-wrestling-bavaria',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Georg_Schildknecht_Fingerhakeln.jpg/500px-Georg_Schildknecht_Fingerhakeln.jpg', width: 480, height: 318, credit: 'Georg Schildknecht', creditUrl: 'https://en.wikipedia.org/wiki/File:Georg_Schildknecht_Fingerhakeln.jpg' },
    category: 'Sports',
    title: 'A Sport Judged by Yanking a Finger',
    place: 'Bavaria, Germany',
    countries: ["de"],
    paragraphs: [
      "Fingerhakeln, a traditional Bavarian sport with roots reportedly going back centuries as a way to settle disputes without a full brawl, pits two competitors against each other with a leather strap looped around their middle fingers; each pulls as hard as possible, trying to drag their opponent across a table, and matches are frequently over in just a few seconds.",
      "Regional championships still draw serious, dedicated competitors across Bavaria and neighbouring Austrian and South Tyrolean regions today, with competitors training their finger and forearm strength specifically for the sport, sometimes for years. Injuries, including dislocated fingers, are common enough that a doctor is typically present at organized competitions, and a match can be halted immediately if the strap or finger appears at real risk of serious injury."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Finger_pulling',
    wikiTerm: 'Fingerhakeln'
  },
  {
    id: 'sepak-takraw-southeast-asia',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Incheon_AsianGames_Sepaktakraw_09_%2815291705581%29.jpg/500px-Incheon_AsianGames_Sepaktakraw_09_%2815291705581%29.jpg', width: 480, height: 360, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Incheon_AsianGames_Sepaktakraw_09_%2815291705581%29.jpg' },
    category: 'Sports',
    title: 'Volleyball Played Entirely Without Hands',
    place: 'Thailand',
    countries: ["th"],
    paragraphs: [
      "Sepak takraw, popular across Thailand and much of Southeast Asia, plays out like volleyball with the net height and court roughly comparable, but with a crucial difference: players are prohibited from using their hands or arms at all, striking a lightweight woven rattan (or now often synthetic) ball using only their feet, knees, chest, and head.",
      "At competitive levels, this restriction produces spectacularly acrobatic play, with players regularly executing full mid-air bicycle-kick-style spikes to send the ball across the net with real force, all while staying within a relatively small court. The sport's exact origins are debated among Thailand, Malaysia, and other Southeast Asian nations that each have their own longstanding regional versions, but a standardized set of rules was formalized in the 1940s to allow international competition."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Sepak_takraw',
    wikiTerm: 'Sepak takraw'
  },
  {
    id: 'bosnia-rotating-presidency',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Sarajevo_City_Panorama.JPG/500px-Sarajevo_City_Panorama.JPG', width: 480, height: 287, credit: 'Julian Nyča', creditUrl: 'https://en.wikipedia.org/wiki/File:Sarajevo_City_Panorama.JPG' },
    category: 'Political Oddities',
    title: 'A Country Run by Three Presidents at Once',
    place: 'Bosnia and Herzegovina',
    countries: ["ba"],
    paragraphs: [
      "Bosnia and Herzegovina, formed after the brutal 1992-1995 war that followed Yugoslavia's breakup, is governed by a tripartite presidency: three separate presidents, one each representing the country's Bosniak, Croat, and Serb populations, elected simultaneously and sharing power as a joint head of state, with the chairmanship rotating between the three every eight months.",
      "The unusual system was written directly into the 1995 Dayton Peace Agreement that ended the war, designed specifically to guarantee each of the three main ethnic groups a permanent, undeniable share of power at the highest level of government, at the cost of an extremely complex and often gridlocked decision-making process, since major decisions can require consensus across all three. The European Court of Human Rights has separately ruled parts of the system discriminatory against citizens who don't identify with any of the three constituent groups, since they're constitutionally barred from the presidency entirely, a tension the country has still not fully resolved."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Presidency_of_Bosnia_and_Herzegovina',
    wikiTerm: 'tripartite presidency'
  },
  {
    id: 'liberland-unclaimed-land',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Location_of_Liberland_within_Europe.svg/500px-Location_of_Liberland_within_Europe.svg.png', width: 480, height: 367, credit: 'Elevatorrailfan', creditUrl: 'https://en.wikipedia.org/wiki/File:Location_of_Liberland_within_Europe.svg' },
    category: 'Political Oddities',
    title: 'A Self-Declared Country on Land Nobody Wanted',
    place: 'Danube riverbank, Croatia-Serbia border',
    countries: ["rs"],
    cities: [{ name: "Liberland", lat: 45.7683, lon: 18.8756 }],
    paragraphs: [
      "Liberland is a roughly 7 square kilometre patch of forested land along the Danube River that, due to an old and unresolved border dispute between Croatia and Serbia, ended up unclaimed by either country — similar in principle to Africa's Bir Tawil, but in the middle of Europe. In 2015, a Czech politician declared it an independent libertarian micronation, styling himself its president.",
      "Unlike most novelty micronations, Liberland has attracted a genuinely large number of registered \"citizens\" online (claiming hundreds of thousands of applicants, though far fewer verified residents) and has periodically attempted physical settlement, generally blocked by Croatian police patrolling the area, who treat unauthorized entry as trespassing regardless of the land's disputed status. No United Nations member state recognises Liberland's claimed sovereignty."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Liberland',
    wikiTerm: 'Liberland'
  },
  {
    id: 'berlin-wall-fall',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg/500px-West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg', width: 480, height: 362, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg' },
    category: 'Political History',
    title: 'The Wall That Fell Because of a Miscommunication',
    place: 'Berlin, Germany',
    countries: ["de"],
    paragraphs: [
      "The Berlin Wall, which had divided East and West Berlin since 1961, came down on the night of 9 November 1989 largely because of a bureaucratic mix-up: an East German government spokesman, announcing new, still-restricted travel rules at a press conference, was asked when they'd take effect and, not having been properly briefed, answered \"immediately, without delay.\"",
      "As the confused announcement spread on live television, thousands of East Berliners gathered at checkpoints demanding to cross that same night; overwhelmed and without clear orders to use force, border guards eventually simply opened the gates rather than risk a violent confrontation. What was intended as a modestly loosened travel policy turned, almost by accident, into the wall's effective overnight collapse, setting in motion German reunification less than a year later."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall',
    wikiTerm: 'Berlin Wall'
  },
  {
    id: 'haitian-revolution',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Incendie_de_la_Plaine_du_Cap._Massacre_des_Blancs_par_les_esclaves_noirs_r%C3%A9volt%C3%A9s._France_militaire._Martinet_et_Masson.jpg/500px-Incendie_de_la_Plaine_du_Cap._Massacre_des_Blancs_par_les_esclaves_noirs_r%C3%A9volt%C3%A9s._France_militaire._Martinet_et_Masson.jpg', width: 480, height: 325, credit: 'Aaron Martinet / Alphonse-Charles Masson', creditUrl: 'https://en.wikipedia.org/wiki/File:Incendie_de_la_Plaine_du_Cap._Massacre_des_Blancs_par_les_esclaves_noirs_r%C3%A9volt%C3%A9s._France_militaire._Martinet_et_Masson.jpg' },
    category: 'Political History',
    title: 'The Only Successful Slave Revolution to Found a Nation',
    place: 'Haiti',
    countries: ["ht"],
    paragraphs: [
      "The Haitian Revolution, fought from 1791 to 1804 by enslaved and formerly enslaved people against French colonial rule on the island of Saint-Domingue, remains the only slave uprising in history to succeed in both abolishing slavery and establishing an independent, self-governed nation, Haiti, in its place — a result no other slave revolt in the Americas ever achieved.",
      "Led at various stages by figures including Toussaint Louverture and Jean-Jacques Dessalines, Haitian forces defeated not just French troops but, at different points, Spanish and British forces as well, in what became one of the bloodiest conflicts of the era. France refused to recognise Haiti's independence for decades, and in 1825 forced Haiti to agree to pay a massive indemnity to former French slaveholders as compensation for their \"lost property,\" a debt Haiti spent well over a century paying off, widely cited by historians as a major, lasting drag on the young nation's economic development."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Haitian_Revolution',
    wikiTerm: 'Haitian Revolution'
  },
  {
    id: 'war-of-the-worlds-broadcast-panic',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Orson_Welles_War_of_the_Worlds_1938.jpg/500px-Orson_Welles_War_of_the_Worlds_1938.jpg', width: 480, height: 365, credit: 'Acme News Photos', creditUrl: 'https://en.wikipedia.org/wiki/File:Orson_Welles_War_of_the_Worlds_1938.jpg' },
    category: 'Mass Hysteria',
    title: 'A Radio Drama Mistaken for a Real Alien Invasion',
    place: 'New York, USA',
    countries: ["us"],
    paragraphs: [
      "On Halloween eve 1938, Orson Welles and the Mercury Theatre broadcast a radio adaptation of H.G. Wells's The War of the Worlds formatted to sound like a series of live news bulletins interrupting regular programming, describing a Martian invasion unfolding in real time across New Jersey and New York.",
      "Newspapers the following day reported widespread panic, with dramatic stories of listeners fleeing their homes or flooding switchboards in terror — accounts that later research has suggested were considerably exaggerated by print media eager to discredit radio as an irresponsible, sensationalist rival medium. Real confusion and alarm among some listeners who missed the opening disclaimer does appear to have genuinely occurred, just on a smaller and more localized scale than the legendary nationwide panic the story is usually remembered for today."
    ],
    wiki: 'https://en.wikipedia.org/wiki/The_War_of_the_Worlds_(1938_radio_drama)',
    wikiTerm: 'Mercury Theatre'
  },
  {
    id: 'tanganyika-laughter-epidemic',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mater_Misericordiae_Church_-_Bukoba.JPG/500px-Mater_Misericordiae_Church_-_Bukoba.JPG', width: 480, height: 360, credit: 'Macabe5387', creditUrl: 'https://en.wikipedia.org/wiki/File:Mater_Misericordiae_Church_-_Bukoba.JPG' },
    category: 'Mass Hysteria',
    title: 'A Laughing Epidemic That Shut Down Schools',
    place: 'Tanganyika (now Tanzania)',
    countries: ["tz"],
    paragraphs: [
      "In January 1962, uncontrollable laughing broke out among a group of schoolgirls at a mission-run boarding school in what was then Tanganyika, spreading among students over the following weeks until the school was forced to close; some students reportedly laughed for periods ranging from a few hours to, in extreme cases, weeks at a stretch, sometimes alongside crying, fainting, or rashes.",
      "As affected students returned home, the episode spread to other schools and nearby villages over the following months, ultimately affecting well over a thousand people and forcing several more school closures before subsiding roughly a year later. It's now generally classified by researchers as a documented case of mass psychogenic illness, likely triggered by the genuine stress and social tension of boarding school life under strict colonial-era discipline, then amplified through close social contact rather than any infectious biological cause."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Tanganyika_laughter_epidemic',
    wikiTerm: 'mass psychogenic illness'
  },
  {
    id: 'christmas-truce-1914',
    image: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Illustrated_London_News_-_Christmas_Truce_1914.jpg/500px-Illustrated_London_News_-_Christmas_Truce_1914.jpg', width: 480, height: 288, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Illustrated_London_News_-_Christmas_Truce_1914.jpg' },
    category: 'Military Oddities',
    title: 'The Night Enemy Soldiers Played Football Together',
    place: 'Western Front, Belgium',
    countries: ["be"],
    paragraphs: [
      "On Christmas Eve and Christmas Day 1914, only months into WWI, soldiers along multiple stretches of the Western Front in Belgium and France spontaneously and informally ceased fire, without any official orders to do so — singing carols across no-man's-land, exchanging small gifts and souvenirs, and in a number of well-documented instances, playing informal games of football between opposing trenches.",
      "Military commanders on both sides were alarmed by the truce and moved quickly to prevent anything similar from happening again, rotating units and issuing explicit orders against fraternization with the enemy in following years. No truce on anywhere near the same informal, widespread scale occurred again for the rest of the war, and the 1914 Christmas truce has since become one of the most enduring symbols of shared humanity briefly overriding official conflict."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Christmas_truce',
    wikiTerm: 'Christmas truce'
  },
  {
    id: 'ghost-army-wwii',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Ghostarmypatch.jpg', width: 200, height: 233, credit: 'US Dept of Defense - Dept of the Army', creditUrl: 'https://en.wikipedia.org/wiki/File:Ghostarmypatch.jpg' },
    category: 'Military Oddities',
    title: 'The Army Unit That Fought With Inflatable Tanks',
    place: 'France',
    countries: ["fr"],
    paragraphs: [
      "The US Army's 23rd Headquarters Special Troops, later nicknamed the \"Ghost Army,\" was a roughly 1,100-strong WWII unit built almost entirely from artists, sound engineers, and radio operators, tasked with deceiving German forces about the location and size of Allied troops using inflatable rubber tanks, fake convoy noise played from powerful speakers, and staged fraudulent radio traffic.",
      "Operating across Europe including in France following the D-Day landings, the unit staged more than 20 deception operations, at times convincingly simulating entire divisions with only a fraction of the actual manpower, helping draw German attention and firepower away from real Allied positions and operations. Its work remained classified for over 40 years after the war, and its members received little public recognition until documents were declassified in the 1990s and beyond, culminating in a 2022 US Congressional Gold Medal awarded to the unit."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Ghost_Army',
    wikiTerm: 'Ghost Army'
  },
  {
    id: 'mississippi-company-bubble',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/John_Law-Casimir_Balthazar_mg_8450.jpg/500px-John_Law-Casimir_Balthazar_mg_8450.jpg', width: 480, height: 617, credit: 'Rama', creditUrl: 'https://en.wikipedia.org/wiki/File:John_Law-Casimir_Balthazar_mg_8450.jpg' },
    category: 'Financial History',
    title: 'The Bubble That Sent French Paper Money Worthless',
    place: 'France',
    countries: ["fr"],
    paragraphs: [
      "In 1716, Scottish financier John Law convinced the French government to let him establish a bank issuing paper currency backed by the state, followed by the Mississippi Company, granted a monopoly over trade with France's vast Louisiana territory in North America; speculative demand for company shares, fueled partly by wildly exaggerated claims about Louisiana's wealth, drove share prices up by many multiples within about a year.",
      "When the bubble inevitably burst in 1720, both the company's shares and Law's paper currency collapsed almost simultaneously, since Law had tied the two together, wiping out enormous amounts of wealth across French society and souring French trust in paper money and central banking for generations afterward. Some historians have argued the resulting distrust of financial innovation in France, compared to Britain's roughly contemporaneous but differently resolved South Sea Bubble, had lasting economic consequences stretching all the way to the financial pressures behind the French Revolution decades later."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Mississippi_Company',
    wikiTerm: 'Mississippi Company'
  },
  {
    id: 'weimar-hyperinflation-germany',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bundesarchiv_Bild_183-R1215-506%2C_Berlin%2C_Reichsbank%2C_Geldauflieferungsstelle.jpg/500px-Bundesarchiv_Bild_183-R1215-506%2C_Berlin%2C_Reichsbank%2C_Geldauflieferungsstelle.jpg', width: 480, height: 304, credit: 'Unknown authorUnknown author', creditUrl: 'https://en.wikipedia.org/wiki/File:Bundesarchiv_Bild_183-R1215-506%2C_Berlin%2C_Reichsbank%2C_Geldauflieferungsstelle.jpg' },
    category: 'Financial History',
    title: 'When Cash Was Cheaper Than the Paper It Was Printed On',
    place: 'Weimar Republic, Germany',
    countries: ["de"],
    paragraphs: [
      "Germany's Weimar Republic experienced one of history's most extreme cases of hyperinflation in 1923, driven largely by the government printing money to cover war reparations and a general strike, with prices roughly doubling every few days at the worst point; workers reportedly needed wheelbarrows to carry enough banknotes to buy basic groceries, and some people found it cheaper to burn stacks of cash for warmth than to buy firewood with it.",
      "The German mark's exchange rate against the US dollar collapsed from roughly 4.2 marks per dollar before WWI to over 4 trillion marks per dollar by late 1923. The crisis was ultimately resolved by introducing an entirely new currency, the Rentenmark, backed not by gold but by a mortgage on German industrial and agricultural land, which succeeded in restoring public confidence almost overnight — but the trauma of the hyperinflation left a lasting mark on German economic policy and public psychology for decades afterward."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Hyperinflation_in_the_Weimar_Republic',
    wikiTerm: 'Rentenmark'
  },
  {
    id: 'bhopal-gas-tragedy',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Union_Carbide_pesticide_factory%2C_Bhopal%2C_India%2C_1985.jpg/500px-Union_Carbide_pesticide_factory%2C_Bhopal%2C_India%2C_1985.jpg', width: 480, height: 294, credit: 'Bhopal Medical Appeal, Martin Stott', creditUrl: 'https://en.wikipedia.org/wiki/File:Union_Carbide_pesticide_factory%2C_Bhopal%2C_India%2C_1985.jpg' },
    category: 'Industrial Disasters',
    title: "The World's Deadliest Industrial Accident",
    place: 'Bhopal, India',
    countries: ["in"],
    cities: [{ name: "Bhopal", lat: 23.2599, lon: 77.4126 }],
    paragraphs: [
      "On the night of 2-3 December 1984, a Union Carbide pesticide plant in Bhopal, India, leaked around 30 tonnes of highly toxic methyl isocyanate gas into the surrounding densely populated neighbourhoods after safety systems failed, in what's generally considered the worst industrial disaster in history; official death tolls range from around 3,800 to, by some independent estimates, over 15,000 people over subsequent years, with several hundred thousand more injured or exposed.",
      "The disaster prompted major changes to industrial safety regulation and chemical accident preparedness worldwide, but survivors and advocacy groups have argued for decades that compensation, site cleanup, and accountability were all seriously inadequate: Union Carbide's then-chairman was charged with culpable homicide in India but never appeared in an Indian court, and significant chemical contamination around the former plant site reportedly persisted for decades afterward, continuing to affect local groundwater and residents' health."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Bhopal_disaster',
    wikiTerm: 'Union Carbide'
  },
  {
    id: 'seveso-dioxin-disaster',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/SEVESO-1976.jpg/500px-SEVESO-1976.jpg', width: 480, height: 384, credit: 'Unknown authorUnknown author', creditUrl: 'https://en.wikipedia.org/wiki/File:SEVESO-1976.jpg' },
    category: 'Industrial Disasters',
    title: 'The Accident That Rewrote European Chemical Safety Law',
    place: 'Seveso, Italy',
    countries: ["it"],
    cities: [{ name: "Seveso", lat: 45.6511, lon: 9.1522 }],
    paragraphs: [
      "In July 1976, a malfunction at a chemical plant near Seveso, Italy, released a cloud of dioxin, one of the most toxic industrial chemical compounds known, over the surrounding countryside; thousands of animals died within days, and a substantial number of local residents developed chloracne, a severe and disfiguring skin condition, along with longer-term health concerns still being studied decades later.",
      "The scale of the contamination, and the plant operator's initial delay in publicly disclosing the exact chemicals released, pushed the European Economic Community to pass sweeping new industrial safety legislation in 1982, still known today as the \"Seveso Directive,\" which established mandatory hazard reporting, emergency planning, and land-use restrictions around facilities handling dangerous chemicals across what's now the EU — regulation whose basic structure remains largely in place across Europe today."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Seveso_disaster',
    wikiTerm: 'Seveso Directive'
  },
  {
    id: 'jain-sallekhana-fasting',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Nishidhi_stone_with_14th_century_Old_Kannada_inscription_from_Tavanandi_forest.JPG/500px-Nishidhi_stone_with_14th_century_Old_Kannada_inscription_from_Tavanandi_forest.JPG', width: 480, height: 720, credit: 'Dineshkannambadi', creditUrl: 'https://en.wikipedia.org/wiki/File:Nishidhi_stone_with_14th_century_Old_Kannada_inscription_from_Tavanandi_forest.JPG' },
    category: 'Ascetic Practices',
    title: 'A Religious Fast Undertaken Until Death',
    place: 'India',
    countries: ["in"],
    paragraphs: [
      "Sallekhana is a vow observed within Jainism, typically by elderly practitioners or those with a terminal illness, involving a gradual, voluntary reduction of food and water intake over an extended period, undertaken with the stated goal of facing death consciously, peacefully, and without fear or attachment, rather than as an act of despair.",
      "It remains legally and religiously practiced in India today, generally under close observation from family, spiritual advisors, and sometimes physicians, but it's also been legally contested: a 2015 Rajasthan High Court ruling briefly classified it as equivalent to suicide and attempted to ban it, before India's Supreme Court stayed that ruling shortly afterward pending further review, reflecting an unresolved tension between religious freedom protections and India's laws around assisted death."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Sallekhana',
    wikiTerm: 'Sallekhana'
  },
  {
    id: 'stylites-pillar-saints',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Simeon_Stylites_the_Elder_and_Simeon_Stylites_the_Younger%2C_1699.jpg/500px-Simeon_Stylites_the_Elder_and_Simeon_Stylites_the_Younger%2C_1699.jpg', width: 480, height: 660, credit: 'Unknown authorUnknown author', creditUrl: 'https://en.wikipedia.org/wiki/File:Simeon_Stylites_the_Elder_and_Simeon_Stylites_the_Younger%2C_1699.jpg' },
    category: 'Ascetic Practices',
    title: 'Christian Ascetics Who Lived Atop Pillars for Decades',
    place: 'Syria',
    countries: ["sy"],
    paragraphs: [
      "Simeon Stylites, a 5th-century Christian ascetic in what's now Syria, reportedly grew frustrated with crowds constantly seeking him out for blessings and advice, and climbed atop a stone pillar to live in relative isolation while remaining physically present for visitors below — he's said to have spent roughly the last 37 years of his life living on progressively taller pillars, eventually reaching around 15-18 metres high.",
      "His example directly inspired a wider ascetic tradition of \"stylites\" (from the Greek word for pillar) across the early Christian world, with a number of other monks over the following centuries similarly living atop columns for extended periods, sometimes decades, exposed to the elements and dependent on followers below to send up food and water. The remains of Simeon's original pillar and the surrounding church complex built to commemorate him still stand today as an archaeological site in northern Syria."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Stylite',
    wikiTerm: 'Stylites'
  },
  {
    id: 'dust-bowl-usa',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Farmer_walking_in_dust_storm_Cimarron_County_Oklahoma2.jpg/500px-Farmer_walking_in_dust_storm_Cimarron_County_Oklahoma2.jpg', width: 480, height: 469, credit: 'Arthur Rothstein', creditUrl: 'https://en.wikipedia.org/wiki/File:Farmer_walking_in_dust_storm_Cimarron_County_Oklahoma2.jpg' },
    category: 'Environmental Disasters',
    title: 'When Farming Practices Turned the Plains to Dust',
    place: 'Great Plains, USA',
    countries: ["us"],
    paragraphs: [
      "Through the 1930s, a combination of severe drought and decades of farming practices that had stripped the US Great Plains of its native deep-rooted grasses left millions of acres of topsoil dangerously exposed; when high winds hit the loosened, dried-out soil, the result was massive dust storms, some tall enough to be seen from cities hundreds of kilometres away, and dark enough to turn daytime skies black.",
      "The disaster, known as the Dust Bowl, forced roughly 2.5 million people to leave the region over the decade, one of the largest internal migrations in American history, driving many farming families west toward California in search of work, an exodus later immortalized in John Steinbeck's novel The Grapes of Wrath. It also directly reshaped US agricultural policy, prompting the creation of federal soil conservation programs still in operation today, aimed specifically at preventing a repeat of the erosion that caused it."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Dust_Bowl',
    wikiTerm: 'Dust Bowl'
  },
  {
    id: 'minamata-disease-japan',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Minamata_City_Hall_20110514.JPG/500px-Minamata_City_Hall_20110514.JPG', width: 480, height: 360, credit: 'Waka77', creditUrl: 'https://en.wikipedia.org/wiki/File:Minamata_City_Hall_20110514.JPG' },
    category: 'Environmental Disasters',
    title: 'A Poisoning That Took Decades to Officially Acknowledge',
    place: 'Minamata, Japan',
    countries: ["jp"],
    cities: [{ name: "Minamata", lat: 32.2072, lon: 130.4033 }],
    paragraphs: [
      "Starting in the 1950s, a chemical company in the Japanese city of Minamata discharged industrial wastewater containing methylmercury directly into the surrounding bay for years; the mercury accumulated up the food chain in local fish and shellfish, a dietary staple for the fishing community, causing severe neurological damage in thousands of residents who ate them, including debilitating tremors, loss of coordination, and birth defects in children exposed before birth.",
      "The company and local government were slow to acknowledge the cause, continuing to discharge wastewater for over a decade after the illness was first identified, in a delay that significantly worsened the eventual scale of harm; a Japanese court didn't formally rule the company liable until 1973. \"Minamata disease\" is now the standard medical term for methylmercury poisoning globally, and the disaster remains one of the most frequently cited case studies in environmental health and industrial regulation worldwide."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Minamata_disease',
    wikiTerm: 'Minamata disease'
  },
  {
    id: 'wife-carrying-championship-finland',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/WCwiki1.jpg/500px-WCwiki1.jpg', width: 480, height: 286, credit: 'Msvctv', creditUrl: 'https://en.wikipedia.org/wiki/File:WCwiki1.jpg' },
    category: 'Cultural Oddities',
    title: "A Sport Where the Prize Is Your Partner's Weight in Beer",
    place: 'Sonkajärvi, Finland',
    countries: ["fi"],
    cities: [{ name: "Sonkajärvi", lat: 63.6667, lon: 27.5167 }],
    paragraphs: [
      "The Wife-Carrying World Championships, held annually in the small Finnish town of Sonkajärvi since 1992, has competitors race through an obstacle course — including a water hazard — while carrying a partner using any of several permitted holds, most competitively an upside-down piggyback style nicknamed the \"Estonian carry,\" which lets the carrier use both hands freely.",
      "Despite the name, the \"wife\" doesn't need to be a spouse, or even a woman, and doesn't need to share the carrier's nationality; the tradition is loosely traced back to 19th-century Finnish folklore about men raiding neighbouring villages to carry off wives, now reenacted purely as good-natured sport. The winning team traditionally receives the wife's own body weight in beer, along with a small cash prize, and the event now draws international competitors from well beyond Finland each year."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Wife-carrying',
    wikiTerm: 'Wife-Carrying World Championships'
  },
  {
    id: 'el-colacho-baby-jumping-spain',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/El_colacho_saltando.jpg/500px-El_colacho_saltando.jpg', width: 480, height: 640, credit: 'Celestebombin', creditUrl: 'https://en.wikipedia.org/wiki/File:El_colacho_saltando.jpg' },
    category: 'Cultural Oddities',
    title: 'A Festival Where Men Leap Over Babies',
    place: 'Castrillo de Murcia, Spain',
    countries: ["es"],
    cities: [{ name: "Castrillo de Murcia", lat: 42.35, lon: -3.9333 }],
    paragraphs: [
      "El Colacho, an annual festival held since 1620 in the small Spanish village of Castrillo de Murcia, involves men dressed as devils, in bright yellow and red costumes, running and leaping over rows of babies born within the previous year, who are laid out on mattresses in the street specifically for the event.",
      "The tradition, tied to the Catholic feast of Corpus Christi, is locally understood as a way of symbolically cleansing the infants of original sin and warding off illness and evil spirits, with the devil figures' leap representing evil being chased away from the children. The Catholic Church has never officially endorsed the practice, and it draws scrutiny and safety criticism from child welfare advocates regularly, but the village has continued the ritual essentially unbroken for over 400 years."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Baby_jumping',
    wikiTerm: 'El Colacho'
  },
  {
    id: 'maginot-line-france',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Maginot_line_1.jpg/500px-Maginot_line_1.jpg', width: 480, height: 360, credit: 'Wikimedia Commons', creditUrl: 'https://en.wikipedia.org/wiki/File:Maginot_line_1.jpg' },
    category: 'War Remnants',
    title: 'A Fortress Line That Got Simply Driven Around',
    place: 'France',
    countries: ["fr"],
    paragraphs: [
      "The Maginot Line, a massive, heavily fortified defensive line France built along its border with Germany through the 1930s, included underground bunkers, artillery emplacements, troop quarters, and even internal railways, designed to prevent a repeat of the devastating trench warfare France had suffered in WWI.",
      "When Germany invaded in 1940, its forces largely avoided a direct assault on the line's strongest fortifications entirely, instead advancing through the Ardennes forest and into Belgium and the Netherlands, terrain French planners had judged too difficult for a major armored advance, then swinging around the Maginot Line's northern end. The line itself performed reasonably well in the more limited direct engagements it did face, but the broader French defensive strategy built around it failed within about six weeks, and \"Maginot Line\" has since become a common shorthand in English for any elaborate defense that fails because it was outflanked rather than overwhelmed head-on."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Maginot_Line',
    wikiTerm: 'Maginot Line'
  },
  {
    id: 'unexploded-ordnance-laos',
    image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Laos_1973-02_CIA.png/500px-Laos_1973-02_CIA.png', width: 480, height: 559, credit: 'CIA', creditUrl: 'https://en.wikipedia.org/wiki/File:Laos_1973-02_CIA.png' },
    category: 'War Remnants',
    title: 'The Most Heavily Bombed Country, Per Capita, in History',
    place: 'Laos',
    countries: ["la"],
    paragraphs: [
      "Between 1964 and 1973, the United States dropped more than two million tonnes of ordnance on Laos during a largely covert bombing campaign tied to the Vietnam War, making it, per capita, the most heavily bombed country in history — reportedly averaging a planeload of bombs roughly every eight minutes for nine straight years.",
      "An estimated 30% of the cluster submunitions dropped failed to detonate on impact, leaving tens of millions of unexploded bombs scattered across the Laotian countryside; they've killed or injured an estimated 20,000 people since the war ended, with farmers and children especially at risk while working fields or playing in areas never fully cleared. Large-scale international clearance efforts have continued for decades and are expected to take many more to meaningfully finish, given the sheer scale of the contamination."
    ],
    wiki: 'https://en.wikipedia.org/wiki/Laotian_Civil_War',
    wikiTerm: 'unexploded bombs'
  }
];
