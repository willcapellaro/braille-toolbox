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
import { faSun, faMoon, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
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

function buildTheme(mode) {
  const ink   = INK[mode];
  const paper = PAPER[mode];
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

const MODE_CYCLE = ['auto', 'light', 'dark'];
const MODE_ICONS = { light: faSun, dark: faMoon, auto: faCircleHalfStroke };
const MODE_LABELS = { light: 'Light mode', dark: 'Dark mode', auto: 'Auto (system)' };



export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [modeSetting, setModeSetting] = useState(() => {
    try { return localStorage.getItem('bt-theme') || 'auto'; } catch { return 'auto'; }
  });

  const resolvedMode = modeSetting === 'auto' ? (prefersDark ? 'dark' : 'light') : modeSetting;
  const theme = useMemo(() => buildTheme(resolvedMode), [resolvedMode]);

  // Sync data-theme attribute so CSS vars stay in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedMode);
  }, [resolvedMode]);

  const cycleMode = () => {
    const next = MODE_CYCLE[(MODE_CYCLE.indexOf(modeSetting) + 1) % MODE_CYCLE.length];
    setModeSetting(next);
    try { localStorage.setItem('bt-theme', next); } catch {}
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h5" component="p">
            Braille Toolbox
          </Typography>
          <Tooltip title={MODE_LABELS[modeSetting]} arrow>
            <IconButton onClick={cycleMode} size="small" sx={{ color: 'text.secondary' }}>
              <FontAwesomeIcon icon={MODE_ICONS[modeSetting]} />
            </IconButton>
          </Tooltip>
        </Box>

        <Routes>
          <Route path="/quickref" element={<QuickRefPage />} />
          <Route path="/intro" element={<Navigate to="/quickref" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/decode" element={<DotDecoderPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/braillewrite-help" element={<BraillewriterHelpPage />} />
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
