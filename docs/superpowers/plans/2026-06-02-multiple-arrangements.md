# Remove NIT + Multiple Arrangements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the NIT field, and let the user add multiple arrangement lines whose materials are summed into one combined Lista de Materiales.

**Architecture:** Extract the existing per-line BOM math into a pure, DOM-free
function `lineBom()` (so it can be unit-tested in Node). Replace the two fixed count
inputs with a dynamic, add/remove list of arrangement rows. `calculate()` reads the
shared fields once, runs `lineBom()` for each row, and sums the results key-by-key.
The report header lists one panel entry per arrangement; the materials table shows
the combined totals.

**Tech Stack:** Plain HTML + CSS + vanilla JS, single file (`index.html`). Math
verified with a Node script; UI verified in a browser.

**Spec:** `docs/superpowers/specs/2026-06-02-multiple-arrangements-design.md`

---

## File Structure

- Modify: `index.html`
  - `<style>` block — add CSS for the arrangement rows / buttons (Task 3).
  - Input panel (`~362–430`) — remove NIT; replace fixed count inputs with the
    arrangements list (Tasks 1, 3).
  - `<script>` — extract `lineBom()` (Task 2); rewrite `calculate()`,
    `generateReport()` info bar, add arrangement-list helpers + init (Tasks 1–3).
- Create (throwaway): `/tmp/test-linebom.js` — Node test for the pure math (Task 2).

---

### Task 1: Remove the NIT field

**Files:**
- Modify: `index.html` (input panel + `generateReport()`)

- [ ] **Step 1: Remove the NIT input group**

Delete this block from the input panel:

```html
    <div class="input-group">
      <label>NIT</label>
      <input type="text" id="nit" placeholder="NIT del cliente">
    </div>
```

- [ ] **Step 2: Remove the NIT read in `generateReport()`**

Delete this line:

```js
  const nit = document.getElementById('nit').value || '—';
```

- [ ] **Step 3: Remove the NIT item from the info bar**

In the `infoBar` template string, delete this item:

```js
    <div class="item"><div class="item-label">NIT</div><div class="item-value">${nit}</div></div>
```

- [ ] **Step 4: Verify**

Open `index.html`. Confirm the form no longer shows a NIT field; generate a report
and confirm the header has no NIT box and nothing errors (open the browser console,
expect no red errors).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Remove NIT field from form and report"
```

---

### Task 2: Extract pure `lineBom()` and unit-test it

This is a refactor with **no behavior change** — one arrangement must still produce
today's exact numbers. It just makes the math testable.

**Files:**
- Modify: `index.html` (`<script>`)
- Create: `/tmp/test-linebom.js`

- [ ] **Step 1: Wrap the math in a marked, pure function**

Replace this existing line near the top of the script:

```js
const RAIL_LENGTH = 4700; // mm
```

with:

```js
// ===== PURE BOM LOGIC (testable, no DOM) =====
const RAIL_LENGTH = 4700; // mm

// Computes component quantities for ONE arrangement line.
// Pure: no DOM access, no globals besides RAIL_LENGTH. Formula unchanged.
function lineBom({ paneles, arreglos, largo, ancho, posicion, techo }) {
  const totalPaneles = paneles * arreglos;
  const dim = posicion === 'portrait' ? ancho : largo;
  const totalLargo = dim * totalPaneles;
  const rieles = Math.ceil((totalLargo / RAIL_LENGTH) * 2);
  const fixingQty = Math.ceil((paneles * ancho / 1000 / 1.7)) * 2 * arreglos;
  return {
    rail: rieles,
    splice: rieles - 1,
    midClamp: (totalPaneles - 1) * 2,
    endClamp: arreglos * 4,
    grounding: arreglos * 2,
    triangleKit: techo === 'concreto' ? 2 * fixingQty : 0,
    fixing: fixingQty,
  };
}
// ===== END PURE BOM LOGIC =====
```

- [ ] **Step 2: Make `calculate()` use `lineBom()` (still single-input)**

Replace the entire existing `calculate()` function with:

```js
function calculate() {
  const paneles = parseInt(document.getElementById('paneles').value) || 0;
  const arreglos = parseInt(document.getElementById('arreglos').value) || 0;
  const largo = parseInt(document.getElementById('largo').value) || 0;
  const ancho = parseInt(document.getElementById('ancho').value) || 0;
  const posicion = document.getElementById('posicion').value;
  const techo = document.getElementById('techo').value;

  const b = lineBom({ paneles, arreglos, largo, ancho, posicion, techo });
  const order = ['rail', 'splice', 'midClamp', 'endClamp', 'grounding'];
  if (techo === 'concreto') order.push('triangleKit');
  order.push('fixing');

  return {
    totalPaneles: paneles * arreglos,
    arreglos, posicion, techo,
    bom: order.map(key => ({ key, qty: b[key] })),
  };
}
```

- [ ] **Step 3: Write the Node test**

Create `/tmp/test-linebom.js`:

```js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const m = html.match(/\/\/ ===== PURE BOM LOGIC[\s\S]*?\/\/ ===== END PURE BOM LOGIC =====/);
if (!m) { console.error('markers not found'); process.exit(1); }
eval(m[0] + ';globalThis.lineBom = lineBom;');

