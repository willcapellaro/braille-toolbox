import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/common/Header-simple';
import MobileMenu from './components/common/MobileMenu-simple';
import QuickReference from './components/pages/QuickReference-simple';
import SearchModule from './components/search/SearchModule-simple';

// Temporary simple components for other pages
const Intro: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Introduction to Braille</h2>
    <p>Learn the fundamentals of braille writing system.</p>
  </div>
);
const WriteInBraille: React.FC = () => <div>Write in Braille Page</div>;
const DotDecoder: React.FC = () => <div>Dot Decoder Page</div>;
const BraillewriterHelp: React.FC = () => <div>Braillewriter Help Page</div>;
const SlateStylus: React.FC = () => <div>Slate Stylus Page</div>;

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
      light: '#9333ea',
      dark: '#3700b3',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Merriweather", "Georgia", serif',
    h1: {
      fontFamily: '"Francois One", "Impact", sans-serif',
      fontWeight: 400,
      fontSize: '2.5rem',
      color: '#1e293b',
    },
    h2: {
      fontFamily: '"Francois One", "Impact", sans-serif',
      fontWeight: 400,
      fontSize: '2rem',
      color: '#334155',
    },
    h3: {
      fontFamily: '"Francois One", "Impact", sans-serif',
      fontWeight: 400,
      fontSize: '1.5rem',
      color: '#475569',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#64748b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          <Header onMenuClick={handleMenuToggle} />
          <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <main>
            <SearchModule />
            <Routes>
              <Route path="/" element={<QuickReference />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/write-in-braille" element={<WriteInBraille />} />
              <Route path="/dot-decoder" element={<DotDecoder />} />
              <Route path="/braillewriter-help" element={<BraillewriterHelp />} />
              <Route path="/slate-stylus" element={<SlateStylus />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;