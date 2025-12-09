# Braille Toolbox SPA - AI Agent Instructions

## Project Overview

This is an **educational web application** for learning and referencing Unified English Braille (UEB). Built as a React SPA with TypeScript, it provides interactive tools for encoding/decoding braille, pattern visualization, and comprehensive UEB reference materials.

## Architecture & Key Concepts

### Multi-Version Development Structure
- **Active codebase**: `braille-toolbox-spa/` (primary work directory)
- **Working copies**: `working files nov 16/braille-toolbox-spa copy/` and `copy 2/` contain experimental versions
- When making changes, focus on `braille-toolbox-spa/` unless explicitly directed otherwise

### Braille Data Model

The app uses **dot pattern notation** as the canonical representation:
- **6-digit binary strings**: `"100000"` = dot 1, `"110000"` = dots 1+2, etc.
- Dots numbered 1-6 in standard 2×3 arrangement: `[1,4]` `[2,5]` `[3,6]`

**Key data files** (in `src/data/`):
- `dot-decoder-content.json`: Pattern → meanings (e.g., `"100000": {title: "The letter a", description: "..."}`)
- `braillePatterns.json`: Character → SVG filename mappings
- `contractions.json`: UEB contraction definitions
- `brailleData.ts`: Structured TypeScript data with `BrailleCharacter` interface

### Component Architecture

**Naming conventions:**
- `-simple` suffix = simplified/minimal version (e.g., `Header-simple.tsx`)
- `-clean` suffix = refined version with full features (e.g., `QuickReference-clean.tsx`)
- Base name = original/reference implementation

**Core components:**
- `BrailleCell.tsx`: Takes 6-digit dot pattern string, renders visual cell
- `BrailleCellToggle.tsx`: Interactive dot decoder with click-to-toggle dots
- `SearchModule-simple.tsx`: Central search with MUI Paper design
- `QuickReference-clean.tsx`: Main reference page with tabs for letters/numbers/punctuation

### State Management

**SettingsContext** (`src/contexts/SettingsContext.tsx`):
- Global settings with localStorage persistence
- Manages theme (light/dark/system), high contrast, primary hue (0-359)
- Braille cell display options: `outlineBox`, `ghostDots`, `dotShadow`
- Uses MUI's `createTheme` with HSL-to-hex color generation
- All components consuming settings must be wrapped in `<SettingsProvider>`

**URL-based state** (`useUrlParams` hook):
- Bookmarkable search and navigation state
- Updates URL with `window.history.replaceState` (no page reload)
- Key for "good URL query support" requirement

### Braille Conversion Logic

**Two conversion systems coexist:**
1. `src/utils/brailleConverter.ts`: Legacy conversion with HTML output (`BrCharHelper` generates spans)
2. `src/services/brailleService.ts`: Newer service-based approach using JSON lookups

When adding conversion features, prefer the service-based approach unless maintaining legacy code.

## Development Workflows

### Running the app
```bash
cd braille-toolbox-spa
npm run dev        # Starts Vite dev server on port 3000
npm run build      # Production build to dist/
npm run serve      # Preview production build
npm run type-check # TypeScript validation
```

### Asset Management

**SVG braille assets** in `public/braille/`:
- Naming pattern: `letter-a.svg`, `num1.svg`, `con_and.svg`, `comp_comma.svg`
- Categories: letters, numbers, contractions (`con_`), components/specials (`comp_`)
- Reference with `/braille/filename.svg` (served from public/)
- Master template: `braille-cell.svg` - DO NOT modify this file directly

**Custom braille font**: `public/fonts/OverpassMono-Braille.vfc` - defined in `src/styles/braille-fonts.css`

### TypeScript Patterns

**Path alias**: `@/` → `src/` (configured in `tsconfig.json` and `vite.config.ts`)
```typescript
import { BrailleCharacter } from '@/types/braille';
import brailleService from '@/services/brailleService';
```

**resolveJsonModule enabled**: Import JSON directly as typed modules
```typescript
import dotDecoderData from '@/data/dot-decoder-content.json';
```

## Styling & Design System

### Tech Stack
- **MUI (Material-UI)**: Component library with theme customization
- **Tailwind CSS**: Utility-first for custom layouts
- **Emotion**: CSS-in-JS for MUI theming

### Custom Tailwind Theme

**Colors** (in `tailwind.config.js`):
- Primary: Purple scale (50-900) - default educational/accessible palette
- Font families: `sans` (Merriweather), `display` (Francois One), `braille` (MyWebFont)

**When to use what:**
- MUI components for interactive UI (buttons, inputs, dialogs)
- Tailwind for layout, spacing, custom braille displays
- Never mix inline styles with Tailwind - prefer one approach per component

## Common Tasks & Patterns

### Adding a New Braille Character

1. Add to `src/data/brailleData.ts`:
```typescript
{
  id: 'new_char',
  character: '!',
  dots: '⠖',
  dotPattern: '001110',
  description: 'Exclamation mark',
  category: 'punctuation'
}
```

2. Add SVG asset to `public/braille/` (follow naming convention)

3. Update `dot-decoder-content.json` if needed for interactive decoder

### Creating a Settings-Aware Component

```typescript
import { useSettings } from '@/contexts/SettingsContext';

const MyComponent = () => {
  const { settings } = useSettings();
  
  return (
    <BrailleCell
      dots="110000"
      outlineBox={settings.outlineBox}
      ghostDots={settings.ghostDots}
    />
  );
};
```

### Adding URL Parameters for Bookmarking

```typescript
import useUrlParams from '@/hooks/useUrlParams';

const { updateUrlParams, getParam } = useUrlParams();

// Set query param
updateUrlParams({ search: 'letter a' });

// Read query param
const searchQuery = getParam('search') || '';
```

## Accessibility Considerations

- All braille cells must have descriptive `aria-label` or `title` attributes
- Search inputs need proper `aria-label="search braille characters"`
- Interactive braille cells should be keyboard accessible (not just onClick)
- High contrast mode affects all braille dot rendering

## Testing & Debugging

**No formal test suite** - manual testing workflow:
1. Run `npm run type-check` before committing
2. Test in both light/dark modes via settings
3. Verify URL bookmarking works (copy URL, open in new tab)
4. Check mobile responsiveness with hamburger menu

**Common issues:**
- JSON import errors → Check `resolveJsonModule: true` in tsconfig
- SVG not loading → Verify path starts with `/braille/` not `./braille/`
- Settings not persisting → Check localStorage key `'braille-toolbox-settings'`

## Don't Do This

❌ Modify `public/braille/braille-cell.svg` (master template)
❌ Add state to URL that doesn't need bookmarking
❌ Create duplicate data files - reuse existing JSON
❌ Mix dot pattern formats (use 6-digit strings consistently)
❌ Add external dependencies without checking if MUI/Tailwind can handle it

## Project Context

**Original codebase**: Migrated from vanilla JS (`public/scripts/braillewriter.js`, `composer.js`)
**Status**: In active development - some pages are placeholder components (see `App.tsx` routes)
**Target users**: Students learning braille, educators, braille readers seeking quick reference