// Current default inputs: 14 paneles, 4 arreglos, panel 2382x1134, portrait, galvanizada
const one = globalThis.lineBom({ paneles: 14, arreglos: 4, largo: 2382, ancho: 1134, posicion: 'portrait', techo: 'galvanizada' });
const expected = { rail: 28, splice: 27, midClamp: 110, endClamp: 16, grounding: 8, triangleKit: 0, fixing: 80 };
const okOne = JSON.stringify(one) === JSON.stringify(expected);
console.log('single line:', JSON.stringify(one), okOne ? 'OK' : 'FAIL expected ' + JSON.stringify(expected));

// Two identical lines must double each quantity
const sum = {};
for (const k in one) sum[k] = one[k] + one[k];
const okSum = sum.rail === 56 && sum.fixing === 160 && sum.midClamp === 220;
console.log('two identical lines sum:', JSON.stringify(sum), okSum ? 'OK' : 'FAIL');

process.exit(okOne && okSum ? 0 : 1);
```

- [ ] **Step 4: Run the test**

Run: `node /tmp/test-linebom.js`
Expected: both lines print `OK`, exit code 0:
```
single line: {"rail":28,"splice":27,"midClamp":110,"endClamp":16,"grounding":8,"triangleKit":0,"fixing":80} OK
two identical lines sum: {...,"rail":56,...} OK
```

- [ ] **Step 5: Verify no UI regression**

Open `index.html`, generate a report with the defaults. The materials list must be
unchanged from before this task (rail 28, conector 27, etc.).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "Extract pure lineBom() with Node test (no behavior change)"
```

---

### Task 3: Multiple arrangements (form + calculation + report)

Done as one task so the app is never in a broken intermediate state (the form's old
`#paneles`/`#arreglos` inputs and the code that reads them change together).

**Files:**
- Modify: `index.html` (`<style>`, input panel, `<script>`)

- [ ] **Step 1: Add CSS for the arrangement rows**

Insert immediately after this existing rule:

```css
  .btn-print:hover { background: var(--accent-subtle); }
```

the following:

```css
  .arreglos-list { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 8px; }
  .arreglo-row {
    display: flex; align-items: flex-end; gap: 12px;
    background: var(--accent-subtle); border-radius: 6px; padding: 10px 12px;
  }
  .arreglo-row .arr-num { font-size: 11px; font-weight: 700; color: var(--blue); min-width: 64px; padding-bottom: 8px; }
  .arreglo-row .arr-field { display: flex; flex-direction: column; flex: 1; min-width: 0; }
  .arreglo-row .arr-field label { font-size: 10px; font-weight: 600; color: var(--gray); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.4px; }
  .arreglo-row .arr-field input { padding: 8px 10px; border: 1.5px solid var(--border); border-radius: 5px; font-size: 13px; width: 100%; }
  .arreglo-row .arr-field input:focus { outline: none; border-color: var(--blue); }
  .btn-remove-arr {
    border: none; background: #e8e8ee; color: var(--gray); width: 30px; height: 34px;
    border-radius: 5px; font-size: 18px; line-height: 1; cursor: pointer; flex-shrink: 0;
  }
  .btn-remove-arr:hover:not(:disabled) { background: #f3d0d0; color: #b00; }
  .btn-remove-arr:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-add-arr {
    grid-column: 1 / -1; margin-top: 4px; padding: 9px; background: var(--white);
    color: var(--blue); border: 1.5px dashed var(--blue); border-radius: 6px;
    font-size: 13px; font-weight: 700; cursor: pointer;
  }
  .btn-add-arr:hover { background: var(--accent-subtle); }
```

- [ ] **Step 2: Remove the two fixed count inputs from the form**

