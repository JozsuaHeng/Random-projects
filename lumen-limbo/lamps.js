// Three lamp styles, each rendered as an inline SVG string. One style is
// picked at random per page load (see game.js) and used for every lamp on
// the sill that session.

const LAMP_STYLE_COUNT = 3;

function brassLampSVG(uid) {
  return `
  <svg viewBox="0 0 100 160" class="lamp-svg" data-style="brass">
    <defs>
      <linearGradient id="brass-metal-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f6e2a4"/>
        <stop offset="45%" stop-color="#c99a44"/>
        <stop offset="100%" stop-color="#6b4a1e"/>
      </linearGradient>
      <linearGradient id="brass-glass-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3f8f63"/>
        <stop offset="100%" stop-color="#153a26"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="151" rx="26" ry="6.5" fill="url(#brass-metal-${uid})"/>
    <rect x="47" y="82" width="6" height="70" rx="1.5" fill="url(#brass-metal-${uid})"/>
    <rect x="44" y="100" width="12" height="3" rx="1" fill="#6b4a1e" opacity="0.8"/>
    <rect x="44" y="122" width="12" height="3" rx="1" fill="#6b4a1e" opacity="0.8"/>
    <path d="M15 58 C15 27 30 13 50 13 C70 13 85 27 85 58 C85 67 75 71 50 71 C25 71 15 67 15 58 Z"
          fill="url(#brass-glass-${uid})" stroke="#0e2417" stroke-width="1"/>
    <ellipse cx="50" cy="59" rx="35" ry="6.5" fill="url(#brass-metal-${uid})"/>
    <circle cx="50" cy="12" r="4" fill="url(#brass-metal-${uid})"/>
    <line x1="50" y1="65" x2="45" y2="82" stroke="#8a6a2f" stroke-width="1"/>
    <circle cx="45" cy="84" r="2.2" fill="#c99a44"/>
    <ellipse class="lamp-core lamp-emit" cx="50" cy="61" rx="27" ry="7" fill="#ffcf6b"/>
  </svg>`;
}

function tiffanyLampSVG(uid) {
  const paneColors = ["#8a2f3a", "#c9a227", "#2f7a6b", "#d98a1f"];
  const rimPoints = [12, 22, 33, 44, 55, 66, 77, 88];
  const apex = { x: 50, y: 12 };
  let panes = "";
  for (let i = 0; i < rimPoints.length - 1; i++) {
    const x1 = rimPoints[i];
    const x2 = rimPoints[i + 1];
    const color = paneColors[i % paneColors.length];
    panes += `<path d="M${apex.x} ${apex.y} L${x1} 68 L${x2} 68 Z" fill="${color}" opacity="0.92"/>`;
  }
  let leading = "";
  let beads = "";
  for (const x of rimPoints) {
    leading += `<line x1="${apex.x}" y1="${apex.y}" x2="${x}" y2="68" stroke="#1a1410" stroke-width="0.8"/>`;
    beads += `<circle cx="${x}" cy="71" r="1.6" fill="#8a6a2f"/>`;
  }
  return `
  <svg viewBox="0 0 100 160" class="lamp-svg" data-style="tiffany">
    <defs>
      <linearGradient id="tiffany-metal-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#caa25a"/>
        <stop offset="100%" stop-color="#4a3218"/>
      </linearGradient>
      <clipPath id="tiffany-dome-${uid}">
        <path d="M16 60 C16 30 30 14 50 14 C70 14 84 30 84 60 C84 68 74 72 50 72 C26 72 16 68 16 60 Z"/>
      </clipPath>
    </defs>
    <ellipse cx="50" cy="151" rx="27" ry="6.5" fill="url(#tiffany-metal-${uid})"/>
    <rect x="47" y="90" width="6" height="62" rx="1.5" fill="url(#tiffany-metal-${uid})"/>
    <circle cx="50" cy="88" r="5" fill="url(#tiffany-metal-${uid})"/>
    <g clip-path="url(#tiffany-dome-${uid})">
      <rect x="10" y="8" width="80" height="70" fill="#2a2016"/>
      ${panes}
      ${leading}
    </g>
    <path d="M16 60 C16 30 30 14 50 14 C70 14 84 30 84 60 C84 68 74 72 50 72 C26 72 16 68 16 60 Z"
          fill="none" stroke="#241a10" stroke-width="1.4"/>
    ${beads}
    <ellipse cx="50" cy="72" rx="34" ry="5" fill="url(#tiffany-metal-${uid})" opacity="0.9"/>
    <ellipse class="lamp-core lamp-emit" cx="50" cy="58" rx="24" ry="18" fill="#ffcf6b"/>
  </svg>`;
}

function edisonLampSVG(uid) {
  return `
  <svg viewBox="0 0 100 160" class="lamp-svg" data-style="edison">
    <defs>
      <linearGradient id="edison-wood-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#5a3d28"/>
        <stop offset="100%" stop-color="#2e1e12"/>
      </linearGradient>
    </defs>
    <rect x="33" y="146" width="34" height="9" rx="2" fill="url(#edison-wood-${uid})"/>
    <rect x="47" y="92" width="6" height="55" fill="#232323"/>
    <rect x="41" y="82" width="18" height="12" rx="2" fill="#33302c"/>
    <path d="M50 20 C68 20 79 34 79 50 C79 67 66 78 50 78 C34 78 21 67 21 50 C21 34 32 20 50 20 Z"
          fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
    <path class="lamp-core"
          d="M39 60 C39 50 44 46 50 50 C56 54 61 50 61 42 M50 50 L50 60"
          fill="none" stroke="#8a6a45" stroke-width="1.8" stroke-linecap="round"/>
    <circle class="lamp-emit" cx="50" cy="50" r="30" fill="#ffcf6b"/>
  </svg>`;
}

const LAMP_RENDERERS = [brassLampSVG, tiffanyLampSVG, edisonLampSVG];

function renderLamp(styleIndex, uid) {
  return LAMP_RENDERERS[styleIndex % LAMP_RENDERERS.length](uid);
}
