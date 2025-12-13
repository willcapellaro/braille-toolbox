import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Spotlight } from './Spotlight';
import { Inmate } from './Inmate';
import { Policeman } from './Policeman';
import { GameState } from './types';
import { GameColors, webColorToHex } from './colors';

export class Game {
    private app: Application;
    private gameContainer: Container;
    private spotlights: Spotlight[] = [];
    private inmates: Inmate[] = [];
    private policemen: Policeman[] = [];
    private gameState: GameState;
    private keysPressed: Set<string> = new Set();
    private gameLoop: (() => void) | null = null;
    private totalPrisonersDelivered: number = 0; // Track delivered prisoners

    // UI elements
    private scoreText: Text;
    private livesText: Text;
    private levelText: Text;
    private prisonersText: Text;

    // Game timing
    private lastInmateSpawn: number = 0;
    private inmateSpawnInterval: number = 2000; // milliseconds

    constructor(app: Application) {
        this.app = app;
        this.gameContainer = new Container();
        this.app.stage.addChild(this.gameContainer);

        // Initialize game state
        this.gameState = {
            score: 0,
            lives: 5,
            level: 1,
            isPlaying: true,
            isPaused: false
        };

        this.setupUI();
        this.setupEventListeners();
        this.createSpotlights();
        this.createPolicemen();
        this.createDropOffZone();
    }

