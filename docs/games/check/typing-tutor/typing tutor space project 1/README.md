# AstroType - Space Typing Adventure 🚀

A space-themed typing tutor game built with THREE.js that challenges players to type words appearing on a cosmic 3D orb. Features multiple training modes, user progress tracking, and progressive difficulty.

## Features

### 🌌 Immersive 3D Environment
- Beautiful cosmic setting with stars, nebula, and animated orb
- Real-time 3D animations and particle effects
- Responsive design that works on desktop and mobile devices

### 🎮 Multiple Training Modes
- **Stellar Basics** (A-J keys): Start with 3-letter words, progress to 4-letter words
- **Galaxy Explorer** (A-T keys): Focus on K-T keys with varied word lengths  
- **Cosmic Master** (A-Z keys): Full alphabet mastery with challenging vocabulary

### 👤 User Management
- Guest player system for quick start
- Progress tracking across all game modes
- Personal statistics (best WPM, games played, words typed)
- Automatic progression and level unlocking

### 🏆 Advanced Game Features
- **Smart Word Library**: Curated vocabulary for each skill level
- **Progressive Difficulty**: Unlock harder levels as you improve
- **Real-time Feedback**: Live typing validation with color coding
- **Pause/Resume**: Full game state management
- **WPM Tracking**: Monitor your typing speed improvement
- **Lives System**: Strategic challenge with limited mistakes

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd astrotype-typing-game
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The game will open automatically in your browser at `http://localhost:3000`.

### Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How to Play

### Getting Started
1. **Create Identity**: Click "Guest Player" to start immediately
2. **Select Training Mode**: Choose from three skill-based training programs
3. **Launch Mission**: Start your chosen training mode

### Training Modes Explained

#### 🌟 Stellar Basics (Beginner)
- **Focus**: A-J keys only
- **Progression**: Start with 3-letter words → unlock 4-letter words after 10 successful attempts
- **Perfect for**: New typists learning home row keys

#### 🚀 Galaxy Explorer (Intermediate) 
- **Focus**: A-T keys with emphasis on K-T letters
- **Words**: Mixed lengths with strategic vocabulary
- **Perfect for**: Building speed and accuracy on extended key range

#### 🌌 Cosmic Master (Advanced)
- **Focus**: Full A-Z alphabet
- **Words**: Complex vocabulary including space-themed and technical terms
- **Perfect for**: Advanced typists seeking challenge and speed

### Gameplay
1. **Type Words**: Type the words that appear on the cosmic orb
2. **Get Feedback**: Real-time color coding shows your accuracy
3. **Score Points**: Earn points for each correct word (longer words = more points)
4. **Track Progress**: Monitor your WPM and watch for level progression
5. **Manage Lives**: You have 3 lives - lose one for each incorrect word

## Game Controls

- **Typing**: Use your keyboard to type the displayed words
- **Backspace**: Correct typing mistakes
- **Enter**: Submit the current word (optional - words auto-submit when complete)

## Technology Stack

- **THREE.js**: 3D graphics and animation
- **Vite**: Build tool and development server
- **HTML5/CSS3**: Modern web standards
- **Vanilla JavaScript**: ES6 modules and modern syntax

## Project Structure

```
astrotype-typing-game/
├── src/
│   ├── main.js          # Application entry point and UI initialization
│   ├── game.js          # Core game logic and THREE.js scene management
│   ├── uiManager.js     # Screen navigation and user interface management  
│   └── userData.js      # Word library and user progress management
├── index.html           # Complete UI with all screens and game interface
├── style.css            # Modern styling with animations and responsive design
├── vite.config.js       # Vite build configuration
├── package.json         # Dependencies and build scripts
└── README.md           # This documentation
```

## Customization

### Adding New Words

Edit the word arrays in `src/userData.js` to add your own vocabulary:

```javascript
// Beginner words (A-J keys only)
this.beginnerWords = {
    length3: ['your', 'new', 'words'],
    length4: ['more', 'advanced', 'words']
};

// Intermediate words (A-T keys)
this.intermediateWords = [
    'intermediate', 'level', 'vocabulary'
];

// Advanced words (Full A-Z)
this.advancedWords = [
    'challenging', 'expert', 'level', 'words'
];
```

### Customizing Training Modes

Modify the game modes in `src/uiManager.js`:
- Change mode names and descriptions
- Adjust progression requirements
- Add new difficulty levels

### Styling

Modify `style.css` to customize colors, fonts, and animations to match your preferences.

### Game Mechanics

Adjust game difficulty by modifying these values in `src/game.js`:
- Starting lives: Change `this.lives = 3`
- Scoring multiplier: Modify the scoring calculation in `correctWord()`
- Animation speeds: Adjust the rotation and animation values in `animate()`

## Browser Support

This game works in all modern browsers that support:
- WebGL (for THREE.js)
- ES6 Modules
- CSS3 animations

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the package.json file for details.

---

**Enjoy your space typing adventure!** 🌌✨