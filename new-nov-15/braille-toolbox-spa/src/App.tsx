import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header-simple';
import MobileMenu from './components/common/MobileMenu-simple';
import QuickReference from './components/pages/QuickReference-clean';
import SearchModule from './components/search/SearchModule-simple';
import { SettingsProvider } from './contexts/SettingsContext';
import { BrailleDemo } from './components/BrailleDemo';

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

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <SettingsProvider>
      <Router>
        <div style={{ minHeight: '100vh' }}>
          <Header onMenuClick={handleMenuToggle} />
          <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <main>
            <SearchModule />
            <Routes>
              <Route path="/" element={<QuickReference />} />
              <Route path="/demo" element={<BrailleDemo />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/write-in-braille" element={<WriteInBraille />} />
              <Route path="/dot-decoder" element={<DotDecoder />} />
              <Route path="/braillewriter-help" element={<BraillewriterHelp />} />
              <Route path="/slate-stylus" element={<SlateStylus />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SettingsProvider>
  );
};

export default App;