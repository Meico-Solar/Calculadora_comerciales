# Real Product Data Display — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder product specs in `index.html` with real,
document-sourced characteristics, displayed as short structured facts on the same
single-page report.

**Architecture:** All product data lives in two JavaScript objects in `index.html`:
`PIECES` (6 structural components) and `ROOF_TYPES` (6 roof fixings, each with a
`.piece`). The report's tech-card renderer already loops over each piece's `specs`
object and prints `Label: value` lines — so changing the data automatically changes
the display. No renderer or calculation change is required for the data swap.

**Tech Stack:** Plain HTML + CSS + vanilla JavaScript, single file. Verification is
manual in a browser (no test framework — appropriate for one static file).

**Source of truth:** `/Users/dayanahernandez/Downloads/Eestructuras chiko para cálculo.docx`
(distilled text recorded in the design spec dated 2026-06-02). **No fact may be
added that is not in that document.**

**Constraints (locked with user):**
- Keep every existing option and piece exactly as-is (no add/remove/rename).
- One single page. No catalog-page references. Label for the standout fact is
  **Particularidad**.

---

## File Structure

- Modify: `index.html` — only the `PIECES` and `ROOF_TYPES` object literals (lines
  ~475–640), and possibly minor `@media print` spacing in the `<style>` block if the
  report overflows one page.

No files created. No new dependencies.

---

### Task 1: Replace specs for the 6 structural components (`PIECES`)

**Files:**
- Modify: `index.html` — the `PIECES` object (`const PIECES = { ... }`)

For each piece, replace its `specs: { ... }` object with the one below. Leave
`name`, `fullName`, `desc`, and `icon` unchanged.

- [ ] **Step 1: Update `rail.specs`**

```js
specs: {
  "Material": "Aluminio AL6005-T5 extruido, anodizado grado marino",
  "Función": "Viga principal de soporte donde descansan y se aseguran los paneles",
  "Longitud": "4.700 mm (optimizada para hileras de varios paneles)",
  "Particularidad": "Resiste vientos extremos de hasta 234 km/h (evaluado en SAP2000)",
}
```

- [ ] **Step 2: Update `splice.specs`**

```js
specs: {
  "Material": "Aluminio AL6005-T5 anodizado + tornillería SUS304",
  "Función": "Une dos rieles 537 de forma interna y alineada",
  "Particularidad": "Permite filas de más de 4,7 m sin perder rigidez ni continuidad",
}
```

- [ ] **Step 3: Update `midClamp.specs`**

```js
specs: {
  "Material": "Aluminio AL6005-T5 anodizado + tornillo SUS304",
  "Función": "Sujeta dos paneles consecutivos al riel",
  "Ajuste": "Marcos de 30 a 40 mm de espesor",
  "Particularidad": "Puesta a tierra integrada; sus dientes rompen el anodizado del marco para dar continuidad eléctrica",
}
```

- [ ] **Step 4: Update `endClamp.specs`**

```js
specs: {
  "Material": "Aluminio AL6005-T5 anodizado + herrajes SUS304",
  "Función": "Cierra el extremo final de cada fila de paneles sobre el riel",
  "Ajuste": "Se adapta a paneles de 30 a 40 mm",
  "Particularidad": "Puesta a tierra integrada; asegura el módulo contra la succión del viento",
}
```

- [ ] **Step 5: Update `grounding.specs`**

```js
specs: {
  "Material": "Aluminio AL6005-T5 macizo anodizado + tornillería SUS304",
  "Función": "Se fija en el extremo del riel y asegura el cable de cobre de tierra",
  "Particularidad": "Interconecta todas las filas y dirige las descargas a la malla de tierra del sitio",
}
```

- [ ] **Step 6: Update `triangleKit.specs`**

```js
specs: {
  "Material": "Aluminio AL6005-T5 + acero inoxidable SUS304 (pernos en T)",
  "Función": "Sujeta el riel sobre el triángulo ajustable de techos planos",
  "Particularidad": "Acople rígido perpendicular que resiste la torsión del viento",
}
```

- [ ] **Step 7: Verify in browser**

