// Maps every ISO 3166-1 alpha-3 country code present in world-map.svg to one
// of the six continent names used elsewhere in this project (matches the
// `continent` field on GALLERIES in galleries-data.js). Pure data, no DOM
// access — consumed by map-view.js to color/group/zoom the map by continent.
//
// A few codes in the source map are non-standard or disputed-territory
// placeholders (CYN = Northern Cyprus, KAS = Kashmir, KOS = Kosovo,
// SAH = Western Sahara, SOL = Somaliland); each is assigned to whichever
// continent its landmass geographically belongs to. A few transcontinental
// countries (Russia, Turkey, Georgia, Armenia, Azerbaijan, Kazakhstan) are
// assigned to match how this project's own GALLERIES data already
// classifies them (e.g. Russia = "Europe", since the Hermitage/Pushkin/
// Tretyakov galleries are all in European Russia) rather than by strict
// landmass-majority, so the map's coloring and the continent filter agree.

export const COUNTRY_CONTINENTS = {
  // Africa
  AGO: "Africa", BDI: "Africa", BEN: "Africa", BFA: "Africa", BWA: "Africa",
  CAF: "Africa", CIV: "Africa", CMR: "Africa", COD: "Africa", COG: "Africa",
  COM: "Africa", CPV: "Africa", DJI: "Africa", DZA: "Africa", EGY: "Africa",
  ERI: "Africa", ETH: "Africa", GAB: "Africa", GHA: "Africa", GIN: "Africa",
  GMB: "Africa", GNB: "Africa", GNQ: "Africa", KEN: "Africa", LBR: "Africa",
  LBY: "Africa", LSO: "Africa", MAR: "Africa", MDG: "Africa", MLI: "Africa",
  MOZ: "Africa", MRT: "Africa", MUS: "Africa", MWI: "Africa", NAM: "Africa",
  NER: "Africa", NGA: "Africa", RWA: "Africa", SAH: "Africa", SDN: "Africa",
  SEN: "Africa", SLE: "Africa", SOL: "Africa", SOM: "Africa", SSD: "Africa",
  STP: "Africa", SWZ: "Africa", SYC: "Africa", TCD: "Africa", TGO: "Africa",
  TUN: "Africa", TZA: "Africa", UGA: "Africa", ZAF: "Africa", ZMB: "Africa",
  ZWE: "Africa",

  // Asia
  AFG: "Asia", ARE: "Asia", ARM: "Asia", AZE: "Asia", BGD: "Asia",
  BHR: "Asia", BRN: "Asia", BTN: "Asia", CHN: "Asia", CYN: "Asia",
  CYP: "Asia", GEO: "Asia", IDN: "Asia", IND: "Asia", IRN: "Asia",
  IRQ: "Asia", ISR: "Asia", JOR: "Asia", JPN: "Asia", KAS: "Asia",
  KAZ: "Asia", KGZ: "Asia", KHM: "Asia", KOR: "Asia", KWT: "Asia",
  LAO: "Asia", LBN: "Asia", LKA: "Asia", MDV: "Asia", MMR: "Asia",
  MNG: "Asia", MYS: "Asia", NPL: "Asia", OMN: "Asia", PAK: "Asia",
  PHL: "Asia", PRK: "Asia", PSE: "Asia", QAT: "Asia", SAU: "Asia",
  SGP: "Asia", SYR: "Asia", THA: "Asia", TJK: "Asia", TKM: "Asia",
  TLS: "Asia", TUR: "Asia", TWN: "Asia", UZB: "Asia", VNM: "Asia",
  YEM: "Asia",

  // Europe
  ALB: "Europe", AND: "Europe", AUT: "Europe", BEL: "Europe", BGR: "Europe",
  BIH: "Europe", BLR: "Europe", CHE: "Europe", CZE: "Europe", DEU: "Europe",
  DNK: "Europe", ESP: "Europe", EST: "Europe", FIN: "Europe", FRA: "Europe",
  GBR: "Europe", GRC: "Europe", HRV: "Europe", HUN: "Europe", IRL: "Europe",
  ISL: "Europe", ITA: "Europe", KOS: "Europe", LIE: "Europe", LTU: "Europe",
  LUX: "Europe", LVA: "Europe", MCO: "Europe", MDA: "Europe", MKD: "Europe",
  MLT: "Europe", MNE: "Europe", NLD: "Europe", NOR: "Europe", POL: "Europe",
  PRT: "Europe", ROU: "Europe", RUS: "Europe", SMR: "Europe", SRB: "Europe",
  SVK: "Europe", SVN: "Europe", SWE: "Europe", UKR: "Europe", VAT: "Europe",

  // North America
  ATG: "North America", BHS: "North America", BLZ: "North America",
  BRB: "North America", CAN: "North America", CRI: "North America",
  CUB: "North America", DMA: "North America", DOM: "North America",
  GRD: "North America", GTM: "North America", HND: "North America",
  HTI: "North America", JAM: "North America", KNA: "North America",
  LCA: "North America", MEX: "North America", NIC: "North America",
  PAN: "North America", SLV: "North America", TTO: "North America",
  USA: "North America", VCT: "North America",

  // South America
  ARG: "South America", BOL: "South America", BRA: "South America",
  CHL: "South America", COL: "South America", ECU: "South America",
  GUY: "South America", PER: "South America", PRY: "South America",
  SUR: "South America", URY: "South America", VEN: "South America",

  // Oceania
  AUS: "Oceania", FJI: "Oceania", FSM: "Oceania", KIR: "Oceania",
  MHL: "Oceania", NRU: "Oceania", NZL: "Oceania", PLW: "Oceania",
  PNG: "Oceania", SLB: "Oceania", TON: "Oceania", VUT: "Oceania",
  WSM: "Oceania",

  // Not part of any continent filter (no galleries there, left uncolored/
  // non-interactive by map-view.js)
  ATA: null,
};

// CSS class suffix for a continent name, e.g. "North America" -> "north-america".
export function continentSlug(continent) {
  return continent.toLowerCase().replace(/\s+/g, "-");
}

// Maps a country's ISO code to the exact `country` string used on GALLERIES
// in galleries-data.js — deliberately only the ~26 countries that actually
// have a gallery, since that's the only set map-view.js ever needs to
// resolve a clicked country shape to (the second zoom layer: continent,
// then a specific country within it). Keep in sync if a gallery is added
// in a country not yet listed here.
export const COUNTRY_CODE_TO_GALLERY_COUNTRY = {
  ARG: "Argentina",
  ARE: "United Arab Emirates",
  AUS: "Australia",
  AUT: "Austria",
  BRA: "Brazil",
  CAN: "Canada",
  CHN: "China",
  DEU: "Germany",
  DNK: "Denmark",
  EGY: "Egypt",
  ESP: "Spain",
  FRA: "France",
  GBR: "United Kingdom",
  IND: "India",
  ISR: "Israel",
  ITA: "Italy",
  JPN: "Japan",
  KOR: "South Korea",
  MEX: "Mexico",
  NLD: "Netherlands",
  PER: "Peru",
  RUS: "Russia",
  SGP: "Singapore",
  USA: "United States",
  VAT: "Vatican City",
  ZAF: "South Africa",
};
