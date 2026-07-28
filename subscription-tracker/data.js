// SUBSCRIPTION_CATALOG: a hand-curated, hand-researched snapshot (July 2026).
// Not a live feed — see CLAUDE.md. Not every company has full history —
// some only have a single current-reference price point (oldPrice: null)
// where no confirmed past change could be sourced, and a few have none at
// all. Never invent numbers; "no data" is shown honestly in the UI.
//
// Each company entry:
//   domain: the company's real web domain — used to fetch a small logo/
//     favicon at render time (see CLAUDE.md for why that's an external
//     dependency, not a hosted asset).
//   subscribers (optional): { count, asOf, note, source } — only present
//     when a real figure has been publicly disclosed (mostly large public
//     companies via earnings reports). Absent means "not publicly
//     disclosed," never a guess.
//
// priceHistory entry shape:
//   date: "YYYY-MM-DD" (approximate where noted)
//   planLabel: which plan/tier this applies to
//   oldPrice / newPrice: monthly-equivalent numbers in `currency`; oldPrice
//     is null when this is just a current-reference price point or a
//     new-plan launch, not a confirmed change from a prior price. For
//     plans only ever sold annually (no monthly option), these are a
//     derived monthly-equivalent (annual / 12) — the note says so.
//   annualPrice (optional): the real published annual price for this plan
//     at newPrice, when one exists — not just newPrice × 12. Shown inline
//     alongside the monthly price. Absent means "no confirmed real annual
//     price" — the UI falls back to an explicitly-labeled ×12 estimate.
//   note: short human-readable context
//   source: a real URL to where this was reported
//
// forecast (optional, only present when something is publicly known):
//   { date: "YYYY-MM-DD" | null, note: string, source: url }
//   date is null when timing was announced only vaguely. No company here
//   has a confirmed *specific future date* as of this research pass —
//   companies rarely pre-announce hikes far ahead — so this field is
//   mostly absent, and the UI shows "Unknown" for those.

