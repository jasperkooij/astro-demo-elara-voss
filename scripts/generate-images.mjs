// One-shot script: generates all raster images needed for the portfolio.
// Run once: node scripts/generate-images.mjs
// Requires: sharp (pnpm add sharp)
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

mkdirSync(join(root, 'public'), { recursive: true });
mkdirSync(join(root, 'src/assets/images'), { recursive: true });

async function fromSvg(svgStr, outputPath) {
  const fullPath = join(root, outputPath);
  await sharp(Buffer.from(svgStr)).jpeg({ quality: 88 }).toFile(fullPath);
  console.log(`  ✓ ${outputPath}`);
}

// ─── Profile (800×800) — processed by Astro <Picture /> on About page ────────

const profileSvg = `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#161b22"/>
    <stop offset="100%" style="stop-color:#0d1117"/>
  </linearGradient>
  <radialGradient id="glow" cx="50%" cy="38%" r="42%">
    <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:0.18"/>
    <stop offset="100%" style="stop-color:#58a6ff;stop-opacity:0"/>
  </radialGradient>
  <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1" fill="#30363d" opacity="0.5"/>
  </pattern>
</defs>
<rect width="800" height="800" fill="url(#bgGrad)"/>
<rect width="800" height="800" fill="url(#glow)"/>
<rect width="800" height="800" fill="url(#dots)"/>
<!-- Decorative rings -->
<circle cx="400" cy="310" r="200" fill="none" stroke="#30363d" stroke-width="1" opacity="0.4"/>
<circle cx="400" cy="310" r="168" fill="none" stroke="#58a6ff" stroke-width="1" stroke-dasharray="6 10" opacity="0.25"/>
<!-- Avatar circle background -->
<circle cx="400" cy="310" r="140" fill="#21262d" stroke="#30363d" stroke-width="1.5"/>
<!-- Head -->
<circle cx="400" cy="285" r="64" fill="#2d333b"/>
<path d="M285 360 Q400 318 515 360 L520 395 Q400 375 280 395 Z" fill="#2d333b"/>
<!-- Accent arc on head -->
<path d="M352 258 Q400 238 448 258" stroke="#58a6ff" stroke-width="2.5" fill="none" opacity="0.6"/>
<!-- Text card -->
<rect x="190" y="510" width="420" height="210" rx="14" fill="#161b22" stroke="#30363d" stroke-width="1"/>
<text x="400" y="558" font-family="system-ui,-apple-system,sans-serif" font-size="30" font-weight="700" fill="#e6edf3" text-anchor="middle">Elara Voss</text>
<text x="400" y="592" font-family="ui-monospace,monospace" font-size="15" fill="#8b949e" text-anchor="middle">Senior Frontend Engineer</text>
<text x="400" y="616" font-family="ui-monospace,monospace" font-size="14" fill="#58a6ff" text-anchor="middle">Amsterdam, NL</text>
<line x1="240" y1="638" x2="560" y2="638" stroke="#30363d" stroke-width="1"/>
<text x="320" y="666" font-family="ui-monospace,monospace" font-size="20" font-weight="700" fill="#58a6ff" text-anchor="middle">8yr</text>
<text x="320" y="684" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">experience</text>
<text x="400" y="666" font-family="ui-monospace,monospace" font-size="20" font-weight="700" fill="#3fb950" text-anchor="middle">100</text>
<text x="400" y="684" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">Lighthouse</text>
<text x="480" y="666" font-family="ui-monospace,monospace" font-size="20" font-weight="700" fill="#58a6ff" text-anchor="middle">12</text>
<text x="480" y="684" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">products</text>
</svg>`;

// ─── Headshot (400×400) — used in Person.image JSON-LD schema ────────────────

const headshotSvg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="hbg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#161b22"/>
    <stop offset="100%" style="stop-color:#0d1117"/>
  </linearGradient>
  <radialGradient id="hglow" cx="50%" cy="42%" r="48%">
    <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:0.2"/>
    <stop offset="100%" style="stop-color:#58a6ff;stop-opacity:0"/>
  </radialGradient>
