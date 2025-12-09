import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Settings interface
export interface AppSettings {
  // Theme settings
  colorMode: 'light' | 'dark' | 'system';
  highContrast: boolean;
  primaryHue: number; // 0-359 degrees
  
  // Braille cell display options
  outlineBox: 'off' | 'solid-light' | 'solid-dark' | 'outline-light' | 'outline-dark';
  ghostDots: 'off' | 'dot-light' | 'dot-dark' | 'outline-light' | 'outline-dark';
  dotShadow: boolean;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  colorMode: 'system',
  highContrast: false,
  primaryHue: 270, // Purple
  outlineBox: 'off',
  ghostDots: 'off',
  dotShadow: true
};

// Settings context
const SettingsContext = createContext<{
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}>(
  undefined!
);

// Convert HSL to hex color
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Generate theme colors from hue
const generateThemeColors = (hue: number, isDark: boolean, highContrast: boolean) => {
  const saturation = highContrast ? 100 : 80;
  const mainLightness = isDark ? (highContrast ? 70 : 60) : (highContrast ? 40 : 50);
  const lightLightness = isDark ? (highContrast ? 85 : 75) : (highContrast ? 60 : 70);
  const darkLightness = isDark ? (highContrast ? 50 : 40) : (highContrast ? 20 : 30);
  
  return {
    main: hslToHex(hue, saturation, mainLightness),
    light: hslToHex(hue, saturation, lightLightness),
    dark: hslToHex(hue, saturation, darkLightness),
  };
};

// Settings provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('braille-toolbox-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  // Detect system color mode
  const [systemIsDark, setSystemIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('braille-toolbox-settings', JSON.stringify(settings));
  }, [settings]);

  // Determine actual dark mode
  const isDark = settings.colorMode === 'dark' || 
    (settings.colorMode === 'system' && systemIsDark);

  // Create Material-UI theme
  const theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: generateThemeColors(settings.primaryHue, isDark, settings.highContrast),
      background: {
        default: isDark ? 
          (settings.highContrast ? '#000000' : '#121212') :
          (settings.highContrast ? '#ffffff' : '#f8fafc'),
        paper: isDark ?
          (settings.highContrast ? '#111111' : '#1e1e1e') :
          (settings.highContrast ? '#ffffff' : '#ffffff'),
      },
      text: {
        primary: isDark ?
          (settings.highContrast ? '#ffffff' : '#ffffff') :
          (settings.highContrast ? '#000000' : '#1e293b'),
        secondary: isDark ?
          (settings.highContrast ? '#cccccc' : '#b3b3b3') :
          (settings.highContrast ? '#333333' : '#64748b'),
      },
    },
    typography: {
      fontFamily: settings.highContrast ? 
        '"Inter Variable", "Inter", "Roboto", "Helvetica", "Arial", sans-serif' :
        '"Merriweather", "Georgia", serif',
      fontWeightRegular: settings.highContrast ? 500 : 400,
      fontWeightMedium: settings.highContrast ? 600 : 500,
      fontWeightBold: settings.highContrast ? 700 : 600,
      h1: {
        fontFamily: settings.highContrast ?
          '"Inter Variable", "Inter", sans-serif' :
          '"Francois One", "Impact", sans-serif',
        fontWeight: settings.highContrast ? 700 : 400,
      },
      h2: {
        fontFamily: settings.highContrast ?
          '"Inter Variable", "Inter", sans-serif' :
          '"Francois One", "Impact", sans-serif',
        fontWeight: settings.highContrast ? 600 : 400,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderWidth: settings.highContrast ? '2px' : '1px',
            fontWeight: settings.highContrast ? 600 : 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: settings.highContrast ? `2px solid ${isDark ? '#333' : '#ddd'}` : 'none',
          },
        },
      },
    },
  });

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('braille-toolbox-settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

// Hook to use settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Predefined color options
export const COLOR_PRESETS = [
  { name: 'Purple', hue: 270 },
  { name: 'Blue', hue: 220 },
  { name: 'Green', hue: 120 },
  { name: 'Orange', hue: 30 },
  { name: 'Red', hue: 0 },
  { name: 'Teal', hue: 180 },
  { name: 'Pink', hue: 330 },
  { name: 'Indigo', hue: 240 },
];