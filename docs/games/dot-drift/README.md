# Grid Racer

A grid-based racing game built with Pixi.js and TypeScript. Navigate around a track using directional commands.

## Features

- **Grid-based Movement**: Navigate on a 12x12 grid
- **Lap-based Racing**: Complete 4 laps around the track
- **Smooth Animation**: Animated player movement between grid cells
- **Time Tracking**: Track your completion time
- **Clean UI**: Simple and intuitive interface

## Controls

- **N**: Move North (up)
- **S**: Move South (down) 
- **E**: Move East (right)
- **W**: Move West (left)
- **Click START RACE**: Begin the race
- **Click PLAY AGAIN**: Restart after completion

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd braille-racer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── main.js              # Entry point
└── game/
    ├── Game.js          # Main game logic
    ├── Player.js        # Player car management
    ├── Track.js         # Track and obstacles
    ├── InputManager.js  # Keyboard input handling
    └── AudioFeedback.js # Audio feedback system
```

## Accessibility Features

- Screen reader announcements for game state
- Audio feedback for all actions
- High contrast visual design
- Keyboard-only gameplay
- Position and speed announcements

## Technologies Used

- **Pixi.js**: 2D rendering engine
- **Vite**: Build tool and development server
- **Web Audio API**: Audio feedback system

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test for accessibility
5. Submit a pull request

## Accessibility Guidelines

When contributing, please ensure:
- All interactive elements are keyboard accessible
- Audio feedback is provided for user actions
- Visual elements have sufficient contrast
- Screen reader compatibility is maintained