</defs>
<rect width="400" height="400" fill="url(#hbg)"/>
<rect width="400" height="400" fill="url(#hglow)"/>
<circle cx="200" cy="158" r="95" fill="#21262d" stroke="#30363d" stroke-width="1.5"/>
<circle cx="200" cy="140" r="44" fill="#2d333b"/>
<path d="M138 184 Q200 160 262 184 L268 210 Q200 195 132 210 Z" fill="#2d333b"/>
<path d="M170 122 Q200 110 230 122" stroke="#58a6ff" stroke-width="2" fill="none" opacity="0.6"/>
<rect x="80" y="278" width="240" height="96" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1"/>
<text x="200" y="308" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="700" fill="#e6edf3" text-anchor="middle">Elara Voss</text>
<text x="200" y="330" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">Senior Frontend Engineer</text>
<text x="200" y="350" font-family="ui-monospace,monospace" font-size="11" fill="#58a6ff" text-anchor="middle">Amsterdam, NL</text>
</svg>`;

// ─── OG Default (1200×630) — site-wide social share fallback ─────────────────

const ogDefaultSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="obg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#0d1117"/>
    <stop offset="60%" style="stop-color:#0f1a2e"/>
    <stop offset="100%" style="stop-color:#0a1628"/>
  </linearGradient>
  <radialGradient id="oglow" cx="30%" cy="50%" r="55%">
    <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:0.12"/>
    <stop offset="100%" style="stop-color:#58a6ff;stop-opacity:0"/>
  </radialGradient>
  <pattern id="gdots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1.2" fill="#30363d" opacity="0.45"/>
  </pattern>
</defs>
<rect width="1200" height="630" fill="url(#obg)"/>
<rect width="1200" height="630" fill="url(#gdots)"/>
<rect width="1200" height="630" fill="url(#oglow)"/>
<!-- Decorative horizontal lines -->
<line x1="0" y1="220" x2="1200" y2="220" stroke="#30363d" stroke-width="1" opacity="0.3"/>
<line x1="0" y1="410" x2="1200" y2="410" stroke="#30363d" stroke-width="1" opacity="0.3"/>
<!-- Accent bar -->
<rect x="80" y="260" width="4" height="110" rx="2" fill="#58a6ff"/>
<!-- Text -->
<text x="112" y="298" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#58a6ff" font-weight="600" letter-spacing="3">ELARAVOSS.DEV</text>
<text x="112" y="350" font-family="system-ui,-apple-system,sans-serif" font-size="44" font-weight="700" fill="#e6edf3">Elara Voss</text>
<text x="112" y="396" font-family="ui-monospace,monospace" font-size="22" fill="#8b949e">Senior Frontend Engineer · Amsterdam</text>
<!-- Right decorative element -->
<circle cx="1060" cy="315" r="110" fill="none" stroke="#30363d" stroke-width="1" opacity="0.5"/>
<circle cx="1060" cy="315" r="80" fill="none" stroke="#58a6ff" stroke-width="1" stroke-dasharray="5 8" opacity="0.2"/>
<text x="1060" y="307" font-family="ui-monospace,monospace" font-size="16" fill="#58a6ff" text-anchor="middle" opacity="0.7">Astro</text>
<text x="1060" y="327" font-family="ui-monospace,monospace" font-size="16" fill="#3fb950" text-anchor="middle" opacity="0.7">React</text>
<text x="1060" y="347" font-family="ui-monospace,monospace" font-size="16" fill="#8b949e" text-anchor="middle" opacity="0.7">TypeScript</text>
</svg>`;

// ─── OG: Ditching React (1200×630) ───────────────────────────────────────────

const ogReactSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="rbg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#0d1117"/>
    <stop offset="100%" style="stop-color:#0a1628"/>
  </linearGradient>
  <radialGradient id="rglow" cx="75%" cy="30%" r="50%">
    <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:0.14"/>
    <stop offset="100%" style="stop-color:#58a6ff;stop-opacity:0"/>
  </radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#rbg)"/>
