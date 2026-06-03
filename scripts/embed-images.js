const fs = require('fs');
const { execFileSync } = require('child_process');
const DL = '/Users/dayanahernandez/Downloads';
const OUT = '/tmp/imgs';
fs.mkdirSync(OUT, { recursive: true });

// product key -> keyword to find its file (case-insensitive substring/regex)
const MAP = {
  rail:        /^\s*riel\./i,
  splice:      /splice/i,
  midClamp:    /mid clamp/i,
  endClamp:    /end clamp/i,
  grounding:   /grounding lug/i,
  triangleKit: /rail fix kit/i,
  teja:        /(teja espa|ganchos|tile hook)/i,
  lfeet:       /^\s*l feet/i,
  trap_madera: /hangerbolt/i,
  trap_acero:  /selflock/i,
  galvanizada: /standing seam/i,
  concreto:    /alu adjustable triangle/i,
};

const files = fs.readdirSync(DL).filter(f => /\.(avif|webp|jpe?g|png)$/i.test(f));
const images = {};
const report = [];
for (const [key, rx] of Object.entries(MAP)) {
  const match = files.find(f => rx.test(f));
  if (!match) { report.push(`MISSING ${key}`); continue; }
  const outFile = `${OUT}/${key}.jpg`;
  execFileSync('sips', ['-s', 'format', 'jpeg', '--resampleHeightWidthMax', '360', `${DL}/${match}`, '--out', outFile], { stdio: 'ignore' });
  const b64 = fs.readFileSync(outFile).toString('base64');
  images[key] = 'data:image/jpeg;base64,' + b64;
  report.push(`${key.padEnd(12)} <- ${match.trim().slice(0,42)}  (${Math.round(b64.length/1024)}KB)`);
}

// Build the injected block
let block = '// ===== PRODUCT IMAGES (auto-generated) =====\nconst PRODUCT_IMAGES = {\n';
for (const [k, v] of Object.entries(images)) block += `  ${k}: ${JSON.stringify(v)},\n`;
block += '};\n// ===== END PRODUCT IMAGES =====';

const path = '/Users/dayanahernandez/projects/meico-bom-calculator/index.html';
let html = fs.readFileSync(path, 'utf8');
const re = /\/\/ ===== PRODUCT IMAGES \(auto-generated\) =====[\s\S]*?\/\/ ===== END PRODUCT IMAGES =====/;
if (re.test(html)) {
  html = html.replace(re, block);
} else {
  html = html.replace('<script>\n', '<script>\n' + block + '\n');
}
fs.writeFileSync(path, html);
console.log(report.join('\n'));
console.log('\nInjected ' + Object.keys(images).length + ' images. HTML size now ' + Math.round(html.length/1024) + 'KB');
