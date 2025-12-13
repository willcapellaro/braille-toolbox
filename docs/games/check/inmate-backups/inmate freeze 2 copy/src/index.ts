import { Application } from 'pixi.js';
import { Game } from './game/Game';
import { GameColors, webColorToHex } from './game/colors';
import './styles/main.css';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) {
        console.error('Game container not found!');
        return;
    }

    // Create PIXI application
    const app = new Application({
        width: 1200,
        height: 800,
        backgroundColor: webColorToHex(GameColors.background),
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });

    // Add the canvas to the DOM
    gameContainer.appendChild(app.view as HTMLCanvasElement);

    // Create and start the game
    const game = new Game(app);
    game.start();

    // Handle window resize
    window.addEventListener('resize', () => {
        game.resize();
    });
});