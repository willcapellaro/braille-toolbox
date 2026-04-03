import { Box, Popover, SwipeableDrawer, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { getBrailleCellById, getBrailleMetadata, resolveAsciiBrailleSpec } from '../../content';
import BrailleCell from '../../lib/braille/BrailleCell';
import CellPopover from './CellPopover';

function renderBrailleSequence(patterns, label) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
      {patterns.map((pattern, index) => (
        <BrailleCell key={`${label}-${pattern}-${index}`} pattern={pattern} size="sm" label={label} />
      ))}
    </Box>
  );
}

/**
 * Build display model from a cell id, a spec string, or a legacy item object.
 * All three paths produce the same shape so rendering is identical.
 */
function useModel({ cellId, spec, item }) {
  return useMemo(() => {
    // Path 1: direct cell id (preferred — used by QuickRefPage)
    if (cellId) {
      const cell = getBrailleCellById(cellId);
      if (!cell) return { unresolved: true, rawSpec: cellId };
      return {
        lookupId: cell.id,
        symbol: cell.display.primaryLabel,
        name: cell.display.speechLabel,
        dotSets: cell.dotSets || [],
        patterns: [cell.dots],
        detail: cell.numberSymbol || '',
        unresolved: false,
        rawSpec: '',
      };
    }

    // Path 2: legacy item object
    if (item) {
      return {
        lookupId: item.lookupId || item.id || '',
        symbol: item.symbol || '',
        name: item.name || item.id || 'Braille cell',
        dotSets: item.dotSets || [],
        patterns: item.patterns || [],
        detail: item.detail || '',
        unresolved: false,
        rawSpec: '',
      };
    }

    // Path 3: spec string (used by IntroPage markdown tokens)
    if (spec) {
      const resolved = resolveAsciiBrailleSpec(spec);
      return {
        lookupId: resolved.lookupId,
        symbol: resolved.symbol,
        name: resolved.name,
        dotSets: resolved.dotSets,
        patterns: resolved.patterns,
        detail: '',
        unresolved: resolved.unresolved,
        rawSpec: resolved.rawSpec,
      };
    }

    return { unresolved: true, rawSpec: '' };
  }, [cellId, spec, item]);
}

export default function BrailleInteractiveToken({
  cellId = '',
  spec = '',
  item = null,
  variant = 'inline',
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const model = useModel({ cellId, spec, item });

  if (model.unresolved) {
    return (
      <Typography component="span" variant="caption" color="text.primary" sx={{ fontWeight: 600 }}>
        [unresolved:{model.rawSpec || cellId || spec}]
      </Typography>
    );
  }

  const preview = getBrailleMetadata({
    lookupId: model.lookupId,
    patterns: model.patterns,
    fallbackName: model.name,
  }).preview;

  const open = isMobile ? drawerOpen : Boolean(anchorEl);

  const handleOpen = (event) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <Tooltip
        arrow
        placement="top"
        title={
          <Box>
            <Typography variant="subtitle2">{model.name}</Typography>
            <Typography variant="caption">{preview}</Typography>
          </Box>
        }
      >
        {variant === 'grid' ? (
          <Box
            component="button"
            type="button"
            onClick={handleOpen}
            sx={{
              border: 0,
              background: 'transparent',
              color: 'text.primary',
              p: 0.25,
              width: '100%',
              minHeight: 'var(--bt-li-min-height, 64px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.35,
              cursor: 'pointer',
              borderRadius: 1,
              '&:hover': { backgroundColor: 'action.hover' },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '1px',
              },
            }}
          >
            {renderBrailleSequence(model.patterns, model.name)}
            {(() => {
              const label = model.symbol;
              const isLong = label.length > 1;
              // Lowercase single letters; keep multi-char labels as-is
              const display = !isLong && /^[A-Z]$/.test(label) ? label.toLowerCase() : label;
              const hasNumber = Boolean(model.detail);
              return (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 0.5, lineHeight: 1 }}>
                  <Typography
                    variant={isLong ? 'caption' : 'h6'}
                    sx={{
                      lineHeight: 1,
                      fontSize: isLong
                        ? { xs: '0.6rem', md: '0.7rem' }
                        : { xs: '1.35rem', md: '1.55rem' },
                      fontWeight: isLong ? 600 : undefined,
                    }}
                  >
                    {display}
                  </Typography>
                  {hasNumber && (
                    <Typography
                      variant="caption"
                      sx={{
                        lineHeight: 1,
                        fontSize: { xs: 'calc(1.35rem - 2px)', md: 'calc(1.55rem - 2px)' },
                      }}
                    >
                      {model.detail}
                    </Typography>
                  )}
                </Box>
              );
            })()}
          </Box>
        ) : (
          <Box
            component="button"
            type="button"
            onClick={handleOpen}
            sx={{
              border: 0,
              background: 'transparent',
              color: 'text.primary',
              fontWeight: 600,
              p: 0.25,
              m: 0,
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: 1,
              verticalAlign: 'middle',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            {renderBrailleSequence(model.patterns, model.name)}
          </Box>
        )}
      </Tooltip>

      {isMobile ? (
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          onOpen={() => {}}
          disableSwipeToOpen
          disableScrollLock
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '70vh',
              overflow: 'auto',
            },
          }}
        >
          <Box sx={{ width: 40, height: 4, bgcolor: 'text.disabled', borderRadius: 2, mx: 'auto', mt: 1.5, mb: 0.5 }} />
          <CellPopover cellId={model.lookupId} />
        </SwipeableDrawer>
      ) : (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <CellPopover cellId={model.lookupId} />
        </Popover>
      )}
    </>
  );
}