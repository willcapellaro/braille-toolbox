import {
  Box,
  Container,
  CssBaseline,
  IconButton,
  Link as MuiLink,
  Popover,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, Navigate, Route, Routes } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCircleHalfStroke, faSliders } from '@fortawesome/free-solid-svg-icons';
import AboutPage from './pages/AboutPage';
import ArchivePage from './pages/ArchivePage';
import BraillewriterHelpPage from './pages/BraillewriterHelpPage';
import DotDecoderPage from './pages/DotDecoderPage';
import QuickRefPage from './pages/QuickRefPage';
import WritePage from './pages/WritePage';
import AdminPage from './pages/AdminPage';
import { INK, PAPER } from './theme/colors';

const HEADING_FONT = '"Playfair Display", "Georgia", "Times New Roman", serif';

function buildTheme(mode) {
  const ink   = INK[mode];
  const paper = PAPER[mode];
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
            --bt-border: transparent;
            --bt-dot-border: transparent;
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
          html[data-contrast="subtle"]    { --bt-border: color-mix(in srgb, var(--bt-ink) 15%, transparent); }
          html[data-contrast="medium"]    { --bt-border: color-mix(in srgb, var(--bt-ink) 40%, transparent); }
          html[data-contrast="high"]      { --bt-border: var(--bt-ink); }
          html[data-dot-contrast="subtle"] { --bt-dot-border: color-mix(in srgb, var(--bt-ink) 15%, transparent); }
          html[data-dot-contrast="medium"] { --bt-dot-border: color-mix(in srgb, var(--bt-ink) 40%, transparent); }
          html[data-dot-contrast="high"]   { --bt-dot-border: var(--bt-ink); }
        `,
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: 'var(--bt-border)' } },
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




export default function App() {
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
  const [popoverAnchor, setPopoverAnchor] = useState(null);

  const resolvedMode = modeSetting === 'auto' ? (prefersDark ? 'dark' : 'light') : modeSetting;
  const theme = useMemo(() => buildTheme(resolvedMode), [resolvedMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedMode);
  }, [resolvedMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
  }, [contrast]);

  useEffect(() => {
    document.documentElement.setAttribute('data-dot-contrast', dotContrast);
  }, [dotContrast]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h5" component="p">
            <MuiLink component={RouterLink} to="/" underline="none" color="inherit">
              Braille Toolbox
            </MuiLink>
          </Typography>
          <IconButton size="small" onClick={e => setPopoverAnchor(e.currentTarget)} sx={{ color: 'text.primary' }}>
            <FontAwesomeIcon icon={faSliders} />
          </IconButton>
          <Popover
            open={Boolean(popoverAnchor)}
            anchorEl={popoverAnchor}
            onClose={() => setPopoverAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 260 }}>
              <Typography variant="caption">Theme</Typography>
              <ToggleButtonGroup exclusive size="small" value={modeSetting} onChange={handleModeChange}>
                <ToggleButton value="auto"><FontAwesomeIcon icon={faCircleHalfStroke} />&nbsp;Auto</ToggleButton>
                <ToggleButton value="light"><FontAwesomeIcon icon={faSun} />&nbsp;Light</ToggleButton>
                <ToggleButton value="dark"><FontAwesomeIcon icon={faMoon} />&nbsp;Dark</ToggleButton>
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
            </Box>
          </Popover>
        </Box>

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
