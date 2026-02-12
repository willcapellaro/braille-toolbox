# GRID-LOCK: The Game

Mobile-first Braille puzzle game teaching tactile pattern recognition through swipe mechanics.

## Quick Start

```bash
# Simple HTTP server
python3 -m http.server 8000
# or
npx serve
```

Open http://localhost:8000

## Project Structure

Single-file architecture - all code in [index.html](index.html):
- **No build system** - open directly in browser
- **No dependencies** - vanilla HTML/CSS/JS
- **415 lines total** - inline styles, markup, and game logic

## Core Mechanics

- **Swipe up from anywhere**: Moves dot grid upward to check your answer
- **Double-tap letter**: Alternative input to trigger check
- **Tap hexagonal dots**: Toggle individual Braille dots on/off
- **Match the pattern**: Configure dots to spell each letter in Braille
- **Cheat sheet**: View Braille alphabet reference (tracks peek count)

## Game Progression

`A → IT → FLY → GRID → CYBER → TRONIC → LOCKSMITH`

Letters "ghost" between words - matching dots persist with 20% noise.

## Development

Edit [index.html](index.html) and refresh browser. No build step needed.

**Testing**: Chrome on iPhone (vertical orientation)

**Debug tips**:
- DevTools console: `hexStates` shows current dot configuration
- Check `.hex-path.active` classes for visual state
- Monitor `.central-hub` transforms for swipe physics