Delete this block from the input panel (the Paneles + Arreglos input groups):

```html
    <div class="input-group">
      <label>Paneles por Arreglo</label>
      <input type="number" id="paneles" value="14" min="1">
    </div>
    <div class="input-group">
      <label>N&uacute;mero de Arreglos</label>
      <input type="number" id="arreglos" value="4" min="1">
    </div>
```

- [ ] **Step 3: Add the arrangements section before the buttons**

Insert this immediately before this existing line:

```html
    <button class="btn-generate" onclick="generateReport()">GENERAR REPORTE</button>
```

Inserted markup:

```html
    <div class="section-divider">Arreglos</div>
    <div id="arreglosList" class="arreglos-list"></div>
    <button type="button" class="btn-add-arr" onclick="addArreglo()">+ Agregar arreglo</button>

```

- [ ] **Step 4: Add the arrangement-list helper functions**

In the `<script>`, immediately after the `// ===== END PURE BOM LOGIC =====` line,
add:

```js
// ===== ARRANGEMENT LIST (UI) =====
function makeArregloRow(paneles, arreglos) {
  const row = document.createElement('div');
  row.className = 'arreglo-row';
  row.innerHTML =
    '<span class="arr-num"></span>' +
    '<div class="arr-field"><label>Paneles por arreglo</label>' +
    '<input type="number" class="arr-paneles" value="' + paneles + '" min="1"></div>' +
    '<div class="arr-field"><label>N.º de arreglos</label>' +
    '<input type="number" class="arr-arreglos" value="' + arreglos + '" min="1"></div>' +
    '<button type="button" class="btn-remove-arr" onclick="removeArreglo(this)">&times;</button>';
  return row;
}
function addArreglo(paneles = 14, arreglos = 4) {
  document.getElementById('arreglosList').appendChild(makeArregloRow(paneles, arreglos));
  renumberArreglos();
}
function removeArreglo(btn) {
  const list = document.getElementById('arreglosList');
  if (list.children.length <= 1) return;
  btn.closest('.arreglo-row').remove();
  renumberArreglos();
}
function renumberArreglos() {
  const rows = document.querySelectorAll('#arreglosList .arreglo-row');
  rows.forEach((row, i) => {
    row.querySelector('.arr-num').textContent = 'Arreglo ' + (i + 1);
    row.querySelector('.btn-remove-arr').disabled = rows.length === 1;
  });
}
function readArreglos() {
  const rows = document.querySelectorAll('#arreglosList .arreglo-row');
  return Array.from(rows).map(row => ({
    paneles: parseInt(row.querySelector('.arr-paneles').value) || 0,
    arreglos: parseInt(row.querySelector('.arr-arreglos').value) || 0,
  }));
}
// ===== END ARRANGEMENT LIST =====
```

- [ ] **Step 5: Rewrite `calculate()` to sum all rows**

Replace the entire `calculate()` function (the Task-2 version) with:

```js
function calculate() {
  const largo = parseInt(document.getElementById('largo').value) || 0;
  const ancho = parseInt(document.getElementById('ancho').value) || 0;
  const posicion = document.getElementById('posicion').value;
  const techo = document.getElementById('techo').value;

  const totals = { rail: 0, splice: 0, midClamp: 0, endClamp: 0, grounding: 0, triangleKit: 0, fixing: 0 };
  const arreglosInfo = [];

  readArreglos().forEach(({ paneles, arreglos }) => {
    const b = lineBom({ paneles, arreglos, largo, ancho, posicion, techo });
    for (const k in totals) totals[k] += b[k];
    arreglosInfo.push({ paneles, arreglos, subtotal: paneles * arreglos });
  });

  const order = ['rail', 'splice', 'midClamp', 'endClamp', 'grounding'];
  if (techo === 'concreto') order.push('triangleKit');
  order.push('fixing');

  return {
    arreglos: arreglosInfo,
    posicion, techo,
    bom: order.map(key => ({ key, qty: totals[key] })),
  };
}
```

- [ ] **Step 6: Update the info bar in `generateReport()`**

In `generateReport()`, replace the whole `infoBar` assignment with this version
(NIT already gone from Task 1; "Paneles" now lists one entry per arrangement):

