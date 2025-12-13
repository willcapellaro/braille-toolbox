import { Container, Graphics, Text } from 'pixi.js';
import { Player } from './Player.js';
import { Track } from './Track.js';
import { InputManager } from './InputManager.js';
import { AudioFeedback } from './AudioFeedback.js';

export class Game {
    constructor(app) {
        this.app = app;
        this.gameContainer = new Container();
        this.player = null;
        this.track = null;
        this.inputManager = null;
        this.audioFeedback = null;
        
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.speed = 2;
        this.maxSpeed = 8;
        
        // UI elements
        this.scoreText = null;
        this.statusText = null;
        
        // Game loop
        this.lastTime = 0;
        this.gameTime = 0;
    }

    async init() {
        // Add game container to stage
        this.app.stage.addChild(this.gameContainer);

        // Initialize game systems
        this.inputManager = new InputManager();
        this.audioFeedback = new AudioFeedback();
        
        // Create track
        this.track = new Track(this.app.screen.width, this.app.screen.height);
        this.gameContainer.addChild(this.track.container);

        // Create player
        this.player = new Player(this.app.screen.width / 2, this.app.screen.height - 100);
        this.gameContainer.addChild(this.player.sprite);

        // Create UI
        this.createUI();

        // Set up event listeners
        this.setupEventListeners();

        console.log('Game initialized');
    }

    createUI() {
        // Score display
        this.scoreText = new Text({
            text: 'Score: 0',
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xFFFFFF,
                align: 'left'
            }
        });
        this.scoreText.x = 10;
        this.scoreText.y = 10;
        this.gameContainer.addChild(this.scoreText);

        // Status display
        this.statusText = new Text({
            text: 'Press SPACE to start',
            style: {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 0xFFFF00,
                align: 'center'
            }
        });
        this.statusText.x = this.app.screen.width / 2 - this.statusText.width / 2;
        this.statusText.y = this.app.screen.height / 2;
        this.gameContainer.addChild(this.statusText);
    }

    setupEventListeners() {
        // Keyboard input
        this.inputManager.onKeyDown('Space', () => {
            if (this.gameState === 'menu') {
                this.startGame();
            } else if (this.gameState === 'playing') {
                this.pauseGame();
            } else if (this.gameState === 'paused') {
                this.resumeGame();
            } else if (this.gameState === 'gameOver') {
                this.resetGame();
            }
        });

        this.inputManager.onKeyDown('KeyR', () => {
            if (this.gameState === 'gameOver') {
                this.resetGame();
            }
        });

        // Player movement
        this.inputManager.onKeyDown('ArrowLeft', () => {
            if (this.gameState === 'playing') {
                this.player.moveLeft();
                this.audioFeedback.playTurn();
            }
        });

        this.inputManager.onKeyDown('ArrowRight', () => {
            if (this.gameState === 'playing') {
                this.player.moveRight();
                this.audioFeedback.playTurn();
            }
        });

        this.inputManager.onKeyDown('ArrowUp', () => {
            if (this.gameState === 'playing') {
                this.player.accelerate();
                this.audioFeedback.playAccelerate();
            }
        });

        this.inputManager.onKeyDown('ArrowDown', () => {
            if (this.gameState === 'playing') {
                this.player.brake();
                this.audioFeedback.playBrake();
            }
        });
    }

    start() {
        // Start the game loop
        this.app.ticker.add(this.gameLoop, this);
        console.log('Game started');
    }

    gameLoop(deltaTime) {
        if (this.gameState !== 'playing') return;

        // Update game time
        this.gameTime += deltaTime;

        // Update game objects
        this.track.update(this.speed * deltaTime);
        this.player.update(deltaTime);

        // Check collisions
        this.checkCollisions();

        // Update score
        this.score += Math.floor(this.speed * deltaTime);
        this.scoreText.text = `Score: ${this.score}`;

        // Gradually increase speed
        if (this.speed < this.maxSpeed) {
            this.speed += 0.001 * deltaTime;
        }

        // Update accessibility info
        this.updateAccessibilityInfo();
    }

    checkCollisions() {
        // Check if player hit track boundaries
        if (this.player.x < 0 || this.player.x > this.app.screen.width) {
            this.gameOver();
        }

        // Check collision with track obstacles
        if (this.track.checkCollision(this.player.getBounds())) {
            this.gameOver();
        }
    }

    updateAccessibilityInfo() {
        const gameInfo = document.getElementById('game-info');
        if (gameInfo) {
            const position = Math.floor((this.player.x / this.app.screen.width) * 10);
            gameInfo.textContent = `Position: ${position}/10, Speed: ${Math.floor(this.speed)}, Score: ${this.score}`;
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.statusText.visible = false;
        this.audioFeedback.playStart();
        console.log('Game started');
    }

    pauseGame() {
        this.gameState = 'paused';
        this.statusText.text = 'PAUSED - Press SPACE to resume';
        this.statusText.visible = true;
        this.statusText.x = this.app.screen.width / 2 - this.statusText.width / 2;
    }

    resumeGame() {
        this.gameState = 'playing';
        this.statusText.visible = false;
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.statusText.text = `GAME OVER - Score: ${this.score} - Press R to restart`;
        this.statusText.visible = true;
        this.statusText.x = this.app.screen.width / 2 - this.statusText.width / 2;
        this.audioFeedback.playGameOver();
        console.log('Game Over - Score:', this.score);
    }

    resetGame() {
        this.gameState = 'menu';
        this.score = 0;
        this.speed = 2;
        this.gameTime = 0;
        
        // Reset player position
        this.player.reset(this.app.screen.width / 2, this.app.screen.height - 100);
        
        // Reset track
        this.track.reset();
        
        // Reset UI
        this.scoreText.text = 'Score: 0';
        this.statusText.text = 'Press SPACE to start';
        this.statusText.visible = true;
        this.statusText.x = this.app.screen.width / 2 - this.statusText.width / 2;
    }
}