<rect width="1200" height="630" fill="url(#rglow)"/>
<!-- Geometric accent shapes -->
<rect x="900" y="0" width="300" height="630" fill="#161b22" opacity="0.35"/>
<line x1="900" y1="0" x2="900" y2="630" stroke="#30363d" stroke-width="1"/>
<!-- Tag -->
<rect x="80" y="168" width="120" height="28" rx="14" fill="#58a6ff" opacity="0.15"/>
<text x="140" y="187" font-family="ui-monospace,monospace" font-size="12" fill="#58a6ff" text-anchor="middle" font-weight="600">ASTRO · REACT</text>
<!-- Title -->
<text x="80" y="268" font-family="system-ui,-apple-system,sans-serif" font-size="46" font-weight="700" fill="#e6edf3">Why I Ditched React</text>
<text x="80" y="322" font-family="system-ui,-apple-system,sans-serif" font-size="46" font-weight="700" fill="#58a6ff">for Astro</text>
<text x="80" y="390" font-family="ui-monospace,monospace" font-size="20" fill="#8b949e">(And Never Looked Back)</text>
<!-- Byline -->
<text x="80" y="456" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#8b949e">Elara Voss · elaravoss.dev</text>
<!-- Right panel content -->
<text x="1050" y="280" font-family="ui-monospace,monospace" font-size="13" fill="#3fb950" text-anchor="middle" opacity="0.8">0 kB</text>
<text x="1050" y="300" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">client JS</text>
<text x="1050" y="340" font-family="ui-monospace,monospace" font-size="13" fill="#58a6ff" text-anchor="middle" opacity="0.8">100</text>
<text x="1050" y="360" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">Lighthouse</text>
<text x="1050" y="400" font-family="ui-monospace,monospace" font-size="13" fill="#3fb950" text-anchor="middle" opacity="0.8">4×</text>
<text x="1050" y="420" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">faster builds</text>
</svg>`;

// ─── OG: Design System (1200×630) ────────────────────────────────────────────

const ogDesignSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="dsbg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#0d1117"/>
    <stop offset="100%" style="stop-color:#0d1a0d"/>
  </linearGradient>
  <radialGradient id="dsglow" cx="70%" cy="40%" r="55%">
    <stop offset="0%" style="stop-color:#3fb950;stop-opacity:0.12"/>
    <stop offset="100%" style="stop-color:#3fb950;stop-opacity:0"/>
  </radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#dsbg)"/>
<rect width="1200" height="630" fill="url(#dsglow)"/>
<!-- Geometric grid decoration -->
<rect x="860" y="60" width="260" height="510" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1" opacity="0.5"/>
<!-- Simulated component rows in card -->
<rect x="890" y="100" width="200" height="12" rx="6" fill="#3fb950" opacity="0.3"/>
<rect x="890" y="124" width="160" height="8" rx="4" fill="#30363d" opacity="0.6"/>
<rect x="890" y="144" width="180" height="8" rx="4" fill="#30363d" opacity="0.4"/>
<rect x="890" y="176" width="200" height="12" rx="6" fill="#58a6ff" opacity="0.3"/>
<rect x="890" y="200" width="140" height="8" rx="4" fill="#30363d" opacity="0.6"/>
<rect x="890" y="220" width="170" height="8" rx="4" fill="#30363d" opacity="0.4"/>
<rect x="890" y="252" width="200" height="12" rx="6" fill="#3fb950" opacity="0.2"/>
<rect x="890" y="276" width="120" height="8" rx="4" fill="#30363d" opacity="0.5"/>
<!-- Tag -->
<rect x="80" y="168" width="148" height="28" rx="14" fill="#3fb950" opacity="0.15"/>
<text x="154" y="187" font-family="ui-monospace,monospace" font-size="12" fill="#3fb950" text-anchor="middle" font-weight="600">DESIGN SYSTEMS</text>
<!-- Title -->
<text x="80" y="268" font-family="system-ui,-apple-system,sans-serif" font-size="42" font-weight="700" fill="#e6edf3">The Design System That</text>
<text x="80" y="320" font-family="system-ui,-apple-system,sans-serif" font-size="42" font-weight="700" fill="#3fb950">Saved 40 Hours/Week</text>
<text x="80" y="390" font-family="ui-monospace,monospace" font-size="19" fill="#8b949e">How a single source of truth changes everything.</text>
<text x="80" y="456" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#8b949e">Elara Voss · elaravoss.dev</text>
</svg>`;

// ─── OG: Core Web Vitals (1200×630) ──────────────────────────────────────────

const ogCwvSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="cwbg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#0d1117"/>
    <stop offset="100%" style="stop-color:#0a1117"/>
  </linearGradient>
  <radialGradient id="cwglow" cx="65%" cy="50%" r="50%">
    <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:0.1"/>
    <stop offset="100%" style="stop-color:#58a6ff;stop-opacity:0"/>
  </radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#cwbg)"/>
