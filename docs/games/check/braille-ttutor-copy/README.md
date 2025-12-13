f# Braille Keyboard Prototype

This repository now contains a minimal prototype of a sticky, bottom-anchored Braille (Perkins-style) keyboard UI using the letter keys: `S D F` (left hand) and `J K L` (right hand). It supports full n-key rollover (multiple simultaneous key presses) and exposes visual and ARIA state for each virtual key.

## Current Features

- Sticky, centered keyboard bar that can slide off-screen (hide/show)
- Smooth pressed state animation with depth effect
- Debug panel to toggle visibility and auto-hide allowance
- Accurate simultaneous key tracking (no reliance on keyup order)
- Accessibility: ARIA `role=button`, `aria-pressed` states, live region announcing presses
- Resilient: resets all keys when window loses focus (prevents stuck state)
- Theme system: Dark, Light, and High Contrast (pure black/white) with localStorage persistence
- Integrated wide space bar between left and right hand clusters displaying current chord as a live Unicode Braille cell + textual description
- Four key label modes (Print / Braille / Morph / Blank) with persistence
 - Space bar chord display modes (Braille only / Braille + print / Braille + print long / Blank)
 - Per-key status system: outline + emoji + tooltip with severities (info, focus, success, warning, failure)

## Run / View

Simply open `index.html` in a modern browser, or use a lightweight static server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then navigate to `http://localhost:8080/`.

## File Overview

- `index.html` – Prototype markup (keyboard + debug controls)
- `css/style.css` – Visual design and motion rules
- `js/main.js` – Interaction, state management, accessibility logic
- `braille_typing_tutor.html` – Legacy file that now redirects to `index.html`

## Extending The Prototype

1. Mapping to Braille dots: Add a data structure in `js/main.js` linking each physical key to dot numbers (e.g. `s=3, d=2, f=1, j=4, k=5, l=6`).
2. Chord capture: When all keys are released (`activeKeys.size === 0` after a non-empty press), treat the previous set as a chord.
3. Visualization: Insert a small Braille cell renderer above the keyboard – either 6 absolutely positioned circles or a grid.
4. Persistence: Wrap logic into a class (e.g. `BrailleKeyboard`) exposing events: `onKeyDownSet`, `onKeyUpSet`, `onChord`.
 5. Enhance space bar: Use space release to trigger chord submission or translation.

## Accessibility Notes

The live region (`#braille-live`) announces current pressed keys or when all are released. Screen reader users can navigate into the keyboard; each circular key is a focusable button with a toggle state.

## Ideas / TODO (Future)

- Add tactile audio feedback (short click) for each press
- Theme switch (high contrast, light mode)
- Mobile touch support (multi-touch mapping)
- Configurable key layout for alternate physical mappings

## Theme & High Contrast

Use the Debug panel (top-right) single Theme menu:

Options:

- `Dark` (standard dark)
- `Dark Contrast` (pure black / white; pressed keys invert)
- `Light` (standard light)
- `Light Contrast` (pure white / black; pressed keys invert)

### Persistence Keys

```
brailleKeyboardThemeMode = 'dark' | 'dark-contrast' | 'light' | 'light-contrast'
```

Legacy keys (`brailleKeyboardTheme`, `brailleKeyboardHighContrast`, `brailleKeyboardHighContrastMode`) are auto-migrated on first load.

## Key Label Modes

Use the Debug panel's "Key Labels" select. Options:

1. Print letters only (`print`) – Shows the underlying QWERTY letters (`s d f j k l`).
2. Braille cells only (`braille`) – Replaces letters with static representative Braille symbols (one per key).
3. Print → Braille morph (`morph`) – On press, the print letter animates out while a Braille cell animates in; reverses on release.
4. Blank keys (`blank`) – Hides all labels (visual minimal mode); keys still announce via ARIA as they are pressed.

Persistence key:

```
brailleKeyboardKeyLabelMode = 'print' | 'braille' | 'morph' | 'blank'
```

Migration: If you previously used the old checkbox that toggled a `braille-anim` class, loading the page will migrate that state to `morph` mode automatically.

## Per-Key Status System

Each Braille key (`s d f j k l`) can display an independent status state composed of up to three layers:

1. Outline ring (colored, glows slightly)
2. Emoji badge (above the key)
3. Tooltip (message bubble above emoji)

Severities (with default emoji + color):

| Severity | Emoji | Color (semantic) |
|----------|-------|------------------|
| info     | ℹ️    | blue             |
| focus    | ⬇️    | purple           |
| success  | ✅    | green            |
| warning  | ⚠️    | orange           |
| failure  | ‼️    | red              |

### Debug Panel Controls

Use the "Key Status" box in the debug panel to:

- Type selection:
	- Feedback Ring: outline only (text field disabled)
	- Emoji: default severity emoji (text field disabled)
	- Emoji Passthrough: first character of Text field replaces emoji; remainder ignored
	- Tooltip: shows tooltip bubble (uses full Text)
- Optional "Include Feedback Ring" checkbox to add/remove outline while using any type
- Severity select (sets color + default emoji where applicable)
- Key select (`s d f j k l`)
- Text input meaning changes with Type (disabled where not used)
- Apply / Clear / Clear All behaviors unchanged besides new type logic

### Programmatic API (in-page)

You can access helper functions (attached in script scope):

```
setKeyStatus(key, severity, { emoji = true, outline = true, tooltip = '' });
clearKeyStatus(key);
clearAllKeyStatuses();
```

Example:

```
setKeyStatus('f', 'success', { tooltip: 'Great job!' });
```

If you omit `emoji` or `outline`, those layers won't appear. Tooltips fade in/out independently. The live region announces tooltip content when applied.

## Space Display Modes

Controls how the wide space bar (chord display) shows information. Use the Debug panel's "Space Display" select.

1. Braille cell (`braille`) – Shows only the Unicode Braille cell; description text hidden.
2. Braille & print (`braille-print`) – Cell plus short print form (letter or raw dots number string e.g. `134`).
3. Braille & print (long form) (`braille-print-long`) – Cell plus descriptive phrase (e.g. `Lowercase letter k` or `Dots 134`).
4. Blank (`blank`) – Hides the entire space-bar content (visual minimal mode) while retaining ARIA updates in the live region.

Persistence key:

```
brailleKeyboardSpaceDisplayMode = 'braille' | 'braille-print' | 'braille-print-long' | 'blank'
```

## License

MIT License
