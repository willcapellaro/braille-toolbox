# Typing Tutor Game

A modern typing game built with PixiJS and TypeScript. Practice your typing skills by typing falling words before they reach the bottom of the screen!

## Features

- 🎮 Interactive typing gameplay
- 📊 Score tracking and level progression
- ❤️ Lives system
- ⏸️ Pause functionality
- 🎨 Smooth graphics with PixiJS
- 📱 Responsive design
- 🔤 Progressive difficulty

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The game will open in your browser at `http://localhost:3000`

### Building for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How to Play

1. **Typing**: Type the falling words as they appear on screen
2. **Word Selection**: Start typing any word to select it
3. **Correction**: Use Backspace to correct mistakes
4. **Pause**: Press Spacebar to pause/unpause the game
5. **Restart**: Press 'R' when game over to restart

## Game Mechanics

- **Score**: Earn points based on word length (10 points per character)
- **Lives**: Start with 3 lives, lose one when a word hits the bottom
- **Levels**: Progress through levels with increasing difficulty
- **Speed**: Words fall faster as levels increase
- **Spawn Rate**: More words appear as you advance

## Project Structure

```
src/
├── core/           # Core game logic
│   └── GameState.ts    # Game state management
├── scenes/         # Game scenes
│   └── GameScene.ts    # Main game scene
├── entities/       # Game entities
│   └── WordSprite.ts   # Word sprite class
├── ui/            # User interface
│   └── UIManager.ts    # UI management
└── main.ts        # Application entry point
```

## Technologies Used

- **PixiJS**: 2D graphics rendering
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.