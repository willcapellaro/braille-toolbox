import brailleCells from './braille-cells.json';
import { normalizeBrailleCells } from './schema';

const normalizedBrailleCells = normalizeBrailleCells(brailleCells);

export function getBrailleCells() {
  return normalizedBrailleCells;
}

export function getRawBrailleCells() {
  return brailleCells;
}

export function getBrailleCellById(cellId) {
  if (!cellId) {
    return null;
  }

  return normalizedBrailleCells.find((cell) => cell.id === cellId || cell.binary === cellId) || null;
}
