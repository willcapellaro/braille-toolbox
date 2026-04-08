import { useState } from 'react';
import { Box, IconButton, Popover, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useSolitaireSettings } from '../context/SolitaireSettingsContext.jsx';

export default function SolitaireSettingsButton() {
  const [anchor, setAnchor] = useState(null);
  const sol = useSolitaireSettings();
  if (!sol) return null;

  return (
    <>
      <IconButton size="small" onClick={e => setAnchor(e.currentTarget)} sx={{ color: 'text.primary' }} title="Card settings">
        ♠
      </IconButton>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 240 }}>
          <Typography variant="caption">Card outline</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.cardOutline} onChange={sol.setCardOutline}>
            <ToggleButton value="never">Never</ToggleButton>
            <ToggleButton value="hover">Hover</ToggleButton>
            <ToggleButton value="always">Always</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption">Cell bounds</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.cellBounds} onChange={sol.setCellBounds}>
            <ToggleButton value="never">Never</ToggleButton>
            <ToggleButton value="hover">Hover</ToggleButton>
            <ToggleButton value="always">Always</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption">Braille dots</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.brailleDots} onChange={sol.setBrailleDots}>
            <ToggleButton value="hover">Hover</ToggleButton>
            <ToggleButton value="always">Always</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption">Unraised dots</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.unraisedDots} onChange={sol.setUnraisedDots}>
            <ToggleButton value="never">Never</ToggleButton>
            <ToggleButton value="hover">Hover</ToggleButton>
            <ToggleButton value="always">Always</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption">Print overlay</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.printOverlay} onChange={sol.setPrintOverlay}>
            <ToggleButton value="never">Never</ToggleButton>
            <ToggleButton value="hover">Hover</ToggleButton>
          </ToggleButtonGroup>
          {sol.printOverlay !== 'never' && (<>
            <Typography variant="caption">Print style</Typography>
            <ToggleButtonGroup exclusive size="small" value={sol.printStyle} onChange={sol.setPrintStyle}>
              <ToggleButton value="exact">Exact</ToggleButton>
              <ToggleButton value="ortho">Ortho</ToggleButton>
            </ToggleButtonGroup>
          </>)}
          <Typography variant="caption">Suit color</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.suitColor} onChange={sol.setSuitColor}>
            <ToggleButton value="off">Off</ToggleButton>
            <ToggleButton value="on">On</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption">Drop hints</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.dropHints} onChange={sol.setDropHints}>
            <ToggleButton value="off">Off</ToggleButton>
            <ToggleButton value="on">On</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption">Text selection</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.noSelect} onChange={sol.setNoSelect}>
            <ToggleButton value="off">Allow</ToggleButton>
            <ToggleButton value="on">Disable</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption">Page scroll</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.noScroll} onChange={sol.setNoScroll}>
            <ToggleButton value="off">Allow</ToggleButton>
            <ToggleButton value="on">Disable</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption">Card background</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.cardBg} onChange={sol.setCardBg}>
            <ToggleButton value="white">White</ToggleButton>
            <ToggleButton value="theme">Theme</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Popover>
    </>
  );
}
