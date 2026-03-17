import { Box, Container, CssBaseline, Tab, Tabs, ThemeProvider, Typography, createTheme } from '@mui/material';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import QuickRefPage from './pages/QuickRefPage';

const theme = createTheme();

function NavTabs() {
  const location = useLocation();
  const value = location.pathname.startsWith('/intro') ? '/intro' : '/quickref';

  return (
    <Tabs value={value} aria-label="Phase 1 pages">
      <Tab label="Quick Reference" value="/quickref" to="/quickref" component={Link} />
      <Tab label="Full Explainer" value="/intro" to="/intro" component={Link} />
    </Tabs>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" component="p" sx={{ mb: 1 }}>
          Braille Toolbox Phase 1
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <NavTabs />
        </Box>
        <Routes>
          <Route path="/quickref" element={<QuickRefPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="*" element={<Navigate to="/quickref" replace />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}
