# Design: Remove NIT + Multiple Arrangements

**Date:** 2026-06-02
**Project:** meico-bom-calculator
**Status:** Awaiting user review

## Goals

1. **Remove the NIT field** from the input form and the report.
2. **Support multiple arrangements** ("arreglos"): the user can add several
   arrangement lines (e.g. for an L- or P-shaped roof with separate sections), each
   with its own panel count, and the materials list totals them all up.

## Decisions (confirmed with user)

- **What varies per arrangement line:** only the count — *Paneles por arreglo* and
  *N.º de arreglos*. **Panel size (largo/ancho), orientation (posición), and roof
  type (techo) are shared for the whole project.**
- **How materials total up:** "Add up sections" — each arrangement line is
  calculated independently using the existing formula, then every material quantity
  is summed across lines. A single line produces results identical to the current
  tool (backward compatible).
- **Arrangement labels:** auto-numbered "Arreglo 1", "Arreglo 2", … (no manual
  naming).
- **Two distinct display places:**
  - **Header info bar → "Paneles":** shows one entry per arrangement line in the
    existing format `subtotal (N arr. × paneles)` — e.g. `28 (2 arr. × 14)` and
    `6 (1 arr. × 6)`. No panel grand-total is shown.
  - **Lista de Materiales:** shows the **combined total** material quantities
    (summed across all arrangements); the summary's "Total piezas" is the overall
    total. This is unchanged behavior — it just now reflects summed inputs.

## Input form changes

Remove the NIT input. Reorganize inputs into two zones:

**Datos del proyecto (shared, single set):**
- Cliente, Dirección, Ciudad, Fecha
- Tipo de techo, Posición
- Panel: Largo, Ancho

**Arreglos (repeatable list):**
- Starts with **one** arrangement line (so the default looks like today).
- Each line: `Arreglo N` label + `Paneles por arreglo` input + `N.º de arreglos`
  input + a remove "×" button.
- A **"+ Agregar arreglo"** button appends a new line.
- Removing is disabled when only one line remains (there must always be at least
  one).

```
DATOS DEL PROYECTO
 Cliente [__________]    Dirección [__________]
 Ciudad  [______]        Fecha [________]
 Tipo de techo [Concreto ▾]   Posición [Portrait ▾]
 Panel:  Largo [2000] mm   Ancho [1100] mm

ARREGLOS
 ┌──────────────────────────────────────────────────────┐
 │ Arreglo 1   Paneles/arreglo [14]   N.º arreglos [2]   × │
 │ Arreglo 2   Paneles/arreglo [ 6]   N.º arreglos [1]   × │
 └──────────────────────────────────────────────────────┘
            [ + Agregar arreglo ]
```

## Calculation

The existing `calculate()` computes a BOM for one (paneles, arreglos) pair plus the
shared largo/ancho/posición/techo. The change:

1. Read the shared fields once (largo, ancho, posición, techo).
2. Read the list of arrangement lines: `[{paneles, arreglos}, ...]`.
3. For **each** line, run the existing per-line formula to get that line's BOM.
4. **Sum** the quantity of each component key across all lines into a combined BOM.
5. Build the info bar's per-arrangement Paneles entries from the line subtotals
   (`paneles × arreglos` per line, formatted `subtotal (arreglos arr. × paneles)`).

The per-line formula itself is **unchanged** (no change to how rieles, conectores,
grapas, grounding, fijaciones, or triangle kits are computed for a single section).
`triangleKit` continues to appear only when `techo === 'concreto'`; its quantity is
the sum of per-line triangle-kit quantities.

Component keys are identical across lines, so summing is a simple key-by-key add.

## Report changes

- **Info bar:** the single "Paneles" item becomes a "Paneles" item that lists each
  arrangement on its own line in the `subtotal (N arr. × paneles)` format. All other
  info-bar items (Cliente, Dirección, Ciudad, Fecha, Techo, Posición) are unchanged
  except **NIT is removed**.
- **Lista de Materiales (BOM table + summary):** unchanged structure; quantities are
  now the summed totals. "Componentes distintos" and "Total piezas" reflect the
  combined BOM.
- Must still fit **one single page** for typical use (a handful of arrangements).

## Out of scope

- Per-line orientation / panel size / roof type (explicitly shared).
- Prices, images, exports, catalog editing.
- Changing any per-section calculation formula.

## Success criteria

- No NIT anywhere (form or report).
- Can add/remove arrangement lines; always at least one.
- One arrangement line gives the exact same materials as the current tool.
- Multiple lines: each material quantity equals the sum of the per-line quantities.
- Header "Paneles" shows one `subtotal (N arr. × paneles)` entry per line; no panel
  grand-total.
- Lista de Materiales shows the combined material totals.
- Report still prints on one page for typical arrangement counts.
