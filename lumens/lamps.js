// Three lamp styles, each rendered as an inline SVG string. One style is
// picked at random per page load (see game.js) and used for every lamp on
// the sill that session.

const LAMP_STYLE_COUNT = 3;

function brassLampSVG(uid) {
  return `
  <svg viewBox="0 0 100 160" class="lamp-svg" data-style="brass">
    <defs>
      <linearGradient id="brass-metal-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f8e7b0"/>
        <stop offset="45%" stop-color="#c99a44"/>
        <stop offset="100%" stop-color="#5e401a"/>
      </linearGradient>
      <linearGradient id="brass-metal-h-${uid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#5e401a"/>
        <stop offset="45%" stop-color="#e6c073"/>
        <stop offset="100%" stop-color="#6b4a1e"/>
      </linearGradient>
      <linearGradient id="brass-glass-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4aa373"/>
        <stop offset="55%" stop-color="#2c7048"/>
        <stop offset="100%" stop-color="#123420"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="152" rx="6" ry="2" fill="#000" opacity="0.35"/>
    <ellipse cx="50" cy="151" rx="27" ry="6.5" fill="url(#brass-metal-h-${uid})"/>
    <ellipse cx="50" cy="149" rx="20" ry="4" fill="url(#brass-metal-h-${uid})" opacity="0.7"/>
    <circle cx="50" cy="146" r="6" fill="url(#brass-metal-${uid})"/>
    <rect x="47" y="82" width="6" height="66" rx="1.5" fill="url(#brass-metal-h-${uid})"/>
    <rect x="43.5" y="98" width="13" height="3" rx="1" fill="#4a3216"/>
    <rect x="43.5" y="98" width="13" height="1" fill="#f0d48a" opacity="0.6"/>
    <rect x="43.5" y="120" width="13" height="3" rx="1" fill="#4a3216"/>
    <rect x="43.5" y="120" width="13" height="1" fill="#f0d48a" opacity="0.6"/>
    <path d="M15 58 C15 27 30 13 50 13 C70 13 85 27 85 58 C85 67 75 71 50 71 C25 71 15 67 15 58 Z"
          fill="url(#brass-glass-${uid})" stroke="#0e2417" stroke-width="1"/>
    <path d="M22 30 C27 20 36 15 44 14 C40 18 33 25 29 38 C26 34 23 32 22 30 Z"
          fill="#bff0d2" opacity="0.22"/>
    <ellipse cx="50" cy="59" rx="35" ry="6.5" fill="url(#brass-metal-h-${uid})"/>
    <ellipse cx="50" cy="57.5" rx="35" ry="2.4" fill="#f6e2a4" opacity="0.5"/>
    <circle cx="26" cy="59" r="1.3" fill="#5e401a"/>
    <circle cx="74" cy="59" r="1.3" fill="#5e401a"/>
    <circle cx="50" cy="60.5" r="1.3" fill="#5e401a"/>
    <ellipse cx="50" cy="13.5" rx="7" ry="2" fill="url(#brass-metal-h-${uid})"/>
    <circle cx="50" cy="10" r="4.4" fill="url(#brass-metal-${uid})"/>
    <circle cx="48.5" cy="8.5" r="1.3" fill="#fbeecb" opacity="0.7"/>
    <path d="M50 65 Q47 74 45.5 80" fill="none" stroke="#8a6a2f" stroke-width="1"/>
    <circle cx="45.3" cy="82.4" r="2.2" fill="url(#brass-metal-${uid})"/>
    <circle cx="45.3" cy="87.4" r="1.6" fill="url(#brass-metal-${uid})"/>
    <ellipse class="lamp-core lamp-emit" cx="50" cy="61" rx="28" ry="7.5" fill="#ffcf6b"/>
  </svg>`;
}

