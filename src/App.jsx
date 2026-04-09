import {
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Link as MuiLink,
  Popover,
  Slider,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Link as RouterLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SolitaireSettingsProvider, useSolitaireSettings } from './context/SolitaireSettingsContext';
import SolitaireSettingsButton from './components/SolitaireSettingsButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCircleHalfStroke, faSliders, faXmark, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import AboutPage from './pages/AboutPage';
import ArchivePage from './pages/ArchivePage';
import QuickRefPage from './pages/QuickRefPage';
import AdminPage from './pages/AdminPage';
import GamesPage from './pages/GamesPage';
import SolitairePage from './pages/SolitairePage';
import { INK, PAPER } from './theme/colors';

// ── Color utilities ───────────────────────────────────────────────────────────

function hexLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// ── Theme ─────────────────────────────────────────────────────────────────────

const FONT = 'var(--bt-font-family)';

function buildTheme(mode, ink, paper) {
  return createTheme({
    palette: {
      mode,
      primary:    { main: ink },
      secondary:  { main: ink },
      text:       { primary: ink, secondary: ink, disabled: ink },
      background: { default: paper, paper },
      divider: ink,
      action: {
        active: ink,
        hover: paper,
        selected: paper,
        disabled: ink,
        disabledBackground: paper,
      },
    },
    typography: {
      fontFamily: FONT,
      h1: { fontFamily: FONT, fontWeight: 800 },
      h2: { fontFamily: FONT, fontWeight: 800 },
      h3: { fontFamily: FONT, fontWeight: 700 },
      h4: { fontFamily: FONT, fontWeight: 700 },
      h5: { fontFamily: FONT, fontWeight: 700 },
      h6: { fontFamily: FONT, fontWeight: 600 },
      subtitle1: { fontFamily: FONT, fontWeight: 600 },
      subtitle2: { fontFamily: FONT, fontWeight: 600 },
      body1: { fontFamily: FONT },
      body2: { fontFamily: FONT },
      caption: { fontFamily: FONT },
      button: { fontFamily: FONT },
      overline: { fontFamily: FONT },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');
          :root {
            --bt-ink: ${INK.light};
            --bt-paper: ${PAPER.light};
            --bt-border: transparent;
            --bt-dot-border: transparent;
            --bt-font-family: "Playfair Display", "Georgia", "Times New Roman", serif;
            --bt-infostrip-row-gap: 0px;
            --bt-li-py: 0px;
            --bt-li-min-height: 36px;
          }
          @media (prefers-color-scheme: dark) {
            :root { --bt-ink: ${INK.dark}; --bt-paper: ${PAPER.dark}; }
          }
          html[data-theme="light"] { --bt-ink: ${INK.light}; --bt-paper: ${PAPER.light}; }
          html[data-theme="dark"]  { --bt-ink: ${INK.dark};  --bt-paper: ${PAPER.dark};  }
          html[data-contrast="subtle"]    { --bt-border: color-mix(in srgb, var(--bt-ink) 15%, transparent); }
          html[data-contrast="medium"]    { --bt-border: color-mix(in srgb, var(--bt-ink) 40%, transparent); }
          html[data-contrast="high"]      { --bt-border: var(--bt-ink); }
          html[data-dot-contrast="subtle"] { --bt-dot-border: color-mix(in srgb, var(--bt-ink) 15%, transparent); }
          html[data-dot-contrast="medium"] { --bt-dot-border: color-mix(in srgb, var(--bt-ink) 40%, transparent); }
          html[data-dot-contrast="high"]   { --bt-dot-border: var(--bt-ink); }
          html[data-font="serif"] { --bt-font-family: "Playfair Display", "Georgia", "Times New Roman", serif; }
          html[data-font="sans"]  { --bt-font-family: "Source Sans 3", "Helvetica Neue", Arial, sans-serif; }
          html[data-font="slab"]  { --bt-font-family: "Bitter", Georgia, serif; }
          html[data-font="mono"]  { --bt-font-family: "JetBrains Mono", "Courier New", monospace; }
          html[data-row-gap="0"] { --bt-infostrip-row-gap: 0px;  --bt-li-py: 0px;  --bt-li-min-height: 36px; }
          html[data-row-gap="1"] { --bt-infostrip-row-gap: 4px;  --bt-li-py: 2px;  --bt-li-min-height: 40px; }
          html[data-row-gap="2"] { --bt-infostrip-row-gap: 8px;  --bt-li-py: 4px;  --bt-li-min-height: 48px; }
          html[data-row-gap="3"] { --bt-infostrip-row-gap: 14px; --bt-li-py: 7px;  --bt-li-min-height: 56px; }
          html[data-row-gap="4"] { --bt-infostrip-row-gap: 22px; --bt-li-py: 11px; --bt-li-min-height: 68px; }
        `,
      },
      MuiDivider: { styleOverrides: { root: { borderColor: 'var(--bt-border)' } } },
      MuiTab:     { styleOverrides: { root: { color: ink, '&.Mui-selected': { color: ink } } } },
      MuiTabs:    { styleOverrides: { indicator: { backgroundColor: ink } } },
    },
  });
}

// ── Color swatch (circle <input type="color">) ────────────────────────────────

function ColorSwatch({ value, onChange, title }) {
  return (
    <Box
      component="input"
      type="color"
      title={title}
      value={value}
      onChange={onChange}
      sx={{
        WebkitAppearance: 'none',
        appearance: 'none',
        width: 18,
        height: 18,
        border: '1.5px solid',
        borderColor: 'divider',
        borderRadius: '50%',
        p: 0,
        cursor: 'pointer',
        flexShrink: 0,
        '&::-webkit-color-swatch-wrapper': { p: 0, borderRadius: '50%' },
        '&::-webkit-color-swatch': { border: 'none', borderRadius: '50%' },
        '&::-moz-color-swatch': { border: 'none', borderRadius: '50%' },
      }}
    />
  );
}


// ── Site settings context (lets SolitairePage open the sliders popover) ──────

export const SiteSettingsContext = createContext(null);
export function useSiteSettings() { return useContext(SiteSettingsContext); }

const GAME_NAME_MAP = {
  klondike: 'Klondike',
  freecell: 'FreeCell',
  'lady-jane': 'Lady Jane',
  'forty-thieves': 'Forty Thieves',
};

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <SolitaireSettingsProvider>
      <AppShell />
    </SolitaireSettingsProvider>
  );
}

const BASE_TITLE = 'Braille Toolbox';
const SOL_TITLE  = 'Braille Solitaire';

// Custom typewriter: never remounts; on target change, backspaces to the common prefix then retypes.
function useTypewriter(target, typeMs = 55, deleteMs = 40, initialDelay = 150) {
  const [displayed, setDisplayed] = useState('');
  const displayedRef = useRef('');
  const targetRef = useRef(target);
  const timerRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    targetRef.current = target;
    clearTimeout(timerRef.current);
    function tick() {
      const cur = displayedRef.current;
      const tgt = targetRef.current;
      if (cur === tgt) return;
      if (cur.length > 0 && !tgt.startsWith(cur)) {
        displayedRef.current = cur.slice(0, -1);
        setDisplayed(displayedRef.current);
        timerRef.current = setTimeout(tick, deleteMs);
      } else if (cur.length < tgt.length) {
        displayedRef.current = tgt.slice(0, cur.length + 1);
        setDisplayed(displayedRef.current);
        timerRef.current = setTimeout(tick, typeMs);
      }
    }
    const delay = startedRef.current ? 0 : initialDelay;
    startedRef.current = true;
    timerRef.current = setTimeout(tick, delay);
    return () => clearTimeout(timerRef.current);
  }, [target, typeMs, deleteMs, initialDelay]);

  return displayed;
}

function AppShell() {
  const location = useLocation();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const [modeSetting, setModeSetting] = useState(() => {
    try { return localStorage.getItem('bt-theme') || 'auto'; } catch { return 'auto'; }
  });
  const [contrast, setContrast] = useState(() => {
    try { return localStorage.getItem('bt-contrast') || 'medium'; } catch { return 'medium'; }
  });
  const [dotContrast, setDotContrast] = useState(() => {
    try { return localStorage.getItem('bt-dot-contrast') || 'subtle'; } catch { return 'subtle'; }
  });
  const [rowGap, setRowGap] = useState(() => {
    try { return Number(localStorage.getItem('bt-row-gap')) || 0; } catch { return 0; }
  });
  const [typeSize, setTypeSize] = useState(() => {
    try { return Number(localStorage.getItem('bt-type-size') ?? 1); } catch { return 1; }
  });
  const [font, setFont] = useState(() => {
    try { return localStorage.getItem('bt-font') || 'serif'; } catch { return 'serif'; }
  });
  const [customInk, setCustomInk] = useState(() => {
    try { return localStorage.getItem('bt-custom-ink') || null; } catch { return null; }
  });
  const [customPaper, setCustomPaper] = useState(() => {
    try { return localStorage.getItem('bt-custom-paper') || null; } catch { return null; }
  });
  const [popoverAnchor, setPopoverAnchor] = useState(null);

  const hasCustom = Boolean(customInk || customPaper);

  // MUI mode (light|dark). Custom mode derives from paper luminance so MUI gets the right base.
  const resolvedMode = useMemo(() => {
    if (modeSetting === 'auto') return prefersDark ? 'dark' : 'light';
    if (modeSetting === 'custom') {
      const paper = customPaper || PAPER.light;
      return hexLuminance(paper) > 0.5 ? 'light' : 'dark';
    }
    return modeSetting;
  }, [modeSetting, prefersDark, customPaper]);

  // Effective colors sent to MUI + CSS vars.
  const effectiveInk   = modeSetting === 'custom' ? (customInk   || INK[resolvedMode])   : INK[resolvedMode];
  const effectivePaper = modeSetting === 'custom' ? (customPaper || PAPER[resolvedMode]) : PAPER[resolvedMode];

  const theme = useMemo(
    () => buildTheme(resolvedMode, effectiveInk, effectivePaper),
    [resolvedMode, effectiveInk, effectivePaper],
  );

  useEffect(() => { document.documentElement.setAttribute('data-theme', resolvedMode); }, [resolvedMode]);
  useEffect(() => { document.documentElement.setAttribute('data-contrast', contrast); }, [contrast]);
  useEffect(() => { document.documentElement.setAttribute('data-dot-contrast', dotContrast); }, [dotContrast]);
  useEffect(() => { document.documentElement.setAttribute('data-row-gap', rowGap); }, [rowGap]);
  useEffect(() => { document.documentElement.setAttribute('data-type-size', typeSize); }, [typeSize]);
  useEffect(() => { document.documentElement.setAttribute('data-font', font); }, [font]);

  useEffect(() => {
    document.documentElement.style.setProperty('--bt-ink', effectiveInk);
    document.documentElement.style.setProperty('--bt-paper', effectivePaper);
  }, [effectiveInk, effectivePaper]);

  // ── Handlers ──

  const handleModeChange = (_, val) => {
    if (!val) return;
    setModeSetting(val);
    try { localStorage.setItem('bt-theme', val); } catch {}
  };

  const handleContrastChange = (_, val) => {
    if (!val) return;
    setContrast(val);
    try { localStorage.setItem('bt-contrast', val); } catch {}
  };

  const handleDotContrastChange = (_, val) => {
    if (!val) return;
    setDotContrast(val);
    try { localStorage.setItem('bt-dot-contrast', val); } catch {}
  };

  const handleRowGapChange    = (_, val) => { setRowGap(val);   try { localStorage.setItem('bt-row-gap', val); }   catch {} };
  const handleTypeSizeChange  = (_, val) => { setTypeSize(val); try { localStorage.setItem('bt-type-size', val); } catch {} };

  const handleFontChange = (_, val) => {
    if (!val) return;
    setFont(val);
    try { localStorage.setItem('bt-font', val); } catch {}
  };

  const handleCustomInkChange = (e) => {
    const val = e.target.value;
    setModeSetting('custom');
    setCustomInk(val);
    try { localStorage.setItem('bt-custom-ink', val); localStorage.setItem('bt-theme', 'custom'); } catch {}
  };

  const handleCustomPaperChange = (e) => {
    const val = e.target.value;
    setModeSetting('custom');
    setCustomPaper(val);
    try { localStorage.setItem('bt-custom-paper', val); localStorage.setItem('bt-theme', 'custom'); } catch {}
  };

  const handleClearCustomColors = () => {
    setCustomInk(null);
    setCustomPaper(null);
    if (modeSetting === 'custom') setModeSetting('auto');
    try {
      localStorage.removeItem('bt-custom-ink');
      localStorage.removeItem('bt-custom-paper');
      if (modeSetting === 'custom') localStorage.setItem('bt-theme', 'auto');
    } catch {}
  };

  const isSolitaire = location.pathname.startsWith('/games/solitaire');
  const solSettings = useSolitaireSettings();
  const solPadH = isSolitaire ? (solSettings?.padH ?? 0) : 0;
  const solPadV = isSolitaire ? (solSettings?.padV ?? 0) : 0;

  const [solPhase, setSolPhaseState] = useState(() => {
    try { return localStorage.getItem('bt-sol-phase') || 'select'; } catch { return 'select'; }
  });
  const [solGameId, setSolGameIdState] = useState(() => {
    try { return localStorage.getItem('bt-sol-gameid') || 'klondike'; } catch { return 'klondike'; }
  });

  const setSolPhase = (phase) => {
    setSolPhaseState(phase);
    try { localStorage.setItem('bt-sol-phase', phase); } catch {}
  };
  const setSolGameId = (id) => {
    setSolGameIdState(id);
    try { localStorage.setItem('bt-sol-gameid', id); } catch {}
  };

  // Reset to select screen whenever user leaves the solitaire route
  useEffect(() => {
    if (!isSolitaire) setSolPhase('select');
  }, [isSolitaire]); // eslint-disable-line react-hooks/exhaustive-deps

  const gameName = GAME_NAME_MAP[solGameId] ?? 'Solitaire';
  const titleTarget = !isSolitaire ? BASE_TITLE
    : solPhase === 'playing' ? `Braille ${gameName}`
    : 'Braille Games';
  const titleText = useTypewriter(titleTarget);

  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  // ── Render ──

  return (
    <SiteSettingsContext.Provider value={{
      openSiteSettings: (el) => setPopoverAnchor(el),
      solPhase, setSolPhase,
      solGameId, setSolGameId,
      isSolitaire,
    }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={isSolitaire && solPadH > 0 ? false : 'lg'} sx={{
        py: 2, minWidth: 0,
        px: isSolitaire && solPadH > 0 ? `${solPadH}px` : undefined,
        pt: isSolitaire && solPadV > 0 ? `${solPadV}px` : 2,
        pb: isSolitaire && solPadV > 0 ? `${solPadV}px` : 2,
        '@media (min-width: 2560px)': !isSolitaire || solPadH === 0 ? { maxWidth: 1600, px: 6 } : {},
        '@media (min-width: 3840px)': !isSolitaire || solPadH === 0 ? { maxWidth: 2200, px: 10 } : {},
      }}>
        <Box className="app-header-bar" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          {/* Left: title + optional All Games button */}
          <Box className="app-header-title" sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '16ch' }}>
            <Typography variant="h5" component="p">
              <MuiLink component={RouterLink} to="/" underline="none" color="inherit">
                {titleText}
              </MuiLink>
            </Typography>
            {isSolitaire && solPhase === 'playing' && (
              <Button size="small" sx={{ opacity: 0.6, flexShrink: 0 }} onClick={() => setSolPhase('select')}>
                All Games
              </Button>
            )}
          </Box>
          {/* Right: icons — fullscreen + game settings only on solitaire, site settings always */}
          <Box className="app-header-icons" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isSolitaire && (
              <IconButton size="small" onClick={toggleFullscreen} sx={{ color: 'text.primary' }} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
              </IconButton>
            )}
            {isSolitaire && <SolitaireSettingsButton />}
            <IconButton size="small" onClick={e => setPopoverAnchor(e.currentTarget)} sx={{ color: 'text.primary' }} title="Site settings">
              <FontAwesomeIcon icon={faSliders} />
            </IconButton>
          </Box>
          <Popover
            open={Boolean(popoverAnchor)}
            anchorEl={popoverAnchor}
            onClose={() => setPopoverAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 260 }}>

              {/* Theme label + swatches */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption">Theme</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {hasCustom && (
                    <IconButton
                      size="small"
                      onClick={handleClearCustomColors}
                      title="Clear custom colors"
                      sx={{ p: 0.25, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                    >
                      <FontAwesomeIcon icon={faXmark} style={{ fontSize: '0.65rem' }} />
                    </IconButton>
                  )}
                  <ColorSwatch value={customInk   || INK[resolvedMode]}   onChange={handleCustomInkChange}   title="Ink color" />
                  <ColorSwatch value={customPaper || PAPER[resolvedMode]} onChange={handleCustomPaperChange} title="Paper color" />
                </Box>
              </Box>

              {/* Mode segmented control */}
              <ToggleButtonGroup exclusive size="small" value={modeSetting} onChange={handleModeChange}>
                <ToggleButton value="auto"><FontAwesomeIcon icon={faCircleHalfStroke} />&nbsp;Auto</ToggleButton>
                <ToggleButton value="light"><FontAwesomeIcon icon={faSun} /></ToggleButton>
                <ToggleButton value="dark"><FontAwesomeIcon icon={faMoon} /></ToggleButton>
                <ToggleButton value="custom">Custom</ToggleButton>
              </ToggleButtonGroup>

              <Typography variant="caption">Interface contrast</Typography>
              <ToggleButtonGroup exclusive size="small" value={contrast} onChange={handleContrastChange}>
                <ToggleButton value="low">Off</ToggleButton>
                <ToggleButton value="subtle">Low</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="high">High</ToggleButton>
              </ToggleButtonGroup>

              <Typography variant="caption">Braille dot contrast</Typography>
              <ToggleButtonGroup exclusive size="small" value={dotContrast} onChange={handleDotContrastChange}>
                <ToggleButton value="low">Off</ToggleButton>
                <ToggleButton value="subtle">Low</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="high">High</ToggleButton>
              </ToggleButtonGroup>

              <Typography variant="caption">Row spacing</Typography>
              <Box sx={{ px: 1 }}>
                <Slider size="small" min={0} max={4} step={1} marks value={rowGap} onChange={handleRowGapChange} aria-label="Row spacing" />
              </Box>

              <Typography variant="caption">Type size</Typography>
              <Box sx={{ px: 1 }}>
                <Slider size="small" min={0} max={5} step={1} marks value={typeSize} onChange={handleTypeSizeChange} aria-label="Type size" />
              </Box>

              <Typography variant="caption">Font</Typography>
              <ToggleButtonGroup exclusive size="small" value={font} onChange={handleFontChange}>
                <ToggleButton value="serif">Serif</ToggleButton>
                <ToggleButton value="sans">Sans</ToggleButton>
                <ToggleButton value="slab">Slab</ToggleButton>
                <ToggleButton value="mono">Mono</ToggleButton>
              </ToggleButtonGroup>

            </Box>
          </Popover>
        </Box>

        <Routes>
          <Route path="/" element={<QuickRefPage />} />
          <Route path="/quickref" element={<QuickRefPage />} />
          <Route path="/intro" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/decode" element={<Navigate to="/archive?tab=decode" replace />} />
          <Route path="/write" element={<Navigate to="/archive?tab=write" replace />} />
          <Route path="/braillewrite-help" element={<Navigate to="/archive?tab=braillewriter" replace />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/solitaire" element={<SolitairePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Box
          component="footer"
          className="app-footer-bar"
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            mt: 4, pt: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2026 Will Capellaro & Braille Toolbox
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <MuiLink component={RouterLink} to="/about" underline="hover">About</MuiLink>
            <MuiLink component={RouterLink} to="/archive" underline="hover">Archive</MuiLink>
            <MuiLink href="https://willcapellaro1.typeform.com/to/oPcfuyiL" underline="hover" target="_blank" rel="noreferrer">Feedback</MuiLink>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </SiteSettingsContext.Provider>
  );
}
