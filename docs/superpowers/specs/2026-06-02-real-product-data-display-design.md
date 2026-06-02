# Design: Real Product Data in the BOM Report

**Date:** 2026-06-02
**Project:** meico-bom-calculator
**Status:** Awaiting user review

## Goal

Replace the placeholder ("dummy") product catalog in `index.html` with the real
product information, and display it on the existing **single, compact, print-ready
page** in a clean, structured way — not as paragraphs.

## Hard rules

1. **No invented information.** Every characteristic shown must come from the source
   document `Eestructuras chiko para cálculo.docx`. Wording may be *shortened and
   rephrased* to fit, but no spec, number, or claim may be added that is not in the
   document.
2. **Drop the catalog-page reference** — it is not relevant to the client.
3. **Stay on one single page.** No multi-page report, no separate detail section.

## Display structure

Each product is shown as a compact card with a short, consistent set of labeled
facts. Labels used (a product uses only the ones its document text supports):

- **Material** — what the piece is made of
- **Función** — what it does, in one short line
- **Ajuste** / **Longitud** / **Compatibilidad** — included only when the document
  states it
- **Particularidad** — the standout technical detail for that piece

The number of facts **varies per product** — some have 3, some have 4–5 — packing
in as much real information as fits the one page. (This replaces the old
`Destacado` idea; the chosen label is **Particularidad**.)

## Approaches considered

- **A — Condensed structured facts (CHOSEN).** Distill each paragraph into short
  labeled facts. Fits one page; scannable; professional.
- **B — Full paragraphs.** Rejected: breaks the one-page rule.
- **C — Compact page + expandable detail section.** Rejected: user wants strictly
  one page.

## The distilled product data

Below is the proposed text for all 13 products, taken only from the document.
**This is the main thing to review** — check the wording and that nothing is wrong
or invented.

### Structure components

**1. Riel 537-Rail 4700mm** (`CHIKO 537-Rail 4700mm`)
- Material: Aluminio AL6005-T5 extruido, anodizado grado marino
- Función: Viga principal de soporte donde descansan y se aseguran los paneles
- Longitud: 4.700 mm (optimizada para hileras de varios paneles)
- Particularidad: Resiste vientos extremos de hasta 234 km/h (evaluado en SAP2000)

**2. Kit de Unión / Empalme** (`CHIKO 537-Rail Splice Kit`)
- Material: Aluminio AL6005-T5 anodizado + tornillería SUS304
- Función: Une dos rieles 537 de forma interna y alineada
- Particularidad: Permite filas de más de 4,7 m sin perder rigidez ni continuidad

**3. Grapa Intermedia c/ Puesta a Tierra** (`CHIKO Grounding Adjustable Mid Clamp`)
- Material: Aluminio AL6005-T5 anodizado + tornillo SUS304
- Función: Sujeta dos paneles consecutivos al riel
- Ajuste: Marcos de 30 a 40 mm de espesor
- Particularidad: Puesta a tierra integrada; sus dientes rompen el anodizado del marco para dar continuidad eléctrica

**4. Grapa Final c/ Puesta a Tierra** (`CHIKO Grounding Adjustable End Clamp`)
- Material: Aluminio AL6005-T5 anodizado + herrajes SUS304
- Función: Cierra el extremo final de cada fila de paneles sobre el riel
- Ajuste: Se adapta a paneles de 30 a 40 mm
- Particularidad: Puesta a tierra integrada; asegura el módulo contra la succión del viento

**5. Zapata de Puesta a Tierra** (`CHIKO Grounding Lug`)
- Material: Aluminio AL6005-T5 macizo anodizado + tornillería SUS304
- Función: Se fija en el extremo del riel y asegura el cable de cobre de tierra
- Particularidad: Interconecta todas las filas y dirige las descargas a la malla de tierra del sitio

**6. Kit de Fijación para Triángulo** (`CHIKO Rail Fix Kit on Adjustable Triangle`)
- Material: Aluminio AL6005-T5 + acero inoxidable SUS304 (pernos en T)
- Función: Sujeta el riel sobre el triángulo ajustable de techos planos
- Particularidad: Acople rígido perpendicular que resiste la torsión del viento

**7. Triángulo Ajustable 15–30°** (`CHIKO Alu Adjustable Triangle 15-30deg`)
- Material: Aluminio AL6005-T5 de gran calibre + brazos telescópicos SUS304
- Función: Soporte triangular premontado para losas o techos planos
- Ajuste: Inclinación regulable de 15° a 30°
- Particularidad: Se fija con anclajes a la losa o sobre lastre, sin perforar

### Roof fixings

**8. L-Feet (Pies en L)**
- Material: Aluminio AL6005-T5 anodizado + tornillería SUS304
- Función: Fija el riel a techos metálicos (trapezoidal o de zinc)
- Ajuste: Altura vertical regulable (diseño ranurado) para nivelar el riel
- Particularidad: Almohadilla de EPDM pre-pegada en la base

**9. Tornillo Hangerbolt** (Perno de Suspensión)
- Material: Espárrago de acero inoxidable SUS304 + placa de aluminio
- Función: Fija el riel en techos de lámina sobre correas de madera o metal
- Ajuste: Amplio rango de altura
- Particularidad: Arandela cónica de EPDM para sellado hidrófugo (anti-filtración)

**10. Self-Lock (Abrazadera de Bloqueo Rápido)**
- Material: Aluminio AL6005-T5 anodizado + clip de acero inoxidable
- Función: Fija los módulos al riel (como grapa intermedia o final)
- Particularidad: Auto-bloqueo a presión desde arriba; reduce el tiempo de montaje

**11. Standing Seam (Junta Alzada / Teja Grafada)**
- Material: Aluminio AL6005-T5 macizo mecanizado + pernos SUS304
- Función: Fija la estructura en techos de junta alzada (teja grafada)
- Particularidad: No perfora el techo; conserva la garantía contra filtraciones

**12. Estructura Ajustable para Concreto** (Soporte Triangular)
- Material: Aluminio AL6005-T5 de gran espesor + tornillería de alta resistencia
- Función: Soporte triangular para losas o techos planos de concreto
- Ajuste: Ángulo regulable (rangos comunes 10°–15°, 15°–30° o 30°–60°)
- Particularidad: Se fija con anclajes a la losa o sobre bloques de lastre

**13. Gancho para Teja Española** (Tile Hook)
- Material: Acero inoxidable SUS304 de gran espesor (o aluminio fundido)
- Función: Ancla la estructura a la viga, por debajo de la teja española / de barro
- Particularidad: Sale por el encaje natural de las tejas, sin romper ni perforar la cerámica

## Mapping to the existing tool

The tool currently calculates 12 component slots (6 fixed pieces + 6 roof-type
fixings). These map directly to products 1–9, 11, 12, 13 above.

**Decisions (confirmed by user 2026-06-02):**
- **#10 Self-Lock** — do **not** add a new BOM row. No calculation change.
- **Keep every existing option and piece exactly as is** — do not add, remove,
  merge, or rename any roof type or component. The #12 / #7 overlap is left
  untouched: whatever the tool currently does stays.

This task changes **only product descriptions/specs and how they display** — it does
**not** change the calculation formulas, the roof-type options, or which pieces are
counted. Every existing option remains exactly as it is today.

## Out of scope (not in this task)

- Prices / cost totals
- Product images
- PDF / Excel export
- Catalog editing UI
- Any change to the calculation engine

## Success criteria

- All product cards on the report show only real, document-sourced facts.
- The report still prints as one single page for every roof type.
- "Particularidad" label used for the standout fact; no "Destacado".
- No catalog-page references shown.