Open `index.html`. Fill any values (e.g. Paneles 10, Arreglos 2, Largo 2000, Ancho
1100, Techo = Concreto so `triangleKit` appears). Click "Generar". In the right
column confirm rail/splice/midClamp/endClamp/grounding/triangleKit each show the new
`Material / Función / [Ajuste] / Particularidad` lines and nothing reads wrong.
Expected: all six cards show the real text above; no "Acabado", "Carga máx." or other
old placeholder labels remain.

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "Replace structural-component specs with real product data"
```

---

### Task 2: Replace specs for the 6 roof fixings (`ROOF_TYPES`)

**Files:**
- Modify: `index.html` — the `ROOF_TYPES` object (`const ROOF_TYPES = { ... }`)

Each roof type has a `.piece.specs` object. Replace each as below; leave `name`,
`fullName`, `desc`, `icon` unchanged. Mapping to the source document is noted per
item.

- [ ] **Step 1: Update `teja.piece.specs`** (source: Gancho para Teja Española, doc #13)

```js
specs: {
  "Material": "Acero inoxidable SUS304 de gran espesor (o aluminio fundido)",
  "Función": "Ancla la estructura a la viga, por debajo de la teja española / de barro",
  "Particularidad": "Sale por el encaje natural de las tejas, sin romper ni perforar la cerámica",
}
```

- [ ] **Step 2: Update `lfeet.piece.specs`** (source: L-Feet, doc #8)

```js
specs: {
  "Material": "Aluminio AL6005-T5 anodizado + tornillería SUS304",
  "Función": "Fija el riel a techos metálicos (trapezoidal o de zinc)",
  "Ajuste": "Altura vertical regulable (diseño ranurado) para nivelar el riel",
  "Particularidad": "Almohadilla de EPDM pre-pegada en la base",
}
```

- [ ] **Step 3: Update `trap_madera.piece.specs`** (source: Tornillo Hangerbolt, doc #9)

```js
specs: {
  "Material": "Espárrago de acero inoxidable SUS304 + placa de aluminio",
  "Función": "Fija el riel en techos de lámina sobre correas de madera",
  "Ajuste": "Amplio rango de altura",
  "Particularidad": "Arandela cónica de EPDM para sellado hidrófugo (anti-filtración)",
}
```

- [ ] **Step 4: Update `trap_acero.piece.specs`** (source: L-Feet, doc #8 — closest documented base; no separate self-lock-bolt entry exists in the document, so only L-Feet facts are used)

```js
specs: {
  "Material": "Aluminio AL6005-T5 anodizado + tornillería SUS304",
  "Función": "Fija el riel a techos metálicos sobre estructura de acero",
  "Ajuste": "Altura vertical regulable (diseño ranurado) para nivelar el riel",
  "Particularidad": "Almohadilla de EPDM pre-pegada en la base",
}
```

- [ ] **Step 5: Update `galvanizada.piece.specs`** (source: Standing Seam, doc #11)

```js
specs: {
  "Material": "Aluminio AL6005-T5 macizo mecanizado + pernos SUS304",
  "Función": "Fija la estructura en techos de junta alzada (teja grafada)",
  "Particularidad": "No perfora el techo; conserva la garantía contra filtraciones",
}
```

- [ ] **Step 6: Update `concreto.piece.specs`** (source: Triángulo Ajustable 15–30°, doc #7)

```js
specs: {
  "Material": "Aluminio AL6005-T5 de gran calibre + brazos telescópicos SUS304",
  "Función": "Soporte triangular premontado para losas o techos planos",
  "Ajuste": "Inclinación regulable de 15° a 30°",
  "Particularidad": "Se fija con anclajes a la losa o sobre lastre, sin perforar",
}
```

- [ ] **Step 7: Verify each roof type in browser**

Open `index.html`. For EACH of the six `Techo` options (Teja, L-Feet, Trapezoidal
Madera, Trapezoidal Acero, Galvanizada, Concreto), generate a report and confirm the
fixing card shows the new real text. Expected: each roof type's card matches the
text above; no old placeholder labels (φ-hole, "Estructura", etc.) remain.

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "Replace roof-fixing specs with real product data"
```

---

### Task 3: Confirm the report still fits one single page

**Files:**
- Modify (only if overflow): `index.html` `@media print` block (lines ~314–356)

- [ ] **Step 1: Print-preview each roof type**

For each of the six roof types, generate a report and open the browser print preview
(Cmd+P). Expected: the entire report (header, info bar, BOM table, tech cards,
footer) fits on **one** Letter page.

- [ ] **Step 2: If anything overflows, tighten print spacing**

Only if a roof type spills to a second page, reduce vertical spacing in the
`@media print` block. Safe levers (adjust the smallest amount that fixes overflow):

```css
.tech-card { padding: 7px 0; gap: 8px; break-inside: avoid; }
.tech-card-info .specs { font-size: 9px; line-height: 1.5; }
```

Re-check the print preview for the offending roof type after each tweak.

- [ ] **Step 3: Commit (only if Step 2 changed anything)**

```bash
git add index.html
git commit -m "Tighten print spacing to keep report on one page"
```

---

## Self-Review

- **Spec coverage:** All 13 documented products are placed — 6 in `PIECES`
  (Task 1), 6 roof-type pieces in `ROOF_TYPES` (Task 2). Self-Lock (#10) and the
  duplicate Concreto-structure (#12) are intentionally not added as new rows
  (locked decision). One-page rule verified in Task 3. No catalog-page text is
  introduced. "Particularidad" used as the standout label. ✓
- **Placeholder scan:** Every code step contains the full specs object — no TBD /
  "similar to" / vague steps. ✓
- **Consistency:** All objects keep the existing `specs` key the renderer reads
  (`for (const [k, v] of Object.entries(piece.specs))`). Keys used: Material,
  Función, Ajuste, Longitud, Particularidad — all rendered identically as
  `Label: value`. ✓
- **No-invention check:** `trap_acero` (Task 2 Step 4) is the only spot the document
  lacks a dedicated entry; it reuses the documented L-Feet facts only, adding nothing
  new. Flagged inline for the reviewer. ✓