const SUBSCRIPTION_CATALOG = [
  {
    id: "netflix", name: "Netflix", category: "Streaming", domain: "netflix.com",
    subscribers: { count: "325M+", asOf: "Q1 2026", note: "Paid memberships, globally.", source: "https://www.demandsage.com/netflix-subscribers/" },
    priceHistory: [
      { date: "2022-01-01", planLabel: "Standard (ad-free)", oldPrice: 13.99, newPrice: 15.49, currency: "USD", note: "Exact January 2022 date approximate.", source: "https://www.androidauthority.com/timeline-netflix-price-hikes-3463376/" },
      { date: "2022-11-03", planLabel: "Standard with ads", oldPrice: null, newPrice: 6.99, currency: "USD", note: "Ad-supported tier launched (originally called \"Basic with Ads\", later renamed \"Standard with ads\").", source: "https://www.androidauthority.com/timeline-netflix-price-hikes-3463376/" },
      { date: "2023-10-01", planLabel: "Premium", oldPrice: 19.99, newPrice: 22.99, currency: "USD", note: "Exact October 2023 date approximate.", source: "https://www.androidauthority.com/timeline-netflix-price-hikes-3463376/" },
      { date: "2025-01-21", planLabel: "Standard (ad-free)", oldPrice: 15.49, newPrice: 17.99, currency: "USD", note: "First Standard-tier increase in 3 years.", source: "https://www.today.com/popculture/netflix-raising-prices-2025-rcna188702" },
      { date: "2025-01-21", planLabel: "Standard with ads", oldPrice: 6.99, newPrice: 7.99, currency: "USD", note: "", source: "https://www.today.com/popculture/netflix-raising-prices-2025-rcna188702" },
      { date: "2025-01-21", planLabel: "Premium", oldPrice: 22.99, newPrice: 24.99, currency: "USD", note: "", source: "https://www.today.com/popculture/netflix-raising-prices-2025-rcna188702" },
      { date: "2026-03-26", planLabel: "Standard with ads", oldPrice: 7.99, newPrice: 8.99, currency: "USD", note: "Second US increase in under two years.", source: "https://www.cbsnews.com/news/netflix-price-increase-2026-subscription-fees/" },
      { date: "2026-03-26", planLabel: "Standard (ad-free)", oldPrice: 17.99, newPrice: 19.99, currency: "USD", note: "", source: "https://www.cbsnews.com/news/netflix-price-increase-2026-subscription-fees/" },
      { date: "2026-03-26", planLabel: "Premium", oldPrice: 24.99, newPrice: 26.99, currency: "USD", note: "", source: "https://www.cbsnews.com/news/netflix-price-increase-2026-subscription-fees/" }
    ]
  },
  {
    id: "spotify", name: "Spotify", category: "Music", domain: "spotify.com",
    subscribers: { count: "293M", asOf: "Q1 2026 (Mar 31, 2026)", note: "Premium subscribers; 760M+ total monthly active users.", source: "https://sqmagazine.co.uk/digital-platform-subscription-statistics/" },
    priceHistory: [
      { date: "2023-07-01", planLabel: "Premium Individual", oldPrice: 9.99, newPrice: 10.99, currency: "USD", note: "First US Premium price change since its 2011 launch.", source: "https://www.cnbc.com/2024/06/03/spotify-price-increased-again.html" },
      { date: "2023-07-01", planLabel: "Premium Duo", oldPrice: null, newPrice: 14.99, currency: "USD", note: "", source: "https://www.cnbc.com/2024/06/03/spotify-price-increased-again.html" },
      { date: "2023-07-01", planLabel: "Premium Family", oldPrice: null, newPrice: 16.99, currency: "USD", note: "", source: "https://www.cnbc.com/2024/06/03/spotify-price-increased-again.html" },
      { date: "2023-07-01", planLabel: "Premium Student", oldPrice: null, newPrice: 5.99, currency: "USD", note: "", source: "https://www.cnbc.com/2024/06/03/spotify-price-increased-again.html" },
      { date: "2024-06-01", planLabel: "Premium Individual", oldPrice: 10.99, newPrice: 11.99, currency: "USD", note: "", source: "https://www.cnbc.com/2026/01/15/spotify-subscription-price-premium-us.html" },
      { date: "2026-01-15", planLabel: "Premium Individual", oldPrice: 11.99, newPrice: 12.99, currency: "USD", note: "", source: "https://www.cnbc.com/2026/01/15/spotify-subscription-price-premium-us.html" },
      { date: "2026-01-15", planLabel: "Premium Duo", oldPrice: 16.99, newPrice: 18.99, currency: "USD", note: "", source: "https://www.foxbusiness.com/lifestyle/spotify-raise-subscription-prices-again-us" },
      { date: "2026-01-15", planLabel: "Premium Family", oldPrice: 19.99, newPrice: 21.99, currency: "USD", note: "", source: "https://www.foxbusiness.com/lifestyle/spotify-raise-subscription-prices-again-us" },
      { date: "2026-01-15", planLabel: "Premium Student", oldPrice: 5.99, newPrice: 6.99, currency: "USD", note: "", source: "https://www.foxbusiness.com/lifestyle/spotify-raise-subscription-prices-again-us" }
    ]
  },
  {
    id: "disney-plus", name: "Disney+", category: "Streaming", domain: "disneyplus.com",
    subscribers: { count: "132M", asOf: "Q4 FY2025 (last disclosed)", note: "Disney stopped reporting Disney+ subscriber counts in FY2026.", source: "https://sqmagazine.co.uk/disney-plus-statistics/" },
    priceHistory: [
      { date: "2025-10-21", planLabel: "Premium", oldPrice: 15.99, newPrice: 18.99, annualPrice: 189.99, currency: "USD", note: "Fourth straight year Disney has raised Disney+ pricing.", source: "https://9to5mac.com/2025/09/23/disney-is-raising-prices-again-including-on-hbo-max-hulu-bundles/" },
      { date: "2025-10-21", planLabel: "Basic", oldPrice: 9.99, newPrice: 11.99, currency: "USD", note: "\"Disney+ Basic\" is the official name for the ad-supported tier.", source: "https://9to5mac.com/2025/09/23/disney-is-raising-prices-again-including-on-hbo-max-hulu-bundles/" }
    ]
  },
  {
    id: "disney-hulu-hbomax-bundle", name: "Disney+ / Hulu / HBO Max Bundle", category: "Streaming", domain: "disneyplus.com",
    priceHistory: [
      { date: "2025-10-21", planLabel: "Bundle with ads", oldPrice: 16.99, newPrice: 19.99, currency: "USD", note: "", source: "https://whatsondisneyplus.com/disney-hulu-hbo-max-bundle-price-increases/" },
      { date: "2025-10-21", planLabel: "Bundle, no ads", oldPrice: 29.99, newPrice: 32.99, currency: "USD", note: "", source: "https://whatsondisneyplus.com/disney-hulu-hbo-max-bundle-price-increases/" }
    ]
  },
  {
    id: "hbo-max", name: "HBO Max", category: "Streaming", domain: "max.com",
    subscribers: { count: "128M", asOf: "2026", note: "Warner Bros. Discovery targeting 150M by end of 2026.", source: "https://www.thewrap.com/industry-news/business/netflix-disney-warner-bros-discovery-paramount-peacock-subscribers-revenue-profit-may-2026-update/" },
    priceHistory: [
      { date: "2020-05-27", planLabel: "Standard", oldPrice: null, newPrice: 14.99, currency: "USD", note: "HBO Max launch price (ad-free — the only tier at launch). Exact May 2020 date approximate.", source: "https://variety.com/2023/digital/news/hbo-max-announces-price-increase-1235487428/" },
      { date: "2021-06-01", planLabel: "Basic with ads", oldPrice: null, newPrice: 9.99, currency: "USD", note: "Ad-supported tier launched. Exact June 2021 date approximate.", source: "https://variety.com/2023/digital/news/hbo-max-announces-price-increase-1235487428/" },
      { date: "2023-01-12", planLabel: "Standard", oldPrice: 14.99, newPrice: 15.99, currency: "USD", note: "First price increase since 2020 launch.", source: "https://techcrunch.com/2023/01/12/hbo-maxs-ad-free-monthly-subscription-price-is-increasing-by-1/" },
      { date: "2025-11-20", planLabel: "Basic with ads", oldPrice: 9.99, newPrice: 10.99, currency: "USD", note: "Existing subscribers notified 30 days ahead of renewal. Increases between 2023 and 2025 not individually confirmed.", source: "https://www.aol.com/entertainment/hbo-max-raises-prices-across-130933505.html" },
      { date: "2025-11-20", planLabel: "Standard", oldPrice: 16.99, newPrice: 18.49, currency: "USD", note: "Increases between 2023 ($15.99) and this point not individually confirmed.", source: "https://www.aol.com/entertainment/hbo-max-raises-prices-across-130933505.html" },
      { date: "2025-11-20", planLabel: "Premium", oldPrice: 20.99, newPrice: 22.99, currency: "USD", note: "", source: "https://www.aol.com/entertainment/hbo-max-raises-prices-across-130933505.html" }
    ]
  },
  {
    id: "peacock", name: "Peacock", category: "Streaming", domain: "peacocktv.com",
    subscribers: { count: "46M", asOf: "2026", note: "Added 2M subscribers in the most recent reported quarter.", source: "https://evoca.tv/peacock-statistics/" },
    priceHistory: [
      { date: "2020-07-15", planLabel: "Premium (with ads)", oldPrice: null, newPrice: 4.99, currency: "USD", note: "Peacock launch price.", source: "https://deadline.com/2023/07/peacock-raising-prices-first-time-since-2020-launch-nbcuniversal-streaming-1235440147/" },
      { date: "2020-07-15", planLabel: "Premium Plus (no ads)", oldPrice: null, newPrice: 9.99, currency: "USD", note: "Peacock launch price.", source: "https://deadline.com/2023/07/peacock-raising-prices-first-time-since-2020-launch-nbcuniversal-streaming-1235440147/" },
      { date: "2023-08-17", planLabel: "Premium (with ads)", oldPrice: 4.99, newPrice: 5.99, currency: "USD", note: "First price increase since 2020 launch.", source: "https://deadline.com/2023/07/peacock-raising-prices-first-time-since-2020-launch-nbcuniversal-streaming-1235440147/" },
      { date: "2023-08-17", planLabel: "Premium Plus (no ads)", oldPrice: 9.99, newPrice: 11.99, currency: "USD", note: "", source: "https://deadline.com/2023/07/peacock-raising-prices-first-time-since-2020-launch-nbcuniversal-streaming-1235440147/" },
      { date: "2026-01-01", planLabel: "Premium (with ads)", oldPrice: null, newPrice: 10.99, annualPrice: 109.99, currency: "USD", note: "Current reference price; increases between 2023 and 2026 not individually confirmed.", source: "https://www.tomsguide.com/news/peacock-price-hike-just-announced-heres-how-much-more-youll-pay" },
      { date: "2026-01-01", planLabel: "Premium Plus (no ads)", oldPrice: null, newPrice: 16.99, annualPrice: 169.99, currency: "USD", note: "Current reference price; Peacock said it would hold pricing steady into 2026.", source: "https://www.tomsguide.com/news/peacock-price-hike-just-announced-heres-how-much-more-youll-pay" },
      { date: "2026-01-01", planLabel: "Select", oldPrice: null, newPrice: 7.99, annualPrice: 79.99, currency: "USD", note: "Newest, cheapest tier — no prior price to compare.", source: "https://www.tomsguide.com/news/peacock-price-hike-just-announced-heres-how-much-more-youll-pay" }
    ]
  },
  {
    id: "paramount-plus", name: "Paramount+", category: "Streaming", domain: "paramountplus.com",
    subscribers: { count: "79.6M", asOf: "2026", note: "", source: "https://www.thewrap.com/industry-news/business/netflix-disney-warner-bros-discovery-paramount-peacock-subscribers-revenue-profit-may-2026-update/" },
    priceHistory: [
      { date: "2026-01-15", planLabel: "Premium (with Showtime)", oldPrice: 12.99, newPrice: 13.99, annualPrice: 139.99, currency: "USD", note: "", source: "https://www.techradar.com/streaming/paramount-plus/paramount-is-making-big-changes-in-2026-and-its-not-all-good-news-for-subscribers" },
      { date: "2026-01-15", planLabel: "Essential (with ads)", oldPrice: 7.99, newPrice: 8.99, annualPrice: 89.99, currency: "USD", note: "", source: "https://www.tomsguide.com/entertainment/streaming/paramount-plus-announces-upcoming-price-hike-heres-how-much-your-subscription-will-cost" }
    ]
  },
  {
    id: "amazon-prime-video", name: "Amazon Prime Video", category: "Streaming", domain: "amazon.com",
    priceHistory: [
      { date: "2024-01-29", planLabel: "Ad-free upgrade", oldPrice: null, newPrice: 2.99, currency: "USD", note: "Ads became default for all Prime Video; this add-on removes them. Exact January 2024 date approximate.", source: "https://www.aboutamazon.com/news/entertainment/prime-video-ultra-ad-free-streaming-subscription" },
      { date: "2026-04-10", planLabel: "Ad-free upgrade", oldPrice: 2.99, newPrice: 4.99, annualPrice: 45.99, currency: "USD", note: "Rebranded \"Prime Video Ultra\"; also dropped 4K from the tier while adding multi-device/download perks.", source: "https://variety.com/2026/streaming/news/amazon-prime-video-ultra-no-ads-price-increase-1236687124/" }
    ]
  },
  {
    id: "amazon-prime", name: "Amazon Prime", category: "Membership", domain: "amazon.com",
    subscribers: { count: "200M+", asOf: "2026", note: "Global Prime members (not broken out by Prime Video usage specifically).", source: "https://www.sellcell.com/blog/how-many-subscribers-do-netflix-disney-amazon-prime-video-and-other-streaming-services-have/" },
    priceHistory: [
      { date: "2022-02-18", planLabel: "Annual", oldPrice: 119, newPrice: 139, currency: "USD", note: "First Prime price increase since 2018; unchanged since.", source: "https://www.kiplinger.com/personal-finance/spending/604171/amazon-raising-annual-fees-for-amazon-prime-membership" },
      { date: "2022-02-18", planLabel: "Monthly", oldPrice: 13, newPrice: 15, currency: "USD", note: "", source: "https://www.rollingstone.com/product-recommendations/lifestyle/amazon-prime-price-subscription-membership-1294862/" }
    ]
  },
  {
    id: "crunchyroll", name: "Crunchyroll", category: "Streaming", domain: "crunchyroll.com",
    subscribers: { count: "17M+", asOf: "~Q1 2025", note: "", source: "https://expandedramblings.com/index.php/crunchyroll-facts-statistics/" },
    priceHistory: [
      { date: "2026-03-04", planLabel: "Fan", oldPrice: 7.99, newPrice: 9.99, currency: "USD", note: "Raised right after removing its free ad-supported tier.", source: "https://alternativeto.net/news/2026/2/crunchyroll-raises-prices-for-all-plans-in-the-us-right-after-killing-its-free-tier" },
      { date: "2026-03-04", planLabel: "Mega Fan", oldPrice: 11.99, newPrice: 13.99, currency: "USD", note: "", source: "https://alternativeto.net/news/2026/2/crunchyroll-raises-prices-for-all-plans-in-the-us-right-after-killing-its-free-tier" },
      { date: "2026-03-04", planLabel: "Ultimate Fan", oldPrice: 15.99, newPrice: 17.99, currency: "USD", note: "", source: "https://alternativeto.net/news/2026/2/crunchyroll-raises-prices-for-all-plans-in-the-us-right-after-killing-its-free-tier" }
    ]
  },
  {
    id: "espn", name: "ESPN", category: "Live TV", domain: "espn.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "ESPN Unlimited", oldPrice: null, newPrice: 29.99, currency: "USD", note: "Current reference price for ESPN's direct-to-consumer streaming tier. No confirmed prior change found.", source: "https://www.pcworld.com/article/582896/best-streaming-tv-service.html" }
    ]
  },
  {
    id: "sling-tv", name: "Sling TV", category: "Live TV", domain: "sling.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Orange", oldPrice: null, newPrice: 45.99, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.fubo.tv/stream/compare/fubo-vs-sling/" },
      { date: "2026-01-01", planLabel: "Blue", oldPrice: null, newPrice: 45.99, currency: "USD", note: "", source: "https://www.fubo.tv/stream/compare/fubo-vs-sling/" },
      { date: "2026-01-01", planLabel: "Orange & Blue", oldPrice: null, newPrice: 60.99, currency: "USD", note: "", source: "https://www.fubo.tv/stream/compare/fubo-vs-sling/" }
    ]
  },
  {
    id: "youtube-tv", name: "YouTube TV", category: "Live TV", domain: "youtube.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Sports + News", oldPrice: null, newPrice: 55.99, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.pcworld.com/article/582896/best-streaming-tv-service.html" },
      { date: "2026-01-01", planLabel: "Base plan", oldPrice: null, newPrice: 82.99, currency: "USD", note: "", source: "https://www.pcworld.com/article/582896/best-streaming-tv-service.html" }
    ]
  },
  {
    id: "fubotv", name: "fuboTV", category: "Live TV", domain: "fubo.tv",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Fubo Sports", oldPrice: null, newPrice: 64.99, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.fubo.tv/stream/compare/fubo-vs-sling/" },
      { date: "2026-01-01", planLabel: "Pro", oldPrice: null, newPrice: 73.99, currency: "USD", note: "", source: "https://www.fubo.tv/stream/compare/fubo-vs-sling/" }
    ]
  },
  {
    id: "apple-tv-plus", name: "Apple TV+", category: "Streaming", domain: "apple.com",
    priceHistory: [
      { date: "2025-08-01", planLabel: "Standard", oldPrice: 9.99, newPrice: 12.99, currency: "USD", note: "", source: "https://deadline.com/2026/07/apple-increases-prices-music-one-subscriptions-1236997295/" }
    ]
  },
  {
    id: "apple-music", name: "Apple Music", category: "Music", domain: "apple.com",
    priceHistory: [
      { date: "2026-07-17", planLabel: "Individual", oldPrice: 10.99, newPrice: 11.99, currency: "USD", note: "First hike in ~4 years; Apple cites rising licensing costs.", source: "https://9to5mac.com/2026/07/17/apple-raises-prices-for-apple-music-and-apple-one-subscriptions/" },
      { date: "2026-07-17", planLabel: "Family", oldPrice: 16.99, newPrice: 19.99, currency: "USD", note: "", source: "https://9to5mac.com/2026/07/17/apple-raises-prices-for-apple-music-and-apple-one-subscriptions/" },
      { date: "2026-07-17", planLabel: "Student", oldPrice: 5.99, newPrice: 6.99, currency: "USD", note: "", source: "https://9to5mac.com/2026/07/17/apple-raises-prices-for-apple-music-and-apple-one-subscriptions/" }
    ]
  },
  {
    id: "youtube-music", name: "YouTube Music", category: "Music", domain: "youtube.com",
    priceHistory: [
      { date: "2025-06-01", planLabel: "Individual", oldPrice: 10.99, newPrice: 11.99, currency: "USD", note: "Approximate timing — reported alongside YouTube Premium's increase.", source: "https://variety.com/2026/digital/news/youtube-premium-pirce-increase-youtube-music-us-1236713223/" },
      { date: "2025-06-01", planLabel: "Family", oldPrice: 16.99, newPrice: 18.99, currency: "USD", note: "", source: "https://variety.com/2026/digital/news/youtube-premium-pirce-increase-youtube-music-us-1236713223/" }
    ]
  },
  {
    id: "amazon-music-unlimited", name: "Amazon Music Unlimited", category: "Music", domain: "amazon.com",
    priceHistory: [
      { date: "2026-03-05", planLabel: "Individual", oldPrice: null, newPrice: 12.99, currency: "USD", note: "$11.99/mo for Amazon Prime members. Current reference price.", source: "https://musically.com/2026/02/06/amazon-music-increases-subscription-prices-in-the-us-and-uk/" },
      { date: "2026-03-05", planLabel: "Family", oldPrice: 16.58, newPrice: 18.25, annualPrice: 219, currency: "USD", note: "Family plan (up to 6 accounts) is billed annually only — real annual price rose from $199 to $219/yr; monthly-equivalent shown here for comparison.", source: "https://musically.com/2026/02/06/amazon-music-increases-subscription-prices-in-the-us-and-uk/" }
    ]
  },
  {
    id: "tidal", name: "Tidal", category: "Music", domain: "tidal.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Individual", oldPrice: null, newPrice: 10.99, currency: "USD", note: "Current reference price, ahead of the confirmed August 2026 increase (see forecast).", source: "https://basic-tutorials.com/news/tidal-price-increase-in-2026-individual-subscription-to-cost-12-99-euros-starting-in-august/" },
      { date: "2026-01-01", planLabel: "Family", oldPrice: null, newPrice: 19.99, currency: "USD", note: "", source: "https://support.tidal.com/hc/en-us/articles/115003662825-Subscription-Types" },
      { date: "2026-01-01", planLabel: "Student", oldPrice: null, newPrice: 6.99, currency: "USD", note: "", source: "https://support.tidal.com/hc/en-us/articles/115003662825-Subscription-Types" }
    ],
    forecast: {
      date: "2026-08-03",
      note: "Individual rising to $12.99/mo (Family and Student tiers also rising, by roughly $3 and $1.50/mo respectively) — officially announced.",
      source: "https://basic-tutorials.com/news/tidal-price-increase-in-2026-individual-subscription-to-cost-12-99-euros-starting-in-august/"
    }
  },
  {
    id: "audible", name: "Audible", category: "News & Reading", domain: "audible.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Standard (1 credit/mo)", oldPrice: null, newPrice: 8.99, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.amazon.com/hz/audible/mlp/mdp/discovery/paid" }
    ]
  },
  {
    id: "youtube-premium", name: "YouTube Premium", category: "Video", domain: "youtube.com",
    priceHistory: [
      { date: "2025-06-01", planLabel: "Individual", oldPrice: 13.99, newPrice: 15.99, currency: "USD", note: "First US increase since 2023.", source: "https://variety.com/2026/digital/news/youtube-premium-pirce-increase-youtube-music-us-1236713223/" },
      { date: "2025-06-01", planLabel: "Family (up to 6 accounts)", oldPrice: 22.99, newPrice: 26.99, currency: "USD", note: "", source: "https://variety.com/2026/digital/news/youtube-premium-pirce-increase-youtube-music-us-1236713223/" }
    ]
  },
  {
    id: "apple-one", name: "Apple One", category: "Bundle", domain: "apple.com",
    priceHistory: [
      { date: "2026-07-17", planLabel: "Family", oldPrice: 25.95, newPrice: 27.95, currency: "USD", note: "Individual tier unchanged at $19.95.", source: "https://deadline.com/2026/07/apple-increases-prices-music-one-subscriptions-1236997295/" },
      { date: "2026-07-17", planLabel: "Premier", oldPrice: 37.95, newPrice: 39.95, currency: "USD", note: "", source: "https://deadline.com/2026/07/apple-increases-prices-music-one-subscriptions-1236997295/" }
    ]
  },
  {
    id: "adobe-creative-cloud", name: "Adobe Creative Cloud", category: "Software", domain: "adobe.com",
    priceHistory: [
      { date: "2025-08-01", planLabel: "Creative Cloud Standard", oldPrice: null, newPrice: 54.99, annualPrice: 659.88, currency: "USD", note: "\"All Apps\" plan discontinued and split into Standard and Pro — up to a 16.7% increase for some subscribers, bundling in generative-AI tools. Sold as an annual commitment billed monthly, so the annual price is exact (54.99 × 12), not a discount.", source: "https://licenseware.io/adobe-licensing-pricing-changes-comprehensive-analysis-of-2025-updates/" },
      { date: "2025-08-01", planLabel: "Creative Cloud Pro", oldPrice: null, newPrice: 69.99, annualPrice: 839.88, currency: "USD", note: "Only Pro plan includes premium features without a separate Firefly (AI) subscription. Same annual-commitment billing as Standard.", source: "https://licenseware.io/adobe-licensing-pricing-changes-comprehensive-analysis-of-2025-updates/" }
    ]
  },
  {
    id: "microsoft-365", name: "Microsoft 365", category: "Software", domain: "microsoft.com",
    priceHistory: [
      { date: "2025-02-14", planLabel: "Family", oldPrice: 8.33, newPrice: 10.83, annualPrice: 129.99, currency: "USD", note: "Real change was to the annual-commitment price: $99.99/yr → $129.99/yr (up to 6 people, 1TB each). Monthly-equivalent shown here for consistency with other rows.", source: "https://learn.microsoft.com/en-us/answers/questions/5879392/huge-increase-in-the-price-of-ms-365-personal-subs" },
      { date: "2026-01-01", planLabel: "Personal", oldPrice: null, newPrice: 9.99, currency: "USD", note: "Current reference monthly price (no annual-commitment change confirmed for this tier).", source: "https://www.microsoft.com/en-us/microsoft-365/p/microsoft-365-personal/cfq7ttc0k5bf" },
      { date: "2026-01-01", planLabel: "Family", oldPrice: null, newPrice: 12.99, annualPrice: 129.99, currency: "USD", note: "Current reference monthly price; cheaper as an annual commitment ($129.99/yr).", source: "https://www.microsoft.com/en-us/microsoft-365/p/microsoft-365-family/cfq7ttc0k5dm" },
      { date: "2025-04-01", planLabel: "Business (annual contract, paid monthly)", oldPrice: null, newPrice: null, currency: "USD", note: "5% price increase for business annual-contract subscribers paying monthly — not a consumer plan.", source: "https://corsicatech.com/blog/microsoft-365-price-increase/" },
      { date: "2026-07-01", planLabel: "Commercial suite", oldPrice: null, newPrice: null, currency: "USD", note: "~16% average increase for commercial/business plans, citing expanded AI/security/management features — not a consumer plan.", source: "https://www.ciodive.com/news/microsoft-365-ai-tools-higher-price/807189/" }
    ]
  },
  {
    id: "chatgpt-plus", name: "ChatGPT Plus", category: "AI Tools", domain: "openai.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Plus", oldPrice: null, newPrice: 20, currency: "USD", note: "Current reference price. Has held at $20/mo since its Feb 2023 launch, as far as could be confirmed here.", source: "https://aipricecompare.org/" }
    ]
  },
  {
    id: "perplexity-pro", name: "Perplexity Pro", category: "AI Tools", domain: "perplexity.ai",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Pro", oldPrice: null, newPrice: 20, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://aipricecompare.org/" }
    ]
  },
  {
    id: "claude-pro", name: "Claude Pro", category: "AI Tools", domain: "anthropic.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Pro", oldPrice: null, newPrice: 20, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://aipricecompare.org/" }
    ]
  },
  {
    id: "notion", name: "Notion", category: "Productivity", domain: "notion.so",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Plus", oldPrice: null, newPrice: 10, annualPrice: 120, currency: "USD", note: "Per member, billed annually; $12/mo if billed monthly. No confirmed prior change found.", source: "https://www.eesel.ai/blog/notion-pricing" },
      { date: "2026-01-01", planLabel: "Business", oldPrice: null, newPrice: 20, annualPrice: 240, currency: "USD", note: "Per member, billed annually; $24/mo if billed monthly. Full Notion AI is now bundled into this tier.", source: "https://www.eesel.ai/blog/notion-pricing" }
    ]
  },
  {
    id: "canva-pro", name: "Canva Pro", category: "Software", domain: "canva.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Pro (individual)", oldPrice: 12.99, newPrice: 15, currency: "USD", note: "Exact date approximate.", source: "https://costbench.com/software/design/canva/" },
      { date: "2026-01-01", planLabel: "Business (per user)", oldPrice: null, newPrice: 20, annualPrice: 200, currency: "USD", note: "Formerly called \"Teams\". Enterprise tier is custom-quoted (50+ users).", source: "https://costbench.com/software/design/canva/" }
    ]
  },
  {
    id: "grammarly", name: "Grammarly", category: "Software", domain: "grammarly.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Pro (billed annually)", oldPrice: null, newPrice: 12, annualPrice: 144, currency: "USD", note: "Current reference price, billed annually; $30/mo if billed month-to-month. No confirmed prior change found.", source: "https://www.demandsage.com/how-much-is-grammarly-premium/" },
      { date: "2026-01-01", planLabel: "Business (billed annually)", oldPrice: null, newPrice: 33, currency: "USD", note: "Per member, billed annually. Enterprise tier is custom-quoted.", source: "https://www.eesel.ai/blog/grammarly-pricing" }
    ]
  },
  {
    id: "linkedin-premium", name: "LinkedIn Premium", category: "Productivity", domain: "linkedin.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Career", oldPrice: null, newPrice: 29.99, annualPrice: 239.88, currency: "USD", note: "Current reference price (33% cheaper billed annually). No confirmed prior change found.", source: "https://connectsafely.ai/articles/linkedin-premium-pricing-cost-guide-2026" },
      { date: "2026-01-01", planLabel: "Business", oldPrice: null, newPrice: 59.99, annualPrice: 671.88, currency: "USD", note: "Monthly-only billing is $69.99/mo; annual works out to ~$55.99/mo effective. Prices vary by region/account history.", source: "https://salesbread.com/how-much-does-linkedin-premium-cost/" }
    ]
  },
  {
    id: "todoist", name: "Todoist", category: "Productivity", domain: "todoist.com",
    priceHistory: [
      { date: "2025-12-01", planLabel: "Pro", oldPrice: 4, newPrice: 5, currency: "USD", note: "Billed annually ($60/yr); $7/mo if billed monthly. Exact December 2025 date approximate.", source: "https://www.todoist.com/help/articles/todoist-pro-pricing-update-in-2025-bxBvHZuJZ" },
      { date: "2025-12-01", planLabel: "Business (per user)", oldPrice: null, newPrice: 8, annualPrice: 96, currency: "USD", note: "Billed annually; $10/mo if billed monthly.", source: "https://www.todoist.com/help/articles/todoist-pro-pricing-update-in-2025-bxBvHZuJZ" }
    ]
  },
  {
    id: "1password", name: "1Password", category: "Security", domain: "1password.com",
    priceHistory: [
      { date: "2026-03-27", planLabel: "Individual", oldPrice: 3.99, newPrice: 4.99, currency: "USD", note: "Up to a 33% increase; pricing had been largely unchanged for years.", source: "https://alternativeto.net/news/2026/2/1password-to-raise-subscription-prices-for-individual-and-family-plans-by-up-to-33-" },
      { date: "2026-03-27", planLabel: "Family", oldPrice: 6.95, newPrice: 7.99, currency: "USD", note: "", source: "https://alternativeto.net/news/2026/2/1password-to-raise-subscription-prices-for-individual-and-family-plans-by-up-to-33-" }
    ]
  },
  {
    id: "nordvpn", name: "NordVPN", category: "Security", domain: "nordvpn.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Basic (1-month)", oldPrice: null, newPrice: 12.99, currency: "USD", note: "Current reference price; four tiers exist (Basic, Plus, Complete, Prime). No confirmed prior change found.", source: "https://cybernews.com/best-vpn/nordvpn-review/nordvpn-cost/" }
    ]
  },
  {
    id: "bitwarden", name: "Bitwarden", category: "Security", domain: "bitwarden.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Premium", oldPrice: 0.83, newPrice: 1.65, annualPrice: 19.8, currency: "USD", note: "Real change was to the annual price: $9.99/yr → $19.80/yr — a 98% increase and the first Premium price hike in Bitwarden's 10-year history. Monthly-equivalent shown here for consistency.", source: "https://safepasswordgenerator.net/blog/bitwarden-pricing-2026/" }
    ]
  },
  {
    id: "expressvpn", name: "ExpressVPN", category: "Security", domain: "expressvpn.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Basic (2-year plan)", oldPrice: null, newPrice: 2.49, currency: "USD", note: "Current reference price; rate applies to the 2-year term. No confirmed prior change found.", source: "https://cybernews.com/best-vpn/expressvpn-review/expressvpn-cost/" }
    ]
  },
  {
    id: "dropbox", name: "Dropbox", category: "Cloud Storage", domain: "dropbox.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Plus (2TB)", oldPrice: null, newPrice: 11.99, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.spliiit.com/en/blog/dropbox-vs-google-one-vs-icloud-comparatif" }
    ]
  },
  {
    id: "google-one", name: "Google One", category: "Cloud Storage", domain: "one.google.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "2TB", oldPrice: null, newPrice: 9.99, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.spliiit.com/en/blog/google-one-vs-icloud-vs-dropbox" }
    ]
  },
  {
    id: "icloud-plus", name: "iCloud+", category: "Cloud Storage", domain: "icloud.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "2TB", oldPrice: null, newPrice: 9.99, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.spliiit.com/en/blog/google-one-vs-icloud-vs-dropbox" }
    ]
  },
  {
    id: "xbox-game-pass", name: "Xbox Game Pass", category: "Gaming", domain: "xbox.com",
    subscribers: { count: "~30-40M", asOf: "2026", note: "Reports vary; Microsoft last officially confirmed 34M in Feb 2024. Fell after the Ultimate tier's 2025 price hike.", source: "https://sqmagazine.co.uk/xbox-game-pass-subscriber/" },
    priceHistory: [
      { date: "2025-11-01", planLabel: "Ultimate", oldPrice: 19.99, newPrice: 29.99, currency: "USD", note: "Renamed tiers (Core→Essential, Standard→Premium) alongside the Ultimate hike.", source: "https://www.thegamebusiness.com/p/xbox-game-pass-ultimate-price-jumps" },
      { date: "2026-04-21", planLabel: "Ultimate", oldPrice: 29.99, newPrice: 22.99, currency: "USD", note: "Cut back down after a subscriber backlash.", source: "https://tech-insider.org/game-pass-vs-playstation-plus-2026/" }
    ]
  },
  {
    id: "playstation-plus", name: "PlayStation Plus", category: "Gaming", domain: "playstation.com",
    subscribers: { count: "47M", asOf: "Mar 31, 2026", note: "Premium tier alone: 23.7M.", source: "https://coopboardgames.com/statistics/playstation-plus-subscribers/" },
    priceHistory: [
      { date: "2026-05-20", planLabel: "Premium", oldPrice: 14.99, newPrice: 17.99, currency: "USD", note: "", source: "https://tech-insider.org/ps-plus-price-increase-2026/" },
      { date: "2026-05-01", planLabel: "Essential", oldPrice: null, newPrice: 10.99, currency: "USD", note: "", source: "https://tech-insider.org/ps-plus-price-increase-2026/" },
      { date: "2026-05-01", planLabel: "Extra", oldPrice: 14.99, newPrice: 16.99, annualPrice: 134.99, currency: "USD", note: "Annual price unchanged since September 2023.", source: "https://tech-insider.org/playstation-plus-tiers-2026/" }
    ]
  },
  {
    id: "nintendo-switch-online", name: "Nintendo Switch Online", category: "Gaming", domain: "nintendo.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Individual", oldPrice: null, newPrice: 1.67, annualPrice: 19.99, currency: "USD", note: "Nintendo doesn't sell a standard monthly plan — priced annually only. Monthly-equivalent shown for comparison with other rows.", source: "https://www.nintendo.com/us/online/" },
      { date: "2026-01-01", planLabel: "Family (up to 8 accounts)", oldPrice: null, newPrice: 2.92, annualPrice: 34.99, currency: "USD", note: "Annual only, no monthly plan. Expansion Pack tiers also exist at $49.99/yr (individual) and $79.99/yr (family).", source: "https://www.nintendo.com/us/online/" }
    ]
  },
  {
    id: "peloton", name: "Peloton", category: "Fitness", domain: "onepeloton.com",
    subscribers: { count: "5.8M", asOf: "2026", note: "2.66M connected-fitness members + 522K digital-only subscribers, combined.", source: "https://backlinko.com/peloton-users" },
    priceHistory: [
      { date: "2025-10-31", planLabel: "All-Access Membership", oldPrice: 44, newPrice: 49.99, currency: "USD", note: "Announced alongside a hardware/AI revamp.", source: "https://www.cnbc.com/2025/10/01/peloton-revamps-equipment-raises-prices-ahead-of-holidays-.html" },
      { date: "2025-10-31", planLabel: "App+ Membership", oldPrice: 24, newPrice: 28.99, currency: "USD", note: "", source: "https://www.cnbc.com/2025/10/01/peloton-revamps-equipment-raises-prices-ahead-of-holidays-.html" },
      { date: "2025-10-31", planLabel: "App One Membership", oldPrice: 12.99, newPrice: 15.99, currency: "USD", note: "", source: "https://www.cnbc.com/2025/10/01/peloton-revamps-equipment-raises-prices-ahead-of-holidays-.html" }
    ]
  },
  {
    id: "planet-fitness", name: "Planet Fitness", category: "Fitness", domain: "planetfitness.com",
    priceHistory: [
      { date: "2024-06-01", planLabel: "Classic Card (new members)", oldPrice: 10, newPrice: 15, currency: "USD", note: "First change to the iconic $10 rate since 1998; exact date varies by club.", source: "https://www.cbsnews.com/news/planet-fitness-raises-membership-fee-for-first-time-since-1998/" }
    ],
    forecast: {
      date: null,
      note: "Black Card membership expected to rise from $24.99 to $29.99/mo \"after the 2026 peak join season\" — no specific date announced.",
      source: "https://finance.yahoo.com/news/planet-fitness-inc-announces-fourth-113000255.html"
    }
  },
  {
    id: "headspace", name: "Headspace", category: "Fitness", domain: "headspace.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Individual", oldPrice: null, newPrice: 13, annualPrice: 70, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.forbes.com/sites/forbes-personal-shopper/2026/03/08/headspace-discount/" }
    ]
  },
  {
    id: "calm", name: "Calm", category: "Fitness", domain: "calm.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Individual", oldPrice: null, newPrice: 14.99, annualPrice: 69.99, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://thedolceway.com/blog/calm-app-cost-pricing-guide" }
    ]
  },
  {
    id: "strava", name: "Strava", category: "Fitness", domain: "strava.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Individual", oldPrice: null, newPrice: 11.99, annualPrice: 79.99, currency: "USD", note: "Family plan also available at $139.99/yr, and a Strava + Runna bundle at $149.99/yr. No confirmed prior change found.", source: "https://www.strava.com/pricing" }
    ]
  },
  {
    id: "weightwatchers", name: "WeightWatchers (WW)", category: "Fitness", domain: "weightwatchers.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Core (digital)", oldPrice: null, newPrice: 23, currency: "USD", note: "Regular price after the promotional period; some new members pay a temporary $10/mo intro rate.", source: "https://currywurstmuseum.com/weight-watchers-cost/" },
      { date: "2026-01-01", planLabel: "Premium (with workshops)", oldPrice: null, newPrice: 54.95, currency: "USD", note: "Regular price after a 6-month promotional rate of $49.95.", source: "https://currywurstmuseum.com/weight-watchers-cost/" }
    ]
  },
  {
    id: "duolingo-super", name: "Duolingo Super", category: "Education", domain: "duolingo.com",
    subscribers: { count: "12.5M", asOf: "Q1 2026", note: "Paid subscribers.", source: "https://www.classcentral.com/report/duolingo-q1-2026" },
    priceHistory: [
      { date: "2026-01-01", planLabel: "Super (individual)", oldPrice: null, newPrice: 12.99, annualPrice: 95.99, currency: "USD", note: "Annual works out to roughly 38% cheaper than paying monthly. No confirmed prior change found.", source: "https://www.myengineeringbuddy.com/blog/duolingo-reviews-pricing-alternatives-2026/" }
    ]
  },
  {
    id: "skillshare", name: "Skillshare", category: "Education", domain: "skillshare.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Annual", oldPrice: null, newPrice: 13.99, annualPrice: 168, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://studelp.com/how-much-does-skillshare-cost.html" }
    ]
  },
  {
    id: "coursera-plus", name: "Coursera Plus", category: "Education", domain: "coursera.org",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Coursera Plus", oldPrice: null, newPrice: 59, currency: "USD", note: "Current reference price. No confirmed prior change found.", source: "https://www.coursera.org/courseraplus/special/new-year-2026-global" }
    ]
  },
  {
    id: "masterclass", name: "MasterClass", category: "Education", domain: "masterclass.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Standard", oldPrice: null, newPrice: 10, annualPrice: 120, currency: "USD", note: "Annual-only plan, no monthly option — monthly-equivalent shown for comparison. No confirmed prior change found.", source: "https://onlinecourseing.com/masterclass-pricing/" },
      { date: "2026-01-01", planLabel: "Plus", oldPrice: null, newPrice: 15, annualPrice: 180, currency: "USD", note: "Annual-only plan.", source: "https://onlinecourseing.com/masterclass-pricing/" },
      { date: "2026-01-01", planLabel: "Premium", oldPrice: null, newPrice: 20, annualPrice: 240, currency: "USD", note: "Annual-only plan.", source: "https://onlinecourseing.com/masterclass-pricing/" }
    ]
  },
  {
    id: "chegg-study", name: "Chegg Study", category: "Education", domain: "chegg.com",
    priceHistory: [
      { date: "2026-01-01", planLabel: "Basic", oldPrice: null, newPrice: 15.95, currency: "USD", note: "Current reference price; capped at 20 expert questions/mo. No confirmed prior change found.", source: "https://edureviewer.com/blog/how-much-is-chegg/" },
      { date: "2026-01-01", planLabel: "Study Pack", oldPrice: null, newPrice: 19.95, currency: "USD", note: "Adds unlimited questions, a math equation solver, and writing help.", source: "https://edureviewer.com/blog/how-much-is-chegg/" }
    ]
  },
  {
    id: "the-new-york-times", name: "The New York Times", category: "News & Reading", domain: "nytimes.com",
    subscribers: { count: "12.78M", asOf: "End of Q4 2025", note: "Digital-only subscribers.", source: "https://www.sec.gov/Archives/edgar/data/71691/000007169126000008/pressrelease12312025.htm" },
    priceHistory: [
      { date: "2026-01-01", planLabel: "All Access", oldPrice: null, newPrice: 27.08, annualPrice: 325, currency: "USD", note: "NYT bills every 4 weeks ($25/cycle, 13 cycles/yr), not calendar-monthly — figures here are a derived monthly-equivalent. No confirmed prior change found.", source: "https://subbuddy.io/en/services/new-york-times" }
    ]
  },
  {
    id: "costco-membership", name: "Costco Membership", category: "Membership", domain: "costco.com",
    subscribers: { count: "147.2M", asOf: "2026", note: "Total memberships worldwide (cardholders, not unique households).", source: "https://www.statista.com/statistics/718406/costco-number-memberships/" },
    priceHistory: [
      { date: "2024-09-01", planLabel: "Gold Star", oldPrice: 60, newPrice: 65, currency: "USD", note: "First increase since June 2017.", source: "https://www.today.com/food/news/costco-raising-membership-fees-rcna169309" },
      { date: "2024-09-01", planLabel: "Executive", oldPrice: 120, newPrice: 130, currency: "USD", note: "2% reward cap also rose, from $1,000 to $1,250/yr.", source: "https://www.today.com/food/news/costco-raising-membership-fees-rcna169309" }
    ]
  },
  {
    id: "sams-club", name: "Sam's Club", category: "Membership", domain: "samsclub.com",
    priceHistory: [
      { date: "2026-05-01", planLabel: "Club", oldPrice: null, newPrice: 60, currency: "USD", note: "Increased effective May 1, 2026; prior price not confirmed in this research pass.", source: "https://thekrazycouponlady.com/tips/money/sams-club-membership-cost" },
      { date: "2026-05-01", planLabel: "Plus", oldPrice: null, newPrice: 120, currency: "USD", note: "Increased effective May 1, 2026; prior price not confirmed in this research pass.", source: "https://thekrazycouponlady.com/tips/money/sams-club-membership-cost" }
    ]
  }
];
