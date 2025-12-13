import { Container, Graphics } from 'pixi.js';
import { Position } from './types';
import { GameColors, webColorToHex } from './colors';

export class Spotlight {
    public container: Container;
    private graphics: Graphics;
    private lightCone: Graphics;
    
    public x: number;
    public y: number;
    private targetX: number;
    private targetY: number;
    private radius: number;
    private baseRadius: number;
    private intensity: number;
    private rotationSpeed: number = 0.02;
    private isStationary: boolean = false;
    private isActiveState: boolean = true;
    
    // Boost properties
    private boostActive: boolean = false;
    private boostDuration: number = 2000; // 2 seconds
    private boostCooldown: number = 5000; // 5 seconds
    private lastBoostTime: number = 0;
    private boostStartTime: number = 0;

    constructor(x: number, y: number, radius: number) {
        this.container = new Container();
        this.graphics = new Graphics();
        this.lightCone = new Graphics();
        
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.intensity = 0.8;
        
        this.container.addChild(this.lightCone);
        this.container.addChild(this.graphics);
        
        this.draw();
    }

    private draw(): void {
        this.graphics.clear();
        this.lightCone.clear();
        
        // Draw spotlight base
        this.graphics.beginFill(webColorToHex(GameColors.spotlightBase));
        this.graphics.drawCircle(this.x, this.y, 20);
        this.graphics.endFill();
        
        // Only draw active elements if spotlight is active
        if (this.isActiveState) {
            // Draw spotlight beam direction indicator (only if not stationary)
            if (!this.isStationary) {
                this.graphics.lineStyle(3, webColorToHex(GameColors.spotlightBeamLine));
                this.graphics.moveTo(this.x, this.y);
                this.graphics.lineTo(this.targetX, this.targetY);
            }
            
            // Draw light cone
            const alpha = this.boostActive ? 0.4 : 0.2;
            const color = this.boostActive ? webColorToHex(GameColors.spotlightBoost) : webColorToHex(GameColors.spotlightBeam);
            
            this.lightCone.beginFill(color, alpha);
            this.lightCone.drawCircle(this.x, this.y, this.radius);
            this.lightCone.endFill();
            
            // Draw spotlight center
            this.graphics.beginFill(webColorToHex(GameColors.spotlightActive), this.intensity);
            this.graphics.drawCircle(this.x, this.y, 10);
            this.graphics.endFill();
        } else {
            // Draw inactive spotlight center
            this.graphics.beginFill(webColorToHex(GameColors.spotlightInactive), 0.3);
            this.graphics.drawCircle(this.x, this.y, 10);
            this.graphics.endFill();
        }
    }

    public setTarget(x: number, y: number): void {
        this.targetX = x;
        this.targetY = y;
    }

    public update(): void {
        // Only move if not stationary
        if (!this.isStationary) {
            // Smooth movement towards target
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
                const moveSpeed = 0.05;
                this.x += dx * moveSpeed;
                this.y += dy * moveSpeed;
            }
        }
        
        // Update boost state
        const now = Date.now();
        if (this.boostActive && now - this.boostStartTime > this.boostDuration) {
            this.deactivateBoost();
        }
        
        // Update radius based on boost
        if (this.boostActive) {
            this.radius = this.baseRadius * 1.5;
            this.intensity = 1.0;
        } else {
            this.radius = this.baseRadius;
            this.intensity = 0.8;
        }
        
        this.draw();
    }

    public activateBoost(): void {
        const now = Date.now();
        
        // Check if boost is on cooldown
        if (now - this.lastBoostTime < this.boostCooldown) {
            return;
        }
        
        this.boostActive = true;
        this.boostStartTime = now;
        this.lastBoostTime = now;
    }

    private deactivateBoost(): void {
        this.boostActive = false;
    }

    public isInmateCaught(inmate: { x: number; y: number }): boolean {
        // Only catch inmates if spotlight is active
        if (!this.isActiveState) {
            return false;
        }
        
        const dx = inmate.x - this.x;
        const dy = inmate.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= this.radius;
    }

    public setStationary(stationary: boolean): void {
        this.isStationary = stationary;
    }

    public setActive(active: boolean): void {
        this.isActiveState = active;
    }

    public isActive(): boolean {
        return this.isActiveState;
    }

    public getPosition(): Position {
        return { x: this.x, y: this.y };
    }

    public getRadius(): number {
        return this.radius;
    }

    public isBoostActive(): boolean {
        return this.boostActive;
    }

    public getBoostCooldownRemaining(): number {
        const now = Date.now();
        const remaining = this.boostCooldown - (now - this.lastBoostTime);
        return Math.max(0, remaining);
    }
    
    public increaseSize(multiplier: number): void {
        this.baseRadius *= multiplier;
        this.radius = this.boostActive ? this.baseRadius * 2 : this.baseRadius;
        this.draw();
    }
}