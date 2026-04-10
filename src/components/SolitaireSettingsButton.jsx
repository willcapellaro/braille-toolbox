import { useEffect, useState } from 'react';
import { Box, Button, Divider, IconButton, Popover, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useSolitaireSettings } from '../context/SolitaireSettingsContext.jsx';

// Reads actual browser APIs:no interpretation beyond what the API says
function useDeviceInfo() {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    const measure = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const fine   = window.matchMedia('(pointer: fine)').matches;
      setInfo({
        screenW:    window.screen.width,
        screenH:    window.screen.height,
        vpW:        window.innerWidth,
        vpH:        window.innerHeight,
        dpr:        window.devicePixelRatio,
        maxTouch:   navigator.maxTouchPoints,
        coarse,
        fine,
        platform:   navigator.userAgentData?.platform ?? navigator.platform ?? '—',
        sizeClass:  window.innerWidth < 600 ? 'phone' : 'large',
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return info;
}

function Row({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="caption" sx={{ opacity: 0.5, flexShrink: 0 }}>{label}</Typography>
      <Typography variant="caption" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}

export default function SolitaireSettingsButton() {
  const [anchor, setAnchor] = useState(null);
  const sol = useSolitaireSettings();
  const info = useDeviceInfo();
  // Local display values for layout-reflow sliders:only committed on mouse/touch release
  const [draftPadV, setDraftPadV] = useState(null);
  const [draftPadH, setDraftPadH] = useState(null);
  if (!sol) return null;

  const padVDisplay = draftPadV ?? sol.padV;
  const padHDisplay = draftPadH ?? sol.padH;

  return (
    <>
      <IconButton size="small" onClick={e => setAnchor(e.currentTarget)} sx={{ color: 'text.primary' }} title="Card settings">
        ♠
      </IconButton>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => { setAnchor(null); setDraftPadV(null); setDraftPadH(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 260, maxHeight: '80vh', overflowY: 'auto' }}>

          {/* ── Debug panel ── */}
          <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.4 }}>Device info</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, bgcolor: 'action.hover', borderRadius: 1, p: 1 }}>
            {info ? (<>
              <Row label="Screen"        value={`${info.screenW} × ${info.screenH}px`} />
              <Row label="Viewport"      value={`${info.vpW} × ${info.vpH}px`} />
              <Row label="DPR"           value={info.dpr} />
              <Row label="Max touch pts" value={info.maxTouch} />
              <Row label="Coarse ptr"    value={info.coarse ? 'yes' : 'no'} />
              <Row label="Fine ptr"      value={info.fine ? 'yes' : 'no'} />
              <Row label="Platform"      value={info.platform} />
              <Row label="Size class"    value={info.sizeClass} />
            </>) : (
              <Typography variant="caption" sx={{ opacity: 0.4 }}>measuring…</Typography>
            )}
          </Box>

          <Divider />

          {/* ── Profile ── */}
          <Typography variant="caption">Layout profile</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.profileMode}
            onChange={(_, v) => { if (v) sol.setProfileMode(v); }}>
            <ToggleButton value="auto">Auto{sol.profileMode === 'auto' ? ` (${sol.activeProfile})` : ''}</ToggleButton>
            <ToggleButton value="phone">Phone</ToggleButton>
            <ToggleButton value="large">Large</ToggleButton>
          </ToggleButtonGroup>

          {/* ── Card scale ── */}
          <Typography variant="caption">Card scale:{sol.activeProfile} ({Math.round(sol.cardScale * 100)}%)</Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              size="small" min={0.25} max={5.0} step={0.05}
              value={sol.cardScale}
              onChange={sol.setCardScale}
              marks={[{ value: 0.25 }, { value: 1.0 }, { value: 5.0 }]}
              aria-label="Card scale"
            />
          </Box>

          {/* ── Legend scale ── */}
          <Typography variant="caption">Legend scale:{sol.activeProfile} ({Math.round(sol.legendScale * 100)}%)</Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              size="small" min={0.25} max={5.0} step={0.05}
              value={sol.legendScale}
              onChange={sol.setLegendScale}
              marks={[{ value: 0.25 }, { value: 1.0 }, { value: 5.0 }]}
              aria-label="Legend scale"
            />
          </Box>

          {/* ── Padding ── */}
          <Typography variant="caption">Page margins</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.marginMode}
            onChange={(_, v) => { if (v) sol.setMarginMode(null, v); }}>
            <ToggleButton value="site">Site</ToggleButton>
            <ToggleButton value="custom">Custom</ToggleButton>
          </ToggleButtonGroup>
          {sol.marginMode === 'custom' && (<>
          <Typography variant="caption">Padding vertical:{padVDisplay}px</Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              size="small" min={0} max={600} step={4}
              value={padVDisplay}
              onChange={(_, v) => setDraftPadV(v)}
              onChangeCommitted={(_, v) => { sol.setPadV(null, v); setDraftPadV(null); }}
              marks={[{ value: 0 }, { value: 300 }, { value: 600 }]}
              aria-label="Padding vertical"
            />
          </Box>
          <Typography variant="caption">Padding horizontal:{padHDisplay}px</Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              size="small" min={0} max={600} step={4}
              value={padHDisplay}
              onChange={(_, v) => setDraftPadH(v)}
              onChangeCommitted={(_, v) => { sol.setPadH(null, v); setDraftPadH(null); }}
              marks={[{ value: 0 }, { value: 300 }, { value: 600 }]}
              aria-label="Padding horizontal"
            />
          </Box>
          </>)}

          <Divider />

          {/* ── Visual settings ── */}
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

          <Divider />

          {/* ── Legend ── */}
          <Typography variant="caption">Legend</Typography>
          <ToggleButtonGroup exclusive size="small" value={sol.showLegend} onChange={sol.setShowLegend}>
            <ToggleButton value="off">Hide</ToggleButton>
            <ToggleButton value="on">Show</ToggleButton>
          </ToggleButtonGroup>
          {sol.showLegend === 'on' && (<>
            <Typography variant="caption">Legend position</Typography>
            <ToggleButtonGroup exclusive size="small" value={sol.legendPosition} onChange={sol.setLegendPosition}>
              <ToggleButton value="above">Above</ToggleButton>
              <ToggleButton value="right">Right</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption">Highlight visible cards</Typography>
            <ToggleButtonGroup exclusive size="small" value={sol.legendHighlight} onChange={sol.setLegendHighlight}>
              <ToggleButton value="off">Off</ToggleButton>
              <ToggleButton value="on">On</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption">Card highlight legend</Typography>
            <ToggleButtonGroup exclusive size="small" value={sol.legendHover} onChange={sol.setLegendHover}>
              <ToggleButton value="off">Off</ToggleButton>
              <ToggleButton value="on">On</ToggleButton>
            </ToggleButtonGroup>
          </>)}

          <Divider />

          {/* ── Clear ── */}
          <Button size="small" color="error" variant="outlined" onClick={sol.clearSettings}>
            Reset {sol.activeProfile} profile to defaults
          </Button>

        </Box>
      </Popover>
    </>
  );
}