<rect width="1200" height="630" fill="url(#cwglow)"/>
<!-- Speedometer-style arc decoration -->
<path d="M 980 400 A 160 160 0 1 1 1140 400" fill="none" stroke="#30363d" stroke-width="12" stroke-linecap="round" opacity="0.4"/>
<path d="M 980 400 A 160 160 0 1 1 1110 280" fill="none" stroke="#3fb950" stroke-width="12" stroke-linecap="round" opacity="0.7"/>
<circle cx="1060" cy="400" r="6" fill="#3fb950" opacity="0.9"/>
<text x="1060" y="380" font-family="ui-monospace,monospace" font-size="28" font-weight="700" fill="#3fb950" text-anchor="middle">100</text>
<text x="1060" y="435" font-family="ui-monospace,monospace" font-size="13" fill="#8b949e" text-anchor="middle">Perf score</text>
<!-- CWV metric pills -->
<rect x="870" y="160" width="72" height="26" rx="13" fill="#3fb950" opacity="0.15"/>
<text x="906" y="177" font-family="ui-monospace,monospace" font-size="12" fill="#3fb950" text-anchor="middle">LCP</text>
<rect x="954" y="160" width="72" height="26" rx="13" fill="#3fb950" opacity="0.15"/>
<text x="990" y="177" font-family="ui-monospace,monospace" font-size="12" fill="#3fb950" text-anchor="middle">INP</text>
<rect x="1038" y="160" width="72" height="26" rx="13" fill="#3fb950" opacity="0.15"/>
<text x="1074" y="177" font-family="ui-monospace,monospace" font-size="12" fill="#3fb950" text-anchor="middle">CLS</text>
<!-- Tag -->
<rect x="80" y="168" width="152" height="28" rx="14" fill="#58a6ff" opacity="0.12"/>
<text x="156" y="187" font-family="ui-monospace,monospace" font-size="12" fill="#58a6ff" text-anchor="middle" font-weight="600">WEB PERFORMANCE</text>
<!-- Title -->
<text x="80" y="268" font-family="system-ui,-apple-system,sans-serif" font-size="46" font-weight="700" fill="#e6edf3">Core Web Vitals:</text>
<text x="80" y="322" font-family="system-ui,-apple-system,sans-serif" font-size="46" font-weight="700" fill="#58a6ff">A Practical Guide</text>
<text x="80" y="390" font-family="ui-monospace,monospace" font-size="19" fill="#8b949e">Real optimisations. Real numbers. No theory.</text>
<text x="80" y="456" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#8b949e">Elara Voss · elaravoss.dev</text>
</svg>`;

// ─── Hero images for <Picture /> (1600×900) ───────────────────────────────────

const heroReactSvg = `<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="hrbg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#0d1117"/>
    <stop offset="50%" style="stop-color:#0a1628"/>
    <stop offset="100%" style="stop-color:#091220"/>
  </linearGradient>
  <radialGradient id="hrglow" cx="20%" cy="50%" r="60%">
    <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:0.15"/>
    <stop offset="100%" style="stop-color:#58a6ff;stop-opacity:0"/>
  </radialGradient>
  <pattern id="hrdots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1.2" fill="#21262d" opacity="0.6"/>
  </pattern>
</defs>
<rect width="1600" height="900" fill="url(#hrbg)"/>
<rect width="1600" height="900" fill="url(#hrdots)"/>
<rect width="1600" height="900" fill="url(#hrglow)"/>
<!-- Large decorative circles -->
<circle cx="1300" cy="450" r="380" fill="none" stroke="#21262d" stroke-width="1" opacity="0.6"/>
<circle cx="1300" cy="450" r="300" fill="none" stroke="#30363d" stroke-width="1" opacity="0.5"/>
<circle cx="1300" cy="450" r="200" fill="#161b22" opacity="0.3"/>
<!-- Code-like horizontal lines -->
<rect x="140" y="200" width="320" height="4" rx="2" fill="#58a6ff" opacity="0.6"/>
<rect x="140" y="220" width="240" height="4" rx="2" fill="#3fb950" opacity="0.4"/>
<rect x="140" y="240" width="280" height="4" rx="2" fill="#8b949e" opacity="0.3"/>
<rect x="160" y="268" width="200" height="4" rx="2" fill="#58a6ff" opacity="0.3"/>
<rect x="160" y="288" width="260" height="4" rx="2" fill="#3fb950" opacity="0.25"/>
<!-- Bottom fade -->
<rect x="0" y="700" width="1600" height="200" fill="url(#hrbg)" opacity="0.8"/>
</svg>`;

const heroDesignSvg = `<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="hdbg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#0d1117"/>
    <stop offset="50%" style="stop-color:#0d1a0f"/>
    <stop offset="100%" style="stop-color:#091209"/>
  </linearGradient>
  <radialGradient id="hdglow" cx="80%" cy="40%" r="55%">
    <stop offset="0%" style="stop-color:#3fb950;stop-opacity:0.14"/>
    <stop offset="100%" style="stop-color:#3fb950;stop-opacity:0"/>
  </radialGradient>
  <pattern id="hddots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1.2" fill="#21262d" opacity="0.6"/>
  </pattern>