    private setupUI(): void {
        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: webColorToHex(GameColors.uiText),
            fontWeight: 'bold'
        });

        this.scoreText = new Text(`Score: ${this.gameState.score}`, textStyle);
        this.scoreText.x = 20;
        this.scoreText.y = 20;

        this.livesText = new Text(`Lives: ${this.gameState.lives}`, textStyle);
        this.livesText.x = 20;
        this.livesText.y = 50;

        this.levelText = new Text(`Level: ${this.gameState.level}`, textStyle);
        this.levelText.x = 20;
        this.levelText.y = 80;

        this.prisonersText = new Text(`Prisoners: ${this.totalPrisonersDelivered}`, textStyle);
        this.prisonersText.x = 20;
        this.prisonersText.y = 110;

        this.app.stage.addChild(this.scoreText);
        this.app.stage.addChild(this.livesText);
        this.app.stage.addChild(this.levelText);
        this.app.stage.addChild(this.prisonersText);
    }

    private setupEventListeners(): void {
        // Keyboard event listeners for spotlight control
        window.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        window.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }

    private createSpotlights(): void {
        // Create 6 stationary spotlights arranged in an arc from left to right with overlaps
        const spotlightPositions = [
            { x: 200, y: 300 },  // Spotlight 1 (key: 1)
            { x: 350, y: 250 },  // Spotlight 2 (key: 2)
            { x: 500, y: 200 },  // Spotlight 3 (key: 3)
            { x: 650, y: 200 },  // Spotlight 4 (key: 4)
            { x: 800, y: 250 },  // Spotlight 5 (key: 5)
            { x: 950, y: 300 }   // Spotlight 6 (key: 6)
        ];

        spotlightPositions.forEach((pos, index) => {
            const spotlight = new Spotlight(pos.x, pos.y, 120); // Slightly smaller radius for overlap
            spotlight.setStationary(true); // Make spotlight stationary
            spotlight.setActive(false); // Start inactive
            this.spotlights.push(spotlight);
            this.gameContainer.addChild(spotlight.container);
            
            // Add key label above each spotlight
            const keyLabel = new Text(`${index + 1}`, {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: webColorToHex(GameColors.keyLabels),
                fontWeight: 'bold'
            });
            keyLabel.x = pos.x - 8; // Center the text
            keyLabel.y = pos.y - 40; // Position above spotlight
            this.gameContainer.addChild(keyLabel);
        });
    }

    private createPolicemen(): void {
        // Create a few policemen starting in the middle of the screen
        const policeCount = 2 + Math.floor(Math.random() * 2); // 2-3 policemen
        
        for (let i = 0; i < policeCount; i++) {
            // Start positions spread across middle of screen
            const startX = 400 + (i * 200) + (Math.random() * 100 - 50); // Spread across middle
            const startY = 300 + (Math.random() * 100 - 50); // Middle height with some variance
            
            const policeman = new Policeman(this.gameContainer, startX, startY);
            this.policemen.push(policeman);
        }
    }

    private createDropOffZone(): void {
        // Create visual drop-off zone at middle right
        const dropOffBox = new Graphics();
        dropOffBox.beginFill(webColorToHex(GameColors.dropOffZone), 0.5);
        dropOffBox.drawRect(1020, 370, 60, 60); // 60x60 box at (1020,370)
        dropOffBox.endFill();
        
        // Add border
        dropOffBox.lineStyle(3, webColorToHex(GameColors.dropOffZone));
        dropOffBox.drawRect(1020, 370, 60, 60);
        
        this.gameContainer.addChild(dropOffBox);
        
        // Add label
        const dropOffLabel = new Text('DROP OFF', {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: webColorToHex(GameColors.dropOffZone),
            fontWeight: 'bold'
        });
        dropOffLabel.x = 1030;
        dropOffLabel.y = 340;
        this.gameContainer.addChild(dropOffLabel);
    }

    private spawnInmate(): void {
        const now = Date.now();
        if (now - this.lastInmateSpawn > this.inmateSpawnInterval) {
            const inmate = new Inmate();
            this.inmates.push(inmate);
            this.gameContainer.addChild(inmate.container);
            this.lastInmateSpawn = now;

            // Increase difficulty over time
            if (this.inmateSpawnInterval > 500) {
                this.inmateSpawnInterval *= 0.99;
            }
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.key;
        
        // Prevent default browser behavior for game keys
        if (['1', '2', '3', '4', '5', '6'].includes(key)) {
            event.preventDefault();
            this.keysPressed.add(key);
            this.updateSpotlightStates();
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.key;
        
        if (['1', '2', '3', '4', '5', '6'].includes(key)) {
            event.preventDefault();
            this.keysPressed.delete(key);
            this.updateSpotlightStates();
        }
    }

    private updateSpotlightStates(): void {
        // Update spotlight active states based on pressed keys
        const keyToIndex = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5 };
        
        this.spotlights.forEach((spotlight, index) => {
            const key = Object.keys(keyToIndex).find(k => keyToIndex[k as keyof typeof keyToIndex] === index);
            const isActive = key && this.keysPressed.has(key);
            spotlight.setActive(!!isActive);
        });
    }

    private updateSpotlights(): void {
        // Update all spotlights (no mouse tracking needed)
        this.spotlights.forEach(spotlight => {
            spotlight.update();
        });
    }

    private updateInmates(): void {
        for (let i = this.inmates.length - 1; i >= 0; i--) {
            const inmate = this.inmates[i];
            
            // Skip processing captured inmates (they're being handled by policemen)
            if (inmate.isCapturedState()) {
                inmate.update(); // Still update for visual effects
                continue;
            }
            
            // Check if inmate is in any active spotlight
            let inSpotlight = false;
            for (const spotlight of this.spotlights) {
                if (spotlight.isInmateCaught(inmate)) {
                    inSpotlight = true;
                    break;
                }
            }
            
            // Freeze or unfreeze based on spotlight coverage
            if (inSpotlight) {
                inmate.freeze();
            } else {
                inmate.unfreeze();
            }
            
            inmate.update();

            // Check if inmate reached the exit
            if (inmate.hasReachedExit()) {
                this.gameState.lives--;
                this.gameContainer.removeChild(inmate.container);
                this.inmates.splice(i, 1);
                this.updateUI();

                if (this.gameState.lives <= 0) {
                    this.gameOver();
                }
                continue;
            }

            // Check if inmate can be caught (must be frozen for required duration)
            if (inmate.canBeCaught()) {
                this.gameState.score += 10;
                this.gameContainer.removeChild(inmate.container);
                this.inmates.splice(i, 1);
                this.updateUI();
            }
        }
    }

    private updatePolicemen(): void {
        for (const policeman of this.policemen) {
            // Pass inmates array for vision system
            policeman.update(this.inmates);
            
            // Check for drop-offs
            const inmatesForRemoval = policeman.attemptDropOff();
            if (inmatesForRemoval.length > 0) {
                // Remove inmates from main game array and destroy their containers
                for (const inmate of inmatesForRemoval) {
                    const index = this.inmates.indexOf(inmate);
                    if (index > -1) {
                        this.inmates.splice(index, 1);
                    }
                    
                    // Clean up the container
                    if (inmate.container && inmate.container.parent) {
                        inmate.container.parent.removeChild(inmate.container);
                    }
                    inmate.container.destroy();
                }
                
                this.totalPrisonersDelivered += inmatesForRemoval.length;
                this.gameState.score += inmatesForRemoval.length * 20; // Bonus points for delivery
                this.updateUI();
            }
            
            // Check collisions with inmates
            for (let i = this.inmates.length - 1; i >= 0; i--) {
                const inmate = this.inmates[i];
                
                // Skip if inmate is already captured
                if (inmate.isCapturedState()) {
                    continue;
                }
                
                if (policeman.checkInmateCollision(inmate)) {
                    // Capture the inmate
                    policeman.captureInmate(inmate);
                    console.log(`Policeman captured inmate! Total captured: ${policeman.getCapturedCount()}`);
                    
                    // Add points for police capture
                    this.gameState.score += 5; // Less points than spotlight catch
                    this.updateUI();
                }
            }
        }
    }

    private updateUI(): void {
        this.scoreText.text = `Score: ${this.gameState.score}`;
        this.livesText.text = `Lives: ${this.gameState.lives}`;
        this.levelText.text = `Level: ${this.gameState.level}`;
        this.prisonersText.text = `Prisoners: ${this.totalPrisonersDelivered}`;
    }

    private gameOver(): void {
        this.gameState.isPlaying = false;
        console.log('Game Over! Final Score:', this.gameState.score);
        
        // Show game over screen
        const gameOverText = new Text('GAME OVER', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: webColorToHex(GameColors.gameOver),
            fontWeight: 'bold'
        });
        
        gameOverText.x = this.app.screen.width / 2 - gameOverText.width / 2;
        gameOverText.y = this.app.screen.height / 2 - gameOverText.height / 2;
        
        this.app.stage.addChild(gameOverText);
    }

    public start(): void {
        this.gameLoop = () => {
            if (this.gameState.isPlaying && !this.gameState.isPaused) {
                this.spawnInmate();
                this.updateSpotlights();
                this.updateInmates();
                this.updatePolicemen();
            }
            requestAnimationFrame(this.gameLoop!);
        };
        
        this.gameLoop();
    }

    public resize(): void {
        // Handle window resize
        const parent = this.app.view.parentNode as HTMLElement;
        if (parent) {
            this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
        }
    }

    public pause(): void {
        this.gameState.isPaused = !this.gameState.isPaused;
    }
}