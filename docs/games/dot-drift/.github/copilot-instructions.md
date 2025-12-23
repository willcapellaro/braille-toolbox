# Grid Racer (Dot Drift) - AI Agent Instructions

An accessible grid-based racing game with **dual input systems** (braille chord input + arrow keys), built with Pixi.js and TypeScript for the Braille Toolbox project.

## Architecture Overview

### Dual Codebase Structure
This project has **two separate game implementations** that are not integrated:

1. **Active Game** (`src/original-game.ts`, 3000+ lines)
   - Main implementation with full features
   - Uses braille chord input system (`ChordInput.ts`)
   - Grid-based track with lap counting and race logging
   - Extensive audio feedback and debug panels
   - Entry point: `src/main.js` → imports `original-game.ts`

2. **Prototype/Unused** (`src/game/*.js` folder)
   - Earlier prototype with 5 modular classes: `Game.js`, `Player.js`, `Track.js`, `InputManager.js`, `AudioFeedback.js`
   - Uses arrow key input only
   - Not imported by `main.js` - **this code is NOT running**
   - Keep for reference but modifications here won't affect the game

**CRITICAL**: Always edit `src/original-game.ts` for gameplay changes. The `src/game/` folder is legacy code.

### Core Systems in original-game.ts

**GridRacer Class** - Monolithic game class managing:
- Track generation with configurable grid dimensions (`gridVNumber`, `gridHNumber`, `trackVNumber`, `trackHNumber`, `trackThickness`)
- Player movement validation and animation with smooth transitions
- Lap counting system detecting flag line crossings
- Race logging with keystroke accuracy tracking
- Texture loading with fallback generation when PNGs unavailable

**ChordInput System** (`src/ChordInput.ts`)
- Maps braille-style key combinations to directions:
  ```typescript
  CHORD_MAPPINGS = {
    'north': ['s', 'f', 'j', 'k'],
    'east': ['f', 'k'],
    'west': ['d', 'j', 'k', 'l'],
    'south': ['j', 'd', 'j']
  }
  ```
- Debounced chord detection (configurable `RELEASE_DEBOUNCE_MS`)
- Dual event callbacks: `onChord()` for valid moves, `onInvalidInput()` for errors
- Invalid chords spawn visual "ouch" markers on last position

**Audio Feedback Architecture**
- Web Audio API for procedural sounds (no audio files)
- Toggle controls for 6 sound categories: movement, lap count, upcoming turn, correct turn, completing turn, perfect turn
- "Muzak" heartbeat background sound (toggle with backtick key)
- Sound parameters adapt to typing speed: faster typing = higher pitched sounds

**Visual Feedback**
- 17 PNG textures in `public/` with programmatic fallbacks
- Skid marks with opacity fade (10-frame lifecycle)
- Directional signposts at turns
- Start/finish flag sprite
- Central lap display during race
- "Ouch" dots for invalid inputs

## Development Workflows

### Running the Game
```bash
npm run dev          # Dev server on :3000, auto-opens browser
npm run build        # Production build to dist/
npm run preview      # Serve production build on :3000
```
Or use the VS Code task: `Dev Server` (already configured in tasks.json)

### Testing Changes
1. Edit `src/original-game.ts` for game logic
2. Edit `src/ChordInput.ts` for input system
3. Save triggers hot reload (Vite HMR)
4. Check browser console for detailed debug logs

**Texture Testing**: If PNGs fail to load, game automatically generates colored fallback squares. Test both modes.

### Debug Panel
Press toggle button (top-right panel) to access **real-time controls**:
- Grid dimensions: `squareSize`, `gridVNumber`, `gridHNumber`, `trackVNumber`, `trackHNumber`, `trackThickness`
- Audio toggles for all 6 sound categories
- Debounce timing adjustment (`debounceAmount` ms)
- Race log history viewer

Changes require calling `this.rebuildTrack()` to regenerate the grid.

## Critical Patterns

### Track Cell Types
```typescript
getCellType(x, y) // Returns: 'grass' | 'track' | 'interior' | 'corner' | 'start'
```
Track is a rectangular loop with:
- Interior area (grass inside track)
- Track cells (driveable)
- Corner indicators (track cells at turns)
- Start/finish line (subset of track cells in `flagLineSquares[]`)

### Movement Validation
```typescript
processMovement(newX, newY, direction) {
  // 1. Boundary check
  // 2. Track cell validation (must be 'track' or 'start')
  // 3. Turn indicator sounds (upcoming, correct, completing, perfect)
  // 4. Animate move with lerp over 300ms
  // 5. Check lap completion
  // 6. Update race statistics
}
```

### Lap Detection Logic
Crossing the flag line while moving **north** increments lap counter. Must cross fully (enter from south, exit to north). Race ends after `targetLaps` (default 4).

### Race Logging
```typescript
currentRaceRecord = {
  date, startTime, endTime, speed, 
  totalKeystrokes, correctKeystrokes, accuracy, status
}
```
Stored in `localStorage` as `gridRacerRaceLog`. Displayed in right panel accordion.

## Accessibility Features

- **Screen Reader Ready**: Game state announced to `aria-live` regions (not shown in code inspection, but noted in README)
- **Keyboard Only**: No mouse required for gameplay (arrow keys or chord input)
- **Audio Feedback**: All actions have corresponding sounds
- **High Contrast**: Bright colors against dark backgrounds
- **Configurable**: Debounce timing and sound toggles for different abilities

## Common Pitfalls

1. **Editing Wrong Files**: `src/game/*.js` files don't affect running game
2. **Texture Paths**: Reference `./public/*.png` from built dist, not `./assets/`
3. **Chord Timing**: Users often trigger invalid chords; handle gracefully with visual feedback
4. **Grid Rebuild**: Changing track dimensions requires `rebuildTrack()` call
5. **Audio Context**: Must resume after user interaction due to browser autoplay policies

## Key File Locations

- Main game: `src/original-game.ts` (single 3091-line class)
- Input system: `src/ChordInput.ts` (ChordInputSystem class)
- Entry point: `src/main.js` (async imports original-game.ts)
- Textures: `public/*.png` (17 images, all use nearest-neighbor scaling)
- Build config: `vite.config.js` (port 3000, sourcemaps enabled)
- Legacy prototype: `src/game/` (NOT USED - for reference only)

## Adding New Features

- **New chord**: Edit `CHORD_MAPPINGS` in `ChordInput.ts`, test with `onInvalidInput` callback first
- **New sound**: Add method to `GridRacer` using `this.audioContext`, follow existing patterns
- **New track element**: Modify `rebuildTrack()`, add texture loading in `loadTextures()`
- **New UI panel**: Follow `createRightPanel()` pattern with accordion sections

When in doubt, search `original-game.ts` for similar functionality—most game logic lives in this one file.