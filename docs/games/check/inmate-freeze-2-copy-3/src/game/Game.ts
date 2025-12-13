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
    private totalPrisonersDelivered: number = 0;
    
    // Battery system
    private maxBattery: number = 100;
    private currentBattery: number = 100;
    private baseChargeRate: number = 0.5; // Base charge per frame when no spotlights active
    private prisonerChargeBonus: number = 0.1; // Additional charge rate per delivered prisoner
    private singleSpotlightDrain: number = 0.3; // Energy drain per frame for one spotlight
    private multiSpotlightMultiplier: number = 1.5; // Additional drain multiplier for multiple spotlights

    // UI elements
    private scoreText: Text;
    private livesText: Text;
    private levelText: Text;
    private prisonersText: Text;
    private batteryContainer: Container;
    private batteryMeter: Graphics;
    private batteryText: Text;
    private healthContainer: Container;
    private healthMeter: Graphics;
    private healthText: Text;

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
            lives: 35,
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
        
        // Create battery meter at bottom of screen
        this.createBatteryMeter();
        
        // Create health meter at top of screen
        this.createHealthMeter();
    }

    private createBatteryMeter(): void {
        this.batteryContainer = new Container();
        
        // Battery background
        const batteryBg = new Graphics();
        batteryBg.beginFill(0x333333, 0.8);
        batteryBg.drawRoundedRect(0, 0, 200, 30, 5);
        batteryBg.endFill();
        
        // Battery border
        batteryBg.lineStyle(2, webColorToHex(GameColors.uiText));
        batteryBg.drawRoundedRect(0, 0, 200, 30, 5);
        
        // Battery positive terminal
        batteryBg.beginFill(webColorToHex(GameColors.uiText));
        batteryBg.drawRoundedRect(200, 8, 8, 14, 2);
        batteryBg.endFill();
        
        this.batteryContainer.addChild(batteryBg);
        
        // Battery meter (energy level)
        this.batteryMeter = new Graphics();
        this.batteryContainer.addChild(this.batteryMeter);
        
        // Battery text
        this.batteryText = new Text('BATTERY: 100%', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: webColorToHex(GameColors.uiText),
            fontWeight: 'bold'
        });
        this.batteryText.x = 5;
        this.batteryText.y = 8;
        this.batteryContainer.addChild(this.batteryText);
        
        // Position battery meter at bottom center
        this.batteryContainer.x = (this.app.screen.width - 208) / 2;
        this.batteryContainer.y = this.app.screen.height - 50;
        
        this.app.stage.addChild(this.batteryContainer);
    }
    
    private createHealthMeter(): void {
        this.healthContainer = new Container();
        
        // Health background
        const healthBg = new Graphics();
        healthBg.beginFill(0x333333, 0.8);
        healthBg.drawRoundedRect(0, 0, 200, 30, 5);
        healthBg.endFill();
        
        // Health border
        healthBg.lineStyle(2, webColorToHex(GameColors.uiText));
        healthBg.drawRoundedRect(0, 0, 200, 30, 5);
        
        // Health icon (heart shape)
        healthBg.beginFill(webColorToHex(GameColors.inmateHealthBar));
        healthBg.drawRoundedRect(-25, 8, 8, 14, 2);
        healthBg.endFill();
        
        this.healthContainer.addChild(healthBg);
        
        // Health meter (lives remaining)
        this.healthMeter = new Graphics();
        this.healthContainer.addChild(this.healthMeter);
        
        // Health text
        this.healthText = new Text('HEALTH: 5/5', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: webColorToHex(GameColors.uiText),
            fontWeight: 'bold'
        });
        this.healthText.x = 5;
        this.healthText.y = 8;
        this.healthContainer.addChild(this.healthText);
        
        // Position health meter at top center
        this.healthContainer.x = (this.app.screen.width - 200) / 2;
        this.healthContainer.y = 20;
        
        this.app.stage.addChild(this.healthContainer);
    }
    
    private updateHealthMeter(): void {
        // Clear and redraw health meter
        this.healthMeter.clear();
        
        const maxLives = 5; // Assuming starting lives is the max
        const healthPercent = this.gameState.lives / maxLives;
        const meterWidth = 192; // Slightly smaller than background for padding
        const filledWidth = meterWidth * healthPercent;
        
        // Determine health color based on level
        let healthColor: number;
        if (healthPercent > 0.6) {
            healthColor = webColorToHex(GameColors.batteryHigh); // Green for good health
        } else if (healthPercent > 0.3) {
            healthColor = webColorToHex(GameColors.batteryMedium); // Yellow for medium health
        } else {
            healthColor = webColorToHex(GameColors.batteryLow); // Red for low health
        }
        
        // Draw filled portion
        if (filledWidth > 0) {
            this.healthMeter.beginFill(healthColor, 0.8);
            this.healthMeter.drawRoundedRect(4, 4, filledWidth, 22, 3);
            this.healthMeter.endFill();
        }
        
        // Update health text
        this.healthText.text = `HEALTH: ${this.gameState.lives}/5`;
    }
    
    private updateBatteryMeter(): void {
        // Clear and redraw battery meter
        this.batteryMeter.clear();
        
        const batteryPercent = this.currentBattery / this.maxBattery;
        const meterWidth = 192; // Slightly smaller than background for padding
        const filledWidth = meterWidth * batteryPercent;
        
        // Determine battery color based on level
        let batteryColor: number;
        if (batteryPercent > 0.6) {
            batteryColor = webColorToHex(GameColors.batteryHigh);
        } else if (batteryPercent > 0.3) {
            batteryColor = webColorToHex(GameColors.batteryMedium);
        } else {
            batteryColor = webColorToHex(GameColors.batteryLow);
        }
        
        // Draw filled portion
        if (filledWidth > 0) {
            this.batteryMeter.beginFill(batteryColor, 0.8);
            this.batteryMeter.drawRoundedRect(4, 4, filledWidth, 22, 3);
            this.batteryMeter.endFill();
        }
        
        // Update battery text
        const batteryPercentDisplay = Math.round(batteryPercent * 100);
        this.batteryText.text = `BATTERY: ${batteryPercentDisplay}%`;
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
        this.keysPressed.add(key);
        
        // Handle spotlight controls (keys 1-6)
        if (['1', '2', '3', '4', '5', '6'].includes(key)) {
            const spotlightIndex = parseInt(key) - 1;
            if (spotlightIndex >= 0 && spotlightIndex < this.spotlights.length) {
                const spotlight = this.spotlights[spotlightIndex];
                
                // Check if this spotlight wasn't already active
                const wasActive = spotlight.isActive();
                
                // Only allow activation if battery has power
                if (this.currentBattery > 0) {
                    spotlight.setActive(true);
                    
                    // If spotlight wasn't active before, notify policemen
                    if (!wasActive) {
                        const spotlightPos = spotlight.getPosition();
                        this.notifyPolicemenOfSpotlight(spotlightPos.x, spotlightPos.y);
                    }
                }
            }
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.key;
        this.keysPressed.delete(key);
        
        // Handle spotlight controls (keys 1-6)
        if (['1', '2', '3', '4', '5', '6'].includes(key)) {
            const spotlightIndex = parseInt(key) - 1;
            if (spotlightIndex >= 0 && spotlightIndex < this.spotlights.length) {
                this.spotlights[spotlightIndex].setActive(false);
            }
        }
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
            
            // Set opacity based on spotlight coverage
            if (inSpotlight) {
                inmate.setOpacity(1.0); // 100% opacity in spotlight
                inmate.freeze();
            } else {
                inmate.setOpacity(0.2); // 20% opacity outside spotlight
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

    private updateBattery(): void {
        // Count active spotlights
        let activeSpotlights = 0;
        for (const spotlight of this.spotlights) {
            if (spotlight.isActive()) {
                activeSpotlights++;
            }
        }
        
        if (activeSpotlights === 0) {
            // Charge battery when no spotlights are active
            const chargeRate = this.baseChargeRate + (this.totalPrisonersDelivered * this.prisonerChargeBonus);
            this.currentBattery = Math.min(this.maxBattery, this.currentBattery + chargeRate);
        } else {
            // Drain battery based on number of active spotlights
            let drainRate = this.singleSpotlightDrain;
            
            if (activeSpotlights > 1) {
                // Incremental drain for multiple spotlights
                const additionalDrain = (activeSpotlights - 1) * this.multiSpotlightMultiplier;
                drainRate = this.singleSpotlightDrain * (1 + additionalDrain);
            }
            
            this.currentBattery = Math.max(0, this.currentBattery - drainRate);
            
            // Turn off all spotlights if battery is dead
            if (this.currentBattery <= 0) {
                for (const spotlight of this.spotlights) {
                    spotlight.setActive(false);
                }
            }
        }
        
        this.updateBatteryMeter();
    }
    
    private notifyPolicemenOfSpotlight(x: number, y: number): void {
        // Find the nearest policeman not in chase mode
        let nearestPoliceman = null;
        let nearestDistance = Infinity;
        
        for (const policeman of this.policemen) {
            const pos = policeman.getPosition();
            const dx = pos.x - x;
            const dy = pos.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only consider policemen not in chase mode, not at capacity, and not returning to drop-off
            if (distance < nearestDistance && policeman.getCapturedCount() < 10 && !policeman.isAtDropOffZone()) {
                nearestPoliceman = policeman;
                nearestDistance = distance;
            }
        }
        
        // Only notify the nearest available policeman
        if (nearestPoliceman) {
            nearestPoliceman.notifySpotlightActivated(x, y);
        }
    }

    private updateUI(): void {
        this.scoreText.text = `Score: ${this.gameState.score}`;
        this.livesText.text = `Lives: ${this.gameState.lives}`;
        this.levelText.text = `Level: ${this.gameState.level}`;
        this.prisonersText.text = `Prisoners: ${this.totalPrisonersDelivered}`;
        this.updateHealthMeter();
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
                this.updateBattery();
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