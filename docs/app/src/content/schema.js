const RESERVED_KEYS = new Set(['titvar', 'descvar']);

function asCleanText(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

function humanizeScenarioKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (match) => match.toUpperCase());
}

function extractScenarios(dataDecoded) {
  return Object.entries(dataDecoded)
    .filter(([key, value]) => !RESERVED_KEYS.has(key) && asCleanText(value) !== '')
    .map(([key, value]) => ({
      type: key,
      label: humanizeScenarioKey(key),
      content: asCleanText(value),
    }));
}

export function normalizeBrailleCell(rawCell) {
  const binary = asCleanText(rawCell?.binary);
  const dataDecoded = rawCell?.dataDecoded || {};
  const title = asCleanText(dataDecoded.titvar) || `Cell ${binary}`;
  const description = asCleanText(dataDecoded.descvar);
  const scenarios = extractScenarios(dataDecoded);

  const info = [];
  if (description) {
    info.push({ type: 'general', label: 'General', content: description });
  }

  scenarios.forEach((scenario) => {
    info.push(scenario);
  });

  return {
    id: binary,
    binary,
    title,
    description,
    info,
    scenarios,
    source: rawCell,
  };
}

export function normalizeBrailleCells(rawCells) {
  if (!Array.isArray(rawCells)) {
    return [];
  }

  return rawCells.map(normalizeBrailleCell);
}