function tiffanyLampSVG(uid) {
  const paneColors = ["#8a2f3a", "#c9a227", "#2f7a6b", "#d98a1f", "#5a3d8a"];
  const rimPoints = [13, 21, 29, 37, 45, 55, 63, 71, 79, 87];
  const apex = { x: 50, y: 11 };
  let panes = "";
  for (let i = 0; i < rimPoints.length - 1; i++) {
    const x1 = rimPoints[i];
    const x2 = rimPoints[i + 1];
    const color = paneColors[i % paneColors.length];
    panes += `<path d="M${apex.x} ${apex.y} L${x1} 68 L${x2} 68 Z" fill="${color}" opacity="0.92"/>`;
    const mx = (x1 + x2) / 2;
    panes += `<path d="M${apex.x} ${apex.y + 3} L${(apex.x + mx) / 2} 40 L${mx} 68" fill="none" stroke="#fff" stroke-width="0.6" opacity="0.16"/>`;
  }
  let leading = "";
  let beads = "";
  rimPoints.forEach((x, i) => {
    leading += `<line x1="${apex.x}" y1="${apex.y}" x2="${x}" y2="68" stroke="#1a1410" stroke-width="0.7"/>`;
    const r = i % 2 === 0 ? 1.7 : 1.2;
    beads += `<circle cx="${x}" cy="71" r="${r}" fill="${i % 3 === 0 ? "#c9a227" : "#6b4a1e"}"/>`;
  });
  return `
  <svg viewBox="0 0 100 160" class="lamp-svg" data-style="tiffany">
    <defs>
      <linearGradient id="tiffany-metal-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#d7b06a"/>
        <stop offset="50%" stop-color="#8a6a2f"/>
        <stop offset="100%" stop-color="#3a2712"/>
      </linearGradient>
      <clipPath id="tiffany-dome-${uid}">
        <path d="M16 60 C16 30 30 14 50 14 C70 14 84 30 84 60 C84 68 74 72 50 72 C26 72 16 68 16 60 Z"/>
      </clipPath>
    </defs>
    <ellipse cx="50" cy="152" rx="6" ry="2" fill="#000" opacity="0.35"/>
    <ellipse cx="50" cy="151" rx="28" ry="6.5" fill="url(#tiffany-metal-${uid})"/>
    <ellipse cx="50" cy="149" rx="21" ry="4" fill="url(#tiffany-metal-${uid})" opacity="0.75"/>
    <rect x="47" y="90" width="6" height="62" rx="1.5" fill="url(#tiffany-metal-${uid})"/>
    <circle cx="50" cy="112" r="5.5" fill="url(#tiffany-metal-${uid})"/>
    <rect x="44" y="130" width="12" height="2.6" rx="1" fill="#2c1d0d"/>
    <circle cx="50" cy="88" r="5" fill="url(#tiffany-metal-${uid})"/>
    <g clip-path="url(#tiffany-dome-${uid})">
      <rect x="10" y="8" width="80" height="70" fill="#2a2016"/>
      ${panes}
      ${leading}
    </g>
    <path d="M16 60 C16 30 30 14 50 14 C70 14 84 30 84 60 C84 68 74 72 50 72 C26 72 16 68 16 60 Z"
          fill="none" stroke="#241a10" stroke-width="1.5"/>
    ${beads}
    <ellipse cx="50" cy="72" rx="34" ry="5" fill="url(#tiffany-metal-${uid})" opacity="0.92"/>
    <path d="M50 9 C46 9 44 12 44 15 C44 18 47 19.5 50 19.5 C53 19.5 56 18 56 15 C56 12 54 9 50 9 Z"
          fill="url(#tiffany-metal-${uid})"/>
    <circle cx="48" cy="12" r="0.9" fill="#f2dfa0" opacity="0.7"/>
    <ellipse class="lamp-core lamp-emit" cx="50" cy="56" rx="25" ry="19" fill="#ffcf6b"/>
  </svg>`;
}

function edisonLampSVG(uid) {
  return `
  <svg viewBox="0 0 100 160" class="lamp-svg" data-style="edison">
    <defs>
      <linearGradient id="edison-wood-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6b4a30"/>
        <stop offset="100%" stop-color="#2e1e12"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="157" rx="7" ry="2" fill="#000" opacity="0.3"/>
    <path d="M20 152 C36 158 64 158 80 152 L80 156 C64 161 36 161 20 156 Z" fill="#1e130b"/>
    <rect x="33" y="145" width="34" height="9" rx="2" fill="url(#edison-wood-${uid})"/>
    <rect x="33" y="145" width="34" height="2" rx="1" fill="#8a5f3c" opacity="0.6"/>
    <path d="M67 96 C74 112 72 132 62 144" fill="none" stroke="#3a3226" stroke-width="1.4" opacity="0.85"/>
    <path d="M67 96 C74 112 72 132 62 144" fill="none" stroke="#5a4c38" stroke-width="0.6" opacity="0.6" stroke-dasharray="1 2.4"/>
    <path d="M40 144 L40 148 L36 152" fill="none" stroke="#2c2c2c" stroke-width="2" stroke-linecap="round"/>
    <rect x="34.5" y="150" width="11" height="5" rx="1" fill="#161616"/>
    <circle cx="37.5" cy="152.5" r="0.9" fill="#3a3a3a"/>
    <circle cx="42.5" cy="152.5" r="0.9" fill="#3a3a3a"/>
    <rect x="47" y="92" width="6" height="55" fill="#232323"/>
    <rect x="47" y="92" width="2" height="55" fill="#3d3d3d"/>
    <rect x="41" y="80" width="18" height="14" rx="2" fill="#33302c"/>
    <line x1="41" y1="84" x2="59" y2="84" stroke="#1c1a17" stroke-width="0.8"/>
    <line x1="41" y1="88" x2="59" y2="88" stroke="#1c1a17" stroke-width="0.8"/>
    <line x1="41" y1="91.5" x2="59" y2="91.5" stroke="#1c1a17" stroke-width="0.8"/>
    <path d="M50 18 C69 18 80 33 80 50 C80 68 66 80 50 80 C34 80 20 68 20 50 C20 33 31 18 50 18 Z"
          fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
    <path d="M31 32 C34 25 40 20 47 19" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.3" stroke-linecap="round"/>
    <path class="lamp-core"
          d="M42 62 C38 56 38 50 42 47 C46 44 46 40 42 38 M42 47 C46 50 50 50 53 47 C56 44 60 44 63 40"
          fill="none" stroke="#8a6a45" stroke-width="1.7" stroke-linecap="round"/>
    <rect x="48.5" y="80" width="3" height="8" fill="#5a4a30" opacity="0.7"/>
    <circle class="lamp-emit" cx="50" cy="49" r="32" fill="#ffcf6b"/>
  </svg>`;
}

const LAMP_RENDERERS = [brassLampSVG, tiffanyLampSVG, edisonLampSVG];

function renderLamp(styleIndex, uid) {
  return LAMP_RENDERERS[styleIndex % LAMP_RENDERERS.length](uid);
}
