# CLAUDE.md

## What this project is

**Free Bitcoins** (folder: `bitcoin-faucet/`, renamed from an earlier
`onboarding-hell/` — this project started as a multi-step form-wizard
satire and evolved into this faucet concept; see git history if that
earlier shape is ever relevant) is a satirical faucet page styled closely
after the actual first Bitcoin faucet website from 2012: a large red
clipart faucet icon, a big grey "Free Bitcoins" title, black Arial body
text, an old-style red-bordered "captcha" widget with wavy/rotated grey
text over a tan input row, a narrow sidebar showing an available balance
and a list of other sites, and a few short Q&A sections at the bottom
signed by the site's creator. This page matches that layout, typography,
and Bitcoin-orange/฿-symbol branding closely — except instead of solving
one CAPTCHA to claim real Bitcoin, the visitor has to answer a literally
never-ending stream of short, genuinely answerable questions (arithmetic
and simple trivia, not absurd riddles) to "claim" it, and nothing real is
ever actually sent.

**Deliberate departures from the real page, and why:** the reference page
is a real, historical site created and signed by a specific real person
(Bitcoin developer Gavin Andresen), linking to real organizations
(bitcoin.org, an exchange) and collecting a real Bitcoin address to send
real currency to. This project leans hard into the *visual* identity —
the ฿ symbol, Bitcoin-orange accents, "Free Bitcoins" as the literal
title/copy, the FAQ headings verbatim ("What are Bitcoins?" etc.), the
two-tier captcha-box-then-claim-button layout — but three specific things
are kept different on purpose, because they're what would turn "styled
like a Bitcoin faucet" into "could pass as a real one or a real person's
page":
  - **No real signature.** The sign-off is "-- not Gavin, not Satoshi,
    just a guy with a faucet" — a joke that explicitly disclaims real
    identity rather than borrowing one. Never replace this with a real
    name.
  - **No address-collection field, ever.** The reference page's "Your
    Bitcoin Address: [___] [Get Some!]" became a single "Type your
    answer" field inside the captcha box, with the "Get Some!" button
    moved to its own row below (`.claim-row`) purely for layout fidelity
    to the reference's two-tier structure — there is still no field
    anywhere on this page shaped like "enter your wallet/address here."
    The FAQ ("How do I get a Bitcoin Receiving Address?", "I've got
    Bitcoins; how can I help?") explicitly tells visitors this faucet
    never sends or accepts anything real and asks them not to send
    anything here. Keep that disclaimer if those sections are ever
    edited — it's load-bearing, not filler.
  - "Other Sites" in the sidebar are invented, clearly-fictional joke
    names ("TotallyLegitFaucet.biz," "Free Coins 4 U") riffing on
    early-2010s sketchy-internet vibes rather than any real organization,
    and stay plain text, never links — this project doesn't fabricate or
    link to any external domain.
If this project is ever pushed even further toward the reference, keep
re-checking against this list — the line is "looks like this style of
page," not "could be mistaken for the real one, a real endorsement, or a
real financial flow."

**On personal data / PII (carried over from earlier versions, still
load-bearing):** none of the generated questions ask for real identifying
information — no real name, email, phone number, or anything that reads
as actual data collection.

**On question difficulty:** an earlier version generated absurd,
deliberately unanswerable questions (targeting a goose, a haunted
stapler, etc.) as the joke. That was replaced with genuinely answerable
arithmetic and trivia — the joke now is purely the endlessness/grind, not
the questions being nonsensical. Keep new questions solvable if extending
`TRIVIA` in `app.js`.

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no backend, no external
font — matching the reference page's era, this one doesn't even load a
webfont, just system Arial/Helvetica. Nothing is submitted or stored
anywhere; all state is in-memory JS that resets on refresh.

- `index.html` — icon + title header. The faucet icon (`.faucet-icon`,
  rendered at `185×230`, `viewBox="0 0 108 134"`) has gone through
  several concepts: blocky rects, a smooth gradient tube with a wheel
  handle, then a more detailed wall-mounted spigot with a cross/plus
  valve handle (matching the reference page's actual icon shape) — all
  wall-spigot variations. The current version abandons that concept
  entirely for a **kitchen/bathroom gooseneck faucet** instead: a
  counter-mount base (`<ellipse>`, grey gradient), a short vertical riser
  with a single lever handle sticking out to the side (`transform=
  "rotate(-18 30 72)"` on a rounded rect), and — the key shape — the
  neck is **one continuous cubic-bezier `<path>`**
  (`M34 62 C34 10, 90 10, 90 48 V78`) stroked thick with
  `stroke-linecap="round"`, arcing up from the riser, over the top, and
  down to the spout in a single smooth curve, rather than being built
  from separate straight/curved segments. This was a deliberate pivot
  away from trying to match the reference page's specific wall-spigot
  icon shape more closely (three attempts at that didn't land) toward a
  faucet silhouette that's more universally recognizable on its own
  terms — if revisited again, that's the tradeoff being made: less
  literal fidelity to the reference screenshot's icon, more of a
  standalone "nice icon." Same supporting techniques as before: a
  gradient highlight streak roughly parallel to the neck path for a
  glossy look, a two-ellipse nozzle (rim + darker opening), a blurred
  `<ellipse>` ground shadow (`filter="url(#faucetShadow)"`), and it
  drips small ฿-coin shapes instead of water as the running sight gag.
  `favicon.svg` and the hub tile's `.ns-faucet` use a simplified version
  of the same gooseneck-arc-plus-coin composition (no base/riser/handle,
  since those wash out at 16–26px) — keep the single continuous curved
  path technique if this icon is revisited again, since that's what
  makes the neck read as one smooth piece rather than a joint.
  Below the header: a narrow sidebar (available count + "Other Sites"),
  and a main column: `.captcha-box` (current question in `#questionText`
  — plain, italic, well-aligned text; an earlier version rendered each
  word as a separately-rotated span for a "distorted" look, but that read
  as broken/misaligned rather than intentional, so it's back to normal
  text — two small circular `.icon-btn`s — one a working reload, one a
  disabled "audio not available" joke — and a `.captcha-input-row` with
  the answer field), then a separate `.claim-row` holding just the
  "Get Some!" button (mirrors the reference's two-tier "captcha box,
  then a distinct claim action below" layout), a `.verifying` status
  line, `#transcript` (grows below as questions are answered), then four
  static Q&A sections at the bottom mirroring the reference page's
  structure (see disclaimer note above on the middle two).
- `app.js`:
  - **The question generator is the core technique.** Two sources mixed
    ~50/50: `generateMathQuestion()` picks two random numbers (2–19) and
    an operator (+, -, ×) — genuinely infinite, no pool to exhaust,
    subtraction is order-corrected so it never goes negative — and
    `TRIVIA`, a ~30-item pool of plain answerable general-knowledge/word
    questions ("What is the capital of France?", "Spell the word
    'blockchain'."). `generateQuestion()` rejects an exact immediate
    repeat of `lastQuestion`.
  - `showQuestion()` — generates a question and sets it as
    `questionText.textContent` directly, then focuses the input. The
    reload button (`reloadBtn`) calls this directly without counting it
    as an answer.
  - `handleSubmit()` — archives the just-answered Q&A into `#transcript`
    as a greyed-out entry (styled via CSS `color: #999`, not JS), ticks
    `available` down by a small random amount, shows a brief "verifying"
    line (crypto-flavored message from
    `VERIFYING_MESSAGES` — "Waiting for 6 confirmations…" etc.), then
    reveals the next question.
  - `MILESTONES` — a lookup table keyed by question count (5, 10, 25, 50,
    100, 250, 500) that drops a one-line crypto-culture joke into the
    transcript at that count ("Triple digits. Still no Lambo."). Flavor
    only, no behavior change.
- `style.css` — plain white background, black Arial/Helvetica body text,
  a large light-grey (`#999`) title with an orange (`#f7931a`) ฿ accent,
  and the captcha box's red border / pink-gradient top area / tan bottom
  input row recreated to match the reference's actual visual structure.
  The "Get Some!" button and the sidebar's available count both use
  Bitcoin-orange, everything else stays flat/plain — no shadows or
  rounded-card patterns like the rest of this folder's projects.
- `favicon.svg` — a simplified curved red pipe stroke dripping a
  gradient orange ฿-coin (no handle/bracket, see note above).

## Hub page tile

This project's tile on the `ai-slop/` root hub ("The Quagmire",
`../index.html` + `../style.css`, `data-theme="northstar"` — the CSS
class name predates several renames, including the folder rename to
`bitcoin-faucet/`, and hasn't been changed since it's purely internal)
matches this version: plain white card, red faucet icon with an orange
฿-coin drip, "฿ Free Bitcoins" title, and a small greyed sample question.
Its `href` points at `.../bitcoin-faucet/` — keep that in sync if the
folder is ever renamed again.

## Running it

Open `index.html` directly in a browser — no server needed.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site (linked from "The Quagmire" hub at the `ai-slop/` root — see
`../CLAUDE.md` for the tile convention). No environment variables, API
keys, or build step required.
