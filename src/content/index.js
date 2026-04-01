import brailleCellsRaw from './braille-cells.json';
import contractionsRaw from './contractions.json';
import { normalizeBrailleCells, dotsToRenderPattern, binaryToRenderPattern } from './schema';

// ── Normalized cell data ────────────────────────────────────────────────────
const brailleCellsData = brailleCellsRaw.default || brailleCellsRaw;
const normalizedCells = normalizeBrailleCells(brailleCellsData);
const cellsById = new Map(normalizedCells.map((c) => [c.id, c]));

// Reverse map: dotSet string → first matching cell (for resolving raw dot specs)
const cellsByDotSet = new Map();
normalizedCells.forEach((c) => {
  if (c.dotSets?.length === 1) {
    const key = c.dotSets[0];
    if (!cellsByDotSet.has(key)) cellsByDotSet.set(key, c);
  }
});

// ── Contractions cross-reference ────────────────────────────────────────────
const contractionsData = contractionsRaw.default || contractionsRaw;

// ── Public helpers ──────────────────────────────────────────────────────────

/** Convert a dot-number string (e.g. "1", "236") to a 6-char render pattern. */
export function dotsToPattern(dotSet) {
  return dotsToRenderPattern(dotSet);
}

/** Get all normalized cells. */
export function getBrailleCells() {
  return normalizedCells;
}

/** Look up a single cell by id. */
export function getBrailleCellById(cellId) {
  return cellId ? cellsById.get(cellId) || null : null;
}

/** Get the raw JSON data (for admin import/export). */
export function getRawBrailleCells() {
  return brailleCellsData;
}

/** Get the raw contractions map. */
export function getRawContractions() {
  return contractionsData;
}

/** Look up contraction metadata by id. */
export function getContraction(contractionId) {
  return contractionsData[contractionId] || null;
}

/** Look up a cell by its dot-number string (e.g. "1" → letter A). First match wins. */
export function getCellByDotSet(dotSet) {
  return dotSet ? cellsByDotSet.get(dotSet) || null : null;
}

/** Quick metadata bundle for popover / tooltip display. */
export function getBrailleMetadata({ lookupId, patterns = [], fallbackDescription = '', fallbackName = '' }) {
  const cell = lookupId ? getBrailleCellById(lookupId) : null;
  const meanings = cell?.meanings || [];
  const description = cell?.verbal || fallbackDescription;
  const preview = cell?.verbal || cell?.display?.speechLabel || fallbackName;

  return { sourceCell: cell, meanings, description, preview };
}

/** Resolve an ASCII braille spec string (e.g. "a" or "id:a" or "236") into render data. */
export function resolveAsciiBrailleSpec(spec) {
  if (!spec) return { lookupId: '', symbol: '', name: 'Braille cell', dotSets: [], patterns: [], unresolved: true, rawSpec: spec };

  const parts = String(spec).trim().split(/\s+/).filter(Boolean);
  const dotSets = [];
  const patterns = [];
  let lookupId = '';
  let symbol = '';
  let name = 'Braille cell';
  let unresolved = false;

  parts.forEach((part) => {
    const id = part.startsWith('id:') ? part.slice(3) : (/^[1-6]+$/.test(part) ? null : part);

    if (!id) {
      // Raw dot numbers
      dotSets.push(part);
      patterns.push(dotsToRenderPattern(part));
      // Reverse-lookup: find the cell whose single dotSet matches
      if (!lookupId) {
        const match = getCellByDotSet(part);
        if (match) {
          lookupId = match.id;
          symbol = symbol || match.display?.primaryLabel || '';
          name = match.display?.speechLabel || match.display?.primaryLabel || name;
        }
      }
      return;
    }

    const cell = getBrailleCellById(id)
      // Legacy image IDs like "dot1_a" or "dot12_b" → extract trailing letter
      || (/^dot\d+_([a-z])$/i.test(id) ? getBrailleCellById(id.match(/^dot\d+_([a-z])$/i)[1].toLowerCase()) : null);
    if (!cell) { unresolved = true; return; }

    lookupId = lookupId || cell.id;
    symbol = symbol || cell.display?.primaryLabel || '';
    name = cell.display?.speechLabel || cell.display?.primaryLabel || name;
    (cell.dotSets || []).forEach((ds) => {
      dotSets.push(ds);
      patterns.push(dotsToRenderPattern(ds));
    });
  });

  if (patterns.length === 0) unresolved = true;

  return { lookupId, symbol, name, dotSets, patterns, unresolved, rawSpec: spec };
}
