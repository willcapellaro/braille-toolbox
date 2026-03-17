# Project Mechanics

This file explains how the app is organized and how to safely change it without reintroducing redundant data.

## Core Rule: One Braille Data Source

All braille cell content is centralized in:

- `src/content/braille-cells.json`

Do not create `v2`, `v3`, or alternate braille-cell JSON files. Add/edit entries in this one file only.

## Directory Map (App)

- `src/main.jsx`
  - App bootstrap, uses `HashRouter`.
- `src/App.jsx`
  - Top-level layout, tabs, and route registration.
- `src/pages/`
  - Route-level pages (`QuickRefPage`, `IntroPage`, etc.).
- `src/content/`
  - Content pipeline:
  - `braille-cells.json`: canonical braille metadata.
  - `index.js`: content query helpers (`getBrailleCellById`, etc.).
  - `schema.js`: normalization and meaning utilities.
- `src/components/`
  - Reusable UI components (including braille token rendering).
- `public/`
  - Static assets served by Vite.

## Content Pipeline

1. `braille-cells.json` stores source data.
2. `src/content/index.js` imports and normalizes it.
3. Pages/components consume content via exported helpers:
   - `getBrailleCells()`
   - `getBrailleCellById(id)`
   - `getBrailleCellByDots(dots)`
   - `getBrailleMetadata(...)`

If a page needs braille metadata, use these helpers instead of hardcoding dot patterns in page files.

## Modify Existing Braille Items

1. Open `src/content/braille-cells.json`.
2. Find the target cell by `id`.
3. Update `dots`, `dotSets`, `display`, `meanings`, or `contextRules`.
4. Run:
   - `npm run build`
5. Verify affected pages (typically `QuickRefPage` and `IntroPage`).

## Add New Braille Items

Add a new object in `cells` with this shape:

```json
{
  "id": "my-new-id",
  "dots": "100000",
  "dotSets": ["1"],
  "unicode": "U+2801",
  "display": {
    "primaryLabel": "A",
    "speechLabel": "Letter A"
  },
  "meanings": [
    {
      "type": "letter",
      "value": "a",
      "description": "Example meaning"
    }
  ],
  "contextRules": {}
}
```

Notes:
- `dotSets` is optional for single-cell items; include it for multi-cell sequences.
- Keep `type` values aligned with `MEANING_TYPE_PRIORITY` in `src/content/schema.js`.

## Add a New Content Page

1. Create a page component in `src/pages/`, e.g. `MyPage.jsx`.
2. Import it in `src/App.jsx`.
3. Register a route in `<Routes>`.
4. Optionally add a tab entry in `NavTabs` if it should be top-level navigation.
5. Build and verify:
   - `npm run build`

## Routing Mechanics

The app uses `HashRouter` in `src/main.jsx`, so URLs are hash-based in production. Route paths are still defined normally in `src/App.jsx` (for example `/quickref`, `/intro`).

## Redundancy Guardrails

- Keep only one braille content file: `src/content/braille-cells.json`.
- Do not duplicate dot patterns in page files when content can come from `getBrailleCellById`.
- Keep normalization logic in `src/content/schema.js`; keep page logic presentation-only.
- Prefer extending existing helpers in `src/content/index.js` over adding parallel content access utilities.
