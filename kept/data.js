// Sourced dataset — first pass (OECD-covered countries only).
// Schema per entry:
//   country   — display name
//   iso2      — ISO 3166-1 alpha-2, lowercase (drives the flag emoji)
//   gdpRank   — approx. nominal GDP rank (2024/2025 IMF ordering)
//   grossUSD  — average gross annual salary, single full-time worker, no
//               children, converted to USD at market exchange rate
//   taxPct    — effective tax %: employee income tax + employee-side
//               social security contributions only (no employer share,
//               no VAT/consumption tax) — OECD's "net personal average tax rate"
//   taxUSD    — tax amount in USD
//   netUSD    — grossUSD - taxUSD (what actually lands in the bank)
//   source    — where the figures come from
//   confidence— "high" | "medium" | "low"
//   note      — optional: a standout quirk/caveat surfaced directly in the
//               UI (✦ badge, tooltip, table title attr) rather than buried
//               in the dense `source` string
const COUNTRIES = [
  { country: "United States", iso2: "us", gdpRank: 1, grossUSD: 82932, taxPct: 24.4, taxUSD: 20235, netUSD: 62697, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2025 (2024 data)", confidence: "high" },
  { country: "Germany", iso2: "de", gdpRank: 3, grossUSD: 54372, taxPct: 38.7, taxUSD: 21042, netUSD: 33330, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Japan", iso2: "jp", gdpRank: 4, grossUSD: 34879, taxPct: 22.6, taxUSD: 7883, netUSD: 26996, source: "Wage: Japan NTA Wage Survey 2024 · Tax: OECD Taxing Wages 2026 (2025)", confidence: "medium" },
  { country: "United Kingdom", iso2: "gb", gdpRank: 6, grossUSD: 57264, taxPct: 23.1, taxUSD: 13228, netUSD: 44036, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025-26 tax year)", confidence: "high" },
  { country: "France", iso2: "fr", gdpRank: 7, grossUSD: 48588, taxPct: 28.0, taxUSD: 13605, netUSD: 34983, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Italy", iso2: "it", gdpRank: 8, grossUSD: 35856, taxPct: 28.6, taxUSD: 10255, netUSD: 25601, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Canada", iso2: "ca", gdpRank: 10, grossUSD: 60684, taxPct: 25.5, taxUSD: 15474, netUSD: 45210, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2025 (2024 data)", confidence: "high" },
  { country: "Mexico", iso2: "mx", gdpRank: 12, grossUSD: 13885, taxPct: 13.2, taxUSD: 1833, netUSD: 12052, source: "Wage: INEGI/IMSS composite · Tax: OECD Taxing Wages 2026 brochure (2025)", confidence: "medium", note: "Lowest effective tax rate of any OECD country in this list." },
  { country: "South Korea", iso2: "kr", gdpRank: 13, grossUSD: 34296, taxPct: 16.5, taxUSD: 5659, netUSD: 28637, source: "Wage: Ministry of Employment & Labor / KOSIS 2024 · Tax: OECD Taxing Wages 2026 (2025)", confidence: "medium" },
  { country: "Australia", iso2: "au", gdpRank: 14, grossUSD: 73294, taxPct: 25.3, taxUSD: 18543, netUSD: 54751, source: "Wage: ABS AWOTE Nov 2024 · Tax: OECD Taxing Wages 2025 (2024 data)", confidence: "medium" },
  { country: "Spain", iso2: "es", gdpRank: 15, grossUSD: 35748, taxPct: 23.5, taxUSD: 8401, netUSD: 27347, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Turkey", iso2: "tr", gdpRank: 17, grossUSD: 16344, taxPct: 28.4, taxUSD: 4642, netUSD: 11702, source: "Wage: UNECE 2023 (dated — lira depreciation since) · Tax: OECD Taxing Wages 2025 (2024 data)", confidence: "low" },
  { country: "Netherlands", iso2: "nl", gdpRank: 18, grossUSD: 63012, taxPct: 27.9, taxUSD: 17580, netUSD: 45432, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Switzerland", iso2: "ch", gdpRank: 20, grossUSD: 109992, taxPct: 18.1, taxUSD: 19908, netUSD: 90084, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Poland", iso2: "pl", gdpRank: 21, grossUSD: 23016, taxPct: 24.4, taxUSD: 5616, netUSD: 17400, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Belgium", iso2: "be", gdpRank: 23, grossUSD: 63924, taxPct: 39.5, taxUSD: 25250, netUSD: 38674, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025) — highest tax rate in the OECD", confidence: "high", note: "Highest personal tax rate of any OECD country." },
  { country: "Sweden", iso2: "se", gdpRank: 25, grossUSD: 50124, taxPct: 23.1, taxUSD: 11579, netUSD: 38545, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2025 (2024 data)", confidence: "high" },
  { country: "Ireland", iso2: "ie", gdpRank: 26, grossUSD: 60144, taxPct: 28.0, taxUSD: 16840, netUSD: 43304, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2025 (2024 data)", confidence: "high" },
  { country: "Israel", iso2: "il", gdpRank: 27, grossUSD: 43644, taxPct: 19.6, taxUSD: 8554, netUSD: 35090, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2025 (2024 data)", confidence: "high" },
  { country: "Norway", iso2: "no", gdpRank: 28, grossUSD: 66936, taxPct: 28.1, taxUSD: 18809, netUSD: 48127, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },

  // --- Non-OECD batch: composite estimates (national stats bureau wage +
  // statutory income tax + mandatory employee social insurance), since none
  // of these have a ready-made OECD Taxing Wages table. Where the source
  // research rated an entry a split confidence (e.g. "Low-Medium"), it's
  // rounded DOWN here — honest-but-cautious beats optimistic on published
  // numbers.
  { country: "China", iso2: "cn", gdpRank: 2, grossUSD: 13226, taxPct: 11.2, taxUSD: 1475, netUSD: 11751, source: "Wage: NBS 2024 (weighted blend, urban units) · Tax: 2019 IIT brackets + 10.5% employee SSC — excludes ~290M migrant/informal workers", confidence: "low", note: "Official wage stats exclude an estimated 290 million migrant and informal workers — a huge share of China's actual workforce." },
  { country: "India", iso2: "in", gdpRank: 5, grossUSD: 2600, taxPct: 12.0, taxUSD: 312, netUSD: 2288, source: "Wage: NSO PLFS 2023-24, regular salaried only (~21% of workforce) · Tax: FY2025-26 new regime (₹0 due to rebate) + EPF 12%", confidence: "low", note: "This 'average wage' covers only the ~21% of India's workforce with regular salaried jobs — the rest work informally, with no comparable wage data at all." },
  { country: "Brazil", iso2: "br", gdpRank: 9, grossUSD: 8293, taxPct: 12.1, taxUSD: 1001, netUSD: 7290, source: "Wage: IBGE PNAD Contínua 2025 · Tax: INSS 2025 (7.5–14%) + IRPF 2025 brackets", confidence: "medium" },
  { country: "Russia", iso2: "ru", gdpRank: 11, grossUSD: 14273, taxPct: 13.0, taxUSD: 1856, netUSD: 12417, source: "Wage: Rosstat 2025 · Tax: flat 13% income tax; 0% employee SSC (contributions are entirely employer-paid in Russia)", confidence: "medium", note: "The employee pays 0% social security here — contributions are entirely employer-funded, unlike almost every other country in this list." },
  { country: "Indonesia", iso2: "id", gdpRank: 16, grossUSD: 2211, taxPct: 4.0, taxUSD: 88, netUSD: 2123, source: "Wage: BPS Sakernas Aug 2024, wage employees only (<50% of workforce) · Tax: below PTKP threshold (₹0) + BPJS ~4%", confidence: "low", note: "The average wage falls entirely below the income-tax threshold — this worker owes $0 in income tax, only social insurance." },
  { country: "Saudi Arabia", iso2: "sa", gdpRank: 19, grossUSD: 32381, taxPct: 9.8, taxUSD: 3157, netUSD: 29224, source: "Wage: GASTAT 2024, Saudi nationals only (excludes ~75% expat private-sector majority) · Tax: 0% income tax + GOSI 9.75%", confidence: "medium", note: "Covers Saudi nationals only — the expatriate majority (~75% of private-sector workers) earns roughly 40% less on average and pays no GOSI at all." },
  { country: "Taiwan", iso2: "tw", gdpRank: 22, grossUSD: 22875, taxPct: 5.9, taxUSD: 1359, netUSD: 21514, source: "Wage: DGBAS 2024 (incl. bonuses) · Tax: progressive 5–40% after deductions + Labor Insurance/NHI ~4%", confidence: "medium" },
  { country: "Argentina", iso2: "ar", gdpRank: 24, grossUSD: 15225, taxPct: 17.0, taxUSD: 2589, netUSD: 12637, source: "Wage: INDEC/RIPTE June 2026 · Tax: below Ganancias threshold (₳0) + 17% employee SSC — peso figure highly date-sensitive amid inflation/FX volatility", confidence: "low", note: "Chronic inflation and peso depreciation mean this dollar figure can shift meaningfully within just a few months." },
  { country: "Thailand", iso2: "th", gdpRank: 30, grossUSD: 5730, taxPct: 4.7, taxUSD: 271, netUSD: 5459, source: "Wage: NSO Labour Force Survey June 2026 (broad, incl. informal/agricultural) · Tax: below taxable threshold (₹0) + SSF capped ~5%", confidence: "medium" },
  { country: "United Arab Emirates", iso2: "ae", gdpRank: 29, grossUSD: 52281, taxPct: 0.0, taxUSD: 0, netUSD: 52281, source: "Wage: private salary-survey estimate — no official government release located · Tax: 0% income tax, 0% SSC for the expatriate majority", confidence: "low", note: "No personal income tax and no mandatory social contributions for the roughly 90% of the workforce who are foreign nationals." },
];

// "placeholder" (fake numbers) | "partial" (real, sourced, but not every
// top-GDP country covered yet) | "sourced" (full list covered)
const DATA_MODE = "sourced";
// Primary FX date for most rows; two rows use a fixed currency peg instead
// of a spot rate (Saudi Arabia, UAE), and Argentina's wage figure is from
// a slightly later date than this rate due to peso volatility — see each
// row's own source string for the specifics.
const DATA_ASOF = "18 September 2026";
const PENDING_COUNTRIES = [];
