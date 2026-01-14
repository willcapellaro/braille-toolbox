# Copilot Instructions for Braille Toolbox - ChompChain

## Project Context
This is a standalone web-based game "Braille Chew / ChompChain" built as a static site.
It focuses on Braille interaction mechanics where users learn braille patterns by "biting" letters out of words.

## Architecture & Code Structure
- **Static Site**: No build process. Runs directly in the browser.
- **Entry Point**: `index.html` contains the game engine, UI, and logic.
- **Game Content**: `game-data.js` contains the word chains (`CHAINS`), Braille mappings (`BRAILLE`), and configs.
- **Framework-Free**: Uses Vanilla JavaScript and DOM manipulation. No React, Vue, or bundlers.
- **UI Framework**: Tailwind CSS (via CDN) mixed with custom embedded CSS for complex animations (throat tunnel, physics).
- **State Management**: Simple global variables (`currentChain`, `currentWord`, `keysActive`) manage the game state.

## Core Mechanics
- **Word Chains**: Logic is driven by `CHAINS` array (word ladders).
- **Braille Input**: Keyboard keys `S D F J K L` map to Braille dots `1 2 3 4 5 6`.
- **Game Loop**:
  1. User presses keys to form a Braille character.
  2. `attemptBite()` checks if the character matches a letter in the current word.
  3. Valid match triggers animation (`performSwallow`), removing the letter.
  4. Progression to next word.

## Developer Workflow
- **No Build Step**: Do not run `npm install` or `npm build`. The project runs directly in the browser.
- **Testing**: Open `index.html` in a modern browser to test the application.
- **Debugging**: Use `console.log` and browser DevTools.
- **Editing**: When modifying UI, check both Tailwind classes and the `<style>` block.

## Key Conventions
- **Styling**: Prefer Tailwind for layout/spacing. Use custom CSS classes for game-specific visuals (e.g., `.throat-ring`, `.sponge`, `.tooth`).
- **Animations**: Use CSS transitions for UI state changes (`.pressed`) and `requestAnimationFrame` for physics (SVG saliva lines).
- **Code Style**: Functional procedural JS. Keep logic simple and readable within the script tag.

## External Dependencies
- **Tailwind CSS**: Loaded from `https://cdn.tailwindcss.com`.
- **Google Fonts**: 'Nunito' font family.