</defs>
<rect width="1600" height="900" fill="url(#hdbg)"/>
<rect width="1600" height="900" fill="url(#hddots)"/>
<rect width="1600" height="900" fill="url(#hdglow)"/>
<!-- Token architecture visual — stacked layers -->
<rect x="1100" y="200" width="360" height="60" rx="8" fill="#161b22" stroke="#3fb950" stroke-width="1" opacity="0.6"/>
<text x="1280" y="237" font-family="ui-monospace,monospace" font-size="14" fill="#3fb950" text-anchor="middle" opacity="0.7">Design Tokens</text>
<rect x="1120" y="290" width="320" height="60" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1" opacity="0.5"/>
<text x="1280" y="327" font-family="ui-monospace,monospace" font-size="14" fill="#8b949e" text-anchor="middle" opacity="0.7">Components</text>
<rect x="1140" y="380" width="280" height="60" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1" opacity="0.4"/>
<text x="1280" y="417" font-family="ui-monospace,monospace" font-size="14" fill="#8b949e" text-anchor="middle" opacity="0.7">Patterns</text>
<line x1="1280" y1="260" x2="1280" y2="290" stroke="#3fb950" stroke-width="1" opacity="0.4"/>
<line x1="1280" y1="350" x2="1280" y2="380" stroke="#30363d" stroke-width="1" opacity="0.4"/>
<rect x="0" y="700" width="1600" height="200" fill="url(#hdbg)" opacity="0.8"/>
</svg>`;

const heroCwvSvg = `<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="hcbg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#0d1117"/>
    <stop offset="50%" style="stop-color:#0a1117"/>
    <stop offset="100%" style="stop-color:#080f17"/>
  </linearGradient>
  <radialGradient id="hcglow" cx="75%" cy="50%" r="50%">
    <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:0.12"/>
    <stop offset="100%" style="stop-color:#58a6ff;stop-opacity:0"/>
  </radialGradient>
  <pattern id="hcdots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1.2" fill="#21262d" opacity="0.6"/>
  </pattern>
</defs>
<rect width="1600" height="900" fill="url(#hcbg)"/>
<rect width="1600" height="900" fill="url(#hcdots)"/>
<rect width="1600" height="900" fill="url(#hcglow)"/>
<!-- Metric bars -->
<rect x="1060" y="240" width="60" height="240" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
<rect x="1060" y="366" width="60" height="114" rx="6" fill="#3fb950" opacity="0.7"/>
<text x="1090" y="510" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">LCP</text>
<rect x="1150" y="240" width="60" height="240" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
<rect x="1150" y="448" width="60" height="32" rx="6" fill="#3fb950" opacity="0.7"/>
<text x="1180" y="510" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">INP</text>
<rect x="1240" y="240" width="60" height="240" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
<rect x="1240" y="466" width="60" height="14" rx="6" fill="#3fb950" opacity="0.7"/>
<text x="1270" y="510" font-family="ui-monospace,monospace" font-size="11" fill="#8b949e" text-anchor="middle">CLS</text>
<rect x="0" y="700" width="1600" height="200" fill="url(#hcbg)" opacity="0.8"/>
</svg>`;

// ─── Generate all images ──────────────────────────────────────────────────────

console.log('Generating images...');
await fromSvg(profileSvg, 'src/assets/images/profile.jpg');
await fromSvg(headshotSvg, 'public/headshot.jpg');
await fromSvg(ogDefaultSvg, 'public/og-default.jpg');
await fromSvg(ogReactSvg, 'public/og-ditching-react.jpg');
await fromSvg(ogDesignSvg, 'public/og-design-system.jpg');
await fromSvg(ogCwvSvg, 'public/og-cwv-guide.jpg');
await fromSvg(heroReactSvg, 'src/assets/images/hero-ditching-react.jpg');
await fromSvg(heroDesignSvg, 'src/assets/images/hero-design-system.jpg');
await fromSvg(heroCwvSvg, 'src/assets/images/hero-cwv-guide.jpg');
console.log('Done. 9 images generated.');
