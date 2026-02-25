import {
  Box,
  Container,
  CssBaseline,
  Link as MuiLink,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import { Link as RouterLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import ArchivePage from './pages/ArchivePage';
import BraillewriterHelpPage from './pages/BraillewriterHelpPage';
import DotDecoderPage from './pages/DotDecoderPage';
import IntroPage from './pages/IntroPage';
import QuickRefPage from './pages/QuickRefPage';
import WritePage from './pages/WritePage';

const theme = createTheme();

function NavTabs() {
  const location = useLocation();
  let value = false;

  if (location.pathname.startsWith('/intro')) {
    value = '/intro';
  }

  if (location.pathname.startsWith('/quickref')) {
    value = '/quickref';
  }

  if (location.pathname.startsWith('/archive')) {
    value = '/archive';
  }

  return (
    <Tabs value={value} aria-label="Braille Toolbox tabs">
      <Tab label="Quick Reference" value="/quickref" to="/quickref" component={RouterLink} />
      <Tab label="Full Explainer" value="/intro" to="/intro" component={RouterLink} />
      <Tab label="Archive" value="/archive" to="/archive" component={RouterLink} />
    </Tabs>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" component="p" sx={{ mb: 1 }}>
          Braille Toolbox
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <NavTabs />
        </Box>
        <Routes>
          <Route path="/quickref" element={<QuickRefPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/decode" element={<DotDecoderPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/braillewrite-help" element={<BraillewriterHelpPage />} />
          <Route path="/archive" element={<ArchivePage />} />
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
