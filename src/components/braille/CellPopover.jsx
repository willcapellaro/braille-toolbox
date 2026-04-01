import { Box, Chip, Link as MuiLink, Typography } from '@mui/material';
import { getBrailleCellById } from '../../content';
import BrailleCell from '../../lib/braille/BrailleCell';

function renderDotSequence(cell) {
  if (!cell) return null;
  // Multi-cell sequences use dotSets; single cells use the main dots pattern
  const patterns = cell.dotSets?.length > 1
    ? cell.dotSets.map((ds) => {
        // Convert dot-number string to render pattern inline
        const dotToIndex = { 1: 0, 4: 1, 2: 2, 5: 3, 3: 4, 6: 5 };
        const p = ['0','0','0','0','0','0'];
        String(ds).split('').filter(ch => /[1-6]/.test(ch)).forEach(ch => { p[dotToIndex[Number(ch)]] = '1'; });
        return p.join('');
      })
    : [cell.dots];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
      {patterns.map((pattern, i) => (
        <BrailleCell key={`${cell.id}-${i}`} pattern={pattern} size="sm" label={cell.display?.speechLabel || cell.id} />
      ))}
    </Box>
  );
}

function deriveCategory(cell) {
  if (cell.letterSymbol) return 'Letter';
  if (cell.symbol && !cell.letterSymbol) return 'Punctuation';
  if (cell.name) return 'Indicator';
  return null;
}

/**
 * Unified popover content for any braille cell.
 * Always renders from the central normalized cell data — one source of truth.
 */
export default function CellPopover({ cellId }) {
  const cell = getBrailleCellById(cellId);
  if (!cell) {
    const subject = encodeURIComponent('Braille Toolbox Error Report');
    const body = encodeURIComponent(
      `You are reporting an error for the following component:\n\n` +
      `  Component: CellPopover\n` +
      `  URL path: ${window.location.hash || '/'}\n` +
      `  Component ID: ${cellId || '(none)'}\n\n` +
      `This is often good enough, but please feel free to add any additional notes or suggested solutions below:\n\n`
    );
    return (
      <Box sx={{ p: 3, textAlign: 'center', maxWidth: 320 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Coming soon</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Content for this cell isn&#8217;t available yet.
        </Typography>
        <MuiLink
          href={`mailto:will+btxerror@capellaro.com?subject=${subject}&body=${body}`}
          underline="hover"
          variant="body2"
        >
          Report content error
        </MuiLink>
      </Box>
    );
  }

  const category = deriveCategory(cell);

  return (
    <Box sx={{ p: 2, maxWidth: 360 }}>
      <Typography variant="h6" sx={{ mb: 0.25 }}>
        {cell.display.speechLabel}
      </Typography>

      {category && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {category}
        </Typography>
      )}

      <Box sx={{ mb: 1 }}>{renderDotSequence(cell)}</Box>

      {cell.display.primaryLabel && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Symbol: {cell.display.primaryLabel}
        </Typography>
      )}

      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {cell.verbal}
      </Typography>

      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Binary: {cell.binary}
      </Typography>

      {cell.unicode && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          Unicode: {cell.unicode}
        </Typography>
      )}

      {cell.meanings.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {cell.meanings.map((m, i) => (
            <Chip
              key={`${cell.id}-m-${i}`}
              size="small"
              variant="outlined"
              label={`${m.type}: ${m.value}${m.description ? ` (${m.description})` : ''}`}
            />
          ))}
        </Box>
      )}

      {cell.contractions && cell.contractions.length > 0 && (
        <Typography variant="body2" color="text.secondary">
          In contractions: {cell.contractions.join(', ')}
        </Typography>
      )}
    </Box>
  );
}
