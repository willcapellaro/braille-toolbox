import { Application } from 'pixi.js';
import { GameScene } from './scenes/GameScene';
import { GameState } from './core/GameState';

class Game {
  private app: Application;
  private gameState: GameState;
  private currentScene: GameScene | null = null;

  constructor() {
    this.app = new Application({
      width: 1200,
      height: 800,
      backgroundColor: 0x1e1e1e,
      antialias: true,
    });

    this.gameState = new GameState();
    this.init();
  }

  private async init(): Promise<void> {
    try {
      // Get the canvas element and append the PIXI app view
      const gameContainer = document.getElementById('game-container');
      
      if (gameContainer && this.app.view) {
        gameContainer.appendChild(this.app.view as HTMLCanvasElement);
      } else {
        console.error('Could not find game container or app view');
        return;
      }

      // Initialize the game scene
      this.currentScene = new GameScene(this.app, this.gameState);
      this.app.stage.addChild(this.currentScene);

      // Start the game loop
      this.app.ticker.add(() => {
        this.update();
      });
    } catch (error) {
      console.error('Failed to initialize game:', error);
      
      // Show error on screen
      const gameContainer = document.getElementById('game-container');
      if (gameContainer) {
        gameContainer.innerHTML = `
          <div style="color: red; font-family: monospace; padding: 20px; text-align: center;">
            <h2>Game Failed to Start</h2>
            <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
            <p>Check browser console for more details</p>
          </div>
        `;
      }
    }
  }

  private update(): void {
    if (this.currentScene) {
      this.currentScene.update(this.app.ticker.deltaTime);
    }
  }
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new Game();
  } catch (error) {
    console.error('Error creating game:', error);
    
    // Show error on screen
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      gameContainer.innerHTML = `
        <div style="color: red; font-family: monospace; padding: 20px; text-align: center;">
          <h2>Game Failed to Start</h2>
          <p>Error creating game: ${error instanceof Error ? error.message : String(error)}</p>
          <p>Check browser console for more details</p>
        </div>
      `;
    }
  }
});