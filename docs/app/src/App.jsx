import {
  Box,
  Container,
  CssBaseline,
  IconButton,
  Link as MuiLink,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, Navigate, Route, Routes } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCircleHalfStroke, faPalette } from '@fortawesome/free-solid-svg-icons';
import AboutPage from './pages/AboutPage';
import ArchivePage from './pages/ArchivePage';
import BraillewriterHelpPage from './pages/BraillewriterHelpPage';
import DotDecoderPage from './pages/DotDecoderPage';
import QuickRefPage from './pages/QuickRefPage';
import WritePage from './pages/WritePage';
import AdminPage from './pages/AdminPage';

const HEADING_FONT = '"Playfair Display", "Georgia", "Times New Roman", serif';

// ── Strict 2-color design system ────────────────────────────────────────────
// Everything derives from ink (foreground) and paper (background).
const INK  = { light: '#1a1a1a', dark: '#e4e4e4' };
const PAPER = { light: '#fafafa', dark: '#121212' };

// Parse hex to relative luminance (0 = black, 1 = white)
function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function buildTheme(mode, customInk, customPaper) {
  const ink   = customInk  || INK[mode];
  const paper = customPaper || PAPER[mode];
  return createTheme({
    palette: {
      mode,
      primary:    { main: ink },
      secondary:  { main: ink },
      text:       { primary: ink, secondary: mode === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', disabled: mode === 'light' ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.38)' },
      background: { default: paper, paper },
      divider: ink,
      action: {
        active: ink,
        hover: mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
        selected: mode === 'light' ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.14)',
        disabled: mode === 'light' ? 'rgba(0,0,0,0.26)' : 'rgba(255,255,255,0.3)',
        disabledBackground: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
      },
    },
    typography: {
      fontFamily: HEADING_FONT,
      h1: { fontFamily: HEADING_FONT, fontWeight: 800 },
      h2: { fontFamily: HEADING_FONT, fontWeight: 800 },
      h3: { fontFamily: HEADING_FONT, fontWeight: 700 },
      h4: { fontFamily: HEADING_FONT, fontWeight: 700 },
      h5: { fontFamily: HEADING_FONT, fontWeight: 700 },
      h6: { fontFamily: HEADING_FONT, fontWeight: 600 },
      subtitle1: { fontFamily: HEADING_FONT, fontWeight: 600 },
      subtitle2: { fontFamily: HEADING_FONT, fontWeight: 600 },
      body1: { fontFamily: HEADING_FONT },
      body2: { fontFamily: HEADING_FONT },
      caption: { fontFamily: HEADING_FONT },
      button: { fontFamily: HEADING_FONT },
      overline: { fontFamily: HEADING_FONT },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');
          :root {
            --bt-ink: ${INK.light};
            --bt-paper: ${PAPER.light};
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bt-ink: ${INK.dark};
              --bt-paper: ${PAPER.dark};
            }
          }
          html[data-theme="light"] {
            --bt-ink: ${INK.light};
            --bt-paper: ${PAPER.light};
          }
          html[data-theme="dark"] {
            --bt-ink: ${INK.dark};
            --bt-paper: ${PAPER.dark};
          }
        `,
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: mode === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)' } },
      },
      MuiTab: {
        styleOverrides: { root: { color: ink, '&.Mui-selected': { color: ink } } },
      },
      MuiTabs: {
        styleOverrides: { indicator: { backgroundColor: ink } },
      },
    },
  });
}

const MODE_CYCLE = ['auto', 'light', 'dark', 'custom'];
const MODE_ICONS = { light: faSun, dark: faMoon, auto: faCircleHalfStroke, custom: faPalette };
const MODE_LABELS = { light: 'Light mode', dark: 'Dark mode', auto: 'Auto (system)', custom: 'Custom colors' };



export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [modeSetting, setModeSetting] = useState(() => {
    try { return localStorage.getItem('bt-theme') || 'auto'; } catch { return 'auto'; }
  });
  const [customInk, setCustomInk] = useState(() => {
    try { return localStorage.getItem('bt-custom-ink') || '#1a1a1a'; } catch { return '#1a1a1a'; }
  });
  const [customPaper, setCustomPaper] = useState(() => {
    try { return localStorage.getItem('bt-custom-paper') || '#fafafa'; } catch { return '#fafafa'; }
  });

  const isCustom = modeSetting === 'custom';
  const resolvedMode = isCustom
    ? (luminance(customPaper) > 0.5 ? 'light' : 'dark')
    : modeSetting === 'auto'
      ? (prefersDark ? 'dark' : 'light')
      : modeSetting;
  const theme = useMemo(
    () => buildTheme(resolvedMode, isCustom ? customInk : null, isCustom ? customPaper : null),
    [resolvedMode, isCustom, customInk, customPaper],
  );

  // Sync data-theme attribute so CSS vars stay in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedMode);
  }, [resolvedMode]);

  const cycleMode = () => {
    const next = MODE_CYCLE[(MODE_CYCLE.indexOf(modeSetting) + 1) % MODE_CYCLE.length];
    setModeSetting(next);
    try { localStorage.setItem('bt-theme', next); } catch {}
  };

  const updateCustomInk = (hex) => {
    setCustomInk(hex);
    try { localStorage.setItem('bt-custom-ink', hex); } catch {}
  };
  const updateCustomPaper = (hex) => {
    setCustomPaper(hex);
    try { localStorage.setItem('bt-custom-paper', hex); } catch {}
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="lg"
        sx={{
          py: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <MuiLink
            component={RouterLink}
            to="/quickref"
            underline="none"
            color="text.primary"
            sx={{ '&:hover': { opacity: 0.7 } }}
          >
            <Typography variant="h5" component="p">
              Braille Toolbox
            </Typography>
          </MuiLink>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCustom && (
              <>
                <Tooltip title="Foreground (ink)" arrow>
                  <Box
                    component="input"
                    type="color"
                    value={customInk}
                    onChange={(e) => updateCustomInk(e.target.value)}
                    sx={{
                      width: 28,
                      height: 28,
                      p: 0,
                      border: '2px solid',
                      borderColor: 'divider',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      appearance: 'none',
                      bgcolor: 'transparent',
                      '&::-webkit-color-swatch-wrapper': { p: 0 },
                      '&::-webkit-color-swatch': { border: 'none', borderRadius: '50%' },
                      '&::-moz-color-swatch': { border: 'none', borderRadius: '50%' },
                    }}
                  />
                </Tooltip>
                <Tooltip title="Background (paper)" arrow>
                  <Box
                    component="input"
                    type="color"
                    value={customPaper}
                    onChange={(e) => updateCustomPaper(e.target.value)}
                    sx={{
                      width: 28,
                      height: 28,
                      p: 0,
                      border: '2px solid',
                      borderColor: 'divider',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      appearance: 'none',
                      bgcolor: 'transparent',
                      '&::-webkit-color-swatch-wrapper': { p: 0 },
                      '&::-webkit-color-swatch': { border: 'none', borderRadius: '50%' },
                      '&::-moz-color-swatch': { border: 'none', borderRadius: '50%' },
                    }}
                  />
                </Tooltip>
              </>
            )}
            <Tooltip title={MODE_LABELS[modeSetting]} arrow>
              <IconButton onClick={cycleMode} size="small" sx={{ color: 'text.secondary' }}>
                <FontAwesomeIcon icon={MODE_ICONS[modeSetting]} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/quickref" element={<QuickRefPage />} />
            <Route path="/intro" element={<Navigate to="/quickref" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/decode" element={<Navigate to="/archive?tab=decode" replace />} />
            <Route path="/write" element={<Navigate to="/archive?tab=write" replace />} />
            <Route path="/braillewrite-help" element={<Navigate to="/archive?tab=braillewriter" replace />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/quickref" replace />} />
          </Routes>
        </Box>
        <Box
          component="footer"
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            mt: 4,
            pt: 2,
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
            <MuiLink component={RouterLink} to="/about" underline="hover">
              About
            </MuiLink>
            <MuiLink component={RouterLink} to="/archive" underline="hover">
              Archive
            </MuiLink>
            <MuiLink
              href="https://willcapellaro1.typeform.com/to/oPcfuyiL"
              underline="hover"
              target="_blank"
              rel="noreferrer"
            >
              Feedback
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
