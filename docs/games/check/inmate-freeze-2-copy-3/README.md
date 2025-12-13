# Spotlight Six

A tower defense-style game where players control spotlights to catch escaping inmates before they reach the exit.

## Game Features

- **Interactive Spotlight Control**: Move your mouse to control the closest spotlight
- **Inmate Pathfinding**: Inmates follow dynamic paths to escape
- **Spotlight Boost**: Click to temporarily increase spotlight range and brightness
- **Progressive Difficulty**: Game gets harder as you progress
- **Multiple Inmate Types**: Regular, Fast, Strong, and Sneaky inmates with different properties
- **Score System**: Earn points for catching inmates
- **Lives System**: Lose lives when inmates escape

## How to Play

1. **Movement**: Move your mouse to control the spotlight nearest to your cursor
2. **Boost**: Click anywhere to activate a spotlight boost (limited cooldown)
3. **Objective**: Catch escaping inmates before they reach the exit
4. **Strategy**: Position your mouse strategically to cover escape routes

## Controls

- **Mouse Movement**: Control spotlight direction
- **Left Click**: Activate spotlight boost
- **ESC**: Pause game (if implemented)

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Game

- **Development Mode**: 
  ```bash
  npm run dev
  ```
  This starts the development server with hot reload at `http://localhost:3000`

- **Build for Production**:
  ```bash
  npm run build
  ```
  This creates optimized files in the `dist` directory

- **Start Production Server**:
  ```bash
  npm start
  ```

## Technology Stack

- **TypeScript**: For type-safe game logic
- **PIXI.js**: 2D graphics rendering engine
- **Webpack**: Module bundling and development server
- **HTML5 Canvas**: Game rendering surface

## Project Structure

```
src/
├── game/
│   ├── Game.ts          # Main game class
│   ├── Spotlight.ts     # Spotlight control logic
│   ├── Inmate.ts        # Inmate behavior and pathfinding
│   └── types.ts         # TypeScript type definitions
├── styles/
│   └── main.css         # Game styling
└── index.ts             # Application entry point

public/
└── index.html           # HTML template

assets/                  # Game assets (images, sounds)
dist/                    # Built files
```

## Game Mechanics

### Spotlights
- Multiple spotlights positioned around the map
- Mouse controls the nearest spotlight
- Boost ability increases range and brightness temporarily
- Limited boost usage with cooldown period

### Inmates
- **Regular**: Standard speed and health
- **Fast**: Increased movement speed, reduced size
- **Strong**: Higher health, slower movement, larger size
- **Sneaky**: Moderate stats with unpredictable behavior

### Scoring
- +10 points for each inmate caught
- Bonus points for catching multiple inmates quickly
- Lives lost when inmates escape

## Future Enhancements

- [ ] Sound effects and background music
- [ ] Power-ups and special abilities
- [ ] Multiple levels with different layouts
- [ ] Leaderboard system
- [ ] Mobile touch controls
- [ ] Particle effects and animations
- [ ] Settings menu

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details