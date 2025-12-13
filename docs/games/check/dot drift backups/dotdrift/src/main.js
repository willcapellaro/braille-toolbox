// Import the original Grid Racer game
console.log('Loading Grid Racer game...');

async function loadGame() {
  try {
    await import('./original-game.ts');
    console.log('Grid Racer game loaded successfully!');
  } catch (error) {
    console.error('Error loading game:', error);
  }
}

loadGame();