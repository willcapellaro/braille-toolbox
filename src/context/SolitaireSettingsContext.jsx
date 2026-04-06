import { createContext, useContext, useState } from 'react';

const SolitaireSettingsContext = createContext(null);

const DEFAULTS = {
  cardOutline:  'always',
  cellBounds:   'never',
  brailleDots:  'always',
  printOverlay: 'never',
  printStyle:   'exact',
  unraisedDots: 'never',
  suitColor:    'off',
  dropHints:    'on',
  noSelect:     'on',
  noScroll:     'off',
  cardBg:       'white',
  feltColor:    'off',
};

function load(key, def) {
  try { return localStorage.getItem(key) ?? def; } catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}

export function SolitaireSettingsProvider({ children }) {
  const [cardOutline,  setCardOutline]  = useState(() => load('bt-sol-outline',  DEFAULTS.cardOutline));
  const [cellBounds,   setCellBounds]   = useState(() => load('bt-sol-bounds',   DEFAULTS.cellBounds));
  const [brailleDots,  setBrailleDots]  = useState(() => load('bt-sol-dots',     DEFAULTS.brailleDots));
  const [printOverlay, setPrintOverlay] = useState(() => load('bt-sol-print',      DEFAULTS.printOverlay));
  const [printStyle,   setPrintStyle]   = useState(() => load('bt-sol-printstyle', DEFAULTS.printStyle));
  const [unraisedDots, setUnraisedDots] = useState(() => load('bt-sol-unraised',   DEFAULTS.unraisedDots));
  const [suitColor,    setSuitColor]    = useState(() => load('bt-sol-suit',       DEFAULTS.suitColor));
  const [dropHints,    setDropHints]    = useState(() => load('bt-sol-drophints',  DEFAULTS.dropHints));
  const [noSelect,     setNoSelect]     = useState(() => load('bt-sol-noselect',   DEFAULTS.noSelect));
  const [noScroll,     setNoScroll]     = useState(() => load('bt-sol-noscroll',   DEFAULTS.noScroll));
  const [cardBg,       setCardBg]       = useState(() => load('bt-sol-cardbg',     DEFAULTS.cardBg));
  const [feltColor,    setFeltColor]    = useState(() => load('bt-sol-felt',       DEFAULTS.feltColor));

  const set = (setter, key) => (_, v) => {
    if (v == null) return;
    setter(v); save(key, v);
  };

  return (
    <SolitaireSettingsContext.Provider value={{
      cardOutline,  setCardOutline:  set(setCardOutline,  'bt-sol-outline'),
      cellBounds,   setCellBounds:   set(setCellBounds,   'bt-sol-bounds'),
      brailleDots,  setBrailleDots:  set(setBrailleDots,  'bt-sol-dots'),
      printOverlay, setPrintOverlay: set(setPrintOverlay, 'bt-sol-print'),
      printStyle,   setPrintStyle:   set(setPrintStyle,   'bt-sol-printstyle'),
      unraisedDots, setUnraisedDots: set(setUnraisedDots, 'bt-sol-unraised'),
      suitColor,    setSuitColor:    set(setSuitColor,    'bt-sol-suit'),
      dropHints,    setDropHints:    set(setDropHints,    'bt-sol-drophints'),
      noSelect,     setNoSelect:     set(setNoSelect,     'bt-sol-noselect'),
      noScroll,     setNoScroll:     set(setNoScroll,     'bt-sol-noscroll'),
      cardBg,       setCardBg:       set(setCardBg,       'bt-sol-cardbg'),
      feltColor,    setFeltColor:    set(setFeltColor,    'bt-sol-felt'),
    }}>
      {children}
    </SolitaireSettingsContext.Provider>
  );
}

export function useSolitaireSettings() {
  return useContext(SolitaireSettingsContext);
}
