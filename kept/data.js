// Sourced dataset — built up across three research passes: OECD countries,
// then non-OECD top-30-by-GDP, then a further 20 extending past that cutoff
// (including Singapore, mistakenly left off the original top-30 list).
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

  // --- Batch 3: 20 more countries extending past the original top-30-by-GDP
  // cutoff, including the Singapore fix.
  { country: "Singapore", iso2: "sg", gdpRank: 29, grossUSD: 49331, taxPct: 22.0, taxUSD: 10860, netUSD: 38473, source: "Wage: MOM mean gross monthly income Q4 2024 (backed out from employer CPF) · Tax: IRAS 2025 resident brackets + CPF employee 20%", confidence: "medium" },
  { country: "Denmark", iso2: "dk", gdpRank: 33, grossUSD: 76332, taxPct: 35.3, taxUSD: 26945, netUSD: 49387, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Chile", iso2: "cl", gdpRank: 42, grossUSD: 14074, taxPct: 7.1, taxUSD: 999, netUSD: 13075, source: "Wage: INE Encuesta Suplementaria de Ingresos 2024 · Tax: OECD Taxing Wages 2026 brochure (2025) — excludes Chile's mandatory 10% AFP pension contribution, which OECD treats as forced savings rather than a tax", confidence: "medium", note: "OECD's 7.1% figure excludes Chile's mandatory 10% pension contribution — real deductions from this paycheck are higher than the headline number suggests." },
  { country: "Czech Republic", iso2: "cz", gdpRank: 43, grossUSD: 24528, taxPct: 21.3, taxUSD: 5224, netUSD: 19304, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Finland", iso2: "fi", gdpRank: 46, grossUSD: 53028, taxPct: 30.7, taxUSD: 16280, netUSD: 36748, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Portugal", iso2: "pt", gdpRank: 47, grossUSD: 25068, taxPct: 24.9, taxUSD: 6242, netUSD: 18826, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "New Zealand", iso2: "nz", gdpRank: 48, grossUSD: 50262, taxPct: 20.8, taxUSD: 10455, netUSD: 39807, source: "Wage: Stats NZ Quarterly Employment Survey, June 2025 · Tax: OECD Taxing Wages 2026 (2025-26 tax year)", confidence: "high" },
  { country: "Hungary", iso2: "hu", gdpRank: 50, grossUSD: 18540, taxPct: 33.5, taxUSD: 6211, netUSD: 12329, source: "Wage: UNECE 2024 · Tax: OECD Taxing Wages 2026 (2025 data)", confidence: "high" },
  { country: "Nigeria", iso2: "ng", gdpRank: 51, grossUSD: 3069, taxPct: 20.8, taxUSD: 639, netUSD: 2429, source: "Wage: NBS 2024 (likely overstates typical earnings) · Tax: Nigeria Tax Act 2025 bands (approximated) + pension employee 8%", confidence: "low", note: "Over 80% of Nigeria's workforce is informally employed — this figure reflects the formal-sector minority, not a typical worker." },
  { country: "Egypt", iso2: "eg", gdpRank: 44, grossUSD: 1583, taxPct: 13.7, taxUSD: 217, netUSD: 1366, source: "Wage: CAPMAS Dec 2024, blended public/private pay · Tax: 2025 income tax bands + social insurance employee 11%", confidence: "low", note: "Public-sector pay in Egypt runs roughly 2.7x private-sector pay — this national average blends two very different labor markets." },
  { country: "Bangladesh", iso2: "bd", gdpRank: 36, grossUSD: 2051, taxPct: 0.0, taxUSD: 0, netUSD: 2051, source: "Wage: composite secondary estimate — Bangladesh's statistics bureau publishes only a wage-rate index, not a wage level · Tax: below 2025-26 tax-free threshold ($0), no mandatory social security", confidence: "low", note: "No authoritative government wage-level figure exists for Bangladesh — this is a composite estimate, and roughly 85% of employment is informal." },
  { country: "Vietnam", iso2: "vn", gdpRank: 34, grossUSD: 3554, taxPct: 10.5, taxUSD: 373, netUSD: 3181, source: "Wage: GSO 2024 average monthly income of employees · Tax: below personal deduction threshold ($0 income tax) + social/health/unemployment insurance 10.5%", confidence: "low", note: "An estimated 65-70% of Vietnamese employment is informal — well beyond what this formal-sector wage figure captures." },
  { country: "Philippines", iso2: "ph", gdpRank: 37, grossUSD: 4122, taxPct: 8.4, taxUSD: 347, netUSD: 3774, source: "Wage: PSA 2024 Occupational Wages Survey, formal establishments (10+ workers) only · Tax: TRAIN law brackets (below exemption, $0 tax) + SSS/PhilHealth/Pag-IBIG ~9.5%", confidence: "low", note: "Wage covers only formal establishments with 10+ workers — excludes a large share of Filipino employment." },
  { country: "Pakistan", iso2: "pk", gdpRank: 52, grossUSD: 1693, taxPct: 1.0, taxUSD: 17, netUSD: 1675, source: "Wage: PBS Labour Force Survey 2024-25, all Pakistan · Tax: below 2025-26 threshold ($0 tax) + EOBI ~1% (approximated)", confidence: "low", note: "Pakistan's own statistics bureau reports about 72% of non-agricultural employment as informal." },
  { country: "Malaysia", iso2: "my", gdpRank: 38, grossUSD: 10693, taxPct: 12.6, taxUSD: 1345, netUSD: 9349, source: "Wage: DOSM Salaries and Wages Survey 2024 · Tax: 2025 resident brackets after relief + EPF employee 11% + SOCSO 0.5%", confidence: "medium" },
  { country: "South Africa", iso2: "za", gdpRank: 41, grossUSD: 20886, taxPct: 16.0, taxUSD: 3334, netUSD: 17553, source: "Wage: Stats SA Quarterly Employment Statistics, Feb 2025, formal non-agricultural sector · Tax: SARS 2025/26 brackets + primary rebate + UIF ~1%", confidence: "medium" },
  { country: "Colombia", iso2: "co", gdpRank: 40, grossUSD: 6647, taxPct: 8.0, taxUSD: 532, netUSD: 6115, source: "Wage: estimate anchored to the 2024 minimum wage — Colombia's national statistics agency does not appear to publish a single average labor-income figure · Tax: below withholding threshold ($0 tax) + salud 4% + pensión 4%", confidence: "low", note: "This wage figure is our own estimate, not a directly cited government statistic — we could not locate an official national average labor-income release for Colombia." },
  { country: "Romania", iso2: "ro", gdpRank: 45, grossUSD: 23109, taxPct: 41.5, taxUSD: 9591, netUSD: 13517, source: "Wage: INS average gross monthly earnings, Nov 2024 · Tax: flat 10% income tax + 35% total employee social contributions (pension 25% + health 10%)", confidence: "medium", note: "35% employee-side social contributions on top of a flat 10% income tax — among the highest total deduction of any country in this dataset." },
  { country: "Peru", iso2: "pe", gdpRank: 49, grossUSD: 6251, taxPct: 13.0, taxUSD: 813, netUSD: 5438, source: "Wage: INEI EPEN 2024, national average · Tax: below exemption threshold ($0 income tax) + pension (ONP/AFP) ~13%", confidence: "low", note: "Peru's own statistics agency estimates roughly 70% of its workforce is informally employed, which shapes this national average." },
  { country: "Qatar", iso2: "qa", gdpRank: 53, grossUSD: 40932, taxPct: 0.0, taxUSD: 0, netUSD: 40932, source: "Wage: National Planning Council Labour Force Survey, Q4 2024, blended national/expat · Tax: 0% income tax, 0% SSC for the expatriate majority", confidence: "low", note: "Same national/expat pay gap as the UAE and Saudi Arabia — over 90% of Qatar's workforce is foreign nationals, earning far less than the national segment and paying no tax or social insurance." },
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
