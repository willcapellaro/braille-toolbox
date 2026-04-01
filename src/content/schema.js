// Binary order: 321456 (storage) → 142536 (CSS grid rendering)
// Positions in binary string:  [dot3][dot2][dot1][dot4][dot5][dot6]
// CSS grid row-flow (2 cols):  [dot1][dot4][dot2][dot5][dot3][dot6]

const BINARY_TO_DOT = [3, 2, 1, 4, 5, 6]; // binary index → dot number

/**
 * Convert 321456-ordered binary to 142536 render pattern for BrailleCell CSS grid.
 */
export function binaryToRenderPattern(binary) {
  if (!binary || binary.length !== 6) return '000000';
  return binary[2] + binary[3] + binary[1] + binary[4] + binary[0] + binary[5];
}

/**
 * Convert dot-number string (e.g. "1", "236") to 142536 render pattern.
 */
export function dotsToRenderPattern(dotSet) {
  const dotToIndex = { 1: 0, 4: 1, 2: 2, 5: 3, 3: 4, 6: 5 };
  const pattern = ['0', '0', '0', '0', '0', '0'];
  String(dotSet || '')
    .split('')
    .filter((ch) => /[1-6]/.test(ch))
    .forEach((ch) => {
      pattern[dotToIndex[Number(ch)]] = '1';
    });
  return pattern.join('');
}

/**
 * Derive sorted dot-number string from 321456 binary.
 */
function binaryToDotSet(binary) {
  const active = [];
  for (let i = 0; i < 6; i++) {
    if (binary[i] === '1') active.push(BINARY_TO_DOT[i]);
  }
  active.sort((a, b) => a - b);
  return active.join('');
}

/**
 * Normalize a raw cell from braille-cells.json into the shape the UI needs.
 */
export function normalizeBrailleCell(raw) {
  const id = raw?.id || 'unknown';
  const binary = raw?.binary || '000000';
  const unicode = raw?.unicode || '';
  const verbal = raw?.verbal || '';
  const letterSymbol = raw?.letterSymbol || null;
  const numberSymbol = raw?.numberSymbol ?? null;
  const numberSymbolSpoken = raw?.numberSymbolSpoken || null;
  const symbol = raw?.symbol || null;
  const name = raw?.name || null;
  const contractions = raw?.contractions || [];

  // Dot sets: explicit for multi-cell, derived for single-cell
  const dotSets = Array.isArray(raw?.dotSets) && raw.dotSets.length > 0
    ? raw.dotSets
    : (() => { const ds = binaryToDotSet(binary); return ds ? [ds] : []; })();

  // Render pattern (142536 order for CSS grid)
  const dots = binaryToRenderPattern(binary);

  // Display labels (for component compat)
  let primaryLabel, speechLabel;
  if (letterSymbol) {
    primaryLabel = letterSymbol.toUpperCase();
    speechLabel = `Letter ${letterSymbol.toUpperCase()}`;
  } else if (symbol) {
    primaryLabel = symbol;
    speechLabel = name || id;
  } else {
    primaryLabel = name || id;
    speechLabel = name || id;
  }

  // Synthesize meanings array (for popover chips)
  const meanings = [];
  if (letterSymbol) {
    meanings.push({ type: 'letter', value: letterSymbol });
  }
  if (numberSymbol != null) {
    meanings.push({ type: 'digit', value: numberSymbol, description: numberSymbolSpoken || numberSymbol });
  }
  if (symbol && !letterSymbol) {
    meanings.push({ type: 'punctuation', value: symbol, description: name || '' });
  }
  if (!letterSymbol && !symbol && name) {
    meanings.push({ type: 'indicator', value: name, description: verbal });
  }

  return {
    id,
    binary,
    dots,       // 142536 render pattern
    dotSets,    // dot-number strings, e.g. ["1"] or ["6","236"]
    unicode,
    verbal,
    letterSymbol,
    numberSymbol,
    numberSymbolSpoken,
    symbol,
    name,
    contractions,
    display: { primaryLabel, speechLabel },
    meanings,
    source: raw,
  };
}

/**
 * Normalize the full JSON (handles { cells: [...] } or bare array).
 */
export function normalizeBrailleCells(rawData) {
  let arr;
  if (Array.isArray(rawData)) arr = rawData;
  else if (rawData && Array.isArray(rawData.cells)) arr = rawData.cells;
  else return [];
  return arr.map(normalizeBrailleCell);
}