```js
  const panelesHTML = data.arreglos
    .map(a => `${a.subtotal} (${a.arreglos} arr. × ${a.paneles})`)
    .join('<br>');

  document.getElementById('infoBar').innerHTML = `
    <div class="item"><div class="item-label">Cliente</div><div class="item-value">${cliente}</div></div>
    <div class="item"><div class="item-label">Dirección</div><div class="item-value">${direccion}</div></div>
    <div class="item"><div class="item-label">Ciudad</div><div class="item-value">${ciudad}</div></div>
    <div class="item"><div class="item-label">Fecha</div><div class="item-value">${fecha}</div></div>
    <div class="item"><div class="item-label">Paneles</div><div class="item-value">${panelesHTML}</div></div>
    <div class="item"><div class="item-label">Techo</div><div class="item-value">${roofType.name}</div></div>
    <div class="item"><div class="item-label">Posición</div><div class="item-value">${data.posicion === 'portrait' ? 'Portrait' : 'Landscape'}</div></div>
  `;
```

- [ ] **Step 7: Seed the first arrangement row on load**

Find this existing init line at the end of the script:

```js
document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
```

Add immediately after it:

```js
addArreglo(14, 4);
```

- [ ] **Step 8: Re-run the math test (still passes — pure function unchanged)**

Run: `node /tmp/test-linebom.js`
Expected: both lines `OK`, exit code 0.

- [ ] **Step 9: Verify in the browser**

Open `index.html`:
1. One arrangement (14 × 4) → generate → materials must match the original numbers
   (rail 28, conector 27, grapa intermedia 110, grapa final 16, tierra 8, fijación 80).
2. Click "+ Agregar arreglo", set the second line to 6 × 1 → generate. Header
   "Paneles" shows two lines: `56 (4 arr. × 14)` and `6 (1 arr. × 6)`. Materials must
   equal the single-line 14×4 values **plus** the 6×1 values.
3. Remove a row with "×"; confirm the "×" is disabled when only one row remains;
   confirm rows renumber to "Arreglo 1, 2, …".

- [ ] **Step 10: Commit**

```bash
git add index.html
git commit -m "Add multiple arrangements: dynamic list + summed materials"
```

---

### Task 4: Confirm the report still fits one page

**Files:**
- Modify (only if overflow): `index.html` `@media print` block

- [ ] **Step 1: Print-preview with multiple arrangements**

Open `index.html`, add 2–3 arrangements, pick each roof type in turn, and open print
preview (Cmd+P). Expected: the report fits on one Letter page. The multi-line
"Paneles" box is the only header growth and is small.

- [ ] **Step 2: If it overflows, tighten print spacing**

Only if needed, in the `@media print` block reduce tech-card spacing:

```css
.tech-card { padding: 7px 0; gap: 8px; break-inside: avoid; }
.tech-card-info .specs { font-size: 9px; line-height: 1.5; }
```

Re-check print preview after each tweak.

- [ ] **Step 3: Commit (only if Step 2 changed anything)**

```bash
git add index.html
git commit -m "Tighten print spacing for multi-arrangement reports"
```

---

## Self-Review

- **Spec coverage:**
  - Remove NIT (form + report) → Task 1. ✓
  - Per-line fields = count only; largo/ancho/posición/techo shared → calculate()
    reads shared once, rows carry only paneles/arreglos (Task 3 Steps 4–5). ✓
  - "Add up sections" totaling → `lineBom()` per row, key-by-key sum (Task 3
    Step 5); proven by Node test (Task 2). ✓
  - Auto-numbered labels → `renumberArreglos()` (Task 3 Step 4). ✓
  - Add/remove, always ≥1 → `addArreglo`/`removeArreglo` + disabled remove on last
    row (Task 3 Step 4). ✓
  - Header "Paneles" = one `subtotal (N arr. × paneles)` entry per line, no
    grand-total → Task 3 Step 6. ✓
  - Lista de Materiales = combined totals → summed `bom` drives the existing table
    unchanged. ✓
  - One page → Task 4. ✓
- **Placeholder scan:** Every code step has complete code; no TBD/"similar to". ✓
- **Type/name consistency:** `lineBom` returns keys
  `rail/splice/midClamp/endClamp/grounding/triangleKit/fixing`; `calculate()`
  `totals` uses the same keys; `order` references only those keys; class names
  `arreglo-row / arr-paneles / arr-arreglos / arr-num / btn-remove-arr` match across
  CSS (Step 1), markup (Step 4), and `readArreglos()`/`renumberArreglos()`. The
  report still reads `data.bom`, `data.posicion`, `data.techo`, `data.arreglos`. ✓
- **No-invention/regression:** per-line formula is copied verbatim into `lineBom()`;
  Node test pins single-line output to the current numbers. ✓
