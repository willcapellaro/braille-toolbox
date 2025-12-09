# Braille Toolbox - Copilot Instructions

## Project Overview

**Braille Toolbox** is an educational web application that serves as a comprehensive braille reference for both learning and practical use. It provides interactive tools for encoding/decoding braille, learning braille patterns, and understanding UEB (Unified English Braille) standards.

## Architecture

### Core Components

1. **Educational Reference Pages** (`intro.html`, `quickref.html`)
   - Static content with extensive braille SVG assets in `/braille/` folder  
   - Pattern: Each braille character has a corresponding SVG (e.g., `dot1_a.svg`, `con_about.svg`)
   - Uses structured HTML lists with class `infostrip` for braille character displays

2. **Interactive Tools**
   - **Write in Braille** (`write.html`) - Text-to-braille converter with URL parameter sharing
   - **Dot Decoder** (`decode.html`) - Interactive 6-dot checkbox interface 
   - **Braillewriter Help** (`braillewriter.html`) - Chord keyboard simulator
   - **Slate & Stylus** (`slate.html`) - Reversed braille reference

3. **Braille Engine** (`braille.js`)
   - Core text-to-braille conversion using `braille(message)` function
   - Creates HTML elements with classes like `br br-${character}` for styling
   - Handles capitalization, numbers, contractions, and special characters

## Key Patterns & Conventions

### File Structure
- Main pages are in root directory
- JavaScript files: `braille.js` (root), `/scripts/` folder for page-specific code
- CSS: `/styles/` with modular stylesheets
- Assets: `/braille/` (SVGs), `/imgs/` (UI icons), `/fonts/` (custom braille fonts)

### Braille Data Architecture
- **SVG Assets**: Named by dot pattern + character (e.g., `dot145_d.svg`, `con_cannot.svg`)
- **JSON Configuration**: `dot-decoder-content-blank.json` maps 6-dot binary patterns to meanings
- **Binary Pattern Logic**: Dots 1-6 represented as 6-character binary strings (e.g., "100000" = dot 1)

### CSS Framework
- Bootstrap 4 base with custom overrides in `styles.css`
- Custom checkbox styling using braille fonts (`.myCheckbox` pattern)
- Responsive grid system using `.infostrip` classes
- CSS transforms for slate/stylus horizontal flip functionality

### JavaScript Patterns
- **URL Parameter Integration**: `write.html` uses URL params for sharing (`?fliptext=content`)
- **DOM Manipulation**: Direct `getElementById()` and `innerHTML` updates (no frameworks)
- **Event Handling**: Inline `onchange`, `onkeyup` attributes with validation functions
- **AJAX Data Loading**: `decode.html` loads JSON data dynamically for decoder functionality

### Accessibility Standards
- Screen reader support with `aria-label`, `alt` attributes on all braille SVGs
- Skip links (`skiplink` class) for keyboard navigation
- Semantic HTML structure with proper heading hierarchy

## Development Guidelines

### Adding Braille Characters
1. Create SVG asset in `/braille/` following naming convention
2. Update relevant JSON data structures if interactive
3. Add to appropriate HTML reference lists with proper alt text
4. Test with screen readers for accessibility

### Interactive Feature Development
- Use vanilla JavaScript (no frameworks) for consistency
- Implement URL parameter sharing for user content (`updateTextInUrl()` pattern)
- Include feedback modals using Bootstrap modal framework
- Follow checkbox/form patterns established in `decode.html`

### Styling New Components
- Use existing `.infostrip` grid classes for braille character displays
- Custom fonts: `MyWebFont` (braille), `Brailleblocks` (decorative)
- Color palette: Purple accent (`#b1d`), accessible contrast ratios
- Responsive breakpoints defined in modular CSS files

### Content Management
- Educational content organized alphabetically by braille letter/contraction
- Maintain UEB accuracy - reference authoritative braille standards
- Include both whole-word and partial-word contractions with clear context

## External Dependencies

- **Bootstrap 4.0.0** - UI framework and responsive layout
- **Google Fonts** - Typography (`Francois One`, `Merriweather`)
- **Font Awesome 6** - UI icons
- **Plausible Analytics** - Privacy-focused analytics
- **ShareThis** - Social sharing functionality

## Testing Considerations

- **Braille Accuracy**: Validate against UEB standards for all character mappings
- **Screen Reader Testing**: Ensure proper announcement of braille patterns and meanings  
- **Cross-browser Compatibility**: Test custom CSS transforms and font loading
- **Mobile Responsiveness**: Verify touch interaction with decoder checkboxes