import { createContext, useContext, useEffect, useState } from 'react';

const SolitaireSettingsContext = createContext(null);

// Each entry: { storage: localStorage suffix, default: value }
const SETTING_META = {
  cardOutline:  { storage: 'outline',    default: 'always' },
  cellBounds:   { storage: 'bounds',     default: 'never'  },
  brailleDots:  { storage: 'dots',       default: 'always' },
  printOverlay: { storage: 'print',      default: 'never'  },
  printStyle:   { storage: 'printstyle', default: 'exact'  },
  unraisedDots: { storage: 'unraised',   default: 'never'  },
  suitColor:    { storage: 'suit',       default: 'off'    },
  dropHints:    { storage: 'drophints',  default: 'on'     },
  noSelect:     { storage: 'noselect',   default: 'on'     },
  noScroll:     { storage: 'noscroll',   default: 'off'    },
  cardBg:           { storage: 'cardbg',       default: 'white'  },
  cardScale:        { storage: 'cardscale',   default: 1.0      },
  legendScale:      { storage: 'legendscale', default: 1.0      },
  padV:             { storage: 'padv',        default: 0        },
  padH:             { storage: 'padh',        default: 0        },
  showLegend:       { storage: 'showlegend',  default: 'on'     },
  legendPosition:   { storage: 'legendpos',   default: 'above'  },
  legendHighlight:  { storage: 'legendhi',    default: 'off'    },
  legendHover:      { storage: 'legendhover', default: 'off'    },
};

function lsGet(key, def) {
  try { const v = localStorage.getItem(key); return v !== null ? v : String(def); } catch { return String(def); }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, String(val)); } catch {}
}
function lsRemove(key) {
  try { localStorage.removeItem(key); } catch {}
}

function profileStorageKey(profile, name) {
  return `bt-sol-${profile}-${SETTING_META[name].storage}`;
}

function loadProfile(profile) {
  const out = {};
  for (const [name, meta] of Object.entries(SETTING_META)) {
    const raw = lsGet(profileStorageKey(profile, name), meta.default);
    const isNum = ['cardScale', 'legendScale', 'padV', 'padH'].includes(name);
    out[name] = isNum ? (parseFloat(raw) ?? meta.default) : raw;
  }
  return out;
}

function clearProfile(profile) {
  for (const name of Object.keys(SETTING_META)) {
    lsRemove(profileStorageKey(profile, name));
  }
}

function detectProfile() {
  return typeof window !== 'undefined' && window.innerWidth < 600 ? 'phone' : 'large';
}

// Capitalize first letter to build setter names: cardOutline → setCardOutline
function setterName(name) {
  return 'set' + name.charAt(0).toUpperCase() + name.slice(1);
}

export function SolitaireSettingsProvider({ children }) {
  const [profileMode, setProfileModeState] = useState(() => lsGet('bt-sol-profilemode', 'auto'));
  const [detectedProfile, setDetectedProfile] = useState(() => detectProfile());

  const activeProfile = profileMode === 'auto' ? detectedProfile : profileMode;

  const [settings, setSettings] = useState(() => loadProfile(activeProfile));

  // Re-detect on resize
  useEffect(() => {
    const check = () => setDetectedProfile(detectProfile());
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reload settings when active profile changes
  useEffect(() => {
    setSettings(loadProfile(activeProfile));
  }, [activeProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const setProfileMode = (mode) => {
    setProfileModeState(mode);
    lsSet('bt-sol-profilemode', mode);
  };

  // Returns an onChange handler (_, value) compatible with MUI ToggleButtonGroup and Slider
  const makeSetter = (name) => (_, v) => {
    if (v == null) return;
    const isNum = ['cardScale', 'legendScale', 'padV', 'padH'].includes(name);
    const val = isNum ? (parseFloat(v) ?? SETTING_META[name].default) : v;
    setSettings(prev => ({ ...prev, [name]: val }));
    lsSet(profileStorageKey(activeProfile, name), val);
  };

  const clearSettings = () => {
    clearProfile(activeProfile);
    setSettings(loadProfile(activeProfile));
  };

  const ctx = {
    ...settings,
    profileMode,
    setProfileMode,
    activeProfile,
    clearSettings,
  };
  for (const name of Object.keys(SETTING_META)) {
    ctx[setterName(name)] = makeSetter(name);
  }

  return (
    <SolitaireSettingsContext.Provider value={ctx}>
      {children}
    </SolitaireSettingsContext.Provider>
  );
}

export function useSolitaireSettings() {
  return useContext(SolitaireSettingsContext);
}
